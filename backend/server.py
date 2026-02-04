from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24 * 30  # 30 days

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# ==================== MODELS ====================

class UserRole:
    VENDEDOR = "vendedor"
    COMPRADOR = "comprador"
    MODERADOR = "moderador"

class SubscriptionStatus:
    ATIVA = "ativa"
    VENCIDA = "vencida"
    CANCELADA = "cancelada"

class VehicleStatus:
    PENDENTE = "pendente"
    APROVADO = "aprovado"
    REJEITADO = "rejeitado"

# User Models
class UserRegister(BaseModel):
    email: EmailStr
    senha: str
    nome: str
    telefone: str
    whatsapp: str
    role: str  # vendedor or comprador

class UserLogin(BaseModel):
    email: EmailStr
    senha: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    senha_hash: str
    nome: str
    telefone: str
    whatsapp: str
    role: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UserResponse(BaseModel):
    id: str
    email: str
    nome: str
    telefone: str
    whatsapp: str
    role: str

# Vehicle Models
class VehicleCreate(BaseModel):
    nome: str
    preco: float
    valor_fipe: Optional[float] = None
    preco_minimo: Optional[float] = None
    margem_sugerida: Optional[float] = None
    imagem_base64: str
    descricao: Optional[str] = ""

class Vehicle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nome: str
    preco: float
    valor_fipe: Optional[float] = None
    preco_minimo: Optional[float] = None
    margem_sugerida: Optional[float] = None
    imagem_base64: str
    descricao: str
    vendedor_id: str
    vendedor_nome: str
    vendedor_telefone: str
    vendedor_whatsapp: str
    vendedor_email: str
    status: str = VehicleStatus.PENDENTE
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class VehiclePublic(BaseModel):
    id: str
    nome: str
    preco: float
    valor_fipe: Optional[float] = None
    margem_sugerida: Optional[float] = None
    imagem_base64: str
    descricao: str
    status: str
    created_at: str

class VehicleDetailed(BaseModel):
    id: str
    nome: str
    preco: float
    imagem_base64: str
    descricao: str
    vendedor_nome: str
    vendedor_telefone: str
    vendedor_whatsapp: str
    vendedor_email: str
    status: str
    created_at: str

# Plan Models
class Plan(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nome: str
    preco: float
    limite_veiculos: int
    tem_negociador: bool
    duracao_dias: int = 30

# Subscription Models
class SubscriptionCreate(BaseModel):
    plano_id: str

class Subscription(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    comprador_id: str
    plano_id: str
    status: str = SubscriptionStatus.ATIVA
    data_inicio: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    data_vencimento: str
    payment_id: Optional[str] = None

class SubscriptionStatus(BaseModel):
    tem_assinatura: bool
    status: Optional[str] = None
    plano_nome: Optional[str] = None
    data_vencimento: Optional[str] = None

# ==================== UTILITIES ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_jwt_token(user_id: str, email: str, role: str) -> str:
    payload = {
        'user_id': user_id,
        'email': email,
        'role': role,
        'exp': datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_jwt_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")

# ==================== DEPENDENCIES ====================

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_jwt_token(token)
    user = await db.users.find_one({'id': payload['user_id']}, {'_id': 0, 'senha_hash': 0})
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user

def require_role(required_role: str):
    async def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user['role'] != required_role:
            raise HTTPException(status_code=403, detail="Acesso negado")
        return current_user
    return role_checker

async def check_active_subscription(current_user: dict = Depends(get_current_user)):
    if current_user['role'] != 'comprador':
        raise HTTPException(status_code=403, detail="Apenas compradores podem ter assinatura")
    
    subscription = await db.subscriptions.find_one(
        {'comprador_id': current_user['id'], 'status': 'ativa'},
        {'_id': 0}
    )
    
    if not subscription:
        raise HTTPException(status_code=403, detail="Assinatura inativa. Assine um plano para acessar.")
    
    # Check if expired
    vencimento = datetime.fromisoformat(subscription['data_vencimento'])
    if vencimento < datetime.now(timezone.utc):
        await db.subscriptions.update_one(
            {'id': subscription['id']},
            {'$set': {'status': 'vencida'}}
        )
        raise HTTPException(status_code=403, detail="Assinatura vencida. Renove seu plano.")
    
    return subscription

# ==================== ROUTES ====================

# Root
@api_router.get("/")
async def root():
    return {"message": "ViaAutoPro API"}

# ==================== AUTH ====================

@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    # Check if email exists
    existing = await db.users.find_one({'email': user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    # Validate role
    if user_data.role not in ['vendedor', 'comprador']:
        raise HTTPException(status_code=400, detail="Role inválido. Use 'vendedor' ou 'comprador'")
    
    # Create user
    user = User(
        email=user_data.email,
        senha_hash=hash_password(user_data.senha),
        nome=user_data.nome,
        telefone=user_data.telefone,
        whatsapp=user_data.whatsapp,
        role=user_data.role
    )
    
    await db.users.insert_one(user.model_dump())
    
    # Create token
    token = create_jwt_token(user.id, user.email, user.role)
    
    return {
        'token': token,
        'user': UserResponse(**user.model_dump())
    }

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({'email': credentials.email}, {'_id': 0})
    if not user or not verify_password(credentials.senha, user['senha_hash']):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    
    token = create_jwt_token(user['id'], user['email'], user['role'])
    
    return {
        'token': token,
        'user': UserResponse(**user)
    }

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(**current_user)

# ==================== VEHICLES ====================

@api_router.post("/veiculos")
async def create_vehicle(vehicle_data: VehicleCreate, current_user: dict = Depends(require_role('vendedor'))):
    vehicle = Vehicle(
        **vehicle_data.model_dump(),
        vendedor_id=current_user['id'],
        vendedor_nome=current_user['nome'],
        vendedor_telefone=current_user['telefone'],
        vendedor_whatsapp=current_user['whatsapp'],
        vendedor_email=current_user['email']
    )
    
    await db.vehicles.insert_one(vehicle.model_dump())
    return vehicle

@api_router.get("/veiculos/meus")
async def get_my_vehicles(current_user: dict = Depends(require_role('vendedor'))):
    vehicles = await db.vehicles.find(
        {'vendedor_id': current_user['id']},
        {'_id': 0}
    ).to_list(1000)
    return vehicles

@api_router.get("/veiculos")
async def get_all_vehicles(current_user: dict = Depends(get_current_user)):
    # Only show approved vehicles to compradores
    if current_user['role'] == 'comprador':
        vehicles = await db.vehicles.find(
            {'status': VehicleStatus.APROVADO},
            {'_id': 0}
        ).to_list(1000)
        
        # Check subscription status
        subscription = await db.subscriptions.find_one(
            {'comprador_id': current_user['id'], 'status': 'ativa'},
            {'_id': 0}
        )
        
        has_active_subscription = False
        if subscription:
            vencimento = datetime.fromisoformat(subscription['data_vencimento'])
            if vencimento >= datetime.now(timezone.utc):
                has_active_subscription = True
        
        # If no active subscription, return public data only
        if not has_active_subscription:
            return {
                'vehicles': [VehiclePublic(**v).model_dump() for v in vehicles],
                'subscription_required': True
            }
        
        # Get subscription plan to check vehicle limit
        plan = await db.plans.find_one({'id': subscription['plano_id']}, {'_id': 0})
        limite = plan['limite_veiculos'] if plan else 0
        
        # Limit vehicles based on plan
        if limite > 0:
            vehicles = vehicles[:limite]
        
        return {
            'vehicles': vehicles,
            'subscription_required': False,
            'plano': plan['nome'] if plan else None
        }
    
    # Vendedor shouldn't access this
    raise HTTPException(status_code=403, detail="Vendedores não têm acesso ao catálogo geral")

@api_router.get("/veiculos/{vehicle_id}/detalhes")
async def get_vehicle_details(
    vehicle_id: str,
    current_user: dict = Depends(get_current_user),
    subscription: dict = Depends(check_active_subscription)
):
    vehicle = await db.vehicles.find_one(
        {'id': vehicle_id, 'status': VehicleStatus.APROVADO},
        {'_id': 0}
    )
    
    if not vehicle:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")
    
    return VehicleDetailed(**vehicle)

@api_router.patch("/veiculos/{vehicle_id}/aprovar")
async def approve_vehicle(vehicle_id: str, current_user: dict = Depends(require_role('moderador'))):
    result = await db.vehicles.update_one(
        {'id': vehicle_id},
        {'$set': {'status': VehicleStatus.APROVADO}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")
    
    return {'message': 'Veículo aprovado com sucesso'}

@api_router.patch("/veiculos/{vehicle_id}/rejeitar")
async def reject_vehicle(vehicle_id: str, current_user: dict = Depends(require_role('moderador'))):
    result = await db.vehicles.update_one(
        {'id': vehicle_id},
        {'$set': {'status': VehicleStatus.REJEITADO}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")
    
    return {'message': 'Veículo rejeitado'}

# ==================== PLANS ====================

@api_router.get("/planos")
async def get_plans():
    plans = await db.plans.find({}, {'_id': 0}).to_list(100)
    return plans

# ==================== SUBSCRIPTIONS ====================

@api_router.post("/assinatura/criar")
async def create_subscription(
    subscription_data: SubscriptionCreate,
    current_user: dict = Depends(require_role('comprador'))
):
    # Get plan
    plan = await db.plans.find_one({'id': subscription_data.plano_id}, {'_id': 0})
    if not plan:
        raise HTTPException(status_code=404, detail="Plano não encontrado")
    
    # Cancel existing active subscriptions
    await db.subscriptions.update_many(
        {'comprador_id': current_user['id'], 'status': 'ativa'},
        {'$set': {'status': 'cancelada'}}
    )
    
    # Create new subscription
    vencimento = datetime.now(timezone.utc) + timedelta(days=plan['duracao_dias'])
    
    subscription = Subscription(
        comprador_id=current_user['id'],
        plano_id=plan['id'],
        data_vencimento=vencimento.isoformat(),
        payment_id=f"MOCK_PAY_{uuid.uuid4().hex[:8]}"
    )
    
    await db.subscriptions.insert_one(subscription.model_dump())
    
    return {
        'message': 'Assinatura criada com sucesso (mock)',
        'subscription': subscription,
        'plan': plan
    }

@api_router.get("/assinatura/minha")
async def get_my_subscription(current_user: dict = Depends(require_role('comprador'))):
    subscription = await db.subscriptions.find_one(
        {'comprador_id': current_user['id']},
        {'_id': 0},
        sort=[('data_inicio', -1)]
    )
    
    if not subscription:
        return {
            'tem_assinatura': False,
            'status': None,
            'plano_nome': None,
            'data_vencimento': None
        }
    
    # Check if expired
    vencimento = datetime.fromisoformat(subscription['data_vencimento'])
    if vencimento < datetime.now(timezone.utc) and subscription['status'] == 'ativa':
        await db.subscriptions.update_one(
            {'id': subscription['id']},
            {'$set': {'status': 'vencida'}}
        )
        subscription['status'] = 'vencida'
    
    # Get plan details
    plan = await db.plans.find_one({'id': subscription['plano_id']}, {'_id': 0})
    
    return {
        'tem_assinatura': subscription['status'] == 'ativa',
        'status': subscription['status'],
        'plano_nome': plan['nome'] if plan else None,
        'data_vencimento': subscription['data_vencimento'],
        'limite_veiculos': plan['limite_veiculos'] if plan else 0
    }

# ==================== STARTUP ====================

@app.on_event("startup")
async def startup_event():
    # Initialize plans if not exists
    count = await db.plans.count_documents({})
    if count == 0:
        plans = [
            Plan(
                nome="Básico",
                preco=379.90,
                limite_veiculos=20,
                tem_negociador=False
            ),
            Plan(
                nome="Premium",
                preco=699.90,
                limite_veiculos=40,
                tem_negociador=False
            ),
            Plan(
                nome="VIP",
                preco=1099.00,
                limite_veiculos=999999,  # unlimited
                tem_negociador=True
            )
        ]
        for plan in plans:
            await db.plans.insert_one(plan.model_dump())
        logger.info("Planos inicializados")
    
    # Create demo vehicles (already approved)
    count = await db.vehicles.count_documents({})
    if count == 0:
        demo_vehicles = [
            {
                'id': str(uuid.uuid4()),
                'nome': 'Fiat Cronos 2020',
                'preco': 69900.00,
                'imagem_base64': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5GaWF0IENyb25vczwvdGV4dD48L3N2Zz4=',
                'descricao': 'Sedan completo, econômico',
                'vendedor_id': 'demo',
                'vendedor_nome': 'AutoShow Veículos',
                'vendedor_telefone': '(11) 98765-4321',
                'vendedor_whatsapp': '5511987654321',
                'vendedor_email': 'contato@autoshow.com',
                'status': VehicleStatus.APROVADO,
                'created_at': datetime.now(timezone.utc).isoformat()
            },
            {
                'id': str(uuid.uuid4()),
                'nome': 'Toyota Corolla 2018 XEi',
                'preco': 72000.00,
                'imagem_base64': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzk5OSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Db3JvbGxhIDIwMTg8L3RleHQ+PC9zdmc+',
                'descricao': 'Seminovo, revisado',
                'vendedor_id': 'demo',
                'vendedor_nome': 'Premium Motors',
                'vendedor_telefone': '(11) 91234-5678',
                'vendedor_whatsapp': '5511912345678',
                'vendedor_email': 'vendas@premiummotors.com',
                'status': VehicleStatus.APROVADO,
                'created_at': datetime.now(timezone.utc).isoformat()
            },
            {
                'id': str(uuid.uuid4()),
                'nome': 'Honda Civic 2019',
                'preco': 78000.00,
                'imagem_base64': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzg4OCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DaXZpYyAyMDE5PC90ZXh0Pjwvc3ZnPg==',
                'descricao': 'Impecável, único dono',
                'vendedor_id': 'demo',
                'vendedor_nome': 'VIP Automóveis',
                'vendedor_telefone': '(11) 99999-8888',
                'vendedor_whatsapp': '5511999998888',
                'vendedor_email': 'contato@vipauto.com',
                'status': VehicleStatus.APROVADO,
                'created_at': datetime.now(timezone.utc).isoformat()
            }
        ]
        for vehicle in demo_vehicles:
            await db.vehicles.insert_one(vehicle)
        logger.info("Veículos demo criados")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

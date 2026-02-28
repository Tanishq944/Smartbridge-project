from fastapi import APIRouter, status, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm, HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from app.models.user import UserCreate, UserLogin, User
from app.core.security import get_password_hash, verify_password, create_access_token, decode_access_token

router = APIRouter(prefix="/auth", tags=["auth"])
auth_scheme = HTTPBearer(auto_error=False)

# Temporary in-memory "database"
fake_users_db: dict[str, dict] = {}


@router.post("/register")
async def register(user_data: UserCreate):
    if user_data.email in fake_users_db:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user_data.password)
    user_id = len(fake_users_db) + 1

    fake_users_db[user_data.email] = {
        "id": user_id,
        "email": user_data.email,
        "hashed_password": hashed_password,
    }

    return {"message": "User registered successfully"}


@router.post("/login")
async def login(user_credentials: UserLogin):
    stored_user = fake_users_db.get(user_credentials.email)
    if not stored_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user_credentials.password, stored_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user_credentials.email})
    return {"access_token": access_token, "token_type": "bearer"}


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
) -> User:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )

    token = credentials.credentials
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )

    email = payload.get("sub")
    if email is None or email not in fake_users_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )

    user_data = fake_users_db[email]
    return User(id=user_data["id"], email=user_data["email"])


@router.get("/me", response_model=User)
async def read_current_user(
    current_user: User = Depends(get_current_user),
):
    return current_user

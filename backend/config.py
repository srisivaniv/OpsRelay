
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "opsrelay-dev-key")

    HINDSIGHT_BASE_URL = os.getenv(
        "HINDSIGHT_BASE_URL",
        "http://localhost:8888"
    )

    HINDSIGHT_API_KEY = os.getenv("HINDSIGHT_API_KEY")

    HINDSIGHT_BANK_ID = os.getenv(
        "HINDSIGHT_BANK_ID",
        "opsrelay-business"
    )
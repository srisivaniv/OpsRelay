
from hindsight_client import Hindsight
from config import Config

client = Hindsight(
    base_url=Config.HINDSIGHT_BASE_URL,
    api_key=Config.HINDSIGHT_API_KEY or None
)

bank = client.create_bank(
    bank_id=Config.HINDSIGHT_BANK_ID,
    name="OpsRelay Business Memory"
)

print("OpsRelay memory bank is ready!")
print("Bank ID:", bank.bank_id)

client.close()

from hindsight_client import Hindsight
from .config import Config


class HindsightService:

    def __init__(self):
        self.bank_id = Config.HINDSIGHT_BANK_ID

    def create_client(self):
        return Hindsight(
            base_url=Config.HINDSIGHT_BASE_URL,
            api_key=Config.HINDSIGHT_API_KEY or None
        )

    async def retain_report(self, report):

        content = f"""
Employee: {report['employee']}
Shift: {report['shift']}
Machine: {report['machine']}
Issue: {report['issue']}
Action Taken: {report['action_taken']}
Status: {report['status']}
Report ID: {report['report_id']}
"""

        client = self.create_client()

        try:
            return await client.aretain(
                bank_id=self.bank_id,
                content=content,
                metadata={
                    "report_id": report["report_id"],
                    "machine": report["machine"],
                    "shift": report["shift"]
                }
            )
        finally:
            await client.aclose()

    async def recall_memory(self, question):

        client = self.create_client()

        try:
            result = await client.arecall(
                bank_id=self.bank_id,
                query=question
            )

            return [memory.text for memory in result.results]
        finally:
            await client.aclose()

    async def reflect_memory(self, question):

        client = self.create_client()

        try:
            result = await client.areflect(
                bank_id=self.bank_id,
                query=question
            )

            return result.text
        finally:
            await client.aclose()

    async def identify_patterns(self, machine=None):

        question = (
            f"Identify recurring problems, their frequency "
            f"and previously successful solutions for {machine}."
            if machine else
            "Identify recurring machine problems across all "
            "shift reports and explain which solutions worked."
        )

        return await self.reflect_memory(question)


hindsight = HindsightService()

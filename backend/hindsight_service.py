
from hindsight_client import Hindsight
from config import Config


class HindsightService:

    def __init__(self):

        self.client = Hindsight(
            base_url=Config.HINDSIGHT_BASE_URL,
            api_key=Config.HINDSIGHT_API_KEY or None
        )

        self.bank_id = Config.HINDSIGHT_BANK_ID

    # RETAIN: Store shift reports
    def retain_report(self, report):

        content = f"""
        Employee: {report['employee']}
        Shift: {report['shift']}
        Machine: {report['machine']}
        Issue: {report['issue']}
        Action Taken: {report['action_taken']}
        Status: {report['status']}
        Report ID: {report['report_id']}
        """

        return self.client.retain(
            bank_id=self.bank_id,
            content=content,
            metadata={
                "report_id": report["report_id"],
                "machine": report["machine"],
                "shift": report["shift"]
            }
        )

    # RECALL: Search previous memories
    def recall_memory(self, question):

        result = self.client.recall(
            bank_id=self.bank_id,
            query=question
        )

        return [
            memory.text
            for memory in result.results
        ]

    # REFLECT: Generate contextual answers
    def reflect_memory(self, question):

        result = self.client.reflect(
            bank_id=self.bank_id,
            query=question
        )

        return result.text

    # Identify recurring issues
    def identify_patterns(self, machine=None):

        question = (
            f"Identify recurring problems, their frequency "
            f"and previously successful solutions for {machine}."
            if machine else
            "Identify recurring machine problems across all "
            "shift reports and explain which solutions worked."
        )

        return self.reflect_memory(question)


hindsight = HindsightService()
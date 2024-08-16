from griptape.structures import Agent
from griptape.tasks.toolkit_task import ToolkitTask
from griptape.tools import Calculator
from griptape.tasks import PromptTask, ToolTask
from dotenv import load_dotenv
import os

load_dotenv()


api_key = os.getenv('OPENAI_API_KEY')

class BaseAgent:
    @staticmethod
    def process_with_toolkit_agent(input_text, ruleset):
        agent = Agent(
            tools=[Calculator()],
            rulesets=[],
        )
        agent.add_task(ToolkitTask(
            "Calculate the result of {{args[0]}}",
            tools=[Calculator()]
        ))
        result = agent.run(input_text)
        return str(result.output_task.output)
    @staticmethod
    def process_with_prompt(input_text, creative_medium):
        agent = Agent()
        agent.add_task(PromptTask(
            "Write me a {{creative_medium}} about {{args[0]}}",
            context={
                "creative_medium": creative_medium
                }
            )
        )
        result = agent.run(input_text)
        return str(result.output_task.output)
    @classmethod
    def process_with_griptape(cls, data):
        task_type = data.get('task_type', 'toolkit')
        input_text = data.get('input', '')

        if task_type == 'toolkit':
            result = cls.process_with_toolkit_agent(input_text)
        elif task_type == 'prompt':
            creative_medium = data.get('creative_medium', 'haiku')
            result = cls.process_with_prompt(input_text, creative_medium)
        else:
            result = "Invalid task type specified"

        return {"result": result}

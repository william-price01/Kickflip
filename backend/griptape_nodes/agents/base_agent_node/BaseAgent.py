from griptape.config.openai_structure_config import OpenAiImageGenerationDriver
from griptape.engines.image.prompt_image_generation_engine import PromptImageGenerationEngine
from griptape.rules import ruleset
from griptape.structures import Agent
from griptape.tasks.toolkit_task import ToolkitTask
from griptape.tools import Calculator
from griptape.tasks import PromptImageGenerationTask, PromptTask, ToolTask
from griptape.rules import Rule
from dotenv import load_dotenv

import os

load_dotenv()


api_key = os.getenv('OPENAI_API_KEY')

class BaseAgent():
    @staticmethod
    def process_with_toolkit_agent(input_text):
        agent = Agent(
            tools=[Calculator()],
        )
        agent.add_task(ToolkitTask(
            "Calculate the result of {{args[0]}}",
            tools=[Calculator()]
        ))
        result = agent.run(input_text)
        return str(result.output_task.output)
    @staticmethod
    def process_with_prompt(input_text, ruleset_input):
        agent = Agent(
            rules=[Rule(ruleset_input)]
        )
        agent.add_task(PromptTask(
            input_text
        ))
        result = agent.run(input_text)
        return str(result.output_task.output)
    @staticmethod
    def process_image_prompt(image_prompt, ruleset_input):
        driver = OpenAiImageGenerationDriver(
            model='dall-e-3', api_type='openai', image_size=("1024x1024")
        )
        engine = PromptImageGenerationEngine(image_generation_driver=driver)
        image_task = PromptImageGenerationTask(
            image_prompt,
            image_generation_engine=engine
        )
        agent = Agent(
            rules=[Rule(ruleset_input)]
        )
        agent.add_task(image_task)
        result = agent.run(image_prompt)
        return result.output_task.output
    @classmethod
    def process_with_griptape(cls, data):
        task_type = data.get('task_type', 'toolkit')
        input_text = data.get('input', '')

        if task_type == 'toolkit':
            result = cls.process_with_toolkit_agent(input_text)
        elif task_type == 'prompt':
            result = cls.process_with_prompt(input_text, ruleset_input=data.get('ruleset', ''))
        else:
            result = "Invalid task type specified"

        return {"result": result}

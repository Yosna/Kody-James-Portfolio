import torch
import random
from transformers import AutoTokenizer, AutoModelForCausalLM
from models.base_model import BaseLanguageModel
from utils import decode_data


class TransformerLanguageModel(BaseLanguageModel):
    """
    A language model that integrates a transformer (DistilGPT2) for text generation.

    Architecture:
        - Uses Hugging Face's tokenizer and model for causal language modeling.
        - Generates text by sampling from the model's predictions given a prompt.
        - The prompt is a random sequence of tokens from the dataset.
    """

    def __init__(self, cfg_path: str) -> None:
        """Initialize the transformer language model and load pre-trained weights."""
        super().__init__(model_name="transformer", cfg_path=cfg_path)
        self.tokenizer = AutoTokenizer.from_pretrained("distilgpt2")
        self.model = AutoModelForCausalLM.from_pretrained("distilgpt2")

    def run(self, text: str, block_size: int, max_new_tokens: int) -> str:
        """Generate text using the pre-trained transformer model."""
        # Select a random prompt from the dataset
        start_idx = random.randint(0, len(text) - block_size)
        prompt = text[start_idx : start_idx + block_size]
        encoding = self.tokenizer(prompt, return_tensors="pt")
        input_ids = encoding.input_ids.to(self.model.device)
        attention_mask = torch.ones_like(input_ids)

        # Generate new text using the transformer model
        outputs = self.model.generate(
            input_ids,
            max_new_tokens=max_new_tokens,
            do_sample=True,
            pad_token_id=self.tokenizer.eos_token_id,
            attention_mask=attention_mask,
        )

        return self.tokenizer.decode(outputs[0], skip_special_tokens=True)

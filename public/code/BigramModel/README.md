# Bigram Language Model

This project implements a simple bigram language model using PyTorch. It predicts the next character in a sequence based on the current character, and uses an embedding table to learn character-to-character relationships.

## Features

- Character-level tokenization
- Vocabulary and index mapping
- Bigram prediction using `nn.Embedding`
- Cross-entropy loss for training
- Train/validate loop with overfitting detection and checkpoint saving
- Config-driven hyperparameter control
- Randomized seed character for varied generation
- Optional character generation after training

## Model Overview

This model is a simple neural network that learns transition probabilities between characters from text. It is ideal for understanding foundational NLP concepts like:

- Embedding layers
- Token encoding/decoding
- Loss computation
- Text generation via sampling

## Input

You provide a plaintext `.txt` file named `input.txt`. The model builds a vocabulary from the unique characters in the file and uses it to encode the training data.

## Training

The model is trained using the Adam optimizer with early stopping if validation loss fails to improve. Training and validation datasets are split 90/10.

Training behavior is configurable through a dictionary called `config`.

## Inference

After training, the model can generate new sequences one character at a time, beginning with a randomly selected seed character.

## Example Output

Starting from: 'T'

Generated text: Th her. t t t t thththththt...

## Configuration

Model behavior is controlled by a single `config` dictionary, which specifies:

```python
config = { # Starts at line 45
    "training": True,
    "batch_size": 8,
    "block_size": 4,
    "steps": 10000,
    "interval": 100,
    "lr": 1e-3,
    "max_new_tokens": 100,
}
```

## Dependencies

- Python 3.10+
- PyTorch

**Install dependencies with**:
```bash
pip install torch
```

## License

This project is licensed under the MIT License. See [LICENSE](https://github.com/Yosna/Bigram-Character-Predictor/blob/main/LICENSE) for details.

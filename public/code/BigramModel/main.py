import torch
import torch.nn as nn
import torch.nn.functional as F
import random
import os


class BigramLanguageModel(nn.Module):
    """
    A bigram language model that predicts the next character in a sequence.
    Uses an embedding table to try and learn character relationships.
    """

    def __init__(self, vocab_size: int) -> None:
        super().__init__()
        # Each character gets a vector of size vocab_size
        self.token_embedding_table = nn.Embedding(vocab_size, vocab_size)

    def forward(
        self, idx: torch.Tensor, targets: torch.Tensor | None = None
    ) -> tuple[torch.Tensor, torch.Tensor | None]:
        # idx and targets are both (B,T) tensor of integers
        # B = batch size, T = sequence length
        logits = self.token_embedding_table(idx)

        if targets is None:
            loss = None
        else:
            # Reshape for cross entropy: (B,T,C) -> (B*T,C)
            B, T, C = logits.shape
            logits = logits.view(B * T, C)
            targets = targets.view(B * T)
            loss = F.cross_entropy(logits, targets)

        return logits, loss


def main() -> None:
    text = read_file("input.txt")
    chars, vocab_size = build_vocab(text)
    stoi, itos = create_mappings(chars)
    data = encode_data(text, stoi)
    model = BigramLanguageModel(vocab_size)

    config = {
        "training": True,
        "batch_size": 8,
        "block_size": 4,
        "steps": 10000,
        "interval": 100,
        "lr": 1e-3,
        "max_new_tokens": 100,
    }

    run_model(model, data, stoi, itos, **config)


def read_file(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()
    return text


def build_vocab(text: str) -> tuple[list[str], int]:
    chars = sorted(set(text))
    vocab_size = len(chars)
    return chars, vocab_size


def create_mappings(chars: list[str]) -> tuple[dict[str, int], dict[int, str]]:
    stoi = {ch: i for i, ch in enumerate(chars)}
    itos = {i: ch for i, ch in enumerate(chars)}
    return stoi, itos


def encode_data(text: str, stoi: dict[str, int]) -> torch.Tensor:
    encoded = [stoi[c] for c in text]
    data = torch.tensor(encoded, dtype=torch.long)
    return data


def run_model(
    model: nn.Module,
    data: torch.Tensor,
    stoi: dict[str, int],
    itos: dict[int, str],
    training: bool,
    batch_size: int,
    block_size: int,
    steps: int,
    interval: int,
    lr: float,
    max_new_tokens: int,
) -> None:
    """
    Main function to either train the model or generate text.
    Randomizes the seed character for more varied results
    """
    if os.path.exists("model.pt"):
        model.load_state_dict(torch.load("model.pt"))

    if training:
        train(model, data, batch_size, block_size, steps, interval, lr)
    else:
        seed_char = random.choice(list(stoi.keys()))
        start_idx = stoi[seed_char]
        with torch.no_grad():
            generated_text = generate(model, start_idx, itos, max_new_tokens)
            print(generated_text)


def train(
    model: nn.Module,
    data: torch.Tensor,
    batch_size: int,
    block_size: int,
    steps: int,
    interval: int,
    lr: float,
) -> None:
    """
    Train the model using Adam optimization.
    Saves model checkpoints after training.
    """
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    train_data, val_data = split_data(data)
    best_loss = float("inf")
    wait = 0

    for step in range(steps):
        xb, yb = get_batch(train_data, batch_size, block_size)
        _, loss = model(xb, yb)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        overfit, best_loss, wait = validate_data(
            model,
            val_data,
            batch_size,
            block_size,
            step,
            loss,
            best_loss,
            wait,
            interval,
        )
        if overfit:
            break


def split_data(data: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
    split_idx = int(0.9 * len(data))
    train_data = data[:split_idx]
    val_data = data[split_idx:]
    return train_data, val_data


def validate_data(
    model: nn.Module,
    data: torch.Tensor,
    batch_size: int,
    block_size: int,
    step: int,
    loss: torch.Tensor,
    best_loss: float,
    wait: int,
    interval: int,
) -> tuple[bool, float, int]:
    """
    Validates model performance and stops if overfitting occurs.
    Returns overfit status, best loss, and wait count.
    """
    overfit = False
    if step % interval == 0:
        patience = 5  # Validation checks before stopping
        xb, yb = get_batch(data, batch_size, block_size)

        with torch.no_grad():
            _, val_loss = model(xb, yb)
            if val_loss < best_loss:
                # Save model if validation loss improves
                best_loss = val_loss
                wait = 0
                torch.save(model.state_dict(), "model.pt")
            else:
                wait += 1
                if wait >= patience:
                    print(f"Stopping due to overfitting.")
                    print(f"Step: {step}, Best Loss: {best_loss}")
                    # Restore best model before stopping
                    model.load_state_dict(torch.load("model.pt"))
                    overfit = True

            print(
                f"Step: {step:<10}"
                f"loss: {loss.item():<20.10f}"
                f"val_loss: {val_loss.item():<20.10f}"
            )
    return overfit, best_loss, wait


def get_batch(
    data: torch.Tensor, batch_size: int, block_size: int
) -> tuple[torch.Tensor, torch.Tensor]:
    """
    Generates a batch of data for training.
    Returns input (x) and target (y) sequences of length block_size.
    Sequences are stacked and targets are shifted by 1 position.
    Starting indices are randomized for each sequence in the batch.
    """
    ix = torch.randint(len(data) - block_size, (batch_size,))
    x = torch.stack([data[i : i + block_size] for i in ix])
    y = torch.stack([data[i + 1 : i + block_size + 1] for i in ix])
    return x, y


def generate(
    model: nn.Module,
    start_idx: int,
    itos: dict[int, str],
    max_new_tokens: int,
) -> str:
    """
    Generate new text by sampling from the model's predictions.
    Uses multinomial sampling to add randomness to the output.
    Starts from a seed index and generates max_new_tokens characters.
    """
    model.eval()
    idx = torch.tensor([[start_idx]], dtype=torch.long)
    generated = [start_idx]

    for _ in range(max_new_tokens):
        # Get predictions for next character
        logits, _ = model(idx)
        # Focus on the last time step
        logits = logits[:, -1, :]
        # Convert logits to probabilities
        probs = F.softmax(logits, dim=-1)
        # Sample from the probability distribution
        next_idx = torch.multinomial(probs, num_samples=1)
        generated.append(next_idx.item())

    decoded = "".join([itos[i] for i in generated])
    return decoded


if __name__ == "__main__":
    main()

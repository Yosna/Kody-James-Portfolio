import glob
import os
from unittest.mock import patch

import matplotlib
import matplotlib.pyplot as plt
import numpy as np

from models.registry import ModelRegistry as Model
from visualizer import plot_losses, save_plot, smooth

matplotlib.use("Agg")


class MockModel(Model.BaseLM):
    def __init__(self, tmp_path):
        self.name = "mock"
        self.interval = 1
        self.plot_dir = os.path.join(tmp_path, self.name)


def get_test_visualization_config():
    return {
        "save_plot": True,
        "show_plot": True,
        "smooth_loss": True,
        "smooth_val_loss": True,
        "weight": 0,
    }


def test_plot_losses(tmp_path):
    plt.close("all")
    losses = [5.0, 4.0, 3.0, 2.0, 1.0]
    val_losses = [1.0, 2.0, 3.0, 4.0, 5.0]
    steps = [i for i in range(len(losses))]

    with patch("visualizer.save_plot") as save, patch("visualizer.plt.show") as show:
        plot_losses(
            MockModel(tmp_path),
            losses,
            val_losses,
            step_divisor=1,
            visualization=get_test_visualization_config(),
        )

    axes = plt.gca()
    plt_losses = axes.lines[0]
    plt_val_losses = axes.lines[1]
    plt.close()
    save.assert_called_once()
    show.assert_called_once()
    assert axes.get_title() == "Loss over Steps for mock_model.py"
    assert axes.get_ylabel() == "Loss"
    assert axes.get_xlabel() == "Steps"
    assert np.array_equal(plt_losses.get_ydata(), losses)
    assert np.array_equal(plt_losses.get_xdata(), steps)
    assert np.array_equal(plt_val_losses.get_ydata(), val_losses)
    assert np.array_equal(plt_val_losses.get_xdata(), steps)


def test_smooth():
    losses = smooth([5, 4, 3, 2, 1], 0.9)
    expected = [5, 4.9, 4.71, 4.439, 4.0951]
    assert np.allclose(losses, expected)


def test_save_plot(tmp_path):
    model = MockModel(tmp_path)
    file_pattern = os.path.join(model.plot_dir, "mock_test_*.png")
    plt.plot([1, 2, 3])
    save_plot(model, plt, "test")
    assert os.path.exists(model.plot_dir)
    assert len(glob.glob(file_pattern)) == 1

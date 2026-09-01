from pathlib import Path
import torch
from torchvision import models, transforms
from PIL import Image
from torch import nn
from collections import defaultdict


# ============================================================
# PATHS
# ============================================================

ROOT = Path(__file__).resolve().parent

DATASET_DIR = (
    ROOT
    / "travolo dataset compresed"
    / "dataset  travolo"
    / "amer_fort_dataset"
)

MODEL_PATH = (
    ROOT
    / "AI layer"
    / "travolo_resnet18.pth"
)


# ============================================================
# DEVICE
# ============================================================

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("Device:", DEVICE)


# ============================================================
# LOAD MODEL
# ============================================================

checkpoint = torch.load(
    MODEL_PATH,
    map_location=DEVICE,
    weights_only=False
)

classes = checkpoint["classes"]

print("\nClasses:")
for c in classes:
    print("-", c)


model = models.resnet18(weights=None)

model.fc = nn.Sequential(
    nn.Dropout(0.35),
    nn.Linear(
        model.fc.in_features,
        len(classes)
    )
)

model.load_state_dict(
    checkpoint["model_state_dict"]
)

model.to(DEVICE)
model.eval()


# ============================================================
# PREPROCESSING
# ============================================================

preprocess = transforms.Compose([
    transforms.Resize((224, 224)),

    transforms.ToTensor(),

    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )
])


# ============================================================
# EVALUATION
# ============================================================

results = []

correct = 0
total = 0

confusion = defaultdict(lambda: defaultdict(int))


print("\n")
print("=" * 80)
print("TESTING ALL DATASET IMAGES")
print("=" * 80)


for class_name in classes:

    folder = DATASET_DIR / class_name

    if not folder.exists():
        print(f"\nWARNING: Missing folder: {class_name}")
        continue

    images = [
    p for p in folder.iterdir()
    if p.suffix.lower() in [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".jfif"
         ]
    ]

    print(f"\n[{class_name}] {len(images)} images")

    for image_path in sorted(images):

        try:

            image = Image.open(
                image_path
            ).convert("RGB")

            x = preprocess(
                image
            ).unsqueeze(0).to(DEVICE)

            with torch.no_grad():

                output = model(x)

                probabilities = torch.softmax(
                    output,
                    dim=1
                )[0]

                confidence, predicted_idx = torch.max(
                    probabilities,
                    dim=0
                )

            predicted = classes[
                predicted_idx.item()
            ]

            confidence_value = (
                confidence.item()
            )

            is_correct = (
                predicted == class_name
            )

            if is_correct:
                correct += 1

            total += 1

            confusion[
                class_name
            ][predicted] += 1

            results.append({
                "actual": class_name,
                "predicted": predicted,
                "confidence": confidence_value,
                "file": image_path.name
            })

            status = "OK  " if is_correct else "WRONG"

            print(
                f"{status} | "
                f"{image_path.name:<20} | "
                f"Predicted: {predicted:<15} | "
                f"Confidence: {confidence_value:.2%}"
            )

        except Exception as e:

            print(
                f"ERROR | "
                f"{image_path.name} | {e}"
            )


# ============================================================
# OVERALL ACCURACY
# ============================================================

print("\n")
print("=" * 80)
print("OVERALL RESULTS")
print("=" * 80)

accuracy = (
    correct / total
    if total > 0
    else 0
)

print(f"\nCorrect: {correct}/{total}")
print(f"Accuracy: {accuracy:.2%}")


# ============================================================
# PER-CLASS RESULTS
# ============================================================

print("\n")
print("=" * 80)
print("PER-CLASS RESULTS")
print("=" * 80)


for actual in classes:

    total_class = sum(
        confusion[actual].values()
    )

    correct_class = (
        confusion[actual][actual]
    )

    class_accuracy = (
        correct_class / total_class
        if total_class > 0
        else 0
    )

    print(
        f"\n{actual}"
    )

    print(
        f"  Correct: "
        f"{correct_class}/{total_class}"
    )

    print(
        f"  Accuracy: "
        f"{class_accuracy:.2%}"
    )

    print(
        "  Predictions:"
    )

    for predicted, count in confusion[
        actual
    ].items():

        print(
            f"    {predicted}: {count}"
        )


# ============================================================
# MOST UNCERTAIN IMAGES
# ============================================================

print("\n")
print("=" * 80)
print("LOW CONFIDENCE PREDICTIONS")
print("=" * 80)

low_confidence = sorted(
    results,
    key=lambda x: x["confidence"]
)

for result in low_confidence[:15]:

    print(
        f"{result['file']:<20} | "
        f"Actual: {result['actual']:<15} | "
        f"Predicted: {result['predicted']:<15} | "
        f"Confidence: {result['confidence']:.2%}"
    )


# ============================================================
# HIGH CONFIDENCE WRONG PREDICTIONS
# ============================================================

print("\n")
print("=" * 80)
print("HIGH-CONFIDENCE WRONG PREDICTIONS")
print("=" * 80)

wrong_predictions = [
    r for r in results
    if r["actual"] != r["predicted"]
]

wrong_predictions.sort(
    key=lambda x: x["confidence"],
    reverse=True
)

for result in wrong_predictions[:15]:

    print(
        f"{result['file']:<20} | "
        f"Actual: {result['actual']:<15} | "
        f"Predicted: {result['predicted']:<15} | "
        f"Confidence: {result['confidence']:.2%}"
    )


print("\nEvaluation complete.")
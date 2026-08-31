from pathlib import Path
import random
import copy

import torch
from torch import nn
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms, models
from torchvision.models import ResNet18_Weights


# ============================================================
# 1. PATHS
# ============================================================

ROOT = Path(__file__).resolve().parent

DATASET_DIR = (
    ROOT
    / "travolo dataset compresed"
    / "dataset  travolo"
    / "amer_fort_dataset"
)

OUTPUT_DIR = ROOT / "AI layer"
OUTPUT_DIR.mkdir(exist_ok=True)

MODEL_PATH = OUTPUT_DIR / "travolo_resnet18.pth"


# ============================================================
# 2. SETTINGS
# ============================================================

SEED = 42
BATCH_SIZE = 4

# Because the dataset is tiny, don't train for thousands of epochs.
HEAD_EPOCHS = 15
FINE_TUNE_EPOCHS = 20

LR_HEAD = 1e-3
LR_FINE = 1e-5

IMAGE_SIZE = 224

random.seed(SEED)
torch.manual_seed(SEED)


# ============================================================
# 3. DEVICE
# ============================================================

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("Device:", DEVICE)
print("Dataset:", DATASET_DIR)


# ============================================================
# 4. TRANSFORMS
# ============================================================

train_transform = transforms.Compose([
    transforms.Resize((256, 256)),

    transforms.RandomResizedCrop(
        IMAGE_SIZE,
        scale=(0.75, 1.0)
    ),

    transforms.RandomHorizontalFlip(
        p=0.5
    ),

    transforms.RandomRotation(
        degrees=10
    ),

    transforms.ColorJitter(
        brightness=0.25,
        contrast=0.25,
        saturation=0.15
    ),

    transforms.RandomPerspective(
        distortion_scale=0.15,
        p=0.3
    ),

    transforms.ToTensor(),

    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )
])


val_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),

    transforms.ToTensor(),

    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )
])


# ============================================================
# 5. LOAD DATASET
# ============================================================

if not DATASET_DIR.exists():
    raise FileNotFoundError(
        f"Dataset not found:\n{DATASET_DIR}"
    )


# We load the dataset twice so that the training and
# validation subsets can have different transforms.

full_dataset_train = datasets.ImageFolder(
    DATASET_DIR,
    transform=train_transform
)

full_dataset_val = datasets.ImageFolder(
    DATASET_DIR,
    transform=val_transform
)

classes = full_dataset_train.classes
num_classes = len(classes)

print("\nClasses:")
for i, name in enumerate(classes):
    print(i, "->", name)

print("\nTotal images:", len(full_dataset_train))


# ============================================================
# 6. TRAIN / VALIDATION SPLIT
# ============================================================

total_size = len(full_dataset_train)

# Keep around 20% for validation.
val_size = max(8, int(total_size * 0.2))
train_size = total_size - val_size

generator = torch.Generator().manual_seed(SEED)

indices = torch.randperm(
    total_size,
    generator=generator
).tolist()

train_indices = indices[:train_size]
val_indices = indices[train_size:]


class TransformSubset(torch.utils.data.Dataset):

    def __init__(self, dataset, indices):
        self.dataset = dataset
        self.indices = indices

    def __len__(self):
        return len(self.indices)

    def __getitem__(self, idx):
        real_idx = self.indices[idx]
        return self.dataset[real_idx]


train_dataset = TransformSubset(
    full_dataset_train,
    train_indices
)

val_dataset = TransformSubset(
    full_dataset_val,
    val_indices
)


train_loader = DataLoader(
    train_dataset,
    batch_size=BATCH_SIZE,
    shuffle=True,
    num_workers=0
)

val_loader = DataLoader(
    val_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False,
    num_workers=0
)


print("\nTraining images:", len(train_dataset))
print("Validation images:", len(val_dataset))


# ============================================================
# 7. LOAD IMAGENET-PRETRAINED RESNET18
# ============================================================

print("\nLoading ImageNet-pretrained ResNet18...")

weights = ResNet18_Weights.DEFAULT

model = models.resnet18(
    weights=weights
)

# Replace the final classification layer.

model.fc = nn.Sequential(
    nn.Dropout(0.35),
    nn.Linear(
        model.fc.in_features,
        num_classes
    )
)

model = model.to(DEVICE)


# ============================================================
# 8. LOSS
# ============================================================

criterion = nn.CrossEntropyLoss()


# ============================================================
# 9. TRAINING FUNCTION
# ============================================================

def evaluate(model, loader):

    model.eval()

    correct = 0
    total = 0
    running_loss = 0.0

    with torch.no_grad():

        for images, labels in loader:

            images = images.to(DEVICE)
            labels = labels.to(DEVICE)

            outputs = model(images)

            loss = criterion(
                outputs,
                labels
            )

            running_loss += (
                loss.item() * images.size(0)
            )

            predictions = outputs.argmax(
                dim=1
            )

            correct += (
                predictions == labels
            ).sum().item()

            total += labels.size(0)

    accuracy = correct / total
    loss = running_loss / total

    return loss, accuracy


def train_model(
    model,
    train_loader,
    val_loader,
    optimizer,
    epochs
):

    best_accuracy = 0.0
    best_weights = copy.deepcopy(
        model.state_dict()
    )

    for epoch in range(epochs):

        model.train()

        running_loss = 0.0
        correct = 0
        total = 0

        for images, labels in train_loader:

            images = images.to(DEVICE)
            labels = labels.to(DEVICE)

            optimizer.zero_grad()

            outputs = model(images)

            loss = criterion(
                outputs,
                labels
            )

            loss.backward()

            optimizer.step()

            running_loss += (
                loss.item() * images.size(0)
            )

            predictions = outputs.argmax(
                dim=1
            )

            correct += (
                predictions == labels
            ).sum().item()

            total += labels.size(0)

        train_loss = running_loss / total
        train_accuracy = correct / total

        val_loss, val_accuracy = evaluate(
            model,
            val_loader
        )

        print(
            f"Epoch {epoch + 1:02d}/{epochs} | "
            f"Train Loss: {train_loss:.4f} | "
            f"Train Acc: {train_accuracy:.2%} | "
            f"Val Loss: {val_loss:.4f} | "
            f"Val Acc: {val_accuracy:.2%}"
        )

        if val_accuracy > best_accuracy:

            best_accuracy = val_accuracy

            best_weights = copy.deepcopy(
                model.state_dict()
            )

    model.load_state_dict(best_weights)

    return model, best_accuracy


# ============================================================
# 10. PHASE 1
# Train only the new classification head
# ============================================================

print("\n==============================")
print("PHASE 1: TRAIN CLASSIFIER HEAD")
print("==============================")

for parameter in model.parameters():
    parameter.requires_grad = False

for parameter in model.fc.parameters():
    parameter.requires_grad = True


optimizer = torch.optim.AdamW(
    model.fc.parameters(),
    lr=LR_HEAD,
    weight_decay=1e-4
)


model, best_acc_1 = train_model(
    model,
    train_loader,
    val_loader,
    optimizer,
    HEAD_EPOCHS
)

print(
    f"\nBest Phase 1 validation accuracy: "
    f"{best_acc_1:.2%}"
)


# ============================================================
# 11. PHASE 2
# Fine-tune the later ResNet layers
# ============================================================

print("\n==============================")
print("PHASE 2: FINE-TUNE RESNET")
print("==============================")


# Freeze everything first.

for parameter in model.parameters():
    parameter.requires_grad = False


# Unfreeze layer4.

for parameter in model.layer4.parameters():
    parameter.requires_grad = True


# Keep classifier trainable.

for parameter in model.fc.parameters():
    parameter.requires_grad = True


trainable_parameters = [
    p for p in model.parameters()
    if p.requires_grad
]


optimizer = torch.optim.AdamW(
    trainable_parameters,
    lr=LR_FINE,
    weight_decay=1e-4
)


model, best_acc_2 = train_model(
    model,
    train_loader,
    val_loader,
    optimizer,
    FINE_TUNE_EPOCHS
)

print(
    f"\nBest Phase 2 validation accuracy: "
    f"{best_acc_2:.2%}"
)


# ============================================================
# 12. SAVE MODEL
# ============================================================

checkpoint = {
    "model_state_dict": model.state_dict(),
    "classes": classes,
    "architecture": "resnet18",
    "image_size": IMAGE_SIZE,
    "best_validation_accuracy": best_acc_2
}


torch.save(
    checkpoint,
    MODEL_PATH
)


print("\n================================")
print("MODEL TRAINING COMPLETE")
print("================================")

print("Model saved to:")
print(MODEL_PATH)

print(
    f"\nBest validation accuracy: "
    f"{best_acc_2:.2%}"
)

print("\nClasses:")

for name in classes:
    print("-", name)
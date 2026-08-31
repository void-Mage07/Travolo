from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
import io, json
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from PIL import Image
import torch
from torchvision import models, transforms
from torch import nn

ROOT=Path(__file__).resolve().parents[1]
CKPT=ROOT / 'AI layer' / 'travolo_resnet18.pth'
DEVICE=torch.device('cuda' if torch.cuda.is_available() else 'cpu')
checkpoint=torch.load(CKPT,map_location=DEVICE,weights_only=False)
classes=checkpoint['classes']
model=models.resnet18(weights=None)
model.fc=nn.Sequential(nn.Dropout(0.35),nn.Linear(model.fc.in_features,len(classes)))
model.load_state_dict(checkpoint['model_state_dict'])
model.to(DEVICE).eval()
preprocess=transforms.Compose([
    transforms.Resize((224,224)),transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])])

app=FastAPI(title='Travolo Amer Fort CV Verification API')
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/health')
def health():
    return {'status':'ok','device':str(DEVICE),'classes':classes}

@app.post('/verify')
async def verify(
    image: UploadFile = File(...),
    expected_location: str | None = Form(None)
):
    if not image.content_type or not image.content_type.startswith('image/'):
        raise HTTPException(400,'Please upload an image.')
    try:
        raw=await image.read()
        pil=Image.open(io.BytesIO(raw)).convert('RGB')
    except Exception:
        raise HTTPException(400,'Invalid image file.')
    x=preprocess(pil).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        probs=torch.softmax(model(x),dim=1)[0]
        conf,idx=torch.max(probs,0)
    predicted=classes[idx.item()]
    # Conservative demo threshold. Tune after collecting child-captured validation data.
    threshold=0.65
    verified=bool(conf.item()>=threshold and (expected_location is None or predicted==expected_location))
    return {
        'predicted_location':predicted,
        'confidence':round(float(conf.item()),4),
        'verified':verified,
        'expected_location':expected_location,
        'threshold':threshold,
        'note':'Prototype model only. Retrain with true ImageNet fine-tuning and child-captured validation images before real deployment.'
    }

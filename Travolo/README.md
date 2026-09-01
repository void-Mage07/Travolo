# Travolo

Travolo is an interactive Amer Fort exploration app built with React, Vite, and a Python FastAPI image-verification backend.

The app lets users explore an illustrated Amer Fort map, complete quiz and mini-game activities, earn XP and badges, and upload photos for location verification using a trained ResNet18 model.

## Features

- Interactive Amer Fort map
- Location stories and photo-verification quests
- Image verification backend powered by PyTorch
- Quiz activity with XP rewards
- Sheesh Mahal mirror-art mini game
- Dholak rhythm mini game
- Profile and badge screens

## Project Structure

```text
Travolo/
+-- AI layer/
|   +-- travolo_resnet18.pth
+-- backend/
|   +-- main.py
|   +-- requirements.txt
+-- public/
+-- src/
|   +-- App.jsx
|   +-- main.jsx
|   +-- Art.jsx
|   +-- Dholak.jsx
|   +-- Profile.jsx
|   +-- Quest.jsx
|   +-- Badges.jsx
|   +-- quiz.jsx
|   +-- assets/
+-- travolo dataset compresed/
+-- train.py
+-- evaluate_model.py
+-- package.json
+-- vite.config.js
```

## Requirements

Install these before running the project:

- Git
- Node.js
- Python 3.10 or newer

## Setup On A New Desktop

### 1. Download The Project

Clone the GitHub repository:

```powershell
git clone <your-github-repo-url>
cd Travolo
```

If you downloaded the project as a ZIP file, extract it first. Then open PowerShell inside the extracted `Travolo` folder.

### 2. Install Frontend Dependencies

```powershell
npm install
```

### 3. Create A Python Virtual Environment

```powershell
python -m venv .venv
```

Activate it:

```powershell
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, run:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Then try activating again:

```powershell
.\.venv\Scripts\Activate.ps1
```

### 4. Install Backend Dependencies

With the virtual environment activated:

```powershell
pip install -r backend\requirements.txt
```

### 5. Check The Model File

The backend needs this file:

```text
AI layer\travolo_resnet18.pth
```

If this file is missing, the backend will not start and photo verification will not work.

## Run The Full App

You need two terminals: one for the backend and one for the frontend.

### Terminal 1: Start The Backend

Open PowerShell in the `Travolo` folder:

```powershell
.\.venv\Scripts\Activate.ps1
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

To check that the backend is running, open this in your browser:

```text
http://127.0.0.1:8000/health
```

You should see a JSON response with `status: "ok"`.

### Terminal 2: Start The Frontend

Open another PowerShell terminal in the same `Travolo` folder:

```powershell
npm run dev
```

Open the URL shown in the terminal. It is usually:

```text
http://localhost:5173
```

## Important URLs

| Part | URL |
| --- | --- |
| Frontend UI | `http://localhost:5173` |
| Backend API | `http://127.0.0.1:8000` |
| Backend health check | `http://127.0.0.1:8000/health` |
| Image verification endpoint | `http://127.0.0.1:8000/verify` |

## How Photo Verification Works

1. Open the Travolo frontend.
2. Select a location on the Amer Fort map.
3. Click the verify button.
4. Upload a photo.
5. The frontend sends the image to the FastAPI backend.
6. The backend uses the trained ResNet18 model to predict the location.
7. If the prediction matches the selected location with enough confidence, the place is marked as verified.

## Useful Commands

Run the frontend development server:

```powershell
npm run dev
```

Build the frontend:

```powershell
npm run build
```

Preview the production build:

```powershell
npm run preview
```

Run ESLint:

```powershell
npm run lint
```

Run the backend:

```powershell
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Train the model again:

```powershell
python train.py
```

Evaluate the model:

```powershell
python evaluate_model.py
```

## Troubleshooting

### Frontend opens, but verification does not work

Make sure the backend is running:

```text
http://127.0.0.1:8000/health
```

Also check that the frontend is running on:

```text
http://localhost:5173
```

The backend currently allows requests from `localhost:5173` and `127.0.0.1:5173`.

### Backend does not start

Check that the model file exists:

```text
AI layer\travolo_resnet18.pth
```

Then confirm the backend packages are installed:

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
```

### `uvicorn` is not recognized

Activate the Python environment first:

```powershell
.\.venv\Scripts\Activate.ps1
```

Then run:

```powershell
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

### PowerShell does not allow `.venv` activation

Run:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Then activate the environment again:

```powershell
.\.venv\Scripts\Activate.ps1
```

### Dependencies fail to install

Try upgrading `pip`:

```powershell
python -m pip install --upgrade pip
```

Then install again:

```powershell
pip install -r backend\requirements.txt
```

## Notes

- Keep both the frontend and backend terminals open while using the full app.
- The image-verification backend is designed for local development.
- The trained model is required for verification.
- The dataset folder is used for model training and evaluation.


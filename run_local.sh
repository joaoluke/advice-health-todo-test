#!/bin/bash

echo "🚀 Iniciando Inicialização Local..."

echo "🐍 Preparando o Backend (Django)..."
cd backend

if [ ! -f "venv/bin/activate" ]; then
    echo "Recriando ambiente virtual para evitar conflitos..."
    rm -rf venv
    python3 -m venv venv
fi

echo "Ativando ambiente virtual..."
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate

python manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!

echo "✅ Backend rodando no PID $BACKEND_PID"

echo "⚛️ Preparando o Frontend (React)..."
cd ../frontend
npm install
npm run dev

trap "kill $BACKEND_PID" EXIT

#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "===> Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "===> Initializing & Seeding Remo North database..."
python -c "import sys, os; sys.path.insert(0, os.path.join(os.getcwd(), 'backend')); import seed; seed.seed_database()"

# Optional rebuild of frontend if npm is present
if command -v npm &> /dev/null && [ -d "frontend" ]; then
    echo "===> Verifying/Building React Vite frontend..."
    cd frontend
    npm install
    npm run build
    cd ..
fi

echo "===> Build completed successfully!"

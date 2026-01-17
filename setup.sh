#!/bin/bash

# PDF-Blender Setup Script
# This script sets up the project with virtual environment, installs dependencies, and starts the dev server

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project paths
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$PROJECT_DIR/venv"
ENV_FILE="$PROJECT_DIR/.env"
NODE_MODULES="$PROJECT_DIR/node_modules"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   PDF-Blender - Initial Setup Script   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Function to print status messages
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check for required tools
print_info "Checking for required tools..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi
print_status "Node.js found: $(node -v)"

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi
print_status "npm found: $(npm -v)"

echo ""

# Check if venv and node_modules exist
VENV_EXISTS=false
NODE_MODULES_EXISTS=false

if [ -d "$VENV_DIR" ]; then
    VENV_EXISTS=true
fi

if [ -d "$NODE_MODULES" ]; then
    NODE_MODULES_EXISTS=true
fi

# Ask for reinstall if files exist
if [ "$VENV_EXISTS" = true ] || [ "$NODE_MODULES_EXISTS" = true ]; then
    echo -e "${YELLOW}Existing installation detected:${NC}"
    [ "$VENV_EXISTS" = true ] && echo "  • Virtual environment found"
    [ "$NODE_MODULES_EXISTS" = true ] && echo "  • node_modules found"
    echo ""
    read -p "Do you want to reinstall from scratch? (y/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Cleaning up existing installation..."
        
        if [ "$VENV_EXISTS" = true ]; then
            print_info "Removing virtual environment..."
            rm -rf "$VENV_DIR"
        fi
        
        if [ "$NODE_MODULES_EXISTS" = true ]; then
            print_info "Removing node_modules..."
            rm -rf "$NODE_MODULES"
        fi
        
        print_status "Cleanup complete"
        echo ""
    else
        print_info "Skipping reinstall. Using existing installation."
    fi
fi

# Create .env file if it doesn't exist
if [ ! -f "$ENV_FILE" ]; then
    print_info "Creating .env file..."
    cat > "$ENV_FILE" << 'EOF'
# Database Configuration
# Update this with your actual PostgreSQL connection string
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pdf_blender

# Server Configuration
PORT=5000
NODE_ENV=development
EOF
    print_status ".env file created at $ENV_FILE"
    print_warning "Please update DATABASE_URL in .env if you have a database"
else
    print_status ".env file already exists"
fi

echo ""

# Install npm dependencies if not already installed or if we cleaned up
if [ ! -d "$NODE_MODULES" ]; then
    print_info "Installing npm dependencies..."
    npm install --prefix "$PROJECT_DIR" --prefer-offline --no-audit
    print_status "npm dependencies installed"
else
    print_status "npm dependencies already installed"
fi

echo ""

# Final checks
print_info "Verifying installation..."

# Check if tsx is installed
if npm ls tsx --prefix "$PROJECT_DIR" &> /dev/null; then
    print_status "tsx is available"
else
    print_error "tsx not found. Reinstalling dependencies..."
    npm install --prefix "$PROJECT_DIR" --prefer-offline --no-audit
fi

# Check if dotenv is installed
if npm ls dotenv --prefix "$PROJECT_DIR" &> /dev/null; then
    print_status "dotenv is available"
else
    print_error "dotenv not found. Installing..."
    npm install --save dotenv --prefix "$PROJECT_DIR" --prefer-offline --no-audit
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Setup Complete! Starting Dev Server  ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
print_info "Development server starting on port 5000..."
print_info "Open your browser at: http://localhost:5000"
print_info "Press Ctrl+C to stop the server"
echo ""

# Start the dev server
cd "$PROJECT_DIR"
npm run dev


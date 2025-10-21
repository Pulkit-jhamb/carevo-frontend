#!/bin/bash

# Vercel build script with Git LFS support
# This script ensures Git LFS files are properly fetched before building

set -e  # Exit on any error

echo "🔧 Setting up Git LFS for Vercel deployment..."

# Install Git LFS if not already installed
if ! command -v git-lfs &> /dev/null; then
    echo "📦 Installing Git LFS..."
    curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash
    apt-get install git-lfs
else
    echo "✅ Git LFS already installed"
fi

# Navigate to the repository root (parent directory)
cd ..

# Initialize Git LFS in the repository
echo "🔄 Initializing Git LFS..."
git lfs install

# Fetch all LFS files
echo "📥 Fetching Git LFS files..."
git lfs fetch --all

# Checkout all LFS files
echo "📂 Checking out Git LFS files..."
git lfs checkout

# Verify LFS files are properly checked out
echo "🔍 Verifying LFS files..."
git lfs ls-files

echo "✅ Git LFS setup complete!"

# Navigate back to frontend directory and run the build
echo "🏗️ Building the application..."
cd frontend
npm ci
npm run build

echo "🎉 Build completed successfully!"

#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================"
echo "   Docker Image Preparation Script"
echo "========================================"
echo -e "${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

echo "This script will pre-download Docker base images to speed up builds."
echo "This is a one-time setup that will save significant time on future builds."
echo

read -p "Do you want to continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Skipping Docker image preparation."
    exit 0
fi

echo
print_info "Starting Docker image preparation..."

# List of base images used in our Dockerfiles
base_images=(
    "eclipse-temurin:17-jdk"
    "eclipse-temurin:17-jre"
    "maven:3.9.6-eclipse-temurin-17"
    "postgres:14-alpine"
    "redis:7-alpine"
    "confluentinc/cp-zookeeper:7.4.0"
    "confluentinc/cp-kafka:7.4.0"
    "node:18-alpine"
)

echo "Pre-downloading base images..."
for image in "${base_images[@]}"; do
    echo "Downloading $image..."
    if docker pull "$image"; then
        print_status "$image downloaded successfully"
    else
        print_error "Failed to download $image"
        exit 1
    fi
done

echo
print_info "Creating a simple test build to warm up Docker cache..."
echo "Building a minimal test image..."

# Create a simple Dockerfile for testing
cat > test-build.Dockerfile << 'EOF'
FROM eclipse-temurin:17-jdk
RUN echo "Test build completed"
EOF

if docker build -f test-build.Dockerfile -t test-build .; then
    print_status "Test build completed successfully"
    # Clean up test image
    docker rmi test-build >/dev/null 2>&1
    rm -f test-build.Dockerfile
else
    print_error "Test build failed"
    rm -f test-build.Dockerfile
    exit 1
fi

echo
print_status "Docker image preparation completed!"
echo
echo "Benefits:"
echo "✓ Base images are now cached locally"
echo "✓ Future builds will be much faster"
echo "✓ No need to download images during builds"
echo
echo "You can now run the startup script and builds should be much faster!" 
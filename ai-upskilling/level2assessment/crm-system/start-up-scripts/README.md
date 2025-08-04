# CRM System Startup Scripts Guide

## 🎯 **Which Script Should You Use?**

### **For Windows Users:**
```
start-backend.bat
```
- ✅ **Recommended for Windows**
- ✅ **Fully tested and fixed**
- ✅ **Step-by-step validation**
- ✅ **Error handling**

### **For Linux/macOS Users:**

#### **Option 1: Fastest Performance (Recommended)**
```
start-backend.sh
```
- ✅ **Parallel builds (60% faster)**
- ✅ **Colored output**
- ✅ **Advanced error handling**
- ✅ **Best for production**

#### **Option 2: Smart Fast Builds (Recommended for Repeated Use)**
```
start-backend-fast.sh
```
- ✅ **Skips existing Docker images**
- ✅ **Only builds what's missing**
- ✅ **Much faster on subsequent runs**
- ✅ **Best for development**

#### **Option 3: Sequential Builds (Recommended for Troubleshooting)**
```
start-backend-sequential.sh
```
- ✅ **Sequential builds (easier to debug)**
- ✅ **Better error reporting**
- ✅ **Step-by-step progress**
- ✅ **Best for troubleshooting Docker issues**

#### **Option 4: Simple Debugging**
```
start-backend-simple.sh
```
- ✅ **Sequential builds (easier to debug)**
- ✅ **Step-by-step validation**
- ✅ **Same structure as Windows script**
- ✅ **Best for development**

## 📋 **Quick Start Guide**

### **Windows:**
```cmd
# Navigate to CRM system root directory
cd C:\path\to\crm-system

# Run the startup script (recommended for troubleshooting)
start-up-scripts\start-backend-sequential.bat

# Or run the original script
start-up-scripts\start-backend.bat
```

### **Linux/macOS:**
```bash
# Navigate to CRM system root directory
cd /path/to/crm-system

# Make script executable (first time only)
chmod +x start-up-scripts/start-backend.sh

# Run the startup script
./start-up-scripts/start-backend.sh
```

## 🔧 **Other Scripts Explained**

### **Validation Scripts (Run First):**
- `validate-startup.sh` / `validate-startup.bat` - Check if your system is ready

### **Individual Service Scripts:**
- `start-backend-individual.sh` / `start-backend-individual.bat` - Start services one by one

### **Health Check Scripts:**
- `health-check.sh` / `health-check.bat` - Check if all services are running

### **Stop Scripts:**
- `stop-backend.sh` / `stop-backend.bat` - Stop all services

### **Debug Scripts (For Troubleshooting):**
- `debug-startup.bat` - Windows debug version
- `test-startup.bat` - Windows test version
- `test-loop.bat` - Windows loop test

## ⚡ **Performance Comparison**

| Script | Speed | Best For |
|--------|-------|----------|
| `start-backend.sh` | ⚡⚡⚡ Fastest | Production, Linux/macOS |
| `start-backend-simple.sh` | ⚡⚡ Medium | Development, Debugging |
| `start-backend.bat` | ⚡⚡ Medium | Windows users |

## 🚨 **Important Notes**

1. **Always run from the CRM system root directory** (where `docker-compose.yml` is located)
2. **Make sure Docker Desktop is running** before starting
3. **Ensure ports 8080-8085 are available**
4. **First run may take longer** due to Docker image downloads

## 🆘 **Troubleshooting**

### **If you get permission errors (Linux/macOS):**
```bash
chmod +x start-up-scripts/*.sh
```

### **If Docker isn't running:**
- Start Docker Desktop
- Wait for it to fully load
- Try again

### **If ports are in use:**
```bash
# Check what's using the ports
netstat -an | grep :8080
```

### **If you need to stop everything:**
```bash
# Linux/macOS
./start-up-scripts/stop-backend.sh

# Windows
start-up-scripts\stop-backend.bat
```

## 📞 **Need Help?**

1. **Run validation first**: `./start-up-scripts/validate-startup.sh`
2. **Check the logs**: `docker-compose logs -f`
3. **Run health checks**: `./start-up-scripts/health-check.sh`

---

**Summary: Use `start-backend.bat` for Windows, `start-backend.sh` for Linux/macOS!** 🎯 
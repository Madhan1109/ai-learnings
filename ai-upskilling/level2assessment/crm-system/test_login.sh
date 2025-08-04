#!/bin/bash
curl -X POST http://auth-service:8084/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' 
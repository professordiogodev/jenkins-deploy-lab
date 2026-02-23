#!/bin/bash
set -e

APP_SERVER=$1
SSH_KEY=$2

echo "🚀 Deploying to ${APP_SERVER}..."

# Copy application files to the server
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no \
  package.json app.js "$APP_SERVER":/opt/app/

# Run deployment commands on the remote server
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$APP_SERVER" << 'EOF'
  cd /opt/app
  npm install --production
  pm2 delete app 2>/dev/null || true
  APP_VERSION=$(node -p "require('./package.json').version") pm2 start app.js --name app
  pm2 save

  # Wait and verify
  sleep 3
  if curl -s http://localhost:3000/health | grep -q "healthy"; then
    echo "✅ Deployment successful! App is healthy."
  else
    echo "❌ Deployment failed! Health check did not pass."
    exit 1
  fi
EOF
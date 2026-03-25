#!/bin/bash

# Check if domain is provided
if [ -z "$1" ]; then
    echo "Usage: ./setup-ssl.sh <your-duckdns-domain>"
    echo "Example: ./setup-ssl.sh codeczero-test.duckdns.org"
    exit 1
fi

DOMAIN=$1
EMAIL="ankitmahardev@gmail.com"

echo "🚀 Starting SSL Setup for $DOMAIN..."

# 1. Pull latest config
git pull

# 2. Start services (Nginx must be running for the challenge)
sudo docker-compose up -d

# 3. Request Certificate
echo "🔐 Requesting certificate from Let's Encrypt..."
sudo docker-compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d $DOMAIN -m $EMAIL --agree-tos --no-eff-email

# 4. Uncomment SSL in nginx.conf if certificate exists
if [ -d "./certbot/conf/live/$DOMAIN" ]; then
    echo "📜 Certificate found! Activating SSL in nginx.conf..."
    # This sed command removes the '#' from lines 52 to 77
    sed -i '52,77s/^    # //g' nginx.conf
    
    echo "🔄 Reloading Nginx with SSL enabled..."
    sudo docker-compose restart nginx
else
    echo "❌ Certificate generation failed. Please check logs and firewall (Port 80)."
    exit 1
fi

echo "✅ DONE! Your backend is now at https://$DOMAIN"
echo "✅ WSS (Secure WebSockets) is now active!"

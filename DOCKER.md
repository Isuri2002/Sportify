# Sportify Docker Setup

## Prerequisites

- Docker installed on your system
- Docker Compose installed

## Quick Start

### Using Docker Compose (Recommended)

1. **Update the local IP address** in `docker-compose.yml`:

   ```yaml
   REACT_NATIVE_PACKAGER_HOSTNAME=YOUR_LOCAL_IP
   ```

   Find your local IP:

   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`

2. **Build and run**:

   ```bash
   docker-compose up --build
   ```

3. **Access the app**:
   - Open Expo DevTools: http://localhost:19002
   - Scan QR code with Expo Go app on your phone
   - Or press `w` to open in web browser

### Using Docker (Manual)

1. **Build the image**:

   ```bash
   docker build -t sportify-app .
   ```

2. **Run the container**:
   ```bash
   docker run -p 8081:8081 -p 19000:19000 -p 19001:19001 -p 19002:19002 -v ${PWD}:/app -v /app/node_modules sportify-app
   ```

## Stopping the Container

```bash
docker-compose down
```

## Troubleshooting

- **Can't connect from phone**: Make sure your phone and computer are on the same network
- **Port already in use**: Stop any running Expo/Node processes or change ports in docker-compose.yml
- **Slow performance**: Docker on Windows/Mac uses VM, which can be slower than native

## Production Build

For production deployment, you'll need to build the app using:

```bash
expo build:android
expo build:ios
```

This Docker setup is primarily for development purposes.

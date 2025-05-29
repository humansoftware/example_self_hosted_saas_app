# Example Self-Hosted SaaS Application

This repository demonstrates how to deploy a SaaS application to a self-hosted k3s cluster. It's designed to work with the infrastructure created by [self-host-saas-k3s](https://github.com/humansoftware/self-host-saas-k3s).

## Overview

This repository contains:
- Kubernetes deployment configurations that work with the self-hosted infrastructure
- Traefik ingress setup with proper caching strategies
- Flux configuration for GitOps deployment
- Example application (Next.js) that can be replaced with any other framework

## Prerequisites

- A k3s cluster set up using [self-host-saas-k3s](https://github.com/humansoftware/self-host-saas-k3s)
- Flux installed in your cluster
- A container registry (the infrastructure provides Harbor)
- A domain name pointing to your cluster

## Project Structure

```
.
├── k8s/                    # Kubernetes manifests
│   ├── deployment.yaml    # Application deployment
│   ├── service.yaml       # Kubernetes service
│   ├── ingress.yaml       # Traefik ingress configuration
│   ├── middleware.yaml    # Traefik middleware for caching
│   └── kustomization.yaml # Kustomize configuration
├── flux/                  # Flux configuration
│   └── kustomization.yaml # Flux kustomization
└── Dockerfile            # Container definition
```

## Adapting for Your Application

### 1. Container Configuration

Replace the `Dockerfile` with one appropriate for your application:

```dockerfile
# Example for a Python application
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]

# Example for a Node.js application
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

### 2. Kubernetes Deployment

Modify `k8s/deployment.yaml`:
- Update the container image name
- Adjust resource limits based on your application's needs
- Add any required environment variables
- Configure health checks for your application

```yaml
# Example for a Python application
spec:
  containers:
  - name: your-app
    image: your-registry/your-app:latest
    ports:
    - containerPort: 8000  # Adjust to your app's port
    env:
    - name: DATABASE_URL
      valueFrom:
        secretKeyRef:
          name: your-app-secrets
          key: database-url
    livenessProbe:
      httpGet:
        path: /health  # Adjust to your health check endpoint
        port: 8000
```

### 3. Ingress Configuration

The `k8s/ingress.yaml` and `k8s/middleware.yaml` files are framework-agnostic. You only need to:
- Update the domain name
- Adjust the paths if your application uses different routes
- Modify caching strategies based on your needs

### 4. Caching Strategy

The current setup uses Traefik middleware for caching. Adjust the caching rules in `k8s/middleware.yaml` based on your application's needs:

```yaml
# Example for a static-heavy application
spec:
  headers:
    customResponseHeaders:
      Cache-Control: "public, max-age=86400"  # 1 day

# Example for a dynamic application
spec:
  headers:
    customResponseHeaders:
      Cache-Control: "no-cache, must-revalidate"
```

## Deployment

1. Build and push your container:
   ```bash
   docker build -t your-registry/your-app:latest .
   docker push your-registry/your-app:latest
   ```

2. Update the image reference in `k8s/deployment.yaml`

3. Apply the configuration:
   ```bash
   kubectl apply -k k8s/
   ```

4. Flux will automatically sync the changes to your cluster

## Integration with Infrastructure

Your application will automatically benefit from:

- **Traefik**: For ingress and TLS termination
- **cert-manager**: For automatic SSL certificate management
- **Flux**: For GitOps-based deployment
- **Harbor**: For container registry
- **Longhorn**: For persistent storage
- **Prometheus/Grafana**: For monitoring
- **AlertManager**: For notifications

## Security Considerations

- All traffic is encrypted with TLS
- Security headers are configured through Traefik middleware
- Management interfaces are not exposed directly
- Proper caching headers prevent stale content
- Secrets should be managed through Kubernetes secrets

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

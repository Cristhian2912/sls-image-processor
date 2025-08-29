# Proyecto Serverless - API Upload + Evento S3

Este proyecto implementa una arquitectura sin servidor utilizando [Serverless Framework v4](https://www.serverless.com/).  
Contiene dos funcionalidades principales:

1. **API REST `/upload`** → Permite subir archivos mediante HTTP (API Gateway + Lambda).  
2. **Evento de S3** → Reacciona automáticamente cuando se sube un archivo al bucket configurado.

## 🚀 Requisitos

- [Node.js](https://nodejs.org/) = 20
- [Serverless Framework](https://www.serverless.com/framework/docs/getting-started/)  

## Configuración

Instalar dependencias

```bash
npm install -g serverless
npm install
```

Instalar dependencias para la capa common de lambda

```bash
cd layers/common/nodejs
npm install
```
**Nota:** Si se tiene problemas con sharp se deberia descargar las dependencias desde un centenedor temportal con la imagen de lambda y nodejs20

Configurar las variables de entorno en .env

```bash
SERVERLESS_ORG="org_example"        # org de serverless v4
SERVICE_NAME="sls-image-processor"  # nombre del servicio
BUCKET_NAME="sls-image-processor"   # nombre del bucket para las imagenes
AWS_PROFILE="serverless"            # perfil aws usado para los despliegues
```

## Despliegue

```
npm run build
serverless deploy
```

## Uso

Subir un archivo con el endpoint /upload

```
curl -X POST https://asdfjlkas.execute-api.us-east-1.amazonaws.com/dev/upload --data-binary "@aws_logo.png" -H "Content-Type: image/png"
```

Una lambda reaccionará al evento s3:ObjectCreated y se procesará generando tres archivos similares a los siguientes archivos en el bucket S3

```
optimized/webp/aws_logo.png
optimized/avif/aws_logo.png
optimized/png/aws_logo.png
```

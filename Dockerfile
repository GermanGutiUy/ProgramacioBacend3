# ----------------------------------------------------
# 1. ETAPA DE CONSTRUCCIÓN (BUILD STAGE) - Instalación de dependencias
# ----------------------------------------------------
FROM node:20-slim AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración de dependencias
# Esto permite que la capa de instalación de dependencias se cachee eficientemente
COPY package.json package-lock.json ./

# Instala las dependencias del proyecto
# Usamos --omit=dev para evitar instalar dependencias de desarrollo, 
# a menos que las necesites para ejecución en producción
RUN npm ci --omit=dev

# ----------------------------------------------------
# 2. ETAPA DE PRODUCCIÓN (PRODUCTION STAGE) - Entorno de ejecución
# ----------------------------------------------------
FROM node:20-slim

# Establece el directorio de trabajo
WORKDIR /app

# Copia las dependencias instaladas en la etapa "builder"
COPY --from=builder /app/node_modules ./node_modules

COPY src ./src
COPY package.json ./

# Variable de entorno por defecto
ENV PORT=3000

# Expone el puerto que usa tu aplicación (por defecto 3000 según tu server.js)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD [ "node", "src/server.js" ]
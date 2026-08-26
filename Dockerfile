# 1. Usamos la imagen oficial de Node
FROM node:22-alpine

# 2. Creamos la carpeta interna de trabajo
WORKDIR /app

# 3. Copiamos los archivos de dependencias
COPY package*.json ./

# 4. Instalamos las dependencias dentro del contenedor
RUN npm install

# 5. Copiamos el resto de tu código de React/Vite
COPY . .

# 6. Exponemos el puerto oficial de Vite
EXPOSE 5173

# 7. Encendemos el servidor pasándole la bandera --host
# (Esto es obligatorio para que Docker pueda sacar el puerto hacia tu Windows)
CMD ["npm", "run", "dev", "--", "--host"]
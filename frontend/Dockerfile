# Pour le developpement
FROM node:latest

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]

# Pour la production
# FROM node:latest AS builder
# WORKDIR /app
# COPY package.json ./
# COPY package-lock.json ./
# RUN npm install
# COPY . .

# RUN npm run build

# FROM nginx:alpine
# COPY --from=builder /app/dist /usr/share/nginx/html
# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]
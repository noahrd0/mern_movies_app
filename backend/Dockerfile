FROM node:latest

WORKDIR /app
RUN npm install -g npm@latest
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .

EXPOSE 5000
CMD [ "npm", "run", "dev" ]
FROM node:19

WORKDIR /usr/src/app

COPY package*.json ./
COPY package-lock*.json ./
RUN npm ci

COPY . .

EXPOSE 5000

CMD [ "npx", "nodemon", "app.js" ]
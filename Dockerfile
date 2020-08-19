FROM node:14.8.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm run build

COPY . .

EXPOSE 9000

CMD [ "node", "dist/main"]
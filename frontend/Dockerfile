FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8081
EXPOSE 8082
EXPOSE 19000
EXPOSE 19001
EXPOSE 19006

CMD ["npx", "expo", "start", "--host", "lan"]
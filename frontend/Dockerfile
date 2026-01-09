FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Install @expo/ngrok globally for tunnel support
RUN npm install -g @expo/ngrok

COPY . .

EXPOSE 8081
EXPOSE 8082
EXPOSE 19000
EXPOSE 19001
EXPOSE 19006

# Remove CI mode to allow proper tunnel setup
CMD ["npx", "expo", "start", "--tunnel"]

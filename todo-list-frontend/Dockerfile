FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Use this environment variable to make sure React listens on all interfaces
ENV HOST=0.0.0.0

CMD ["npm", "start"]
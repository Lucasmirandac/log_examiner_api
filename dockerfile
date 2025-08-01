FROM node:22-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# Expose port 3000
EXPOSE 3000

CMD ["npx", "tsc", "src/server.ts"]
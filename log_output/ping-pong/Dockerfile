FROM node:20-alpine
WORKDIR /usr/src/app
COPY server.js package.json ./
RUN npm install
EXPOSE 3000
CMD ["node", "server.js"]

FROM node:20-alpine
WORKDIR /usr/src/app
COPY reader.js package.json ./
RUN npm install
EXPOSE 3000
CMD ["node", "reader.js"]

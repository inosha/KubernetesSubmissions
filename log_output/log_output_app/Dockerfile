FROM node:20-alpine
WORKDIR /usr/src/app
COPY log_output_app.js package.json ./
RUN npm install
EXPOSE 3001

CMD ["node", "log_output_app.js"]
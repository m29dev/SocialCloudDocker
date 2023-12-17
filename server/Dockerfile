FROM node:21-alpine
COPY package.json /app/
COPY .env /app/
COPY config /app/config
COPY controllers /app/controllers
COPY models /app/models
COPY routes /app/routes
COPY app.js /app/
WORKDIR /app
RUN npm i
EXPOSE 3000
CMD ["node", "app.js"]

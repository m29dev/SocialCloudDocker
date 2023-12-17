FROM node:21-alpine
COPY .eslintrc.cjs /app/
COPY index.html /app/
COPY package-lock.json /app/
COPY package.json /app/
COPY vite.config.js /app/
COPY public /app/public
COPY src /app/src
WORKDIR /app
RUN npm i
EXPOSE 5000
CMD ["npm", "run", "dev"]

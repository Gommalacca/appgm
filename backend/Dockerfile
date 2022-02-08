FROM node:alpine

WORKDIR /app

COPY package.json .
RUN npm install
COPY . . 
EXPOSE 8080
ENV NODE_ENV=developement


CMD ["npm", "run", "dev"]
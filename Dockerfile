FROM node:18.19.0-bullseye-slim

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN apt update && apt install -y procps
RUN npm install -g pm2
RUN pm2 startup

ENTRYPOINT ["npm", "run", "dev"]

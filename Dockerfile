FROM node:12
WORKDIR /usr/src/app
COPY package.json ./
COPY app.js ./
COPY ./src ./src
COPY ./config ./config
COPY ./scripts ./scripts

RUN npm install
ENTRYPOINT [ "node", "app.js" ]

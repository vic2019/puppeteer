FROM node:12.16.1

WORKDIR /

COPY package*.json /

RUN npm install

COPY . /

EXPOSE 8080

CMD ["node", "index.js"]
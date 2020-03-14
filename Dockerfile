FROM node:12.16.1

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app

RUN apt-get update; \
    apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget; \ 
    apt-get install -y xvfb;

EXPOSE 20 80 443 1337

ENV URL=https://bungeetech.com

CMD xvfb-run -a --server-args="-screen 0 1920x1080x24 -ac -nolisten tcp -dpi 96 +extension RANDR" node index.js
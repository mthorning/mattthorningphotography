FROM strapi/base

WORKDIR /srv/app

COPY package.json .
COPY package-lock.json .
COPY api api
COPY build build
COPY config config
COPY exports exports
COPY extensions extensions

RUN npm ci
CMD npm start



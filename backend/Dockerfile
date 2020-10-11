FROM strapi/base

WORKDIR /srv/app

COPY package.json .
COPY package-lock.json .
COPY api api
COPY build build
COPY config config
COPY components components
COPY exports exports
COPY extensions extensions

RUN npm ci
CMD npm start



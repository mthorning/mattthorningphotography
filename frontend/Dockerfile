FROM node:12

WORKDIR /usr/app

COPY ./package.json .
COPY ./package-lock.json .
COPY ./.env .
RUN npm ci --only=production

COPY ./__sapper__/build ./__sapper__/build
COPY ./static ./static

CMD ["node", "./__sapper__/build"]



FROM node:12

WORKDIR /usr/app

COPY . .
RUN npm ci
RUN npm run build

CMD npm start



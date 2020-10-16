FROM strapi/base

WORKDIR /srv/app

COPY . .
RUN npm ci 
RUN npm run build

CMD npm start



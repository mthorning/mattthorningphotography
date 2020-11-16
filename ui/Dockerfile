FROM node:14

WORKDIR /usr/app

COPY package.json .
COPY package-lock.json .
COPY __sapper__/build __sapper__/build 
COPY static static 

RUN npm ci
CMD npm start



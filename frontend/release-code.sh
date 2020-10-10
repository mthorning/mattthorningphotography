#!/bin/bash
set -e 

SITE="photo-site"

npm run build
tar -czvf $SITE.tar.gz \
    ./package.json \
    ./package-lock.json \
    ./Dockerfile \
    ./__sapper__/build \
    ./static \
    .env
    
scp ./$SITE.tar.gz $1:~/containers/$SITE

ssh $1 << EOF
    cd ~/containers/$SITE
    tar -xvf $SITE.tar.gz

    docker build --no-cache --tag $SITE-image .
    docker stop photo && docker container rm photo
    docker run \
        --detach \
        --restart=always \
        -p 3000:3000 \
        --name photo \
        -v ~/websites/photo-gallery/:/usr/app/static/images/ \
        $SITE-image
    rm -rf ~/containers/$SITE/*
EOF

rm $SITE.tar.gz

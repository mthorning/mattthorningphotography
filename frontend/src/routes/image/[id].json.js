import fs from "fs";
import path from "path";
import calcPrintSize from "tariff/src/index"
import request from '../../utils/request';


export function get(req, res) {
    const {id} = req.params;
    request(
    `
        photo(id: "${id}") {
            id
            title
            isPortrait
            exif
            image {
                url
                formats
                width
                height
            }
        }
    `,
    res
    ).then((response) => {
        if (response) {
            const { photo } = response;

            const printSizes = calcPrintSize(photo.image.width, photo.image.height)

            res.writeHead(200, {
              "Content-Type": "application/json",
            });

            res.end(JSON.stringify({...photo, printSizes}));
        }

    }).catch((error) => {
        res.writeHead(500, {
          "Content-Type": "application/json",
        });
        console.error("Something happened", error);
            
    });
}


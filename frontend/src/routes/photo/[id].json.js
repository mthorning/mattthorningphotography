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
            description
            sell
            isPortrait
            showExif
            exif
            cropSize  {
                height
                width
            }
            image {
                url
                formats
            }
        }
    `,
    res
    ).then((response) => {
        if (response) {
            const { photo } = response;

            const printSizes = calcPrintSize(photo.cropSize.width, photo.cropSize.height)

            res.writeHead(200, {
              "Content-Type": "application/json",
            });

            res.end(JSON.stringify({...photo, ...photo.image, printSizes}));
        }

    }).catch((error) => {
        res.writeHead(500, {
          "Content-Type": "application/json",
        });
        console.error("Something happened", error);
            
    });
}


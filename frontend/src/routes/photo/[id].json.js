import calcPrintSize from "tariff/src/index"
import request from '../../utils/request';
import marked from "marked";


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
            exif {
                aperture
                focalLength
                iso
                shutter
                bracketed
                show
            }
            cropSize  {
                height
                width
            }
            image {
                url
                formats
            }
        }
        print {
            availablePrintSizes
            info
            enabled
        }
    `,
    res
    ).then((response) => {
        if (response) {
            const { photo = {}, print = {} } = response

            const printSizes = print && photo ? calcPrintSize(
                photo.cropSize.width, 
                photo.cropSize.height, 
                print.availablePrintSizes
            ) : null

            res.writeHead(200, {
              "Content-Type": "application/json",
            });

            res.end(JSON.stringify({
                photo: {...photo, ...photo.image}, 
                print: { ...print, printSizes, info: marked(print.info) } 
            }));
        }

    }).catch((error) => {
        res.writeHead(500, {
          "Content-Type": "application/json",
        });
        console.error("Something happened", error);
            
    });
}


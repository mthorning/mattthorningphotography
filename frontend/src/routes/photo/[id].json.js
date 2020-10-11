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
            const { 
                photo: { cropSize, ...photo }, 
                print: { availablePrintSizes, info, enabled } 
            } = response;

            const printSizes = calcPrintSize(
                cropSize.width, 
                cropSize.height, 
                availablePrintSizes
            )

            res.writeHead(200, {
              "Content-Type": "application/json",
            });

            res.end(JSON.stringify({
                photo: {...photo, ...photo.image}, 
                print: { info, printSizes } 
            }));
        }

    }).catch((error) => {
        res.writeHead(500, {
          "Content-Type": "application/json",
        });
        console.error("Something happened", error);
            
    });
}


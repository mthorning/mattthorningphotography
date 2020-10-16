import request from '../../utils/request';
import marked from "marked";

function calcPrintSize({ width, height, availablePrintSizes, ratioTolerance, minDPI }) {
    const [pixelWidth, pixelHeight] = width > height ? [width, height] : [height, width];
    return availablePrintSizes
        .map((print) => ({
            ...print,
            cropSize: `${pixelWidth} x ${pixelHeight}`,
            price: calcPrice(print),
            imgRatio: (pixelWidth / pixelHeight).toFixed(2),
            paperRatio: (print.x / print.y).toFixed(2),
            dpi: Math.round(
                calcDPI({ x: pixelWidth, y: pixelHeight }, { x: print.x, y: print.y })
            ),
        }))
        .filter((print) => {
            const diff = print.imgRatio - print.paperRatio;
            return (diff < 0 ? diff > (ratioTolerance * -1) : diff < ratioTolerance) && print.dpi > minDPI;
        });
}

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
            ratioTolerance
        }
    `,
    res
    ).then((response) => {
        if (response) {
            const { 
                photo: { cropSize: { width, height } = {}, ...photo } = {}, 
                print: { availablePrintSizes, ratioTolerance, minDPI, ...print } = {} 
            } = response

            const printSizes = print && photo ? calcPrintSize({
                width, 
                height, 
                availablePrintSizes
                ratioTolerance,
                minDPI
            }) : null

            res.writeHead(200, {
              "Content-Type": "application/json",
            });

            res.end(JSON.stringify({
                photo: {...photo, ...( photo.image ?  photo.image : {}) }, 
                print: { ...print, printSizes, info: marked(print.info) } 
            }));
        }

    }).catch((error) => {
        console.error("Something happened", error);
        res.writeHead(500, {
          "Content-Type": "application/json",
        });
            
    });
}


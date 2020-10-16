import request from '../../utils/request'
import marked from 'marked'
import type { Dimensions,AvailablePrintSize, PrintSize, Print, Photo } from './_types'


function calcDPI(pixels: Dimensions, inches: Dimensions) {
  return Math.sqrt((pixels.x * pixels.y) / (inches.x * inches.y));
}

function calcPrice({ price, postage }) {
  const margin = price * 2 < 35 ? 35 : price * 2;
  return Math.ceil(price + (margin + (margin / 100) * 20) + postage * 2);
}


function calcPrintSize({
  width,
  height,
  availablePrintSizes,
  ratioTolerance,
  minDPI,
}) {
  const [pixelWidth, pixelHeight] =
    width > height ? [width, height] : [height, width]
  return availablePrintSizes.map((print: AvailablePrintSize) => ({
      ...print,
      cropSize: `${pixelWidth} x ${pixelHeight}`,
      price: calcPrice(print),
      imgRatio: (pixelWidth / pixelHeight).toFixed(2),
      paperRatio: (print.x / print.y).toFixed(2),
      dpi: Math.round(
        calcDPI({ x: pixelWidth, y: pixelHeight }, { x: print.x, y: print.y })
      ),
    }))
        .filter((print: PrintSize) => {
      const diff = print.imgRatio - print.paperRatio
      return (
        (diff < 0 ? diff > ratioTolerance * -1 : diff < ratioTolerance) &&
        print.dpi > minDPI
      )
    })
}

export function get(req, res) {
  const { id } = req.params
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
            minDPI
        }
    `,
    res
  )
    .then((response) => {
      if (response) {
        const print: Print = response.print;
        const photo: Photo = response.photo;

        const printSizes =
          print && photo
            ? calcPrintSize({
                width: photo.cropSize.width,
                height: photo.cropSize.height,
                availablePrintSizes: print.availablePrintSizes,
                ratioTolerance: print.ratioTolerance,
                minDPI: print.minDPI,
              })
            : null

        res.writeHead(200, {
          'Content-Type': 'application/json',
        })

        res.end(
          JSON.stringify({
            photo: { ...photo, ...(photo.image ? photo.image : {}) },
            print: { ...print, printSizes, info: marked(print.info) },
          })
        )
      }
    })
    .catch((error) => {
      console.error('Something happened', error)
      res.writeHead(500, {
        'Content-Type': 'application/json',
      })
    })
}

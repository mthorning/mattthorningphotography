import request from '../../utils/request'
import marked from 'marked'

import type { Exif, PrintSize } from '../../types'
import type { Request } from 'polka';
import type { ServerResponse } from 'http';

interface CropSize {
  height: number,
  width: number
}

interface AvailablePrintSize {
  x: number,
  y: number,
  postage: number,
  price: number,
}

interface Photo {
  id: string,
  title: string,
  description: string,
  sell: boolean,
  exif: Exif,
  image: {
    url: string,
    alternativeText: string
  },
  formats: {
    medium: { url: string },
    large: { url: string }
  }
}

interface Print {
  printSizes: PrintSize[],
  info: string,
  enabled: boolean,
}

interface Thumb {
  id: string,
  isPortrait: boolean,
  image: {
    alternativeText: string,
    formats: {
      thumbnail: { url: string }
    }
  }

}

export interface Data {
  thumbs: Thumb[],
  photo: Photo,
  print: Print
}

interface Dimensions {
  x: number,
  y: number
}

function calcDPI(pixels: Dimensions, paper: Dimensions) {
  return Math.round(Math.sqrt((pixels.x * pixels.y) / (paper.x * paper.y)));
}

function calcRatio(pixels: Dimensions, paper: Dimensions) {
  const pixelRatio = pixels.x / pixels.y
  const paperRatio = paper.x / paper.y
  return pixelRatio - paperRatio
}

function calcPrice(price: number, postage: number) {
  const margin = price * 2 < 35 ? 35 : price * 2;
  return Math.ceil(price + (margin + (margin / 100) * 20) + postage * 2);
}


interface CalcPrintSizes {
  (
    cropSize: CropSize,
    availablePrintSizes: AvailablePrintSize[],
    ratioTolerance: number,
    minDPI: number
  ): PrintSize[]
}
let calcPrintSizes: CalcPrintSizes

calcPrintSizes = function (
  cropSize,
  availablePrintSizes,
  ratioTolerance = 0.05,
  minDPI = 150,
) {
  if (!cropSize?.width || !cropSize?.height || !availablePrintSizes?.length) return []
  const { width, height } = cropSize
  const [pixelWidth, pixelHeight] =
    width > height ? [width, height] : [height, width]

  return availablePrintSizes.map((print) => ({
    ...print,
    price: calcPrice(print.price, print.postage),
  }))
    .filter((print) => {
      const pixels = { x: pixelWidth, y: pixelHeight }
      const paper = { x: print.x, y: print.y }
      const diff = calcRatio(pixels, paper)
      const dpi = calcDPI(pixels, paper)
      return (
        (diff < 0 ? diff > ratioTolerance * -1 : diff < ratioTolerance) &&
        dpi > minDPI
      )
    })
}

export function get(req: Request, res: ServerResponse) {
  const { id } = req.params
  request(
    `
        thumbs: photos(sort: "captureDate:asc", where: { published: true }) {
          id
          isPortrait
          image {
            url
            alternativeText
            formats
          }
        }
        photo(id: "${id}") {
            id
            title
            description
            sell
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
                alternativeText
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
        const { print = {}, photo = {}, thumbs = {} } = response

        const printSizes: PrintSize[] = print && photo
          ? calcPrintSizes(
            photo.cropSize,
            print.availablePrintSizes,
            print.ratioTolerance,
            print.minDPI,
          )
          : []

        res.writeHead(200, {
          'Content-Type': 'application/json',
        })

        const data: Data = {
          thumbs,
          photo: { ...photo, ...(photo.image ? photo.image : {}) },
          print: { printSizes, enabled: print.enabled, info: marked(print.info) },
        }
        res.end(
          JSON.stringify(data)
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

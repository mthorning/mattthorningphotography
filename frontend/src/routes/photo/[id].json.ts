import request from '../../utils/request'
import marked from 'marked'

import type { CropSize, AvailablePrintSize, PrintSize } from '../../types'
import type { Request, Response } from 'express'
import type { Dimensions, Data } from './_types'

function calcDPI(pixels: Dimensions, inches: Dimensions) {
  return Math.sqrt((pixels.x * pixels.y) / (inches.x * inches.y));
}

function calcPrice({ price, postage }) {
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
calcPrintSizes = function(
    cropSize,
    availablePrintSizes,
    ratioTolerance,
    minDPI,
) {
    const { width, height } = cropSize
    const [pixelWidth, pixelHeight] =
        width > height ? [width, height] : [height, width]

    return availablePrintSizes.map((print) => ({
      ...print,
      cropSize: `${pixelWidth} x ${pixelHeight}`,
      price: calcPrice(print),
      imgRatio: pixelWidth / pixelHeight,
      paperRatio: print.x / print.y,
      dpi: Math.round(
        calcDPI({ x: pixelWidth, y: pixelHeight }, { x: print.x, y: print.y })
      ),
    }))
        .filter((print) => {
      const diff = print.imgRatio - print.paperRatio
      return (
        (diff < 0 ? diff > ratioTolerance * -1 : diff < ratioTolerance) &&
        print.dpi > minDPI
      )
    })
}

export function get(req: Request, res: Response) {
  const { id } = req.params
  request(
    `
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
        const { print, photo } = response

          const printSizes = print && photo
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
            photo: { ...photo, ...(photo.image ? photo.image : {}) },
            print: { ...print, printSizes, info: marked(print.info) },
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

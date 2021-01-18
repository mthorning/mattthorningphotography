import request from '../../../utils/request'
import marked from 'marked'

import type { Request, Response } from 'express'
import type { Exif, PrintSize } from '../../../types'

interface CropSize {
  height: number,
  width: number
}

interface Photo {
  id: string,
  slug: string,
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
  availablePrintSizes: {
    postage: number,
    price: number,
    x: number,
    y: number,
  }[],
  info: string,
  enabled: boolean,
  ratioTolerance: number,
  minDPI: number,
  multiplier: number,
  minMargin: number,
  marginPercIncr: number,
  postageMultiplier: number,
}

interface Thumb {
  slug: string,
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
  print: {
    enabled: boolean,
    printSizes: PrintSize[],
    info: string
  }
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

function calcPrice({ price: cost, postage }, { multiplier, minMargin, marginPercIncr, postageMultiplier }) {
  let margin = cost * multiplier < minMargin ? minMargin : cost * multiplier;
  margin = margin + margin / 100 * marginPercIncr;
  return Math.ceil(cost + margin + (postage * postageMultiplier));
}


interface CalcPrintSizes {
  (
    cropSize: CropSize,
    print: Print
  ): PrintSize[]
}
let calcPrintSizes: CalcPrintSizes

calcPrintSizes = function (
  cropSize,
  {
    availablePrintSizes,
    ratioTolerance = 0.05,
    minDPI = 150,
    ...variables
  }
) {
  if (!cropSize?.width || !cropSize?.height || !availablePrintSizes?.length) return []
  const { width, height } = cropSize
  const [pixelWidth, pixelHeight] =
    width > height ? [width, height] : [height, width]

  return availablePrintSizes.map((print) => ({
    ...print,
    price: calcPrice(print, variables),
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

export function get(req: Request, res: Response) {
  const { slug } = req.params
  request(
    `
        thumbs: photos(sort: "title:asc", where: { published: true }) {
          slug
          isPortrait
          image {
            url
            alternativeText
            formats
          }
        }
        photos(where:{ slug: "${slug}" }) {
            id
            slug
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
            multiplier
            minMargin
            marginPercIncr
            postageMultiplier
        }
    `,
    res
  )
    .then((response) => {
      if (response) {
          const { print = {}, photos: [photo = {}], thumbs = {} } = response

        const printSizes: PrintSize[] = print && photo
          ? calcPrintSizes(
            photo.cropSize,
            print
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

import request from '../../utils/request'

import type { Photo } from '../../types'
import type { Data } from './_types'

export async function get(req, res, next) {
  request(
    `
        photos(sort: "captureDate:asc", where: { published: true }) {
            id
            isPortrait
            image {
                alternativeText
                formats
            }
        }
    `,
    res
  ).then((response) => {
    if (response) {
      const { photos } = response
      res.writeHead(200, {
        'Content-Type': 'application/json',
      })
        const data: Data = { 
            photos: photos.map((datum: any) => {
                const photo: Photo = {
                    id: datum.id,
                    alternativeText: datum.image && datum.image.alternativeText,
                    isPortrait: datum.isPortrait,
                    formats: datum.image && datum.image.formats,
                }
                return photo
            })
        }

      res.end(JSON.stringify(data))
    }
  })
}

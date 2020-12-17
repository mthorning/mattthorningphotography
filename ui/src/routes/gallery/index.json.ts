import type { ServerResponse } from 'http'
import type { Next, Request } from 'polka'
import request from '../../utils/request'


export interface Photo {
  id: string,
  isPortrait: boolean,
  image: {
    url: string,
    alternativeText: string,
    formats: {
      small: { url: string },
    }
  }
}

export interface Data {
  photos: Photo[]
}

export async function get(req: Request, res: ServerResponse, next: Next) {
  request(
    `
        photos(sort: "captureDate:asc", where: { published: true }) {
            id
            isPortrait
            image {
                url
                alternativeText
                formats
            }
        }
    `,
    res
  ).then((response: Data) => {
    if (response) {
      res.writeHead(200, {
        'Content-Type': 'application/json',
      })

      res.end(JSON.stringify(response))
    }
  })
}

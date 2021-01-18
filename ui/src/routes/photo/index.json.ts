import request from '../../utils/request'


export interface Photo {
  slug: string,
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

export async function get(req, res, next) {
  request(
    `
        photos(sort: "title:asc", where: { published: true }) {
            slug
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

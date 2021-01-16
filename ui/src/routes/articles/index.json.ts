import type { ServerResponse } from 'http'
import type { Next, Request } from 'polka'
import request from '../../utils/request'


export interface Article {
  id: string,
  title: string,
  subtitle: string,
  body: string,
}

export interface Data {
  articles: Article[]
}

export async function get(req: Request, res: ServerResponse, next: Next) {
  request(
    `
        articles(sort: "createdAt:asc", where: { published: true }) {
            id
            title
            body
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

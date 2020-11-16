import request from '../../utils/request';
import marked from "marked";

import type { Request, Response } from 'express'

export interface Data {
    about: {
        title: string,
        body: string,
        image: {
            url: string
        }
    }
}

export function get(_req: Request, res: Response) {
    request(
        `
            about {
                title
                body
                image {
                    url
                }
            }
        `, 
        res
    ).then((response: Data) => {
        if (response) {

            res.writeHead(200, {
              "Content-Type": "application/json",
            });

            res.end(JSON.stringify({ 
                about: { 
                    ...response.about, 
                    body: marked(response.about?.body)
                }
            }))
        }
    }).catch((error) => {
        console.error("Something happened", error);
            
    });
}

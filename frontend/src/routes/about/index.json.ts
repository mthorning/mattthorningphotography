import request from '../../utils/request';
import marked from "marked";

import type { Request, Response } from 'express'
import type { Data } from './_types'

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
    ).then((response) => {
        if (response) {
            const data: Data = {
                about: {
                ...response.about,
                body: marked(response.about.body),
                image: response.about.image === null ? {} : response.about.image
                }
            }

            res.writeHead(200, {
              "Content-Type": "application/json",
            });

            res.end(JSON.stringify(data));
        }

    }).catch((error) => {
        console.error("Something happened", error);
            
    });
}

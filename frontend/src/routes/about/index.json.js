import request from '../../utils/request';
import marked from "marked";

export function get(req, res) {
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
            const about = {
                ...response.about,
                body: marked(response.about.body)
            }

            res.writeHead(200, {
              "Content-Type": "application/json",
            });

            res.end(JSON.stringify(about));
        }

    }).catch((error) => {
        console.error("Something happened", error);
            
    });
}

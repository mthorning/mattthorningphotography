import request from '../../utils/request';
import marked from "marked";

import type { Request, Response } from 'express'

interface EquipmentItems {
    [category: string]: [string]
}

export interface Data {
    about: {
        title: string,
        body: string,
        image: {
            url: string
        }
        showGearList: boolean
    },
    equipmentItems: EquipmentItems
}

export function get(_req: Request, res: Response) {
    request(
        `
            about {
                title
                body
                showGearList
                image {
                    url
                }
            }
            equipmentItems {
                name
                category
            }
        `, 
        res
    ).then((response) => {
        if (response) {

            res.writeHead(200, {
              "Content-Type": "application/json",
            });

            const equipmentItems = response.equipmentItems.reduce((items: EquipmentItems, { name, category }) => ({ 
                ...items, 
                [category]: [...items[category] ?? [], name]
            }), {});

            const data: Data = { 
                equipmentItems,
                about: { 
                    ...response.about, 
                    body: marked(response.about?.body)
                }
            }

            res.end(JSON.stringify(data))
        }
    }).catch((error) => {
        console.error("Something happened", error);
            
    });
}

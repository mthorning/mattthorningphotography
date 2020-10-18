import type { Image } from '../../types'

export interface About {
    title: string,
    body: string,
    image: Image
}

export interface Data {
    about: About
}

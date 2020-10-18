import type { Photo, Print } from '../../types'

export interface Dimensions {
    x: number,
    y: number
}

export interface Data {
    photo: Photo,
    print: Print
}

export interface PrintSize {
    x: number
    y: number
    price: number
}

export interface Exif {
    aperture: number
    focalLength: number
    iso: number
    shutter: number
    bracketed: boolean
    show: boolean
}

export interface Email {
    from: string,
    subject: string,
    html: string
}


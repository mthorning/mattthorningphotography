export interface AvailablePrintSize {
    x: number,
    y: number,
    price:number,
    postage: number
}

export interface PrintSize extends AvailablePrintSize {
    price: number,
    imgRatio: number,
    paperRatio: number,
    dpi: number
}

export interface FormatSettings {
    url: string
}
export interface Format {
    thumbnail: FormatSettings,
    small: FormatSettings,
    medium: FormatSettings,
    large: FormatSettings
}

export interface Image {
    url: string,
    formats: Array<Format>
}

export interface CropSize {
    height: number,
    width: number
}

export interface Exif {
    aperture: number,
    focalLength: number,
    iso: number,
    shutter: number,
    bracketed: boolean,
    show: boolean
}

export interface Photo {
    id: string,
    alternativeText: string,
    title?: string,
    description?: string,
    sell?: boolean,
    isPortrait?:boolean,
    exif?: Exif,
    cropSize?: CropSize,
    image?: Image,
    formats?: Format,
}

export interface Print {
    id: string,
    title: string
    printSizes: Array<PrintSize>,
    info: string
    enabled: boolean,
}

export interface Email {
    from?: string,
    subject: string,
    html: string
}

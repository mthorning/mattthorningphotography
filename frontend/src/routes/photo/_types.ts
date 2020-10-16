export interface AvailablePrintSize {
    x: number,
    y: number,
    price:number,
    postage: number
}

export interface PrintSize extends AvailablePrintSize {
    cropSize: CropSize,
    price: number,
    imgRatio: number,
    paperRatio: number,
    dpi: number
}

export interface Print {
    availablePrintSizes: AvailablePrintSize[],
    info: string
    enabled: boolean,
    ratioTolerance: number
    minDPI: number
}

export interface Exif {
    aperture: number,
    focalLength: number,
    iso: number,
    shutter: number,
    bracketed: boolean,
    show: boolean
}

export interface CropSize {
    height: number,
    width: number
}

export interface Image {
    url: string,
    formats: []
}

export interface Photo {
    id: string,
    title: string,
    description: string,
    sell: boolean,
    isPortrait:boolean,
    exif: Exif,
    cropSize: CropSize,
    image: Image
}

export interface Dimensions {
    x: number,
    y: number
}

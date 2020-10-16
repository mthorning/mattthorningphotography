import request from '../../utils/request';

export async function get(req, res, next) {
  request(
    `
        photos(sort: "captureDate:asc", where: { published: true }) {
            id
            isPortrait
            image {
                alternativeText
                formats
            }
        }
    `,
    res
  ).then((response) => {
    if (response) {
      const { photos } = response;
      res.writeHead(200, {
        "Content-Type": "application/json",
      });

        res.end(JSON.stringify(photos.map(photo => ({
            id: photo.id,
            alt: photo.image && photo.image.alternativeText,
            isPortrait: photo.isPortrait,
            formats: photo.image && photo.image.formats
        }))));
    }
  });
}

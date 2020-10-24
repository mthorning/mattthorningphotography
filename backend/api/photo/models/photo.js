const exifr = require("exifr");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

const isPortrait = (image) => image.height > image.width;

async function update(data) {
  const file = await strapi.query("file", "upload").findOne({ id: data.image });
  data.isPortrait = isPortrait(file);
  const exif = await exifr.parse(`${process.cwd()}/public/${file.url}`);

  return Promise.resolve({ file, exif });
}

function addExif(exif, data) {
  data.captureDate = exif.CreateDate;
  data.exifData = exif;
  const exifProperties = ['FNumber', 'FocalLength', 'ISO', 'ExposureTime']

  if (exif && Object.keys(exif).length) {
    data.exif = {
      aperture: exif.FNumber,
      focalLength: exif.FocalLength,
      iso: exif.ISO,
      ...(exif.ExposureTime ? {
        shutter: exif.ExposureTime >= 1
          ? Math.round(exif.ExposureTime * 10) / 10
          : `1/${Math.round(1 / exif.ExposureTime)}`
      } : {}),
    };
  } else {
    data.exif = { ...data.exif, show: false };
  }
}

function checkCanBePublished(data) {
  if (!data.title || !data.description || !data.captureDate) data.published = false
  const exif = data.exif
  if (!exif.aperture || !exif.focalLength || !exif.iso) data.exif = { ...data.exif, show: false }
}

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      if (data.image) {
        const { file, exif } = await update(data);
        addExif(exif, data);

        // if description is set in LR then use that (remove array):
        if (exif.ImageDescription) {
          const cropSizeMatch = exif.ImageDescription.match(/\[\d+,\ ?\d+\]/);
          const cropSizeString = cropSizeMatch ? cropSizeMatch[0] : null;

          if (cropSizeString) {
            const cropSize = JSON.parse(cropSizeString);
            data.cropSize = {
              width: Number(cropSize[0]),
              height: Number(cropSize[1]),
            };
          }

          data.description =
            exif.ImageDescription &&
            exif.ImageDescription.replace(cropSizeString, "");
        }
        // might as well set the title too
        data.title = data.title
          ? data.title
          : file.name.split("-")[1].replace(/_/g, " ").replace(file.ext, "");

        checkCanBePublished(data)
      }
    },
    beforeUpdate: async (params, data) => {
      const { exif } = await update(data);

      checkCanBePublished(data)
    },
  },
};

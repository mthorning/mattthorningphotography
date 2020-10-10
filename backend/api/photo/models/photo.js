const exifr = require("exifr");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

const isPortrait = (image) => image.height > image.width;

async function update(data) {
  const file = await strapi.query("file", "upload").findOne({ id: data.image });
  data.isPortrait = isPortrait(file);
  const { ImageDescription, ...exif } = await exifr.parse(
    `${process.cwd()}/public/${file.url}`
  );

  data.exif = exif;
  return Promise.resolve({ ImageDescription, file });
}

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      if (data.image) {
        const { ImageDescription, file } = await update(data);

        // if description is set in LR then use that (remove array):
        if (ImageDescription) {
          const cropSizeMatch = ImageDescription.match(/\[\d+,\ ?\d+\]/);
          const cropSize = cropSizeMatch ? JSON.parse(cropSizeMatch[0]) : null;
          if (cropSize)
            data.cropSize = {
              width: Number(cropSize[0]),
              height: Number(cropSize[1]),
            };

          data.description =
            ImageDescription && ImageDescription.replace(cropSize, "");
        }

        // might as well set the title too
        data.title = file.name
          .split("-")[1]
          .replace(/_/g, " ")
          .replace(file.ext, "");
      }
    },
    beforeUpdate: async (params, data) => {
      await update(data);
    },
  },
};

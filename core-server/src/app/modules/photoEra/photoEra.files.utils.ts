const sharp = require("sharp");

export const readUploadAsImage = async (file: any) => {
  await sharp(file.buffer).metadata();
  return file.buffer;
};

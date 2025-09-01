import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import config from "../../../config";
import { toBuffer } from "./photoEra.buffer.utils";

export const ensurePngBuffer = (input: Buffer) => {
  return sharp(input).png({ force: true }).toBuffer();
};

export const overlayGarmentOnPerson = async (personPng: Buffer, garmentPng: Buffer) => {
  const person = sharp(personPng);
  const meta = await person.metadata();
  const baseW = meta.width ?? 1024;
  const baseH = meta.height ?? 1024;

  const targetW = Math.floor(baseW * 0.6);
  const gMeta = await sharp(garmentPng).metadata();
  const ratio = gMeta.width && gMeta.height ? gMeta.height / gMeta.width : 1;
  const targetH = Math.max(1, Math.floor(targetW * ratio));

  const resizedGarment = await sharp(garmentPng).resize(targetW, targetH).png().toBuffer();
  const x = Math.floor((baseW - targetW) / 2);
  const y = Math.floor(baseH * 0.25);

  return person
    .composite([{ input: resizedGarment, top: y, left: x }])
    .png()
    .toBuffer();
};

export const saveTemp = async (pngLike: Buffer | ArrayBuffer | ArrayBufferView | { type: "Buffer"; data: number[] } | string) => {
  const pngBuffer = toBuffer(pngLike);

  const staticDir = config.STATIC_DIR || "./static";
  await fs.promises.mkdir(staticDir, { recursive: true });

  const name = `${uuidv4().replace(/-/g, "")}.png`;
  const outPath = path.resolve(staticDir, name);
  await fs.promises.writeFile(outPath, pngBuffer);

  return `/static/${name}`;
};

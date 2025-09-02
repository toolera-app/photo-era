import axios from "axios";
interface FileData {
  buffer: Buffer;
  filename: string;
  contentType: string;
}

export const getBufferFromUrl = async (url: any, { timeoutMs = 600000 } = {}) => {
  const resp = await axios.get(url, { responseType: "arraybuffer", timeout: timeoutMs });
  return Buffer.from(resp.data);
};

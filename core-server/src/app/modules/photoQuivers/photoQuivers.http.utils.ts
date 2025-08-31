import axios from "axios";
import FormData from "form-data";

interface FileData {
  buffer: Buffer;
  filename: string;
  contentType: string;
}

export const fetchWithFormData = async (url: any, filesMap: Record<string, FileData>, { data = {}, timeoutMs = 120000 } = {}) => {
  const form = new FormData();
  // filesMap: { field: { buffer, filename, contentType } }
  for (const [field, file] of Object.entries(filesMap || {})) {
    form.append(field, file.buffer, { filename: file.filename, contentType: file.contentType });
  }

  for (const [k, v] of Object.entries(data || {})) {
    form.append(k, v);
  }

  const resp = await axios.post(url, form, {
    headers: form.getHeaders(),
    responseType: "arraybuffer",
    timeout: timeoutMs,
  });
  return resp;
};

export const getBufferFromUrl = async (url: any, { timeoutMs = 600000 } = {}) => {
  const resp = await axios.get(url, { responseType: "arraybuffer", timeout: timeoutMs });
  return Buffer.from(resp.data);
};

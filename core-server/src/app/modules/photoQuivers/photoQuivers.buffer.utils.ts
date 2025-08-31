export function toBuffer(data: any): Buffer {
  if (Buffer.isBuffer(data)) return data;

  // ArrayBuffer or TypedArray/DataView
  if (data instanceof ArrayBuffer) return Buffer.from(data);
  if (ArrayBuffer.isView(data)) {
    return Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  }

  if (data?.type === "Buffer" && Array.isArray(data.data)) {
    return Buffer.from(data.data);
  }

  // data URL
  if (typeof data === "string" && data.startsWith("data:")) {
    const base64 = data.split(",")[1] || "";
    return Buffer.from(base64, "base64");
  }

  if (typeof data === "string") return Buffer.from(data, "binary");

  throw new Error("Unsupported data type for Buffer conversion");
}

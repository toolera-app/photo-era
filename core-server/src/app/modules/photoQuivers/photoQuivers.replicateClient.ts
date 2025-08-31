import Replicate from "replicate";
import { v4 as uuidv4 } from "uuid";
import config from "../../../config";
import { getBufferFromUrl } from "./photoQuivers.http.utils";

const replicate = config.REPLICATE_API_TOKEN ? new Replicate({ auth: config.REPLICATE_API_TOKEN }) : null;
const modelRef = config.REPLICATE_MODEL && config.REPLICATE_VERSION ? `${config.REPLICATE_MODEL}:${config.REPLICATE_VERSION}` : null;

export const runReplicate = async ({ personPng, garmentPng, prompt }: { personPng: Buffer; garmentPng: Buffer; prompt?: string }) => {
  if (!replicate || !modelRef) return { error: "Replicate credentials not configured" };

  try {
    // Option 1: If the model inputs are type `file`, just pass Buffers (SDK auto-uploads):
    // const result = await replicate.run(modelRef as any, {
    //   input: { human_img: personPng, garm_img: garmentPng, garment_des: String(prompt||"").trim(), crop:false, seed:42, steps:30, category:"upper_body", force_dc:false, mask_only:false }
    // });

    // Option 2: If the model expects STRING URLs, create file resources and pass their .urls.get
    const humanFile = await replicate.files.create(personPng, { filename: `person-${uuidv4()}.png` });
    const garmFile = await replicate.files.create(garmentPng, { filename: `garment-${uuidv4()}.png` });

    const result = await replicate.run(modelRef as any, {
      input: {
        crop: false,
        seed: 42,
        steps: 30,
        category: "upper_body",
        force_dc: false,
        mask_only: false,
        human_img: humanFile.urls.get, // <-- string
        garm_img: garmFile.urls.get, // <-- string
        garment_des: String(prompt || "").trim(),
      },
    });

    const url = await extractUrl(result);
    if (!url) return { error: "No output URL from Replicate", raw: result };

    const resultBuffer = await getBufferFromUrl(url);
    return { resultBuffer, raw: { url } };
  } catch (e: any) {
    const msg = e?.response?.data ? `replicate_run_failed: ${JSON.stringify(e.response.data)}` : `replicate_run_failed: ${e?.message || e}`;
    return { error: msg };
  }
};

async function extractUrl(result: any): Promise<string | null> {
  if (!result) return null;
  if (typeof result === "string" && result.startsWith("http")) return result;
  if (Array.isArray(result) && result.length) {
    const first = result[0];
    if (typeof first === "string" && first.startsWith("http")) return first;
    if (first && typeof first === "object") {
      if (typeof first.url === "function") return first.url();
      if (typeof first.url === "string") return first.url;
    }
  }
  if (typeof result === "object") {
    if (typeof result.url === "function") return result.url();
    if (typeof result.url === "string") return result.url;
    if (result.output) {
      if (typeof result.output === "string" && result.output.startsWith("http")) return result.output;
      if (Array.isArray(result.output) && typeof result.output[0] === "string") return result.output[0];
    }
  }
  return null;
}

// src/modules/flux-kontext/fluxKontext.falClient.ts
import { fal } from "@fal-ai/client";
import config from "../../../config";

fal.config({ credentials: config.FAL_KEY });

export async function runImageModel({ imageUrl, prompt }: { imageUrl: string; prompt: string }) {
  if (!config.FAL_KEY) return { error: "FAL_KEY missing" };

  const modelRef = config.FAL_MODEL;

  const { data, requestId } = await fal.subscribe(modelRef, {
    input: {
      prompt,
      image_url: imageUrl,
    },
    logs: true,
  });

  const url = Array.isArray((data as any)?.images) && (data as any).images[0]?.url ? (data as any).images[0].url : undefined;

  if (!url) return { error: "No image URL in fal result", raw: data, requestId };
  return { outputUrl: url as string, raw: data, requestId };
}

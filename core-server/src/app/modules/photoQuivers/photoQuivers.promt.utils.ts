import Replicate from "replicate";
import config from "../../../config";

const DEFAULT_PROMPT = "Wear garment against neutral gray wall with soft natural light, relaxed camera angle.";

function buildInstruction(notes: string, product: string) {
  return `You are a product styling assistant. Write a concise try-on styling prompt for a ${product}.
Notes: ${notes}

Rules:
- short English phrases, comma-separated
- mention lighting/background/camera when helpful
- no names/brands
- <= 20 words
Output only the prompt text.`;
}

export async function generateTryOnPrompt({ notes, product = "garment" }: { notes: string; product?: string }) {
  const token = config.REPLICATE_API_TOKEN;
  const model = config.REPLICATE_TEXT_MODEL;

  if (!token) {
    return { prompt: DEFAULT_PROMPT, warning: "REPLICATE_API_TOKEN missing" as string | null };
  }
  if (!model) {
    return { prompt: DEFAULT_PROMPT, warning: "REPLICATE_TEXT_MODEL missing" as string | null };
  }

  const replicate = new Replicate({ auth: token });
  const sys = buildInstruction(notes, product);

  const input: Record<string, unknown> = {
    prompt: sys,
    temperature: 0.2,
    max_tokens: 80,
  };

  let result: unknown;
  try {
    type ModelRef = `${string}/${string}` | `${string}/${string}:${string}`;
    const modelId = model as ModelRef; // e.g. "chat gpt 5"
    result = await replicate.run(modelId, { input });
  } catch (e: any) {
    return { prompt: DEFAULT_PROMPT, warning: String(e?.message || e) };
  }

  // normalize to string
  let text = "";
  if (typeof result === "string") {
    text = result;
  } else if (Array.isArray(result)) {
    text = result.join("");
  } else if (result && typeof result === "object" && "output" in (result as any)) {
    const out = (result as any).output;
    if (typeof out === "string") text = out;
    else if (Array.isArray(out)) text = out.join("");
  }

  text = (text || "").trim();
  if (!text) {
    return { prompt: DEFAULT_PROMPT, warning: "Replicate returned empty response" };
  }

  // one-liner cleanup
  text = text.replace(/\s+/g, " ").trim();

  return { prompt: text, warning: null as string | null };
}

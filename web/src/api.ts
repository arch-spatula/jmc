import type { SavePayload } from "./types";

export async function saveBatch(payload: SavePayload): Promise<void> {
  const response = await fetch("/api/restaurants/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }
}

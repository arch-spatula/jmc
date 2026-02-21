import type { Restaurant, SavePayload } from "./types";

export async function fetchRecommend(): Promise<Restaurant | null> {
  const response = await fetch("/api/restaurants/recommend");
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }
  const data = await response.json();
  return data;
}

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

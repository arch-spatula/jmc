export function scoreToEmoji(score: number): string {
  if (score === 5) return "🌟🌟🌟🌟🌟";
  if (score === 0) return "-";

  const full = Math.floor(score);
  const hasHalf = score % 1 !== 0;

  return "⭐".repeat(full) + (hasHalf ? "(반)" : "");
}

export interface RatingOption {
  value: number;
  label: string;
}

export const RATING_OPTIONS: RatingOption[] = Array.from(
  { length: 11 },
  (_, i) => {
    const value = i * 0.5;
    return { value, label: scoreToEmoji(value) };
  },
);

export function buildRatingSelect(selected: number): string {
  const options = RATING_OPTIONS.map(
    (opt) =>
      `<option value="${opt.value}"${opt.value === selected ? " selected" : ""}>${opt.label}</option>`,
  ).join("");
  return `<select class="rating-select">${options}</select>`;
}

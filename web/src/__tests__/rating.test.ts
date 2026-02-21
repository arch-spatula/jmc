import { describe, it, expect } from "vitest";
import { scoreToEmoji, RATING_OPTIONS, buildRatingSelect } from "../rating";

describe("scoreToEmoji", () => {
  const cases: [number, string][] = [
    [0, "-"],
    [0.5, "(반)"],
    [1, "⭐"],
    [1.5, "⭐(반)"],
    [2, "⭐⭐"],
    [2.5, "⭐⭐(반)"],
    [3, "⭐⭐⭐"],
    [3.5, "⭐⭐⭐(반)"],
    [4, "⭐⭐⭐⭐"],
    [4.5, "⭐⭐⭐⭐(반)"],
    [5, "🌟🌟🌟🌟🌟"],
  ];

  cases.forEach(([score, expected]) => {
    it(`${score}점 -> ${expected}`, () => {
      expect(scoreToEmoji(score)).toBe(expected);
    });
  });
});

describe("RATING_OPTIONS", () => {
  it("11개 옵션이 존재한다 (0~5, 0.5 단위)", () => {
    expect(RATING_OPTIONS).toHaveLength(11);
  });

  it("첫 옵션은 0점이다", () => {
    expect(RATING_OPTIONS[0]).toEqual({ value: 0, label: "-" });
  });

  it("마지막 옵션은 5점이다", () => {
    expect(RATING_OPTIONS[10]).toEqual({ value: 5, label: "🌟🌟🌟🌟🌟" });
  });
});

describe("buildRatingSelect", () => {
  it("select 태그를 반환한다", () => {
    const html = buildRatingSelect(3);
    expect(html).toContain("<select");
    expect(html).toContain("</select>");
  });

  it("선택된 값에 selected 속성이 있다", () => {
    const html = buildRatingSelect(4.5);
    expect(html).toContain('value="4.5" selected');
  });

  it("11개 option을 포함한다", () => {
    const html = buildRatingSelect(0);
    const count = (html.match(/<option/g) || []).length;
    expect(count).toBe(11);
  });
});

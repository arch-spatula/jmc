import { describe, it, expect } from "vitest";
import {
  createEmptyRow,
  readRow,
  attachRowEvents,
  collectPayload,
} from "../dom";

function makeRow(overrides: {
  status?: string;
  originalName?: string;
  name?: string;
  rating?: string;
  categories?: string;
  kakaoUrl?: string;
  visited?: boolean;
} = {}): HTMLTableRowElement {
  const tr = document.createElement("tr");
  tr.dataset.status = overrides.status ?? "";
  if (overrides.originalName) {
    tr.dataset.originalName = overrides.originalName;
  }
  tr.innerHTML = `
    <td class="col-check"><input type="checkbox" class="row-check"></td>
    <td contenteditable="true" data-field="name">${overrides.name ?? ""}</td>
    <td contenteditable="true" data-field="rating">${overrides.rating ?? ""}</td>
    <td contenteditable="true" data-field="categories">${overrides.categories ?? ""}</td>
    <td contenteditable="true" data-field="kakao_url">${overrides.kakaoUrl ?? ""}</td>
    <td class="col-visited" data-field="visited"><input type="checkbox" class="visited-check"${overrides.visited ? " checked" : ""}></td>
  `;
  return tr;
}

describe("createEmptyRow", () => {
  it("status가 new인 tr을 반환한다", () => {
    const tr = createEmptyRow();
    expect(tr.tagName).toBe("TR");
    expect(tr.dataset.status).toBe("new");
  });

  it("6개의 td를 포함한다", () => {
    const tr = createEmptyRow();
    expect(tr.querySelectorAll("td").length).toBe(6);
  });

  it("visited 체크박스를 포함한다", () => {
    const tr = createEmptyRow();
    expect(tr.querySelector(".visited-check")).not.toBeNull();
  });
});

describe("readRow", () => {
  it("행 데이터를 올바르게 읽는다", () => {
    const tr = makeRow({
      name: "테스트식당",
      rating: "⭐⭐⭐",
      categories: "한식, 분식",
      kakaoUrl: "https://example.com",
      visited: true,
    });

    const result = readRow(tr);
    expect(result).toEqual({
      name: "테스트식당",
      rating: "⭐⭐⭐",
      categories: ["한식", "분식"],
      kakao_url: "https://example.com",
      visited: true,
    });
  });

  it("빈 categories는 빈 배열을 반환한다", () => {
    const tr = makeRow({ name: "빈식당", rating: "⭐", kakaoUrl: "https://example.com" });
    const result = readRow(tr);
    expect(result.categories).toEqual([]);
  });

  it("visited 미체크시 false를 반환한다", () => {
    const tr = makeRow({ name: "식당", rating: "⭐", kakaoUrl: "https://example.com", visited: false });
    const result = readRow(tr);
    expect(result.visited).toBe(false);
  });
});

describe("attachRowEvents", () => {
  it("contenteditable 편집 시 status가 updated로 변경된다", () => {
    const tr = makeRow({ name: "식당" });
    attachRowEvents(tr);

    const nameCell = tr.querySelector<HTMLElement>("[data-field='name']")!;
    nameCell.dispatchEvent(new Event("input"));

    expect(tr.dataset.status).toBe("updated");
  });

  it("visited 체크 변경 시 status가 updated로 변경된다", () => {
    const tr = makeRow({ name: "식당" });
    attachRowEvents(tr);

    tr.querySelector<HTMLInputElement>(".visited-check")!.dispatchEvent(
      new Event("change"),
    );

    expect(tr.dataset.status).toBe("updated");
  });

  it("row-check 체크 시 status가 deleted로 변경된다", () => {
    const tr = makeRow({ name: "식당" });
    attachRowEvents(tr);

    const cb = tr.querySelector<HTMLInputElement>(".row-check")!;
    cb.checked = true;
    cb.dispatchEvent(new Event("change"));

    expect(tr.dataset.status).toBe("deleted");
    expect(tr.classList.contains("row-deleted")).toBe(true);
  });

  it("row-check 해제 시 status가 빈 문자열로 복원된다", () => {
    const tr = makeRow({ name: "식당" });
    attachRowEvents(tr);

    const cb = tr.querySelector<HTMLInputElement>(".row-check")!;
    cb.checked = true;
    cb.dispatchEvent(new Event("change"));
    cb.checked = false;
    cb.dispatchEvent(new Event("change"));

    expect(tr.dataset.status).toBe("");
    expect(tr.classList.contains("row-deleted")).toBe(false);
  });
});

describe("collectPayload", () => {
  function makeTbody(rows: HTMLTableRowElement[]): HTMLTableSectionElement {
    const tbody = document.createElement("tbody");
    rows.forEach((tr) => tbody.appendChild(tr));
    return tbody;
  }

  it("new 행을 수집한다", () => {
    const tr = makeRow({ status: "new", name: "새식당", rating: "⭐", categories: "한식", kakaoUrl: "https://a.com" });
    const payload = collectPayload(makeTbody([tr]));

    expect(payload.new).toHaveLength(1);
    expect(payload.new[0].name).toBe("새식당");
    expect(payload.update).toHaveLength(0);
    expect(payload.delete).toHaveLength(0);
  });

  it("updated 행을 수집한다", () => {
    const tr = makeRow({ status: "updated", name: "수정식당", rating: "⭐⭐", categories: "일식", kakaoUrl: "https://b.com" });
    const payload = collectPayload(makeTbody([tr]));

    expect(payload.update).toHaveLength(1);
    expect(payload.update[0].name).toBe("수정식당");
  });

  it("deleted 행은 originalName으로 수집한다", () => {
    const tr = makeRow({ status: "deleted", name: "삭제식당", originalName: "원래이름" });
    const payload = collectPayload(makeTbody([tr]));

    expect(payload.delete).toEqual(["원래이름"]);
  });

  it("상태 없는 행은 무시한다", () => {
    const tr = makeRow({ status: "", name: "변경없음", rating: "⭐", kakaoUrl: "https://c.com" });
    const payload = collectPayload(makeTbody([tr]));

    expect(payload.new).toHaveLength(0);
    expect(payload.update).toHaveLength(0);
    expect(payload.delete).toHaveLength(0);
  });

  it("혼합 상태를 올바르게 분류한다", () => {
    const newRow = makeRow({ status: "new", name: "새식당", rating: "⭐", categories: "한식", kakaoUrl: "https://a.com" });
    const updatedRow = makeRow({ status: "updated", name: "수정식당", rating: "⭐⭐", categories: "일식", kakaoUrl: "https://b.com" });
    const deletedRow = makeRow({ status: "deleted", name: "삭제식당", originalName: "삭제대상" });
    const unchangedRow = makeRow({ status: "", name: "그대로", rating: "⭐", kakaoUrl: "https://d.com" });

    const payload = collectPayload(makeTbody([newRow, updatedRow, deletedRow, unchangedRow]));

    expect(payload.new).toHaveLength(1);
    expect(payload.update).toHaveLength(1);
    expect(payload.delete).toEqual(["삭제대상"]);
  });
});

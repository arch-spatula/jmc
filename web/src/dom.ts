import type { Restaurant, SavePayload } from "./types";
import { buildRatingSelect } from "./rating";

export function createEmptyRow(): HTMLTableRowElement {
  const tr = document.createElement("tr");
  tr.dataset.status = "new";
  tr.innerHTML = `
    <td class="col-check"><input type="checkbox" class="row-check"></td>
    <td contenteditable="true" data-field="name"></td>
    <td data-field="rating">${buildRatingSelect(0)}</td>
    <td contenteditable="true" data-field="categories"></td>
    <td contenteditable="true" data-field="kakao_url"></td>
    <td class="col-visited" data-field="visited"><input type="checkbox" class="visited-check"></td>
  `;
  attachRowEvents(tr);
  return tr;
}

export function attachRowEvents(tr: HTMLTableRowElement): void {
  tr.querySelectorAll<HTMLTableCellElement>("td[contenteditable]").forEach(
    (td) => {
      td.addEventListener("input", () => {
        if (tr.dataset.status === "") {
          tr.dataset.status = "updated";
        }
      });
    },
  );

  const ratingSelect = tr.querySelector<HTMLSelectElement>(".rating-select");
  if (ratingSelect) {
    ratingSelect.addEventListener("change", () => {
      if (tr.dataset.status === "") {
        tr.dataset.status = "updated";
      }
    });
  }

  tr.querySelector<HTMLInputElement>(".visited-check")!.addEventListener(
    "change",
    () => {
      if (tr.dataset.status === "") {
        tr.dataset.status = "updated";
      }
    },
  );

  tr.querySelector<HTMLInputElement>(".row-check")!.addEventListener(
    "change",
    (e) => {
      const target = e.target as HTMLInputElement;
      if (target.checked) {
        tr.dataset.status = "deleted";
        tr.classList.add("row-deleted");
      } else {
        tr.dataset.status = "";
        tr.classList.remove("row-deleted");
      }
    },
  );
}

export function readRow(tr: HTMLTableRowElement): Restaurant {
  const name = tr
    .querySelector<HTMLElement>("[data-field='name']")!
    .textContent!.trim();
  const ratingSelect = tr.querySelector<HTMLSelectElement>(".rating-select");
  const rating = ratingSelect ? parseFloat(ratingSelect.value) : 0;
  const catText = tr
    .querySelector<HTMLElement>("[data-field='categories']")!
    .textContent!.trim();
  const categories = catText
    ? catText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const kakaoUrl = tr
    .querySelector<HTMLElement>("[data-field='kakao_url']")!
    .textContent!.trim();
  const visited = tr.querySelector<HTMLInputElement>(".visited-check")!.checked;
  return {
    name,
    rating,
    categories,
    kakao_url: kakaoUrl,
    visited,
  };
}

export function collectPayload(tbody: HTMLTableSectionElement): SavePayload {
  const rows = tbody.querySelectorAll<HTMLTableRowElement>("tr");
  const payload: SavePayload = { new: [], update: [], delete: [] };

  rows.forEach((tr) => {
    const status = tr.dataset.status;

    if (status === "new") {
      payload.new.push(readRow(tr));
    } else if (status === "updated") {
      payload.update.push(readRow(tr));
    } else if (status === "deleted") {
      const name =
        tr.dataset.originalName ||
        tr.querySelector<HTMLElement>("[data-field='name']")!.textContent!.trim();
      if (name) {
        payload.delete.push(name);
      }
    }
  });

  return payload;
}

export function initRatingSelects(container: HTMLElement): void {
  container
    .querySelectorAll<HTMLSelectElement>(".rating-select[data-value]")
    .forEach((select) => {
      select.value = select.dataset.value!;
    });
}

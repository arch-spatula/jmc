import type { Restaurant, Menu, SavePayload } from "./types";
import { buildRatingSelect } from "./rating";

export function createEmptyRow(): HTMLTableRowElement {
  const tr = document.createElement("tr");
  tr.classList.add("restaurant-row");
  tr.dataset.status = "new";
  tr.innerHTML = `
    <td class="col-visited" data-field="visited"><input type="checkbox" class="visited-check"></td>
    <td contenteditable="true" data-field="name"></td>
    <td class="col-menu"><button type="button" class="btn-add-menu">+</button></td>
    <td data-field="rating">${buildRatingSelect(0)}</td>
    <td contenteditable="true" data-field="categories"></td>
    <td contenteditable="true" data-field="kakao_url"></td>
    <td contenteditable="true" data-field="description"></td>
    <td class="col-delete"><input type="checkbox" class="row-check"></td>
  `;
  attachRowEvents(tr);
  return tr;
}

export function createMenuRow(): HTMLTableRowElement {
  const tr = document.createElement("tr");
  tr.classList.add("menu-row");
  tr.dataset.status = "new-menu";
  tr.innerHTML = `
    <td class="col-visited" data-field="menu-visited"><input type="checkbox" class="menu-visited-check"></td>
    <td contenteditable="true" data-field="menu-name"></td>
    <td contenteditable="true" data-field="menu-price"></td>
    <td data-field="menu-rating">${buildRatingSelect(0)}</td>
    <td></td>
    <td></td>
    <td contenteditable="true" data-field="menu-description"></td>
    <td class="col-delete"><input type="checkbox" class="menu-check"></td>
  `;
  attachMenuRowEvents(tr);
  return tr;
}

export function formatPrice(n: number): string {
  if (!n && n !== 0) return "";
  return n.toLocaleString("ko-KR");
}

export function formatPriceCell(td: HTMLElement): void {
  const raw = td.textContent?.trim().replace(/,/g, "") ?? "";
  const n = parseInt(raw, 10);
  if (!isNaN(n) && n > 0) {
    td.textContent = formatPrice(n);
  }
}

function readTextWithBreaks(el: HTMLElement): string {
  return el.innerHTML
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function handlePlainTextPaste(e: ClipboardEvent): void {
  e.preventDefault();
  const text = e.clipboardData?.getData("text/plain") ?? "";
  document.execCommand("insertText", false, text);
}

export function attachRowEvents(tr: HTMLTableRowElement): void {
  tr.querySelectorAll<HTMLTableCellElement>("td[contenteditable]").forEach(
    (td) => {
      td.addEventListener("paste", handlePlainTextPaste as EventListener);
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

  const visitedCheck = tr.querySelector<HTMLInputElement>(".visited-check");
  if (visitedCheck) {
    visitedCheck.addEventListener("change", () => {
      if (tr.dataset.status === "") {
        tr.dataset.status = "updated";
      }
    });
  }

  const rowCheck = tr.querySelector<HTMLInputElement>(".row-check");
  if (rowCheck) {
    rowCheck.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.checked) {
        tr.dataset.status = "deleted";
        tr.classList.add("row-deleted");
      } else {
        tr.dataset.status = "";
        tr.classList.remove("row-deleted");
      }
    });
  }
}

function markMenuRowUpdated(tr: HTMLTableRowElement): void {
  if (tr.dataset.status === "") {
    tr.dataset.status = "updated-menu";
  }
  markParentUpdated(tr);
}

export function attachMenuRowEvents(tr: HTMLTableRowElement): void {
  tr.querySelectorAll<HTMLTableCellElement>("td[contenteditable]").forEach(
    (td) => {
      td.addEventListener("paste", handlePlainTextPaste as EventListener);
      td.addEventListener("input", () => {
        markMenuRowUpdated(tr);
      });
    },
  );

  const priceCell = tr.querySelector<HTMLElement>("[data-field='menu-price']");
  if (priceCell) {
    priceCell.addEventListener("focus", () => {
      const raw = priceCell.textContent?.trim().replace(/,/g, "") ?? "";
      if (raw !== priceCell.textContent?.trim()) {
        priceCell.textContent = raw;
      }
    });
    priceCell.addEventListener("blur", () => {
      formatPriceCell(priceCell);
    });
  }

  const menuRatingSelect = tr.querySelector<HTMLSelectElement>(".rating-select");
  if (menuRatingSelect) {
    menuRatingSelect.addEventListener("change", () => {
      markMenuRowUpdated(tr);
    });
  }

  const menuVisitedCheck = tr.querySelector<HTMLInputElement>(
    ".menu-visited-check",
  );
  if (menuVisitedCheck) {
    menuVisitedCheck.addEventListener("change", () => {
      markMenuRowUpdated(tr);
    });
  }

  const menuCheck = tr.querySelector<HTMLInputElement>(".menu-check");
  if (menuCheck) {
    menuCheck.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.checked) {
        tr.classList.add("row-deleted");
      } else {
        tr.classList.remove("row-deleted");
      }
      markMenuRowUpdated(tr);
    });
  }
}

function markParentUpdated(menuRow: HTMLTableRowElement): void {
  let prev = menuRow.previousElementSibling as HTMLElement | null;
  while (prev) {
    if (prev.classList.contains("restaurant-row")) {
      if ((prev as HTMLTableRowElement).dataset.status === "") {
        (prev as HTMLTableRowElement).dataset.status = "updated";
      }
      return;
    }
    prev = prev.previousElementSibling as HTMLElement | null;
  }
}

export function getMenuRows(
  restaurantRow: HTMLTableRowElement,
): HTMLTableRowElement[] {
  const rows: HTMLTableRowElement[] = [];
  let sibling = restaurantRow.nextElementSibling;
  while (sibling) {
    if (sibling.classList.contains("restaurant-row")) break;
    if (sibling.classList.contains("menu-row")) {
      rows.push(sibling as HTMLTableRowElement);
    }
    sibling = sibling.nextElementSibling;
  }
  return rows;
}

export function readMenuRow(tr: HTMLTableRowElement): Menu | null {
  const menuCheck = tr.querySelector<HTMLInputElement>(".menu-check");
  if (menuCheck && menuCheck.checked) return null;

  const name = tr
    .querySelector<HTMLElement>("[data-field='menu-name']")!
    .textContent!.trim();
  const ratingSelect = tr.querySelector<HTMLSelectElement>(".rating-select");
  const rating = ratingSelect ? parseFloat(ratingSelect.value) : 0;
  const priceText = tr
    .querySelector<HTMLElement>("[data-field='menu-price']")!
    .textContent!.trim()
    .replace(/,/g, "");
  const price = priceText ? parseInt(priceText, 10) || 0 : 0;
  const description = readTextWithBreaks(
    tr.querySelector<HTMLElement>("[data-field='menu-description']")!,
  );
  const visited =
    tr.querySelector<HTMLInputElement>(".menu-visited-check")?.checked ?? false;

  return { name, rating, price, description, visited };
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
  const description = readTextWithBreaks(
    tr.querySelector<HTMLElement>("[data-field='description']")!,
  );

  const menuRows = getMenuRows(tr);
  const menus: Menu[] = [];
  for (const menuTr of menuRows) {
    const menu = readMenuRow(menuTr);
    if (menu) menus.push(menu);
  }

  return {
    name,
    rating,
    categories,
    kakao_url: kakaoUrl,
    visited,
    description,
    menus,
  };
}

export function collectPayload(tbody: HTMLTableSectionElement): SavePayload {
  const rows = tbody.querySelectorAll<HTMLTableRowElement>("tr.restaurant-row");
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

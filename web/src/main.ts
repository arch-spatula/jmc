import "./style.css";
import {
  createEmptyRow,
  createMenuRow,
  attachRowEvents,
  attachMenuRowEvents,
  collectPayload,
  initRatingSelects,
  getMenuRows,
} from "./dom";
import { saveBatch } from "./api";

const tbody = document.querySelector<HTMLTableSectionElement>("#table-body")!;
const btnAdd = document.querySelector<HTMLButtonElement>("#btn-add")!;
const btnSave = document.querySelector<HTMLButtonElement>("#btn-save")!;

btnAdd.addEventListener("click", () => {
  const row = createEmptyRow();
  tbody.insertBefore(row, tbody.firstChild);
});

tbody.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (!target.classList.contains("btn-add-menu")) return;

  const restaurantRow = target.closest<HTMLTableRowElement>(".restaurant-row");
  if (!restaurantRow) return;

  const menuRows = getMenuRows(restaurantRow);
  const insertAfter =
    menuRows.length > 0 ? menuRows[menuRows.length - 1] : restaurantRow;
  const newMenuRow = createMenuRow();
  insertAfter.after(newMenuRow);

  if (restaurantRow.dataset.status === "") {
    restaurantRow.dataset.status = "updated";
  }
});

btnSave.addEventListener("click", async () => {
  const payload = collectPayload(tbody);

  try {
    await saveBatch(payload);
    location.reload();
  } catch (err) {
    alert("저장 실패: " + (err as Error).message);
  }
});

initRatingSelects(tbody);
tbody
  .querySelectorAll<HTMLTableRowElement>("tr.restaurant-row")
  .forEach(attachRowEvents);
tbody
  .querySelectorAll<HTMLTableRowElement>("tr.menu-row")
  .forEach(attachMenuRowEvents);

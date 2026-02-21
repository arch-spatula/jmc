import "./style.css";
import {
  createEmptyRow,
  attachRowEvents,
  collectPayload,
  initRatingSelects,
} from "./dom";
import { saveBatch } from "./api";

const tbody = document.querySelector<HTMLTableSectionElement>("#table-body")!;
const btnAdd = document.querySelector<HTMLButtonElement>("#btn-add")!;
const btnSave = document.querySelector<HTMLButtonElement>("#btn-save")!;
const checkAll = document.querySelector<HTMLInputElement>("#check-all")!;

btnAdd.addEventListener("click", () => {
  const row = createEmptyRow();
  tbody.insertBefore(row, tbody.firstChild);
});

checkAll.addEventListener("change", () => {
  const checked = checkAll.checked;
  tbody.querySelectorAll<HTMLInputElement>(".row-check").forEach((cb) => {
    cb.checked = checked;
    cb.dispatchEvent(new Event("change"));
  });
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
tbody.querySelectorAll<HTMLTableRowElement>("tr").forEach(attachRowEvents);

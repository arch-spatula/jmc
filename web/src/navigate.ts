function getFocusableInCell(td: HTMLTableCellElement): HTMLElement | null {
  const editable = td.querySelector<HTMLElement>("[contenteditable='true']");
  if (editable) return editable;
  if (td.getAttribute("contenteditable") === "true") return td;

  const select = td.querySelector<HTMLSelectElement>("select");
  if (select) return select;

  const checkbox = td.querySelector<HTMLInputElement>("input[type='checkbox']");
  if (checkbox) return checkbox;

  const textInput = td.querySelector<HTMLInputElement>("input[type='text']");
  if (textInput) return textInput;

  return null;
}

function getCellIndex(td: HTMLTableCellElement): { row: number; col: number } {
  const tr = td.closest("tr")!;
  const tbody = tr.closest("tbody") ?? tr.closest("table")!;
  const rows = Array.from(tbody.querySelectorAll("tr"));
  const row = rows.indexOf(tr);
  const col = Array.from(tr.children).indexOf(td);
  return { row, col };
}

function focusCell(
  tbody: HTMLElement,
  row: number,
  col: number,
): boolean {
  const rows = Array.from(tbody.querySelectorAll("tr"));
  if (row < 0 || row >= rows.length) return false;

  const cells = Array.from(rows[row].children) as HTMLTableCellElement[];
  if (col < 0 || col >= cells.length) return false;

  const target = getFocusableInCell(cells[col]);
  if (target) {
    target.focus();
    return true;
  }
  return false;
}

function isAtStart(el: HTMLElement): boolean {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return true;
  const range = sel.getRangeAt(0);
  return range.collapsed && range.startOffset === 0;
}

function isAtEnd(el: HTMLElement): boolean {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return true;
  const range = sel.getRangeAt(0);
  if (!range.collapsed) return false;
  const len = el.textContent?.length ?? 0;
  return range.startOffset >= len;
}

function findNextFocusableCol(
  tbody: HTMLElement,
  row: number,
  startCol: number,
  direction: 1 | -1,
): { row: number; col: number } | null {
  const rows = Array.from(tbody.querySelectorAll("tr"));
  if (row < 0 || row >= rows.length) return null;

  const cells = Array.from(rows[row].children) as HTMLTableCellElement[];
  let col = startCol + direction;

  while (col >= 0 && col < cells.length) {
    if (getFocusableInCell(cells[col])) {
      return { row, col };
    }
    col += direction;
  }
  return null;
}

export function initKeyboardNavigation(table: HTMLTableElement): void {
  const tbody = table.querySelector("tbody") ?? table;

  table.addEventListener("keydown", (e: KeyboardEvent) => {
    const key = e.key;
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
      return;
    }

    const active = document.activeElement as HTMLElement | null;
    if (!active) return;

    const td = active.closest("td") as HTMLTableCellElement | null;
    if (!td || !table.contains(td)) return;

    const { row, col } = getCellIndex(td);
    const isEditable = active.getAttribute("contenteditable") === "true";

    if (key === "ArrowUp") {
      e.preventDefault();
      for (let r = row - 1; r >= 0; r--) {
        if (focusCell(tbody, r, col)) break;
      }
    } else if (key === "ArrowDown") {
      e.preventDefault();
      const rows = tbody.querySelectorAll("tr");
      for (let r = row + 1; r < rows.length; r++) {
        if (focusCell(tbody, r, col)) break;
      }
    } else if (key === "ArrowLeft") {
      if (isEditable && !isAtStart(active)) return;
      e.preventDefault();
      const next = findNextFocusableCol(tbody, row, col, -1);
      if (next) focusCell(tbody, next.row, next.col);
    } else if (key === "ArrowRight") {
      if (isEditable && !isAtEnd(active)) return;
      e.preventDefault();
      const next = findNextFocusableCol(tbody, row, col, 1);
      if (next) focusCell(tbody, next.row, next.col);
    }
  });
}

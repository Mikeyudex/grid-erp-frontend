const STORAGE_PREFIX = "table-column-widths";

export const loadColumnWidths = (tableId) => {
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}:${tableId}`);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

export const saveColumnWidths = (tableId, widths) => {
  localStorage.setItem(
    `${STORAGE_PREFIX}:${tableId}`,
    JSON.stringify(widths)
  );
};

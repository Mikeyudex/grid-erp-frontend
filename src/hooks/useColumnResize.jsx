import { useRef, useState } from "react";
import { loadColumnWidths, saveColumnWidths } from "../helpers/utils/columnWidthStorage";
import { autoFitColumn } from "../helpers/utils/autoFitColumn";

export const useColumnResize = (tableId) => {
  const [columnWidths, setColumnWidths] = useState(() =>
    loadColumnWidths(tableId)
  );

  const resizingCol = useRef(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const onPointerDownResize = (e, columnKey) => {
    resizingCol.current = columnKey;
    startX.current = e.clientX;
    startWidth.current =
      columnWidths[columnKey] || e.currentTarget.parentElement.offsetWidth;

    document.body.style.cursor = "col-resize";
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = (e) => {
    if (!resizingCol.current) return;

    const delta = e.clientX - startX.current;

    setColumnWidths(prev => {
      const updated = {
        ...prev,
        [resizingCol.current]: Math.max(80, startWidth.current + delta),
      };
      saveColumnWidths(tableId, updated);
      return updated;
    });
  };

  const onPointerUp = () => {
    resizingCol.current = null;
    document.body.style.cursor = "default";
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
  };

  // ⭐ AUTO-FIT
  const onAutoFit = (columnKey) => {
    const width = autoFitColumn(columnKey);

    setColumnWidths(prev => {
      const updated = { ...prev, [columnKey]: width };
      saveColumnWidths(tableId, updated);
      return updated;
    });
  };

  return {
    columnWidths,
    onPointerDownResize,
    onAutoFit,
  };
};

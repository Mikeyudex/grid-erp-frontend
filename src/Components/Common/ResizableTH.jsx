import "./css/ResizableTH.css";

export const ResizableTH = ({
  columnKey,
  width = 160,
  label,
  onSort,
  sortDirection,
  onResizeStart,
  onAutoFit,
}) => (
  <th
    className="resizable-th"
    data-column-key={columnKey}
    style={{ width }}
  >
    <div
      className="th-content"
      onClick={onSort}
      style={{ cursor: onSort ? "pointer" : "default" }}
    >
      {label}
      {sortDirection && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
    </div>

    <div
      className="resize-handle"
      onPointerDown={(e) => {
        e.stopPropagation();
        onResizeStart(e, columnKey);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onAutoFit(columnKey);
      }}
    />
  </th>
);
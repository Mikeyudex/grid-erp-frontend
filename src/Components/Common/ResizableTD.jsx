import React from "react";
import "./css/ResizableTH.css";

export const ResizableTD = ({
  width = 160,
  children,
  className = "",
  columnKey,
}) => (
  <td
    data-column-key={columnKey}
    className={`resizable-td ${className}`}
    style={{
      width,
      maxWidth: width,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }}
  >
    {children}
  </td>
);

export const autoFitColumn = (columnKey, minWidth = 80) => {
  const cells = document.querySelectorAll(
    `[data-column-key="${columnKey}"]`
  );

  let maxWidth = minWidth;

  cells.forEach((cell) => {
    const clone = cell.cloneNode(true);
    clone.style.width = "auto";
    clone.style.position = "absolute";
    clone.style.visibility = "hidden";
    clone.style.whiteSpace = "nowrap";

    document.body.appendChild(clone);
    maxWidth = Math.max(maxWidth, clone.offsetWidth + 16);
    document.body.removeChild(clone);
  });

  return maxWidth;
};

// components/DropdownPortal.jsx
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

export default function DropdownPortal({ children, targetRef, onClickOutside }) {
  const portalRoot = document.getElementById("portal-root");
  const dropdownRef = useRef(null);
  const [styles, setStyles] = useState({});

  useEffect(() => {
    const rect = targetRef.current?.getBoundingClientRect();
    if (rect) {
      setStyles({
        position: "absolute",
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 9999,
        backgroundColor: "white",
      });
    }

    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !targetRef.current?.contains(e.target)
      ) {
        onClickOutside?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [targetRef]);

  if (!portalRoot) return null;

  return ReactDOM.createPortal(
    <div ref={dropdownRef} style={styles} className="border rounded shadow-sm">
      {children}
    </div>,
    portalRoot
  );
}

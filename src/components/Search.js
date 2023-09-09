import { useEffect, useRef } from "react";
import { useKey } from "./custom effects/useKey";

export default function Search({ query, setQuery }) {
  const inputEl = useRef(null);
  useKey("Enter", setQuery);
  useEffect(
    function () {
      if (document.activeElement === inputEl.current) return;
      function callback(e) {
        if (e.code === "Enter") {
          inputEl.current.focus();
          setQuery("");
        }
      }
      document.addEventListener("keydown", callback);
      return () => document.addEventListener("keydown", callback);
    },
    [setQuery]
  );
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

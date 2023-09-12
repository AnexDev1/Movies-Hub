import { useEffect } from "react";

export function useKey(key, callback) {
  useEffect(
    function () {
      function callbacks(e) {
        if (e.code === key) {
          callback();
        }
      }

      document.addEventListener("keydown", callbacks);

      return function () {
        document.removeEventListener("keydown", callbacks);
      };
    },
    [callback, key]
  );
}

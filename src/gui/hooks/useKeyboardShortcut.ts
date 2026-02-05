/**
 * Credits to Barry Michael Doyle https://dev.to/barrymichaeldoyle/how-to-build-a-custom-react-hook-to-listen-for-keyboard-events-32b4
 */
import { useEffect } from "react";

interface UseKeyboardShortcutArgs {
  keys: string[];
  onKeyPressed: (key: string) => void;
}

export function useKeyboardShortcut({ keys, onKeyPressed }: UseKeyboardShortcutArgs) {
  useEffect(() => {
    function keyDownHandler(e: globalThis.KeyboardEvent) {
      if (keys.includes(e.key)) {
        onKeyPressed(e.key);
      }
    }

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [keys, onKeyPressed]); // because onKeyPressed is a callback, its value can change with rerenders, so we need to pass it as a dependency
}

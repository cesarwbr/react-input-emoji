// @ts-check

import { useCallback, useEffect, useRef } from "react";

// eslint-disable-next-line valid-jsdoc
/**
 * useEmit
 * @param {React.MutableRefObject<import('../text-input').Ref | null>} textInputRef
 * @param {(size: {width: number, height: number}) => void} onResize
 * @param {(text: string) => void} onChange
 */
export function useEmit(textInputRef, onResize, onChange) {
  /** @type {React.MutableRefObject<{width: number; height: number} | null>} */
  const currentSizeRef = useRef(null);
  const onChangeFn = useRef(onChange);

  const checkAndEmitResize = useCallback(() => {
    if (textInputRef.current !== null) {
      const currentSize = currentSizeRef.current;

      const nextSize = textInputRef.current.size;

      if (
        (!currentSize ||
          currentSize.width !== nextSize.width ||
          currentSize.height !== nextSize.height) &&
        typeof onResize === "function"
      ) {
        onResize(nextSize);
      }

      currentSizeRef.current = nextSize;
    }
  }, [onResize, textInputRef]);

  const emitChange = useCallback((sanitizedText) => {
    if (typeof onChangeFn.current === "function") {
      onChangeFn.current(sanitizedText);
    }

    if (typeof onResize === "function") {
      checkAndEmitResize();
    }
  }, [checkAndEmitResize, onResize]);

  useEffect(() => {
    if (textInputRef.current) {
      checkAndEmitResize();
    }
  }, [checkAndEmitResize, textInputRef]);

  return emitChange;
}

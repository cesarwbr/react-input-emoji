// @ts-check

import { useCallback, useEffect, useRef } from "react";

// eslint-disable-next-line valid-jsdoc
/**
 * useEmit
 * @param {React.MutableRefObject<HTMLDivElement>} textInputRef
 * @param {(size: {width: number, height: number}) => void} onResize
 * @param {(text: string) => void} onChange
 * @param {React.MutableRefObject<string>} cleanedTextRef
 */
export function useEmit(textInputRef, onResize, onChange, cleanedTextRef) {
  const currentSizeRef = useRef(null);
  const onChangeFn = useRef(onChange);

  const checkAndEmitResize = useCallback(() => {
    if (textInputRef.current) {
      const currentSize = currentSizeRef.current;

      const nextSize = {
        width: textInputRef.current.offsetWidth,
        height: textInputRef.current.offsetHeight
      };

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

  const emitChange = useCallback(() => {
    if (typeof onChangeFn.current === "function") {
      onChangeFn.current(cleanedTextRef.current);
    }

    if (typeof onResize === "function") {
      checkAndEmitResize();
    }
  }, [checkAndEmitResize, cleanedTextRef, onResize]);

  useEffect(() => {
    if (textInputRef.current) {
      checkAndEmitResize();
    }
  }, [checkAndEmitResize, textInputRef]);

  return emitChange;
}

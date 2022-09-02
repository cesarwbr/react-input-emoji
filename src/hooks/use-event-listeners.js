// @ts-check

import { useCallback, useMemo } from "react";
import { createObserver } from "../utils/observer";

/**
 * @typedef {import('../types/types').TextInputListeners} TextInputListeners
 */

// eslint-disable-next-line valid-jsdoc
/** */
export function useEventListeners() {
  /** @type {TextInputListeners} */
  const listeners = useMemo(
    () => ({
      keyDown: createObserver(),
      keyUp: createObserver(),
      arrowUp: createObserver(),
      arrowDown: createObserver(),
      enter: createObserver(),
      focus: createObserver(),
      blur: createObserver()
    }),
    []
  );

  /**
   * @template {keyof TextInputListeners} T, K
   * @type {(event: keyof TextInputListeners, fn: import('../types/types').Listerner<any>) => () => void}
   */
  const addEventListener = useCallback(
    (event, fn) => {
      return listeners[event].subscribe(fn);
    },
    [listeners]
  );

  return { addEventListener, listeners };
}

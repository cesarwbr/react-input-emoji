// @ts-check

import { useCallback, useRef } from "react";

/**
 * @typedef {import('../types/types').PolluteFn} PolluteFn
 */

// eslint-disable-next-line valid-jsdoc
/** */
export function usePollute() {
  /** @type {React.MutableRefObject<PolluteFn[]>} */
  const polluteFnsRef = useRef([]);

  /** @type {(fn: PolluteFn) => void} */
  const addPolluteFn = useCallback(fn => {
    polluteFnsRef.current.push(fn);
  }, []);

  /** @type {(html: string) => string} */
  const pollute = useCallback(text => {
    const result = polluteFnsRef.current.reduce((acc, fn) => {
      return fn(acc);
    }, text);

    return result;
  }, []);

  return { addPolluteFn, pollute };
}

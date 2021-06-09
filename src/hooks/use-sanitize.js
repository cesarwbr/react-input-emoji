// @ts-check

import { useCallback, useRef } from "react";

/**
 * @typedef {import('../types/types').SanitizeFn} SanitizeFn
 */

// eslint-disable-next-line valid-jsdoc
/** */
export function useSanitize() {
  /** @type {React.MutableRefObject<SanitizeFn[]>} */
  const sanitizeFnsRef = useRef([]);

  const sanitizedTextRef = useRef("");

  /** @type {(fn: SanitizeFn) => void} */
  const addSanitizeFn = useCallback(fn => {
    sanitizeFnsRef.current.push(fn);
  }, []);

  /** @type {(html: string) => string} */
  const sanitize = useCallback(html => {
    let result = sanitizeFnsRef.current.reduce((acc, fn) => {
      return fn(acc);
    }, html);

    result = replaceAllHtmlToString(result);

    sanitizedTextRef.current = result;

    return result;
  }, []);

  return { addSanitizeFn, sanitize, sanitizedTextRef };
}

/**
 *
 * @param {string} html
 * @return {string}
 */
export function replaceAllHtmlToString(html) {
  const container = document.createElement("div");
  container.innerHTML = html;

  let text = container.innerText || "";

  // remove all ↵ for safari
  text = text.replace(/\n/gi, "");

  return text;
}

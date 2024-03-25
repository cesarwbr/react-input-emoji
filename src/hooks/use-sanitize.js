// @ts-check

import { useCallback, useRef } from "react";
import { removeHtmlExceptBr } from "../utils/input-event-utils";

/**
 * @typedef {import('../types/types').SanitizeFn} SanitizeFn
 */

// eslint-disable-next-line valid-jsdoc
/**
 * @param {boolean} shouldReturn
 */
export function useSanitize(shouldReturn) {
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

    result = replaceAllHtmlToString(result, shouldReturn);

    sanitizedTextRef.current = result;

    return result;
  }, []);

  return { addSanitizeFn, sanitize, sanitizedTextRef };
}

/**
 *
 * @param {string} html
 * @param {boolean} shouldReturn
 * @return {string}
 */
export function replaceAllHtmlToString(html, shouldReturn) {
  const container = document.createElement("div");
  container.innerHTML = html;
  let text
  if(shouldReturn) {
    text = removeHtmlExceptBr(container)
  } else {
    text = container.innerText || "";
  }

  // remove all ↵ for safari
  text = text.replace(/\n/gi, "");

  const tempContainer = document.createElement("div");
  tempContainer.innerHTML = text;

  return tempContainer.innerText || "";
}

// @ts-check

import {
  replaceAllTextEmojis,
  replaceAllTextEmojiToString
} from "./emoji-utils";

/**
 * Handle copy of current selected text
 * @param {ClipboardEvent} event
 */
export function handleCopy(event) {
  const selectedText = window.getSelection();

  let container = document.createElement("div");

  for (let i = 0, len = selectedText.rangeCount; i < len; ++i) {
    container.appendChild(selectedText.getRangeAt(i).cloneContents());
  }

  container = replaceEmojiToString(container);

  event.clipboardData.setData("text", container.innerText);
  event.preventDefault();
}

/**
 * Replace emoji img to its string value
 * @param {HTMLDivElement} container
 * @return {HTMLDivElement}
 */
function replaceEmojiToString(container) {
  const images = Array.prototype.slice.call(container.querySelectorAll("img"));

  images.forEach(image => {
    image.outerHTML = image.dataset.emoji;
  });

  return container;
}

/**
 * Handle past on input
 * @param {ClipboardEvent} event
 */
export function handlePaste(event) {
  event.preventDefault();
  let content;
  if (event.clipboardData) {
    content = event.clipboardData.getData("text/plain");
    content = replaceAllTextEmojis(content);
    document.execCommand("insertHTML", false, content);
  }
}

/**
 * @typedef {object} HandleKeyDownOptions
 * @property {HTMLDivElement} placeholderEl
 * @property {number} maxLength
 * @property {HTMLDivElement} inputEl
 * @property {React.MutableRefObject<string>} cleanedTextRef
 * @property {boolean} cleanOnEnter
 * @property {function(): void} emitChange
 * @property {(function(string): void)=} onEnter
 * @property {(function(KeyboardEvent): void)=} onKeyDown
 * @property {(function(string): void)} updateHTML
 */

/**
 * Handle keydown event
 * @param {HandleKeyDownOptions} options
 * @return {function(KeyboardEvent): void}
 */
export function handleKeydown({
  placeholderEl,
  maxLength,
  inputEl,
  cleanedTextRef,
  emitChange,
  onEnter,
  onKeyDown,
  updateHTML,
  cleanOnEnter
}) {
  return event => {
    placeholderEl.style.opacity = "0";

    if (
      typeof maxLength !== "undefined" &&
      event.keyCode !== 8 &&
      totalCharacters(inputEl) >= maxLength
    ) {
      event.preventDefault();
    }

    if (event.keyCode === 13) {
      event.preventDefault();

      replaceAllTextEmojiToString(
        inputEl,
        cleanedTextRef,
        placeholderEl,
        emitChange
      );

      const cleanedText = cleanedTextRef.current;

      if (typeof onEnter === "function") {
        onEnter(cleanedText);
      }

      if (cleanOnEnter) {
        updateHTML("");
      }

      if (typeof onKeyDown === "function") {
        onKeyDown(event);
      }

      return false;
    }

    if (typeof onKeyDown === "function") {
      onKeyDown(event);
    }

    return true;
  };
}

/**
 *
 * @param {HTMLDivElement} inputEl
 * @return {number}
 */
function totalCharacters(inputEl) {
  const text = inputEl.innerText;
  const html = inputEl.innerHTML;

  const textCount = text.length;
  const emojisCount = (html.match(/<img/g) || []).length;

  return textCount + emojisCount;
}

/**
 * Handle keyup event
 * @param {function(): void} replaceAllTextEmojiToStringDebounced
 * @return {function(KeyboardEvent): void}
 */
export function handleKeyup(replaceAllTextEmojiToStringDebounced) {
  return () => {
    replaceAllTextEmojiToStringDebounced();
  };
}

/**
 * Handle focus event
 * @param {function(FocusEvent): void} onFocus
 * @return {function(FocusEvent): void}
 */
export function handleFocus(onFocus) {
  return event => {
    onFocus(event);
  };
}

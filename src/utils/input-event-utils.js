// @ts-check

import {
  getImageEmoji,
  replaceAllTextEmojis,
  replaceAllTextEmojiToString
} from "./emoji-utils";

/**
 * Handle copy of current selected text
 * @param {React.ClipboardEvent} event
 */
export function handleCopy(event) {
  const selectedText = window.getSelection();

  if (selectedText === null) {
    return
  }

  let container = document.createElement("div");

  for (let i = 0, len = selectedText.rangeCount; i < len; ++i) {
    container.appendChild(selectedText.getRangeAt(i).cloneContents());
  }

  container = replaceEmojiToString(container);

  event.clipboardData.setData("text", container.innerText);
  event.preventDefault();
}

/**
 *
 * @param {string} html
 */
export function handlePasteHtmlAtCaret(html) {
  let sel;
  let range;
  if (window.getSelection) {
    // IE9 and non-IE
    sel = window.getSelection();

    if (sel === null) return

    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0);
      range.deleteContents();

      // Range.createContextualFragment() would be useful here but is
      // non-standard and not supported in all browsers (IE9, for one)
      const el = document.createElement("div");
      el.innerHTML = html;
      const frag = document.createDocumentFragment();
      let node;
      let lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);

      // Preserve the selection
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }
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
 * @param {React.ClipboardEvent} event
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
 * @property {React.MutableRefObject<HTMLDivElement>} textInputRef
 * @property {boolean} cleanOnEnter
 * @property {function(): void} emitChange
 * @property {(function(string): void)=} onEnter
 * @property {(function(KeyboardEvent): void)=} onKeyDown
 * @property {(function(string): void)} updateHTML
 */

// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {Object} HandleSelectEmojiProps
 * @property {import("../types/types").EmojiMartItem} emoji
 * @property {React.MutableRefObject<import('../text-input').Ref>} textInputRef
 * @property {boolean} keepOpened
 * @property {() => void} toggleShowPicker
 * @property {number=} maxLength
 */

/**
 *
 * @param {HandleSelectEmojiProps} props
 */
export function handleSelectEmoji({
  emoji,
  textInputRef,
  keepOpened,
  toggleShowPicker,
  maxLength
}) {
  if (
    typeof maxLength !== "undefined" &&
    totalCharacters(textInputRef.current) >= maxLength
  ) {
    return;
  }

  textInputRef.current.appendContent(getImageEmoji(emoji));

  if (!keepOpened) {
    toggleShowPicker();
  }
}

/**
 *
 * @param {{text: string, html: string}} props
 * @return {number}
 */
export function totalCharacters({ text, html }) {
  const textCount = text.length;
  const emojisCount = (html.match(/<img/g) || []).length;

  return textCount + emojisCount;
}

// eslint-disable-next-line valid-jsdoc
/**
 * Handle keyup event
 * @param {() => void} emitChange
 * @param {(event: KeyboardEvent) => void} onKeyDownMention
 * @param {React.MutableRefObject<string>} cleanedTextRef
 * @param {React.MutableRefObject<HTMLDivElement>} textInputRef
 * @return {(event: KeyboardEvent) => void}
 */
export function handleKeyup(
  emitChange,
  onKeyDownMention,
  cleanedTextRef,
  textInputRef
) {
  return event => {
    const text = replaceAllTextEmojiToString(textInputRef.current.innerHTML);
    cleanedTextRef.current = text;
    emitChange();
    onKeyDownMention(event);
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

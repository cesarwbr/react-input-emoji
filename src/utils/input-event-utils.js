// @ts-check

import {
  getImageEmoji,
  replaceAllTextEmojis,
  replaceAllTextEmojiToString,
} from "./emoji-utils";

/**
 * Handle copy of current selected text
 * @param {React.ClipboardEvent} event
 */
export function handleCopy(event) {
  const selectedText = window.getSelection();

  if (selectedText === null) {
    return;
  }

  let container = document.createElement("div");

  for (let i = 0, len = selectedText.rangeCount; i < len; ++i) {
    container.appendChild(selectedText.getRangeAt(i).cloneContents());
  }

  container = replaceEmojiToString(container);

  event.clipboardData.setData("text", container.innerText);
  event.preventDefault();
}

/** @type {Range|undefined} */
/** @type {Range|undefined} */
let currentRangeCached;

/**
 * Caches the current text selection range
 */
export function cacheCurrentRange() {
  const selection = window.getSelection();
  if (!selection.rangeCount || (selection?.anchorNode['className'] !== 'react-input-emoji--input' && selection.anchorNode.parentNode['className'] !== 'react-input-emoji--input')) return;
  const range = selection.getRangeAt(0);

  currentRangeCached = range.cloneRange();
}

/**
 * Clears the cached text selection range
 */
export function cleanCurrentRange() {
  currentRangeCached = undefined;
}

/**
 * @param {string} html - HTML string to be pasted at the caret position
 */
export function handlePasteHtmlAtCaret(html) {
  let sel;
  let range;
  if (window.getSelection) {
    // IE9 and non-IE
    sel = window.getSelection();

    if (sel === null) return;

    if (sel.getRangeAt && sel.rangeCount) {
      range = currentRangeCached ?? sel.getRangeAt(0);
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
        currentRangeCached = range
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

  images.forEach((image) => {
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
  maxLength,
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
  textInputRef,
) {
  return (event) => {
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
  return (event) => {
    onFocus(event);
  };
}

/**
 * Set caret to the end of text value
 * @param {React.MutableRefObject<HTMLDivElement| null>} input
 */
export function moveCaretToEnd(input) {
  let range;
  let selection;
  if (document.createRange && input.current) {
    range = document.createRange();
    range.selectNodeContents(input.current);
    range.collapse(false);
    selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}
/**
 *
 * @param {HTMLDivElement} inputDiv
 * @return {string}
 */
export function removeHtmlExceptBr(inputDiv) {
  const temp = inputDiv.innerHTML.replaceAll(/<br\s*\/?>/gi, "[BR]"); // temporarily replace <br> with placeholder
  const tempContainer = document.createElement("div");
  tempContainer.innerHTML = temp;
  const stripped = tempContainer.innerText; // strip all html tags
  const final = stripped.replaceAll(/\[BR\]/gi, "</br>"); // replace placeholders with <br>
  return final;
}

/**
 * 
 * @param {*} range 
 * @returns 
 */
export function getSelectionStart(range) {
  let node = range.startContainer;
  let offset = range.startOffset;

  // Handle cases where the selection start node is not a text node
  if (node.nodeType !== Node.TEXT_NODE) {
    while (node.nodeType !== Node.TEXT_NODE) {
      node = node.nextSibling;
      if (!node) break;
    }
    if (!node) {
      node = range.commonAncestorContainer;
      while (node.nodeType !== Node.TEXT_NODE) {
        node = node.firstChild;
      }
    }
    offset = 0;
  }

  return { node, offset };
}

/**
 * 
 * @return {Object} cursor
 */
export function getCursor() {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const selectionStart = getSelectionStart(range);

  return  {selection, range, selectionStart}
}

/**
 *
 */
export function addLineBreak() {
  const { selection, range, selectionStart } = getCursor()

  // If cursor is at the end of the text content, add one more line break
  if (
    selection.isCollapsed &&
    selectionStart.offset === selectionStart.node.textContent.length
  ) {
    const br = document.createElement("br");
    range.insertNode(br);
    range.setStartAfter(br);
    range.setEndAfter(br);
    selection.removeAllRanges();
    selection.addRange(range);

    const br2 = document.createElement("br");
    range.insertNode(br2);
    range.setStartAfter(br2);
    range.setEndAfter(br2);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    const br = document.createElement("br");
    range.insertNode(br);
    range.setStartAfter(br);
    range.setEndAfter(br);
    selection.removeAllRanges();
    selection.addRange(range);
    // Set cursor position right before the first letter after the line break
    if (
      selectionStart.node.nextSibling &&
      selectionStart.node.nextSibling.nodeType === Node.TEXT_NODE
    ) {
      range.setStart(selectionStart.node.nextSibling, 1);
      range.setEnd(selectionStart.node.nextSibling, 1);
    }
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

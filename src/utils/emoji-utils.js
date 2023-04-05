/* eslint-disable valid-jsdoc */
// @ts-check

export const TRANSPARENT_GIF =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export const EMOJI_STYLE = "";

/**
 * Replace all text with emoji with an image html tag
 * @param {string} text
 * @return {string}
 */
export function replaceAllTextEmojis(text) {
  let allEmojis = getAllEmojisFromText(text);

  if (allEmojis) {
    allEmojis = [...new Set(allEmojis)]; // remove duplicates

    allEmojis.forEach(emoji => {
      text = replaceAll(text, emoji, getInputEmojiHTML(emoji));
    });
  }

  return text;
}

/**
 * Replace all occurrencies in a string
 * @param {string} str
 * @param {string} find
 * @param {string} replace
 * @return {string}
 */
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, "g"), replace);
}

/**
 * Get all emojis from the text
 * @param {string} text
 * @return {string[]}
 */
function getAllEmojisFromText(text) {
  return text.match(
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g
  );
}

// eslint-disable-next-line valid-jsdoc
/**
 *
 * @param { import("../types/types").EmojiMartItem } emoji
 * @return {string}
 */
export function getImageEmoji(emoji) {
  /** @type {HTMLElement | null} */
  const emojiPickerEl = document.querySelector('em-emoji-picker')

  if (!emojiPickerEl) {
    return getInputEmojiNativeHTML(emoji.native)
  }

  /** @type {HTMLSpanElement | null=} */
  const emojiSpanEl = emojiPickerEl?.shadowRoot?.querySelector(`[title="${emoji.name}"] > span > span`)

  if (!emojiSpanEl) {
    return getInputEmojiNativeHTML(emoji.native)
  }

  const style = replaceAll(emojiSpanEl.style.cssText, '"', "'");

  return getInputEmojiHTML(style, emoji.native);
}

// eslint-disable-next-line valid-jsdoc
/**
 *
 * @param {string} style
 * @param {string} emoji
 * @returns
 */
function getInputEmojiHTML(style, emoji) {
  return `<img style="${style}; display: inline-block" data-emoji="${emoji}" src="${TRANSPARENT_GIF}" />`;
}

/**
 * 
 * @param {string} emoji 
 * @returns 
 */
function getInputEmojiNativeHTML(emoji) {
  return `<span class="width: 18px; height: 18px; display: inline-block; margin: 0 1px;">${emoji}</span>`;
}

/**
 *
 * @param {string} html
 * @return {string}
 */
export function replaceAllTextEmojiToString(html) {
  const container = document.createElement("div");
  container.innerHTML = html;

  const images = Array.prototype.slice.call(container.querySelectorAll("img"));

  images.forEach(image => {
    container.innerHTML = container.innerHTML.replace(
      image.outerHTML,
      image.dataset.emoji
    );
  });

  return container.innerHTML;
}

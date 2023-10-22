// vendors
import React, { memo, useMemo } from "react";
import Picker from "@emoji-mart/react";

/**
 * @typedef {object} Props
 * @property {'light' | 'dark' | 'auto'} theme
 * @property {'native' | 'apple' | 'facebook' | 'google' | 'twitter'} set
 * @property {function(import("../types/types").EmojiMartItem): void} onSelectEmoji
 * @property {boolean} disableRecent
 * @property {any[]=} customEmojis
 * @property {import('../types/types').Languages=} language
 */

/**
 * Emoji Picker Component
 * @param {Props} props
 */
function EmojiPicker(props) {
  const { theme, set, onSelectEmoji, disableRecent, customEmojis, language } = props;

  /** @type {string[]} */
  const categories = useMemo(() => {
    /** @type {string[]} */
    let categoryies = [];

    if (!disableRecent) {
      categoryies.push("frequent");
    }

    categoryies = [
      ...categoryies,
      "people",
      "nature",
      "foods",
      "activity",
      "places",
      "objects",
      "symbols",
      "flags"
    ];

    return categoryies;
  }, [disableRecent]);

  const i18n = useMemo(() => {
    if (!language) {
      return undefined
    }

    return require(`@emoji-mart/data/i18n/${language ?? 'en'}.json`)
  }, [language])

  return (
    <Picker
      data={undefined}
      theme={theme}
      previewPosition="none"
      onEmojiSelect={onSelectEmoji}
      custom={customEmojis}
      categories={categories}
      set={set}
      i18n={i18n}
    />
  );
}


export default memo(EmojiPicker);

// vendors
import React, { memo, useMemo } from "react";
import Picker from "@emoji-mart/react";

/**
 * @typedef {object} Props
 * @property {'light' | 'dark' | 'auto'} theme
 * @property {function(import("../types/types").EmojiMartItem): void} onSelectEmoji
 * @property {boolean} disableRecent
 * @property {any[]=} customEmojis
 * @property {import('../types/types').Languages=} language
 * @property {string} spriteSheetURL
 */

/**
 * Emoji Picker Component
 * @param {Props} props
 */
function EmojiPicker(props) {
  const { theme, onSelectEmoji, disableRecent, customEmojis, language,spriteSheetURL } = props;

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
      set="apple"
      i18n={i18n}
      getSpritesheetURL={
        spriteSheetURL ? () => {
          return process.env.PUBLIC_URL+ spriteSheetURL;
        } : null
      }
    />
  );
}


export default memo(EmojiPicker);

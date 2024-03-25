// vendors
import React, { memo, useEffect, useMemo, useState } from "react";
import Picker from "@emoji-mart/react";

/**
 * @typedef {object} Props
 * @property {'light' | 'dark' | 'auto'} theme
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
  const { theme, onSelectEmoji, disableRecent, customEmojis, language } = props;

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

  const [i18n, setI18n] = useState(undefined);

  useEffect(() => {
    if (!language) {
      // @ts-ignore
      import(`@emoji-mart/data/i18n/en.json`)
      .then(translations => {
        setI18n(translations);
      })
      .catch(error => {
        console.error("Failed to load translations:", error);
      });
      return;
    }

    // @ts-ignore
    import(`@emoji-mart/data/i18n/${language}.json`)
      .then(translations => {
        setI18n(translations);
      })
      .catch(error => {
        console.error("Failed to load translations:", error);
      });
  }, [language]);

  if (!i18n) {
    return null;
  }

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
    />
  );
}


export default memo(EmojiPicker);

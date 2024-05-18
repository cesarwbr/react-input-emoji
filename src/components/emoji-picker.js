// vendors
import React, { memo, useEffect, useMemo, useState } from "react";
import Picker from "@emoji-mart/react";

const EMOJI_MART_DATA_URL = "https://cdn.jsdelivr.net/npm/@emoji-mart/data";
const cacheI18n = {};

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

  const [i18n, setI18n] = useState(undefined);

  useEffect(() => {
    if (!language) {
      if (cacheI18n.en) {
        setI18n(cacheI18n.en);
        return;
      }

      // @ts-ignore
      fetch(`${EMOJI_MART_DATA_URL}/i18n/en.json`)
      .then(async data => {
        const translations = await data.json();
        setI18n(translations);
        cacheI18n.en = translations;
      })
      .catch(error => {
        console.error("Failed to load translations:", error);
      });
      return;
    }

    if (cacheI18n[language]) {
      setI18n(cacheI18n[language]);
      return;
    }

    // @ts-ignore
    fetch(`${EMOJI_MART_DATA_URL}/i18n/${language}.json`)
      .then(async data => {
        const translations = await data.json();
        setI18n(translations);
        cacheI18n[language] = translations;
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
      set={set}
      i18n={i18n}
    />
  );
}


export default memo(EmojiPicker);

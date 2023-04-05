// vendors
import React, { memo, useMemo } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import t from "prop-types";

/**
 * @typedef {object} Props
 * @property {'light' | 'dark' | 'auto'} theme
 * @property {function(import("../types/types").EmojiMartItem): void} onSelectEmoji
 * @property {boolean} disableRecent
 * @property {import("emoji-mart").CustomEmoji[]=} customEmojis
 */

/**
 * Emoji Picker Component
 * @param {Props} props
 * @return {React.FC}
 */
function EmojiPicker(props) {
  const { theme, onSelectEmoji, disableRecent, customEmojis } = props;

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

  return (
    <Picker
      data={undefined}
      theme={theme}
      previewPosition="none"
      onEmojiSelect={onSelectEmoji}
      custom={customEmojis}
      categories={categories}
      set="apple"
    />
  );
}

EmojiPicker.propTypes = {
  theme: t.oneOf(["light", "dark", "auto"]),
  onSelectEmoji: t.func,
  disableRecent: t.bool,
  customEmojis: t.array
};

export default memo(EmojiPicker);

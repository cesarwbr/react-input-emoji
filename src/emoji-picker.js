// vendors
import React, { memo, useMemo } from "react";
import { Picker } from "emoji-mart";
import t from "prop-types";
import "emoji-mart/css/emoji-mart.css";

/**
 * @typedef {object} Props
 * @property {function(import("./types/types").EmojiMartItem): void} onSelectEmoji
 * @property {boolean} disableRecent
 */

/**
 * Emoji Picker Component
 * @param {Props} props
 * @return {JSX.Element}
 */
function EmojiPicker({ onSelectEmoji, disableRecent }) {
  const excluePicker = useMemo(() => {
    /** @type import("emoji-mart").CategoryName[] */
    const exclude = [];

    if (disableRecent) {
      exclude.push("recent");
    }

    return exclude;
  }, [disableRecent]);

  return (
    <Picker
      showPreview={false}
      showSkinTones={false}
      set="apple"
      onSelect={onSelectEmoji}
      exclude={excluePicker}
    />
  );
}

EmojiPicker.propTypes = {
  onSelectEmoji: t.func,
  disableRecent: t.bool
};

export default memo(EmojiPicker);

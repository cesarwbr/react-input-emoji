// vendors
import React, { memo, useMemo } from "react";
import { Picker } from "emoji-mart";
import t from "prop-types";
import "emoji-mart/css/emoji-mart.css";

/**
 * @typedef {object} Props
 * @property {'light' | 'dark' | 'auto'} theme
 * @property {function(import("../types/types").EmojiMartItem): void} onSelectEmoji
 * @property {boolean} disableRecent
 * @property {object[]} customEmojis
 */

/**
 * Emoji Picker Component
 * @param {Props} props
 * @return {React.FC}
 */
function EmojiPicker(props) {
  const {
    theme,
    onSelectEmoji,
    disableRecent,
    customEmojis
  } = props;

  const excludePicker = useMemo(() => {
    /** @type import("emoji-mart").CategoryName[] */
    const exclude = [];

    if (disableRecent) {
      exclude.push("recent");
    }

    return exclude;
  }, [disableRecent]);

  return (
    <Picker
      theme={theme}
      set="apple"
      showPreview={false}
      showSkinTones={false}
      onSelect={onSelectEmoji}
      exclude={excludePicker}
      custom={customEmojis}
    />
  );
}

EmojiPicker.propTypes = {
  theme: t.oneOf(['light', 'dark', 'auto']),
  onSelectEmoji: t.func,
  disableRecent: t.bool,
  customEmojis: t.array
};

export default memo(EmojiPicker);

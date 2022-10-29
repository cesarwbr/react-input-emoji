import React from "react";
import EmojiPicker from "./emoji-picker";

/**
 * @typedef {object} Props
 * @property {boolean} showPicker
 * @property {'light' | 'dark' | 'auto'} theme
 * @property {(emoji: import("../types/types").EmojiMartItem) => void} handleSelectEmoji
 * @property {boolean} disableRecent
 * @property {import("emoji-mart").CustomEmoji[]=} customEmojis
 */

/**
 * Emoji Picker Button Component
 * @param {Props} props
 * @return {JSX.Element}
 */
function EmojiPickerContainer({
  showPicker,
  theme,
  handleSelectEmoji,
  disableRecent,
  customEmojis
}) {
  return (
    <div className="react-emoji-picker--container">
      {showPicker && (
        <div
          className="react-emoji-picker--wrapper"
          onClick={evt => evt.stopPropagation()}
        >
          <div className="react-emoji-picker">
            <EmojiPicker
              theme={theme}
              onSelectEmoji={handleSelectEmoji}
              disableRecent={disableRecent}
              customEmojis={customEmojis}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default EmojiPickerContainer;

// @ts-check
/* eslint-disable react/prop-types */
// vendors
import React, { useEffect, useState } from "react";
import {
  getImageEmoji,
  replaceAllTextEmojis,
  replaceAllTextEmojiToString
} from "../utils/emoji-utils";

import EmojiPicker from "./emoji-picker";

/**
 * @typedef {import('../types/types').SanitizeFn} SanitizeFn
 */

/**
 * @typedef {import('../types/types').PolluteFn} PolluteFn
 */

/**
 * @typedef {Object} Props
 * @property {'light' | 'dark' | 'auto'} theme
 * @property {boolean} keepOpened
 * @property {boolean} disableRecent
 * @property {object[]=} customEmojis
 * @property {(fn: SanitizeFn) => void} addSanitizeFn
 * @property {(fn: PolluteFn) => void} addPolluteFn
 * @property {(html: string) => void} appendContent
 */

// eslint-disable-next-line valid-jsdoc
/** @type {React.FC<Props>} */
const EmojiPickerWrapper = (props) => {
  const {
    theme,
    keepOpened,
    disableRecent,
    customEmojis,
    addSanitizeFn,
    addPolluteFn,
    appendContent,
  } = props;

  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    addSanitizeFn(replaceAllTextEmojiToString);
  }, [addSanitizeFn]);

  useEffect(() => {
    addPolluteFn(replaceAllTextEmojis);
  }, [addPolluteFn]);

  useEffect(() => {
    /**
     *
     * @param {MouseEvent} event
     */
    function checkClickOutside(event) {
      /** @type {HTMLElement} */
      // @ts-ignore
      const element = event.target;

      if (
        element.classList.contains("react-input-emoji--button") ||
        element.classList.contains("react-input-emoji--button--icon")
      ) {
        return;
      }

      setShowPicker(false);
    }

    document.addEventListener("click", checkClickOutside);

    return () => {
      document.removeEventListener("click", checkClickOutside);
    };
  }, []);

  /**
   *
   * @param {React.MouseEvent} event
   */
  function toggleShowPicker(event) {
    event.stopPropagation();
    event.preventDefault();

    setShowPicker(currentShowPicker => !currentShowPicker);
  }

  // eslint-disable-next-line valid-jsdoc
  /**
   *
   * @param {import("../types/types").EmojiMartItem} emoji
   */
  function handleSelectEmoji(emoji) {
    appendContent(getImageEmoji(emoji));

    if (!keepOpened) {
      setShowPicker(currentShowPicker => !currentShowPicker);
    }
  }

  return (
    <>
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
      <button
        type="button"
        className={`react-input-emoji--button${showPicker ? " react-input-emoji--button__show" : ""
          }`}
        onClick={toggleShowPicker}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          className="react-input-emoji--button--icon"
        >
          {/* eslint-disable-next-line max-len */}
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10" />
          {/* eslint-disable-next-line max-len */}
          <path d="M8 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 8 7M16 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 16 7M15.232 15c-.693 1.195-1.87 2-3.349 2-1.477 0-2.655-.805-3.347-2H15m3-2H6a6 6 0 1 0 12 0" />
        </svg>
      </button>
    </>
  );
};

export default EmojiPickerWrapper;

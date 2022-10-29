// @ts-check
/* eslint-disable react/prop-types */
// vendors
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  getImageEmoji,
  replaceAllTextEmojis,
  replaceAllTextEmojiToString
} from "../utils/emoji-utils";

import EmojiPickerButton from "./emoji-picker-button";
import EmojiPickerContainer from "./emoji-picker-container";

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
 * @property {import("emoji-mart").CustomEmoji[]=} customEmojis
 * @property {(fn: SanitizeFn) => void} addSanitizeFn
 * @property {(fn: PolluteFn) => void} addPolluteFn
 * @property {(html: string) => void} appendContent
 * @property {HTMLDivElement=} buttonElement
 */

// eslint-disable-next-line valid-jsdoc
/** @type {React.FC<Props>} */
const EmojiPickerWrapper = props => {
  const {
    theme,
    keepOpened,
    disableRecent,
    customEmojis,
    addSanitizeFn,
    addPolluteFn,
    appendContent,
    buttonElement
  } = props;

  const [showPicker, setShowPicker] = useState(false);
  /** @type {[HTMLDivElement | undefined, React.Dispatch<React.SetStateAction<HTMLDivElement | undefined>>]} */
  const [customButton, setCustomButton] = useState();

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

  useEffect(() => {
    if (buttonElement?.style) {
      buttonElement.style.position = "relative";
      setCustomButton(buttonElement);
    }
  }, [buttonElement]);

  return customButton ? (
    (ReactDOM.createPortal(
      <>
        <EmojiPickerContainer
          showPicker={showPicker}
          theme={theme}
          handleSelectEmoji={handleSelectEmoji}
          disableRecent={disableRecent}
          customEmojis={customEmojis}
        />
        <EmojiPickerButton
          showPicker={showPicker}
          toggleShowPicker={toggleShowPicker}
          buttonElement={customButton}
        />
      </>,
      customButton
    ))
  ) : (
    (<>
      <EmojiPickerContainer
        showPicker={showPicker}
        theme={theme}
        handleSelectEmoji={handleSelectEmoji}
        disableRecent={disableRecent}
        customEmojis={customEmojis}
      />
      <EmojiPickerButton
        showPicker={showPicker}
        toggleShowPicker={toggleShowPicker}
      />
    </>)
  );
};

export default EmojiPickerWrapper;

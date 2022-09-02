// @ts-check
/* eslint-disable react/prop-types */
// vendors
import React, { useEffect, useRef, forwardRef, useCallback } from "react";

// css
import "./styles.css";

// utils
import { replaceAllTextEmojis } from "./utils/emoji-utils";
import {
  totalCharacters
} from "./utils/input-event-utils";

// hooks
import { useExpose } from "./hooks/use-expose";
import { useEmit } from "./hooks/use-emit";

// components
import TextInput from "./text-input";
import EmojiPickerWrapper from "./components/emoji-picker-wrapper";
import MentionWrapper from "./components/mention-wrapper";
import { useEventListeners } from "./hooks/use-event-listeners";
import { useSanitize } from "./hooks/use-sanitize";
import { usePollute } from "./hooks/user-pollute";

/**
 * @typedef {import('./types/types').MentionUser} MetionUser
 */

/**
 * @typedef {import('./types/types').ListenerObj<any>} ListenerObj
 */

/**
 * @typedef {object} Props
 * @property {string} value
 * @property {(value: string) => void} onChange
 * @property {"light" | "dark" | "auto"} theme
 * @property {boolean} cleanOnEnter
 * @property {(text: string) => void} onEnter
 * @property {string} placeholder
 * @property {(size: {width: number, height: number}) => void} onResize
 * @property {() => void} onClick
 * @property {() => void} onFocus
 * @property {() => void=} onBlur
 * @property {number} maxLength
 * @property {boolean} keepOpened
 * @property {(event: KeyboardEvent) => void} onKeyDown
 * @property {string} inputClass
 * @property {boolean} disableRecent
 * @property {number} tabIndex
 * @property {number} height
 * @property {number} borderRadius
 * @property {string} borderColor
 * @property {number} fontSize
 * @property {string} fontFamily
 * @property {object[]=} customEmojis
 * @property {(text: string) => Promise<MetionUser[]>=} searchMention
 */

/**
 * Input Emoji Component
 * @param {Props} props
 * @param {React.Ref<any>} ref
 * @return {JSX.Element}
 */
function InputEmoji(props, ref) {
  const {
    onChange,
    onEnter,
    onResize,
    onClick,
    onFocus,
    onBlur,
    onKeyDown,
    theme,
    cleanOnEnter,
    placeholder,
    maxLength,
    keepOpened,
    inputClass,
    disableRecent,
    tabIndex,
    value,
    customEmojis,
    searchMention,
    // style
    borderRadius,
    borderColor,
    fontSize,
    fontFamily
  } = props;

  /** @type {React.MutableRefObject<import('./text-input').Ref | null>} */
  const textInputRef = useRef(null);

  const { addEventListener, listeners } = useEventListeners();

  const { addSanitizeFn, sanitize, sanitizedTextRef } = useSanitize();

  const { addPolluteFn, pollute } = usePollute();

  const updateHTML = useCallback(
    (nextValue = "") => {
      if (textInputRef.current === null) return

      textInputRef.current.html = replaceAllTextEmojis(nextValue);
      sanitizedTextRef.current = nextValue;
    },
    [sanitizedTextRef]
  );

  const setValue = useCallback(
    value => {
      updateHTML(value);
    },
    [updateHTML]
  );

  const emitChange = useEmit(textInputRef, onResize, onChange);

  useExpose({
    ref,
    setValue,
    textInputRef,
    emitChange
  });

  useEffect(() => {
    if (sanitizedTextRef.current !== value) {
      setValue(value);
    }
  }, [sanitizedTextRef, setValue, value]);

  useEffect(() => {
    updateHTML();
  }, [updateHTML]);

  useEffect(() => {
    /**
     * Handle keydown event
     * @param {React.KeyboardEvent} event
     * @return {boolean}
     */
    function handleKeydown(event) {
      if (
        typeof maxLength !== "undefined" &&
        event.key !== "Backspace" &&
        textInputRef.current !== null &&
        totalCharacters(textInputRef.current) >= maxLength
      ) {
        event.preventDefault();
      }

      if (event.key === "Enter" && textInputRef.current) {
        event.preventDefault();

        const text = sanitize(textInputRef.current.html);

        emitChange(sanitizedTextRef.current);

        if (
          typeof onEnter === "function" &&
          listeners.enter.currentListerners.length === 0
        ) {
          onEnter(text);
        }

        if (cleanOnEnter && listeners.enter.currentListerners.length === 0) {
          updateHTML("");
        }

        if (typeof onKeyDown === "function") {
          onKeyDown(event.nativeEvent);
        }

        return false;
      }

      if (typeof onKeyDown === "function") {
        onKeyDown(event.nativeEvent);
      }

      return true;
    }

    const unsubscribe = addEventListener("keyDown", handleKeydown);

    return () => {
      unsubscribe();
    };
  }, [addEventListener, cleanOnEnter, emitChange, listeners.enter.currentListerners.length, maxLength, onEnter, onKeyDown, sanitize, sanitizedTextRef, updateHTML]);

  useEffect(() => {
    /** */
    function handleFocus() {
      if (typeof onClick === "function") {
        onClick();
      }

      if (typeof onFocus === "function") {
        onFocus();
      }
    }

    const unsubscribe = addEventListener("focus", handleFocus);

    return () => {
      unsubscribe();
    };
  }, [addEventListener, onClick, onFocus]);

  useEffect(() => {
    /** */
    function handleBlur() {
      if (typeof onBlur === 'function') {
        onBlur()
      }
    }

    const unsubscribe = addEventListener('blur', handleBlur);

    return () => {
      unsubscribe()
    }
  }, [addEventListener, onBlur])

  /**
   *
   * @param {string} html
   */
  function handleTextInputChange(html) {
    sanitize(html);
    emitChange(sanitizedTextRef.current);
  }

  /**
   *
   * @param {string} html
   */
  function appendContent(html) {
    if (
      typeof maxLength !== "undefined" &&
      textInputRef.current !== null &&
      totalCharacters(textInputRef.current) >= maxLength
    ) {
      return;
    }

    if (textInputRef.current !== null) {
      textInputRef.current.appendContent(html);
    }
  }

  /**
   * Handle copy of current selected text
   * @param {React.ClipboardEvent} event
   */
  function handleCopy(event) {
    event.clipboardData.setData("text", sanitizedTextRef.current);
    event.preventDefault();
  }

  /**
   * Handle past on input
   * @param {React.ClipboardEvent} event
   */
  function handlePaste(event) {
    event.preventDefault();
    let content;
    if (event.clipboardData) {
      content = event.clipboardData.getData("text/plain");
      content = pollute(content);
      document.execCommand("insertHTML", false, content);
    }
  }

  return (
    <div className="react-emoji">
      <MentionWrapper
        searchMention={searchMention}
        addEventListener={addEventListener}
        appendContent={appendContent}
        addSanitizeFn={addSanitizeFn}
      />
      <TextInput
        ref={textInputRef}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onBlur={listeners.blur.publish}
        onFocus={listeners.focus.publish}
        onArrowUp={listeners.arrowUp.publish}
        onArrowDown={listeners.arrowDown.publish}
        onKeyUp={listeners.keyUp.publish}
        onKeyDown={listeners.keyDown.publish}
        onEnter={listeners.enter.publish}
        placeholder={placeholder}
        style={{
          borderRadius,
          borderColor,
          fontSize,
          fontFamily
        }}
        tabIndex={tabIndex}
        className={inputClass}
        onChange={handleTextInputChange}
      />
      <EmojiPickerWrapper
        theme={theme}
        keepOpened={keepOpened}
        disableRecent={disableRecent}
        customEmojis={customEmojis}
        addSanitizeFn={addSanitizeFn}
        addPolluteFn={addPolluteFn}
        appendContent={appendContent}
      />
    </div>
  );
}

const InputEmojiWithRef = forwardRef(InputEmoji);

InputEmojiWithRef.defaultProps = {
  theme: /** @type {const} */ ("auto"),
  height: 30,
  placeholder: "Type a message",
  borderRadius: 21,
  borderColor: "#EAEAEA",
  fontSize: 15,
  fontFamily: "sans-serif",
  tabIndex: 0,
  customEmojis: []
};

export default InputEmojiWithRef;

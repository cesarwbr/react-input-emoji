// @ts-check
// vendors
import React, { useEffect, useRef, forwardRef, useCallback } from "react";

// css
import "./styles.css";

// utils
import { replaceAllTextEmojis } from "./utils/emoji-utils";
import { handleCopy, totalCharacters } from "./utils/input-event-utils";

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
 * @property {"light" | "dark" | "auto"=} theme
 * @property {'native' | 'apple' | 'facebook' | 'google' | 'twitter'=} set
 * @property {boolean=} cleanOnEnter
 * @property {(text: string) => void=} onEnter
 * @property {string=} placeholder
 * @property {string=} placeholderColor
 * @property {string=} color
 * @property {(size: {width: number, height: number}) => void=} onResize
 * @property {() => void=} onClick
 * @property {() => void=} onFocus
 * @property {() => void=} onBlur
 * @property {boolean} shouldReturn
 * @property {number=} maxLength
 * @property {boolean=} keepOpened
 * @property {(event: KeyboardEvent) => void=} onKeyDown
 * @property {string=} inputClass
 * @property {boolean=} disableRecent
 * @property {number=} tabIndex
 * @property {number=} height
 * @property {number=} borderRadius
 * @property {string=} borderColor
 * @property {number=} fontSize
 * @property {string=} fontFamily
 * @property {string=} background
 * @property {{id: string; name: string; emojis: {id: string; name: string; keywords: string[], skins: {src: string}[]}}[]=} customEmojis
 * @property {import('./types/types').Languages=} language
 * @property {(text: string) => Promise<MetionUser[]>=} searchMention
 * @property {HTMLDivElement=} buttonElement
 * @property {React.MutableRefObject=} buttonRef
 * @property {boolean} shouldConvertEmojiToImage
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
    set,
    cleanOnEnter,
    placeholder,
    maxLength,
    keepOpened,
    inputClass,
    disableRecent,
    tabIndex,
    value,
    customEmojis,
    language,
    searchMention,
    buttonElement,
    buttonRef,
    shouldReturn,
    shouldConvertEmojiToImage,
    // style
    borderRadius,
    borderColor,
    fontSize,
    fontFamily,
    background,
    placeholderColor,
    color,
  } = props;

  /** @type {React.MutableRefObject<import('./text-input').Ref | null>} */
  const textInputRef = useRef(null);

  const { addEventListener, listeners } = useEventListeners();

  const { addSanitizeFn, sanitize, sanitizedTextRef } = useSanitize(shouldReturn, shouldConvertEmojiToImage);

  const { addPolluteFn, pollute } = usePollute();

  const updateHTML = useCallback(
    (nextValue = "") => {
      if (textInputRef.current === null) return;

      textInputRef.current.html = replaceAllTextEmojis(nextValue);
      sanitizedTextRef.current = nextValue;
    },
    [sanitizedTextRef]
  );

  const setValue = useCallback(
    /**
     *
     * @param {string} value
     */
    (value) => {
      updateHTML(value);
    },
    [updateHTML]
  );

  const emitChange = useEmit(textInputRef, onResize, onChange);

  useExpose({
    ref,
    setValue,
    textInputRef,
    emitChange,
    shouldConvertEmojiToImage
  });

  useEffect(() => {
    if (sanitizedTextRef.current !== value) {
      setValue(value);
    }
  }, [sanitizedTextRef, setValue, value]);

  // useEffect(() => {
  //   updateHTML();
  // }, [updateHTML]);

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
  }, [
    addEventListener,
    cleanOnEnter,
    emitChange,
    listeners.enter.currentListerners.length,
    maxLength,
    onEnter,
    onKeyDown,
    sanitize,
    sanitizedTextRef,
    updateHTML
  ]);

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
      if (typeof onBlur === "function") {
        onBlur();
      }
    }

    const unsubscribe = addEventListener("blur", handleBlur);

    return () => {
      unsubscribe();
    };
  }, [addEventListener, onBlur]);

  /**
   *
   * @param {string} html
   */
  function handleTextInputChange(html) {
    sanitize(html);

    if (value !== sanitizedTextRef.current) {
      emitChange(sanitizedTextRef.current);
    }
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
        shouldReturn={shouldReturn}
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
          fontFamily,
          background,
          placeholderColor,
          color
        }}
        tabIndex={tabIndex}
        className={inputClass}
        onChange={handleTextInputChange}
      />
      <EmojiPickerWrapper
        theme={theme}
        set={set}
        keepOpened={keepOpened}
        disableRecent={disableRecent}
        customEmojis={customEmojis}
        addSanitizeFn={addSanitizeFn}
        addPolluteFn={addPolluteFn}
        appendContent={appendContent}
        buttonElement={buttonElement}
        buttonRef={buttonRef}
        language={language}
      />
    </div>
  );
}

const InputEmojiWithRef = forwardRef(InputEmoji);

InputEmojiWithRef.defaultProps = {
  theme: /** @type {'light' | 'dark' | 'auto'} */ ("auto"),
  set: /** @type {'native' | 'apple' | 'facebook' | 'google' | 'twitter'} */ ("apple"),
  height: 30,
  placeholder: "Type a message",
  borderRadius: 21,
  borderColor: "#EAEAEA",
  color: "black",
  fontSize: 15,
  fontFamily: "sans-serif",
  background: "white",
  tabIndex: 0,
  shouldReturn: false,
  shouldConvertEmojiToImage: false,
  customEmojis: [],
  language: undefined,
};

export default InputEmojiWithRef;

// @ts-check
/* eslint-disable react/prop-types */
// vendors
import React, {
  useState,
  useImperativeHandle,
  useEffect,
  useRef,
  forwardRef,
  useCallback
} from "react";
import t from "prop-types";

// css
import "./styles.css";
import EmojiPicker from "./emoji-picker";

// utils
import { replaceAllTextEmojis, TRANSPARENT_GIF } from "./utils/emoji-utils";
import {
  handleCopy,
  handleFocus,
  handleKeydown,
  handleKeyup,
  handlePaste
} from "./utils/input-event-utils";

/**
 * @typedef {object} Props
 * @property {string} value
 * @property {function(string): void} onChange
 * @property {boolean} cleanOnEnter
 * @property {(text: string) => void} onEnter
 * @property {string} placeholder
 * @property {function({width: number, height: number}): void} onResize
 * @property {() => void} onClick
 * @property {() => void} onFocus
 * @property {number} maxLength
 * @property {boolean} keepOpenend
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
 */

/**
 * Input Emoji Component
 * @param {Props} props
 * @param {React.Ref<any>} ref
 * @return {JSX.Element}
 */
function InputEmoji(
  {
    onChange,
    cleanOnEnter,
    onEnter,
    placeholder,
    onResize,
    onClick,
    onFocus,
    maxLength,
    keepOpenend,
    onKeyDown,
    inputClass,
    disableRecent,
    tabIndex,
    value,
    customEmojis,
    // style
    height,
    borderRadius,
    borderColor,
    fontSize,
    fontFamily
  },
  ref
) {
  const [showPicker, setShowPicker] = useState(false);

  const currentSizeRef = useRef(null);
  const textInputRef = useRef(null);
  const cleanedTextRef = useRef("");
  const placeholderRef = useRef(null);
  const onChangeFn = useRef(onChange);

  const updateHTML = useCallback((nextValue = "") => {
    textInputRef.current.innerHTML = replaceAllTextEmojis(nextValue);
    cleanedTextRef.current = nextValue;
  }, []);

  const setValue = useCallback(
    value => {
      updateHTML(value);
      textInputRef.current.blur();
    },
    [updateHTML]
  );

  useImperativeHandle(ref, () => ({
    get value() {
      return cleanedTextRef.current;
    },
    set value(value) {
      setValue(value);
    },
    focus: () => {
      textInputRef.current.focus();
    },
    blur: () => {
      replaceAllTextEmojiToString();
    }
  }));

  useEffect(() => {
    /** @type {HTMLDivElement} */
    const placeholderEl = placeholderRef.current
    if (value && value.length > 0) {
      placeholderEl.style.visibility = 'hidden'
    } else {
      placeholderEl.style.visibility = 'visible'
    }

    if (cleanedTextRef.current !== value) {
      setValue(value);
    }
  }, [setValue, value]);

  const checkAndEmitResize = useCallback(() => {
    const currentSize = currentSizeRef.current;

    const nextSize = {
      width: textInputRef.current.offsetWidth,
      height: textInputRef.current.offsetHeight
    };

    if (
      (!currentSize ||
        currentSize.width !== nextSize.width ||
        currentSize.height !== nextSize.height) &&
      typeof onResize === "function"
    ) {
      onResize(nextSize);
    }

    currentSizeRef.current = nextSize;
  }, [onResize]);

  const emitChange = useCallback(() => {
    if (typeof onChangeFn.current === "function") {
      onChangeFn.current(cleanedTextRef.current);
    }

    if (typeof onResize === "function") {
      checkAndEmitResize();
    }
  }, [checkAndEmitResize, onResize]);

  useEffect(() => {
    /** @type {HTMLDivElement} */
    const inputEl = textInputRef.current;

    const handleContentEditableInputCopyAndPaste = () => {
      inputEl.addEventListener("copy", handleCopy);
      inputEl.addEventListener("paste", handlePaste);
    };

    handleContentEditableInputCopyAndPaste();

    return () => {
      inputEl.removeEventListener("copy", handleCopy);
      inputEl.removeEventListener("paste", handlePaste);
    };
  }, []);

  useEffect(() => {
    updateHTML();
  }, [updateHTML]);

  const replaceAllTextEmojiToString = useCallback(() => {
    if (!textInputRef.current) {
      cleanedTextRef.current = "";
    }

    const container = document.createElement("div");
    container.innerHTML = textInputRef.current.innerHTML;

    const images = Array.prototype.slice.call(
      container.querySelectorAll("img")
    );

    images.forEach(image => {
      container.innerHTML = container.innerHTML.replace(
        image.outerHTML,
        image.dataset.emoji
      );
    });

    let text = container.innerText;

    // remove all ↵ for safari
    text = text.replace(/\n/gi, "");

    cleanedTextRef.current = text;

    emitChange();
  }, [emitChange]);

  useEffect(() => {
    /** @type {HTMLDivElement} */
    const inputEl = textInputRef.current;

    const onKeydown = handleKeydown({
      placeholderEl: placeholderRef.current,
      maxLength,
      inputEl,
      cleanedTextRef,
      emitChange,
      onEnter,
      onKeyDown,
      updateHTML,
      cleanOnEnter
    });

    inputEl.addEventListener("keydown", onKeydown);

    return () => {
      inputEl.removeEventListener("keydown", onKeydown);
    };
  }, [cleanOnEnter, emitChange, maxLength, onEnter, onKeyDown, updateHTML]);

  useEffect(() => {
    /** @type {HTMLDivElement} */
    const inputEl = textInputRef.current;

    const onKeyup = handleKeyup(replaceAllTextEmojiToString);

    inputEl.addEventListener("keyup", onKeyup);

    return () => {
      inputEl.removeEventListener("keyup", onKeyup);
    };
  }, [replaceAllTextEmojiToString]);

  useEffect(() => {
    /** @type {HTMLDivElement} */
    const inputEl = textInputRef.current;

    let handleFocusFn;
    if (typeof onFocus === "function") {
      handleFocusFn = handleFocus(onFocus);

      inputEl.addEventListener("focus", handleFocusFn);
    }

    return () => {
      if (typeof handleFocusFn === "function") {
        inputEl.removeEventListener("focus", handleFocusFn);
      }
    };
  }, [onFocus]);

  useEffect(() => {
    if (textInputRef.current) {
      checkAndEmitResize();
    }
  }, [checkAndEmitResize]);

  /** */
  function toggleShowPicker() {
    setShowPicker(showPicker => !showPicker);
  }

  /**
   *
   * @param {string} html
   */
  function pasteHtmlAtCaret(html) {
    let sel;
    let range;
    if (window.getSelection) {
      // IE9 and non-IE
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();

        // Range.createContextualFragment() would be useful here but is
        // non-standard and not supported in all browsers (IE9, for one)
        const el = document.createElement("div");
        el.innerHTML = html;
        const frag = document.createDocumentFragment();
        let node;
        let lastNode;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);

        // Preserve the selection
        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    }
  }

  /**
   *
   * @param {string} str
   * @param {string} find
   * @param {string} replace
   * @return {string}
   */
  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, "g"), replace);
  }

  // eslint-disable-next-line valid-jsdoc
  /**
   *
   * @param { import("./types/types").EmojiMartItem } emoji
   * @return {string}
   */
  function getImage(emoji) {
    let shortNames = `${emoji.short_names}`;

    shortNames = replaceAll(shortNames, ",", ", ");

    /** @type {HTMLSpanElement} */
    const emojiSpanEl = document.querySelector(
      `[aria-label="${emoji.native}, ${shortNames}"] > span`
    ) || document.querySelector(
      `[aria-label="${emoji.id}"] > span`
    );

    if (!emojiSpanEl) return "";

    const style = replaceAll(emojiSpanEl.style.cssText, '"', "'");

    let dataEmoji = emoji.native

    if (!dataEmoji && emoji.emoticons && emoji.emoticons.length > 0) {
      dataEmoji = emoji.emoticons[0]
    }
 
    return `<img style="${style}" data-emoji="${dataEmoji}" src="${TRANSPARENT_GIF}" />`;
  }

  // eslint-disable-next-line valid-jsdoc
  /**
   *
   * @param { import("./types/types").EmojiMartItem } emoji
   */
  function handleSelectEmoji(emoji) {
    placeholderRef.current.style.visibility = 'hidden';

    textInputRef.current.focus();

    pasteHtmlAtCaret(getImage(emoji));

    textInputRef.current.focus();

    replaceAllTextEmojiToString();

    if (!keepOpenend) {
      toggleShowPicker();
    }
  }

  /** */
  function handleClick() {
    if (typeof onClick === "function") {
      onClick();
    }
  }

  /**
   * 
   * @param {React.KeyboardEvent} event 
   */
  function handleInputKeydown (event) {
    if (event.key.length === 1) {
      placeholderRef.current.style.visibility = 'hidden'
    }
  }

  return (
    <div className="react-emoji">
      <div className="react-emoji-picker--container">
        <div
          className={`react-emoji-picker--wrapper${
            showPicker ? " react-emoji-picker--wrapper__show" : ""
          }`}
        >
          <div
            className={`react-emoji-picker${
              showPicker ? " react-emoji-picker__show" : ""
            }`}
          >
            {showPicker && (
              <EmojiPicker
                onSelectEmoji={handleSelectEmoji}
                disableRecent={disableRecent}
                customEmojis={customEmojis}
              />
            )}
          </div>
        </div>
      </div>
      <div
        className="react-input-emoji--container"
        style={{
          borderRadius,
          borderColor,
          fontSize,
          fontFamily
        }}
      >
        <div className="react-input-emoji--wrapper" onClick={handleClick}>
          <div ref={placeholderRef} className="react-input-emoji--placeholder">
            {placeholder}
          </div>
          <div
            ref={textInputRef}
            onKeyDown={handleInputKeydown}
            tabIndex={tabIndex}
            contentEditable
            className={`react-input-emoji--input${
              inputClass ? ` ${inputClass}` : ""
            }`}
            onBlur={emitChange}
          />
        </div>
      </div>
      <button
        className={`react-input-emoji--button${
          showPicker ? " react-input-emoji--button__show" : ""
        }`}
        onClick={toggleShowPicker}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          {/* eslint-disable-next-line max-len */}
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10" />
          {/* eslint-disable-next-line max-len */}
          <path d="M8 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 8 7M16 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 16 7M15.232 15c-.693 1.195-1.87 2-3.349 2-1.477 0-2.655-.805-3.347-2H15m3-2H6a6 6 0 1 0 12 0" />
        </svg>
      </button>
      {showPicker && (
        <div
          className="react-input-emoji--overlay"
          onClick={toggleShowPicker}
        />
      )}
    </div>
  );
}

const InputEmojiWithRef = forwardRef(InputEmoji);

InputEmojiWithRef.propTypes = {
  value: t.string,
  onChange: t.func,
  cleanOnEnter: t.bool,
  onEnter: t.func,
  placeholder: t.string,
  onResize: t.func,
  onClick: t.func,
  onFocus: t.func,
  maxLength: t.number,
  keepOpenend: t.bool,
  onKeyDown: t.func,
  inputClass: t.string,
  disableRecent: t.bool,
  tabIndex: t.number,
  customEmojis: t.array,
  // style
  height: t.number,
  borderRadius: t.number,
  borderColor: t.string,
  fontSize: t.number,
  fontFamily: t.string
};

InputEmojiWithRef.defaultProps = {
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

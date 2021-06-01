// @ts-check
/* eslint-disable react/prop-types */
// vendors
import React, {
  useEffect,
  useRef,
  forwardRef,
  useCallback,
  useState
} from "react";
import t from "prop-types";

// css
import "./styles.css";
import EmojiPicker from "./emoji-picker";

// utils
import { replaceAllTextEmojis } from "./utils/emoji-utils";
import {
  handleCopy,
  handleFocus,
  handleKeydown,
  handleKeyup,
  handlePaste,
  handleSelectEmoji
} from "./utils/input-event-utils";

// hooks
import { useExpose } from "./hooks/use-expose";
import { useEmit } from "./hooks/use-emit";

/**
 * @typedef {object} Props
 * @property {string} value
 * @property {(value: string) => void} onChange
 * @property {boolean} cleanOnEnter
 * @property {(text: string) => void} onEnter
 * @property {string} placeholder
 * @property {(size: {width: number, height: number}) => void} onResize
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

  /** @type {React.MutableRefObject<HTMLDivElement>} */
  const textInputRef = useRef(null);
  const cleanedTextRef = useRef("");
  /** @type {React.MutableRefObject<HTMLDivElement>} */
  const placeholderRef = useRef(null);

  const toggleShowPicker = useCallback(event => {
    if (event) {
      event.stopPropagation();
    }

    setShowPicker(currentShowPicker => !currentShowPicker);
  }, []);

  useEffect(() => {
    /** */
    function checkClickOutside() {
      setShowPicker(false);
    }

    document.addEventListener("click", checkClickOutside);

    return () => {
      document.removeEventListener("click", checkClickOutside);
    };
  }, []);

  const updateHTML = useCallback((nextValue = "") => {
    textInputRef.current.innerHTML = replaceAllTextEmojis(nextValue);
    cleanedTextRef.current = nextValue;
  }, []);

  const setValue = useCallback(
    value => {
      updateHTML(value);
    },
    [updateHTML]
  );

  const emitChange = useEmit(textInputRef, onResize, onChange, cleanedTextRef);

  useExpose({
    ref,
    cleanedTextRef,
    setValue,
    textInputRef,
    emitChange
  });

  useEffect(() => {
    /** @type {HTMLDivElement} */
    const placeholderEl = placeholderRef.current;
    if (value && value.length > 0) {
      placeholderEl.style.visibility = "hidden";
    } else {
      placeholderEl.style.visibility = "visible";
    }

    if (cleanedTextRef.current !== value) {
      setValue(value);
    }
  }, [setValue, value]);

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

  useEffect(() => {
    /** @type {HTMLDivElement} */
    const inputEl = textInputRef.current;

    const onKeydown = handleKeydown({
      placeholderEl: placeholderRef.current,
      maxLength,
      inputEl,
      cleanedTextRef,
      textInputRef,
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

    const onKeyup = handleKeyup(emitChange, cleanedTextRef, textInputRef);

    inputEl.addEventListener("keyup", onKeyup);

    return () => {
      inputEl.removeEventListener("keyup", onKeyup);
    };
  }, [emitChange]);

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
  function handleInputKeydown(event) {
    if (event.key.length === 1) {
      placeholderRef.current.style.visibility = "hidden";
    }
  }

  return (
    <div className="react-emoji">
      <div className="react-emoji-picker--container">
        {showPicker && (
          <div
            className="react-emoji-picker--wrapper"
            onClick={evt => evt.stopPropagation()}
          >
            <div className="react-emoji-picker">
              <EmojiPicker
                onSelectEmoji={emoji =>
                  handleSelectEmoji({
                    emoji,
                    placeholderRef,
                    textInputRef,
                    cleanedTextRef,
                    emitChange,
                    keepOpenend,
                    toggleShowPicker,
                    maxLength
                  })
                }
                disableRecent={disableRecent}
                customEmojis={customEmojis}
              />
            </div>
          </div>
        )}
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

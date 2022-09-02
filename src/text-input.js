// @ts-check
/* eslint-disable react/prop-types */
// vendors
import React, { useImperativeHandle, forwardRef, useRef } from "react";
import { handlePasteHtmlAtCaret } from "./utils/input-event-utils";

/**
 * @typedef {Object} Props
 * @property {(event: React.KeyboardEvent) => void} onKeyDown
 * @property {(event: React.KeyboardEvent) => void} onKeyUp
 * @property {() => void} onFocus
 * @property {() => void} onBlur
 * @property {(sanitizedText: string) => void=} onChange
 * @property {(event: React.KeyboardEvent) => void} onArrowUp
 * @property {(event: React.KeyboardEvent) => void} onArrowDown
 * @property {(event: React.KeyboardEvent) => void} onEnter
 * @property {(event: React.ClipboardEvent) => void} onCopy
 * @property {(event: React.ClipboardEvent) => void} onPaste
 * @property {string} placeholder
 * @property {React.CSSProperties} style
 * @property {number} tabIndex
 * @property {string} className
 * @property {(html: string) => void} onChange
 */

/**
 * @typedef {{
 *  appendContent: (html: string) => void;
 *  html: string;
 *  text: string;
 *  size: { width: number; height: number;};
 *  focus: () => void;
 * }} Ref
 */

// eslint-disable-next-line valid-jsdoc
/** @type {React.ForwardRefRenderFunction<Ref, Props>} */
const TextInput = (
  { placeholder, style, tabIndex, className, onChange, ...props },
  ref
) => {
  useImperativeHandle(ref, () => ({
    appendContent: html => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }

      handlePasteHtmlAtCaret(html);

      if (textInputRef.current) {
        textInputRef.current.focus();
      }

      if (textInputRef.current && placeholderRef.current && textInputRef.current.innerHTML.trim() === "") {
        placeholderRef.current.style.visibility = "visible";
      } else if (placeholderRef.current) {
        placeholderRef.current.style.visibility = "hidden";
      }

      if (textInputRef.current && typeof onChange === 'function') {
        onChange(textInputRef.current.innerHTML);
      }
    },
    set html(value) {
      if (textInputRef.current) {
        textInputRef.current.innerHTML = value;
      }
      
      if (placeholderRef.current) {
        if (value.trim() === "") {
          placeholderRef.current.style.visibility = "visible";
        } else {
          placeholderRef.current.style.visibility = "hidden";
        }
      }

      if (typeof onChange === 'function' && textInputRef.current) {
        onChange(textInputRef.current.innerHTML);
      }
    },
    get html() {
      if (!textInputRef.current) return ''

      return textInputRef.current.innerHTML;
    },
    get text() {
      if (!textInputRef.current) return ''

      return textInputRef.current.innerText;
    },
    get size() {
      if (!textInputRef.current) {
        return {
          width: 0,
          height: 0
        }
      }

      return {
        width: textInputRef.current.offsetWidth,
        height: textInputRef.current.offsetHeight
      };
    },
    focus() {
      if (!textInputRef.current) return

      textInputRef.current.focus();
    }
  }));

  /** @type {React.MutableRefObject<HTMLDivElement | null>} */
  const placeholderRef = useRef(null);
  /** @type {React.MutableRefObject<HTMLDivElement | null>} */
  const textInputRef = useRef(null);

  /**
   *
   * @param {React.KeyboardEvent} event
   */
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      props.onEnter(event);
    } else if (event.key === "ArrowUp") {
      props.onArrowUp(event);
    } else if (event.key === "ArrowDown") {
      props.onArrowDown(event);
    } else {
      if (event.key.length === 1 && placeholderRef.current) {
        placeholderRef.current.style.visibility = "hidden";
      }
    }

    props.onKeyDown(event);
  }

  /** */
  function handleClick() {
    props.onFocus();
  }

  /**
   *
   * @param {React.KeyboardEvent} event
   */
  function handleKeyUp(event) {
    props.onKeyUp(event);

    const input = textInputRef.current;

    if (placeholderRef.current) {
      if (input?.innerText?.trim() === "") {
        placeholderRef.current.style.visibility = "visible";
      } else {
        placeholderRef.current.style.visibility = "hidden";
      }
    }

    if (typeof onChange === 'function' && textInputRef.current) {
      onChange(textInputRef.current.innerHTML);
    }
  }

  return (
    <div className="react-input-emoji--container" style={style}>
      <div className="react-input-emoji--wrapper" onClick={handleClick}>
        <div ref={placeholderRef} className="react-input-emoji--placeholder">
          {placeholder}
        </div>
        <div
          ref={textInputRef}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          tabIndex={tabIndex}
          contentEditable
          className={`react-input-emoji--input${className ? ` ${className}` : ""
            }`}
          onBlur={props.onBlur}
          onCopy={props.onCopy}
          onPaste={props.onPaste}
          data-testid="react-input-emoji--input"
        />
      </div>
    </div>
  );
};

const TextInputWithRef = forwardRef(TextInput);

export default TextInputWithRef;

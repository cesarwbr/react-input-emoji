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
 * @property {() => void=} onBlur
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
      // textInputRef.current.focus();

      handlePasteHtmlAtCaret(html);

      // textInputRef.current.focus();

      if (textInputRef.current.innerHTML.trim() === "") {
        placeholderRef.current.style.visibility = "visible";
      } else {
        placeholderRef.current.style.visibility = "hidden";
      }

      onChange(textInputRef.current.innerHTML);
    },
    set html(value) {
      textInputRef.current.innerHTML = value;

      if (value.trim() === "") {
        placeholderRef.current.style.visibility = "visible";
      } else {
        placeholderRef.current.style.visibility = "hidden";
      }

      onChange(textInputRef.current.innerHTML);
    },
    get html() {
      return textInputRef.current.innerHTML;
    },
    get text() {
      return textInputRef.current.innerText;
    },
    get size() {
      return {
        width: textInputRef.current.offsetWidth,
        height: textInputRef.current.offsetHeight
      };
    },
    focus() {
      textInputRef.current.focus();
    }
  }));

  /** @type {React.MutableRefObject<HTMLDivElement>} */
  const placeholderRef = useRef(null);
  /** @type {React.MutableRefObject<HTMLDivElement>} */
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
      if (event.key.length === 1) {
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

    if (input.innerText?.trim() === "") {
      placeholderRef.current.style.visibility = "visible";
    } else {
      placeholderRef.current.style.visibility = "hidden";
    }

    onChange(textInputRef.current.innerHTML);
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
          className={`react-input-emoji--input${
            className ? ` ${className}` : ""
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

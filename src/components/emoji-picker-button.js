/* eslint-disable react/prop-types */
// vendors
import React, { useEffect, useRef, useState } from "react";

/**
 * @typedef {object} Props
 * @property {boolean} showPicker
 * @property {(event: React.MouseEvent) => void} toggleShowPicker
 * @property {HTMLDivElement=} buttonElement
 */

/**
 * Emoji Picker Button Component
 * @param {Props} props
 * @return {JSX.Element}
 */
function EmojiPickerButton({ showPicker, toggleShowPicker, buttonElement }) {
  const buttonRef = useRef(null);
  const [showCustomButtonContent, setShowCustomButtonContent] = useState(false);

  useEffect(() => {
    if ((buttonElement?.childNodes?.length ?? 0) > 2) {
      buttonRef.current.appendChild(buttonElement?.childNodes[0]);
      setShowCustomButtonContent(true);
    }
  }, [buttonElement?.childNodes]);

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`react-input-emoji--button${
        showPicker ? " react-input-emoji--button__show" : ""
      }`}
      onClick={toggleShowPicker}
    >
      {!showCustomButtonContent && (
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
      )}
    </button>
  );
}

export default EmojiPickerButton;

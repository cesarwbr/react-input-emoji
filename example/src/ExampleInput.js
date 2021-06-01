// @ts-check
// vendors
import React, { useState } from "react";

import InputEmoji from "react-input-emoji";

const ExampleInput = () => {
  const [text, setText] = useState("");

  /**
   * Handle text change
   * @param {string} text
   */
  function handleTextChange(text) {
    setText(text);
  }

  return (
    <InputEmoji
      value={text}
      onChange={handleTextChange}
      cleanOnEnter
      onEnter={text => {
        console.log("enter", text);
      }}
      placeholder="Type a message"
      keepOpenend
      disableRecent
      maxLength={1200}
    />
  );
};

export default ExampleInput;

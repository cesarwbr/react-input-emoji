// @ts-check

// vendors
import React, { memo, useMemo } from "react";
import Highlight from "react-highlight.js";

/**
 *
 * @return {JSX.Element}
 */
function ExampleCode() {
  const exampleCode = useMemo(
    () => `
    import React, { useState } from 'react'
    import InputEmoji from 'react-input-emoji'
  
    export default function Example () {
      const [ text, setText ] = useState('')
  
      function handleOnEnter (text) {
        console.log('enter', text)
      }
  
      return (
        <InputEmoji
          value={text}
          onChange={setText}
          cleanOnEnter
          onEnter={handleOnEnter}
          placeholder="Type a message"
        />
      )
    }`,
    []
  );
  return <Highlight language="javascript">{exampleCode}</Highlight>;
}

export default memo(ExampleCode);

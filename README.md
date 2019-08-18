# react-emoji-input

> A React input with an option to pick emojis

[![NPM](https://img.shields.io/npm/v/react-emoji-input.svg)](https://www.npmjs.com/package/react-emoji-input) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## About

ReactEmojiInput provides a simple way to have an input element with emoji picker support. Click the picker button next to the input field and select an emoji from the popup window. Done!

## Install

```bash
npm install --save react-emoji-input
```

## Usage

After install import the react-emoji-input component to display your input with emoji support like so:

```jsx
import React, { useState } from 'react'
import ReactEmojiInput from 'react-emoji-input'

export default function Example () {
  const [ text, setText ] = useState('')

  function handleOnEnter (text) {
    console.log('enter', text)
  }

  return (
    <ReactEmojiInput
      value={text}
      onChange={setText}
      cleanOnEnter
      onEnter={handleOnEnter}
      height={40}
      placeholder="Type a message"
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | string | "" | The input value. |
| `onChange` | function | - | This function is called when the value of the input changes. The first argument is the current value. |
| `cleanOnEnter` | boolean | false | Clean the input value after the keydown event. |
| `onEnter` | function | - | This function is called after the keydown event is fired with the `keyCode === 13` returning the last value. |
| `height` | number | 40 | The total height of the area in which the element is rendered. |
| `placeholder` | string | "Type a message" | Set the placeholder of the input. |

## License

MIT © [cesarwbr](https://github.com/cesarwbr)

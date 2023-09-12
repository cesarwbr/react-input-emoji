# react-input-emoji

> A React input with an option to pick emojis

[![NPM](https://img.shields.io/npm/v/react-input-emoji.svg)](https://www.npmjs.com/package/react-input-emoji) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

<a href="https://cesarwbr.github.io/react-input-emoji/"><img width="500" src="https://cesarwbr.github.io/react-input-emoji/assets/images/screely-1566732641740.png" alt="Demo"></a>

## About

InputEmoji provides a simple way to have an input element with emoji picker support. Click the picker button next to the input field and select an emoji from the popup window. Done!

## Install

```bash
npm install --save react-input-emoji
```

## Usage

After install import the react-input-emoji component to display your input with emoji support like so:

```jsx
import React, { useState } from "react";
import InputEmoji from "react-input-emoji";

export default function Example() {
  const [text, setText] = useState("");

  function handleOnEnter(text) {
    console.log("enter", text);
  }

  return (
    <InputEmoji
      value={text}
      onChange={setText}
      cleanOnEnter
      onEnter={handleOnEnter}
      placeholder="Type a message"
    />
  );
}
```

## Props

| Prop               | Type                     | Default          | Description                                                                                                              |
| ------------------ | ------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `borderColor`      | string                   | "#EAEAEA"        | The border color of the input container.                                                                                 |
| `borderRadius`     | number                   | 21               | The border radius of the input container.                                                                                |
| `buttonElement`    | HTMLElement              | -                | An HTMLElement that, when clicked, triggers the emoji picker. If this prop is provided, the default emoji picker button is removed. |
| `buttonRef`        | React.MutableRefObject   | -                | A React mutable ref object that, when referenced, triggers the emoji picker. If this prop is provided, the default emoji picker button is removed. |
| `cleanOnEnter`     | boolean                  | false            | Clean the input value after the keydown event.                                                                           |
| `fontSize`         | number                   | 15               | The font size of the placeholder and input container.                                                                    |
| `fontFamily`       | string                   | "sans-serif"     | The font family of the placeholder and input container.                                                                  |
| `height`           | number                   | 40               | The total height of the area in which the element is rendered.                                                           |
| `keepOpened`       | boolean                  | false            | If set to true, the emoji picker will remain open after selecting an emoji. Defaults to false.                            |
| `maxLength`        | number                   | -                | The maximum number of characters allowed in the element.                                                                 |
| `onChange`         | function                 | -                | This function is called when the value of the input changes. The first argument is the current value.                    |
| `onClick`          | function                 | -                | This function is called when the input is clicked.                                                                       |
| `onEnter`          | function                 | -                | This function is called after the keydown event is fired with the `keyCode === 13` returning the last value.             |
| `onFocus`          | function                 | -                | This function is called when the input has received focus.                                                               |
| `onResize`         | function                 | -                | This function is called when the width or the height of the input changes. The first argument is the current size value. |
| `placeholder`      | string                   | "Type a message" | Set the placeholder of the input.                                                                                        |
| `shouldReturn`     | boolean                  | -                | Allows the user to use the `Shift + Enter` or `Ctrl + Enter` keyboard shortcut to create a new line.                      |
| `theme`            | string                   | -                | Set theme for emoji popup. Available values "light", "dark", "auto"                                                      |
| `value`            | string                   | ""               | The input value.                                                                                                         |

## License

MIT © [cesarwbr](https://github.com/cesarwbr)

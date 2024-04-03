# react-input-emoji 😍 😜 😂 😛

> A powerful and customizable React component that seamlessly integrates emoji picker functionality into any input element, enhancing user experience.

[![NPM](https://img.shields.io/npm/v/react-input-emoji.svg)](https://www.npmjs.com/package/react-input-emoji) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

<a href="https://cesarwbr.github.io/react-input-emoji/"><img width="500" src="https://cesarwbr.github.io/react-input-emoji/assets/images/screely-1566732641740.png" alt="Demo"></a>

## 📝 About

InputEmoji provides a simple and intuitive way to add emoji picker functionality to any input element in your React application. With just a few lines of code, you can enable your users to easily select and insert emojis into their text input. 

The component is highly customizable, allowing you to control the styling, positioning and behavior of the emoji picker. It also supports various useful features out of the box, such as:

- Easy integration with any input element 
- Customizable appearance via props
- Built-in support for cleaning input on enter
- Callback functions for onChange, onClick and onEnter events
- Ability to keep the picker open after selecting an emoji
- Internationalization support for multiple languages

InputEmoji leverages the power of the emoji-mart library to provide a wide range of emojis across different categories and styles. The internationalization capabilities allow you to cater to users from diverse linguistic backgrounds, making your application more inclusive and accessible.

Whether you're building a chat app, social media platform, or any other application that could benefit from emoji input, InputEmoji has you covered. Give your users a fun and engaging way to express themselves with this powerful yet easy-to-use component!

## 📦 Install

```bash
npm install --save react-input-emoji
```

## 🚀 Usage

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

## 🧩 Props

| Prop               | Type                     | Default          | Description                                                                                                              |
| ------------------ | ------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `background`       | string                   | "white"          | Specifies the background color of the input element. Accepts any valid CSS color value.                                  |
| `borderColor`      | string                   | "#EAEAEA"        | Specifies the border color of the input container. Accepts any valid CSS color value.                                    |
| `borderRadius`     | number                   | 21               | Determines the border radius of the input container in pixels. Higher values result in more rounded corners.             |
| `buttonElement`    | HTMLElement              | -                | Allows you to provide a custom HTMLElement that, when clicked, triggers the emoji picker. If this prop is provided, the default emoji picker button is removed. |
| `buttonRef`        | React.MutableRefObject   | -                | Accepts a React mutable ref object that, when referenced, triggers the emoji picker. If this prop is provided, the default emoji picker button is removed. |
| `cleanOnEnter`     | boolean                  | false            | When set to true, the input value will be cleared after the user presses the Enter key.                                  |
| `color`            | string                   | "black"          | Specifies the color of the input text. Accepts any valid CSS color value.                                                |
| `fontSize`         | number                   | 15               | Controls the font size (in pixels) of the placeholder text and input value.                                              |
| `fontFamily`       | string                   | "sans-serif"     | Specifies the font family for the placeholder text and input value. Accepts any valid CSS font-family value.             |
| `height`           | number                   | 40               | Sets the total height (in pixels) of the area in which the input element is rendered.                                    |
| `keepOpened`       | boolean                  | false            | When set to true, the emoji picker will remain open after the user selects an emoji. Defaults to false.                  |
| `language`         | string                   | 'en'             | Specifies the language to be used for the emoji picker. Available values: 'ar', 'be', 'cs', 'de', 'en', 'es', 'fa', 'fi', 'fr', 'hi', 'it', 'ja', 'kr', 'pl', 'pt', 'ru', 'sa', 'tr', 'uk', 'vi', 'zh'. |
| `maxLength`        | number                   | -                | Limits the maximum number of characters that can be entered in the input element.                                        |
| `onChange`         | function                 | -                | A callback function that is invoked whenever the input value changes. It receives the current value as its argument.     |
| `onClick`          | function                 | -                | A callback function that is invoked when the input element is clicked.                                                   |
| `onEnter`          | function                 | -                | A callback function that is invoked when the Enter key is pressed. It receives the current input value as its argument.  |
| `onFocus`          | function                 | -                | A callback function that is invoked when the input element receives focus.                                               |
| `onResize`         | function                 | -                | A callback function that is invoked when the width or height of the input element changes. It receives the current size value as its argument. |
| `placeholder`      | string                   | "Type a message" | Specifies the placeholder text to be displayed when the input is empty.                                                  |
| `placeholderColor` | string                   | "#C4C4C4"        | Specifies the color of the placeholder text. Accepts any valid CSS color value.                                          |
| `shouldConvertEmojiToImage` | boolean        | false            | When set to true, emojis in the input value will be converted to images.                                                  |
| `shouldReturn`     | boolean                  | -                | When set to true, allows the user to create a new line using the `Shift + Enter` or `Ctrl + Enter` keyboard shortcuts.   |
| `theme`            | string                   | -                | Specifies the theme for the emoji picker popup. Available values: "light", "dark", "auto".                               |
| `value`            | string                   | ""               | The current value of the input element.                                                                                  |

## License

MIT © [cesarwbr](https://github.com/cesarwbr)

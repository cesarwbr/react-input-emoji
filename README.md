# react-emoji-input

> A React input with an option to add an emoji

[![NPM](https://img.shields.io/npm/v/react-emoji-input.svg)](https://www.npmjs.com/package/react-emoji-input) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-emoji-input
```

## Usage

```jsx
import React, { useState } from 'react'

import ReactEmojiInput from 'react-emoji-input'

function Example () {
  const [ text, setText ] = useState('')

  return (
    <ReactEmojiInput
      text={text}
      onChange={setText}
    />
  )
}
```

## License

MIT © [cesarwbr](https://github.com/cesarwbr)

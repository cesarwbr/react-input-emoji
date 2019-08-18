import React, { useState, useRef } from 'react'

import ReactEmojiInput from 'react-emoji-input'
import Highlight from 'react-highlight.js'

// style
import {
  GlobalStyle,
  Header,
  Title,
  Subtitle,
  Main,
  Description,
  Snippet,
  Code,
  Example,
  TableTh,
  Table,
  TableTd,
  TableTr,
  EmojiInput,
  EmojiInputCursor,
  Footer,
  Credits,
  FooterLink
} from './style';

export default function App (){
  const [ text, setText ] = useState('')

  const inputEl = useRef(null)

  const exampleCode = `import React, { useState } from 'react'
import ReactEmojiInput from 'react-emoji-input'

export default function Example () {
  const [ text, setText ] = useState('')

  return (
    <ReactEmojiInput
      value={text}
      onChange={setText}
    />
  )
}`

  return (
    <React.Fragment>
      <GlobalStyle />
      {/* <div style={{
        height: '640px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }}>
        <ReactEmojiInput html={this.state.html} onChange={this.handleHTMLChange} />
      </div> */}
      <Header>
        <Title>react-emoji-input</Title>
        <Subtitle>A React input that supports emojis</Subtitle>
        <Subtitle color='white'>
          <EmojiInput>
            😍 😜 😂 😛 <EmojiInputCursor>|</EmojiInputCursor>
          </EmojiInput>
        </Subtitle>
      </Header>
      <Main>
        <Description>
          ReactEmojiInput provides a simple way to insert emojis an input element. Click the picker button next to the text field and select an emoji from the popup window. Done.
        </Description>
        <h1>Install</h1>
        <Description>
          You can get it on npm.
        </Description>
        <Snippet>
          <Code>
            npm install react-emoji-input --save
          </Code>
        </Snippet>
        <h1>Usage</h1>
        <Description>Use react-emoji-input to display your input with emoji support like so:</Description>
        <Example>
          <ReactEmojiInput
            ref={inputEl}
            value={text}
            onChange={setText}
            cleanOnEnter
            onEnter={text => {
              console.log('enter', text)
            }}
            height={40}
            placeholder='Type a message'
          />
        </Example>
        <Snippet>
          <Code>
            <Highlight language='javascript'>
              {exampleCode}
            </Highlight>
          </Code>
        </Snippet>
        <h1>Props</h1>
        <Table>
          <thead>
            <tr>
              <TableTh>Prop</TableTh>
              <TableTh>Description</TableTh>
            </tr>
          </thead>
          <tbody>
            <TableTr>
              <TableTd><Code>value</Code></TableTd>
              <TableTd>The input value</TableTd>
            </TableTr>
            <TableTr>
              <TableTd><Code>onChange</Code></TableTd>
              <TableTd>Runs when the value of the input changes. The first parameter is the value.</TableTd>
            </TableTr>
          </tbody>
        </Table>
      </Main>
      <Footer>
        <Credits>
          Made by <FooterLink href="https://github.com/cesarwbr">Cesar William</FooterLink> under <FooterLink href="https://cesarwilliam.mit-license.org/">MIT license</FooterLink>
        </Credits>
      </Footer>
    </React.Fragment>
  )
}

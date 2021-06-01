// @ts-check

import React from "react";

import ExampleCode from "./ExampleCode";
import ExampleInput from "./ExampleInput";

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
  FooterLink,
  GithubButtons
} from "./style";

/**
 *
 * @return {JSX.Element}
 */
export default function App() {
  return (
    <React.Fragment>
      <GlobalStyle />
      <Header>
        <Title>react-input-emoji</Title>
        <Subtitle>A React input that supports emojis</Subtitle>
        <Subtitle color="white">
          <EmojiInput>
            <span role="img" aria-label="heart eyes">
              😍
            </span>
            &nbsp;
            <span
              role="img"
              aria-label="Face with Stuck-out Tongue and Winking Eye"
            >
              😜
            </span>
            &nbsp;
            <span role="img" aria-label="Face with Tears of Joy">
              😂
            </span>
            &nbsp;
            <span role="img" aria-label="Face with Stuck-out Tongue">
              😛{" "}
            </span>
            &nbsp;
            <EmojiInputCursor>|</EmojiInputCursor>
          </EmojiInput>
        </Subtitle>
        <GithubButtons>
          <iframe
            src="https://ghbtns.com/github-btn.html?user=cesarwbr&amp;repo=react-input-emoji&amp;type=watch&amp;count=true&amp;size=large"
            frameBorder="0"
            scrolling="0"
            width="152"
            height="30"
            title="Github stars"
          />
          <iframe
            src="https://ghbtns.com/github-btn.html?user=cesarwbr&amp;repo=react-input-emoji&amp;type=fork&amp;count=true&amp;size=large"
            frameBorder="0"
            scrolling="0"
            width="156"
            height="30"
            title="Github fork"
          />
        </GithubButtons>
      </Header>
      <Main>
        <Description>
          InputEmoji provides a simple way to have an input element with emoji
          picker support. Click the picker button next to the input field and
          select an emoji from the popup window. Done!
        </Description>
        <h1>Install</h1>
        <Description>You can get it on npm.</Description>
        <Snippet>
          <Code>npm install react-input-emoji --save</Code>
        </Snippet>
        <h1>Usage</h1>
        <Description>
          After install import the react-input-emoji component to display your
          input with emoji support like so:
        </Description>
        <Example>
          <ExampleInput />
        </Example>
        <Snippet>
          <Code>
            <ExampleCode />
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
              <TableTd>
                <Code>value</Code>
              </TableTd>
              <TableTd>The input value.</TableTd>
            </TableTr>
            <TableTr>
              <TableTd>
                <Code>onChange</Code>
              </TableTd>
              <TableTd>
                This function is called when the value of the input changes. The
                first argument is the current value.
              </TableTd>
            </TableTr>
            <TableTr>
              <TableTd>
                <Code>onResize</Code>
              </TableTd>
              <TableTd>
                This function is called when the width or the height of the
                input changes. The first argument is the current size value.
              </TableTd>
            </TableTr>
            <TableTr>
              <TableTd>
                <Code>onClick</Code>
              </TableTd>
              <TableTd>
                This function is called when the input is clicked.
              </TableTd>
            </TableTr>
            <TableTr>
              <TableTd>
                <Code>onFocus</Code>
              </TableTd>
              <TableTd>
                This function is called when the input has received focus.
              </TableTd>
            </TableTr>
            <TableTr>
              <TableTd>
                <Code>cleanOnEnter</Code>
              </TableTd>
              <TableTd>Clean the input value after the keydown event.</TableTd>
            </TableTr>
            <TableTr>
              <TableTd>
                <Code>onEnter</Code>
              </TableTd>
              <TableTd>
                This function is called after the keydown event is fired with
                the <Code inline>keyCode === 13</Code> returning the last value.
              </TableTd>
            </TableTr>
            <TableTr>
              <TableTd>
                <Code>placeholder</Code>
              </TableTd>
              <TableTd>
                Defaults to &quot;Type a message&quot;. Set the placeholder of
                the input.
              </TableTd>
            </TableTr>
            <TableTr>
              <TableTd>
                <Code>height</Code>
              </TableTd>
              <TableTd>
                Defaults to 40. The total height of the area in which the
                element is rendered.
              </TableTd>
            </TableTr>
            <TableTr>
              <TableTd>
                <Code>maxLength</Code>
              </TableTd>
              <TableTd>
                The maximum number of characters allowed in the element.
              </TableTd>
            </TableTr>
            <TableTr>
              <TableTd>
                <Code>borderRadius</Code>
              </TableTd>
              <TableTd>
                Defaults to 21. The border radius of the input container.
              </TableTd>
            </TableTr>
            <TableTr>
              <TableTd>
                <Code>borderColor</Code>
              </TableTd>
              <TableTd>
                Defaults to <Code inline>#EAEAEA</Code>. The border color of the
                input container.
              </TableTd>
            </TableTr>
            <TableTr>
              <TableTd>
                <Code>fontSize</Code>
              </TableTd>
              <TableTd>
                Defaults to 15. The font size of the placeholder and input
                container.
              </TableTd>
            </TableTr>
            <TableTr>
              <TableTd>
                <Code>fontFamily</Code>
              </TableTd>
              <TableTd>
                Defaults to &quot;sans-serif&quot;. The font family of the
                placeholder and input container.
              </TableTd>
            </TableTr>
          </tbody>
        </Table>
      </Main>
      <Footer>
        <Credits>
          Made by{" "}
          <FooterLink href="https://github.com/cesarwbr">
            Cesar William
          </FooterLink>{" "}
          under{" "}
          <FooterLink href="https://cesarwilliam.mit-license.org/">
            MIT license
          </FooterLink>
        </Credits>
      </Footer>
    </React.Fragment>
  );
}

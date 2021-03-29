// @ts-check

// vendors
import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html {
    font-family: sans-serif;
    text-size-adjust: 100%;
  }

  body {
    font-family: lato,sans-serif;
    color: #333;
    background-color: #fff;
    margin: 0;
  }

  * {
    box-sizing: border-box;
  }

  h1 {
    color: #1bc1a1;
    font-size: 30px;
    line-height: 1.1;
    margin: .67em 0;
    margin-top: 80px;
    margin-bottom: 15px;
  }
`;

export const Header = styled.header`
  padding-top: 92px;
  background: linear-gradient(45deg, #4cd964 0%, #5ac8fa 100%);
  margin: 0 auto;
  text-align: center;
`;

export const Title = styled.h1`
  color: #fff;
  font-size: 64px;
  font-weight: 900;
  letter-spacing: -1px;
  margin: 0 20px 20px;
`;

export const Subtitle = styled.h2`
  color: ${props => props.color || "#16a085"};
  font-size: 27px;
  font-weight: 400;
  line-height: 30px;
  margin: 0 20px 20px;
`;

export const Main = styled.main`
  margin: 0 auto 90px;
  max-width: 540px;
  padding: 0 15px;
  display: block;
`;

export const Description = styled.p`
  color: #333;
  font-size: 18px;
  line-height: 1.7;
`;

/**
 * @typedef {object} Props
 * @prop {boolean=} inline
 *
 * @typedef {import("styled-components")
 *  .ThemedStyledFunction<"code", any, Props>} CodeT
 */

// eslint-disable-next-line valid-jsdoc
export const Code = /** @type {CodeT} */ (styled.code)`
  font-size: 14px;
  line-height: 20px;
  display: inline-block;
  overflow-x: auto;
  padding: 0.5em;
  color: #333;
  background: #f8f8f8;
  border-radius: 3px;
  margin: 0;
  font-family: Consolas, liberation mono, Menlo, Courier, monospace;
  margin-bottom: ${({ inline }) => ((inline ? "-11px" : "0"))};

  span {
    font-family: Consolas, liberation mono, Menlo, Courier, monospace;
  }
`;

export const Snippet = styled.pre`
  position: relative;
  overflow: visible;
  margin-top: 0;
  margin-bottom: 0;
  font: 12px Consolas, liberation mono, Menlo, Courier, monospace;

  ${Code} {
    width: 100%;
  }
`;

export const Example = styled.div`
  position: relative;
  margin: 15px 0 0;
  padding: 39px 19px 14px;
  background-color: #fff;
  border-radius: 4px 4px 0 0;
  border: 1px solid #ddd;
  z-index: 2;

  ::after {
    content: "Example";
    position: absolute;
    top: 0;
    left: 0;
    padding: 2px 8px;
    font-size: 12px;
    font-weight: 700;
    background-color: #f5f5f5;
    color: #9da0a4;
    border-radius: 4px 0 4px 0;
  }
`;

export const Table = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
`;

export const TableTh = styled.th`
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
`;

/**
 * @typedef {object} PropsTableTr
 * @prop {boolean=} gray
 *
 * @typedef {import("styled-components")
 *  .ThemedStyledFunction<"tr", any, PropsTableTr>} TableTrT
 */

// eslint-disable-next-line valid-jsdoc
export const TableTr = /** @type {TableTrT} */ (styled.tr)`
  background-color: ${props => ((props.gray ? "#f6f8fa" : "#ffffff"))};
`;

export const TableTd = styled.td`
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
  line-height: 20px;
`;

export const EmojiInput = styled.span`
  width: 200px;
  margin: 0 auto;
  border: 2px solid #15a085;
  border-radius: 25px;
  color: #15a085;
  line-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const EmojiInputCursor = styled.span`
  font-size: 26px;
  animation: blinker 1s linear infinite;
  line-height: 30px;
  padding-bottom: 7px;

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
`;

export const Footer = styled.footer`
  background: linear-gradient(45deg, #4cd964 0%, #5ac8fa 100%);
  margin: 0 auto;
  text-align: center;
  display: block;
`;

export const Credits = styled.p`
  font-weight: 400;
  font-family: lato, sans-serif;
  font-size: 20px;
  color: #16a085;
  padding: 30px 0;
  margin: 0;
  line-height: 1.7;
`;

export const FooterLink = styled.a`
  color: #fff;
  border-color: #fff;
  border-bottom: 1px dotted #1bc1a1;
  transition: opacity 0.3s ease-in-out;
  text-decoration: none;
  background-color: transparent;
`;

export const GithubButtons = styled.p`
  margin: 92px 0 0;
  background: rgba(0, 0, 0, 0.1);
  padding: 20px 0 10px;
  color: #333;
  font-size: 18px;
  line-height: 1.7;
`;

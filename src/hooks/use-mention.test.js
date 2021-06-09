// @ts-check

import { renderHook, act } from "@testing-library/react-hooks/dom";
import { mentionUsers } from "../../fixtures/examples";
import { useMention } from "./use-mention";

test("should return mention users", async () => {
  // eslint-disable-next-line valid-jsdoc
  /**
   *
   * @param {string} _text
   * @returns
   */
  async function searchMention(_text) {
    return [...mentionUsers];
  }

  const { result, waitForNextUpdate } = renderHook(() =>
    useMention(searchMention)
  );

  mockGetSelection("@");

  act(() => {
    // @ts-ignore
    result.current.onKeyUp({ key: "@" });
  });

  await waitForNextUpdate();

  expect(result.current.mentionUsers).toEqual(mentionUsers);
});

test("should return empty users", async () => {
  // eslint-disable-next-line valid-jsdoc
  /**
   *
   * @param {string} _text
   * @returns
   */
  const searchMention = jest.fn(async _text => []);

  const { result } = renderHook(() => useMention(searchMention));

  mockGetSelection("a");

  act(() => {
    // @ts-ignore
    result.current.onKeyUp({ key: "a" });
  });

  expect(result.current.mentionUsers).toEqual([]);
  expect(searchMention.mock.calls.length).toBe(0);
});

test("should return empty users when @ is after another letter", async () => {
  // eslint-disable-next-line valid-jsdoc
  /**
   *
   * @param {string} _text
   * @returns
   */
  const searchMention = jest.fn(async _text => []);

  const { result } = renderHook(() => useMention(searchMention));

  mockGetSelection("a@");

  act(() => {
    // @ts-ignore
    result.current.onKeyUp({ key: "@" });
  });

  expect(result.current.mentionUsers).toEqual([]);
  expect(searchMention.mock.calls.length).toBe(0);
});

/**
 *
 * @param {string} value
 */
function mockGetSelection(value) {
  const anchorNode = document.createTextNode(value);

  const getRangeAt = jest.fn(() => ({
    selectNodeContents: jest.fn(),
    setEnd: jest.fn(),
    cloneRange: jest.fn(() => ({
      selectNodeContents: jest.fn(),
      setEnd: jest.fn(),
      toString: jest.fn(() => ({
        length: 1
      }))
    }))
  }));
  document.getSelection = jest.fn().mockReturnValue({ anchorNode, getRangeAt });
}

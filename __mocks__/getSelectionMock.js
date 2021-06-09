// @ts-check
/**
 *
 * @param {string} value
 */
export function mockGetSelection(value) {
  const anchorNode = document.createTextNode(value);

  const getRangeAt = jest.fn(() => ({
    selectNodeContents: jest.fn(),
    setEnd: jest.fn(),
    cloneRange: jest.fn(() => ({
      selectNodeContents: jest.fn(),
      setEnd: jest.fn(),
      toString: jest.fn(() => ({
        length: value.length
      }))
    }))
  }));
  document.getSelection = jest.fn().mockReturnValue({ anchorNode, getRangeAt });
}

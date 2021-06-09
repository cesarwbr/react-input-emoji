// @ts-check
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import InputEmoji from "../index";
import { mentionUsers } from "../../fixtures/examples";
import { mockGetSelection } from "../../__mocks__/getSelectionMock";
import * as inputEventUtils from "../utils/input-event-utils";

const mockSearchMention = jest.fn(text => {
  if (text === "@") {
    return mentionUsers;
  } else if (text === "@s") {
    return [mentionUsers[0]];
  } else {
    return [];
  }
});

afterEach(() => {
  document.getSelection = document.getSelection;
});

test("should show user list when type @", async () => {
  const { getByText } = render(
    // @ts-ignore
    <InputEmoji searchMention={mockSearchMention} />
  );

  mockGetSelection("@");

  fireEvent.keyUp(screen.getByTestId("react-input-emoji--input"), {
    key: "@",
    code: "Digit2"
  });

  await waitFor(() => {
    expect(getByText(/stacey\ fleming/i)).toBeInTheDocument();
    expect(getByText(/rachel\ marshall/i)).toBeInTheDocument();
    expect(getByText(/bernice\ patterson/i)).toBeInTheDocument();
  });
});

test("should close user list when there is no match", async () => {
  const { queryByText } = render(
    // @ts-ignore
    <InputEmoji searchMention={mockSearchMention} />
  );

  mockGetSelection("@t");

  fireEvent.keyUp(screen.getByTestId("react-input-emoji--input"), {
    key: "@",
    code: "Digit2"
  });

  await waitFor(() => {
    expect(queryByText(/stacey\ fleming/i)).not.toBeInTheDocument();
    expect(queryByText(/rachel\ marshall/i)).not.toBeInTheDocument();
    expect(queryByText(/bernice\ patterson/i)).not.toBeInTheDocument();
  });
});

test("should add the matched string in a span tag", async () => {
  const { getByTestId } = render(
    // @ts-ignore
    <InputEmoji searchMention={mockSearchMention} />
  );

  mockGetSelection("@s");

  fireEvent.keyUp(screen.getByTestId("react-input-emoji--input"), {
    key: "@",
    code: "Digit2"
  });

  await waitFor(() => {
    expect(getByTestId("metion-selected-word")).toBeInTheDocument();
  });
});

test("should select the first item", async () => {
  const { getByText } = render(
    // @ts-ignore
    <InputEmoji searchMention={mockSearchMention} />
  );

  mockGetSelection("@");

  fireEvent.keyUp(screen.getByTestId("react-input-emoji--input"), {
    key: "@",
    code: "Digit2"
  });

  await waitFor(() => {
    expect(getByText(/stacey\ fleming/i).parentElement).toHaveClass(
      "react-input-emoji--mention--item__selected"
    );

    expect(getByText(/rachel\ marshall/i).parentElement).not.toHaveClass(
      "react-input-emoji--mention--item__selected"
    );

    expect(getByText(/bernice\ patterson/i).parentElement).not.toHaveClass(
      "react-input-emoji--mention--item__selected"
    );
  });
});

test("should selects the second item on user hover on it", async () => {
  const { getByText } = render(
    // @ts-ignore
    <InputEmoji searchMention={mockSearchMention} />
  );

  mockGetSelection("@");

  fireEvent.keyUp(screen.getByTestId("react-input-emoji--input"), {
    key: "@",
    code: "Digit2"
  });

  await waitFor(() => {
    userEvent.hover(getByText(/rachel\ marshall/i));

    expect(getByText(/stacey\ fleming/i).parentElement).not.toHaveClass(
      "react-input-emoji--mention--item__selected"
    );

    expect(getByText(/rachel\ marshall/i).parentElement).toHaveClass(
      "react-input-emoji--mention--item__selected"
    );

    expect(getByText(/bernice\ patterson/i).parentElement).not.toHaveClass(
      "react-input-emoji--mention--item__selected"
    );
  });
});

test("should add a metion when clicks on an item", async () => {
  const { getByText } = render(
    // @ts-ignore
    <InputEmoji searchMention={mockSearchMention} />
  );

  mockGetSelection("@");

  const mock = jest.spyOn(inputEventUtils, "handlePasteHtmlAtCaret");

  mock.mockImplementation(() => {
    screen.getByTestId("react-input-emoji--input").innerHTML =
      "@rachel marshall";
  });

  fireEvent.keyUp(screen.getByTestId("react-input-emoji--input"), {
    key: "@",
    code: "Digit2"
  });

  await waitFor(() => {
    userEvent.click(getByText(/rachel\ marshall/i).parentElement);
    expect(getByText(/@rachel\ marshall/i)).toBeInTheDocument();
  });
});

test.todo("should call appendContent when press enter");

// @ts-check

import { renderHook, act } from "@testing-library/react-hooks/dom";

import { useEventListeners } from "./use-event-listeners";

test("should register a listener and publish an event", () => {
  const { result } = renderHook(() => useEventListeners());

  let event = "";

  act(() => {
    result.current.addEventListener("keyUp", evt => {
      event = evt;
    });
    result.current.listeners.keyUp.publish("hey");
  });

  expect(event).toEqual("hey");
});

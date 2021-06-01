// @ts-check

import { useImperativeHandle } from "react";
import { replaceAllTextEmojiToString } from "../utils/emoji-utils";

/**
 * @typedef {Object} Props
 * @property {React.Ref<any>} ref
 * @property {React.MutableRefObject<string>} cleanedTextRef
 * @property {React.MutableRefObject<HTMLDivElement>} textInputRef
 * @property {(value: string) => void} setValue
 * @property {() => void} emitChange
 */

/**
 *
 * @param {Props} props
 */
export function useExpose({
  ref,
  cleanedTextRef,
  textInputRef,
  setValue,
  emitChange
}) {
  useImperativeHandle(ref, () => ({
    get value() {
      return cleanedTextRef.current;
    },
    set value(value) {
      setValue(value);
    },
    focus: () => {
      textInputRef.current.focus();
    },
    blur: () => {
      const text = replaceAllTextEmojiToString(textInputRef.current.innerHTML);

      cleanedTextRef.current = text;

      emitChange();
    }
  }));
}

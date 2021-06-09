// @ts-check
import { useCallback, useState } from "react";
import {
  deleteTextFromAtToCaret,
  getElementWithFocus,
  getTextFromAtToCaret
} from "../utils/mention-utils";

/**
 * @typedef {import('../types/types').MentionUser} MentionUser
 */

// eslint-disable-next-line valid-jsdoc
/**
 *
 * @param {(text: string) => Promise<MentionUser[]>=} searchMention
 * @returns {{mentionSearchText: string | null, mentionUsers: MentionUser[], onKeyUp: (event: React.KeyboardEvent) => void, onFocus: () => void, onSelectUser: () => void, loading: boolean}}
 */
export function useMention(searchMention) {
  const [loading, setLoading] = useState(false);

  /** @type {[MentionUser[], React.Dispatch<React.SetStateAction<MentionUser[]>>]} */
  const [mentionUsers, setMentionUsers] = useState([]);

  /** @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]} */
  const [mentionSearchText, setMentionSearchText] = useState(null);

  const onSelectUser = useCallback(() => {
    deleteTextFromAtToCaret();
    setMentionUsers([]);
  }, []);

  /** */
  const checkMentionText = useCallback(async () => {
    const metionText = getTextFromAtToCaret();

    setMentionSearchText(metionText);

    if (metionText === null) {
      setMentionUsers([]);
    } else {
      setLoading(true);
      const users = await searchMention(metionText);
      setLoading(false);
      setMentionUsers(users);
    }
  }, [searchMention]);

  /** @type {(event: React.KeyboardEvent) => void} */
  const onKeyUp = useCallback(
    async event => {
      if (typeof searchMention !== "function") return;

      if (
        event.key === "Backspace" &&
        getElementWithFocus()?.element.parentElement.hasAttribute(
          "data-mention-id"
        )
      ) {
        const elementWithFocus = getElementWithFocus();
        elementWithFocus.element.parentElement.remove();
      } else if (
        !["ArrowUp", "ArrowDown", "Esc", "Escape"].includes(event.key)
      ) {
        checkMentionText();
      }
    },
    [checkMentionText, searchMention]
  );

  const onFocus = useCallback(() => {
    checkMentionText();
  }, [checkMentionText]);

  return {
    mentionSearchText,
    mentionUsers,
    onKeyUp,
    onFocus,
    onSelectUser,
    loading
  };
}

// @ts-check
/* eslint-disable react/prop-types */
// vendors
import React, { useEffect, useRef, useState } from "react";

// hooks
import { useMention } from "../hooks/use-mention";

// components
import MentionUserList from "./mention-user-list";

/**
 * @typedef {import('../types/types').MentionUser} MetionUser
 */

/**
 * @typedef {import('../types/types').TextInputListeners} TextInputListeners
 */

/**
 * @typedef {import('../types/types').SanitizeFn} SanitizeFn
 */

/**
 * @typedef {Object} Props
 * @property {(text: string) => Promise<MetionUser[]>=} searchMention
 * @property {(event: keyof TextInputListeners, fn: import('../types/types').Listerner<any>) => () => void} addEventListener
 * @property {(html: string) => void} appendContent
 * @property {(fn: SanitizeFn) => void} addSanitizeFn
 */

// eslint-disable-next-line valid-jsdoc
/** @type {React.FC<Props>} */
const MentionWrapper = ({
  searchMention,
  addEventListener,
  appendContent,
  addSanitizeFn
}) => {
  /** @type {React.MutableRefObject<import('./mention-user-list').Ref | null>} */
  const metionUserListRef = useRef(null);
  const [showUserList, setShowUserList] = useState(false);

  const {
    mentionSearchText,
    mentionUsers,
    loading,
    onKeyUp,
    onFocus,
    onSelectUser
  } = useMention(searchMention);

  useEffect(() => {
    addSanitizeFn(html => {
      const container = document.createElement("div");
      container.innerHTML = html;

      const mentionsEl = Array.prototype.slice.call(
        container.querySelectorAll(".react-input-emoji--mention--text")
      );

      mentionsEl.forEach(mentionEl => {
        container.innerHTML = container.innerHTML.replace(
          mentionEl.outerHTML,
          `@[${mentionEl.dataset.mentionName}](userId:${mentionEl.dataset.mentionId})`
        );
      });

      return container.innerHTML;
    });
  }, [addSanitizeFn]);

  useEffect(() => {
    setShowUserList(mentionUsers.length > 0);
  }, [mentionUsers]);

  useEffect(() => {
    /** */
    function checkClickOutside() {
      setShowUserList(false);
    }

    document.addEventListener("click", checkClickOutside);

    return () => {
      document.removeEventListener("click", checkClickOutside);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = addEventListener("keyUp", onKeyUp);

    return () => {
      unsubscribe();
    };
  }, [addEventListener, onKeyUp]);

  useEffect(() => {
    /**
     *
     * @param {React.KeyboardEvent} event
     */
    function handleKeyDown(event) {
      switch (event.key) {
        case "Esc": // IE/Edge specific value
        case "Escape":
          setShowUserList(false);
          break;
        default:
          break;
      }
    }

    const unsubscribe = addEventListener("keyDown", handleKeyDown);

    return () => {
      unsubscribe();
    };
  }, [addEventListener]);

  useEffect(() => {
    const unsubscribe = addEventListener("focus", onFocus);

    return () => {
      unsubscribe();
    };
  }, [addEventListener, onFocus]);

  useEffect(() => {
    if (showUserList) {
      const unsubscribeArrowUp = addEventListener("arrowUp", event => {
        event.stopPropagation();
        event.preventDefault();
        metionUserListRef.current.prevUser();
      });

      const unsubscribeArrowDown = addEventListener("arrowDown", event => {
        event.stopPropagation();
        event.preventDefault();
        metionUserListRef.current.nextUser();
      });

      return () => {
        unsubscribeArrowUp();
        unsubscribeArrowDown();
      };
    }
  }, [addEventListener, showUserList]);

  /**
   *
   * @param {MetionUser} user
   */
  function handleSelect(user) {
    onSelectUser();
    appendContent(
      `<span class="react-input-emoji--mention--text" data-mention-id="${user.id}" data-mention-name="${user.name}">@${user.name}</span> `
    );
  }

  return (
    <>
      {loading ? (
        <div className="react-input-emoji--mention--container">
          <div className="react-input-emoji--mention--loading">
            <div className="react-input-emoji--mention--loading--spinner">
              Loading...
            </div>
          </div>
        </div>
      ) : (
        showUserList && (
          <div
            className="react-input-emoji--mention--container"
            onClick={evt => evt.stopPropagation()}
          >
            <MentionUserList
              ref={metionUserListRef}
              mentionSearchText={mentionSearchText}
              users={mentionUsers}
              onSelect={handleSelect}
              addEventListener={addEventListener}
            />
          </div>
        )
      )}
    </>
  );
};

export default MentionWrapper;

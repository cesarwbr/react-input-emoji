// @ts-check
/* eslint-disable react/prop-types */
// vendors
import React, {
  useImperativeHandle,
  useState,
  forwardRef,
  useMemo,
  useEffect
} from "react";
import t from "prop-types";

/**
 * @typedef {import('../types/types').MentionUser} MentionUser
 */

/**
 * @typedef {import('../types/types').TextInputListeners} TextInputListeners
 */

/**
 * @typedef {Object} Props
 * @property {MentionUser[]} users
 * @property {string | null} mentionSearchText
 * @property {(user: MentionUser) => void} onSelect
 * @property {(event: keyof TextInputListeners, fn: import('../types/types').Listerner<any>) => () => void} addEventListener
 */

/**
 * @typedef {{prevUser: () => void; nextUser: () => void;}} Ref
 */

// eslint-disable-next-line valid-jsdoc
/** @type {React.ForwardRefRenderFunction<Ref, Props>} */
const MentionUserList = (
  { users, mentionSearchText, onSelect, addEventListener },
  ref
) => {
  const [selectedUser, setSelectedUser] = useState(0);

  useImperativeHandle(ref, () => ({
    prevUser: () => {
      setSelectedUser(currentSelectedUser => {
        if (currentSelectedUser === 0) {
          return 0;
        }

        return currentSelectedUser - 1;
      });
    },
    nextUser: () => {
      setSelectedUser(currentSelectedUser => {
        if (currentSelectedUser === users.length - 1) {
          return users.length - 1;
        }

        return currentSelectedUser + 1;
      });
    }
  }));

  useEffect(() => {
    setSelectedUser(0);
  }, [users]);

  /**
   *
   * @param {string} selectedText
   * @param {string} rest
   * @return {string}
   */
  function getMentionSelectedNameEl(selectedText, rest) {
    return `<span class="react-input-emoji--mention--item--name__selected" data-testid="metion-selected-word">${selectedText}</span>${rest}`;
  }

  /** @type {(MentionUser & {nameHtml: string})[]} */
  const usersFiltered = useMemo(() => {
    const searchText = mentionSearchText
      ? mentionSearchText.substring(1).toLocaleLowerCase()
      : "";
    return users.map(user => {
      let nameHtml = user.name;

      if (mentionSearchText && mentionSearchText.length > 1) {
        if (user.name.toLowerCase().startsWith(searchText)) {
          nameHtml = getMentionSelectedNameEl(
            user.name.substring(0, searchText.length),
            user.name.substring(searchText.length)
          );
        } else {
          const names = user.name.split(" ");

          nameHtml = names
            .map(name => {
              if (name.toLocaleLowerCase().startsWith(searchText)) {
                return getMentionSelectedNameEl(
                  name.substring(0, searchText.length),
                  name.substring(searchText.length)
                );
              }
              return name;
            })
            .join(" ");
        }
      }

      return {
        ...user,
        nameHtml
      };
    });
  }, [mentionSearchText, users]);

  // eslint-disable-next-line valid-jsdoc
  /**
   *
   * @param {MentionUser} user
   * @returns {(event: React.MouseEvent) => void} event
   */
  function handleClick(user) {
    return event => {
      event.stopPropagation();
      event.preventDefault();

      onSelect(user);
    };
  }

  useEffect(() => {
    const unsubscribe = addEventListener("enter", event => {
      event.stopPropagation();
      event.preventDefault();
      onSelect(usersFiltered[selectedUser]);
    });

    return () => {
      unsubscribe();
    };
  }, [addEventListener, onSelect, selectedUser, usersFiltered]);

  return (
    <ul
      className="react-input-emoji--mention--list"
      data-testid="mention-user-list"
    >
      {usersFiltered.map((user, index) => (
        <li key={user.id}>
          <button
            type="button"
            onClick={handleClick(user)}
            className={`react-input-emoji--mention--item${
              selectedUser === index
                ? " react-input-emoji--mention--item__selected"
                : ""
            }`}
            onMouseOver={() => setSelectedUser(index)}
          >
            <img
              className="react-input-emoji--mention--item--img"
              src={user.image}
            />
            <div
              className="react-input-emoji--mention--item--name"
              dangerouslySetInnerHTML={{ __html: user.nameHtml }}
            />
          </button>
        </li>
      ))}
    </ul>
  );
};

const MentionUserListWithRef = forwardRef(MentionUserList);

MentionUserListWithRef.propTypes = {
  users: t.array.isRequired
};

export default MentionUserListWithRef;

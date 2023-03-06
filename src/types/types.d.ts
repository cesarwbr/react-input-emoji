import { CustomEmoji, BaseEmoji } from "emoji-mart";

export interface EmojiMartItem {
  id: string;
  name: string;
  native: string;
  unified: string;
  keywords: string[];
  shortcodes: string;
  emoticons: string[];
}

export interface MentionUser {
  id: string;
  name: string;
  image: string;
}

export type Listerner<T> = (event: T) => void;

export type ListenerObj<T> = {
  subscribe: (listerner: Listerner<T>) => () => void;
  publish: (event?: T) => void;
  currentListerners: Listerner<T>[];
};

export type TextInputListeners = {
  keyDown: ListenerObj<any>;
  keyUp: ListenerObj<any>;
  arrowUp: ListenerObj<any>;
  arrowDown: ListenerObj<any>;
  enter: ListenerObj<any>;
  focus: ListenerObj<any>;
  blur: ListenerObj<any>;
};

export type SanitizeFn = (html: string) => string;

export type PolluteFn = (text: string) => string;

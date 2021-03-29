import { CustomEmoji, BaseEmoji } from "emoji-mart";

export interface EmojiMartItem extends CustomEmoji, BaseEmoji {
  emoticons: string[];
  colons: string;
  id: string;
}

import { KeyListener } from "./key_listener";

export class KeyManager {

  static processKeyCombination = (keys: string): string[] => {

    return keys.split(" ").map(part => {
      return part.split("+").map(key => this.normalize(key)).sort().join("+");
    });
  };

  static normalize = (key: string): string => {

    key = key.trim();
    if (key.length === 1) return key;

    key = key.toLowerCase();
    switch (key) {
      case "esc":
        return "escape";
      case "ctrl":
        return "control";
      case "option":
        return "alt";
      default:
        return key;
    }
  };

  static getKeyListener = (debounceTime: number): KeyListener => {

    return new KeyListener(debounceTime);
  };
}
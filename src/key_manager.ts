import { KeyListener } from "./key_listener";

export class KeyManager {

  static processKeyCombination = (keys: string): string[] => {

    return keys.split(" ").map(part => {
      return part.split("+").map(key => this.normalize(key)).sort().join("+");
    });
  };

  static normalize = (key: string): string => {

    key = key.trim();
    key = key.toLowerCase();

    if (key.length === 1) return key;

    switch (key) {
      case "esc":
        return "escape";
      case "ctrl":
        return "control";
      case "option":
        return "alt";
      case "os":
        return "meta";
      default:
        return key;
    }
  };

  static isActionKey = (key: string): boolean => {

    return ["meta", "control", "alt", "shift"].includes(this.normalize(key));
  };

  static toString = (keyboardEvent: KeyboardEvent): string => {

    const key = [];
    if (keyboardEvent.metaKey) key.push(this.normalize("meta"));
    if (keyboardEvent.ctrlKey) key.push(this.normalize("ctrl"));
    if (keyboardEvent.shiftKey) key.push(this.normalize("shift"));
    if (keyboardEvent.altKey) key.push(this.normalize("option"));
    key.push(this.normalize(keyboardEvent.key));

    return key.sort().join("+");
  };

  static getKeyListener = (debounceTime: number): KeyListener => {

    return new KeyListener(debounceTime);
  };
}
import { KeyManager } from "./key_manager";
import { ScopeManager } from "./scope_manager";
import { ActionTree } from "./action_tree";
import { IAction, ShortKeyMode, ShortKeyNode, ShortKeyScope } from "./types";
import { TimeHelper } from "./helpers/time_helper";
import { VnShortKey } from "./vn_short_key";
import { DEFAULT_DEBOUNCE_TIME } from "./constants";

export class KeyListener {
  _debounceTime: number;
  _combinationBuffer: string[];
  static _alreadyBound: boolean;
  _keyDownListener: (keyboardEvent: KeyboardEvent) => void;
  _keyUpListener: (keyboardEvent: KeyboardEvent) => void;

  constructor(debounceTime = DEFAULT_DEBOUNCE_TIME) {

    this._debounceTime = debounceTime;
    this._combinationBuffer = [];
    this._keyDownListener = this.getKeyDownListener();
    this._keyUpListener = this.getKeyUpListener();
  }

  bind = () => {

    if (!KeyListener._alreadyBound) {
      document.addEventListener("keydown", this._keyDownListener);
      document.addEventListener("keyup", this._keyUpListener);
      KeyListener._alreadyBound = true;
    }
  };

  unbind = () => {

    if (KeyListener._alreadyBound) {
      document.removeEventListener("keydown", this._keyDownListener);
      document.removeEventListener("keyup", this._keyUpListener);
      KeyListener._alreadyBound = false;
    }
  };

  getKeyDownListener = () => {

    return (keyboardEvent: KeyboardEvent) => {

      if (this.isKeyHolding(keyboardEvent)) return;

      const scope = ScopeManager.get(VnShortKey.getScope());
      if (!scope) return;

      this.resetSearchingAfterDebounce();
      const pressedKey = keyboardEvent.key;
      if (this.shouldIgnore(pressedKey)) return;

      this._combinationBuffer.push(KeyManager.normalize(pressedKey));
      const treeNode = this.lookForTreeNode(scope);
      this._combinationBuffer.pop();
      if (!treeNode) return;

      if (treeNode.actions?.length > 0) {
        this.triggerActions(treeNode.actions, keyboardEvent);
        this.resetToRoot(scope);
        return;
      }

      // To go deeper into tree
      this.getModeTree(scope).currentNode = treeNode;
    };
  };

  private isKeyHolding = (e: KeyboardEvent): boolean => {

    return e.repeat;
  };

  private shouldIgnore = (pressedKey: string): boolean => {

    return pressedKey === "Shift" ||
      pressedKey === "OS" ||
      this.isExistedInCombination(pressedKey);
  };

  private isExistedInCombination = (pressedKey: string): boolean => {

    return this._combinationBuffer.find(key => key === KeyManager.normalize(pressedKey)) !== undefined;
  };

  private resetSearchingAfterDebounce = (): void => {

    TimeHelper.debounce(
      () => {
        const scope = ScopeManager.get(VnShortKey.getScope());
        const mode = scope && scope.modeMap.get(VnShortKey.getMode());
        if (mode) {
          mode.currentNode = mode.root;
        }
      }, this._debounceTime
    )();
  };

  private lookForTreeNode = (scope: ShortKeyScope): ShortKeyNode | undefined => {

    const keys = this._combinationBuffer.sort().join("+");
    return ActionTree.getNodeByKeys(scope, VnShortKey.getMode(), keys);
  };

  private triggerActions = (actions: IAction[], keyboardEvent: KeyboardEvent): void => {

    let upstreamReturn: unknown = null;
    for (let i = 0; i < actions.length; i++) {
      keyboardEvent.preventDefault();
      upstreamReturn = actions[i](keyboardEvent, upstreamReturn);
    }
  };

  private resetToRoot = (scope: ShortKeyScope): void => {

    const modeTree = this.getModeTree(scope);
    modeTree.currentNode = modeTree.root;
  };

  getKeyUpListener = () => {

    return (keyboardEvent: KeyboardEvent) => {

      this.removeKeyFromCombination(keyboardEvent.key);
      const scope = ScopeManager.get(VnShortKey.getScope());
      if (this._combinationBuffer.length === 0 && scope && this.getModeTree(scope).currentNode === null) {
        this.resetToRoot(scope);
      }
    };
  };

  private removeKeyFromCombination = (keyReleased: string) => {

    this._combinationBuffer = this._combinationBuffer.filter(key => key !== KeyManager.normalize(keyReleased));
  };

  private getModeTree = (scope: ShortKeyScope): ShortKeyMode => {

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return scope.modeMap.get(VnShortKey.getMode())!;
  };
}
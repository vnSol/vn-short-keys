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

  constructor(debounceTime = DEFAULT_DEBOUNCE_TIME) {

    this._debounceTime = debounceTime;
    this._combinationBuffer = [];
    this._keyDownListener = this.getKeyDownListener();
  }

  bind = () => {

    if (!KeyListener._alreadyBound) {
      document.addEventListener("keydown", this._keyDownListener);
      KeyListener._alreadyBound = true;
    }
  };

  unbind = () => {

    if (KeyListener._alreadyBound) {
      document.removeEventListener("keydown", this._keyDownListener);
      KeyListener._alreadyBound = false;
    }
  };

  getKeyDownListener = () => {

    return (keyboardEvent: KeyboardEvent) => {

      if (this.isKeyHolding(keyboardEvent)) return;

      const scope = ScopeManager.get(VnShortKey.getScope());
      if (!scope) return;

      TimeHelper.debounce(
        () => {
          // end of debouncing
          this.triggerActionsIfMatched(scope, keyboardEvent);
          this.resetToRoot(scope);
        }, this._debounceTime
      )();

      const pressedKey = KeyManager.toString(keyboardEvent);
      if (this.shouldIgnore(keyboardEvent)) return;

      this._combinationBuffer.push(pressedKey);
    };
  };

  private isKeyHolding = (e: KeyboardEvent): boolean => {

    return e.repeat;
  };

  private shouldIgnore = (keyboardEvent: KeyboardEvent): boolean => {

    return KeyManager.isActionKey(keyboardEvent.key);
  };

  private triggerActionsIfMatched = (scope: ShortKeyScope, keyboardEvent: KeyboardEvent) => {
    const treeNode = this.lookForTreeNode(scope);
    if (!treeNode) return;

    if (treeNode.actions?.length > 0) {
      this.triggerActions(treeNode.actions, keyboardEvent);
      this.resetToRoot(scope);
      return;
    }
  };

  private lookForTreeNode = (scope: ShortKeyScope): ShortKeyNode | undefined => {

    let treeNode = undefined;
    for (const key of this._combinationBuffer) {
      treeNode = ActionTree.getNodeByKeys(scope, VnShortKey.getMode(), key);
      if (!treeNode) break;

      // To go deeper into tree
      this.getModeTree(scope).currentNode = treeNode;
    }
    this._combinationBuffer = [];
    return treeNode;
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

  private getModeTree = (scope: ShortKeyScope): ShortKeyMode => {

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return scope.modeMap.get(VnShortKey.getMode())!;
  };
}
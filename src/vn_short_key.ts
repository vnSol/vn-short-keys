import { DEFAULT_DEBOUNCE_TIME, DEFAULT_SCOPE } from "./constants";
import { KeyManager } from "./key_manager";
import { ActionTree } from "./action_tree";
import { IAction, IBinder, IChain, IMode, ShortKeyScope } from "./types";
import { VnKeyAction } from "./vn_key_action";
import { KeyListener } from "./key_listener";
import { ScopeManager } from "./scope_manager";

export class VnShortKey implements IBinder {
  _key: string[];
  _registeringScope: string;
  _mode: IMode;
  _chain: VnKeyAction | undefined;
  _debounce: number;

  private static _currentScope: string = DEFAULT_SCOPE;
  private static _currentMode: IMode = "n";
  private static _settingDebounce = DEFAULT_DEBOUNCE_TIME;
  private static _self: VnShortKey;
  private static _keyListener: KeyListener | undefined;

  private constructor(debounce: number) {

    this._key = [];
    this._registeringScope = "";
    this._mode = "n";
    this._debounce = debounce;
  }

  private static getInstance(): IBinder {

    if (!VnShortKey._self) {
      VnShortKey.initInstance(VnShortKey._settingDebounce);
    }
    return VnShortKey._self;
  }

  private static initInstance = (debounce = DEFAULT_DEBOUNCE_TIME) => {

    VnShortKey._self = new VnShortKey(debounce);
  };

  static switchModeInsert() { VnShortKey.setMode("i"); }
  static switchModeVisual() { VnShortKey.setMode("v"); }
  static switchModeNormal() { VnShortKey.setMode("n"); }

  when(key: string): IBinder {

    this._key = KeyManager.processKeyCombination(key);
    return this;
  }

  do(action: IAction): IChain {

    this._chain = new VnKeyAction(this.registerKeys, this.registeringInfo);
    this._chain.then(action);
    return this._chain;
  }

  registerKeys = (actions: IAction[]): KeyListener => {

    const scope: ShortKeyScope = ActionTree.createScopeIfNeeded(this._registeringScope);
    if (!VnShortKey._keyListener)
      VnShortKey._keyListener = KeyManager.getKeyListener(this._debounce);

    ActionTree.insertToTree(scope, this._mode, this._key, actions);
    VnShortKey._keyListener.bind();

    VnShortKey.initInstance();
    return VnShortKey._keyListener;
  };

  registeringInfo = (actions: IAction[]): Record<string, any> => {

    return ({
      scope: this._registeringScope,
      mode: this._mode,
      key: this._key,
      actions,
      debounce: this._debounce
    });
  };

  unbind(key: string) {

    throw new Error("Method not implemented.");
  }

  public static scope(scope: string): IBinder {

    return VnShortKey.getInstance().scope(scope);
  }

  scope(scope: string): IBinder {

    this._registeringScope = scope;
    return this;
  }

  public static mode(mode: IMode): IBinder {

    return VnShortKey.getInstance().scope(DEFAULT_SCOPE).mode(mode);
  }

  mode(mode: IMode): IBinder {

    this._mode = mode;
    return this;
  }

  static setScope = (scope: string) => {

    VnShortKey._currentScope = scope;
  };

  static getScope = (): string => {

    return VnShortKey._currentScope;
  };

  static setMode = (mode: IMode) => {

    VnShortKey._currentMode = mode;
    console.info(`Mode ${mode}`);
  };

  static getMode = (): IMode => {

    return VnShortKey._currentMode;
  };

  static reset = () => {

    ScopeManager.clean();
    this.initInstance(VnShortKey._settingDebounce);
    VnShortKey._keyListener = undefined;
  };

  static init = (debounce = DEFAULT_DEBOUNCE_TIME) => {
    VnShortKey._settingDebounce = debounce;
    this.reset();

    VnShortKey.mode("n").when("i").do(VnShortKey.switchModeInsert).bind();
    VnShortKey.mode("n").when("v").do(VnShortKey.switchModeVisual).bind();
    VnShortKey.mode("i").when("esc").do(VnShortKey.switchModeNormal).bind();
    VnShortKey.mode("v").when("esc").do(VnShortKey.switchModeNormal).bind();
    VnShortKey.setMode("n");
    VnShortKey.setScope(DEFAULT_SCOPE);
  };

  static dump = (scopeName: string | undefined = undefined, mode: IMode | undefined = undefined) => {

    ActionTree.dump(scopeName, mode);
  };
}
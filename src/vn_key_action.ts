import { KeyListener } from "./key_listener";
import { IAction, IChain } from "./types";


export class VnKeyAction implements IChain {
  _actions: IAction[];
  _buildCallback: (actions: IAction[]) => KeyListener;
  _infoCallback: (actions: IAction[]) => Record<string, any>;

  constructor(buildCallback: (actions: IAction[]) => KeyListener, infoCallback: (actions: IAction[]) => Record<string, any>) {

    this._actions = [];
    this._buildCallback = buildCallback;
    this._infoCallback = infoCallback;
  }

  then(action: IAction): IChain {

    if (!action.name)
      throw new Error("Function name is required!");

    this._actions.push(action);
    return this;
  }

  bind(): KeyListener {

    return this._buildCallback(this._actions);
  }

  info() {

    return this._infoCallback(this._actions);
  }
}
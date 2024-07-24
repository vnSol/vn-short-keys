import { KeyListener } from "./key_listener";

export type IAction<T = unknown> = (event: KeyboardEvent, upstreamReturn: T) => unknown;
export type IMode = "v" | "i" | "n"

export interface IChain {

  then(action: IAction): IChain;
  bind(): KeyListener;
  info(): Record<string, any>;
}

export interface IBinder {

  _key: string[];
  _registeringScope: string;
  _mode: IMode;

  scope(scope: string): IBinder;
  mode(mode: IMode): IBinder;
  when(key: string): IBinder;
  do(action: IAction): IChain;

  unbind(key: string): void;
}

export type ShortKeyNode = {

  children: Map<string, ShortKeyNode>;
  actions: IAction[];
};

export type ShortKeyScope = {

  modeMap: Map<IMode, ShortKeyMode>;
}

export type ShortKeyMode = {

  root: ShortKeyNode;
  currentNode: ShortKeyNode;
}
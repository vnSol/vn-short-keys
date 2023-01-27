import { ShortKeyScope } from "./types";


const scopeMap = new Map<string, ShortKeyScope>();
export class ScopeManager {

  static get = (scope: string): ShortKeyScope | undefined => {

    return scopeMap.get(scope);
  };

  static set = (scopeName: string, scope: ShortKeyScope): void => {

    scopeMap.set(scopeName, scope);
  };

  static keys = (): IterableIterator<string> => {

    return scopeMap.keys();
  };

  static clean = (): void => {

    scopeMap.clear();
  };
}
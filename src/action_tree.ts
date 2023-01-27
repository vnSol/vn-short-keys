import { ScopeManager } from "./scope_manager";
import { IAction, IMode, ShortKeyMode, ShortKeyNode, ShortKeyScope } from "./types";

export class ActionTree {

  static createScopeIfNeeded = (scopeName: string): ShortKeyScope => {

    const scope = ScopeManager.get(scopeName);
    if (scope) { return scope; }

    const newScope: ShortKeyScope = { modeMap: new Map() };
    newScope.modeMap.set("n", this.newModeObject());
    newScope.modeMap.set("i", this.newModeObject());
    newScope.modeMap.set("v", this.newModeObject());
    ScopeManager.set(scopeName, newScope);
    return newScope;
  };

  private static newModeObject = (): ShortKeyMode => {

    const rootNode: ShortKeyNode = {
      children: new Map<string, ShortKeyNode>(),
      actions: [],
    };
    return { root: rootNode, currentNode: rootNode };
  };

  static insertToTree = (scope: ShortKeyScope, mode: IMode, keys: string[], actions: IAction[]) => {

    let workingNode = scope.modeMap.get(mode)?.root;
    if (!workingNode) return;

    for (const key of keys) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { children } = workingNode! as ShortKeyNode;
      if (!children.get(key)) {
        const newNode: ShortKeyNode = { children: new Map<string, ShortKeyNode>(), actions: [] };
        children.set(key, newNode);
      }
      workingNode = children.get(key);
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    workingNode!.actions = [...new Set([...workingNode!.actions, ...actions])];
  };

  static getNodeByKeys = (scope: ShortKeyScope, mode: IMode, keys: string): ShortKeyNode | undefined => {

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { currentNode } = scope.modeMap.get(mode)!;
    if (!currentNode) return;
    const { children } = currentNode;
    return children.get(keys);
  };

  static dump = (scopeName: string | undefined = undefined, mode: IMode | undefined = undefined) => {

    const dumpData: unknown[] = [];
    for (const scopeKey of ScopeManager.keys()) {
      if (scopeName !== undefined && scopeKey !== scopeName) continue;

      const scope = ScopeManager.get(scopeKey);
      if (!scope) return;
      for (const workingMode of ["n", "v", "i"]) {
        if (mode !== undefined && workingMode !== mode) continue;

        const workingNode = scope.modeMap.get(workingMode as IMode)?.root;
        if (!workingNode) return;

        this.traverse(dumpData, workingNode, scopeKey, workingMode as IMode);
      }
    }
    console.table(dumpData);
  };

  static traverse = (dumpData: unknown[], node: ShortKeyNode, scopeName: string, mode: IMode, registerKeys: string[] = []) => {

    const { children } = node;
    if (node.actions.length !== 0) {
      const actionsName = node.actions.map(action => action.name);
      dumpData.push({
        "scope": scopeName,
        mode,
        "keys": registerKeys,
        "actions": actionsName
      });
    }
    for (const key of children.keys()) {
      const upstreamKeys = [...registerKeys, key];
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.traverse(dumpData, children.get(key)!, scopeName, mode, upstreamKeys);
    }
  };

  // private removeFromTree = (scope: ShortKeyScope, mode: IMode, keys: string[]) => {

  //   const workingNode = scope.modeMap.get(mode)?.root;
  //   if (!workingNode) return;

  //   const nodeChain = this.getNodesChainByKeys(workingNode, keys);
  //   if (nodeChain.length === 0) {
  //     throw new Error("Keys not found.");
  //   }
  //   const lastChainNode = nodeChain.pop();
  //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //   if (lastChainNode && !this.isLeaf(lastChainNode.children.get(keys[keys.length - 1])!)) {
  //     return;
  //   }
  // };

  // private getNodesChainByKeys = (rootNode: ShortKeyNode, keys: string[]): ShortKeyNode[] => {

  //   const nodeChain: ShortKeyNode[] = [];
  //   let workingNode = rootNode;
  //   for (const key of keys) {
  //     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //     const { children } = workingNode;
  //     if (!children) return [];
  //     const childNode = children.get(key);
  //     if (!childNode) return [];
  //     nodeChain.push(childNode);
  //     workingNode = childNode;
  //   }
  //   return nodeChain;
  // };

  // private isLeaf = (node: ShortKeyNode): boolean => {

  //   return node.children.size === 0;
  // };
}
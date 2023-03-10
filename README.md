# VN Short Key

## Description
Project to register keyboard key combinations with relevant actions

## Features
- Listen for keyboard key combinations with following format:
  - `a1 + a2 + an + b` (hit both keys the same time, with `ai` are action keys, such as `Ctrl`, `Alt`, `Meta`, `Shift` )
  - `a b` (hit `a` then `b` after a timeframe)
  - `a` (single key)
- Bind key combination with action
  - Bind with single action
  - Allow to chain multiple actions
- Automatically call the relevant actions (by scope and by mode) when a key combination is hitted
  - Each scope has 3 modes
  - Each mode has multiple registering key-actions

## How to use:
- Init for default key binding on top of project:
  - Default scope is: `global`
  - Provided 3 modes:
    - `n`: normal
    - `i`: insert
    - `v`: visual
  - Call function: 
  ```js
    VnShortKey.init()
  ```
- Register keys:
  - With default scope: 
  ```js
    VnShortKey.mode(<mode: IMode>)
      .when(<keys: string>)
      .do(<action: IAction>)
      .bind();
  ```
  - With custom scope:
  ```js
    VnShortKey.scope(<scope: string>)
      .mode(<mode: IMode>)
      .when(<keys: string>)
      .do(<action: IAction>)
      .bind();
  ```
- Register chain of actions:
  - Output of the upstream action will be passed down to the closest downstream
  ```js
    VnShortKey.scope(<scope: string>)
      .mode(<mode: IMode>)
      .when(<keys: string>)
      .do(<action: IAction>)
      .then(<action: IAction>)
      .then(<action: IAction>)
      .then(<action: IAction>)
      ...
      .bind();
  ```
- With:
  ```js
    IAction = (event: KeyboardEvent, upstreamReturn: unknown) => unknown;
    IMode = "v" | "i" | "n"
  ```
- Example:
  ```js
    import { VnShortKey } from "vn-short-keys";
    VnShortKey.init();
    const function1 = (event, upstreamResult) => {
      console.log("function 1");
      return "func1 output";
    };
    const function2 = (event, upstreamResult) => {
      console.log("function 2");
      console.log(upstreamResult);
      return "func2 output";
    };
    VnShortKey.mode("n")
      .when("c n")
      .do(function1)
      .then(function2)
      .bind();
    VnShortKey.mode("n")
      .when("Ctrl+n")
      .do(function1)
      .then(function2)
      .bind();
  ```
- To view registered actions:
  ```js
    // Dump all scopes, all modes
    VnShortKey.dump();

    // Dump specific scope, all modes
    VnShortKey.dump(<scopeName: string>);

    // Dump specific scope at specific mode
    VnShortKey.dump(<scopeName: string>, <mode: IMode>);
  ```
## References
- https://n1ghtmare.github.io/2022-01-14/implement-a-keyboard-shortcuts-handler-in-typescript/
- https://github.com/jaywcjlove/hotkeys

## Run test
- Call command:
  - `npm run test`

## Publish to npmjs.com
- Call command:
  - `npm publish` 

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

## References
- https://n1ghtmare.github.io/2022-01-14/implement-a-keyboard-shortcuts-handler-in-typescript/
- https://github.com/jaywcjlove/hotkeys

## Run test
- Call command:
  - `npm run test`

## Publish to npmjs.com
- Call command:
  - `npm publish` 

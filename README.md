# VN Short Key

## Description
Project to register keyboard key combinations with relevant actions

## Features
- Listen for keyboard key combinations with following format:
  - a + b (hit both keys the same time)
  - a b (hit `a` then `b` after a timeframe)
  - a (single key)
- Bind key combination with action
  - Bind with single action
  - Allow to chain multiple actions
- Automatically call the relevant actions when a key combination is hitted

## References
- https://n1ghtmare.github.io/2022-01-14/implement-a-keyboard-shortcuts-handler-in-typescript/
- https://github.com/jaywcjlove/hotkeys

## Run test
- Call command:
  - `npm run test`

## Publish to npmjs.com
- Call command:
  - `npm publish` 

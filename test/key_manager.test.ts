import { KeyManager } from "../src/key_manager";


test("should success when parse sequence keys", () => {

  const sequence = KeyManager.processKeyCombination("a b");
  expect(sequence).toStrictEqual(["a", "b"]);
});

test("should success when parse combination keys", () => {

  const combination = KeyManager.processKeyCombination("a+b+c");
  expect(combination).toStrictEqual(["a+b+c"]);
});

test("should success when parse different combinations of same keys", () => {

  const combination = KeyManager.processKeyCombination("a+b+c");
  const reverseCombination = KeyManager.processKeyCombination("c+b+a");
  expect(combination).toStrictEqual(reverseCombination);
});

test("should produce same output when parse different combinations of same keys", () => {

  const combination = KeyManager.processKeyCombination("a+b+c");
  const reverseCombination = KeyManager.processKeyCombination("c+b+a");
  expect(combination).toStrictEqual(reverseCombination);
});

test("should normalize control key", () => {

  const expected = KeyManager.processKeyCombination("ctrl+c");

  let combination = KeyManager.processKeyCombination("ctrl+c");
  expect(combination).toStrictEqual(expected);

  combination = KeyManager.processKeyCombination("control+c");
  expect(combination).toStrictEqual(expected);
});

test("should normalize alt key", () => {

  const expected = KeyManager.processKeyCombination("alt+c");

  let combination = KeyManager.processKeyCombination("alt+c");
  expect(combination).toStrictEqual(expected);

  combination = KeyManager.processKeyCombination("option+c");
  expect(combination).toStrictEqual(expected);
});

test("should normalize escape key", () => {

  const expected = KeyManager.processKeyCombination("esc+c");

  let combination = KeyManager.processKeyCombination("esc+c");
  expect(combination).toStrictEqual(expected);

  combination = KeyManager.processKeyCombination("escape+c");
  expect(combination).toStrictEqual(expected);
});
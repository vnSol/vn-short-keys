import { VnShortKey } from "../src";
import { DEFAULT_SCOPE } from "../src/constants";
import { KeyManager } from "../src/key_manager";
import { IMode } from "../src/types";

const genRandomChar = () => Math.random().toString(36).slice(2, 3);
const genRandomMode = () => ["v", "n", "i"][Math.floor(Math.random() * 3)];
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const dispatchKey = async (key: string) => {
  const keyDownEvent = new KeyboardEvent("keydown", { "key": key });
  document.dispatchEvent(keyDownEvent);
  await sleep(200);
  const keyUpEvent = new KeyboardEvent("keyup", { "key": key });
  document.dispatchEvent(keyUpEvent);
  await sleep(200);
};

beforeEach(() => {

  VnShortKey.init();
});

test("should success when registering single key in default scope", () => {

  const mode = "n";
  const key = "a";
  const testFunc = (key) => { console.log(key); };
  const registration = VnShortKey
    .mode(mode)
    .when(key)
    .do(testFunc)
    .info();

  expect(registration.scope).toBe(DEFAULT_SCOPE);
  expect(registration.mode).toBe(mode);
  expect(registration.key).toStrictEqual(KeyManager.processKeyCombination(key));
  expect(registration.actions.length).toBe(1);
});

test("should success when registering single key in specific scope", () => {

  const scope = "custom_scope";
  const mode = "n";
  const key = "a";
  const testFunc = (key) => { console.log(key); };
  const registration = VnShortKey
    .scope(scope)
    .mode(mode)
    .when(key)
    .do(testFunc)
    .info();

  expect(registration.scope).toBe(scope);
  expect(registration.mode).toBe(mode);
  expect(registration.key).toStrictEqual(KeyManager.processKeyCombination(key));
  expect(registration.actions.length).toBe(1);
});

test("should success when registering combination keys", () => {

  const mode = "n";
  const key = "ctrl+a";
  const testFunc = (key) => { console.log(key); };
  const registration = VnShortKey
    .mode(mode)
    .when(key)
    .do(testFunc)
    .info();

  expect(registration.scope).toBe(DEFAULT_SCOPE);
  expect(registration.mode).toBe(mode);
  expect(registration.key).toStrictEqual(KeyManager.processKeyCombination(key));
  expect(registration.actions.length).toBe(1);
});

test("should success when registering sequence keys", () => {

  const mode = "n";
  const key = "a b";
  const testFunc = (key) => { console.log(key); };
  const registration = VnShortKey
    .mode(mode)
    .when(key)
    .do(testFunc)
    .info();

  expect(registration.scope).toBe(DEFAULT_SCOPE);
  expect(registration.mode).toBe(mode);
  expect(registration.key).toStrictEqual(KeyManager.processKeyCombination(key));
  expect(registration.actions.length).toBe(1);
});

test("should success when registering chain of actions", () => {

  const mode = "n";
  const key = "ctrl+a";
  const func = (key) => { console.log(key); };
  const testFunc1 = () => { console.log(key); };
  const testFunc2 = () => { console.log(key); };

  const registration = VnShortKey
    .mode(mode)
    .when(key)
    .do(func)
    .then(testFunc1)
    .then(testFunc2)
    .info();

  expect(registration.actions.length).toBe(3);
  expect(registration.actions[0]).toStrictEqual(func);
});

test("should success when registering multiple times", () => {

  for (let i = 0; i < 10; i++) {
    const mode = genRandomMode() as IMode;
    const key = genRandomChar();
    const func = () => console.log;
    const registration = VnShortKey
      .mode(mode)
      .when(key)
      .do(func)
      .info();

    expect(registration.scope).toBe(DEFAULT_SCOPE);
    expect(registration.mode).toBe(mode);
    expect(registration.key).toStrictEqual(KeyManager.processKeyCombination(key));
    expect(registration.actions.length).toBe(1);
    expect(registration.actions[0]).toStrictEqual(func);
  }
});

test("should bind success when registering single key in default scope", () => {

  const mode = "n";
  const key = genRandomChar();
  const func = (keyboardEvent) => {
    expect(keyboardEvent.key).toBe(key);
  };

  VnShortKey
    .mode(mode)
    .when(key)
    .do(func)
    .bind();

  dispatchKey(key);
});

test("should bind success when registering single key in custom scope", () => {

  const customScope = "random_scope_goes_here";
  const mode = "n";
  const key = genRandomChar();
  const func = (keyboardEvent) => {
    expect(keyboardEvent.key).toBe(key);
  };

  VnShortKey
    .scope(customScope)
    .mode(mode)
    .when(key)
    .do(func)
    .bind();

  VnShortKey.setScope(customScope);

  dispatchKey(key);
});

test("should bind success when registering single key in custom mode", () => {

  const customScope = "random_scope_goes_here";
  const mode = "v";
  const key = genRandomChar();
  const func = (keyboardEvent) => {
    expect(keyboardEvent.key).toBe(key);
  };

  VnShortKey
    .scope(customScope)
    .mode(mode)
    .when(key)
    .do(func)
    .bind();

  VnShortKey.setScope(customScope);
  VnShortKey.setMode(mode);

  dispatchKey(key);
});

test("should bind multiple actions success", () => {

  const mode = "n";
  const key = genRandomChar();
  const func1 = (keyboardEvent) => {
    expect(keyboardEvent.key).toBe(key);
    return "func1";
  };
  const func2 = (keyboardEvent, upstreamReturn) => {
    expect(upstreamReturn).toBe("func1");
    return "func2";
  };

  VnShortKey
    .mode(mode)
    .when(key)
    .do(func1)
    .then(func2)
    .bind();

  dispatchKey(key);
});

test("should success when fire combined keys", () => {

  const mode = "n";
  const key = "ctrl+v";
  const func = (keyboardEvent) => {
    expect(keyboardEvent.key).toBe(key);
  };

  VnShortKey
    .mode(mode)
    .when(key)
    .do(func)
    .bind();

  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "v",
      ctrlKey: true,
      bubbles: true
    })
  );
  document.dispatchEvent(new KeyboardEvent("keyup", { key: "v", bubbles: true }));
});

test("should success when fire sequence keys", async () => {

  const mode = "n";
  const randomKeys = [...Array(2).keys()].map(() => genRandomChar());
  const sequenceKeys = randomKeys.join(" ");
  const func = (keyboardEvent) => {
    console.log("This should be called!");
    expect(keyboardEvent.key).toBe(randomKeys[randomKeys.length - 1]);
  };

  VnShortKey
    .mode(mode)
    .when(sequenceKeys)
    .do(func)
    .bind();

  const spy = jest.spyOn(console, "log");
  for (const key of randomKeys) {
    await dispatchKey(key);
  }

  expect(spy).toHaveBeenCalledTimes(1);
});

test("should not call actions when inputing too slow", async () => {

  const mode = "n";
  const randomKeys = [...Array(3).keys()].map(() => genRandomChar());
  const sequenceKeys = randomKeys.join(" ");
  const func = (keyboardEvent) => {
    console.log("It should print when this test case is failed!");
    expect(keyboardEvent.key).toBe(randomKeys[2]);
  };

  const keyListener = VnShortKey
    .mode(mode)
    .when(sequenceKeys)
    .do(func)
    .bind();

  // @ts-expect-error "Testing private method"
  const spy = jest.spyOn(keyListener, "triggerActions");
  for (const key of randomKeys) {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key, bubbles: true })
    );
    await sleep(100);
    document.dispatchEvent(
      new KeyboardEvent("keyup", { key, bubbles: true })
    );
    await sleep(1000);
  }

  expect(spy).toHaveBeenCalledTimes(0);
});

test("should failed when fire keys in different scope", () => {

  const key = genRandomChar();
  const context = document;
  const func1 = () => {
    return "func1";
  };

  const keyListener = VnShortKey
    .scope("randomScope")
    .mode("n")
    .when(key)
    .do(func1)
    .bind();

  // @ts-expect-error "Testing private method"
  const spy = jest.spyOn(keyListener, "triggerActions");

  let event = new KeyboardEvent("keydown", { "key": key });
  context.dispatchEvent(event);
  expect(spy).toHaveBeenCalledTimes(0);
  event = new KeyboardEvent("keyup", { "key": key });
  document.dispatchEvent(event);
});

test("should failed when fire keys in different mode", async () => {

  const key = genRandomChar();
  const func1 = (keyboardEvent) => {
    console.log("It should print this message when this test case is failed!");
    return "func1 " + keyboardEvent;
  };

  const keyListener = VnShortKey
    .mode("v")
    .when(key)
    .do(func1)
    .bind();

  await sleep(1000);

  // @ts-expect-error "Testing private method"
  const spy = jest.spyOn(keyListener, "triggerActions");

  await dispatchKey(key);
  expect(spy).toHaveBeenCalledTimes(0);
});

test("should success when registering key to switch mode", async () => {

  expect(VnShortKey.getMode()).toBe("n");

  await dispatchKey("i");
  expect(VnShortKey.getMode()).toBe("i");

  await dispatchKey("esc");
  expect(VnShortKey.getMode()).toBe("n");

  await dispatchKey("v");
  expect(VnShortKey.getMode()).toBe("v");

  await dispatchKey("esc");
  expect(VnShortKey.getMode()).toBe("n");
});

test("should call correct function for conflicting keys", async () => {

  const goDownAction = () => console.log("go down");
  const testFunc = () => console.log("set to mode i");
  VnShortKey.mode("n").when("j").do(goDownAction).bind();
  VnShortKey.mode("n").when("j j").do(testFunc).bind();

  await dispatchKey("j");
});

import { KeyListener } from "../src/key_listener";
import { IAction } from "../src/types";


test("should call action chain successfully", () => {

  const keyListener = new KeyListener(500);
  const genRandomChar = () => Math.random().toString(36).slice(2, 3);
  const randomKey = genRandomChar();
  const keyEvent = new KeyboardEvent("keydown", { "key": randomKey });
  const actionsChain: IAction[] = [];
  actionsChain.push((e, upstreamReturn) => {
    expect(e.key).toBe(randomKey);
    expect(upstreamReturn).toBeNull();
    // Return value for down stream;
    return 1;
  });
  actionsChain.push(
    (e, upstreamReturn) => { expect(upstreamReturn).toBe(1); return 2; }
  );
  actionsChain.push(
    (e, upstreamReturn) => { expect(upstreamReturn).toBe(2); }
  );

  // @ts-expect-error "Testing private method"
  keyListener.triggerActions(actionsChain, keyEvent);
});

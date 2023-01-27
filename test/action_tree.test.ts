import { VnShortKey } from "../src";
import { ActionTree } from "../src/action_tree";
import { DEFAULT_SCOPE } from "../src/constants";

beforeEach(() => {
  VnShortKey.init();
});

test("should dump action tree successfully", () => {

  VnShortKey.mode("i").when("j").do(VnShortKey.switchModeInsert).bind();
  // VnShortKey.mode("i").when("j j").do(() => VnShortKey.setMode("n")).bind();

  ActionTree.dump(DEFAULT_SCOPE);
});

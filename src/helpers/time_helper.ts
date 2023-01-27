export class TimeHelper {

  static debounce = (fn: () => void, milliseconds: number) => {

    let timeoutId: number | undefined = undefined;
    return () => {

      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(fn, milliseconds);
    };
  };
}
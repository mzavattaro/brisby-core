export default function tryGet<T>(getter: () => T):
  | {
      success: true;
      value: T;
    }
  | {
      success: false;
      error: Error;
    } {
  try {
    return {
      success: true,
      value: getter(),
    };
  } catch (error) {
    return {
      success: false,
      error: error as Error,
    };
  }
}

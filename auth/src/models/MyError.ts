export class MyError extends Error {
  constructor(public msg: string, public code: number) {
    super(msg);
    this.code = code;
  }
}

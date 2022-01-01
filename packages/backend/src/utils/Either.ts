type TRight<Value> = { value: Value; tag: '_right' };
type TLeft<Value> = { value: Value; tag: '_left' };

export type Either<Right, Left> = TRight<Right> | TLeft<Left>;

export const Either = {
  right<TValue>(val: TValue): TRight<TValue> {
    return { value: val, tag: '_right' };
  },

  left<TValue>(val: TValue): TLeft<TValue> {
    return { value: val, tag: '_left' };
  },

  isRight<TValue>(either: Either<TValue, unknown>): either is TRight<TValue> {
    return either.tag === '_right';
  },

  isLeft<TValue>(either: Either<unknown, TValue>): either is TLeft<TValue> {
    return either.tag === '_left';
  },
};

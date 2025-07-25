type Ok<T> = {
  readonly _tag: 'Ok';
  readonly value: T;
};

type Err<E> = {
  readonly _tag: 'Err';
  readonly error: E;
};

export type Result<T, E> = Ok<T> | Err<E>;

export const ok = <T>(value: T): Ok<T> => ({
  _tag: 'Ok',
  value,
});

export const err = <E>(error: E): Err<E> => ({
  _tag: 'Err',
  error,
});

export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> =>
  result._tag === 'Ok';

export const isErr = <T, E>(result: Result<T, E>): result is Err<E> =>
  result._tag === 'Err';


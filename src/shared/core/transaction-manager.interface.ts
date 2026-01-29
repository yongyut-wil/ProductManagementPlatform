export interface ITransactionManager {
  run<T>(fn: (context: unknown) => Promise<T>): Promise<T>;
}

export const ITransactionManager = Symbol('ITransactionManager');

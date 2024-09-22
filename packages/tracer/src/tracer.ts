import { AsyncLocalStorage } from 'async_hooks';

export type TracerData = {
  id: string;
};

export class Tracer {
  readonly #store: AsyncLocalStorage<TracerData>;

  constructor() {
    this.#store = new AsyncLocalStorage();
  }

  run<Return>(payload: TracerData, callback: (...args: any[]) => Return) {
    return this.#store.run(payload, callback);
  }

  public get id() {
    return this.#store.getStore()?.id;
  }
}

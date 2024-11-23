import { AsyncLocalStorage } from 'async_hooks';

export type TracerStore<T extends Record<string, unknown>> = {
  id: string;
} & T;

export class Tracer<T extends Record<string, unknown> = Record<string, unknown>> {
  readonly #store: AsyncLocalStorage<TracerStore<T>>;

  constructor() {
    this.#store = new AsyncLocalStorage();
  }

  run<Return>(payload: TracerStore<T>, callback: (...args: any[]) => Return) {
    return this.#store.run(payload, callback);
  }

  public get id() {
    return this.#store.getStore()?.id;
  }

  public get data() {
    return this.#store.getStore();
  }
}

import { AsyncLocalStorage } from 'async_hooks';

export type TracerStore = {
  id: string;
};

export class Tracer extends AsyncLocalStorage<TracerStore> {
  public get id() {
    return this.getStore()?.id;
  }
}

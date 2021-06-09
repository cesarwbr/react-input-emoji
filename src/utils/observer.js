// @ts-check

// eslint-disable-next-line valid-jsdoc
/**
 * @template T
 * @returns {import('../types/types').ListenerObj<T>}
 */
export function createObserver() {
  /** @type {import('../types/types').Listerner<T>[]} */
  let listeners = [];

  return {
    subscribe: listener => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter(l => l !== listener);
      };
    },
    publish: event => {
      listeners.forEach(listener => listener(event));
    },
    get currentListerners() {
      return listeners;
    }
  };
}

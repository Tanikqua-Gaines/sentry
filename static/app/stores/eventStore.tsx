import extend from 'lodash/extend';
import isArray from 'lodash/isArray';
import Reflux from 'reflux';

import {Event} from 'sentry/types/event';

type Internals = {
  itemsById: Record<string, Event>;
  items: Event[];
};

type EventStoreInterface = {
  init(): void;
  reset(): void;
  loadInitialData(items: Event[]): void;
  add(items: Event[]): void;
  remove(id: string): void;
  get(id: string): Event | undefined;
  getAllItemIds(): string[];
  getAllItems(): Event[];
};

const storeConfig: Reflux.StoreDefinition & Internals & EventStoreInterface = {
  items: [],
  itemsById: {},

  init() {
    this.reset();
  },

  reset() {
    this.items = [];
  },

  loadInitialData(items) {
    this.reset();

    const itemIds = new Set();
    items.forEach(item => {
      itemIds.add(item.id);
      this.items.push(item);
    });

    this.trigger(itemIds);
  },

  add(items) {
    if (!isArray(items)) {
      items = [items];
    }

    const itemsById = {};
    const itemIds = new Set();
    items.forEach(item => {
      itemsById[item.id] = item;
      itemIds.add(item.id);
    });

    items.forEach((item, idx) => {
      if (itemsById[item.id]) {
        this.items[idx] = extend(true, {}, item, itemsById[item.id]);
        delete itemsById[item.id];
      }
    });

    for (const itemId in itemsById) {
      this.items.push(itemsById[itemId]);
    }

    this.trigger(itemIds);
  },

  remove(itemId) {
    this.items.forEach((item, idx) => {
      if (item.id === itemId) {
        this.items.splice(idx, idx + 1);
      }
    });

    this.trigger(new Set([itemId]));
  },

  get(id) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].id === id) {
        return this.items[i];
      }
    }
    return undefined;
  },

  getAllItemIds() {
    return this.items.map(item => item.id);
  },

  getAllItems() {
    return this.items;
  },
};

const EventStore = Reflux.createStore(storeConfig) as Reflux.Store & EventStoreInterface;

export default EventStore;

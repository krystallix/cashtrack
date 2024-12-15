// src/utils/eventBus.ts
import mitt from 'mitt';

type Events = {
  'loading-state': boolean;
  'updated': any;
  'updated-category': any;
  'responseData': any;
  'category-data': any;
};

const eventBus = mitt<Events>();

export default eventBus;

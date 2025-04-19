import { historyDb } from './model';
import { seed } from './seed';

const initDatabase = async function () {
  const list = await historyDb.taskRecords.toArray();

  const historyCount = list.length;

  const isDev = import.meta.env.MODE === 'development';
  if (historyCount === 0 && isDev) {
    await historyDb.taskRecords.bulkAdd(seed);
  } else {
    historyDb.open();
  }
};

export { initDatabase };

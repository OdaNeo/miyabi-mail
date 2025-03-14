import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';

export const temperatureStorage = createStorage<number>('temperature-key', 1, {
  storageEnum: StorageEnum.Local,
  liveUpdate: false,
});

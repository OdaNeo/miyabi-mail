import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';

export const temperatureStorage = createStorage<number>('temperature-key', 0.7, {
  storageEnum: StorageEnum.Local,
  liveUpdate: false,
});

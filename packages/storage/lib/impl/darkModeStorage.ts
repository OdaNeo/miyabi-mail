import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';

export const darkModeStorage = createStorage('dark-mode', false, {
  storageEnum: StorageEnum.Local,
  liveUpdate: false,
});

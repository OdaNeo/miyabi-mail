import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';

export const translationStorage = createStorage<string>('translation', '', {
  storageEnum: StorageEnum.Local,
  liveUpdate: false,
});

import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';

export const apiKeyStorage = createStorage<string>('api-key', '', {
  storageEnum: StorageEnum.Local,
  liveUpdate: false,
});

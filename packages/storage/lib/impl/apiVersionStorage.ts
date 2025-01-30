import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';

export const apiVersionStorage = createStorage<string>('api-version', 'gpt-4o-mini', {
  storageEnum: StorageEnum.Local,
  liveUpdate: false,
});

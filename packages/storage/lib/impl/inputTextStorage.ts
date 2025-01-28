import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';

export const inputTextStorage = createStorage<string>('input-text-key', '', {
  storageEnum: StorageEnum.Local,
  liveUpdate: false,
});

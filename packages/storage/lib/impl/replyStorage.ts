import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';

export const replyStorage = createStorage<string>('replay-key', '', {
  storageEnum: StorageEnum.Local,
  liveUpdate: false,
});

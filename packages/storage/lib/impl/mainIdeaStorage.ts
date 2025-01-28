import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';

export const mainIdeaStorage = createStorage<string>('main-idea-key', '', {
  storageEnum: StorageEnum.Local,
  liveUpdate: false,
});

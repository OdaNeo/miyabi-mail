import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';

export const languageStorage = createStorage<string>('language', 'zh-CN', {
  storageEnum: StorageEnum.Local,
  liveUpdate: false,
});

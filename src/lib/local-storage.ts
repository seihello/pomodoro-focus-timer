import Storage from 'react-native-storage';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage: Storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: false,
})

export default storage;
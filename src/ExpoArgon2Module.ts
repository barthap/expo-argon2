import { NativeModule, requireNativeModule } from 'expo';

import { ExpoArgon2ModuleEvents } from './ExpoArgon2.types';

declare class ExpoArgon2Module extends NativeModule<ExpoArgon2ModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoArgon2Module>('ExpoArgon2');

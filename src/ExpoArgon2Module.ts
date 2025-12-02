import { NativeModule, requireNativeModule } from 'expo';

import { Argon2Config, Argon2Result } from './ExpoArgon2.types';

declare class ExpoArgon2Module extends NativeModule {
  hashStringAsync(password: string | Uint8Array, salt: string | Uint8Array, config: Argon2Config): Promise<Argon2Result>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoArgon2Module>('ExpoArgon2');

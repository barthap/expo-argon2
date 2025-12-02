import { registerWebModule, NativeModule } from 'expo';

import { Argon2Result } from './ExpoArgon2.types';

class ExpoArgon2Module extends NativeModule {
  async hashAsync(): Promise<Argon2Result> {
    throw new Error("Argon2.hashAsync is not available on webj")
  }
}

export default registerWebModule(ExpoArgon2Module, 'ExpoArgon2Module');

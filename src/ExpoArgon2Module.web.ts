import { registerWebModule, NativeModule } from 'expo';

import { ExpoArgon2ModuleEvents } from './ExpoArgon2.types';

class ExpoArgon2Module extends NativeModule<ExpoArgon2ModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoArgon2Module, 'ExpoArgon2Module');

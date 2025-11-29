// Reexport the native module. On web, it will be resolved to ExpoArgon2Module.web.ts
// and on native platforms to ExpoArgon2Module.ts
export { default } from './ExpoArgon2Module';
export { default as ExpoArgon2View } from './ExpoArgon2View';
export * from  './ExpoArgon2.types';

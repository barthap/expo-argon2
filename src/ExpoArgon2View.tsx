import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoArgon2ViewProps } from './ExpoArgon2.types';

const NativeView: React.ComponentType<ExpoArgon2ViewProps> =
  requireNativeView('ExpoArgon2');

export default function ExpoArgon2View(props: ExpoArgon2ViewProps) {
  return <NativeView {...props} />;
}

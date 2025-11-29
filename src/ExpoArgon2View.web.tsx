import * as React from 'react';

import { ExpoArgon2ViewProps } from './ExpoArgon2.types';

export default function ExpoArgon2View(props: ExpoArgon2ViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}

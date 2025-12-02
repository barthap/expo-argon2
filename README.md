# Expo Argon2

Argon2 implementation for React Native and Expo.

[Argon2](https://en.wikipedia.org/wiki/Argon2) is a cryptographic hashing algorithm, most recommended for password hashing.

## Supported platforms

| Android | iOS / tvOS | Web | Expo Go |
| ------- | ---------- | --- | ------- |
| ✅      | ✅         | ❌  | ❌      |

## Installation

```
npx expo install expo-argon2
```

- ✅ You can use this library in [bare React Native apps](https://docs.expo.dev/bare/installing-expo-modules//).
- ✅ You can use this library with [Expo Development Builds](https://docs.expo.dev/development/introduction/).
- ❌ This library can't be used in the "Expo Go" app because it [requires custom native code](https://docs.expo.dev/workflow/customizing/).

## Usage

```ts
import Argon2 from "expo-argon2";

// ...
const password: string = "secretpasswd";
const salt: string = "pepper123";
const { rawHash, encodedHash } = await Argon2.hashAsync(password, salt);
console.log({
  // bb84197ebe5639d9b1a640a15292a3d2c5dfe195d303e16645448a287819079c
  rawHash,
  // $argon2id$v=19$m=32768,t=2,p=1$cGVwcGVyMTIz$u4QZfr5WOdmxpkChUpKj0sXf4ZXTA+FmRUSKKHgZB5w
  encodedHash,
});
```

Also see the [example app](./example/App.tsx).

## API

```js
import Argon2 from "expo-argon2";
// or directly
import { hashAsync } from "expo-argon2";
```

---

### `hashAsync(password: string, salt: string, config?: Argon2Config): Promise<Argon2Result>`

Hashes given password with Argon2, utilizing the given salt as well as optionally the specific parameters of the hashing operation itself.

**Arguments:**

- `password` - The password to hash

- `salt` - The salt to use with Argon2 as the salt in the hashing operation. Can be either a string, base64, or hex-encoded bytes _(configurable via the `config` param)_. Minimum salt length is 8 bytes.
- `config` - An object of type `Argon2Config`. Optional configuration of the hashing operation.

**Returns:** An object of type `Argon2Result`, containing both `rawHash` and `encodedHash` versions of the hash.

---

### `Argon2Config`

Configuration of the hashing algorithm. An object containing the following properties:

<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Explanation</th>
    <th>Required</th>
    <th>Default Value</th>
  </tr>
  <tr>
    <td><code>iterations</code></td>
    <td><code>number</code></td>
    <td>The computational cost in iterations. The application should choose this to fit a certain amount of time after fixing the <code>memory</code> parameter.</td>
    <td>❌</td>
    <td>2</td>
  </tr>
  <tr>
    <td><code>memory</code></td>
    <td><code>number</code></td>
    <td>The memory cost in KiB (1024 bytes).</td>
    <td>❌</td>
    <td>32768</td>
  </tr>
  <tr>
    <td><code>parallelism</code></td>
    <td><code>number</code></td>
    <td>The factor of parallelism when computing the hash (number of threads).</td>
    <td>❌</td>
    <td>1</td>
  </tr>
  <tr>
    <td><code>hashLength</code></td>
    <td><code>number</code></td>
    <td>The length of the raw hash in bytes.</td>
    <td>❌</td>
    <td>32</td>
  </tr>
  <tr>
    <td><code>saltEncoding</code></td>
    <td><code>SaltEncoding</code> (enum)</td>
    <td>Format of the <code>salt</code> input argument. Can be base64, hex-encoded bytes, or utf8-encoded string.</td>
    <td>❌</td>
    <td><code>SaltEncoding.UTF8</code></td>
  </tr>
  <tr>
    <td><code>mode</code></td>
    <td><code>Argon2Mode</code> (enum)</td>
    <td>Argon2 mode. Defaults to Argon2id.</td>
    <td>❌</td>
    <td><code>Argon2Mode.ARGON2_ID</code></td>
  </tr>
</table>

### `Argon2Mode`

An enum consisting of the following variants:

| name        | value        |
| ----------- | ------------ |
| `ARGON2_I`  | `"argon2i"`  |
| `ARGON2_D`  | `"argon2d"`  |
| `ARGON2_ID` | `"argon2id"` |

### `SaltEncoding`

An enum consisting of the following variants:

| name     | value      |
| -------- | ---------- |
| `UTF8`   | `"utf8"`   |
| `HEX`    | `"hex"`    |
| `BASE64` | `"base64"` |

### `Argon2Result`

Result of the hashing. Contains the following properties:

| name          | type     | description                                  |
| ------------- | -------- | -------------------------------------------- |
| `rawHash`     | `string` | A string containing raw hash.                |
| `encodedHash` | `string` | A string containing hash in an encoded form. |

## Alternatives

- **[react-native-argon2](https://github.com/poowf/react-native-argon2)** - offers the same functionality. Might be better if you're not using Expo and looking for something minimal. `expo-argon2` API is designed to be almost a drop-in replacement.

## Under the hood

- Similarly to [react-native-argon2](https://github.com/poowf/react-native-argon2), this library uses [Argon2Swift](https://github.com/tmthecoder/Argon2Swift) on Apple platforms and [argon2kt](https://github.com/lambdapioneer/argon2kt) on Android.

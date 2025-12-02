import React from 'react';
import Argon2, { Argon2Result } from 'expo-argon2';
import { Alert, Button, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';

const SALT = 'pepper12';

export default function App() {
  const [password, setPassword] = React.useState('');
  const [result, setResult] = React.useState<Argon2Result | null>(null);

  const hashArgon2 = async () => {
    try {
      const result = await Argon2.hashAsync(password, SALT, {
        // memory: 512,
      });
      setResult(result);
    } catch (e) {
      console.warn('Argon2 failed:', e);
      Alert.alert("Argon2 failed", "Error: " + (getMessageForException(e) ?? 'Unknown error'));
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>
        <Group name="Password input">
          <Text>Password:</Text>
          <TextInput
            editable
            value={password}
            onChangeText={setPassword}
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry
          />
        </Group>
        <Group name="Argon2 hash">
          <Button title="Hash" onPress={hashArgon2} />
        </Group>
        <Group name="Result">
          <Text>
            Raw hash: {result?.rawHash ?? '[none]'}
          </Text>
          <Text style={{ marginTop: 4 }}>
            Encoded hash: {result?.encodedHash ?? '[none]'}
          </Text>
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

function getMessageForException(e: unknown): string | null {
  if (e instanceof Error) {
    return e.message;
  }
  if (typeof e === 'string') {
    return e;
  }

  if (!e || typeof e !== 'object') {
    return null;
  }
  if ('toString' in e && typeof e['toString'] === 'function') {
    return e.toString();
  }

  return null;
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  view: {
    flex: 1,
    height: 200,
  },
  passwordInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: 'gray',
  },
};

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LogIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const theme = useTheme();

  const handleLogin = () => {
    // TODO: 实现登录逻辑
    navigation.navigate('PrivateInformation');
  };

  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Surface style={styles.surface}>
          <View style={styles.logoContainer}>
            <Icon name="home-heart" size={80} color={theme.colors.primary} />
            <Text style={styles.title}>家务自动分配</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              label="邮箱"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              label="密码"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry={secureTextEntry}
              right={
                <TextInput.Icon
                  icon={secureTextEntry ? 'eye-off' : 'eye'}
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                />
              }
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
            >
              登录
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('PrivateInformation')}
              style={styles.registerButton}
            >
              还没有账号？立即注册
            </Button>
          </View>
        </Surface>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  surface: {
    padding: 20,
    borderRadius: 10,
    elevation: 4,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  formContainer: {
    gap: 15,
  },
  input: {
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  registerButton: {
    marginTop: 10,
  },
});

export default LogIn;

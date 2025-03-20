import React, { useState, useEffect } from 'react';
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
  HelperText,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CommonImages } from './assets/images';

const LogIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const theme = useTheme();

  // 邮箱验证
  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text) {
      setEmailError('请输入邮箱');
      return false;
    } else if (!emailRegex.test(text)) {
      setEmailError('请输入有效的邮箱格式');
      return false;
    }
    setEmailError('');
    return true;
  };

  // 密码验证
  const validatePassword = (text) => {
    const hasLetter = /[a-zA-Z]/.test(text);
    const hasNumber = /[0-9]/.test(text);
    
    if (!text) {
      setPasswordError('请输入密码');
      return false;
    } else if (text.length < 6) {
      setPasswordError('密码长度至少为6位');
      return false;
    } else if (!hasLetter || !hasNumber) {
      setPasswordError('密码必须包含字母和数字');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // 表单验证
  useEffect(() => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    setIsFormValid(isEmailValid && isPasswordValid);
  }, [email, password]);

  const handleEmailChange = (text) => {
    setEmail(text);
    if (emailTouched) {
      validateEmail(text);
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (passwordTouched) {
      validatePassword(text);
    }
  };

  const handleEmailFocus = () => {
    setEmailTouched(true);
    validateEmail(email);
  };

  const handlePasswordFocus = () => {
    setPasswordTouched(true);
    validatePassword(password);
  };

  const handleLogin = () => {
    if (isFormValid) {
      // TODO: 实现登录逻辑
      navigation.navigate('PrivateInformation');
    }
  };

  return (
    <ImageBackground
      source={CommonImages.background}
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
            <View>
              <TextInput
                label="邮箱"
                value={email}
                onChangeText={handleEmailChange}
                onFocus={handleEmailFocus}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                error={emailTouched && !!emailError}
              />
              {emailTouched && !!emailError && (
                <HelperText type="error">{emailError}</HelperText>
              )}
            </View>

            <View>
              <TextInput
                label="密码"
                value={password}
                onChangeText={handlePasswordChange}
                onFocus={handlePasswordFocus}
                mode="outlined"
                style={styles.input}
                secureTextEntry={secureTextEntry}
                error={passwordTouched && !!passwordError}
                right={
                  <TextInput.Icon
                    icon={secureTextEntry ? 'eye-off' : 'eye'}
                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                  />
                }
              />
              {passwordTouched && !!passwordError && (
                <HelperText type="error">{passwordError}</HelperText>
              )}
            </View>

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              disabled={!isFormValid}
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

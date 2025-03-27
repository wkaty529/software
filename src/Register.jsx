import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  useTheme,
  HelperText,
  Appbar,
  RadioButton,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Register = ({ navigation }) => {
  const theme = useTheme();
  const [step, setStep] = useState(1); // 1: 输入联系方式, 2: 验证码验证, 3: 设置账号密码
  const [contactType, setContactType] = useState('phone'); // 'phone' 或 'email'
  const [contact, setContact] = useState('');
  const [contactError, setContactError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  // 处理倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 验证联系方式
  const validateContact = () => {
    if (contactType === 'phone') {
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!contact) {
        setContactError('请输入手机号码');
        return false;
      } else if (!phoneRegex.test(contact)) {
        setContactError('请输入有效的手机号码');
        return false;
      }
      setContactError('');
      return true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!contact) {
        setContactError('请输入邮箱');
        return false;
      } else if (!emailRegex.test(contact)) {
        setContactError('请输入有效的邮箱格式');
        return false;
      }
      setContactError('');
      return true;
    }
  };

  // 验证验证码
  const validateCode = () => {
    if (!verificationCode) {
      setCodeError('请输入验证码');
      return false;
    } else if (verificationCode.length !== 6) {
      setCodeError('验证码为6位数字');
      return false;
    }
    setCodeError('');
    return true;
  };

  // 验证用户名
  const validateUsername = () => {
    if (!username) {
      setUsernameError('请输入用户名');
      return false;
    } else if (username.length < 3) {
      setUsernameError('用户名长度至少为3位');
      return false;
    }
    setUsernameError('');
    return true;
  };

  // 验证密码
  const validatePassword = () => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!password) {
      setPasswordError('请输入密码');
      return false;
    } else if (password.length < 6) {
      setPasswordError('密码长度至少为6位');
      return false;
    } else if (!hasLetter || !hasNumber) {
      setPasswordError('密码必须包含字母和数字');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // 验证确认密码
  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError('请再次输入密码');
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('两次输入的密码不一致');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  // 发送验证码
  const sendVerificationCode = () => {
    if (validateContact()) {
      // 模拟发送验证码
      console.log(`发送验证码到: ${contact}`);
      setCountdown(60); // 60秒倒计时
      // 实际应用中这里应该调用API发送验证码
    }
  };

  // 验证验证码并进入下一步
  const verifyCode = () => {
    if (validateCode()) {
      // 实际应用中这里应该验证验证码是否正确
      setStep(3);
    }
  };

  // 完成注册
  const completeRegistration = () => {
    if (validateUsername() && validatePassword() && validateConfirmPassword()) {
      // 实际应用中这里应该调用API完成注册
      console.log('注册成功', {
        contactType,
        contact,
        username,
        password,
      });
      
      // 注册成功后导航到用户偏好选择页面
      navigation.navigate('AbilityChoice');
    }
  };

  // 第三方注册
  const handleThirdPartyRegister = (platform) => {
    // 实际应用中这里应该调用相应的第三方登录API
    console.log(`使用${platform}注册`);
    // 假设第三方注册成功，导航到用户偏好选择页面
    navigation.navigate('AbilityChoice');
  };

  // 渲染导航栏
  const renderHeader = () => (
    <Appbar.Header>
      <Appbar.BackAction onPress={() => {
        if (step > 1) {
          setStep(step - 1);
        } else {
          navigation.goBack();
        }
      }} />
      <Appbar.Content title="注册账号" />
    </Appbar.Header>
  );

  // 渲染第三方登录按钮
  const renderThirdPartyLogin = () => (
    <View style={styles.thirdPartyContainer}>
      <Divider style={styles.divider} />
      <Text style={styles.dividerText}>使用第三方账号注册</Text>
      <View style={styles.socialButtons}>
        <TouchableOpacity 
          style={styles.socialButton}
          onPress={() => handleThirdPartyRegister('微信')}
        >
          <Icon name="wechat" size={30} color="#07C160" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.socialButton}
          onPress={() => handleThirdPartyRegister('QQ')}
        >
          <Icon name="qqchat" size={30} color="#12B7F5" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // 渲染步骤1：选择联系方式并输入
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>第1步：输入联系方式</Text>
      
      <RadioButton.Group
        onValueChange={value => {
          setContactType(value);
          setContact('');
          setContactError('');
        }}
        value={contactType}
      >
        <View style={styles.radioContainer}>
          <View style={styles.radioItem}>
            <RadioButton value="phone" />
            <Text>手机号码</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="email" />
            <Text>电子邮箱</Text>
          </View>
        </View>
      </RadioButton.Group>

      <TextInput
        label={contactType === 'phone' ? '手机号码' : '电子邮箱'}
        value={contact}
        onChangeText={text => {
          setContact(text);
          if (contactError) validateContact();
        }}
        mode="outlined"
        style={styles.input}
        keyboardType={contactType === 'phone' ? 'phone-pad' : 'email-address'}
        autoCapitalize="none"
        error={!!contactError}
      />
      {!!contactError && (
        <HelperText type="error">{contactError}</HelperText>
      )}

      <Button
        mode="contained"
        onPress={() => {
          if (validateContact()) {
            setStep(2);
            sendVerificationCode();
          }
        }}
        style={styles.button}
      >
        下一步
      </Button>

      {renderThirdPartyLogin()}
    </View>
  );

  // 渲染步骤2：验证码验证
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>第2步：验证码验证</Text>
      
      <Text style={styles.infoText}>
        验证码已发送到{contactType === 'phone' ? '手机' : '邮箱'}：{contact}
      </Text>

      <View style={styles.codeInputContainer}>
        <TextInput
          label="验证码"
          value={verificationCode}
          onChangeText={text => {
            setVerificationCode(text);
            if (codeError) validateCode();
          }}
          mode="outlined"
          style={styles.codeInput}
          keyboardType="number-pad"
          maxLength={6}
          error={!!codeError}
        />
        <Button
          mode="outlined"
          onPress={sendVerificationCode}
          style={styles.sendButton}
          disabled={countdown > 0}
        >
          {countdown > 0 ? `重新发送(${countdown}s)` : '发送验证码'}
        </Button>
      </View>
      {!!codeError && (
        <HelperText type="error">{codeError}</HelperText>
      )}

      <Button
        mode="contained"
        onPress={verifyCode}
        style={styles.button}
      >
        下一步
      </Button>
    </View>
  );

  // 渲染步骤3：设置账号密码
  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>第3步：设置账号密码</Text>
      
      <TextInput
        label="用户名"
        value={username}
        onChangeText={text => {
          setUsername(text);
          if (usernameError) validateUsername();
        }}
        mode="outlined"
        style={styles.input}
        autoCapitalize="none"
        error={!!usernameError}
      />
      {!!usernameError && (
        <HelperText type="error">{usernameError}</HelperText>
      )}

      <TextInput
        label="密码"
        value={password}
        onChangeText={text => {
          setPassword(text);
          if (passwordError) validatePassword();
        }}
        mode="outlined"
        style={styles.input}
        secureTextEntry={secureTextEntry}
        error={!!passwordError}
        right={
          <TextInput.Icon
            icon={secureTextEntry ? 'eye-off' : 'eye'}
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          />
        }
      />
      {!!passwordError && (
        <HelperText type="error">{passwordError}</HelperText>
      )}

      <TextInput
        label="确认密码"
        value={confirmPassword}
        onChangeText={text => {
          setConfirmPassword(text);
          if (confirmPasswordError) validateConfirmPassword();
        }}
        mode="outlined"
        style={styles.input}
        secureTextEntry={secureTextEntry}
        error={!!confirmPasswordError}
      />
      {!!confirmPasswordError && (
        <HelperText type="error">{confirmPasswordError}</HelperText>
      )}

      <Button
        mode="contained"
        onPress={completeRegistration}
        style={styles.button}
      >
        完成注册
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Surface style={styles.surface}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  surface: {
    padding: 20,
    borderRadius: 10,
    elevation: 4,
  },
  stepContainer: {
    gap: 15,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 10,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  codeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeInput: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  sendButton: {
    marginLeft: 10,
    height: 56,
    justifyContent: 'center',
  },
  infoText: {
    marginVertical: 10,
    color: '#666',
  },
  thirdPartyContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  divider: {
    width: '100%',
    marginVertical: 10,
  },
  dividerText: {
    marginTop: 5,
    marginBottom: 10,
    color: '#666',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 2,
  },
});

export default Register; 
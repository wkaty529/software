import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  Avatar,
  useTheme,
  HelperText,
} from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { CommonImages } from './assets/images';

const PrivateInformation = ({ navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [ageError, setAgeError] = useState('');
  const [ageTouched, setAgeTouched] = useState(false);
  const [gender, setGender] = useState('');
  const [avatar, setAvatar] = useState(null);
  const theme = useTheme();

  // 验证年龄
  const validateAge = (text) => {
    const ageNum = parseInt(text);
    if (!text) {
      setAgeError('请输入年龄');
      return false;
    } else if (isNaN(ageNum)) {
      setAgeError('请输入有效的数字');
      return false;
    } else if (ageNum < 0 || ageNum > 120) {
      setAgeError('年龄必须在0-120岁之间');
      return false;
    }
    setAgeError('');
    return true;
  };

  // 请求相册权限
  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: '相册访问权限',
            message: '需要访问您的相册以选择头像图片',
            buttonNeutral: '稍后询问',
            buttonNegative: '取消',
            buttonPositive: '确定',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleImagePick = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Alert.alert(
        '权限提示',
        '需要相册访问权限才能选择头像图片',
        [
          { text: '取消', style: 'cancel' },
          { 
            text: '去设置', 
            onPress: () => {
              if (Platform.OS === 'android') {
                // 打开应用设置页面
                Linking.openSettings();
              }
            }
          }
        ]
      );
      return;
    }

    launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    }, (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert('错误', '选择图片时发生错误');
        return;
      }
      if (response.assets && response.assets[0]) {
        setAvatar(response.assets[0].uri);
      }
    });
  };

  const handleAgeChange = (text) => {
    setAge(text);
    if (ageTouched) {
      validateAge(text);
    }
  };

  const handleAgeFocus = () => {
    setAgeTouched(true);
    validateAge(age);
  };

  const handleSubmit = () => {
    if (!name || !age || !gender) {
      return;
    }
    if (!validateAge(age)) {
      return;
    }
    // TODO: 实现信息提交逻辑
    navigation.navigate('AbilityChoice');
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <View style={styles.avatarContainer}>
          <Avatar.Image
            size={120}
            source={avatar ? { uri: avatar } : CommonImages.avatar}
            style={styles.avatar}
          />
          <Button
            mode="outlined"
            onPress={handleImagePick}
            style={styles.avatarButton}
          >
            更换头像
          </Button>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            label="姓名"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />

          <View>
            <TextInput
              label="年龄"
              value={age}
              onChangeText={handleAgeChange}
              onFocus={handleAgeFocus}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              error={ageTouched && !!ageError}
            />
            {ageTouched && !!ageError && (
              <HelperText type="error">{ageError}</HelperText>
            )}
          </View>

          <View style={styles.genderContainer}>
            <Text style={styles.label}>性别</Text>
            <View style={styles.genderButtons}>
              <Button
                mode={gender === 'male' ? 'contained' : 'outlined'}
                onPress={() => setGender('male')}
                style={styles.genderButton}
              >
                男
              </Button>
              <Button
                mode={gender === 'female' ? 'contained' : 'outlined'}
                onPress={() => setGender('female')}
                style={styles.genderButton}
              >
                女
              </Button>
            </View>
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            disabled={!name || !age || !gender || (ageTouched && !!ageError)}
          >
            下一步
          </Button>
        </View>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    margin: 16,
    padding: 16,
    borderRadius: 10,
    elevation: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: '#e0e0e0',
  },
  avatarButton: {
    marginTop: 10,
  },
  formContainer: {
    gap: 15,
  },
  input: {
    backgroundColor: 'transparent',
  },
  genderContainer: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  genderButton: {
    flex: 1,
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
});

export default PrivateInformation;
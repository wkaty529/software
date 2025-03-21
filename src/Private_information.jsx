import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  PermissionsAndroid,
  Linking,
  KeyboardAvoidingView,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  Avatar,
  useTheme,
  HelperText,
  ActivityIndicator,
  Snackbar,
  Chip,
} from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { CommonImages } from './assets/images';

// 常用姓氏和名字
const commonSurnames = ['张', '王', '李', '赵', '陈', '刘', '杨', '黄', '周', '吴'];
const commonNameChars = ['明', '华', '伟', '建', '文', '英', '丽', '芳', '强', '军', '平', '杰', '云', '燕', '国', '玲'];

const PrivateInformation = ({ navigation }) => {
  const [name, setName] = useState('');
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [age, setAge] = useState('');
  const [ageError, setAgeError] = useState('');
  const [ageTouched, setAgeTouched] = useState(false);
  const [gender, setGender] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const theme = useTheme();
  
  // 引用指向TextInput的ref
  const ageInputRef = useRef(null);
  const nameInputRef = useRef(null);

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

  // 处理姓名输入
  const handleNameChange = (text) => {
    setName(text);
    
    // 如果输入的是拼音，显示姓名建议
    const lastChar = text.charAt(text.length - 1);
    if (/[a-zA-Z]/.test(lastChar)) {
      setShowNameSuggestions(true);
      
      // 根据输入的拼音生成建议
      const pinyin = text.toLowerCase();
      let suggestions = [];
      
      if (pinyin.startsWith('z')) {
        suggestions.push('张');
      } else if (pinyin.startsWith('w')) {
        suggestions.push('王');
      } else if (pinyin.startsWith('l')) {
        suggestions.push('李');
      } else if (pinyin.startsWith('c')) {
        suggestions.push('陈');
      } else if (pinyin.startsWith('h')) {
        suggestions.push('黄');
      }
      
      // 添加常用名字字符
      if (pinyin.includes('ming')) {
        suggestions.push('明');
      } else if (pinyin.includes('hua')) {
        suggestions.push('华');
      } else if (pinyin.includes('wen')) {
        suggestions.push('文');
      } else if (pinyin.includes('jian')) {
        suggestions.push('建');
      } else if (pinyin.includes('li')) {
        suggestions.push('丽');
      }
      
      setNameSuggestions(suggestions.length > 0 ? suggestions : commonNameChars.slice(0, 5));
    } else {
      setShowNameSuggestions(false);
    }
  };

  // 选择名字建议
  const selectNameSuggestion = (suggestion) => {
    // 如果当前输入中有拼音，替换最后的拼音部分
    const parts = name.split(' ');
    
    // 替换最后一个拼音或直接添加字符
    if (parts.length > 0 && /[a-zA-Z]/.test(parts[parts.length - 1])) {
      parts.pop();
      setName([...parts, suggestion].join(''));
    } else {
      setName(name + suggestion);
    }
    
    setShowNameSuggestions(false);
    nameInputRef.current?.focus();
  };

  // 显示名字建议
  const renderNameSuggestions = () => {
    if (!showNameSuggestions) return null;
    
    return (
      <View style={styles.suggestionContainer}>
        <Text style={styles.suggestionTitle}>常用汉字：</Text>
        <View style={styles.suggestionList}>
          {nameSuggestions.map((char, index) => (
            <Chip
              key={index}
              onPress={() => selectNameSuggestion(char)}
              style={styles.suggestionChip}
              textStyle={styles.suggestionChipText}
            >
              {char}
            </Chip>
          ))}
        </View>
        <View style={styles.suggestionList}>
          {commonSurnames.slice(0, 5).map((surname, index) => (
            <Chip
              key={`surname-${index}`}
              onPress={() => selectNameSuggestion(surname)}
              style={styles.suggestionChip}
              textStyle={styles.suggestionChipText}
            >
              {surname}
            </Chip>
          ))}
        </View>
      </View>
    );
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

    // 设置提交状态为true，显示加载指示器
    setIsSubmitting(true);

    // 模拟提交数据到服务器的过程
    setTimeout(() => {
      setIsSubmitting(false);
      setSnackbarVisible(true);
      
      // 延迟导航，给用户时间看到成功消息
      setTimeout(() => {
        navigation.navigate('AbilityChoice');
      }, 1000);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
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
            <View>
              <TextInput
                ref={nameInputRef}
                label="姓名"
                value={name}
                onChangeText={handleNameChange}
                mode="outlined"
                style={styles.input}
                placeholder="请输入您的姓名"
                autoComplete="name"
                autoCapitalize="none"
                textContentType="name"
                keyboardType="default"
                clearButtonMode="while-editing"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => ageInputRef.current?.focus()}
                right={name ? <TextInput.Icon name="close" onPress={() => setName('')} /> : null}
              />
              {renderNameSuggestions()}
            </View>

            <View>
              <TextInput
                ref={ageInputRef}
                label="年龄"
                value={age}
                onChangeText={handleAgeChange}
                onFocus={handleAgeFocus}
                mode="outlined"
                style={styles.input}
                keyboardType="number-pad"
                maxLength={3}
                placeholder="请输入您的年龄（0-120岁）"
                returnKeyType="done"
                clearButtonMode="while-editing"
                right={age ? <TextInput.Icon name="close" onPress={() => { 
                  setAge(''); 
                  if (ageTouched) validateAge('');
                }} /> : null}
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
              disabled={!name || !age || !gender || (ageTouched && !!ageError) || isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? '提交中...' : '下一步'}
            </Button>
          </View>
        </Surface>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2000}
          style={styles.snackbar}
        >
          信息提交成功！
        </Snackbar>
      </ScrollView>
    </KeyboardAvoidingView>
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
  suggestionContainer: {
    marginTop: 5,
    marginBottom: 5,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  suggestionTitle: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  suggestionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  suggestionChip: {
    margin: 4,
    backgroundColor: '#fff',
  },
  suggestionChipText: {
    fontSize: 16,
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
  snackbar: {
    backgroundColor: '#4CAF50',
  },
});

export default PrivateInformation;
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  Avatar,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';

const PrivateInformation = ({ navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [avatar, setAvatar] = useState(null);
  const theme = useTheme();

  const handleImagePick = () => {
    ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    }, (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.assets && response.assets[0]) {
        setAvatar(response.assets[0].uri);
      }
    });
  };

  const handleSubmit = () => {
    // TODO: 实现信息提交逻辑
    navigation.navigate('AbilityChoice');
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <View style={styles.avatarContainer}>
          <Avatar.Image
            size={120}
            source={avatar ? { uri: avatar } : require('./assets/default-avatar.png')}
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

          <TextInput
            label="年龄"
            value={age}
            onChangeText={setAge}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />

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
            disabled={!name || !age || !gender}
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
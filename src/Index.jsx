import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import {
  Avatar,
  IconButton,
} from 'react-native-paper';
import { CommonImages } from './assets/images';
import LinearGradient from 'react-native-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

const mockFamilies = [
  {
    id: 1,
    name: '家庭1',
    description: '身份:管理者\n',
    quote: '一定要认真完成任务',
    photo: CommonImages.avatars,
  },
  {
    id: 2,
    name: '家庭2',
    description: '身份:普通成员',
    quote: '加油。',
    photo: CommonImages.avatarss,
  },
];

const Index = ({ navigation }) => {
  const [selectedFamily, setSelectedFamily] = useState(mockFamilies[0]);

  const handleFamilySelect = (family) => {
    setSelectedFamily(family);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E6E6FA', '#D8BFD8']}
        style={styles.gradientContainer}
      >
        {/* 顶部标题和按钮区 */}
        <View style={styles.header}>
          <View style={styles.rightHeader}>
            <View style={styles.headerButton}>
              <IconButton
                icon="broom"
                size={24}
                iconColor="#333"
                onPress={() => navigation.navigate('TaskDetail')}
              />
              <Text style={styles.buttonText}>任务</Text>
            </View>
            <View style={styles.headerButton}>
              <IconButton
                icon="account-multiple-plus"
                size={24}
                iconColor="#333"
                onPress={() => navigation.navigate('JoinFamily')}
              />
              <Text style={styles.buttonText}>入驻家庭</Text>
            </View>
            <View style={styles.headerButton}>
              <IconButton
                icon="home-plus"
                size={24}
                iconColor="#333"
                onPress={() => navigation.navigate('CreateFamily')}
              />
              <Text style={styles.buttonText}>创建家庭</Text>
            </View>
          </View>
        </View>

        {/* 中间标题 */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>✨ 选择一个家庭 ✨</Text>
        </View>

        {/* 主角色卡片 */}
        <View style={styles.cardContainer}>
          <TouchableOpacity 
            style={styles.mainCard}
            onPress={() => navigation.navigate('GroupChat')}
          >
            <ImageBackground
              source={selectedFamily.photo}
              style={styles.characterImage}
              imageStyle={styles.characterImageStyle}
            >
              <TouchableOpacity 
                style={styles.startButton}
                onPress={() => navigation.navigate('GroupChat')}
              >
                <Text style={styles.startButtonText}>开启互动</Text>
              </TouchableOpacity>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        {/* 底部角色选择 */}
        <View style={styles.bottomSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.avatarScrollContainer}
            contentContainerStyle={styles.avatarScrollContent}
          >
            {mockFamilies.map((family, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleFamilySelect(family)}
                style={styles.avatarContainer}
              >
                <Image
                  source={family.photo}
                  style={[
                    styles.avatar,
                    selectedFamily?.id === family.id && styles.selectedAvatar
                  ]}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {selectedFamily && (
            <View style={styles.familyInfoContainer}>
              <Text style={styles.familyName}>
                家庭{selectedFamily.id} Lv{selectedFamily.level}
              </Text>
              <Text style={styles.familyRole}>
                
              </Text>
              <Text style={styles.familyDescription}>
                {selectedFamily.description}
              </Text>
              <Text style={styles.familyQuote}>
                {selectedFamily.quote}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 10,
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    alignItems: 'center',
    marginLeft: 16,
  },
  buttonText: {
    fontSize: 12,
    color: '#333',
    marginTop: -8,
  },
  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  mainCard: {
    width: screenWidth - 40,
    height: screenWidth - 40,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 4,
  },
  characterImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  characterImageStyle: {
    borderRadius: 30,
  },
  startButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 20,
  },
  startButtonText: {
    color: '#6200ee',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSection: {
    marginTop: 'auto',
    paddingBottom: 40,
    alignItems: 'center',
  },
  avatarScrollContainer: {
    marginBottom: 16,
    width: '100%',
  },
  avatarScrollContent: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  avatarContainer: {
    marginHorizontal: 8,
    height: 50,
    justifyContent: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatar: {
    borderColor: '#8A2BE2',
  },
  familyInfoContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  familyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  familyRole: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  familyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  familyQuote: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: {
    alignItems: 'center',
  },
  navItemActive: {
    transform: [{scale: 1.1}],
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: -8,
  },
  navTextActive: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
});

export default Index;
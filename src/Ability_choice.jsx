import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  Chip,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const skills = [
  { id: 'cooking', name: '烹饪', icon: 'food' },
  { id: 'cleaning', name: '清洁', icon: 'broom' },
  { id: 'laundry', name: '洗衣', icon: 'washing-machine' },
  { id: 'shopping', name: '购物', icon: 'cart' },
  { id: 'gardening', name: '园艺', icon: 'tree' },
  { id: 'pet-care', name: '宠物护理', icon: 'paw' },
  { id: 'childcare', name: '育儿', icon: 'baby-face-outline' },
  { id: 'elderly-care', name: '老人护理', icon: 'account-heart' },
  { id: 'repair', name: '维修', icon: 'wrench' },
  { id: 'organization', name: '收纳整理', icon: 'folder-organize' },
];

const AbilityChoice = ({ navigation }) => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const theme = useTheme();

  const toggleSkill = (skillId) => {
    setSelectedSkills(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleSubmit = () => {
    // TODO: 实现技能提交逻辑
    navigation.navigate('MainApp');
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <Text style={styles.title}>选择你的家务技能</Text>
        <Text style={styles.subtitle}>选择你擅长或愿意学习的家务技能</Text>

        <View style={styles.skillsContainer}>
          {skills.map(skill => (
            <Chip
              key={skill.id}
              selected={selectedSkills.includes(skill.id)}
              onPress={() => toggleSkill(skill.id)}
              style={styles.chip}
              icon={() => <Icon name={skill.icon} size={20} />}
            >
              {skill.name}
            </Chip>
          ))}
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={selectedSkills.length === 0}
        >
          完成选择
        </Button>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    margin: 4,
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
});

export default AbilityChoice;

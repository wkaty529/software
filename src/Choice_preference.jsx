import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list';

const Choice_preference = () => {
  // 技能分类数据
  const skillCategories = {
    housework: {
      name: '家务技能',
      skills: [
        { id: 'cleaning', label: '清洁技巧', description: '包括基础清洁方法和工具使用' },
        { id: 'cooking', label: '烹饪技能', description: '能够准备日常餐食' },
        { id: 'laundry', label: '洗衣技能', description: '了解不同衣物的洗涤方法' },
        { id: 'organizing', label: '整理收纳', description: '空间整理与物品分类能力' }
      ]
    },
    maintenance: {
      name: '维修技能',
      skills: [
        { id: 'electrical', label: '电工知识', description: '基础电器维修和安全知识' },
        { id: 'plumbing', label: '水管维修', description: '基础管道问题处理能力' },
        { id: 'furniture', label: '家具维护', description: '家具组装和基础维修' }
      ]
    },
    childcare: {
      name: '育儿技能',
      skills: [
        { id: 'babycare', label: '婴幼儿照料', description: '基础育儿知识和技能' },
        { id: 'education', label: '教育辅导', description: '作业辅导和知识传授能力' },
        { id: 'entertainment', label: '儿童娱乐', description: '组织儿童活动的能力' }
      ]
    }
  };

  // 任务偏好数据
  const taskPreferences = {
    dailyTasks: {
      name: '日常任务',
      tasks: [
        { id: 'vacuum', label: '吸尘器清洁', timeFlexible: true },
        { id: 'dishes', label: '洗碗', timeFlexible: true },
        { id: 'garbage', label: '倒垃圾', timeFlexible: true },
        { id: 'bedmaking', label: '整理床铺', timeFlexible: true }
      ]
    },
    weeklyTasks: {
      name: '周期性任务',
      tasks: [
        { id: 'windowCleaning', label: '擦窗户', timeFlexible: true },
        { id: 'groceryShopping', label: '采购日用品', timeFlexible: true },
        { id: 'laundry', label: '洗衣服', timeFlexible: true }
      ]
    },
    specialTasks: {
      name: '特殊任务',
      tasks: [
        { id: 'repairs', label: '家电维修', timeFlexible: false },
        { id: 'gardening', label: '园艺护理', timeFlexible: true },
        { id: 'renovation', label: '家居改造', timeFlexible: false }
      ]
    }
  };

  // 时间偏好选项
  const timePreferences = [
    { key: 'morning', value: '早晨 (6:00-12:00)' },
    { key: 'afternoon', value: '下午 (12:00-18:00)' },
    { key: 'evening', value: '晚上 (18:00-22:00)' }
  ];

  // 状态管理
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [taskPrefs, setTaskPrefs] = useState({});
  const [preferredTime, setPreferredTime] = useState([]);

  // 渲染技能标签
  const renderSkillTag = (skill) => (
    <TouchableOpacity
      key={skill.id}
      style={[
        styles.skillTag,
        selectedSkills.includes(skill.id) && styles.skillTagSelected
      ]}
      onPress={() => {
        const newSelected = selectedSkills.includes(skill.id)
          ? selectedSkills.filter(id => id !== skill.id)
          : [...selectedSkills, skill.id];
        setSelectedSkills(newSelected);
      }}
    >
      <Text style={[
        styles.skillTagText,
        selectedSkills.includes(skill.id) && styles.skillTagTextSelected
      ]}>
        {skill.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>家庭成员技能与偏好设置</Text>
        
        {/* 技能选择部分 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>技能标签选择</Text>
          {Object.entries(skillCategories).map(([key, category]) => (
            <View key={key} style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{category.name}</Text>
              <View style={styles.skillsContainer}>
                {category.skills.map(skill => renderSkillTag(skill))}
              </View>
            </View>
          ))}
        </View>

        {/* 任务偏好部分 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>任务偏好设置</Text>
          {Object.entries(taskPreferences).map(([key, category]) => (
            <View key={key} style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{category.name}</Text>
              {category.tasks.map(task => (
                <View key={task.id} style={styles.taskCard}>
                  <Text style={styles.taskLabel}>{task.label}</Text>
                  <RadioButton.Group
                    onValueChange={value => setTaskPrefs({
                      ...taskPrefs,
                      [task.id]: value
                    })}
                    value={taskPrefs[task.id]}
                  >
                    <View style={styles.radioGroup}>
                      <View style={styles.radioItem}>
                        <RadioButton value="like" />
                        <Text>喜欢</Text>
                      </View>
                      <View style={styles.radioItem}>
                        <RadioButton value="neutral" />
                        <Text>中立</Text>
                      </View>
                      <View style={styles.radioItem}>
                        <RadioButton value="dislike" />
                        <Text>不喜欢</Text>
                      </View>
                    </View>
                  </RadioButton.Group>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* 时间偏好部分 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>时间偏好设置</Text>
          <SelectList
            setSelected={setPreferredTime}
            data={timePreferences}
            save="key"
            placeholder="选择偏好的时间段"
            searchPlaceholder="搜索时间段"
            multiple={true}
            boxStyles={styles.selectBox}
            dropdownStyles={styles.dropdown}
            dropdownTextStyles={styles.dropdownText}
            inputStyles={styles.selectInput}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  categoryContainer: {
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  skillTag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  skillTagSelected: {
    backgroundColor: '#1890ff',
    borderColor: '#1890ff',
  },
  skillTagText: {
    color: '#666',
  },
  skillTagTextSelected: {
    color: '#fff',
  },
  taskCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  taskLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 5,
  },
  dropdownText: {
    color: '#333',
    fontSize: 16,
  },
  selectInput: {
    color: '#333',
    fontSize: 16,
  },
});

export default Choice_preference; 
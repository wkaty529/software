import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  Chip,
  useTheme,
  ProgressBar,
  Title,
  Subheading,
  Divider,
  IconButton,
  Portal,
  Modal,
  RadioButton,
  Checkbox,
  Card,
  Switch,
} from 'react-native-paper';
import CustomIcon from './components/CustomIcon';

// 屏幕宽度
const { width } = Dimensions.get('window');

// 技能数据 - 分类整理
const skillCategories = [
  {
    id: 'household',
    name: '生活家务类',
    skills: [
      { id: 'cooking', name: '烹饪', icon: 'food' },
      { id: 'cleaning', name: '清洁', icon: 'broom' },
      { id: 'laundry', name: '洗衣', icon: 'washing-machine' },
      { id: 'ironing', name: '熨烫', icon: 'iron' },
      { id: 'shopping', name: '购物', icon: 'cart' },
      { id: 'organizing', name: '收纳整理', icon: 'folder-organize' },
      { id: 'meal-prep', name: '餐食准备', icon: 'silverware' },
    ]
  },
  {
    id: 'parenting',
    name: '育儿教育类',
    skills: [
      { id: 'childcare', name: '育儿', icon: 'baby-face-outline' },
      { id: 'teaching', name: '教育辅导', icon: 'school' },
      { id: 'story-telling', name: '讲故事', icon: 'book-open-variant' },
      { id: 'activities', name: '亲子活动', icon: 'balloon' },
      { id: 'meal-planning', name: '儿童餐饮', icon: 'food-apple' },
    ]
  },
  {
    id: 'technical',
    name: '技术维护类',
    skills: [
      { id: 'repair', name: '家电维修', icon: 'wrench' },
      { id: 'plumbing', name: '水管维修', icon: 'pipe' },
      { id: 'electric', name: '电路维修', icon: 'lightning-bolt' },
      { id: 'gardening', name: '园艺', icon: 'tree' },
      { id: 'device-setup', name: '设备安装', icon: 'hammer-screwdriver' },
      { id: 'furniture', name: '家具组装', icon: 'sofa' },
    ]
  },
  {
    id: 'management',
    name: '综合管理类',
    skills: [
      { id: 'scheduling', name: '日程规划', icon: 'calendar' },
      { id: 'budgeting', name: '家庭预算', icon: 'cash' },
      { id: 'pet-care', name: '宠物护理', icon: 'paw' },
      { id: 'elderly-care', name: '老人护理', icon: 'account-heart' },
      { id: 'health-mgmt', name: '健康管理', icon: 'heart-pulse' },
      { id: 'doc-mgmt', name: '文件管理', icon: 'file-document' },
    ]
  }
];

// 任务类型偏好
const taskPreferences = [
  { id: 'routine', name: '日常例行任务', icon: 'repeat', description: '偏好有规律、周期性的任务' },
  { id: 'complex', name: '复杂性任务', icon: 'puzzle', description: '偏好需要解决问题的复杂任务' },
  { id: 'creative', name: '创意性任务', icon: 'lightbulb', description: '偏好需要创意和创新的任务' },
  { id: 'physical', name: '体力型任务', icon: 'arm-flex', description: '偏好需要体力的活动任务' },
  { id: 'mental', name: '思考型任务', icon: 'head', description: '偏好需要思考和规划的任务' },
  { id: 'social', name: '社交型任务', icon: 'account-group', description: '偏好与人互动的任务' },
];

// 时间偏好
const timeSlots = [
  { id: 'morning', name: '早晨 (6-9点)', icon: 'weather-sunset-up' },
  { id: 'before-noon', name: '上午 (9-12点)', icon: 'weather-sunny' },
  { id: 'noon', name: '中午 (12-14点)', icon: 'weather-sunny' },
  { id: 'afternoon', name: '下午 (14-18点)', icon: 'weather-sunset-down' },
  { id: 'evening', name: '晚上 (18-22点)', icon: 'weather-night' },
  { id: 'night', name: '夜间 (22-6点)', icon: 'moon-waning-crescent' },
];

// 环境偏好数据
const environmentPreferences = [
  { 
    id: 'noise',
    name: '噪音耐受度',
    min: '喜欢安静',
    max: '不介意噪音',
    icon: 'volume-high'
  },
  { 
    id: 'space',
    name: '空间需求',
    min: '小空间',
    max: '大空间',
    icon: 'floor-plan'
  },
  { 
    id: 'urgency',
    name: '紧急程度接受度',
    min: '喜欢从容',
    max: '能应对紧急',
    icon: 'timer-sand'
  },
  { 
    id: 'multitasking',
    name: '多任务处理',
    min: '专注单任务',
    max: '擅长多任务',
    icon: 'checkbox-multiple-marked'
  },
];

const AbilityChoice = ({ navigation }) => {
  const theme = useTheme();
  
  // 当前步骤
  const [currentStep, setCurrentStep] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  
  // 选中的技能
  const [selectedSkills, setSelectedSkills] = useState({});
  
  // 任务类型偏好
  const [taskTypePreferences, setTaskTypePreferences] = useState([]);
  
  // 时间偏好
  const [timePreferences, setTimePreferences] = useState([]);
  
  // 环境偏好
  const [environmentValues, setEnvironmentValues] = useState({
    noise: 3,
    space: 3,
    urgency: 3,
    multitasking: 3
  });
  
  // 当前技能类别
  const [currentCategory, setCurrentCategory] = useState(skillCategories[0].id);
  
  // 是否显示帮助模态框
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  
  // 进度条值
  const steps = ['技能选择', '任务偏好', '时间偏好', '环境偏好'];
  const progress = (currentStep + 1) / steps.length;

  // 切换技能
  const toggleSkill = (skillId) => {
    setSelectedSkills(prev => {
      const newSelection = { ...prev };
      if (newSelection[skillId]) {
        delete newSelection[skillId];
      } else {
        newSelection[skillId] = true;
      }
      return newSelection;
    });
  };

  // 切换任务类型偏好
  const toggleTaskPreference = (prefId) => {
    setTaskTypePreferences(prev => 
      prev.includes(prefId)
        ? prev.filter(id => id !== prefId)
        : [...prev, prefId]
    );
  };

  // 切换时间偏好
  const toggleTimePreference = (timeId) => {
    setTimePreferences(prev => 
      prev.includes(timeId)
        ? prev.filter(id => id !== timeId)
        : [...prev, timeId]
    );
  };

  // 处理环境偏好变化
  const handleEnvironmentChange = (prefId, value) => {
    setEnvironmentValues(prev => ({
      ...prev,
      [prefId]: value
    }));
  };

  // 下一步
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  // 上一步
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // 跳过当前步骤
  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // 提交
  const handleSubmit = () => {
    // 准备要提交的数据
    const userData = {
      skills: Object.keys(selectedSkills),
      taskPreferences: taskTypePreferences,
      timePreferences,
      environmentPreferences: environmentValues
    };
    
    console.log('提交的用户数据:', userData);
    
    // 导航到主应用界面
    navigation.navigate('MainTabs');
  };

  // 渲染技能类别切换器
  const renderCategoryTabs = () => (
    <View style={styles.categoryTabsWrapper}>
      <View style={styles.categoryTabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryTabs}
          contentContainerStyle={styles.categoryTabsContent}
        >
          {skillCategories.map(category => (
            <Button
              key={category.id}
              mode={currentCategory === category.id ? "contained" : "outlined"}
              onPress={() => setCurrentCategory(category.id)}
              style={[
                styles.categoryTab,
                currentCategory === category.id && styles.selectedCategoryTab
              ]}
              labelStyle={[
                styles.categoryTabLabel,
                currentCategory === category.id && styles.selectedCategoryTabLabel
              ]}
            >
              {category.name}
            </Button>
          ))}
        </ScrollView>
        
        {/* 右侧阴影提示可滑动 */}
        <View style={styles.tabShadowIndicator} />
      </View>
      
      {/* 滑动指示器 */}
      <View style={styles.scrollIndicator}>
        {skillCategories.map((category, index) => (
          <View 
            key={category.id}
            style={[
              styles.scrollIndicatorDot,
              currentCategory === category.id && styles.scrollIndicatorDotActive
            ]} 
          />
        ))}
      </View>
    </View>
  );

  // 渲染技能标签
  const renderSkills = () => {
    const currentCategoryData = skillCategories.find(cat => cat.id === currentCategory);
    
    return (
      <View style={styles.skillsSection}>
        <Title style={styles.sectionTitle}>{currentCategoryData.name}</Title>
        <View style={styles.skillsContainer}>
          {currentCategoryData.skills.map(skill => {
            const isSelected = !!selectedSkills[skill.id];
            return (
              <Chip
                key={skill.id}
                selected={isSelected}
                onPress={() => toggleSkill(skill.id)}
                style={[
                  styles.chip,
                  isSelected && styles.selectedChip
                ]}
                textStyle={isSelected ? styles.selectedChipText : styles.chipText}
                icon={({ size }) => (
                  <CustomIcon 
                    name={skill.icon} 
                    size={20} 
                    color={isSelected ? '#ffffff' : theme.colors.primary} 
                  />
                )}
                selectedColor="#ffffff"
              >
                {skill.name}
              </Chip>
            );
          })}
        </View>
      </View>
    );
  };

  // 渲染任务类型偏好
  const renderTaskPreferences = () => (
    <View style={styles.preferencesSection}>
      <Title style={styles.sectionTitle}>任务类型偏好</Title>
      <Subheading style={styles.sectionSubtitle}>选择你偏好的任务类型（可多选）</Subheading>
      
      {taskPreferences.map(pref => (
        <Card 
          key={pref.id} 
          style={[
            styles.preferenceCard,
            taskTypePreferences.includes(pref.id) && styles.selectedPreferenceCard
          ]}
          onPress={() => toggleTaskPreference(pref.id)}
        >
          <Card.Content style={styles.preferenceCardContent}>
            <View style={styles.preferenceIconContainer}>
              <CustomIcon 
                name={pref.icon} 
                size={28} 
                color={taskTypePreferences.includes(pref.id) ? theme.colors.primary : '#666'} 
              />
            </View>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceTitle}>{pref.name}</Text>
              <Text style={styles.preferenceDescription}>{pref.description}</Text>
            </View>
            <Checkbox
              status={taskTypePreferences.includes(pref.id) ? 'checked' : 'unchecked'}
              color={theme.colors.primary}
            />
          </Card.Content>
        </Card>
      ))}
    </View>
  );

  // 渲染时间偏好
  const renderTimePreferences = () => (
    <View style={styles.preferencesSection}>
      <Title style={styles.sectionTitle}>时间偏好</Title>
      <Subheading style={styles.sectionSubtitle}>选择你偏好的工作时间段（可多选）</Subheading>
      
      <View style={styles.timeContainer}>
        {timeSlots.map(time => (
          <Chip
            key={time.id}
            selected={timePreferences.includes(time.id)}
            onPress={() => toggleTimePreference(time.id)}
            style={[
              styles.timeChip,
              timePreferences.includes(time.id) && styles.selectedTimeChip
            ]}
            textStyle={timePreferences.includes(time.id) ? styles.selectedChipText : styles.chipText}
            icon={({ size }) => (
              <CustomIcon 
                name={time.icon} 
                size={20} 
                color={timePreferences.includes(time.id) ? '#ffffff' : theme.colors.primary} 
              />
            )}
            selectedColor="#ffffff"
          >
            {time.name}
          </Chip>
        ))}
      </View>
    </View>
  );

  // 渲染环境偏好
  const renderEnvironmentPreferences = () => (
    <View style={styles.preferencesSection}>
      <Title style={styles.sectionTitle}>环境偏好</Title>
      <Subheading style={styles.sectionSubtitle}>点击加减按钮设置你对环境的偏好</Subheading>
      
      {environmentPreferences.map(pref => (
        <View key={pref.id} style={styles.sliderContainer}>
          <View style={styles.sliderHeader}>
            <CustomIcon name={pref.icon} size={24} color={theme.colors.primary} />
            <Text style={styles.sliderTitle}>{pref.name}</Text>
          </View>
          <View style={styles.sliderContent}>
            <Text style={styles.sliderMin}>{pref.min}</Text>
            
            <View style={styles.customSlider}>
              <IconButton
                icon="minus"
                size={20}
                color={theme.colors.primary}
                style={styles.sliderButton}
                onPress={() => {
                  if (environmentValues[pref.id] > 1) {
                    handleEnvironmentChange(pref.id, environmentValues[pref.id] - 1);
                  }
                }}
                disabled={environmentValues[pref.id] <= 1}
              />
              
              <View style={styles.sliderTrack}>
                {[1, 2, 3, 4, 5].map(value => (
                  <View 
                    key={value}
                    style={[
                      styles.sliderDot,
                      value <= environmentValues[pref.id] ? styles.sliderDotActive : null
                    ]}
                    onTouchEnd={() => handleEnvironmentChange(pref.id, value)}
                  />
                ))}
              </View>
              
              <IconButton
                icon="plus"
                size={20}
                color={theme.colors.primary}
                style={styles.sliderButton}
                onPress={() => {
                  if (environmentValues[pref.id] < 5) {
                    handleEnvironmentChange(pref.id, environmentValues[pref.id] + 1);
                  }
                }}
                disabled={environmentValues[pref.id] >= 5}
              />
            </View>
            
            <Text style={styles.sliderMax}>{pref.max}</Text>
          </View>
          <View style={styles.sliderValueIndicator}>
            <Text style={styles.sliderValueText}>
              {environmentValues[pref.id]}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  // 渲染当前步骤内容
  const renderStepContent = () => {
    switch(currentStep) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            {renderCategoryTabs()}
            {renderSkills()}
          </View>
        );
      case 1:
        return renderTaskPreferences();
      case 2:
        return renderTimePreferences();
      case 3:
        return renderEnvironmentPreferences();
      default:
        return null;
    }
  };

  // 渲染帮助信息模态框
  const renderHelpModal = () => (
    <Portal>
      <Modal
        visible={helpModalVisible}
        onDismiss={() => setHelpModalVisible(false)}
        contentContainerStyle={styles.modalContent}
      >
        <Title style={styles.modalTitle}>帮助信息</Title>
        <Divider style={styles.modalDivider} />
        <Text style={styles.modalText}>
          {currentStep === 0 && '请选择你擅长的家务技能。您可以通过上方的分类标签切换不同类别的技能。'}
          {currentStep === 1 && '请选择你偏好的任务类型。这将帮助系统更好地为你分配适合的任务。'}
          {currentStep === 2 && '请选择你偏好的工作时间段。系统会尽量根据你的时间偏好安排任务。'}
          {currentStep === 3 && '请调整滑块设置你的环境偏好。这些信息将帮助系统更准确地匹配适合你的任务环境。'}
        </Text>
        <Button
          mode="contained"
          onPress={() => setHelpModalVisible(false)}
          style={styles.modalButton}
        >
          了解了
        </Button>
      </Modal>
    </Portal>
  );

  return (
    <View style={styles.container}>
      {/* 顶部进度条和导航 */}
      <Surface style={styles.header}>
        <View style={styles.progressContainer}>
          <Text style={styles.stepText}>步骤 {currentStep + 1}/{steps.length}: {steps[currentStep]}</Text>
          <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progressBar} />
        </View>
        <IconButton
          icon="help-circle-outline"
          color={theme.colors.primary}
          size={24}
          onPress={() => setHelpModalVisible(true)}
        />
      </Surface>
      
      {/* 主内容区 */}
      <ScrollView style={styles.content}>
        {renderStepContent()}
      </ScrollView>
      
      {/* 底部按钮区 */}
      <Surface style={styles.footer}>
        {currentStep > 0 && (
          <Button
            mode="outlined"
            onPress={handleBack}
            style={styles.backButton}
          >
            上一步
          </Button>
        )}
        
        <View style={styles.rightButtons}>
          {currentStep < steps.length - 1 && (
            <Button
              mode="text"
              onPress={handleSkip}
              style={styles.skipButton}
            >
              跳过
            </Button>
          )}
          
          <Button
            mode="contained"
            onPress={handleNext}
            style={styles.nextButton}
          >
            {currentStep === steps.length - 1 ? '完成' : '下一步'}
          </Button>
        </View>
      </Surface>
      
      {/* 帮助模态框 */}
      {renderHelpModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    elevation: 4,
  },
  progressContainer: {
    flex: 1,
    marginRight: 8,
  },
  stepText: {
    marginBottom: 8,
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    elevation: 4,
  },
  backButton: {
    minWidth: 100,
  },
  rightButtons: {
    flexDirection: 'row',
  },
  skipButton: {
    marginRight: 8,
  },
  nextButton: {
    minWidth: 100,
  },
  stepContainer: {
    padding: 16,
  },
  categoryTabsWrapper: {
    marginBottom: 16,
  },
  categoryTabsContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  categoryTabs: {
    marginBottom: 8,
  },
  categoryTabsContent: {
    paddingRight: 24,
  },
  categoryTab: {
    marginRight: 10,
    borderRadius: 20,
    minWidth: 100,
    height: 40,
    justifyContent: 'center',
  },
  selectedCategoryTab: {
    elevation: 2,
  },
  categoryTabLabel: {
    fontSize: 13,
    marginHorizontal: 0,
  },
  selectedCategoryTabLabel: {
    fontWeight: 'bold',
  },
  tabShadowIndicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 20,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: -10, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 1,
  },
  scrollIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  scrollIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e0d0ff',
    marginHorizontal: 4,
  },
  scrollIndicatorDotActive: {
    backgroundColor: '#6200ee',
    width: 18,
    height: 6,
  },
  skillsSection: {
    marginBottom: 16,
  },
  preferencesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    margin: 4,
    backgroundColor: '#f0e6ff',
    paddingHorizontal: 4,
    height: 38,
    borderWidth: 1,
    borderColor: '#e0d0ff',
  },
  chipText: {
    color: '#5600c7',
    fontWeight: '500',
  },
  selectedChip: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  selectedChipText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  preferenceCard: {
    marginBottom: 12,
    elevation: 1,
  },
  selectedPreferenceCard: {
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  preferenceCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  preferenceIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  preferenceTextContainer: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 12,
    color: '#666',
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  timeChip: {
    margin: 6,
    backgroundColor: '#f0e6ff',
    paddingHorizontal: 8,
    height: 42,
    borderWidth: 1,
    borderColor: '#e0d0ff',
  },
  selectedTimeChip: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  sliderContainer: {
    marginBottom: 24,
  },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sliderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  customSlider: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
  sliderTrack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 4,
    backgroundColor: '#d6d6d6',
    borderRadius: 2,
    marginHorizontal: 10,
  },
  sliderDot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#d6d6d6',
    elevation: 2,
  },
  sliderDotActive: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  sliderButton: {
    margin: 0,
  },
  sliderMin: {
    width: 80,
    fontSize: 12,
    color: '#666',
  },
  sliderMax: {
    width: 80,
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  sliderValueIndicator: {
    alignItems: 'center',
  },
  sliderValueText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDivider: {
    marginBottom: 16,
  },
  modalText: {
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButton: {
    marginTop: 8,
  },
});

export default AbilityChoice;

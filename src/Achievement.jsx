import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Text,
  Surface,
  Avatar,
  ProgressBar,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const achievements = [
  {
    id: 1,
    title: '家务达人',
    description: '完成100个家务任务',
    icon: 'star',
    progress: 0.75,
    total: 100,
    current: 75,
    points: 500,
    isUnlocked: false,
  },
  {
    id: 2,
    title: '清洁专家',
    description: '完成50次清洁任务',
    icon: 'broom',
    progress: 0.4,
    total: 50,
    current: 20,
    points: 300,
    isUnlocked: false,
  },
  {
    id: 3,
    title: '烹饪大师',
    description: '完成30次烹饪任务',
    icon: 'food',
    progress: 0.2,
    total: 30,
    current: 6,
    points: 400,
    isUnlocked: false,
  },
  {
    id: 4,
    title: '团队之星',
    description: '与家人完成20个协作任务',
    icon: 'account-group',
    progress: 0.6,
    total: 20,
    current: 12,
    points: 600,
    isUnlocked: false,
  },
];

const Achievement = () => {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header}>
        <View style={styles.headerContent}>
          <Icon name="trophy" size={40} color={theme.colors.primary} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>我的成就</Text>
            <Text style={styles.headerSubtitle}>继续努力，解锁更多成就！</Text>
          </View>
        </View>
      </Surface>

      <View style={styles.achievementsContainer}>
        {achievements.map(achievement => (
          <Surface key={achievement.id} style={styles.achievementCard}>
            <View style={styles.achievementHeader}>
              <Avatar.Icon
                size={40}
                icon={achievement.icon}
                style={[
                  styles.achievementIcon,
                  achievement.isUnlocked && styles.unlockedIcon,
                ]}
              />
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <ProgressBar
                progress={achievement.progress}
                color={achievement.isUnlocked ? theme.colors.primary : '#ccc'}
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>
                {achievement.current}/{achievement.total}
              </Text>
            </View>

            <View style={styles.pointsContainer}>
              <Icon name="star" size={16} color={theme.colors.primary} />
              <Text style={styles.pointsText}>{achievement.points} 积分</Text>
            </View>
          </Surface>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    margin: 16,
    padding: 16,
    borderRadius: 10,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  achievementsContainer: {
    padding: 16,
  },
  achievementCard: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementIcon: {
    backgroundColor: '#e0e0e0',
  },
  unlockedIcon: {
    backgroundColor: '#6200ee',
  },
  achievementInfo: {
    marginLeft: 16,
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#6200ee',
    fontWeight: 'bold',
  },
});

export default Achievement;

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  Card,
  Avatar,
  useTheme,
  FAB,
} from 'react-native-paper';
import CustomIcon from './components/CustomIcon';
import { CommonImages } from './assets/images';
// 使用导航回调
import { useFocusEffect } from '@react-navigation/native';

const mockTasks = [
  {
    id: 1,
    title: '打扫客厅',
    description: '扫地、拖地、擦桌子',
    points: 50,
    deadline: '今天 18:00',
    assignee: {
      name: '张三',
      avatar: null,
    },
  },
  {
    id: 2,
    title: '准备晚餐',
    description: '煮饭、炒菜',
    points: 80,
    deadline: '今天 19:00',
    assignee: {
      name: '李四',
      avatar: null,
    },
  },
];

const Index = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState(mockTasks);
  const theme = useTheme();

  // 使用焦点效果检查是否有新创建的任务
  useFocusEffect(
    React.useCallback(() => {
      // 从route.params中获取新任务数据
      if (route.params?.newTask) {
        handleCreateTask(route.params.newTask);
        // 重置参数，避免重复添加
        navigation.setParams({ newTask: undefined });
      }
      
      // 检查任务状态更新
      if (route.params?.updatedTaskId && route.params?.newStatus) {
        const { updatedTaskId, newStatus } = route.params;
        handleTaskStatusChange(updatedTaskId, newStatus);
        // 重置参数，避免重复更新
        navigation.setParams({ updatedTaskId: undefined, newStatus: undefined });
      }
    }, [route.params])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: 实现刷新逻辑
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleCreateTask = (newTask) => {
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  const handleTaskStatusChange = (taskId, newStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
      )
    );
  };

  const handleTaskPress = (taskId) => {
    navigation.navigate('TaskDetail', { taskId });
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* 用户信息卡片 */}
      <Surface style={styles.userCard}>
        <View style={styles.userInfo}>
          <Avatar.Image
            size={60}
            source={CommonImages.avatar}
            style={styles.avatar}
          />
          <View style={styles.userText}>
            <Text style={styles.userName}>王小明</Text>
            <Text style={styles.userPoints}>积分: 1280</Text>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{tasks.filter(t => t.status === 'completed').length}</Text>
            <Text style={styles.statLabel}>完成任务</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{tasks.filter(t => t.status === 'pending').length}</Text>
            <Text style={styles.statLabel}>待处理</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{tasks.filter(t => t.status === 'in_progress').length}</Text>
            <Text style={styles.statLabel}>进行中</Text>
          </View>
        </View>
      </Surface>

      {/* 今日任务 */}
      <Text style={styles.sectionTitle}>今日任务</Text>
      {tasks.map(task => (
        <Card 
          key={task.id} 
          style={styles.taskCard}
          onPress={() => handleTaskPress(task.id)}
        >
          <Card.Content>
            <View style={styles.taskHeader}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskPoints}>{task.points} 积分</Text>
            </View>
            <Text style={styles.taskDescription}>{task.description}</Text>
            <View style={styles.taskFooter}>
              <View style={styles.assigneeInfo}>
                <Avatar.Image
                  size={24}
                  source={task.assignee.avatar || CommonImages.avatar}
                />
                <Text style={styles.assigneeName}>{task.assignee.name}</Text>
              </View>
              <Text style={styles.deadline}>{task.deadline}</Text>
            </View>
          </Card.Content>
        </Card>
      ))}

      {/* 快速操作按钮 */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CreateTask')}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  userCard: {
    margin: 16,
    padding: 16,
    borderRadius: 10,
    elevation: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    marginRight: 16,
  },
  userText: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userPoints: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 16,
    marginTop: 0,
  },
  taskCard: {
    margin: 16,
    marginTop: 0,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskPoints: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  taskDescription: {
    color: '#666',
    marginBottom: 8,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assigneeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assigneeName: {
    marginLeft: 8,
  },
  deadline: {
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default Index;


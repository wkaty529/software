import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Text,
  Surface,
  Avatar,
  Button,
  IconButton,
  TextInput,
  Divider,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CommonImages } from './assets/images';

const TaskDetail = ({ route, navigation }) => {
  const { taskId } = route.params;
  const [taskStatus, setTaskStatus] = useState('pending'); // pending, in_progress, completed
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      user: {
        name: '张三',
        avatar: null,
      },
      content: '好的，我这就开始做',
      timestamp: '10:30',
    },
  ]);
  const theme = useTheme();

  // 模拟任务数据
  const task = {
    id: taskId,
    title: '打扫客厅',
    description: '1. 整理杂物\n2. 扫地\n3. 拖地\n4. 擦桌子\n5. 清理垃圾',
    points: 50,
    deadline: '今天 18:00',
    priority: 'high',
    assignee: {
      name: '张三',
      avatar: null,
    },
    createdBy: {
      name: '李四',
      avatar: null,
    },
    createdAt: '2024-03-20 10:00',
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'in_progress':
        return '#2196F3';
      default:
        return '#FFC107';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#F44336';
      case 'medium':
        return '#FFC107';
      default:
        return '#4CAF50';
    }
  };

  const handleStatusChange = (newStatus) => {
    setTaskStatus(newStatus);
    
    // 使用导航参数返回更新的任务状态，而不是回调函数
    navigation.navigate('MainTabs', {
      screen: 'Home',
      params: { 
        updatedTaskId: taskId,
        newStatus: newStatus
      }
    });
  };

  const handleComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        user: {
          name: '当前用户',
          avatar: null,
        },
        content: comment.trim(),
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      };
      setComments(prevComments => [...prevComments, newComment]);
      setComment('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{task.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(taskStatus) }]}>
            <Text style={styles.statusText}>
              {taskStatus === 'completed' ? '已完成' : 
               taskStatus === 'in_progress' ? '进行中' : '待处理'}
            </Text>
          </View>
        </View>

        <View style={styles.priorityContainer}>
          <Icon name="flag" size={16} color={getPriorityColor(task.priority)} />
          <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
            {task.priority === 'high' ? '高优先级' : 
             task.priority === 'medium' ? '中优先级' : '低优先级'}
          </Text>
        </View>

        <Text style={styles.description}>{task.description}</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Icon name="account" size={20} color="#666" />
            <Text style={styles.infoText}>负责人：{task.assignee.name}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="clock-outline" size={20} color="#666" />
            <Text style={styles.infoText}>截止时间：{task.deadline}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="star" size={20} color="#FFC107" />
            <Text style={styles.infoText}>积分：{task.points}</Text>
          </View>
        </View>
      </Surface>

      <Surface style={styles.card}>
        <Text style={styles.sectionTitle}>评论区</Text>
        {comments.map(comment => (
          <View key={comment.id} style={styles.commentItem}>
            <View style={styles.commentHeader}>
              <View style={styles.commentUser}>
                <Avatar.Image
                  size={32}
                  source={comment.user.avatar || CommonImages.avatar}
                />
                <Text style={styles.commentUserName}>{comment.user.name}</Text>
              </View>
              <Text style={styles.commentTime}>{comment.timestamp}</Text>
            </View>
            <Text style={styles.commentContent}>{comment.content}</Text>
          </View>
        ))}
        <View style={styles.commentInput}>
          <TextInput
            placeholder="添加评论..."
            value={comment}
            onChangeText={setComment}
            mode="outlined"
            style={styles.input}
          />
          <IconButton
            icon="send"
            size={24}
            onPress={handleComment}
            disabled={!comment.trim()}
          />
        </View>
      </Surface>

      <View style={styles.buttonContainer}>
        {taskStatus === 'pending' && (
          <Button
            mode="contained"
            onPress={() => handleStatusChange('in_progress')}
            style={styles.button}
          >
            开始任务
          </Button>
        )}
        {taskStatus === 'in_progress' && (
          <Button
            mode="contained"
            onPress={() => handleStatusChange('completed')}
            style={styles.button}
          >
            完成任务
          </Button>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  priorityText: {
    marginLeft: 4,
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 24,
  },
  infoContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  commentItem: {
    marginBottom: 16,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentUserName: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  commentTime: {
    fontSize: 12,
    color: '#666',
  },
  commentContent: {
    fontSize: 14,
    color: '#666',
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  buttonContainer: {
    padding: 16,
  },
  button: {
    marginBottom: 8,
  },
});

export default TaskDetail; 
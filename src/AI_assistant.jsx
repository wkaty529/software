import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  Surface,
  TextInput,
  Button,
  Avatar,
  useTheme,
  IconButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const mockChatHistory = [
  {
    id: 1,
    type: 'ai',
    content: '你好！我是你的家务AI助理，有什么我可以帮你的吗？',
    timestamp: '10:00',
  },
  {
    id: 2,
    type: 'user',
    content: '我想知道如何更好地安排家务时间',
    timestamp: '10:01',
  },
  {
    id: 3,
    type: 'ai',
    content: '我可以帮你制定一个合理的家务时间表。首先，让我们了解一下你的日常作息时间。你通常什么时候比较空闲？',
    timestamp: '10:02',
  },
];

const quickQuestions = [
  '如何制定家务计划？',
  '家务时间管理建议',
  '清洁技巧分享',
  '烹饪建议',
];

const AIAssistant = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState(mockChatHistory);
  const theme = useTheme();

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: chatHistory.length + 1,
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory(prev => [...prev, newMessage]);
    setMessage('');

    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = {
        id: chatHistory.length + 2,
        type: 'ai',
        content: '我明白了，让我为你提供一些建议...',
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleQuickQuestion = (question) => {
    setMessage(question);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Surface style={styles.header}>
        <View style={styles.headerContent}>
          <Avatar.Icon
            size={40}
            icon="robot"
            style={styles.avatar}
          />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>AI家务助理</Text>
            <Text style={styles.headerSubtitle}>智能家务建议与帮助</Text>
          </View>
        </View>
      </Surface>

      <ScrollView style={styles.chatContainer}>
        {chatHistory.map(msg => (
          <View
            key={msg.id}
            style={[
              styles.messageContainer,
              msg.type === 'user' ? styles.userMessage : styles.aiMessage,
            ]}
          >
            {msg.type === 'ai' && (
              <Avatar.Icon
                size={32}
                icon="robot"
                style={styles.messageAvatar}
              />
            )}
            <Surface style={[
              styles.messageBubble,
              msg.type === 'user' ? styles.userBubble : styles.aiBubble,
            ]}>
              <Text style={styles.messageText}>{msg.content}</Text>
              <Text style={styles.timestamp}>{msg.timestamp}</Text>
            </Surface>
          </View>
        ))}
      </ScrollView>

      <View style={styles.quickQuestions}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickQuestions.map((question, index) => (
            <Button
              key={index}
              mode="outlined"
              onPress={() => handleQuickQuestion(question)}
              style={styles.quickQuestionButton}
            >
              {question}
            </Button>
          ))}
        </ScrollView>
      </View>

      <Surface style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="输入你的问题..."
          mode="outlined"
          style={styles.input}
          multiline
        />
        <IconButton
          icon="send"
          size={24}
          onPress={handleSend}
          disabled={!message.trim()}
        />
      </Surface>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#6200ee',
  },
  headerText: {
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#6200ee',
  },
  aiBubble: {
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  timestamp: {
    fontSize: 12,
    color: '#rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  quickQuestions: {
    padding: 16,
    paddingTop: 0,
  },
  quickQuestionButton: {
    marginRight: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    elevation: 4,
  },
  input: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#fff',
  },
});

export default AIAssistant;

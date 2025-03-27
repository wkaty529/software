import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  withSpring,
} from 'react-native-reanimated';
import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import { useVirtualAICompanion } from './VirtualAICompanionProvider';

// 定义虚拟AI伙伴的属性接口
interface VirtualAICompanionProps {
  size?: number;
  position?: 'left' | 'right';
}

// 创建一个事件发布订阅机制
const navigationEvents = {
  listeners: new Set<(screenName: string, params?: any) => void>(),
  
  addListener(callback: (screenName: string, params?: any) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  },
  
  navigate(screenName: string, params?: any) {
    this.listeners.forEach(listener => listener(screenName, params));
  }
};

// 导出导航事件，供外部组件使用
export const AICompanionNavigationEvents = navigationEvents;

const VirtualAICompanion: React.FC<VirtualAICompanionProps> = ({
  size = 80,
  position = 'right',
}) => {
  // 状态管理
  const [isVisible, setIsVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState('');
  
  // 动画值
  const translateX = useSharedValue(position === 'right' ? size * 0.6 : -size * 0.6);
  const scale = useSharedValue(1);
  
  // 初始化语音识别和语音合成
  useEffect(() => {
    // 初始化语音识别
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = onSpeechResults;
    
    // 初始化TTS
    Tts.setDefaultLanguage('zh-CN');
    Tts.addEventListener('tts-finish', () => console.log('TTS完成'));
    
    // 清理函数
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      Tts.removeAllListeners('tts-finish');
    };
  }, []);
  
  // 处理语音识别结果
  const onSpeechResults = (e: SpeechResultsEvent) => {
    if (e.value && e.value.length > 0) {
      const recognizedText = e.value[0];
      setSpeechText(recognizedText);
      
      // 在这里可以处理语音命令，例如导航到AI对话界面
      if (recognizedText.includes('助手') || recognizedText.includes('对话')) {
        navigateToAIAssistant();
      }
    }
  };
  
  // 请求麦克风权限
  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: '需要麦克风权限',
            message: '要使用语音功能，应用需要访问您的麦克风',
            buttonPositive: '确定',
            buttonNegative: '取消',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error(err);
        return false;
      }
    }
    return true;
  };
  
  // 开始语音识别
  const startListening = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) return;
    
    try {
      await Voice.start('zh-CN');
    } catch (e) {
      console.error(e);
    }
  };
  
  // 停止语音识别
  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };
  
  // 使用TTS播放文本
  const speak = (text: string) => {
    Tts.speak(text);
  };
  
  // 导航到AI助手界面
  const navigateToAIAssistant = () => {
    // 使用动画效果
    scale.value = withSpring(1.2, { damping: 10 }, () => {
      scale.value = withSpring(1);
    });
    
    // 使用事件系统触发导航事件
    navigationEvents.navigate('AIAssistant', { speechText });
    
    // 重置语音文本
    setSpeechText('');
  };
  
  // 处理AI伙伴点击事件
  const handlePress = () => {
    setIsVisible(!isVisible);
    
    if (!isVisible) {
      // 显示AI伙伴
      translateX.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      
      // 动画完成后导航到AI助手界面
      setTimeout(navigateToAIAssistant, 300);
    } else {
      // 隐藏AI伙伴
      translateX.value = withTiming(
        position === 'right' ? size * 0.6 : -size * 0.6,
        {
          duration: 300,
          easing: Easing.in(Easing.cubic),
        }
      );
    }
  };
  
  // 定义动画样式
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { scale: scale.value },
      ],
    };
  });
  
  // 计算位置样式
  const positionStyle = {
    [position]: 0,
  };
  
  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          positionStyle,
          animatedStyle,
        ]}
      >
        <Image
          source={require('../assets/images/ai_assistant.png')}
          style={styles.image}
          resizeMode="cover"
        />
        {isListening && (
          <View style={styles.listeningIndicator} />
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  image: {
    width: '80%',
    height: '80%',
    borderRadius: 40,
  },
  listeningIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff4444',
  },
});

export default VirtualAICompanion; 
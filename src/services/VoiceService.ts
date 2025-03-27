import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import { Platform, PermissionsAndroid } from 'react-native';

/**
 * 语音识别结果回调
 */
type SpeechRecognitionCallback = (text: string) => void;

/**
 * 语音识别错误回调
 */
type SpeechErrorCallback = (error: string) => void;

/**
 * 语音服务状态
 */
interface VoiceServiceState {
  isListening: boolean;
  isSpeaking: boolean;
  hasPermission: boolean;
}

/**
 * 语音服务，提供语音识别和语音合成功能
 */
class VoiceServiceClass {
  private state: VoiceServiceState = {
    isListening: false,
    isSpeaking: false,
    hasPermission: false,
  };

  private onSpeechResultsCallback: SpeechRecognitionCallback | null = null;
  private onSpeechErrorCallback: SpeechErrorCallback | null = null;
  private onSpeakStartCallback: (() => void) | null = null;
  private onSpeakEndCallback: (() => void) | null = null;
  
  /**
   * 初始化语音服务
   */
  constructor() {
    this.init();
  }
  
  /**
   * 初始化语音识别和语音合成
   */
  private async init() {
    // 初始化语音识别
    Voice.onSpeechStart = this.handleSpeechStart;
    Voice.onSpeechEnd = this.handleSpeechEnd;
    Voice.onSpeechResults = this.handleSpeechResults;
    Voice.onSpeechError = this.handleSpeechError;
    
    // 初始化TTS
    try {
      await Tts.getInitStatus();
      await Tts.setDefaultLanguage('zh-CN');
      await Tts.setDefaultRate(0.5);
      await Tts.setDefaultPitch(1.0);
      
      // 设置事件监听器
      Tts.addEventListener('tts-start', this.handleSpeakStart);
      Tts.addEventListener('tts-finish', this.handleSpeakEnd);
      Tts.addEventListener('tts-error', this.handleSpeakError);
      
      // 检查TTS引擎是否可用
      const engines = await Tts.engines();
      if (engines.length === 0) {
        console.error('No TTS engines found');
        return;
      }
      
      // 在Android上，尝试使用Google TTS引擎
      if (Platform.OS === 'android') {
        const googleEngine = engines.find(engine => engine.name.toLowerCase().includes('google'));
        if (googleEngine) {
          await Tts.setDefaultEngine(googleEngine.name);
        }
      }
    } catch (err) {
      console.error('TTS initialization failed:', err);
    }
    
    // 检查权限
    this.state.hasPermission = await this.checkPermission();
  }
  
  /**
   * 设置语音识别结果回调
   * @param callback 回调函数
   */
  public setOnSpeechResults(callback: SpeechRecognitionCallback) {
    this.onSpeechResultsCallback = callback;
  }
  
  /**
   * 设置语音识别错误回调
   * @param callback 回调函数
   */
  public setOnSpeechError(callback: SpeechErrorCallback) {
    this.onSpeechErrorCallback = callback;
  }
  
  /**
   * 设置语音合成开始回调
   * @param callback 回调函数
   */
  public setOnSpeakStart(callback: () => void) {
    this.onSpeakStartCallback = callback;
  }
  
  /**
   * 设置语音合成结束回调
   * @param callback 回调函数
   */
  public setOnSpeakEnd(callback: () => void) {
    this.onSpeakEndCallback = callback;
  }
  
  /**
   * 检查麦克风权限
   */
  private async checkPermission(): Promise<boolean> {
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
  }
  
  /**
   * 处理语音识别开始
   */
  private handleSpeechStart = () => {
    this.state.isListening = true;
  };
  
  /**
   * 处理语音识别结束
   */
  private handleSpeechEnd = () => {
    this.state.isListening = false;
  };
  
  /**
   * 处理语音识别结果
   * @param e 语音识别结果事件
   */
  private handleSpeechResults = (e: SpeechResultsEvent) => {
    if (e.value && e.value.length > 0) {
      const recognizedText = e.value[0];
      if (this.onSpeechResultsCallback) {
        this.onSpeechResultsCallback(recognizedText);
      }
    }
  };
  
  /**
   * 处理语音识别错误
   * @param e 语音识别错误事件
   */
  private handleSpeechError = (e: SpeechErrorEvent) => {
    if (this.onSpeechErrorCallback) {
      this.onSpeechErrorCallback(e.error?.message || 'Unknown error');
    }
  };
  
  /**
   * 处理语音合成开始
   */
  private handleSpeakStart = () => {
    this.state.isSpeaking = true;
    if (this.onSpeakStartCallback) {
      this.onSpeakStartCallback();
    }
  };
  
  /**
   * 处理语音合成结束
   */
  private handleSpeakEnd = () => {
    this.state.isSpeaking = false;
    if (this.onSpeakEndCallback) {
      this.onSpeakEndCallback();
    }
  };
  
  /**
   * 处理语音合成错误
   */
  private handleSpeakError = (error: any) => {
    console.error('TTS error:', error);
    this.state.isSpeaking = false;
    if (this.onSpeakEndCallback) {
      this.onSpeakEndCallback();
    }
  };
  
  /**
   * 获取当前状态
   */
  public getState(): VoiceServiceState {
    return { ...this.state };
  }
  
  /**
   * 开始语音识别
   */
  public async startListening() {
    if (!this.state.hasPermission) {
      this.state.hasPermission = await this.checkPermission();
      if (!this.state.hasPermission) {
        if (this.onSpeechErrorCallback) {
          this.onSpeechErrorCallback('没有麦克风权限');
        }
        return;
      }
    }
    
    try {
      await Voice.start('zh-CN');
    } catch (e) {
      console.error(e);
      if (this.onSpeechErrorCallback) {
        this.onSpeechErrorCallback((e as Error).message);
      }
    }
  }
  
  /**
   * 停止语音识别
   */
  public async stopListening() {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }
  
  /**
   * 使用TTS播放文本
   * @param text 要播放的文本
   */
  public async speak(text: string) {
    try {
      // 如果当前正在说话，先停止
      if (this.state.isSpeaking) {
        await this.stopSpeaking();
      }
      
      // 分段处理长文本
      const segments = text.match(/[^。！？.!?]+[。！？.!?]?/g) || [text];
      
      for (const segment of segments) {
        if (segment.trim()) {
          await Tts.speak(segment.trim());
          
          // 等待一小段时间再说下一句
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    } catch (error) {
      console.error('Speak error:', error);
      this.handleSpeakError(error);
    }
  }
  
  /**
   * 停止语音合成
   */
  public stopSpeaking() {
    Tts.stop();
  }
  
  /**
   * 清理资源
   */
  public destroy() {
    Voice.destroy().then(Voice.removeAllListeners);
    Tts.removeAllListeners('tts-start');
    Tts.removeAllListeners('tts-finish');
    Tts.removeAllListeners('tts-error');
  }
}

// 导出语音服务单例
export const VoiceService = new VoiceServiceClass();

export default VoiceService; 
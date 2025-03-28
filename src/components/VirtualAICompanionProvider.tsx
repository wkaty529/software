import React, { ReactNode, createContext, useState, useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import VirtualAICompanion from './VirtualAICompanion';

// 创建上下文，用于控制虚拟AI伙伴的状态
interface VirtualAICompanionContextType {
  isVisible: boolean;
  showCompanion: () => void;
  hideCompanion: () => void;
  toggleCompanion: () => void;
  setScreenName: (screenName: string) => void;
}

const defaultContextValue: VirtualAICompanionContextType = {
  isVisible: false,
  showCompanion: () => {},
  hideCompanion: () => {},
  toggleCompanion: () => {},
  setScreenName: () => {},
};

export const VirtualAICompanionContext = createContext<VirtualAICompanionContextType>(defaultContextValue);

// 自定义Hook，用于访问虚拟AI伙伴上下文
export const useVirtualAICompanion = () => useContext(VirtualAICompanionContext);

interface VirtualAICompanionProviderProps {
  children: ReactNode;
  initialVisible?: boolean;
}

// 需要排除的屏幕（不显示AI助手的屏幕）
const EXCLUDED_SCREENS = ['LogIn', 'Register', 'AbilityChoice', 'PrivateInformation'];

// 虚拟AI伙伴提供者组件
const VirtualAICompanionProvider: React.FC<VirtualAICompanionProviderProps> = ({
  children,
  initialVisible = false,
}) => {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const [currentScreen, setCurrentScreen] = useState<string>('');

  // 检查当前屏幕是否应该显示AI助手
  const shouldShowCompanion = !EXCLUDED_SCREENS.includes(currentScreen);

  // 控制虚拟AI伙伴显示/隐藏的函数
  const showCompanion = () => setIsVisible(true);
  const hideCompanion = () => setIsVisible(false);
  const toggleCompanion = () => setIsVisible(prev => !prev);
  const setScreenName = (screenName: string) => setCurrentScreen(screenName);

  // 构建上下文值
  const contextValue = {
    isVisible,
    showCompanion,
    hideCompanion,
    toggleCompanion,
    setScreenName,
  };

  return (
    <VirtualAICompanionContext.Provider value={contextValue}>
      {children}
      {isVisible && shouldShowCompanion && <VirtualAICompanion />}
    </VirtualAICompanionContext.Provider>
  );
};

export default VirtualAICompanionProvider; 
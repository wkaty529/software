import React, { ReactNode, createContext, useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import VirtualAICompanion from './VirtualAICompanion';

// 创建上下文，用于控制虚拟AI伙伴的状态
interface VirtualAICompanionContextType {
  isVisible: boolean;
  showCompanion: () => void;
  hideCompanion: () => void;
  toggleCompanion: () => void;
}

const defaultContextValue: VirtualAICompanionContextType = {
  isVisible: true,
  showCompanion: () => {},
  hideCompanion: () => {},
  toggleCompanion: () => {},
};

export const VirtualAICompanionContext = createContext<VirtualAICompanionContextType>(defaultContextValue);

// 自定义Hook，用于访问虚拟AI伙伴上下文
export const useVirtualAICompanion = () => useContext(VirtualAICompanionContext);

interface VirtualAICompanionProviderProps {
  children: ReactNode;
  initialVisible?: boolean;
}

// 虚拟AI伙伴提供者组件
const VirtualAICompanionProvider: React.FC<VirtualAICompanionProviderProps> = ({
  children,
  initialVisible = true,
}) => {
  const [isVisible, setIsVisible] = useState(initialVisible);

  // 控制虚拟AI伙伴显示/隐藏的函数
  const showCompanion = () => setIsVisible(true);
  const hideCompanion = () => setIsVisible(false);
  const toggleCompanion = () => setIsVisible(prev => !prev);

  // 构建上下文值
  const contextValue = {
    isVisible,
    showCompanion,
    hideCompanion,
    toggleCompanion,
  };

  return (
    <VirtualAICompanionContext.Provider value={contextValue}>
      {children}
      {isVisible && <VirtualAICompanion />}
    </VirtualAICompanionContext.Provider>
  );
};

export default VirtualAICompanionProvider; 
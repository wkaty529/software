import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// 创建一个统一的CustomIcon组件，处理图标显示问题
const CustomIcon = ({ name, size = 24, color, style }) => {
  // 提供默认值
  const iconName = name || 'help-circle';
  const iconColor = color || '#6200ee';
  
  return (
    <View style={[styles.iconContainer, style]}>
      <MaterialCommunityIcons name={iconName} size={size} color={iconColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomIcon; 
import { DefaultTheme } from 'react-native-paper';

// 自定义应用主题
export const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4A6FA5', // 主色调
    accent: '#FF6B6B',  // 强调色
    background: '#F8F9FB',
    surface: '#FFFFFF',
    text: '#1E2022',
    subtext: '#6F7E8C',
    border: '#E1E5EB',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
  },
};

// 商品类别的图标映射
export const categoryIcons = {
  '全部': 'view-grid',
  '清洁用品': 'spray-bottle',
  '厨房用品': 'silverware-fork-knife',
  '收纳工具': 'box-shadow',
  '生活用品': 'home-variant',
  '其他': 'dots-horizontal-circle',
};

// 订单状态的图标映射
export const orderStatusIcons = {
  '待发货': 'clock-outline',
  '已发货': 'truck-delivery-outline',
  '已完成': 'check-circle-outline',
};

// 产品图片路径常量
export const productImages = {
  product1: require('../assets/products/cleaning_kit.jpg'),
  product2: require('../assets/products/storage_box.jpg'),
  product3: require('../assets/products/kitchen_set.jpg'),
};

// 格式化货币和积分的函数
export const formatPoints = (points) => {
  return `${points} 积分`;
};

// 空状态消息
export const emptyStateMessages = {
  products: '暂无符合条件的商品',
  orders: '暂无符合条件的兑换记录',
};

export default appTheme; 
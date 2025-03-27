// 产品图片
export const ProductImages = {
  // 清洁用品
  cleaningKit: require('../products/cleaning_kit.jpg'),
  // 收纳工具
  storageBox: require('../products/storage_box.jpg'),
  // 厨房用品
  kitchenSet: require('../products/kitchen_set.jpg'),
  // 厨房手套
  kitchenGloves: require('../products/kitchen_gloves.jpg'),
  // 默认商品图片
  defaultProduct: require('../products/default_product.jpg'),
};

// 通用图片
export const CommonImages = {
  // Logo 和图标
  logo: require('../common/logo.png'),
  placeholder: require('../common/placeholder.jpg'),
  avatar: require('../common/default_avatar.png'),
  // 背景图片
  headerBg: require('../common/header_bg.jpg'),
  emptyBg: require('../common/empty_bg.png'),
  // 登录页背景
  background: require('../common/background.jpg'),
};

// 导出所有图片
export default {
  ...ProductImages,
  ...CommonImages,
}; 
import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  Chip,
  useTheme,
  IconButton,
  Searchbar,
  Dialog,
  Portal,
  Paragraph,
  ActivityIndicator,
  Snackbar,
  Avatar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProductImages, CommonImages } from './assets/images';

// 定义主题颜色
const COLORS = {
  primary: '#4A6FA5',
  accent: '#FF6B6B',
  background: '#F8F9FB',
  surface: '#FFFFFF',
  text: '#1E2022',
  subtext: '#6F7E8C',
  border: '#E1E5EB',
  success: '#4CAF50',
  error: '#F44336',
};

// 商品类别图标
const CATEGORY_ICONS = {
  '全部': 'view-grid',
  '清洁用品': 'spray-bottle',
  '厨房用品': 'silverware-fork-knife',
  '收纳工具': 'package-variant',
  '生活用品': 'home-variant',
  '其他': 'dots-horizontal-circle',
};

// 模拟用户数据，实际应该从用户状态或API获取
const mockUserData = {
  points: 1280,
  address: '北京市海淀区中关村大街1号',
  phone: '138****1234',
};

const categories = [
  '全部',
  '清洁用品',
  '厨房用品',
  '收纳工具',
  '生活用品',
  '其他',
];

// 修改商品数据，使用本地图片
const mockProducts = [
  {
    id: '1',
    name: '多功能清洁套装',
    description: '包含拖把、扫把、抹布等清洁工具，适合各种家居清洁场景',
    points: 500,
    image: ProductImages.cleaningKit,
    category: '清洁用品',
    stock: 10,
    sales: 128,
    rating: 4.8,
    isNew: true,
  },
  {
    id: '2',
    name: '智能收纳盒',
    description: '可折叠收纳，节省空间，多种颜色可选，适合各种居家场景',
    points: 300,
    image: ProductImages.storageBox,
    category: '收纳工具',
    stock: 15,
    sales: 256,
    rating: 4.6,
  },
  {
    id: '3',
    name: '厨房调味料套装',
    description: '包含常用调味料，品质保证，安全健康，提升您的烹饪体验',
    points: 800,
    image: ProductImages.kitchenSet,
    category: '厨房用品',
    stock: 5,
    sales: 89,
    rating: 4.9,
    isNew: true,
  },
  {
    id: '4',
    name: '防滑厨房手套',
    description: '耐高温防滑设计，保护双手不受伤害，厨房必备用品',
    points: 150,
    image: ProductImages.kitchenGloves,
    category: '厨房用品',
    stock: 20,
    sales: 45,
    rating: 4.7,
  },
];

const Shopping = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exchangeResult, setExchangeResult] = useState({ visible: false, success: false, message: '' });
  const [userPoints, setUserPoints] = useState(mockUserData.points);
  const [products, setProducts] = useState(mockProducts);

  const theme = useTheme();

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === '全部' || product.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleExchange = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setDialogVisible(true);
    }
  };

  const confirmExchange = useCallback(() => {
    if (!selectedProduct) return;
    
    // 检查积分是否足够
    if (userPoints < selectedProduct.points) {
      setExchangeResult({
        visible: true,
        success: false,
        message: '积分不足，无法兑换商品'
      });
      setDialogVisible(false);
      return;
    }

    // 检查库存是否足够
    if (selectedProduct.stock <= 0) {
      setExchangeResult({
        visible: true,
        success: false,
        message: '商品已售罄，请选择其他商品'
      });
      setDialogVisible(false);
      return;
    }

    // 模拟兑换请求
    setLoading(true);
    setTimeout(() => {
      // 更新用户积分
      setUserPoints(prev => prev - selectedProduct.points);
      
      // 更新商品库存和销量
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === selectedProduct.id
            ? { 
                ...product, 
                stock: product.stock - 1,
                sales: product.sales + 1
              }
            : product
        )
      );

      // 显示成功消息
      setExchangeResult({
        visible: true,
        success: true,
        message: `成功兑换"${selectedProduct.name}"，消耗${selectedProduct.points}积分`
      });

      // 关闭加载和弹窗
      setLoading(false);
      setDialogVisible(false);
    }, 1500); // 模拟网络延迟
  }, [selectedProduct, userPoints]);

  const dismissSnackbar = () => {
    setExchangeResult({...exchangeResult, visible: false});
  };

  const goToExchangeHistory = () => {
    navigation.navigate('ExchangeHistory');
  };

  // 渲染星级评分
  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    
    return (
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Icon key={i} name="star" size={14} color="#FFD700" />;
          } else if (i === fullStars && halfStar) {
            return <Icon key={i} name="star-half-full" size={14} color="#FFD700" />;
          } else {
            return <Icon key={i} name="star-outline" size={14} color="#FFD700" />;
          }
        })}
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={CommonImages.headerBg} 
        style={styles.headerBg}
        resizeMode="cover"
      >
        <Surface style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.pointsContainer}>
              <Icon name="coin" size={24} color={COLORS.accent} style={styles.pointsIcon} />
              <View>
                <Text style={styles.pointsLabel}>我的积分</Text>
                <Text style={styles.pointsValue}>{userPoints}</Text>
              </View>
            </View>
            <Button 
              mode="outlined" 
              onPress={goToExchangeHistory}
              style={styles.historyButton}
              icon="history"
              color={COLORS.primary}
            >
              兑换记录
            </Button>
          </View>
          <Searchbar
            placeholder="搜索商品"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            iconColor={COLORS.primary}
            clearIcon="close-circle"
          />
        </Surface>
      </ImageBackground>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContentContainer}
      >
        {categories.map(category => (
          <Chip
            key={category}
            selected={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.categoryChip, 
              selectedCategory === category && styles.categoryChipSelected
            ]}
            icon={() => (
              <Icon 
                name={CATEGORY_ICONS[category]} 
                size={18} 
                color={selectedCategory === category ? '#fff' : COLORS.primary} 
              />
            )}
            selectedColor="#fff"
          >
            {category}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView style={styles.productsContainer}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <Surface key={product.id} style={styles.productCard}>
              <View style={styles.productImageContainer}>
                <Image
                  source={product.image}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                {product.isNew && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>新品</Text>
                  </View>
                )}
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {product.name}
                </Text>
                
                {renderRating(product.rating)}
                
                <Text style={styles.productDescription} numberOfLines={2}>
                  {product.description}
                </Text>
                
                <View style={styles.productMeta}>
                  <View style={styles.pointsAndStock}>
                    <View style={styles.productPointsContainer}>
                      <Icon name="coin" size={16} color={COLORS.accent} />
                      <Text style={styles.productPoints}>{product.points} 积分</Text>
                    </View>
                    <View style={styles.statsContainer}>
                      <Text style={styles.productStock}>库存: {product.stock}</Text>
                      <Text style={styles.productSales}>已兑: {product.sales}</Text>
                    </View>
                  </View>
                  <Button
                    mode="contained"
                    onPress={() => handleExchange(product.id)}
                    style={[
                      styles.exchangeButton,
                      (product.stock === 0 || userPoints < product.points) && styles.disabledButton
                    ]}
                    icon="cart"
                    disabled={product.stock === 0 || userPoints < product.points}
                    color={COLORS.primary}
                  >
                    {product.stock === 0 ? '已售罄' : 
                     userPoints < product.points ? '积分不足' : '立即兑换'}
                  </Button>
                </View>
              </View>
            </Surface>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Image 
              source={CommonImages.emptyBg}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyText}>暂无符合条件的商品</Text>
          </View>
        )}
      </ScrollView>

      {/* 漂浮按钮 */}
      <View style={styles.fabContainer}>
        <IconButton
          icon="cart-plus"
          color="#fff"
          size={24}
          style={styles.fab}
          onPress={() => {}}
        />
      </View>

      {/* 兑换确认弹窗 */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title style={styles.dialogTitle}>确认兑换</Dialog.Title>
          <Dialog.Content>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>处理中...</Text>
              </View>
            ) : (
              <>
                {selectedProduct && (
                  <>
                    <Paragraph style={styles.dialogParagraph}>您确定要兑换以下商品吗？</Paragraph>
                    <View style={styles.dialogProductInfo}>
                      <Image 
                        source={selectedProduct.image}
                        style={styles.dialogProductImage}
                      />
                      <View style={styles.dialogProductDetails}>
                        <Text style={styles.dialogProductName}>{selectedProduct.name}</Text>
                        <View style={styles.dialogProductPoints}>
                          <Icon name="coin" size={16} color={COLORS.accent} />
                          <Text style={styles.dialogPointsText}>{selectedProduct.points} 积分</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.dialogAddressContainer}>
                      <Icon name="map-marker" size={16} color={COLORS.primary} style={styles.dialogIcon} />
                      <Text style={styles.dialogAddress}>
                        收货地址：{mockUserData.address}
                      </Text>
                    </View>
                    <View style={styles.dialogAddressContainer}>
                      <Icon name="phone" size={16} color={COLORS.primary} style={styles.dialogIcon} />
                      <Text style={styles.dialogAddress}>
                        联系电话：{mockUserData.phone}
                      </Text>
                    </View>
                    <View style={styles.dialogBalanceContainer}>
                      <Text style={styles.dialogBalanceLabel}>兑换后积分余额：</Text>
                      <Text style={styles.dialogBalance}>{userPoints - selectedProduct.points}</Text>
                    </View>
                  </>
                )}
              </>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)} disabled={loading} color={COLORS.subtext}>取消</Button>
            <Button onPress={confirmExchange} disabled={loading} color={COLORS.primary}>确认兑换</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* 兑换结果提示 */}
      <Snackbar
        visible={exchangeResult.visible}
        onDismiss={dismissSnackbar}
        duration={3000}
        action={{
          label: '好的',
          onPress: dismissSnackbar,
        }}
        style={exchangeResult.success ? styles.successSnackbar : styles.errorSnackbar}
      >
        {exchangeResult.message}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBg: {
    width: '100%',
  },
  header: {
    padding: 16,
    elevation: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsIcon: {
    marginRight: 8,
  },
  pointsLabel: {
    fontSize: 12,
    color: COLORS.subtext,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  historyButton: {
    borderColor: COLORS.primary,
    borderRadius: 20,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  categoriesContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  categoriesContentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: '#fff',
    borderColor: COLORS.border,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
  },
  productsContainer: {
    padding: 16,
    paddingBottom: 80, // 为FAB留出空间
  },
  productCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#f5f5f5',
  },
  newBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: COLORS.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.subtext,
  },
  productDescription: {
    fontSize: 14,
    color: COLORS.subtext,
    marginBottom: 12,
    lineHeight: 20,
  },
  productMeta: {
    flex: 1,
  },
  pointsAndStock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  productStock: {
    fontSize: 12,
    color: COLORS.subtext,
    marginRight: 16,
  },
  productSales: {
    fontSize: 12,
    color: COLORS.subtext,
  },
  exchangeButton: {
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  fab: {
    backgroundColor: COLORS.primary,
    elevation: 4,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  emptyText: {
    marginTop: 16,
    color: COLORS.subtext,
    fontSize: 16,
  },
  // 对话框样式
  dialogTitle: {
    color: COLORS.primary,
  },
  dialogParagraph: {
    marginBottom: 12,
  },
  dialogProductInfo: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dialogProductImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  dialogProductDetails: {
    marginLeft: 12,
    flex: 1,
    justifyContent: 'center',
  },
  dialogProductName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: COLORS.text,
  },
  dialogProductPoints: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dialogPointsText: {
    marginLeft: 4,
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  dialogAddressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dialogIcon: {
    marginTop: 2,
    marginRight: 8,
  },
  dialogAddress: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  dialogBalanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  dialogBalanceLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  dialogBalance: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.subtext,
  },
  successSnackbar: {
    backgroundColor: COLORS.success,
  },
  errorSnackbar: {
    backgroundColor: COLORS.error,
  },
});

export default Shopping; 
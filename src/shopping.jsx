import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
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
} from 'react-native-paper';

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

const mockProducts = [
  {
    id: '1',
    name: '多功能清洁套装',
    description: '包含拖把、扫把、抹布等清洁工具',
    points: 500,
    image: require('./assets/product1.png'),
    category: '清洁用品',
    stock: 10,
    sales: 128,
  },
  {
    id: '2',
    name: '智能收纳盒',
    description: '可折叠收纳，节省空间',
    points: 300,
    image: require('./assets/product2.png'),
    category: '收纳工具',
    stock: 15,
    sales: 256,
  },
  {
    id: '3',
    name: '厨房调味料套装',
    description: '包含常用调味料，品质保证',
    points: 800,
    image: require('./assets/product3.png'),
    category: '厨房用品',
    stock: 5,
    sales: 89,
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

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsLabel}>我的积分</Text>
            <Text style={styles.pointsValue}>{userPoints}</Text>
          </View>
          <Button 
            mode="text" 
            onPress={goToExchangeHistory}
            style={styles.historyButton}
          >
            兑换记录
          </Button>
        </View>
        <Searchbar
          placeholder="搜索商品"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </Surface>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map(category => (
          <Chip
            key={category}
            selected={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
            style={styles.categoryChip}
          >
            {category}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView style={styles.productsContainer}>
        {filteredProducts.map(product => (
          <Surface key={product.id} style={styles.productCard}>
            <Image
              source={product.image}
              style={styles.productImage}
              resizeMode="cover"
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDescription} numberOfLines={2}>
                {product.description}
              </Text>
              <View style={styles.productMeta}>
                <Text style={styles.productPoints}>{product.points} 积分</Text>
                <Text style={styles.productStock}>库存: {product.stock}</Text>
                <Text style={styles.productSales}>已兑: {product.sales}</Text>
              </View>
              <Button
                mode="contained"
                onPress={() => handleExchange(product.id)}
                style={styles.exchangeButton}
                disabled={product.stock === 0 || userPoints < product.points}
              >
                {product.stock === 0 ? '已售罄' : 
                 userPoints < product.points ? '积分不足' : '立即兑换'}
              </Button>
            </View>
          </Surface>
        ))}
      </ScrollView>

      {/* 兑换确认弹窗 */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>确认兑换</Dialog.Title>
          <Dialog.Content>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>处理中...</Text>
              </View>
            ) : (
              <>
                {selectedProduct && (
                  <>
                    <Paragraph>您确定要兑换以下商品吗？</Paragraph>
                    <View style={styles.dialogProductInfo}>
                      <Text style={styles.dialogProductName}>{selectedProduct.name}</Text>
                      <Text style={styles.dialogProductPoints}>需要积分：{selectedProduct.points}</Text>
                    </View>
                    <Paragraph style={styles.dialogAddress}>
                      收货地址：{mockUserData.address}
                    </Paragraph>
                    <Paragraph style={styles.dialogPhone}>
                      联系电话：{mockUserData.phone}
                    </Paragraph>
                    <Paragraph style={styles.dialogBalance}>
                      兑换后积分余额：{userPoints - selectedProduct.points}
                    </Paragraph>
                  </>
                )}
              </>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)} disabled={loading}>取消</Button>
            <Button onPress={confirmExchange} disabled={loading}>确认兑换</Button>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    elevation: 4,
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
  pointsLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  historyButton: {
    marginLeft: 'auto',
  },
  searchBar: {
    elevation: 0,
  },
  categoriesContainer: {
    padding: 16,
    paddingTop: 0,
  },
  categoryChip: {
    marginRight: 8,
  },
  productsContainer: {
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  productImage: {
    width: 120,
    height: 120,
  },
  productInfo: {
    flex: 1,
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productPoints: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: 'bold',
    marginRight: 16,
  },
  productStock: {
    fontSize: 12,
    color: '#666',
    marginRight: 16,
  },
  productSales: {
    fontSize: 12,
    color: '#666',
  },
  exchangeButton: {
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
  },
  dialogProductInfo: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  dialogProductName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dialogProductPoints: {
    fontSize: 14,
    color: '#FF6B6B',
    marginTop: 5,
  },
  dialogAddress: {
    marginTop: 10,
  },
  dialogPhone: {
    marginTop: 5,
  },
  dialogBalance: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  successSnackbar: {
    backgroundColor: '#4CAF50',
  },
  errorSnackbar: {
    backgroundColor: '#F44336',
  },
});

export default Shopping; 
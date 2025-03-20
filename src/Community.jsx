import React, { useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Surface,
  Avatar,
  Button,
  IconButton,
  useTheme,
  Searchbar,
  Chip,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, setFilters, addPost, updatePost } from './store/slices/postsSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CommonImages } from './assets/images';

const categories = [
  '全部',
  '清洁技巧',
  '烹饪分享',
  '收纳整理',
  '时间管理',
  '经验分享',
];

const Community = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items: posts, status, error, filters } = useSelector(state => state.posts);
  const theme = useTheme();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  const onRefresh = useCallback(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleCreatePost = (newPost) => {
    dispatch(addPost(newPost));
  };

  const handlePostPress = (postId) => {
    navigation.navigate('PostDetail', {
      postId,
      onPostUpdate: (postId, updates) => {
        dispatch(updatePost({ id: postId, ...updates }));
      }
    });
  };

  const handleTagPress = (tag) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    dispatch(setFilters({ tags: newTags }));
  };

  const handleSearch = (query) => {
    dispatch(setFilters({ searchQuery: query }));
  };

  const handleCategoryChange = (category) => {
    dispatch(setFilters({ category }));
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = filters.category === '全部' || post.category === filters.category;
    const matchesTags = filters.tags.length === 0 || 
      filters.tags.every(tag => post.tags?.includes(tag));
    const matchesSearch = !filters.searchQuery || 
      post.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(filters.searchQuery.toLowerCase());
    
    return matchesCategory && matchesTags && matchesSearch;
  });

  if (status === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <Text>加载中...</Text>
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.errorContainer}>
        <Text>加载失败: {error}</Text>
        <Button onPress={onRefresh}>重试</Button>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={status === 'loading'} onRefresh={onRefresh} />
      }
    >
      <Surface style={styles.header}>
        <Searchbar
          placeholder="搜索家务经验"
          onChangeText={handleSearch}
          value={filters.searchQuery}
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
            selected={filters.category === category}
            onPress={() => handleCategoryChange(category)}
            style={styles.categoryChip}
          >
            {category}
          </Chip>
        ))}
      </ScrollView>

      {filters.tags.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.selectedTagsContainer}
        >
          {filters.tags.map(tag => (
            <Chip
              key={tag}
              selected
              onClose={() => handleTagPress(tag)}
              style={styles.selectedTag}
            >
              {tag}
            </Chip>
          ))}
        </ScrollView>
      )}

      <View style={styles.postsContainer}>
        {filteredPosts.map(post => (
          <Surface 
            key={post.id} 
            style={styles.postCard}
            onPress={() => handlePostPress(post.id)}
          >
            <View style={styles.postHeader}>
              <View style={styles.authorInfo}>
                <Avatar.Image
                  size={40}
                  source={post.author.avatar || CommonImages.avatar}
                />
                <View style={styles.authorText}>
                  <Text style={styles.authorName}>{post.author.name}</Text>
                  <Text style={styles.authorLevel}>{post.author.level}</Text>
                </View>
              </View>
              <Text style={styles.timestamp}>{post.timestamp}</Text>
            </View>

            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent} numberOfLines={3}>
              {post.content}
            </Text>

            {post.tags && post.tags.length > 0 && (
              <View style={styles.postTags}>
                {post.tags.map(tag => (
                  <Chip
                    key={tag}
                    onPress={() => handleTagPress(tag)}
                    style={styles.postTag}
                  >
                    {tag}
                  </Chip>
                ))}
              </View>
            )}

            <View style={styles.postFooter}>
              <View style={styles.actionButton}>
                <IconButton
                  icon="heart-outline"
                  size={20}
                  onPress={() => {}}
                />
                <Text>{post.likes}</Text>
              </View>
              <View style={styles.actionButton}>
                <IconButton
                  icon="comment-outline"
                  size={20}
                  onPress={() => {}}
                />
                <Text>{post.comments.length}</Text>
              </View>
              <View style={styles.actionButton}>
                <IconButton
                  icon="share-outline"
                  size={20}
                  onPress={() => {}}
                />
              </View>
            </View>
          </Surface>
        ))}
      </View>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('CreatePost', {
          onPostCreated: handleCreatePost
        })}
        style={styles.createPostButton}
      >
        发布经验
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    elevation: 4,
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
  selectedTagsContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  selectedTag: {
    marginRight: 8,
  },
  postsContainer: {
    padding: 16,
  },
  postCard: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorText: {
    marginLeft: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  authorLevel: {
    fontSize: 12,
    color: '#666',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  postTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 12,
  },
  postTag: {
    marginRight: 8,
    marginBottom: 8,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  createPostButton: {
    margin: 16,
    marginTop: 0,
  },
});

export default Community;

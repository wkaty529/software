#!/bin/bash

# 修复React Native Vector Icons显示问题的脚本

# 找到所有导入了react-native-vector-icons的文件
FILES=$(grep -l "import Icon from 'react-native-vector-icons/MaterialCommunityIcons'" src/*.jsx)

# 对每个文件进行修改
for file in $FILES; do
  echo "Processing file: $file"
  
  # 替换导入语句
  sed -i "s/import Icon from 'react-native-vector-icons\/MaterialCommunityIcons';/import CustomIcon from '.\/components\/CustomIcon';/g" "$file"
  
  # 替换组件用法 - 这部分需要根据实际代码模式调整
  # 简单的模式替换，可能需要根据代码中的实际使用方式进行调整
  sed -i "s/<Icon /<CustomIcon /g" "$file"
  sed -i "s/<Icon$/\<CustomIcon/g" "$file"
  
  echo "Completed fixing $file"
done

echo "All files have been processed!" 
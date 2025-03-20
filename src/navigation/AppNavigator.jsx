import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import CustomIcon from '../components/CustomIcon';

// 导入所有页面
import LogIn from '../Log_in';
import PrivateInformation from '../Private_information';
import AbilityChoice from '../Ability_choice';
import Home from '../Index';
import Achievement from '../Achievement';
import AIAssistant from '../AI_assistant';
import Community from '../Community';
import GroupChat from '../Group_chat';
import PersonCenter from '../Person_center';
import Ranking from '../Ranking';
import Shopping from '../shopping';
import Setting from '../Setting';
import TaskDetail from '../Task_detail';
import CreateTask from '../Create_task';
import PostDetail from '../Post_detail';
import CreatePost from '../Create_post';
import ExchangeHistory from '../ExchangeHistory';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: '首页',
          tabBarIcon: ({ color, size }) => (
            <CustomIcon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={Community}
        options={{
          title: '社区',
          tabBarIcon: ({ color, size }) => (
            <CustomIcon name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Shopping"
        component={Shopping}
        options={{
          title: '积分商城',
          tabBarIcon: ({ color, size }) => (
            <CustomIcon name="shopping" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PersonCenter"
        component={PersonCenter}
        options={{
          title: '我的',
          tabBarIcon: ({ color, size }) => (
            <CustomIcon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="LogIn"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="LogIn" 
          component={LogIn} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="PrivateInformation" 
          component={PrivateInformation}
          options={{ title: '个人信息' }}
        />
        <Stack.Screen 
          name="AbilityChoice" 
          component={AbilityChoice}
          options={{ title: '技能选择' }}
        />
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="GroupChat" 
          component={GroupChat}
          options={{ title: '群聊' }}
        />
        <Stack.Screen 
          name="Ranking" 
          component={Ranking}
          options={{ title: '积分排行' }}
        />
        <Stack.Screen 
          name="Setting" 
          component={Setting}
          options={{ title: '设置' }}
        />
        <Stack.Screen 
          name="TaskDetail" 
          component={TaskDetail}
          options={{ title: '任务详情' }}
        />
        <Stack.Screen 
          name="CreateTask" 
          component={CreateTask}
          options={{ title: '创建任务' }}
        />
        <Stack.Screen 
          name="PostDetail" 
          component={PostDetail}
          options={{
            title: '帖子详情',
            headerBackTitle: '返回',
          }}
        />
        <Stack.Screen 
          name="CreatePost" 
          component={CreatePost}
          options={{
            title: '发布帖子',
            headerBackTitle: '返回',
          }}
        />
        <Stack.Screen
          name="ExchangeHistory"
          component={ExchangeHistory}
          options={{
            title: '兑换记录',
            headerBackTitle: '返回',
          }}
        />
        <Stack.Screen
          name="Achievement"
          component={Achievement}
          options={{
            title: '我的成就',
            headerBackTitle: '返回',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 
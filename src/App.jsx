import React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { store } from './store';
import AppNavigator from './navigation/AppNavigator';
import VirtualAICompanionProvider from './components/VirtualAICompanionProvider';

// 定义应用的默认主题
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
  },
};

const App = () => {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <AppNavigator>
          <VirtualAICompanionProvider />
        </AppNavigator>
      </PaperProvider>
    </StoreProvider>
  );
};

export default App; 
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { store } from './store';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </StoreProvider>
  );
};

export default App; 
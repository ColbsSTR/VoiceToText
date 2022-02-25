import React from 'react';
import { NativeBaseProvider, Box } from "native-base";
import Home from './src/screens/Home';

const App = () => {
  return (
    <NativeBaseProvider>
      <Home />
    </NativeBaseProvider>
  );
};

export default App;

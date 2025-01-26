import React from 'react';
import { SafeAreaView } from 'react-native';
import ExampleComponent from './src/components/mainPage/mainPage';

const App: React.FC = (): JSX.Element => {
  return (
    <SafeAreaView>
      <ExampleComponent />
    </SafeAreaView>
  );
};

export default App;

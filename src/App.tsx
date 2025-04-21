import React from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import AppContent from './components/AppContent';

function App() {
  return (
    <AppProvider>
      <Layout>
        <AppContent />
      </Layout>
    </AppProvider>
  );
}

export default App;
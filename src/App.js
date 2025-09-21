import React, { useState, useEffect } from 'react';
import { isAuthenticated, logout, getCurrentUser } from './utils/auth';
import { loadStore } from './utils/storage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddWash from './components/AddWash';
import Expenses from './components/Expenses';
import History from './components/History';
import Settings from './components/Settings';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [store, setStore] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        setAuthenticated(true);
        setUser(getCurrentUser());
        setStore(loadStore());
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setAuthenticated(true);
    setUser(getCurrentUser());
    setStore(loadStore());
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUser(null);
    setStore(null);
  };

  const updateStore = (newStore) => {
    setStore(newStore);
  };

  const tabs = [
    { id: 'dashboard', label: 'Paneli Kryesor', icon: '📊' },
    { id: 'add-wash', label: 'Shto Larje', icon: '🚗' },
    { id: 'expenses', label: 'Shpenzimet', icon: '💰' },
    { id: 'history', label: 'Historiku', icon: '📋' },
    { id: 'settings', label: 'Cilësimet', icon: '⚙️' },
  ];

  if (!authenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard store={store} />;
      case 'add-wash':
        return <AddWash store={store} updateStore={updateStore} />;
      case 'expenses':
        return <Expenses store={store} updateStore={updateStore} />;
      case 'history':
        return <History store={store} updateStore={updateStore} />;
      case 'settings':
        return <Settings store={store} updateStore={updateStore} />;
      default:
        return <Dashboard store={store} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Menaxhuesi i Larjeve</h1>
              <span className="ml-4 text-sm text-gray-500">Mirë se vini, {user}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Dil
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
}

export default App;

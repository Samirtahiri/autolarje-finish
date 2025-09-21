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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Menaxhuesi i Larjeve</h1>
              <span className="mt-1 sm:mt-0 sm:ml-4 text-sm text-gray-500">Mirë se vini, {user}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto"
            >
              Dil
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap sm:flex-nowrap gap-1 sm:gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-1 sm:mr-2">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
}

export default App;

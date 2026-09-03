import React, { useState } from 'react';
import { navItems } from './src/data/pets';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PetDetailScreen from './src/screens/PetDetailScreen';
import ComingSoonScreen from './src/screens/ComingSoonScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  // 'home' | 'profile' | 'petDetail' | 'agenda' | 'activities' | 'location'
  const [view, setView] = useState('home');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPet, setSelectedPet] = useState(null);

  function handleLogin({ email }) {
    setUser({ name: 'María', email });
    setIsLoggedIn(true);
    setView('home');
    setActiveTab('home');
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setUser(null);
    setView('home');
    setActiveTab('home');
  }

  function handleSelectTab(tabId) {
    setActiveTab(tabId);
    setView(tabId === 'config' ? 'profile' : tabId);
  }

  function handleOpenPet(pet) {
    setSelectedPet(pet);
    setView('petDetail');
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (view === 'profile') {
    return (
      <ProfileScreen
        userName={user?.name}
        userEmail={user?.email}
        onBack={() => { setView('home'); setActiveTab('home'); }}
        onLogout={handleLogout}
      />
    );
  }

  if (view === 'petDetail') {
    return (
      <PetDetailScreen
        pet={selectedPet}
        onBack={() => setView('home')}
      />
    );
  }

  if (view === 'agenda' || view === 'activities' || view === 'location') {
    const tab = navItems.find((item) => item.id === view);
    return (
      <ComingSoonScreen
        label={tab.label}
        icon={tab.icon}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />
    );
  }

  return (
    <HomeScreen
      userName={user?.name}
      activeTab={activeTab}
      onSelectTab={handleSelectTab}
      onOpenProfile={() => { setView('profile'); }}
      onOpenPet={handleOpenPet}
      onAddPet={() => {}}
    />
  );
}

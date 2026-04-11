import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Home, 
  Users, 
  FileText, 
  CreditCard, 
  Shield, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  ShieldCheck,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  Zap
} from 'lucide-react';

// Import Views
import DashboardView from './views/DashboardView';
import ListingsView from './views/ListingsView';
import UsersView from './views/UsersView';
import PaymentsView from './views/PaymentsView';
import AgentsView from './views/AgentsView';
import SettingsView from './views/SettingsView';
import ReportsView from './views/ReportsView';
import SystemMetadataView from './views/SystemMetadataView';
import BoostView from './views/BoostView';
import LoginView from './views/LoginView';

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false);
    };

    const renderView = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardView onNavigate={setActiveTab} />;
            case 'listings':  return <ListingsView onNavigate={setActiveTab} />;
            case 'users':     return <UsersView onNavigate={setActiveTab} />;
            case 'payments':  return <PaymentsView onNavigate={setActiveTab} />;
            case 'agents':    return <AgentsView onNavigate={setActiveTab} />;
            case 'settings':  return <SettingsView onNavigate={setActiveTab} />;
            case 'reports':   return <ReportsView onNavigate={setActiveTab} />;
            case 'metadata':  return <SystemMetadataView />;
            case 'boost':     return <BoostView />;
            default:          return <DashboardView onNavigate={setActiveTab} />;
        }
    };

    if (!isLoggedIn) {
        return <LoginView onLogin={() => setIsLoggedIn(true)} />;
    }

    return (
        <div className="layout-container">
            {/* Sidebar overlay for mobile */}
            {isMobileMenuOpen && (
                <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="logo-section">
                    <div className="logo-box">
                        <Shield size={24} />
                    </div>
                    {!isSidebarCollapsed && (
                        <div className="logo-text-stack">
                            <h2>KIRA-NET</h2>
                            <span>RENTAL MANAGEMENT</span>
                        </div>
                    )}
                </div>

                <nav className="nav-menu">
                    <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleTabChange('dashboard')}>
                        <LayoutGrid size={20} />
                        <span>Dashboard</span>
                    </button>
                    <button className={`nav-link ${activeTab === 'listings' ? 'active' : ''}`} onClick={() => handleTabChange('listings')}>
                        <Home size={20} />
                        <span>Listings</span>
                    </button>
                    <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => handleTabChange('users')}>
                        <Users size={20} />
                        <span>Users</span>
                    </button>
                    <button className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => handleTabChange('reports')}>
                        <FileText size={20} />
                        <span>Reports</span>
                    </button>
                    <button className={`nav-link ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => handleTabChange('payments')}>
                        <CreditCard size={20} />
                        <span>Payments</span>
                    </button>
                    <button className={`nav-link ${activeTab === 'agents' ? 'active' : ''}`} onClick={() => handleTabChange('agents')}>
                        <ShieldCheck size={20} />
                        <span>Agents</span>
                    </button>
                    <button className={`nav-link ${activeTab === 'metadata' ? 'active' : ''}`} onClick={() => handleTabChange('metadata')}>
                        <Layers size={20} />
                        <span>Metadata</span>
                    </button>
                    <button className={`nav-link ${activeTab === 'boost' ? 'active' : ''}`} onClick={() => handleTabChange('boost')}>
                        <Zap size={20} />
                        <span>Boost Mgmt</span>
                    </button>
                    <button className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`} style={{ marginTop: 'auto' }} onClick={() => handleTabChange('settings')}>
                        <Settings size={20} />
                        <span>Settings</span>
                    </button>
                    <button className="nav-link" style={{ color: '#EF4444' }} onClick={() => setIsLoggedIn(false)}>
                        <LogOut size={20} />
                        {!isSidebarCollapsed && <span>Logout</span>}
                    </button>
                </nav>

                {!isSidebarCollapsed && (
                    <div className="profile-card">
                        <img 
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" 
                            alt="Profile" 
                            className="avatar" 
                        />
                        <div className="user-info">
                            <h4>Admin Portal</h4>
                            <p>Kira Management</p>
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className={`main-content ${isSidebarCollapsed ? 'expanded' : ''}`}>
                <header className="header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        
                        <button className="action-circle hide-mobile" onClick={toggleSidebar}>
                            {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        </button>
                    </div>
                    
                    <div className="search-field">
                        <Search size={18} color="#64748B" />
                        <input type="text" placeholder="Search Listings..." />
                    </div>
                    
                    <div className="header-actions">
                        <div className="action-circle hide-mobile">
                            <Bell size={20} />
                        </div>
                        <div className="user-profile-header">
                            <div className="user-text hide-mobile">
                                <span className="user-name">Alex Tadesse</span>
                                <span className="user-role">Super Admin</span>
                            </div>
                            <div className="avatar-circle">AT</div>
                        </div>
                    </div>
                </header>

                {renderView()}
            </main>
        </div>
    );
};

export default App;

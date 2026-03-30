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
  ShieldCheck
} from 'lucide-react';

// Import Views
import DashboardView from './views/DashboardView';
import ListingsView from './views/ListingsView';
import UsersView from './views/UsersView';
import PaymentsView from './views/PaymentsView';
import AgentsView from './views/AgentsView';
import SettingsView from './views/SettingsView';
import ReportsView from './views/ReportsView';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const renderView = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardView onNavigate={setActiveTab} />;
            case 'listings': return <ListingsView onNavigate={setActiveTab} />;
            case 'users': return <UsersView onNavigate={setActiveTab} />;
            case 'payments': return <PaymentsView onNavigate={setActiveTab} />;
            case 'agents': return <AgentsView onNavigate={setActiveTab} />;
            case 'settings': return <SettingsView onNavigate={setActiveTab} />;
            case 'reports': return <ReportsView onNavigate={setActiveTab} />;
            default: return <DashboardView onNavigate={setActiveTab} />;
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="logo-section">
                    <div className="logo-box">
                        <Shield size={24} />
                    </div>
                    <div className="logo-text-stack">
                        <h2>KIRA-NET</h2>
                        <span>RENTAL MANAGEMENT</span>
                    </div>
                </div>

                <nav className="nav-menu">
                    <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <LayoutGrid size={20} />
                        <span>Dashboard</span>
                    </button>
                    <button className={`nav-link ${activeTab === 'listings' ? 'active' : ''}`} onClick={() => setActiveTab('listings')}>
                        <Home size={20} />
                        <span>Listings</span>
                    </button>
                    <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                        <Users size={20} />
                        <span>Users</span>
                    </button>
                    <button className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
                        <FileText size={20} />
                        <span>Reports</span>
                    </button>
                    <button className={`nav-link ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>
                        <CreditCard size={20} />
                        <span>Payments</span>
                    </button>
                    <button className={`nav-link ${activeTab === 'agents' ? 'active' : ''}`} onClick={() => setActiveTab('agents')}>
                        <ShieldCheck size={20} />
                        <span>Agents</span>
                    </button>
                    <button className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`} style={{ marginTop: 'auto' }} onClick={() => setActiveTab('settings')}>
                        <Settings size={20} />
                        <span>Settings</span>
                    </button>
                    <button className="nav-link" style={{ color: '#EF4444' }}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </nav>

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
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="header">
                    <div className="search-field">
                        <Search size={18} color="#64748B" />
                        <input type="text" placeholder="Search Listings, Users, or Payments..." />
                    </div>
                    <div className="header-actions">
                        <div className="action-circle">
                            <Bell size={20} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '24px' }}>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '14px', fontWeight: 800, display: 'block' }}>Alex Tadesse</span>
                                <span style={{ fontSize: '10px', fontWeight: 900, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Super Admin</span>
                            </div>
                            <div style={{ width: '40px', height: '40px', background: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AT</div>
                        </div>
                    </div>
                </header>

                {renderView()}
            </main>
        </div>
    );
};

export default App;

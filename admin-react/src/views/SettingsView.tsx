import React, { useState } from 'react';
import { 
  ChevronRight,
  ChevronDown,
  Terminal,
  Save,
  MessageSquare,
  Zap,
  Bell
} from 'lucide-react';

interface SettingsProps {
  onNavigate: (tab: string) => void;
}

const SettingsView: React.FC<SettingsProps> = ({ onNavigate }) => {
  const [toggles, setToggles] = useState({ chat: true, lite: false, push: true });

  const toggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
            <div>
                <p style={{ fontWeight: 800, color: '#10B981', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>System Configuration</p>
                <h1 style={{ fontSize: '56px', fontWeight: 900, letterSpacing: '-3px', lineHeight: 1 }}>Kira Core.<br/><span style={{ opacity: 0.1 }}>Platform Parameters.</span></h1>
            </div>
            <button style={{ background: '#10B981', color: 'white', padding: '14px 40px', borderRadius: '14px', fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)' }}>
                <Save size={18}/> Commit Changes
            </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            {/* Column 1 */}
            <div>
                <div style={{ marginBottom: '48px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>App Languages</label>
                    <div style={{ display: 'flex', gap: '8px', background: 'white', padding: '4px', borderRadius: '12px', border: '1px solid #F1F5F9', width: 'fit-content' }}>
                        <button style={{ padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 800, color: '#64748B' }}>Amharic</button>
                        <button style={{ padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 800, color: '#64748B' }}>Afaan Oromoo</button>
                        <button style={{ padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 800, background: '#D1FAE5', color: '#10B981' }}>English</button>
                    </div>
                </div>

                <div style={{ marginBottom: '48px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>Pricing Governance</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #F1F5F9' }}>
                            <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '12px' }}>BOOST PRICE (ETB)</label>
                            <input type="text" value="250" style={{ fontSize: '24px', fontWeight: 900, border: 'none', background: 'transparent', outline: 'none', width: '100%' }}/>
                        </div>
                        <div style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #F1F5F9' }}>
                            <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '12px' }}>VERIFY FEE (ETB)</label>
                            <input type="text" value="500" style={{ fontSize: '24px', fontWeight: 900, border: 'none', background: 'transparent', outline: 'none', width: '100%' }}/>
                        </div>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>Feature Dynamics</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { id: 'chat', label: 'In-App Chat', sub: 'Direct owner messaging', icon: <MessageSquare size={18}/> },
                            { id: 'lite', label: 'Lite Mode', sub: 'Low bandwidth assets', icon: <Zap size={18}/> },
                            { id: 'push', label: 'Push Notifications', sub: 'Critical system alerts', icon: <Bell size={18}/> },
                        ].map((f, i) => (
                            <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ width: '44px', height: '44px', background: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>{f.icon}</div>
                                    <div>
                                        <h4 style={{ fontSize: '15px', fontWeight: 800 }}>{f.label}</h4>
                                        <p style={{ fontSize: '11px', fontWeight: 800, color: '#64748B' }}>{f.sub}</p>
                                    </div>
                                </div>
                                <div 
                                    onClick={() => toggle(f.id as any)}
                                    style={{ 
                                        width: '44px', 
                                        height: '24px', 
                                        borderRadius: '100px', 
                                        background: toggles[f.id as keyof typeof toggles] ? '#10B981' : '#E2E8F0',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        transition: '0.3s'
                                    }}>
                                    <div style={{ 
                                        width: '18px', 
                                        height: '18px', 
                                        borderRadius: '50%', 
                                        background: 'white', 
                                        position: 'absolute',
                                        top: '3px',
                                        left: toggles[f.id as keyof typeof toggles] ? '23px' : '3px',
                                        transition: '0.3s'
                                    }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Column 2 */}
            <div>
                <div style={{ marginBottom: '48px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px' }}>Location Sovereignty</label>
                        <button style={{ fontSize: '11px', fontWeight: 900, color: '#10B981', textTransform: 'uppercase' }}>+ ADD NEW</button>
                    </div>
                    <div style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #F1F5F9' }}>
                        <div style={{ borderLeft: '4px solid #10B981', paddingLeft: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 900 }}>Addis Ababa</h3>
                                <p style={{ fontSize: '11px', fontWeight: 800, color: '#64748B' }}>Capital City Cluster</p>
                            </div>
                            <ChevronRight size={18} color="#64748B"/>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
                                <label style={{ display: 'block', fontSize: '9px', fontWeight: 900, color: '#64748B', marginBottom: '4px' }}>SUB-CITY</label>
                                <p style={{ fontSize: '15px', fontWeight: 800 }}>Bole</p>
                            </div>
                            <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
                                <label style={{ display: 'block', fontSize: '9px', fontWeight: 900, color: '#64748B', marginBottom: '4px' }}>SUB-CITY</label>
                                <p style={{ fontSize: '15px', fontWeight: 800 }}>Yeka</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #F1F5F9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{ width: '44px', height: '44px', background: '#F5F3FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED' }}><Terminal size={20}/></div>
                                <span style={{ fontSize: '15px', fontWeight: 800 }}>Advanced System Logic</span>
                            </div>
                            <ChevronDown size={18} color="#64748B"/>
                        </div>
                        <div style={{ background: '#0F172A', padding: '24px', borderRadius: '12px', marginBottom: '24px', fontFamily: 'monospace', fontSize: '12px', color: '#4ADE80', lineHeight: 2 }}>
                            // CACHE_FLUSH_INTERVAL: 3600s<br/>
                            // API_LIMIT_PER_USER: 150/hr<br/>
                            // DEBUG_MODE: FALSE
                        </div>
                        <button style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #EF4444', color: '#EF4444', fontWeight: 800, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            Reset Database Index
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default SettingsView;

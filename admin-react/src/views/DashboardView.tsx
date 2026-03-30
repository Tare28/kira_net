import React from 'react';
import { 
  TrendingUp, 
  Home, 
  UserPlus, 
  ShieldCheck 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', revenue: 4200, users: 400 },
  { name: 'Tue', revenue: 3800, users: 380 },
  { name: 'Wed', revenue: 5600, users: 520 },
  { name: 'Thu', revenue: 4800, users: 460 },
  { name: 'Fri', revenue: 7200, users: 680 },
  { name: 'Sat', revenue: 8400, users: 800 },
  { name: 'Sun', revenue: 9800, users: 920 },
];

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

const DashboardView: React.FC<DashboardProps> = ({ onNavigate }) => {
    return (
        <section>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-2px', marginBottom: '8px' }}>Executive Dashboard.</h1>
                <p style={{ color: '#64748B', fontWeight: 500, fontSize: '16px' }}>Real-time overview of the Kira-Net ecosystem status.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card-white" onClick={() => onNavigate('payments')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon"><TrendingUp size={24} /></div>
                    <div className="stat-info">
                        <h5>TOTAL REVENUE</h5>
                        <h2>ETB 452,000</h2>
                        <p style={{ fontSize: '11px', color: '#10B981', fontWeight: 800, marginTop: '8px' }}>+12.4% from last month</p>
                    </div>
                </div>
                <div className="stat-card-white" onClick={() => onNavigate('listings')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon" style={{ color: '#8B5CF6' }}><Home size={24} /></div>
                    <div className="stat-info">
                        <h5>ACTIVE LISTINGS</h5>
                        <h2>1,284 Assets</h2>
                        <p style={{ fontSize: '11px', color: '#64748B', fontWeight: 800, marginTop: '8px' }}>42 Pending Review</p>
                    </div>
                </div>
                <div className="stat-card-white" onClick={() => onNavigate('users')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon" style={{ color: '#F59E0B' }}><UserPlus size={24} /></div>
                    <div className="stat-info">
                        <h5>NEW TENANTS</h5>
                        <h2>248 Today</h2>
                        <p style={{ fontSize: '11px', color: '#10B981', fontWeight: 800, marginTop: '8px' }}>+8.2% conversion rate</p>
                    </div>
                </div>
                <div className="stat-card-white" onClick={() => onNavigate('agents')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon" style={{ color: '#10B981' }}><ShieldCheck size={24} /></div>
                    <div className="stat-info">
                        <h5>AGENTS ON DUTY</h5>
                        <h2>12 Direct</h2>
                        <p style={{ fontSize: '11px', color: '#64748B', fontWeight: 800, marginTop: '8px' }}>99.2% Verification Rate</p>
                    </div>
                </div>
            </div>

            <div className="chart-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <div>
                        <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Revenue Dynamics</h3>
                        <p style={{ color: '#64748B', fontSize: '13px', fontWeight: 600 }}>Weekly transaction volume and projection.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, border: '1px solid #E2E8F0' }}>Export PDF</button>
                        <button style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, background: '#10B981', color: 'white' }}>Live View</button>
                    </div>
                </div>
                
                <div style={{ width: '100%', height: '350px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#64748B', fontSize: 12, fontWeight: 700 }} 
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#64748B', fontSize: 12, fontWeight: 700 }} 
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#10B981" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorRevenue)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
};

export default DashboardView;

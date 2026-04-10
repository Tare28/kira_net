import React from 'react';
import { 
  TrendingUp, 
  Home, 
  UserPlus, 
  ShieldCheck,
  Star,
  Flame
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

// ── Synced with data/properties.ts from the mobile app ──────────────────────
const LISTINGS = [
  { type: '1 Bed Room',  trust: 91, price: 25000,  status: 'VERIFIED', badge: 'verified' },
  { type: '2 Bed Room',  trust: 64, price: 45000,  status: 'PENDING',  badge: 'hot_deal' },
  { type: 'Studio',      trust: 97, price: 18500,  status: 'VERIFIED', badge: 'verified' },
  { type: 'Shop',        trust: 88, price: 85000,  status: 'VERIFIED', badge: 'verified' },
  { type: 'Cafe',        trust: 82, price: 35000,  status: 'PENDING',  badge: 'hot_deal' },
  { type: 'Restaurant',  trust: 95, price: 120000, status: 'VERIFIED', badge: 'verified' },
  { type: 'Other',       trust: 94, price: 12000,  status: 'VERIFIED', badge: 'verified' },
];

const totalListings    = LISTINGS.length;
const verifiedCount    = LISTINGS.filter(l => l.status === 'VERIFIED').length;
const pendingCount     = LISTINGS.filter(l => l.status === 'PENDING').length;
const avgTrust         = Math.round(LISTINGS.reduce((s, l) => s + l.trust, 0) / totalListings);
const totalRevenue     = LISTINGS.reduce((s, l) => s + l.price, 0).toLocaleString();

// Weekly revenue trend (representative weekly ETB flow)
const weeklyData = [
  { name: 'Mon', revenue: 18500 },
  { name: 'Tue', revenue: 35000 },
  { name: 'Wed', revenue: 45000 },
  { name: 'Thu', revenue: 25000 },
  { name: 'Fri', revenue: 85000 },
  { name: 'Sat', revenue: 120000 },
  { name: 'Sun', revenue: 12000 },
];

// Category distribution for bar chart
const categoryData = [
  { name: 'Studio',     count: LISTINGS.filter(l => l.type === 'Studio').length },
  { name: '1 Bed',      count: LISTINGS.filter(l => l.type === '1 Bed Room').length },
  { name: '2 Bed',      count: LISTINGS.filter(l => l.type === '2 Bed Room').length },
  { name: 'Shop',       count: LISTINGS.filter(l => l.type === 'Shop').length },
  { name: 'Cafe',       count: LISTINGS.filter(l => l.type === 'Cafe').length },
  { name: 'Restaurant', count: LISTINGS.filter(l => l.type === 'Restaurant').length },
  { name: 'Other',      count: LISTINGS.filter(l => l.type === 'Other').length },
];

const BAR_COLORS = ['#9CC942', '#82B136', '#FBC02D', '#2563EB', '#8B5CF6', '#F59E0B', '#64748B'];

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

const DashboardView: React.FC<DashboardProps> = ({ onNavigate }) => {
    return (
        <section>
            <div className="view-header">
                <div className="view-title">
                    <h1>Executive Dashboard.</h1>
                    <p>Live snapshot of the Kira-Net property ecosystem.</p>
                </div>
            </div>

            {/* ── Stat Cards ─────────────────────────────────────────────────── */}
            <div className="stats-grid">
                <div className="stat-card-white" onClick={() => onNavigate('listings')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon"><Home size={24} /></div>
                    <div className="stat-info">
                        <h5>TOTAL LISTINGS</h5>
                        <h2>{totalListings} Properties</h2>
                        <p style={{ fontSize: '11px', color: '#9CC942', fontWeight: 800, marginTop: '8px' }}>
                            {verifiedCount} verified · {pendingCount} pending
                        </p>
                    </div>
                </div>

                <div className="stat-card-white" onClick={() => onNavigate('payments')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon"><TrendingUp size={24} /></div>
                    <div className="stat-info">
                        <h5>LISTING VALUE</h5>
                        <h2>ETB {totalRevenue}</h2>
                        <p style={{ fontSize: '11px', color: '#9CC942', fontWeight: 800, marginTop: '8px' }}>Combined rent/mo across all types</p>
                    </div>
                </div>

                <div className="stat-card-white" onClick={() => onNavigate('users')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon" style={{ color: '#F59E0B' }}><UserPlus size={24} /></div>
                    <div className="stat-info">
                        <h5>AVG. TRUST SCORE</h5>
                        <h2>{avgTrust}%</h2>
                        <p style={{ fontSize: '11px', color: avgTrust >= 85 ? '#9CC942' : '#F59E0B', fontWeight: 800, marginTop: '8px' }}>
                            {avgTrust >= 85 ? 'Excellent platform health' : 'Good — improve pending listings'}
                        </p>
                    </div>
                </div>

                <div className="stat-card-white" onClick={() => onNavigate('agents')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon" style={{ color: '#9CC942' }}><ShieldCheck size={24} /></div>
                    <div className="stat-info">
                        <h5>AGENTS ON DUTY</h5>
                        <h2>3 Active</h2>
                        <p style={{ fontSize: '11px', color: '#64748B', fontWeight: 800, marginTop: '8px' }}>Desta M. · Sara H. · Abebe B.</p>
                    </div>
                </div>
            </div>

            {/* ── Charts Row ─────────────────────────────────────────────────── */}
            <div className="grid-2" style={{ marginTop: '40px' }}>
                {/* Left: Area Chart — Price Distribution Trend */}
                <div className="chart-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Weekly Rent Distribution</h3>
                            <p style={{ color: '#64748B', fontSize: '13px', fontWeight: 600 }}>ETB rent/mo per listing by day listed.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, border: '1px solid #E2E8F0' }}>Export PDF</button>
                            <button style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, background: '#9CC942', color: 'white' }}>Live View</button>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '280px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#9CC942" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#9CC942" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 700 }} dy={10}/>
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`}/>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }} formatter={(v: any) => [`ETB ${Number(v).toLocaleString()}`, 'Rent/mo']}/>
                                <Area type="monotone" dataKey="revenue" stroke="#9CC942" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: Bar Chart — Listings per Category */}
                <div className="chart-container">
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Listings by Category</h3>
                        <p style={{ color: '#64748B', fontSize: '13px', fontWeight: 600 }}>Distribution across all {totalListings} property types.</p>
                    </div>
                    <div style={{ width: '100%', height: '280px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }} dy={10}/>
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }} allowDecimals={false}/>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }} formatter={(v: any) => [v, 'Listings']}/>
                                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ── Trust Snapshot ─────────────────────────────────────────────── */}
            <div className="chart-container" style={{ marginTop: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#F4F9EB', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CC942' }}>
                        <Star size={20} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Trust Score Snapshot</h3>
                        <p style={{ color: '#64748B', fontSize: '13px', fontWeight: 600 }}>Per-listing trust health — same scores shown to tenants in the app.</p>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                    {LISTINGS.map((l, i) => {
                        const tc = l.trust >= 85 ? { color: '#9CC942', bg: '#F4F9EB' } : l.trust >= 60 ? { color: '#F59E0B', bg: '#FEF3C7' } : { color: '#EF4444', bg: '#FEE2E2' };
                        return (
                            <div key={i} style={{ background: '#F8FAFC', padding: '20px', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>{l.type}</span>
                                    {l.badge === 'hot_deal' && (
                                        <Flame size={14} color="#EF4444" />
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ flex: 1, height: '6px', background: '#E2E8F0', borderRadius: '100px', overflow: 'hidden' }}>
                                        <div style={{ width: `${l.trust}%`, height: '100%', background: tc.color, borderRadius: '100px', transition: '0.6s' }} />
                                    </div>
                                    <span style={{ fontSize: '12px', fontWeight: 900, color: tc.color, background: tc.bg, padding: '3px 10px', borderRadius: '100px', flexShrink: 0 }}>{l.trust}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default DashboardView;

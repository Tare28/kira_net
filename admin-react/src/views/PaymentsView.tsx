import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  AlertCircle,
  BarChart3,
  Calendar,
  Search,
  CheckCircle,
  XCircle
} from 'lucide-react';

const INITIAL_TRANSACTIONS = [
  { id: '#TRX-1045', user: 'Abebe Kebede', role: 'LANDLORD', type: 'PREMIUM', amount: '1,200.00', method: 'Telebirr', status: 'SUCCESS', date: 'Oct 24, 2026' },
  { id: '#TRX-1044', user: 'Selam Tesfaye', role: 'TENANT', type: 'VERIFICATION', amount: '150.00', method: 'CBE Birr', status: 'PENDING', date: 'Oct 24, 2026' },
  { id: '#TRX-1043', user: 'Dawit Haile', role: 'LANDLORD', type: 'BOOST', amount: '450.00', method: 'Chapa', status: 'FAILED', date: 'Oct 23, 2026' },
];

interface PaymentsProps {
  onNavigate: (tab: string) => void;
}

const PaymentsView: React.FC<PaymentsProps> = () => {
  const [data, setData] = useState(INITIAL_TRANSACTIONS);
  const [search, setSearch] = useState('');

  const filtered = data.filter(t => 
    t.user.toLowerCase().includes(search.toLowerCase()) || 
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  const verifyPayment = (id: string, success: boolean) => {
    setData(prev => prev.map(t => t.id === id ? { ...t, status: success ? 'SUCCESS' : 'FAILED' } : t));
  };

  return (
    <section>
        <div className="view-header">
            <div className="view-title">
                <p style={{ fontWeight: 800, color: '#9CC942', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Fiscal Ledger</p>
                <h1>Revenue Center.<br/><span style={{ opacity: 0.1 }}>Platform Economics.</span></h1>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ background: 'white', border: '1px solid #F1F5F9', padding: '10px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px', width: '260px' }}>
                    <Search size={16} color="#64748B"/>
                    <input 
                      type="text" 
                      placeholder="Find transaction..." 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '13px' }}
                    />
                </div>
                <div style={{ background: 'white', padding: '12px 24px', borderRadius: '16px', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <Calendar size={18} color="#64748B"/>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#64748B' }}>Oct 01 - Oct 31, 2026</span>
                </div>
            </div>
        </div>

        <div className="stats-grid">
            <div className="stat-card-white">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="stat-icon"><BarChart3 size={24}/></div>
                    <span style={{ fontSize: '11px', fontWeight: 900, color: '#9CC942', background: '#F4F9EB', padding: '4px 10px', borderRadius: '100px', height: 'fit-content' }}>+12%</span>
                </div>
                <div className="stat-info">
                    <h5>TOTAL REVENUE</h5>
                    <h2>ETB {filtered.reduce((s, t) => t.status === 'SUCCESS' ? s + parseFloat(t.amount.replace(',','')) : s, 0).toLocaleString()}</h2>
                </div>
            </div>
            <div className="stat-card-white">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="stat-icon" style={{ color: '#3B82F6' }}><Clock size={24}/></div>
                </div>
                <div className="stat-info">
                    <h5>PENDING RECON</h5>
                    <h2>ETB {filtered.filter(t => t.status === 'PENDING').length * 150}</h2>
                    <p style={{ fontSize: '11px', color: '#64748B', fontWeight: 800, marginTop: '8px' }}>Manual verification needed</p>
                </div>
            </div>
            <div className="stat-card-white">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="stat-icon" style={{ color: '#EF4444' }}><AlertCircle size={24}/></div>
                </div>
                <div className="stat-info">
                    <h5>FAILED VOID</h5>
                    <h2>{filtered.filter(t => t.status === 'FAILED').length} Critical</h2>
                    <p style={{ fontSize: '11px', color: '#EF4444', fontWeight: 800, marginTop: '8px' }}>User retry required</p>
                </div>
            </div>
        </div>

        <div className="table-scroll-container">
            <table>
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Member Access</th>
                        <th>Type Group</th>
                        <th>Nominal Amount</th>
                        <th>Payment Mode</th>
                        <th>Verification State</th>
                        <th>Manual Audit</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((trx, idx) => (
                        <tr key={idx}>
                            <td style={{ fontWeight: 800, color: '#9CC942', fontSize: '13px' }}>{trx.id}</td>
                            <td>
                                <strong style={{ display: 'block', fontSize: '14px', marginBottom: '2px' }}>{trx.user}</strong>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>{trx.role}</span>
                            </td>
                            <td>
                                <span style={{ 
                                    padding: '6px 14px', 
                                    borderRadius: '8px', 
                                    fontSize: '10px', 
                                    fontWeight: 900,
                                    background: '#F8FAFC',
                                    color: '#475569',
                                    border: '1px solid #F1F5F9'
                                }}>{trx.type}</span>
                            </td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <strong style={{ fontSize: '15px', color: '#0F172A' }}>ETB {trx.amount}</strong>
                                    {trx.status === 'SUCCESS' ? <ArrowUpRight size={14} color="#9CC942"/> : <ArrowDownRight size={14} color={trx.status === 'FAILED' ? '#EF4444' : '#F59E0B'}/>}
                                </div>
                            </td>
                            <td style={{ fontSize: '13px', fontWeight: 800, color: '#64748B' }}>{trx.method}</td>
                            <td>
                                <span style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px', 
                                    fontSize: '11px', 
                                    fontWeight: 900,
                                    color: trx.status === 'SUCCESS' ? '#9CC942' : trx.status === 'FAILED' ? '#EF4444' : '#F59E0B'
                                }}>
                                    <div style={{ width: '8px', height: '8px', background: trx.status === 'SUCCESS' ? '#9CC942' : trx.status === 'FAILED' ? '#EF4444' : '#F59E0B', borderRadius: '50%' }}></div>
                                    {trx.status}
                                </span>
                            </td>
                            <td>
                                {trx.status === 'PENDING' ? (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button 
                                          title="Verify Success"
                                          onClick={() => verifyPayment(trx.id, true)}
                                          style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #9CC942', color: '#9CC942', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                          <CheckCircle size={14}/>
                                        </button>
                                        <button 
                                          title="Verify Fail"
                                          onClick={() => verifyPayment(trx.id, false)}
                                          style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #EF4444', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                          <XCircle size={14}/>
                                        </button>
                                    </div>
                                ) : (
                                    <span style={{ fontSize: '11px', color: '#CBD5E1', fontWeight: 700 }}>AUDITED</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </section>
  );
};

export default PaymentsView;

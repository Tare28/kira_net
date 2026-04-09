import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  AlertCircle,
  BarChart3,
  Calendar
} from 'lucide-react';

const transactions = [
  { id: '#TRX-1045', user: 'Abebe Kebede', role: 'LANDLORD', type: 'PREMIUM', amount: '1,200.00', method: 'Telebirr', status: 'SUCCESS', date: 'Oct 24, 2026' },
  { id: '#TRX-1044', user: 'Selam Tesfaye', role: 'TENANT', type: 'VERIFICATION', amount: '150.00', method: 'CBE Birr', status: 'PENDING', date: 'Oct 24, 2026' },
  { id: '#TRX-1043', user: 'Dawit Haile', role: 'LANDLORD', type: 'BOOST', amount: '450.00', method: 'Chapa', status: 'FAILED', date: 'Oct 23, 2026' },
];

interface PaymentsProps {
  onNavigate: (tab: string) => void;
}

const PaymentsView: React.FC<PaymentsProps> = () => {
  return (
    <section>
        <div className="view-header">
            <div className="view-title">
                <p style={{ fontWeight: 800, color: '#10B981', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Fiscal Ledger</p>
                <h1>Revenue Center.<br/><span style={{ opacity: 0.1 }}>Platform Economics.</span></h1>
            </div>
            <div style={{ background: 'white', padding: '12px 24px', borderRadius: '16px', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <Calendar size={18} color="#64748B"/>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#64748B' }}>Oct 01 - Oct 31, 2026</span>
            </div>
        </div>

        <div className="stats-grid">
            <div className="stat-card-white">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="stat-icon"><BarChart3 size={24}/></div>
                    <span style={{ fontSize: '11px', fontWeight: 900, color: '#10B981', background: '#D1FAE5', padding: '4px 10px', borderRadius: '100px', height: 'fit-content' }}>+12%</span>
                </div>
                <div className="stat-info">
                    <h5>TOTAL REVENUE</h5>
                    <h2>ETB 45,000 Today</h2>
                </div>
            </div>
            <div className="stat-card-white">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="stat-icon" style={{ color: '#3B82F6' }}><Clock size={24}/></div>
                </div>
                <div className="stat-info">
                    <h5>PENDING DISPUTE</h5>
                    <h2>ETB 12,000</h2>
                    <p style={{ fontSize: '11px', color: '#64748B', fontWeight: 800, marginTop: '8px' }}>42 active transactions</p>
                </div>
            </div>
            <div className="stat-card-white">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="stat-icon" style={{ color: '#EF4444' }}><AlertCircle size={24}/></div>
                </div>
                <div className="stat-info">
                    <h5>FAILED VOID</h5>
                    <h2>ETB 3,500</h2>
                    <p style={{ fontSize: '11px', color: '#EF4444', fontWeight: 800, marginTop: '8px' }}>Critical verification fail</p>
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
                        <th>Timeframe</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((trx, idx) => (
                        <tr key={idx}>
                            <td style={{ fontWeight: 800, color: '#10B981', fontSize: '13px' }}>{trx.id}</td>
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
                                    {trx.status === 'SUCCESS' ? <ArrowUpRight size={14} color="#10B981"/> : <ArrowDownRight size={14} color={trx.status === 'FAILED' ? '#EF4444' : '#F59E0B'}/>}
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
                                    color: trx.status === 'SUCCESS' ? '#10B981' : trx.status === 'FAILED' ? '#EF4444' : '#F59E0B'
                                }}>
                                    <div style={{ width: '8px', height: '8px', background: trx.status === 'SUCCESS' ? '#10B981' : trx.status === 'FAILED' ? '#EF4444' : '#F59E0B', borderRadius: '50%' }}></div>
                                    {trx.status}
                                </span>
                            </td>
                            <td style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>{trx.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </section>
  );
};

export default PaymentsView;

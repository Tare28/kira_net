import React from 'react';
import { 
  Search, 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle,
  Droplets,
  Zap,
  Globe
} from 'lucide-react';

const listings = [
  { id: '#KN-1024', name: '2BR Modern Apt', type: 'High-Rise Residential', location: 'Bole, Addis Ababa', sub: 'Near Edna Mall', price: '15,000', deposit: '30,000', status: 'PENDING', agent: 'Desta M.', initial: 'DM' },
  { id: '#KN-0988', name: 'Luxury Villa', type: 'G+2 Standalone', location: 'Yeka, Addis Ababa', sub: 'Lamberet District', price: '85,000', deposit: '170,000', status: 'VERIFIED', agent: 'Abebe B.', initial: 'AB' },
  { id: '#KN-0812', name: 'Studio Loft', type: 'Condominium', location: 'Arada, Addis Ababa', sub: 'Piazza Area', price: '7,500', deposit: '15,000', status: 'REJECTED', agent: 'Sara H.', initial: 'SH' },
];

interface ListingsProps {
  onNavigate: (tab: string) => void;
}

const ListingsView: React.FC<ListingsProps> = ({ onNavigate }) => {
  return (
    <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
            <div>
                <p style={{ fontWeight: 800, color: '#10B981', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Marketplace Inventory</p>
                <h1 style={{ fontSize: '56px', fontWeight: 900, letterSpacing: '-3px', lineHeight: 1 }}>Verified Quality.<br/><span style={{ opacity: 0.1 }}>Asset Governance.</span></h1>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ background: 'white', padding: '24px 32px', borderRadius: '20px', border: '1px solid #F1F5F9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>TOTAL ACTIVE</span>
                    <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#10B981' }}>1,284</h2>
                </div>
                <div style={{ background: 'white', padding: '24px 32px', borderRadius: '20px', border: '1px solid #F1F5F9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>PENDING REVIEW</span>
                    <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#8B5CF6' }}>42</h2>
                </div>
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', background: 'white', padding: '4px', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                <button style={{ padding: '10px 24px', borderRadius: '9px', fontSize: '13px', fontWeight: 800, background: '#10B981', color: 'white' }}>All</button>
                <button style={{ padding: '10px 24px', borderRadius: '9px', fontSize: '13px', fontWeight: 800, color: '#64748B' }}>Pending</button>
                <button style={{ padding: '10px 24px', borderRadius: '9px', fontSize: '13px', fontWeight: 800, color: '#64748B' }}>Verified</button>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', fontSize: '13px', fontWeight: 800 }}>
                    <CheckCircle2 size={16}/> Approve All
                </button>
                <button style={{ border: '1px solid #F1F5F9', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', fontSize: '13px', fontWeight: 800 }}>
                    <XCircle size={16}/> Reject All
                </button>
            </div>
        </div>

        <div className="table-scroll-container">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                        <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>ID</th>
                        <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Property</th>
                        <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Location</th>
                        <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Price</th>
                        <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Utilities</th>
                        <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Status</th>
                        <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Agent</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {listings.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '24px', fontWeight: 800, color: '#10B981', fontSize: '13px' }}>{item.id}</td>
                            <td style={{ padding: '24px' }}>
                                <strong style={{ display: 'block', fontSize: '14px', marginBottom: '2px' }}>{item.name}</strong>
                                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{item.type}</span>
                            </td>
                            <td style={{ padding: '24px' }}>
                                <strong style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>{item.location}</strong>
                                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{item.sub}</span>
                            </td>
                            <td style={{ padding: '24px' }}>
                                <strong style={{ display: 'block', fontSize: '15px', color: '#0F172A' }}>ETB {item.price}</strong>
                                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Deposit: {item.deposit}</span>
                            </td>
                            <td style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', gap: '12px', color: '#10B981' }}>
                                    <Droplets size={14}/>
                                    <Zap size={14}/>
                                    <Globe size={14}/>
                                </div>
                            </td>
                            <td style={{ padding: '24px' }}>
                                <span style={{ 
                                    padding: '6px 16px', 
                                    borderRadius: '100px', 
                                    fontSize: '10px', 
                                    fontWeight: 900,
                                    background: item.status === 'VERIFIED' ? '#D1FAE5' : item.status === 'REJECTED' ? '#FEE2E2' : '#FEF3C7',
                                    color: item.status === 'VERIFIED' ? '#10B981' : item.status === 'REJECTED' ? '#EF4444' : '#F59E0B'
                                }}>{item.status}</span>
                            </td>
                            <td style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F8FAFC', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, color: '#64748B' }}>{item.initial}</div>
                                    <span style={{ fontSize: '13px', fontWeight: 700 }}>{item.agent}</span>
                                </div>
                            </td>
                            <td style={{ padding: '24px' }}><button><MoreHorizontal size={20} color="#64748B"/></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </section>
  );
};

export default ListingsView;

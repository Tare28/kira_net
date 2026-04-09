import { useState } from 'react';
import { 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle,
  Droplets,
  Zap,
  Globe,
  Camera,
  X,
  ShieldCheck
} from 'lucide-react';

const listings = [
  { id: '#KN-001', name: 'The Summit Residency', type: 'High-Rise Apartment', location: 'Bole, Addis Ababa', sub: 'Near Edna Mall', price: '25,000', deposit: '50,000', status: 'VERIFIED', agent: 'Desta M.', initial: 'DM', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=700&auto=format&fit=crop' },
  { id: '#KN-002', name: 'Modern Garden Villa', type: 'G+2 Villa', location: 'Old Airport, Addis Ababa', sub: 'Bisrate Gabriel', price: '45,000', deposit: '90,000', status: 'PENDING', agent: 'Abebe B.', initial: 'AB', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=700&auto=format&fit=crop' },
  { id: '#KN-003', name: 'Kazanchis Studio', type: 'Condominium Studio', location: 'Kazanchis, Addis Ababa', sub: 'Near UN Hub', price: '18,500', deposit: '37,000', status: 'VERIFIED', agent: 'Sara H.', initial: 'SH', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=700&auto=format&fit=crop' },
];


export default function ListingsView() {
  const [reviewItem, setReviewItem] = useState<any>(null);
  const [data, setData] = useState(listings);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setData(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    setReviewItem(null);
  };
  return (
    <section>
        <div className="view-header">
            <div className="view-title">
                <p style={{ fontWeight: 800, color: '#10B981', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Marketplace Inventory</p>
                <h1>Verified Quality.<br/><span style={{ opacity: 0.1 }}>Asset Governance.</span></h1>
            </div>
            <div className="summary-cards hide-mobile" style={{ display: 'flex', gap: '20px' }}>
                <div style={{ background: 'white', padding: '24px 32px', borderRadius: '20px', border: '1px solid #F1F5F9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>TOTAL ACTIVE</span>
                    <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#10B981', margin: 0 }}>1,284</h2>
                </div>
                <div style={{ background: 'white', padding: '24px 32px', borderRadius: '20px', border: '1px solid #F1F5F9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>PENDING REVIEW</span>
                    <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#8B5CF6', margin: 0 }}>42</h2>
                </div>
            </div>
        </div>

        <div className="listings-actions" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div className="filter-tabs" style={{ display: 'flex', gap: '8px', background: 'white', padding: '4px', borderRadius: '12px', border: '1px solid #F1F5F9', overflowX: 'auto' }}>
                <button style={{ padding: '10px 24px', borderRadius: '9px', fontSize: '13px', fontWeight: 800, background: '#10B981', color: 'white', whiteSpace: 'nowrap' }}>All</button>
                <button style={{ padding: '10px 24px', borderRadius: '9px', fontSize: '13px', fontWeight: 800, color: '#64748B', whiteSpace: 'nowrap' }}>Pending</button>
                <button style={{ padding: '10px 24px', borderRadius: '9px', fontSize: '13px', fontWeight: 800, color: '#64748B', whiteSpace: 'nowrap' }}>Verified</button>
            </div>
            <div className="bulk-actions" style={{ display: 'flex', gap: '12px' }}>
                <button style={{ background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', fontSize: '13px', fontWeight: 800 }}>
                    <CheckCircle2 size={16}/> Approve All
                </button>
                <button className="hide-mobile" style={{ border: '1px solid #F1F5F9', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', fontSize: '13px', fontWeight: 800 }}>
                    <XCircle size={16}/> Reject All
                </button>
            </div>
        </div>

        <div className="table-scroll-container">
            <table style={{ minWidth: '1000px' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Property</th>
                        <th>Location</th>
                        <th>Price</th>
                        <th>Utilities</th>
                        <th>Status</th>
                        <th>Agent</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, idx) => (
                        <tr key={idx}>
                            <td style={{ fontWeight: 800, color: '#10B981', fontSize: '13px' }}>{item.id}</td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <img src={item.image} alt="" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #F1F5F9' }} />
                                    <div>
                                        <strong style={{ display: 'block', fontSize: '14px', marginBottom: '2px' }}>{item.name}</strong>
                                        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{item.type}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <strong style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>{item.location}</strong>
                                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{item.sub}</span>
                            </td>
                            <td>
                                <strong style={{ display: 'block', fontSize: '15px', color: '#0F172A' }}>ETB {item.price}</strong>
                                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Deposit: {item.deposit}</span>
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '12px', color: '#10B981' }}>
                                    <Droplets size={14}/>
                                    <Zap size={14}/>
                                    <Globe size={14}/>
                                </div>
                            </td>
                            <td>
                                <span style={{ 
                                    padding: '6px 16px', 
                                    borderRadius: '100px', 
                                    fontSize: '10px', 
                                    fontWeight: 900,
                                    background: item.status === 'VERIFIED' ? '#D1FAE5' : item.status === 'REJECTED' ? '#FEE2E2' : '#FEF3C7',
                                    color: item.status === 'VERIFIED' ? '#10B981' : item.status === 'REJECTED' ? '#EF4444' : '#F59E0B'
                                }}>{item.status}</span>
                            </td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F8FAFC', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, color: '#64748B' }}>{item.initial}</div>
                                    <span style={{ fontSize: '13px', fontWeight: 700 }}>{item.agent}</span>
                                </div>
                            </td>
                             <td>
                                {item.status === 'PENDING' ? (
                                    <button 
                                        onClick={() => setReviewItem(item)}
                                        style={{ background: '#10B981', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}
                                    >
                                        Review
                                    </button>
                                ) : (
                                    <button><MoreHorizontal size={20} color="#64748B"/></button>
                                )}
                             </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Verification Review Modal */}
        {reviewItem && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div style={{ background: 'white', width: '1000px', maxWidth: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                    {/* Modal Header */}
                    <div style={{ padding: '24px 32px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: 900 }}>Property Field Report</h2>
                            <p style={{ color: '#64748B', fontSize: '12px', fontWeight: 600 }}>Reviewing physical inspection data for {reviewItem.id}</p>
                        </div>
                        <button onClick={() => setReviewItem(null)} style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20}/></button>
                    </div>

                    <div className="modal-body-scroll" style={{ display: 'flex', flexDirection: 'row', flex: 1, overflowY: 'auto', flexWrap: 'wrap' }}>
                        {/* Photos Section */}
                        <div style={{ flex: '1.2', minWidth: '350px', background: '#F8FAFC', padding: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <h4 style={{ fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}><Camera size={16}/> Certified Media</h4>
                                <span style={{ color: '#10B981', fontSize: '11px', fontWeight: 800 }}>8 Photos Taken Today</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                                <img src={reviewItem.image} alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: '12px' }} />
                                <img src="https://images.unsplash.com/photo-1560448204-61dc36dc98c8?q=80&w=400" alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: '12px' }} />
                                <img src="https://images.unsplash.com/photo-1564013799911-0e86b2081822?q=80&w=400" alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: '12px' }} />
                                <img src="https://images.unsplash.com/photo-1628592102751-ba83b0314276?q=80&w=400" alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: '12px' }} />
                            </div>
                        </div>

                        {/* Checklist Section */}
                        <div style={{ flex: 1, minWidth: '350px', padding: '32px', borderLeft: '1px solid #F1F5F9' }}>
                            <div style={{ marginBottom: '32px' }}>
                                <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '20px' }}>Addis Essentials Verified</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {[
                                        { label: 'Constant Water Supply', icon: <Droplets size={16}/>, state: 'YES' },
                                        { label: 'Private Electric Meter', icon: <Zap size={16}/>, state: 'YES' },
                                        { label: 'Road Access Quality', icon: <Globe size={16}/>, state: 'ASPHALT' },
                                        { label: 'ID Verification (Landlord)', icon: <ShieldCheck size={16}/>, state: 'MATCH' },
                                    ].map((item, id) => (
                                        <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#F0FDF4', borderRadius: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ color: '#10B981' }}>{item.icon}</div>
                                                <span style={{ fontSize: '13px', fontWeight: 700 }}>{item.label}</span>
                                            </div>
                                            <span style={{ fontSize: '10px', fontWeight: 900, color: '#10B981' }}>{item.state}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '16px', marginBottom: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 800 }}>DS</div>
                                    <div>
                                        <p style={{ fontSize: '12px', fontWeight: 800 }}>{reviewItem.agent}</p>
                                        <p style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Field Agent Feedback</p>
                                    </div>
                                </div>
                                <p style={{ fontSize: '12px', color: '#475569', lineHeight: '18px', fontWeight: 500 }}>
                                    "Property is in excellent condition. Neighborhood is quiet as advertised. Road access is perfect."
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', position: 'sticky', bottom: 0, background: 'white', padding: '10px 0' }}>
                                <button 
                                    onClick={() => handleUpdateStatus(reviewItem.id, 'VERIFIED')}
                                    style={{ flex: 1, background: '#10B981', color: 'white', padding: '16px', borderRadius: '14px', fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    <ShieldCheck size={18}/> Approve & Certify
                                </button>
                                <button 
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to reject this property? This will notify the landlord.')) {
                                            handleUpdateStatus(reviewItem.id, 'REJECTED');
                                        }
                                    }}
                                    style={{ border: '1px solid #FEE2E2', color: '#EF4444', padding: '16px', borderRadius: '14px', fontSize: '13px', fontWeight: 800 }}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </section>
  );
}

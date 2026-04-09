import React from 'react';
import { 
  User, 
  CheckCircle2, 
  Edit3, 
  Slash,
  Star,
  ShieldPlus,
  ArrowRight
} from 'lucide-react';

const agents = [
  { id: '#AG-1024', name: 'Elias Tesfaye', phone: '+251 911 234 567', commission: '5.0%', listings: 28, rating: 4.9, reviews: 142, status: 'VERIFIED' },
  { id: '#AG-2105', name: 'Selamawit D.', phone: '+251 944 882 110', commission: '4.5%', listings: 3, rating: 0.0, reviews: 0, status: 'PENDING' },
  { id: '#AG-8892', name: 'Yonas Kebede', phone: '+251 900 112 233', lastActive: 'Oct 12, 2023', listings: 12, status: 'SUSPENDED' },
];

interface AgentsProps {
  onNavigate: (tab: string) => void;
}

const AgentsView: React.FC<AgentsProps> = () => {
  return (
    <section>
        <div className="view-header">
            <div className="view-title">
                <p style={{ fontWeight: 800, color: '#10B981', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Curator Oversight</p>
                <h1>Agent Network.<br/><span style={{ opacity: 0.1 }}>Elite Facilitation.</span></h1>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {agents.map((agent, idx) => (
                <div key={idx} style={{ 
                    background: 'white', 
                    borderRadius: '24px', 
                    border: '1px solid #F1F5F9', 
                    padding: '32px', 
                    boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: agent.status === 'VERIFIED' ? '#10B981' : agent.status === 'PENDING' ? '#8B5CF6' : '#EF4444' }}></div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{ width: '56px', height: '56px', background: '#F8FAFC', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #F1F5F9' }}>
                                <User size={24} color={agent.status === 'VERIFIED' ? '#10B981' : agent.status === 'PENDING' ? '#8B5CF6' : '#EF4444'}/>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{agent.name}</h3>
                                <span style={{ fontSize: '11px', fontWeight: 900, color: '#64748B', letterSpacing: '0.5px' }}>{agent.id}</span>
                            </div>
                        </div>
                        <span style={{ 
                            padding: '6px 14px', 
                            borderRadius: '100px', 
                            fontSize: '9px', 
                            fontWeight: 900,
                            letterSpacing: '1px',
                            background: agent.status === 'VERIFIED' ? '#D1FAE5' : agent.status === 'PENDING' ? '#F5F3FF' : '#FEE2E2',
                            color: agent.status === 'VERIFIED' ? '#10B981' : agent.status === 'PENDING' ? '#8B5CF6' : '#EF4444'
                        }}>{agent.status}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '9px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>CONTACT</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <p style={{ fontSize: '13px', fontWeight: 800 }}>{agent.phone}</p>
                                {agent.status === 'VERIFIED' && <CheckCircle2 size={12} color="#10B981"/>}
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '9px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>COMMISSION</label>
                            <p style={{ fontSize: '13px', fontWeight: 800 }}>{agent.commission || 'N/A'}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #F1F5F9', paddingTop: '24px', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ display: 'flex', gap: '24px' }}>
                            <div>
                                <span style={{ fontSize: '18px', fontWeight: 900, display: 'block', margin: 0 }}>{agent.listings}</span>
                                <span style={{ fontSize: '9px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Assets</span>
                            </div>
                            {agent.rating !== undefined && (
                                <div>
                                    <span style={{ fontSize: '18px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>{agent.rating} <Star size={10} fill="#FBBF24" color="#FBBF24"/></span>
                                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>{agent.reviews} Reviews</span>
                                </div>
                            )}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {agent.status === 'PENDING' ? (
                                <button style={{ background: '#10B981', color: 'white', padding: '10px 20px', borderRadius: '12px', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Approve <ArrowRight size={14}/>
                                </button>
                            ) : agent.status === 'SUSPENDED' ? (
                                <button style={{ background: '#0F172A', color: 'white', padding: '10px 20px', borderRadius: '12px', fontSize: '12px', fontWeight: 800 }}>
                                    Restore
                                </button>
                            ) : (
                                <>
                                    <button style={{ width: '40px', height: '40px', background: '#F8FAFC', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', border: '1px solid #F1F5F9' }}><Edit3 size={16}/></button>
                                    <button style={{ width: '40px', height: '40px', background: '#FEE2E2', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', border: '1px solid #FEE2E2' }}><Slash size={16}/></button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            <button style={{ 
                background: '#FFFFFF', 
                border: '2px dashed #CBD5E1', 
                borderRadius: '24px', 
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                color: '#64748B',
                transition: '0.2s',
                minHeight: '200px'
            }}>
                <div style={{ width: '56px', height: '56px', background: '#F8FAFC', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldPlus size={24}/>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 800 }}>Onboard New Agent</span>
            </button>
        </div>
    </section>
  );
};

export default AgentsView;

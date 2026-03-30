import React from 'react';
import { 
  UserCheck, 
  Search,
  Key,
  Pause,
  Trash2,
  TrendingUp
} from 'lucide-react';

const users = [
  { id: '#U-4402', name: 'Abebe Kebede', role: 'LANDLORD', verified: true, email: 'abebe.k@kira.et', phone: '+251 911 234 567', active: true },
  { id: '#U-3129', name: 'Selam Tesfaye', role: 'TENANT', verified: true, email: 'selam.t@gmail.com', phone: '+251 944 882 110', active: true },
  { id: '#U-8821', name: 'Dawit Haile', role: 'LANDLORD', verified: false, email: 'dawit.h@outlook.com', phone: '+251 900 112 233', active: false },
  { id: '#U-1055', name: 'Sara Mohammed', role: 'AGENT', verified: true, email: 'sara.m@kira.et', phone: '+251 922 456 789', active: true },
];

interface UsersProps {
  onNavigate: (tab: string) => void;
}

const UsersView: React.FC<UsersProps> = ({ onNavigate }) => {
  return (
    <section>
        <div style={{ marginBottom: '60px' }}>
            <p style={{ fontWeight: 800, color: '#10B981', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Directory Access</p>
            <h1 style={{ fontSize: '56px', fontWeight: 900, letterSpacing: '-3px', lineHeight: 1 }}>Identity Core.<br/><span style={{ opacity: 0.1 }}>Member Oversight.</span></h1>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', background: 'white', padding: '4px', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                <button style={{ padding: '10px 24px', borderRadius: '9px', fontSize: '13px', fontWeight: 800, background: '#10B981', color: 'white' }}>All Members</button>
                <button style={{ padding: '10px 24px', borderRadius: '9px', fontSize: '13px', fontWeight: 800, color: '#64748B' }}>Landlords</button>
                <button style={{ padding: '10px 24px', borderRadius: '9px', fontSize: '13px', fontWeight: 800, color: '#64748B' }}>Tenants</button>
                <button style={{ padding: '10px 24px', borderRadius: '9px', fontSize: '13px', fontWeight: 800, color: '#64748B' }}>Agents</button>
            </div>
            <div style={{ background: 'white', border: '1px solid #F1F5F9', padding: '10px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px', width: '320px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <Search size={16} color="#64748B"/>
                <input type="text" placeholder="Quick find member..." style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '13px' }}/>
            </div>
        </div>

        <div className="table-scroll-container">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                        <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Member ID</th>
                        <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Member Name</th>
                        <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Role Tag</th>
                        <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Contact Info</th>
                        <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Kira State</th>
                        <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Admin Authority</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '24px', fontWeight: 800, color: '#10B981', fontSize: '13px' }}>{user.id}</td>
                            <td style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <TrendingUp size={16} color="#64748B" style={{ opacity: 0.4 }}/>
                                    </div>
                                    <div>
                                        <strong style={{ display: 'block', fontSize: '14px', marginBottom: '2px' }}>{user.name}</strong>
                                        {user.verified && <span style={{ fontSize: '10px', fontWeight: 800, color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}><UserCheck size={10}/> Verified Identity</span>}
                                    </div>
                                </div>
                            </td>
                            <td style={{ padding: '24px' }}>
                                <span style={{ 
                                    padding: '6px 14px', 
                                    borderRadius: '8px', 
                                    fontSize: '10px', 
                                    fontWeight: 900,
                                    background: user.role === 'LANDLORD' ? '#F1F5F9' : user.role === 'TENANT' ? '#EEF2FF' : '#F5F3FF',
                                    color: user.role === 'LANDLORD' ? '#475569' : user.role === 'TENANT' ? '#4F46E5' : '#7C3AED'
                                }}>{user.role}</span>
                            </td>
                            <td style={{ padding: '24px' }}>
                                <strong style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>{user.email}</strong>
                                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{user.phone}</span>
                            </td>
                            <td style={{ padding: '24px' }}>
                                {user.active ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: '#10B981' }}>
                                        <div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', display: 'inline-block', marginRight: '8px' }}></div>
                                        Active Direct
                                    </span>
                                ) : (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: '#64748B' }}>
                                        <div style={{ width: '8px', height: '8px', background: '#CBD5E1', borderRadius: '50%', display: 'inline-block', marginRight: '8px' }}></div>
                                        Restricted Access
                                    </span>
                                )}
                            </td>
                            <td style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button style={{ width: '36px', height: '36px', background: '#F8FAFC', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}><Key size={14}/></button>
                                    <button style={{ width: '36px', height: '36px', background: '#F8FAFC', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}><Pause size={14}/></button>
                                    <button style={{ width: '36px', height: '36px', background: '#FEE2E2', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}><Trash2 size={14}/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </section>
  );
};

export default UsersView;

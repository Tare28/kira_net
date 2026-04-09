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
  { id: '#U-4402', name: 'Abebe Kebede', role: 'LANDLORD', verified: true, email: 'abebe@summit.et', phone: '+251 911 22 33 44', active: true },
  { id: '#U-3129', name: 'Almaz Zeleke', role: 'LANDLORD', verified: true, email: 'almaz.villas@gmail.com', phone: '+251 922 55 66 77', active: true },
  { id: '#U-8821', name: 'Dawit Kasahun', role: 'LANDLORD', verified: false, email: 'dawit.studio@outlook.com', phone: '+251 911 88 99 00', active: true },
  { id: '#U-1055', name: 'Sara Mohammed', role: 'AGENT', verified: true, email: 'sara.m@kira.et', phone: '+251 922 456 789', active: true },
];

interface UsersProps {
  onNavigate: (tab: string) => void;
}

const UsersView: React.FC<UsersProps> = () => {
  return (
    <section>
        <div className="view-header">
            <div className="view-title">
                <p style={{ fontWeight: 800, color: '#10B981', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Directory Access</p>
                <h1>Identity Core.<br/><span style={{ opacity: 0.1 }}>Member Oversight.</span></h1>
            </div>
        </div>

        <div className="users-actions-bar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div className="filter-group" style={{ display: 'flex', gap: '8px', background: 'white', padding: '4px', borderRadius: '12px', border: '1px solid #F1F5F9', overflowX: 'auto' }}>
                <button style={{ padding: '10px 24px', borderRadius: '9px', fontSize: '13px', fontWeight: 800, background: '#10B981', color: 'white', whiteSpace: 'nowrap' }}>All Members</button>
                <button style={{ padding: '10px 24px', borderRadius: '9px', fontSize: '13px', fontWeight: 800, color: '#64748B', whiteSpace: 'nowrap' }}>Landlords</button>
                <button style={{ padding: '10px 24px', borderRadius: '9px', fontSize: '13px', fontWeight: 800, color: '#64748B', whiteSpace: 'nowrap' }}>Tenants</button>
                <button style={{ padding: '10px 24px', borderRadius: '9px', fontSize: '13px', fontWeight: 800, color: '#64748B', whiteSpace: 'nowrap' }}>Agents</button>
            </div>
            <div className="search-box" style={{ background: 'white', border: '1px solid #F1F5F9', padding: '10px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px', width: '320px', maxWidth: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <Search size={16} color="#64748B"/>
                <input type="text" placeholder="Quick find member..." style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '13px' }}/>
            </div>
        </div>

        <div className="table-scroll-container">
            <table>
                <thead>
                    <tr>
                        <th>Member ID</th>
                        <th>Member Name</th>
                        <th>Role Tag</th>
                        <th>Contact Info</th>
                        <th>Kira State</th>
                        <th>Admin Authority</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, idx) => (
                        <tr key={idx}>
                            <td style={{ fontWeight: 800, color: '#10B981', fontSize: '13px' }}>{user.id}</td>
                            <td>
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
                            <td>
                                <span style={{ 
                                    padding: '6px 14px', 
                                    borderRadius: '8px', 
                                    fontSize: '10px', 
                                    fontWeight: 900,
                                    background: user.role === 'LANDLORD' ? '#F1F5F9' : user.role === 'TENANT' ? '#EEF2FF' : '#F5F3FF',
                                    color: user.role === 'LANDLORD' ? '#475569' : user.role === 'TENANT' ? '#4F46E5' : '#7C3AED'
                                }}>{user.role}</span>
                            </td>
                            <td>
                                <strong style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>{user.email}</strong>
                                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{user.phone}</span>
                            </td>
                            <td>
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
                            <td>
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

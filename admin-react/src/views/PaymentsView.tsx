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
  XCircle,
  Eye,
  FileText,
  ShieldCheck,
  MoreHorizontal,
  X,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  CreditCard,
  Shield
} from 'lucide-react';

import './Payments.css';
import receiptImg from '../assets/receipt-preview.png';

const INITIAL_TRANSACTIONS = [
  { id: '#TRX-1045', user: 'Abebe Kebede', role: 'LANDLORD', type: 'PREMIUM', amount: '1,200.00', method: 'Telebirr', status: 'SUCCESS', date: 'Oct 24, 2026' },
  { id: '#TRX-1044', user: 'Selam Tesfaye', role: 'TENANT', type: 'VERIFICATION', amount: '150.00', method: 'CBE Birr', status: 'PENDING', date: 'Oct 24, 2026' },
  { id: '#TRX-1043', user: 'Dawit Haile', role: 'LANDLORD', type: 'BOOST', amount: '450.00', method: 'Chapa', status: 'FAILED', date: 'Oct 23, 2026' },
  { id: '#TRX-1046', user: 'Martha Girma', role: 'LANDLORD', type: 'LICENSE', amount: '2,500.00', method: 'Zemen Bank', status: 'PENDING', date: 'Oct 25, 2026' },
];

const INITIAL_BANKS = [
  { id: '1', type: 'BANK', bankName: 'Commercial Bank of Ethiopia (CBE)', accountName: 'Kira-Net Digital Solutions', accountNumber: '1000 4567 8901 2', status: 'ACTIVE' },
  { id: '2', type: 'WALLET', bankName: 'Telebirr', accountName: 'Kira-Net Merchant', accountNumber: '889901', status: 'ACTIVE' },
];

interface PaymentsProps {
  onNavigate: (tab: string) => void;
}

const PaymentsView: React.FC<PaymentsProps> = () => {
  const [data, setData] = useState(INITIAL_TRANSACTIONS);
  const [banks, setBanks] = useState(INITIAL_BANKS);
  const [activeSubTab, setActiveSubTab] = useState<'ledger' | 'deposits'>('ledger');
  const [search, setSearch] = useState('');
  const [selectedTrx, setSelectedTrx] = useState<any>(null);
  const [editingBank, setEditingBank] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showVoidConfirm, setShowVoidConfirm] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const filtered = data.filter(t => 
    t.user.toLowerCase().includes(search.toLowerCase()) || 
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  const saveBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBank.id) {
        setBanks(prev => prev.map(b => b.id === editingBank.id ? editingBank : b));
    } else {
        setBanks(prev => [...prev, { ...editingBank, id: Math.random().toString() }]);
    }
    setEditingBank(null);
  };

  const verifyPayment = (id: string, success: boolean) => {
    setIsVerifying(true);
    // Use a small delay for realistic "Processing" feel
    setTimeout(() => {
        setData(prev => prev.map(t => 
            t.id === id ? { ...t, status: success ? 'SUCCESS' : 'FAILED' } : t
        ));
        setIsVerifying(false);
        setSelectedTrx(null);
    }, 1200);
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
        case 'SUCCESS': return { bg: '#F0FDF4', text: '#16A34A', border: '#DCFCE7' };
        case 'PENDING': return { bg: '#FFFBEB', text: '#D97706', border: '#FEF3C7' };
        case 'FAILED':  return { bg: '#FEF2F2', text: '#DC2626', border: '#FEE2E2' };
        default:        return { bg: '#F8FAFC', text: '#64748B', border: '#E2E8F0' };
    }
  };

  return (
    <section className="payments-view">
        <div className="view-header">
            <div className="view-title">
                <p className="subtitle">Treasury & Settlements</p>
                <h1>Revenue Center.<br/><span style={{ opacity: 0.15 }}>Fiscal Auditing.</span></h1>
            </div>
            
            <div className="header-actions">
                <div className="search-pill">
                    <Search size={16} color="#94A3B8"/>
                    <input 
                      type="text" 
                      placeholder="Transaction ID, customer..." 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="export-btn">
                    <FileText size={16} />
                    <span>Export Audit Log</span>
                </button>
            </div>
        </div>

        <div className="stats-grid">
            <div className="stat-card-white">
                <div className="stat-top">
                    <div className="stat-icon-v2 primary"><BarChart3 size={20}/></div>
                    <span className="trend-up">+14.2%</span>
                </div>
                <div className="stat-info">
                    <h5>SETTLED REVENUE</h5>
                    <h2>ETB {filtered.reduce((s, t) => t.status === 'SUCCESS' ? s + parseFloat(t.amount.replace(',','')) : s, 0).toLocaleString()}</h2>
                    <p className="stat-sub">Across {filtered.filter(t => t.status === 'SUCCESS').length} verified transfers</p>
                </div>
            </div>
            
            <div className="stat-card-white">
                <div className="stat-top">
                    <div className="stat-icon-v2 warning"><Clock size={20}/></div>
                    <span className="badge-warning">Action Required</span>
                </div>
                <div className="stat-info">
                    <h5>PENDING VERIFICATION</h5>
                    <h2>{filtered.filter(t => t.status === 'PENDING').length} Items</h2>
                    <p className="stat-sub">Manual proof review needed</p>
                </div>
            </div>

            <div className="stat-card-white">
                <div className="stat-top">
                    <div className="stat-icon-v2 danger"><AlertCircle size={20}/></div>
                    <span className="badge-danger">Voided</span>
                </div>
                <div className="stat-info">
                    <h5>FAILED CLEARANCE</h5>
                    <h2>{filtered.filter(t => t.status === 'FAILED').length} Exceptions</h2>
                    <p className="stat-sub">Flagged for manual re-entry</p>
                </div>
            </div>
        </div>

        <div className="table-card">
            <div className="table-header-row">
                <div className="tab-switch">
                    <button 
                        className={`tab-btn ${activeSubTab === 'ledger' ? 'active' : ''}`}
                        onClick={() => setActiveSubTab('ledger')}
                    >
                        Live Transaction Ledger
                    </button>
                    <button 
                        className={`tab-btn ${activeSubTab === 'deposits' ? 'active' : ''}`}
                        onClick={() => setActiveSubTab('deposits')}
                    >
                        Deposit Configuration
                    </button>
                </div>
                {activeSubTab === 'ledger' ? (
                    <div className="filter-group">
                        <button className="filter-chip active">All</button>
                        <button className="filter-chip">Pending</button>
                        <button className="filter-chip">Settled</button>
                    </div>
                ) : (
                    <button className="add-bank-btn" onClick={() => setEditingBank({ type: 'BANK', bankName: '', accountName: '', accountNumber: '', status: 'ACTIVE' })}>
                        <ArrowUpRight size={14} />
                        <span>Add Account Card</span>
                    </button>
                )}
            </div>
            
            {activeSubTab === 'ledger' ? (
                <div className="audit-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>IDENTIFIER</th>
                                <th>BENEFICIARY</th>
                                <th>CATEGORY</th>
                                <th>SETTLEMENT</th>
                                <th>CHANNEL</th>
                                <th>AUDIT STATUS</th>
                                <th style={{ textAlign: 'right' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((trx, idx) => {
                                const style = getStatusStyle(trx.status);
                                return (
                                    <tr key={idx} className="audit-row">
                                        <td className="trx-id">{trx.id}</td>
                                        <td>
                                            <div className="user-cell">
                                                <div className="avatar-small">{trx.user[0]}</div>
                                                <div>
                                                    <span className="user-name-v2">{trx.user}</span>
                                                    <span className="user-role-v2">{trx.role}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="type-badge">{trx.type}</span>
                                        </td>
                                        <td>
                                            <div className="amount-cell">
                                                <strong>ETB {trx.amount}</strong>
                                                {trx.status === 'SUCCESS' ? <CheckCircle2 size={12} color="#16A34A"/> : trx.status === 'PENDING' ? <Clock size={12} color="#D97706"/> : <AlertTriangle size={12} color="#DC2626"/>}
                                            </div>
                                        </td>
                                        <td className="method-cell">{trx.method}</td>
                                        <td>
                                            <span className="status-pill-v2" style={{ backgroundColor: style.bg, color: style.text, border: `1px solid ${style.border}` }}>
                                                <div className="dot" style={{ backgroundColor: style.text }}></div>
                                                {trx.status}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            {trx.status === 'PENDING' ? (
                                                <button className="review-btn" onClick={() => setSelectedTrx(trx)}>
                                                    <FileSearch size={14} />
                                                    <span>Audit Proof</span>
                                                </button>
                                            ) : (
                                                <button className="action-dot-btn">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="deposit-config-grid">
                    {banks.map(bank => (
                        <div key={bank.id} className="bank-card">
                            <div className="bank-card-header">
                                <div className={`type-tag ${bank.type.toLowerCase()}`}>
                                    {bank.type === 'BANK' ? <CreditCard size={14}/> : <ArrowUpRight size={14}/>}
                                    <span>{bank.type}</span>
                                </div>
                                <button className="edit-bank-link" onClick={() => setEditingBank(bank)}>Edit</button>
                            </div>
                            <div className="bank-card-body">
                                <h3>{bank.bankName}</h3>
                                <div className="bank-detail">
                                    <label>Account Name</label>
                                    <p>{bank.accountName}</p>
                                </div>
                                <div className="bank-detail">
                                    <label>Account Number</label>
                                    <p className="acc-num">{bank.accountNumber}</p>
                                </div>
                            </div>
                            <div className="bank-card-footer">
                                <span className={`status-dot-label ${bank.status.toLowerCase()}`}>
                                    <div className="dot"></div>
                                    {bank.status}
                                </span>
                                <button className="delete-bank-btn" onClick={() => setBanks(prev => prev.filter(b => b.id !== bank.id))}>
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                    <button className="add-bank-card-cta" onClick={() => setEditingBank({ type: 'BANK', bankName: '', accountName: '', accountNumber: '', status: 'ACTIVE' })}>
                        <div className="plus-box">+</div>
                        <span>Register New Payment Channel</span>
                    </button>
                </div>
            )}
        </div>

        {/* Bank Edit/Add Modal */}
        {editingBank && (
            <div className="audit-modal-overlay">
                <div className="audit-modal tiny">
                    <div className="modal-header">
                        <h3>{editingBank.id ? 'Edit' : 'Add'} Payment Account</h3>
                        <button className="close-modal" onClick={() => setEditingBank(null)}><X size={20}/></button>
                    </div>
                    <form className="modal-form" onSubmit={saveBank}>
                        <div className="form-group">
                            <label>Channel Type</label>
                            <select 
                                value={editingBank.type} 
                                onChange={e => setEditingBank({...editingBank, type: e.target.value})}
                            >
                                <option value="BANK">Traditional Bank</option>
                                <option value="WALLET">Digital Wallet (Telebirr/M-Pesa)</option>
                                <option value="CARD">Direct Card Settlement</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Institution Name</label>
                            <input 
                                type="text" 
                                placeholder="e.g. CBE, Dashen Bank, Telebirr" 
                                value={editingBank.bankName}
                                onChange={e => setEditingBank({...editingBank, bankName: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Account Holder Name</label>
                            <input 
                                type="text" 
                                placeholder="Legal business name" 
                                value={editingBank.accountName}
                                onChange={e => setEditingBank({...editingBank, accountName: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Account / Merchant Number</label>
                            <input 
                                type="text" 
                                placeholder="0000 0000 0000" 
                                value={editingBank.accountNumber}
                                onChange={e => setEditingBank({...editingBank, accountNumber: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => setEditingBank(null)}>Cancel</button>
                            <button type="submit" className="save-btn-v2">Save Configuration</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Verification Modal */}
        {selectedTrx && (
            <div className="audit-modal-overlay">
                <div className="audit-modal">
                    <div className="modal-header">
                        <div className="modal-title-group">
                            <ShieldCheck size={20} color="#9CC942" />
                            <h3>Manual Verification Review</h3>
                        </div>
                        <button className="close-modal" onClick={() => setSelectedTrx(null)}><X size={20}/></button>
                    </div>

                    <div className="modal-body">
                        <div className="proof-sidebar">
                            <div className="proof-preview-card">
                                <p className="proof-label">SUBMITTED PAYMENT PROOF</p>
                                <div className="proof-image-container" onClick={() => setIsZoomed(true)}>
                                    <img src={receiptImg} alt="Receipt Proof" />
                                    <div className="proof-overlay">
                                        <Eye size={20} />
                                        <span>Click to expand</span>
                                    </div>
                                </div>
                                <div className="proof-meta">
                                    <p>File: <span>receipt_829.png</span></p>
                                    <p>Uploaded: <span>{selectedTrx.date}</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="audit-details">
                            <div className="audit-section">
                                <h4>Transaction Details</h4>
                                <div className="audit-grid">
                                    <div className="audit-item">
                                        <label>Reference ID</label>
                                        <span>{selectedTrx.id}</span>
                                    </div>
                                    <div className="audit-item">
                                        <label>Amount (ETB)</label>
                                        <span className="highlight-val">{selectedTrx.amount}</span>
                                    </div>
                                    <div className="audit-item">
                                        <label>Payment Channel</label>
                                        <span>{selectedTrx.method}</span>
                                    </div>
                                    <div className="audit-item">
                                        <label>Sender Identity</label>
                                        <span>{selectedTrx.user} ({selectedTrx.role})</span>
                                    </div>
                                </div>
                            </div>

                            <div className="audit-section">
                                <h4>Verification Protocol</h4>
                                <p className="audit-instruction">Please ensure the Reference ID on the receipt matches the bank statement before settlement approval.</p>
                                
                                <div className="audit-checklist">
                                    <div className="check-item">
                                        <CheckCircle2 size={16} color="#10B981" />
                                        <span>Amount matches system record exactly</span>
                                    </div>
                                    <div className="check-item">
                                        <CheckCircle2 size={16} color="#10B981" />
                                        <span>Receipt date is within valid range</span>
                                    </div>
                                </div>
                            </div>

                            <div className="audit-actions">
                                {showVoidConfirm ? (
                                    <div className="void-confirm-flow">
                                        <p>Confirm voiding this transaction?</p>
                                        <div className="confirm-btns">
                                            <button className="cancel-void-btn" onClick={() => setShowVoidConfirm(false)}>No, Keep</button>
                                            <button className="confirm-void-btn" onClick={() => {
                                                verifyPayment(selectedTrx.id, false);
                                                setShowVoidConfirm(false);
                                            }}>Yes, Void</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <button className="void-btn" disabled={isVerifying} onClick={() => setShowVoidConfirm(true)}>
                                            <XCircle size={18} />
                                            <span>Void Transaction</span>
                                        </button>
                                        <button className="approve-btn" disabled={isVerifying} onClick={() => verifyPayment(selectedTrx.id, true)}>
                                            {isVerifying ? <Loader2 className="spin" size={18} /> : <CheckCircle size={18} />}
                                            <span>Settle & Approve</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Fullscreen Proof Preview */}
        {isZoomed && (
            <div className="zoom-overlay" onClick={() => setIsZoomed(false)}>
                <button className="close-zoom"><X size={32}/></button>
                <div className="zoomed-content" onClick={(e) => e.stopPropagation()}>
                    <img src={receiptImg} alt="Receipt Fullscreen" />
                    <div className="zoom-footer">
                        <span>{selectedTrx?.id} - Payment Proof</span>
                    </div>
                </div>
            </div>
        )}
    </section>
  );
};

export default PaymentsView;

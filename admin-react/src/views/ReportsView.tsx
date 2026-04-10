import React from 'react';
import { 
  FileText, 
  Search, 
  MoreHorizontal, 
  Filter,
  Download,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

const reports = [
  { id: '#REP-129', title: 'Q3 Market Analysis', type: 'INSIGHT', date: 'Oct 24, 2026', status: 'COMPLETED', priority: 'HIGH' },
  { id: '#REP-128', title: 'Asset Audit - Bole', type: 'AUDIT', date: 'Oct 22, 2026', status: 'PENDING', priority: 'MEDIUM' },
  { id: '#REP-127', title: 'Agent Performance', type: 'METRICS', date: 'Oct 18, 2026', status: 'COMPLETED', priority: 'LOW' },
  { id: '#REP-126', title: 'Revenue Forecast', type: 'FINANCIAL', date: 'Oct 15, 2026', status: 'FLAGGED', priority: 'CRITICAL' },
];

interface ReportsProps {
  onNavigate: (tab: string) => void;
}

const ReportsView: React.FC<ReportsProps> = () => {
  return (
    <section>
        <div className="view-header">
            <div className="view-title">
                <p style={{ fontWeight: 800, color: '#9CC942', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Strategic Assets</p>
                <h1>Platform Intel.<br/><span style={{ opacity: 0.1 }}>Analytical Governance.</span></h1>
            </div>
            <button style={{ background: '#9CC942', color: 'white', padding: '14px 40px', borderRadius: '14px', fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)', width: 'fit-content' }}>
                <FileCheck size={18}/> <span className="hide-mobile">Generate Report</span><span className="show-mobile" style={{ display: 'none' }}>Generate</span>
            </button>
        </div>

        <div className="reports-search-bar" style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px', background: 'white', border: '1px solid #F1F5F9', padding: '14px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <Search size={18} color="#64748B"/>
                <input type="text" placeholder="Search strategic documents..." style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '14px' }}/>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', border: '1px solid #F1F5F9', padding: '14px 24px', borderRadius: '16px', fontSize: '14px', fontWeight: 800, color: '#64748B' }}>
                <Filter size={18}/> Filters
            </button>
        </div>

        <div className="table-scroll-container">
            <table>
                <thead>
                    <tr>
                        <th>Report ID</th>
                        <th>Document Title</th>
                        <th>Classification</th>
                        <th>Strategic Priority</th>
                        <th>Timeframe</th>
                        <th>Current State</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report, idx) => (
                        <tr key={idx}>
                            <td style={{ fontWeight: 800, color: '#9CC942', fontSize: '13px' }}>{report.id}</td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '40px', height: '40px', background: '#F8FAFC', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                                        <FileText size={20}/>
                                    </div>
                                    <strong style={{ fontSize: '14px' }}>{report.title}</strong>
                                </div>
                            </td>
                            <td>
                                <span style={{ fontSize: '11px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{report.type}</span>
                            </td>
                            <td>
                                <span style={{ 
                                    padding: '6px 12px', 
                                    borderRadius: '6px', 
                                    fontSize: '9px', 
                                    fontWeight: 900,
                                    background: report.priority === 'CRITICAL' ? '#FEE2E2' : report.priority === 'HIGH' ? '#FEF3C7' : '#F1F5F9',
                                    color: report.priority === 'CRITICAL' ? '#EF4444' : report.priority === 'HIGH' ? '#F59E0B' : '#64748B'
                                }}>{report.priority}</span>
                            </td>
                            <td style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>{report.date}</td>
                            <td>
                                {report.status === 'FLAGGED' ? (
                                    <span className="pulse-critical" style={{ fontSize: '11px', fontWeight: 900, color: '#EF4444', gap: '6px' }}><AlertTriangle size={14}/> FLAGGED</span>
                                ) : (
                                    <span style={{ fontSize: '11px', fontWeight: 900, color: report.status === 'COMPLETED' ? '#9CC942' : '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: report.status === 'COMPLETED' ? '#9CC942' : '#64748B' }}></div>
                                        {report.status}
                                    </span>
                                )}
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button style={{ color: '#9CC942' }}><Download size={18}/></button>
                                    <button style={{ color: '#64748B' }}><MoreHorizontal size={18}/></button>
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

export default ReportsView;

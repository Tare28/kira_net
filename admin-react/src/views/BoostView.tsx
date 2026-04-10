import { useState } from 'react';
import {
  Zap, CheckCircle2, XCircle, Clock, TrendingUp,
  Eye, MousePointer, BarChart2, X, ChevronRight,
  AlertTriangle, Star
} from 'lucide-react';

// ── Boost packages ────────────────────────────────────────────────────────────
const PACKAGES = [
  { id: 'starter',   label: 'Starter Boost',   days: 3,  price: 299,   multiplier: '3×',  color: '#3B82F6', bg: '#EFF6FF' },
  { id: 'pro',       label: 'Pro Boost',        days: 7,  price: 599,   multiplier: '7×',  color: '#9CC942', bg: '#F4F9EB' },
  { id: 'premium',   label: 'Premium Boost',    days: 14, price: 999,   multiplier: '12×', color: '#8B5CF6', bg: '#F5F3FF' },
  { id: 'spotlight', label: 'Spotlight 30',     days: 30, price: 1799,  multiplier: '20×', color: '#F59E0B', bg: '#FFFBEB' },
];

// ── Mock boost requests data ──────────────────────────────────────────────────
const INITIAL_BOOSTS = [
  {
    id: 'BST-001', listingId: '#KN-001', listingName: 'The Summit Residency',
    location: 'Bole, Addis Ababa', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=120&auto=format&fit=crop',
    package: 'pro', landlord: 'Abebe Tadesse', landlordInitial: 'AT',
    requestedAt: '2026-04-08', startsAt: '2026-04-09', endsAt: '2026-04-16',
    status: 'ACTIVE', payment: 'PAID', amount: 599,
    stats: { impressions: 4820, clicks: 312, leads: 18 },
  },
  {
    id: 'BST-002', listingId: '#KN-004', listingName: 'Bole Road Shop Space',
    location: 'Bole Road, Addis Ababa', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=120&auto=format&fit=crop',
    package: 'premium', landlord: 'Desta Mekonnen', landlordInitial: 'DM',
    requestedAt: '2026-04-09', startsAt: '2026-04-10', endsAt: '2026-04-24',
    status: 'ACTIVE', payment: 'PAID', amount: 999,
    stats: { impressions: 2110, clicks: 198, leads: 11 },
  },
  {
    id: 'BST-003', listingId: '#KN-005', listingName: 'Artisan Cafe Spot',
    location: 'Sarbet, Addis Ababa', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=120&auto=format&fit=crop',
    package: 'starter', landlord: 'Sara Haile', landlordInitial: 'SH',
    requestedAt: '2026-04-10', startsAt: null, endsAt: null,
    status: 'PENDING', payment: 'PAID', amount: 299,
    stats: { impressions: 0, clicks: 0, leads: 0 },
  },
  {
    id: 'BST-004', listingId: '#KN-003', listingName: 'Kazanchis Studio',
    location: 'Kazanchis, Addis Ababa', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=120&auto=format&fit=crop',
    package: 'spotlight', landlord: 'Yonas Bekele', landlordInitial: 'YB',
    requestedAt: '2026-04-10', startsAt: null, endsAt: null,
    status: 'PENDING', payment: 'PENDING', amount: 1799,
    stats: { impressions: 0, clicks: 0, leads: 0 },
  },
  {
    id: 'BST-005', listingId: '#KN-006', listingName: 'Gourmet Dining Hall',
    location: 'Piassa, Addis Ababa', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=120&auto=format&fit=crop',
    package: 'pro', landlord: 'Meron Girma', landlordInitial: 'MG',
    requestedAt: '2026-03-28', startsAt: '2026-03-29', endsAt: '2026-04-05',
    status: 'EXPIRED', payment: 'PAID', amount: 599,
    stats: { impressions: 9340, clicks: 701, leads: 43 },
  },
  {
    id: 'BST-006', listingId: '#KN-002', listingName: 'Modern Garden Villa',
    location: 'Old Airport, Addis Ababa', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=120&auto=format&fit=crop',
    package: 'starter', landlord: 'Abebe Bekele', landlordInitial: 'AB',
    requestedAt: '2026-04-01', startsAt: null, endsAt: null,
    status: 'REJECTED', payment: 'REFUNDED', amount: 299,
    stats: { impressions: 0, clicks: 0, leads: 0 },
  },
];

const FILTER_TABS = ['All', 'Active', 'Pending', 'Expired', 'Rejected'];

// ── Helpers ───────────────────────────────────────────────────────────────────
function statusStyle(status: string) {
  switch (status) {
    case 'ACTIVE':   return { bg: '#F4F9EB', color: '#9CC942' };
    case 'PENDING':  return { bg: '#FEF3C7', color: '#F59E0B' };
    case 'EXPIRED':  return { bg: '#F1F5F9', color: '#64748B' };
    case 'REJECTED': return { bg: '#FEE2E2', color: '#EF4444' };
    default:         return { bg: '#F1F5F9', color: '#64748B' };
  }
}

function paymentStyle(payment: string) {
  switch (payment) {
    case 'PAID':     return { bg: '#F4F9EB', color: '#9CC942' };
    case 'PENDING':  return { bg: '#FEF3C7', color: '#F59E0B' };
    case 'REFUNDED': return { bg: '#EFF6FF', color: '#3B82F6' };
    default:         return { bg: '#F1F5F9', color: '#64748B' };
  }
}

function getPackage(id: string) {
  return PACKAGES.find(p => p.id === id) ?? PACKAGES[0];
}

function daysLeft(endsAt: string | null) {
  if (!endsAt) return null;
  const end = new Date(endsAt).getTime();
  const now = Date.now();
  const diff = Math.ceil((end - now) / 86400000);
  return diff > 0 ? diff : 0;
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function BoostView() {
  const [boosts, setBoosts] = useState(INITIAL_BOOSTS);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedBoost, setSelectedBoost] = useState<any>(null);

  const filtered = boosts.filter(b => {
    if (activeFilter === 'All') return true;
    return b.status === activeFilter.toUpperCase();
  });

  const activeCount   = boosts.filter(b => b.status === 'ACTIVE').length;
  const pendingCount  = boosts.filter(b => b.status === 'PENDING').length;
  const totalRevenue  = boosts.filter(b => b.payment === 'PAID').reduce((s, b) => s + b.amount, 0);
  const totalLeads    = boosts.reduce((s, b) => s + b.stats.leads, 0);
  const totalImpressions = boosts.reduce((s, b) => s + b.stats.impressions, 0);

  const approveBoost = (id: string) => {
    const today = new Date();
    setBoosts(prev => prev.map(b => {
      if (b.id !== id) return b;
      const pkg = getPackage(b.package);
      const ends = new Date(today);
      ends.setDate(ends.getDate() + pkg.days);
      return {
        ...b, status: 'ACTIVE',
        startsAt: today.toISOString().split('T')[0],
        endsAt: ends.toISOString().split('T')[0],
      };
    }));
    setSelectedBoost(null);
  };

  const rejectBoost = (id: string) => {
    if (!window.confirm('Reject this boost? The payment will be marked for refund.')) return;
    setBoosts(prev => prev.map(b =>
      b.id === id ? { ...b, status: 'REJECTED', payment: 'REFUNDED' } : b
    ));
    setSelectedBoost(null);
  };

  const extendBoost = (id: string, days: number) => {
    setBoosts(prev => prev.map(b => {
      if (b.id !== id || !b.endsAt) return b;
      const newEnd = new Date(b.endsAt);
      newEnd.setDate(newEnd.getDate() + days);
      return { ...b, endsAt: newEnd.toISOString().split('T')[0] };
    }));
  };

  return (
    <section>
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="view-header">
        <div className="view-title">
          <p style={{ fontWeight: 800, color: '#9CC942', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
            Revenue Management
          </p>
          <h1>Boost.<br /><span style={{ opacity: 0.1 }}>Amplify.</span></h1>
          <p style={{ color: '#64748B', fontSize: '14px', marginTop: '8px', fontWeight: 600 }}>
            Manage sponsored listings. Approve, track, and optimize boost campaigns.
          </p>
        </div>

        {/* Summary KPIs */}
        <div className="summary-cards hide-mobile" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {[
            { label: 'ACTIVE BOOSTS',  value: activeCount,                    color: '#9CC942' },
            { label: 'PENDING REVIEW', value: pendingCount,                   color: '#F59E0B' },
            { label: 'TOTAL REVENUE',  value: `${totalRevenue.toLocaleString()} ETB`, color: '#9CC942' },
            { label: 'TOTAL LEADS',    value: totalLeads,                     color: '#8B5CF6' },
          ].map(kpi => (
            <div key={kpi.label} style={{ background: 'white', padding: '20px 28px', borderRadius: '20px', border: '1px solid #F1F5F9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', minWidth: '140px' }}>
              <span style={{ fontSize: '9px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>{kpi.label}</span>
              <h2 style={{ fontSize: '26px', fontWeight: 900, color: kpi.color, margin: 0 }}>{kpi.value}</h2>
            </div>
          ))}
        </div>
      </div>

      {/* ── Reach Stats Bar ──────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {[
          { icon: <Eye size={20} />, label: 'Total Impressions', value: totalImpressions.toLocaleString(), sub: 'across all active boosts', color: '#3B82F6', bg: '#EFF6FF' },
          { icon: <MousePointer size={20} />, label: 'Total Clicks', value: boosts.reduce((s, b) => s + b.stats.clicks, 0).toLocaleString(), sub: 'from boosted listings', color: '#9CC942', bg: '#F4F9EB' },
          { icon: <TrendingUp size={20} />, label: 'Avg. CTR', value: totalImpressions > 0 ? `${((boosts.reduce((s, b) => s + b.stats.clicks, 0) / totalImpressions) * 100).toFixed(1)}%` : '—', sub: 'click-through rate', color: '#8B5CF6', bg: '#F5F3FF' },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, flexShrink: 0 }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{stat.label}</p>
              <h3 style={{ fontSize: '24px', fontWeight: 900, color: stat.color, margin: 0 }}>{stat.value}</h3>
              <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, marginTop: '2px' }}>{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Boost Packages Reference ──────────────────────────────────────── */}
      <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', padding: '24px 28px', marginBottom: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '32px', height: '32px', background: '#F4F9EB', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CC942' }}>
            <Star size={16} />
          </div>
          <p style={{ fontWeight: 800, fontSize: '14px' }}>Boost Packages</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {PACKAGES.map(pkg => (
            <div key={pkg.id} style={{ background: pkg.bg, borderRadius: '16px', padding: '18px 20px', border: `1px solid ${pkg.color}22` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: pkg.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{pkg.label}</span>
                <span style={{ fontSize: '18px', fontWeight: 900, color: pkg.color }}>{pkg.multiplier}</span>
              </div>
              <p style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: '0 0 4px' }}>{pkg.price} <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>ETB</span></p>
              <p style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{pkg.days} days</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filter Tabs + Boost Requests Table ───────────────────────────── */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '6px', background: 'white', padding: '4px', borderRadius: '12px', border: '1px solid #F1F5F9', overflowX: 'auto' }}>
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              style={{
                padding: '10px 20px', borderRadius: '9px', fontSize: '13px', fontWeight: 800,
                whiteSpace: 'nowrap',
                background: activeFilter === tab ? '#9CC942' : 'transparent',
                color: activeFilter === tab ? 'white' : '#64748B',
              }}
            >
              {tab}
              {tab === 'Pending' && pendingCount > 0 && (
                <span style={{ marginLeft: '8px', background: activeFilter === 'Pending' ? 'rgba(255,255,255,0.3)' : '#FEF3C7', color: activeFilter === 'Pending' ? 'white' : '#F59E0B', fontSize: '10px', fontWeight: 900, padding: '1px 7px', borderRadius: '100px' }}>
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
        <div style={{ color: '#64748B', fontSize: '13px', fontWeight: 600 }}>
          {filtered.length} campaign{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="table-scroll-container">
        <table style={{ minWidth: '1050px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Listing</th>
              <th>Package</th>
              <th>Landlord</th>
              <th>Duration</th>
              <th>Payment</th>
              <th>Performance</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(boost => {
              const pkg = getPackage(boost.package);
              const ss = statusStyle(boost.status);
              const ps = paymentStyle(boost.payment);
              const remaining = daysLeft(boost.endsAt);
              const ctr = boost.stats.impressions > 0
                ? ((boost.stats.clicks / boost.stats.impressions) * 100).toFixed(1)
                : '—';

              return (
                <tr key={boost.id}>
                  {/* ID */}
                  <td style={{ fontWeight: 800, color: '#9CC942', fontSize: '12px', whiteSpace: 'nowrap' }}>{boost.id}</td>

                  {/* Listing */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={boost.image} alt="" style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #F1F5F9', flexShrink: 0 }} />
                      <div>
                        <strong style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>{boost.listingName}</strong>
                        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{boost.location}</span>
                      </div>
                    </div>
                  </td>

                  {/* Package */}
                  <td>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: pkg.bg, padding: '6px 12px', borderRadius: '100px', border: `1px solid ${pkg.color}33` }}>
                      <Zap size={12} color={pkg.color} />
                      <span style={{ fontSize: '11px', fontWeight: 800, color: pkg.color }}>{pkg.label}</span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600, marginTop: '4px', paddingLeft: '4px' }}>{pkg.days} days · {boost.amount} ETB</div>
                  </td>

                  {/* Landlord */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#F4F9EB', border: '1px solid #E2EDE8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, color: '#9CC942', flexShrink: 0 }}>
                        {boost.landlordInitial}
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700 }}>{boost.landlord}</span>
                    </div>
                  </td>

                  {/* Duration */}
                  <td>
                    {boost.startsAt ? (
                      <>
                        <span style={{ fontSize: '12px', fontWeight: 700, display: 'block' }}>{boost.startsAt} → {boost.endsAt}</span>
                        {boost.status === 'ACTIVE' && remaining !== null && (
                          <span style={{ fontSize: '10px', fontWeight: 800, color: remaining <= 2 ? '#EF4444' : '#9CC942', marginTop: '3px', display: 'block' }}>
                            {remaining <= 2 && <AlertTriangle size={10} style={{ verticalAlign: 'middle', marginRight: '3px' }} />}
                            {remaining} days left
                          </span>
                        )}
                      </>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>Not started</span>
                    )}
                  </td>

                  {/* Payment */}
                  <td>
                    <span style={{ padding: '5px 12px', borderRadius: '100px', fontSize: '10px', fontWeight: 900, background: ps.bg, color: ps.color }}>
                      {boost.payment}
                    </span>
                  </td>

                  {/* Performance */}
                  <td>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '13px', fontWeight: 900, color: '#0F172A' }}>{boost.stats.impressions.toLocaleString()}</p>
                        <p style={{ fontSize: '9px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Views</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '13px', fontWeight: 900, color: '#3B82F6' }}>{ctr}%</p>
                        <p style={{ fontSize: '9px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>CTR</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '13px', fontWeight: 900, color: '#9CC942' }}>{boost.stats.leads}</p>
                        <p style={{ fontSize: '9px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Leads</p>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span style={{ padding: '6px 14px', borderRadius: '100px', fontSize: '10px', fontWeight: 900, background: ss.bg, color: ss.color }}>
                      {boost.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td>
                    {boost.status === 'PENDING' ? (
                      <button
                        onClick={() => setSelectedBoost(boost)}
                        style={{ background: '#9CC942', color: 'white', padding: '8px 16px', borderRadius: '10px', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        Review <ChevronRight size={12} />
                      </button>
                    ) : boost.status === 'ACTIVE' ? (
                      <button
                        onClick={() => setSelectedBoost(boost)}
                        style={{ background: '#F4F9EB', color: '#9CC942', padding: '8px 16px', borderRadius: '10px', fontSize: '11px', fontWeight: 800, border: '1px solid #E2EDE8', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <BarChart2 size={12} /> Manage
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748B', fontWeight: 700 }}>
            No boost campaigns in this category.
          </div>
        )}
      </div>

      {/* ── Review / Manage Modal ─────────────────────────────────────────── */}
      {selectedBoost && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', width: '860px', maxWidth: '100%', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 25px 60px -12px rgba(0,0,0,0.3)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

            {/* Modal Header */}
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 900 }}>
                  {selectedBoost.status === 'PENDING' ? '📋 Review Boost Request' : '⚡ Manage Active Boost'}
                </h2>
                <p style={{ color: '#64748B', fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>
                  {selectedBoost.id} — {selectedBoost.listingName}
                </p>
              </div>
              <button onClick={() => setSelectedBoost(null)} style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexWrap: 'wrap' }}>
              {/* Left: Listing Preview */}
              <div style={{ flex: '1 1 340px', background: '#F8FAFC', padding: '32px', borderRight: '1px solid #F1F5F9' }}>
                <img src={selectedBoost.image} alt="" style={{ width: '100%', borderRadius: '16px', marginBottom: '20px', aspectRatio: '16/9', objectFit: 'cover' }} />

                <p style={{ fontSize: '18px', fontWeight: 900, marginBottom: '6px' }}>{selectedBoost.listingName}</p>
                <p style={{ fontSize: '13px', color: '#64748B', fontWeight: 600, marginBottom: '20px' }}>{selectedBoost.location}</p>

                {/* Package card */}
                {(() => {
                  const pkg = getPackage(selectedBoost.package);
                  return (
                    <div style={{ background: pkg.bg, borderRadius: '16px', padding: '16px 20px', border: `1px solid ${pkg.color}33`, marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: pkg.color }}>{pkg.label}</span>
                        <span style={{ fontSize: '22px', fontWeight: 900, color: pkg.color }}>{pkg.multiplier}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{pkg.days} days duration</span>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>{selectedBoost.amount} ETB</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Payment status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'white', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>Payment Status</span>
                  <span style={{ fontSize: '11px', fontWeight: 900, background: paymentStyle(selectedBoost.payment).bg, color: paymentStyle(selectedBoost.payment).color, padding: '4px 12px', borderRadius: '100px' }}>
                    {selectedBoost.payment}
                  </span>
                </div>
              </div>

              {/* Right: Actions */}
              <div style={{ flex: '1 1 340px', padding: '32px' }}>
                {/* Performance (for active boosts) */}
                {selectedBoost.status === 'ACTIVE' && (
                  <>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '16px' }}>📊 Campaign Performance</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
                      {[
                        { label: 'Impressions', value: selectedBoost.stats.impressions.toLocaleString(), icon: <Eye size={14} />, color: '#3B82F6', bg: '#EFF6FF' },
                        { label: 'Clicks', value: selectedBoost.stats.clicks.toLocaleString(), icon: <MousePointer size={14} />, color: '#9CC942', bg: '#F4F9EB' },
                        { label: 'Leads', value: selectedBoost.stats.leads, icon: <TrendingUp size={14} />, color: '#8B5CF6', bg: '#F5F3FF' },
                      ].map(m => (
                        <div key={m.label} style={{ background: m.bg, borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                          <div style={{ color: m.color, display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>{m.icon}</div>
                          <p style={{ fontSize: '18px', fontWeight: 900, color: m.color, margin: 0 }}>{m.value}</p>
                          <p style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, marginTop: '2px' }}>{m.label}</p>
                        </div>
                      ))}
                    </div>

                    <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '16px' }}>⏱ Extend Campaign</h4>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
                      {[3, 7, 14].map(days => (
                        <button
                          key={days}
                          onClick={() => { extendBoost(selectedBoost.id, days); setSelectedBoost(null); }}
                          style={{ flex: 1, padding: '12px', background: '#F4F9EB', border: '1px solid #E2EDE8', borderRadius: '12px', fontSize: '12px', fontWeight: 800, color: '#9CC942' }}
                        >
                          +{days} days
                        </button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        style={{ flex: 1, background: '#FEE2E2', color: '#EF4444', padding: '14px', borderRadius: '14px', fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        onClick={() => rejectBoost(selectedBoost.id)}
                      >
                        <XCircle size={16} /> Cancel Boost
                      </button>
                      <button
                        onClick={() => setSelectedBoost(null)}
                        style={{ flex: 1, background: '#9CC942', color: 'white', padding: '14px', borderRadius: '14px', fontSize: '13px', fontWeight: 800 }}
                      >
                        Done
                      </button>
                    </div>
                  </>
                )}

                {/* Pending approval flow */}
                {selectedBoost.status === 'PENDING' && (
                  <>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '20px' }}>✅ Approval Checklist</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                      {[
                        { label: 'Payment received', ok: selectedBoost.payment === 'PAID' },
                        { label: 'Listing is active & verified', ok: true },
                        { label: 'No active violations on listing', ok: true },
                        { label: 'Package selected is valid', ok: true },
                      ].map((chk, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: chk.ok ? '#F0FDF4' : '#FEF2F2', borderRadius: '12px' }}>
                          {chk.ok
                            ? <CheckCircle2 size={16} color="#9CC942" />
                            : <XCircle size={16} color="#EF4444" />
                          }
                          <span style={{ fontSize: '13px', fontWeight: 700, color: chk.ok ? '#0F172A' : '#EF4444' }}>{chk.label}</span>
                        </div>
                      ))}
                    </div>

                    {selectedBoost.payment !== 'PAID' && (
                      <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <AlertTriangle size={16} color="#F59E0B" />
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#92400E' }}>Payment not confirmed. Approve only after payment verification.</p>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '12px', position: 'sticky', bottom: 0, background: 'white', padding: '10px 0' }}>
                      <button
                        onClick={() => approveBoost(selectedBoost.id)}
                        disabled={selectedBoost.payment !== 'PAID'}
                        style={{ flex: 1, background: selectedBoost.payment === 'PAID' ? '#9CC942' : '#D1D5DB', color: 'white', padding: '16px', borderRadius: '14px', fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: selectedBoost.payment === 'PAID' ? 'pointer' : 'not-allowed' }}
                      >
                        <CheckCircle2 size={18} /> Approve & Activate
                      </button>
                      <button
                        onClick={() => rejectBoost(selectedBoost.id)}
                        style={{ border: '1px solid #FEE2E2', color: '#EF4444', padding: '16px', borderRadius: '14px', fontSize: '13px', fontWeight: 800 }}
                      >
                        Reject
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

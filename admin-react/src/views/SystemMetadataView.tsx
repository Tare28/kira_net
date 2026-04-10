import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  X, 
  Save, 
  Layout, 
  MapPin, 
  Home, 
  Layers
} from 'lucide-react';

interface MetadataItem {
    id: string;
    name: string;
    description?: string;
}

interface DataType {
    id: string;
    label: string;
    icon: React.ReactNode;
    items: MetadataItem[];
}

const SystemMetadataView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('categories');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MetadataItem | null>(null);
    const [newItemName, setNewItemName] = useState('');
    const [newItemDesc, setNewItemDesc] = useState('');

    const [data, setData] = useState<Record<string, DataType>>({
        categories: {
            id: 'categories',
            label: 'Property Categories',
            icon: <Layout size={18} />,
            items: [
                { id: '1', name: 'Residential', description: 'Homes and apartments for living' },
                { id: '2', name: 'Commercial', description: 'Shops, offices, and business spaces' },
                { id: '3', name: 'F&B', description: 'Cafes, restaurants, and food venues' },
                { id: '4', name: 'Coworking', description: 'Shared work and startup hubs' },
            ]
        },
        districts: {
            id: 'districts',
            label: 'Districts',
            icon: <Layers size={18} />,
            items: [
                { id: '1', name: 'Addis Ababa', description: 'The Capital Cluster' },
                { id: '2', name: 'Adama', description: 'East Shoa Hub' },
                { id: '3', name: 'Hawassa', description: 'Southern Star' },
                { id: '4', name: 'Bahir Dar', description: 'Northern Lakes Region' },
                { id: '5', name: 'Dire Dawa', description: 'Eastern Commercial Hub' },
            ]
        },
        subcities: {
            id: 'subcities',
            label: 'Sub-Cities',
            icon: <MapPin size={18} />,
            items: [
                { id: '1', name: 'Bole', description: 'High-end residential & commercial' },
                { id: '2', name: 'Kirkos', description: 'Central business district' },
                { id: '3', name: 'Yeka', description: 'Diplomatic and residential' },
                { id: '4', name: 'Arada', description: 'Historical center (Piassa area)' },
                { id: '5', name: 'Nifas Silk Lafto', description: 'Industrial and residential' },
                { id: '6', name: 'Kolfe Keranio', description: 'West Addis residential' },
                { id: '7', name: 'Akaki Kality', description: 'South industrial zone' },
                { id: '8', name: 'Lideta', description: 'Old Airport, Bisrate Gabriel area' },
                { id: '9', name: 'Gulele', description: 'North residential hills' },
                { id: '10', name: 'Addis Ketema', description: 'Merkato commercial hub' },
            ]
        },
        homeTypes: {
            id: 'homeTypes',
            // Must match CATEGORIES in app/(tabs)/index.tsx exactly
            label: 'Home Types',
            icon: <Home size={18} />,
            items: [
                { id: '1', name: 'Studio',     description: 'Single open-plan living space — app key: studios' },
                { id: '2', name: '1 Bed Room', description: 'Bedroom + separate living area — app key: 1bed' },
                { id: '3', name: '2 Bed Room', description: 'Standard family apartment — app key: 2bed' },
                { id: '4', name: 'Shop',        description: 'Retail and storefront spaces — app key: shop' },
                { id: '5', name: 'Cafe',        description: 'Cafe and coffee house venues — app key: cafe' },
                { id: '6', name: 'Restaurant',  description: 'Full-service dining halls — app key: restaurant' },
                { id: '7', name: 'Other',        description: 'Coworking, warehouses, etc. — app key: other' },
            ]
        }
    });

    const activeData = data[activeTab];

    const filteredItems = activeData.items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenAddModal = () => {
        setEditingItem(null);
        setNewItemName('');
        setNewItemDesc('');
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: MetadataItem) => {
        setEditingItem(item);
        setNewItemName(item.name);
        setNewItemDesc(item.description || '');
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!newItemName.trim()) return;

        const updatedData = { ...data };
        if (editingItem) {
            // Edit
            updatedData[activeTab].items = updatedData[activeTab].items.map(item => 
                item.id === editingItem.id ? { ...item, name: newItemName, description: newItemDesc } : item
            );
        } else {
            // Add
            const newItem: MetadataItem = {
                id: Math.random().toString(36).substr(2, 9),
                name: newItemName,
                description: newItemDesc
            };
            updatedData[activeTab].items = [...updatedData[activeTab].items, newItem];
        }

        setData(updatedData);
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this item? This action might affect existing listings.')) {
            const updatedData = { ...data };
            updatedData[activeTab].items = updatedData[activeTab].items.filter(item => item.id !== id);
            setData(updatedData);
        }
    };

    return (
        <section>
            <div className="view-header">
                <div className="view-title">
                    <p style={{ fontWeight: 800, color: '#9CC942', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>System Parameters</p>
                    <h1>Core Metadata.<br/><span style={{ opacity: 0.1 }}>Configuration Hub.</span></h1>
                </div>
                <button 
                    onClick={handleOpenAddModal}
                    style={{ background: '#9CC942', color: 'white', padding: '14px 40px', borderRadius: '14px', fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)', width: 'fit-content' }}>
                    <Plus size={18}/> Add New {activeData.label.slice(0, -1)}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px', alignItems: 'start' }}>
                {/* Sidebar Navigation */}
                <div style={{ background: 'white', padding: '12px', borderRadius: '24px', border: '1px solid #F1F5F9', boxShadow: 'var(--shadow-soft)' }}>
                    {Object.values(data).map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '16px 20px',
                                borderRadius: '16px',
                                fontSize: '14px',
                                fontWeight: 800,
                                marginBottom: '4px',
                                background: activeTab === tab.id ? '#F4F9EB' : 'transparent',
                                color: activeTab === tab.id ? '#9CC942' : '#64748B',
                                transition: '0.2s'
                            }}
                        >
                            <div style={{ 
                                width: '36px', 
                                height: '36px', 
                                background: activeTab === tab.id ? '#9CC942' : '#F8FAFC', 
                                borderRadius: '10px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                color: activeTab === tab.id ? 'white' : '#64748B'
                            }}>
                                {tab.icon}
                            </div>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div>
                    <div style={{ marginBottom: '32px', display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1, background: 'white', border: '1px solid #F1F5F9', padding: '12px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-soft)' }}>
                            <Search size={18} color="#64748B" />
                            <input 
                                type="text" 
                                placeholder={`Search ${activeData.label}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ border: 'none', outline: 'none', fontSize: '14px', width: '100%', fontWeight: 600 }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {filteredItems.map((item) => (
                            <div 
                                key={item.id}
                                className="stat-card-white"
                                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px' }}
                            >
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <div style={{ width: '40px', height: '40px', background: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CC942' }}>
                                            {activeData.icon}
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button 
                                                onClick={() => handleOpenEditModal(item)}
                                                style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F8FAFC', color: '#9CC942', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Edit2 size={14}/>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Trash2 size={14}/>
                                            </button>
                                        </div>
                                    </div>
                                    <h4 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '4px' }}>{item.name}</h4>
                                    <p style={{ fontSize: '13px', color: '#64748B', fontWeight: 600, lineHeight: '1.5' }}>{item.description || 'No description provided.'}</p>
                                </div>
                            </div>
                        ))}

                        {filteredItems.length === 0 && (
                            <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', background: 'white', borderRadius: '24px', border: '1px dashed #E2E8F0' }}>
                                <p style={{ color: '#64748B', fontWeight: 700 }}>No {activeData.label.toLowerCase()} found matching your search.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: 'white', width: '500px', maxWidth: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 900 }}>{editingItem ? 'Edit' : 'Add New'} {activeData.label.slice(0, -1)}</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20}/></button>
                        </div>
                        
                        <div style={{ padding: '32px' }}>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Name</label>
                                <input 
                                    type="text" 
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                    placeholder="Enter name..."
                                    style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '15px', fontWeight: 700 }}
                                />
                            </div>

                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Description</label>
                                <textarea 
                                    value={newItemDesc}
                                    onChange={(e) => setNewItemDesc(e.target.value)}
                                    placeholder="Enter short description..."
                                    rows={3}
                                    style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '15px', fontWeight: 700, resize: 'none' }}
                                />
                            </div>

                            <button 
                                onClick={handleSave}
                                style={{ width: '100%', background: '#9CC942', color: 'white', padding: '18px', borderRadius: '16px', fontSize: '15px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)' }}>
                                <Save size={18}/> {editingItem ? 'Update' : 'Save'} Entry
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default SystemMetadataView;

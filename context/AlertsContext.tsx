import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Notification {
  id: string;
  type: string;
  unread: boolean;
  title: string;
  desc: string;
  time: string;
  action?: string;
  propertyId?: string;
  dropAmount?: string;
}

const INITIAL_NOTIFS: Notification[] = [
  {
    id: '1', type: 'hot_listing', unread: true,
    title: '🔥 Hot Listing Alert',
    desc: 'A Studio in Bole just listed for 18,500 ETB — matches your saved search.',
    time: '2m ago', action: 'View Listing', propertyId: '#KN-003',
  },
  {
    id: '2', type: 'price_match', unread: true,
    title: '✅ Price Match Found',
    desc: 'New 2BR in Kazanchis at 22,000 ETB — within your 25,000 ETB budget.',
    time: '14m ago', action: 'View Listing', propertyId: '#KN-001',
  },
  {
    id: '3', type: 'price_drop', unread: false,
    title: '📉 Price Drop Alert',
    desc: 'The Summit Residency dropped from 28,000 → 25,000 ETB. That\'s 11% off!',
    time: '2h ago', action: 'See Deal', propertyId: '#KN-001',
    dropAmount: '3,000 ETB',
  },
  {
    id: '4', type: 'location_match', unread: false,
    title: '📍 New Listing in Bole',
    desc: '3 new properties added in your saved location: Bole, Addis Ababa.',
    time: '4h ago', action: 'Browse Area',
  },
  {
    id: '5', type: 'price_drop', unread: false,
    title: '📉 Price Drop Alert',
    desc: 'Modern Garden Villa dropped from 55,000 → 45,000 ETB. Act fast!',
    time: 'Yesterday', action: 'See Deal', propertyId: '#KN-002',
    dropAmount: '10,000 ETB',
  },
  {
    id: '6', type: 'system', unread: false,
    title: '🛡️ Verification Complete',
    desc: 'Your Kira-Net profile has been successfully verified. You now show the ✓ badge.',
    time: '2 days ago',
  },
  {
    id: '7', type: 'roommate', unread: false,
    title: '🤝 Roommate Request',
    desc: 'Tigist B. wants to connect — budget 12,000 ETB, Bole area, student.',
    time: '3 days ago', action: 'View Profile',
  },
];

interface AlertsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
  markAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const stored = await AsyncStorage.getItem('@kira_alerts');
        if (stored) {
          setNotifications(JSON.parse(stored));
        } else {
          setNotifications(INITIAL_NOTIFS);
        }
      } catch (e) {
        setNotifications(INITIAL_NOTIFS);
      } finally {
        setIsHydrated(true);
      }
    };
    hydrate();
  }, []);

  const saveNotifications = async (notifs: Notification[]) => {
    if (!isHydrated) return;
    try {
      await AsyncStorage.setItem('@kira_alerts', JSON.stringify(notifs));
    } catch (e) {}
  };

  const updateNotifications = (newNotifs: Notification[]) => {
    setNotifications(newNotifs);
    saveNotifications(newNotifs);
  };
  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, unread: false }));
    updateNotifications(updated);
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, unread: false } : n);
    updateNotifications(updated);
  };

  const removeNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    updateNotifications(updated);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <AlertsContext.Provider value={{ notifications, unreadCount, markAllRead, markAsRead, removeNotification }}>
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertsContext);
  if (!context) throw new Error('useAlerts must be used within an AlertsProvider');
  return context;
}

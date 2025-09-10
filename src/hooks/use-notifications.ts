
'use client';

import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { getRandomFactAction } from '@/app/actions';

const NOTIFICATION_TAG = 'wise-way-reminder';
const STORAGE_KEY = 'notifications_enabled';

export function useNotifications() {
  const { toast } = useToast();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
      const storedPreference = localStorage.getItem(STORAGE_KEY);
      setNotificationsEnabled(storedPreference === 'true' && Notification.permission === 'granted');
    }
  }, []);
  
  useEffect(() => {
    if (!isClient) return;

    const scheduleNextNotification = async () => {
        if ('serviceWorker' in navigator && 'periodicSync' in (navigator.serviceWorker.getRegistration?.() || {})) {
            // More advanced logic for service workers could go here
        } else {
             // Fallback to simple interval check
            const notificationInterval = setInterval(async () => {
                 const storedPreference = localStorage.getItem(STORAGE_KEY) === 'true';
                 if (storedPreference && Notification.permission === 'granted') {
                    const lastShown = localStorage.getItem('notification_last_shown');
                    const now = new Date();
                    const twentyFourHours = 24 * 60 * 60 * 1000;

                    if (!lastShown || now.getTime() - new Date(lastShown).getTime() > twentyFourHours) {
                        showNotification();
                    }
                }
            }, 60 * 60 * 1000); // Check every hour
            return () => clearInterval(notificationInterval);
        }
    }

    if (notificationsEnabled) {
      scheduleNextNotification();
    }
  }, [notificationsEnabled, isClient]);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast({ variant: 'destructive', title: 'Notifications not supported', description: 'Your browser does not support desktop notifications.' });
      return;
    }

    const status = await Notification.requestPermission();
    setPermission(status);

    if (status === 'granted') {
      localStorage.setItem(STORAGE_KEY, 'true');
      setNotificationsEnabled(true);
      toast({ title: 'Notifications Enabled', description: 'You will receive a daily piece of wisdom.' });
      showNotification();
    } else {
      localStorage.setItem(STORAGE_KEY, 'false');
      setNotificationsEnabled(false);
      toast({ variant: 'destructive', title: 'Notifications Denied', description: 'You have blocked notifications. You can change this in your browser settings.' });
    }
  };
  
  const showNotification = async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) return;

    let body = "A moment of wisdom is waiting for you. Open the app to explore.";
    const { fact } = await getRandomFactAction();
    if (fact) {
        body = fact;
    }

    registration.showNotification('A Moment from The wise way', {
      body,
      icon: '/icons/icon-192x192.png',
      tag: NOTIFICATION_TAG,
    });
    localStorage.setItem('notification_last_shown', new Date().toISOString());
  };

  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    localStorage.setItem(STORAGE_KEY, newState.toString());
    setNotificationsEnabled(newState);
    if (newState) {
      toast({ title: 'Notifications Enabled', description: 'You will receive a daily piece of wisdom.' });
    } else {
      toast({ title: 'Notifications Disabled', description: 'You will no longer receive reminders.' });
    }
  };

  return { permission, requestPermission, toggleNotifications, notificationsEnabled: isClient && notificationsEnabled };
}

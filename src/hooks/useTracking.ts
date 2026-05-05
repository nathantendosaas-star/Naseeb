import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { rtdb } from '@/lib/firebase';
import { ref, push, serverTimestamp, set } from 'firebase/database';
import { format } from 'date-fns';

export function useTracking() {
  const location = useLocation();

  useEffect(() => {
    const logPageView = async () => {
      try {
        // Prevent duplicate logs in the same session for the same path
        const sessionKey = `tracked_${location.pathname}`;
        if (sessionStorage.getItem(sessionKey)) return;

        const today = format(new Date(), 'yyyy-MM-dd');
        
        const visitRef = ref(rtdb, `analytics/visits/${today}`);
        const newVisitRef = push(visitRef);
        
        await set(newVisitRef, {
          path: location.pathname,
          timestamp: serverTimestamp(),
          userAgent: navigator.userAgent,
          referrer: document.referrer || 'direct'
        });

        sessionStorage.setItem(sessionKey, 'true');
      } catch (error) {
        console.error('Tracking error:', error);
      }
    };

    logPageView();
  }, [location.pathname]);
}

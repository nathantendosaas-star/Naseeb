import { useState, useEffect } from 'react';
import { 
  ref, 
  onValue, 
  push, 
  set, 
  update, 
  remove, 
  query, 
  limitToLast
} from 'firebase/database';
import { rtdb } from '../lib/firebase';

/**
 * Hook to subscribe to a Realtime Database path
 * @param path The database path (e.g. 'inquiries')
 * @param limitCount Maximum number of items to fetch
 */
export function useRealtimeDB<T>(path: string, limitCount: number = 50) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const dbRef = ref(rtdb, path);
    // Fetch last N items. RTDB keys (from push()) are chronological.
    const q = query(dbRef, limitToLast(limitCount));

    const unsubscribe = onValue(q, (snapshot) => {
      try {
        const items: T[] = [];
        snapshot.forEach((childSnapshot) => {
          items.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          } as T);
        });
        // RTDB limitToLast returns items in ascending order of push keys.
        // We reverse them to show newest first.
        setData(items.reverse());
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error(`Error processing RTDB data from ${path}:`, err);
        setError(err as Error);
        setLoading(false);
      }
    }, (err) => {
      console.error(`Error fetching RTDB data from ${path}:`, err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [path, limitCount]);

  return { data, loading, error };
}

/**
 * Utility to submit a new inquiry to Realtime Database
 * @param data The inquiry form data
 */
export async function submitInquiry(data: any) {
  const inquiriesRef = ref(rtdb, 'inquiries');
  const newInquiryRef = push(inquiriesRef);
  const inquiryData = {
    ...data,
    id: newInquiryRef.key,
    createdAt: new Date().toISOString(),
    status: 'new'
  };
  await set(newInquiryRef, inquiryData);
  return newInquiryRef.key;
}

/**
 * Utility to update an inquiry's status
 */
export async function updateInquiryStatus(id: string, status: string) {
  const inquiryRef = ref(rtdb, `inquiries/${id}`);
  await update(inquiryRef, { status });
}

/**
 * Utility to delete an inquiry
 */
export async function deleteInquiryFromRTDB(id: string) {
  const inquiryRef = ref(rtdb, `inquiries/${id}`);
  await remove(inquiryRef);
}

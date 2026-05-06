import { useQuery } from '@tanstack/react-query';
import { 
  ref, 
  get,
  push, 
  set, 
  update, 
  remove, 
  query, 
  limitToLast
} from 'firebase/database';
import { rtdb } from '../lib/firebase';
import { isAllowed } from '../lib/rateLimiter';

/**
 * Hook to subscribe to a Realtime Database path using React Query
 * @param path The database path (e.g. 'inquiries')
 * @param limitCount Maximum number of items to fetch
 */
export function useRealtimeDB<T>(path: string, limitCount: number = 50) {
  return useQuery({
    queryKey: [path, limitCount],
    queryFn: async () => {
      const dbRef = ref(rtdb, path);
      const q = query(dbRef, limitToLast(limitCount));
      const snapshot = await get(q);
      
      const items: T[] = [];
      snapshot.forEach((childSnapshot) => {
        items.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        } as T);
      });
      return items.reverse();
    },
  });
}

/**
 * Utility to submit a new inquiry to Realtime Database
 * @param data The inquiry form data
 */
export async function submitInquiry(data: any) {
  if (!isAllowed('inquiry-submit', 60000)) {
    throw new Error('Please wait at least 1 minute before submitting another inquiry.');
  }

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

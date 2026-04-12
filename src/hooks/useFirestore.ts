import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  doc
} from 'firebase/firestore';
import type { 
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useFirestoreCollection<T = DocumentData>(
  collectionName: string, 
  queryConstraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const q = query(collection(db, collectionName), ...queryConstraints);
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const items: T[] = [];
          snapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as T);
          });
          setData(items);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error(`Error fetching collection ${collectionName}:`, err);
          setError(err as Error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error(`Error setting up query for ${collectionName}:`, err);
      // Defer state update
      setTimeout(() => {
        setError(err as Error);
        setLoading(false);
      }, 0);
    }
  }, [collectionName, ...queryConstraints]); // Spread to avoid dependency warning

  return { data, loading, error };
}

export function useFirestoreDoc<T = DocumentData>(
  collectionName: string, 
  docId: string
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docId) {
      setTimeout(() => setLoading(false), 0);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, collectionName, docId), 
      (docSnap) => {
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(`Error fetching document ${collectionName}/${docId}:`, err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, docId]);

  return { data, loading, error };
}

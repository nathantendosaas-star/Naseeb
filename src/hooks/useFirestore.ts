import { useQuery } from '@tanstack/react-query';
import {
  collection,
  query,
  doc,
  getDocs,
  getDoc,
  limit as firestoreLimit
} from 'firebase/firestore';
import type {
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useFirestoreCollection<T = DocumentData>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = [],
  maxResults: number = 100
) {
  return useQuery({
    queryKey: [collectionName, queryConstraints, maxResults],
    queryFn: async () => {
      const q = query(
        collection(db, collectionName),
        ...queryConstraints,
        firestoreLimit(maxResults)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    },
  });
}

export function useFirestoreDoc<T = DocumentData>(
  collectionName: string,
  docId: string
) {
  return useQuery({
    queryKey: [collectionName, docId],
    queryFn: async () => {
      if (!docId) return null;
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    },
    enabled: !!docId,
  });
}

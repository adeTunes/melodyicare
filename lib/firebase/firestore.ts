import {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  Timestamp,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  type QueryConstraint,
  type Unsubscribe,
  type DocumentData,
} from 'firebase/firestore'
import { db } from './config'

/**
 * Recursively strips `undefined` values from an object.
 * Firebase Firestore does not accept `undefined` as a field value.
 */
function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  const clean = {} as Record<string, unknown>
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      clean[key] = value.map((item) =>
        item !== null && typeof item === 'object' && !(item instanceof Timestamp)
          ? stripUndefined(item as Record<string, unknown>)
          : item
      )
    } else if (value !== null && typeof value === 'object' && !(value instanceof Timestamp)) {
      clean[key] = stripUndefined(value as Record<string, unknown>)
    } else {
      clean[key] = value
    }
  }
  return clean as T
}

export async function getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
  const ref = doc(db, collectionName, docId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as T
}

export async function getDocuments<T>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> {
  const ref = collection(db, collectionName)
  const q = constraints.length > 0 ? query(ref, ...constraints) : query(ref)
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T)
}

export async function createDocument<T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<string> {
  const ref = collection(db, collectionName)
  const docRef = await addDoc(ref, stripUndefined({
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }))
  return docRef.id
}

export async function setDocument<T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T
): Promise<void> {
  const ref = doc(db, collectionName, docId)
  await setDoc(ref, stripUndefined({
    ...data,
    updatedAt: serverTimestamp(),
  }))
}

export async function updateDocument(
  collectionName: string,
  docId: string,
  data: DocumentData
): Promise<void> {
  const ref = doc(db, collectionName, docId)
  await updateDoc(ref, stripUndefined({
    ...data,
    updatedAt: serverTimestamp(),
  }))
}

export async function removeDocument(collectionName: string, docId: string): Promise<void> {
  const ref = doc(db, collectionName, docId)
  await deleteDoc(ref)
}

export function subscribeToDocument<T>(
  collectionName: string,
  docId: string,
  callback: (data: T | null) => void
): Unsubscribe {
  const ref = doc(db, collectionName, docId)
  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) {
      callback(null)
      return
    }
    callback({ id: snap.id, ...snap.data() } as T)
  })
}

export function subscribeToCollection<T>(
  collectionName: string,
  callback: (data: T[]) => void,
  ...constraints: QueryConstraint[]
): Unsubscribe {
  const ref = collection(db, collectionName)
  const q = constraints.length > 0 ? query(ref, ...constraints) : query(ref)
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T))
  })
}

export {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  Timestamp,
}

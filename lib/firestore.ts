import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type {
  User,
  ServiceProvider,
  Service,
  Booking,
  ProviderSettings,
  Review,
} from './types';

// Collections
export const COLLECTIONS = {
  USERS: 'users',
  PROVIDERS: 'providers',
  SERVICES: 'services',
  BOOKINGS: 'bookings',
  SETTINGS: 'provider_settings',
  REVIEWS: 'reviews',
} as const;

// User operations
export const createUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
      ...userData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.USERS),
      where('email', '==', email)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as User;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Provider operations
export const createProvider = async (
  providerData: Omit<ServiceProvider, 'id' | 'createdAt'>
) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PROVIDERS), {
      ...providerData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// New function to create provider with custom ID
export const createProviderWithId = async (
  providerId: string,
  providerData: Omit<ServiceProvider, 'id' | 'createdAt'>
) => {
  try {
    const docRef = doc(db, COLLECTIONS.PROVIDERS, providerId);
    await setDoc(docRef, {
      ...providerData,
      createdAt: Timestamp.now(),
    });
    return providerId;
  } catch (error) {
    throw error;
  }
};

export const getProvider = async (
  providerId: string
): Promise<ServiceProvider | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.PROVIDERS, providerId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ServiceProvider;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const getProviderByUserId = async (
  userId: string
): Promise<ServiceProvider | null> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.PROVIDERS),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const provider = { id: doc.id, ...doc.data() } as ServiceProvider;
      return provider;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const getAllProviders = async (): Promise<ServiceProvider[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.PROVIDERS),
      where('isActive', '==', true)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ServiceProvider[];
  } catch (error) {
    throw error;
  }
};

// Service operations
export const createService = async (
  serviceData: Omit<Service, 'id' | 'createdAt'>
) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.SERVICES), {
      ...serviceData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getServicesByProvider = async (
  providerId: string
): Promise<Service[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.SERVICES),
      where('providerId', '==', providerId),
      where('isActive', '==', true)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Service[];
  } catch (error) {
    throw error;
  }
};

export const getService = async (
  serviceId: string
): Promise<Service | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.SERVICES, serviceId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Service;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Booking operations
export const createBooking = async (
  bookingData: Omit<Booking, 'id' | 'createdAt'>
) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.BOOKINGS), {
      ...bookingData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getBooking = async (
  bookingId: string
): Promise<Booking | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Booking;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const getBookingsByProvider = async (
  providerId: string
): Promise<Booking[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.BOOKINGS),
      where('providerId', '==', providerId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const bookings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Booking[];

    return bookings;
  } catch (error) {
    // Return empty array instead of throwing to prevent dashboard crash
    return [];
  }
};

export const getBookingsByDate = async (
  providerId: string,
  date: string
): Promise<Booking[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.BOOKINGS),
      where('providerId', '==', providerId),
      where('date', '==', date),
      where('status', 'in', ['pending', 'confirmed'])
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Booking[];
  } catch (error) {
    throw error;
  }
};

export const updateBooking = async (
  bookingId: string,
  updates: Partial<Booking>
) => {
  try {
    const docRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    throw error;
  }
};

export const deleteBooking = async (bookingId: string) => {
  try {
    const docRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
    await deleteDoc(docRef);
  } catch (error) {
    throw error;
  }
};

// Provider settings operations
export const createProviderSettings = async (
  settingsData: Omit<ProviderSettings, 'id' | 'createdAt'>
) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.SETTINGS), {
      ...settingsData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getProviderSettings = async (
  providerId: string
): Promise<ProviderSettings | null> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.SETTINGS),
      where('providerId', '==', providerId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as ProviderSettings;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const updateProviderSettings = async (
  settingsId: string,
  updates: Partial<ProviderSettings>
) => {
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, settingsId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    throw error;
  }
};

// Review operations
export const createReview = async (
  reviewData: Omit<Review, 'id' | 'createdAt'>
) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.REVIEWS), {
      ...reviewData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getReviewsByProvider = async (
  providerId: string
): Promise<Review[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.REVIEWS),
      where('providerId', '==', providerId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Review[];
  } catch (error) {
    throw error;
  }
};

import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Product, StoreProfile } from '../types';
import { INITIAL_PRODUCTS, DEFAULT_STORE_PROFILE } from '../data/sampleProducts';

const PRODUCTS_COLLECTION = 'products';
const STORE_COLLECTION = 'store';
const STORE_PROFILE_DOC = 'profile';

/**
 * Subscribes to real-time changes in the 'products' collection.
 * Automatically seeds the database if empty on first boot.
 */
export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (error: Error) => void
): () => void {
  const colRef = collection(db, PRODUCTS_COLLECTION);

  return onSnapshot(
    colRef,
    async (snapshot) => {
      // If collection is completely empty, seed it with default sample products
      if (snapshot.empty) {
        try {
          await seedInitialProducts();
        } catch (err) {
          console.error('Error seeding initial products:', err);
        }
        return;
      }

      const products: Product[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        products.push({
          id: docSnap.id,
          name: data.name || '',
          category: data.category || 'Lainnya',
          price: Number(data.price) || 0,
          originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
          stock: Number(data.stock) || 0,
          sku: data.sku || docSnap.id,
          imageUrl: data.imageUrl || '',
          description: data.description || '',
          features: Array.isArray(data.features) ? data.features : [],
          isFeatured: Boolean(data.isFeatured),
          unit: data.unit || 'pcs'
        });
      });

      // Sort by isFeatured first, then name
      products.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return a.name.localeCompare(b.name, 'id');
      });

      onUpdate(products);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, PRODUCTS_COLLECTION);
    }
  );
}

/**
 * Subscribes to real-time changes in the 'store/profile' document.
 * Automatically seeds default profile if missing.
 */
export function subscribeToStoreProfile(
  onUpdate: (profile: StoreProfile) => void,
  onError?: (error: Error) => void
): () => void {
  const profileDocRef = doc(db, STORE_COLLECTION, STORE_PROFILE_DOC);

  return onSnapshot(
    profileDocRef,
    async (docSnap) => {
      if (!docSnap.exists()) {
        try {
          await setDoc(profileDocRef, DEFAULT_STORE_PROFILE);
        } catch (err) {
          console.error('Error creating default store profile:', err);
        }
        return;
      }

      const data = docSnap.data();
      const profile: StoreProfile = {
        name: data.name || DEFAULT_STORE_PROFILE.name,
        tagline: data.tagline || DEFAULT_STORE_PROFILE.tagline,
        whatsapp: data.whatsapp || DEFAULT_STORE_PROFILE.whatsapp,
        location: data.location || DEFAULT_STORE_PROFILE.location,
        workingHours: data.workingHours || DEFAULT_STORE_PROFILE.workingHours,
        announcement: data.announcement ?? DEFAULT_STORE_PROFILE.announcement,
        bankInfo: data.bankInfo ?? DEFAULT_STORE_PROFILE.bankInfo,
        adminPin: data.adminPin || DEFAULT_STORE_PROFILE.adminPin || '1234'
      };

      onUpdate(profile);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, `${STORE_COLLECTION}/${STORE_PROFILE_DOC}`);
    }
  );
}

/**
 * Seeds initial products into Firestore using a batch write.
 */
export async function seedInitialProducts(): Promise<void> {
  const path = PRODUCTS_COLLECTION;
  try {
    const batch = writeBatch(db);
    for (const prod of INITIAL_PRODUCTS) {
      const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
      const data: Record<string, any> = {
        id: prod.id,
        name: prod.name,
        category: prod.category,
        price: Number(prod.price) || 0,
        stock: Number(prod.stock) || 0,
        sku: prod.sku,
        imageUrl: prod.imageUrl,
        description: prod.description,
        features: prod.features || [],
        isFeatured: Boolean(prod.isFeatured),
        unit: prod.unit || 'pcs'
      };
      if (prod.originalPrice) {
        data.originalPrice = Number(prod.originalPrice);
      }
      batch.set(docRef, data);
    }
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Saves (creates or updates) a product in Firestore.
 */
export async function saveProductToFirestore(product: Product): Promise<void> {
  const docPath = `${PRODUCTS_COLLECTION}/${product.id}`;
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
    const data: Record<string, any> = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: Number(product.price) || 0,
      stock: Number(product.stock) || 0,
      sku: product.sku || product.id,
      imageUrl: product.imageUrl || '',
      description: product.description || '',
      features: Array.isArray(product.features) ? product.features : [],
      isFeatured: Boolean(product.isFeatured),
      unit: product.unit || 'pcs'
    };

    if (product.originalPrice && Number(product.originalPrice) > 0) {
      data.originalPrice = Number(product.originalPrice);
    }

    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

/**
 * Deletes a product from Firestore.
 */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const docPath = `${PRODUCTS_COLLECTION}/${productId}`;
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

/**
 * Updates stock of a product in Firestore.
 */
export async function updateProductStockInFirestore(productId: string, newStock: number): Promise<void> {
  const docPath = `${PRODUCTS_COLLECTION}/${productId}`;
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, { stock: Math.max(0, newStock) });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

/**
 * Saves store profile to Firestore.
 */
export async function saveStoreProfileToFirestore(profile: StoreProfile): Promise<void> {
  const docPath = `${STORE_COLLECTION}/${STORE_PROFILE_DOC}`;
  try {
    const docRef = doc(db, STORE_COLLECTION, STORE_PROFILE_DOC);
    await setDoc(docRef, profile, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

/**
 * Resets the entire Firestore database back to sample defaults.
 */
export async function resetFirestoreToDefaults(): Promise<void> {
  try {
    // 1. Delete all existing products
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(colRef);
    const batch = writeBatch(db);
    snapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    // 2. Add default products
    for (const prod of INITIAL_PRODUCTS) {
      const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
      batch.set(docRef, prod);
    }
    // 3. Reset profile
    const profileRef = doc(db, STORE_COLLECTION, STORE_PROFILE_DOC);
    batch.set(profileRef, DEFAULT_STORE_PROFILE);

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, PRODUCTS_COLLECTION);
  }
}

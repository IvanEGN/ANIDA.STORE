/**
 * Motor de persistencia ultrarresistente basado en IndexedDB nativo.
 * A diferencia de localStorage (que colapsa al superar ~5MB con imágenes en base64),
 * IndexedDB permite almacenar cientos de megabytes de imágenes, prendas y banners
 * sin perder nada al recargar o cerrar el navegador.
 */

const DB_NAME = "anida_store_db_v1";
const STORE_NAME = "store_keyval";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB no está disponible en este entorno."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function getStorageItem<T>(key: string, defaultValue: T): Promise<T> {
  if (typeof window === "undefined") return defaultValue;

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => {
        if (req.result !== undefined && req.result !== null) {
          resolve(req.result as T);
        } else {
          // Fallback a localStorage por retrocompatibilidad
          try {
            const localVal = localStorage.getItem(key);
            if (localVal) {
              const parsed = JSON.parse(localVal);
              resolve(parsed as T);
              return;
            }
          } catch (_) {}
          resolve(defaultValue);
        }
      };

      req.onerror = () => {
        resolve(defaultValue);
      };
    });
  } catch (error) {
    console.warn(`[Storage] Error al leer la clave ${key}, usando valor por defecto:`, error);
    return defaultValue;
  }
}

export async function setStorageItem<T>(key: string, value: T): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);

      req.onsuccess = () => {
        // También respaldamos en localStorage versiones ligeras
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (_) {
          // Si localStorage da QuotaExceededError, se ignora porque IndexedDB ya lo guardó de forma segura
        }
        resolve(true);
      };

      req.onerror = () => {
        console.error(`[Storage] Error al guardar ${key} en IndexedDB`, req.error);
        resolve(false);
      };
    });
  } catch (error) {
    console.error(`[Storage] Excepción al guardar ${key}:`, error);
    return false;
  }
}

export async function removeStorageItem(key: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);

      req.onsuccess = () => {
        try {
          localStorage.removeItem(key);
        } catch (_) {}
        resolve(true);
      };

      req.onerror = () => resolve(false);
    });
  } catch (_) {
    return false;
  }
}

export async function clearAllStoreData(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();

      req.onsuccess = () => {
        try {
          localStorage.removeItem("anida_products_v3");
          localStorage.removeItem("anida_banners_v3");
          localStorage.removeItem("anida_orders_v3");
          localStorage.removeItem("anida_size_requests_v3");
          localStorage.removeItem("anida_products_v4");
          localStorage.removeItem("anida_banners_v4");
          localStorage.removeItem("anida_orders_v4");
          localStorage.removeItem("anida_size_requests_v4");
        } catch (_) {}
        resolve(true);
      };

      req.onerror = () => resolve(false);
    });
  } catch (_) {
    return false;
  }
}

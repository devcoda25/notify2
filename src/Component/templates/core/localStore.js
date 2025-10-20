// Path: src/Component/templates/core/localStore.js

export function saveToLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function readFromLocal(key) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}

export function removeLocal(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* no-op */
  }
}

const LocalStore = { saveToLocal, readFromLocal, removeLocal };
export default LocalStore;
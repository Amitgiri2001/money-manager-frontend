import { useEffect, useState } from 'react';

const storageKey = 'money-manager:selected-user-id';

export function useSelectedUser() {
  const [userId, setUserIdState] = useState<number>(() => {
    const storedValue = window.localStorage.getItem(storageKey);
    return storedValue ? Number(storedValue) : 1;
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, String(userId));
  }, [userId]);

  return {
    userId,
    setUserId: setUserIdState,
  };
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const useStorage = (key: string) => {
  const [storedValue, setStoredValue] = useState<any>(null);

  const getValue = async () => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        setStoredValue(JSON.parse(value));
      }
    } catch (error) {
      console.error('Error retrieving data from storage', error);
    }
  };

  const setValue = async (value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      setStoredValue(value);
    } catch (error) {
      console.error('Error saving data to storage', error);
    }
  };

  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem(key);
      setStoredValue(null);
    } catch (error) {
      console.error('Error removing data from storage', error);
    }
  };

  useEffect(() => {
    getValue();
  }, []);

  return { storedValue, setValue, removeValue };
};

export default useStorage;
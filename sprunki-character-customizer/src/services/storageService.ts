import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@sprunki_character_customizations';

export const saveCustomizations = async (customizations) => {
    try {
        const jsonValue = JSON.stringify(customizations);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
        console.error('Failed to save customizations:', e);
    }
};

export const loadCustomizations = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error('Failed to load customizations:', e);
        return null;
    }
};

export const clearCustomizations = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error('Failed to clear customizations:', e);
    }
};
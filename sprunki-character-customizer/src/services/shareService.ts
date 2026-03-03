import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export const shareCharacterCustomization = async (characterData: any) => {
    const fileUri = `${FileSystem.documentDirectory}characterCustomization.json`;
    
    // Write character data to a file
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(characterData));

    // Share the file
    if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
    } else {
        alert("Sharing is not available on this platform.");
    }
};
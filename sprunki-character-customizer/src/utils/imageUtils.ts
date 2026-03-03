import { Image } from 'react-native';

export const resizeImage = async (uri: string, width: number, height: number): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const image = await createImageFromBlob(blob);
    const resizedImage = await manipulateImage(image, width, height);
    return resizedImage;
};

const createImageFromBlob = async (blob: Blob): Promise<Image> => {
    // Logic to create an Image from a Blob
};

const manipulateImage = async (image: Image, width: number, height: number): Promise<string> => {
    // Logic to resize the image
};

export const getImageUri = (imageName: string): string => {
    return `${Image.resolveAssetSource(imageName).uri}`;
};
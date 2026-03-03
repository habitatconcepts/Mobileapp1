import { useContext } from 'react';
import { GalleryContext } from '../context/GalleryContext';

const useGallery = () => {
    const { galleryState, addCharacterToGallery, removeCharacterFromGallery } = useContext(GalleryContext);

    const isCharacterInGallery = (characterId) => {
        return galleryState.some(character => character.id === characterId);
    };

    return {
        galleryState,
        addCharacterToGallery,
        removeCharacterFromGallery,
        isCharacterInGallery,
    };
};

export default useGallery;
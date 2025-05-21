import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface ImageModification {
  prompt: string;
  imageUrl: string;
  createdAt: string;
}

export interface ImageItem {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
  model: string;
  size: string;
  modifications: ImageModification[];
}

interface ImageStore {
  images: ImageItem[];
  addImage: (prompt: string, imageUrl: string, model: string, size: string) => void;
  addModification: (imageId: string, prompt: string, imageUrl: string) => void;
  deleteImage: (id: string) => void;
  clearHistory: () => void;
}

// Initialize the store with data from localStorage if available
const getInitialState = (): ImageItem[] => {
  if (typeof window === 'undefined') return [];
  
  const saved = localStorage.getItem('imageHistory');
  return saved ? JSON.parse(saved) : [];
};

const MAX_HISTORY_LENGTH = 10; // Define the maximum number of images to store

export const useImageStore = create<ImageStore>((set, get) => ({
  images: getInitialState(),
  
  addImage: (prompt, imageUrl, model, size) => {
    const newImage: ImageItem = {
      id: uuidv4(),
      prompt,
      imageUrl,
      createdAt: new Date().toISOString(),
      model,
      size,
      modifications: [],
    };
    
    set((state) => {
      let updatedImages = [newImage, ...state.images];
      // Enforce history limit
      if (updatedImages.length > MAX_HISTORY_LENGTH) {
        updatedImages = updatedImages.slice(0, MAX_HISTORY_LENGTH);
      }
      // Save to localStorage
      localStorage.setItem('imageHistory', JSON.stringify(updatedImages));
      return { images: updatedImages };
    });
  },
  
  addModification: (imageId, prompt, imageUrl) => {
    set((state) => {
      const images = state.images.map((image) => {
        if (image.id === imageId) {
          const modification: ImageModification = {
            prompt,
            imageUrl,
            createdAt: new Date().toISOString(),
          };
          return {
            ...image,
            modifications: [modification, ...image.modifications],
          };
        }
        return image;
      });
      
      // Save to localStorage
      localStorage.setItem('imageHistory', JSON.stringify(images));
      return { images };
    });
  },
  
  deleteImage: (id) => {
    set((state) => {
      const images = state.images.filter((image) => image.id !== id);
      // Save to localStorage
      localStorage.setItem('imageHistory', JSON.stringify(images));
      return { images };
    });
  },
  
  clearHistory: () => {
    localStorage.removeItem('imageHistory');
    set({ images: [] });
  },
}));

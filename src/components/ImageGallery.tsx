'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useImageStore } from '@/lib/store';
import type { ImageItem } from '@/lib/store';
import { FiTrash2, FiDownload, FiEye } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import type { ImageModalProps } from './ImageModal.tsx';

// Dynamically import the ImageModal component to avoid circular dependencies
const ImageModal = dynamic<ImageModalProps>(() => import('./ImageModal').then(mod => mod.default), { ssr: false });

export default function ImageGallery() {
  const { images, deleteImage } = useImageStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageData, setSelectedImageData] = useState<ImageItem | null>(null);

  const handleDeleteImage = (id: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      deleteImage(id);
    }
  };

  const handleDownload = (imageUrl: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-forge-${prompt.slice(0, 20).replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openImageModal = (imageUrl: string, imageData: ImageItem) => {
    setSelectedImage(imageUrl);
    setSelectedImageData(imageData);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setSelectedImageData(null);
  };

  if (images.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Image Gallery</h2>
        <div className="p-8 text-gray-500 dark:text-gray-400">
          <p>No images generated yet. Use the form to create your first image!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Your Image Gallery</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">{images.length} images</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="group relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={image.imageUrl}
                alt={image.prompt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(image.imageUrl, image.prompt)}
                  className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
                  title="Download"
                >
                  <FiDownload size={16} />
                </button>
                <button
                  onClick={() => openImageModal(image.imageUrl, image)}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500"
                  title="View details"
                >
                  <FiEye size={16} />
                </button>
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-500"
                  title="Delete"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="p-3 border-t border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{image.prompt}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {new Date(image.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {selectedImage && selectedImageData && (
        <div key="modal-wrapper">
          <ImageModal
            imageUrl={selectedImage}
            imageData={selectedImageData}
            onClose={closeImageModal}
          />
        </div>
      )}
    </div>
  );
}

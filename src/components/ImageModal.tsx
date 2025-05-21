'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useImageStore, ImageItem } from '@/lib/store';
import { editImage, ImageSize } from '@/lib/openai';
import toast from 'react-hot-toast';
import { FiX, FiDownload } from 'react-icons/fi';

export interface ImageModalProps {
  imageUrl: string;
  imageData: ImageItem;
  onClose: () => void;
}

export default function ImageModal({ imageUrl, imageData, onClose }: ImageModalProps) {
  const [tab, setTab] = useState<'details' | 'modify' | 'history'>('details');
  const [modifyPrompt, setModifyPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [size, setSize] = useState<ImageSize>('1024x1024');
  const { addModification } = useImageStore();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-forge-${imageData.prompt.slice(0, 20).replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleModify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!modifyPrompt.trim()) {
      toast.error('Please enter a modification prompt');
      return;
    }
    
    setIsProcessing(true);
    const loadingToast = toast.loading('Modifying image...');
    
    try {
      // The editImage function likely expects the full data URL or handles stripping the prefix itself.
      const result = await editImage({
        image: imageUrl, // Using imageUrl directly
        prompt: modifyPrompt,
        size,
      });
      
      if (result && result.length > 0 && result[0].b64_json) {
        const newImageUrl = `data:image/png;base64,${result[0].b64_json}`;
        addModification(imageData.id, modifyPrompt, newImageUrl);
        toast.success('Image modified successfully!', { id: loadingToast });
        setModifyPrompt('');
        setTab('history');
      } else {
        toast.error('Failed to modify image', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error modifying image:', error);
      toast.error('Error modifying image. Please try again.', { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Image Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setTab('details')}
              className={`px-4 py-2 rounded-md ${
                tab === 'details'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setTab('modify')}
              className={`px-4 py-2 rounded-md ${
                tab === 'modify'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Modify
            </button>
            <button
              onClick={() => setTab('history')}
              className={`px-4 py-2 rounded-md ${
                tab === 'history'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              History
              {imageData.modifications.length > 0 && (
                <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {imageData.modifications.length}
                </span>
              )}
            </button>
          </div>
          
          <div className="mt-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {tab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={imageData.prompt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Prompt</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{imageData.prompt}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Model</h3>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">GPT-Image-1</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Size</h3>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">{imageData.size}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {new Date(imageData.createdAt).toLocaleString()}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    <FiDownload className="mr-2" />
                    Download Image
                  </button>
                </div>
              </div>
            )}
            
            {tab === 'modify' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="aspect-square relative rounded-lg overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={imageData.prompt}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  
                  <form onSubmit={handleModify} className="space-y-4">
                    <div>
                      <label htmlFor="modifyPrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Modification Prompt
                      </label>
                      <textarea
                        id="modifyPrompt"
                        rows={4}
                        value={modifyPrompt}
                        onChange={(e) => setModifyPrompt(e.target.value)}
                        placeholder="Describe how you want to modify this image..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                        disabled={isProcessing}
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="modifySize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Output Size
                      </label>
                      <select
                        id="modifySize"
                        value={size}
                        onChange={(e) => setSize(e.target.value as ImageSize)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        disabled={isProcessing}
                      >
                        <option value="1024x1024">1024x1024 (Square)</option>
                        <option value="1792x1024">1792x1024 (Landscape)</option>
                        <option value="1024x1792">1024x1792 (Portrait)</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                        disabled={isProcessing || !modifyPrompt.trim()}
                      >
                        {isProcessing ? 'Processing...' : 'Modify with Prompt'}
                      </button>
                    </div>
                  </form>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Note:</strong> Image modifications are processed using GPT-Image-1. For best results, be specific in your modification prompt.
                  </p>
                </div>
              </div>
            )}
            
            {tab === 'history' && (
              <div className="space-y-4">
                {imageData.modifications.length === 0 ? (
                  <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                    <p>No modifications have been made to this image yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {imageData.modifications.map((mod, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                        <div className="aspect-square relative rounded-lg overflow-hidden">
                          <Image
                            src={mod.imageUrl}
                            alt={mod.prompt}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Modification Prompt</h3>
                            <p className="mt-1 text-sm text-gray-900 dark:text-white">{mod.prompt}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</h3>
                            <p className="mt-1 text-sm text-gray-900 dark:text-white">
                              {new Date(mod.createdAt).toLocaleString()}
                            </p>
                          </div>
                          
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = mod.imageUrl;
                              link.download = `ai-forge-${mod.prompt.slice(0, 20).replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <FiDownload className="mr-1" size={14} />
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

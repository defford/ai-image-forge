'use client';

import { useState } from 'react';
import { useImageStore } from '@/lib/store';
import { generateImage, ImageSize, ImageModel, ImageBackground, ImageModeration, ImageQuality, ImageOutputFormat } from '@/lib/openai';
import toast from 'react-hot-toast';

interface GenerateImageParams {
  prompt: string;
  model: ImageModel;
  size: ImageSize;
  background: ImageBackground;
  moderation: ImageModeration;
  quality: ImageQuality;
  output_format: ImageOutputFormat;
  output_compression: number;
}

export default function PromptForm() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [model, /* setModel */] = useState<ImageModel>('gpt-image-1');
  const [size, setSize] = useState<ImageSize>('1024x1024');
  const [background, setBackground] = useState<ImageBackground>('auto');
  const [moderation, setModeration] = useState<ImageModeration>('auto');
  const [quality, setQuality] = useState<ImageQuality>('auto');
  const [outputFormat, setOutputFormat] = useState<ImageOutputFormat>('png');
  const [outputCompression, setOutputCompression] = useState<number>(100);
  
  const { addImage } = useImageStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const loadingToast = toast.loading('Generating your image...');
      
      const params: GenerateImageParams = {
        prompt,
        model,
        size,
        background,
        moderation,
        quality,
        output_format: outputFormat,
        output_compression: outputCompression,
      };
      
      const images = await generateImage(params);
      
      if (images && images.length > 0 && images[0].b64_json) {
        const imageUrl = `data:image/png;base64,${images[0].b64_json}`;
        addImage(prompt, imageUrl, model, size);
        toast.success('Image generated successfully!', { id: loadingToast });
        setPrompt('');
      } else {
        toast.error('Failed to generate image', { id: loadingToast });
      }

    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Error generating image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Generate Image</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Prompt
          </label>
          <textarea
            id="prompt"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A majestic mountain landscape at sunset..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
            disabled={isGenerating}
          ></textarea>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Size
            </label>
            <select
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value as ImageSize)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isGenerating}
            >
              <option value="auto">Auto (Recommended)</option>
              <option value="1024x1024">1024x1024 (Square)</option>
              <option value="1792x1024">1792x1024 (Landscape)</option>
              <option value="1024x1792">1024x1792 (Portrait)</option>
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="background" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Background
          </label>
          <select
            id="background"
            value={background}
            onChange={(e) => setBackground(e.target.value as ImageBackground)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isGenerating}
          >
            <option value="auto">Auto</option>
            <option value="transparent">Transparent</option>
            <option value="opaque">Opaque</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="moderation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Content Moderation
          </label>
          <select
            id="moderation"
            value={moderation}
            onChange={(e) => setModeration(e.target.value as ImageModeration)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isGenerating}
          >
            <option value="auto">Auto</option>
            <option value="low">Low</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="quality" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quality
          </label>
          <select
            id="quality"
            value={quality}
            onChange={(e) => setQuality(e.target.value as ImageQuality)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isGenerating}
          >
            <option value="auto">Auto</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="outputFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Output Format
          </label>
          <select
            id="outputFormat"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value as ImageOutputFormat)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isGenerating}
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WebP</option>
          </select>
        </div>
        
        {(outputFormat === 'webp' || outputFormat === 'jpeg') && (
          <div>
            <label htmlFor="outputCompression" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Compression ({outputCompression}%)
            </label>
            <input
              type="range"
              id="outputCompression"
              min="1"
              max="100"
              value={outputCompression}
              onChange={(e) => setOutputCompression(parseInt(e.target.value))}
              className="w-full"
              disabled={isGenerating}
            />
          </div>
        )}
        
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? 'Generating...' : 'Generate Image'}
        </button>
      </form>
    </div>
  );
}

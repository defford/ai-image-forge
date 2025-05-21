import OpenAI from 'openai';

// Initialize the OpenAI client with the API key
// In production, this should come from environment variables
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only for development
});

export type ImageSize = '1024x1024' | '1536x1024' | '1024x1536' | '256x256' | '512x512' | 'auto';
export type ImageModel = 'gpt-image-1'; 
export type ImageQuality = 'standard' | 'hd' | 'high' | 'medium' | 'low' | 'auto';
export type ImageResponseFormat = 'url' | 'b64_json';
export type ImageBackground = 'transparent' | 'opaque' | 'auto';
export type ImageModeration = 'low' | 'auto';
export type ImageOutputFormat = 'png' | 'jpeg' | 'webp';

export interface GenerateImageParams {
  prompt: string;
  background?: ImageBackground;
  model?: ImageModel; 
  moderation?: ImageModeration;
  n?: number;
  output_compression?: number;
  output_format?: ImageOutputFormat;
  quality?: ImageQuality;
  size?: ImageSize;
  user?: string;
}

export interface EditImageParams {
  image: string | string[]; 
  prompt: string;
  background?: ImageBackground;
  mask?: string; 
  model?: ImageModel; 
  n?: number;
  quality?: ImageQuality;
  size?: ImageSize;
  user?: string;
}

export interface VariationImageParams {
  image: string; 
  n?: number;
  size?: '1024x1024' | '256x256' | '512x512'; 
  response_format?: ImageResponseFormat;
  user?: string;
}

export async function generateImage({
  prompt,
  background = 'auto',
  model = 'gpt-image-1', 
  moderation = 'auto',
  n = 1,
  output_compression,
  output_format = 'png',
  quality = 'auto',
  size = 'auto',
  user,
}: GenerateImageParams) {
  try {
    const requestParams: any = { prompt };
    
    if (n) requestParams.n = n;
    if (user) requestParams.user = user;
    
    requestParams.model = 'gpt-image-1'; 
    
    if (background) requestParams.background = background;
    if (moderation) requestParams.moderation = moderation;
    if (output_compression) requestParams.output_compression = output_compression;
    if (output_format) requestParams.output_format = output_format;
    
    if (size === 'auto' || ['1024x1024', '1536x1024', '1024x1536'].includes(size)) {
      requestParams.size = size;
    } else {
      requestParams.size = 'auto'; 
    }
    
    if (quality === 'auto' || ['high', 'medium', 'low'].includes(quality)) {
      requestParams.quality = quality;
    } else {
      requestParams.quality = 'auto'; 
    }
    
    const response = await openai.images.generate(requestParams);
    return response.data;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

export async function editImage({
  image,
  prompt,
  background = 'auto',
  mask,
  model = 'gpt-image-1', 
  n = 1,
  quality = 'auto',
  size = '1024x1024',
  user,
}: EditImageParams) {
  try {
    const requestParams: any = { prompt };
    
    requestParams.model = 'gpt-image-1';
    
    if (n) requestParams.n = n;
    if (user) requestParams.user = user;
    
    if (Array.isArray(image)) {
      requestParams.image = image.map((img, index) => base64ToFile(img, `image_${index}.png`));
    } else {
      requestParams.image = base64ToFile(image, 'image.png');
    }
    
    if (background) requestParams.background = background;
    
    if (size === 'auto' || ['1024x1024', '1536x1024', '1024x1536'].includes(size)) {
      requestParams.size = size;
    } else {
      requestParams.size = 'auto';
    }
    
    if (quality === 'auto' || ['high', 'medium', 'low'].includes(quality)) {
      requestParams.quality = quality;
    } else {
      requestParams.quality = 'auto';
    }
    
    if (mask) {
      requestParams.mask = base64ToFile(mask, 'mask.png');
    }
    
    const response = await openai.images.edit(requestParams);
    return response.data;
  } catch (error) {
    console.error('Error editing image:', error);
    throw error;
  }
}

/*
export async function createVariation({
  image,
  n = 1,
  size = '1024x1024',
  response_format = 'b64_json',
  user,
}: VariationImageParams) {
  try {
    const imageFile = base64ToFile(image, 'image.png');
    
    let validSize = size;
    if (!['256x256', '512x512', '1024x1024'].includes(size)) {
      validSize = '1024x1024';
    }

    const requestParams: any = {
      image: imageFile,
      n,
      size: validSize,
      response_format
    };
    
    if (user) {
      requestParams.user = user;
    }

    const response = await openai.images.createVariation(requestParams);
    return response.data;
  } catch (error) {
    console.error('Error creating variation:', error);
    throw error;
  }
}
*/

function base64ToFile(base64String: string, filename: string): File {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

# AI Image Forge

A private, passcode-protected web application for generating and modifying images using OpenAI's Image Generation API.

## Features

- **Passcode Protection**: Secure access to the application
- **Text-to-Image Generation**: Create images from text prompts using OpenAI's `gpt-image-1` model.
- **Image Modification**: Edit existing images or create variations using the `gpt-image-1` model.
- **Image History**: View and manage previously generated images.
- **Local Storage**: Saves generated images to the browser's localStorage, storing up to the 10 most recent images to manage space.

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **API Integration**: OpenAI API (focused on `gpt-image-1` for image generation and edits)
- **UI Components**: React Icons, React Hot Toast

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- OpenAI API key with access to OpenAI's Image Generation API (model: `gpt-image-1`).

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following content:

```
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Using the Application

1. Enter the passcode on the login screen (default: `forge2025`)
2. Use the prompt form to generate images
3. View and manage your generated images in the gallery
4. Click on an image to view details, modify it, or see its modification history

## Deployment

This application can be deployed to Vercel with minimal configuration:

```bash
npm run build
```

Be sure to set the environment variables in your Vercel project settings.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

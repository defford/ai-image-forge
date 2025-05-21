#!/bin/bash

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "Creating .env.local file with placeholder for OpenAI API key"
  echo "NEXT_PUBLIC_OPENAI_API_KEY=your_api_key_here" > .env.local
  echo "⚠️ Please edit .env.local and add your actual OpenAI API key before running the app"
fi

# Start the development server
npm run dev

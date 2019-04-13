# image-upload-demo

This Express app is an Image Gallery demo application for demonstrating how to add image upload support.

## Features
- File upload using [Multer](https://github.com/expressjs/multer).
- Resizes images and converts them to JPEG format using [Sharp](https://github.com/lovell/sharp).
- Uploads images to [Cloudinary](https://cloudinary.com) for storage.

## Getting Started
- Install dependencies
  ```
  npm install
  ```
- Create an `.env` file in the project directory and set appropriate values for the environment variables.
  ```
  DB_CONNECTION=
  CLOUDINARY_API_NAME=
  CLOUDINARY_API_KEY=
  CLOUDINARY_API_SECRET=
  ```
- Run the app
  ```
  npm run dev
  ```
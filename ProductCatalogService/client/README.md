# Product Catalog Client

This is the frontend client for the ProductCatalog Service, a RESTful API that manages a catalog of products.

## Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Environment Configuration

The application uses environment variables for configuration:

- `.env` - Used for local development
- `.env.production` - Used for production builds

You can modify these files to change the API URL for different environments.

## Building for Production

```bash
# Build the application
npm run build

# Preview the production build locally
npm run preview
```

## Deployment

To deploy this application:

1. Update the `.env.production` file with your production API URL
2. Build the application: `npm run build`
3. Deploy the contents of the `dist` directory to your web server or hosting service

## API Connection

The client connects to the ProductCatalog API. Make sure the API is running and accessible at the URL specified in your environment configuration.

## Features

- Browse products with image, name, description, price, and stock information
- View detailed product information
- Add new products
- Edit existing products
- Delete products

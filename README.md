# Frenzy AI Collection Widget

A React + TypeScript widget for Shopify collection pages that provides advanced search and filtering capabilities using the Shopify Storefront GraphQL API.

## Features

- **Brand & Product Type Filters**: Filter products by brand and product type
- **Continuous Scroll**: Infinite scroll for better user experience
- **Price Sorting**: Sort products by price (low to high, high to low)
- **Responsive Design**: Works on desktop and mobile devices
- **Product Cards**: Display product title, price, image with click-through to product pages

  ## Live Preview
- **URL:** https://essential-ayrton.myshopify.com/collections/automated-collection  
- **Password:** **thaoly** (6 characters, no spaces)

## Alignment with the Assessment
- **Goal:** Build a search & filter widget for Shopify **collection pages**.
- **Where it runs:** A normal **Shopify Liquid** store (the widget renders products client-side; no Liquid product loops).
- **Components delivered:** 2 filters (**Brand** and **Product Type**), **continuous scroll**, **price sort (Low→High / High→Low)**, and a **product card** (Title, Price, Image, click-through).
- **Data source:** **Shopify Storefront GraphQL API**.
- **Build:** **Vite + React + TypeScript**; installed and tested on a **Shopify Dev Store** (see preview above).
- **Context (from brief):** Built to support an AI-driven discovery experience; the widget is designed to integrate with intelligent ranking/filtering pipelines by composing precise Storefront queries.

## Setup

### 1. Environment Variables

Create a `.env` file in the project root:

```env
VITE_SHOPIFY_DOMAIN=your-shop.myshopify.com
VITE_STOREFRONT_TOKEN=your-storefront-access-token
VITE_API_VERSION=2024-04
```

### 2. Get Shopify Storefront Access Token

1. Go to your Shopify Admin → Apps → App and sales channel settings
2. Click "Develop apps" → "Create an app"
3. Configure Storefront API access with the following permissions:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_tags`
4. Install the app and copy the Storefront access token

### 3. Build the Widget

```bash
npm install
npm run build
```

This creates the widget files in the `dist/` directory:
- `widget.js` - The widget JavaScript
- `widget.css` - The widget styles

## Installation on Shopify

### Method 1: Liquid Theme Integration

Add the following code to your collection template (e.g., `templates/collection.liquid`):

```liquid
<!-- Include the widget CSS -->
<link rel="stylesheet" href="{{ 'widget.css' | asset_url }}">

<!-- Widget container -->
<div id="frenzy-collection-widget" data-collection-handle="{{ collection.handle }}"></div>

<!-- Include the widget JS -->
<script src="{{ 'widget.js' | asset_url }}"></script>
```

### Method 2: Upload to Assets

1. Upload `widget.css` and `widget.js` to your theme's `assets/` folder
2. Add the integration code to your collection template

### Method 3: CDN Integration

1. Upload the files to a CDN or your own server
2. Update the file paths in the integration code

## Usage

The widget automatically:
- Loads products from the specified collection
- Provides filtering by brand and product type
- Enables price sorting
- Implements infinite scroll
- Links to individual product pages

### Widget Attributes

- `data-collection-handle`: The handle of the collection to display (required)

## Development

### Local Development

```bash
npm run dev
```

### Testing

Open `test-widget.html` in a browser to test the widget locally.

### Build

```bash
npm run build
```

## Troubleshooting

### Common Issues

1. **Widget not loading**: Check browser console for errors
2. **No products showing**: Verify collection handle and Shopify credentials
3. **Styling conflicts**: The widget uses scoped styles to avoid conflicts
4. **CORS errors**: Ensure your Shopify domain is correctly configured

### Debug Mode

The widget includes console logging for debugging. Check the browser console for:
- Widget mounting status
- API request/response details
- Error messages

## Design Decisions

### Technical Choices

- **React + TypeScript**: For type safety and modern development experience
- **Tailwind CSS**: For utility-first styling with minimal conflicts
- **Shopify Storefront API**: For direct product data access
- **Intersection Observer**: For efficient infinite scroll implementation

### Trade-offs

- **React + TypeScript with hooks** (no global state lib) → simpler, smaller bundle

-**Runtime configuration from Liquid** (data-* + window.__FRENZY_CONFIG__) → avoids bundling secrets

-**Minimal, responsive UI** designed to blend with themes; Tailwind optional

-**Explicit error messages** to speed up debugging in the Theme Editor

-**Widget approach**: Self-contained but requires manual integration

## Browser Support

- Modern browsers with ES2022 support
- Intersection Observer API support
- CSS Grid and Flexbox support

## License

MIT License

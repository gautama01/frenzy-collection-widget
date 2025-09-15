# Shopify Integration - JSON Templates

## Created Files

### 1. **Widget Section** (`frenzy-widget.liquid`)
- Custom section file for Shopify
- Includes full widget configuration
- Schema for the Shopify theme editor

### 2. **Collection Template** (`collection.frenzy.json`)
- JSON template that uses the new section
- Ready-to-use configuration

### 3. **Widget Assets** (`dist/`)
- `widget.css` - Widget styles
- `widget.js` - Widget JavaScript

## Installation Instructions

### Step 1: Upload Files to Shopify

1. **Upload the section:**
   - Copy `frenzy-widget.liquid` to `sections/frenzy-widget.liquid` in your theme

2. **Upload the assets:**
   - Copy `dist/widget.css` to `assets/widget.css`
   - Copy `dist/widget.js` to `assets/widget.js`

3. **Upload the template (optional):**
   - Copy `collection.frenzy.json` to `templates/collection.frenzy.json`

### Step 2: Configure the Widget

1. Go to the **Theme Editor** in your Shopify Admin  
2. Select your theme and click **Customize**  
3. Go to a collection page  
4. Add the section **"Frenzy Collection Widget"**  
5. Configure the following fields:  

#### Required Configuration:
- **Storefront Access Token**: Your Storefront API access token  
- **API Version**: `2024-04` (recommended)  

#### Optional Configuration:
- **Default Collection**: Default collection if none is specified  
- **Products per page**: Number of products per page (6-24)  
- **Desktop/Mobile columns**: Number of columns  
- **Enable filters**: Enable/disable specific filters  

### Step 3: Get Storefront Access Token

1. Go to **Apps** in your Shopify Admin  
2. Create a new app or use an existing one  
3. Configure Storefront API with these permissions:  
   - `unauthenticated_read_product_listings`  
   - `unauthenticated_read_product_inventory`  
   - `unauthenticated_read_product_tags`  
4. Install the app and copy the Storefront access token  

## Widget Usage

### On Collection Pages:
The widget automatically loads with the current collection.  

### On Other Pages:
You can manually add the section and specify a default collection.  

### Features:
- **Brand and product type filters**  
- **Infinite scroll**  
- **Price sorting**  
- **Responsive design**  
- **Configuration from the theme editor**  

## Customization

### Change Styles:
Modify `assets/widget.css` or add custom CSS in the theme editor.  

### Change Behavior:
Modify `assets/widget.js` (requires JavaScript/React knowledge).  

### Advanced Configuration:
Use the schema in `frenzy-widget.liquid` to add more configuration options.  

## Troubleshooting

### Widget does not load:
1. Verify the Storefront Access Token is correct  
2. Check the browser console for errors  
3. Ensure the CSS and JS files are uploaded correctly  

### No products appear:
1. Verify that the collection has products  
2. Check Storefront API permissions  
3. Ensure the collection is public  

### Style issues:
1. The widget uses scoped styles to avoid conflicts  
2. If conflicts occur, add custom CSS with higher specificity  

## Responsive Design

The widget is fully responsive:  
- **Desktop**: 2-5 columns (configurable)  
- **Mobile**: 1-2 columns (configurable)  
- **Tablet**: Automatically adapts  

## Security

- The Storefront Access Token is safe for public use  
- Does not expose sensitive admin data  
- Only allows reading of public product data  

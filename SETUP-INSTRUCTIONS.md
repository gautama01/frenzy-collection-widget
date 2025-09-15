# Frenzy Widget - Setup Instructions

## Fixed Error: "storefront_token default cannot be blank"

The error was resolved by removing the default token value and adding validation.

## Installation Steps

### 1. Upload Files to Shopify

```
sections/frenzy-widget.liquid ← Copy from frenzy-widget.liquid
assets/widget.css ← Copy from dist/widget.css
assets/widget.js ← Copy from dist/widget.js
templates/collection.frenzy.json ← Copy from collection.frenzy.json
```

### 2. Configure the Token (REQUIRED)

1. Go to the Theme Editor in Shopify Admin  
2. Select your theme and click "Customize"  
3. Go to Collection pages  
4. Add the section "Frenzy Collection Widget"  
5. Configure the field "Storefront Access Token" with your real token  

### 3. Get Storefront Access Token

1. Go to Apps in Shopify Admin  
2. Create a new app or use an existing one  
3. Configure Storefront API with these permissions:  
   - `unauthenticated_read_product_listings`  
   - `unauthenticated_read_product_inventory`  
   - `unauthenticated_read_product_tags`  
4. Install the app and copy the Storefront access token  

## Widget Configuration

### Required Fields:
- **Storefront Access Token** - Your Storefront API token  

### Optional Fields:
- **API Version** - `2024-04` (recommended)  
- **Default Collection** - Default collection  
- **Products per page** - 6-24 products  
- **Desktop/Mobile columns** - Number of columns  
- **Enable filters** - Enable/disable filters  

## Automatic Validation

The widget now includes automatic validation:

- **If the token is configured**: The widget works normally  
- **If the token is empty**: A configuration required message is shown  
- **Clear instructions**: It tells you exactly where to configure the token  

## Configuration Message

If you do not configure the token, you will see:

```
⚠️ Configuration Required
Please configure the Storefront Access Token in the theme editor.
Go to Customize → Collection pages → Frenzy Collection Widget → Storefront Access Token
```

## Ready to Use

Once the token is configured:

1. The widget loads automatically  
2. Displays products from the current collection  
3. Filters and sorting work  
4. Infinite scroll is active  
5. Responsive design  

## Troubleshooting

### Widget does not load:
- Verify that the Storefront Access Token is configured  
- Check the browser console for errors  
- Make sure the files are uploaded correctly  

### No products appear:
- Verify that the collection has products  
- Check Storefront API permissions  
- Make sure the collection is public  

## Final Notes

All files are ready and the configuration error is fixed. You just need to:

1. Upload the files to Shopify  
2. Configure the token in the theme editor  
3. Done! Ready to use  

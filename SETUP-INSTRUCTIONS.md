# 🚀 Instrucciones de Configuración - Frenzy Widget

## ⚠️ Error Corregido: "storefront_token default cannot be blank"

El error se ha solucionado eliminando el valor por defecto del token y agregando validación.

## 📋 Pasos de Instalación

### 1. **Subir Archivos a Shopify**

```
sections/frenzy-widget.liquid  ← Copia desde frenzy-widget.liquid
assets/widget.css              ← Copia desde dist/widget.css
assets/widget.js               ← Copia desde dist/widget.js
templates/collection.frenzy.json ← Copia desde collection.frenzy.json
```

### 2. **Configurar el Token (REQUERIDO)**

1. **Ve al Editor de Temas** en Shopify Admin
2. **Selecciona tu tema** y haz clic en "Customize"
3. **Ve a Collection pages**
4. **Agrega la sección "Frenzy Collection Widget"**
5. **Configura el campo "Storefront Access Token"** con tu token real

### 3. **Obtener Storefront Access Token**

1. **Ve a Apps** en Shopify Admin
2. **Crea una nueva app** o usa una existente
3. **Configura Storefront API** con estos permisos:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_tags`
4. **Instala la app** y copia el Storefront access token

## 🔧 Configuración del Widget

### Campos Requeridos:
- ✅ **Storefront Access Token** - Tu token de la Storefront API

### Campos Opcionales:
- **API Version** - `2024-04` (recomendado)
- **Default Collection** - Colección por defecto
- **Products per page** - 6-24 productos
- **Desktop/Mobile columns** - Número de columnas
- **Enable filters** - Activar/desactivar filtros

## 🎯 Validación Automática

El widget ahora incluye validación automática:

- ✅ **Si el token está configurado**: El widget funciona normalmente
- ⚠️ **Si el token está vacío**: Muestra mensaje de configuración requerida
- 🔧 **Instrucciones claras**: Te dice exactamente dónde configurar el token

## 📱 Mensaje de Configuración

Si no configuras el token, verás:

```
⚠️ Configuration Required
Please configure the Storefront Access Token in the theme editor.
Go to Customize → Collection pages → Frenzy Collection Widget → Storefront Access Token
```

## 🚀 Listo para Usar

Una vez configurado el token:

1. **El widget se carga automáticamente**
2. **Muestra productos de la colección actual**
3. **Filtros y ordenamiento funcionan**
4. **Scroll infinito activo**
5. **Diseño responsivo**

## 🔍 Troubleshooting

### Widget no se carga:
- Verifica que el Storefront Access Token esté configurado
- Revisa la consola del navegador para errores
- Asegúrate de que los archivos estén subidos correctamente

### No aparecen productos:
- Verifica que la colección tenga productos
- Revisa los permisos de la Storefront API
- Verifica que la colección sea pública

## ✅ Archivos Listos

Todos los archivos están listos y el error de configuración está corregido. Solo necesitas:

1. **Subir los archivos** a Shopify
2. **Configurar el token** en el editor de temas
3. **¡Listo para usar!**

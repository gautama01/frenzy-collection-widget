# Integración en Shopify - Templates JSON

## 📁 Archivos Creados

### 1. **Sección del Widget** (`frenzy-widget.liquid`)
- Archivo de sección personalizada para Shopify
- Incluye configuración completa del widget
- Schema para el editor de temas de Shopify

### 2. **Template de Colección** (`collection.frenzy.json`)
- Template JSON que usa la nueva sección
- Configuración lista para usar

### 3. **Assets del Widget** (`dist/`)
- `widget.css` - Estilos del widget
- `widget.js` - JavaScript del widget

## 🚀 Instrucciones de Instalación

### Paso 1: Subir Archivos a Shopify

1. **Sube la sección:**
   - Copia `frenzy-widget.liquid` a `sections/frenzy-widget.liquid` en tu tema

2. **Sube los assets:**
   - Copia `dist/widget.css` a `assets/widget.css`
   - Copia `dist/widget.js` a `assets/widget.js`

3. **Sube el template (opcional):**
   - Copia `collection.frenzy.json` a `templates/collection.frenzy.json`

### Paso 2: Configurar el Widget

1. **Ve al Editor de Temas** en tu Shopify Admin
2. **Selecciona tu tema** y haz clic en "Customize"
3. **Ve a una página de colección**
4. **Agrega la sección "Frenzy Collection Widget"**
5. **Configura los siguientes campos:**

#### Configuración Requerida:
- **Storefront Access Token**: Tu token de acceso de la Storefront API
- **API Version**: `2024-04` (recomendado)

#### Configuración Opcional:
- **Default Collection**: Colección por defecto si no se especifica
- **Products per page**: Número de productos por página (6-24)
- **Desktop/Mobile columns**: Número de columnas
- **Enable filters**: Activar/desactivar filtros específicos

### Paso 3: Obtener Storefront Access Token

1. **Ve a Apps** en tu Shopify Admin
2. **Crea una nueva app** o usa una existente
3. **Configura Storefront API** con estos permisos:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_tags`
4. **Instala la app** y copia el Storefront access token

## 🎯 Uso del Widget

### En Páginas de Colección:
El widget se carga automáticamente con la colección actual.

### En Otras Páginas:
Puedes agregar la sección manualmente y especificar una colección por defecto.

### Características:
- ✅ **Filtros por marca y tipo de producto**
- ✅ **Scroll infinito**
- ✅ **Ordenamiento por precio**
- ✅ **Diseño responsivo**
- ✅ **Configuración desde el editor de temas**

## 🔧 Personalización

### Cambiar Estilos:
Modifica `assets/widget.css` o agrega CSS personalizado en el editor de temas.

### Cambiar Comportamiento:
Modifica `assets/widget.js` (requiere conocimientos de JavaScript/React).

### Configuración Avanzada:
Usa el schema en `frenzy-widget.liquid` para agregar más opciones de configuración.

## 🐛 Troubleshooting

### Widget no se carga:
1. Verifica que el Storefront Access Token sea correcto
2. Revisa la consola del navegador para errores
3. Asegúrate de que los archivos CSS y JS estén subidos correctamente

### No aparecen productos:
1. Verifica que la colección tenga productos
2. Revisa los permisos de la Storefront API
3. Verifica que la colección sea pública

### Problemas de estilo:
1. El widget usa estilos scoped para evitar conflictos
2. Si hay conflictos, agrega CSS personalizado con mayor especificidad

## 📱 Responsive Design

El widget es completamente responsivo:
- **Desktop**: 2-5 columnas (configurable)
- **Mobile**: 1-2 columnas (configurable)
- **Tablet**: Se adapta automáticamente

## 🔒 Seguridad

- El Storefront Access Token es seguro para uso público
- No expone datos sensibles del admin
- Solo permite lectura de productos públicos

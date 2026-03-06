# Hotsale Tracking Pixel — hotsale.com.co
Aquí estará la información necesaria para instalar los pixeles que van a permitir medir el impacto en ROI de eventos de la CCCE para múltiples plataformas.

Sistema de tracking de conversiones cross-domain para el evento Hotsale Colombia.
Captura compras realizadas en sitios de aliados atribuidas a tráfico de Hotsale.

## ¿Cómo funciona?
```
Campaña Hotsale → Usuario llega al aliado con UTM
                          ↓
             Tag 1 detecta UTM y guarda en localStorage
                          ↓
              Usuario compra → Thank you page
                          ↓
         Tag 2 lee localStorage → dispara a 3 destinos:
              Google Sheet · GA4 · Meta Pixel
```

## Destinos de datos

| Destino | Propósito | Confiabilidad |
|---|---|---|
| Google Sheet (Apps Script) | Fuente de verdad | ~85% |
| GA4 | Análisis en tiempo real | ~75% |
| Meta Pixel | Optimización de campañas | ~60% |

## Instalación por plataforma

| Plataforma | Tag 1 | Tag 2 | Guía |
|---|---|---|---|
| Shopify | theme.liquid | Customer Events | [ver](platforms/shopify.md) |
| Shopify Plus | theme.liquid | Customer Events | [ver](platforms/shopify-plus.md) |
| VTEX | GTM — All Pages | GTM — Thank You | [ver](platforms/vtex.md) |
| Otros / GTM | GTM — All Pages | GTM — Thank You | [ver](platforms/enterprise.md) |

## Keywords de detección activas
```javascript
var keywords = ['hotsale', 'hot_sale', 'hot-sale', 'ccce'];
```

Cualquier UTM que contenga alguna de estas keywords activa el pixel.

## Variables a reemplazar

Antes de instalar, reemplazar en todos los archivos:

| Variable | Valor |
|---|---|
| `G-XXXXXXXXXX` | GA4 Measurement ID de Hotsale |
| `XXXXXXXXXXXXXXXXX` | Meta Pixel ID de Hotsale |
| `YOUR_SCRIPT_ID` | ID del Apps Script web app |

## Contacto técnico

Dudas de implementación: [email]

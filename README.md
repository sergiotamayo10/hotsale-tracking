# Hotsale Tracking Pixel — hotsale.com.co

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

| Plataforma | Place | Pixel |
|---|---|---|
| Shopify | theme.liquid | [ver](Pixels/Pixel%201-All%20pages.html) | 
| Shopify | Customer Events | [ver](Pixels/Pixel%202%20Shopify-Customer%20events.js) |
| VTEX / Otros / GTM | All Pages | [ver](Pixels/Pixel%201-All%20pages.html) |
| VTEX / Otros / GTM | Confirmation page | [ver](Pixels/Pixel%202%20GTM%20-Confirm%20page.html) |
Ver videos tutoriales de instalación: https://foxly.link/tutoriales_pixels_hotsale

### Keywords de detección activas
```javascript
var hotsaleKeywords = [
    'hotsale', 'hot_sale', 'hot-sale', 'hot.sale', 'hotsale2026', 'hotsale_2026', 'hotsale-2026', 'hs2026', 'hs_2026', 'hs-2026', 'hotsale_mar', 'hotsale_marzo', 'hotsalemarzo', 'hotsale_oct', 'hotsale_octubre', 'hotsaleoct', 'hotsaleco', 'hotsale_co', 'hotsalecolombia', 'ccce', 'ccceco', 'ccce2026', 'hotsael', 'hotslae', 'hotsalee', 'epsilon'
  ];
```
### Keywords de exclusión de tráfico
 ```javascript
  var foreignKeywords = [
    'newsletter', 'crm', 'email', 'sms', 'push', 'push_notification', 'whatsapp', 'telegram', 'facebook', 'instagram', 'cpc', 'paid', 'always_on', 'brand_always_on', 'pago', 'pauta', 'tiktok', 'pinterest', 'fb', 'ig', 'social', 'ppc'
  ];
```
### Keywords de detección de referral hotsale
```javascript
  var referrerDomains = [
    'hotsale.com.co', 'www.hotsale.com.co',
    'hotsale.co',     'www.hotsale.co'
  ];
```


# Modelo de Atribución — Hotsale Tracking Pixel:
ATTRIBUTION MODEL — Hotsale Tracking 2026

MODELO: Last Non-Direct Click  |  CRÉDITO: 100% Hotsale  |  SPLIT: Ninguno


VENTANA DE ATRIBUCIÓN
──────────────────────
Basada en sesión (localStorage)

  Usuario llega de Hotsale  →  compra  →  Hotsale lo lleva
  Usuario cierra y vuelve   →  compra  →  Hotsale NO lo lleva


COBERTURA POR SEÑAL DE DETECCIÓN
referrer+utm      ████████████████████  ~50%  (máxima confianza)
referrer_only     ████████████░░░░░░░░  ~35%  (alta confianza)
utm+no_foreign    ████░░░░░░░░░░░░░░░░  ~15%  (confianza media)
sin señal         ░░░░░░░░░░░░░░░░░░░░   ~0%  → cupones únicamente


LO QUE ESTE MODELO NO RECLAMA
✗  Conversiones asistidas   (vio Hotsale, volvió por Google)
✗  Influencia post-evento   (compró 3 días después)
✗  Split con campañas del ally

LIMITACIONES:
✅ CAPTURA
   Usuario llega con UTM Hotsale → compra en la misma sesión
   Usuario llega → navega varias páginas → compra (misma sesión)
   Usuario llega por Meta Ad con UTM → compra (mismo dispositivo)

⚠️  CAPTURA PARCIALMENTE
   Usuario llega → cierra → vuelve días después
   (localStorage persiste pero sessionStorage no)

❌ NO CAPTURA
   Cross-device (ve en móvil, compra en desktop)
   Safari ITP agresivo (borra localStorage en 7 días)
   Checkout en subdominio sin acceso a localStorage del main domain
   Plataformas con WAF que bloquean el fetch al Apps Script


Jerarquía de Confiabilidad por Destino
SHEET (Apps Script)     ████████████████████  ~85% de conversiones reales
GA4                     ███████████████░░░░░  ~75% (bloqueado en algunos enterprise)
Meta Pixel              ████████████░░░░░░░░  ~60% (ad blockers + CSP + iOS)

## Contacto técnico

Dudas de implementación: sergio@upsellmarketing.co

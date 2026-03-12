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

| Plataforma | Tag 1 | Tag 2 | Guía |
|---|---|---|---|
| Shopify | theme.liquid | [ver](Pixels/Pixel%201-All%20pages.html) |
| Shopify | Customer Events | [ver](Pixels/Pixel%202%20Shopify-Customer%20events.js) |
| VTEX / Otros / GTM | All Pages | [ver](Pixels/Pixel%201-All%20pages.html) |
| VTEX / Otros / GTM | Confirmation page | [ver](Pixels/Pixel%202%20GTM%20-Confirm%20page.html) |

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
┌─────────────────────────────────────────────────────────────────┐
│                    FUENTES DE TRÁFICO                           │
│         Meta Ads · Google Ads · Email · Orgánico               │
└──────────────────────┬──────────────────────────────────────────┘
                       │ UTM parameters
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                   HOTSALE.COM.CO                                │
│              (punto de entrada obligatorio)                     │
│         Todo el tráfico hacia aliados pasa por aquí            │
└──────────────────────┬──────────────────────────────────────────┘
                       │ redirect → referrer = hotsale.com.co
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ALLY STORE                                   │
│                                                                 │
│   TAG 1 — theme.liquid / GTM All Pages                         │
│   ┌─────────────────────────────────────────────────────┐      │
│   │                                                     │      │
│   │   CONDITION B (primary)                             │      │
│   │   referrer === hotsale.com.co?                      │      │
│   │          │                                          │      │
│   │          ├── YES → DETECTED ✅                      │      │
│   │          │         detection_signal: referrer_only  │      │
│   │          │         or referrer+utm                  │      │
│   │          │                                          │      │
│   │          └── NO (referrer dropped)                  │      │
│   │                    │                                │      │
│   │               CONDITION A                           │      │
│   │               UTM contains Hotsale keyword?         │      │
│   │                    │                                │      │
│   │                    ├── NO  → NOT DETECTED ❌        │      │
│   │                    │                                │      │
│   │                    └── YES                          │      │
│   │                          │                          │      │
│   │                     CONDITION C                     │      │
│   │                     Foreign keyword in              │      │
│   │                     source/medium?                  │      │
│   │                          │                          │      │
│   │                          ├── YES → NOT DETECTED ❌  │      │
│   │                          │        (ally's own       │      │
│   │                          │         campaign)        │      │
│   │                          │                          │      │
│   │                          └── NO  → DETECTED ✅      │      │
│   │                                   detection_signal: │      │
│   │                                   utm+no_foreign    │      │
│   │                                                     │      │
│   │   Stores in localStorage + sessionStorage:          │      │
│   │   utm_source · utm_medium · utm_campaign            │      │
│   │   store_domain · referrer · detection_signal        │      │
│   │   landed_at                                         │      │
│   └─────────────────────────────────────────────────────┘      │
│                       │                                         │
│                       │ usuario navega y compra                 │
│                       ▼                                         │
│   TAG 2 — Customer Events / GTM Thank You Page                 │
│   ┌─────────────────────────────────────────────────────┐      │
│   │ Reads localStorage → validates hsData exists        │      │
│   │ Reads order_id · order_value from dataLayer          │      │
│   └─────────────────────────────────────────────────────┘      │
└──────────────────────┬──────────────────────────────────────────┘
                       │ conversión confirmada
                       ▼
┌────────────────────────────────────────────────────────────────┐
│                  TRES DESTINOS EN PARALELO                     │
│                                                                │
│  ┌─────────────────┐ ┌──────────────┐ ┌─────────────────────┐  │
│  │  Google Sheet   │ │     GA4      │ │     Meta Pixel      │  │
│  │  (Apps Script)  │ │  (Hotsale)   │ │     (Hotsale)       │  │
│  │                 │ │              │ │                     │  │
│  │ • Fecha         │ │ • purchase   │ │ • Purchase event    │  │
│  │ • store_domain  │ │ • order_id   │ │ • value · currency  │  │
│  │ • detection_    │ │ • value      │ │ • store_domain      │  │
│  │   signal        │ │ • currency   │ │ • utm_source        │  │
│  │ • utm_source    │ │ • utm_source │ │ • utm_campaign      │  │
│  │ • utm_medium    │ │ • utm_medium │ │                     │  │
│  │ • utm_campaign  │ │ • campaign   │ │                     │  │
│  │ • referrer      │ │ • domain     │ │                     │  │
│  │ • order_id      │ │ • det_signal │ │                     │  │
│  │ • order_value   │ │              │ │                     │  │
│  │ • converted_at  │ │              │ │                     │  │
│  └────────┬────────┘ └──────┬───────┘ └──────────┬──────────┘  │
└───────────┼─────────────────┼────────────────────┼─────────────┘
            ▼                 ▼                    ▼
     Siempre llega      Llega si no          Llega si no
     zero infra         bloqueado            bloqueado
     dependence         por CSP/WAF          por iOS/adblock


Señal de atribución:
┌──────────────────────────────────────────────────────────────┐
│  TIPO: Last Touch — Session Scoped — Multi-Signal            │
│                                                              │
│  Señales en orden de prioridad:                              │
│                                                              │
│  1. REFERRER (B) — strongest                                 │
│     Prueba física de paso por hotsale.com.co                 │
│     Confiabilidad: ~100% cuando está presente                │
│     Frecuencia: ~65% de sesiones                             │
│                                                              │
│  2. UTM + NO FOREIGN (A AND C) — fallback                    │
│     Keyword Hotsale en UTM + ausencia de señales del aliado  │
│     Confiabilidad: ~85% cuando está presente                 │
│     Frecuencia: ~20% adicional de sesiones                   │
│                                                              │
│  Gate: B OR (A AND C)                                        │
│                                                              │
│  Ventana de atribución: duración del localStorage            │
│  (persiste hasta compra o cierre de navegador incógnito)     │
└──────────────────────────────────────────────────────────────┘

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

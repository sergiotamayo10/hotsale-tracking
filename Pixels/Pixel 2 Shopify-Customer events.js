analytics.subscribe('checkout_completed', (event) => {
  // ── CONFIG ──────────────────────────────────────────────
  var GA4_ID          = 'G-CD4K6VN4YV';
  var META_PIXEL_ID   = '8614226731956808';
  var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbydRbTiMXNk8_yzuVMPcyMMlDv1_XG4zt5CO9tJPMqgIDMjRrg_gfp2o5Br4S3W-gGc/exec';
  // ────────────────────────────────────────────────────────

  // 1. RECOVER SESSION
  var hsData = null;
  try {
    var raw = sessionStorage.getItem('hotsale_data') || localStorage.getItem('hotsale_data');
    if (raw) hsData = JSON.parse(raw);
  } catch(e) {}
  if (!hsData) return;

  // 2. VALIDATE — must have at least one UTM to confirm Hotsale session
  var utmSource   = hsData.utm_source   || '';
  var utmMedium   = hsData.utm_medium   || '';
  var utmCampaign = hsData.utm_campaign || '';
  var utmContent  = hsData.utm_content  || '';
  var utmTerm     = hsData.utm_term     || '';
  var utmId       = hsData.utm_id       || '';
  var storeDomain = hsData.store_domain || event.data.checkout.shop?.domain || '';

  if (!utmSource && !utmMedium && !utmCampaign && !utmContent && !utmTerm && !utmId) return;

  // 3. ORDER DATA — from Shopify Customer Events API
  var checkout   = event.data.checkout;
  var orderId    = checkout.order.id;
  var orderValue = parseFloat(checkout.totalPrice.amount);
  var currency   = checkout.totalPrice.currencyCode;

  // 4. APPS SCRIPT → GOOGLE SHEET
  try {
    fetch(APPS_SCRIPT_URL, {
      method:    'POST',
      body:      JSON.stringify({
        store_domain: storeDomain,
        utm_source:   utmSource,
        utm_medium:   utmMedium,
        utm_campaign: utmCampaign,
        utm_content:  utmContent,
        utm_term:     utmTerm,
        utm_id:       utmId,
        order_id:     orderId,
        order_value:  orderValue
      }),
      keepalive: true,
      mode:      'no-cors'
    }).then(function() {}).catch(function() {});
  } catch(e) {}

  // 5. GA4 — wait for script load before firing
  function fireGA4() {
    try {
      window.dataLayer = window.dataLayer || [];
      if (!window.gtag) {
        window.gtag = function() { window.dataLayer.push(arguments); };
      }
      window.gtag('config', GA4_ID, { send_page_view: false });
      window.gtag('event', 'purchase', {
        send_to:        GA4_ID,
        transaction_id: orderId,
        value:          orderValue,
        currency:       currency,
        utm_source:     utmSource,
        utm_medium:     utmMedium,
        utm_campaign:   utmCampaign,
        utm_content:    utmContent,
        utm_term:       utmTerm,
        utm_id:         utmId,
        store_domain:   storeDomain
      });
    } catch(e) {}
  }

  if (!document.querySelector('script[src*="googletagmanager.com/gtag"]')) {
    var gScript   = document.createElement('script');
    gScript.async = true;
    gScript.src   = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    gScript.onload = function() {
      window.gtag('js', new Date());
      fireGA4();
    };
    document.head.appendChild(gScript);
  } else {
    var ga4Tries = 0;
    var ga4Timer = setInterval(function() {
      if (typeof window.gtag === 'function') {
        clearInterval(ga4Timer);
        fireGA4();
      } else if (++ga4Tries > 20) {
        clearInterval(ga4Timer);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        fireGA4();
      }
    }, 100);
  }

  // 6. META PIXEL — full snippet + onload safety
  function fireMetaPixel() {
    try {
      fbq('init', META_PIXEL_ID);
      fbq('track', 'Purchase', {
        value:        orderValue,
        currency:     currency,
        content_type: 'product',
        order_id:     orderId,
        content_url:  storeDomain
      });
    } catch(e) {}
  }

  if (!window.fbq) {
    !function(f,b,e,v,n,t,s){
      if(f.fbq)return;
      n=f.fbq=function(){ n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments); };
      if(!f._fbq) f._fbq=n;
      n.push=n; n.loaded=!0; n.version='2.0'; n.queue=[];
      t=b.createElement(e); t.async=!0; t.src=v;
      t.onload = function() { fireMetaPixel(); };
      s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s);
    }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  } else {
    fireMetaPixel();
  }

  // 7. CLEANUP
  try {
    localStorage.removeItem('hotsale_data');
    sessionStorage.removeItem('hotsale_data');
  } catch(e) {}
});
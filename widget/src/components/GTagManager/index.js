export const initGTagManager = () => {
  const existingGTMScript = document.querySelector(
    'script[src*="googletagmanager.com/gtm.js"]'
  );
  if (existingGTMScript) {
    sendCustomEvent('accessibility_activated', {
      user_action: 'activate_accessibility',
    });
    return false;
  }

  if (document.querySelector('script[src*="GTM-5LHV4QL8"]')) {
    return false;
  }

  const script = document.createElement('script');
  script.async = true;
  script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='vlibrasDataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','vlibrasDataLayer','GTM-5LHV4QL8');`;

  document.head.appendChild(script);

  const noscript = document.createElement('noscript');
  noscript.innerHTML = `
    <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5LHV4QL8"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>
  `;
  document.body.insertBefore(noscript, document.body.firstChild);

  return true;
};

function sendCustomEvent(eventName, eventData = {}) {
  window.vlibrasDataLayer = window.vlibrasDataLayer || [];
  const siteData = {
    site_domain: window.location.hostname,
    page_url: window.location.href,
    date: new Date().toISOString(),
  };
  const combinedData = {
    event: eventName,
    ...siteData,
    ...eventData,
  };
  window.vlibrasDataLayer.push(combinedData);
}

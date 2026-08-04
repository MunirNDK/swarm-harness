import Script from 'next/script';

/**
 * Google Tag Manager container for Daniells Auto Care.
 *
 * GTM is the delivery layer for the custom events pushed by `./track.ts` —
 * that module writes to `window.dataLayer`, this one loads the container that
 * reads it. Without this component the framework still fills `dataLayer`, but
 * nothing ships the events to GTM.
 */
export const GTM_ID = 'GTM-WWV7K53K';

/**
 * Head snippet. Rendered with `afterInteractive` so the container loads as soon
 * as the page is usable without blocking first paint. The inline snippet seeds
 * `window.dataLayer`, so events pushed before the container finishes loading
 * are still queued and replayed.
 */
export function GoogleTagManager(): JSX.Element {
  return (
    <Script id="gtm-base" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

/**
 * Body fallback for browsers with JavaScript disabled. Must stay immediately
 * after the opening `<body>` tag.
 */
export function GoogleTagManagerNoScript(): JSX.Element {
  return (
    <noscript
      dangerouslySetInnerHTML={{
        __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
      }}
    />
  );
}

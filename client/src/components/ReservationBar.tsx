import { useEffect, useRef } from 'react';

export default function ReservationBar({ inline: _inline }: { inline?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject CSS links
    const cssLinks = [
      '//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css',
      'https://asiatech.in/booking_engine/admin/css/widgetsearch.css',
    ];
    const addedLinks: HTMLLinkElement[] = [];
    cssLinks.forEach(href => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
        addedLinks.push(link);
      }
    });

    // Inject custom style
    const style = document.createElement('style');
    style.textContent = `
      #widgetform { background: #fff; max-width: 515px; }
      #widgetform table { border: 3px solid #b29259; }
      #widgetform a { background: #b29259; margin-top: 20px; }
    `;
    document.head.appendChild(style);

    // Inject scripts in order
    const scripts = [
      '//ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js',
      '//code.jquery.com/ui/1.12.1/jquery-ui.js',
      'https://asiatech.in/booking_engine/admin/js/widgetsearching.js',
    ];

    const addedScripts: HTMLScriptElement[] = [];
    const loadScript = (src: string, onLoad?: () => void) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        onLoad?.();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      if (onLoad) script.onload = onLoad;
      document.body.appendChild(script);
      addedScripts.push(script);
    };

    // Chain scripts so each loads after the previous
    loadScript(scripts[0], () =>
      loadScript(scripts[1], () =>
        loadScript(scripts[2])
      )
    );

    return () => {
      addedLinks.forEach(l => l.remove());
      addedScripts.forEach(s => s.remove());
      style.remove();
    };
  }, []);

  return (
    <div ref={containerRef}>
      <form id="widgetform">
        <table cellPadding="0" cellSpacing="0">
          <tbody>
            <tr>
              <td>
                <input type="hidden" name="token" value="MTA4NTA=" />
                <label>Check In</label>
                <input type="text" name="datepick" id="datepick" placeholder="Check In" />
              </td>
            </tr>
            <tr>
              <td>
                <label>Check Out</label>
                <input type="text" name="datepick1" id="datepick1" placeholder="Check Out" />
              </td>
            </tr>
            <tr>
              <td id="searchbtn"></td>
            </tr>
          </tbody>
        </table>
        <img id="loadingimg" src="https://asiatech.in/booking_engine/admin/img/loader.gif" alt="Loading" />
      </form>
    </div>
  );
}

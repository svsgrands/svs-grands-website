import { useEffect, useRef } from 'react';

export default function ReservationBar({ inline: _inline }: { inline?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Ensure the fallback CSS hiding rule exists immediately in document.head
    let fallbackStyle = document.getElementById('datepicker-fallback-style');
    if (!fallbackStyle) {
      fallbackStyle = document.createElement('style');
      fallbackStyle.id = 'datepicker-fallback-style';
      fallbackStyle.textContent = '#ui-datepicker-div { display: none; }';
      document.head.appendChild(fallbackStyle);
    }

    // 2. Inject CSS links (persist globally, do not remove during cleanup)
    const cssLinks = [
      'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css',
      'https://asiatech.in/booking_engine/admin/css/widgetsearch.css',
    ];
    cssLinks.forEach(href => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      }
    });

    // 3. Inject custom widget style (persist globally, do not remove during cleanup)
    let customStyle = document.getElementById('booking-widget-custom-style');
    if (!customStyle) {
      customStyle = document.createElement('style');
      customStyle.id = 'booking-widget-custom-style';
      customStyle.textContent = `
        #widgetform { background: #fff; max-width: 515px; }
        #widgetform table { border: 3px solid #b29259; }
        #widgetform a { background: #b29259; margin-top: 20px; }
      `;
      document.head.appendChild(customStyle);
    }

    // 4. Inject scripts in order (do not remove them on cleanup, let them persist)
    const scripts = [
      'https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js',
      'https://code.jquery.com/ui/1.12.1/jquery-ui.js',
      'https://asiatech.in/booking_engine/admin/js/widgetsearching.js',
    ];

    let active = true;

    const loadScript = (src: string, onLoad?: () => void) => {
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        if (existingScript.getAttribute('data-loaded') === 'true') {
          if (active) onLoad?.();
        } else {
          existingScript.addEventListener('load', () => {
            if (active) onLoad?.();
          });
        }
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.setAttribute('data-loaded', 'false');
      script.onload = () => {
        script.setAttribute('data-loaded', 'true');
        if (active) onLoad?.();
      };
      document.body.appendChild(script);
    };

    // Chain scripts so each loads after the previous
    loadScript(scripts[0], () =>
      loadScript(scripts[1], () =>
        loadScript(scripts[2], () => {
          if (active && (window as any).jQuery) {
            const $ = (window as any).jQuery;
            // Force hide the datepicker container initially
            $('#ui-datepicker-div').hide();
          }
        })
      )
    );

    return () => {
      active = false;
      // Safely destroy datepicker instances on unmount to prevent memory leaks and duplicates
      if ((window as any).jQuery) {
        const $ = (window as any).jQuery;
        try {
          if ($('#datepick').data('datepicker')) {
            $('#datepick').datepicker('destroy');
          }
          if ($('#datepick1').data('datepicker')) {
            $('#datepick1').datepicker('destroy');
          }
        } catch (e) {
          // ignore if not initialized yet
        }
      }
      // Force hide the container on unmount
      const picker = document.getElementById('ui-datepicker-div');
      if (picker) {
        picker.style.display = 'none';
      }
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

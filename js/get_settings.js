// 1) start one fetch immediately and expose it as window.appDataPromise
// 2) when resolved store the object on window.appData
// 3) export helpers: getValue (sync), getValueAsync (async) and insertValueSpan(key, target, opts)

(function () {
  const jsonUrl = '/settings.json'; // change to full URL if needed

  // Start fetch immediately and expose the Promise
  window.appDataPromise = (async () => {
    try {
      const res = await fetch(jsonUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
      const data = await res.json();
      window.appData = data;
      return data;
    } catch (err) {
      console.error('Error loading JSON:', err);
      window.appData = {}; // fallback to empty object
      return window.appData;
    }
  })();

  // Synchronous getter: returns value if data already available, otherwise undefined
  window.getValue = function (key, fallback = undefined) {
    if (window.appData && Object.prototype.hasOwnProperty.call(window.appData, key)) {
      return window.appData[key];
    }
    return fallback;
  };

  // Async getter: waits for the fetch if needed
  window.getValueAsync = async function (key, fallback = undefined) {
    const data = await window.appDataPromise;
    if (data && Object.prototype.hasOwnProperty.call(data, key)) return data[key];
    return fallback;
  };

  // Insert a <span> containing the value for key into a target.
  // target can be:
  //  - a selector string (document.querySelector is used)
  //  - a DOM element
  //  - null/undefined -> document.body is used
  // opts: { className, fallback } where fallback is used if key missing
  // Returns a Promise that resolves to the created span element.
  window.insertValueSpan = async function (key, target, opts = {}) {
    const { className = 'json-value', fallback = '' } = opts;
    const container = (typeof target === 'string')
      ? document.querySelector(target)
      : (target instanceof Element ? target : document.body);

    if (!container) {
      return Promise.reject(new Error('Target container not found'));
    }

    const value = await window.getValueAsync(key, fallback);

    const span = document.createElement('span');
    span.className = className;
    const text = (value === null || value === undefined) ? String(fallback) :
      (typeof value === 'object' ? JSON.stringify(value) : String(value));
    span.textContent = text;

    // If the container is itself a placeholder <span> with data-json-key, replace its contents,
    // otherwise append the new span to the container.
    if (container.hasAttribute && container.hasAttribute('data-json-key')) {
      // Replace inner content with the value span
      container.classList.remove('placeholder');
      container.innerHTML = ''; // clear placeholder
      container.appendChild(span);
    } else {
      container.appendChild(span);
    }

    return span;
  };

  // Auto-fill elements that have data-json-key attribute when data is ready.
  // This allows markup-only usage: <span data-json-key="siteTitle"></span>
  (async function autofillDataKeyElements() {
    // collect elements now (before or after DOMContentLoaded); we'll wait for DOM ready if needed
    function populate() {
      const nodes = document.querySelectorAll('[data-json-key]');
      if (!nodes || nodes.length === 0) return;
      // fill each element (we want them to show placeholders until data resolves)
      nodes.forEach((el) => {
        const key = el.getAttribute('data-json-key');
        // call insertValueSpan but pass the element itself so it replaces content
        window.insertValueSpan(key, el).catch(err => {
          console.warn('Failed to populate element for key', key, err);
        });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', async () => {
        await window.appDataPromise;
        populate();
      });
    } else {
      await window.appDataPromise;
      populate();
    }
  })();

})();
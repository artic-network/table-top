// Simple fetch + create global vars + render

const jsonUrl = './settings.json'; 

async function fetchAndExpose(url) {
  const out = document.getElementById('output');
  out.innerHTML = ''; // clear

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
    const data = await res.json();

    // Safer container for all data
    window.appData = data;

    // Attempt to set top-level keys as global variables on window.
    // We use window[key] = value so keys that are not valid identifiers still work as properties.
    // Warning: this can overwrite built-in globals (like "location" or "alert").
    Object.entries(data).forEach(([key, value]) => {
      try {
        // If key is a valid identifier and not a reserved word you could also do `window[key] = value`.
        window[key] = value;
      } catch (e) {
        // fallback - still set as property
        window[key] = value;
        console.warn(`Could not set window.${key} via direct assignment, set as property instead.`, e);
      }

      // Render the key/value for the user
      const div = document.createElement('div');
      div.className = 'kv';
      const k = document.createElement('span');
      k.className = 'key';
      k.textContent = key + ':';
      const v = document.createElement('span');
      v.className = 'val';

      // pretty-print value (strings as-is, objects/arrays as JSON)
      if (typeof value === 'string') v.textContent = value;
      else v.textContent = JSON.stringify(value, null, 2);

      div.appendChild(k);
      div.appendChild(v);
      out.appendChild(div);
    });

    console.log('Data loaded into window.appData and top-level keys set on window:', data);
  } catch (err) {
    out.textContent = 'Error loading JSON: ' + err.message;
    console.error(err);
  }
}

// Run
fetchAndExpose(jsonUrl);
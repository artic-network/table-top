// JSONBin.io state store helper
// Docs: https://jsonbin.io/api-reference
//
// Bin record schema:  { "day": 0 }
//
// READ  — uses the read-only Access Key stored in settings.json (jsonbinAccessKey).
//         If the bin is set to Public in JSONBin you can omit the access key.
// WRITE — uses the Master Key which the facilitator pastes into the control panel
//         at the start of each session.  Never embed the Master Key in a file that
//         is served publicly.

const JSONBIN_API = 'https://api.jsonbin.io/v3/b';

/**
 * Read the current record from a bin.
 * @param {string} binId        - the bin ID (24-char hex string from JSONBin)
 * @param {string} [accessKey]  - X-Access-Key (read-only).  Omit if bin is public.
 * @returns {Promise<object>}   - the record object, e.g. { day: 0 }
 */
async function jsonbinRead(binId, accessKey) {
    const headers = { 'Content-Type': 'application/json' };
    if (accessKey) headers['X-Access-Key'] = accessKey;
    const res = await fetch(`${JSONBIN_API}/${binId}/latest`, {
        cache: 'no-store',
        headers,
    });
    if (!res.ok) throw new Error(`JSONBin read failed: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return data.record;
}

/**
 * Write a record to a bin.  Requires the Master Key — only call from the control panel.
 * @param {string} binId       - the bin ID
 * @param {string} masterKey   - X-Master-Key (write access)
 * @param {object} record      - the full record to store, e.g. { day: 2 }
 * @returns {Promise<object>}  - the JSONBin response body
 */
async function jsonbinWrite(binId, masterKey, record) {
    const res = await fetch(`${JSONBIN_API}/${binId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': masterKey,
        },
        body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error(`JSONBin write failed: ${res.status} ${res.statusText}`);
    return await res.json();
}

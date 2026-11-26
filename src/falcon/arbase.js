/* صقر الكلمات — the helper for Hamed's vowelled rows, shared by every part (used by tools/falcon-voices.js only). */
const ARV = {};
function V(id, rows) { ARV[id] = rows.trim().split('\n').map(l => l.trim()).filter(Boolean).map(l => l.split(' | ').map(x => x.trim())); }

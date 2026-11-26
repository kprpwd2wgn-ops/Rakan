/* صقر الكلمات — the word helper shared by every part (built first, before a part's words).
   One row per word:  english | arabic | picture | example sentence | its arabic | flags | wrong answers (optional)
   (see words1.js for the meaning of each column). */
const TOPICS = [];
function T(id, ar, en, icon, color, stage, rows){
  const words = rows.trim().split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const f = l.split(' | ').map(x => x.trim());
    return { en: f[0], ar: f[1], pic: f[2], ex: f[3] || '', exAr: f[4] || '', fl: f[5] || '', t: id, gx: f[6] ? f[6].split(',').map(x => x.trim().toLowerCase()) : null };
  });
  TOPICS.push({ id, ar, en, icon, color, stage, words });
}

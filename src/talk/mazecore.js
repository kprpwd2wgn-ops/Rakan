/* ===== منطق المتاهة: الخريطة، الحركة، فهم الأوامر، والحل الأقصر ===== */
const KEYC={k:'gold',r:'red',b:'blue'},DOORC={D:'gold',R:'red',B:'blue'},CBIT={gold:1,red:2,blue:4};
const DV={up:[-1,0],down:[1,0],left:[0,-1],right:[0,1]};
function mzParse(L){const g=L.map.map(r=>r.split(''));const H=g.length,W=Math.max(...L.map.map(r=>r.length));let S=null,E=null;const keys=[],doors=[],stars=[];
  g.forEach((row,r)=>{while(row.length<W)row.push('#');row.forEach((ch,c)=>{if(ch==='S')S=[r,c];else if(ch==='E')E=[r,c];else if(KEYC[ch])keys.push({r,c,col:KEYC[ch]});else if(DOORC[ch])doors.push({r,c,col:DOORC[ch]});else if(ch==='*')stars.push({r,c});});});
  return{g,H,W,S,E,keys,doors,stars};}
const mzStart=M=>({r:M.S[0],c:M.S[1],inv:0,taken:0,open:0});
function mzBlocked(M,st,r,c){if(r<0||c<0||r>=M.H||c>=M.W)return'edge';if(M.g[r][c]==='#')return'wall';
  const di=M.doors.findIndex(d=>d.r===r&&d.c===c);if(di>=0&&!(st.open>>di&1))return'door';return'';}
const mzKeyAt=(M,st,r,c)=>M.keys.findIndex((k,i)=>k.r===r&&k.c===c&&!(st.taken>>i&1));
const mzAtExit=(M,st)=>st.r===M.E[0]&&st.c===M.E[1];
/* n=0: ينزلق حتى يصطدم أو يقف فوق مفتاح أو عند المخرج */
function mzMove(M,st,dir,n){const [dr,dc]=DV[dir];let r=st.r,c=st.c,steps=0,why='';const path=[];
  while(steps<40){if(n&&steps>=n)break;const nr=r+dr,nc=c+dc,b=mzBlocked(M,st,nr,nc);if(b){why=b;break;}r=nr;c=nc;steps++;path.push([r,c]);
    if(!n&&((r===M.E[0]&&c===M.E[1])||mzKeyAt(M,st,r,c)>=0))break;}
  return{r,c,steps,why,path};}
function mzPick(M,st,col){const ki=mzKeyAt(M,st,st.r,st.c);if(ki<0)return{ok:false,why:'nokey'};const k=M.keys[ki];if(col&&col!==k.col)return{ok:false,why:'color',col:k.col};
  return{ok:true,ki,col:k.col,st:Object.assign({},st,{inv:st.inv|CBIT[k.col],taken:st.taken|1<<ki})};}
function mzOpen(M,st,col){const adj=M.doors.map((d,i)=>[d,i]).filter(([d,i])=>!(st.open>>i&1)&&Math.abs(d.r-st.r)+Math.abs(d.c-st.c)===1&&(!col||d.col===col));
  if(!adj.length)return{ok:false,why:M.doors.some((d,i)=>!(st.open>>i&1)&&Math.abs(d.r-st.r)+Math.abs(d.c-st.c)===1)?'color':'nodoor'};
  const can=adj.find(([d])=>st.inv&CBIT[d.col]);if(!can)return{ok:false,why:'locked',col:adj[0][0].col};
  return{ok:true,di:can[1],col:can[0].col,st:Object.assign({},st,{open:st.open|1<<can[1]})};}
/* أقل عدد من الأوامر للوصول إلى المخرج */
function mzSolve(M,slidesOnly){const s0=mzStart(M),K=s=>s.r+','+s.c+','+s.inv+','+s.taken+','+s.open;const seen=new Set([K(s0)]);let q=[[s0,0]];
  while(q.length){const nq=[];for(const [s,d] of q){if(mzAtExit(M,s))return d;
    const nexts=[];for(const dir in DV)for(const n of slidesOnly?[0]:[0,1,2,3,4,5,6]){const m=mzMove(M,s,dir,n);if(m.steps)nexts.push(Object.assign({},s,{r:m.r,c:m.c}));}
    const p=mzPick(M,s);if(p.ok)nexts.push(p.st);const o=mzOpen(M,s);if(o.ok)nexts.push(o.st);
    for(const t of nexts){const k=K(t);if(!seen.has(k)){seen.add(k);nq.push([t,d+1]);}}}q=nq;}
  return -1;}

/* ---------- فهم الأوامر المنطوقة ---------- */
const DIRW={up:'up',upward:'up',upwards:'up',app:'up',op:'up',north:'up',down:'down',downward:'down',downwards:'down',town:'down',dawn:'down',done:'down',south:'down',
  left:'left',lift:'left',laughed:'left',lefty:'left',west:'left',right:'right',write:'right',rite:'right',wright:'right',ride:'right',bright:'right',light:'right',east:'right'};
const NUMG={one:1,once:1,two:2,twice:2,three:3,tree:3,free:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10};
const NUMNEAR={to:2,too:2,for:4,ate:8};
const COLW={gold:'gold',golden:'gold',yellow:'gold',red:'red',read:'red',blue:'blue',blew:'blue'};
function mzCommands(text){const t=normS(text);if(!t)return[];
  const parts=t.split(/\b(?:and then|then|and|after that|next)\b/).map(s=>s.trim()).filter(Boolean);const out=[];
  for(const p of parts){const w=p.split(' ');
    const col=w.map(x=>COLW[x]).find(Boolean)||null;
    if(/\b(pick|take|get|grab|collect|catch)\b/.test(p)&&/\b(key|keys|it|up)\b/.test(p)){out.push({k:'pick',col});continue;}
    if(/\b(open|unlock)\b/.test(p)){out.push({k:'open',col});continue;}
    const used=new Set();
    for(let i=0;i<w.length;i++){const d=DIRW[w[i]];if(!d)continue;let n=0;
      for(const j of [i+1,i+2]){const x=w[j];if(x==null||DIRW[x])break;if(used.has(j))continue;
        if(NUMG[x]){n=NUMG[x];used.add(j);break;}
        if(j===i+1&&NUMNEAR[x]&&(w[j+1]==null||/^(steps?|times?|more|squares?|blocks?)$/.test(w[j+1]))){n=NUMNEAR[x];used.add(j);break;}}
      if(!n)for(const j of [i-1,i-2,i-3]){const x=w[j];if(x==null||DIRW[x]||used.has(j))break;if(NUMG[x]){n=NUMG[x];used.add(j);break;}}
      out.push({k:'move',dir:d,n});}}
  return out;}

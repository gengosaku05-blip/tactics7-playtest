/* Ver.0.43 isolated research overrides. No candidate query means zero changes. */
(function(){'use strict';
const registry={
 'dry-kingdom-10-cost-plus-1':{candidateId:'dry-kingdom-10-cost-plus-1',baseVersion:'0.41',dryRun:true,type:'CARD_BALANCE',label:'DRY RUN：破城騎士団 COST +1',changes:[{kind:'card',id:'p1_Kingdom_10',field:'cost',from:8,to:9}]},
 'dry-kingdom-10-hp-minus-1':{candidateId:'dry-kingdom-10-hp-minus-1',baseVersion:'0.41',dryRun:true,type:'CARD_BALANCE',label:'DRY RUN：破城騎士団 HP -1',changes:[{kind:'class',id:'p1_Kingdom_10_unit',field:'hp',from:6,to:5}]},
 'dry-kingdom-10-melee-minus-1':{candidateId:'dry-kingdom-10-melee-minus-1',baseVersion:'0.41',dryRun:true,type:'CARD_BALANCE',label:'DRY RUN：破城騎士団 近接 -1',changes:[{kind:'class',id:'p1_Kingdom_10_unit',field:'melee',from:2,to:1}]}
};
function apply(id){let m=registry[id];if(!m)return null;for(const c of m.changes){let root=c.kind==='card'?window.RULES?.cards:window.RULES?.classes;if(!root?.[c.id]||root[c.id][c.field]!==c.from)throw Error(`Candidate base mismatch: ${c.id}.${c.field}`);root[c.id][c.field]=c.to}window.TACTICS7_CANDIDATE=m;return m}
let id=new URLSearchParams(location.search).get('candidate');if(id)apply(id);
addEventListener('DOMContentLoaded',()=>{let m=window.TACTICS7_CANDIDATE;if(!m)return;document.body.classList.add('candidateMode');let b=document.createElement('div');b.className='candidateBanner';b.textContent=`CANDIDATE HUMAN TEST · ${m.label} · Productionではありません`;document.body.prepend(b)});
window.TacticsCandidateOverrides={registry,apply};
})();

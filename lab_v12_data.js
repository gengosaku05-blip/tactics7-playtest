/* Comparison decks exclude effects that require a center. The same deck is used in A and D. */
(function(){'use strict';
const R=window.RULES,K=R.cards;
const dependsOnCenter=id=>K[id]?.entryEffect==='drawIfCenter'||K[id]?.spellKind==='drawIfCenter'||K[id]?.onSummon==='drawIfCenter';
const decks=[],replacements={};
for(const sourceId of R.research.decks){const source=R.decks[sourceId],cards=source.cards.filter(id=>!dependsOnCenter(id)),removed=source.cards.filter(dependsOnCenter),count={};for(const id of cards)count[id]=(count[id]||0)+1;
 for(const old of removed){const target=K[old],pool=R.research.cards.filter(id=>!dependsOnCenter(id)&&(K[id].tags[0]===source.classId||K[id].tags[0]==='Neutral')&&(count[id]||0)<R.deckCopyLimit);pool.sort((a,b)=>{let ca=K[a],cb=K[b],score=c=>(c.type===target.type?100:0)+(c.tags[0]===target.tags[0]?20:0)-Math.abs(c.cost-target.cost)*4;return score(cb)-score(ca)||a.localeCompare(b)});if(!pool.length)throw Error('No center-free replacement for '+old);const id=pool[0];cards.push(id);count[id]=(count[id]||0)+1;(replacements[sourceId]??=[]).push({from:old,to:id})}
 const id='dcgsafe_'+sourceId;R.decks[id]={...source,name:source.name+' / 中央非依存',description:'A/D同一比較用。中央条件カードを双方で置換',cards};const valid=R.validateDeck(cards,source.classId);if(!valid.ok)throw Error(id+': '+valid.reason);decks.push(id)}
R.research.dcgsafeDecks=decks;R.research.dcgsafeReplacements=replacements;
window.CoreDDecks={decks,replacements,dependsOnCenter};
})();

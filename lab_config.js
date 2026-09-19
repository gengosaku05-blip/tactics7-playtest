/* Versioned experimental rules. No balance values are changed by this file. */
(function(){'use strict';
const R=window.RULES;
const common={energyInitial:R.energy.initial,energyGrowth:R.energy.growth,energyCap:R.energy.cap,handInitial:R.hand.initial,handMax:R.hand.max,drawPerTurn:R.hand.drawPerTurn,emptyDeck:R.hand.emptyDeck,commanderHp:R.classes.commander.hp,actionsPerTurn:R.actionsPerTurn,evolutionUnlock:{...R.evolution.unlockTurn},ep:{...R.evolution.ep},summonRows:JSON.parse(JSON.stringify(R.summonRows)),terrain:R.terrain.slice(),deckCopyLimit:R.deckCopyLimit,center:{...R.center},centerEnabled:true};
const CORES=Object.freeze({
 A:Object.freeze({...common,centerBonus:1,frontlineSummon:false,summonTempo:'immobile'}),
 B:Object.freeze({...common,centerBonus:1,frontlineSummon:true,summonTempo:'moveOnly'}),
 C:Object.freeze({...common,centerBonus:0,frontlineSummon:true,summonTempo:'moveOnly'}),
 D:Object.freeze({...common,centerEnabled:false,centerBonus:0,frontlineSummon:false,summonTempo:'immobile'})
});
const keys=['centerEnabled','centerBonus','frontlineSummon','summonTempo','energyInitial','energyGrowth','energyCap','handInitial','handMax','drawPerTurn','emptyDeck','commanderHp','actionsPerTurn','evolutionUnlock','ep','summonRows','terrain','deckCopyLimit','center'];
function same(a,b){return JSON.stringify(a)===JSON.stringify(b)}
function identify(config){for(const [id,c] of Object.entries(CORES))if(keys.every(k=>same(config[k],c[k])))return id;return'CUSTOM'}
function resolve(options={}){let requested=options.coreId||'B';if(requested!=='CUSTOM'&&!CORES[requested])throw Error('Unknown Core '+requested);let base=CORES[requested]||CORES.B,config={...base,...options.config};for(const key of keys)if(Object.hasOwn(options,key))config[key]=options[key];config.evolutionUnlock={...config.evolutionUnlock};config.ep={...config.ep};let actual=identify(config);if(requested!=='CUSTOM'&&actual!==requested&&options.strictCore)throw Error(`Core ${requested} differs from engine flags: ${JSON.stringify(config)}`);return{id:requested==='CUSTOM'?'CUSTOM':actual,requested,config}}
function assert(game,expected){const actual=identify(game.config);if(actual!==expected)throw Error(`Core mismatch expected=${expected} actual=${actual}`);for(const k of keys)if(!same(game.config[k],CORES[expected][k]))throw Error(`Core flag mismatch ${k}`);return true}
window.CoreConfig={version:'0.10.1',cardPoolVersion:'test-pool-177-v1',cores:CORES,keys,identify,resolve,assert};
})();

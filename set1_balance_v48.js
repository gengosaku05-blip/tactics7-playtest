/* Ver.0.48 Set 1 Balance Pass. Research-only; load after set1_prototype.js. */
(function(){'use strict';
const R=window.RULES,K=R.cards,C=R.classes;
const changes=[];
function tune(id,cardPatch,unitPatch,reason,candidates){const c=K[id],before={card:{},unit:{}};for(const [k,v] of Object.entries(cardPatch||{})){before.card[k]=c[k];c[k]=v}const u=c.classId&&C[c.classId];for(const [k,v] of Object.entries(unitPatch||{})){before.unit[k]=u[k];u[k]=v}c.set1Balance={version:'0.48',kind:'TUNED',reason,candidates,before,after:{card:cardPatch||{},unit:unitPatch||{}}};changes.push({id,name:c.name,...c.set1Balance})}
// Kingdom: preserve march, delay its most efficient carrier and reduce repeat damage.
tune('p1_Kingdom_06',{cost:6},{melee:1},'進軍は維持し、早期の位置利益と反復COMMANDER打点だけを抑える',['K_A COST 4→6','K_C ATK 2→1']);
tune('p1_Kingdom_01',{cost:2},null,'1 COST展開・DOWN時ドロー・前線形成の三重テンポを1 ENERGY遅らせる',['Auto Include follow-up']);
tune('p1_Kingdom_03',{cost:4},null,'射程2・押撃進化・横移動2を持つ序盤後衛の効率を是正する',['Auto Include follow-up']);
// Mechanica: turn commonly played token engines into a board-to-siege conversion point.
tune('s1_Mechanica_15',{entryEffect:'mechanicaRelay'},null,'既存Tokenを消費機会ではなく即時攻城位置へ変換する中盤中継点にする',['M_A refined']);
tune('p1_Mechanica_10',{entryEffect:'mechanicaRelay'},null,'8 COSTを新規Token追加ではなく既存装置の攻城変換へ使う',['M_C refined']);
R.set1Balance={version:'0.48-balance-prototype',base:'0.47-prototype',production:false,changes};
R.set1Prototype.version=R.set1Balance.version;
R.version='0.48-set1-balance-research';
})();

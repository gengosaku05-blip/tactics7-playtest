/* Ver.0.47 Card Set 1 Prototype. Research-only; load after phase1_data.js. */
(function(){'use strict';
const R=window.RULES,C=R.classes,K=R.cards,P=R.phase1;
const classNames=Object.fromEntries(Object.entries(P.identities).map(([k,v])=>[k,v.name]));
const icons={Kingdom:'冠',Forest:'葉',Arcane:'晶',Nether:'骸',Mechanica:'歯',Abyss:'蝕'};
const audit={};try{audit.source='FOUNDATION_CARD_SET_AUDIT_V46.md'}catch(_){ }
function tune(id,change,reason){let c=K[id];Object.assign(c,change.card||{});if(c.classId&&change.unit)Object.assign(C[c.classId],change.unit);c.set1Change={kind:'TUNE',reason,...change}}
function redesign(id,change,reason){let c=K[id];Object.assign(c,change.card||{});if(c.classId&&change.unit)Object.assign(C[c.classId],change.unit);c.set1Change={kind:'REDESIGN',reason,...change}}
// TUNE: one principal lever per card wherever possible.
tune('p1_Kingdom_04',{card:{cost:2}},'位置交換の採用機会を増やす');
tune('p1_Kingdom_07',{card:{cost:6}},'高勝率突破札のテンポを1 ENERGY遅らせる');
tune('p1_Forest_08',{card:{cost:4}},'退避専用札の機会費用を下げる');
tune('p1_Arcane_05',{card:{cost:3}},'射線形成を中盤前へ寄せる');
tune('p1_Arcane_09',{card:{cost:5}},'盤面操作から攻勢へ繋げやすくする');
tune('p1_Nether_03',{card:{cost:2}},'墓地エンジンの始動を安定化');
tune('p1_Nether_06',{card:{cost:3}},'DOWN復帰の重さを緩和');
tune('p1_Nether_08',{card:{cost:4}},'墓地戦線の位置選択を増やす');
tune('p1_Mechanica_03',{card:{cost:3}},'低コスト壁の自動採用を抑える');
tune('p1_Mechanica_06',{card:{cost:3}},'装置陣形の組み替えを使いやすくする');
tune('p1_Mechanica_08',{card:{cost:4}},'Token盤面を攻城へ変換しやすくする');
tune('p1_Abyss_03',{card:{cost:2}},'自傷突破の交換効率を改善');
tune('p1_Abyss_06',{card:{cost:5}},'高使用勝率の回復を遅らせる');
tune('p1_Abyss_07',{unit:{hp:5}},'自傷後に成果を出す生存性を1だけ補う');
tune('p1_Abyss_08',{card:{cost:4}},'2マス前進の採用機会を増やす');
tune('p1_Abyss_09',{unit:{hp:5}},'自傷遠距離が射撃前に落ちる問題を軽減');
// REDESIGN: preserve the missing role, change the immediate conversion method.
redesign('p1_Kingdom_11',{card:{cost:8,spellKind:'breach',effect:'味方前衛が隣接敵を押し出し、そのマスへ進軍する。'}},'隊列から攻城路を作る8 COST突破');
redesign('p1_Kingdom_12',{card:{entryEffect:'kingdomFinisher',effect:'登場時：隊列があれば自身が進軍し近い敵へ1ダメージ。'}},'全軍無料前進を避けた10 COST指揮官');
redesign('p1_Forest_12',{card:{cost:10,spellKind:'vault',effect:'敵前衛を飛び越える側面突破を作る。'}},'転位フィニッシャーとの重複を解消');
redesign('p1_Arcane_11',{card:{cost:8,spellKind:'arcaneFinisher',effect:'敵前衛へ2ダメージしCOMMANDER側へずらす。'}},'射線操作型の8 COST突破');
redesign('p1_Arcane_12',{card:{cost:10,spellKind:'strongArcane'}},'射線条件を使う最終魔法へ統一');
redesign('p1_Nether_11',{card:{cost:8,spellKind:'reanimate',effect:'墓地の3 COST以下1体を選んだ位置へ戻す。'}},'2体即攻城の再現性を抑制');
redesign('p1_Nether_12',{card:{entryEffect:'netherFinisher',effect:'墓地3枚以上で小型2体を復帰させ戦線を再構築。'}},'墓地条件を明文化した10 COST決着準備');
redesign('p1_Mechanica_10',{card:{entryEffect:'token',effect:'登場時：隣接へTokenを1体生成。進化で押撃。'}},'無条件2Tokenと除去の過剰複合を分割');
redesign('p1_Mechanica_11',{card:{cost:8,spellKind:'swap',effect:'隣接する装置/味方の位置を交換し射線を作る。'}},'Token即時転送から読める陣形操作へ');
redesign('p1_Mechanica_12',{card:{entryEffect:'mechanicaFinisher',effect:'登場時：Token2体を生成し近い敵へ1ダメージ。'}},'盤面構築を攻城へ変換する10 COST機構');
redesign('p1_Abyss_10',{card:{entryEffect:'selfHarmAdvance'},unit:{hp:7},},'低HP条件でも前線へ残る8 COST圧力');
redesign('p1_Abyss_11',{card:{cost:8,spellKind:'abyssFinisher',effect:'侵入した味方1体と自HP1を代償にCOMMANDERへ2ダメージ。'}},'重すぎる二体犠牲を位置条件へ変更');
redesign('p1_Abyss_12',{card:{entryEffect:'drain'},unit:{hp:8},},'自傷を重ねず接敵時の吸収へ転換');

function unit(cl,n,name,cost,hp,atk,range,rAtk,evolution,effect,o={}){let id=`s1_${cl}_${String(n).padStart(2,'0')}`,classId=id+'_unit';C[classId]={name,icon:icons[cl],hp,melee:atk,range,ranged:rAtk,rangedDamageType:range?(o.damageType||'ranged_projectile'):undefined,line:o.line||(range?'clear':'none'),attackShape:range?{directions:o.directions||'queen',unitPierce:o.unitPierce||0,terrainPierce:0,engaged:false}:undefined,moveTrait:o.moveTrait||null,evolution,description:effect};K[id]={name,type:'unit',classId,cost,tags:[classNames[cl],...(o.tags||[])],className:classNames[cl],effect,entryEffect:o.entryEffect,onDown:o.onDown,onAttack:o.onAttack,rush:!!o.rush,keywords:o.keywords||[],role:o.role,preferredRow:o.preferredRow||(range>=2?'back':'front'),set1Prototype:true,finisher:!!o.finisher,deckEligible:true,design:{need:o.need,archetype:o.archetype,competition:o.competition,position:o.position,evolution:o.evolution,choice:o.choice}};return id}
function spell(cl,n,name,cost,kind,effect,o={}){let id=`s1_${cl}_${String(n).padStart(2,'0')}`;K[id]={name,type:'spell',cost,tags:[classNames[cl],...(o.tags||[])],className:classNames[cl],effect,spellKind:kind,keywords:o.keywords||[],role:o.role,set1Prototype:true,finisher:!!o.finisher,deckEligible:true,design:{need:o.need,archetype:o.archetype,competition:o.competition,position:o.position,evolution:'対象ユニットの進化と競合',choice:o.choice}};return id}
const added={};for(const cl of Object.keys(P.identities))added[cl]=[];
const U=(...a)=>{let id=unit(...a);added[a[0]].push(id);return id},S=(...a)=>{let id=spell(...a);added[a[0]].push(id);return id};
const d=(need,archetype,competition,position,evolution,choice,extra={})=>{let role=extra.role||(/Finisher/.test(archetype)?'finisher':/Ranged/.test(archetype)?'ranged':/Evolution/.test(archetype)?'evolution':/Token/.test(archetype)?'token':/Position/.test(archetype)?'position':/Control/.test(archetype)?'defense':/Mobility/.test(archetype)?'mobility':/Ambush|Siege|Sacrifice/.test(archetype)?'breakthrough':/Grave|Value/.test(archetype)?'value':/Formation/.test(archetype)?'frontline':'advance');return{need,archetype,competition,position,evolution,choice,role,...extra}};
// Kingdom: formation/evolution alternatives.
U('Kingdom',13,'側衛の新兵',2,3,1,0,0,'swap','進化時：隣接味方と位置交換。',d('低コスト隊列調整','Formation','白盾は防御、こちらは配置','側面を埋める','隊列を即調整','耐久か配置か'));
U('Kingdom',14,'進軍伝令',3,3,1,2,1,'step','直線射程2。',d('序盤後衛','Advance/Ranged','列槍兵より軽く脆い','後列射線','安全位置へ前進','押撃か軽さか',{directions:'orthogonal',line:'straight',role:'ranged'}));
S('Kingdom',15,'陣列再編',4,'fortify','味方1体に防御。',d('能動防衛','Formation','護衛長は盤面を伴う','前線維持','進化温存を可能に','ユニットかスペルか',{role:'defense',keywords:['防御']}));
U('Kingdom',16,'槍列教官',5,5,2,0,0,'stepStrike','登場時：隣接味方に防御。',d('中盤進化候補','Evolution','護衛長より攻撃寄り','中央列を支える','即時戦闘','耐久か進化圧力か',{entryEffect:'guardAdjacent',role:'evolution'}));
S('Kingdom',17,'一斉前進',6,'advance','味方1体を敵陣方向へ進める。',d('中盤進軍payoff','Advance','盾列を割れは敵依存','前線1マス獲得','進化先を前へ送る','突破か隊列維持か',{role:'advance',keywords:['進軍']}));
U('Kingdom',18,'城門の守将',7,7,2,0,0,'push','登場時：自身に防御。',d('7 COST防衛選択','Control','8 COST以上の攻城札と競合','前線固定','押撃で反転','守るか閉じるか',{entryEffect:'fortify',role:'defense'}));
U('Kingdom',19,'双旗の元帥',9,6,2,0,0,'stepStrike','登場時：味方軍を前進させ近い敵へ2ダメージ。',d('隊列フィニッシャー','Formation','王道開門は単体突破','隊列全体を押す','即時戦闘','盤面幅か一点突破か',{entryEffect:'strongKingdom',role:'finisher',finisher:true}));
S('Kingdom',20,'勝鬨の号令',10,'breach','敵前衛を押し出し攻城路を開く。',d('スペル型決着','Advance','総大将は本体が残る','正面の穴を奪う','進化済み前衛を通す','盤面体か即時突破か',{role:'finisher',finisher:true}));
// Forest.
U('Forest',13,'横枝の遊撃手',2,3,1,0,0,'step','攻撃後に横へ移動。',d('軽量側面札','Mobility','剣士は前進特化','横路を確保','移動先を増やす','前進か離脱か',{onAttack:'sidestep',role:'mobility',keywords:['離脱']}));
U('Forest',14,'木立の射手',3,4,1,2,1,'swap','短射程の耐久後衛。',d('射手の別解','Ranged','風羽は射程3','前衛近くで連携','位置交換','射程か耐久か',{role:'ranged'}));
S('Forest',15,'枝路の誘い',3,'retreat','味方を自陣側へ退避。',d('軽い離脱','Control','狩場より早い','攻撃後の保護','EP温存','カード枠か再配置か',{role:'position',keywords:['離脱']}));
U('Forest',16,'森境の槍鹿',5,5,2,0,0,'stepStrike','前方2マス移動。',d('中盤進化攻勢','Evolution','狩人は攻撃後移動','側面から接敵','即時戦闘','離脱か突入か',{moveTrait:{type:'forward',steps:2},role:'evolution'}));
S('Forest',17,'絡み蔦',6,'pull','射線上の敵を1マス引く。',d('防衛突破','Ambush','獣道は自分が動く','敵列を崩す','進化攻撃へ接続','自移動か敵移動か',{role:'breakthrough',keywords:['引き寄せ']}));
U('Forest',18,'樹冠の見張り',7,5,1,4,2,'step','射程4の後列支援。',d('終盤射線','Ranged','追跡者は機動型','後列を守る','射線位置へ進化','機動か長射程か',{role:'ranged',preferredRow:'back'}));
U('Forest',19,'翠嵐の先導者',8,6,2,0,0,'stepStrike','登場時：最前線味方と位置交換。',d('機動フィニッシャー','Mobility','抜け道はスペル','侵入者を入替','即時戦闘','本体か転位か',{entryEffect:'forestFinisher',role:'finisher',finisher:true}));
S('Forest',20,'四方森路',9,'strongForest','敵陣の味方を決戦位置へ転位。',d('位置型決着','Ambush','翠鹿は盤面体','COMMANDER隣接へ角度を作る','進化済み侵入者を再使用','準備条件を選ぶ',{role:'finisher',finisher:true}));
// Arcane.
U('Arcane',13,'鏡面の助手',2,3,1,2,1,'swap','短射程。進化で味方と交換。',d('射線保護','Ranged','見習いは魔法貫通','後列配置','射線を交換','貫通か配置か',{damageType:'magic',line:'oneUnit',unitPierce:1,role:'ranged'}));
U('Arcane',14,'結晶の護衛',3,5,1,0,0,'push','進化時：隣接敵を押す。',d('低中コスト前衛','Control','測量士は防御','射手前を守る','射線を開く','防御か押撃か',{role:'frontline'}));
S('Arcane',15,'光路偏向',3,'swap','隣接味方2体を交換。',d('射線形成','Position','磁力は敵操作','射手を列へ置く','EP温存','敵か味方を動かすか',{role:'position',keywords:['転位']}));
U('Arcane',16,'稜線魔術師',5,4,1,4,1,'shiftEnemy','射程4、低火力。',d('長射程選択','Ranged','星図は射程3火力2','安全後列','敵位置をずらす','火力か距離か',{damageType:'magic',line:'oneUnit',unitPierce:1,role:'ranged'}));
S('Arcane',17,'重力井戸',6,'pull','射線上の敵を引き寄せる。',d('中盤突破','Position Control','陣形崩落は押す','防衛を射線へ引く','進化射撃へ接続','押すか引くか',{role:'breakthrough',keywords:['引き寄せ']}));
U('Arcane',18,'天蓋の観測者',7,6,1,3,2,'step','登場時：自身に防御。',d('7 COST持続砲台','Control','賢者は射程4','後列で生存','位置を微調整','射程か耐久か',{entryEffect:'fortify',damageType:'magic',line:'oneUnit',unitPierce:1,role:'ranged'}));
S('Arcane',19,'星門展開',8,'strongArcane','前衛を崩し味方遠距離を射線へ移す。',d('射線フィニッシャー','Ranged','陣形崩壊は単体処理','射線を即形成','進化済み射手を再配置','除去か射線か',{role:'finisher',finisher:true}));
U('Arcane',20,'極光の導師',10,6,1,4,3,'shiftEnemy','射程4。進化で敵位置を変える。',d('盤面型決着体','Tempo','星路はスペル','後列射線を維持','射線完成','即時魔法か持続砲台か',{damageType:'magic',line:'oneUnit',unitPierce:1,role:'finisher',finisher:true}));
// Nether.
U('Nether',13,'弔いの従兵',2,3,1,0,0,'step','DOWN時：1枚引く。',d('墓地素材の別解','Grave','小骨より耐久高','前線で倒される','移動選択','1 COSTか耐久か',{onDown:'draw',role:'value',keywords:['墓還']}));
S('Nether',14,'墓所の選別',3,'drawIfCenter','条件達成時1枚引く。',d('墓地手札補充','Value','従者はユニット','中央進行を促す','EP温存','盤面体かドローか',{role:'value'}));
U('Nether',15,'葬送の槍兵',4,5,2,0,0,'stepStrike','登場時：前進。',d('墓地前線','March','棺盾は防衛','DOWN地点を前へ','即時戦闘','耐久か攻勢か',{entryEffect:'advance',role:'advance',keywords:['進軍']}));
S('Nether',16,'魂の牽引',5,'pull','敵を墓地戦線側へ引く。',d('復活以外の突破','Control','帰陣は復帰','敵前衛を外す','進化攻撃へ接続','復帰か敵操作か',{role:'breakthrough',keywords:['引き寄せ']}));
U('Nether',17,'墓火の射手',6,5,1,3,2,'shiftEnemy','墓地があれば1枚引く。',d('墓地遠距離payoff','Grave/Ranged','司祭より耐久','後列射線','敵位置変更','進化速度か持続性か',{entryEffect:'drawIfGrave',damageType:'magic',line:'oneUnit',unitPierce:1,role:'ranged'}));
U('Nether',18,'死門の騎士',7,6,2,0,0,'stepStrike','登場時：前進。',d('7 COST攻城','March','黄泉路は復活','空いた墓地戦線を奪う','即時戦闘','復活か本人圧力か',{entryEffect:'advance',role:'advance'}));
S('Nether',19,'百骸行軍',9,'strongNether','墓地4枚以上で小型2体を攻城位置へ戻す。',d('墓地フィニッシャー','Grave','門番は本体型','墓地を複数路へ変換','復帰体を即行動','広さか大型か',{role:'finisher',finisher:true}));
U('Nether',20,'終墓の王',10,8,3,0,0,'stepStrike','墓地3枚以上で小型2体を復帰。',d('本体型決着','Value','百骸はスペル','前線と復帰を併置','即時戦闘','残る本体か転送か',{entryEffect:'netherFinisher',role:'finisher',finisher:true}));
// Mechanica.
U('Mechanica',13,'測距ドローン',2,3,1,2,1,'swap','短射程Token支援。',d('軽量後衛','Ranged','組立工はToken生成','後列角度','装置と交換','生成か射撃か',{role:'ranged',keywords:['砲台']}));
S('Mechanica',14,'部品回収',3,'retreat','味方を退避させる。',d('装置保護','Value','障壁は盤面追加','砲台を守る','EP温存','壁か再利用か',{role:'position'}));
U('Mechanica',15,'転路技師',4,4,1,0,0,'swap','登場時：Tokenを生成。',d('中盤Tokenエンジン','Token','組立工より重く耐久','装置網を広げる','位置交換','速度か耐久か',{entryEffect:'token',role:'token',keywords:['砲台']}));
S('Mechanica',16,'照準補正',5,'swap','味方2体を交換し射線を作る。',d('砲台射線','Ranged','機路転換より強い帯','後列を再配置','進化温存','低コスト交換か終盤射線か',{role:'position',keywords:['転位']}));
U('Mechanica',17,'可動砲塔',6,5,1,3,2,'stepStrike','進化で即時射撃位置へ移動。',d('進化候補','Evolution/Ranged','連結砲台は固定','前衛Token越し','即時戦闘','火力維持か進化速度か',{role:'evolution',keywords:['砲台']}));
S('Mechanica',18,'多路排障',7,'breach','敵を押し出し味方が進む。',d('中盤後半突破','Siege','ピストンより重い選択','装置路を開く','進化砲塔へ接続','軽さか終盤確実性か',{role:'breakthrough'}));
U('Mechanica',19,'双砲攻城車',9,7,2,3,2,'push','登場時：Token2体生成し近い敵へ1ダメージ。',d('盤面フィニッシャー','Token/Siege','全機転送はスペル','複数方向を作る','押撃で路を開く','本体か転送か',{entryEffect:'mechanicaFinisher',role:'finisher',finisher:true}));
S('Mechanica',20,'最終起動列',10,'strongMechanica','Token2体を攻城位置へ送り即時行動可能にする。',d('Token決着','Token','破砕機構は本体型','構築済みTokenを変換','EPと別資源','準備済み盤面か本体か',{role:'finisher',finisher:true}));
// Abyss.
U('Abyss',13,'契傷の斥候',2,3,2,0,0,'step','登場時：自傷して1枚引く。',d('代償回収','Tempo','先兵は前進','前線へカードを残す','移動選択','位置か手札か',{entryEffect:'selfHarmDraw',role:'value'}));
S('Abyss',14,'代償転化',3,'drain','敵へ1ダメージしCOMMANDERを1回復。',d('自傷回収','Control','生命吸収より早く軽い','接敵を要求','EP温存','軽さか高帯回復か',{role:'recovery'}));
U('Abyss',15,'血路の騎兵',4,5,2,0,0,'stepStrike','登場時：自傷し前進。',d('中盤テンポ','Tempo','狂奔より低打点','前線を奪う','即時戦闘','安全か爆発力か',{entryEffect:'selfHarmAdvance',role:'advance'}));
S('Abyss',16,'命脈交換',5,'swap','隣接味方を交換。',d('犠牲配置','Sacrifice','跳躍は前進','低HPを逃がす','進化先交換','前進か保護か',{role:'position'}));
U('Abyss',17,'残命の射手',6,5,1,3,2,'shiftEnemy','登場時：自傷して1枚引く。',d('自傷遠距離payoff','Ranged','魔女より耐久','後列から回収','敵位置変更','早い魔女か持続射手か',{entryEffect:'selfHarmDraw',damageType:'magic',line:'oneUnit',unitPierce:1,role:'ranged'}));
U('Abyss',18,'奈落門の番',7,7,2,0,0,'push','登場時：自身に防御。',d('自傷後の守り','Control','執行者は攻勢','COMMANDER前以外も守る','押撃で反転','守るか賭けるか',{entryEffect:'fortify',role:'defense'}));
S('Abyss',19,'血界突破',9,'abyssFinisher','侵入者1体と自HP1を代償にCOMMANDERへ2ダメージ。',d('条件付き決着','Sacrifice','最終血契より重く確実','侵入が前提','進化侵入者を変換','盤面資産を残すか勝負か',{role:'finisher',finisher:true}));
U('Abyss',20,'深淵の戴冠者',10,8,3,2,2,'stepStrike','登場時：隣接敵から1吸収。',d('本体型決着','Tempo','血界はスペル','前線で吸収','即時戦闘','直接圧力か持続本体か',{entryEffect:'drain',damageType:'magic',line:'oneUnit',unitPierce:1,role:'finisher',finisher:true}));

const allByClass={};for(const cl of Object.keys(P.identities))allByClass[cl]=[...P.cards.filter(id=>K[id].className===classNames[cl]),...added[cl]];
const tokens=Object.keys(K).filter(id=>K[id].token||K[id].deckEligible===false);
R.set1Prototype={version:'0.47-prototype',baseAudit:'0.46',foundation:{deckSize:20,copyLimit:2,singleClass:true,neutral:false,tokenEligible:false,evolvedEligible:false,initialHand:4,mulligan:'partial',emptyDeck:'noDraw'},cards:Object.values(allByClass).flat(),byClass:allByClass,added,tokenIds:tokens,identities:P.identities,production:false};
R.version='0.47-set1-prototype';R.deckCopyLimit=2;R.allowNeutral=false;
})();

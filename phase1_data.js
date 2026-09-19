/* Ver.0.37 Production Card Design Phase 1: 72 provisional cards / 12 decks. */
(function(){'use strict';
const R=window.RULES,C=R.classes,K=R.cards;
R.version='0.37-phase1';
const identities={
 Kingdom:{name:'王国',strength:'正面戦闘、隊列、味方を伴う進軍',weakness:'側面移動と盤面分断',board:'耐久力のある前衛と兵士の横並び',position:'隣接・同列の味方を前へ送る',breakthrough:'押撃と複数体進軍',commander:'戦線を維持して正面から連続攻撃',evolution:'前進と即時戦闘の起点',ranged:'前衛の後ろから槍・弩で援護',keywords:['進軍','押撃','防御'],forbidden:'COMMANDER前で待つだけの無限防衛'},
 Forest:{name:'森域',strength:'高機動、側面、位置交換',weakness:'正面の耐久戦と密集範囲攻撃',board:'散開し安全な横路を確保',position:'転位・飛び越し・攻撃後移動',breakthrough:'前衛を迂回して後衛へ触る',commander:'敵陣侵入者を転位して攻撃角を作る',evolution:'移動と再配置を即座に行う',ranged:'短射程を移動で維持',keywords:['転位','離脱','進軍'],forbidden:'無条件の長距離疾走'},
 Arcane:{name:'魔導',strength:'射線、遠距離、位置操作、スペル',weakness:'接敵とENERGYを使い切った後の前線',board:'射線が交差する後列陣形',position:'引き寄せと押撃で射線を開く',breakthrough:'陣形を崩して後衛から集中射撃',commander:'作った射線を高コスト魔法へ変換',evolution:'射程・射線・敵位置を変える',ranged:'主軸。前列へ雑に置かない',keywords:['引き寄せ','押撃','転位'],forbidden:'盤面を無視した無条件バーン'},
 Nether:{name:'冥界',strength:'墓地、DOWN、犠牲、復帰',weakness:'墓地が整う前のテンポと除外',board:'倒される小型を前線資源にする',position:'DOWN地点と復帰位置を選ぶ',breakthrough:'犠牲で空けた場所へ復帰兵を送る',commander:'墓地量を複数の攻城手へ変換',evolution:'DOWN・復帰を即時価値へ変える',ranged:'墓地を肥やす支援射撃',keywords:['墓還','進軍','防御'],forbidden:'同一カードの無限復活'},
 Mechanica:{name:'機巧',strength:'トークン、装置、砲台、連携',weakness:'準備前の速攻と装置分断',board:'複数の装置で射線と進路を構築',position:'トークンを攻撃角と壁へ変換',breakthrough:'複数方向から同時に圧力',commander:'砲台網とトークン転送で攻城',evolution:'装置を生成・再起動',ranged:'前衛トークン越しに砲撃',keywords:['砲台','転位','押撃'],forbidden:'低コスト壁の無限供給'},
 Abyss:{name:'深淵',strength:'自傷、犠牲、即時テンポ',weakness:'長期戦と代償管理の失敗',board:'HPとユニットを速度へ変換',position:'危険な前進で短い攻撃窓を作る',breakthrough:'代償付き強制移動と吸収',commander:'低HP条件から高圧力を作る',evolution:'代償を即時攻撃へ変換',ranged:'自傷を条件に短時間だけ強い',keywords:['進軍','離脱','墓還'],forbidden:'手札からの回避不能OTK'}
};
const icons={Kingdom:'冠',Forest:'葉',Arcane:'晶',Nether:'骸',Mechanica:'歯',Abyss:'蝕'};
const common=(classId,name,hp,melee,range=0,ranged=0,evolution='step',extra={})=>C[classId]={name,icon:extra.icon||'◆',hp,melee,range,ranged,rangedDamageType:extra.rangedDamageType||(range?'ranged_projectile':undefined),line:extra.line||(range?'clear':'none'),attackShape:range?{directions:extra.directions||'queen',unitPierce:extra.unitPierce||0,terrainPierce:extra.terrainPierce||0,engaged:false}:undefined,moveTrait:extra.moveTrait||null,evolution,description:extra.description||''};
const addUnit=(cl,n,name,cost,hp,melee,range,ranged,evolution,effect,opts={})=>{let id=`p1_${cl}_${String(n).padStart(2,'0')}`,classId=id+'_unit';common(classId,name,hp,melee,range,ranged,evolution,{icon:icons[cl],description:effect,...opts});K[id]={name,type:'unit',classId,cost,tags:[identities[cl].name,...(opts.tags||[])],className:identities[cl].name,effect,entryEffect:opts.entryEffect,onDown:opts.onDown,onAttack:opts.onAttack,rush:opts.rush||false,keywords:opts.keywords||[],role:opts.role||'midrange',preferredRow:opts.preferredRow||((range>=2)?'back':'front'),phase1:true,finisher:!!opts.finisher,art:{normal:null,evolved:null}};return id};
const addSpell=(cl,n,name,cost,kind,effect,opts={})=>{let id=`p1_${cl}_${String(n).padStart(2,'0')}`;K[id]={name,type:'spell',cost,tags:[identities[cl].name,...(opts.tags||[])],className:identities[cl].name,effect,spellKind:kind,keywords:opts.keywords||[],role:opts.role||'utility',phase1:true,finisher:!!opts.finisher,researchStrongFinisher:!!opts.strong,finisherKind:opts.finisherKind};return id};
const ids={};for(const cl of Object.keys(identities))ids[cl]=[];
function U(...a){let id=addUnit(...a);ids[a[0]].push(id);return id}function S(...a){let id=addSpell(...a);ids[a[0]].push(id);return id}

U('Kingdom',1,'前線の従兵',1,3,1,0,0,'step','DOWN時：1枚引く。',{onDown:'draw',role:'early',keywords:['進軍']});
U('Kingdom',2,'白盾の歩兵',2,4,1,0,0,'swap','登場時：自身に防御。',{entryEffect:'fortify',role:'frontline',keywords:['防御']});
U('Kingdom',3,'列槍兵',3,4,1,2,1,'push','直線射程2。進化時に隣接敵を押し出す。',{directions:'orthogonal',line:'straight',moveTrait:{type:'orthogonal',steps:2},role:'ranged',keywords:['押撃']});
S('Kingdom',4,'隊列交代',3,'swap','隣接する味方2体の位置を交換。',{role:'position',keywords:['転位']});
U('Kingdom',5,'王都の護衛長',4,6,2,0,0,'swap','登場時：隣接する味方1体に防御。',{entryEffect:'guardAdjacent',role:'defense',keywords:['防御']});
U('Kingdom',6,'進軍騎士',4,5,2,0,0,'stepStrike','登場時：前方へ1マス進軍。',{entryEffect:'advance',moveTrait:{type:'forward',steps:2},role:'advance',keywords:['進軍']});
S('Kingdom',7,'盾列を割れ',5,'breach','隣接敵を押し出し、その場所へ味方が入る。',{role:'breakthrough',keywords:['押撃','進軍']});
U('Kingdom',8,'王国弩隊',5,4,1,3,2,'step','前衛の後ろから射線を通す支援兵。',{role:'ranged',preferredRow:'back'});
U('Kingdom',9,'旗持つ副将',6,5,2,0,0,'stepStrike','味方が2体以上いる時に強い進化起点。',{entryEffect:'guardAdjacent',role:'evolution',keywords:['防御']});
U('Kingdom',10,'破城騎士団',8,6,2,0,0,'stepStrike','登場時：味方軍を前進させ、近い敵へ2ダメージ。',{entryEffect:'strongKingdom',moveTrait:{type:'forward',steps:2},role:'finisher',finisher:true,keywords:['進軍','押撃']});
S('Kingdom',11,'王道開門',9,'barrage','隣接敵へ1ダメージを与えて押し出す。',{role:'finisher',finisher:true,keywords:['押撃']});
U('Kingdom',12,'黎明の総大将',10,7,3,0,0,'stepStrike','登場時：隊列があれば戦線を押し上げる決戦指揮官。',{entryEffect:'strongKingdom',moveTrait:{type:'forward',steps:2},role:'finisher',finisher:true,keywords:['進軍']});

U('Forest',1,'木陰の斥候',1,3,1,0,0,'step','進化時：空き1マスへ移動。',{role:'early',keywords:['進軍']});
U('Forest',2,'枝渡りの剣士',2,3,1,0,0,'stepStrike','前方2マス移動。',{moveTrait:{type:'forward',steps:2},role:'mobility',keywords:['進軍']});
S('Forest',3,'蔦の転位',2,'swap','隣接する味方2体を位置交換。',{role:'position',keywords:['転位']});
U('Forest',4,'風羽の射手',3,3,1,3,1,'step','射程3。後列から隙を狙う。',{role:'ranged',preferredRow:'back'});
U('Forest',5,'跳躍する狩人',4,4,2,0,0,'step','攻撃後に横へ退避する。',{onAttack:'sidestep',role:'breakthrough',keywords:['離脱']});
S('Forest',6,'獣道越え',4,'vault','敵を飛び越えて反対側へ移動。',{role:'breakthrough',keywords:['進軍']});
U('Forest',7,'双葉の守り手',5,5,1,0,0,'swap','登場時：隣接味方を防御。',{entryEffect:'guardAdjacent',role:'defense',keywords:['防御']});
S('Forest',8,'狩場の入れ替え',5,'retreat','味方を自陣方向へ1マス退避。',{role:'position',keywords:['離脱']});
U('Forest',9,'月影の追跡者',6,4,2,2,1,'stepStrike','短射程と攻撃後移動を併せ持つ。',{onAttack:'sidestep',role:'evolution',keywords:['離脱'],preferredRow:'back'});
S('Forest',10,'森王の抜け道',8,'strongForest','敵陣の味方を敵COMMANDER隣接へ転位し、即時行動可能にする。',{role:'finisher',finisher:true,strong:true,finisherKind:'strongForest',keywords:['転位']});
U('Forest',11,'天翔る翠鹿',9,6,2,0,0,'stepStrike','登場時：最前線の味方と位置交換。',{entryEffect:'forestFinisher',moveTrait:{type:'forward',steps:2},role:'finisher',finisher:true,keywords:['転位']});
S('Forest',12,'千枝一閃',10,'strongForest','敵陣の侵入者を決戦位置へ送り込む。',{role:'finisher',finisher:true,strong:true,finisherKind:'strongForest',keywords:['転位','進軍']});

U('Arcane',1,'燐光の見習い',1,2,1,2,1,'shiftEnemy','射程2の基礎魔法。',{line:'oneUnit',unitPierce:1,rangedDamageType:'magic',role:'early',preferredRow:'back'});
S('Arcane',2,'磁力の手',2,'pull','射線上の敵を自分側へ1マス引き寄せる。',{role:'position',keywords:['引き寄せ']});
U('Arcane',3,'結界測量士',3,4,1,0,0,'swap','登場時：自身に防御。',{entryEffect:'fortify',role:'defense',keywords:['防御']});
U('Arcane',4,'玻璃の弓術師',3,3,1,3,2,'step','射程3、射線が必要。',{role:'ranged',preferredRow:'back'});
S('Arcane',5,'斥力波',4,'push','隣接敵を1マス押し出す。',{role:'breakthrough',keywords:['押撃']});
U('Arcane',6,'星図魔導士',4,4,1,3,2,'shiftEnemy','進化時：隣接敵を移動。',{line:'oneUnit',unitPierce:1,rangedDamageType:'magic',role:'evolution',preferredRow:'back'});
S('Arcane',7,'精密射撃式',5,'snipe','射程2以内の敵へ1ダメージ。',{role:'removal'});
U('Arcane',8,'魔導前衛',5,6,2,0,0,'push','進化時：隣接敵を押し出す。',{role:'frontline',keywords:['押撃']});
S('Arcane',9,'陣形崩落',6,'barrage','敵へ1ダメージを与え、1マス押し出す。',{role:'breakthrough',keywords:['押撃']});
U('Arcane',10,'天球儀の賢者',8,5,1,4,2,'shiftEnemy','射程4。後列から決戦射線を作る。',{line:'oneUnit',unitPierce:1,rangedDamageType:'magic',role:'finisher',finisher:true,preferredRow:'back'});
S('Arcane',11,'大規模陣形崩壊',9,'strongArcane','敵前衛へ3ダメージ。同列へ1ダメージし、味方遠距離を射線へ移す。',{role:'finisher',finisher:true,strong:true,finisherKind:'strongArcane',keywords:['押撃','転位']});
S('Arcane',12,'終端魔法・星路',10,'strongArcane','防衛線を崩し、最も近い遠距離をCOMMANDER射線へ置く。',{role:'finisher',finisher:true,strong:true,finisherKind:'strongArcane',keywords:['転位']});

U('Nether',1,'墓守の小骨',1,2,1,0,0,'step','DOWN時：1枚引く。',{onDown:'draw',role:'early',keywords:['墓還']});
U('Nether',2,'還る従者',2,3,1,0,0,'step','墓地があれば1枚引く。',{entryEffect:'drawIfGrave',role:'value',keywords:['墓還']});
S('Nether',3,'浅い蘇生',3,'reanimate','墓地の3 COST以下をHP2で召喚。',{role:'position',keywords:['墓還']});
U('Nether',4,'骨弓の番人',3,3,1,3,1,'step','射程3の墓地支援。',{role:'ranged',preferredRow:'back'});
U('Nether',5,'棺盾兵',4,6,1,0,0,'swap','登場時：自身に防御。',{entryEffect:'fortify',role:'defense',keywords:['防御']});
S('Nether',6,'亡者の帰陣',4,'rescue','DOWNした味方をHP1で復帰。',{role:'recovery',keywords:['墓還']});
U('Nether',7,'犠牲の騎兵',5,4,2,0,0,'stepStrike','登場時：前進。倒されても戦線を残す。',{entryEffect:'advance',moveTrait:{type:'forward',steps:2},role:'advance',keywords:['進軍']});
S('Nether',8,'墓標の交換',5,'swap','隣接味方を位置交換。',{role:'position',keywords:['転位']});
U('Nether',9,'死線の司祭',6,4,1,2,2,'shiftEnemy','墓地があれば登場時に1ドロー。',{entryEffect:'drawIfGrave',line:'oneUnit',unitPierce:1,rangedDamageType:'magic',role:'evolution',preferredRow:'back'});
U('Nether',10,'黄泉路の将',8,6,2,0,0,'stepStrike','墓地3枚以上で小型を2体復帰。',{entryEffect:'netherFinisher',role:'finisher',finisher:true,keywords:['墓還']});
S('Nether',11,'葬列の凱旋',9,'strongNether','墓地4枚以上で敵COMMANDER周辺へ小型2体を復帰。',{role:'finisher',finisher:true,strong:true,finisherKind:'strongNether',keywords:['墓還','進軍']});
U('Nether',12,'冥府の門番',10,7,3,0,0,'stepStrike','登場時：墓地から攻城兵を復帰させる。',{entryEffect:'netherFinisher',role:'finisher',finisher:true,keywords:['墓還']});

U('Mechanica',1,'偵察歯車',1,2,1,0,0,'step','DOWN時：1枚引く。',{onDown:'draw',role:'early'});
U('Mechanica',2,'組立工',2,3,1,0,0,'swap','登場時：隣接にトークンを生成。',{entryEffect:'token',role:'token',keywords:['砲台']});
S('Mechanica',3,'仮設障壁',2,'wall','味方隣接の空きマスへ仮壁を設置。',{role:'defense',keywords:['砲台']});
U('Mechanica',4,'小型砲兵',3,3,1,3,1,'step','射程3。装置越しに攻撃角を取る。',{role:'ranged',preferredRow:'back',keywords:['砲台']});
U('Mechanica',5,'装甲運搬機',4,6,2,0,0,'swap','登場時：自身に防御。',{entryEffect:'fortify',role:'frontline',keywords:['防御']});
S('Mechanica',6,'機路転換',4,'swap','隣接する味方を位置交換。',{role:'position',keywords:['転位']});
U('Mechanica',7,'連結砲台',5,4,1,3,2,'step','後列用の射程3砲台。',{role:'ranged',preferredRow:'back',keywords:['砲台']});
S('Mechanica',8,'排障ピストン',5,'breach','隣接敵を押し出し味方が前進。',{role:'breakthrough',keywords:['押撃','進軍']});
U('Mechanica',9,'再起動技師',6,4,1,0,0,'stepStrike','登場時：トークンを生成。進化で即時戦闘。',{entryEffect:'token',role:'evolution',keywords:['砲台']});
U('Mechanica',10,'多脚攻城機',8,7,2,2,1,'push','登場時：トークン2体生成し近い敵へ1ダメージ。',{entryEffect:'mechanicaFinisher',role:'finisher',finisher:true,keywords:['砲台','押撃']});
S('Mechanica',11,'全機転送',9,'strongMechanica','トークン2体を敵COMMANDER周辺へ転送し即時行動可能にする。',{role:'finisher',finisher:true,strong:true,finisherKind:'strongMechanica',keywords:['砲台','転位']});
U('Mechanica',12,'王城破砕機構',10,8,3,0,0,'stepStrike','登場時：装置群を攻城戦力へ変換。',{entryEffect:'mechanicaFinisher',role:'finisher',finisher:true,keywords:['砲台']});

U('Abyss',1,'血契の小鬼',1,3,1,0,0,'step','DOWN時：1枚引く。',{onDown:'draw',role:'early'});
U('Abyss',2,'裂傷の先兵',2,4,2,0,0,'step','登場時：自COMMANDERに1ダメージし前進。',{entryEffect:'selfHarmAdvance',role:'advance',keywords:['進軍']});
S('Abyss',3,'血の疾駆',3,'selfHarmRush','自COMMANDERに1ダメージ。味方を前方へ1マス移動。',{role:'breakthrough',keywords:['進軍']});
U('Abyss',4,'吸命の射手',3,3,1,2,1,'shiftEnemy','短射程。前衛と連携して削る。',{rangedDamageType:'magic',line:'oneUnit',unitPierce:1,role:'ranged',preferredRow:'back'});
U('Abyss',5,'契約の護り手',4,6,2,0,0,'swap','登場時：自身に防御。',{entryEffect:'fortify',role:'defense',keywords:['防御']});
S('Abyss',6,'生命吸収',4,'drain','隣接敵へ1ダメージしCOMMANDERを1回復。',{role:'recovery'});
U('Abyss',7,'狂奔の刃',5,4,3,0,0,'stepStrike','登場時：自COMMANDERへ1ダメージし前進。',{entryEffect:'selfHarmAdvance',moveTrait:{type:'forward',steps:2},role:'breakthrough',keywords:['進軍']});
S('Abyss',8,'深紅の跳躍',5,'bloodLunge','自COMMANDERに1ダメージし、味方を前方2マス移動。',{role:'position',keywords:['進軍']});
U('Abyss',9,'夜蝕の魔女',6,4,1,3,2,'shiftEnemy','登場時：自傷して1枚引く。',{entryEffect:'selfHarmDraw',rangedDamageType:'magic',line:'oneUnit',unitPierce:1,role:'evolution',preferredRow:'back'});
U('Abyss',10,'奈落の執行者',8,6,3,0,0,'stepStrike','低HP時の前線を高打点へ変える。',{entryEffect:'selfHarmAdvance',moveTrait:{type:'forward',steps:2},role:'finisher',finisher:true,keywords:['進軍']});
S('Abyss',11,'最終血契',9,'strongAbyss','味方2体と自COMMANDER HP2を代償に敵COMMANDERへ2ダメージ。',{role:'finisher',finisher:true,strong:true,finisherKind:'strongAbyss'});
U('Abyss',12,'終焉を喰らう者',10,7,3,2,2,'stepStrike','自傷と前進を即時圧力へ変える決戦体。',{entryEffect:'selfHarmAdvance',rangedDamageType:'magic',line:'oneUnit',unitPierce:1,moveTrait:{type:'forward',steps:2},role:'finisher',finisher:true,keywords:['進軍']});

const deckDefs={
 p1_Kingdom_Midrange:['Kingdom',[1,2,3,4,5,6,7,8,9,10]],p1_Kingdom_Advance:['Kingdom',[1,2,3,6,7,8,9,10,11,12]],
 p1_Forest_Mobility:['Forest',[1,2,3,4,5,6,7,8,9,10]],p1_Forest_Ambush:['Forest',[1,2,3,4,5,6,8,9,11,12]],
 p1_Arcane_Line:['Arcane',[1,2,3,4,5,6,7,8,9,10]],p1_Arcane_Break:['Arcane',[1,2,3,4,5,6,7,9,11,12]],
 p1_Nether_Grave:['Nether',[1,2,3,4,5,6,7,8,9,10]],p1_Nether_March:['Nether',[1,2,3,4,5,6,7,9,11,12]],
 p1_Mechanica_Token:['Mechanica',[1,2,3,4,5,6,7,8,9,10]],p1_Mechanica_Siege:['Mechanica',[1,2,3,4,5,7,8,9,11,12]],
 p1_Abyss_Tempo:['Abyss',[1,2,3,4,5,6,7,8,9,10]],p1_Abyss_Contract:['Abyss',[1,2,3,4,5,6,7,9,11,12]]
 };
for(const [id,[cl,nums]] of Object.entries(deckDefs)){let cards=nums.flatMap(n=>[`p1_${cl}_${String(n).padStart(2,'0')}`,`p1_${cl}_${String(n).padStart(2,'0')}`]);let style=id.split('_').at(-1);R.decks[id]={name:`${identities[cl].name} / ${style}`,description:`Phase 1 ${identities[cl].name} ${style} prototype`,classId:cl,cards}}
R.phase1={version:'0.37',core:{coreId:'D',researchBreakthroughAdvanceMode:'charge_restricted',researchFirstUnitBack:true,researchForwardDeployment:true},identities,keywords:{'突撃':'1マス移動後、隣接敵へ弱攻撃。','進軍':'敵陣方向へ位置を進める効果。','押撃':'敵を1マス押し出す。','転位':'味方の位置を交換または移送する。','離脱':'攻撃後に横へ位置調整する。','墓還':'墓地またはDOWNからユニットを戻す。','砲台':'トークンや装置と連携する機巧能力。'},cards:Object.values(ids).flat(),decks:Object.keys(deckDefs)};
})();

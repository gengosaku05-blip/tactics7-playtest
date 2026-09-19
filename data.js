// Ver.0.10: 実験条件とカード定義。研究カードは research_data.js に追加。
window.RULES = {
  version:'0.10.1',size:7,actionsPerTurn:3,cardsUseActions:false,summonTempo:'moveOnly',
  hand:{initial:4,drawPerTurn:1,max:7,emptyDeck:'noDraw'},
  energy:{mode:'ramp',initial:1,growth:1,cap:10,centerBonus:1},
  evolution:{ep:{first:2,second:2},unlockTurn:{first:5,second:4}},
  summonRows:{player:[5,6],cpu:[0,1]},frontlineSummon:false,deckCopyLimit:2,allowNeutral:true,center:{x:3,y:3},
  terrain:['.......','.......','.......','.......','.......','.......','.......'],
  classes:{
    commander:{name:'COMMANDER',icon:'★',hp:6,melee:1,range:0,ranged:0,line:'none',moveTrait:null,evolution:'swap',description:'守るべき指揮官。DOWNで敗北。'},
    recruit:{name:'王国の新兵',icon:'兵',hp:3,melee:1,range:0,ranged:0,line:'none',moveTrait:null,evolution:'step',description:'DOWN時に1枚引く。'},
    knight:{name:'新米騎士',icon:'剣',hp:5,melee:2,range:0,ranged:0,line:'none',moveTrait:{type:'forward',steps:2},evolution:'stepStrike',description:'前進2マス。登場時に1マス前進できる。'},
    guard:{name:'護衛騎士',icon:'護',hp:5,melee:2,range:0,ranged:0,line:'none',moveTrait:null,evolution:'swap',description:'登場時、隣接する味方を防御。'},
    spearman:{name:'槍兵',icon:'槍',hp:5,melee:2,range:2,ranged:1,line:'straight',moveTrait:{type:'orthogonal',steps:2},evolution:'push',description:'直線2マスの槍攻撃と直線2マス移動。'},
    archer:{name:'弓兵',icon:'弓',hp:4,melee:1,range:3,ranged:2,rangedDamageType:'ranged_projectile',line:'clear',attackShape:{directions:'queen',unitPierce:0,terrainPierce:0,engaged:false},moveTrait:null,evolution:'step',description:'射程3。ユニットで射線が止まる。'},
    mage:{name:'魔法使い',icon:'魔',hp:4,melee:1,range:2,ranged:2,rangedDamageType:'magic',line:'oneUnit',attackShape:{directions:'queen',unitPierce:1,terrainPierce:0,engaged:false},moveTrait:null,evolution:'shiftEnemy',description:'射程2。ユニット1体を飛び越える魔法。'},
    tank:{name:'重装兵',icon:'盾',hp:6,melee:2,range:0,ranged:0,line:'none',moveTrait:null,evolution:'swap',description:'射線と進路を塞ぐ壁。'},
    captain:{name:'騎士団長',icon:'団',hp:5,melee:2,range:0,ranged:0,line:'none',moveTrait:{type:'forward',steps:2},evolution:'stepStrike',description:'王国の味方がDOWN済みなら登場時に1ドロー。'}
  },
  cards:{
    recruit:{name:'王国の新兵',type:'unit',classId:'recruit',cost:1,tags:['王国'],onDown:'draw',effect:'DOWN時：1ドロー',art:{normal:null,evolved:null}},
    knight:{name:'新米騎士',type:'unit',classId:'knight',cost:3,tags:['王国'],onSummon:'stepForward',effect:'登場時：1マス前進可',art:{normal:null,evolved:null}},
    guard:{name:'護衛騎士',type:'unit',classId:'guard',cost:3,tags:['王国'],onSummon:'guardAdjacent',effect:'登場時：隣接味方を防御',art:{normal:null,evolved:null}},
    spearman:{name:'槍兵',type:'unit',classId:'spearman',cost:3,tags:['王国'],effect:'直線2マス攻撃・移動',art:{normal:null,evolved:null}},
    archer:{name:'弓兵',type:'unit',classId:'archer',cost:4,tags:[],effect:'射線が通れば遠隔2',art:{normal:null,evolved:null}},
    mage:{name:'魔法使い',type:'unit',classId:'mage',cost:4,tags:['魔女'],effect:'ユニット1体を飛び越えて遠隔2',art:{normal:null,evolved:null}},
    tank:{name:'重装兵',type:'unit',classId:'tank',cost:5,tags:[],effect:'射線・進路を遮る壁',art:{normal:null,evolved:null}},
    captain:{name:'騎士団長',type:'unit',classId:'captain',cost:4,tags:['王国'],onSummon:'royalDraw',effect:'登場時：王国DOWN済みなら1ドロー',art:{normal:null,evolved:null}},
    breakthrough:{name:'強行突破',type:'spell',cost:2,tags:[],effect:'味方を1マス移動し、隣接敵へ1ダメージ'},
    swap:{name:'入れ替え',type:'spell',cost:1,tags:[],effect:'隣接する味方2体の位置を交換'},
    retreat:{name:'緊急撤退',type:'spell',cost:1,tags:[],effect:'味方を自陣方向へ1マス移動'},
    rescue:{name:'救命',type:'spell',cost:2,tags:[],effect:'DOWNした味方をHP1で復帰'}
  },
  decks:{
    assault:{name:'速攻 / 進軍',description:'新兵と騎士で中央へ早く展開。移動スペルで突破する。',cards:['recruit','recruit','recruit','recruit','knight','knight','knight','guard','spearman','spearman','spearman','archer','captain','breakthrough','breakthrough','breakthrough','swap','swap','retreat','rescue']},
    defense:{name:'防衛 / 射撃',description:'重装で射線を作り、弓と魔法で中央を守る。',cards:['recruit','recruit','knight','guard','guard','spearman','archer','archer','archer','mage','mage','tank','tank','captain','breakthrough','swap','swap','retreat','retreat','rescue']}
  }
};

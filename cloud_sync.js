/* Ver.0.41 resilient, consent-gated Human Playtest cloud queue. */
(function(){'use strict';
const CFG=window.TACTICS7_PLAYTEST_CONFIG||{},QUEUE_KEY='tactics7_playtest_cloud_queue_v041',CONSENT_KEY='tactics7_playtest_cloud_consent_v041',clone=v=>JSON.parse(JSON.stringify(v));
function loadQueue(){try{return JSON.parse(localStorage.getItem(QUEUE_KEY))||{schema:'tactics7-cloud-queue-0.41',items:{}}}catch{return{schema:'tactics7-cloud-queue-0.41',items:{}}}}
function saveQueue(q){localStorage.setItem(QUEUE_KEY,JSON.stringify(q))}
function hasConsent(){return localStorage.getItem(CONSENT_KEY)==='yes'}
function consent(){localStorage.setItem(CONSENT_KEY,'yes');syncPending()}
function decline(){localStorage.removeItem(CONSENT_KEY)}
function summary(m){return{matchId:m.matchId,testerId:m.testerId,timestamp:m.timestamp,source:'human_playtest',gameVersion:m.gameVersion,cardSetVersion:m.cardSetVersion,logSchemaVersion:m.logSchemaVersion||'0.41',coreVersion:m.coreVersion||'F1-H2-G2R-research',core:m.core,seed:m.seed,human:m.human,cpu:m.cpu,firstSide:m.firstSide,result:m.result,survey:m.survey||null,syncStatus:m.syncStatus||'pending'}}
function decisions(m){return{matchId:m.matchId,source:'human_playtest',gameVersion:m.gameVersion,logSchemaVersion:m.logSchemaVersion||'0.41',decisions:m.decisions||[],uiEvents:m.uiEvents||[],replay:m.replay||{initialHands:null,actions:[]}}}
function payload(m){return{source:'human_playtest',logSchemaVersion:'0.41',matchSummary:summary(m),decisionLog:decisions(m)}}
function newWriteToken(){let bytes=new Uint8Array(24);crypto.getRandomValues(bytes);return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('')}
function notify(matchId,status,error=''){window.dispatchEvent(new CustomEvent('tactics7-sync-status',{detail:{matchId,status,error}}))}
function queue(match){if(!hasConsent()||!match?.matchId)return false;let q=loadQueue(),old=q.items[match.matchId]||{},uploadToken=old.uploadToken||newWriteToken(),body=payload(match);body.uploadToken=uploadToken;q.items[match.matchId]={matchId:match.matchId,status:'pending',attempts:old.attempts||0,revision:(old.revision||0)+1,uploadToken,lastError:'',updatedAt:new Date().toISOString(),payload:body};saveQueue(q);notify(match.matchId,'pending');syncPending();return true}
let syncing=false;
async function syncPending(){
  if(syncing||!hasConsent()||!navigator.onLine)return;
  let initial=loadQueue(),ids=Object.values(initial.items).filter(v=>v.status!=='synced').map(v=>v.matchId);
  if(!ids.length)return;
  if(!CFG.ingestEndpoint){for(const id of ids){let q=loadQueue(),v=q.items[id];if(!v)continue;v.status='pending';v.lastError='remote_not_configured';saveQueue(q);notify(id,'pending',v.lastError)}return}
  syncing=true;
  try{
    for(const id of ids){
      let q=loadQueue(),item=q.items[id];if(!item||item.status==='synced')continue;
      let sentRevision=item.revision||0,body=JSON.stringify(item.payload);
      item.attempts=(item.attempts||0)+1;item.lastAttemptAt=new Date().toISOString();saveQueue(q);
      try{
        if(new Blob([body]).size>2_500_000)throw Error('payload_too_large');
        let headers={'content-type':'application/json'};if(CFG.supabaseAnonKey){headers.apikey=CFG.supabaseAnonKey;headers.Authorization='Bearer '+CFG.supabaseAnonKey}
        let res=await fetch(CFG.ingestEndpoint,{method:'POST',headers,body,keepalive:body.length<60000});if(!res.ok)throw Error('HTTP '+res.status);
        q=loadQueue();item=q.items[id];if(!item)continue;
        if((item.revision||0)===sentRevision){item.status='synced';item.syncedAt=new Date().toISOString();item.lastError='';notify(id,'synced')}
        else{item.status='pending';item.lastError='updated_during_sync';notify(id,'pending',item.lastError)}
        saveQueue(q)
      }catch(e){q=loadQueue();item=q.items[id];if(!item)continue;item.status='failed';item.lastError=String(e?.message||e);saveQueue(q);notify(id,'failed',item.lastError)}
    }
  }finally{syncing=false}
  if(Object.values(loadQueue().items).some(v=>v.status==='pending'&&v.lastError==='updated_during_sync'))setTimeout(syncPending,0)
}
function status(matchId){return loadQueue().items[matchId]?.status||'local_only'}
function stats(match){let p=payload(match),s=JSON.stringify(p.matchSummary).length,d=JSON.stringify(p.decisionLog).length;return{summaryBytes:s,decisionBytes:d,totalBytes:s+d,summaryKB:+(s/1024).toFixed(2),decisionKB:+(d/1024).toFixed(2),totalKB:+((s+d)/1024).toFixed(2)}}
window.addEventListener('online',syncPending);document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncPending()});setTimeout(syncPending,0);
window.PlaytestCloud={config:CFG,hasConsent,consent,decline,queue,syncPending,status,stats,payload,loadQueue,clearQueue:()=>localStorage.removeItem(QUEUE_KEY)};
})();

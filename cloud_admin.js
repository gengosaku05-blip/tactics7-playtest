/* Admin cloud read: credentials are entered at runtime and kept in memory only. */
(function(){'use strict';
async function fetchMatches(endpoint,token){if(!endpoint||!token)throw Error('管理者EndpointとTokenを入力してください');let r=await fetch(endpoint,{headers:{'x-admin-token':token}});if(!r.ok)throw Error('Cloud read failed: HTTP '+r.status);let data=await r.json(),rows=Array.isArray(data)?data:data.matches;if(!Array.isArray(rows))throw Error('matches配列がありません');return rows.map(v=>v.match||v)}
window.PlaytestCloudAdmin={fetchMatches};
})();

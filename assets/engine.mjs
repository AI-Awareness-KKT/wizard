/** Pure duel rules. Coordinates are in a 1200 × 650 arena. */
export const RULES=Object.freeze({winScore:5,cooldown:.58,protection:1,boltSpeed:720,headRadius:29,boltRadius:7});
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function segmentDistance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);}
export function elbowAngle(s,e,w){const a={x:s.x-e.x,y:s.y-e.y},b={x:w.x-e.x,y:w.y-e.y};return Math.acos(clamp((a.x*b.x+a.y*b.y)/(Math.hypot(a.x,a.y)*Math.hypot(b.x,b.y)||1),-1,1))*180/Math.PI;}
export class Duel{
 constructor(){this.reset();}
 reset(){this.players=[0,1].map(i=>({id:i,x:i?965:235,duck:0,aim:0,score:0,cooldown:0,protected:0,arms:[false,false],casts:[0,0],flash:0}));this.bolts=[];this.events=[];this.time=0;this.winner=null;this.shots=[0,0];this.hits=[0,0];}
 head(id){const p=this.players[id];return {x:p.x,y:282+145*p.duck};}
 muzzle(id,hand=0){const p=this.players[id],d=id?-1:1;return {x:p.x+d*(104+hand*8),y:304+145*p.duck+hand*22};}
 pose(id,duck,aim=0){const p=this.players[id];p.duck=clamp(duck,0,1);p.aim=clamp(aim,-.65,.65);}
 arm(id,hand,extended,aim=this.players[id].aim){const p=this.players[id],previous=p.arms[hand];p.arms[hand]=extended;if(extended&&!previous)return this.fire(id,hand,aim);return false;}
 fire(id,hand=0,aim=this.players[id].aim){const p=this.players[id];if(this.winner!==null||p.cooldown>0)return false;const origin=this.muzzle(id,hand),d=id?-1:1,target=this.head(1-id);const slope=clamp(aim,-.65,.65)+(282-origin.y)/Math.abs(target.x-origin.x);const length=Math.hypot(1,slope);this.bolts.push({...origin,px:origin.x,py:origin.y,vx:d*RULES.boltSpeed/length,vy:slope*RULES.boltSpeed/length,owner:id,hand,age:0});p.cooldown=RULES.cooldown;p.casts[hand]=.24;this.shots[id]++;this.events.push({type:'cast',player:id});return true;}
 step(seconds){if(this.winner!==null)return;const dt=clamp(seconds,0,.04);this.time+=dt;for(const p of this.players){p.cooldown=Math.max(0,p.cooldown-dt);p.protected=Math.max(0,p.protected-dt);p.flash=Math.max(0,p.flash-dt);p.casts=p.casts.map(t=>Math.max(0,t-dt));}const remove=new Set();for(const b of this.bolts){b.px=b.x;b.py=b.y;b.x+=b.vx*dt;b.y+=b.vy*dt;b.age+=dt;const opponent=this.players[1-b.owner],head=this.head(opponent.id);if(segmentDistance(head,{x:b.px,y:b.py},b)<=RULES.headRadius+RULES.boltRadius){remove.add(b);if(opponent.protected<=0){opponent.protected=RULES.protection;opponent.flash=.35;this.players[b.owner].score++;this.hits[b.owner]++;this.events.push({type:'hit',player:b.owner,x:head.x,y:head.y});}}if(b.x<0||b.x>1200||b.y<0||b.y>650||b.age>3)remove.add(b);}this.bolts=this.bolts.filter(b=>!remove.has(b));const winners=this.players.filter(p=>p.score>=RULES.winScore);if(winners.length){if(winners.length===2){for(const p of this.players)p.score=4;this.bolts=[];this.events.push({type:'tie'});}else{this.winner=winners[0].id;this.bolts=[];this.events.push({type:'win',player:this.winner});}}}
 takeEvents(){return this.events.splice(0);}
}

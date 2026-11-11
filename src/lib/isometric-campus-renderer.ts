import type { AgentProfile } from "@/types";
import { CAMPUS_ROOMS, STATIONS, project, roomAt, CAMPUS_WIDTH, CAMPUS_HEIGHT, type Point } from "./campus-layout";
export { CAMPUS_WIDTH, CAMPUS_HEIGHT } from "./campus-layout";
export const getRoomAtIsometricCoords = roomAt;
export interface RippleEffect { x: number; y: number; radius: number; maxRadius: number; opacity: number }

export function getAgentAtIsometricCoords(x: number, y: number, agents: AgentProfile[], zoom = 1, showNames = true, selectedId: string | null = null) {
  const fontSize = Math.max(10, 11 / zoom);
  return [...agents].sort((a, b) => b.currentCoordinates.y - a.currentCoordinates.y).find(a => {
    const dx = Math.abs(a.currentCoordinates.x - x), dy = y - a.currentCoordinates.y;
    const body = dx <= 19 && dy >= -47 && dy <= 9;
    const labelVisible = (showNames && zoom >= .5) || a.id === selectedId;
    const name = labelVisible && dx <= (a.name.length * fontSize * .6 + 18) / 2 && Math.abs(dy - 19) <= fontSize / 2 + 5;
    return body || name;
  }) ?? null;
}

function polygon(ctx: CanvasRenderingContext2D, points: Point[], fill: string, stroke?: string) {
  ctx.beginPath();
  points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
  ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
}

function tile(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, d: number, fill: string, z = 0, stroke?: string) {
  const points = [project(x, y), project(x + w, y), project(x + w, y + d), project(x, y + d)].map(p => ({ x: p.x, y: p.y - z }));
  polygon(ctx, points, fill, stroke);
}

function box(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, d: number, h: number, top: string, left: string, right: string, z = 0) {
  const a = project(x, y + d), b = project(x + w, y + d), c = project(x + w, y);
  polygon(ctx, [{x:a.x,y:a.y-z-h},{x:b.x,y:b.y-z-h},{x:b.x,y:b.y-z},{x:a.x,y:a.y-z}], left);
  polygon(ctx, [{x:b.x,y:b.y-z-h},{x:c.x,y:c.y-z-h},{x:c.x,y:c.y-z},{x:b.x,y:b.y-z}], right);
  tile(ctx, x, y, w, d, top, z + h);
}

function plant(ctx: CanvasRenderingContext2D, x: number, y: number, large = false) {
  box(ctx,x-10,y-10,20,20,15,"#d2d6c6","#7c8e88","#aab8a6");
  const p=project(x,y); const s=large?1.4:1;
  ctx.save(); ctx.translate(p.x,p.y-17); ctx.scale(s,s);
  ctx.fillStyle="#356d58"; ctx.fillRect(-3,-25,6,25);
  [[-18,-25,17,12], [0,-33,16,14],[-10,-40,15,16],[4,-19,16,10],[-17,-13,15,9]].forEach(([a,b,w,h],i)=>{
    ctx.fillStyle=["#57a17b","#77bc8b","#8dcc9d","#4e9973","#6caf83"][i];ctx.fillRect(a,b,w,h);
  }); ctx.restore();
}

function desk(ctx: CanvasRenderingContext2D, x: number, y: number, accent: string) {
  box(ctx,x-30,y-29,5,38,23,"#677c80","#344d54","#40585d");
  box(ctx,x+29,y-29,5,38,23,"#677c80","#344d54","#40585d");
  box(ctx,x-36,y-35,76,43,6,"#e1ceb0","#a78968","#bd9e79",23);
  const p=project(x,y-17);
  ctx.fillStyle="#2b444c"; ctx.fillRect(p.x-3,p.y-47,6,20);ctx.fillRect(p.x-10,p.y-32,20,3);
  ctx.fillStyle="#182c38"; ctx.fillRect(p.x-21,p.y-65,43,27);
  ctx.fillStyle="#365967"; ctx.fillRect(p.x-18,p.y-62,37,20);
  ctx.fillStyle=accent; ctx.fillRect(p.x-14,p.y-58,11,2);ctx.fillRect(p.x-14,p.y-53,23,2);
  ctx.fillStyle="#7ea6af";ctx.fillRect(p.x-14,p.y-48,16,2);
  tile(ctx,x-13,y-3,26,9,"#647778",30);
  box(ctx,x+26,y-13,7,7,9,"#ffffff","#b6caca","#dce8df",29);
  box(ctx,x-12,y+22,25,20,13,"#446875","#233d48","#35545f");
}

function sofa(ctx: CanvasRenderingContext2D,x:number,y:number,color:string) {
  box(ctx,x,y,90,34,15,color,"#476960","#638b78");
  box(ctx,x,y,90,8,30,"#bad0b3","#74927e","#8ca58b");
  box(ctx,x,y,8,34,23,"#a2bfa2","#678c75","#8aab91");
  box(ctx,x+82,y,8,34,23,"#a2bfa2","#678c75","#8aab91");
  tile(ctx,x+15,y+11,22,19,"#dfd4b6",17);
}

function sprite(ctx: CanvasRenderingContext2D, agent: AgentProfile, index: number, selected: boolean, tick: number) {
  const p=agent.currentCoordinates;
  const walking=!!agent.targetCoordinates && Math.hypot(p.x-agent.targetCoordinates.x,p.y-agent.targetCoordinates.y)>1;
  const step=walking ? Math.sin(tick*0.18)*3 : 0;
  ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y));
  ctx.fillStyle="#162b3450";ctx.beginPath();ctx.ellipse(0,2,17,7,0,0,Math.PI*2);ctx.fill();
  if(selected){ctx.strokeStyle="#fff1a8";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,2,21,10,0,0,Math.PI*2);ctx.stroke();}
  const skin=["#ebbb91","#c88d68","#dca779","#f0c9a6"][index%4];
  const hair=["#342c35","#493c35","#253749","#795541"][index%4];
  const rect=(x:number,y:number,w:number,h:number,c:string)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
  rect(-10,-14,8,13+step,"#253745");rect(3,-14,8,13-step,"#253745");
  rect(-12,-3+step,10,5,"#172a36");rect(3,-3-step,11,5,"#172a36");
  rect(-12,-29,24,17,agent.color);rect(-8,-27,4,11,"#ffffff38");
  rect(-16,-26,5,13,agent.color);rect(12,-26,5,13,agent.color);
  rect(-16,-15,5,6,skin);rect(12,-15,5,6,skin);
  rect(-9,-44,19,19,skin);rect(-11,-47,23,8,hair);rect(-11,-41,5,10,hair);
  if(index%3===0){rect(7,-40,5,13,hair);rect(-7,-48,14,3,hair);}
  rect(-4,-36,3,3,"#24313a");rect(5,-36,3,3,"#24313a");rect(1,-29,4,2,"#a9685a");
  if(index%4===1){rect(-6,-38,7,6,"#223d48");rect(4,-38,7,6,"#223d48");rect(0,-37,5,2,"#223d48");}
  rect(2,-24,4,6,"#e7e9d4");
  if(selected){polygon(ctx,[{x:-6,y:-59},{x:6,y:-59},{x:0,y:-52}],"#fff1a8");}
  ctx.restore();
}

function label(ctx:CanvasRenderingContext2D,text:string,x:number,y:number,color:string,size:number,selected=false){
  ctx.font=`${selected?600:500} ${size}px ui-monospace, SFMono-Regular, Consolas, monospace`;
  const w=ctx.measureText(text).width+18;
  ctx.fillStyle=selected?"#f5e6ac":"#122630ee";
  ctx.beginPath();ctx.roundRect(x-w/2,y-size/2-5,w,size+10,4);ctx.fill();
  ctx.fillStyle=selected?"#203637":color;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(text,x,y);
}

export function renderIsometricCampus(ctx:CanvasRenderingContext2D, agents:AgentProfile[], selectedId:string|null, hoveredId:string|null, tick:number, zoom=1, pan={x:0,y:0}, _ripples:RippleEffect[]=[], canvasW=CAMPUS_WIDTH, canvasH=CAMPUS_HEIGHT, showNames=true) {
  ctx.clearRect(0,0,canvasW,canvasH);
  ctx.fillStyle="#10262b";ctx.fillRect(0,0,canvasW,canvasH);
  // A quiet drafting grid stays behind the building, never across its floors.
  ctx.fillStyle="#254047";
  for(let x=24;x<canvasW;x+=32)for(let y=24;y<canvasH;y+=32)ctx.fillRect(x,y,1,1);
  ctx.save();ctx.translate(canvasW/2+pan.x,canvasH/2+pan.y);ctx.scale(zoom,zoom);ctx.translate(-CAMPUS_WIDTH/2,-CAMPUS_HEIGHT/2);
  tile(ctx,-25,-25,910,910,"#071c2280",-31);
  box(ctx,-12,-12,864,864,20,"#56746e","#233f45","#345359",-20);
  tile(ctx,0,0,840,840,"#d0d1b8");
  // Continuous corridors link the rooms; cutaway partitions keep the whole roster visible.
  for(const r of CAMPUS_ROOMS){
    tile(ctx,r.x,r.y,240,240,r.floor,0,"#536d6b");
    for(let n=40;n<240;n+=40){
      const a=project(r.x+n,r.y), b=project(r.x+n,r.y+240), c=project(r.x,r.y+n), d=project(r.x+240,r.y+n);
      ctx.strokeStyle="#203d4015";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.moveTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.stroke();
    }
    tile(ctx,r.x+10,r.y+10,220,3,r.color);
  }
  // Tall rear walls only: the foreground remains a clear architectural cutaway.
  box(ctx,-4,-4,848,7,55,"#608078","#2d4a50","#254047");
  box(ctx,-4,3,7,837,55,"#608078","#2d4a50","#254047");
  for(let n=30;n<800;n+=140){
    box(ctx,n,0,95,4,23,"#9dd3c9","#70a69f","#8ec2b5",21);
    box(ctx,0,n,4,95,23,"#9dd3c9","#70a69f","#8ec2b5",21);
  }
  const objects:{depth:number;draw:()=>void}[]=[];
  const add=(x:number,y:number,draw:()=>void)=>objects.push({depth:project(x,y).y,draw});
  for(const r of CAMPUS_ROOMS){
    // Short dividers leave a generous opening onto the corridor.
    add(r.x+240,r.y+85,()=>box(ctx,r.x+236,r.y+12,4,72,18,"#d7e0cf","#52716b","#789087"));
    add(r.x+20,r.y+225,()=>plant(ctx,r.x+20,r.y+225));
    if(["design","engineering","operations","research","server"].includes(r.id)){
      for(const id of r.members){const s=STATIONS[id];add(s.x,s.y-12,()=>desk(ctx,s.x,s.y-20,r.color));}
    }
  }
  // Systems racks and studio pinboard.
  [330,375,420].forEach(x=>add(x,45,()=>{
    box(ctx,x,30,32,25,54,"#507780","#243b48","#354e59");
    const p=project(x+16,55);
    for(let i=0;i<4;i++){ctx.fillStyle="#466170";ctx.fillRect(p.x-9,p.y-46+i*10,19,6);ctx.fillStyle="#96e4c1";ctx.fillRect(p.x-7,p.y-44+i*10,3,2);}
  }));
  add(100,40,()=>{box(ctx,65,35,90,5,38,"#d7d5c5","#d8cdb6","#a29b87",12);const p=project(110,40);ctx.fillStyle="#a998c7";ctx.fillRect(p.x-18,p.y-40,12,15);ctx.fillStyle="#e4b58b";ctx.fillRect(p.x+2,p.y-35,15,12);});
  // Café counter, espresso machine and two tables.
  add(95,345,()=>{
    box(ctx,40,315,135,35,30,"#e5d3b1","#80614d","#a3805f");
    box(ctx,60,320,32,22,24,"#4a6266","#273e47","#38535a",30);
    box(ctx,117,325,12,12,12,"#f3edda","#c9c2ac","#ddd4bd",30);
  });
  [STATIONS["roy-jhan"],STATIONS.khent].forEach(s=>add(s.x,s.y,()=>box(ctx,s.x-28,s.y-30,52,36,26,"#e8c798","#a98359","#c19c6c")));
  // The shared brain: a luminous glass table with a small hologram.
  add(422,454,()=>{
    box(ctx,385,393,75,62,18,"#123e4c","#183b45","#204e57");
    tile(ctx,374,382,98,84,"#89cfc5",24,"#d6fff0");
    const p=project(423,422);ctx.strokeStyle="#c4fff1";ctx.lineWidth=2;
    ctx.beginPath();ctx.ellipse(p.x,p.y-40,26,12,0,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.ellipse(p.x,p.y-48,20,22,tick*.005,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle="#d4fff2";ctx.fillRect(p.x-5,p.y-54,10,10);
  });
  // Gym mats and treadmills.
  [60,170].forEach(x=>{tile(ctx,x-15,625,70,95,"#415e61");add(x,660,()=>{
    box(ctx,x,630,35,70,7,"#3b5360","#233943","#314953");
    tile(ctx,x+5,642,25,48,"#7a9498",8);
    box(ctx,x,631,4,5,38,"#b0c6c4","#657e87","#8da6ab");
    box(ctx,x+31,631,4,5,38,"#b0c6c4","#657e87","#8da6ab");
    box(ctx,x,625,35,12,8,"#a2b8b2","#364e5c","#57727b",36);
  });});
  // Reception: soft seating, a rug and a welcome desk.
  tile(ctx,625,665,155,125,"#79958c");tile(ctx,633,673,139,109,"#abbca3");
  add(680,650,()=>sofa(ctx,640,620,"#adc0a5"));
  add(720,747,()=>sofa(ctx,680,720,"#adc0a5"));
  add(690,706,()=>box(ctx,670,685,52,32,16,"#dbc6a1","#987f5e","#b29a75"));
  add(785,650,()=>plant(ctx,785,650,true));
  add(770,795,()=>box(ctx,730,780,70,25,28,"#e6d9ba","#8d9b88","#acb7a0"));
  agents.forEach((agent,i)=>objects.push({depth:agent.currentCoordinates.y,draw:()=>sprite(ctx,agent,i,agent.id===selectedId,tick)}));
  objects.sort((a,b)=>a.depth-b.depth).forEach(o=>o.draw());
  // Low front fascia and entry steps.
  box(ctx,0,840,840,5,6,"#adc7b2","#4a6d64","#638478");
  box(ctx,840,0,5,840,6,"#adc7b2","#4a6d64","#638478");
  [0,1,2].forEach(i=>tile(ctx,715,850+i*12,120,13,"#92aaa0",-i*5));
  const roomFont=Math.max(10,10/zoom);
  CAMPUS_ROOMS.forEach((r,i)=>{const p=project(r.x+120,r.y+24);label(ctx,zoom < .45 ? String(i+1).padStart(2,"0") : r.name,p.x,p.y-7,r.color,roomFont);});
  for(const agent of agents){
    const active=agent.id===selectedId||agent.id===hoveredId;
    if((showNames && zoom >= .5)||active){const p=agent.currentCoordinates;label(ctx,agent.name,p.x,p.y+19,"#eef4e9",Math.max(10,11/zoom),active);}
  }
  ctx.restore();
}

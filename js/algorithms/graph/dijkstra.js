// Dijkstra's Shortest Path
registerAlgorithm({
  id: 'dijkstra', name: "Dijkstra's Shortest Path", category: 'Graph', catIcon: '🔗', icon: '🛤️',
  shortDesc: "Find shortest paths from a source to all other vertices",
  description: "Greedy algorithm that finds the shortest path from a source vertex to all other vertices in a weighted graph.",
  howItWorks: ['Initialize distance to source as 0, all others as infinity','Pick the unvisited node with the smallest distance','For each neighbor, calculate new distance through current node','If new distance is shorter, update it (called "relaxation")','Mark current node as visited and repeat until all nodes are processed'],
  timeComplexity: 'O((V+E) log V)', spaceComplexity: 'O(V)', tags: ['graph', 'shortest-path', 'greedy', 'weighted'],
  inputs: [
    { id: 'edges', label: 'Edges (u-v:w)', type: 'text', default: '0-1:4, 0-2:1, 1-3:1, 2-1:2, 2-3:5, 3-4:3', placeholder: '0-1:4, ...' },
    { id: 'start', label: 'Source', type: 'number', default: '0' }
  ],
  randomize() { document.getElementById('inp-edges').value='0-1:4, 0-2:1, 1-3:1, 2-1:2, 2-3:5, 3-4:3'; },
  _parse(str){
    const adj={}, nodes=new Set(), edgeList=[];
    str.split(',').map(s=>s.trim()).filter(Boolean).forEach(e=>{
      const [pair,wStr]=e.split(':'); const w=parseInt(wStr)||1;
      const [u,v]=pair.split('-').map(Number); if(isNaN(u)||isNaN(v)) return;
      nodes.add(u); nodes.add(v); edgeList.push({u,v,w});
      if(!adj[u]) adj[u]=[]; adj[u].push({v,w});
    });
    return {adj,nodes:[...nodes].sort((a,b)=>a-b),edgeList};
  },
  _pos(nodes,w,h){
    const pos={}, n=nodes.length, cx=w/2, cy=h/2-20, r=Math.min(w,h)/3;
    nodes.forEach((node,i)=>{ const a=2*Math.PI*i/n-Math.PI/2; pos[node]={x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)}; });
    return pos;
  },
  generateSteps(vals){
    const {adj,nodes,edgeList}=this._parse(vals.edges), src=parseInt(vals.start);
    const steps=[], dist={}, visited=new Set(), prev={};
    nodes.forEach(n=>{ dist[n]=Infinity; prev[n]=null; }); dist[src]=0;
    steps.push({dist:{...dist},visited:new Set(),current:-1,description:`Initialize: dist[${src}]=0, all others=∞`,codeLine:0,nodes,adj,edgeList,relaxed:[]});
    for(let i=0;i<nodes.length;i++){
      let u=-1, minD=Infinity;
      for(const n of nodes) if(!visited.has(n)&&dist[n]<minD){ minD=dist[n]; u=n; }
      if(u===-1) break;
      visited.add(u);
      steps.push({dist:{...dist},visited:new Set(visited),current:u,description:`Visit node ${u} (dist=${dist[u]})`,codeLine:3,nodes,adj,edgeList,relaxed:[]});
      for(const {v,w} of (adj[u]||[])){
        const newDist=dist[u]+w;
        const relaxed=[];
        if(newDist<dist[v]){
          dist[v]=newDist; prev[v]=u; relaxed.push(v);
          steps.push({dist:{...dist},visited:new Set(visited),current:u,neighbor:v,description:`Relax edge ${u}→${v}: ${dist[u]}+${w}=${newDist} < ${dist[v]===Infinity?'∞':dist[v]+w}`,codeLine:5,nodes,adj,edgeList,relaxed:[v]});
        }
      }
    }
    steps.push({dist:{...dist},visited:new Set(visited),current:-1,description:`Done! Shortest distances from ${src}: ${nodes.map(n=>`${n}:${dist[n]}`).join(', ')}`,codeLine:8,nodes,adj,edgeList,relaxed:[]});
    return steps;
  },
  render(ctx,canvas,step,theme){
    const c=getColors(theme), w=canvas.width/(window.devicePixelRatio||1), h=canvas.height/(window.devicePixelRatio||1);
    const pos=this._pos(step.nodes,w,h-60), r=24;
    // edges with weights
    for(const e of step.edgeList){
      const p1=pos[e.u], p2=pos[e.v]; if(!p1||!p2) continue;
      ctx.strokeStyle=c.edge; ctx.lineWidth=2;
      const mx=(p1.x+p2.x)/2, my=(p1.y+p2.y)/2;
      drawArrow(ctx,p1.x,p1.y,p2.x,p2.y,c.edge,8);
      ctx.fillStyle=c.compare; ctx.font='bold 11px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(e.w,mx,my-10);
    }
    // nodes
    for(const n of step.nodes){
      const p=pos[n]; if(!p) continue;
      let bg=c.node, border=c.nodeBorder, txtC=c.text;
      if(step.visited.has(n)){ bg=c.visited+'40'; border=c.visited; }
      if(n===step.current){ bg=c.active; border=c.active; txtC='#fff'; }
      if(n===step.neighbor){ bg=c.compare; border=c.compare; txtC='#fff'; }
      ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(p.x,p.y,r,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle=border; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(p.x,p.y,r,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle=txtC; ctx.font='bold 14px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(n,p.x,p.y);
      // distance label
      const d=step.dist[n]; ctx.fillStyle=c.accent1; ctx.font='bold 10px Inter';
      ctx.fillText(d===Infinity?'∞':d,p.x,p.y+r+14);
    }
    ctx.textBaseline='alphabetic'; ctx.fillStyle=c.textMuted; ctx.font='12px Inter'; ctx.textAlign='left'; ctx.fillText("Dijkstra's Shortest Path",10,20);
  },
  sourceCode: {
    cpp: `void dijkstra(vector<vector<pair<int,int>>>& adj, int src) {
    int n = adj.size();
    vector<int> dist(n, INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    dist[src] = 0; pq.push({0, src});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
}`,
    java: `void dijkstra(List<List<int[]>> adj, int src) {
    int n = adj.size();
    int[] dist = new int[n]; Arrays.fill(dist, Integer.MAX_VALUE);
    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
    dist[src] = 0; pq.add(new int[]{0, src});
    while (!pq.isEmpty()) {
        int[] top = pq.poll(); int d = top[0], u = top[1];
        if (d > dist[u]) continue;
        for (int[] edge : adj.get(u)) {
            int v = edge[0], w = edge[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.add(new int[]{dist[v], v});
            }
        }
    }
}`,
    python: `import heapq

def dijkstra(adj, src):
    dist = {v: float('inf') for v in adj}
    dist[src] = 0
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return dist`
  }
});

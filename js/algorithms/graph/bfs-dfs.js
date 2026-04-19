// BFS & DFS Graph Traversal
registerAlgorithm({
  id: 'bfs-dfs', name: 'BFS & DFS', category: 'Graph', catIcon: '🔗', icon: '🗺️',
  shortDesc: 'Breadth-First and Depth-First graph traversal',
  description: 'BFS explores neighbors level by level using a queue. DFS explores as deep as possible using a stack.',
  howItWorks: ['BFS: start at source, add to queue, mark visited','BFS: dequeue a node, visit all unvisited neighbors, enqueue them','BFS explores level by level (shortest path in unweighted graphs)','DFS: start at source, push to stack, mark visited','DFS: pop a node, push all unvisited neighbors — goes as deep as possible before backtracking'],
  timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)', tags: ['graph', 'traversal', 'BFS', 'DFS'],
  inputs: [
    { id: 'mode', label: 'Algorithm', type: 'select', default: 'bfs', options: [{value:'bfs',label:'BFS'},{value:'dfs',label:'DFS'}] },
    { id: 'edges', label: 'Edges (u-v)', type: 'text', default: '0-1, 0-2, 1-3, 1-4, 2-5, 2-6, 3-7', placeholder: '0-1, 1-2, ...' },
    { id: 'start', label: 'Start node', type: 'number', default: '0' }
  ],
  randomize() { const edges=['0-1','0-2','1-3','1-4','2-5','2-6','3-7','4-7','5-6']; document.getElementById('inp-edges').value=edges.slice(0,5+Math.floor(Math.random()*4)).join(', '); },
  _parseGraph(edgesStr){
    const adj={}, nodes=new Set();
    edgesStr.split(',').map(s=>s.trim()).filter(Boolean).forEach(e=>{
      const [u,v]=e.split('-').map(Number);
      if(isNaN(u)||isNaN(v)) return;
      nodes.add(u); nodes.add(v);
      if(!adj[u]) adj[u]=[]; if(!adj[v]) adj[v]=[];
      adj[u].push(v); adj[v].push(u);
    });
    return {adj, nodes:[...nodes].sort((a,b)=>a-b)};
  },
  _positionNodes(nodes,w,h){
    const pos={}, n=nodes.length, cx=w/2, cy=h/2, r=Math.min(w,h)/3;
    nodes.forEach((node,i)=>{
      const angle=(2*Math.PI*i/n)-Math.PI/2;
      pos[node]={x:cx+r*Math.cos(angle), y:cy+r*Math.sin(angle)};
    });
    return pos;
  },
  generateSteps(vals){
    const {adj,nodes}=this._parseGraph(vals.edges), start=parseInt(vals.start), isBFS=vals.mode==='bfs';
    if(!nodes.length) throw new Error('No valid edges');
    const steps=[], visited=new Set(), order=[];
    steps.push({visited:new Set(),current:-1,order:[],queue:[],description:`Starting ${isBFS?'BFS':'DFS'} from node ${start}`,codeLine:0,nodes,adj});
    if(isBFS){
      const queue=[start]; visited.add(start);
      while(queue.length){
        const u=queue.shift(); order.push(u);
        steps.push({visited:new Set(visited),current:u,order:[...order],queue:[...queue],description:`Visit node ${u}`,codeLine:2,nodes,adj});
        for(const v of (adj[u]||[])){
          if(!visited.has(v)){
            visited.add(v); queue.push(v);
            steps.push({visited:new Set(visited),current:u,order:[...order],queue:[...queue],neighbor:v,description:`Enqueue neighbor ${v}`,codeLine:4,nodes,adj});
          }
        }
      }
    } else {
      const stack=[start];
      while(stack.length){
        const u=stack.pop();
        if(visited.has(u)) continue;
        visited.add(u); order.push(u);
        steps.push({visited:new Set(visited),current:u,order:[...order],queue:[...stack],description:`Visit node ${u}`,codeLine:2,nodes,adj});
        for(const v of (adj[u]||[]).slice().reverse()){
          if(!visited.has(v)){
            stack.push(v);
            steps.push({visited:new Set(visited),current:u,order:[...order],queue:[...stack],neighbor:v,description:`Push neighbor ${v} to stack`,codeLine:4,nodes,adj});
          }
        }
      }
    }
    steps.push({visited:new Set(visited),current:-1,order:[...order],queue:[],description:`${isBFS?'BFS':'DFS'} complete. Order: ${order.join(' → ')}`,codeLine:6,nodes,adj});
    return steps;
  },
  render(ctx,canvas,step,theme){
    const c=getColors(theme), w=canvas.width/(window.devicePixelRatio||1), h=canvas.height/(window.devicePixelRatio||1);
    const pos=this._positionNodes(step.nodes,w,h-40), r=24;
    // edges
    const drawn=new Set();
    for(const u in step.adj){
      for(const v of step.adj[u]){
        const key=[Math.min(u,v),Math.max(u,v)].join('-');
        if(drawn.has(key)) continue; drawn.add(key);
        ctx.strokeStyle=c.edge; ctx.lineWidth=2;
        ctx.beginPath(); ctx.moveTo(pos[u].x,pos[u].y); ctx.lineTo(pos[v].x,pos[v].y); ctx.stroke();
      }
    }
    // nodes
    for(const n of step.nodes){
      let bg=c.node, border=c.nodeBorder, txtC=c.text;
      if(step.visited.has(n)){ bg=c.visited+'60'; border=c.visited; }
      if(n===step.current){ bg=c.active; border=c.active; txtC='#fff'; }
      if(n===step.neighbor){ bg=c.compare; border=c.compare; txtC='#fff'; }
      ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(pos[n].x,pos[n].y,r,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle=border; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(pos[n].x,pos[n].y,r,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle=txtC; ctx.font='bold 14px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(n,pos[n].x,pos[n].y);
    }
    // order
    ctx.textBaseline='alphabetic'; ctx.fillStyle=c.accent1; ctx.font='bold 12px Inter'; ctx.textAlign='center';
    ctx.fillText('Visit order: '+step.order.join(' → '),w/2,h-10);
    ctx.fillStyle=c.textMuted; ctx.font='12px Inter'; ctx.textAlign='left'; ctx.fillText('BFS / DFS',10,20);
  },
  sourceCode: {
    cpp: `// BFS
void bfs(vector<vector<int>>& adj, int start) {
    vector<bool> visited(adj.size(), false);
    queue<int> q;
    q.push(start); visited[start] = true;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        cout << u << " ";
        for (int v : adj[u]) {
            if (!visited[v]) { visited[v] = true; q.push(v); }
        }
    }
}
// DFS
void dfs(vector<vector<int>>& adj, int u, vector<bool>& visited) {
    visited[u] = true;
    cout << u << " ";
    for (int v : adj[u])
        if (!visited[v]) dfs(adj, v, visited);
}`,
    java: `// BFS
void bfs(List<List<Integer>> adj, int start) {
    boolean[] visited = new boolean[adj.size()];
    Queue<Integer> q = new LinkedList<>();
    q.add(start); visited[start] = true;
    while (!q.isEmpty()) {
        int u = q.poll();
        System.out.print(u + " ");
        for (int v : adj.get(u))
            if (!visited[v]) { visited[v] = true; q.add(v); }
    }
}
// DFS
void dfs(List<List<Integer>> adj, int u, boolean[] visited) {
    visited[u] = true;
    System.out.print(u + " ");
    for (int v : adj.get(u))
        if (!visited[v]) dfs(adj, v, visited);
}`,
    python: `from collections import deque

def bfs(adj, start):
    visited = {start}
    queue = deque([start])
    order = []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in adj[u]:
            if v not in visited:
                visited.add(v)
                queue.append(v)
    return order

def dfs(adj, start, visited=None):
    if visited is None: visited = set()
    visited.add(start)
    order = [start]
    for v in adj[start]:
        if v not in visited:
            order.extend(dfs(adj, v, visited))
    return order`
  }
});

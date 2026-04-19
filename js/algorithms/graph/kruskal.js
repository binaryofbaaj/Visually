// Kruskal's MST
registerAlgorithm({
  id: 'kruskal', name: "Kruskal's MST", category: 'Graph', catIcon: '🔗', icon: '🌐',
  shortDesc: 'Find minimum spanning tree by selecting cheapest edges',
  description: "Greedy algorithm that builds MST by sorting edges by weight and adding them if they don't form a cycle (uses Union-Find).",
  howItWorks: ['Sort all edges in the graph by weight (ascending)','Pick the smallest edge not yet considered','Check if adding this edge creates a cycle (using Union-Find)','If no cycle, add edge to MST; otherwise skip it','Repeat until MST has V-1 edges (V = number of vertices)'],
  timeComplexity: 'O(E log E)', spaceComplexity: 'O(V)', tags: ['graph', 'MST', 'greedy', 'union-find'],
  inputs: [
    { id: 'edges', label: 'Edges (u-v:w)', type: 'text', default: '0-1:4, 0-2:3, 1-2:1, 1-3:2, 2-3:4, 3-4:2, 2-4:5', placeholder: '0-1:4, ...' }
  ],
  randomize() { document.getElementById('inp-edges').value='0-1:4, 0-2:3, 1-2:1, 1-3:2, 2-3:4, 3-4:2, 2-4:5'; },
  generateSteps(vals){
    const edges=[], nodes=new Set();
    vals.edges.split(',').map(s=>s.trim()).filter(Boolean).forEach(e=>{
      const [pair,wStr]=e.split(':'); const w=parseInt(wStr)||1;
      const [u,v]=pair.split('-').map(Number); if(isNaN(u)||isNaN(v)) return;
      nodes.add(u); nodes.add(v); edges.push({u,v,w});
    });
    const nodeArr=[...nodes].sort((a,b)=>a-b);
    edges.sort((a,b)=>a.w-b.w);
    const parent={}, rank={}; nodeArr.forEach(n=>{parent[n]=n;rank[n]=0;});
    function find(x){ if(parent[x]!==x) parent[x]=find(parent[x]); return parent[x]; }
    function union(x,y){ const px=find(x),py=find(y); if(px===py) return false; if(rank[px]<rank[py]) parent[px]=py; else if(rank[px]>rank[py]) parent[py]=px; else {parent[py]=px;rank[px]++;} return true; }
    const steps=[], mstEdges=[];
    steps.push({edges,nodes:nodeArr,mstEdges:[],current:null,description:'Edges sorted by weight. Start Kruskal.',codeLine:0,totalW:0});
    let totalW=0;
    for(const e of edges){
      steps.push({edges,nodes:nodeArr,mstEdges:[...mstEdges],current:e,description:`Consider edge ${e.u}-${e.v} (weight ${e.w})`,codeLine:2,totalW});
      if(union(e.u,e.v)){
        mstEdges.push(e); totalW+=e.w;
        steps.push({edges,nodes:nodeArr,mstEdges:[...mstEdges],current:e,accepted:true,description:`Accept edge ${e.u}-${e.v}: no cycle formed`,codeLine:4,totalW});
      } else {
        steps.push({edges,nodes:nodeArr,mstEdges:[...mstEdges],current:e,rejected:true,description:`Reject edge ${e.u}-${e.v}: would form cycle`,codeLine:5,totalW});
      }
    }
    steps.push({edges,nodes:nodeArr,mstEdges:[...mstEdges],current:null,description:`MST complete! Total weight: ${totalW}`,codeLine:7,totalW});
    return steps;
  },
  render(ctx,canvas,step,theme){
    const c=getColors(theme), w=canvas.width/(window.devicePixelRatio||1), h=canvas.height/(window.devicePixelRatio||1);
    const nodes=step.nodes, n=nodes.length, pos={};
    const cx=w/2, cy=h/2-20, r_layout=Math.min(w,h)/3, nr=24;
    nodes.forEach((node,i)=>{ const a=2*Math.PI*i/n-Math.PI/2; pos[node]={x:cx+r_layout*Math.cos(a),y:cy+r_layout*Math.sin(a)}; });
    // all edges (faded)
    for(const e of step.edges){
      ctx.strokeStyle=c.edge+'40'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(pos[e.u].x,pos[e.u].y); ctx.lineTo(pos[e.v].x,pos[e.v].y); ctx.stroke();
      const mx=(pos[e.u].x+pos[e.v].x)/2, my=(pos[e.u].y+pos[e.v].y)/2;
      ctx.fillStyle=c.textMuted; ctx.font='10px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(e.w,mx,my-8);
    }
    // MST edges
    for(const e of step.mstEdges){
      ctx.strokeStyle=c.found; ctx.lineWidth=3;
      ctx.beginPath(); ctx.moveTo(pos[e.u].x,pos[e.u].y); ctx.lineTo(pos[e.v].x,pos[e.v].y); ctx.stroke();
    }
    // current edge
    if(step.current){
      const e=step.current;
      ctx.strokeStyle=step.accepted?c.found:step.rejected?c.swap:c.compare; ctx.lineWidth=3; ctx.setLineDash([6,4]);
      ctx.beginPath(); ctx.moveTo(pos[e.u].x,pos[e.u].y); ctx.lineTo(pos[e.v].x,pos[e.v].y); ctx.stroke();
      ctx.setLineDash([]);
    }
    // nodes
    for(const nd of nodes){
      const p=pos[nd];
      let bg=c.node, border=c.nodeBorder;
      if(step.current&&(nd===step.current.u||nd===step.current.v)){ bg=c.compare; border=c.compare; }
      ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(p.x,p.y,nr,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle=border; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(p.x,p.y,nr,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle=c.text; ctx.font='bold 14px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(nd,p.x,p.y);
    }
    ctx.textBaseline='alphabetic'; ctx.fillStyle=c.accent1; ctx.font='bold 12px Inter'; ctx.textAlign='center';
    ctx.fillText(`MST Weight: ${step.totalW}`,w/2,h-10);
    ctx.fillStyle=c.textMuted; ctx.font='12px Inter'; ctx.textAlign='left'; ctx.fillText("Kruskal's MST",10,20);
  },
  sourceCode: {
    cpp: `class UnionFind {
    vector<int> parent, rank;
public:
    UnionFind(int n) : parent(n), rank(n,0) { iota(parent.begin(),parent.end(),0); }
    int find(int x) { return parent[x]==x ? x : parent[x]=find(parent[x]); }
    bool unite(int x, int y) {
        int px=find(x), py=find(y);
        if (px==py) return false;
        if (rank[px]<rank[py]) swap(px,py);
        parent[py]=px;
        if (rank[px]==rank[py]) rank[px]++;
        return true;
    }
};
int kruskal(int n, vector<tuple<int,int,int>>& edges) {
    sort(edges.begin(), edges.end());
    UnionFind uf(n);
    int mstWeight = 0;
    for (auto [w, u, v] : edges)
        if (uf.unite(u, v)) mstWeight += w;
    return mstWeight;
}`,
    java: `class Kruskal {
    int[] parent, rank;
    int find(int x) { return parent[x]==x?x:(parent[x]=find(parent[x])); }
    boolean union(int x, int y) {
        int px=find(x), py=find(y);
        if(px==py) return false;
        if(rank[px]<rank[py]){int t=px;px=py;py=t;}
        parent[py]=px;
        if(rank[px]==rank[py]) rank[px]++;
        return true;
    }
    int kruskal(int n, int[][] edges) {
        parent=new int[n]; rank=new int[n];
        for(int i=0;i<n;i++) parent[i]=i;
        Arrays.sort(edges, (a,b)->a[2]-b[2]);
        int mst=0;
        for(int[] e:edges) if(union(e[0],e[1])) mst+=e[2];
        return mst;
    }
}`,
    python: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py: return False
        if self.rank[px] < self.rank[py]: px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]: self.rank[px] += 1
        return True

def kruskal(n, edges):
    edges.sort(key=lambda e: e[2])
    uf = UnionFind(n)
    mst_weight = 0
    for u, v, w in edges:
        if uf.union(u, v):
            mst_weight += w
    return mst_weight`
  }
});

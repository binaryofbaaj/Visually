// Min/Max Heap Visualization
registerAlgorithm({
  id: 'heap', name: 'Min/Max Heap', category: 'Trees', catIcon: '🌳', icon: '🏔️',
  shortDesc: 'Complete binary tree with heap property',
  description: 'A complete binary tree where each parent is smaller (min-heap) or larger (max-heap) than its children.',
  howItWorks: ['Heap is stored as an array: parent at i, children at 2i+1 and 2i+2','Insert: add element at the end, then "bubble up" by swapping with parent if needed','Extract: remove root (min/max), replace with last element, then "heapify down"','Heapify down: swap with the smaller (min-heap) or larger (max-heap) child','Used in priority queues and heap sort — always keeps min/max at the root'],
  timeComplexity: 'O(log n) insert/extract', spaceComplexity: 'O(n)', tags: ['heap', 'priority-queue', 'complete-tree'],
  inputs: [
    { id: 'type', label: 'Type', type: 'select', default: 'min', options: [{value:'min',label:'Min Heap'},{value:'max',label:'Max Heap'}] },
    { id: 'ops', label: 'Operations', type: 'text', default: 'insert 40, insert 20, insert 30, insert 10, insert 50, insert 15, extract', placeholder: 'insert X, extract' }
  ],
  randomize() { const ops=Array.from({length:6},()=>`insert ${Math.floor(Math.random()*99)+1}`); ops.push('extract'); document.getElementById('inp-ops').value=ops.join(', '); },
  generateSteps(vals) {
    const isMin=vals.type==='min', ops=vals.ops.split(',').map(s=>s.trim()).filter(Boolean);
    const steps=[], heap=[];
    const cmp=(a,b)=>isMin?a<b:a>b;
    steps.push({heap:[],description:`Empty ${isMin?'Min':'Max'} Heap`,codeLine:0});
    for(const op of ops){
      if(op.startsWith('insert')){
        const val=parseInt(op.split(' ')[1]); if(isNaN(val)) continue;
        heap.push(val); let i=heap.length-1;
        steps.push({heap:[...heap],highlight:[i],description:`Insert ${val} at end (index ${i})`,codeLine:2});
        while(i>0){
          const parent=Math.floor((i-1)/2);
          if(cmp(heap[i],heap[parent])){
            steps.push({heap:[...heap],highlight:[i,parent],description:`${heap[i]} ${isMin?'<':'>'} ${heap[parent]}, swap with parent`,codeLine:4});
            [heap[i],heap[parent]]=[heap[parent],heap[i]]; i=parent;
            steps.push({heap:[...heap],highlight:[i],description:'After swap',codeLine:5});
          } else break;
        }
        steps.push({heap:[...heap],highlight:[],description:`${val} inserted, heap property maintained`,codeLine:6});
      } else if(op==='extract'){
        if(!heap.length){ steps.push({heap:[],description:'Heap is empty!',codeLine:8}); continue; }
        const top=heap[0]; heap[0]=heap[heap.length-1]; heap.pop();
        steps.push({heap:[...heap],highlight:[0],description:`Extract ${isMin?'min':'max'} = ${top}, move last to root`,codeLine:8});
        let i=0;
        while(true){
          let target=i, l=2*i+1, r=2*i+2;
          if(l<heap.length&&cmp(heap[l],heap[target])) target=l;
          if(r<heap.length&&cmp(heap[r],heap[target])) target=r;
          if(target===i) break;
          steps.push({heap:[...heap],highlight:[i,target],description:`Heapify down: swap ${heap[i]} with ${heap[target]}`,codeLine:10});
          [heap[i],heap[target]]=[heap[target],heap[i]]; i=target;
          steps.push({heap:[...heap],highlight:[i],description:'After swap',codeLine:11});
        }
        steps.push({heap:[...heap],highlight:[],description:`Extracted ${top}, heap restored`,codeLine:12});
      }
    }
    return steps;
  },
  render(ctx, canvas, step, theme) {
    const c=getColors(theme), w=canvas.width/(window.devicePixelRatio||1), h=canvas.height/(window.devicePixelRatio||1);
    const heap=step.heap, n=heap.length; if(!n){ ctx.fillStyle=c.textMuted; ctx.font='16px Inter'; ctx.textAlign='center'; ctx.fillText('Empty Heap',w/2,h/2); return; }
    const r=22, treeH=Math.floor(Math.log2(n))+1;
    // tree view
    const positions=[];
    for(let i=0;i<n;i++){
      const level=Math.floor(Math.log2(i+1)), posInLevel=i-Math.pow(2,level)+1, nodesInLevel=Math.pow(2,level);
      const x=w/2+(posInLevel-(nodesInLevel-1)/2)*(w/(nodesInLevel+1)*0.8);
      const y=50+level*65;
      positions.push({x,y});
    }
    // edges
    for(let i=1;i<n;i++){
      const parent=Math.floor((i-1)/2);
      ctx.strokeStyle=c.edge; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(positions[parent].x,positions[parent].y); ctx.lineTo(positions[i].x,positions[i].y); ctx.stroke();
    }
    // nodes
    for(let i=0;i<n;i++){
      let bg=c.node, border=c.nodeBorder, txtC=c.text;
      if(step.highlight&&step.highlight.includes(i)){ bg=c.active; border=c.active; txtC='#fff'; }
      ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(positions[i].x,positions[i].y,r,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle=border; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(positions[i].x,positions[i].y,r,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle=txtC; ctx.font='bold 13px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(heap[i],positions[i].x,positions[i].y);
    }
    // array view at bottom
    const cellW=Math.min(40,(w-40)/n), startX=(w-n*cellW)/2, ay=h-45;
    ctx.fillStyle=c.textMuted; ctx.font='11px Inter'; ctx.textAlign='center'; ctx.textBaseline='alphabetic'; ctx.fillText('Array representation:',w/2,ay-12);
    for(let i=0;i<n;i++){
      const x=startX+i*cellW;
      let bg=c.node;
      if(step.highlight&&step.highlight.includes(i)) bg=c.active;
      ctx.fillStyle=bg; drawRoundRect(ctx,x,ay,cellW-2,28,4); ctx.fill();
      ctx.strokeStyle=c.nodeBorder; ctx.lineWidth=1; drawRoundRect(ctx,x,ay,cellW-2,28,4); ctx.stroke();
      ctx.fillStyle=c.text; ctx.font='bold 11px Inter'; ctx.fillText(heap[i],x+cellW/2,ay+18);
    }
    ctx.textBaseline='alphabetic';
    ctx.fillStyle=c.textMuted; ctx.font='12px Inter'; ctx.textAlign='left'; ctx.fillText('Min/Max Heap',10,20);
  },
  sourceCode: {
    cpp: `class MinHeap {
    vector<int> heap;
    void heapifyUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (heap[i] < heap[parent]) { swap(heap[i], heap[parent]); i = parent; }
            else break;
        }
    }
    void heapifyDown(int i) {
        int n = heap.size();
        while (2*i+1 < n) {
            int smallest = i, l = 2*i+1, r = 2*i+2;
            if (l < n && heap[l] < heap[smallest]) smallest = l;
            if (r < n && heap[r] < heap[smallest]) smallest = r;
            if (smallest == i) break;
            swap(heap[i], heap[smallest]); i = smallest;
        }
    }
public:
    void insert(int val) { heap.push_back(val); heapifyUp(heap.size()-1); }
    int extractMin() { int top=heap[0]; heap[0]=heap.back(); heap.pop_back(); heapifyDown(0); return top; }
};`,
    java: `class MinHeap {
    List<Integer> heap = new ArrayList<>();
    void insert(int val) { heap.add(val); heapifyUp(heap.size()-1); }
    int extractMin() { int top=heap.get(0); heap.set(0,heap.get(heap.size()-1)); heap.remove(heap.size()-1); heapifyDown(0); return top; }
    void heapifyUp(int i) { while(i>0){int p=(i-1)/2; if(heap.get(i)<heap.get(p)){Collections.swap(heap,i,p);i=p;}else break;} }
    void heapifyDown(int i) { int n=heap.size(); while(2*i+1<n){int s=i,l=2*i+1,r=2*i+2; if(l<n&&heap.get(l)<heap.get(s))s=l; if(r<n&&heap.get(r)<heap.get(s))s=r; if(s==i)break; Collections.swap(heap,i,s);i=s;} }
}`,
    python: `import heapq

# Using heapq (min-heap by default)
heap = []
heapq.heappush(heap, val)     # insert
top = heapq.heappop(heap)     # extract min

# Manual implementation
class MinHeap:
    def __init__(self):
        self.heap = []
    def insert(self, val):
        self.heap.append(val)
        self._heapify_up(len(self.heap)-1)
    def extract_min(self):
        top = self.heap[0]
        self.heap[0] = self.heap[-1]
        self.heap.pop()
        self._heapify_down(0)
        return top
    def _heapify_up(self, i):
        while i > 0:
            p = (i-1)//2
            if self.heap[i] < self.heap[p]:
                self.heap[i], self.heap[p] = self.heap[p], self.heap[i]
                i = p
            else: break
    def _heapify_down(self, i):
        n = len(self.heap)
        while 2*i+1 < n:
            s, l, r = i, 2*i+1, 2*i+2
            if l < n and self.heap[l] < self.heap[s]: s = l
            if r < n and self.heap[r] < self.heap[s]: s = r
            if s == i: break
            self.heap[i], self.heap[s] = self.heap[s], self.heap[i]
            i = s`
  }
});

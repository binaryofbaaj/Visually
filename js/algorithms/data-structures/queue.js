// Queue Visualization
registerAlgorithm({
  id: 'queue', name: 'Queue', category: 'Data Structures', catIcon: '📦', icon: '🚶',
  shortDesc: 'First-In-First-Out (FIFO) data structure',
  description: 'A linear data structure that follows FIFO. Elements are added at the rear and removed from the front.',
  howItWorks: ['Enqueue: add an element at the rear of the queue','Dequeue: remove the element from the front of the queue','Front: view the first element without removing','Elements are processed in the order they arrive','Follows First-In-First-Out (FIFO) principle'],
  timeComplexity: 'O(1) enqueue/dequeue', spaceComplexity: 'O(n)', tags: ['FIFO', 'linear', 'enqueue', 'dequeue'],
  inputs: [
    { id: 'ops', label: 'Operations', type: 'text', default: 'enqueue 10, enqueue 20, enqueue 30, dequeue, enqueue 40, dequeue', placeholder: 'enqueue X, dequeue' }
  ],
  randomize() { const ops=[]; for(let i=0;i<6;i++) ops.push(Math.random()>0.3?`enqueue ${Math.floor(Math.random()*99)+1}`:'dequeue'); document.getElementById('inp-ops').value=ops.join(', '); },
  generateSteps(vals) {
    const ops=vals.ops.split(',').map(s=>s.trim()).filter(Boolean);
    const steps=[], queue=[];
    steps.push({queue:[...queue],op:'',description:'Empty queue',codeLine:0});
    for(const op of ops){
      if(op.startsWith('enqueue')){
        const val=parseInt(op.split(' ')[1]); if(isNaN(val)) continue;
        queue.push(val);
        steps.push({queue:[...queue],op:'enqueue',val,highlight:queue.length-1,description:`Enqueue ${val} at rear`,codeLine:2});
      } else if(op==='dequeue'){
        if(queue.length===0){ steps.push({queue:[...queue],op:'error',description:'Queue underflow! Cannot dequeue from empty queue',codeLine:5}); continue; }
        const val=queue.shift();
        steps.push({queue:[...queue],op:'dequeue',val,description:`Dequeue ${val} from front`,codeLine:4});
      }
    }
    steps.push({queue:[...queue],op:'done',description:`Final queue (${queue.length} elements)`,codeLine:7});
    return steps;
  },
  render(ctx, canvas, step, theme) {
    const c=getColors(theme), w=canvas.width/(window.devicePixelRatio||1), h=canvas.height/(window.devicePixelRatio||1);
    const queue=step.queue, blockW=80, blockH=50, gap=8;
    const totalW=queue.length*(blockW+gap)-gap, startX=(w-totalW)/2, y=h/2-blockH/2;
    ctx.fillStyle=c.textMuted; ctx.font='bold 12px Inter'; ctx.textAlign='center';
    if(queue.length>0){
      ctx.fillText('FRONT',startX+blockW/2,y-16);
      ctx.fillText('REAR',startX+(queue.length-1)*(blockW+gap)+blockW/2,y-16);
    }
    for(let i=0;i<queue.length;i++){
      const x=startX+i*(blockW+gap);
      let bg=c.accent1+'30', border=c.accent1;
      if(i===queue.length-1&&step.op==='enqueue') { bg=c.found; border=c.found; }
      if(i===0&&step.op==='dequeue') { bg=c.highlight; border=c.highlight; }
      ctx.fillStyle=bg; drawRoundRect(ctx,x,y,blockW,blockH,8); ctx.fill();
      ctx.strokeStyle=border; ctx.lineWidth=2; drawRoundRect(ctx,x,y,blockW,blockH,8); ctx.stroke();
      ctx.fillStyle=c.text; ctx.font='bold 16px Inter'; ctx.textAlign='center'; ctx.fillText(queue[i],x+blockW/2,y+blockH/2+6);
      if(i<queue.length-1){ drawArrow(ctx,x+blockW+2,y+blockH/2,x+blockW+gap-2,y+blockH/2,c.accent1,6); }
    }
    if(step.op==='dequeue'){ ctx.fillStyle=c.highlight; ctx.font='bold 14px Inter'; ctx.textAlign='center'; ctx.fillText(`Dequeued: ${step.val}`,w/2,40); }
    if(step.op==='error'){ ctx.fillStyle=c.swap; ctx.font='bold 14px Inter'; ctx.textAlign='center'; ctx.fillText('Queue Underflow!',w/2,40); }
    ctx.fillStyle=c.textMuted; ctx.font='12px Inter'; ctx.textAlign='left'; ctx.fillText('Queue (FIFO)',10,20);
  },
  sourceCode: {
    cpp: `#include <queue>
using namespace std;

queue<int> q;

void enqueue(int val) {
    q.push(val);       // add to rear
}

int dequeue() {
    if (q.empty()) throw runtime_error("Queue underflow");
    int val = q.front(); // get front
    q.pop();             // remove front
    return val;
}`,
    java: `import java.util.LinkedList;
import java.util.Queue;

Queue<Integer> queue = new LinkedList<>();

void enqueue(int val) {
    queue.add(val);
}

int dequeue() {
    if (queue.isEmpty()) throw new RuntimeException("Queue underflow");
    return queue.poll();
}`,
    python: `from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()

    def enqueue(self, val):
        self.items.append(val)     # add to rear

    def dequeue(self):
        if self.is_empty():
            raise IndexError("Queue underflow")
        return self.items.popleft() # remove front

    def is_empty(self):
        return len(self.items) == 0`
  }
});

// Stack Visualization
registerAlgorithm({
  id: 'stack', name: 'Stack', category: 'Data Structures', catIcon: '📦', icon: '📚',
  shortDesc: 'Last-In-First-Out (LIFO) data structure',
  description: 'A linear data structure that follows LIFO. Elements are added (push) and removed (pop) from the top.',
  howItWorks: ['Push: add a new element on top of the stack','Pop: remove the top element from the stack','Peek: view the top element without removing it','Only the top element is accessible at any time','Follows Last-In-First-Out (LIFO) principle'],
  timeComplexity: 'O(1) push/pop', spaceComplexity: 'O(n)', tags: ['LIFO', 'linear', 'push', 'pop'],
  inputs: [
    { id: 'ops', label: 'Operations', type: 'text', default: 'push 10, push 20, push 30, pop, push 40, pop, pop', placeholder: 'push X, pop' }
  ],
  randomize() { const ops=[]; for(let i=0;i<6;i++) ops.push(Math.random()>0.3?`push ${Math.floor(Math.random()*99)+1}`:'pop'); document.getElementById('inp-ops').value=ops.join(', '); },
  generateSteps(vals) {
    const ops=vals.ops.split(',').map(s=>s.trim()).filter(Boolean);
    const steps=[], stack=[];
    steps.push({stack:[...stack],op:'',description:'Empty stack',codeLine:0});
    for(const op of ops){
      if(op.startsWith('push')){
        const val=parseInt(op.split(' ')[1]);
        if(isNaN(val)) continue;
        stack.push(val);
        steps.push({stack:[...stack],op:'push',val,highlight:stack.length-1,description:`Push ${val} onto stack (top)`,codeLine:2});
      } else if(op==='pop'){
        if(stack.length===0){ steps.push({stack:[...stack],op:'error',description:'Stack underflow! Cannot pop from empty stack',codeLine:5}); continue; }
        const val=stack.pop();
        steps.push({stack:[...stack],op:'pop',val,description:`Pop ${val} from top of stack`,codeLine:4});
      }
    }
    steps.push({stack:[...stack],op:'done',description:`Final stack (${stack.length} elements)`,codeLine:7});
    return steps;
  },
  render(ctx, canvas, step, theme) {
    const c=getColors(theme), w=canvas.width/(window.devicePixelRatio||1), h=canvas.height/(window.devicePixelRatio||1);
    const stack=step.stack, blockW=120, blockH=40, gap=4;
    const startX=w/2-blockW/2, baseY=h-60;
    // draw container
    ctx.strokeStyle=c.nodeBorder; ctx.lineWidth=2; ctx.setLineDash([5,5]);
    ctx.strokeRect(startX-10,baseY-stack.length*(blockH+gap)-blockH-10,blockW+20,(stack.length+1)*(blockH+gap)+20);
    ctx.setLineDash([]);
    ctx.fillStyle=c.textMuted; ctx.font='12px Inter'; ctx.textAlign='center';
    ctx.fillText('TOP ↑',w/2,baseY-stack.length*(blockH+gap)-blockH-20);
    for(let i=0;i<stack.length;i++){
      const x=startX, y=baseY-i*(blockH+gap)-blockH;
      let bg=c.accent2+'40', border=c.accent2;
      if(i===stack.length-1&&step.op==='push') { bg=c.found; border=c.found; }
      ctx.fillStyle=bg; drawRoundRect(ctx,x,y,blockW,blockH,8); ctx.fill();
      ctx.strokeStyle=border; ctx.lineWidth=2; drawRoundRect(ctx,x,y,blockW,blockH,8); ctx.stroke();
      ctx.fillStyle=c.text; ctx.font='bold 16px Inter'; ctx.textAlign='center'; ctx.fillText(stack[i],x+blockW/2,y+blockH/2+6);
      if(i===stack.length-1){ ctx.fillStyle=c.accent1; ctx.font='bold 11px Inter'; ctx.fillText('← TOP',x+blockW+40,y+blockH/2+4); }
    }
    if(step.op==='pop'){ ctx.fillStyle=c.highlight; ctx.font='bold 14px Inter'; ctx.textAlign='center'; ctx.fillText(`Popped: ${step.val}`,w/2,40); }
    if(step.op==='error'){ ctx.fillStyle=c.swap; ctx.font='bold 14px Inter'; ctx.textAlign='center'; ctx.fillText('Stack Underflow!',w/2,40); }
    ctx.fillStyle=c.textMuted; ctx.font='12px Inter'; ctx.textAlign='left'; ctx.fillText('Stack (LIFO)',10,20);
  },
  sourceCode: {
    cpp: `#include <stack>
using namespace std;

stack<int> s;

void push(int val) {
    s.push(val);       // add to top
}

int pop() {
    if (s.empty()) throw runtime_error("Stack underflow");
    int val = s.top(); // get top element
    s.pop();           // remove from top
    return val;
}

int peek() {
    return s.top();    // view top without removing
}`,
    java: `import java.util.Stack;

Stack<Integer> stack = new Stack<>();

void push(int val) {
    stack.push(val);
}

int pop() {
    if (stack.isEmpty()) throw new RuntimeException("Stack underflow");
    return stack.pop();
}

int peek() {
    return stack.peek();
}`,
    python: `class Stack:
    def __init__(self):
        self.items = []

    def push(self, val):
        self.items.append(val)    # add to top

    def pop(self):
        if self.is_empty():
            raise IndexError("Stack underflow")
        return self.items.pop()   # remove from top

    def peek(self):
        return self.items[-1]     # view top

    def is_empty(self):
        return len(self.items) == 0`
  }
});

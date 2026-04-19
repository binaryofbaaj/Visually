// AVL Tree Visualization
registerAlgorithm({
  id: 'avl-tree', name: 'AVL Tree', category: 'Trees', catIcon: '🌳', icon: '⚖️',
  shortDesc: 'Self-balancing BST with rotation operations',
  description: 'A self-balancing BST where the heights of left and right subtrees differ by at most 1. Uses rotations to maintain balance.',
  howItWorks: ['Insert node like a regular BST','Calculate balance factor (BF) = height(left) - height(right) for each ancestor','If BF > 1 or BF < -1, the tree is unbalanced','Apply rotations: LL (right rotate), RR (left rotate), LR or RL (double rotate)','After rotation, the tree becomes balanced again — guaranteeing O(log n) height'],
  timeComplexity: 'O(log n)', spaceComplexity: 'O(n)', tags: ['tree', 'balanced', 'rotations', 'AVL'],
  inputs: [{ id: 'values', label: 'Insert values', type: 'text', default: '30, 20, 10, 25, 40, 35, 50', placeholder: 'e.g. 10,20,30' }],
  randomize() { document.getElementById('inp-values').value=Array.from({length:7},()=>Math.floor(Math.random()*99)+1).join(', '); },
  _h(n){ return n?n.h:0; },
  _bf(n){ return n?this._h(n.left)-this._h(n.right):0; },
  _upH(n){ if(n) n.h=1+Math.max(this._h(n.left),this._h(n.right)); },
  _rr(y){ const x=y.left; y.left=x.right; x.right=y; this._upH(y); this._upH(x); return x; },
  _rl(x){ const y=x.right; x.right=y.left; y.left=x; this._upH(x); this._upH(y); return y; },
  _ins(node,val,steps,allVals){
    if(!node) return {val,left:null,right:null,h:1};
    if(val<node.val) node.left=this._ins(node.left,val,steps,allVals);
    else node.right=this._ins(node.right,val,steps,allVals);
    this._upH(node);
    const bf=this._bf(node);
    if(bf>1&&val<node.left.val){ steps.push({root:this._clone(node),highlight:[node.val],rotation:'LL',description:`LL Rotation at ${node.val} (BF=${bf})`,codeLine:6}); return this._rr(node); }
    if(bf<-1&&val>node.right.val){ steps.push({root:this._clone(node),highlight:[node.val],rotation:'RR',description:`RR Rotation at ${node.val} (BF=${bf})`,codeLine:8}); return this._rl(node); }
    if(bf>1&&val>node.left.val){ steps.push({root:this._clone(node),highlight:[node.val],rotation:'LR',description:`LR Rotation at ${node.val}`,codeLine:10}); node.left=this._rl(node.left); return this._rr(node); }
    if(bf<-1&&val<node.right.val){ steps.push({root:this._clone(node),highlight:[node.val],rotation:'RL',description:`RL Rotation at ${node.val}`,codeLine:12}); node.right=this._rr(node.right); return this._rl(node); }
    return node;
  },
  _clone(n){ if(!n)return null; return {val:n.val,left:this._clone(n.left),right:this._clone(n.right),h:n.h}; },
  _layout(node,x,y,sp){
    if(!node) return [];
    node.x=x; node.y=y;
    const res=[node];
    if(node.left) res.push(...this._layout(node.left,x-sp,y+60,sp/2));
    if(node.right) res.push(...this._layout(node.right,x+sp,y+60,sp/2));
    return res;
  },
  generateSteps(vals){
    const values=vals.values.split(',').map(Number).filter(n=>!isNaN(n));
    if(!values.length) throw new Error('Enter numbers');
    const steps=[]; let root=null;
    steps.push({root:null,highlight:[],description:'Empty AVL Tree',codeLine:0});
    for(const v of values){
      root=this._ins(root,v,steps,values);
      steps.push({root:this._clone(root),highlight:[v],description:`Inserted ${v}, tree is balanced`,codeLine:3});
    }
    steps.push({root:this._clone(root),highlight:[],description:'All values inserted. AVL tree is balanced!',codeLine:14});
    return steps;
  },
  render(ctx,canvas,step,theme){
    const c=getColors(theme), w=canvas.width/(window.devicePixelRatio||1), h=canvas.height/(window.devicePixelRatio||1);
    if(!step.root){ ctx.fillStyle=c.textMuted; ctx.font='16px Inter'; ctx.textAlign='center'; ctx.fillText('Empty Tree',w/2,h/2); return; }
    const nodes=this._layout(step.root,w/2,50,w/5); const r=20;
    function drawE(n){ if(!n)return; if(n.left){ctx.strokeStyle=c.edge;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(n.left.x,n.left.y);ctx.stroke();drawE(n.left);} if(n.right){ctx.strokeStyle=c.edge;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(n.right.x,n.right.y);ctx.stroke();drawE(n.right);} }
    drawE(step.root);
    for(const n of nodes){
      let bg=c.node, border=c.nodeBorder, txtC=c.text;
      if(step.highlight&&step.highlight.includes(n.val)){ bg=c.active; border=c.active; txtC='#fff'; }
      ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(n.x,n.y,r,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle=border; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(n.x,n.y,r,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle=txtC; ctx.font='bold 13px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(n.val,n.x,n.y);
      // balance factor
      const bf=this._bf(n);
      ctx.fillStyle=Math.abs(bf)>1?c.swap:c.textMuted; ctx.font='10px Inter'; ctx.fillText(`bf:${bf}`,n.x,n.y+r+12);
    }
    ctx.textBaseline='alphabetic';
    if(step.rotation){ ctx.fillStyle=c.accent1; ctx.font='bold 14px Inter'; ctx.textAlign='center'; ctx.fillText(`Rotation: ${step.rotation}`,w/2,h-20); }
    ctx.fillStyle=c.textMuted; ctx.font='12px Inter'; ctx.textAlign='left'; ctx.fillText('AVL Tree',10,20);
  },
  sourceCode: {
    cpp: `struct Node {
    int val, height;
    Node *left, *right;
    Node(int v) : val(v), height(1), left(nullptr), right(nullptr) {}
};
int height(Node* n) { return n ? n->height : 0; }
int balanceFactor(Node* n) { return n ? height(n->left)-height(n->right) : 0; }
Node* rotateRight(Node* y) {
    Node* x = y->left; y->left = x->right; x->right = y;
    y->height = 1+max(height(y->left),height(y->right));
    x->height = 1+max(height(x->left),height(x->right));
    return x;
}
Node* rotateLeft(Node* x) {
    Node* y = x->right; x->right = y->left; y->left = x;
    x->height = 1+max(height(x->left),height(x->right));
    y->height = 1+max(height(y->left),height(y->right));
    return y;
}
Node* insert(Node* node, int val) {
    if (!node) return new Node(val);
    if (val < node->val) node->left = insert(node->left, val);
    else node->right = insert(node->right, val);
    node->height = 1+max(height(node->left),height(node->right));
    int bf = balanceFactor(node);
    if (bf>1 && val<node->left->val) return rotateRight(node);
    if (bf<-1 && val>node->right->val) return rotateLeft(node);
    if (bf>1 && val>node->left->val) { node->left=rotateLeft(node->left); return rotateRight(node); }
    if (bf<-1 && val<node->right->val) { node->right=rotateRight(node->right); return rotateLeft(node); }
    return node;
}`,
    java: `class AVLTree {
    class Node { int val, height; Node left, right; Node(int v){val=v;height=1;} }
    int height(Node n) { return n==null?0:n.height; }
    int bf(Node n) { return n==null?0:height(n.left)-height(n.right); }
    Node rotateRight(Node y) { Node x=y.left; y.left=x.right; x.right=y; y.height=1+Math.max(height(y.left),height(y.right)); x.height=1+Math.max(height(x.left),height(x.right)); return x; }
    Node rotateLeft(Node x) { Node y=x.right; x.right=y.left; y.left=x; x.height=1+Math.max(height(x.left),height(x.right)); y.height=1+Math.max(height(y.left),height(y.right)); return y; }
    Node insert(Node node, int val) {
        if (node==null) return new Node(val);
        if (val<node.val) node.left=insert(node.left,val); else node.right=insert(node.right,val);
        node.height=1+Math.max(height(node.left),height(node.right));
        int b=bf(node);
        if (b>1&&val<node.left.val) return rotateRight(node);
        if (b<-1&&val>node.right.val) return rotateLeft(node);
        if (b>1&&val>node.left.val) { node.left=rotateLeft(node.left); return rotateRight(node); }
        if (b<-1&&val<node.right.val) { node.right=rotateRight(node.right); return rotateLeft(node); }
        return node;
    }
}`,
    python: `class Node:
    def __init__(self, val):
        self.val = val
        self.left = self.right = None
        self.height = 1

def height(n): return n.height if n else 0
def bf(n): return height(n.left) - height(n.right) if n else 0

def rotate_right(y):
    x = y.left; y.left = x.right; x.right = y
    y.height = 1 + max(height(y.left), height(y.right))
    x.height = 1 + max(height(x.left), height(x.right))
    return x

def rotate_left(x):
    y = x.right; x.right = y.left; y.left = x
    x.height = 1 + max(height(x.left), height(x.right))
    y.height = 1 + max(height(y.left), height(y.right))
    return y

def insert(node, val):
    if not node: return Node(val)
    if val < node.val: node.left = insert(node.left, val)
    else: node.right = insert(node.right, val)
    node.height = 1 + max(height(node.left), height(node.right))
    b = bf(node)
    if b > 1 and val < node.left.val: return rotate_right(node)
    if b < -1 and val > node.right.val: return rotate_left(node)
    if b > 1 and val > node.left.val:
        node.left = rotate_left(node.left); return rotate_right(node)
    if b < -1 and val < node.right.val:
        node.right = rotate_right(node.right); return rotate_left(node)
    return node`
  }
});

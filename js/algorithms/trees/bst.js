// BST Visualization
registerAlgorithm({
  id: 'bst', name: 'Binary Search Tree', category: 'Trees', catIcon: '🌳', icon: '🌲',
  shortDesc: 'A tree where left child < parent < right child',
  description: 'Binary tree maintaining sorted order. Supports insert, search, delete, and traversals.',
  howItWorks: ['Each node has at most two children: left (smaller) and right (larger)','Insert: compare with current node, go left if smaller, right if larger, insert when a null spot is found','Search: traverse the tree comparing values, go left/right accordingly','Inorder traversal (left→root→right) gives elements in sorted order','Average O(log n) operations, but O(n) in worst case (skewed tree)'],
  timeComplexity: 'O(log n) avg', spaceComplexity: 'O(n)', tags: ['tree', 'binary', 'search', 'recursive'],
  inputs: [
    { id: 'ops', label: 'Operations', type: 'text', default: 'insert 50, insert 30, insert 70, insert 20, insert 40, insert 60, insert 80, search 40', placeholder: 'insert X, search X, inorder' },
  ],
  randomize() { const vals=[50,30,70,20,40,60,80].map(()=>Math.floor(Math.random()*99)+1); document.getElementById('inp-ops').value=vals.map(v=>`insert ${v}`).join(', ')+', inorder'; },
  _buildTree(nodes) {
    // returns {val, left, right, x, y} tree
    if(!nodes.length) return null;
    const root={val:nodes[0],left:null,right:null};
    for(let i=1;i<nodes.length;i++){
      let cur=root;
      while(true){
        if(nodes[i]<cur.val){ if(!cur.left){cur.left={val:nodes[i],left:null,right:null};break;}cur=cur.left; }
        else { if(!cur.right){cur.right={val:nodes[i],left:null,right:null};break;}cur=cur.right; }
      }
    }
    return root;
  },
  _layoutTree(node, x, y, spread) {
    if(!node) return [];
    node.x=x; node.y=y;
    const nodes=[node];
    if(node.left) nodes.push(...this._layoutTree(node.left,x-spread,y+60,spread/2));
    if(node.right) nodes.push(...this._layoutTree(node.right,x+spread,y+60,spread/2));
    return nodes;
  },
  generateSteps(vals) {
    const ops=vals.ops.split(',').map(s=>s.trim()).filter(Boolean);
    const steps=[], inserted=[];
    steps.push({inserted:[],highlight:[],path:[],description:'Empty BST',codeLine:0});
    for(const op of ops){
      const parts=op.split(' ');
      if(parts[0]==='insert'){
        const val=parseInt(parts[1]); if(isNaN(val)) continue;
        // trace path
        const path=[];
        let cur=this._buildTree(inserted);
        if(cur){
          let c=cur;
          while(c){ path.push(c.val); if(val<c.val){if(!c.left)break;c=c.left;}else{if(!c.right)break;c=c.right;} }
        }
        steps.push({inserted:[...inserted],highlight:[],path,description:`Inserting ${val}: traversing tree...`,codeLine:2});
        inserted.push(val);
        steps.push({inserted:[...inserted],highlight:[val],path:[],description:`Inserted ${val}`,codeLine:3});
      } else if(parts[0]==='search'){
        const val=parseInt(parts[1]); if(isNaN(val)) continue;
        const cur=this._buildTree(inserted); const path=[];
        let c=cur, found=false;
        while(c){ path.push(c.val); if(c.val===val){found=true;break;} if(val<c.val)c=c.left;else c=c.right; }
        for(let i=0;i<path.length;i++){
          steps.push({inserted:[...inserted],highlight:[path[i]],path:path.slice(0,i+1),description:`Search: visiting ${path[i]}`,codeLine:5});
        }
        steps.push({inserted:[...inserted],highlight:found?[val]:[],path,description:found?`Found ${val}!`:`${val} not found`,codeLine:found?6:7});
      } else if(parts[0]==='inorder'){
        const res=[]; const tree=this._buildTree(inserted);
        function inorder(n){if(!n)return;inorder(n.left);res.push(n.val);inorder(n.right);}
        inorder(tree);
        for(let i=0;i<res.length;i++){
          steps.push({inserted:[...inserted],highlight:[res[i]],path:res.slice(0,i+1),description:`Inorder visit: ${res[i]}`,codeLine:9});
        }
        steps.push({inserted:[...inserted],highlight:[],path:res,description:`Inorder: [${res.join(', ')}]`,codeLine:10});
      }
    }
    return steps;
  },
  render(ctx, canvas, step, theme) {
    const c=getColors(theme), w=canvas.width/(window.devicePixelRatio||1), h=canvas.height/(window.devicePixelRatio||1);
    const tree=this._buildTree(step.inserted);
    if(!tree){ ctx.fillStyle=c.textMuted; ctx.font='16px Inter'; ctx.textAlign='center'; ctx.fillText('Empty Tree',w/2,h/2); return; }
    const nodes=this._layoutTree(tree,w/2,50,w/5);
    const r=20;
    // draw edges
    function drawEdges(node){
      if(!node) return;
      if(node.left){ ctx.strokeStyle=c.edge; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(node.x,node.y); ctx.lineTo(node.left.x,node.left.y); ctx.stroke(); drawEdges(node.left); }
      if(node.right){ ctx.strokeStyle=c.edge; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(node.x,node.y); ctx.lineTo(node.right.x,node.right.y); ctx.stroke(); drawEdges(node.right); }
    }
    drawEdges(tree);
    // draw nodes
    for(const n of nodes){
      let bg=c.node, border=c.nodeBorder, txtC=c.text;
      if(step.highlight&&step.highlight.includes(n.val)){ bg=c.active; border=c.active; txtC='#fff'; }
      else if(step.path&&step.path.includes(n.val)){ bg=c.accent2+'60'; border=c.accent2; }
      ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(n.x,n.y,r,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle=border; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(n.x,n.y,r,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle=txtC; ctx.font='bold 14px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(n.val,n.x,n.y);
    }
    ctx.textBaseline='alphabetic';
    ctx.fillStyle=c.textMuted; ctx.font='12px Inter'; ctx.textAlign='left'; ctx.fillText('Binary Search Tree',10,20);
  },
  sourceCode: {
    cpp: `struct Node {
    int val; Node *left, *right;
    Node(int v) : val(v), left(nullptr), right(nullptr) {}
};

Node* insert(Node* root, int val) {
    if (!root) return new Node(val);
    if (val < root->val) root->left = insert(root->left, val);
    else root->right = insert(root->right, val);
    return root;
}

bool search(Node* root, int val) {
    if (!root) return false;
    if (root->val == val) return true;
    return val < root->val ? search(root->left, val) : search(root->right, val);
}

void inorder(Node* root) {
    if (!root) return;
    inorder(root->left);
    cout << root->val << " ";
    inorder(root->right);
}`,
    java: `class BST {
    class Node { int val; Node left, right; Node(int v) { val=v; } }
    Node root;

    Node insert(Node node, int val) {
        if (node == null) return new Node(val);
        if (val < node.val) node.left = insert(node.left, val);
        else node.right = insert(node.right, val);
        return node;
    }

    boolean search(Node node, int val) {
        if (node == null) return false;
        if (node.val == val) return true;
        return val < node.val ? search(node.left, val) : search(node.right, val);
    }

    void inorder(Node node) {
        if (node == null) return;
        inorder(node.left);
        System.out.print(node.val + " ");
        inorder(node.right);
    }
}`,
    python: `class Node:
    def __init__(self, val):
        self.val = val
        self.left = self.right = None

def insert(root, val):
    if not root: return Node(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root

def search(root, val):
    if not root: return False
    if root.val == val: return True
    return search(root.left if val < root.val else root.right, val)

def inorder(root):
    if not root: return []
    return inorder(root.left) + [root.val] + inorder(root.right)`
  }
});

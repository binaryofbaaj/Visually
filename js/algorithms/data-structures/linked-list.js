// Linked List Visualization
registerAlgorithm({
  id: 'linked-list', name: 'Linked List', category: 'Data Structures', catIcon: '📦', icon: '🔗',
  shortDesc: 'Dynamic linear data structure with node-pointer connections',
  description: 'Each node contains data and a reference to the next node. Supports insert, delete, and traversal.',
  howItWorks: ['Each node stores data and a pointer to the next node','Insert: create a new node and update pointers','Delete: bypass the target node by updating the previous node\'s pointer','Traverse: follow pointers from head to NULL visiting each node','No contiguous memory needed — nodes can be anywhere in memory'],
  timeComplexity: 'O(n) search, O(1) insert/delete at head', spaceComplexity: 'O(n)', tags: ['linked', 'dynamic', 'pointers'],
  inputs: [
    { id: 'ops', label: 'Operations', type: 'text', default: 'insert 10, insert 20, insert 30, insert 15 1, delete 1, traverse', placeholder: 'insert X [pos], delete pos, traverse' }
  ],
  randomize() { const ops=[]; for(let i=0;i<5;i++) ops.push(`insert ${Math.floor(Math.random()*99)+1}`); ops.push('traverse'); document.getElementById('inp-ops').value=ops.join(', '); },
  generateSteps(vals) {
    const ops=vals.ops.split(',').map(s=>s.trim()).filter(Boolean);
    const steps=[], list=[];
    steps.push({list:[...list],op:'',description:'Empty linked list',codeLine:0,highlight:-1,traverse:-1});
    for(const op of ops){
      const parts=op.split(' ');
      if(parts[0]==='insert'){
        const val=parseInt(parts[1]), pos=parts[2]!==undefined?parseInt(parts[2]):list.length;
        if(isNaN(val)) continue;
        const p=Math.min(pos,list.length);
        list.splice(p,0,val);
        steps.push({list:[...list],op:'insert',val,pos:p,highlight:p,traverse:-1,description:`Insert ${val} at position ${p}`,codeLine:2});
      } else if(parts[0]==='delete'){
        const pos=parseInt(parts[1])||0;
        if(pos>=list.length){ steps.push({list:[...list],op:'error',description:`Cannot delete: position ${pos} out of bounds`,codeLine:5,highlight:-1,traverse:-1}); continue; }
        const val=list[pos]; list.splice(pos,1);
        steps.push({list:[...list],op:'delete',val,pos,highlight:-1,traverse:-1,description:`Delete node at position ${pos} (value: ${val})`,codeLine:4});
      } else if(parts[0]==='traverse'){
        for(let i=0;i<list.length;i++){
          steps.push({list:[...list],op:'traverse',highlight:-1,traverse:i,description:`Visit node ${i}: value = ${list[i]}`,codeLine:6});
        }
        steps.push({list:[...list],op:'traverse-done',highlight:-1,traverse:-1,description:'Traversal complete',codeLine:7});
      }
    }
    steps.push({list:[...list],op:'done',highlight:-1,traverse:-1,description:`Final list: [${list.join(' → ')}]`,codeLine:8});
    return steps;
  },
  render(ctx, canvas, step, theme) {
    const c=getColors(theme), w=canvas.width/(window.devicePixelRatio||1), h=canvas.height/(window.devicePixelRatio||1);
    const list=step.list, nodeW=70, nodeH=40, gap=40;
    const totalW=list.length*(nodeW+gap), startX=Math.max(20,(w-totalW)/2), y=h/2-nodeH/2;
    // head label
    if(list.length>0){ ctx.fillStyle=c.accent1; ctx.font='bold 11px Inter'; ctx.textAlign='center'; ctx.fillText('HEAD',startX+nodeW/2,y-16); }
    for(let i=0;i<list.length;i++){
      const x=startX+i*(nodeW+gap);
      let bg=c.node, border=c.nodeBorder;
      if(i===step.highlight) { bg=c.found; border=c.found; }
      if(i===step.traverse) { bg=c.active; border=c.active; }
      ctx.fillStyle=bg; drawRoundRect(ctx,x,y,nodeW,nodeH,8); ctx.fill();
      ctx.strokeStyle=border; ctx.lineWidth=2; drawRoundRect(ctx,x,y,nodeW,nodeH,8); ctx.stroke();
      ctx.fillStyle=c.text; ctx.font='bold 15px Inter'; ctx.textAlign='center'; ctx.fillText(list[i],x+nodeW/2,y+nodeH/2+5);
      // arrow to next
      if(i<list.length-1) drawArrow(ctx,x+nodeW+4,y+nodeH/2,x+nodeW+gap-4,y+nodeH/2,c.accent1,8);
    }
    // NULL
    if(list.length>0){
      const lastX=startX+(list.length-1)*(nodeW+gap)+nodeW+gap;
      ctx.fillStyle=c.textMuted; ctx.font='bold 12px Inter'; ctx.textAlign='left'; ctx.fillText('NULL',lastX-10,y+nodeH/2+4);
    }
    ctx.fillStyle=c.textMuted; ctx.font='12px Inter'; ctx.textAlign='left'; ctx.fillText('Linked List',10,20);
  },
  sourceCode: {
    cpp: `struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
    Node* head = nullptr;
public:
    void insert(int val, int pos) {
        Node* node = new Node(val);
        if (pos == 0) { node->next = head; head = node; return; }
        Node* curr = head;
        for (int i = 0; i < pos - 1 && curr; i++) curr = curr->next;
        node->next = curr->next;
        curr->next = node;
    }
    void deleteAt(int pos) {
        if (pos == 0) { Node* temp = head; head = head->next; delete temp; return; }
        Node* curr = head;
        for (int i = 0; i < pos - 1; i++) curr = curr->next;
        Node* temp = curr->next;
        curr->next = temp->next;
        delete temp;
    }
};`,
    java: `class Node {
    int data;
    Node next;
    Node(int val) { data = val; next = null; }
}

class LinkedList {
    Node head = null;

    void insert(int val, int pos) {
        Node node = new Node(val);
        if (pos == 0) { node.next = head; head = node; return; }
        Node curr = head;
        for (int i = 0; i < pos - 1 && curr != null; i++) curr = curr.next;
        node.next = curr.next;
        curr.next = node;
    }

    void deleteAt(int pos) {
        if (pos == 0) { head = head.next; return; }
        Node curr = head;
        for (int i = 0; i < pos - 1; i++) curr = curr.next;
        curr.next = curr.next.next;
    }
}`,
    python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def insert(self, val, pos=0):
        node = Node(val)
        if pos == 0:
            node.next = self.head
            self.head = node
            return
        curr = self.head
        for _ in range(pos - 1):
            curr = curr.next
        node.next = curr.next
        curr.next = node

    def delete_at(self, pos):
        if pos == 0:
            self.head = self.head.next
            return
        curr = self.head
        for _ in range(pos - 1):
            curr = curr.next
        curr.next = curr.next.next`
  }
});

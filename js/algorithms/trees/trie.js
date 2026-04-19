// Trie Visualization
registerAlgorithm({
  id: 'trie', name: 'Trie (Prefix Tree)', category: 'Trees', catIcon: '🌳', icon: '🔤',
  shortDesc: 'Tree structure for efficient string prefix operations',
  description: 'A tree where each node represents a character. Used for autocomplete, spell-checking, and prefix matching.',
  howItWorks: ['Each node stores one character and has children for each possible next character','Insert: traverse from root, creating new nodes for each character in the word','Mark the last character node as "end of word"','Search: traverse from root following characters — if all exist and end is marked, word is found','Prefix search: same as search but don\'t require end-of-word marker'],
  timeComplexity: 'O(m) per operation', spaceComplexity: 'O(n×m)', tags: ['trie', 'prefix', 'string', 'autocomplete'],
  inputs: [{ id: 'ops', label: 'Operations', type: 'text', default: 'insert cat, insert car, insert card, insert care, search car, search cap', placeholder: 'insert word, search word' }],
  randomize() { const words=['apple','app','ape','bat','ball','bar','cat','car','card']; const sel=words.sort(()=>Math.random()-0.5).slice(0,5); document.getElementById('inp-ops').value=sel.map(w=>`insert ${w}`).join(', ')+`, search ${sel[0]}`; },
  _buildTrie(words){
    const root={ch:'',children:{},isEnd:false};
    for(const w of words){ let node=root; for(const c of w){ if(!node.children[c]) node.children[c]={ch:c,children:{},isEnd:false}; node=node.children[c]; } node.isEnd=true; }
    return root;
  },
  _layoutTrie(node,x,y,spread){
    const nodes=[]; node.x=x; node.y=y; nodes.push(node);
    const keys=Object.keys(node.children); const total=keys.length;
    keys.forEach((k,i)=>{
      const childX=x+(i-(total-1)/2)*spread;
      nodes.push(...this._layoutTrie(node.children[k],childX,y+55,spread/Math.max(total,1.5)));
    });
    return nodes;
  },
  generateSteps(vals){
    const ops=vals.ops.split(',').map(s=>s.trim()).filter(Boolean);
    const steps=[], words=[];
    steps.push({words:[],highlight:[],path:[],description:'Empty Trie',codeLine:0});
    for(const op of ops){
      const parts=op.split(' ');
      if(parts[0]==='insert'){
        const word=parts[1]; if(!word) continue;
        const path=[];
        for(let i=0;i<word.length;i++){
          path.push(word.substring(0,i+1));
          steps.push({words:[...words],highlight:[word.substring(0,i+1)],path:[...path],currentWord:word,description:`Insert "${word}": add '${word[i]}'`,codeLine:2});
        }
        words.push(word);
        steps.push({words:[...words],highlight:[word],path:[],description:`"${word}" inserted`,codeLine:3});
      } else if(parts[0]==='search'){
        const word=parts[1]; if(!word) continue;
        const trie=this._buildTrie(words);
        let node=trie, found=true; const path=[];
        for(const c of word){
          if(!node.children[c]){ found=false; break; }
          node=node.children[c]; path.push(c);
          steps.push({words:[...words],highlight:[path.join('')],path:path.map((_,i)=>word.substring(0,i+1)),description:`Search "${word}": found '${c}'`,codeLine:5});
        }
        if(found&&!node.isEnd) found=false;
        steps.push({words:[...words],highlight:found?[word]:[],path:[],description:found?`"${word}" found in trie!`:`"${word}" not found`,codeLine:found?6:7});
      }
    }
    return steps;
  },
  render(ctx,canvas,step,theme){
    const c=getColors(theme), w=canvas.width/(window.devicePixelRatio||1), h=canvas.height/(window.devicePixelRatio||1);
    const trie=this._buildTrie(step.words);
    const nodes=this._layoutTrie(trie,w/2,40,Math.min(80,w/4));
    const r=18;
    // edges
    for(const n of nodes){
      for(const k in n.children){
        const child=n.children[k];
        ctx.strokeStyle=c.edge; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(n.x,n.y); ctx.lineTo(child.x,child.y); ctx.stroke();
      }
    }
    // nodes
    for(const n of nodes){
      let bg=c.node, border=c.nodeBorder, txtC=c.text;
      if(n.isEnd){ border=c.found; }
      // check highlight
      if(step.highlight&&step.highlight.length){
        const hword=step.highlight[0];
        // try to match this node to highlighted path
      }
      ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(n.x,n.y,r,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle=border; ctx.lineWidth=n.isEnd?3:2; ctx.beginPath(); ctx.arc(n.x,n.y,r,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle=txtC; ctx.font='bold 14px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(n.ch||'∅',n.x,n.y);
    }
    // word list
    ctx.textBaseline='alphabetic'; ctx.fillStyle=c.textMuted; ctx.font='12px Inter'; ctx.textAlign='right';
    ctx.fillText('Words: '+step.words.join(', '),w-10,h-10);
    ctx.textAlign='left'; ctx.fillText('Trie (Prefix Tree)',10,20);
  },
  sourceCode: {
    cpp: `struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool isEnd = false;
};
class Trie {
    TrieNode* root = new TrieNode();
public:
    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children.count(c))
                node->children[c] = new TrieNode();
            node = node->children[c];
        }
        node->isEnd = true;
    }
    bool search(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children.count(c)) return false;
            node = node->children[c];
        }
        return node->isEnd;
    }
};`,
    java: `class Trie {
    class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        boolean isEnd = false;
    }
    TrieNode root = new TrieNode();

    void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            node.children.putIfAbsent(c, new TrieNode());
            node = node.children.get(c);
        }
        node.isEnd = true;
    }
    boolean search(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            if (!node.children.containsKey(c)) return false;
            node = node.children.get(c);
        }
        return node.isEnd;
    }
}`,
    python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return node.is_end`
  }
});

// Fibonacci DP Visualization
registerAlgorithm({
  id: 'fibonacci', name: 'Fibonacci (DP)', category: 'Dynamic Programming', catIcon: '🧠', icon: '🐚',
  shortDesc: 'Compare naive recursion vs dynamic programming for Fibonacci',
  description: 'Demonstrates memoization and tabulation approaches vs naive recursion for computing Fibonacci numbers.',
  howItWorks: ['F(0)=0, F(1)=1 are the base cases','For each i from 2 to N, compute F(i) = F(i-1) + F(i-2)','Tabulation fills a table bottom-up, avoiding redundant calculations','Memoization caches results top-down during recursion','Both reduce time from O(2^n) naive recursion to O(n)'],
  timeComplexity: 'O(n) with DP', spaceComplexity: 'O(n)', tags: ['DP', 'memoization', 'tabulation', 'recursion'],
  inputs: [{ id: 'n', label: 'N (Fibonacci number)', type: 'number', default: '8' }],
  randomize() { document.getElementById('inp-n').value=Math.floor(Math.random()*10)+3; },
  generateSteps(vals){
    const n=parseInt(vals.n); if(isNaN(n)||n<1||n>20) throw new Error('Enter N between 1-20');
    const steps=[], dp=Array(n+1).fill(null);
    dp[0]=0; dp[1]=1;
    steps.push({dp:[...dp],current:-1,description:`Computing F(${n}) using tabulation. F(0)=0, F(1)=1`,codeLine:0});
    for(let i=2;i<=n;i++){
      steps.push({dp:[...dp],current:i,deps:[i-1,i-2],description:`F(${i}) = F(${i-1}) + F(${i-2}) = ${dp[i-1]} + ${dp[i-2]}`,codeLine:3});
      dp[i]=dp[i-1]+dp[i-2];
      steps.push({dp:[...dp],current:i,description:`F(${i}) = ${dp[i]}`,codeLine:4});
    }
    steps.push({dp:[...dp],current:n,description:`Result: F(${n}) = ${dp[n]}`,codeLine:6});
    return steps;
  },
  render(ctx,canvas,step,theme){
    const c=getColors(theme), w=canvas.width/(window.devicePixelRatio||1), h=canvas.height/(window.devicePixelRatio||1);
    const dp=step.dp, n=dp.length;
    const cellW=Math.min(60,(w-80)/n), cellH=50, startX=(w-n*cellW)/2, y=h/2-cellH/2;
    // Title
    ctx.fillStyle=c.textMuted; ctx.font='12px Inter'; ctx.textAlign='left'; ctx.fillText('Fibonacci - Tabulation',10,20);
    // Index row
    ctx.fillStyle=c.textMuted; ctx.font='11px Inter'; ctx.textAlign='center';
    for(let i=0;i<n;i++) ctx.fillText(`F(${i})`,startX+i*cellW+cellW/2,y-12);
    // Cells
    for(let i=0;i<n;i++){
      const x=startX+i*cellW;
      let bg=c.node, border=c.nodeBorder, txtC=c.text;
      if(dp[i]!==null&&i!==step.current) { bg=c.found+'30'; border=c.found; }
      if(i===step.current) { bg=c.active; border=c.active; txtC='#fff'; }
      if(step.deps&&step.deps.includes(i)) { bg=c.compare; border=c.compare; txtC='#fff'; }
      ctx.fillStyle=bg; drawRoundRect(ctx,x+2,y,cellW-4,cellH,8); ctx.fill();
      ctx.strokeStyle=border; ctx.lineWidth=2; drawRoundRect(ctx,x+2,y,cellW-4,cellH,8); ctx.stroke();
      ctx.fillStyle=txtC; ctx.font='bold 16px Inter'; ctx.textAlign='center';
      ctx.fillText(dp[i]!==null?dp[i]:'-',x+cellW/2,y+cellH/2+6);
    }
    // Arrows for deps
    if(step.deps&&step.current>=0){
      for(const d of step.deps){
        const fromX=startX+d*cellW+cellW/2, toX=startX+step.current*cellW+cellW/2;
        drawArrow(ctx,fromX,y+cellH+5,toX,y+cellH+25,c.accent1,6);
      }
    }
  },
  sourceCode: {
    cpp: `// Tabulation (Bottom-up)
int fibonacci(int n) {
    vector<int> dp(n + 1);
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}

// Memoization (Top-down)
unordered_map<int,int> memo;
int fib(int n) {
    if (n <= 1) return n;
    if (memo.count(n)) return memo[n];
    return memo[n] = fib(n-1) + fib(n-2);
}`,
    java: `// Tabulation
int fibonacci(int n) {
    int[] dp = new int[n + 1];
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}

// Memoization
Map<Integer,Integer> memo = new HashMap<>();
int fib(int n) {
    if (n <= 1) return n;
    if (memo.containsKey(n)) return memo.get(n);
    int result = fib(n-1) + fib(n-2);
    memo.put(n, result);
    return result;
}`,
    python: `# Tabulation (Bottom-up)
def fibonacci(n):
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]

# Memoization (Top-down)
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)`
  }
});

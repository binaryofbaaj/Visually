// 0/1 Knapsack DP
registerAlgorithm({
  id: 'knapsack', name: '0/1 Knapsack', category: 'Dynamic Programming', catIcon: '🧠', icon: '🎒',
  shortDesc: 'Maximize value of items that fit in a weight-limited knapsack',
  description: 'Given items with weights and values, find the maximum value subset that fits within a weight capacity.',
  howItWorks: ['Create a DP table with rows=items+1 and columns=capacity+1','For each item and capacity, decide: include or exclude the item','If item weight ≤ current capacity, take max of (include, exclude)','Include = item value + dp[previous item][remaining capacity]','The bottom-right cell gives the maximum achievable value'],
  timeComplexity: 'O(n × W)', spaceComplexity: 'O(n × W)', tags: ['DP', 'optimization', 'knapsack'],
  inputs: [
    { id: 'weights', label: 'Weights', type: 'text', default: '2, 3, 4, 5', placeholder: 'e.g. 2,3,4' },
    { id: 'values', label: 'Values', type: 'text', default: '3, 4, 5, 6', placeholder: 'e.g. 3,4,5' },
    { id: 'capacity', label: 'Capacity', type: 'number', default: '8' }
  ],
  randomize() { const n=4; document.getElementById('inp-weights').value=Array.from({length:n},()=>Math.floor(Math.random()*5)+1).join(', '); document.getElementById('inp-values').value=Array.from({length:n},()=>Math.floor(Math.random()*8)+1).join(', '); document.getElementById('inp-capacity').value=Math.floor(Math.random()*8)+5; },
  generateSteps(vals){
    const wt=vals.weights.split(',').map(Number).filter(n=>!isNaN(n));
    const val=vals.values.split(',').map(Number).filter(n=>!isNaN(n));
    const W=parseInt(vals.capacity); const n=Math.min(wt.length,val.length);
    if(n<1||isNaN(W)||W<1) throw new Error('Invalid input');
    const dp=Array.from({length:n+1},()=>Array(W+1).fill(0));
    const steps=[];
    steps.push({dp:dp.map(r=>[...r]),row:-1,col:-1,description:`Items: ${n}, Capacity: ${W}. Initialize DP table with zeros.`,codeLine:0,wt,val,W,n});
    for(let i=1;i<=n;i++){
      for(let w=1;w<=W;w++){
        if(wt[i-1]<=w){
          const include=val[i-1]+dp[i-1][w-wt[i-1]], exclude=dp[i-1][w];
          dp[i][w]=Math.max(include,exclude);
          steps.push({dp:dp.map(r=>[...r]),row:i,col:w,description:`Item ${i} (w=${wt[i-1]},v=${val[i-1]}), cap=${w}: include=${include}, exclude=${exclude} → ${dp[i][w]}`,codeLine:include>exclude?4:5,wt,val,W,n});
        } else {
          dp[i][w]=dp[i-1][w];
          steps.push({dp:dp.map(r=>[...r]),row:i,col:w,description:`Item ${i} (w=${wt[i-1]}) too heavy for cap=${w}. dp[${i}][${w}]=${dp[i][w]}`,codeLine:6,wt,val,W,n});
        }
      }
    }
    steps.push({dp:dp.map(r=>[...r]),row:n,col:W,description:`Maximum value: ${dp[n][W]}`,codeLine:8,wt,val,W,n});
    return steps;
  },
  render(ctx,canvas,step,theme){
    const c=getColors(theme), w=canvas.width/(window.devicePixelRatio||1), h=canvas.height/(window.devicePixelRatio||1);
    const dp=step.dp, rows=dp.length, cols=dp[0].length;
    const cellW=Math.min(40,(w-120)/cols), cellH=Math.min(30,(h-80)/rows);
    const startX=(w-(cols+1)*cellW)/2+cellW, startY=40;
    // header row (weights)
    ctx.fillStyle=c.textMuted; ctx.font='bold 10px Inter'; ctx.textAlign='center';
    for(let j=0;j<cols;j++) ctx.fillText(j,startX+j*cellW+cellW/2,startY-5);
    // header col (items)
    for(let i=0;i<rows;i++){
      const label=i===0?'0':`i${i}`;
      ctx.fillText(label,startX-cellW/2-5,startY+i*cellH+cellH/2+4);
    }
    // cells
    for(let i=0;i<rows;i++){
      for(let j=0;j<cols;j++){
        const x=startX+j*cellW, y=startY+i*cellH;
        let bg=c.node, border=c.nodeBorder+'60', txtC=c.text;
        if(i===step.row&&j===step.col){ bg=c.active; border=c.active; txtC='#fff'; }
        else if(dp[i][j]>0){ bg=c.found+'20'; }
        ctx.fillStyle=bg; ctx.fillRect(x,y,cellW-1,cellH-1);
        ctx.strokeStyle=border; ctx.lineWidth=0.5; ctx.strokeRect(x,y,cellW-1,cellH-1);
        ctx.fillStyle=txtC; ctx.font='10px Inter'; ctx.textAlign='center';
        ctx.fillText(dp[i][j],x+cellW/2,y+cellH/2+3);
      }
    }
    // items info
    ctx.fillStyle=c.textMuted; ctx.font='11px Inter'; ctx.textAlign='left';
    const itemsY=startY+rows*cellH+15;
    ctx.fillText('Items:',10,itemsY);
    for(let i=0;i<step.n;i++){
      const ix=80+i*80;
      ctx.fillStyle=i+1===step.row?c.active:c.textMuted;
      ctx.fillText(`#${i+1}: w=${step.wt[i]}, v=${step.val[i]}`,ix,itemsY);
    }
    ctx.fillStyle=c.textMuted; ctx.font='12px Inter'; ctx.textAlign='left'; ctx.fillText('0/1 Knapsack',10,20);
  },
  sourceCode: {
    cpp: `int knapsack(vector<int>& wt, vector<int>& val, int W) {
    int n = wt.size();
    vector<vector<int>> dp(n+1, vector<int>(W+1, 0));
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i-1] <= w)
                dp[i][w] = max(val[i-1] + dp[i-1][w-wt[i-1]], dp[i-1][w]);
            else
                dp[i][w] = dp[i-1][w];
        }
    }
    return dp[n][W];
}`,
    java: `int knapsack(int[] wt, int[] val, int W) {
    int n = wt.length;
    int[][] dp = new int[n+1][W+1];
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i-1] <= w)
                dp[i][w] = Math.max(val[i-1]+dp[i-1][w-wt[i-1]], dp[i-1][w]);
            else
                dp[i][w] = dp[i-1][w];
        }
    }
    return dp[n][W];
}`,
    python: `def knapsack(wt, val, W):
    n = len(wt)
    dp = [[0]*(W+1) for _ in range(n+1)]
    for i in range(1, n+1):
        for w in range(1, W+1):
            if wt[i-1] <= w:
                dp[i][w] = max(val[i-1] + dp[i-1][w-wt[i-1]], dp[i-1][w])
            else:
                dp[i][w] = dp[i-1][w]
    return dp[n][W]`
  }
});

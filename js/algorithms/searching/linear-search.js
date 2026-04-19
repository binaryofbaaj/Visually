// Linear Search Visualization
registerAlgorithm({
  id: 'linear-search', name: 'Linear Search', category: 'Searching', catIcon: '🔍', icon: '👁️',
  shortDesc: 'Scan each element sequentially until the target is found',
  description: 'Sequentially checks each element until the target value is found or the list is exhausted.',
  howItWorks: ['Start from the first element of the array','Compare the current element with the target value','If they match, return the index � target found!','If not, move to the next element','If the end is reached without a match, the target is not in the array'],
  timeComplexity: 'O(n)', spaceComplexity: 'O(1)', tags: ['search', 'sequential'],
  inputs: [
    { id: 'array', label: 'Array', type: 'text', default: '4,2,7,1,9,3,6', placeholder: 'e.g. 5,3,8,1' },
    { id: 'target', label: 'Target', type: 'number', default: '9' }
  ],
  randomize() { const arr=Array.from({length:8},()=>Math.floor(Math.random()*50)+1); document.getElementById('inp-array').value=arr.join(','); document.getElementById('inp-target').value=arr[Math.floor(Math.random()*arr.length)]; },
  generateSteps(vals) {
    const arr=vals.array.split(',').map(Number).filter(n=>!isNaN(n)), target=parseInt(vals.target);
    if(!arr.length||isNaN(target)) throw new Error('Invalid input');
    const steps=[]; steps.push({array:arr,target,current:-1,found:-1,description:`Search for ${target} in the array`,codeLine:0});
    for(let i=0;i<arr.length;i++){
      steps.push({array:arr,target,current:i,found:-1,description:`Check index ${i}: arr[${i}] = ${arr[i]}`,codeLine:2});
      if(arr[i]===target){ steps.push({array:arr,target,current:i,found:i,description:`Found ${target} at index ${i}!`,codeLine:3}); return steps; }
      steps.push({array:arr,target,current:i,found:-1,checked:i,description:`${arr[i]} ≠ ${target}, move to next`,codeLine:4});
    }
    steps.push({array:arr,target,current:-1,found:-1,description:`${target} not found in the array`,codeLine:5});
    return steps;
  },
  render(ctx, canvas, step, theme) {
    const c=getColors(theme), w=canvas.width/(window.devicePixelRatio||1), h=canvas.height/(window.devicePixelRatio||1);
    const arr=step.array, n=arr.length, cellW=Math.min(70,(w-80)/n), cellH=50, startX=(w-n*cellW)/2, y=h/2-cellH/2;
    ctx.fillStyle=c.textMuted; ctx.font='14px Inter'; ctx.textAlign='center';
    ctx.fillText(`Target: ${step.target}`,w/2,y-40);
    for(let i=0;i<n;i++){
      const x=startX+i*cellW;
      let bg=c.node, border=c.nodeBorder, txtC=c.text;
      if(i<step.current) { bg=c.textMuted+'30'; }
      if(i===step.current&&step.found===-1) { bg=c.compare; border=c.compare; }
      if(i===step.found) { bg=c.found; border=c.found; txtC='#fff'; }
      ctx.fillStyle=bg; drawRoundRect(ctx,x+2,y,cellW-4,cellH,6); ctx.fill();
      ctx.strokeStyle=border; ctx.lineWidth=2; drawRoundRect(ctx,x+2,y,cellW-4,cellH,6); ctx.stroke();
      ctx.fillStyle=txtC; ctx.font='bold 16px Inter'; ctx.textAlign='center'; ctx.fillText(arr[i],x+cellW/2,y+cellH/2+6);
      ctx.fillStyle=c.textMuted; ctx.font='11px Inter'; ctx.fillText(i,x+cellW/2,y+cellH+18);
    }
    ctx.fillStyle=c.textMuted; ctx.font='12px Inter'; ctx.textAlign='left'; ctx.fillText('Linear Search',10,20);
  },
  sourceCode: {
    cpp: `int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target)   // check current element
            return i;           // found at index i
    }
    return -1;                  // not found
}`,
    java: `public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target)
            return i;
    }
    return -1;
}`,
    python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:  # check current element
            return i          # found at index i
    return -1                 # not found`
  }
});

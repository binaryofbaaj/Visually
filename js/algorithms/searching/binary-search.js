// Binary Search Visualization
registerAlgorithm({
  id: 'binary-search', name: 'Binary Search', category: 'Searching', catIcon: '🔍', icon: '🎯',
  shortDesc: 'Efficiently search a sorted array by halving the search space',
  description: 'Requires a sorted array. Repeatedly divides the search interval in half to find the target.',
  howItWorks: ['Requires a sorted array. Set lo=0 and hi=last index','Calculate mid = (lo + hi) / 2','If arr[mid] equals target, return mid � found!','If arr[mid] < target, search the right half (lo = mid + 1)','If arr[mid] > target, search the left half (hi = mid - 1)','Repeat until lo > hi (target not found)'],
  timeComplexity: 'O(log n)', spaceComplexity: 'O(1)', tags: ['search', 'divide-conquer', 'sorted'],
  inputs: [
    { id: 'array', label: 'Sorted Array', type: 'text', default: '2,5,8,12,16,23,38,56,72,91', placeholder: 'sorted numbers' },
    { id: 'target', label: 'Target', type: 'number', default: '23' }
  ],
  randomize() { let arr=Array.from({length:10},()=>Math.floor(Math.random()*99)+1).sort((a,b)=>a-b); document.getElementById('inp-array').value=arr.join(','); document.getElementById('inp-target').value=arr[Math.floor(Math.random()*arr.length)]; },
  generateSteps(vals) {
    const arr=vals.array.split(',').map(Number).filter(n=>!isNaN(n)), target=parseInt(vals.target);
    if(!arr.length||isNaN(target)) throw new Error('Invalid input');
    const steps=[]; let lo=0, hi=arr.length-1;
    steps.push({array:arr,target,lo,hi,mid:-1,found:-1,description:`Search for ${target} in sorted array`,codeLine:0});
    while(lo<=hi){
      const mid=Math.floor((lo+hi)/2);
      steps.push({array:arr,target,lo,hi,mid,found:-1,description:`lo=${lo}, hi=${hi}, mid=${mid}, arr[mid]=${arr[mid]}`,codeLine:3});
      if(arr[mid]===target){ steps.push({array:arr,target,lo,hi,mid,found:mid,description:`Found ${target} at index ${mid}!`,codeLine:4}); return steps; }
      if(arr[mid]<target){ steps.push({array:arr,target,lo,hi,mid,found:-1,description:`${arr[mid]} < ${target}, search right half`,codeLine:6}); lo=mid+1; }
      else { steps.push({array:arr,target,lo,hi,mid,found:-1,description:`${arr[mid]} > ${target}, search left half`,codeLine:8}); hi=mid-1; }
    }
    steps.push({array:arr,target,lo,hi,mid:-1,found:-1,description:`${target} not found`,codeLine:10});
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
      if(i<step.lo||i>step.hi) { bg=c.textMuted+'20'; border=c.textMuted+'40'; txtC=c.textMuted; }
      if(i===step.mid&&step.found===-1) { bg=c.compare; border=c.compare; txtC='#fff'; }
      if(i===step.found) { bg=c.found; border=c.found; txtC='#fff'; }
      ctx.fillStyle=bg; drawRoundRect(ctx,x+2,y,cellW-4,cellH,6); ctx.fill();
      ctx.strokeStyle=border; ctx.lineWidth=2; drawRoundRect(ctx,x+2,y,cellW-4,cellH,6); ctx.stroke();
      ctx.fillStyle=txtC; ctx.font='bold 16px Inter'; ctx.textAlign='center'; ctx.fillText(arr[i],x+cellW/2,y+cellH/2+6);
      ctx.fillStyle=c.textMuted; ctx.font='11px Inter'; ctx.fillText(i,x+cellW/2,y+cellH+18);
      // markers
      if(i===step.lo){ ctx.fillStyle=c.active; ctx.font='bold 11px Inter'; ctx.fillText('lo',x+cellW/2,y-8); }
      if(i===step.hi){ ctx.fillStyle=c.highlight; ctx.font='bold 11px Inter'; ctx.fillText('hi',x+cellW/2,y-8); }
      if(i===step.mid){ ctx.fillStyle=c.compare; ctx.font='bold 11px Inter'; ctx.fillText('mid',x+cellW/2,y-20); }
    }
    ctx.fillStyle=c.textMuted; ctx.font='12px Inter'; ctx.textAlign='left'; ctx.fillText('Binary Search',10,20);
  },
  sourceCode: {
    cpp: `int binarySearch(vector<int>& arr, int target) {
    int lo = 0, hi = arr.size() - 1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
    java: `public static int binarySearch(int[] arr, int target) {
    int lo = 0, hi = arr.length - 1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
    python: `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`
  }
});

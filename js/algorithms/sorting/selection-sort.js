// Selection Sort Visualization
registerAlgorithm({
  id: 'selection-sort', name: 'Selection Sort', category: 'Sorting', catIcon: '🔢', icon: '🎯',
  shortDesc: 'Find the minimum element and place it at the beginning',
  description: 'Divides the array into sorted and unsorted parts. Repeatedly finds the minimum from the unsorted part.',
  howItWorks: [
    'Divide the array into sorted (left) and unsorted (right) portions',
    'Find the minimum element in the unsorted portion',
    'Swap it with the first unsorted element',
    'Move the boundary one position right',
    'Repeat until the entire array is sorted'
  ],
  timeComplexity: 'O(n²)', spaceComplexity: 'O(1)', tags: ['sorting', 'comparison', 'unstable'],
  inputs: [
    { id: 'array', label: 'Array', type: 'text', default: '64,25,12,22,11', placeholder: 'e.g. 5,3,8,1' },
    { id: 'size', label: 'Size (random)', type: 'number', default: '10' }
  ],
  randomize() { const n=parseInt(document.getElementById('inp-size').value)||10; document.getElementById('inp-array').value=Array.from({length:n},()=>Math.floor(Math.random()*99)+1).join(','); },
  generateSteps(vals) {
    const arr = vals.array.split(',').map(Number).filter(n=>!isNaN(n)); if(arr.length<2) throw new Error('Need at least 2 numbers');
    const steps=[], a=[...arr], sorted=new Set();
    steps.push({array:[...a],highlights:{},description:'Initial array',codeLine:0,sorted:new Set()});
    for(let i=0;i<a.length-1;i++){
      let minIdx=i;
      steps.push({array:[...a],highlights:{active:[i],current:[minIdx]},description:`Looking for minimum starting from index ${i}`,codeLine:2,sorted:new Set(sorted)});
      for(let j=i+1;j<a.length;j++){
        steps.push({array:[...a],highlights:{active:[i],current:[minIdx],compare:[j]},description:`Compare arr[${j}]=${a[j]} with min=${a[minIdx]}`,codeLine:4,sorted:new Set(sorted)});
        if(a[j]<a[minIdx]) { minIdx=j; steps.push({array:[...a],highlights:{active:[i],current:[minIdx]},description:`New minimum found: ${a[minIdx]} at index ${minIdx}`,codeLine:5,sorted:new Set(sorted)}); }
      }
      if(minIdx!==i){ [a[i],a[minIdx]]=[a[minIdx],a[i]]; steps.push({array:[...a],highlights:{swap:[i,minIdx]},description:`Swap arr[${i}] and arr[${minIdx}]`,codeLine:7,sorted:new Set(sorted)}); }
      sorted.add(i);
    }
    sorted.add(a.length-1);
    steps.push({array:[...a],highlights:{},description:'Array is sorted!',codeLine:9,sorted:new Set(Array.from({length:a.length},(_,i)=>i))});
    return steps;
  },
  render(ctx, canvas, step, theme) {
    const c=getColors(theme), w=canvas.width/(window.devicePixelRatio||1), h=canvas.height/(window.devicePixelRatio||1);
    const arr=step.array, n=arr.length, maxVal=Math.max(...arr), padding=40;
    const barW=Math.min(60,(w-padding*2)/n-4), gap=4, totalW=n*(barW+gap)-gap, startX=(w-totalW)/2, maxH=h-padding*3;
    for(let i=0;i<n;i++){
      const barH=(arr[i]/maxVal)*maxH, x=startX+i*(barW+gap), y=h-padding-barH;
      let color=c.bar;
      if(step.sorted&&step.sorted.has(i)) color=c.sorted;
      if(step.highlights.compare&&step.highlights.compare.includes(i)) color=c.compare;
      if(step.highlights.current&&step.highlights.current.includes(i)) color=c.active;
      if(step.highlights.swap&&step.highlights.swap.includes(i)) color=c.swap;
      if(step.highlights.active&&step.highlights.active.includes(i)) color=c.highlight;
      ctx.fillStyle=color; drawRoundRect(ctx,x,y,barW,barH,4); ctx.fill();
      ctx.fillStyle=c.text; ctx.font=`bold ${Math.min(14,barW-2)}px Inter`; ctx.textAlign='center';
      ctx.fillText(arr[i],x+barW/2,h-padding+18);
    }
    ctx.fillStyle=c.textMuted; ctx.font='12px Inter'; ctx.textAlign='left'; ctx.fillText('Selection Sort',10,20);
  },
  sourceCode: {
    cpp: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx])
                minIdx = j;
        }
        swap(arr[i], arr[minIdx]);
    }
}`,
    java: `public static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx])
                minIdx = j;
        }
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
}`,
    python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`
  }
});

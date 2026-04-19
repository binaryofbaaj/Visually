// Insertion Sort Visualization
registerAlgorithm({
  id: 'insertion-sort', name: 'Insertion Sort', category: 'Sorting', catIcon: '🔢', icon: '📥',
  shortDesc: 'Build sorted array one element at a time by inserting in correct position',
  description: 'Builds the sorted array one item at a time by inserting each element into its correct position.',
  howItWorks: ['Start with the second element as the key','Compare the key with elements in the sorted portion (left side)','Shift all larger elements one position to the right','Insert the key into its correct sorted position','Repeat for each subsequent element until the array is sorted'],
  timeComplexity: 'O(n²)', spaceComplexity: 'O(1)', tags: ['sorting', 'comparison', 'stable', 'adaptive'],
  inputs: [
    { id: 'array', label: 'Array', type: 'text', default: '12,11,13,5,6', placeholder: 'e.g. 5,3,8,1' },
    { id: 'size', label: 'Size (random)', type: 'number', default: '10' }
  ],
  randomize() { const n=parseInt(document.getElementById('inp-size').value)||10; document.getElementById('inp-array').value=Array.from({length:n},()=>Math.floor(Math.random()*99)+1).join(','); },
  generateSteps(vals) {
    const arr=vals.array.split(',').map(Number).filter(n=>!isNaN(n)); if(arr.length<2) throw new Error('Need at least 2 numbers');
    const steps=[], a=[...arr], sorted=new Set([0]);
    steps.push({array:[...a],highlights:{},description:'Initial array. First element is already sorted.',codeLine:0,sorted:new Set(sorted)});
    for(let i=1;i<a.length;i++){
      const key=a[i]; let j=i-1;
      steps.push({array:[...a],highlights:{active:[i]},description:`Pick key = ${key} at index ${i}`,codeLine:2,sorted:new Set(sorted)});
      while(j>=0&&a[j]>key){
        steps.push({array:[...a],highlights:{active:[i],compare:[j,j+1]},description:`${a[j]} > ${key}, shift ${a[j]} right`,codeLine:4,sorted:new Set(sorted)});
        a[j+1]=a[j]; j--;
        steps.push({array:[...a],highlights:{swap:[j+1,j+2]},description:'Element shifted',codeLine:5,sorted:new Set(sorted)});
      }
      a[j+1]=key;
      sorted.add(i);
      steps.push({array:[...a],highlights:{current:[j+1]},description:`Insert ${key} at position ${j+1}`,codeLine:6,sorted:new Set(sorted)});
    }
    steps.push({array:[...a],highlights:{},description:'Array is sorted!',codeLine:8,sorted:new Set(Array.from({length:a.length},(_,i)=>i))});
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
      if(step.highlights.swap&&step.highlights.swap.includes(i)) color=c.swap;
      if(step.highlights.active&&step.highlights.active.includes(i)) color=c.highlight;
      if(step.highlights.current&&step.highlights.current.includes(i)) color=c.active;
      ctx.fillStyle=color; drawRoundRect(ctx,x,y,barW,barH,4); ctx.fill();
      ctx.fillStyle=c.text; ctx.font=`bold ${Math.min(14,barW-2)}px Inter`; ctx.textAlign='center';
      ctx.fillText(arr[i],x+barW/2,h-padding+18);
    }
    ctx.fillStyle=c.textMuted; ctx.font='12px Inter'; ctx.textAlign='left'; ctx.fillText('Insertion Sort',10,20);
  },
  sourceCode: {
    cpp: `void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    java: `public static void insertionSort(int[] arr) {
    int n = arr.length;
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`
  }
});

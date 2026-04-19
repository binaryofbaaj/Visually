// Quick Sort Visualization
registerAlgorithm({
  id: 'quick-sort', name: 'Quick Sort', category: 'Sorting', catIcon: '🔢', icon: '⚡',
  shortDesc: 'Pick a pivot, partition around it, recurse on halves',
  description: 'Picks a pivot element, partitions the array so smaller elements go left and larger go right, then recurses.',
  howItWorks: ['Choose a pivot element (usually the last element)','Partition: move elements smaller than pivot to the left, larger to the right','Place the pivot in its final sorted position','Recursively apply quick sort to the left and right sub-arrays','Base case: sub-arrays of size 0 or 1 are already sorted'],
  timeComplexity: 'O(n log n) avg', spaceComplexity: 'O(log n)', tags: ['sorting', 'divide-conquer', 'unstable'],
  inputs: [
    { id: 'array', label: 'Array', type: 'text', default: '10,80,30,90,40,50,70', placeholder: 'e.g. 5,3,8,1' },
    { id: 'size', label: 'Size (random)', type: 'number', default: '8' }
  ],
  randomize() { const n=parseInt(document.getElementById('inp-size').value)||8; document.getElementById('inp-array').value=Array.from({length:n},()=>Math.floor(Math.random()*99)+1).join(','); },
  generateSteps(vals) {
    const arr=vals.array.split(',').map(Number).filter(n=>!isNaN(n)); if(arr.length<2) throw new Error('Need at least 2');
    const steps=[], a=[...arr], sortedSet=new Set();
    steps.push({array:[...a],highlights:{},description:'Initial array',codeLine:0,sorted:new Set()});
    function qs(lo,hi){
      if(lo>=hi){ if(lo===hi) sortedSet.add(lo); return; }
      const pivot=a[hi];
      steps.push({array:[...a],highlights:{pivot:[hi],range:[lo,hi]},description:`Pivot = ${pivot} (index ${hi})`,codeLine:2,sorted:new Set(sortedSet)});
      let i=lo;
      for(let j=lo;j<hi;j++){
        steps.push({array:[...a],highlights:{pivot:[hi],compare:[j],pointer:[i]},description:`Compare arr[${j}]=${a[j]} with pivot ${pivot}`,codeLine:4,sorted:new Set(sortedSet)});
        if(a[j]<pivot){
          [a[i],a[j]]=[a[j],a[i]];
          steps.push({array:[...a],highlights:{pivot:[hi],swap:[i,j]},description:`Swap arr[${i}] and arr[${j}]`,codeLine:5,sorted:new Set(sortedSet)});
          i++;
        }
      }
      [a[i],a[hi]]=[a[hi],a[i]];
      sortedSet.add(i);
      steps.push({array:[...a],highlights:{active:[i]},description:`Pivot ${pivot} placed at index ${i}`,codeLine:7,sorted:new Set(sortedSet)});
      qs(lo,i-1); qs(i+1,hi);
    }
    qs(0,a.length-1);
    steps.push({array:[...a],highlights:{},description:'Array is sorted!',codeLine:10,sorted:new Set(Array.from({length:a.length},(_,i)=>i))});
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
      if(step.highlights.range&&i>=step.highlights.range[0]&&i<=step.highlights.range[1]) color='#334155';
      if(step.highlights.compare&&step.highlights.compare.includes(i)) color=c.compare;
      if(step.highlights.swap&&step.highlights.swap.includes(i)) color=c.swap;
      if(step.highlights.pointer&&step.highlights.pointer.includes(i)) color=c.accent2;
      if(step.highlights.pivot&&step.highlights.pivot.includes(i)) color=c.highlight;
      if(step.highlights.active&&step.highlights.active.includes(i)) color=c.active;
      ctx.fillStyle=color; drawRoundRect(ctx,x,y,barW,barH,4); ctx.fill();
      ctx.fillStyle=c.text; ctx.font=`bold ${Math.min(14,barW-2)}px Inter`; ctx.textAlign='center';
      ctx.fillText(arr[i],x+barW/2,h-padding+18);
    }
    ctx.fillStyle=c.textMuted; ctx.font='12px Inter'; ctx.textAlign='left'; ctx.fillText('Quick Sort',10,20);
  },
  sourceCode: {
    cpp: `int partition(vector<int>& arr, int lo, int hi) {
    int pivot = arr[hi], i = lo;
    for (int j = lo; j < hi; j++) {
        if (arr[j] < pivot)
            swap(arr[i++], arr[j]);
    }
    swap(arr[i], arr[hi]);
    return i;
}
void quickSort(vector<int>& arr, int lo, int hi) {
    if (lo < hi) {
        int p = partition(arr, lo, hi);
        quickSort(arr, lo, p - 1);
        quickSort(arr, p + 1, hi);
    }
}`,
    java: `int partition(int[] arr, int lo, int hi) {
    int pivot = arr[hi], i = lo;
    for (int j = lo; j < hi; j++) {
        if (arr[j] < pivot) {
            int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
            i++;
        }
    }
    int temp = arr[i]; arr[i] = arr[hi]; arr[hi] = temp;
    return i;
}
void quickSort(int[] arr, int lo, int hi) {
    if (lo < hi) {
        int p = partition(arr, lo, hi);
        quickSort(arr, lo, p - 1);
        quickSort(arr, p + 1, hi);
    }
}`,
    python: `def quick_sort(arr, lo=0, hi=None):
    if hi is None: hi = len(arr) - 1
    if lo < hi:
        p = partition(arr, lo, hi)
        quick_sort(arr, lo, p - 1)
        quick_sort(arr, p + 1, hi)

def partition(arr, lo, hi):
    pivot, i = arr[hi], lo
    for j in range(lo, hi):
        if arr[j] < pivot:
            arr[i], arr[j] = arr[j], arr[i]
            i += 1
    arr[i], arr[hi] = arr[hi], arr[i]
    return i`
  }
});

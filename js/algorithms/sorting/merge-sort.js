// Merge Sort Visualization
registerAlgorithm({
  id: 'merge-sort', name: 'Merge Sort', category: 'Sorting', catIcon: '🔢', icon: '🔀',
  shortDesc: 'Divide array in half, sort each half, then merge',
  description: 'A divide-and-conquer algorithm that splits the array, recursively sorts halves, then merges them.',
  howItWorks: ['Divide the array into two halves at the midpoint','Recursively sort each half using merge sort','Merge the two sorted halves by comparing elements','Place the smaller element first into the result array','Continue until all elements are merged back into a single sorted array'],
  timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)', tags: ['sorting', 'divide-conquer', 'stable'],
  inputs: [
    { id: 'array', label: 'Array', type: 'text', default: '38,27,43,3,9,82,10', placeholder: 'e.g. 5,3,8,1' },
    { id: 'size', label: 'Size (random)', type: 'number', default: '8' }
  ],
  randomize() { const n=parseInt(document.getElementById('inp-size').value)||8; document.getElementById('inp-array').value=Array.from({length:n},()=>Math.floor(Math.random()*99)+1).join(','); },
  generateSteps(vals) {
    const arr=vals.array.split(',').map(Number).filter(n=>!isNaN(n)); if(arr.length<2) throw new Error('Need at least 2');
    const steps=[], a=[...arr];
    steps.push({array:[...a],highlights:{},description:'Initial array',codeLine:0,ranges:[]});
    function mergeSort(a, l, r) {
      if(l>=r) return;
      const m=Math.floor((l+r)/2);
      steps.push({array:[...a],highlights:{range:[l,r],mid:m},description:`Divide: arr[${l}..${r}], mid=${m}`,codeLine:2,ranges:[{l,r,m}]});
      mergeSort(a,l,m);
      mergeSort(a,m+1,r);
      // merge
      const left=a.slice(l,m+1), right=a.slice(m+1,r+1);
      let i=0,j=0,k=l;
      steps.push({array:[...a],highlights:{range:[l,r]},description:`Merge arr[${l}..${m}] and arr[${m+1}..${r}]`,codeLine:5,ranges:[]});
      while(i<left.length&&j<right.length){
        if(left[i]<=right[j]){ a[k]=left[i]; i++; } else { a[k]=right[j]; j++; }
        steps.push({array:[...a],highlights:{active:[k]},description:`Place ${a[k]} at index ${k}`,codeLine:7,ranges:[]});
        k++;
      }
      while(i<left.length){ a[k]=left[i]; i++; steps.push({array:[...a],highlights:{active:[k]},description:`Place remaining ${a[k]}`,codeLine:9,ranges:[]}); k++; }
      while(j<right.length){ a[k]=right[j]; j++; steps.push({array:[...a],highlights:{active:[k]},description:`Place remaining ${a[k]}`,codeLine:9,ranges:[]}); k++; }
    }
    mergeSort(a,0,a.length-1);
    steps.push({array:[...a],highlights:{},description:'Array is sorted!',codeLine:11,sorted:new Set(Array.from({length:a.length},(_,i)=>i))});
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
      if(step.highlights.range&&i>=step.highlights.range[0]&&i<=step.highlights.range[1]) color=c.accent2;
      if(step.highlights.active&&step.highlights.active.includes(i)) color=c.active;
      ctx.fillStyle=color; drawRoundRect(ctx,x,y,barW,barH,4); ctx.fill();
      ctx.fillStyle=c.text; ctx.font=`bold ${Math.min(14,barW-2)}px Inter`; ctx.textAlign='center';
      ctx.fillText(arr[i],x+barW/2,h-padding+18);
    }
    ctx.fillStyle=c.textMuted; ctx.font='12px Inter'; ctx.textAlign='left'; ctx.fillText('Merge Sort',10,20);
  },
  sourceCode: {
    cpp: `void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> left(arr.begin()+l, arr.begin()+m+1);
    vector<int> right(arr.begin()+m+1, arr.begin()+r+1);
    int i = 0, j = 0, k = l;
    while (i < left.size() && j < right.size())
        arr[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];
    while (i < left.size()) arr[k++] = left[i++];
    while (j < right.size()) arr[k++] = right[j++];
}
void mergeSort(vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int m = (l + r) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}`,
    java: `void merge(int[] arr, int l, int m, int r) {
    int[] left = Arrays.copyOfRange(arr, l, m + 1);
    int[] right = Arrays.copyOfRange(arr, m + 1, r + 1);
    int i = 0, j = 0, k = l;
    while (i < left.length && j < right.length)
        arr[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];
    while (i < left.length) arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];
}
void mergeSort(int[] arr, int l, int r) {
    if (l >= r) return;
    int m = (l + r) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}`,
    python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`
  }
});

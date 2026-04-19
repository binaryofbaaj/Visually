// Bubble Sort Visualization
registerAlgorithm({
  id: 'bubble-sort', name: 'Bubble Sort', category: 'Sorting', catIcon: '🔢', icon: '🫧',
  shortDesc: 'Compare adjacent elements and swap if out of order',
  description: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
  howItWorks: ['Start from the first element, compare it with the next element','If current element is greater than the next, swap them','Move to the next pair and repeat comparison','After one full pass, the largest element "bubbles" to the end','Repeat the process for remaining unsorted elements','Array is sorted when no swaps are needed in a pass'],
  timeComplexity: 'O(n²)', spaceComplexity: 'O(1)',
  tags: ['sorting', 'comparison', 'stable'],
  inputs: [
    { id: 'array', label: 'Array', type: 'text', default: '38,27,43,3,9,82,10', placeholder: 'e.g. 5,3,8,1' },
    { id: 'size', label: 'Size (random)', type: 'number', default: '10' }
  ],
  randomize() {
    const n = parseInt(document.getElementById('inp-size').value) || 10;
    const arr = Array.from({length: n}, () => Math.floor(Math.random()*99)+1);
    document.getElementById('inp-array').value = arr.join(',');
  },
  generateSteps(vals) {
    const arr = vals.array.split(',').map(Number).filter(n => !isNaN(n));
    if (arr.length < 2) throw new Error('Need at least 2 numbers');
    const steps = []; const a = [...arr]; const sorted = new Set();
    steps.push({ array: [...a], highlights: {}, description: 'Initial array', codeLine: 0, sorted: new Set() });
    for (let i = 0; i < a.length - 1; i++) {
      for (let j = 0; j < a.length - 1 - i; j++) {
        steps.push({ array: [...a], highlights: { compare: [j, j+1] }, description: `Compare arr[${j}]=${a[j]} and arr[${j+1}]=${a[j+1]}`, codeLine: 3, sorted: new Set(sorted) });
        if (a[j] > a[j+1]) {
          [a[j], a[j+1]] = [a[j+1], a[j]];
          steps.push({ array: [...a], highlights: { swap: [j, j+1] }, description: `Swap ${a[j+1]} and ${a[j]}`, codeLine: 5, sorted: new Set(sorted) });
        }
      }
      sorted.add(a.length - 1 - i);
      steps.push({ array: [...a], highlights: {}, description: `Element ${a[a.length-1-i]} is now in its correct position`, codeLine: 2, sorted: new Set(sorted) });
    }
    sorted.add(0);
    steps.push({ array: [...a], highlights: {}, description: 'Array is sorted!', codeLine: 8, sorted: new Set(Array.from({length:a.length},(_,i)=>i)) });
    return steps;
  },
  render(ctx, canvas, step, theme) {
    const c = getColors(theme); const w = canvas.width / (window.devicePixelRatio||1); const h = canvas.height / (window.devicePixelRatio||1);
    const arr = step.array; const n = arr.length; const maxVal = Math.max(...arr);
    const padding = 40; const barW = Math.min(60, (w - padding*2) / n - 4); const gap = 4;
    const totalW = n * (barW + gap) - gap; const startX = (w - totalW) / 2;
    const maxH = h - padding * 3;
    for (let i = 0; i < n; i++) {
      const barH = (arr[i] / maxVal) * maxH; const x = startX + i * (barW + gap); const y = h - padding - barH;
      let color = c.bar;
      if (step.sorted && step.sorted.has(i)) color = c.sorted;
      if (step.highlights.compare && step.highlights.compare.includes(i)) color = c.compare;
      if (step.highlights.swap && step.highlights.swap.includes(i)) color = c.swap;
      ctx.fillStyle = color; drawRoundRect(ctx, x, y, barW, barH, 4); ctx.fill();
      ctx.fillStyle = c.text; ctx.font = `bold ${Math.min(14, barW-2)}px Inter`; ctx.textAlign = 'center';
      ctx.fillText(arr[i], x + barW/2, h - padding + 18);
    }
    ctx.fillStyle = c.textMuted; ctx.font = '12px Inter'; ctx.textAlign = 'left';
    ctx.fillText('Bubble Sort', 10, 20);
  },
  sourceCode: {
    cpp: `#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {        // outer pass
        for (int j = 0; j < n - 1 - i; j++) { // inner comparison
            if (arr[j] > arr[j + 1]) {         // compare adjacent
                swap(arr[j], arr[j + 1]);      // swap if needed
            }
        }
    }
}`,
    java: `public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}`,
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):            # outer pass
        for j in range(n - 1 - i):    # inner comparison
            if arr[j] > arr[j + 1]:   # compare adjacent
                arr[j], arr[j + 1] = arr[j + 1], arr[j]  # swap
    return arr`
  }
});

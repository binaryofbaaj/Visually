// N-Queens Backtracking
registerAlgorithm({
  id: 'n-queens', name: 'N-Queens', category: 'Backtracking', catIcon: '♟️', icon: '👑',
  shortDesc: 'Place N queens on an N×N board with no conflicts',
  description: 'Place N queens on an N×N chessboard so that no two queens threaten each other. Uses backtracking.',
  howItWorks: ['Place queens one row at a time, starting from the first row','For each column in the current row, check if it\'s safe (no conflicts)','A position is safe if no other queen is in the same column, row, or diagonal','If safe, place the queen and recurse to the next row','If no safe position exists, backtrack: remove the queen and try the next column'],
  timeComplexity: 'O(N!)', spaceComplexity: 'O(N²)', tags: ['backtracking', 'recursion', 'constraint'],
  inputs: [{ id: 'n', label: 'Board size (N)', type: 'number', default: '6' }],
  randomize() { document.getElementById('inp-n').value=Math.floor(Math.random()*4)+4; },
  generateSteps(vals){
    const n=parseInt(vals.n); if(isNaN(n)||n<4||n>10) throw new Error('N must be 4-10');
    const steps=[], board=Array.from({length:n},()=>Array(n).fill(0));
    let solved=false;
    function isSafe(r,c){
      for(let i=0;i<r;i++) if(board[i][c]) return false;
      for(let i=r-1,j=c-1;i>=0&&j>=0;i--,j--) if(board[i][j]) return false;
      for(let i=r-1,j=c+1;i>=0&&j<n;i--,j++) if(board[i][j]) return false;
      return true;
    }
    function solve(row){
      if(row===n){ solved=true; steps.push({board:board.map(r=>[...r]),row:-1,col:-1,checking:false,description:'Solution found! All queens placed safely.',codeLine:8}); return true; }
      for(let col=0;col<n;col++){
        steps.push({board:board.map(r=>[...r]),row,col,checking:true,description:`Try queen at (${row},${col})`,codeLine:2});
        if(isSafe(row,col)){
          board[row][col]=1;
          steps.push({board:board.map(r=>[...r]),row,col,checking:false,placed:true,description:`Place queen at (${row},${col}) — safe!`,codeLine:4});
          if(solve(row+1)) return true;
          board[row][col]=0;
          steps.push({board:board.map(r=>[...r]),row,col,checking:false,backtrack:true,description:`Backtrack: remove queen from (${row},${col})`,codeLine:6});
        } else {
          steps.push({board:board.map(r=>[...r]),row,col,checking:false,conflict:true,description:`(${row},${col}) conflicts — skip`,codeLine:3});
        }
      }
      return false;
    }
    steps.push({board:board.map(r=>[...r]),row:-1,col:-1,description:`Solving ${n}-Queens...`,codeLine:0});
    solve(0);
    if(!solved) steps.push({board:board.map(r=>[...r]),row:-1,col:-1,description:'No solution exists!',codeLine:9});
    return steps;
  },
  render(ctx,canvas,step,theme){
    const c=getColors(theme), w=canvas.width/(window.devicePixelRatio||1), h=canvas.height/(window.devicePixelRatio||1);
    const board=step.board, n=board.length;
    const cellSize=Math.min((w-60)/n,(h-60)/n), startX=(w-n*cellSize)/2, startY=(h-n*cellSize)/2;
    for(let r=0;r<n;r++){
      for(let cl=0;cl<n;cl++){
        const x=startX+cl*cellSize, y=startY+r*cellSize;
        const isDark=(r+cl)%2===1;
        let bg=isDark?(theme==='dark'?'#2d3748':'#a0aec0'):(theme==='dark'?'#4a5568':'#e2e8f0');
        if(r===step.row&&cl===step.col){
          if(step.checking) bg=c.compare;
          else if(step.placed) bg=c.found;
          else if(step.conflict) bg=c.swap;
          else if(step.backtrack) bg=c.highlight;
        }
        ctx.fillStyle=bg; ctx.fillRect(x,y,cellSize,cellSize);
        ctx.strokeStyle=c.nodeBorder+'40'; ctx.lineWidth=0.5; ctx.strokeRect(x,y,cellSize,cellSize);
        if(board[r][cl]){
          ctx.font=`${cellSize*0.6}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
          ctx.fillStyle=c.accent1; ctx.fillText('♛',x+cellSize/2,y+cellSize/2);
        }
      }
    }
    ctx.textBaseline='alphabetic'; ctx.fillStyle=c.textMuted; ctx.font='12px Inter'; ctx.textAlign='left'; ctx.fillText(`${n}-Queens`,10,20);
  },
  sourceCode: {
    cpp: `bool isSafe(vector<vector<int>>& board, int row, int col, int n) {
    for (int i = 0; i < row; i++) if (board[i][col]) return false;
    for (int i=row-1,j=col-1; i>=0&&j>=0; i--,j--) if (board[i][j]) return false;
    for (int i=row-1,j=col+1; i>=0&&j<n; i--,j++) if (board[i][j]) return false;
    return true;
}
bool solve(vector<vector<int>>& board, int row, int n) {
    if (row == n) return true;
    for (int col = 0; col < n; col++) {
        if (isSafe(board, row, col, n)) {
            board[row][col] = 1;
            if (solve(board, row + 1, n)) return true;
            board[row][col] = 0;  // backtrack
        }
    }
    return false;
}`,
    java: `boolean isSafe(int[][] board, int row, int col, int n) {
    for (int i = 0; i < row; i++) if (board[i][col]==1) return false;
    for (int i=row-1,j=col-1; i>=0&&j>=0; i--,j--) if (board[i][j]==1) return false;
    for (int i=row-1,j=col+1; i>=0&&j<n; i--,j++) if (board[i][j]==1) return false;
    return true;
}
boolean solve(int[][] board, int row, int n) {
    if (row == n) return true;
    for (int col = 0; col < n; col++) {
        if (isSafe(board, row, col, n)) {
            board[row][col] = 1;
            if (solve(board, row + 1, n)) return true;
            board[row][col] = 0;
        }
    }
    return false;
}`,
    python: `def is_safe(board, row, col, n):
    for i in range(row):
        if board[i][col]: return False
    i, j = row-1, col-1
    while i >= 0 and j >= 0:
        if board[i][j]: return False
        i -= 1; j -= 1
    i, j = row-1, col+1
    while i >= 0 and j < n:
        if board[i][j]: return False
        i -= 1; j += 1
    return True

def solve(board, row, n):
    if row == n: return True
    for col in range(n):
        if is_safe(board, row, col, n):
            board[row][col] = 1
            if solve(board, row + 1, n): return True
            board[row][col] = 0  # backtrack
    return False`
  }
});

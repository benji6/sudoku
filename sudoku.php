<?php include 'includes/template.php'; ?>
		<h2>Sudoku Solver</h2>
		<button onFocus="if(this.blur)this.blur()" onClick="newPuzzle();">New Puzzle</button>
		<br>
		<button onFocus="if(this.blur)this.blur()" onClick="solver();">Solve!</button>	
		<div id="pzl"></div>
		<div id="msg" class="msg"></div>
		<script src="sudoku.js"></script>
		<script src="shifter.js"></script>
	</body>
</html>
<!DOCTYPE html>
<html>
	<head>
		<?php include '../includes/head_template.php' ?>
	</head>
	<body>
		<?php include '../includes/header_template.php' ?>
		<h2>Sudoku Solver</h2>
		<button onFocus="if(this.blur)this.blur()" onClick="newPuzzle();">New Puzzle</button>
		<button onFocus="if(this.blur)this.blur()" onClick="solver();">Solve!</button>	
		<div id="pzl"></div>
		<div id="msg" class="msg"></div>
		<script src="sudoku.js"></script>
		<?php include '../includes/template_scripts.php' ?>
	</body>
</html>
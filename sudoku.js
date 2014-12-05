var sudoku = (function() {

//create text view
var viewHolder = document.createElement('div');
var btnNewPzl;
var btnSolve;
var divPzl;
var divMsg;

(function() {
	var curry = function(func) {
		var curried = function(args) {
			if (args.length >= func.length) {
				return func.apply(null, args);
			}
			return function() {
				return curried(args.concat(Array.prototype.slice.apply(arguments)));
			};
		};
		return curried(Array.prototype.slice.apply(arguments, [1]));
	};
	var addView = function(parentEl, childEl, txtNode) {
		var childElement = document.createElement(childEl);
		childElement.appendChild(document.createTextNode(txtNode));
		parentEl.appendChild(childElement);
		return childElement;
	};
	var curryAddView = curry(addView);
	var addViewToVH = curryAddView(viewHolder);

	var addH2 = addViewToVH('h2');
	var addButton = addViewToVH('button');
	var addDiv = addViewToVH('div');
	
	addH2('Sudoku Solver');
	btnNewPzl = addButton('New Puzzle');
	btnSolve = addButton('Solve!');
	divPzl = addDiv('');
	divMsg = addDiv('');

	btnNewPzl.onfocus = function() {
		this.blur && this.blur();
	}
	btnSolve.onfocus = function() {
		this.blur && this.blur();
	}
	divMsg.className = 'msg';
}());
function appendView() {
	document.body.appendChild(viewHolder);
}

function newPuzzle() {
	var html='<table>';
	var v=0;
	var w=0;
	var x=0;
	var y=0;
	var z=0;
	var k=0;
	var solx=0;
	var soly=0;
	var solz=0;
	for (v=1; v<=3; v++) {
		html=html+'<tr>';
		for (w=1; w<=3; w++) {
			html=html+'<td><table>';
			for (x=1; x<=3; x++) {
				html=html+'<tr>';
				for (y=1; y<=3; y++) {
					k=(v*3+x)*9+w*3+y-40;
					html=html+'<td><select id='+k+'><option value=""></option>';
					for (z=1; z<=9; z++) {
						html=html+'<option value='+z+'>'+z+'</option>';
					}
					html=html+'</select></td>';
				}
			}
			html=html+'</table></td>';
		}
		html=html+'</tr>';
	}
	html=html+'</table>';
	divPzl.innerHTML = html;
	divMsg.innerHTML='';
}
function solver() {
	//declare local variables
	var masterLooper=0;
	//declare global variables
	intBrute=0;
	i=0;
	x=1;
	j=1;
	z=1;
	r=0;
	rr=0;
	rrfun=0;
	c=0;
	cc=0;
	ccfun=0;
	booChange=false;
	count=0;
	strInvalidPzlReadout="";
	//declare global memory arrays
	arrMemory=[];
	arrPossValues=[];
	arrGuessCell=[];
	//create global solver array
	arr=[];
	for (i=0; i<=80; i++) {
		arr[i]=[];
	}
	//initialise solver array
	for (i=0; i<=80; i++) {
		for (j=0; j<=8; j++) {
			arr[i][j]=true;
		}
	}
	//Check whether puzzle is valid
	if (checkPzlValid()==false) {
		divMsg.innerHTML='Puzzle setup is invalid: '+strInvalidPzlReadout;
		return;
	}	
	//Check whether puzzle is complete
	if (checkPzlComplete()==true) {
		divMsg.innerHTML='Puzzle complete!';
		return;
	}
	//Master Looper
	for (masterLooper=0; masterLooper<=1023; masterLooper++) {
		booChange=false;
		updateArray();
		simpleOutput();
		complexOutput();
		//if bruteForce has been engaged check pzl is valid and if not must go back through memory chain
		if (intBrute>0) {
			if (checkPzlValid()==false) {
				remember();
			}
		}
		if (booChange==false) {
			if (checkPzlValid()==true && checkPzlComplete()==true) {
				divMsg.innerHTML='Puzzle complete!';
				return;
			}
			bruteForce();
		}
	}
}
function checkPzlComplete() {
	for (i=0; i<=80; i++) {
		//get cell value
		var e=document.getElementById(i);
		var v=e.options[e.selectedIndex].value;
		//if cell is blank return false
		if(v=="") {
			return false;
		}
	}
	//if no blank cells
	return true;
}
function checkPzlValid() {
	updateArray();
	//declare local variable
	var xx=0;
	var booNoValues=false;
	for (i=0; i<=80; i++) {
		//get cell value
		var e=document.getElementById(i);
		var v=e.options[e.selectedIndex].value;
		//if cell is not blank then check there are no duplicates
		if(v!="") {
			//check same value not in same row
			//get row (r) from i
			r=getRow(i);
			//check row
			for (x=r*9-9; x<r*9; x++) {
				var ee=document.getElementById(x);
				var vv=ee.options[ee.selectedIndex].value;
				if (v==vv && i!=x) {
					strInvalidPzlReadout=('cell id: '+i+', duplicate in row: '+r);
					return false;
				}
			}
			//get column (c) from i
			c=getColumn(i);
			//check column
			for (x=1; x<=9; x++) {
				if (c==9) {
					xx=9*x-1;
					var ee=document.getElementById(xx);
					var vv=ee.options[ee.selectedIndex].value;
				} else {
					xx=c+9*x-10;
					var ee=document.getElementById(xx);
					var vv=ee.options[ee.selectedIndex].value;
				}
				if (v==vv && i!=xx) {
					strInvalidPzlReadout=('cell id: '+i+', duplicate in column: '+c);
					return false;
				}
			}
			//check child square		
			rrfun=Math.floor((r+2)/3)*3-2;
			ccfun=Math.floor((c+2)/3)*3-2;			
			for (rr=rrfun; rr<=rrfun+2; rr++) {
				for (cc=ccfun; cc<=ccfun+2; cc++) {
					x=cc+(rr-1)*9-1;
					var ee=document.getElementById(x);
					var vv=ee.options[ee.selectedIndex].value;
					if (v==vv && i!=x) {
						strInvalidPzlReadout=('cell id: '+i+', duplicate in child square row: '+rr+' & child square column: '+cc);
						return false;
					}
				}
			}
		} else {
			//If cell is blank then check it has possible values
			booNoValues=true;
			for (z=0; z<=8; z++) {
				if (arr[i][z]==true) {
					booNoValues=false;
					break;
				}
			}
			if (booNoValues==true) {
				strInvalidPzlReadout=('cell id: '+i+', no possible values');
				return false;
			}
		}
	}
	return true;
}
function updateArray() {
	//initialise array (because things may have changed if bruteForce has been initialised)
	if (intBrute>0) {
		for (i=0; i<=80; i++) {
			for (j=0; j<=8; j++) {
				arr[i][j]=true;
			}
		}
	}
	//scan for completed cells and update array
	for (i=0; i<=80; i++) {
		//get cell value
		var e = document.getElementById(i);
		var v = e.options[e.selectedIndex].value;
		if(v!="") {
			//get row (r) from i
			r=getRow(i);
			//get column (c) from i
			c=getColumn(i);
			//update for completed cell
			for (j=0; j<=8; j++) {		
				arr[i][j]=false;
			}
			//update array for row cells affected
			for (x=r*9-9; x<r*9; x++) {		
				arr[x][v-1]=false;
			}
			//update array for column cells affected
			for (x=1; x<=9; x++) {
				if (c==9) {
					arr[9*x-1][v-1]=false;
				} else {
					arr[c+9*x-10][v-1]=false;
				}
			}
			//update array for square cells affected
			rrfun=Math.floor((r+2)/3)*3-2;
			ccfun=Math.floor((c+2)/3)*3-2;			
			for (rr=rrfun; rr<=rrfun+2; rr++) {
				for (cc=ccfun; cc<=ccfun+2; cc++) {
					arr[cc+(rr-1)*9-1][v-1]=false;
				}
			}
		}
	}
}
function simpleOutput() {
	//output where cell has one possible solution
	//declare local variables
	var looper=0;
	//loop through each cell
	for (i=0; i<=80; i++) {
		//check if cell has a value
		var e=document.getElementById(i);
		var v=e.options[e.selectedIndex].value;
		if(v=="") {
			//loop through all values for current cell
			looper=0;
			for (j=1; j<=9; j++) {
				if (looper==2) {
					break;
				}
				if(arr[i][j-1]==true) {
					looper=looper+1;
					z=j;
				}
			}
			//if only one possible value enter it into cell
			if (looper==1) {
				document.getElementById(i).value=z;
				booChange=true;
			}
		}
	}
}
function complexOutput() {
	//declare local variables
	var a=0;
	var b=0;
	//output
	//if value is true in only one cell throughout column then it is the answer
	for (x=1; x<=9; x++) {
		for (z=1; z<=9; z++) {
			count=0;
			for (y=1; y<=9; y++) {
				if (arr[y+(x)*9-10][z-1]==true) {
					count=count+1;
					if (count==2) {
						break;
					}
					solx=x;
					soly=y;
					solz=z;
				}
			}
			if (count==1) {
				document.getElementById(soly+(solx)*9-10).value=solz;
				booChange=true;
			}
		}
	}
	//if value is true in only one cell throughout row then it is the answer
	for (y=1; y<=9; y++) {
		for (z=0; z<=8; z++) {
			count=0;
			for (x=1; x<=9; x++) {
				if (arr[y+(x)*9-10][z]==true) {
					count=count+1;
					if (count==2) {
						break;
					}
					solx=x;
					soly=y;
					solz=z+1;
				}
			}
			if (count==1) {
				document.getElementById(soly+(solx)*9-10).value=solz;
				booChange=true;
			}
		}
	}
	//if value is true in only one cell throughout child square then it is the answer
	for (a=1; a<=3; a++) {
		a=3*a;
		for (b=1; b<=3; b++) {
			b=3*b;
			for (z=1; z<=9; z++) {
				count=0;
				for (x=a-2; x<=a; x++) {
					for (y=b-2; y<=b; y++) {
						if (arr[y+(x)*9-10][z-1]==true) {
							count=count+1;
							if (count==2) {
								break;
							}
							solx=x;
							soly=y;
							solz=z;
						}
					}
					if (count==2) {
						break;
					}
				}
				if (count==1) {
					document.getElementById(soly+(solx)*9-10).value=solz;
					booChange=true;
				}
			}
		}		
	}
}
function bruteForce() {
	//declare local variable
	var metaCount=9;
	var intChosenValueIndex=0;
	//create array within arrMemory and arrPossValues
	arrMemory[intBrute]=[];
	arrPossValues[intBrute]=[];
	//commit puzzle to memory array
	for (i=0; i<=80; i++) {
		var e=document.getElementById(i);
		var v=e.options[e.selectedIndex].value;
		arrMemory[intBrute][i]=v;
	}
	//loop through all cells and pick one with least possible values
	for (i=0; i<=80; i++) {
		count=0;
		for (z=0; z<=8; z++) {
			if (arr[i][z]==true) {
				count=count+1;
				if (count>=metaCount) {
					break;
				}
			}
			if (count>1) {
				metaCount=count;
				//Memorise chosen cell
				arrGuessCell[intBrute]=i;
			}
		}
	}
	//Group all possible options for chosen cell in array arrPossValues
	for (z=0; z<=8; z++) {
		if (arr[arrGuessCell[intBrute]][z]==true) {
			arrPossValues[intBrute].push(z+1);
		}
	}
	//output random option for chosen cell
	intChosenValueIndex=Math.floor(Math.random()*(arrPossValues[intBrute].length));
	z=arrPossValues[intBrute][intChosenValueIndex];
	document.getElementById(arrGuessCell[intBrute]).value=z;
	booChange=true;
	//remove the chosen value from the array so it is not recognised as an option again if a reguess is necessary
	arrPossValues[intBrute].splice(intChosenValueIndex,1);
	//Add 1 to intBrute in preparation for any future bruteForce() iterations
	intBrute=intBrute+1;
}
function remember() {
	//declare local variables
	var intChosenValueIndex=0;
	//step intBrute back
	intBrute=intBrute-1;
	//output memory
	for (i=0; i<=80; i++) {
		document.getElementById(i).value=arrMemory[intBrute][i];
	}
	//check if any unused guesses, if so then choose one of them
	if(arrPossValues[intBrute].length==0) {
		//all options at this branch have been exhausted
		//obliterate the memory arrays for this intBrute
		arrMemory.splice(intBrute,1);
		arrPossValues.splice(intBrute,1);
		arrGuessCell.splice(intBrute,1);
		//recursively move back in the memory chain
		remember();
	} else {
		if(arrPossValues[intBrute].length==1) {
			intChosenValueIndex=0;
		} else {
			intChosenValueIndex=Math.floor(Math.random()*(arrPossValues[intBrute].length));
		}
		//output random option from remaining elements for chosen cell
		z=arrPossValues[intBrute][intChosenValueIndex];
		document.getElementById(arrGuessCell[intBrute]).value=z;
		booChange=true;
		//remove the chosen value from the array so it is not recognised as an option again if a reguess is necessary
		arrPossValues[intBrute].splice(intChosenValueIndex,1);
		//step intBrute back forward so it is where it started
		intBrute=intBrute+1;
	}
}
function getRow(ii) {
	return Math.ceil((ii+1)/9);
}
function getColumn(ii) {
	if ((ii+1)/9-Math.floor((ii+1)/9)==0) {
		return 9;
	} else {
		return Math.round((ii+1)-9*Math.floor((ii+1)/9));
	}
}

btnNewPzl.onclick = newPuzzle;
btnSolve.onclick = solver;

function on() {
	newPuzzle();
	appendView();
}
function off() {
	viewHolder.parentNode && viewHolder.parentNode.removeChild(viewHolder);
}

return {
	on: on,
	off: off
};
}());
sudoku.on();

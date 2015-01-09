require('./domManipulation.js')(window);
require('./spiceRack.js')(window);


var iterateFrom1 = iterateFrom(1);
var iterateFrom0 = iterateFrom(0);

var viewHolder = createElement('div');

var createAndAttachToViewHolder = compose(
	createElement,
	appendChild,
	wrap(viewHolder)
);

createAndAppendTextNode('Sudoku Solver', createAndAttachToViewHolder('h2'));
var btnNewPzl = createAndAttachToViewHolder('button');
var btnSolve = createAndAttachToViewHolder('button');
var divPzl = createAndAttachToViewHolder('div');
var divMsg = setAttribute(createAndAttachToViewHolder('div'), "class", 'msg');

createAndAppendTextNode('New Puzzle', btnNewPzl);
createAndAppendTextNode('Solve!', btnSolve);

btnNewPzl.onfocus = function() {
	this.blur && this.blur();
};
btnSolve.onfocus = function() {
	this.blur && this.blur();
};

var createOption = function(parent) {
	return function(i) {
		option = parent.appendChild(document.createElement('option'));
		option.value = i;
		option.appendChild(document.createTextNode(i));
	};
};

function newPuzzle() {
	infanticide(divMsg);
	infanticide(divPzl);
	var iterate3 = iterateFrom1(3);
	var iterate9 = iterateFrom1(9);
	var table = createElement('table');
	var l1 = function(v) {
			var tr = createAndAppendChild('tr', table);
			var l2 = function(w) {
				var td = createAndAppendChild('td', tr);
				var table2 = createAndAppendChild('table', td);
				var l3 = function(x) {
					var tr2 = createAndAppendChild('tr', table2);
					var l4 = function(y) {
						var k=(v*3+x)*9+w*3+y-40;
						var td2 = createAndAppendChild('td', tr2);
						var select = setAttribute(createAndAppendChild('select', td2), 'id', k);
						createOption(select)('');
						iterate9(createOption(select));
					};
					iterate3(l4);
				};
				iterate3(l3);
			};
			iterate3(l2);
	};
	iterate3(l1);
	divPzl.appendChild(table);
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
	if (checkPzlValid() === false) {
		divMsg.innerHTML='Puzzle setup is invalid: '+strInvalidPzlReadout;
		return;
	}
	//Check whether puzzle is complete
	if (checkPzlComplete() === true) {
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
			if (checkPzlValid() === false) {
				remember();
			}
		}
		if (booChange === false) {
			if (checkPzlValid() === true && checkPzlComplete() === true) {
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
		if(v === "") {
			return false;
		}
	}
	//if no blank cells
	return true;
}
function checkPzlValid() {
	updateArray();

	var ee;
	var xx=0;
	var vv;

	var booNoValues=false;
	for (i=0; i<=80; i++) {
		//get cell value
		var e=document.getElementById(i);
		var v=e.options[e.selectedIndex].value;
		//if cell is not blank then check there are no duplicates
		if(v !== "") {
			//check same value not in same row
			//get row (r) from i
			r=getRow(i);
			//check row
			for (x=r*9-9; x<r*9; x++) {
				ee = document.getElementById(x);
				vv = ee.options[ee.selectedIndex].value;
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
					ee = document.getElementById(xx);
					vv=ee.options[ee.selectedIndex].value;
				} else {
					xx=c+9*x-10;
					ee = document.getElementById(xx);
					vv = ee.options[ee.selectedIndex].value;
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
					ee = document.getElementById(x);
					vv = ee.options[ee.selectedIndex].value;
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
				if (arr[i][z] === true) {
					booNoValues=false;
					break;
				}
			}
			if (booNoValues === true) {
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
		if(v !== "") {
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
		if(v === "") {
			//loop through all values for current cell
			looper=0;
			for (j=1; j<=9; j++) {
				if (looper==2) {
					break;
				}
				if(arr[i][j-1] === true) {
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
				if (arr[y+(x)*9-10][z-1] === true) {
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
				if (arr[y+(x)*9-10][z] === true) {
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
						if (arr[y+(x)*9-10][z-1] === true) {
							count=count+1;
							if (count === 2) {
								break;
							}
							solx=x;
							soly=y;
							solz=z;
						}
					}
					if (count === 2) {
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
			if (arr[i][z] === true) {
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
		if (arr[arrGuessCell[intBrute]][z] === true) {
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
	if(arrPossValues[intBrute].length === 0) {
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
	if ((ii + 1) / 9 - Math.floor((ii + 1) / 9) === 0) {
		return 9;
	} else {
		return Math.round((ii+1)-9*Math.floor((ii+1)/9));
	}
}

btnNewPzl.onclick = newPuzzle;
btnSolve.onclick = solver;

function on() {
	newPuzzle();
	appendChild(viewHolder)(document.body);
}
function off() {
	viewHolder.parentNode && viewHolder.parentNode.removeChild(viewHolder);
}

window.sudoku = {
	on: on,
	off: off
};
window.sudoku.on();

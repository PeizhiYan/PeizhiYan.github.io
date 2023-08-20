/*
Author: Peizhi Yan
Date: Aug. 20, 2023
*/


/*========= Global variables ==========*/

// Data for the three stacks
//var stacks = [[6,5,4,3,2,1,0], [], []]
//var stacks = [[0], [], [6,5,4,3,2,1]]
var stacks = [[],[],[]]

// Canvas and content
var canvas
var ctx
var W
var H



// Color map for disks
const color_map = [
	"rgb(255,25,0)",
	"rgb(255,125,0)",
	"rgb(255,235,0)",
	"rgb(50,255,0)",
	"rgb(0,250,255)",
	"rgb(0,120,255)",
	"rgb(231,104,231)",
]




function int(x){
	// Convert to integer
	return Math.round(x);
}


// Game states
var selected = -1;    // -1 means no pole is selected
var started = false;  // whether the game is started
var start_time;       // time object
var current_time;     // time object
var seconds;          // time used in seconds
var steps;            // steps moved 
var win;              // win or not


/*=============== Main loop ===============*/
window.onload = function() {

	/*============= Creating a canvas ===============*/
	canvas = document.getElementById('my_Canvas');
	ctx = canvas.getContext("2d");
	
	// set canvas width and height
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = int(ctx.canvas.width / 3);

	ctx.fillStyle = "blue";
	ctx.fillRect(0, 0, canvas.width, canvas.height);


	/*=========== Draw ===========*/ 
	draw();


	/*=========== Timer ===========*/ 
	var clock = setInterval(function() {
		current_time = new Date().getTime();
		var dt = current_time - start_time;
		seconds = Math.floor(dt / 1000);
		if (started) {
			document.getElementById("timer").innerHTML = 'Time used: ' + seconds + ' seconds';
			document.getElementById("counter").innerHTML = 'Step used: ' + steps;
		}
	}, 100);


	/*=========== Click event listener ===========*/ 
	canvas.addEventListener("mousedown", function (e) {
		drawing = true;
		//lastPos = getMousePos(canvas, e);
		x = e.clientX;

		if (x < W/3) {
			select_or_move(0); // first pole
		}
		else if (x < (2*W/3)) {
			select_or_move(1); // second pole
		}
		else {
			select_or_move(2); // third pole
		}
	}, false);

}


function start() {
	// Start the game
	reset();
	started = true;
	start_time = new Date().getTime();
	//Math.floor(())
}

function reset() {
	// Reset everything
	//stacks = [[6,5,4,3,2,1,0], [], []];
	stacks = [[0], [], [6,5,4,3,2,1]];
	selected = -1;
	started = false;
	steps = 0;
	win = false;
	document.getElementById("fireworks").style.visibility = "hidden";
	draw();
}


function select_or_move(pole) {

	// detect whether game has started
	if (started == false) {
		return 0;
	}

	if (selected != -1) {
		// try to move the disk to the target pole
		if (stacks[pole].length == 0){
			// move if the target pole is empty
			disk = stacks[selected].pop();
			stacks[pole].push(disk);
			steps += 1;
		}
		else {
			disk = stacks[selected].pop();
			if (disk < stacks[pole][stacks[pole].length-1]) {
				// move if disk is smaller
				stacks[pole].push(disk);
				steps += 1;
			}
			else {
				// not move: roll back
				stacks[selected].push(disk);
			}
		}

		selected = -1; // unselect

	}
	else {
		// try to select the top disk from the pole
		selected = pole;
		if (stacks[selected].length == 0) {
			// empty pole
			selected = -1; // roll back
		}
	}

	// detect whether the player win
	if (stacks[2].length == 7){
		// win
		started = false;
		document.getElementById("win").innerHTML = 'You win !';
		document.getElementById("info").innerHTML = 'Please take a screen shot and sent to yanpeizhi2008@yahoo.com , the author will update the list :)';
		document.getElementById("fireworks").style.visibility = "visible";
	}

	draw();

}



function draw() {

	/* This function refreshes the canvas's content */
	W = ctx.canvas.width;    // get canvas width
	H = ctx.canvas.height;   // get canvas height
 	ctx.clearRect(0, 0, W, H);

 	// Draw the three poles
 	ctx.beginPath();
 	ctx.fillStyle = "brown";
 	pole_width  = 20;
 	pole_height = H - 40;
	ctx.roundRect(int(W/6)-10,   20, pole_width, pole_height, 20);
	ctx.roundRect(int(W/2)-20,   20, pole_width, pole_height, 20);
	ctx.roundRect(int(5*W/6)-30, 20, pole_width, pole_height, 20);
 	ctx.fill();
	ctx.closePath();

 	// Draw the base
	ctx.beginPath();
 	ctx.fillStyle = "brown";
 	base_length = W-30;
 	base_height = int(pole_height / 10);
	ctx.roundRect(10, H-40, base_length, base_height, 5);
 	ctx.fill();
	ctx.closePath();

	// Loop through three poles
	disk_height = int(pole_height / 10)
	disk_width_max = int(W/3 - 40)
	x_offset = 10;
	for (i=0; i<3; i++) {

		// Draw the disks in each pole
		pole_data = stacks[i];
		y = H - 40 - disk_height;
		for (j=0; j<pole_data.length; j++) {
			ctx.beginPath();
			disk = pole_data[j]; // get the disk number
		 	
		 	ctx.fillStyle = color_map[disk]; // unselected color

		 	if (selected == i) {   
			 	if (j == pole_data.length - 1) {
			 		//ctx.fillStyle = "rgb(0,0,0)"; // selected color
			 		y -= 20; // lift the top disk
			 	}
		 	}

		 	disk_width = int((disk + 1) * disk_width_max / 7);
			x = x_offset + int((W/6) - (disk_width / 2)) - 10;
			ctx.roundRect(x, y, disk_width, disk_height, 15);
			y -= disk_height;
			ctx.fill();
			ctx.closePath();
		}

		x_offset += int(W/3-10);

	}

}













function main(){


	/*============= Creating a canvas ===============*/
	var canvas = document.getElementById('my_Canvas');
	var ctx = canvas.getContext("2d");
	
	// set canvas width and height
	ctx.canvas.width  = window.innerWidth;
  	ctx.canvas.height = Math.round(ctx.canvas.width / 2);

	ctx.fillStyle = "blue";
	ctx.fillRect(0, 0, canvas.width, canvas.height);


	/*========= Data of three stacks ==========*/
	content = [[7,6,5,4,3,2,1], [], []]
	console.log(content)

	/*=========== Draw ===========*/ 
	draw(ctx, content)


}// End of main()



function draw(ctx, content){

	/* This function refreshes the canvas's content */
	W = ctx.canvas.width    // get canvas width
	H = ctx.canvas.height   // get canvas height
 	ctx.clearRect(0, 0, W, H);

 	// Draw the three poles
 	ctx.fillStyle = "brown"
 	pole_length =
	ctx.roundRect(10, H-30, W-30, 20, 20);
 	ctx.fill();

 	// Draw the base
 	ctx.fillStyle = "orange"
 	base_length = W-30
 	base_height = 20
	ctx.roundRect(10, H-30, base_length, base_height, 20);
 	ctx.fill();


}






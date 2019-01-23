var bacteria_list = [];
var game_points = 0;
var game_over = false;

function main(){
		/* Step1: Prepare the canvas and get WebGL context */
		 var canvas = document.getElementById('cvs');
		 canvas.addEventListener("click", click_handler);

		 var gl = canvas.getContext('experimental-webgl');

		 var disk_radius = 200; // the radius of disk

		 bacteria_list = [];
		 var speed = 1;
		 var colors = [
		 	'1.0, 0.0, 0.0, 1',
			'0.0, 1.0, 0.0, 1',
			'0.0, 0.0, 1.0, 1',
			'1.0, 1.0, 0.0, 1',
			'1.0, 0.0, 1.0, 1',
			'0.0, 1.0, 1.0, 1',
			'0.5, 0.5, 0.0, 1',
			'0.0, 0.5, 0.5, 1',
			'0.5, 0.0, 0.5, 1',
			'0.2, 1.0, 0.2, 1'];

		 var number_of_bacterias = 5;
		 
		 /* generate a list of bacterias */
		 for (var i = 0; i < number_of_bacterias; i++) {
		 	bacteria_list.push(generate_bacteria(colors[i], disk_radius));
		 }

		 /** main loop */
		 setInterval(main_loop, 100, canvas, gl, bacteria_list, disk_radius, speed); // refresh every 100 ms

}

/** detect if all bacterias are dead */
function every_died(bacteria_list){
    for (var i = 0; i < bacteria_list.length; i++) {
            if (bacteria_list[i][4]) {
                return false;
            }
    }
    return true;
}

/** get the number of bacterias that >= 30 degree */
function count_game_points(bacteria_list, disk_radius){
	counter = 0 // number of bacterias > 30 degree threshold

	for (var i = 0; i < bacteria_list.length; i++) {
			if (bacteria_list[i][4]) {
				if(get_angle(bacteria_list[i][2], disk_radius)>=30){
					counter+=1;
				}
			}
	}

	return counter;
}

/** get angle of the arc */
function get_angle(r, R){
	return (2*Math.atan((1.0*r)/R))*(180.0/Math.PI)
}

/** called when user click on the canvas */
function click_handler(event){
	html_border = 10 // 10 pixel
	click_x = event.clientX-html_border-250;
	click_y = -(event.clientY-html_border-250);
	//if (inside_or_not(0,0,200,click_x,click_y)) {
	if (true) {
		/**detect if the click is on any bacteria*/
		for (var i = 0; i < bacteria_list.length; i++) {
			if (bacteria_list[i][4]) {
				if(inside_or_not(bacteria_list[i][0], bacteria_list[i][1], bacteria_list[i][2],click_x,click_y)){
					bacteria_list[i][4] = false; // posion this bacteria
					return 0;
				}
			}
		}
	}
}

/**detect whether the click is within the circle*/
function inside_or_not(x, y, r, click_x, click_y){
	if( ((click_x-x)*(click_x-x) + (click_y-y)*(click_y-y)) <= r*r ){
		return true;
	}
	return false;
}

function main_loop(canvas, gl, bacteria_list, disk_radius, speed){
	
	if (game_over == false){

		refresh(canvas, gl, bacteria_list, disk_radius);
		grow(bacteria_list, speed);

		// Detection
		tmp = count_game_points(bacteria_list, disk_radius);
		if (tmp > game_points){
			game_points = tmp;
            document.getElementById('game_points').innerHTML = 'Game gains:'+game_points;
		}
		if (tmp >= 2){
			// You lose
            game_over = true;
            document.getElementById('win_lose').innerHTML = 'You lose!';
		}
        if(every_died(bacteria_list)){
            game_over = true;
            document.getElementById('win_lose').innerHTML = 'You win!';
        }

	}
}


/** simulate the growth of bacteria */
function grow(bacteria_list, speed){
	for (var i = 0; i < bacteria_list.length; i++) {
		if (bacteria_list[i][4]) {
			// update only if it's alive
			bacteria_list[i][2] = bacteria_list[i][2]+speed;
		}
	}
}

function sleep(delay) {
	var start = new Date().getTime();
	while (new Date().getTime() < start + delay);
}

/** refresh the screen */
function refresh(canvas, gl, bacteria_list, disk_radius){
	// Clear the canvas
	gl.clearColor(0.0, 0.0, 0.0, 0);

	/** draw bacterias */
	for (var i = 0; i < bacteria_list.length; i++) {
		if (bacteria_list[i][4]) {
			//draw only if it's alive
			draw_circle(canvas, gl, bacteria_list[i][0], bacteria_list[i][1], bacteria_list[i][2], bacteria_list[i][3]);			
		}
	}
	
	/** draw the disk */
	draw_circle(canvas, gl, 0, 0, disk_radius, '1, 1, 1, 1.0');
	draw_circle(canvas, gl, 0, 0, 1000, '0, 0, 0, 1.0') // background
}

/** generate a random floating point value between 0 and max*/
function getRandom(max) {
	return Math.random() * Math.floor(max);
}

/** randomly generate a bacteria's basic info. */
function generate_bacteria(color, r){
		/* r is the radius of the disk */
		random_degree = getRandom(360)// random a degree between 0 and 360
		ret = [] // a list
		ret.push(r*Math.sin(random_degree)); // x
		ret.push(r*Math.cos(random_degree)); // y
		ret.push(1); // radius, start from 1
		ret.push(color); // color
		ret.push(true); // alive?  True/False
		return ret;
}


function draw_circle(canvas, gl, x, y, r, color){
		/**
		* (x, y): center of the circle 
		* r: radius
		* color: a string in this format: 'R,G,B,A'	range from 0.0 to 1.0
		*/

		/* Step2: Define the geometry and store it in buffer objects */
		/** Represent a circle disk through 360 trangles */
		 n = 3*360 // number of total vertives
		 var vertices = [];
		 for (var i = 1; i <= 360; i++) {
		 	vertices.push(x);
		 	vertices.push(y);
		 	vertices.push(x+r*Math.sin(i-1));
		 	vertices.push(y+r*Math.cos(i-1));
		 	vertices.push(x+r*Math.sin(i));
		 	vertices.push(y+r*Math.cos(i));
		 }
		 // Create a new buffer object
		 var vertex_buffer = gl.createBuffer();
		 // Bind an empty array buffer to it
		 gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
		 // Pass the vertices data to the buffer
		 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		 // Unbind the buffer
		 gl.bindBuffer(gl.ARRAY_BUFFER, null);
		 /* Step3: Create and compile Shader programs */
		 // Vertex shader source code
		 var vertCode =
			'attribute vec2 coordinates;' + 
			'void main(void) {' + ' gl_Position = vec4(coordinates,0.0, 250.0);' + '}';
		 //Create a vertex shader object
		 var vertShader = gl.createShader(gl.VERTEX_SHADER);
		 //Attach vertex shader source code
		 gl.shaderSource(vertShader, vertCode);
		 //Compile the vertex shader
		 gl.compileShader(vertShader);
		 //Fragment shader source code
		 var fragCode = 'void main(void) {' + 'gl_FragColor = vec4('+color+');' + '}';
		 // Create fragment shader object
		 var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
		 // Attach fragment shader source code
		 gl.shaderSource(fragShader, fragCode);
		 // Compile the fragment shader
		 gl.compileShader(fragShader);
		 // Create a shader program object to store combined shader program
		 var shaderProgram = gl.createProgram();
		 // Attach a vertex shader
		 gl.attachShader(shaderProgram, vertShader); 
		 // Attach a fragment shader
		 gl.attachShader(shaderProgram, fragShader);
		 // Link both programs
		 gl.linkProgram(shaderProgram);
		 // Use the combined shader program object
		 gl.useProgram(shaderProgram);
		 /* Step 4: Associate the shader programs to buffer objects */
		 //Bind vertex buffer object
		 gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
		 //Get the attribute location
		 var coord = gl.getAttribLocation(shaderProgram, "coordinates");
		 //point an attribute to the currently bound VBO
		 gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
		 //Enable the attribute
		 gl.enableVertexAttribArray(coord);
		 /* Step5: Drawing the required object (triangle) */
		 // Enable the depth test
		 gl.enable(gl.DEPTH_TEST); 
		 // Draw the triangle
		 gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}
function main(){
	// the status of 3 bacterias
	var b1_status = true;
	var b2_status = true;
	var b3_status = true;

	/*============= Creating a canvas ======================*/
	var canvas = document.getElementById('my_Canvas');
	gl = canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true});

	/*=================== SHADERS =================== */
	var vertCode = 'attribute vec3 position;'+
	   'uniform mat4 Pmatrix;'+
	   'uniform mat4 Vmatrix;'+
	   'uniform mat4 Mmatrix;'+
	   'attribute vec3 color;'+//the color of the point
	   'varying vec3 vColor;'+
	   'void main(void) { '+//pre-built function
		  'gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);'+
		  'vColor = color;'+
	   '}';
	var fragCode = 'precision mediump float;'+
	   'varying vec3 vColor;'+
	   'void main(void) {'+
		  'gl_FragColor = vec4(vColor, 1.);'+
	   '}';
	var vertShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertShader, vertCode);
	gl.compileShader(vertShader);
	var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragShader, fragCode);
	gl.compileShader(fragShader);
	var shaderprogram = gl.createProgram();
	gl.attachShader(shaderprogram, vertShader);
	gl.attachShader(shaderprogram, fragShader);
	gl.linkProgram(shaderprogram);

	
	function draw_sphere(RADIUS, ALPHA, BETA, ARC,  r, g, b, vertex_start_from, vertices, indices, colors, main_ball=false){
		var SPHERE_DIV = 180;
		var sin_ALPHA = Math.sin(ALPHA*Math.PI/180.0)
		var cos_ALPHA = Math.cos(ALPHA*Math.PI/180.0)
		var sin_BETA = Math.sin(BETA*Math.PI/180.0)
		var cos_BETA = Math.cos(BETA*Math.PI/180.0)
		 
		 for (j = 0; j <= ARC; j++){//SPHERE_DIV为经纬线数
			alpha = j * (Math.PI/SPHERE_DIV) ;
			sj = RADIUS*Math.sin(alpha);
			cj = RADIUS*Math.cos(alpha);
			for(i = 0; i <= SPHERE_DIV; i++){
				beta = i * (2 * Math.PI)/SPHERE_DIV;
				si = Math.sin(beta);
				ci = Math.cos(beta);

				// vertices of a triangle on the sphere
				x_ = si * sj 
				y_ = cj
				z_ = ci * sj

				// rotate the point around the x-axis
				x__ = x_
				y__ = y_*cos_ALPHA - z_*sin_ALPHA
				z__ = y_*sin_ALPHA + z_*cos_ALPHA

				// rotate the point around the y-axis
				x = x__*cos_BETA + z__*sin_BETA
				y = y__
				z = -x__*sin_BETA + z__*cos_BETA

				vertices.push(x);
				vertices.push(y);
				vertices.push(z);

				// color of the triangle
				if (main_ball) {
					colors.push(r-0.001*j);
					colors.push(g-0.005*j);
					colors.push(b-0.001*j);
				}
				else{
					colors.push(r);
					colors.push(g);
					colors.push(b);
				}
			}
		}
		// generate indices list and colors list
		for(j = 0; j < ARC; j++){
			for(i = 0; i < SPHERE_DIV; i++){
				p1 = j * (SPHERE_DIV+1) + i;
				p2 = p1 + (SPHERE_DIV+1);

				indices.push(vertex_start_from+p1);//indices为顶点的索引
				indices.push(vertex_start_from+p2);
				indices.push(vertex_start_from+p1 + 1);

				indices.push(vertex_start_from+p1 + 1);
				indices.push(vertex_start_from+p2);
				indices.push(vertex_start_from+p2 + 1);

			}
		}
	}// end of draw_sphere()

	// for all objects 
	vertices_ = []
	indices_ = []
	colors_ = []

	vertices_main = []
	indices_main = []
	colors_main = []
	// Draw the main sphere
	function rand_color(){
		var ret = Math.random();
		if (ret < 0.5){
			ret += 0.5;
		}
		return ret;
	}
	draw_sphere(3, 0, 0, 180, rand_color(),rand_color(),rand_color(), 0, vertices_main, indices_main, colors_main, true);
	   	
	/** Bind lists to buffers */
	var vertex_buffer = gl.createBuffer ();
	var color_buffer = gl.createBuffer ();
	var index_buffer = gl.createBuffer ();
	// Create and store data into vertex buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices_), gl.DYNAMIC_DRAW);
	// Create and store data into color buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors_), gl.DYNAMIC_DRAW);
	// Create and store data into index buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices_), gl.DYNAMIC_DRAW);

	var _Pmatrix = gl.getUniformLocation(shaderprogram, "Pmatrix");
	var _Vmatrix = gl.getUniformLocation(shaderprogram, "Vmatrix");
	var _Mmatrix = gl.getUniformLocation(shaderprogram, "Mmatrix");

	gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
	var _position = gl.getAttribLocation(shaderprogram, "position");
	gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,0,0);
	gl.enableVertexAttribArray(_position);

	gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
	var _color = gl.getAttribLocation(shaderprogram, "color");
	gl.vertexAttribPointer(_color, 3, gl.FLOAT, false,0,0) ;
	gl.enableVertexAttribArray(_color);
	gl.useProgram(shaderprogram);


	/*==================== MATRIX ====================== */
	function get_projection(angle, a, zMin, zMax) {
		var ang = Math.tan((angle*.5)*Math.PI/180);//angle*.5
		return [
		   0.5/ang, 0 , 0, 0,
		   0, 0.5*a/ang, 0, 0,
		   0, 0, -(zMax+zMin)/(zMax-zMin), -1,
		   0, 0, (-2*zMax*zMin)/(zMax-zMin), 0 
		];
	}

	var proj_matrix = get_projection(40, canvas.width/canvas.height, 1, 100);
	var mo_matrix = [ 1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1 ];
	var view_matrix = [ 1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1 ];

	view_matrix[14] = view_matrix[14]-6;

	/*================= Mouse events ======================*/
	var AMORTIZATION = 0.95;
	var drag = false;
	var old_x, old_y;
	var dX = 0, dY = 0;

	var mouseDown = function(e) {
		drag = true;
		old_x = e.pageX, old_y = e.pageY;

		//var ctx = document.getElementById('my_Canvas').getContext('2d');
		//var c = ctx.getImageData(old_x, old_y, 1, 1).data;
		//console.log(">>> ",c)
		
		// Get the color of click
		var pixel = new Uint8Array(4);
		//gl.bindFramebuffer(gl.TEXTURE_2D, null);
		gl.readPixels(old_x-10, 500-old_y+10, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
		console.log("texture:", pixel);

		// Kill the bacteria if color match
		if (pixel[0] != 255 || pixel[1] != 255 || pixel[2] != 255) {
			if (pixel[0] == 255 && b1_status == true) {
				b1_status = false;
			}
			else if (pixel[1] == 255 && b2_status == true) {
				b2_status = false;
			}
			else if (pixel[2] == 255 && b3_status == true) {
				b3_status = false;
			}
		}

		//gl.drawElements(gl.TRIANGLES, indices_.length, gl.UNSIGNED_SHORT, 0);
		e.preventDefault();
		return false;
	};

	var mouseUp = function(e){
		drag = false;
	};

	var mouseMove = function(e) {
		if (!drag) return false;
		dX = (e.pageX-old_x)*2*Math.PI/canvas.width,
		dY = (e.pageY-old_y)*2*Math.PI/canvas.height;
		THETA+= dX;
		PHI+=dY;
		old_x = e.pageX, old_y = e.pageY;
		e.preventDefault();
	};

	canvas.addEventListener("mousedown", mouseDown, false);
	canvas.addEventListener("mouseup", mouseUp, false);
	canvas.addEventListener("mouseout", mouseUp, false);
	canvas.addEventListener("mousemove", mouseMove, false);

	/*=========================rotation================*/
	function rotateX(m, angle) {
		var c = Math.cos(angle);
		var s = Math.sin(angle);
		var mv1 = m[1], mv5 = m[5], mv9 = m[9];

		m[1] = m[1]*c-m[2]*s;
		m[5] = m[5]*c-m[6]*s;
		m[9] = m[9]*c-m[10]*s;

		m[2] = m[2]*c+mv1*s;
		m[6] = m[6]*c+mv5*s;
		m[10] = m[10]*c+mv9*s;
	}

	function rotateY(m, angle) {
		var c = Math.cos(angle);
		var s = Math.sin(angle);
		var mv0 = m[0], mv4 = m[4], mv8 = m[8];

		m[0] = c*m[0]+s*m[2];
		m[4] = c*m[4]+s*m[6];
		m[8] = c*m[8]+s*m[10];

		m[2] = c*m[2]-s*mv0;
		m[6] = c*m[6]-s*mv4;
		m[10] = c*m[10]-s*mv8;
	}

	/*=================== Drawing =================== */
	var THETA = 0,
	PHI = 0;
	var time_old = 0;

	// Random bacteria starting point
	B1_x = Math.floor(Math.random() * 180); 
	B1_y = Math.floor(Math.random() * 180);  
	B2_x = Math.floor(Math.random() * 180);  
	B2_y = Math.floor(Math.random() * 180);  
	B3_x = Math.floor(Math.random() * 180);  
	B3_y = Math.floor(Math.random() * 180);  

	// color of canvas
	var R = 0.0;
	var G = 0.0;
	var B = 0.0;
	var R_ = 0.001;
	var G_ = 0.002;
	var B_ = 0.003;
	// Bacteria's arc
	var B1_arc = 0;
	var B2_arc = 0;
	var B3_arc = 0;
	var frame_counter = 0;
	var animate = function(time) {
		var dt = time-time_old;

		if (!drag) {
		   dX *= AMORTIZATION, dY*=AMORTIZATION;
		   THETA+=dX, PHI+=dY;
		}

		//set model matrix to I4
		mo_matrix[0] = 1, mo_matrix[1] = 0, mo_matrix[2] = 0, mo_matrix[3] = 0,
		mo_matrix[4] = 0, mo_matrix[5] = 1, mo_matrix[6] = 0, mo_matrix[7] = 0,
		mo_matrix[8] = 0, mo_matrix[9] = 0, mo_matrix[10] = 1, mo_matrix[11] = 0,
		mo_matrix[12] = 0, mo_matrix[13] = 0, mo_matrix[14] = 0, mo_matrix[15] = 1;

		rotateY(mo_matrix, THETA);
		rotateX(mo_matrix, PHI);


		time_old = time; 
		gl.enable(gl.DEPTH_TEST);

		// gl.depthFunc(gl.LEQUAL);
		/* Change the color of canvas dynamically (for fun :)  */
		R += R_;
		G += G_;
		B += B_;
		if(R >= 1 || R <= 0){
			R_ = -R_;
		}
		if(G >= 1 || G <= 0){
			G_ = -G_;
		}
		if(B >= 1 || B <= 0){
			B_ = -B_;
		}
		gl.clearColor(R, G, B, 0.9);
		//gl.clearDepth(1.0);
		//gl.viewport(0.0, 0.0, canvas.width, canvas.height);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.uniformMatrix4fv(_Pmatrix, false, proj_matrix);
		gl.uniformMatrix4fv(_Vmatrix, false, view_matrix);
		gl.uniformMatrix4fv(_Mmatrix, false, mo_matrix);

			
		// Grow bacterias
		//var STEP = 5
		if (true) {
			if (B1_arc >= 30 || B2_arc >= 30 || B3_arc >= 30) {
				R = 0.0;
		 		G = 0.0;
		 		B = 0.0;
		 		R_ = 0;
		 		G_ = 0;
		 		B_ = 0;

		 		counter = 0
		 		if (b1_status == true) {
		 			counter++;
		 		}
		 		if (b2_status == true) {
		 			counter++;
		 		}
		 		if (b3_status == true) {
		 			counter++;
		 		}
		 		if (counter > 1) {
		 			document.getElementById("score").innerHTML = "Bacteria Win!"
		 		}
				gl.drawElements(gl.TRIANGLES, indices_.length, gl.UNSIGNED_SHORT, 0);
				//return; // Game Over
			}
			vertices_b1 = []
			indices_b1 = []
			colors_b1 = []

			vertices_b2 = []
			indices_b2 = []
			colors_b2 = []

			vertices_b3 = []
			indices_b3 = []
			colors_b3 = []

			vertice_counter = vertices_main.length/3;
			if (b1_status) {
				if (frame_counter % 70 == 0) {B1_arc++;}
				draw_sphere(3.01, B1_x, B1_y, B1_arc, 1, 1, 0, vertice_counter, vertices_b1, indices_b1, colors_b1); // a 30-degree part of the sphere (rotate around x 20-degrees, y 20-degrees )
		   	}	
			vertice_counter = vertices_main.length/3+vertices_b1.length/3;
			if (b2_status) {
				if (frame_counter % 70 == 0) {B2_arc++;}
		   		draw_sphere(3.02, B2_x, B2_y, B2_arc, 0, 1, 1, vertice_counter, vertices_b2, indices_b2, colors_b2); // a 30-degree part of the sphere (rotate around x 20-degrees, y 20-degrees )
		   	}	
		   	vertice_counter = vertices_main.length/3+vertices_b1.length/3+vertices_b2.length/3;
		   	if (b3_status) {
		   		if (frame_counter % 70 == 0) {B3_arc++;}
		   		draw_sphere(3.03, B3_x, B3_y, B3_arc, 1, 0, 1, vertice_counter, vertices_b3, indices_b3, colors_b3); // a 30-degree part of the sphere (rotate around x 20-degrees, y 20-degrees )
			}
			if (b1_status == false && b2_status == false && b3_status == false) {
				document.getElementById("score").innerHTML = "You Win!"
			}

			vertices_ = []
			colors_ = []
			indices_ = []
			// Put vertices, indices, and colors into the all list
			vertices_ = vertices_.concat(vertices_main, vertices_b1, vertices_b2, vertices_b3)
			indices_ = indices_.concat(indices_main, indices_b1, indices_b2, indices_b3)
			colors_ = colors_.concat(colors_main, colors_b1, colors_b2, colors_b3)

			// update buffer
			/** Bind lists to buffers */
			vertex_buffer = gl.createBuffer ();
			color_buffer = gl.createBuffer ();
			index_buffer = gl.createBuffer ();
			// Create and store data into vertex buffer
			gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices_), gl.DYNAMIC_DRAW);
			// Create and store data into color buffer
			gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors_), gl.DYNAMIC_DRAW);
			// Create and store data into index buffer
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices_), gl.DYNAMIC_DRAW);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
			_position = gl.getAttribLocation(shaderprogram, "position");
			gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,0,0);
			gl.enableVertexAttribArray(_position);

			gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
			_color = gl.getAttribLocation(shaderprogram, "color");
			gl.vertexAttribPointer(_color, 3, gl.FLOAT, false,0,0) ;
			gl.enableVertexAttribArray(_color);
			gl.useProgram(shaderprogram);
		}

		gl.drawElements(gl.TRIANGLES, indices_.length, gl.UNSIGNED_SHORT, 0);

		frame_counter+=1
		window.requestAnimationFrame(animate);
	}
	animate(0);

}// End of main()
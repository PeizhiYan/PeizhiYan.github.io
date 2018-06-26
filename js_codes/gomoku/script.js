var board
var board_ai
var value
var current

// Good patterns
filter1a = new Array(5)
filter1a[0] = [1,0,0,0,0]
filter1a[1] = [0,1,0,0,0]
filter1a[2] = [0,0,1,0,0]
filter1a[3] = [0,0,0,1,0]
filter1a[4] = [0,0,0,0,1]
filter2a = new Array(5)
filter2a[0] = [0,0,0,0,1]
filter2a[1] = [0,0,0,1,0]
filter2a[2] = [0,0,1,0,0]
filter2a[3] = [0,1,0,0,0]
filter2a[4] = [1,0,0,0,0]
filter3a = new Array(5)
filter3a[0] = [0,0,0,0,0]
filter3a[1] = [0,0,0,0,0]
filter3a[2] = [1,1,1,1,1]
filter3a[3] = [0,0,0,0,0]
filter3a[4] = [0,0,0,0,0]
filter4a = new Array(5)
filter4a[0] = [0,0,1,0,0]
filter4a[1] = [0,0,1,0,0]
filter4a[2] = [0,0,1,0,0]
filter4a[3] = [0,0,1,0,0]
filter4a[4] = [0,0,1,0,0]

filter1b = new Array(4)
filter1b[0] = [1,0,0,0]
filter1b[1] = [0,1,0,0]
filter1b[2] = [0,0,1,0]
filter1b[3] = [0,0,0,1]
filter2b = new Array(4)
filter2b[0] = [0,0,0,1]
filter2b[1] = [0,0,1,0]
filter2b[2] = [0,1,0,0]
filter2b[3] = [1,0,0,0]
filter3b = new Array(4)
filter3b[0] = [0,0,0,0]
filter3b[1] = [0,0,0,0]
filter3b[2] = [1,1,1,1]
filter3b[3] = [0,0,0,0]
filter4b = new Array(4)
filter4b[0] = [0,0,1,0]
filter4b[1] = [0,0,1,0]
filter4b[2] = [0,0,1,0]
filter4b[3] = [0,0,1,0]

filter1c = new Array(3)
filter1c[0] = [1,0,0]
filter1c[1] = [0,1,0]
filter1c[2] = [0,0,1]
filter2c = new Array(3)
filter2c[0] = [0,0,1]
filter2c[1] = [0,1,0]
filter2c[2] = [1,0,0]
filter3c = new Array(3)
filter3c[0] = [0,0,0]
filter3c[1] = [1,1,1]
filter3c[2] = [0,0,0]
filter4c = new Array(3)
filter4c[0] = [0,1,0]
filter4c[1] = [0,1,0]
filter4c[2] = [0,1,0]

filter1d = new Array(2)
filter1d[0] = [1,0]
filter1d[1] = [0,1]
filter2d = new Array(2)
filter2d[0] = [0,1]
filter2d[1] = [1,0]
filter3d = new Array(2)
filter3d[0] = [0,0]
filter3d[1] = [1,1]
filter4d = new Array(2)
filter4d[0] = [0,1]
filter4d[1] = [0,1]


/* initiate the game */
function start(){
	board = new Array(15)
	board_ai = new Array(15)
	value = new Array(15)
	current = 1
	for (var i = 0; i < 15; i++) {
		board[i] = new Array(15)
		board_ai[i] = new Array(15)
		value[i] = new Array(15)
		for (var j = 0; j < 15; j++) {
			/* initialize values */
			board[i][j] = 0
			board_ai[i][j] = 0
			value[i][j] = 0
		}
	}

	/** Create the GUI */
	/* board */
	var temp = ""
	for (var i = 0; i < 15; i++){
		for (var j = 0; j < 15; j++){
			temp += "<button class=\"cell\" id=\"btn"+i+"-"+j+"\" onclick=\"clk("+i+","+j+")\"></button>"
		}
		temp += "<br>"
	}
	document.getElementById("board").innerHTML = temp
	/* insight */
	var temp = ""
	for (var i = 0; i < 15; i++){
		for (var j = 0; j < 15; j++){
			temp += "<button class=\"cell value\" id=\"val"+i+"-"+j+"\"></button>"
		}
		temp += "<br>"
	}
	document.getElementById("value").innerHTML = temp
	computeValue()
	insight()

	/* write to console */
	document.getElementById("console").innerHTML = "Console: \n>>> Game started! "

	document.getElementById("start").innerHTML = "Re-start"
}

/* Insight! Display the value gradient */
function insight(){
	var max_value = 0
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			if (value[i][j] > max_value) {
				max_value = value[i][j] 
			}
		}
	}
	var R = 0
	var G = 0
	var B = 0
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			R = 0
			G = 0
			B = 255
			var scale = parseInt((255*3)*((value[i][j])/max_value))
			B -= scale
			if (B <= 0) {
				B = 0
				scale -= 255
			}
			if (scale > 0) {
				G = scale
				if (G >= 255) {
					G = 255
					scale -= 255
					R = scale
				}
			}
			document.getElementById("val"+i+"-"+j).style.background="#"+toHex(R,G,B);
		}
	}
	return max_value
}

function toHex(r, g, b){
	var tmp = ""
	tmp = tmp + getHex(r)
	tmp = tmp + getHex(g)
	tmp = tmp + getHex(b)
	return tmp
}

function getHex(x){
	if (x == 0) {
		return "00"
	}
	else if (x <= 15){
		return "0"+x.toString(16).toUpperCase()
	}
	else{
		return x.toString(16).toUpperCase()
	}
}

/* Concole write */
function print(x){
	var console = document.getElementById("console")
	//console.innerHTML += x+"\n"
	console.innerHTML = x+"\n"
	//console.focus()
}

/* Handle button(stone) click events */
function clk(i, j){
	print(">>> Click:" + i + "," + j)
	if (current == -1) {
		print(">>> [WARNING] Computer is thinking!! ")
		return
	}
	if (board[i][j] == 0) {
		/* Can put the stone */
		if (current == 1) {
			var name = "btn"+i+"-"+j
			document.getElementById(name).style.background="black"; // Black stone
			board[i][j] = current
			board_ai[i][j] = 0 - current
			current = 0 - current
			var flag = count(conv2d(board, filter1a), 5)
			flag += count(conv2d(board, filter2a), 5)
			flag += count(conv2d(board, filter3a), 5)
			flag += count(conv2d(board, filter4a), 5)
			if (flag > 0) {
				print("You win!")
				return
			}
			/* AI's turn */
			print(">>> Computer is thinking... ")
			computeValue()
			var max_value = insight() // show the value gradient
			ai_move(max_value) // computer make the move
			print(">>> Your turn. ")
			var flag = count(conv2d(board_ai, filter1a), 5)
			flag += count(conv2d(board_ai, filter2a), 5)
			flag += count(conv2d(board_ai, filter3a), 5)
			flag += count(conv2d(board_ai, filter4a), 5)
			if (flag > 0) {
				print("You lose!")
				return
			}
			computeValue()
			var max_value = insight() // show the value gradient
		}
	}
	else{
		print(">>> [WARNING!] Cannot put here!")
	}
}

function ai_move(max_value){
	for (var i = 0; i<15; i++){
		for (var j = 0; j<15; j++){
			if (value[i][j] == max_value) {
				var name = "btn"+i+"-"+j
				document.getElementById(name).style.background="red"; // Red stone
				board[i][j] = current
				board_ai[i][j] = 0 - current
				current = 0 - current
				return
			}
		}
	}
}

/* Get the value gradient */
function computeValue(){
	for (var i = 0; i<15; i++){
		for (var j = 0; j<15; j++){
			if (board[i][j] != 0) {
				value[i][j] = -99999
				continue
			}
			value_a = evaluate(board_ai, i, j)
			value_b = evaluate(board, i, j)
			value[i][j] = (value_a+value_b)/2 + 2/((15/2 - i)*(15/2 - i) + (15/2 - j)*(15/2 - j))
			//value[i][j] = value_a
		}
	}
}

function evaluate(b, x, y){
	if (b[x][y] != 0) {
		return -1;
	}
	var B = new Array(15)
	for (var i = 0; i < 15; i++) {
		B[i] = new Array(15)
		for (var j = 0; j < 15; j++) {
			B[i][j] = b[i][j]
		}
	}
	B[x][y] = 1
	var v = 0
	v += 99999*count(conv2d(B, filter1a), 5)
	v += 99999*count(conv2d(B, filter2a), 5)
	v += 99999*count(conv2d(B, filter3a), 5)
	v += 99999*count(conv2d(B, filter4a), 5)
	v += 5000*count(conv2d(B, filter1b), 4)
	v += 5000*count(conv2d(B, filter2b), 4)
	v += 5000*count(conv2d(B, filter3b), 4)
	v += 5000*count(conv2d(B, filter4b), 4)
	v += 1000*count(conv2d(B, filter1c), 3)
	v += 1000*count(conv2d(B, filter2c), 3)
	v += 1000*count(conv2d(B, filter3c), 3)
	v += 1000*count(conv2d(B, filter4c), 3)
	v += 10*count(conv2d(B, filter1d), 2)
	v += 10*count(conv2d(B, filter2d), 2)
	v += 10*count(conv2d(B, filter3d), 2)
	v += 10*count(conv2d(B, filter4d), 2)
	return v
}

function conv2d(signal, filter){
	/* Output feature map */
	var o = new Array(15)
	for (var i = 0; i < o.length; i++) {
		o[i] = new Array(15)
		for (var j = 0; j < o.length; j++){
			o[i][j] = 0 // initialize the output matrix
		}
	}

	/* Pad the signal matrix to 17x17 */
	var s = new Array(15+4) // padding = 2
	for (var i = 0; i < s.length; i++) {
		s[i] = new Array(15+4)
		for (var j = 0; j < s.length; j++){
			s[i][j] = 0 // initialize the signal matrix
		}
	}
	for (var i = 0; i < 15; i++){
		for (var j = 0; j < 15; j++){
			s[i+2][j+2] = signal[i][j]
		}
	}

	/* "Pad" the filter matrix to 5x5 */
	var f = new Array(5)
	for (var i = 0; i < 5; i++) {
		f[i] = new Array(5)
		for (var j = 0; j < 5; j++){
			f[i][j] = 0 // initialize the filter matrix
		}
	}
	for (var i = 0; i < filter.length; i++){
		for (var j = 0; j < filter.length; j++){
			f[i][j] = filter[i][j]
		}
	}

	/* 2d Convolution Operation */
	var x = 0 // the left-top x position of filter
	var y = 0 // the left-top y position of filter
	for (var i = 0; i < 15; i++){
		x = 0
		for (var j = 0; j < 15; j++) {
			/* dot-products */
			var sum = 0
			for (var a = 0; a < 5; a++){
				for (var b = 0; b < 5; b++){
					sum += (s[x+a][y+b] * f[a][b])
				}
			}
			o[i][j] = sum
			x++
		}
		y++
	}

	return o
}

/* Input is a 15x15 feature map */
function count(feature_map, n){
	var counter = 0
	for (var i = 0; i < 15; i++){
		for (var j = 0; j < 15; j++){
			if (feature_map[i][j] == n) {
				counter++
			}
		}
	}
	return counter
}







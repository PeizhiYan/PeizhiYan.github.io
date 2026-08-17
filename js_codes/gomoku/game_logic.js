var board
var board_ai
var value
var value_human
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

/* Shoulder-aware "three" filters: inner 3 cells weighted 1, the two cells
   just outside each end ("shoulders") weighted 10 (start) and 1000 (end) —
   deliberately DIFFERENT weights, not the same one on both sides. If both
   shoulders used the same weight, a run whose one side is blocked (-1) and
   other side is an extending own-stone (+1) would sum to the same total as
   "both shoulders empty" (-1*w + 1*w = 0), wrongly reading a dead-looking
   run as open. Distinct weights make every (left,right) combination map to
   a unique, non-colliding total:
     innerSum=3, both shoulders empty         -> total     3  (open three)
     innerSum=3, start blocked, end empty     -> total    -7  (half-open)
     innerSum=3, start empty,   end blocked   -> total  -997  (half-open)
     innerSum=3, both shoulders blocked       -> total -1007  (dead three) */
filter1c = new Array(5)
filter1c[0] = [10,0,0,0,0]
filter1c[1] = [0,1,0,0,0]
filter1c[2] = [0,0,1,0,0]
filter1c[3] = [0,0,0,1,0]
filter1c[4] = [0,0,0,0,1000]
filter2c = new Array(5)
filter2c[0] = [0,0,0,0,1000]
filter2c[1] = [0,0,0,1,0]
filter2c[2] = [0,0,1,0,0]
filter2c[3] = [0,1,0,0,0]
filter2c[4] = [10,0,0,0,0]
filter3c = new Array(5)
filter3c[0] = [0,0,0,0,0]
filter3c[1] = [0,0,0,0,0]
filter3c[2] = [10,1,1,1,1000]
filter3c[3] = [0,0,0,0,0]
filter3c[4] = [0,0,0,0,0]
filter4c = new Array(5)
filter4c[0] = [0,0,10,0,0]
filter4c[1] = [0,0,1,0,0]
filter4c[2] = [0,0,1,0,0]
filter4c[3] = [0,0,1,0,0]
filter4c[4] = [0,0,1000,0,0]

/* Shoulder-aware "two" filters: same idea, inner 2 cells weighted 1 each,
   shoulders weighted 10 (start) / 1000 (end):
     innerSum=2, both shoulders empty       -> total    2  (open two)
     innerSum=2, start blocked, end empty   -> total   -8  (half-open)
     innerSum=2, start empty,   end blocked -> total -998  (half-open)
     innerSum=2, both shoulders blocked     -> total -1008 (dead two) */
filter1d = new Array(4)
filter1d[0] = [10,0,0,0]
filter1d[1] = [0,1,0,0]
filter1d[2] = [0,0,1,0]
filter1d[3] = [0,0,0,1000]
filter2d = new Array(4)
filter2d[0] = [0,0,0,1000]
filter2d[1] = [0,0,1,0]
filter2d[2] = [0,1,0,0]
filter2d[3] = [10,0,0,0]
filter3d = new Array(4)
filter3d[0] = [0,0,0,0]
filter3d[1] = [0,0,0,0]
filter3d[2] = [10,1,1,1000]
filter3d[3] = [0,0,0,0]
filter4d = new Array(4)
filter4d[0] = [0,0,10,0]
filter4d[1] = [0,0,1,0]
filter4d[2] = [0,0,1,0]
filter4d[3] = [0,0,1000,0]

/* Shoulder-aware "four" filters: same idea as the "three"/"two" filters
   above, but a 4-in-a-row's window (4 inner + 2 shoulders = 6 cells) is
   wider than the 5x5 canvas conv2d()/padSignal() support, so these use
   the separate conv2dWide()/padSignalWide() path (padding=3, 6x6 canvas)
   defined further down instead. Same asymmetric shoulder weights (10
   start / 1000 end) for the same reason: distinct weights avoid a
   blocked (-1) and an extending own-stone (+1) shoulder cancelling out
   to look like "both empty".
     innerSum=4, both shoulders empty       -> total    4  (open four -- unstoppable: an
                                                             opponent can only block ONE end)
     innerSum=4, start blocked, end empty   -> total   -6  (half-open -- still forces a block)
     innerSum=4, start empty,   end blocked -> total -996  (half-open)
     innerSum=4, both shoulders blocked     -> total -1006 (dead four, can't reach 5) */
filter1e = new Array(6)
filter1e[0] = [10,0,0,0,0,0]
filter1e[1] = [0,1,0,0,0,0]
filter1e[2] = [0,0,1,0,0,0]
filter1e[3] = [0,0,0,1,0,0]
filter1e[4] = [0,0,0,0,1,0]
filter1e[5] = [0,0,0,0,0,1000]
filter2e = new Array(6)
filter2e[0] = [0,0,0,0,0,1000]
filter2e[1] = [0,0,0,0,1,0]
filter2e[2] = [0,0,0,1,0,0]
filter2e[3] = [0,0,1,0,0,0]
filter2e[4] = [0,1,0,0,0,0]
filter2e[5] = [10,0,0,0,0,0]
filter3e = new Array(6)
filter3e[0] = [0,0,0,0,0,0]
filter3e[1] = [0,0,0,0,0,0]
filter3e[2] = [10,1,1,1,1,1000]
filter3e[3] = [0,0,0,0,0,0]
filter3e[4] = [0,0,0,0,0,0]
filter3e[5] = [0,0,0,0,0,0]
filter4e = new Array(6)
filter4e[0] = [0,0,10,0,0,0]
filter4e[1] = [0,0,1,0,0,0]
filter4e[2] = [0,0,1,0,0,0]
filter4e[3] = [0,0,1,0,0,0]
filter4e[4] = [0,0,1,0,0,0]
filter4e[5] = [0,0,1000,0,0,0]


/* initiate the game */
function start(){
	board = new Array(15)
	board_ai = new Array(15)
	value = new Array(15)
	value_human = new Array(15)
	current = 1
	for (var i = 0; i < 15; i++) {
		board[i] = new Array(15)
		board_ai[i] = new Array(15)
		value[i] = new Array(15)
		value_human[i] = new Array(15)
		for (var j = 0; j < 15; j++) {
			/* initialize values */
			board[i][j] = 0
			board_ai[i][j] = 0
			value[i][j] = 0
			value_human[i][j] = 0
		}
	}

	/** Create the GUI */
	/* game board */
	var temp = ""
	for (var i = 0; i < 15; i++){
		for (var j = 0; j < 15; j++){
			temp += "<div class=\"cell\" style=\"position:absolute;"+"left:"+32*j+"px;top:"+32*i+"px; border-radius: 50px; opacity: 0; width:28px;height:28px;padding:0;margin:2px;\" id=\"btn"+i+"-"+j+"\" onclick=\"clk("+i+","+j+")\"></div>"
		}
		//temp += "<br>"
	}
	document.getElementById("board").innerHTML = temp
	/* insight visualization */
	var temp = ""
	for (var i = 0; i < 15; i++){
		for (var j = 0; j < 15; j++){
			temp += "<div <div class=\"cell\" style=\"position:absolute;"+"left:"+32*j+"px;top:"+32*i+"px; opacity: 0.5; width:32px;height:32px;padding:0;margin:0px;\" id=\"val"+i+"-"+j+"\"></div>"
		}
	}
	document.getElementById("value").innerHTML = temp
	computeValue()
	insight()

	/* write to console */
	document.getElementById("console").innerHTML = "Console: \n>>> Game started! "

	document.getElementById("start").innerHTML = "Re-start"
}

/* Insight! Display the value gradient */
function insight(is_ai=false){
	var max_value = 0
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			if (is_ai == false){
				if (value_human[i][j] > max_value) {
					max_value = value_human[i][j] 
				}	
			}
			else{
				if (value[i][j] > max_value) {
					max_value = value_human[i][j] 
				}
			}

		}
	}
	if(is_ai == false){
		var R = 0
		var G = 0
		var B = 0
		for (var i = 0; i < 15; i++) {
			for (var j = 0; j < 15; j++) {
				var scale = parseInt((255)*((value_human[i][j])/(max_value)))
				if (board[i][j] != 0 || board_ai[i][j] != 0){
					R = 0;
					G = 0;
					B = 0;
				}
				else if (scale > 0) {
					R = scale
					//G = 255*scale
					/*
					if (G >= 255) {
						G = 255
						scale -= 255
						R = scale
					}*/
				}
				document.getElementById("val"+i+"-"+j).style.background="#"+toHex(R,G,B);
			}
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
			document.getElementById(name).style.opacity="1.0"; // Black stone
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
			var max_value = insight(is_ai=true) // show the value gradient
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
				document.getElementById(name).style.opacity="1.0"; // White stone
				document.getElementById(name).style.background="white"; // White stone
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
	// AI
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
	// Human
	for (var i = 0; i<15; i++){
		for (var j = 0; j<15; j++){
			if (board_ai[i][j] != 0 || board[i][j] != 0) {
				value_human[i][j] = -99999
				continue
			}
			value_a = evaluate(board, i, j)
			value_b = evaluate(board_ai, i, j)
			value_human[i][j] = (value_a+value_b)/2 + 2/((15/2 - i)*(15/2 - i) + (15/2 - j)*(15/2 - j))
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
	v += fourShoulderScore(B, filter1e) + fourShoulderScore(B, filter2e)
	   + fourShoulderScore(B, filter3e) + fourShoulderScore(B, filter4e)
	v += threeShoulderScore(B, filter1c) + threeShoulderScore(B, filter2c)
	   + threeShoulderScore(B, filter3c) + threeShoulderScore(B, filter4c)
	v += twoShoulderScore(B, filter1d) + twoShoulderScore(B, filter2d)
	   + twoShoulderScore(B, filter3d) + twoShoulderScore(B, filter4d)
	return v
}

/* Score a "four" filter's matches by how open its ends are: an open four
   (both ends empty) is an unstoppable win -- the opponent can only block
   one end -- so it keeps the full weight. A four blocked on one end still
   forces an immediate response but isn't an instant loss, so it's scored
   lower. A dead four (blocked both ends) can never reach 5, so it scores
   0. See the filter1e/etc. comment above for how the target values
   (4 / -6 / -996 / -1006) are derived. Uses conv2dWide() since a 4-cell
   run plus 2 shoulders needs a 6-wide window, wider than conv2d()/
   padSignal() (5x5) support. */
function fourShoulderScore(b, filter){
	var fm = conv2dWide(b, filter)
	return 5000*count(fm, 4) + 2000*(count(fm, -6) + count(fm, -996))
	/* + 0 * count(fm, -1006) dead */
}

/* Score a "three" filter's matches by how open its ends are: a dead three
   (blocked both ends) can never reach 5, so it scores 0 instead of the
   full weight a live open three gets. See the filter1c/etc. comment above
   for how the target values (3 / -7 / -997 / -1007) are derived. */
function threeShoulderScore(b, filter){
	var fm = conv2d(b, filter)
	return 1000*count(fm, 3) + 150*(count(fm, -7) + count(fm, -997))
	/* + 0 * count(fm, -1007) dead */
}

/* Same idea for "two" filters. See filter1d/etc. comment for target values. */
function twoShoulderScore(b, filter){
	var fm = conv2d(b, filter)
	return 10*count(fm, 2) + 3*(count(fm, -8) + count(fm, -998))
	/* + 0 * count(fm, -1008) dead */
}

/* Value of the board as-is (no hypothetical move) for whichever player's
   stones are marked as 1 in b. A completed 5-in-a-row dominates the total. */
function boardValue(b){
	var v = 0
	v += 99999*count(conv2d(b, filter1a), 5)
	v += 99999*count(conv2d(b, filter2a), 5)
	v += 99999*count(conv2d(b, filter3a), 5)
	v += 99999*count(conv2d(b, filter4a), 5)
	v += fourShoulderScore(b, filter1e) + fourShoulderScore(b, filter2e)
	   + fourShoulderScore(b, filter3e) + fourShoulderScore(b, filter4e)
	v += threeShoulderScore(b, filter1c) + threeShoulderScore(b, filter2c)
	   + threeShoulderScore(b, filter3c) + threeShoulderScore(b, filter4c)
	v += twoShoulderScore(b, filter1d) + twoShoulderScore(b, filter2d)
	   + twoShoulderScore(b, filter3d) + twoShoulderScore(b, filter4d)
	return v
}

/* ── conv2d performance caches ──
   The filter arrays (filter1a, filter2b, ...) are a fixed set of constants
   reused on every single call, so there's no need to re-expand each one to
   its nonzero cells on every call -- do it once per filter and keep it.
   This cache is safe because the filter arrays are never mutated after
   their initial definition at the top of this file.

   NOTE: signal (board) padding is intentionally NOT cached here. An
   earlier version cached the padded board keyed by object reference
   (signal === lastSignal), on the assumption that the same array
   reference always means the same content. That held for evaluate(),
   which clones the board before touching it -- but minimax.js mutates
   the live board/board_ai arrays in place (place a trial stone, check,
   undo) to avoid clone overhead per search node, so the same array
   object legitimately holds different content from one call to the
   next. Caching by reference then served stale padded data -- e.g. a
   board that briefly had 5-in-a-row during search got undone, and the
   next unrelated position reused that stale "winning" convolution
   result, causing false win detections. Always re-pad the signal. */
var _filterCache = new Map() // filter array -> [[a,b,weight], ...] nonzero cells only

function sparseFilter(filter){
	var cached = _filterCache.get(filter)
	if (cached) return cached
	var entries = []
	for (var a = 0; a < filter.length; a++)
		for (var b = 0; b < filter.length; b++)
			if (filter[a][b] !== 0) entries.push([a, b, filter[a][b]])
	_filterCache.set(filter, entries)
	return entries
}

function padSignal(signal){
	var s = new Array(15+4) // padding = 2
	for (var i = 0; i < s.length; i++) {
		s[i] = new Array(15+4)
		for (var j = 0; j < s.length; j++){
			s[i][j] = 0
		}
	}
	for (var i = 0; i < 15; i++){
		for (var j = 0; j < 15; j++){
			s[i+2][j+2] = signal[i][j]
		}
	}
	return s
}

function conv2d(signal, filter){
	var s      = padSignal(signal)
	var sparse = sparseFilter(filter)
	var n      = sparse.length

	/* Output feature map -- same x=j,y=i indexing as the original dense
	   version (kept as-is: since only aggregate match counts are ever read
	   back out via count(), not specific (i,j) positions, this axis quirk
	   doesn't affect correctness). Only the multiply-by-zero cells are
	   skipped now, using the filter's precomputed nonzero list. */
	var o = new Array(15)
	for (var i = 0; i < 15; i++){
		o[i] = new Array(15)
		for (var j = 0; j < 15; j++) {
			var sum = 0
			for (var k = 0; k < n; k++){
				sum += s[j + sparse[k][0]][i + sparse[k][1]] * sparse[k][2]
			}
			o[i][j] = sum
		}
	}

	return o
}

/* Wide variant of padSignal()/conv2d() for the filter1e..filter4e "four"
   filters, whose 6-cell window (4 inner + 2 shoulders) doesn't fit the
   5x5 canvas / padding=2 that conv2d() is sized for. Padding=3 gives a
   21x21 padded array, enough room for filters up to 6x6. Uses natural
   i,j indexing (paddedSignal[i+a][j+b]) rather than conv2d()'s legacy
   x=j,y=i quirk -- this is new code, so there's no reason to replicate
   that; either convention is equally correct since only aggregate counts
   are ever read back via count(), never specific (i,j) positions. */
function padSignalWide(signal){
	var s = new Array(15+6) // padding = 3
	for (var i = 0; i < s.length; i++) {
		s[i] = new Array(15+6)
		for (var j = 0; j < s.length; j++){
			s[i][j] = 0
		}
	}
	for (var i = 0; i < 15; i++){
		for (var j = 0; j < 15; j++){
			s[i+3][j+3] = signal[i][j]
		}
	}
	return s
}

function conv2dWide(signal, filter){
	var s      = padSignalWide(signal)
	var sparse = sparseFilter(filter)
	var n      = sparse.length

	var o = new Array(15)
	for (var i = 0; i < 15; i++){
		o[i] = new Array(15)
		for (var j = 0; j < 15; j++) {
			var sum = 0
			for (var k = 0; k < n; k++){
				sum += s[i + sparse[k][0]][j + sparse[k][1]] * sparse[k][2]
			}
			o[i][j] = sum
		}
	}

	return o
}

/* True if b has a completed 5-in-a-row anywhere, for whichever player's
   stones are marked 1 in b. */
function hasFive(b){
	return count(conv2d(b, filter1a), 5) + count(conv2d(b, filter2a), 5)
	     + count(conv2d(b, filter3a), 5) + count(conv2d(b, filter4a), 5) > 0
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

/* Show or hide insight view */
var insight_show = false;
function insight_show_hide(){
	if(insight_show == false){
		insight_show = true;
		document.getElementById('value').style.visibility = 'visible';
	}
	else{
		insight_show = false;
		document.getElementById('value').style.visibility = 'hidden';
	}
}




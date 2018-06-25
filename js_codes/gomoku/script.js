var board
var board_ai
var value
var current

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
			board[i][j] = 1
			board_ai[i][j] = 1
			value[i][j] = 1
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

	/* write to console */
	print(">>> Game started")
}

/* Insight! Display the value gradient */
function insight(){

}

/* Concole write */
function print(x){
	document.getElementById("console").innerHTML = "Console: \n"+x
}

/* Handle button(stone) click events */
function clk(i, j){
	print(">>> Click:" + i + "," + j)
	
}
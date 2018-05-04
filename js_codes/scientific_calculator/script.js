function e() {
	document.getElementById("result").innerHTML = "e="+Math.E
}

function pi() {
	document.getElementById("result").innerHTML = "PI="+Math.PI
}

function toX() {
	var result = document.getElementById("result").innerHTML
	document.getElementById("textInput1").value = result.split("=")[1]
}

function toY() {
	var result = document.getElementById("result").innerHTML
	document.getElementById("textInput2").value = result.split("=")[1]
}

function clearX() {
	document.getElementById("textInput1").value = ""
}

function clearY() {
	document.getElementById("textInput2").value = ""
}

function clearAll() {
	document.getElementById("textInput1").value = ""
	document.getElementById("textInput2").value = ""
	document.getElementById("result").innerHTML = "RESULT"
}

/* Logs */
function log() {
	var x = document.getElementById("textInput1").value
	document.getElementById("result").innerHTML = "ln("+x+")="+Math.log(x)
}

function logxy() {
	var x = document.getElementById("textInput1").value
	var y = document.getElementById("textInput2").value
	document.getElementById("result").innerHTML = "log"+x+"("+y+")="+(Math.log(y)/Math.log(x))
}

function log2() {
	var x = document.getElementById("textInput1").value
	document.getElementById("result").innerHTML = "log2("+x+")="+(Math.log(x)/Math.log(2))
}

function log10() {
	var x = document.getElementById("textInput1").value
	document.getElementById("result").innerHTML = "lg("+x+")="+(Math.log(x)/Math.log(10))
}

/* Basics */
function add() {
	var x = document.getElementById("textInput1").value
	var y = document.getElementById("textInput2").value
	var z = Number(x)+Number(y)
	document.getElementById("result").innerHTML = x+"+"+y+"="+z
}

function sub() {
	var x = document.getElementById("textInput1").value
	var y = document.getElementById("textInput2").value
	var z = Number(x)-Number(y)
	document.getElementById("result").innerHTML = x+"-"+y+"="+z
}

function mul() {
	var x = document.getElementById("textInput1").value
	var y = document.getElementById("textInput2").value
	var z = Number(x)*Number(y)
	document.getElementById("result").innerHTML = x+"*"+y+"="+z
}

function div() {
	var x = document.getElementById("textInput1").value
	var y = document.getElementById("textInput2").value
	var z = Number(x)/Number(y)
	document.getElementById("result").innerHTML = x+"/"+y+"="+z
}

/* Triangular */
function sin(){
	var x = document.getElementById("textInput1").value
	document.getElementById("result").innerHTML = "sin("+x+")="+Math.sin(x)
}

function cos(){
	var x = document.getElementById("textInput1").value
	document.getElementById("result").innerHTML = "cos("+x+")="+Math.cos(x)
}

function tan(){
	var x = document.getElementById("textInput1").value
	document.getElementById("result").innerHTML = "tan("+x+")="+Math.tan(x)
}

function radian(){
	var y = document.getElementById("textInput2").value
	document.getElementById("textInput1").value = Number(180)*(Number(y)/Number(Math.PI))
}

function degree(){
	var x = document.getElementById("textInput1").value
	document.getElementById("textInput2").value = Number(Math.PI)*(Number(x)/Number(180))
}

/* Exps */
function sqrt() {
	var x = document.getElementById("textInput1").value
	document.getElementById("result").innerHTML = "sqrt("+x+")="+Math.sqrt(x)
}

function root3() {
	var x = document.getElementById("textInput1").value
	document.getElementById("result").innerHTML = "("+x+")^(1/3)="+Math.pow(x,1/3)
}

function square() {
	var x = document.getElementById("textInput1").value
	document.getElementById("result").innerHTML = "("+x+")^2="+Math.pow(x,2)
}

function cube() {
	var x = document.getElementById("textInput1").value
	document.getElementById("result").innerHTML = "("+x+")^3="+Math.pow(x,3)
}

function pow() {
	var x = document.getElementById("textInput1").value
	var y = document.getElementById("textInput2").value
	document.getElementById("result").innerHTML = "("+x+")^"+y+"="+Math.pow(x,y)
}

/* Others */
function rand() {
	var x = document.getElementById("textInput1").value
	var y = document.getElementById("textInput2").value
	var min = Math.min(x,y)
	var max = Math.max(x,y)
	document.getElementById("result").innerHTML = "rand["+min+","+max+"]="+ (Number(min)+Math.random()*(Number(max)-Number(min)))
}

function randint() {
	var x = document.getElementById("textInput1").value
	var y = document.getElementById("textInput2").value
	var min = Math.min(x,y)
	var max = Math.max(x,y)
	document.getElementById("result").innerHTML = "randint["+min+","+max+"]="+ Math.round((Number(min)+Math.random()*(Number(max)-Number(min))))
}

/* Base Converter */
function dec2bin() {
	var x = document.getElementById("textInput1").value
	var tmp = x
	var result = ''
	while(parseInt(tmp/2) >= 1){
		result = result + tmp%2
		tmp = parseInt(tmp/2)
	}
	if (tmp == 1) {
		result = result + '1'
	}
	else{
		result = result + '0'
	}
	var tmp = ''
	for (var i = result.length-1; i >= 0; i--) {
		tmp = tmp + result.charAt(i)
	}
	document.getElementById("result").innerHTML = x+"(dec)="+tmp+"(bin)"
}

function dec2oct() {
	var x = document.getElementById("textInput1").value
	x = parseInt(x)
	document.getElementById("result").innerHTML = x+"(dec)="+x.toString(8)+"(oct)"
}

function dec2hex() {
	var x = document.getElementById("textInput1").value
	x = parseInt(x)
	document.getElementById("result").innerHTML = x+"(dec)="+x.toString(16).toUpperCase()+"(oct)"
}

function bin2dec() {
	var x = document.getElementById("textInput1").value
	document.getElementById("result").innerHTML = x+"(bin)="+parseInt(x.toString(),2)+"(dec)"
}

function bin2oct() {
	var x = document.getElementById("textInput1").value
	var tmp = parseInt(x.toString(),2)
	document.getElementById("result").innerHTML = x+"(bin)="+tmp.toString(8)+"(oct)"
}

function bin2hex() {
	var x = document.getElementById("textInput1").value
	var tmp = parseInt(x.toString(),2)
	document.getElementById("result").innerHTML = x+"(bin)="+tmp.toString(16)+"(hex)"
}

function hex2dec() {
	var x = document.getElementById("textInput1").value
	document.getElementById("result").innerHTML = x+"(hex)="+parseInt(x.toString(),16)+"(dec)"
}

function hex2oct() {
	var x = document.getElementById("textInput1").value
	var tmp = parseInt(x.toString(),16)
	document.getElementById("result").innerHTML = x+"(hex)="+tmp.toString(8)+"(oct)"
}

function hex2bin() {
	var x = document.getElementById("textInput1").value
	var tmp = parseInt(x.toString(),16)
	document.getElementById("result").innerHTML = x+"(hex)="+tmp.toString(2)+"(bin)"
}
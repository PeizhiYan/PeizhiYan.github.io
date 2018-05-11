// m1:[r1 x c1]; m2:[r2 x c2]
var r1 = 0
var c1 = 0
var r2 = 0
var c2 = 0
var m1 = 0
var m2 = 0

function matrixRow(m) {
	var tmp = m.split('\n')
	return tmp.length
}

function matrixCol(m) {
	var tmp1 = m.split('\n')
	var tmp2 = tmp1[0].split(',')
	return tmp2.length
}

function readMatrices() {
	var x = document.getElementById("matrix1").value
	var y = document.getElementById("matrix2").value

	r1 = matrixRow(x)
	c1 = matrixCol(x)
	r2 = matrixRow(y)
	c2 = matrixCol(y)

	m1 = new Array(r1*c1)
	var tmp = x.split('\n')
	var k = 0
	for (var i = 0; i < tmp.length; i++) {
		var tmp2 = tmp[i].split(',')
		for (var j = 0; j < tmp2.length; j++) {
			m1[k] = tmp2[j]
			k++
		}
	}

	m2 = new Array(r2*c2)
	tmp = y.split('\n')
	k = 0
	for (var i = 0; i < tmp.length; i++) {
		var tmp2 = tmp[i].split(',')
		for (var j = 0; j < tmp2.length; j++) {
			m2[k] = tmp2[j]
			k++
		}
	}

	//document.getElementById("output").innerHTML = m2.length
}

function m1_at(r, c) {
	return Number(r*c1) + Number(c) 
}

function m2_at(r, c) {
	return Number(r*c2) + Number(c) 
}

function mul() {
	
	readMatrices()

	if (c1 != r2) {
		document.getElementById("output").innerHTML = "ERROR"
		return 0
	}

	var result = ""
	var i = 0
	for (; i < r1; i++) {
		var j = 0
		for (; j < c2; j++) {
			var sum = 0
			var k = 0
			for (; k < c1; k++) {
				sum = Number(sum) + (Number(m1[m1_at(i,k)]) * Number(m2[m2_at(k,j)]))
			}
			if (j != c2-1) {
				result = result + sum + ","
			}
			else{
				result = result + sum
			}
		}
		if (i != r1-1) {
			result = result + "\n"
		}
	}

	document.getElementById("sign").innerHTML = "*"
	document.getElementById("output").value = result
}

function add() {
	
	readMatrices()

	if (r1 != r2 || c1 != c2) {
		document.getElementById("output").innerHTML = "ERROR"
		return 0
	}

	var result = ""
	var i = 0
	for (; i < r1; i++) {
		var j = 0
		for (; j < r2; j++) {
			var sum = (Number(m1[m1_at(i,j)]) + Number(m2[m2_at(i,j)]))
			if (j != r2-1) {
				result = result + sum + ","
			}
			else{
				result = result + sum
			}
		}
		if (i != r1-1) {
			result = result + "\n"
		}
	}

	document.getElementById("sign").innerHTML = "+"
	document.getElementById("output").value = result
}

function sub() {
	
	readMatrices()

	if (r1 != r2 || c1 != c2) {
		document.getElementById("output").innerHTML = "ERROR"
		return 0
	}

	var result = ""
	var i = 0
	for (; i < r1; i++) {
		var j = 0
		for (; j < r2; j++) {
			var sum = (Number(m1[m1_at(i,j)]) - Number(m2[m2_at(i,j)]))
			if (j != r2-1) {
				result = result + sum + ","
			}
			else{
				result = result + sum
			}
		}
		if (i != r1-1) {
			result = result + "\n"
		}
	}

	document.getElementById("sign").innerHTML = "-"
	document.getElementById("output").value = result
}

function reshape() {
	var x = document.getElementById("matrix").value
	var r = matrixRow(x)
	var c = matrixCol(x)
	m = new Array(r*c)
	var tmp = x.split('\n')
	var k = 0
	for (var i = 0; i < tmp.length; i++) {
		var tmp2 = tmp[i].split(',')
		for (var j = 0; j < tmp2.length; j++) {
			m[k] = tmp2[j]
			k++
		}
	}
	var new_r = document.getElementById("new_row").value
	var new_c = document.getElementById("new_col").value
	var output = ""
	var k = 0
	for (var i = 0; i < new_r; i++) {
		for (var j = 0; j < new_c; j++) {
			output = output + m[k]
			if (j != new_c-1) {
				output = output + ","
			}
			k++
		}
		if (i != new_r-1) {
			output = output + "\n"
		}
	}
	document.getElementById("new_matrix").value = output
}

function get_tf(){
	return tf;
}

function max(a,b){
	if(a>b){
		return a
	} 
	return b
}

function Array2d(r, c){
	var tmp = new Array(r)
	for(x = 0; x < r; x++){
		tmp[x] = new Array(c)
		for(y = 0; y < c; y++){
			tmp[x][y] = 0
		}
	}
	return tmp
}

function dump2d(a){
	print("[")
	for(x = 0; x < a.length; x++){
		for(y = 0; y < a[0].length; y++){
			if(x == a.length-1 && y == a[0].length-1)
				print(a[x][y])
			else
				print(a[x][y]+",\t")
		}
		if(x == a.length-1)
			print("]\n")
		else
			print("\n")
	}
}
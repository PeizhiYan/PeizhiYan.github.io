var picked_R = 0
var picked_G = 0
var picked_B = 0

function generate(){
	var step = document.getElementById("step").value
	step = parseInt(step)
	var R = 255
	var G = 0
	var B = 0
	var chart = ""
	/* Blue: from 0 to 255 */
	while(B<255){
		chart = chart + " <button class=\"button\" style=\"background-color: #"+toHex(R,G,B)+"\" onclick=\"pick("+R+","+G+","+B+")\"> </button>"
		B = B + step
		if (B > 255) {
			B = 255
		}
	}
	/* Red: from 255 to 0 */
	while(R>0){
		chart = chart + " <button class=\"button\" style=\"background-color: #"+toHex(R,G,B)+"\" onclick=\"pick("+R+","+G+","+B+")\"> </button>"
		R = R - step
		if (R < 0) {
			R = 0
		}
	}
	/* Green: from 0 to 255 */
	while(G<255){
		chart = chart + " <button class=\"button\" style=\"background-color: #"+toHex(R,G,B)+"\" onclick=\"pick("+R+","+G+","+B+")\"> </button>"
		G = G + step
		if (G > 255) {
			G = 255
		}
	}
	/* Blue: from 255 to 0 */
	while(B>0){
		chart = chart + " <button class=\"button\" style=\"background-color: #"+toHex(R,G,B)+"\" onclick=\"pick("+R+","+G+","+B+")\"> </button>"
		B = B - step
		if (B < 0) {
			B = 0
		}
	}
	/* Red: from 0 to 255 */
	while(R<255){
		chart = chart + " <button class=\"button\" style=\"background-color: #"+toHex(R,G,B)+"\" onclick=\"pick("+R+","+G+","+B+")\"> </button>"
		R = R + step
		if (R > 255) {
			R = 255
		}
	}
	/* Green: from 255 to 0 */
	while(G>0){
		chart = chart + " <button class=\"button\" style=\"background-color: #"+toHex(R,G,B)+"\" onclick=\"pick("+R+","+G+","+B+")\"> </button>"
		G = G - step
		if (G < 0) {
			G = 0
		}
	}

	chart = "<hr>" + chart

	/* Gray scale: Black ->> White */
	R = 255
	G = 255
	B = 255
	while(R>0){
		chart = " <button class=\"button\" style=\"background-color: #"+toHex(R,G,B)+"\" onclick=\"pick("+R+","+G+","+B+")\"> </button>" + chart
		R = R - step
		if (R < 0) {R = 0}
		G = R
		B = R
	}
	document.getElementById("color_chart").innerHTML = chart
}

function decrease(a){
	if (a>0) {
		return a-1
	}
	else 
		return a
}

function increase(a){
	if (a<255) {
		return a+1
	}
	else 
		return a
}

function tuning(){
	var R = picked_R
	var G = picked_G
	var B = picked_B
	var chart = ""
	while(R <= 255 && G <= 255 && B<= 255){
		chart = chart + " <button class=\"button\" style=\"background-color: #"+toHex(R,G,B)+"\" onclick=\"pick("+R+","+G+","+B+")\"> </button>"
		R=increase(R)
		G=increase(G)
		B=increase(B)
		if (R == 255 && G == 255 && B== 255) {
			break
		}
	}
	R = picked_R
	G = picked_G
	B = picked_B
	while(R >=0 && G >=0 && B>=0){
		chart = " <button class=\"button\" style=\"background-color: #"+toHex(R,G,B)+"\" onclick=\"pick("+R+","+G+","+B+")\"> </button>" + chart
		R=decrease(R)
		G=decrease(G)
		B=decrease(B)
		if (R == 0 && G == 0 && B== 0) {
			break
		}
	}
	
	document.getElementById("tuning").innerHTML = chart
}

function pick(r, g, b){
	var tmp = "RGB="
	tmp = tmp + r + "," + g + "," + b + "    #" + toHex(r,g,b)
	picked_R = r
	picked_G = g
	picked_B = b
	document.getElementById("picked").innerHTML = tmp
	tuning()
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
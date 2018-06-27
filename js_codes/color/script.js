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

function pick(r, g, b){
	var tmp = "RGB="
	tmp = tmp + r + "," + g + "," + b + "    #" + toHex(r,g,b)
	document.getElementById("picked").innerHTML = tmp
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
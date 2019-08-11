////////////////////////////////////////////////////////////////////
////// Utility functions
//////////////////////////////////////////////////////////

// sleep function
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
        break;
        }
    }
}

// Euclidean distance
function distance(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}




// move toolbar to the left side
function toolbar_left() {
    document.getElementById("color-container").style.left = "0px";
    document.getElementById("tool-container").style.left = "0px";
    document.getElementById("palette").style.left = "80px";
    document.getElementById("color-container").style.right = "";
    document.getElementById("tool-container").style.right = "";
}
// move toolbar to the right side
function toolbar_right() {
    document.getElementById("color-container").style.left = "";
    document.getElementById("tool-container").style.left = "";
    document.getElementById("palette").style.left = "-260px";
    document.getElementById("color-container").style.right = "0px";
    document.getElementById("tool-container").style.right = "0px";
}





TOOL_IDs = ["pen","curve-pen","drag","eraser","roll"];
function highlight_tool(tool_id) {
    for (i=0; i<TOOL_IDs.length; i++){
        document.getElementById(TOOL_IDs[i]).style.color = "gray";
    }
    document.getElementById(tool_id).style.color = "black";
}

function tool1_inuse() {
    drag_lock = false;
    highlight_tool("pen");
}

function tool2_inuse() {
    drag_lock = false;
    highlight_tool("curve-pen");
}

function tool3_inuse() {
    drag_lock = false;
    highlight_tool("eraser");
}

function tool4_inuse() {
    drag_lock = false;
    highlight_tool("roll");
}

function drag_canvas() {
    drag_lock = true;
    highlight_tool("drag");
}

var palette_visible = false;
function palette() {
    drag_lock = false;
    if (palette_visible){
        document.getElementById("palette").style.visibility = "hidden";
        palette_visible = false;
    }
    else{
        document.getElementById("palette").style.visibility = "visible";
        palette_visible = true;
    }
}




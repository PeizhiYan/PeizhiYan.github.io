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

// log for any base
function log(base, n) {
    return Math.log10(n)/Math.log10(base);
}



// move toolbar to the left side
function toolbar_left() {
    document.getElementById("color-container").style.left = "0px";
    document.getElementById("tool-container").style.left = "0px";
    document.getElementById("palette").style.left = "80px";
    document.getElementById("setting_menu").style.left = "80px";
    document.getElementById("pen_setting").style.left = "80px";
    document.getElementById("brush_1_setting").style.left = "80px";
    document.getElementById("color-container").style.right = "";
    document.getElementById("tool-container").style.right = "";
}
// move toolbar to the right side
function toolbar_right() {
    document.getElementById("color-container").style.left = "";
    document.getElementById("tool-container").style.left = "";
    document.getElementById("palette").style.left = "-260px";
    document.getElementById("setting_menu").style.left = "-260px";
    document.getElementById("pen_setting").style.left = "-260px";
    document.getElementById("brush_1_setting").style.left = "-260px";
    document.getElementById("color-container").style.right = "0px";
    document.getElementById("tool-container").style.right = "0px";
}




DRAW_TOOLS = ["pen","brush_1","roll"];
TOOL_IDs = ["pen","brush_1","drag","eraser","roll"];
function highlight_tool(tool_id) {
    for (i=0; i<TOOL_IDs.length; i++){
        document.getElementById(TOOL_IDs[i]).style.color = "gray";
    }
    flag = false;
    for (i=0; i<DRAW_TOOLS.length; i++){
        if (tool_id == DRAW_TOOLS[i]){
            flag = true;
        }
    }
    if (flag){
        document.getElementById(tool_id).style.color = document.getElementById("palette_icon").style.color;
    }
    else{
        document.getElementById(tool_id).style.color = "black";
    }
}

function highlight_tool_auto() {
    for (i=0; i<DRAW_TOOLS.length; i++){
        if (document.getElementById(DRAW_TOOLS[i]).style.color != "gray") {
            document.getElementById(DRAW_TOOLS[i]).style.color = document.getElementById("palette_icon").style.color;
            break;
        }
    }
}

function tool1_inuse() {
    drag_lock = false;
    if (document.getElementById("pen").style.color != "gray") {
        if (document.getElementById("pen_setting").style.visibility == "hidden") {
            document.getElementById("pen_setting").style.visibility = "visible";
        }
        else{
            document.getElementById("pen_setting").style.visibility = "hidden";
        }
    }
    else {
        document.getElementById("brush_1_setting").style.visibility = "hidden";
    }
    highlight_tool("pen");
}

function tool2_inuse() {
    drag_lock = false;
    if (document.getElementById("brush_1").style.color != "gray") {
        if (document.getElementById("brush_1_setting").style.visibility == "hidden") {
            document.getElementById("brush_1_setting").style.visibility = "visible";
        }
        else{
            document.getElementById("brush_1_setting").style.visibility = "hidden";
        }
    }
    else {
        document.getElementById("brush_1_setting").style.visibility = "hidden";
    }
    highlight_tool("brush_1");
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

var setting_menu_visible = false;
function setting_menu() {
    drag_lock = false;
    if (setting_menu_visible){
        document.getElementById("setting_menu").style.visibility = "hidden";
        setting_menu_visible = false;
    }
    else{
        document.getElementById("setting_menu").style.visibility = "visible";
        setting_menu_visible = true;
    }
}

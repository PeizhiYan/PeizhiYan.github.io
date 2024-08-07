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
    document.getElementById("layer_group").style.left = "80px";
    document.getElementById("layer_setting").style.left = "165px";
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
    document.getElementById("layer_group").style.left = "-85px";
    document.getElementById("layer_setting").style.left = "-210px";
    document.getElementById("color-container").style.right = "0px";
    document.getElementById("tool-container").style.right = "0px";
}




DRAW_TOOLS = ["pen","brush_1","roll","circle"];
TOOL_IDs = ["pen","brush_1","drag","eraser","roll","circle"];
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

function hide_all_menus() {
    document.getElementById("pen_setting").style.visibility = "hidden";
    document.getElementById("brush_1_setting").style.visibility = "hidden";
    document.getElementById("palette").style.visibility = "hidden";
    document.getElementById("layer_setting").style.visibility = "hidden";
    document.getElementById("layer_group").style.visibility = "hidden";
}


var circle_mode = 0; // 0: not inuse, 1: circle, 2: inverted circle

function tool1_inuse() {
    drag_lock = false;
    if (document.getElementById("pen").style.color != "gray") {
        if (document.getElementById("pen_setting").style.visibility == "hidden") {
            //hide_all_menus();
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
    circle_mode = 0;
}

function tool2_inuse() {
    drag_lock = false;
    if (document.getElementById("brush_1").style.color != "gray") {
        if (document.getElementById("brush_1_setting").style.visibility == "hidden") {
            //hide_all_menus();
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
    circle_mode = 0;
}

function tool3_inuse() {
    drag_lock = false;
    highlight_tool("eraser");
    circle_mode = 0;
}

function tool4_inuse() {
    drag_lock = false;
    highlight_tool("roll");
    circle_mode = 0;
}

function tool5_inuse() {
    drag_lock = false;
    highlight_tool("circle");
    if (circle_mode == 0) {
        circle_mode = 1;
        document.getElementById("circle").innerHTML = '';
    }
    else if (circle_mode == 1) {
        circle_mode = 2; // inverse circle
        document.getElementById("circle").innerHTML = '/';
    }
    else if (circle_mode == 2) {
        circle_mode = 1;
        document.getElementById("circle").innerHTML = '';
    }
}


function drag_canvas() {
    drag_lock = true;
    highlight_tool("drag");
}

var palette_visible = false;
function palette() {
    drag_lock = false;
    if (palette_visible){
        //hide_all_menus();
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
        //hide_all_menus();
        document.getElementById("setting_menu").style.visibility = "hidden";
        setting_menu_visible = false;
    }
    else{
        document.getElementById("setting_menu").style.visibility = "visible";
        setting_menu_visible = true;
    }
}

var layers_visible = false;
function layers() {
    drag_lock = false;
    if (layers_visible){
        //hide_all_menus();
        document.getElementById("layer_group").style.visibility = "hidden";
        document.getElementById("layer_setting").style.visibility = "hidden";
        layers_visible = false;
        document.getElementById('layers').style.color = 'gray';
    }
    else{
        document.getElementById("layer_group").style.visibility = "visible";
        document.getElementById("layer_setting").style.visibility = "visible";
        layers_visible = true;
        document.getElementById('layers').style.color = 'black';
    }
}

function highlight_layer(layer_idx) {
    document.getElementById('layer1').style.backgroundColor = 'lightgray';
    document.getElementById('layer2').style.backgroundColor = 'lightgray';
    document.getElementById('layer3').style.backgroundColor = 'lightgray';
    document.getElementById('layer4').style.backgroundColor = 'lightgray';
    document.getElementById('layer5').style.backgroundColor = 'lightgray';
    document.getElementById('layer6').style.backgroundColor = 'lightgray';
    document.getElementById('layer7').style.backgroundColor = 'lightgray';
    document.getElementById('layer8').style.backgroundColor = 'lightgray';
    document.getElementById('layer9').style.backgroundColor = 'lightgray';
    document.getElementById('layer'+layer_idx).style.backgroundColor = 'lightslategray';
}



// print function: for debugging
function print(msg) {
    document.getElementById("output").innerHTML = msg;
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

////////////////////////////////////////////////////////////////////
////// Main code
//////////////////////////////////////////////////////////

paper.install(window);
// Keep global references to both tools, so the HTML
// links below can access them.
var tool1, tool2, tool3, tool4;
var canvas, context;
let STACK_SIZE = 20; // maximum 20 paths
let path_stack = []; // paths are saved in here
let redo_stack = []; // removed paths are saved in here
var view_center; // the origin of the view coordinate
var current_color = "#000000";
var opacity = "FF"; // from 0 to 255
var frequent_color_pointer = 0; // 8 frequently used colors
var smooth_rate = 5; // smooth the path
var brush_1_size = 5;
var brush_1_layer; // only store the path created by brush_1

window.onload = function() {
    paper.setup('myCanvas');
    canvas = document.getElementById('myCanvas');
    var context = canvas.getContext("2d");
    var path;

    view_center = view.center; // get the center of the view
    view.center = view_center; // do not remove this line !!!
    view_zoom = view.zoom; // get the view zoom factor
    view.zoom = view_zoom; // do not remove this line !!!
    current_color = "#000000";
    brush_1_layer = new Layer();

    ///////////////////////////////////////////////////////////////////
    ////// support mobile device's touch screen: Zoom and/or Scroll
    draw_lock = false; // when it's true, not draw anything
    move_lock = false;
    zoom_lock = false;
    var prev_distance = 0;
    var current_distance = 0;
    var prev_X = -1;
    var prev_Y = -1;
    var prev_x0 = -1;
    var prev_x1 = -1;
    var prev_y0 = -1;
    var prev_y1 = -1;
    function touch_screen(event) {
        if (event.touches[1] != undefined && event.touches[2] != undefined) {
            draw_lock = true;
            // Move with three fingers
            if (prev_X == -1){
                prev_X = event.touches[0].clientX;
                prev_Y = event.touches[0].clientY;
            }
            else {
                view_center.x -= (event.touches[0].clientX - prev_X)/view_zoom; // the reason of divide by "view_zoom" is to control the move speed
                view_center.y -= (event.touches[0].clientY - prev_Y)/view_zoom; // the reason of divide by "view_zoom" is to control the move speed
                view.center = view_center;
                prev_X = event.touches[0].clientX;
                prev_Y = event.touches[0].clientY;
            }
        }
        else if (event.touches[1] != undefined) {
            // Move with two fingers 
            draw_lock = true; // lock: cannot draw
            var x1 = event.touches[1].clientX;
            if (prev_distance == 0){
                prev_distance = distance(event.touches[0].clientX, event.touches[0].clientY, event.touches[1].clientX, event.touches[1].clientY)
                prev_X = event.touches[0].clientX;
                prev_Y = event.touches[0].clientY;
                prev_x0 = event.touches[0].clientX;
                prev_x1 = event.touches[1].clientX;
                prev_y0 = event.touches[0].clientY;
                prev_y1 = event.touches[1].clientY;
            }
            
            current_distance = distance(event.touches[0].clientX, event.touches[0].clientY, event.touches[1].clientX, event.touches[1].clientY)
            scale_ratio = (current_distance/prev_distance);
            if (scale_ratio >= 0.7 && scale_ratio <= 1.4 && move_lock == false) {
                view_center.x -= (event.touches[0].clientX - prev_X)/view_zoom;
                view_center.y -= (event.touches[0].clientY - prev_Y)/view_zoom;
                view.center = view_center;
                prev_X = event.touches[0].clientX;
                prev_Y = event.touches[0].clientY;
            }
            else {
                move_lock = true;
                // Zoom with two fingers
                ////////////////print("prev distance: "+prev_distance)
                current_distance = distance(event.touches[0].clientX, event.touches[0].clientY, event.touches[1].clientX, event.touches[1].clientY)
                scale_ratio = (current_distance/prev_distance);

                // Zoom in
                if (scale_ratio > 1.4) {
                    zoom_rate = 0.2*(1-log(20,view.zoom));
                    view_zoom += zoom_rate;
                }
                // Zoom out
                else if (scale_ratio < 0.7){
                    zoom_rate = 0.8*log(10,view.zoom)
                    view_zoom -= zoom_rate;
                }

                if (view_zoom <= 1){
                    view_zoom = 1; // minimum zoom factor
                }
                else if (view_zoom >= 15.5){
                    view_zoom = view.zoom; // maximum zoom factor
                }
                view.zoom = view_zoom;
                //print(view_zoom)
            }
            
        }
    }
    canvas.addEventListener("touchmove", touch_screen);
    var not_add_path = false;
    function touch_end(event){
        if (drag_lock == true || move_lock == true) {
            not_add_path = true;
        }
        draw_lock = false; // unlock: can draw
        move_lock = false;
        zoom_lock = false;
        prev_distance = 0; // reset the distance register
        prev_X = -1;
        prev_Y = -1;
        prev_x0 = -1;
        prev_x1 = -1;
        prev_y0 = -1;
        prev_y1 = -1;
        //print("touch stop")
    }
    canvas.addEventListener("touchend", touch_end);
    ///// end of touch screen optimization
    /////////////////////////////////////////////////////////////////////////////////
    

    ///////////////////////////////////////////////////////////////////
    ////// support desktop browser, mouse wheel button
    var myitem = canvas;
    if (myitem.addEventListener) {
        // IE9, Chrome, Safari, Opera
        myitem.addEventListener("mousewheel", MouseWheelHandler, false);
        // Firefox
        myitem.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
    }
    // IE 6/7/8
    else{myitem.attachEvent("onmousewheel", MouseWheelHandler);}
    function MouseWheelHandler(e) {
        // cross-browser wheel delta
        var e = window.event || e; // old IE support
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if (delta == 1){
            view_zoom += 0.07; // zoom in
        }
        else if (delta == -1){
            if (view_zoom - 0.07 > 0.2){
                view_zoom -= 0.07; // zoom out
            }
        }
        view.zoom = view_zoom;
        return false;
    }
    drag_lock = false;
    function move_canvas(currentX, currentY) {
        view_center.x -= (currentX - prev_X);//view_zoom; // the reason of divide by "view_zoom" is to control the move speed
        view_center.y -= (currentY - prev_Y);///view_zoom; // the reason of divide by "view_zoom" is to control the move speed
        view.center = view_center;
    }







    // sharable mouseDown event:
    function onMouseDown(event) {
        //console.log(event)
        //sleep(10);
        if (draw_lock == false && drag_lock == false){
            path = new Path();
            path.strokeColor = current_color+opacity;
            path.add(event.point);
        }
        if (drag_lock) {
            prev_X = event.point.x;
            prev_Y = event.point.y;
        }
    }


    // sharable mouseUp event:
    function onMouseUp(event) {
        if (not_add_path == false && path.length > 0) {
            path.simplify(smooth_rate); // smooth the path
            path_raster = path.rasterize(); // rasterize the path
            path.remove(); // remove the original vector path
            delete path;

            path_stack.push(path_raster); // store the path to path_stack
            if (path_stack.length > STACK_SIZE) {
                path_stack.shift()
            }
            //console.log("stack:"+path_stack.length);
        }
        else {
            prev_X = -1;
            prev_Y = -1;
        }
        not_add_path = false;
    }
    
    // This is normal pen
    tool1 = new Tool();
    tool1.onMouseDown = onMouseDown;
    tool1.onMouseUp = onMouseUp;
    tool1.onMouseDrag = function(event) {
        if (draw_lock == false && drag_lock == false){
            path.add(event.point);
        }
        else if (drag_lock){
            move_canvas(event.point.x, event.point.y);
        }
    }





    // This is brush-1
    tool2 = new Tool();
    var paths = [];
    tool2.onMouseDown = function(event) {
        if (draw_lock == false && drag_lock == false){
            paths = [];
            for (i=0;i<brush_1_size;i++){
                p = new Path();
                p.strokeColor = current_color+ to_hex(parseInt(parseInt(opacity,16)/20));
                p.shadowBlur = 3;
                p.strokeWidth = Math.log(brush_1_size+1)*3;
                calculated_x = event.point.x + (i-brush_1_size/2)*p.strokeWidth/3 + 0.5*(0.5-Math.random());
                calculated_y = event.point.y + 0.5*Math.random();
                p.add(new Point(calculated_x, calculated_y))
                paths.push(p);
            }
        }
        if (drag_lock) {
            prev_X = event.point.x;
            prev_Y = event.point.y;
        }
    }
    tool2.onMouseUp = function(event) {
        if (not_add_path == false && paths[0].length > 0) {
            //paths_raster = []
            for (i=0;i<brush_1_size;i++){
                p = paths[i];
                p.simplify(smooth_rate); // smooth the path
                //path_raster = p.rasterize(); // rasterize the path
                //paths_raster.push(path_raster);
                //p.remove(); // remove the original vector path
                //delete p;
                //brush_1_layer.addChild(path_raster);
            }

            //if (brush_1_layer.children.length >= 100) {
            //    brush_1_layer.rasterize();
            //    brush_1_layer.opacity = 0.7;
            //    brush_1_layer = new Layer();
            //}
            
            //path_stack.push(paths_raster); // store the path to path_stack      
            path_stack.push(paths)
            if (path_stack.length > STACK_SIZE) {
                path_stack.shift()
            }
        }
        else {
            prev_X = -1;
            prev_Y = -1;
        }
        not_add_path = false;
    }
    tool2.onMouseDrag = function(event) {
        if (draw_lock == false && drag_lock == false){
            for (i=0;i<brush_1_size;i++){
                p = paths[i];
                calculated_x = event.point.x + (i-brush_1_size/2)*p.strokeWidth/3 + 0.1*(0.5-Math.random());
                calculated_y = event.point.y + 0.1*Math.random();
                p.add(new Point(calculated_x, calculated_y))
            }
        }
        else if (drag_lock){
            move_canvas(event.point.x, event.point.y);
        }
    }
    





    // This is eraser
    tool3 = new Tool();
    tool3.onMouseDown = function onMouseDown(event) {
        if (draw_lock == false && drag_lock == false){
            path = new Path();
            path.strokeColor = "white";
            path.strokeWidth = 9; 
            path.add(event.point);
        }
        if (drag_lock) {
            prev_X = event.point.x;
            prev_Y = event.point.y;
        }
    }
    tool3.onMouseUp = onMouseUp;
    tool3.onMouseDrag = function(event) {
        if (draw_lock == false && drag_lock == false){
            path.add(event.point);
        }
        else if (drag_lock){
            move_canvas(event.point.x, event.point.y);
        }
    }

    // This is roll-filling tool
    tool4 = new Tool();
    tool4.onMouseDown = function onMouseDown(event) {
        if (draw_lock == false && drag_lock == false){
            path = new Path();
            path.strokeColor = current_color + opacity;
            path.strokeWidth = 0.5; 
            path.add(event.point);
            path.fillColor = current_color + opacity;
        }
        if (drag_lock) {
            prev_X = event.point.x;
            prev_Y = event.point.y;
        }
    }
    tool4.onMouseUp = onMouseUp;
    tool4.onMouseDrag = function(event) {
        if (draw_lock == false && drag_lock == false){
            path.add(event.point);
        }
        else if (drag_lock){
            move_canvas(event.point.x, event.point.y);
        }
    }



}// end of onload

// move the page up
function move_up(){
    view_center.y += 50;
    view.center = view_center;
}

// move the page down
function move_down(){
    view_center.y -= 50;
    view.center = view_center;
}

// undo
function undo() {
    if (path_stack.length > 0) {
        p = path_stack.pop();
        if (p.length > 1){
            // remove sub-paths
            for (i=0;i<p.length;i++){
                p[i].remove();
            }
        }
        else{
            p.remove();
        }
        redo_stack.push(p);
        if (redo_stack.length > STACK_SIZE) {
            redo_stack.shift()
        }
        //console.log(p);
    }
}

// redo
function redo() {
    if (redo_stack.length > 0){
        p = redo_stack.pop();
        if (p.length > 1){
            for (i=0;i<p.length;i++){
                project.activeLayer.addChild(p[i]);
            }
        }
        else{
            project.activeLayer.addChild(p);
        }
        path_stack.push(p);
        if (path_stack.length > STACK_SIZE) {
            path_stack.shift()
        }
    }
}

// reset canvas
function reset_everything() {
    while (path_stack.length > 0){
        p = path_stack.pop();
        if (p.length > 1){
            for (i=0;i<p.length;i++){
                p[i].remove();
            }
        }
        else{
            p.remove();
        }
    }
    path_stack = []
    redo_stack = []
}

// change path color
var color_1 = "#17202A";
var color_2 = "#E74C3C";
var color_3 = "#7D3C98";
var color_4 = "#2E86C1";
var color_5 = "#229954";
var color_6 = "#F39C12";
var color_7 = "#A6ACAF";
var color_8 = "#5D6D7E";
function set_color(c_str) {
    current_color = c_str;
    switch(c_str){
        case "color_1": current_color = color_1; break;
        case "color_2": current_color = color_2; break;
        case "color_3": current_color = color_3; break;
        case "color_4": current_color = color_4; break;
        case "color_5": current_color = color_5; break;
        case "color_6": current_color = color_6; break;
        case "color_7": current_color = color_7; break;
        case "color_8": current_color = color_8; break;
    }
    document.getElementById("palette_icon").style.color = current_color;
    document.getElementById("palette").style.backgroundColor = current_color;
    document.getElementById("color_picker").setAttribute("value", current_color);
    document.getElementById("color_picker").value = current_color;
    highlight_tool_auto();
}

function pick_color () {
    var get_color = document.getElementById("color_picker").value;
    set_color(get_color);
    switch(frequent_color_pointer){
        case 0: color_1 = get_color; document.getElementById("color_1").style.backgroundColor=get_color; break;
        case 1: color_2 = get_color; document.getElementById("color_2").style.backgroundColor=get_color; break;
        case 2: color_3 = get_color; document.getElementById("color_3").style.backgroundColor=get_color; break;
        case 3: color_4 = get_color; document.getElementById("color_4").style.backgroundColor=get_color; break;
        case 4: color_5 = get_color; document.getElementById("color_5").style.backgroundColor=get_color; break;
        case 5: color_6 = get_color; document.getElementById("color_6").style.backgroundColor=get_color; break;
        case 6: color_7 = get_color; document.getElementById("color_7").style.backgroundColor=get_color; break;
        case 7: color_8 = get_color; document.getElementById("color_8").style.backgroundColor=get_color; break;
    }
    frequent_color_pointer += 1;
    if (frequent_color_pointer >= 8){
        frequent_color_pointer = 0;
    }
}

function to_hex(decimal) {
    ret = decimal.toString(16);
    if (ret.length == 1){
        return "0"+ret;
    }
    return ret;
}

function opacity_change () {
    opacity = to_hex(parseInt(document.getElementById("opacity").value));
    document.getElementById("palette").style.backgroundColor = current_color+opacity;
}

function brush_1_size_change () {
    brush_1_size = parseInt(document.getElementById("brush_1_size").value)
}



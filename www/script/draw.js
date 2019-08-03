// print function: for debugging
function print(msg) {
    document.getElementById("output").innerHTML = msg;
}

////////////////////////////////////////////////////////////////////
////// Main code
//////////////////////////////////////////////////////////

paper.install(window);
// Keep global references to both tools, so the HTML
// links below can access them.
var tool1, tool2;
var canvas, context;
let path_stack = []; // paths are saved in here
let redo_stack = []; // removed paths are saved in here
var view_center; // the origin of the view coordinate

window.onload = function() {
    paper.setup('myCanvas');
    canvas = document.getElementById('myCanvas');
    var context = canvas.getContext("2d");
    var path;

    view_center = view.center; // get the center of the view
    view.center = view_center; // do not remove this line !!!
    view_zoom = view.zoom; // get the view zoom factor
    view.zoom = view_zoom; // do not remove this line !!!
    current_color = "black";





    ///////////////////////////////////////////////////////////////////
    ////// support mobile device's touch screen: Zoom and/or Scroll
    draw_lock = false; // when it's true, not draw anything
    move_lock = false;
    var prev_distance = 0;
    var current_distance = 0;
    var prev_X = -1;
    var prev_Y = -1;
    function touch_screen(event) {
        //print(path_stack.length)
        if (event.touches[1] != undefined && event.touches[2] != undefined) {
            draw_lock = true;
            // Move with three fincers
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
            //print(prev_X+","+prev_Y)
        }
        else if (event.touches[1] != undefined) {
            draw_lock = true; // lock: cannot draw
            //print("pinch start")
            var x1 = event.touches[1].clientX;
            if (prev_distance == 0){
                prev_distance = distance(event.touches[0].clientX, event.touches[0].clientY, event.touches[1].clientX, event.touches[1].clientY)
                prev_X = event.touches[0].clientX;
                prev_Y = event.touches[0].clientY;
            }
            
            current_distance = distance(event.touches[0].clientX, event.touches[0].clientY, event.touches[1].clientX, event.touches[1].clientY)
            scale_ratio = (current_distance/prev_distance);
            if (scale_ratio >= 0.9 && scale_ratio <= 1.2 && move_lock == false) {
                view_center.x -= (event.touches[0].clientX - prev_X)/view_zoom;
                view_center.y -= (event.touches[0].clientY - prev_Y)/view_zoom;
                view.center = view_center;
                prev_X = event.touches[0].clientX;
                prev_Y = event.touches[0].clientY;
            }
            else {
                move_lock = true;
                // Zoom with two fingers
                current_distance = distance(event.touches[0].clientX, event.touches[0].clientY, event.touches[1].clientX, event.touches[1].clientY)
                scale_ratio = (current_distance/prev_distance);
                if (scale_ratio > 2){
                    view_zoom += 0.07; // Zoom in
                }
                else if (scale_ratio < 0.7){
                    view_zoom -= 0.07; // Zoom out
                }
                if (view_zoom <= 0.9){
                    view_zoom = 0.9; // minimum zoom factor
                }
                else if (view_zoom >= 2.5){
                    view_zoom = 2.5; // maximum zoom factor
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
        prev_distance = 0; // reset the distance register
        prev_X = -1;
        prev_Y = -1;
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
            path.strokeColor = current_color;
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
            path.simplify(10); // smooth the path
            path_raster = path.rasterize(); // rasterize the path
            path.remove(); // remove the original vector path
            path_stack.push(path_raster); // store the path to path_stack
            console.log("stack:"+path_stack.length);
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

    // This is cloud-curve style pen
    tool2 = new Tool();
    tool2.minDistance = 6;
    tool2.onMouseDown = onMouseDown;
    tool2.onMouseUp = onMouseUp;
    tool2.onMouseDrag = function(event) {
        if (draw_lock == false && drag_lock == false){
            path.arcTo(event.point);
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
        //p_clone = p.clone(); // make a clone of the path
        redo_stack.push(p); // save it to redo stack, incase the user regrets
        p.remove();
        //console.log(p);
    }
}

// redo
function redo() {
    if (redo_stack.length > 0){
        p = redo_stack.pop();
        project.activeLayer.addChild(p);
        path_stack.push(p);
    }
}

// reset canvas
function reset_everything() {
    while (path_stack.length > 0){
        p = path_stack.pop();
        p.remove();
    }
    path_stack = []
    redo_stack = []
}

// change path color
function set_color(c_str) {
    current_color = c_str;
    document.getElementById("current-color").style.backgroundColor = c_str;
    if (document.getElementById("pen").style.color != "gray"){
        document.getElementById("pen").style.color = c_str;
    }
    else if (document.getElementById("curve-pen").style.color != "gray"){
        document.getElementById("curve-pen").style.color = c_str;
    } 
}


// move toolbar to the left side
function toolbar_left() {
    document.getElementById("color-container").style.left = "0px";
    document.getElementById("tool-container").style.left = "0px";
    document.getElementById("color-container").style.right = "";
    document.getElementById("tool-container").style.right = "";
}
// move toolbar to the right side
function toolbar_right() {
    document.getElementById("color-container").style.left = "";
    document.getElementById("tool-container").style.left = "";
    document.getElementById("color-container").style.right = "0px";
    document.getElementById("tool-container").style.right = "0px";
}


function tool1_inuse() {
    drag_lock = false;
    document.getElementById("pen").style.color = current_color;
    document.getElementById("curve-pen").style.color = "gray";
    document.getElementById("drag").style.color = "gray";
}

function tool2_inuse() {
    drag_lock = false;
    document.getElementById("pen").style.color = "gray";
    document.getElementById("curve-pen").style.color = current_color;
    document.getElementById("drag").style.color = "gray";
}

function drag_canvas() {
    drag_lock = true;
    document.getElementById("pen").style.color = "gray";
    document.getElementById("curve-pen").style.color = "gray";
    document.getElementById("drag").style.color = "black";
}
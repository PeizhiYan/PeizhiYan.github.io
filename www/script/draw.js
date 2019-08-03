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
            //print("XX"+scale_ratio)
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
    function touch_end(event){
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
    




















    // sharable mouseDown event:
    function onMouseDown(event) {
        sleep(10);
        if (draw_lock == false){
            path = new Path();
            path.strokeColor = current_color;
            path.add(event.point);
        }
    }

    // sharable mouseUp event:
    function onMouseUp(event) {
        path_stack.push(path); // store the path to path_stack
        console.log("stack:"+path_stack.length);
    }
    
    // This is normal pen
    tool1 = new Tool();
    tool1.onMouseDown = onMouseDown;
    tool1.onMouseUp = onMouseUp;
    tool1.onMouseDrag = function(event) {
        if (draw_lock == false){
            path.add(event.point);
        }
    }

    // This is cloud-curve style pen
    tool2 = new Tool();
    tool2.minDistance = 6;
    tool2.onMouseDown = onMouseDown;
    tool2.onMouseUp = onMouseUp;
    tool2.onMouseDrag = function(event) {
        path.arcTo(event.point);
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
    document.getElementById("pen").style.color = current_color;
    document.getElementById("curve-pen").style.color = "gray";
}

function tool2_inuse() {
    document.getElementById("pen").style.color = "gray";
    document.getElementById("curve-pen").style.color = current_color;
}
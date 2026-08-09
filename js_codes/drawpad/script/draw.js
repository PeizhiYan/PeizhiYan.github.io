// print function: for debugging
function print(msg) {
    document.getElementById("output").innerHTML = msg;
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

////////////////////////////////////////////////
////// Main code
////////////////////////////////////////////////

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
var pen_size = 1;
var brush_1_size = 5;
//var brush_1_raster; // only store the path created by brush_1    http://sketch.paperjs.org/#V/0.12.3/S/rVXBctMwEP2VnZyctuMGmHJI6AECTDtDodM0F9JMR7XXsYgteSQlIXTy76wk23FSmwPggxNrd9+u3lutnnuC5dgb9iZLNFHaO+tFMrbf5+cwlsIomWlI5QZyJrZQMJNqYArpc8nFAkyK8KRWOg0f1IOIpNAGbt/fX00ex9+mX+/hEl4NBiNra+LZKM1/IcikFeHD3XRy9Ti5/v6JAF5fuPgSY2IkZbdBvpaVxhiMhESq3C1HK6VQGI8JsWIbqtNhZ2jKoEuYzUcvABXTBhWVFcMTi5YLJVciBrlGBZuUR2k3PHBdotkFUWfziFWmzxlb1PXGSJacCyRsJGDKgZCyNTojoYBUIKQBLiCXFEVvMuKaktf4ZfomP98q91hSIaFzTVYiMlwKkOLG2j6SKXBIfXi2DkAPxZI7F9xwlllt/A4dYWHlRCxDYDNz4nAwop93Tblp4fS0gWkfD1AQViBwA7f0GRw4lMmnutwdFJLTm2nQhilj6XUr4XGQxkVO/noIM0+Lc5ufdYAzkkPEModIZlK9RKPWXOLY2obgfkLvH/Sbrrt+f1R97xrcTfZyEM01erV0CUat0EXu2tSy4naodUOmLrUS2zX2OFZ9HtaZyRaUq0eK+FgWx3tKPOXUecgir/kBP38hey39jM9trqAhEZyCawX7P3iGDMXCpMPGqT8ZhBdnwMQiwyHc2GoqKeAE3rwdHKhwoMSuk+FV0cHvtOhgF+n013zAhhs/ARpN+s/nooWc9va6q2YTjQtGaXQ1iLItxFwXGdtiXJdjKyGGfRBVVCj5AyMTMtr4Gr+Qr23uEjHYZ6RE1wl1RaFwzYmbjpGIP7k2+qjXvGtrq8VIBSHwwyPsA0KFtveDjlNVD2fbMK3V1Jiq2m298+a+7lwaYFnWuDzsvaHQ9gbkZFfb/yLon3fUnBNJ0jIoEpZpbJY+zpCp+upVbF/l0W3m8tAN/qSQLV0z6d5wNt/9Bg==
var active_layer;
var active_layer_idx;
var layer_1;
var layer_2;
var layer_3;
var layer_4;
var layer_5;
var layer_6;
var layer_7;
var layer_8;
var layer_9;
var bg_color = '#FFFFFF';
var circle_path;
var circle_center_x;
var circle_center_y;
var inverted_circle;

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
    layer_bg = new Layer();
    document.getElementById("set_bg_color").style.backgroundColor = current_color;

    layer_1 = new Layer();
    layer_2 = new Layer();
    layer_3 = new Layer();
    layer_4 = new Layer();
    layer_5 = new Layer();
    layer_6 = new Layer();
    layer_7 = new Layer();
    layer_8 = new Layer();
    layer_9 = new Layer();
    active_layer_idx = 1;
    active_layer = layer_1;
    highlight_layer('1');

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
        myitem.addEventListener("mousedown", MouseClickDownHandler, false);
        myitem.addEventListener("mouseup", MouseClickUpHandler, false);
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
    function MouseClickDownHandler(e) {
        if (e.which == '2') {
            // when the wheel button (middle) is clicked
            // allow moving the canvas
            prev_X = e.x;
            prev_Y = e.y;
            currentX = prev_X;
            currentY = prev_Y;
            drag_lock = true;
        }
    }
    function MouseClickUpHandler(e) {
        if (e.which == '2') {
            // when the wheel button (middle) is released
            // stop drag-and-move the canvas
            drag_lock = false;
        }
    }
    drag_lock = false;
    function move_canvas(currentX, currentY) {
        deltaX = currentX - prev_X
        deltaY = currentY - prev_Y
        view_center.x -= deltaX;//view_zoom; // the reason of divide by "view_zoom" is to control the move speed
        view_center.y -= deltaY;///view_zoom; // the reason of divide by "view_zoom" is to control the move speed
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
            active_layer.addChild(path_raster);
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
            path.strokeWidth = pen_size
            path.add(event.point);
        }
        else if (drag_lock){
            move_canvas(event.point.x, event.point.y);
        }
    }





    // This is brush-1
    tool2 = new Tool();
    var paths = [];
    let bristles = 2*brush_1_size;
    tool2.onMouseDown = function(event) {
        if (draw_lock == false && drag_lock == false){
            paths = [];
            for (i=0;i<bristles;i++){
                p = new Path();
                console.log(parseInt(parseInt(opacity,16)));
                p.strokeColor = current_color + to_hex(parseInt(parseInt(opacity,16)/20));
                p.strokeWidth = brush_1_size/3;
                
                p.strokeWidth = brush_1_size/2;
                calculated_x = event.point.x + (i-bristles/2)*p.strokeWidth/3;// + 0.5*(0.5-Math.random());
                //calculated_x = event.point.x + (brush_1_size*Math.random()-brush_1_size/2)/2;
                calculated_y = event.point.y; //+ (brush_1_size*Math.random()-brush_1_size/2)/2;
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
            let newLayer = new Layer();
            for (i=0;i<bristles;i++){
                p = paths[i];
                //p.simplify(smooth_rate); // smooth the path
                newLayer.addChild(p);
            }

            let new_raster = newLayer.rasterize();

            for (i=0;i<bristles;i++){
                p = paths[i];
                p.remove();
            }
            paths = [];
            

            path_stack.push(newLayer.children[0]); // store the path to path_stack      
            //path_stack.push(paths)
            if (path_stack.length > STACK_SIZE) {
                path_stack.shift();
            }
            active_layer.addChild(newLayer.children[0]);
            newLayer.remove();
        }
        else {
            prev_X = -1;
            prev_Y = -1;
        }
        not_add_path = false;
    }
    tool2.onMouseDrag = function(event) {
        if (draw_lock == false && drag_lock == false){
            for (i=0;i<bristles;i++){
                p = paths[i];
                calculated_x = event.point.x + (i-bristles/2)*p.strokeWidth/3;// + 0.5*(0.5-Math.random());
                //calculated_x = event.point.x + (brush_1_size*Math.random()-brush_1_size/2)/2;
                calculated_y = event.point.y; //+ (brush_1_size*Math.random()-brush_1_size/2)/2;
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
            //path.strokeColor = "white";
            path.strokeColor = bg_color;
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

    // This is circle tool
    tool5 = new Tool();
    tool5.onMouseDown = function onMouseDown(event) {
        if (draw_lock == false && drag_lock == false){
            circle_center_x = event.point.x;
            circle_center_y = event.point.y;
            circle_path = new Path.Circle(new Point(circle_center_x, circle_center_y), 1);
            circle_path.strokeColor = current_color + opacity;
            circle_path.strokeWidth = 0.5; 
            circle_path.fillColor = current_color + opacity;
        }
    }
    tool5.onMouseUp = function(event) {
        if (not_add_path == false && circle_path.length > 0) {
            if (circle_mode == 1) { 
                path_raster = circle_path.rasterize(); // rasterize the path
                circle_path.remove()
            }
            else {
                path_raster = inverted_circle.rasterize(); // rasterize the path
                inverted_circle.remove()
                circle_path.remove(); // remove the original vector path
            }

            path_stack.push(path_raster); // store the path to path_stack
            active_layer.addChild(path_raster);
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
    tool5.onMouseDrag = function(event) {
        if (draw_lock == false && drag_lock == false){
            radius = distance(circle_center_x, circle_center_y, event.point.x, event.point.y)
            circle_path.remove();
            circle_path = new Path.Circle(new Point(circle_center_x, circle_center_y), radius);
            circle_path.strokeColor = current_color + opacity;
            circle_path.strokeWidth = 0.5;

            if (circle_mode == 1) { 
                circle_path.fillColor = current_color + opacity;
            }
            else {
                circle_path.fillColor = bg_color;
                var rect = new Path.Rectangle({
                    point: [0, 0],
                    size: [view.size.width, view.size.height],
                });
                rect.sendToBack();
                rect.fillColor = current_color;
                rect.remove()
                inverted_circle = rect.subtract(circle_path);
            }

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

// clear canvas button event
function clear_canvas() {
    if (confirm("Clear everything? (you cannot redo after this!)")) {
        reset_everything();
    } 
}

// reset canvas
function reset_everything() {
    /*
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
    */
    //active_layer.removeChildren();
    layer_1.removeChildren();
    layer_2.removeChildren();
    layer_3.removeChildren();
    layer_4.removeChildren();
    layer_5.removeChildren();
    path_stack = []
    redo_stack = []
}



function set_layer(layer_idx) {
    switch (layer_idx) {
        case "1": active_layer = layer_1; break;
        case "2": active_layer = layer_2; break;
        case "3": active_layer = layer_3; break;
        case "4": active_layer = layer_4; break;
        case "5": active_layer = layer_5; break;
        case "6": active_layer = layer_6; break;
        case "7": active_layer = layer_7; break;
        case "8": active_layer = layer_8; break;
        case "9": active_layer = layer_9; break;
    }
    active_layer_idx = layer_idx;
    highlight_layer(layer_idx);
    document.getElementById('layers').textContent = layer_idx;
    layer_opacity = active_layer.opacity;
    layer_opacity = parseInt(layer_opacity * 255);
    document.getElementById("layer_opacity").value = layer_opacity;
}

function set_as_bg_color() {
    // set the current color as background color
    var rect = new Path.Rectangle({
        point: [0, 0],
        size: [view.size.width, view.size.height],
    });
    rect.sendToBack();
    rect.fillColor = current_color;
    bg_color = current_color;
    layer_bg.addChild(rect)
}

function change_layer_opacity() {
    layer_opacity = parseInt(document.getElementById("layer_opacity").value);
    active_layer.opacity = layer_opacity / 255.;
}

function clear_layer() {
    active_layer.removeChildren();
}

function rename_layer() {
    new_name = document.getElementById("layer_name").value;
    document.getElementById('layer'+active_layer_idx).textContent = new_name;
}



// change path color
var color_b = "#000000";
var color_w = "#FFFFFF";
var color_1 = "#666666";
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
        case "color_b": current_color = color_b; break;
        case "color_w": current_color = color_w; break;
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
    document.getElementById("set_bg_color").style.backgroundColor = current_color;
}

function pick_color () {
    var get_color = document.getElementById("color_picker").value;
    set_color(get_color);
    /*
    switch(frequent_color_pointer){
        case 0: color_1 = get_color; document.getElementById("color_1").style.backgroundColor=get_color; break;
        case 1: color_2 = get_color; document.getElementById("color_2").style.backgroundColor=get_color; break;
        case 2: color_3 = get_color; document.getElementById("color_3").style.backgroundColor=get_color; break;
        case 3: color_4 = get_color; document.getElementById("color_4").style.backgroundColor=get_color; break;
        case 4: color_5 = get_color; document.getElementById("color_5").style.backgroundColor=get_color; break;
        case 5: color_6 = get_color; document.getElementById("color_6").style.backgroundColor=get_color; break;
        case 6: color_7 = get_color; document.getElementById("color_7").style.backgroundColor=get_color; break;
        case 7: color_8 = get_color; document.getElementById("color_8").style.backgroundColor=get_color; break;
    }*/
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

function pen_size_change () {
    pen_size = parseInt(document.getElementById("pen_size").value)
}

function brush_1_size_change () {
    brush_1_size = parseInt(document.getElementById("brush_1_size").value)
}


function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}
// save the canvas to png and download 
function save_to_png () {
    download_canvas = document.getElementById('myCanvas');
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    downloadURI(download_canvas.toDataURL(), "Matthew_Draw_"+dateTime+".png");
}




var container = document.getElementById("container");
function getClickPositionDown(e) {
    var parentPosition = getPosition(e.currentTarget);
    startX = e.clientX - parentPosition.x ;
    startY = e.clientY - parentPosition.y ;
    console.log("down "+startX+","+startY);
    drag=0;
    dragging_window=-1;
    if (debug_mode) {
        var xpos=document.getElementById("Xpos");
        xpos.innerHTML=startX;
        var ypos=document.getElementById("Ypos");
        ypos.innerHTML=startY+"   "+dragging_window;
        var bpos=document.getElementById("Button");
        bpos.innerHTML=e.buttons;
    }
    for (i = 0; i< FSMinimizedWindowList.length;i++) {
        if (startX<0) continue;
        if (startX>TILE) continue;
        if (startY<config_minimized_line_y+i*TILE) continue;
        if (startY>config_minimized_line_y+(i+1)*TILE) continue;
        var W=FSMinimizedWindowList[i];
        W.state="normal";
        FSMinimizedWindowList.splice(i,1);
        FSWindowList.push(W);
        Redraw(0);
        return;
    }
    for (i = FSWindowList.length-1; i>=0; i--) {
        var W=FSWindowList[i];
        console.log("Window x="+W.x+" y="+W.y);
        if (startX<W.x) continue;
        if (startX>W.x+W.w) continue;
        if (startY<W.y) continue;
        if (startY>W.y+W.h+TILE) continue;
        console.log("focus "+W.title+" startX="+startX+" ("+(W.x+TILE)+","+(W.x+W.w-3*TILE)+") startY="+startY+" ("+(W.y+TILE)+","+(W.y+W.h+TILE)+")");
        if ((startY>W.y+W.h)&&(startX>W.x+W.w-TILE)) {
            console.log("Resizing "+W.title);
            resizing_window=i;
            resizingW=W.w;
            resizingH=W.h;
            resizing=1;
            return;
        }
        if ((startX>W.x+TILE)&&(startX<W.x+W.w-3*TILE)&&(startY<W.y+TILE)) {
            console.log("Dragging "+W.title);
            drag=1;
            dragging_window=FSWindowList.length-1;
            dragging_windowX=W.x;
            dragging_windowY=W.y;
            FSWindowList.splice(i,1);
            FSWindowList.push(W);
            Redraw(0);
            return;
        }
        if ((startX>W.x+W.w-TILE)&&(startY<W.y+TILE)&&(W.type!="Search")) {
            var index;
            FSWindowList.splice(i,1);
            Redraw(1);
            return;
        }
        if (W.type=="Config") return;
        if ((startX>W.x)&&(startX<W.x+TILE)&&(startY<W.y+TILE)) {
            eval("ClickConfig"+W.type+"("+i+")");
            Redraw(0);
            return;
        }
            if ((startX<W.x+W.w-TILE)&&(startX>W.x+W.w-2*TILE)&&(startY<W.y+TILE)) {
                if (W.state=="maximized") {
                    PositionWindow(i,W.x,W.y,config_default_window_height,config_default_window_height);
                    W.state="normal";
                } else {
                    PositionWindow(i,0,0,screen.availHeight*3/4,screen.availHeight*3/4);
                    W.state="maximized";
                }
                FSWindowList[i]=W;
                return;
            }
            if ((startX<W.x+W.w-2*TILE)&&(startX>W.x+W.w-3*TILE)&&(startY<W.y+TILE)) {
                W.state="minimized";
                FSMinimizedWindowList.push(W);
                FSWindowList.splice(i,1);
                Redraw(0);
                return;
            }
        // Pass click to the window
        eval("MouseDown"+W.type+"("+i+","+startX+","+startY+","+e.buttons+")");
        return;
    }
}
function getClickPositionUp(e) {
    var parentPosition = getPosition(e.currentTarget);
    endX = e.clientX - parentPosition.x ;
    endY = e.clientY - parentPosition.y ;
    for (i = FSWindowList.length-1; i>=0; i--) {
        var W=FSWindowList[i];
        if (endX<W.x) continue;
        if (endX>W.x+W.w) continue;
        if (endY<W.y) continue;
        if (endY>W.y+W.h+TILE) continue;
        if (W.type=="Config") {
            drag=0;
            resizing=0;
            resizing_screen=0;
            dragging_window=-1;
            return;
        }
        break;
    }
    if (zoomingXY|zoomingX|zoomingY) {
        SVG.removeChild(zoom_box);
        W=FSWindowList[zooming_window];
        // Zoom-out gesture detected first
        if ((zoomingXY)&&((endX<startX)||(endY<startY))) {
            FSWindowList[zooming_window].ShowWindowMaxX=W.maxX;
            FSWindowList[zooming_window].ShowWindowMinX=W.minX;
            FSWindowList[zooming_window].ShowWindowMaxY=W.maxY;
            FSWindowList[zooming_window].ShowWindowMinY=W.minY;
        } else {
            if (zoomingX|zoomingXY) {
                var start=W.ShowWindowMinX;
                var span=W.ShowWindowMaxX-W.ShowWindowMinX;
                FSWindowList[zooming_window].ShowWindowMaxX=(endX-(LeftGraphBoundary(i)))/(GraphWidth(i))*span+start;
                FSWindowList[zooming_window].ShowWindowMinX=(startX-(LeftGraphBoundary(i)))/(GraphWidth(i))*span+start;
            }
            if (zoomingY|zoomingXY) {
                var start=W.ShowWindowMinY;
                var span=W.ShowWindowMaxY-W.ShowWindowMinY;
                FSWindowList[zooming_window].ShowWindowMaxY=(endY-(UpperGraphBoundary(i)))/(GraphHeight(i))*span+start;
                FSWindowList[zooming_window].ShowWindowMinY=(startY-(UpperGraphBoundary(i)))/(GraphHeight(i))*span+start;
            }
        }
        // Send new window to server
        zoomingXY=0;
        zoomingX=0;
        zoomingY=0;
    }
    if (panningXY|panningX|panningY) {
        // Send new window to server
        panningXY=0;
        panningX=0;
        panningY=0;
    }
    // Debug tail, remove later
    if (debug_mode) {
        var xpos=document.getElementById("Xpos");
        xpos.innerHTML=endX;
        var ypos=document.getElementById("Ypos");
        ypos.innerHTML=endY;
        var bpos=document.getElementById("Button");
        bpos.innerHTML=e.buttons;
    }
    drag=0;
    resizing=0;
    resizing_screen=0;
    dragging_window=-1;
    Redraw(0);
}
function getMove(e) {
    var parentPosition = getPosition(e.currentTarget);
    endX = e.clientX - parentPosition.x ;
    endY = e.clientY - parentPosition.y ;
    if (zoomingXY) {
        var W=FSWindowList[zooming_window];
        if (endX<RightGraphBoundary(i)) zoom_box.setAttribute("width",endX-startX);
        if (endY<LowerGraphBoundary(i)) zoom_box.setAttribute("height",endY-startY);
    }
    if (zoomingX) {
        var W=FSWindowList[zooming_window];
        if (endX<LeftGraphBoundary(i)) zoom_box.setAttribute("width",endX-startX);
    }
    if (zoomingY) {
        var W=FSWindowList[zooming_window];
        if (endY<LowerGraphBoundary(i)) zoom_box.setAttribute("height",endY-startY);
    }
    if (panningXY|panningX|panningY) {
        W=FSWindowList[panning_window];
        if (panningX|panningXY) {
            var span=W.ShowWindowMaxX-W.ShowWindowMinX;
            var step=(endX-startX)/(GraphWidth(i))*span;
            FSWindowList[panning_window].ShowWindowMaxX=panning_window_maxX-step;
            FSWindowList[panning_window].ShowWindowMinX=panning_window_minX-step;
        }
        if (panningY|panningXY) {
            var span=W.ShowWindowMaxY-W.ShowWindowMinY;
            var step=(-endY+startY)/(GraphHeight(i))*span;
            FSWindowList[panning_window].ShowWindowMaxY=panning_window_maxY-step;
            FSWindowList[panning_window].ShowWindowMinY=panning_window_minY-step;
        }
        Redraw(0);
        return;
    }
    if (resizing) {
        var W=FSWindowList[resizing_window];
        W.w=resizingW+(endX-startX);
        W.h=resizingH+(endY-startY);
        Redraw(0);
        return;
    }
    HoverMessage="";
    SVG.style.cursor='default';
    for (i = 0; i < FSMinimizedWindowList.length; i++) {
        if (endX>TILE) continue;
        if (endY>TILE*(i+1)+config_minimized_line_y) continue;
        if (endY<TILE*i+config_minimized_line_y) continue;
        var W=FSMinimizedWindowList[i];
        HoverMessage=W.title;
    }
    for (i = FSWindowList.length-1; i>=0; i--) {
        var W=FSWindowList[i];
        if (endX<W.x) continue;
        if (endX>W.x+W.w) continue;
        if (endY<W.y) continue;
        if (endY>W.y+W.h+TILE) continue;
        //	if (W.type=="Config") return;
        if ((endY>W.y+W.h)&&(endX>W.x+W.w-TILE)) {
            SVG.style.cursor='se-resize';
            break;
        }
        eval("MouseOver"+W.type+"("+i+")");
        break;
    }
    hover_object.setAttribute("x",endX+TILE);
    hover_object.setAttribute("y",endY+TILE);
    var bbox=hover_object.getBBox();
    if (hover_bg!=undefined ) {
        hover_bg.setAttribute("x",bbox.x-bbox.width*0.05);
        hover_bg.setAttribute("y",bbox.y);
        hover_bg.setAttribute("width",bbox.width*1.1);
        hover_bg.setAttribute("height",bbox.height*1.1);
    }
    hover_object.textContent=HoverMessage;

    if (debug_mode) {
        var xpos=document.getElementById("Xpos");
        xpos.innerHTML=endX+" "+zoomingXY+" "+zoomingX+" "+zoomingY;
        var ypos=document.getElementById("Ypos");
        ypos.innerHTML=endY;
    }
    if (dragging_window!=-1) {
        var W=FSWindowList[dragging_window];
        PositionWindow(dragging_window,dragging_windowX+endX-startX,dragging_windowY+endY-startY,W.w,W.h);
        return;
    }
    if (drag==0) return;
    if ((endY-startY<10)&&(endX-startX<10)) return;
    var bpos=document.getElementById("Button");
}
function updateScroll() {
    var parentPosition = getPosition(e.currentTarget);
    var xPosition = e.clientX - parentPosition.x ;
    var yPosition = e.clientY - parentPosition.y ;
    var ypos=document.getElementById("Scroll");
    scroll=scroll+1;
    ypos.innerHTML=scroll;
}
var TypedString="";

container.addEventListener("mousedown", getClickPositionDown, false);
container.addEventListener("mouseup", getClickPositionUp, false);
container.addEventListener("mousemove", getMove, false);
container.addEventListener("scroll", updateScroll, false);
document.addEventListener('keyup', (event) => {
    return;
                              var name = event.key;
                              if (name === 'Control') ctrl_state=0;
                              if (name==='Tab') {
                                  return(false);
                              }
                          }, false);
document.addEventListener("paste", function(e) {
    return;
                              e.preventDefault();
                              // get text representation of clipboard
                              name = (e.originalEvent || e).clipboardData.getData('text/plain');
                              insert_text(name);
                          }, false);
document.addEventListener('keydown', (event) => {
    return;
                              wd_counter=0;
                              if (wd_state) switch_to_active();
                              var name = event.key;
                              var code = event.code;
                              if (name==='Tab') {
                                  event.preventDefault()
                                  var matches=[];
                                  pattern="/^"+command_line+"\\S+/";
                                  for (var i=0;i<dictionary.length;i++)
                                  if (eval("dictionary[i].match("+pattern+")"))
                                  matches.push(dictionary[i]);
                                  if (matches.length==0) return;
                                  if (matches.length==1) {
                                      command_line=matches[0];
                                      command_line_index=command_line.length+" ";
                                      update_command_line();
                                      return(false);
                                  }
                                  logprint("<br><font color=\"green\">");
                                  for (var i=0;i<matches.length;i++) {
                                      logprint(" "+matches[i]);
                                  }
                                  logprint("</font><br>");
                                  update_command_line();
                                  return(false);
                              }
                              if (name==='End') {
                                  command_line_index=command_line.length;
                                  update_command_line();
                                  return(false);
                              }
                              if (name==='Home') {
                                  command_line_index=0;
                                  update_command_line();
                                  return(false);
                              }
                              if (name==='Insert') {
                                  return(false);
                              }
                              if (name==='PageUp') {
                                  return(false);
                              }
                              if (name==='PageDown') {
                                  return(false);
                              }
                              if (name==='Control') {
                                  ctrl_state=1;
                                  return(false);
                              }
                              if (name==='Shift') {
                                  return(false);
                              }
                              if (name==='Alt') {
                                  return(false);
                              }
                              if (name==='ArrowRight') {
                                  command_line_index++;
                                  if (command_line_index>command_line.length) command_line_index=command_line.length;
                                  update_command_line();
                                  return(false);
                              }
                              if (name==='ArrowLeft') {
                                  command_line_index--;
                                  if (command_line_index<0) command_line_index=0;
                                  update_command_line();
                                  return(false);
                              }
                              if (name==='ArrowUp') {
                                  command_stack_index--;
                                  if (command_stack_index<0) command_stack_index=0;
                                  if (command_stack.length==0) return;
                                  command_line=command_stack[command_stack_index];
                                  command_line_index=command_line.length;
                                  update_command_line();
                                  return(false);
                              }
                              if (name==='ArrowDown') {
                                  command_stack_index++;
                                  if (command_stack_index>=command_stack.length) command_stack_index=command_stack.length;
                                  if (command_stack.length==0) return;
                                  command_line=command_stack[command_stack_index];
                                  command_line_index=command_line.length;
                                  update_command_line();
                                  return(false);
                              }
                              if (name==='Backspace') {
                                  command_line = command_line.substr(0, command_line_index-1)+command_line.substr(command_line_index,command_line.length);
                                  command_line_index--;
                                  if (command_line_index<0) command_line_index=0;
                                  update_command_line();
                                  return(false);
                              }
                              if (name==='Delete') {
                                  command_line = command_line.substr(0, command_line_index)+command_line.substr(command_line_index+1,command_line.length);
                                  if (command_stack_index>=command_stack.length) command_stack_index=command_stack.length;
                                  update_command_line();
                                  return(false);
                              }
                              if (name==='Enter') {
                                  serve_command_prompt()
                                  return(false);
                              }
                              if (ctrl_state) {
                                  if (name==='v') {
                                      return(false);
                                  }
                                  return(false);
                              }
                              insert_text(name);
                          }, true);

function ClickConfigConfig(i) {}
function MouseOverConfig(i) {}
function MouseDownConfig(i) {}


function openConfig(id,c,title="Edit Specifications") {
    var j;
    for (j=0;j<FSWindowList.length;j++) {
        if (FSWindowList[j].id!=id) continue;
        FSWindowList[j].title=title;
        FSWindowList[j].content=c;
        return;
    }
    // Must be a new window
    var W={id:id,title:title,x:300,y:0,w:500,h:500,content:c,state:"normal",type:"Config"};
    FSWindowList.push(W);
}
function DrawConfigMinimized(i) {}
function DrawConfig(i) {
  var W=FSWindowList[i];
  var HTML=SVGhtml(W.id+"FloatingConfigurations",W.x,W.y+TILE,500,500,W.content);
  if ((htmlWidth!=W.w)||(htmlHeight!=W.h)) {
      W.h=htmlHeight;
      W.w=htmlWidth;
      FSWindowList[i]=W;
      Redraw();
  }
}

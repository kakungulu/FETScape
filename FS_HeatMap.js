function ClickConfigHeatMap(i) {
    var W=FSWindowList[i];
    openConfig(FSWindowList[i].id+"_config_hm","","HeatMap Configurations!");
}
function MouseDownHeatMap(i,X,Y,B) {
    var W=FSWindowList[i];
    if ((X>LeftGraphBoundary(i))&&(X<RightGraphBoundary(i))&&(Y>UpperGraphBoundary(i))&&(Y<LowerGraphBoundary(i))) {
        MouseDownGraph(i,X,Y,B);
        return;
    }
    if ((X>LeftGraphBoundary(i))&&(X<RightGraphBoundary(i))&&(Y>LowerGraphBoundary(i))) {
        MouseDownXRuler(i,X,Y,B);
        return;
    }
    if ((X<LeftGraphBoundary(i))&&(Y>UpperGraphBoundary(i))&&(Y<LowerGraphBoundary(i))) {
        MouseDownYRuler(i,X,Y,B);
        return;
    }
}
function InitHeatMap(i) {
  var W=FSWindowList[i];
  W.xtitle=W.xaxis+"   ["+unit_Map[W.xaxis]+"]";
  W.ytitle=W.yaxis+"   ["+unit_Map[W.yaxis]+"]";
  var spanX=parseFloat(W.maxX)-parseFloat(W.minX);
  var spanY=parseFloat(W.maxY)-parseFloat(W.minY);
  W.ShowWindowMinX=parseFloat(W.minX);
  W.ShowWindowMaxX=parseFloat(W.maxX);
  W.ShowWindowMinY=parseFloat(W.minY);
  W.ShowWindowMaxY=parseFloat(W.maxY);
  FSWindowList[i]=W;
}
function DrawHeatMap(i) {
  var contentpx=785;
  var W=FSWindowList[i];
  var hm=SVGuse(W.id+"content",LeftGraphBoundary(i),UpperGraphBoundary(i),GraphWidth(i),GraphHeight(i),W.content,contentpx);
  DrawGraphGrid(i);
  var a=(W.maxX-W.minX)/(W.ShowWindowMaxX-W.ShowWindowMinX);
  var d=(W.maxY-W.minY)/(W.ShowWindowMaxY-W.ShowWindowMinY);
  var e=-(W.ShowWindowMinX-W.minX)/(W.maxX-W.minX)*(GraphWidth(i))/a;
  var f=(W.ShowWindowMaxY-W.maxY)/(W.maxY-W.minY)*(GraphHeight(i))/d;
  var A=GraphWidth(i)/contentpx;
  var D=GraphHeight(i)/contentpx;
  var E=LeftGraphBoundary(i);
  var F=UpperGraphBoundary(i);
  m="matrix(" + A + ",0,0," + D + "," + E + "," + F + ") matrix(" + a + ",0,0," + d + "," + e + "," + f + ")";
  hm.setAttributeNS(null,"transform",m);
  //  hm.setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");
}
function DrawHeatMapMinimized(i) {
  var W=FSMinimizedWindowList[i];
  SVGrect(W.id+"rect",0,config_minimized_line_y+i*TILE,TILE,TILE);
  SVGuse(W.id+"content",0,config_minimized_line_y+i*TILE,TILE,TILE,W.content,785.0);
}
function MouseOverHeatMap(i) {
  var W=FSWindowList[i];
  if ((endX>LeftGraphBoundary(i))&&(endX<RightGraphBoundary(i))&&(endY>UpperGraphBoundary(i))&&(endY<LowerGraphBoundary(i))) SVG.style.cursor='crosshair';
}

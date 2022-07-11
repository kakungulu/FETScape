function ClickConfigSweep(i) {
    var W=FSWindowList[i];
    openConfig(FSWindowList[i].id+"_config_sweep","","Sweep Configurations!");
}
function MouseDownSweep(i,X,Y,B) {
    var W=FSWindowList[i];
    if (B==1) {
        var id=SenseClosestCircuit(i);
        if (id==-1) return;
        var j;
        for (j=0;j<circuit_list.length;j++) {
            if (circuit_list[j].id==id) {
                if (circuit_list[j].selected==0) {
                    var k;
                    var n=1;
                    circuit_list[j].table_index=-1;
                    for (k=0;k<circuit_table_list.length;k++) if (circuit_table_list[k]==-1) {
                        circuit_list[j].table_index=k;
                        circuit_table_list[k]=j;
                        break;
                    }
                    if (circuit_list[j].table_index==-1) {
                        circuit_list[j].table_index=circuit_table_list.length;
                        circuit_table_list.push(j);
                    }
                }
                circuit_list[j].selected=1;
            }
        }
        Redraw();
        return;
    }
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
function DrawSweepMinimized(i) {
  var W=FSMinimizedWindowList[i];
  var j;
  var data=W.content.split(",")
  var graph_rootX=0;
  var graph_width=TILE;
  var graph_rootY=config_minimized_line_y+TILE+i*TILE;
  var graph_height=TILE;
  var index=0;
  var prevX=NaN;
  var prevY=NaN;
  spanX=W.maxX-W.minX;
  spanY=W.maxY-W.minY;
  SVGrect(W.id+"rect",0,config_minimized_line_y+i*TILE,TILE,TILE);
  for (j=0;j<data.length;j++) {
      var SampleX=GetCircuitValue(data[j],W.xaxis);
      var SampleY=GetCircuitValue(data[j],W.yaxis);
      var X=Math.trunc(graph_rootX+1.0*(SampleX-W.minX)*graph_width/spanX);
      var Y=Math.trunc(graph_rootY-1.0*(SampleY-W.minY)*graph_height/spanY);
      if (!isNaN(prevX)) SVGline(W.id+"line"+index,prevX,prevY,X,Y);
      prevX=X;
      prevY=Y;
      index++;
  }
}
function InitSweep(i) {
  var W=FSWindowList[i];
  W.xtitle=W.xaxis+"   ["+unit_Map[W.xaxis]+"]";
  W.ytitle=W.yaxis+"   ["+unit_Map[W.yaxis]+"]";
  var data=W.content.split(",")
  W.minX=GetCircuitValue(data[0],W.xaxis);
  W.minY=GetCircuitValue(data[0],W.yaxis);
  W.maxX=GetCircuitValue(data[0],W.xaxis);
  W.maxY=GetCircuitValue(data[0],W.yaxis);
  var j;
  for (j=0;j<data.length;j++) {
      var SampleX=GetCircuitValue(data[j],W.xaxis);
      var SampleY=GetCircuitValue(data[j],W.yaxis);
      if (parseFloat(SampleX)<W.minX) W.minX=SampleX;
      if (parseFloat(SampleX)>W.maxX) W.maxX=SampleX;
      if (parseFloat(SampleY)<W.minY) W.minY=SampleY;
      if (parseFloat(SampleY)>W.maxY) W.maxY=SampleY;
  }
  var spanX=parseFloat(W.maxX)-parseFloat(W.minX);
  var spanY=parseFloat(W.maxY)-parseFloat(W.minY);
  W.ShowWindowMinX=parseFloat(W.minX)-0.05*parseFloat(spanX);
  W.ShowWindowMaxX=parseFloat(W.maxX)+0.05*parseFloat(spanX);
  W.ShowWindowMinY=parseFloat(W.minY)-0.05*parseFloat(spanY);
  W.ShowWindowMaxY=parseFloat(W.maxY)+0.05*parseFloat(spanY);
  FSWindowList[i]=W;
}
function DrawSweep(i) {
  var W=FSWindowList[i];
  var data=W.content.split(",");
  DrawGraphGrid(i,20);
  var index=0;
  var X8,Y8,X4,Y4,X0,Y0;
  var pass8,pass4,pass0;
  var j;
  for (j=0;j<data.length;j++) {
      var SampleX=GetCircuitValue(data[j],W.xaxis);
      var SampleY=GetCircuitValue(data[j],W.yaxis);
      X8=Math.trunc(graph_rootX+1.0*(SampleX-W.ShowWindowMinX)*graph_width/spanX);
      Y8=Math.trunc(graph_rootY-1.0*(SampleY-W.ShowWindowMinY)*graph_height/spanY);
      pass8="green";
      for (k=0;k<Object.keys(SPEC).length;k++) {
          var property=Object.keys(SPEC)[k];
          if (SPEC[property]=="") continue;
          var val=GetCircuitValue(data[j],property);
          if (property_quality[property]*val<property_quality[property]*SPEC[property]) {
              pass8="red";
              break;
          }
      }
      if (j==2) {
//            var X1=21*X0/32+14*X4/32-3*X8/32;
//            var Y1=21*Y0/32+14*Y4/32-3*Y8/32;
//            var X2=12*X0/32+24*X4/32-4*X8/32;
//            var Y2=12*Y0/32+24*Y4/32-4*Y8/32;
//            var X3=5*X0/32+30*X4/32-3*X8/32;
//            var Y3=5*Y0/32+30*Y4/32-3*Y8/32;
//            SVGgraphline(W.id+"line"+index++,X0,Y0,X1,Y1,pass0).setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");;
//            SVGgraphline(W.id+"line"+index++,X2,Y2,X1,Y1,pass0).setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");;
//            SVGgraphline(W.id+"line"+index++,X2,Y2,X3,Y3,pass4).setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");;
//            SVGgraphline(W.id+"line"+index++,X4,Y4,X3,Y3,pass4).setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");;
          SVGgraphline(W.id+"line"+index++,X4,Y4,X0,Y0,pass4).setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");;
      }
      if (j>=2) {
//            var X7=21*X8/32+14*X4/32-3*X0/32;
//            var Y7=21*Y8/32+14*Y4/32-3*Y0/32;
//            var X6=12*X8/32+24*X4/32-4*X0/32;
//            var Y6=12*Y8/32+24*Y4/32-4*Y0/32;
//            var X5=5*X8/32+30*X4/32-3*X0/32;
//            var Y5=5*Y8/32+30*Y4/32-3*Y0/32;
//            SVGgraphline(W.id+"line"+index++,X4,Y4,X5,Y5,pass4).setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");;
//            SVGgraphline(W.id+"line"+index++,X6,Y6,X5,Y5,pass4).setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");;
//            SVGgraphline(W.id+"line"+index++,X6,Y6,X7,Y7,pass8).setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");;
//            SVGgraphline(W.id+"line"+index++,X8,Y8,X7,Y7,pass8).setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");;
          SVGgraphline(W.id+"line"+index++,X8,Y8,X4,Y4,pass8).setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");;
      }
      X0=X4;
      Y0=Y4;
pass0=pass4;
      X4=X8;
      Y4=Y8;
pass4=pass8;
  }
  for (j=0;j<data.length;j++) {
      var SampleX=GetCircuitValue(data[j],W.xaxis);
      var SampleY=GetCircuitValue(data[j],W.yaxis);
      var X=Math.trunc(graph_rootX+1.0*(SampleX-W.ShowWindowMinX)*graph_width/spanX);
      var Y=Math.trunc(graph_rootY-1.0*(SampleY-W.ShowWindowMinY)*graph_height/spanY);
      var r=(W.w+W.h)/200.0;
      var pass="green";
      for (k=0;k<Object.keys(SPEC).length;k++) {
          var property=Object.keys(SPEC)[k];
          if (SPEC[property]=="") continue;
          var val=GetCircuitValue(data[j],property);
          if (property_quality[property]*val<property_quality[property]*SPEC[property]) {
              pass="red";
              break;
          }
      }
      var circ=SVGcirc(W.id+"marker"+index,X,Y,r);
      circ.setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");
      circ.setAttributeNS(null,"style","fill:"+pass);
      if (GetCircuitValue(data[j],"selected")) {
    var x,y;
    if (X-(W.x+W.w/config_frame)<TILE) {
        x=X+3*r;
    } else {
        x=X-3*r;
    }
    if (Y-(W.y+2*TILE)<TILE) {
        y=Y+3*r;
    } else {
        y=Y-3*r;
    }
          var num=SVGtext(W.id+"num"+index,GetCircuitValue(data[j],"table_index"),x-r,y+1.5*r,5*r);
          num.setAttributeNS(null,"style","fill:"+pass);
          num.setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");
      }
      index++;
  }
}
function MouseOverSweep(i) {
  var id=SenseClosestCircuit(i)
  if (id==-1) return;
  var W=FSWindowList[i];
  HoverMessage=eng(GetCircuitValue(id,W.xaxis))+","+eng(GetCircuitValue(id,W.yaxis));
}
function MouseDownGraph(i,X,Y,B) {
    var W=FSWindowList[i];
    if (B&2) {
        zoomingXY=1;
        zooming_window=i;
        zoom_box=SVGrect("zoom_box",X,Y,0,0);
        return;
    }
    if (B&4) {
        panning_window_minX=W.ShowWindowMinX;
        panning_window_maxX=W.ShowWindowMaxX;
        panning_window_minY=W.ShowWindowMinY;
        panning_window_maxY=W.ShowWindowMaxY;
        panningXY=1;
        panning_window=i;
        return;
    }
}
function MouseDownXRuler(i,X,Y,B) {
    var W=FSWindowList[i];
    if (B&2) {
        zoomingX=1;
        zooming_window=i;
        zoom_box=SVGrect("zoom_box",X,W.y+TILE,0,W.h);
        return;
    }
    if (B&4) {
        panning_window_minX=W.ShowWindowMinX;
        panning_window_maxX=W.ShowWindowMaxX;
        panningX=1;
        panning_window=i;
        return;
    }
}
function MouseDownYRuler(i,X,Y,B) {
    var W=FSWindowList[i];
    if (B&2) {
        zoomingY=1;
        zooming_window=i;
        zoom_box=SVGrect("zoom_box",W.x,Y,W.w,0);
        return;
    }
    if (B&4) {
        panning_window_minY=W.ShowWindowMinY;
        panning_window_maxY=W.ShowWindowMaxY;
        panningY=1;
        panning_window=i;
        return;
    }
}
function GraphicX(i,X) {
  var W=FSWindowList[i];
  var retval=LeftGraphBoundary(i)+GraphWidth(i)*(X-W.ShowWindowMinX)/(W.ShowWindowMaxX-W.ShowWindowMinX);
  return retval;
}
function GraphicY(i,Y) {
  var W=FSWindowList[i];
  var retval=UpperGraphBoundary(i)+GraphHeight(i)*(W.ShowWindowMaxY-Y)/(W.ShowWindowMaxY-W.ShowWindowMinY);
  return retval;
}
function SenseClosestCircuit(i) {
  var W=FSWindowList[i];
  var rsquare=(W.w+W.h)/200.0;
  rsquare=rsquare*rsquare*2;
  var retval=-1;
  var data=W.content.split(",")
  var j;
  if ((endX>LeftGraphBoundary(i))&&(endX<RightGraphBoundary(i))&&(endY>UpperGraphBoundary(i))&&(endY<LowerGraphBoundary(i))) SVG.style.cursor='crosshair';
  for (j=0;j<data.length;j++) {
      var id=data[j];
      var X=GraphicX(i,GetCircuitValue(id,W.xaxis));
      var Y=GraphicY(i,GetCircuitValue(id,W.yaxis));
      var dist=(endY-Y)*(endY-Y)+(endX-X)*(endX-X);
      if (dist<=rsquare) {
          retval=id;
          break;
      }
  }
  return retval;
}

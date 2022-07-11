function ClickConfigScatterPlot(i) {
    var W=FSWindowList[i];
    openConfig(FSWindowList[i].id+"_config_sweep","","ScatterPlot Configurations!");
}
function MouseDownScatterPlot(i,X,Y,B) {
    var W=FSWindowList[i];
    var datum=SenseClosestDatum(i);
    if (datum==-1) return;
    var mouse_down_action = "";
    if (typeof W.class !== "undefined") {
        var type = W.type;
        if (typeof type.mouse_down_action !== "undefined") mouse_down_action=type.mouse_down_action;
    }
    if (typeof datum.mouse_down_action !== "undefined") mouse_down_action=datume.mouse_down_action;
    if (mouse_down_action !== "") mouse_down_action(X,Y,B)
    Redraw();
}
function DrawScatterPlotMinimized(i) {}
function InitScatterPlot(i) {
    var W=FSWindowList[i];
    W.xtitle=W.xaxis+"   ["+unit_Map[W.xaxis]+"]";
    W.ytitle=W.yaxis+"   ["+unit_Map[W.yaxis]+"]";
    W.minX=W.content.rays[0].data[0].x;
    W.minY=W.content.rays[0].data[0].y;
    W.maxX=W.content.rays[0].data[0].x;
    W.maxY=W.content.rays[0].data[0].y;
    for (i=0;i<W.content.rays.length;i++) {
        var ray=W.content.rays[i];
        var data=ray.data;
        for (j=0;j<data.length;j++) {
            var datum=data[j];
            var SampleX=datum.x;
            var SampleY=datum.y;
            if (parseFloat(SampleX)<W.minX) W.minX=SampleX;
            if (parseFloat(SampleX)>W.maxX) W.maxX=SampleX;
            if (parseFloat(SampleY)<W.minY) W.minY=SampleY;
            if (parseFloat(SampleY)>W.maxY) W.maxY=SampleY;
        }
    }
    W.spanX=parseFloat(W.maxX)-parseFloat(W.minX);
    W.spanY=parseFloat(W.maxY)-parseFloat(W.minY);
    W.ShowWindowMinX=parseFloat(W.minX)-0.05*parseFloat(W.spanX);
    W.ShowWindowMaxX=parseFloat(W.maxX)+0.05*parseFloat(W.spanX);
    W.ShowWindowMinY=parseFloat(W.minY)-0.05*parseFloat(W.spanY);
    W.ShowWindowMaxY=parseFloat(W.maxY)+0.05*parseFloat(W.spanY);
    FSWindowList[i]=W;
}
function DrawScatterGrid(i) {
    var W=FSWindowList[i];
    var minX=W.ShowWindowMinX;
    var maxX=W.ShowWindowMaxX;
    var minY=W.ShowWindowMinY;
    var maxY=W.ShowWindowMaxY;
    graph_rootX=TILE;
    graph_width=SX;
    graph_rootY=TILE;
    graph_height=SY;
    SVGrect(W.id+"graph_frame",graph_rootX,graph_rootY-graph_height,graph_width,graph_height);
    SVGclip(W.id,graph_rootX,graph_rootY-graph_height,graph_width,graph_height);
    var id=W.id;
    var frameW=graph_width/(config_frame-2);
    var frameH=graph_height/(config_frame-2);
    var xtitle=SVGtext(id+"graph_xtitle",W.xtitle,graph_rootX+graph_width/2,TILE+1.9*frameH+graph_height,frameH/2,graph_width,0.8*frameH);
    xtitle.setAttributeNS(null,"text-anchor","middle");
    var ytitle=SVGtext(id+"graph_ytitle",W.ytitle,0,0,frameW/2,graph_height,0.4*frameW);
    ytitle.setAttributeNS(null,"text-anchor","middle");
    var ytitle_e=0.1*frameW;
    var ytitle_f=TILE+frameH+graph_height/2;
    ytitle.setAttributeNS(null,"transform","matrix(0,1,-1,0,"+ytitle_e+","+ytitle_f+")");
    //   Calculate optimal grid
    var stepX=Math.pow(10,Math.trunc(Math.log10(W.spanX)))*10;
    while (W.spanX/stepX<4) {
        if (2*W.spanX/stepX>=4) {stepX=stepX/2; break;}
        if (5*W.spanX/stepX>=4) {stepX=stepX/5; break;}
        stepX=stepX/10;
    }
    var stepY=Math.pow(10,Math.trunc(Math.log10(spanY)))*10;
    while (spanY/stepY<4) {
        if (2*spanY/stepY>=4) {stepY=stepY/2; break;}
        if (5*spanY/stepY>=4) {stepY=stepY/5; break;}
        stepY=stepY/10;
    }
    var startX=Math.trunc(minX/stepX)*stepX;
    if (minX<0) startX=startX-stepX;
    while (startX<minX) startX=startX+stepX;

    var startY=Math.trunc(minY/stepY)*stepY;
    if (minY<0) startY=startY-stepY;
    while (startY<minY) startY=startY+stepY;
    var endX=Math.trunc(maxX/stepX)*stepX;
    while (endX<maxX) endX=endX+stepX;
    var endY=Math.trunc(maxY/stepY)*stepY;
    while (endY<maxY) endY=endY+stepY;
    // Plot grid
    var gridX,gridY;
    var index=0;
    gridY=Math.trunc(graph_rootY-graph_height);
    var width_limit=0.8*graph_width/((maxX-startX)/stepX);
    var height_limit=0.4*frameH;
    for (gridX=startX;gridX<=maxX;gridX=gridX+stepX) {
        var X=Math.trunc(graph_rootX+1.0*(gridX-minX)*graph_width/W.spanX);
        var line=SVGline(id+"xgrid"+index,X,graph_rootY+frameH/10,X,gridY);
        if (gridX!=0) line.setAttributeNS(null,"stroke-dasharray","5,5");
        var num=SVGnum(id+"xgrid_num"+index,eng(gridX),X,graph_rootY+frameH/2,frameH/2,width_limit,height_limit);
        num.setAttributeNS(null,"text-anchor","middle");
        index++;
    }
    width_limit=0.4*frameW;
    height_limit=0.8*graph_height/((maxY-startY)/stepY);
    gridX=Math.trunc(graph_rootX+graph_width);
    for (gridY=startY;gridY<=maxY;gridY=gridY+stepY) {
        var Y=Math.trunc(graph_rootY-1.0*(gridY-minY)*graph_height/spanY);
        var line=SVGline(id+"ygrid"+index,graph_rootX-frameW/10,Y,gridX,Y);
        if (gridY!=0) line.setAttributeNS(null,"stroke-dasharray","5,5");
        var num=SVGnum(id+"ygrid_num"+index,eng(gridY),0.5*frameW,Y+frameH/5,frameH/2,width_limit,height_limit);
        index++;
    }
    W.ShowWindowMinX=minX;
    W.ShowWindowMaxX=maxX;
    W.ShowWindowMinY=minY;
    W.ShowWindowMaxY=maxY;
    FSWindowList[i]=W;
}

function DrawScatterPlot(i) {
    var W=FSWindowList[i];
    DrawScatterGrid(i,20);
    var index=0;
    var X8,Y8,X4,Y4,X0,Y0;
    var pass8,pass4,pass0;
    var j;
    var color="black";
    var spline=0;
    var connect=1;
    var connect_color="black";
    if(typeof W.content.color !== "undefined") color=W.content.color;
    if(typeof W.content.spline !== "undefined") spline=W.content.spline;
    if(typeof W.content.connect !== "undefined") spline=W.content.connect;
    if(typeof W.content.connect_color !== "undefined") spline=W.content.connect_color;
    for (i=0;i<W.content.rays.length;i++) {
        var ray=W.content.rays[i];
        var ray_color=color;
        if (typeof ray.color !== "undefined") ray_color=ray.color;
        var ray_spline=spline;
        if (typeof ray.spline !== "undefined") ray_spline=ray.spline;
        var ray_connect=connect;
        if (typeof ray.connect !== "undefined") ray_connect=ray.connect;
        var ray_connect_color=connect_color;
        if (typeof ray.connect_color !== "undefined") ray_connect_color=ray.connect_color;
        var data=ray.data;
        var X4=0,Y4=0,X0=0,Y0=0;
        var rim_ratio=16;
        var Xroot=SX/rim_ratio;
        var Yroot=SY*(rim_ratio-1)/rim_ratio;
        var SpanX=SX*(rim_ratio-2)/rim_ratio;
        var SpanY=SY*(rim_ratio-2)/rim_ratio;
        if (ray_connect) {
            for (j=0;j<data.length;j++) {
                var datum=data[j];
                var SampleX=datum.x;
                var SampleY=datum.y;
                var X8=Math.trunc(SpanX*(SampleX-W.minX)/W.spanX)+Xroot;
                var Y8=Yroot-Math.trunc(SpanY*(SampleY-W.minY)/W.spanY);
                if (j==2) {
                    if (ray_spline) {
                        var X1=21*X0/32+14*X4/32-3*X8/32;
                        var Y1=21*Y0/32+14*Y4/32-3*Y8/32;
                        var X2=12*X0/32+24*X4/32-4*X8/32;
                        var Y2=12*Y0/32+24*Y4/32-4*Y8/32;
                        var X3=5*X0/32+30*X4/32-3*X8/32;
                        var Y3=5*Y0/32+30*Y4/32-3*Y8/32;
                        SVGgraphline(W.id+"line"+index++,X0,Y0,X1,Y1,ray_connect_color).setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");;
                        SVGgraphline(W.id+"line"+index++,X2,Y2,X1,Y1,ray_connect_color).setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");;
                        SVGgraphline(W.id+"line"+index++,X2,Y2,X3,Y3,ray_connect_color).setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");;
                        SVGgraphline(W.id+"line"+index++,X4,Y4,X3,Y3,ray_connect_color).setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");;
                    }
                    //SVGgraphline(W.id+"line"+index++,X4,Y4,X0,Y0,datum_color).setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");
                    SVGgraphline(W.id+"line"+index++,X4,Y4,X0,Y0,datum_color);
                    console.log("LINE "+X4+","+Y4+","+X0+","+Y0);
                }
                if (j>=2) {
                    if (ray_spline) {
                        var X7=21*X8/32+14*X4/32-3*X0/32;
                        var Y7=21*Y8/32+14*Y4/32-3*Y0/32;
                        var X6=12*X8/32+24*X4/32-4*X0/32;
                        var Y6=12*Y8/32+24*Y4/32-4*Y0/32;
                        var X5=5*X8/32+30*X4/32-3*X0/32;
                        var Y5=5*Y8/32+30*Y4/32-3*Y0/32;
                        SVGgraphline(W.id+"line"+index++,X4,Y4,X5,Y5,datum_color).setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");;
                        SVGgraphline(W.id+"line"+index++,X6,Y6,X5,Y5,datum_color).setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");;
                        SVGgraphline(W.id+"line"+index++,X6,Y6,X7,Y7,datum_color).setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");;
                        SVGgraphline(W.id+"line"+index++,X8,Y8,X7,Y7,datum_color).setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");;
                    }
                    //SVGgraphline(W.id+"line"+index++,X8,Y8,X4,Y4,datum_color).setAttributeNS(null,"clip-path","url(#"+W.id+"_clip)");;
                    SVGgraphline(W.id+"line"+index++,X8,Y8,X4,Y4,datum_color);
                    console.log("LINE "+X4+","+Y4+","+X8+","+Y8);
                }
                X0=X4;
                Y0=Y4;
                X4=X8;
                Y4=Y8;
            }
        }
        for (j=0;j<data.length;j++) {
            var datum=data[j];
            var SampleX=datum.x;
            var SampleY=datum.y;
            var X=Math.trunc(SpanX*(SampleX-W.minX)/W.spanX)+Xroot;
            var Y=Yroot-Math.trunc(SpanY*(SampleY-W.minY)/W.spanY);
            var r=(W.w+W.h)/200.0;
            var datum_color=ray_color;
            if (typeof datum.color !== "undefined") datum_color=datum.color;
            var circ=SVGcirc(W.id+"marker"+index++,X,Y,r);
            circ.setAttributeNS(null,"style","fill:"+datum_color);
            console.log("CIRC "+X+","+Y);
            index++;
        }
    }
}
function MouseOverScatterPlot(i) {
    var datum=SenseClosestDatum(i)
    if (datum==-1) return;
    HoverMessage=eng(datum.x)+","+eng(datum.y);
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
function SenseClosestDatum(i) {
    var W=FSWindowList[i];
    var rsquare=(SX+SY)/200.0;
    rsquare=rsquare*rsquare*2;
    var retval=-1;
    var j;
    SVG.style.cursor='crosshair';
    var min_dist=Math.sqrt(SX*SX+SY*SY);
    for (i=0;i<W.content.rays.length;i++) {
        var ray=W.content.rays[i];
        var data=ray.data;
        for (j=0;j<data.length;j++) {
            var datum=data[j];
            var SampleX=datum.x;
            var SampleY=datum.y;
            var dist=(SampleX-endY)*(SampleY-endY)+(SampleX-endX)*(SampleX-endX);
            if (dist>rsquare) continue;
            if (dist>min_dist) continue;
            retval=datum;
            min_dist=dist;
        }
    }
    return retval;
}

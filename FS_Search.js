function OpenConfigSearch() {
    var j;
    var content="<table>"
    for (j=0;j<Object.keys(SPEC).length;j++) {
        var property=Object.keys(SPEC)[j];
        content+="<tr><td>";
        content+=totext(property);
        content+="</td><td>";
        content+="<input type=\"text\" name=\"SpecInput_"+property+"\" onchange=\"SpecChanged('"+property+"')\" value=\""+SPEC[property]+"\"/>";
        content+="</td><td>";
        content+="["+unit_Map[property]+"]";
        content+="</td></tr>";
    }
    openConfig("ConfigSpec",content);
    Redraw();
}
function ClickConfigSearch(i) {
    var W=FSWindowList[i];
    OpenConfigSearch();
}
function MouseDownSearch(i,X,Y,B) {
    if (B!=1) return;
    var W=FSWindowList[i];
    var j=0;
    if ((X>W.x+W.w-TILE)&&(Y<W.y+TILE)) {
        OpenNewPlot();
        return;
    }
    for (i=0;i<circuit_table_list.length;i++) {
        if (circuit_table_list[i]==-1) continue;
        j++;
        if (X<W.x+config_rubric_width*(j+1)-config_rubric_height/2) continue;
        if (X>W.x+config_rubric_width*(j+1)) continue;
        if (Y<W.y+TILE) continue;
        if (Y>W.y+TILE+config_rubric_height/2) continue;
        circuit_list[circuit_table_list[i]].selected=0;
        circuit_table_list[i]=-1;
        if (pivot_circuit_index==i) {
            var k;
            for (k=0;k<circuit_table_list.length;k++) {
                if (circuit_table_list[k]==-1) continue;
                pivot_circuit_index=k;
                break;
            }
        }
        Redraw();
        return;
    }
    j=0;
    for (i=0;i<circuit_table_list.length;i++) {
        if (circuit_table_list[i]==-1) continue;
        j++;
        if (X<W.x+config_rubric_width*j) continue;
        if (X>W.x+config_rubric_width*(j+1)) continue;
        if (Y<W.y+TILE) continue;
        pivot_circuit_index=i;
        if (configuration_window_index!=-1) OpenNewPlot();
        Redraw();
        return;
    }
    if (PlotType!="Pareto Front") {
        for (j=0;j<FSWindowList.length;j++) {
            if (FSWindowList[j].id!="ConfigPlot") continue;
            FSWindowList[j].title="New "+PlotType+" for Circuit #"+pivot_circuit_index;
            Redraw();
        }
    }
}
function DrawSearch(index) {
    var W=FSWindowList[index];
    var i,j,k;
    var num_of_selected=0;
    for (i=0;i<circuit_list.length;i++) if (circuit_list[i].selected) num_of_selected++;
    W.w=config_rubric_width*(num_of_selected+1);
    var spec_entries=0
    for (i=0;i<Object.keys(SPEC).length;i++) if (Object.keys(SPEC)[i]!="") spec_entries++;
    W.h=(spec_entries+1)*config_rubric_height;
    FSWindowList[index]=W;
    // Draw table header
    var rubric=SVGrect(W.id+"SpecHead",W.x,W.y+TILE,config_rubric_width,config_rubric_height).style.fill=pallete[colors.window_bg];
    j=1;
    for (i=0;i<circuit_table_list.length;i++) {
        if (circuit_table_list[i]==-1) continue;
        var bg=SVGrect(W.id+"CircuitHead"+j,W.x+config_rubric_width*j,W.y+TILE,config_rubric_width,config_rubric_height);
        SVGuse(W.id+"icon_close"+j,W.x+config_rubric_width*(j+1)-config_rubric_height/2,W.y+TILE,config_rubric_height/2,config_rubric_height/2,"icon_close",48.0);
        SVGrect(W.id+"icon_close"+j,W.x+config_rubric_width*(j+1)-config_rubric_height/2,W.y+TILE,config_rubric_height/2,config_rubric_height/2);
        if (pivot_circuit_index==i) {
            bg.style.fill=pallete[colors.pivot_bg];
        } else {
            bg.style.fill=pallete[colors.window_bg];
        }
        rubric=SVGtext(W.id+"CircuitHeadText"+j,i,W.x+config_rubric_width*(j+0.5),W.y+TILE+config_rubric_height-config_rubric_height/4,config_rubric_height*3/4,config_rubric_width,config_rubric_height);
        var pass="green";
        for (k=0;k<Object.keys(SPEC).length;k++) {
            var property=Object.keys(SPEC)[k];
            if (SPEC[property]=="") continue;
            var val=circuit_list[circuit_table_list[i]][property];
            if (property_quality[property]*val<property_quality[property]*SPEC[property]) {
                pass="red";
                break;
            }
        }
        rubric.setAttributeNS(null,"style","fill:"+pass);
        rubric.setAttributeNS(null,"text-anchor","middle");
        j++;
    }
    var row;
    i=0;
    for (row=0;row<Object.keys(SPEC).length;row++) {
        var property=Object.keys(SPEC)[row];
        if (SPEC[property]=="") continue;
        SVGrect(W.id+"SpecHead"+i,W.x,W.y+TILE+config_rubric_height*(i+1),config_rubric_width,config_rubric_height).style.fill=pallete[colors.window_bg];
        var unit=unit_Map[property];
        var op=">";
        if (property_quality[property]==-1) op="<";
        var label=property+op+eng(SPEC[property])+unit;
        SVGnum(W.id+"SpecHeadText"+i,label,W.x,W.y+TILE+config_rubric_height*(i+2)-config_rubric_height/4,config_rubric_height*3/4,config_rubric_width*8/9,config_rubric_height);
        k=1;
        for (j=0;j<circuit_table_list.length;j++) {
          if (circuit_table_list[j]==-1) continue;
          var bg=SVGrect(W.id+"SpecHead"+i,W.x+k*config_rubric_width,W.y+TILE+config_rubric_height*(i+1),config_rubric_width,config_rubric_height);
          if (pivot_circuit_index==j) {
              bg.style.fill=pallete[colors.pivot_bg];
          } else {
              bg.style.fill=pallete[colors.window_bg];
          }
          var val=circuit_list[circuit_table_list[j]][property];
          var rubric=SVGnum(W.id+"SpecHeadText"+i,eng(val),W.x+(k+0.5)*config_rubric_width,W.y+TILE+config_rubric_height*(i+2)-config_rubric_height/4,config_rubric_height*3/4,config_rubric_width,config_rubric_height);
          rubric.setAttributeNS(null,"style","fill:green");
          if (property_quality[property]*val<property_quality[property]*SPEC[property]) {
              rubric.setAttributeNS(null,"style","fill:red");
          }
          rubric.setAttributeNS(null,"text-anchor","middle");
          k++;
      }
      i++;
  }
}
function DrawSearchMinimized(i) {
  SVGrect(W.id+"rect",0,config_minimized_line_y+i*TILE,TILE,TILE);
}

function InitSearch(i) {
}
function MouseOverSearch(i) {
  SVG.style.cursor='pointer';
}

function ClickConfigSchema(i) {}
function MouseOverSchema(i) {}
function MouseDownSchema(i) {}
function DrawSchemaMinimized(i) {}
function DrawSchema(i) {
    var W=FSWindowList[i];
    var j,k,l;
    for (j=0;j<SCHEMA.length;j++) {
        if (W.content!=SCHEMA[j].name) continue;
	var num_of_rows=SCHEMA[j].rows.length;
	var num_of_cols=SCHEMA[j].rows[0].length;
	var tile_width=(W.w-2*TILE)/num_of_cols;
	var tile_height=(W.h-2*TILE)/num_of_rows;
	for (k=0;k<SCHEMA[j].rows.length;k++) for (l=0;l<SCHEMA[j].rows[k].length;l++) {
	    B=SCHEMA[j].rows[k][l];
	    SVGuse(W.id+"block"+k+","+l,B.type,W.x+TILE+l*tile_width,W.y+2*TILE+k*tile_height,tile_width,tile_height);
	}
    }
}
function InitSchema(i) {}

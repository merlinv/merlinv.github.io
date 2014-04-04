/*
  Author: CDK
  Version: 1.0.0
*/
console.log("Game Loading...");
var SETTINGS = {
  GRID_SIZE: 9,
  STATES: {
    off: "on",
    on: "off"
  },
  COLOR: {
    on:  "#D31717",
    off: "#fffaf0"
  }
};
var STUFF = {
  item: function(){
    var item = document.createElement("DIV");
    item.className = "lighter-item";
    item.state = "off";
    item.style.backgroundColor = SETTINGS.STATES.off; 
    return item;
  },
  row: function(longitude){
    var row = document.createElement("DIV");
    row.className = "grid-row";
    row.items = [];
    for (var i = 0; i < SETTINGS.GRID_SIZE; i++){
      var item = this.item();
      item.setAttribute("pos-x", i);
      item.setAttribute("pos-y", longitude);
      row.items.push(item);
      row.appendChild(item);
    }
    return row;
  }
};
var LIGHTER = {
  pool: [],
  getLighterByPos: function(y,x){
    if (this.pool[y]){
      return this.pool[y][x]
    } else {
      return null;
    };
  },
  getPosOfLighter: function(lighter){
    var x = parseInt(lighter.getAttribute("pos-x"));
    var y = parseInt(lighter.getAttribute("pos-y"));
    return {x: x,y: y};
  },
  getLandOfLighter: function(lighter){
    var pos = this.getPosOfLighter(lighter);
    return [ [pos.x, pos.y + 1], [pos.x+1, pos.y+1], [pos.x+1, pos.y], [pos.x+1, pos.y-1], [pos.x, pos.y-1], [pos.x-1, pos.y-1], [pos.x-1, pos.y], [pos.x-1, pos.y+1] ]; 
  },
  init: function(){
    var grid = document.getElementsByClassName("grid-box")[0];
    for (var j = 0; j < SETTINGS.GRID_SIZE; j++){
      var row = STUFF.row(j);
      this.pool.push(row.items);
      grid.appendChild(row);
    }
  },
  finish: function(){
  }
};
window.onload = function(){
  LIGHTER.init();
  $(".lighter-item").click(function(e){
    // $(this).flip({
    //   direction: "lr",
    //   color: "#D31717",
    //   speed: "fast",
    //   onAnimation: function(){

    //   },
    //   onEnd: function(){

    //   }
    // });
    var land = LIGHTER.getLandOfLighter(this);
    $.each(land, function(_, pos){
      var lighter = LIGHTER.getLighterByPos(pos[1], pos[0]);
      if (lighter != undefined){
        lighter.state = SETTINGS.STATES[lighter.state];
        $(lighter).flip({
          direction: "lr",
          color: SETTINGS.COLOR[lighter.state],
          speed: "fast"
        })
      }
      
    })
    e.preventDefault(); 
  })
}

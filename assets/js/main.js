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
  },
  MOVE: 0
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
  updateMove: function(){
    $("#your-move").text(SETTINGS.MOVE); //update move
  },
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
  getNeighborOfLighter: function(lighter){
    var pos = this.getPosOfLighter(lighter);
    return [ [pos.x, pos.y + 1], [pos.x+1, pos.y+1], [pos.x+1, pos.y], [pos.x+1, pos.y-1], [pos.x, pos.y-1], [pos.x-1, pos.y-1], [pos.x-1, pos.y], [pos.x-1, pos.y+1] ];
  },
  init: function(){
    var that = this;
    SETTINGS.MOVE = 0;
    this.updateMove();
    var grid = document.getElementsByClassName("grid-box")[0];
    for (var j = 0; j < SETTINGS.GRID_SIZE; j++){
      var row = STUFF.row(j);
      this.pool.push(row.items);
      grid.appendChild(row);
    }
    $(".lighter-item").click(function(e){
      SETTINGS.MOVE += 1;
      that.updateMove();
      var land = LIGHTER.getNeighborOfLighter(this);
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
      });
      setTimeout(function(){LIGHTER.checkGameFinished()}, 500);
      e.preventDefault();
    })
  },
  finish: function(){
    var that = this;
    $('#my-modal').modal('show');
    $('#score').text(SETTINGS.MOVE);
    $('.grid-box').click(function(e){
      e.preventDefault();
    })
    $('#my-modal').on('hidden.bs.modal', function () {
      that.reload();
    })
  },
  reload: function(){
    $(".grid-box").empty();
    this.pool = [];
    this.init();
  },
  checkGameFinished: function(){
    var check = true;
    var pool = this.pool;
    $.each(pool, function(_, row){
      $.each(row, function(_, lighter){
        if (lighter.state == "off"){
          check = false;
          return;
        }
      })
    })
    if (check){
      this.finish();
    }
  }
};
window.onload = function(){
  LIGHTER.init();
  $("#replay").click(function(){
    LIGHTER.reload();
  })
}

/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-14 18:46:39
*/

'use strict';

Creep.prototype.chooseExoTarget = function(arrayName) {
  if(!this.memory[arrayName]) {
    var choice = this.room.memory["last_" + arrayName + "_choice"] || 0
    this.memory[arrayName] = this.room.memory[arrayName][choice]
    choice += 1
    if(choice > _.size(this.room.memory[arrayName]) - 1) {
      choice = 0
    }
    this.room.memory["last_" + arrayName + "_choice"] = choice
  }
}

Creep.prototype.setupExoReserverMemory = function() {
  this.chooseExoTarget()
}

Creep.prototype.assignExoReserverTasks = function() {
  this.setupExoReserverMemory()
  if(this.room.name === this.memory.reserve) {
    // I am in the remote room
    this.assignRemoteExoReserverTasks()
  } else if (this.room.name === this.memory.home) {
    this.assignHomeExoReserverTasks()
    // I am home
  } else {
    // I have no clue where I am

  }
}

Creep.prototype.assignHomeExoReserverTasks = function() {
  this.setMode('exop');
}

Creep.prototype.assignRemoteExoReserverTasks = function() {
  if(this.memory.mode === 'transition') {
    // this.setMode('mine')
  } else {
      if(this.memory.role === 'exo-reserver') {
        this.setMode('reserve')
      } else {
        this.setMode('claim')
      }
  }
}

Creep.prototype.doReserve = function() {
  if(this.moveCloseTo(this.room.controller.pos.x, this.room.controller.pos.y, 1)) {
    this.reserveController(this.room.controller)
  }
}

Creep.prototype.doClaim = function() {
  if(this.moveCloseTo(this.room.controller.pos.x, this.room.controller.pos.y, 1)) {
    this.claimController(this.room.controller)
  }
}

Creep.prototype.doExOp = function() {
  this.gotoRoom(this.memory.reserve)
}

/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-03 09:41:30
*/

'use strict';


Creep.prototype.setupExoTheifMemory = function() {
  this.chooseExoTarget('steal')
}

Creep.prototype.assignHomeExoTheifTasks = function() {
  if (this.carry.energy <= 0) {
    this.setMode('leave')
  } else {
    this.setMode('transfer')
  }
}

Creep.prototype.assignTravelExoTheifTasks = function() {
  if(this.mode() !== 'transition') {
    this.setMode('leave')
  }
}

Creep.prototype.assignRemoteExoTheifTasks = function() {
  if(this.mode() === 'transition') {
    // this.setMode('mine')
  } else {
    if (this.carry.energy < this.carryCapacity) {
      this.setMode('steal')
    } else if (this.carry.energy >= this.carryCapacity  && this.carryCapacity > 0) {
      this.setMode('go-home')
    }
  }
}


Creep.prototype.doSteal = function() {
  if(this.needsTarget()) {
    this.setTarget(Targeting.nearestStructure(this.pos))
  }
  if(this.hasTarget()) {
    var target = this.target()
    if(this.moveCloseTo(target.pos.x, target.pos.y, 1, true)) {
      this.dismantle(target)
    }
  } else {
    this.clearTarget()
  }
  if(this.carry.energy >= this.carryCapacity && this.carryCapacity > 0) {
    this.setMode('go-home');
  }
}


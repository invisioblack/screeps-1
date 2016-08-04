/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 02:56:12
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-03 09:40:20
*/

'use strict';

Creep.prototype.assignExcavatorTasks = function() {
  if(this.modeIs('idle')) {
    if(_.sum(this.carry) < this.carryCapacity) {
      this.setMode('excavate');
    } else {
      this.setMode('dump')
    }
  }
}

Creep.prototype.doExcavate = function() {
  if(this.needsTarget()) {
    this.setTarget(Finder.findMineral(this.room.name))
  }

  if(this.hasTarget()){
    var target = this.target()
    if(this.moveCloseTo(target.pos.x, target.pos.y, 1)) {
      this.harvest(target)
    }
  }
  if(_.sum(this.carry) >= this.carryCapacity) {
    this.setMode('stash')
    this.doStash()
  }
}

Creep.prototype.doStash = function() {
  var containers = this.pos.findInRange(FIND_STRUCTURES, 1, {filter: {structureType: STRUCTURE_CONTAINER}})
  var creep = this
  if (_.size(containers) > 0) {
    this.setMode('excavate')
    Object.keys(this.carry).forEach(function(key, index) {
      creep.transfer(containers[0], key)
    }, this.carry);
  } else {
    this.setMode('idle')
  }
}
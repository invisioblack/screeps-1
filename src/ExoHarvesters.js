/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 17:23:24
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-08 12:33:51
*/

'use strict';

StructureSpawn.prototype.getExoHarvesterBody = function(){
  var energy = this.room.energyAvailable;
  if (energy >= 1300) {
    return [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
  } else {
    return []
  }
}
StructureSpawn.prototype.exoHarvesters = function() {
  return _.filter(Game.creeps, (creep) => creep.memory.role == 'exo-harvester').length;
  // return this.memory.current_harvesters || 0
}

StructureSpawn.prototype.maxExoHarvesters = function() {
  return this.memory.max_exo_harvesters || 0
}

StructureSpawn.prototype.setMaxExoHarvesters = function() {
  if(this.room.energyCapacityAvailable >= 1300 && Memory.harvest) {
    this.memory.max_exo_harvesters = 5;
  } else {
    this.memory.max_exo_harvesters = 0;
  }
}

StructureSpawn.prototype.setExoHarvesters = function() {
  var count = _.filter(Game.creeps, (creep) => creep.memory.role == 'exo-harvester').length;
  this.memory.current_exo_harvesters = count;
}

StructureSpawn.prototype.spawnExoHarvester = function() {
  this.createCreep(this.getExoHarvesterBody(), null, {role: 'exo-harvester', mode: 'idle', home: this.room.roomName, harvest: Memory.harvest })
}
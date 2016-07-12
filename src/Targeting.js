/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-03 11:36:42
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-11 22:05:47
*/

'use strict';

var Targeting = {
  getTransferTarget: function(objects, pos) {
    var result;
    var biggest = 0;
    // This may be doable with _.maxBy()
    Object.keys(objects).forEach(function(key, index) {
      var target = Game.getObjectById(objects[key].id);
      if(target.memory) {
        if (target.memory.call_for_energy) {
          if (target.memory.call_for_energy >= biggest) {
            result = target;
            biggest = target.memory.call_for_energy
          }
        }
      } else {
       Log.warn("No Memory for: " + target.id)
      }
    }, objects);
    return result
  },

  nearestHostalCreep: function(pos) {
    var target = pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    return target;
  },

  nearestHostalSpawn: function(pos) {
    var target = pos.findClosestByRange(FIND_HOSTILE_SPAWNS)
    return target
  },

  nearestHostalStructure: function(pos) {
    return nearestNonController(pos, FIND_HOSTILE_STRUCTURES)
  },

  nearestStructure: function(pos) {
    return nearestNonController(pos, FIND_STRUCTURES)
  },

  nearestNonController: function(pos, type) {
    var target = pos.findClosestByRange(type, {
        filter: function(object) {
          return object.structureType !== 'controller';
        }
      });
    return target
  },


  nearestHostalAnything: function(pos) {
    var target = this.nearestHostalCreep(pos)
    if(target) {
      return target
    }
    target = nearestHostalSpawn(pos);
    if(target) {
      return target
    }
    target = nearestHostalStructure(pos);
    if (target) {
      return target
    }
    target = nearestStructure(pos);
    if (target) {
      return target
    }
  },

  nearByStructures: function(pos) {
    if (_.size(pos.findInRange(FIND_STRUCTURES, 1)) > 0) {
      return pos.findClosestByRange(FIND_STRUCTURES)
    }
  },

  findFullMiner: function(pos, room) {
    var creeps = _.filter(Game.creeps, function(creep) {
      return creep.my && creep.memory.mode === 'send' && creep.room.name === room.name
    })
    //console.log("g: " + creeps)
    // Log.info(JSON.stringify(creeps))
    var miner = pos.findClosestByRange(creeps)
    if (miner) {
      miner.setMode('broadcast')
    }
    return miner
  },

  findEnergyBuffer: function(pos, room) {
    var buffers = _.filter(_.union({}, room.memory.my_containers, room.memory.my_storages), function(object) {
      var structure = Game.getObjectById(object.id)
      // Log.info(JSON.stringify(structure))
      return structure.storedEnergy() >= 300 && structure.room.name === room.name;
    })
    Log.info(buffers)
    if(_.size(buffers) > 0) {
      return buffers[0]
    }
    /*var objects = []
    buffers.forEach(function(object){
      objects.push(Game.getObjectById(object));
    })
    return pos.findClosestByRange(objects) */
  },

  findEnergySource: function(pos, room) {
    var miner = Targeting.findFullMiner(pos, room)
    if (miner) {
      return miner
    } else {
      return Targeting.findEnergyBuffer(pos, room)
    }

  }

}
module.exports = Targeting;

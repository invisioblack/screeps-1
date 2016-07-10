/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 11:39:12
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-09 23:28:32
*/

'use strict';


Room.prototype.tick = function() {
  Log.debug('Ticking Room: ' + this.name + ": " + this.memory.refresh_count);
  this.refreshData();
  this.tickStuff();
  /*this.tickExtensions();
  this.tickContainers();
  this.tickStorages();
  this.tickSpawns();
  this.tickTowers() */
  this.tickCreeps(); //keep this separate
  this.report();

  return true;
};
Room.prototype.tickStuff = function() {
  var stuff = _.union({}, this.memory.my_storages, this.memory.my_containers, this.memory.my_extensions, this.memory.my_spawns, this.memory.my_towers)
  Object.keys(stuff).forEach(function(key, index) {
    var object = Game.getObjectById(this[key].id);
    object.tick();
  }, stuff);
}

Room.prototype.tickCreeps = function() {
  _.filter(Game.creeps).forEach(function(creep) {
    if(creep.my) {
      creep.tick();
    }
  });
}

Room.prototype.exoOperaitons = function() {
  return this.energyCapacityAvailable >= 1300
}

Room.prototype.resetMemory = function() {
  var spawns = this.find(FIND_MY_SPAWNS);
  this.memory.my_spawns = spawns;
  var extensions = this.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
  this.memory.my_extensions = extensions
  var containers = this.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}});
  this.memory.my_containers = containers
  var towers = this.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
  this.memory.my_towers = towers
  var storages = this.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_STORAGE}});
  this.memory.my_storages = storages
  this.findSourceSpots();
}

Room.prototype.refreshData = function() {
  if(this.memory.refresh_count <= 0 || !this.memory.refresh_count) {
    this.memory.refresh_count = 500;
    this.resetMemory();
  }
  this.memory.refresh_count -= 1;
}

Room.prototype.reset = function() {
  this.memory.refresh_count = -1;
}

Room.prototype.findSourceSpots = function() {
  var room = this;
  if(!room.memory.sources) {
    delete room.memory.sources
    var sources = room.find(FIND_SOURCES);
    var count = 0;
    var out = {}
    sources.forEach(function(source) {
        room.lookForAtArea(LOOK_TERRAIN, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true).forEach(function(spot) {
          Log.info(JSON.stringify(spot));
          if (spot.terrain === 'plain' || spot.terrain === 'swamp') {
            if(_.size(room.lookForAt(LOOK_STRUCTURES, spot.x, spot.y)) > 0 ) {
              Log.info("There seems to be a structure blocking at " + spot.x + ", " + spot.y)
            } else {

              count += 1;
              spot['source'] = source;
              out[count] = spot;
            }
          }
        })
      });
      room.memory.sources = out;
  }
}

Room.prototype.myCreeps = function() {
  return this.find(FIND_MY_CREEPS);
}

Room.prototype.cleanCreeps = function() {
  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }
}

Room.prototype.setAttack = function(room_name) {
  Memory.attack = room_name
}

Room.prototype.setHarvest = function(room_name) {
  Memory.harvest = room_name
}
Room.prototype.report = function() {
  if(this.memory.report_count <= 0 || !this.memory.refresh_count) {
    this.memory.report_count = 10;
    console.log('<span style="color: #E6DB74;">Report for room: ' + this.name +'</span>')
    console.log('<span style="color: #E6DB74;">=======================</span>')
    console.log('<span style="color: #95CA2D;">Primary Energy: ' + this.energyAvailable + " of " + this.energyCapacityAvailable)
  }
  this.memory.report_count -= 1;
}

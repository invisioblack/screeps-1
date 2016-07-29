/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-27 18:49:02
*/

'use strict';


Creep.prototype.setupExoResponderMemory = function() {
  this.chooseExoTarget('responder')
}
Creep.prototype.assignTravelExoResponderTasks = function() {
  this.setMode('move-out')
}
Creep.prototype.assignHomeExoResponderTasks = function() {
  this.setMode('move-out')
}
Creep.prototype.assignRemoteExoResponderTasks = function () {
  this.setMode('respond')
  /*if(this.hits < this.hitsMax * 0.25) {
    this.heal(this)
  }*/
}

Creep.prototype.doRespond = function() {
  var critical = this.pos.findClosestByRange(FIND_MY_CREEPS, {
    filter: function(object) {
        return object.hits < object.hitsMax * 0.50;
    }});
  if (critical) {
    if(this.heal(critical) == ERR_NOT_IN_RANGE) {
        this.moveTo(critical);
    }
    this.rangedMassAttack()
  } else {
    var target = Targeting.nearestHostalCreep(this.pos)
    if(target) {
      console.log('h')
      if(this.moveCloseTo(target.pos.x, target.pos.y, 1)) {
        this.attack(target)
      } else {
        this.rangedMassAttack()
        //this.heal(this)
      }
    } else {
      var patient = this.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: function(object) {
          return object.hits < object.hitsMax;
      }});
      if(patient) {
        if(this.heal(patient) == ERR_NOT_IN_RANGE) {
          this.moveTo(patient);
        }
        this.rangedMassAttack()
      } else {
        var flag = this.room.find(FIND_FLAGS)[0]
        if(flag) {
          this.moveCloseTo(flag.pos.x, flag.pos.y, 5)
        }
      }
    }
  }
}
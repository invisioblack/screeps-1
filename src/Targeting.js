/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-03 11:36:42
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-03 12:15:49
*/

'use strict';

var Targeting = {
  getTransferTarget: function(objects) {
    var result;
    var biggest = 0;
    Object.keys(objects).forEach(function(key, index) {
      var target = Game.getObjectById(objects[key].id);
      if (target.memory.call_for_energy) {
        if (target.memory.call_for_energy >= biggest) {
          result = target;
          Log.info("New Target: " + target.id)
          biggest = target.memory.call_for_energy
        }
      }
    }, objects);
    return result
  }
}
module.exports = Targeting;

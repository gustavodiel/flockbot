
module.exports = function(robot) {
  // translates the room id into the room name
  robot.getRoomName = (roomId) => {
    if (robot.adapterName !== 'slack') {
      return roomId;
    }
    return robot.adapter.client.rtm.dataStore.getChannelById(roomId).name;
  };

};

const config = require("./config.json");
const fs = require('fs');
const twilio = require('twilio');
const client = twilio(config.twilio.accountSid, config.twilio.authToken);
const AccessToken = twilio.jwt.AccessToken;
const roomFilename = "./room.json";


(async function(){
  var roomName = "TwentyThreeTest" + ((new Date)*1);
  const twilioToom = await client.video.rooms
    .create({
      type: config.twilio.roomType,
      uniqueName: roomName
    })

  //
  var room = {
    roomName,
    roomType:config.twilio.roomType
  };
  

  //
  const videoGrant = new AccessToken.VideoGrant({room: roomName});
  for(identity of ['broadcaster', 'participant']) {
    var token = new AccessToken(
      config.twilio.accountSid,
      config.twilio.apiKey,
      config.twilio.apiSecret,
      {identity}
    );
    token.addGrant(videoGrant);
    room[identity+'Token'] = token.toJwt();
  }
  
  //
  console.log(room);
  fs.writeFileSync(roomFilename, JSON.stringify(room, null, 4));
  
})();

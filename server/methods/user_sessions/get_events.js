Meteor.methods({
  async getEvents(sessionId) {

    async function findLogs() {
       return VisitorSession.find({
      'sessionId': sessionId
    }, {
      sort: {
        'createdOn': -1
      }
    }).fetch();
  };

  const result = await findLogs().then(function(res) {
    var logLines = [];
    res.forEach((element) => {
      logLine = new Object();
      logLine.sessionId = element.sessionId;
      logLine.timeString = moment(element.createdOn).format('MM-DD-YYYY HH:mm:ss');
      logLine.logEvent = element.logEvent+`\n\n`;
      logLines.push(logLine);
    });
    return logLines
  }).catch(function(err){
    console.log(err);
  });
    return result
  }

})

(function() {

  'use_strict';

  return {

  requests: {

    getRequesterInfo: function(requesterID) {
      return {
        // url: '/api/v2/users/'+requesterID+'.json',
        url: '/api/v2/users/12345.json',        
        type: 'GET'
      };
    }
  },


  events: {
    'app.activated' : 'init',
    'ticket.status.changed':  'ticketStatusChanged',
    'ticket.subject.changed':  'ticketSubjectChanged',
//    'ticket.requester.id.changed': 'ticketRequesterIdChanged'
    'ticket.tags.changed': 'ticketTagsChanged',

    'getRequesterInfo.done': 'getRequesterInfoDone',
    'getRequesterInfo.fail': 'getRequesterInfoFail'
    // 'getRequesterInfo.always': 'getRequesterInfoAlways'
  },

    init: function(){
      console.log(this.settings);
      this.switchTo('start', {
        typeOfSweet: this.settings.type_of_sweets
      });
    },

    ticketStatusChanged: function() {
      console.log('in ticketStatusChanged()');
    },
    
// switch to candy template if subject contains "candy" //
    ticketSubjectChanged: function() {
      console.log('in ticketSubjectChanged()');
      var ticketSubject = this.ticket().subject();
      console.log ('ticket subject: ', ticketSubject);
      if (ticketSubject.indexOf("candy") !== -1) {
        console.log ('subject contains candy');
        this.switchTo ('candy');
//        var newTicketSubject = ticketSubject.replace("candy", "CANDY");
//        console.log('new ticket subject: ', newTicketSubject);
//        this.ticket().subject(newTicketSubject);
      }
      else {
        this.init();
      }
    },

// this doesn't seem to ever happen ... 
    ticketRequesterIdChanged: function() {
      console.log('in ticketRequesterIdChanged()');
    },


    ticketTagsChanged: function() {
      console.log('in ticketTagsChanged()');
      var ticketRequester = this.ticket().requester();
// request for requester info
      this.ajax('getRequesterInfo', ticketRequester.id());      
    },

    getRequesterInfoDone: function(data){
      console.log ("in getRequesterInfoDone"); 
      console.log ("GET request succeeded!");     
      console.log (data);
      this.switchTo('currentrequester', {
       currentTicketRequester: data.user.name,
       currentTicketRequesterpicture: data.user.photo.content_url
      });
    },

    getRequesterInfoFail: function(data){
      console.log ("in getRequesterInfoFail");
      console.log ("GET request failed!");
      console.log (data);
      this.switchTo('error', {
       errorcode: data.status,
       errortext: data.statusText
      });

    },

    // getRequesterInfoAlways: function(){
    //   console.log ("in getRequesterInfoAlways");
    // },    

    
    hello: function( textToDisplay ){
      console.log(textToDisplay);
    }
  };
}());
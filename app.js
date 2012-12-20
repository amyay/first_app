(function() {

  'use_strict';

  return {

  requests: {

    getRequesterInfo: function(requesterID) {
      return {
        url: '/api/v2/users/'+requesterID+'.json',
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

    'getRequesterInfo.done': 'getRequesterInfoDone'
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

    ticketRequesterIdChanged: function() {
      console.log('in ticketRequesterIdChanged()');
    },

    ticketTagsChanged: function() {
      console.log('in ticketTagsChanged()');
      var ticketRequester = this.ticket().requester();
      this.ajax('getRequesterInfo', ticketRequester.id());

// somehow figure out how to do REST API get, grab the photo URL and dump it
      
    },

    getRequesterInfoDone: function(data){
      console.log (data);
      this.switchTo('currentrequester', {
       currentTicketRequester: data.user.name,
       currentTicketRequesterpicture: data.user.photo.content_url
      });
    },

    
    hello: function( textToDisplay ){
      console.log(textToDisplay);
    }
  };
}());
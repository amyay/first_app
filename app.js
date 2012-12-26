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
    'ticket.requester.id.changed': 'ticketRequesterIdChanged',
    'ticket.tags.changed': 'ticketTagsChanged',

    'getRequesterInfo.done': 'getRequesterInfoDone',
    'getRequesterInfo.fail': 'getRequesterInfoFail'
  },

    init: function(){
      console.log(this.settings);
      this.switchTo('start', {
        your_choice_of_sweet: this.I18n.t('start.choice_of_sweet'),
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
        this.switchTo ('candy', {
          subject_line: this.I18n.t('candy.subject_line')
        });
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
      var ticketTags = this.ticket().tags();
      console.log (ticketTags);
      if (ticketTags.indexOf ("induce_error") !== -1) {
        console.log ("tags consists of induce_error");
        this.ajax('getRequesterInfo', 12345);        
      }
      else {
        console.log ("tags are fine, go ahead and GET requester info ...");
        this.ajax('getRequesterInfo', ticketRequester.id());              
      }
    },

    getRequesterInfoDone: function(data){
      console.log ("in getRequesterInfoDone"); 
      console.log ("GET request succeeded!");     
      console.log (data);
      this.switchTo('currentrequester', {
        current_user: this.I18n.t ('currentRequester.current_user'),
        currentTicketRequester: data.user.name,
        currentTicketRequesterpicture: data.user.photo.content_url
      });
    },

    getRequesterInfoFail: function(data){
      console.log ("in getRequesterInfoFail");
      console.log ("GET request failed!");
      console.log (data);
      this.switchTo('error', {
        error: this.I18n.t('error_text.error'), 
        not_found: this.I18n.t('error_text.not_found'), 
        errorcode: data.status,
        errortext: data.statusText,
        try_again: this.I18n.t('error_text.try_again')
      });
    },
    
    hello: function( textToDisplay ){
      console.log(textToDisplay);
    }
  };
}());
(function() {

  'use_strict';

  return {

  requests: {

    getRequesterInfo: function(requesterID) {
      return {
        url: '/api/v2/users/'+requesterID+'.json',
        type: 'GET'
      };
    },

    tagSearch: function (tagString) {
      return {
        url: '/api/v2/search.json?query=tag:"'+tagString+'"',
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
    'getRequesterInfo.fail': 'getRequesterInfoFail',

    'tagSearch.done' : 'tagSearchDone',
    'tagSearch.fail' : 'tagSearchFail'
  },

    init: function(){
      console.log ('in init function()');
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
      console.log (ticketTags, ticketTags.length);
      if (ticketTags.indexOf ("induce_error") !== -1) {
        console.log ("tags consists of induce_error");
        this.ajax('getRequesterInfo', 12345);        
      }
      else {
        console.log ("tags are fine, go ahead and GET requester info ...");
        var showSimilarlyTaggedTickets = this.ticket().customField("custom_field_22060718");
        console.log ("selected " + showSimilarlyTaggedTickets + " for 'show similarly tagged tickets'");
        if (showSimilarlyTaggedTickets == "yes") {
          var tagString = "";
          for (var i = 0; i < ticketTags.length; i++) {
            tagString = tagString + ticketTags[i] + "+";
          }
          console.log ("tags in string: ", tagString);
          this.ajax('tagSearch', tagString);
        }
        else {
          this.ajax('getRequesterInfo', ticketRequester.id());                        
        }
      }
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

    tagSearchDone: function(data){
      console.log ("in tagSearchDone"); 
      console.log ("GET for search request succeeded!");     
      console.log (data);
      // this.switchTo('currentrequester', {
      //  currentTicketRequester: data.user.name,
      //  currentTicketRequesterpicture: data.user.photo.content_url
      // });
    },

    tagSearchFail: function(data){
      console.log ("in tagSearchFail");
      console.log ("GET for search request failed!");
      console.log (data);
      // this.switchTo('error', {
      //  errorcode: data.status,
      //  errortext: data.statusText
      // });
    },

    
    hello: function( textToDisplay ){
      console.log(textToDisplay);
    }
  };
}());
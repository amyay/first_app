(function() {

  'use_strict';

  return {

  requests: {

    // GET current requester by user ID
    getRequesterInfo: function(requesterID) {
      return {
        url: '/api/v2/users/'+requesterID+'.json',
        type: 'GET'
      };
    },

    // search similarly tagged items (not limited to tickets)
    tagSearch: function (tagString) {
      return {
        url: '/api/v2/search.json?query=tags:"'+tagString+'"',
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
      this.switchTo('start', {
        typeOfSweet: this.settings.type_of_sweets
      });
    },

    // this doesn't seem to ever happen ...
    ticketStatusChanged: function() {
    },

    // switch to candy template if subject contains "candy"
    ticketSubjectChanged: function() {
      var ticketSubject = this.ticket().subject().toLowerCase();
      if (ticketSubject.indexOf("candy") !== -1) {
        this.switchTo ('candy');
      }
      else {
        this.init();
      }
    },

    // this doesn't seem to ever happen ...
    ticketRequesterIdChanged: function() {
    },

    // if custom field "show similiar tagged items" is not selected, show current requester info
    // otherwise, show a list of similiarly tagged items
    ticketTagsChanged: function() {
      var ticketRequester = this.ticket().requester();
      var ticketTags = this.ticket().tags();
      // self-induce error: if tag contains "induce_error"
      // give it a bogus requester ID to induce error
      if (ticketTags.indexOf ("induce_error") !== -1) {
        this.ajax('getRequesterInfo', 12345);
      }
      // not inducing error, so carry on to check to see if search is needed
      else {
        var showSimilarlyTaggedItems = this.ticket().customField("custom_field_"+this.settings.similarly_tagged_ID);
        // if search is needed, then grab all tags and do search
        if (showSimilarlyTaggedItems == "yes") {
          var tagString = "";
          for (var i = 0; i < ticketTags.length; i++) {
            tagString = tagString + ticketTags[i] + "+";
          }
          // if tagline contains something, go search
          if (tagString.length > 0) {
            this.ajax('tagSearch', tagString);
          }
          // if there are no tags, don't bother searching at all
          else {
            this.init();
          }
        }
        // no need to search, just grab requester info
        else {
          this.ajax('getRequesterInfo', ticketRequester.id());
        }
      }
    },

    getRequesterInfoDone: function(data){
      // check to see if requester has photo or not
      var userPhotoURL;
      if (data.user.photo == null) {
        // generic user photo
        userPhotoURL = "https://i0.wp.com/trial.zendesk.com/images/frame_user.png?ssl=1";
      }
      else {
        userPhotoURL = data.user.photo.content_url;
      }
      this.switchTo('currentrequester', {
        currentTicketRequester: data.user.name,
        currentTicketRequesterPicture: userPhotoURL
      });
    },

    getRequesterInfoFail: function(data){
      this.switchTo('error', {
        error_reason: this.I18n.t('error_text.requester_not_found'),
        errorcode: data.status,
        errortext: data.statusText
      });
    },

    tagSearchDone: function(data){
      this.switchTo('tagsearch', {
        ticketTags: this.ticket().tags(),
        tagSearchResults: data.results
       });
    },

    tagSearchFail: function(data){
      this.switchTo('error', {
        error_reason: this.I18n.t('error_text.tag_search'),
        errorcode: data.status,
        errortext: data.statusText
      });
    }

  };
}());
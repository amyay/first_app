(function() {

	'use_strict';

	return {

		events: {
			'app.activated' : 'init',
			'ticket.status.changed':  'ticketStatusChanged',
			'ticket.subject.changed':  'ticketSubjectChanged',
			'ticket.requester.id.changed': 'ticketRequesterIdChanged'
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
//				var newTicketSubject = ticketSubject.replace("candy", "CANDY");
//				console.log('new ticket subject: ', newTicketSubject);
//				this.ticket().subject(newTicketSubject);
			}
			else {
				this.init();
			}
		},

		ticketRequesterIdChanged: function() {
			alert ('in ticketRequesterIdChanged()');
			console.log('in ticketRequesterIdChanged()');
			var ticketRequester = this.ticket().requester();

// somehow figure out how to do REST API get, grab the photo URL and dump it
			this.switchTo('currentrequester', {
				currentTicketRequester: ticketRequester.name()
			});
		},


		
		hello: function( textToDisplay ){
			console.log(textToDisplay);
		}
	};
}());
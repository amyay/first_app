(function() {

	'use_strict';

	return {

		events: {
			'app.activated' : 'init'
		},

		init: function(){
			this.switchTo('start', {
				typeOfSweet: this.settings.type_of_sweets
			});
		}
	};

}());
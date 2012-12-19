(function() {

	'use_strict';

	return {
	
		events: {
			'app.activated' : 'init'
		},
		
		init: function(){
//			alert('hello');
			this.switchTo('start', {
				typeOfSweet: this.settings.type_of_sweets
			});
		}
	
	};

}());
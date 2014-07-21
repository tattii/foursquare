/**
 *	Foursquare.js 
 *
 *	require JQuery
 */


var Foursquare = (function(){
	var apiUrl = 'https://api.foursquare.com/v2/';
	var authUrl = 'https://foursquare.com/oauth2/';
	var access_token;
	

	// get access token
	function _init(){
		var query = _getAnchorQuery();
		if ( query.access_token ){
			access_token = query.access_token;
			console.log("authentication successed");

		}else if ( query.error ){
			console.log("authentication faild");
		}
	}

	// redirect to 4sq auth
	function authenticate(client_id) {
		if (! access_token ){
			var redirect = window.location.href;
			var url = authUrl + 
				'authenticate?response_type=token&client_id=' + client_id +
				'&redirect_uri=' + encodeURIComponent(redirect) +
				'&state=' + encodeURIComponent('users/self');
				window.location.href = url;
		}
	}

	function _getAnchorQuery() {
		var result = {};
		if( window.location.hash ){
			var query = window.location.hash.substring( 1 );
			var parameters = query.split('&');

			for( var i = 0; i < parameters.length; i++ ){
				var element = parameters[ i ].split( '=' );
				result[ decodeURIComponent(element[0]) ] = decodeURIComponent(element[1]);
			}
		}
		return result;
	}

	// get api request
	function getRequest(query, callback) {
		var query = query 
			+ ((query.indexOf('?') > -1) ? '&' : '?') 
			+ 'oauth_token=' + access_token + '&v=' + _today() +  '&callback=?';
		$.getJSON(apiUrl + query, {}, callback);
	}

	function _today(){
		var date = new Date;
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDate();

		return y
			+ (( m < 10 ) ? '0' + m : m)
			+ (( d < 10 ) ? '0' + d : d);
	}

	_init();

	return {
		access_token: access_token,
		authenticate: function(id){
			authenticate(id);
		},
		getRequest: function(query, callback){
			getRequest(query, callback);
		}
	};
});



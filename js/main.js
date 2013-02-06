/**
 * Main.js
 */
 require.config({
 	paths: {
    jquery: 'libs/jquery/jquery',
    underscore: 'libs/underscore/underscore',
    backbone: 'libs/backbone/backbone'
 	}
 });


 require(['app'], function(App){
 	console.log('here');
 		App.initialize();
 });
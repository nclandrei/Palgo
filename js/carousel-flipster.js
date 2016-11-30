$(function(){

    // Electron's UI library. We will need it for later.

    var shell = require('shell');


    // Fetch the recent posts on Tutorialzine.

    var ul = $('.flipster ul');

    // Initialize the flipster plugin.

    $('.flipster').flipster({
        style: 'carousel'
    });
});
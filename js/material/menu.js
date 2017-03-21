const remote = require('electron').remote;
const Menu = require('electron').remote.require('menu');
const MenuItem = require('electron').remote.require('menu-item');

let menu = new Menu();

menu.append(new MenuItem({
  label: 'Delete',
  click: function() {
    alert('Deleted')
  }
}));

menu.append(new MenuItem({
  label: 'More Info...',
  click: function() {
    alert('Here is more information')
  }
}));

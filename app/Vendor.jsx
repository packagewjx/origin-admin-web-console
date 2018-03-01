// Modernizr
import '../bower_components/modernizr/modernizr.custom.js';
// jQuery
import '../bower_components/jquery/dist/jquery.js';
// jQuery-Storage-API
import '../bower_components/jQuery-Storage-API/jquery.storageapi.js';
// jquery.easing
import '../bower_components/jquery.easing/js/jquery.easing.js';
// Whirl
import '../bower_components/whirl/dist/whirl.css';
// Animo
import '../bower_components/animo.js/animo.js';
// Font Awesome
import '../bower_components/fontawesome/css/font-awesome.min.css';
// Animate.CSS
import '../bower_components/animate.css/animate.min.css';
// Simple line icons
import '../bower_components/simple-line-icons/css/simple-line-icons.css';
// Localization
import '../bower_components/jquery-localize-i18n/dist/jquery.localize.js';
// Datatables
$.fn.dataTable = require('datatables.net-bs')(window, $);
require('datatables.net-buttons')(window, $);
require('datatables.net-buttons-bs')(window, $);
require('datatables.net-responsive')(window, $);
require('datatables.net-responsive-bs')(window, $);
require('datatables.net-buttons/js/buttons.colVis.js')(window, $); // Column visibility
require('datatables.net-buttons/js/buttons.html5.js')(window, $); // HTML 5 file export
require('datatables.net-buttons/js/buttons.flash.js')(window, $); // Flash file export
require('datatables.net-buttons/js/buttons.print.js')(window, $); // Print view button
import '../bower_components/dataTables.fontAwesome/index.css';
// Spinkit
import '../bower_components/spinkit/css/spinkit.css';
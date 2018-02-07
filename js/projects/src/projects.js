'use strict';

/**
 * View and filter projects
 * @author Alex O'Callaghan
 */


const Vue = require('vue');
const Projects = require('./Projects.vue');

// Create Vue instance
// - Replace #projects DOM element
// - With Projects.vue Vue component
new Vue({
  el: '#projects',
  render: function (h) { return h(Projects); },
});

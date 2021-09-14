import _ from 'lodash';

/**
 * GLOBAL is defined in a <script> tag on the HTML page.  How to make it
 * available to TS?  Use declare!
 */
declare var GLOBAL: string;

console.log(_.shuffle([1, 2, 3, 4, 5, 6]));

// With global's type declared, this works.
console.log(GLOBAL);

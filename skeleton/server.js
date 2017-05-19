/* Scraper Template  (18.10) 
 * ========================= */


// Students: Using this skeleton, the cheerio documentation,
// and what you've learned in class so far, scrape a website
// of your choice, save it in a result array, and log it to the console.


// Dependencies:

// Snatches HTML from URLs
var request = require('request');
// Scrapes our HTML
var cheerio = require('cheerio');

// Make a request call to grab the HTML body from the site of your choice
request('http://tvtropes.org/pmwiki/pmwiki.php/Main/TheGlassesComeOff', function (error, response, html) {

	// Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  var result = [];

  // Select each instance of the HTML body that you want to scrape
  // NOTE: Cheerio selectors function similarly to jQuery's selectors, 
  // but be sure to visit the package's npm page to see how it works
  $('div.folder').each(function(i, element){

    var entry = $(element).children().text();

    // Save these results in an object that we'll push into the result array we defined earlier
    result.push({
      entry: entry
    });
    });
  console.log(result);
});

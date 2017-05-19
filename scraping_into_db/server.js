/* Scraping into DB (18.2.5)
 * ========================== */


/* Students: Using the tools and techniques you learned so far,
 * you will scrape a website of your choice, then place the data
 * in a MongoDB database. Be sure to make the database and collection
 * before running this exercise.
 
 * Consult the assignment files from earlier in class
 * if you need a refresher on Cheerio. */


// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");


// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
    console.log("Database Error:", error);
});


// Main route (simple Hello World Message)
app.get("/", function(req, res) {
    res.send("Hello world");
});


/* TODO: make two more routes
 * -/-/-/-/-/-/-/-/-/-/-/-/- */

// Route 1
// =======
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)

app.get("/all", function(req, res) {
    db.scraped.find({}, function(err, data){
    	res.json(data);
    });
});


// Route 2
// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?

app.get("/scrape", function(req, res) {
    // First, tell the console what server.js is doing
    console.log("\n***********************************\n" +
        "Grabbing every thread name and link\n" +
        "from reddit's webdev board:" +
        "\n***********************************\n");


    // Making a request call for reddit's "webdev" board. The page's HTML is saved as the callback's third argument
    request("https://www.reddit.com/r/webdev", function(error, response, html) {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(html);

        // An empty array to save the data that we'll scrape
        var result = [];

        // With cheerio, find each p-tag with the "title" class
        // (i: iterator. element: the current element)
        $("p.title").each(function(i, element) {

            // Save the text of the element (this) in a "title" variable
            var title = $(this).text();

            // In the currently selected element, look at its child elements (i.e., its a-tags),
            // then save the values for any "href" attributes that the child elements may have
            var link = $(element).children().attr("href");

            // Save these results in an object that we'll push into the result array we defined earlier
            result.push({
                title: title,
                link: link
            });
            
        });
        db.scraped.insert(result);
        // Log the result once cheerio analyzes each of its selected elements
        // console.log(result);

    });
});

/* -/-/-/-/-/-/-/-/-/-/-/-/- */


// Listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});
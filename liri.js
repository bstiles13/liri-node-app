//When node is used on the command line:
//"search" will determine the api to call
//"name" will give the api a parameter
var search = process.argv[2];
var name = process.argv[3];

//Initiating Request and File System modules
var request = require('request');
var fs = require('fs');

//If the user calls "do-what-it-says" at argv[2] in the command line, the random.txt file will determine the api
if (search === "do-what-it-says") {
    fs.readFile('random.txt', 'utf8', function(err, res) {
        console.log(res);
        var split = res.split(",");
        search = split[0];
        name = split[1];
        start();
    });
    //Otherwise compare argv[2] to three possible cases (twitter, spotify, or omdb) in the start function
} else {
    start();
}


function start() {
    switch (search) {
        case "my-tweets":
            twitter();
            break;

        case "spotify-this-song":
            spotify();
            break;

        case "movie-this":
            movie();
            break;
    }
}

//Initiate Spotify api when "spotify-this-song" case is called in terminal
function spotify() {
    var track = name;

    //If a track is not specified at argv[3], search parameters default to The Sign by Ace of Base
    if (name === undefined) {
        track = "the+sign";
        var artist = "ace+of+base";
    } else {
        var artist = "";
    }

    //The object that tells Spotify what track to return information for
    var options = {
        url: 'https://api.spotify.com/v1/search?q=track:' + track + '%20artist:' + artist + '&type=track&limit=1',
        method: 'GET'
    };
    // console.log(JSON.stringify(options));

    //Sending request to Spotify and storing subsequent callback data
    request(options, function(err, res, body) {
        var json = JSON.parse(body);
        // console.log(body);
        //Filtering specific callback data into variables
        var artist = 'Artist: ' + json.tracks.items[0].artists[0].name;
        var track = 'Track: ' + json.tracks.items[0].name;
        var preview = 'Preview: ' + json.tracks.items[0].external_urls.spotify;
        var album = 'Album: ' + json.tracks.items[0].album.name;

        //Calling varibles in terminal
        console.log(artist);
        console.log(track);
        console.log(preview);
        console.log(album);

        //Appending data to log.txt
        fs.appendFile('log.txt', '\n' + artist + '\n' + track + '\n' + preview + '\n' + album + '\n');
    })
}

//Initiate OMDB api when "movie-this" case is called in terminal
function movie() {
    var movie = name;

    //The object that tells OMDB what movie to return information for
    var options = {
        url: 'http://www.omdbapi.com/?t=' + movie,
        method: 'GET'
    };

    //Sending request to OMDB and storing subsequent callback data
    request(options, function(err, res, body) {
        var json = JSON.parse(body);

        // console.log(body);
        //Filtering specific callback data into variables
        var title = 'Title: ' + json.Title;
        var year = 'Year: ' + json.Year;
        var rating = 'IMDB Rating: ' + json.imdbRating;
        var country = 'Country: ' + json.Country;
        var language = 'Language: ' + json.Language;
        var plot = 'Plot: ' + json.Plot;
        var actors = 'Actors: ' + json.Actors;
        var rotten = 'Rotten Tomatoes: ' + json.Ratings[1].Value;

        //Calling varibles in terminal
        console.log(title);
        console.log(year);
        console.log(rating);
        console.log(country);
        console.log(language);
        console.log(plot);
        console.log(actors);
        console.log(rotten);

        //Appending data to log.txt
        fs.appendFile('log.txt', '\n' + title + '\n' + year + '\n' + rating + '\n' + country + '\n' + language + '\n' + plot + '\n' + actors + '\n' + rotten + '\n');
    })


}

//Initiate Twitter api when "my-tweets" case is called in terminal
function twitter() {
    var Twitter = require('twitter');
    var keys = require('./keys.js');

    //The object that tells Twitter what movie to return information for    
    var client = new Twitter(keys.twitterKeys);

    var params = {
        screen_name: 'brandonthecoder'
    };

    //Sending request to Twitter and storing subsequent callback data
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            // console.log(tweets);
            //Console logging and appending all tweets under 'brandonthecoder' up to 20 tweet limit
            for (var i = 0; i < Math.min(tweets.length, 19); i++) {
                var date = 'Tweet #' + (i + 1) + ' - ' + tweets[i].created_at;
                var tweet = tweets[i].text;

                console.log(date);
                console.log(tweet);
                fs.appendFile('log.txt', '\n' + date + '\n' + tweet + '\n');
            }
        }
    });

}
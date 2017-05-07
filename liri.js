var search = process.argv[2];
var name = process.argv[3];

var request = require('request');
var fs = require('fs');

if (search === "do-what-it-says") {
    fs.readFile('random.txt', 'utf8', function(err, res) {
        console.log(res);
        var split = res.split(",");
        search = split[0];
        name = split[1];
        start();
    });
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

function spotify() {
    var track = name;
    console.log(track);
    if (name === undefined) {
    	track = "the+sign";
    	var artist = "ace+of+base";
    } else {
    	var artist = "";
    }
    console.log(track);
    console.log(artist);
    var options = {
        url: 'https://api.spotify.com/v1/search?q=track:' + track + '%20artist:' + artist + '&type=track&limit=1',
        method: 'GET'
    };
    // console.log(JSON.stringify(options));

    request(options, function(err, res, body) {
        var json = JSON.parse(body);
        // console.log(body);
        var artist = 'Artist: ' + json.tracks.items[0].artists[0].name;
        var track = 'Track: ' + json.tracks.items[0].name;
        var preview = 'Preview: ' + json.tracks.items[0].external_urls.spotify;
        var album = 'Album: ' + json.tracks.items[0].album.name;

        console.log(artist);
        console.log(track);
        console.log(preview);
        console.log(album);
        fs.appendFile('log.txt', '\n' + artist + '\n' + track + '\n' + preview + '\n' + album + '\n');
    })
}

function movie() {
    var movie = name;

    var options = {
        url: 'http://www.omdbapi.com/?t=' + movie,
        method: 'GET'
    };

    request(options, function(err, res, body) {
        var json = JSON.parse(body);

        // console.log(body);
        var title = 'Title: ' + json.Title;
        var year = 'Year: ' + json.Year;
        var rating = 'IMDB Rating: ' + json.imdbRating;
        var country = 'Country: ' + json.Country;
        var language = 'Language: ' + json.Language;
        var plot = 'Plot: ' + json.Plot;
        var actors = 'Actors: ' + json.Actors;
        var rotten = 'Rotten Tomatoes: ' + json.Ratings[1].Value;

        console.log(title);
        console.log(year);
        console.log(rating);
        console.log(country);
        console.log(language);
        console.log(plot);
        console.log(actors);
        console.log(rotten);
        fs.appendFile('log.txt', '\n' + title + '\n' + year + '\n' + rating + '\n' + country + '\n' + language + '\n' + plot + '\n' + actors + '\n' + rotten + '\n');
    })


}

function twitter() {
    var Twitter = require('twitter');
    var keys = require('./keys.js');

    var client = new Twitter(keys.twitterKeys);

    var params = {
        screen_name: 'brandonthecoder'
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            // console.log(tweets);
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
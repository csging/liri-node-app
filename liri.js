require("dotenv").config();

// Node module imports needed to run the functions
var fs = require("fs"); //reads and writes files
var request = require("request");
var keys = require("./keys.js");
var Twitter = require("twitter"); //Twiiter
var Spotify = require('node-spotify-api');
var spotify = require("spotify"); //Spotify
var menu = process.argv[2];
// var songName = process.argv[3];
var movieName = '';
var songName = '';
// var spotify = new Spotify(keys.spotify);
var search = '';

switch (menu) {
    case "my-tweets":
        myTweets();
        break;
    case "spotify-this-song":
        spotifyThis();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("enter a command: <add a '+' for any spaces>");
        console.log("my-tweets");
        console.log("movie-this <movie+name>");
        console.log("spotify-this-song <song+name>")
        console.log("do-what-it-says");
}

function myTweets() {
    fs.appendFile('./log.txt', 'User Command: node liri.js my-tweets\n\n', (err) => {
        if (err) throw err;
    });

    console.log("ALL YOUR TWEETS ARE BELONG TO US");
    var screenName = { screen_name: 'chrisralis', count: 20 };
    var client = new Twitter({
        consumer_key: 'kWwBxfb6D1GeqN5BSizNtSQOP',
        consumer_secret: 'V584vMrbb2CqTpucuE1IwGjDihzqhUg0qDH67sUY00wuIjF0JR',
        access_token_key: '980918148860862464-LuZu8QlhMT7MmIDfE4FzywowAIzXII4',
        access_token_secret: 'tWsp4jJz64LTjgmZ4Rjpb31DSHPVIWTVFox6UWpaoxJi2',
    });
    // var params = { screen_name: 'nodejs' };
    client.get('statuses/user_timeline', screenName, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                var status = tweets[i].text;
                // var name = tweets[i].screen_name;
                // console.log(name + ": ")
                console.log("Status: " + status);
                var created = tweets[i].created_at;
                console.log("created: " + created);
            }
        } else console.log("errrrrrrrrrrrrrrrrrrrr")
    });
}

function spotifySearch(songName) {
    fs.appendFile('./log.txt', 'User Command: spotifySearch\n\n', (err) => {
        if (err) throw err;
    });

    // songName = songName.split(' ').join('+');
    var spotify = new Spotify({
        // // keys.spotify;
        // id: process.env.SPOTIFY_ID,
        // secret: process.env.SPOTIFY_SECRET
        id: '465a6a4eb701493aa572fc82f3f343d5',
        secret: 'f459a3c9caa440a2a42db59c2901e404',
    });
    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
        } else {

            for (i = 0; i < data.tracks.items.length; i++) {
                var song = data.tracks.items[i];
                var artist = song.artists[0].name;
                var title = song.name;
                var url = song.preview_url;
                var album = song.album.name;

                console.log("Song: " + title);
                console.log("Artist: " + artist);
                console.log("Preview URL: " + url);
                console.log("Album: " + album);
                console.log("~~~~~~~~~~~~^~~~~~~~~~~~~");
            }
        }
    });
}

function spotifyThis(songName) {
    fs.appendFile('./log.txt', 'User Command: node liri.js spotify-this\n\n', (err) => {
        if (err) throw err;
    });

    // songName = songName.split(' ').join('+');
    var songName = process.argv[3];
    if (songName === undefined) { songName = 'the sign'; }
    console.log("Spotifty THIS: " + songName);
    spotifySearch(songName);
}

function movieThis(movieName) {
    // movieName = movieName.split(' ').join('+');
    fs.appendFile('./log.txt', 'User Command: node liri.js movie-this\n\n', (err) => {
        if (err) throw err;
    });

    var movieName = process.argv[3];
    console.log("search THIS: movie: " + movieName);
    if (movieName === undefined) { movieName = 'Mr Nobody'; }

    // Create an empty variable for holding the movie name
    // var movieName = "";

    var queryUrl = "http://www.omdbapi.com/?apikey=bbdfcba5&t=" + movieName;
    console.log(queryUrl);

    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {
            var info = JSON.parse(body);
            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            var title = info.Title;
            var year = info.Year;
            var imdbRating = info.imdbRating;
            var rottenRating = info.Ratings[1].Value;
            var language = info.Language;
            var plot = info.Plot;
            var actors = info.Actors;
            // console.log(info);
            console.log("Title: " + title);
            console.log("year: " + year);
            console.log("IMDB Rating: " + imdbRating);
            console.log("Rotten Tomatoes Rating: " + rottenRating);
            console.log("Language: " + language);
            console.log("Plot: " + plot);
            console.log("Actors: " + actors);
        } else { console.log("sad face") }
    });
}

function doWhatItSays() {
    console.log("just do your thang honey");
    fs.appendFile('./log.txt', 'User Command: node liri.js do-what-it-says\n\n', (err) => {
        if (err) throw err;
    });

    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        } else
        // console.log(data);
            spotifySearch(data);
    })
}
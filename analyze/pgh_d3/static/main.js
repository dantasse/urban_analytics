
$("#startDate").datepicker();
$("#endDate").datepicker();
$("#update").click(function() {
    update();
});

var startDate;
var endDate;

var allTweets;
var tweetsToShow;
function update() {
    startDate = $("#startDate").datepicker("getDate");
    endDate = $("#endDate").datepicker("getDate");
    params = $.parseJSON( $("#query").val() ); // TODO sanitize, obv
    // takes about a second per 1k tweets. crashes on 100k.
    $.getJSON("/query", JSON.stringify(params), function(tweets) {
            console.log(tweets);
            allTweets = tweets.results;
            tweetsToShow = tweets.results;
            if (startDate != null) {
                tweetsToShow = tweetsToShow.filter(function(e) {return new Date(e.created_at) >= startDate;});
            }
            if (endDate != null) {
                tweetsToShow = tweetsToShow.filter(function(e) {return new Date(e.created_at) <= endDate;});
            }
            
            var tweetSelection = svg.selectAll(".tweet").data(tweetsToShow);
            tweetSelection.enter().append("path") // .enter() means "if there's more data than dom elements, do this for each new one"
                .attr("class", "tweet")
                .on("click", function(tweet) {
                    console.log(tweet.user.screen_name + ": " + tweet.text);
                });
            tweetSelection.attr("d", tweetsPath);
            tweetSelection.exit().remove();

             
            // var tweetLabelSelection = svg.selectAll(".tweet-label").data(tweetsToShow);
            // tweetLabelSelection.enter().append("text")
            //     .attr("class", "tweet-label");
            // tweetLabelSelection
            //     .attr("transform", function(d) {
            //         if (d.coordinates)
            //             return "translate(" + projection(d.coordinates.coordinates) + ")";
            //         else
            //             return null;
            //     })
            //     .text(function(d) {return d.text});
            // tweetLabelSelection.exit().remove();
        }
    );
}

var width = 1024,
    height = 768;

var svg = d3.select("#mainSvg")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geo.mercator()
    .center([-79.98, 40.431667]) //-80, 40.441667 is the center of pgh
    .scale(230000) // ad hoc hacky, works
    .translate([width/2, height/2]);

// transforms a ... GeometryCollection?... object into a svg path 'd' string
var path = d3.geo.path().projection(projection);
// transforms a tweet object into a svg path 'd' string
var tweetsPath = function(tweet) {
    // some tweets don't have coordinates, just a tweet.place.bounding_box
    // (which can be huge, like 7 degrees lat or lon, so forget it)
    // Note that there is still useful info in tweet.place (like "Pittsburgh")
    // Anyway I think path(null) just returns null, which works ok
    return path(tweet.coordinates);
}

d3.json("static/neighborhoodstopo.json", function(error, nghds) {
    var neighborhoods = topojson.feature(nghds, nghds.objects.neighborhoods);
    svg.append("path")
        .datum(neighborhoods)
        .attr("d", path);
});

// once to start it off
update();


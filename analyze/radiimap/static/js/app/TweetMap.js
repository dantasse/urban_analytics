// Here's where we're calling the google maps API. No API key needed yet, b/c
// we're not using it very much. If we started using it enough that we wanted
// to track our usage, we should get an API key. More info:
// https://developers.google.com/maps/documentation/javascript/tutorial#api_key
//
// And that "async!" is from the async plugin.
// https://github.com/millermedeiros/requirejs-plugins
define(['async!//maps.googleapis.com/maps/api/js?language=en&libraries=geometry,drawing,places,visualization'], function () {
    return function (canvas, dataPanel) {

        var latitude = 40.4417, // default pittsburgh downtown center
            longitude = -80.0000;
        var marks = {};
        var dots = {};
        var redDotImg = 'static/images/maps_measle_red.png';
        var blueDotImg = 'static/images/maps_measle_blue.png';
        var mapOptions = {
            center: {lat: latitude, lng: longitude},
            zoom: 14,
        };
        var map = new google.maps.Map(canvas, mapOptions);
        var heatmap;
        // add user search UI
        var userSearchDiv = document.createElement('div');
        userSearchDiv.setAttribute("id", "userSearchDiv");

        var input = document.createElement('input');
        input.setAttribute("id", "user-screen-name-input");
        input.setAttribute("placeholder", "Twitter Screen Name");

        var ellipse_btn = document.createElement('button');
        ellipse_btn.setAttribute("id", "get-user-tweet-range-btn");
        ellipse_btn.innerText = "Ellipse";

        var twt_btn = document.createElement('button');
        twt_btn.setAttribute("id", "get-user-tweets-btn");
        twt_btn.innerText = "Tweets";

        var heatmap_btn = document.createElement('button');
        heatmap_btn.setAttribute("id","create-user-heatmap-btn");
        heatmap_btn.innerText = "Heatmap";

        userSearchDiv.appendChild(input);
        userSearchDiv.appendChild(ellipse_btn);
        userSearchDiv.appendChild(twt_btn);
        userSearchDiv.appendChild(heatmap_btn)
        userSearchDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(userSearchDiv);

        var ngbhSearchDiv = document.createElement('div');
        ngbhSearchDiv.setAttribute("id", "ngbhSearchDiv");

        var ngbh_input = document.createElement('select');
        ngbh_input.setAttribute("id","ngbh-input");
        ngbh_input.appendChild(new Option("Allegheny Center","Allegheny Center"));
        ngbh_input.appendChild(new Option("Allegheny West","Allgheny West"));
        ngbh_input.appendChild(new Option("Bloomfield","Bloomfield"));
        ngbh_input.appendChild(new Option("Bluff","Bluff"));
        ngbh_input.appendChild(new Option("Brighton Heights","Brighton Heights"));
        ngbh_input.appendChild(new Option("Brookline","Brookline"));
        ngbh_input.appendChild(new Option("Central Business District","Central Business District"));
        ngbh_input.appendChild(new Option("Crafton Heights","Crafton Heights"));
        ngbh_input.appendChild(new Option("Duquesne Heights","Duquesne Heights"));
        ngbh_input.appendChild(new Option("East Liberty","Easy Liberty"));
        ngbh_input.appendChild(new Option("Elliott","Elliott"));
        ngbh_input.appendChild(new Option("Friendship","Friendship"));
        ngbh_input.appendChild(new Option("Garfield","Garfield"));
        ngbh_input.appendChild(new Option("Greenfield","Greenfield"));
        ngbh_input.appendChild(new Option("Hazelwood","Hazelwood"));
        ngbh_input.appendChild(new Option("Highland Park","Highland Park"));
        ngbh_input.appendChild(new Option("Homewood North","Homewood North"));
        ngbh_input.appendChild(new Option("Lincoln-Lemington-Belmar","Lincoln-Lemington-Belmar"));
        ngbh_input.appendChild(new Option("Lower Lawrenceville","Lower Lawrenceville"));
        ngbh_input.appendChild(new Option("Mount Washington","Mount Washington"));
        ngbh_input.appendChild(new Option("North Shore","North Shore"));
        ngbh_input.appendChild(new Option("Oakland - Central","Central Oakland"));
        ngbh_input.appendChild(new Option("Oakland - North","North Oakland"));
        ngbh_input.appendChild(new Option("Oakland - South","South Oakland"));
        ngbh_input.appendChild(new Option("Oakland - West","West Oakland"));
        ngbh_input.appendChild(new Option("Perry North","Perry North"));
        ngbh_input.appendChild(new Option("Point Breeze","Point Breeze"));
        ngbh_input.appendChild(new Option("Regent Square","Regent Square"));
        ngbh_input.appendChild(new Option("Shadyside","Shadyside"));
        ngbh_input.appendChild(new Option("South Shore","South Shore"));
        ngbh_input.appendChild(new Option("South Side Flats","South Side Flats"));
        ngbh_input.appendChild(new Option("South Side Slopes","South Side Slopes"));
        ngbh_input.appendChild(new Option("Spring Hill - City View", "Spring Hill - City View"));
        ngbh_input.appendChild(new Option("Strip District","Strip District"));
        ngbh_input.appendChild(new Option("Squirrel Hill North","Squirrel Hill North"));
        ngbh_input.appendChild(new Option("Squirrel Hill South","Squirrel Hill South"));
        //had to comment these out or else the map won't load...too many options??
        //ngbh_input.appendChild(new Option("Terrace Village","Terrace Village");
        //ngbh_input.appendChild(new Option("Upper Lawrenceville","Upper Lawrenceville"));
        //ngbh_input.appendChild(new Option("Westwood","Westwood"));
       
        var ngbh_ellipse_btn = document.createElement('button');
        ngbh_ellipse_btn.setAttribute("id", "get-ngbh-tweet-range-btn");
        ngbh_ellipse_btn.innerText = "Ellipse";

        var ngbh_twt_btn = document.createElement('button');
        ngbh_twt_btn.setAttribute("id", "get-ngbh-tweets-btn");
        ngbh_twt_btn.innerText = "Tweets";

        var ngbh_heatmap_btn = document.createElement('button');
        ngbh_heatmap_btn.setAttribute("id","create-ngbh-heatmap-btn");
        ngbh_heatmap_btn.innerText = "Heatmap";
 
        ngbhSearchDiv.appendChild(ngbh_input);
        ngbhSearchDiv.appendChild(ngbh_ellipse_btn);
        ngbhSearchDiv.appendChild(ngbh_twt_btn);
        ngbhSearchDiv.appendChild(ngbh_heatmap_btn);
        ngbhSearchDiv.index = 1;
        ngbhSearchDiv.style.paddingTop = "20px";
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(ngbhSearchDiv);

        // add function UI
        var functionsDiv = document.createElement('div');
        functionsDiv.setAttribute("id", "functionsDiv");

        var most_tweets_link = document.createElement('a');
        most_tweets_link.setAttribute("id", "most_tweets_link");
        most_tweets_link.innerText = "Get 10 Users Who Tweet The Most";
        most_tweets_link.index = 1;
        most_tweets_link.style.backgroundColor = "white";
        functionsDiv.appendChild(most_tweets_link);
        functionsDiv.appendChild(document.createElement('br'));

        var heatmap_link = document.createElement('a');
        heatmap_link.setAttribute("id", "heatmap_link");
        heatmap_link.innerText = "Heatmap of Pittsburgh";
        heatmap_link.index = 1;
        heatmap_link.style.backgroundColor = "white";
        functionsDiv.appendChild(heatmap_link);
        map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(functionsDiv);

        // Draw Ellipse: Stolen from https://github.com/monkeyherder/v3-eshapes/blob/master/eshapes.js
        function make_shape(point, r1, r2, r3, r4, rotation, vertexCount, strokeColour, strokeWeight, Strokepacity, fillColour, fillOpacity, opts, tilt) {
            var rot = -rotation * Math.PI / 180;
            var points = [];
            var latConv =  google.maps.geometry.spherical.computeDistanceBetween(point, new google.maps.LatLng(point.lat() + 0.1, point.lng())) * 10;
            var lngConv =  google.maps.geometry.spherical.computeDistanceBetween(point, new google.maps.LatLng(point.lat(), point.lng() + 0.1)) * 10;
            var step = (360/vertexCount)||10;
                
            var flop = -1;
            if (tilt) {
                var I1 = 180 / vertexCount;
            } else {
                var  I1 = 0;
            }
            for(var i = I1; i <= 360.001 + I1; i += step) {
                var r1a = flop ? r1 : r3;
                var r2a = flop ? r2 : r4;
                flop = -1 - flop;
                var y = r1a * Math.cos(i * Math.PI/180);
                var x = r2a * Math.sin(i * Math.PI/180);
                var lng = (x * Math.cos(rot) - y * Math.sin(rot)) / lngConv;
                var lat = (y * Math.cos(rot) + x * Math.sin(rot)) / latConv;

                points.push(new google.maps.LatLng(point.lat() + lat, point.lng() + lng));
            }
            return (new google.maps.Polygon({paths: points,
               strokeColor: strokeColour,
               strokeWeight: strokeWeight,
               strokeOpacity: Strokepacity,
               fillColor: fillColour,
               fillOpacity: fillOpacity}));
        }


        function make_ellipse(point, r2, r1, rotation, strokeColour, strokeWeight, Strokepacity, fillColour, fillOpacity, opts) {
            rotation = rotation || 0;
            return make_shape(point, r1, r2, r1, r2, rotation, 100, strokeColour, strokeWeight, Strokepacity, fillColour, fillOpacity, opts);
        }

        // bind events
        google.maps.event.addDomListener(most_tweets_link, 'click', function() {
            $.ajax({
                type: "get",
                url: $SCRIPT_ROOT + "/get-top-10-user-tweet-range",
                success: function (response) {
                    api.addRanges(response["tweet_ranges"]);
                },
                error: function () {
                    console.log("ajax request failed for " + this.url);
                }
            });
        });
        google.maps.event.addDomListener(heatmap_link, 'click', function() {
            $.ajax({
                type: "get",
                url: $SCRIPT_ROOT + "/get-all-tweets",
                success: function (response) {
                    api.makeHeatMap(response["tweets"]);
                },
                error: function () {
                    console.log("ajax request failed for " + this.url);
                }
            });
        });
        
        google.maps.event.addDomListener(input, 'keyup', function() {
            if(event.keyCode == 13){
                // if you press ENTER
                $.ajax({
                    type: "get",
                    data: {user_screen_name: $("#user-screen-name-input").val()},
                    url: $SCRIPT_ROOT + "/get-user-tweet-range",
                    success: function (response) {
                        // api.clearMap();
                        api.addRange(response["tweet_range"]);
                    },
                    error: function () {
                        console.log("ajax request failed for " + this.url);
                    }
                });
            }
        });
       
         google.maps.event.addDomListener(ellipse_btn, 'click', function() {
            $.ajax({
                type: "get",
                data: {user_screen_name: $("#user-screen-name-input").val()},
                url: $SCRIPT_ROOT + "/get-user-tweet-range",
                success: function (response) {
                    // api.clearMap();
                    api.addRange(response["tweet_range"]);
                },
                error: function () {
                    console.log("ajax request failed for " + this.url);
                }
            });
        });
        
        google.maps.event.addDomListener(twt_btn, 'click', function() {
            $.ajax({
                type: "get",
                data: {user_screen_name: $("#user-screen-name-input").val()},
                url: $SCRIPT_ROOT + "/get-user-tweets",
                success: function (response) {
                    // api.clearMap();
                    api.plotTweets(response["tweets"]);
                },
                error: function () {
                    console.log("ajax request failed for " + this.url);
                }
            });
        });

        google.maps.event.addDomListener(heatmap_btn, 'click', function() {
            $.ajax({
                type: "get",
                data: {user_screen_name: $("#user-screen-name-input").val()},
                url: $SCRIPT_ROOT + "/get-user-tweets",
                success: function (response) {
                    // api.clearMap();
                    api.makeHeatMap(response["tweets"]);
                },
                error: function () {
                    console.log("ajax request failed for " + this.url);
                }
            });
        });
        //neighborhood bindings 

        google.maps.event.addDomListener(ngbh_input, 'keyup', function() {
            if(event.keyCode == 13){
                // if press ENTER
                $.ajax({
                    type: "get",
                    data: {neighborhood: $("#ngbh-input").val()},
                    url: $SCRIPT_ROOT + "/get-ngbh-range",
                    success: function (response) {
                        // api.clearMap();
                        api.addRange(response["result"]);
                    },
                    error: function () {
                        console.log("ajax request failed for " + this.url);
                    }
                });
            }
        });

        google.maps.event.addDomListener(ngbh_ellipse_btn, 'click', function() {
            $.ajax({
                type: "get",
                data: {neighborhood: $("#ngbh-input").val()},
                url: $SCRIPT_ROOT + "/get-ngbh-range",
                success: function (response) {
                    // api.clearMap();
                    api.addRange(response["result"]);
                },
                error: function () {
                    console.log("ajax request failed for " + this.url);
                }
            });
        });
       
         google.maps.event.addDomListener(ngbh_twt_btn, 'click', function() {
            $.ajax({
                type: "get",
                data: {neighborhood: $("#ngbh-input").val()},
                url: $SCRIPT_ROOT + "/get-ngbh-tweets",
                success: function (response) {
                    // api.clearMap();
                    api.plotTweets(response["tweets"]);
                },
                error: function () {
                    console.log("ajax request failed for " + this.url);
                }
            });
        });

        google.maps.event.addDomListener(ngbh_heatmap_btn, 'click', function() {
            $.ajax({
                type: "get",
                data: {neighborhood: $("#ngbh-input").val()},
                url: $SCRIPT_ROOT + "/get-ngbh-tweets",
                success: function (response) {
                    // api.clearMap();
                    api.makeHeatMap(response["tweets"]);
                },
                error: function () {
                    console.log("ajax request failed for " + this.url);
                }
            });
        });


        // get the default bounds for a google.maps.Rectangle
        function getDefaultBounds(latitude, longitude) {
            return new google.maps.LatLngBounds(
                new google.maps.LatLng(latitude - 0.002, longitude - 0.004),
                new google.maps.LatLng(latitude + 0.002, longitude + 0.004)
            );
        }

        function prettyPrint(num) {
            return num.toFixed(6);
        }

        function attachTextToMarker(marker, message) {
            var textWindow = new google.maps.InfoWindow({
                content: message
            });

            google.maps.event.addListener(marker, 'click', function() {
                textWindow.open(marker.get('map'), marker);
            });
        }

        function removeMark(key) {
            if (key in marks) {
                var mark = marks[key];
                var markers = mark['markers'];
                if (markers.length > 0) {
                    for(var i = 0; i < markers.length; i++) {
                        markers[i].setMap(null);
                    }
                }

                var ellipses = mark['ellipses'];
                if(ellipses.length > 0) {
                    for(var j = 0; j < ellipses.length; j++) {
                        ellipses[j].setMap(null);
                    }
                }
                delete marks[key];
                console.log("removed " + key);
                console.log(marks);
            }
        }

        function removeDots(key) {
            if (key in marks) {
                var dot_set = dots[key];
                if (dot_set.length > 0) {
                    for(var i = 0; i < dot_set.length; i++) {
                        dot_set[i].setMap(null);
                    }
                }

                delete dots[key];
                console.log("removed " + key);
                console.log(dots);
            }
        }

        function plotRange(tweet_range, zoom) {
            console.log("plotting range!");
            console.log(tweet_range);

            if(tweet_range !== null &&
              tweet_range["sd_x"] !== null &&
              tweet_range["sd_y"] !== null &&
              tweet_range["angle"] !== null &&
              tweet_range["centroid"] !== null &&
              tweet_range["screen_name"] !== null &&
              tweet_range["most_common_neighborhood"] !== null) {
                if (tweet_range["screen_name"] in marks) {
                    return null;
                }
                var username = tweet_range["screen_name"];
                var ngh = tweet_range["most_common_neighborhood"];
                var radius_50 = tweet_range["50%radius"];
                var radius_90 = tweet_range["90%radius"];
                var centroid = tweet_range["centroid"];

                var sd_x = tweet_range["sd_x"];
                var sd_y = tweet_range["sd_y"];
                var angle = tweet_range["angle"];

                var center = {lat: centroid[1], lng: centroid[0]};

                //Put marker at centroid
                var marker = new google.maps.Marker({
                    position: center,
                    map: map,
                });
                var userText = "<b>" + username + "</b>: " + ngh +
                                "<br /> (" + prettyPrint(centroid[1]) + ", " +
                                prettyPrint(centroid[0]) + ")" +
                                "<br /> 50%: " + radius_50 + ", 90%: " + radius_90;
                attachTextToMarker(marker, userText);
               
                /* don't need circles anymore - using ellipses instead
                // Construct the 50% circle
                var Circle50 = new google.maps.Circle({
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                    map: map,
                    center: center,
                    radius: radius_50 //in meters
                });
                //Construct the 90% circle
                var Circle90 = new google.maps.Circle({
                    strokeColor: '#99FFFF',
                    strokeOpacity: 0.9,
                    strokeWeight: 2,
                    fillColor: '#99FFFF',
                    fillOpacity: 0.2,
                    map: map,
                    center: center,
                    radius: radius_90 //in meters
                });
               */

                var point = new google.maps.LatLng(centroid[1], centroid[0]);
                var ellipse1SD = make_ellipse(point, sd_x, sd_y, angle, "#FF0000", 2, 0.8, "#FF0000", 0.5);
                var ellipse2SD = make_ellipse(point, 2 * sd_x, 2 * sd_y, angle, "#99FFFF", 2, 0.9, "#99FFFF", 0.5);
                ellipse1SD.setMap(map);
                ellipse2SD.setMap(map);

                //marks[username] = {'markers': [marker], 'circles': [Circle50, Circle90, ellipse1SD, ellipse2SD]};
                marks[username] = {'markers': [marker], 'ellipses': [ellipse1SD, ellipse2SD]};

                if (zoom) {
                    //zoom bounds
                    var southwest = new google.maps.LatLng(centroid[1]-2 * sd_x/50000, centroid[0]-2 * sd_x/50000);
                    var northeast = new google.maps.LatLng(centroid[1]+2 * sd_x/50000, centroid[0]+2 * sd_x/50000);
                    var bounds = new google.maps.LatLngBounds();

                    map.setCenter(center);
                    bounds.extend(southwest);
                    bounds.extend(northeast);
                    map.fitBounds(bounds);
                }
                return username;
            }
            return null;
        }


        function removeRange (username) {
            if (username !== null) {
                removeMark(username);
                removeDots(username);
                $("#" + username + ".user-label").remove();
            }
        }

        function removeHeatMap (){
            heatmap.setMap(null);
        }

        function addUserLabel(username) {
            console.log("ADD USER LABEL " + username);
            if (username !== null) {
                icon_src = document.getElementById("remove-icon").getAttribute("src");
                var image = document.createElement('img');
                image.src = icon_src;
                image.className = "remove_icon";
                google.maps.event.addDomListener(image, 'click', function() {
                    removeRange(username);
                });

                var p = document.createElement('p');
                p.id = username;
                p.innerText = username;
                p.className = "user-label";
                p.appendChild(image);
                userSearchDiv.appendChild(p);
            }
        }

        var api =  {
            setCenter: function (position) {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                //map.setCenter({lat: latitude, lng: longitude});

                // selectedArea.setBounds(getDefaultBounds(latitude, longitude));
            },

            clearMap: function () {
                // remove previous markers from map and empty queriedUsersMarkers
                for (var key in marks) {
                    removeMark(key);
                }
                for (var dotkey in dots) {
                    removeDots(dotkey);
                }
            },

            plotUsers: function (users) {
                if(users !== null) {
                    for(var user in users) {
                        var tweetsFromUser = users[user];
                        for(var i = 0; i < tweetsFromUser.length; i++) {
                            api.plotTweet(tweetsFromUser[i]);
                        }
                    }
                }
            },

            plotTweets: function (tweets) {
                if(tweets !== null) {
                    for (var i = 0; i < tweets.length; i++) {
                        api.plotTweet(tweets[i]);
                    }
                }
            },

            plotTweet: function (tweet) {
                var latJitter = Math.random() * 0.005 - 0.0025;
                var lngJitter = Math.random() * 0.005 - 0.0025;

                if(tweet !== null && tweet["geo"] !== null && tweet["geo"]["coordinates"] !== null) {
                    var userGeoCoordData = tweet["geo"]["coordinates"];
                    var userMarker = new google.maps.Marker({
                        position: {lat: userGeoCoordData[0] + latJitter,
                                   lng: userGeoCoordData[1] + lngJitter},
                        map: map,
                        icon: redDotImg
                    });
                    
                    var username = tweet["user"]["screen_name"];
                    var userText = "<b>" + username + "</b>: " + tweet["text"]
                                 + "<br /> (" + prettyPrint(userGeoCoordData[0]) + ", "
                                 + prettyPrint(userGeoCoordData[1]) + ")";
                    attachTextToMarker(userMarker, userText);
                    google.maps.event.addListener(userMarker, 'mouseover', function() {
                        userMarker.setIcon(blueDotImg);
                    });
                    google.maps.event.addListener(userMarker, 'mouseout', function() {
                        userMarker.setIcon(redDotImg);
                    });
                    if(username in dots) {
                        dots[username].push(userMarker);
                    } else {
                        dots[username] = [userMarker];
                    }
                }
            },

            addRange: function(tweet_range) {
                var username = plotRange(tweet_range, true);
                console.log("addRange " + username);
                if (username !== null) {
                    addUserLabel(username);
                }
            },

            addRanges: function(tweet_ranges) {
                for (var i = 0; i < tweet_ranges.length; i++) {
                    var username = plotRange(tweet_ranges[i], false);
                    if (username !== null) {
                        addUserLabel(username);
                    }
                }
            },

            getSelectedArea: function () {
                return {ne_lat: selectedAreaNE.lat(),
                        ne_lng: selectedAreaNE.lng(),
                        sw_lat: selectedAreaSW.lat(),
                        sw_lng: selectedAreaSW.lng()
                };
            },

            makeHeatMap: function (tweets) {
                var tweetData = [];
                for (var tweet in tweets) {
                    if (tweets[tweet]["geo"] !== null && tweets[tweet]["geo"]["coordinates"] !== null) {
                         tweetData.push( new google.maps.LatLng(tweets[tweet]["geo"]["coordinates"][0], tweets[tweet]["geo"]["coordinates"][1]) );
                    }
                }
                console.log(tweetData.length);
                var pointArray = new google.maps.MVCArray(tweetData);
                heatmap = new google.maps.visualization.HeatmapLayer({
                    data: pointArray,
                });
                heatmap.set('opacity', 1);
                heatmap.set('radius', 20);
                heatmap.setMap(map);
            }
        };

        return api;
    };
});

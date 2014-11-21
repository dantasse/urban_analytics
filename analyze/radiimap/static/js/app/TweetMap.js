// Here's where we're calling the google maps API. No API key needed yet, b/c
// we're not using it very much. If we started using it enough that we wanted
// to track our usage, we should get an API key. More info:
// https://developers.google.com/maps/documentation/javascript/tutorial#api_key
//
// And that "async!" is from the async plugin.
// https://github.com/millermedeiros/requirejs-plugins
define(['async!//maps.googleapis.com/maps/api/js?language=en&libraries=drawing,places,visualization'], function () {
    return function (canvas, dataPanel) {
        var latitude = 40.4417, // default pittsburgh downtown center
            longitude = -80.0000;
        var markers = [];
        var circles = [];
        var redDotImg = 'static/images/maps_measle_red.png';
        var blueDotImg = 'static/images/maps_measle_blue.png';
        var mapOptions = {
            center: {lat: latitude, lng: longitude},
            zoom: 14,
        };
        var map = new google.maps.Map(canvas, mapOptions);
        
        // get the default bounds for a google.maps.Rectangle
        function getDefaultBounds(latitude, longitude) {
            return new google.maps.LatLngBounds(
                new google.maps.LatLng(latitude - 0.002, longitude - 0.004),
                new google.maps.LatLng(latitude + 0.002, longitude + 0.004)
            );
        }

        function prettyPrint(num) {
            return num.toFixed(4);
        }

        function attachTextToMarker(marker, message) {
            var textWindow = new google.maps.InfoWindow({
                content: message
            });

            google.maps.event.addListener(marker, 'click', function() {
                textWindow.open(marker.get('map'), marker);
            });
        }

        var api =  {
            setCenter: function (position) {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                //map.setCenter({lat: latitude, lng: longitude});

                selectedArea.setBounds(getDefaultBounds(latitude, longitude));
            },

            clearMap: function () {
                // remove previous markers from map and empty queriedUsersMarkers
                if(markers.length > 0) {
                    for(var i = 0; i < markers.length; i++) {
                        markers[i].setMap(null);
                    }
                    markers.length = 0;
                }
                if(circles.length > 0) {
                    for(var j = 0; j < circles.length; j++) {
                        circles[j].setMap(null);
                    }
                    circles.length = 0;
                }
            },

            plotUsers: function (users) {
                if(users != null) {
                    for(var user in users) {
                        var tweetsFromUser = users[user];
                        for(var i = 0; i < tweetsFromUser.length; i++) {
                            api.plotTweet(tweetsFromUser[i]);
                        }
                    }
                }
            },

            plotTweets: function (tweets) {
                if(tweets != null) {
                    for (var i = 0; i < tweets.length; i++) {
                        api.plotTweet(tweets[i]);
                    }
                }
            },

            plotTweet: function (tweet) {
                var latJitter = Math.random() * .005 - .0025;
                var lngJitter = Math.random() * .005 - .0025;
                if(tweet != null && tweet["geo"] != null && tweet["geo"]["coordinates"] != null) {
                    var userGeoCoordData = tweet["geo"]["coordinates"];
                    var userMarker = new google.maps.Marker({
                        position: {lat: userGeoCoordData[0] + latJitter,
                                   lng: userGeoCoordData[1] + lngJitter},
                        map: map,
                        icon: redDotImg
                    });
                    var userText = "<b>" + tweet["user"]["screen_name"] + "</b>: " + tweet["text"]
                                 + "<br /> (" + prettyPrint(userGeoCoordData[0]) + ", "
                                 + prettyPrint(userGeoCoordData[1]) + ")";
                    attachTextToMarker(userMarker, userText);
                    google.maps.event.addListener(userMarker, 'mouseover', function() {
                        userMarker.setIcon(blueDotImg);
                    });
                    google.maps.event.addListener(userMarker, 'mouseout', function() {
                        userMarker.setIcon(redDotImg);
                    });
                    markers.push(userMarker);
                }
            },

            plotRange : function (tweet_range) {
                console.log("plotting range!");
                console.log(tweet_range);
                console.log(tweet_range !== null);
                console.log(tweet_range["50%radius"] !== null);
                console.log(tweet_range["90%radius"] !== null);
                console.log(tweet_range["centroid"] !== null);
                if(tweet_range !== null && tweet_range["50%radius"] !== null && tweet_range["90%radius"] !== null && tweet_range["centroid"] !== null) {
                    var radius_50 = tweet_range["50%radius"];
                    var radius_90 = tweet_range["90%radius"];
                    var centroid = tweet_range["centroid"];
                    var center = {lat: centroid[1], lng: centroid[0]};

                    //zoom bounds
                    var southwest = new google.maps.LatLng(centroid[1]-radius_90/50000, centroid[0]-radius_90/50000);
                    var northeast = new google.maps.LatLng(centroid[1]+radius_90/50000, centroid[0]+radius_90/50000);
                    var bounds = new google.maps.LatLngBounds();

                    console.log(radius_50 + ", " + radius_90 + ", " + centroid + ", " + center);
                    //Put marker at centroid
                    var marker = new google.maps.Marker({
                        position: center,
                        map: map,
                    });
                    //Construct the 50% circle
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
                    markers.push(marker);
                    circles.push(Circle50);
                    circles.push(Circle90);
                    map.setCenter(center);
                    bounds.extend(southwest);
                    bounds.extend(northeast);
                    map.fitBounds(bounds);
                }
            },

            getSelectedArea: function () {
                return {ne_lat: selectedAreaNE.lat(),
                        ne_lng: selectedAreaNE.lng(),
                        sw_lat: selectedAreaSW.lat(),
                        sw_lng: selectedAreaSW.lng()
                };
            }
        };

        return api;
    };
});

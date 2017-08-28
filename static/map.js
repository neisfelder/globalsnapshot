
//NEED TO ADD storyTitle.onclick="goToCoords({{title[3]}},{{title[2]}},{{title[1]}});"




//  -------------------------------------     AmMap   ---------------------------------------------------------


/**
 * This example uses pulsating circles CSS by Kevin Urrutia
 * http://kevinurrutia.tumblr.com/post/16411271583/creating-a-css3-pulsating-circle
 */

var map = AmCharts.makeChart( "mapdiv", {
  "type": "map",
  "theme": "light",
  "projection": "miller",

  "imagesSettings": {
    "rollOverColor": "#089282",
    "rollOverScale": 3,
    "selectedScale": 3,
    "selectedColor": "#089282",
    "color": "#13564e"
  },

  "areasSettings": {
    "unlistedAreasColor": "#15A892"
  },

  "dataProvider": {
    "map": "worldLow",
    "images": [ {
      "zoomLevel": 5,
      "scale": 0.5,
      "title": "Brussels",
      "latitude": 50.8371,
      "longitude": 4.3676
    }, {
      "zoomLevel": 5,
      "scale": 0.5,
      "title": "Copenhagen",
      "latitude": 55.6763,
      "longitude": 12.5681
    }, {
      "zoomLevel": 5,
      "scale": 0.5,
      "title": "Paris",
      "latitude": 48.8567,
      "longitude": 2.3510
    }, {
      "zoomLevel": 5,
      "scale": 0.5,
      "title": "Reykjavik",
      "latitude": 64.1353,
      "longitude": -21.8952
    }, {
      "zoomLevel": 5,
      "scale": 0.5,
      "title": "Moscow",
      "latitude": 55.7558,
      "longitude": 37.6176
    }, {
      "zoomLevel": 5,
      "scale": 0.5,
      "title": "Madrid",
      "latitude": 40.4167,
      "longitude": -3.7033
    }, {
      "zoomLevel": 5,
      "scale": 0.5,
      "title": "London",
      "latitude": 51.5002,
      "longitude": -0.1262,
      "url": "http://www.google.co.uk"
    }, {
      "zoomLevel": 5,
      "scale": 0.5,
      "title": "Peking",
      "latitude": 39.9056,
      "longitude": 116.3958
    }, {
      "zoomLevel": 5,
      "scale": 0.5,
      "title": "New Delhi",
      "latitude": 28.6353,
      "longitude": 77.2250
    }, {
      "zoomLevel": 5,
      "scale": 0.5,
      "title": "Tokyo",
      "latitude": 35.6785,
      "longitude": 139.6823,
      "url": "http://www.google.co.jp"
    }, {
      "zoomLevel": 5,
      "scale": 0.5,
      "title": "Ankara",
      "latitude": 39.9439,
      "longitude": 32.8560
    }, {
      "zoomLevel": 5,
      "scale": 0.5,
      "title": "Buenos Aires",
      "latitude": -34.6118,
      "longitude": -58.4173
    }, {
      "zoomLevel": 5,
      "scale": 0.5,
      "title": "Brasilia",
      "latitude": -15.7801,
      "longitude": -47.9292
    }, {
      "zoomLevel": 5,
      "scale": 0.5,
      "title": "Ottawa",
      "latitude": 45.4235,
      "longitude": -75.6979
    }, {
      "zoomLevel": 5,
      "scale": 0.5,
      "title": "Washington",
      "latitude": 38.8921,
      "longitude": -77.0241
    }, {
      "zoomLevel": 5,
      "scale": 0.5,
      "title": "Kinshasa",
      "latitude": -4.3369,
      "longitude": 15.3271
    }, {
      "zoomLevel": 5,
      "scale": 0.5,
      "title": "Cairo",
      "latitude": 30.0571,
      "longitude": 31.2272
    }, {
      "zoomLevel": 5,
      "scale": 0.5,
      "title": "Pretoria",
      "latitude": -25.7463,
      "longitude": 28.1876
    } ]
  }
} );

// add events to recalculate map position when the map is moved or zoomed
map.addListener( "positionChanged", updateCustomMarkers );

// this function will take current images on the map and create HTML elements for them
function updateCustomMarkers( event ) {
  // get map object
  var map = event.chart;

  // go through all of the images
  for ( var x in map.dataProvider.images ) {
    // get MapImage object
    var image = map.dataProvider.images[ x ];

    // check if it has corresponding HTML element
    if ( 'undefined' == typeof image.externalElement )
      image.externalElement = createCustomMarker( image );

    // reposition the element accoridng to coordinates
    var xy = map.coordinatesToStageXY( image.longitude, image.latitude );
    image.externalElement.style.top = xy.y + 'px';
    image.externalElement.style.left = xy.x + 'px';
  }
}

// this function creates and returns a new marker element
function createCustomMarker( image ) {
  // create holder
  var holder = document.createElement( 'div' );
  holder.className = 'map-marker';
  holder.title = image.title;
  holder.style.position = 'absolute';

  // maybe add a link to it?
  if ( undefined != image.url ) {
    holder.onclick = function() {
      window.location.href = image.url;
    };
    holder.className += ' map-clickable';
  }

  // create dot
  var dot = document.createElement( 'div' );
  dot.className = 'dot';
  holder.appendChild( dot );

  // create pulse
  var pulse = document.createElement( 'div' );
  pulse.className = 'pulse';
  holder.appendChild( pulse );

  // append the marker to the map container
  image.chart.chartDiv.appendChild( holder );

  return holder;
}











//  var x = 0;
//  var y = 0;
//
//  function showCoords(event) {
//      x = event.clientX;
//      y = event.clientY;
//  }

//  function goToCoords(lat,lng,url) {
//      console.log("story clicked");
//      console.log(lat);
//      console.log(lng);
//
//      var latLng = new google.maps.LatLng(lng,lat - 6);
//      map.panTo(latLng);
//      map.setZoom(5);
//      //need to get the data point based on the url
//      //showTheStory();
//
//    }
//
//  function zoomOut() {
//    var latLng = new google.maps.LatLng(-20,40);
//    map.setZoom(2);
//  }
//
//  function exitPreviewPanel() {
//      previewHoverable = 0;
//      document.getElementById("full_summary").style.right = "0px";
//
//      document.getElementById("moreTitle").style.visibility = "hidden";
//      document.getElementById("author").style.visibility = "hidden";
//      document.getElementById("bigPicture").style.visibility = "hidden";
//      document.getElementById("abstract").style.visibility = "hidden";
//      document.getElementById("link").style.visibility = "hidden";
//      document.getElementById("about").style.visibility = "visible";
//      document.getElementById("about").style.opacity = 1;
//      document.getElementById("exit").style.width = "0px";
//      document.getElementById('full_summary').style.width = '0px';
//      document.getElementById('full_summary').style.padding = '0px';
//
//
//      //zoomLevel = map.getZoom();
//      if (zoomLevel <= 4) {
//        document.getElementById("sidebar").style.width = "240px";
//        document.getElementById("storyFeed").style.visibility = "visible";
//      }
//  }

//  function initMap() {
//
//  var styledMapType = new google.maps.StyledMapType(
//        [
//          {
//            "elementType": "geometry",
//            "stylers": [
//              {
//                "color": "#f5f5f5"
//              }
//            ]
//          },
//          {
//            "elementType": "labels.icon",
//            "stylers": [
//              {
//                "visibility": "off"
//              }
//            ]
//          },
//          {
//            "elementType": "labels.text.fill",
//            "stylers": [
//              {
//                "color": "#616161"
//              }
//            ]
//          },
//          {
//            "elementType": "labels.text.stroke",
//            "stylers": [
//              {
//                "color": "#f5f5f5"
//              }
//            ]
//          },
//          {
//            "featureType": "administrative.country",
//            "elementType": "geometry.stroke",
//            "stylers": [
//              {
//                "color": "#000000"
//              }
//            ]
//          },
//          {
//            "featureType": "administrative.land_parcel",
//            "elementType": "labels.text.fill",
//            "stylers": [
//              {
//                "color": "#bdbdbd"
//              }
//            ]
//          },
//          {
//            "featureType": "poi",
//            "elementType": "geometry",
//            "stylers": [
//              {
//                "color": "#eeeeee"
//              }
//            ]
//          },
//          {
//            "featureType": "poi",
//            "elementType": "labels.text.fill",
//            "stylers": [
//              {
//                "color": "#757575"
//              }
//            ]
//          },
//          {
//            "featureType": "poi.park",
//            "elementType": "geometry",
//            "stylers": [
//              {
//                "color": "#e5e5e5"
//              }
//            ]
//          },
//          {
//            "featureType": "poi.park",
//            "elementType": "labels.text.fill",
//            "stylers": [
//              {
//                "color": "#9e9e9e"
//              }
//            ]
//          },
//          {
//            "featureType": "road",
//            "elementType": "geometry",
//            "stylers": [
//              {
//                "color": "#ffffff"
//              }
//            ]
//          },
//          {
//            "featureType": "road.arterial",
//            "elementType": "labels.text.fill",
//            "stylers": [
//              {
//                "color": "#757575"
//              }
//            ]
//          },
//          {
//            "featureType": "road.highway",
//            "elementType": "geometry",
//            "stylers": [
//              {
//                "color": "#dadada"
//              }
//            ]
//          },
//          {
//            "featureType": "road.highway",
//            "elementType": "labels.text.fill",
//            "stylers": [
//              {
//                "color": "#616161"
//              }
//            ]
//          },
//          {
//            "featureType": "road.local",
//            "elementType": "labels.text.fill",
//            "stylers": [
//              {
//                "color": "#9e9e9e"
//              }
//            ]
//          },
//          {
//            "featureType": "transit.line",
//            "elementType": "geometry",
//            "stylers": [
//              {
//                "color": "#e5e5e5"
//              }
//            ]
//          },
//          {
//            "featureType": "transit.station",
//            "elementType": "geometry",
//            "stylers": [
//              {
//                "color": "#eeeeee"
//              }
//            ]
//          },
//          {
//            "featureType": "water",
//            "elementType": "geometry",
//            "stylers": [
//              {
//                "color": "#48a7c4"
//              }
//            ]
//          },
//          {
//            "featureType": "water",
//            "elementType": "labels.text.fill",
//            "stylers": [
//              {
//                "color": "#48a7c4"
//              }
//            ]
//          }
//        ],
//        {name: 'Styled Map'});
//
//    map = new google.maps.Map(document.getElementById('map'), {
//      zoom: 2,
//      center: {lat: 40, lng: -20},
//      disableDefaultUI: true,
//      backgroundColor: "#48a7c4",
//      mapTypeControlOptions: {
//        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
//                'styled_map']
//      }
//    });
//
//    map.mapTypes.set('styled_map', styledMapType);
//    map.setMapTypeId('styled_map');
//
//    //map.data.addGeoJson(data);
//    // Load GeoJSON.
//    //map.data.loadGeoJson('http://nytglobalsnapshot.com/results.json');
//    map.data.loadGeoJson('http://newsapptesting.appspot.com/results.json');
//
//    map.data.setStyle(function(feature) {
//      var color = '#ce2727';
//      if (feature.getProperty('isSelected') == true) {
//        color = '#68c2ff';
//      }
//      return {
//        icon: getCircle(4, color)
//      };
//    });
//
//    function getCircle(magnitude, color) {
//      return {
//        path: google.maps.SymbolPath.CIRCLE,
//        animation: google.maps.Animation.DROP,
//        fillColor: color,
//        fillOpacity: 1,
//        scale: Math.pow(2, magnitude) / 2,
//        strokeColor: '#d6f9ff',
//        strokeWeight: 1
//      };
//    }
//
//    function hoverCircle(magnitude) {
//      return {
//        path: google.maps.SymbolPath.CIRCLE,
//        fillColor: '#f44242',
//        fillOpacity: 1,
//        scale: Math.pow(2, magnitude) / 2,
//        strokeColor: '#d6f9ff',
//        strokeWeight: 3
//      };
//    }
//
//    function clickroute(long,lat) {
//      var latLng = new google.maps.LatLng(long,lat);
//      zoomLevel = map.getZoom();
//      //amountToZoom = 5 - zoomLevel;
//        map.panTo(latLng);
//        if (zoomLevel < 5) {
//          map.setZoom(5);
//        }
//    }
//
//    google.maps.event.addListener(map, 'zoom_changed', function() {
//      zoomLevel = map.getZoom();
//      if (zoomLevel >= 4) {
//        setTimeout(function () {
//          document.getElementById("worldViewButton").style.visibility = "visible";
//          document.getElementById("worldViewButton").style.width = "100px";
//          document.getElementById("storyFeed").style.visibility = "hidden";
//          document.getElementById("sidebar").style.width = "0px";
//        }, 500);
//      } else {
//        if (previewHoverable == 0) {
//          document.getElementById("worldViewButton").style.width = "0px";
//          document.getElementById("worldViewButton").style.visibility = "hidden";
//          document.getElementById("storyFeed").style.visibility = "visible";
//          document.getElementById("storyFeed").style.opacity = 1;
//          document.getElementById("sidebar").style.width = "240px";
//      }
//      }
//    });
//
//    document.getElementById('worldViewButton').addEventListener('click', function() {
//      var latLng = new google.maps.LatLng(40,-20);
//      map.panTo(latLng);
//      zoomOut();
//      exitPreviewPanel();
//
//      document.getElementById("worldViewButton").style.width = "0px";
//      document.getElementById("worldViewButton").style.visibility = "hidden";
//      document.getElementById("storyFeed").style.visibility = "visible";
//      document.getElementById("storyFeed").style.opacity = 1;
//      document.getElementById("sidebar").style.width = "240px";
//    }, false);
//
//    selectedNow = "";
//    previewHoverable = 0;
//
//    document.getElementById('exit').addEventListener('click', function() {
//      exitPreviewPanel();
//    }, false);
//
//    //document.getElementById('commentButton').addEventListener('click', function() {
//    //  document.getElementById("comments").style.visibility = "visible";
//    //}, false);
//
//
//
//    document.getElementById('full_summary').addEventListener('mouseover', function() {
//      if (previewHoverable == 1) {
//        document.getElementById("exit").style.width = "45px";
//        document.getElementById("full_summary").style.right = "45px";
//        document.getElementById("link").style.opacity = 1;
//        //document.getElementById("map").style.opacity = ".8";
//        //document.getElementById("bigPicture").style.width = "88%";
//        //document.getElementById("abstract").style.width = "88%";
//        document.getElementById("abstract").style.opacity = 1;
//
//      }
//    }, false);
//
//
//    //hover effect of full summary panel
//    document.getElementById('exit').addEventListener('mouseover', function() {
//      if (previewHoverable == 1) {
//        document.getElementById("exit").style.width = "45px";
//        document.getElementById("full_summary").style.right = "15px";
//        document.getElementById("abstract").style.opacity = 1;
//      }
//    }, false);
//
//
//    document.getElementById('full_summary').addEventListener('mouseout', function() {
//      if (previewHoverable == 1) {
//        document.getElementById("exit").style.width = "0px";
//        document.getElementById("full_summary").style.right = "0px";
//        //document.getElementById("map").style.opacity = "1";
//        document.getElementById("abstract").style.opacity = 0;
//        document.getElementById("link").style.opacity = 0;
//      }
//    }, false);

//
//    function showTheStory(event) {
//      document.getElementById("moreTitle").style.visibility = "visible";
//      document.getElementById("author").style.visibility = "visible";
//      document.getElementById("bigPicture").style.visibility = "visible";
//      document.getElementById("abstract").style.visibility = "visible";
//      document.getElementById("link").style.visibility = "visible";
//      document.getElementById("about").style.visibility = "hidden";
//      document.getElementById("exit").style.visibility = "visible";
//      document.getElementById("exit").style.height = "100%";
//
//      document.getElementById("exit").style.height = "100%";
//      document.getElementById("full_summary").style.width = "45%";
//      document.getElementById("full_summary").style.padding = "20px";
//
//      document.getElementById("content_container").style.display = "hidden";
//      selectedNow = event.feature.getProperty('url');
//
//      coordinates = event.feature.getProperty('coordinates');
//      console.log(coordinates);
//      var latitude = event.latLng.lat();
//      var longitude = event.latLng.lng() + 5;
//      clickroute(latitude,longitude);
//
//      event.feature.setProperty('isSelected', true);
//
//      document.getElementById("storyFeed").style.opacity = 0;
//      //document.getElementById("storyFeed").style.visibility = "hidden";
//      document.getElementById("sidebar").style.width = "0px";
//
//      if (previewHoverable == 1) {
//      //setTimeout(function () {
//        document.getElementById("moreTitle").style.opacity = 0;
//        //document.getElementById("moreTitle").style.visibility = "hidden";
//        document.getElementById("author").style.opacity = 0;
//        //document.getElementById("author").style.visibility = "hidden";
//        document.getElementById("bigPicture").style.opacity = 0;
//        //document.getElementById("bigPicture").style.visibility = "hidden";
//        document.getElementById("abstract").style.opacity = 0;
//        //document.getElementById("abstract").style.visibility = "visible";
//        document.getElementById("link").style.opacity = 0;
//        //document.getElementById("link").style.visibility = "hidden";
//        //document.getElementById("about").style.visibility = "hidden";
//        document.getElementById("exit").style.opacity = 1;
//        //document.getElementById("exit").style.visibility = "visible";
//        //document.getElementById("comments").textContent = event.feature.getProperty('comments');
//      //}, 500);
//
//      }
//
//      setTimeout(function () {
//
//          document.getElementById("moreTitle").style.opacity = 1;
//          document.getElementById("author").style.opacity = 1;
//          document.getElementById("bigPicture").style.opacity = 1;
//          //document.getElementById("abstract").style.opacity = 1;
//          document.getElementById("link").style.opacity = 1;
//          document.getElementById("about").style.opacity = 0;
//          document.getElementById("exit").style.opacity = 1;
//
//        }, 1000);
//
//
//      console.log(event.feature.getProperty('letter'));
//
//      document.getElementById('moreTitle').textContent = event.feature.getProperty('letter');
//      abstract.textContent = event.feature.getProperty('abstract');
//
//      document.getElementById('link').textContent = "read more"
//      document.getElementById('link').href = event.feature.getProperty('url');
//      document.getElementById('link').target = "_blank";
//
//      if (event.feature.getProperty('image') != "") {
//        document.getElementById('picture').src = event.feature.getProperty('image');
//      } else {
//        document.getElementById('picture').src = "https://ubeam.com/wp-content/uploads/2015/12/new_york_times_logo_01.jpg";
//      }
//      //imgBox.append(image);
//
//
//      //var authorTime = document.createElement("p");
//      //authorTime.setAttribute("id", "author");
//      document.getElementById('author').textContent = event.feature.getProperty('authorTime');
//
//      previewHoverable = 1;
//
//      var storyId = event.feature.getProperty('url');
//      document.getElementById(storyId).style.color = "lightgray";
//    }

    //When user clicks a point on the map, display preview panel, zoom in, and set center to coordinates of story
//    map.data.addListener('click', function(event) {
//      showTheStory(event);
//
//    });


    // When the user hovers, tempt them to click by outlining the letters.
    // Call revertStyle() to remove all overrides. This will use the style rules
    // defined in the function passed to setStyle()
//    map.data.addListener('mouseover', function(event) {
//
//      if (event.feature.getProperty('url') != selectedNow) {
//
//        map.data.overrideStyle(event.feature, {
//          icon: hoverCircle(5)
//        });
//
//
//        document.getElementById('content_container').style.width = "400px";
//        document.getElementById('content_container').style.height = "120px";
//
//
//        document.getElementById('content_container').style.position = "absolute";
//        document.getElementById('content_container').style.left = (x - 200) +'px';
//        document.getElementById('content_container').style.top = (y - 150)+'px';
//
//        document.getElementById("articleThumbnail").style.visibility = "visible";
//        document.getElementById('content_container').style.visibility = "visible";
//        document.getElementById('locP').style.visibility = "visible";
//        document.getElementById('content_container').style.opacity = 1;
//
//
//        if (event.feature.getProperty('image') != "") {
//          document.getElementById('articleThumbnail').src =
//            event.feature.getProperty('thumbImage');
//        } else {
//          document.getElementById('articleThumbnail').src = "https://static01.nyt.com/images/icons/t_logo_291_black.png";
//        }
//
//        document.getElementById('articleThumbnail').style.height = "100px";
//        document.getElementById('articleThumbnail').style.width = "100px";
//        document.getElementById('articleThumbnail').style.padding = "10px";
//
//        document.getElementById('info-box').textContent =
//            event.feature.getProperty('letter');
//        document.getElementById('info-box').style.padding = "10px";
//        document.getElementById('info-box').style.paddingLeft = "10px";
//        document.getElementById('info-box').style.fontSize = "22px";
//        //locP = document.createElement('p');
//        document.getElementById('locP').textContent = event.feature.getProperty('location');
//
//        }
//
//        //highlight story in top stories sidebar
//
//
//    });

//    map.data.addListener('mouseout', function(event) {
//
//
//      map.data.revertStyle();
//      document.getElementById('info-box').innerHTML = "hover over a point";
//      document.getElementById('info-box').style.fontSize = "10px";
//      document.getElementById('articleThumbnail').src = "";
//      document.getElementById('articleThumbnail').style.visibility = "hidden";
//      document.getElementById('articleThumbnail').style.width = "0px";
//      document.getElementById('locP').textContent = "";
//      document.getElementById('locP').style.visibility = "hidden";
//
//      document.getElementById('content_container').style.opacity = 0;
//      document.getElementById('content_container').style.visibility = "hidden";
//      document.getElementById('content_container').style.visibility = "hidden";
//      document.getElementById('content_container').style.position = "absolute";
      //document.getElementById('content_container').style.left = "83%";
      //document.getElementById('content_container').style.top = "90%";
      //document.getElementById('content_container').style.width = "150px";
      //document.getElementById('content_container').style.height = "25px";

      //var storyId = event.feature.getProperty('url');
      //document.getElementById(storyId).style.backgroundColor = "rba(0,0,0,0)";
      //document.getElementById(storyId).addEventListener('mouseover', function(event) {
      //  document.getElementById(storyId).style.backgroundColor = "#48a7c4";
      //});

      //document.getElementById(storyId).addEventListener('mouseover', function(event) {
      //  document.getElementById(storyId).style.backgroundColor = "rgba(0,0,0,0)";
      //});


//    });
//  }

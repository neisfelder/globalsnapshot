
//NEED TO ADD storyTitle.onclick="goToCoords({{title[3]}},{{title[2]}},{{title[1]}});"


// Get the news stories from our JSON File
var storyList = [];

$.getJSON( "https://newsapptesting.appspot.com/results1.json", function( data ) {
    //console.log('data:');
    //console.log(data);
    $.each(data, function (index, value) {
        //console.log('jsonValue:');
        //var jsonValue = $.parseJSON(value);
        storyList.push(value);
    });

    //console.log( data );
    //$dict = $.parseJSON( data );
});


//  -------------------------------------     AmMap   ---------------------------------------------------------


/**
 * This example uses pulsating circles CSS by Kevin Urrutia
 * http://kevinurrutia.tumblr.com/post/16411271583/creating-a-css3-pulsating-circle
 */

// Get list of stories with associated data

var map = AmCharts.makeChart( "chartdiv", {
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
    "unlistedAreasColor": "#f7d1a0"
  },

  "dataProvider": {
    "map": "worldHigh",
    "images": storyList
  },

  "zoomControl": {
		"zoomControlEnabled": false
  },

  "listeners": [{
    "event": "rendered",
    "method": function(e) {
      // Let's log initial zoom settings (for home button)
      var map = e.chart;
      map.initialZoomLevel = map.zoomLevel();
      map.initialZoomLatitude = map.zoomLatitude();
      map.initialZoomLongitude = map.zoomLongitude();
    }
  }]

});


function zoomIn() {
  map.zoomIn();
}

function zoomOut() {
  map.zoomOut();
}

function centerMap() {
  map.zoomToLongLat(map.initialZoomLevel, map.initialZoomLongitude, map.initialZoomLatitude);
}


// add events to recalculate map position when the map is moved or zoomed
map.addListener( "positionChanged", updateCustomMarkers );
//map.addListener( "clickMapObject", zoomToStory);
// clickMapObject


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
  //markerID = seoURL(image.title);

  // create holder
  var holder = document.createElement( 'div' );
  holder.className = 'map-marker ' + parseInt(image.latitude) + ' ' + parseInt(image.longitude);
  holder.title = image.title;
  holder.id = makeSafeForCSS(image.title);
  holder.style.position = 'absolute';

  // maybe add a link to it?
//  if ( undefined != image.url ) {
//    holder.onclick = function() {
//      window.location.href = image.url;
//    };
//    holder.className += ' map-clickable';
//  }

  // create dot
  var dot = document.createElement( 'div' );
  dot.className = 'dot';
  holder.appendChild( dot );


  // create pulse
  var pulse = document.createElement( 'div' );
  pulse.className = 'pulse';
  holder.appendChild( pulse );

  var story = {}
  var keyToFind = holder.title;
  for(var i in storyList){
      if(storyList[i].title == keyToFind){
          story = storyList[i];
          break; // break out of the loop once you've found a match
      }
  }

  //Use Bootstrap to create popover with story preview on hover
  $(pulse).popover({
      trigger: 'hover',
      html: true,
      content: '<img class="story-thumb" src="' + story.thumbImage + '"/><span class="storyTitle">' + story.title + '</span><span class="location-tag">' + story.location + '</span>',
      animation: false,
      placement: 'top'
  })

  // append the marker to the map container
  image.chart.chartDiv.appendChild( holder );

  // apply hover behavior: popup with article title and thumbnail
  applyMarkerBehavior();


  // attach modal with complete preview
  addPopupModal( story, holder );

  // show corresponding popup div
  holder.onclick = function() {
    pulse.className += ' story-active';            // SHOULD TOGGLE!!!!
    showPreview( holder.id );
    zoomToStory(image.latitude, image.longitude);
  }


  return holder;
}


function zoomToStory( latitude, longitude ) {
    map.zoomToLongLat(5, longitude, latitude);
}



// when story marker is clicked, zoom and show full preview
    // Save $(this) as something so I can hide an show
function applyMarkerBehavior() {
    //$('div.map-marker').click(function() {
    //    console.log('latitude: ' + lat + ', longitude: ' + lng);
    //});

    $('.map-marker').hover(function() {
        //$(this).css("display", "block");
        //var preview = document.getElementById(this.id);
        $preview = $(this).find('div.story-preview');
        $preview.css('display', 'block');
    }, function(){
        //$(this).css("display", "hidden");
        $preview = $(this).find('div.story-preview');
        $preview.css('display', 'none');
    });
}


    function addPopupModal( story, marker ) {

        //var story = {};
//        var keyToFind = marker.title;
//        for(var i in storyList){
//            if(storyList[i].title == keyToFind){
//                story = storyList[i];
//                break; // break out of the loop once you've found a match
//            }
//        }

        var storyID = marker.id;
        var title = story.title;
        var authorTime = story.authorTime;
        var bigImg = story.bigImage;
        var abstract = story.abstract;
        var articleLink = story.urlAddress;
        var section = story.section


        var previewContainer = document.createElement('div');
        previewContainer.setAttribute("class", "modal right fade");
        previewContainer.setAttribute("tabindex", "-1");
        previewContainer.setAttribute("role", "dialog");
        previewContainer.setAttribute("aria-labelledby", "storyModal");
        previewContainer.setAttribute("id", storyID + "_modal");
        previewContainer.innerHTML =
                "<div class='modal-dialog' role='document'>" +
                   "<div class='modal-content'>" +

                        "<div class='modal-header'>" +
                            "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
                            "<img class='preview-photo' src='" + bigImg + "' alt='Story Photo' />" +
                            "<h4 class='modal-title'>" + title + "</h4>" +
                        "</div>" +

                        "<div class='modal-body'>" +
                            "<span class='authorTime'>" + authorTime + "</span>" +
                            "<p>" + abstract + "</p>" +
                            "<p>Article link: " + articleLink + "</p>" +
                            "<p>Image link: " + bigImg + "</p>" +
                            "<p>Section: " + section + "</p>"
                        "</div>" +

                    "</div> <!-- modal-content -->" +
                "</div> <!-- modal-dialog -->";

        document.getElementById('complete_summaries').appendChild(previewContainer);

    }

    function showPreview( markerID ) {
        //alert('showing story preview');
        //alert('opening ' + markerID);
        $modal = $('#' + markerID + "_modal");
        $modal.modal('toggle');
    }




//    function createHoverContents(title,location,preview,id) {
//        popover =
//        $('.popover-dismiss').popover({
//          trigger: 'hover'
//        })
//        p = document.createElement('p');
//        p.innerHTML = title;
//        return popover;
//        //highlight story in top stories sidebar
//    }


    function makeSafeForCSS(name) {
        return name.replace(/[^a-z0-9]/g, function(s) {
            var c = s.charCodeAt(0);
            if (c == 32) return '-';
            if (c >= 65 && c <= 90) return '_' + s.toLowerCase();
            return '__' + ('000' + c.toString(16)).slice(-4);
        });
    }

//    function seoURL($string) {
//        //Lower case everything
//        $string = strtolower($string);
//        //Make alphanumeric (removes all other characters)
//        $string = preg_replace("/[^a-z0-9_\s-]/", "", $string);
//        //Clean up multiple dashes or whitespaces
//        $string = preg_replace("/[\s-]+/", " ", $string);
//        //Convert whitespaces and underscore to dash
//        $string = preg_replace("/[\s_]/", "-", $string);
//        return $string;
//    }






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

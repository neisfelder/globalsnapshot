#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2
import jinja2
import ssl

import os
import logging

import urllib
import urllib2
import json
import webbrowser

from google.appengine.api import memcache


google_map_js_api_key = "AIzaSyABp_zac_pNDbqx23TBFlDu3I54IRdBqaA"
geocoding_api_key = "AIzaSyCmaKjBoBGuiBFlgnY5Eji6QqZsPOGSWwU" #"AIzaSyA7f_-Q8fAR7AVOpzDrL6Nsag2gfgm2vzw"
nytimes_stories_key = "67de0a42557841579de408edb9b54a1e"
nytimes_community_key = "632eb3e14b53496b82ea045484e21b74"


#returns data from NYTimes Top Stories V1 API

def pretty(obj):
    return json.dumps(obj, sort_keys=True, indent=2)

def safeGet(url):
    try:
        retrievedData = urllib2.urlopen(url)
        return retrievedData
    except urllib2.HTTPError, e:
        print "The server couldn't fulfill the request." 
        print "Error code: ", e.code
    except urllib2.URLError, e:
        print "We failed to reach a server"
        print "Reason: ", e.reason
    return None


def constructURL(baseurl = 'http://api.nytimes.com/svc/topstories/v1/',
    format = 'json',
    section = "world",
    params={},
    printurl = False
    ):

    params['api_key'] = nytimes_stories_key
    
    if format == "json": params["nojsoncallback"]=True
    url = "%s%s.%s?%s"%(baseurl, section, format, urllib.urlencode(params))

    return url
    

def getStories():
    dataResults = []
    
    urlWorld = constructURL()
    dataWorld = json.load(safeGet(urlWorld))["results"]
    urlHome = constructURL(section='home')
    dataHome = json.load(safeGet(urlHome))["results"]
    
    #urlPolitics = constructURL(section='politics')
    #dataPolitics = json.load(safeGet(urlPolitics))["results"]
    #urlBusiness = constructURL(section='business')
    #dataBusiness = json.load(safeGet(urlBusiness))["results"]
    #urlTech = constructURL(section='technology')
    #dataTech = json.load(safeGet(urlTech))["results"]
    #urlHealth = constructURL(section='health')
    #dataHealth = json.load(safeGet(urlHealth))["results"]
    #urlSports = constructURL(section='sports')
    #dataSports = json.load(safeGet(urlSports))["results"]
    #urlScience = constructURL(section='science')
    #dataScience = json.load(safeGet(urlScience))["results"]

    for worldStory in dataWorld:
        dataResults.append(worldStory)
    for homeStory in dataHome:
        dataResults.append(homeStory)

                                                                # TAG THESE IN SOME WAY SO THEY CAN BE FILTERED

    #for poliStory in dataPolitics:
    #    dataResults.append(poliStory) 
    #for businessStory in dataBusiness:
    #    dataResults.append(businessStory) 
    #for techStory in dataTech:
    #    dataResults.append(techStory) 
    #for healthStory in dataHealth:
    #    dataResults.append(healthStory) 
    #for scienceStory in dataScience:
    #    dataResults.append(scienceStory) 
    #for sportsStory in dataSports:
    #    dataResults.append(dataSports) 
    
    return dataResults


def coordExample(stories):
    withGeoTag = []
    for story in stories:
        if story["geo_facet"] == "":
            print "no geofacet"
        else:
            address = story["geo_facet"][0]
            print address

            baseurl = "https://maps.googleapis.com/maps/api/geocode/json?"

            params = {}
            params["address"] = address
            params['key'] = geocoding_api_key

            url = baseurl + urllib.urlencode(params)


            coordData = json.load(safeGet(url))

            #logging.info("geocode API return =\n")
            #logging.info(pretty(coordData))
            if len(coordData["results"]) < 1:
                logging.info("no geocode results")
            else:
                coords = coordData["results"][0]["geometry"]["location"]
                story["coordinates"] = coords

                withGeoTag.append(story)
    return withGeoTag


def overallInfo():
    
    ##code for locating cache and checking if it has expired
    data = []
    storyCache = memcache.get("story_cache")
    
    #check if key="storyCache" is in cache
    if storyCache is not None:
        data = storyCache
    else:
        stories = getStories()
        data = coordExample(stories)
        memcache.add(key="story_cache", value=data, time=3600)

    return data

def getComments(articleUrl):
    baseurl = "http://api.nytimes.com/svc/community/v3/user-content/url.json?"

    #targetUrl = urllib.unquote(articleUrl)
    targetUrl = articleUrl

    url = "%sapi-key=%s&url=%s"%(baseurl,nytimes_community_key,targetUrl)

    logging.info("community url --------------")
    logging.info(url)
    commentData = json.load(safeGet(url))
    commentDataList = commentData["results"]["comments"]
    commentList = [[dataList["commentBody"],dataList["userDisplayName"],dataList["userLocation"]] for dataList in commentDataList]
    logging.info("comment list = ---------")
    logging.info(commentList)
    logging.info("------------------")
    return commentList

###Methods using jinja to create web pages

JINJA_ENVIRONMENT = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

class MainHandler(webapp2.RequestHandler):
    def get(self):
        logging.info("In MainHandler")
        template_values={}

        template_values["page_title"] = "Global Snapshot"
        template_values["KEY"] = google_map_js_api_key

        template_values["description"] = "NYTimes Story Feed"

        storyList = overallInfo()[:6]
        
        template_values["storyList"] = [[story["title"], story["url"], float(story["coordinates"]["lat"]), float(story["coordinates"]["lng"])] for story in storyList]

        template = JINJA_ENVIRONMENT.get_template('ammap_page.html')
        self.response.write(template.render(template_values))
        

class myJSONHandler(webapp2.RequestHandler):
    def get(self):
        vals = {}
        vals["page_title"] = "News Index"
        vals["description"] = "Top stories today: ..."

        storiesWithCoords = overallInfo()

        vals_list = []
        for storyWithCoords in storiesWithCoords:

            lat = float(storyWithCoords["coordinates"]["lat"])
            lng = float(storyWithCoords["coordinates"]["lng"])


            storyDict = {}
            storyDict["story"] = storyWithCoords["title"]
            storyDict["coordinates"] = [lng,lat]
            #storyDict["color"] = "#f44242"
            storyDict["url"] = storyWithCoords["url"]
            storyDict["abstract"] = "%s.."%(storyWithCoords["abstract"])

            #logging.info("getting comments")
            #storyComments = getComments(storyWithCoords["url"])
            #storyComments = getComments("https:%s"%(storyWithCoords["url"][5:]))
            
            loc = storyWithCoords["geo_facet"][0]
            shortLoc = ""
            if len(loc) > 27:
                shortLoc = "%s..." % loc[:27]
            else:
                shortLoc = loc
            storyDict["location"] = shortLoc

            storyTime = storyWithCoords["created_date"].split("-")
            storyTimeLast = "%s.%s.%s" % (storyTime[1],storyTime[2][:2],storyTime[0][2:])
            storyDict["authorTime"] = "%s, %s" % (storyWithCoords["byline"], storyTimeLast)
            #storyDict["comments"] = storyComments
            if storyWithCoords["multimedia"] != "":
                thumbnail = storyWithCoords["multimedia"]
                storyDict["image"] = thumbnail[len(thumbnail) - 1]["url"]
                storyDict["thumbImage"] = thumbnail[0]["url"]

            vals_list.append(storyDict)

        vals["articles"] = vals_list
        #vals['articles'] = [ {
                            #   "zoomLevel": 5,
                            #   "scale": 0.5,
                            #   "title": "Brussels",
                            #   "latitude": 50.8371,
                            #   "longitude": 4.3676
                            # }, {
                            #   "zoomLevel": 5,
                            #   "scale": 0.5,
                            #   "title": "Copenhagen",
                            #   "latitude": 55.6763,
                            #   "longitude": 12.5681
                            # }, {
                            #   "zoomLevel": 5,
                            #   "scale": 0.5,
                            #   "title": "Paris",
                            #   "latitude": 48.8567,
                            #   "longitude": 2.3510
                            # }, {
                            #   "zoomLevel": 5,
                            #   "scale": 0.5,
                            #   "title": "Reykjavik",
                            #   "latitude": 64.1353,
                            #   "longitude": -21.8952
                            # }, {
                            #   "zoomLevel": 5,
                            #   "scale": 0.5,
                            #   "title": "Moscow",
                            #   "latitude": 55.7558,
                            #   "longitude": 37.6176
                            # }, {
                            #   "zoomLevel": 5,
                            #   "scale": 0.5,
                            #   "title": "Madrid",
                            #   "latitude": 40.4167,
                            #   "longitude": -3.7033
                            # }, {
                            #   "zoomLevel": 5,
                            #   "scale": 0.5,
                            #   "title": "London",
                            #   "latitude": 51.5002,
                            #   "longitude": -0.1262,
                            #   "url": "http://www.google.co.uk"
                            # }, {
                            #   "zoomLevel": 5,
                            #   "scale": 0.5,
                            #   "title": "Peking",
                            #   "latitude": 39.9056,
                            #   "longitude": 116.3958
                            # }, {
                            #   "zoomLevel": 5,
                            #   "scale": 0.5,
                            #   "title": "New Delhi",
                            #   "latitude": 28.6353,
                            #   "longitude": 77.2250
                            # }, {
                            #   "zoomLevel": 5,
                            #   "scale": 0.5,
                            #   "title": "Tokyo",
                            #   "latitude": 35.6785,
                            #   "longitude": 139.6823,
                            # }, {
                            #   "zoomLevel": 5,
                            #   "scale": 0.5,
                            #   "title": "Ankara",
                            #   "latitude": 39.9439,
                            #   "longitude": 32.8560
                            # }, {
                            #   "zoomLevel": 5,
                            #   "scale": 0.5,
                            #   "title": "Buenos Aires",
                            #   "latitude": -34.6118,
                            #   "longitude": -58.4173
                            # }, {
                            #   "zoomLevel": 5,
                            #   "scale": 0.5,
                            #   "title": "Brasilia",
                            #   "latitude": -15.7801,
                            #   "longitude": -47.9292
                            # }, {
                            #   "zoomLevel": 5,
                            #   "scale": 0.5,
                            #   "title": "Ottawa",
                            #   "latitude": 45.4235,
                            #   "longitude": -75.6979
                            # }, {
                            #   "zoomLevel": 5,
                            #   "scale": 0.5,
                            #   "title": "Washington",
                            #   "latitude": 38.8921,
                            #   "longitude": -77.0241
                            # }, {
                            #   "zoomLevel": 5,
                            #   "scale": 0.5,
                            #   "title": "Kinshasa",
                            #   "latitude": -4.3369,
                            #   "longitude": 15.3271
                            # }, {
                            #   "zoomLevel": 5,
                            #   "scale": 10.0,
                            #   "title": "Cairo Dude",
                            #   "latitude": 30.0571,
                            #   "longitude": 31.2272
                            # }, {
                            #   "zoomLevel": 5,
                            #   "scale": 10.0,
                            #   "title": "Pretoria",
                            #   "latitude": -25.7463,
                            #   "longitude": 28.1876
                            # } ]

        template = JINJA_ENVIRONMENT.get_template('results.json')
        self.response.write(template.render(vals))

class aboutHandler(webapp2.RequestHandler):
    def get(self):
        vals = {}
        vals["page_title"] = "About"

        template = JINJA_ENVIRONMENT.get_template('aboutpage.html')
        self.response.write(template.render(vals))

class landingHandler(webapp2.RequestHandler):
    def get(self):
        vals = {}
        vals["page_title"] = "Global Snapshot"

        template = JINJA_ENVIRONMENT.get_template('landing.html')
        self.response.write(template.render(vals))

# for all URLs except alt.html, use MainHandler
application = webapp2.WSGIApplication([ \
                                      ('/results1.json', myJSONHandler),
                                      ('/map', MainHandler),
                                      ('/about', aboutHandler),
                                      ('/', landingHandler),
                                      ],
                                      debug=True)

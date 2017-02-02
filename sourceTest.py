#sourceTest

#import webapp2
#import jinja2
#import ssl

import os
import logging
import urllib
import urllib2
import json
import unirest
#import webbrowser


# These code snippets use an open-source library. http://unirest.io/python
response = unirest.post("https://alertifyme-news.p.mashape.com/news.php",
  headers={
    "X-Mashape-Key": "Wiv90RgWBhmshMv4420LkfAcyhuip1vDqAijsnAEKLe8nTI9YK",
    "Accept": "application/json"
  }
)

responseData = response.body
print responseData


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

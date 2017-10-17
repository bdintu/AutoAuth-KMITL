#!/bin/bash
IP='8.8.8.8'
if ping -c 1 $IP &> /dev/null
then
	echo "Host found"
else
	echo "Host not found"
	phantomjs fb_login.js
fi

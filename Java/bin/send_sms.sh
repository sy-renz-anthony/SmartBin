#!/bin/bash

if [ "$#" -ne 2 ]; then
	echo "Error: Invalid number of paramters"
	exit 1
fi

NUMBER="$1"
MESSAGE="$2"


stty -F /dev/ttyS2 115200 -echo -icrnl -ixon
sleep 0.5

echo -e "at\r" > /dev/ttyS2
sleep 0.5

cat /dev/ttyS2 &
sleep 1

echo -e "at+csq\r" > /dev/ttyS2
sleep 0.5

echo -e "at+cmgf=1\r" > /dev/ttyS2
sleep 0.5

echo -e "at+cmgs=\"$NUMBER\"\r" > /dev/ttyS2
sleep 0.5

echo -e "$MESSAGE\x1A" > /dev/ttyS2
sleep 3

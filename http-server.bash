#!/bin/bash
if ! type python > /dev/null;
then
    echo "Please install python to use this script, or"
    echo "run another http server that runs on port 3311"
    echo "and shares the current directory and its children"
    exit 1
fi

pyv=$(python -c 'import sys; print(sys.version_info[0])')

if [ "$pyv" -eq "2" ]
then
    echo "Using Python 2"
    python -m SimpleHTTPServer 3311
else
    echo "Using Python 3"
    python -m http.server 3311

fi
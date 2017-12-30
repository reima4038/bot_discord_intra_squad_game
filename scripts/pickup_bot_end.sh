#!/bin/bash
pid=`ps aux | grep -e 'node index.js' -e 'pickup_bot_start.sh'| grep -v 'grep' | awk '{print $2}'`
kill -9 ${pid}
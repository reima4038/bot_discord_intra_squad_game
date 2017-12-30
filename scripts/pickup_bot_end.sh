#!/bin/bash
pid=`ps aux | grep -e 'node index.js' -e 'bot_start.sh'| grep -v 'grep' | awk '{print $2}'`
kill ${pid}
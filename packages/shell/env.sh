#!/bin/bash
envsubst < env.template.js > /usr/share/nginx/html/"$1"/env.js

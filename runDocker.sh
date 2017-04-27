#!/bin/bash
source env.sh
docker run --name yelp-bot -d -e YELP_SECRET=$YELP_SECRET -e YELP_ID=$YELP_ID wkronmiller/yelp-bot

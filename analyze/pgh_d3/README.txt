I guess I was trying to make a way to query tweet data here.
To run it, source the env/bin/activate, then do ./main.py then go to
localhost:5000/

Neighborhood data from http://pittsburghpa.gov/dcp/gis/gis-data (Census Data link)

Things I did to this data before importing it into d3:
ogr2ogr -f GeoJSON -t_srs -t_srs "+proj=longlat +ellps=WGS84 +no_defs +towgs84=0,0,0" neighborhoods.json Neighborhood/Neighborhood.shp
(changing it from Shapefiles into GeoJSON)

topojson neighborhoodstopo.json neighborhoods.json
(changing it from GeoJSON to TopoJSON)

Tweets data from Mongo exported like so (for a short array):
mongoexport --db tweet --collection tweet_pgh --out tweets.json --jsonArray

Or from the real MongoDB, I ran:
mongoexport --db tweet --collection tweet_pgh | head -1000 > 1ktweets.json
(and then the same for 10k, 100k, etc. MongoDB 2.6 will have a "limit" option
on this query so we don't have to do the "head" thing, but Mongo 2.4 doesn't.)
Anyway, then I did:
./join_json.py < 1ktweets.json > 1ktweetsarray.json


MAXMIND_LICENSE_KEY=$(grep MAXMIND_LICENSE_KEY .env | cut -d '=' -f2 | sed -e 's/^"//' -e 's/"$//')
rm -f GeoLite2-City.mmdb
curl -so GeoLite2-City.tar.gz "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=$MAXMIND_LICENSE_KEY&suffix=tar.gz"
tar -xf GeoLite2-City.tar.gz
rm GeoLite2-City.tar.gz
FOLDER=$(find . -type d -regex ".*GeoLite2-City.*")
mv $FOLDER/GeoLite2-City.mmdb GeoLite2-City.mmdb
rm -r $FOLDER
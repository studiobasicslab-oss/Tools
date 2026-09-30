import urllib.request, json, urllib.parse
titles = ["Brown_noise.ogg", "Rain_and_thunder_4.ogg", "Thunderstorm_in_forest.ogg", "Stream_water.ogg", "Ocean_waves_crashing_on_rocks.ogg", "Coffee_shop_ambiance.ogg", "Campfire_sound.ogg"]
for title in titles:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote('File:'+title)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        res = urllib.request.urlopen(req)
        data = json.loads(res.read().decode('utf-8'))
        pages = data['query']['pages']
        page = list(pages.values())[0]
        if 'imageinfo' in page:
            print(title, page['imageinfo'][0]['url'])
        else:
            print(title, "NOT FOUND")
    except:
        pass

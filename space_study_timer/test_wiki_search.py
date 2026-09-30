import urllib.request, json, urllib.parse

def search_wiki_audio(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query + ' filetype:ogg')}&srnamespace=6&utf8=&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        res = urllib.request.urlopen(req)
        data = json.loads(res.read().decode('utf-8'))
        if data['query']['search']:
            title = data['query']['search'][0]['title']
            fileinfo_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&format=json"
            req2 = urllib.request.Request(fileinfo_url, headers={'User-Agent': 'Mozilla/5.0'})
            res2 = urllib.request.urlopen(req2)
            data2 = json.loads(res2.read().decode('utf-8'))
            pages = data2['query']['pages']
            page = list(pages.values())[0]
            if 'imageinfo' in page:
                print(query, "->", page['imageinfo'][0]['url'])
                return
    except Exception as e:
        print(f"Error {query}: {e}")
    print(query, "-> NOT FOUND")

queries = ["rain heavy", "stream water bubbling", "thunderstorm", "ocean waves", "coffee shop ambiance", "campfire"]
for q in queries:
    search_wiki_audio(q)

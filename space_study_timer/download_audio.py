import urllib.request
import urllib.parse
import json
import os

def search_and_download(query, filename):
    print(f"Searching for {query}...")
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query + ' filetype:ogg')}&srnamespace=6&utf8=&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))
        
        if data['query']['search']:
            title = data['query']['search'][0]['title']
            print(f"Found: {title}")
            
            # Get file info
            fileinfo_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&format=json"
            req2 = urllib.request.Request(fileinfo_url, headers={'User-Agent': 'Mozilla/5.0'})
            res2 = urllib.request.urlopen(req2)
            data2 = json.loads(res2.read().decode('utf-8'))
            
            pages = data2['query']['pages']
            page = list(pages.values())[0]
            if 'imageinfo' in page:
                file_url = page['imageinfo'][0]['url']
                print(f"Downloading {file_url} to {filename}...")
                
                req3 = urllib.request.Request(file_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req3) as response, open(filename, 'wb') as out_file:
                    out_file.write(response.read())
                print(f"Downloaded {filename}")
                return True
    except Exception as e:
        print(f"Error: {e}")
    print(f"Failed to download {query}")
    return False

os.makedirs("public/audio", exist_ok=True)
search_and_download("rain", "public/audio/rain.ogg")
search_and_download("stream water", "public/audio/stream.ogg")
search_and_download("campfire", "public/audio/campfire.ogg")
search_and_download("brown noise", "public/audio/brownnoise.ogg")

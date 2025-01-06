# VERSION: 4.0
# AUTHORS: Diego de las Heras (ngosang@hotmail.es)
# CONTRIBUTORS: ukharley
#               hannsen (github.com/hannsen)
#               Alexander Georgievskiy <galeksandrp@gmail.com>

import json
import os
import xml.etree.ElementTree
from urllib.parse import urlencode, unquote
from urllib import request as urllib_request
from http.cookiejar import CookieJar
from multiprocessing.dummy import Pool
from threading import Lock

from novaprinter import prettyPrinter
from helpers import download_file


###############################################################################
# load configuration from file
CONFIG_FILE = 'jackett.json'
CONFIG_PATH = os.path.join(os.path.dirname(os.path.realpath(__file__)), CONFIG_FILE)
CONFIG_DATA = {
    'api_key': '',  # jackett api
    'url': 'https://jacred.xyz',  # jackett url
    'tracker_first': False,          # (False/True) add tracker name to beginning of search result
    'thread_count': 20,              # number of threads to use for http requests
}
XML_API = False
PRINTER_THREAD_LOCK = Lock()


def load_configuration():
    global CONFIG_PATH, CONFIG_DATA
    try:
        # try to load user data from file
        with open(CONFIG_PATH) as f:
            CONFIG_DATA = json.load(f)
    except ValueError:
        # if file exists, but it's malformed we load add a flag
        CONFIG_DATA['malformed'] = True
    except Exception:
        # if file doesn't exist, we create it
        save_configuration()

    # do some checks
    if any(item not in CONFIG_DATA for item in ['api_key', 'tracker_first', 'url']):
        CONFIG_DATA['malformed'] = True

    # add missing keys
    if 'thread_count' not in CONFIG_DATA:
        CONFIG_DATA['thread_count'] = 20
        save_configuration()


def save_configuration():
    global CONFIG_PATH, CONFIG_DATA
    with open(CONFIG_PATH, 'w') as f:
        f.write(json.dumps(CONFIG_DATA, indent=4, sort_keys=True))


load_configuration()
###############################################################################


class jackett(object):
    name = 'Jackett'
    url = CONFIG_DATA['url'] if CONFIG_DATA['url'][-1] != '/' else CONFIG_DATA['url'][:-1]
    api_key = CONFIG_DATA['api_key']
    thread_count = CONFIG_DATA['thread_count']
    supported_categories = {
        'all': None,
        'anime': ['5070'],
        'books': ['8000'],
        'games': ['1000', '4000'],
        'movies': ['2000'],
        'music': ['3000'],
        'software': ['4000'],
        'tv': ['5000'],
    }

    def download_torrent(self, download_url):
        # fix for some indexers with magnet link inside .torrent file
        if download_url.startswith('magnet:?'):
            print(download_url + " " + download_url)
        response = self.get_response(download_url)
        if response is not None and response.startswith('magnet:?'):
            print(response + " " + download_url)
        else:
            print(download_file(download_url))

    def search(self, what, cat='all'):
        what = unquote(what)
        category = self.supported_categories[cat.lower()]

        # check for malformed configuration
        if 'malformed' in CONFIG_DATA:
            self.handle_error("malformed configuration file", what)
            return

        # check api_key
        if self.api_key == "YOUR_API_KEY_HERE":
            self.handle_error("api key error", what)
            return

        # search in Jackett API
        if self.thread_count > 1:
            args = []
            indexers = self.get_jackett_indexers(what)
            for indexer in indexers:
                args.append((what, category, indexer))
            with Pool(min(len(indexers), self.thread_count)) as pool:
                pool.starmap(self.search_jackett_indexer, args)
        else:
            self.search_jackett_indexer(what, category, 'all')

    def write_log(self, v):
        with open("/tmp/log.txt", "a") as f:
            f.write(v + "\n")

    def get_jackett_indexers(self, what):
        if not XML_API:
            return ["custom"]
        params = [
            ('apikey', self.api_key),
            ('t', 'indexers'),
            ('configured', 'true')
        ]
        params = urlencode(params)
        jacket_url = self.url + "/api/v2.0/indexers/all/results/torznab/api?%s" % params
        self.write_log(jacket_url)
        response = self.get_response(jacket_url)
        if response is None:
            try:
                self.write_log("Resp: " + str(response))
            except Exception as e:
                self.write_log(str(e))
            self.handle_error("connection error getting indexer list", what)
            return
        # process results
        response_xml = xml.etree.ElementTree.fromstring(response)
        indexers = []
        for indexer in response_xml.findall('indexer'):
            indexers.append(indexer.attrib['id'])
        return indexers

    def search_jackett_indexer(self, what, category, indexer_id):
        # prepare jackett url
        params = [
            ('apikey', self.api_key),
            ('Query', what)
        ]
        if category is not None:
            params.append(('Category[]', ','.join(category)))
        
        params = urlencode(params)
        jacket_url = self.url + "/api/v2.0/indexers/all/results?%s" % params
        self.write_log("Jacket URL: " + jacket_url)

        response = self.get_response(jacket_url)
        try:
            # Create opener with no headers
            opener = urllib_request.build_opener()
            opener.addheaders = [] # Clear all headers
            
            # Make request with empty headers
            response = opener.open(jacket_url).read().decode('utf-8')
        except Exception as e:
            self.write_log("Error: " + str(e))
            self.handle_error("connection error for indexer: " + indexer_id, what)
            return
        if response is None:
            self.handle_error("connection error for indexer: " + indexer_id, what)
            return

        # Parse JSON response
        try:
            results = json.loads(response)
        except json.JSONDecodeError:
            self.handle_error("invalid JSON response", what)
            return

        # Process search results
        for result in results.get('Results', []):
            res = {}

            title = result.get('Title')
            if not title:
                continue

            tracker = result.get('Tracker', '')
            if CONFIG_DATA['tracker_first']:
                res['name'] = '[%s] %s' % (tracker, title)
            else:
                res['name'] = '%s [%s]' % (title, tracker)

            res['link'] = result.get('MagnetUri')
            if not res['link']:
                continue

            size = result.get('Size', -1)
            res['size'] = f"{size} B" if size != -1 else -1

            res['seeds'] = result.get('Seeders', -1)
            res['leech'] = result.get('Peers', -1)

            if res['seeds'] != -1 and res['leech'] != -1:
                res['leech'] -= res['seeds']

            res['desc_link'] = result.get('Details', '')

            # note: engine_url can't be changed, torrent download stops working
            res['engine_url'] = self.url
            # res['desc_link'] = result.get('Tracker', self.url)

            self.pretty_printer_thread_safe(res)

    def generate_xpath(self, tag):
        return './{http://torznab.com/schemas/2015/feed}attr[@name="%s"]' % tag

    def get_response(self, query):
        response = None
        try:
            # we can't use helpers.retrieve_url because of redirects
            # we need the cookie processor to handle redirects
            opener = urllib_request.build_opener(urllib_request.HTTPCookieProcessor(CookieJar()))
            response = opener.open(query).read().decode('utf-8')
        except urllib_request.HTTPError as e:
            # if the page returns a magnet redirect, used in download_torrent
            if e.code == 302:
                response = e.url
        except Exception:
            pass
        return response

    def handle_error(self, error_msg, what):
        # we need to print the search text to be displayed in qBittorrent when
        # 'Torrent names only' is enabled
        self.pretty_printer_thread_safe({
            'seeds': -1,
            'size': -1,
            'leech': -1,
            'engine_url': self.url,
            'link': self.url,
            'desc_link': 'https://github.com/qbittorrent/search-plugins/wiki/How-to-configure-Jackett-plugin',  # noqa
            'name': "Jackett: %s! Right-click this row and select 'Open description page' to open help. Configuration file: '%s' Search: '%s'" % (error_msg, CONFIG_PATH, what)  # noqa
        })

    def pretty_printer_thread_safe(self, dictionary):
        global PRINTER_THREAD_LOCK
        with PRINTER_THREAD_LOCK:
            prettyPrinter(self.escape_pipe(dictionary))

    def escape_pipe(self, dictionary):
        # Safety measure until it's fixed in prettyPrinter
        for key in dictionary.keys():
            if isinstance(dictionary[key], str):
                dictionary[key] = dictionary[key].replace('|', '%7C')
        return dictionary


if __name__ == "__main__":
    jackett_se = jackett()
    jackett_se.search("ubuntu server", 'software')


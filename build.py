#!/usr/bin/env python

from __future__ import print_function

import json
import shutil
import sys


def help():
    print('Usage: %s (chrome | firefox)' % sys.argv[0])
    sys.exit(1)


def extract_extension_version(browser):
    extension_version = ''

    if browser == 'chrome':
        with open('chrome/manifest.json') as content:
            content_json = json.load(content)
            extension_version = content_json.get('version')
    else:
        help()

    return extension_version


def main():
    try:
        browser = sys.argv[1]

        # https://developer.mozilla.org/en-US/Add-ons/WebExtensions
        if browser == 'firefox':
            browser = 'chrome'

        extension_version = extract_extension_version(browser)
        zip_name = 'dist/{}-{}'.format(browser, extension_version)

        print('Building {}.zip'.format(zip_name))

        shutil.make_archive(zip_name, 'zip', browser)
        print('Ok')
    except IndexError:
        help()


if __name__ == '__main__':
    main()

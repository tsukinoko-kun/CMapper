import os
import http.client
import urllib.request
import urllib.parse
import urllib.error
import sys
from pathlib import Path
from distutils.dir_util import copy_tree

print("tsc")
os.system("tsc -p ./tsconfig.json --pretty")

if True:
    print("closure-compiler")
    js_path = "./public/app.js"
    file_object = open(js_path, "r")
    code = file_object.read()
    file_object.close()
    params = urllib.parse.urlencode([
        ('js_code', code),
        # WHITESPACE_ONLY
        # SIMPLE_OPTIMIZATIONS
        # ADVANCED_OPTIMIZATIONS
        ('compilation_level', 'SIMPLE_OPTIMIZATIONS'),
        ('output_format', 'text'),
        ('output_info', 'compiled_code'),
    ])
    headers = {"Content-type": "application/x-www-form-urlencoded"}
    conn = http.client.HTTPSConnection('closure-compiler.appspot.com')
    conn.request('POST', '/compile', params, headers)
    response = conn.getresponse()
    data = response.read()
    code = data.decode("utf-8")
    print(code)
    file_object = open(js_path, "w")
    file_object.write('"use strict";\n'+code)
    file_object.close()
    conn.close()

style = open("./public/style.css","w+")
style.write("")
style.close()
style = open("./public/style.css", "a")

scss = list(Path(".").rglob("*.scss"))
for file in scss:
    print(file)
    compiledFile = "temp/" +os.path.basename(file).replace(".scss", ".css")
    os.system("sass "+str(file)+" " + compiledFile + " --style compressed --no-source-map --update")
    cssTemp = open(compiledFile, "r")
    txt = cssTemp.read()
    style.write(txt)
    cssTemp.close()

style.close()

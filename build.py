import os
import http.client
import urllib.request
import urllib.parse
import urllib.error
import sys
from pathlib import Path
from distutils.dir_util import copy_tree

tsc = False
cc = False
scss = False
deploy = False

def hr():
    print("================================")

def title(t):
    print('\033[95m'+str(t)+'\033[0m')

def info(i):
    print('\033[0m'+str(i)+'\033[0m')

def error(e):
    print('\033[91m'+str(e)+'\033[0m')

for arg in sys.argv:
    if arg == "-tsc":
        tsc = True
    else:
        if arg == "-cc":
            cc = True
        else:
            if arg == "-scss":
                scss = True
            else:
                if arg == "-deploy":
                    deploy = True

if tsc:
    title("tsc")
    os.system("tsc -p ./tsconfig.json --pretty")
    hr()

if cc:
    title("closure-compiler")
    js_path = "./public/app.js"
    file_object = open(js_path, "r")
    code = file_object.read()
    file_object.close()
    params = urllib.parse.urlencode([
        # WHITESPACE_ONLY
        # SIMPLE_OPTIMIZATIONS
        # ADVANCED_OPTIMIZATIONS
        ('compilation_level', 'SIMPLE_OPTIMIZATIONS'),
        ('output_format', 'text'),
        ('output_info', 'compiled_code'),
        ('js_code', code),
    ])
    headers = {"Content-type": "application/x-www-form-urlencoded"}
    conn = http.client.HTTPSConnection('closure-compiler.appspot.com')
    conn.request('POST', '/compile', params, headers)
    response = conn.getresponse()
    data = response.read()
    code = data.decode("utf-8")
    if code == "" or code == "\n":
        error("Compiler Error")
        conn.close()
        exit()
    else:
        if code.count("com.google.javascript.jscomp")>1:
            error("Compiler Error")
            conn.close()
            exit()
        else:
            info(code)
            file_object = open(js_path, "w")
            file_object.write('"use strict";\n'+code)
            file_object.close()
            conn.close()
    hr()

if scss:
    title("scss")
    style = open("./public/style.css","w+")
    style.write("")
    style.close()
    style = open("./public/style.css", "a")

    scss = list(Path(".").rglob("*.scss"))
    for file in scss:
        info(file)
        compiledFile = "temp/" +os.path.basename(file).replace(".scss", ".css")
        os.system("sass "+str(file)+" " + compiledFile + " --style compressed --no-source-map --update")
        cssTemp = open(compiledFile, "r")
        txt = cssTemp.read()
        style.write(txt)
        cssTemp.close()
    style.close()
    hr()

if deploy:
    title("deploy")
    os.system("firebase deploy")
    hr()

title("Done!")
exit()

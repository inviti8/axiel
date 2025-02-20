import os
from flask import Flask, render_template, request, session, redirect, jsonify, url_for
from pymacaroons import Macaroon, Verifier
from tinydb import TinyDB, Query
from platformdirs import *
from axielMachine import AxielMachine

app = Flask(__name__)
app.secret_key = os.urandom(24)
xelis_wallet_dirs = PlatformDirs('xelis-blockchain', 'Xelis')

SCRIPT_DIR = os.path.abspath( os.path.dirname( __file__ ) )
STATIC_PATH = os.path.join(SCRIPT_DIR, "static")
DB_PATH = os.path.join(SCRIPT_DIR, "enc_db.json")
COMPONENT_PATH = os.path.join(SCRIPT_DIR, "components")
WALLET_PATH = xelis_wallet_dirs.user_data_dir

AXIEL = AxielMachine(STATIC_PATH, DB_PATH, WALLET_PATH)
AXIEL.initialize()

def _load_components(comp):
   result = None
   with open(os.path.join(COMPONENT_PATH, f'{comp}.html'), 'r') as f:
        result = f.read()

   return result

def _load_js(comp):
 return url_for('static', filename=f'{comp}.js')
 
@app.route('/')
def home():
   template = AXIEL.view_template
   components=_load_components(AXIEL.view_components)
   js=_load_js(AXIEL.view_components)
   logo=AXIEL.logo_url
   shared_dialogs=_load_components(AXIEL.shared_dialogs)
   shared_dialogs_js=_load_js(AXIEL.shared_dialogs)
   client_tokens= _load_js('macaroons_js_bundle')
   session_pub = AXIEL.new_session()
   return render_template(template, components=components, js=js, logo=logo, shared_dialogs=shared_dialogs, shared_dialogs_js=shared_dialogs_js, client_tokens=client_tokens, session_pub=session_pub)
   #return jsonify(message='||AXIEL||')

@app.route('/establish', methods=['POST'])
def establish():
   data = request.get_json()
   # Here you would normally save the data to a database
   return jsonify(message='Data received', data=data), 201

@app.route('/data', methods=['POST'])
def create_data():
   data = request.get_json()
   # Here you would normally save the data to a database
   return jsonify(message='Data received', data=data), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
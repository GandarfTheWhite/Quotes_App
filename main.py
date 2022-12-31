
from flask import Flask, render_template, jsonify, request, make_response
import json, os


app = Flask(__name__)

@app.route('/')
def home():
  '''
  Returns the index page to the browser
  '''
  return render_template('index.html')


@app.route("/api/quotes", methods=['GET'])
def getQuotes():
  '''
  Reads the quotes in the quotes.json file
  format the result into JSON response object
  return the JSON response object
  '''
  
  print("getting quotes on api")
  
  root_path = os.path.realpath(os.path.dirname(__name__))
  file_path = os.path.join(root_path, "data", "quotes.json")
  
  with open(file_path, 'r') as openfile:
    json_object = json.load(openfile)
    
    response = make_response(
      json_object,
      200
    )
    return response
  
  return "Error reading file"


@app.route("/api/quotes", methods=['PUT'])
def upload():
  '''
  Receive JSON data from the request object
  and save it to the quotes.json file
  return the JSON response  
  '''
  
  print('saving quotes on api')
  messageOk = jsonify(message="Quotes uploaded!")
  messageFail = jsonify(message="Uploading quotes failed as data not in JSON format!")
  if request.is_json:
    req = request.get_json() 
    site_root = os.path.realpath(os.path.dirname(__name__))
    
    json_url = os.path.join(site_root, "data", "quotes.json")
    with open(json_url, 'w') as openfile:
      json.dump(req, openfile)
    return messageOk, 200
  else:
    return messageFail, 400


if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8080)
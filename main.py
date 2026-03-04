import subprocess
from flask import Flask, request

app = Flask(__name__)

@app.route('/ping')
def ping_host():
    target = request.args.get('target', 'localhost')
    
    # The Hacker Phase Vulnerability: Unsanitized input passed directly to the shell
    command = f"ping -c 1 {target}"
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    
    return result.stdout

if __name__ == '__main__':
    app.run(port=8080)

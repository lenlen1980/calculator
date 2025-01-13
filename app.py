from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def calculator():
    return render_template('calculator.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
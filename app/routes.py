@app.route('/calculator')
def calculator():
    return render_template('calculator.html')
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), unique=True, nullable=False)
    complete = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f"{self.title} - {self.complete}"
    
# http://127.0.0.1:5000/tasks
@app.route('/tasks', methods=['POST'])
def add_task():

    task = Task(title=request.json['title'])
    db.session.add(task)
    db.session.commit()
    return {'id': task.id}

# http://127.0.0.1:5000/tasks
@app.route('/tasks')
def get_tasks():
    # get all tasks from database
    tasks = Task.query.all()
    # make a empty list to store tasks
    output = []
    # make a List of Dictionaries
    for task in tasks:
        # for each task, a dictionary task_data is created, containing the task’s details.
        task_data = {"id": task.id, "title": task.title, "complete": task.complete}
        # The task_data dictionary is appended to the output list, collecting the data for all tasks.
        output.append(task_data)
        # return as a JSON response within a dictionary under the key "tasks"
    return {"tasks": output} 

# http://127.0.0.1:5000/tasks/id
@app.route('/tasks/<int:id>')
def get_task(id):
    task = Task.query.get_or_404(id)
    return {"id": task.id, "title": task.title, "complete": task.complete}

# http://127.0.0.1:5000/tasks/id
@app.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    task = Task.query.get_or_404(id)

    if 'title' in request.json:
        task.title = request.json['title']
    if 'complete' in request.json:
        task.complete = request.json['complete']

    db.session.commit()
    return {"message": "task successfully updated", "id": task.id, "title": task.title, "complete": task.complete}

# http://127.0.0.1:5000/tasks/id
@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get_or_404(id)
    db.session.delete(task)
    db.session.commit()
    return {"message": "task successfully deleted"}

if __name__ == "__main__":
    app.run(debug=True)
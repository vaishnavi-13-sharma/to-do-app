function getTasks() {
    fetch("http://127.0.0.1:5000/tasks")
        .then(response => response.json())
        .then(data => {
            let output = '';
            data.tasks.forEach(task => {
                output += `
                    <div class="mb-3">
                        <strong>${task.title}</strong>
                        <div>
                            Complete: <input type="checkbox" data-id="${task.id}" ${task.complete ? "checked" : ""}>
                            <button data-id="${task.id}" class="btn btn-danger delete-btn ml-2">Delete</button>
                        </div>
                    </div>
                `;
            });
            document.getElementById("todo-list").innerHTML = output;
            attachEventListeners();
        })
        .catch(error => {
            console.error("Error fetching tasks:", error);
        });
}

function attachEventListeners() {
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", function() {
            const taskId = this.getAttribute("data-id");
            fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if(response.ok) getTasks(); 
                else throw new Error("Failed to delete task.");
            })
            .catch(error => {
                console.error("Error deleting task:", error);
            });
        });
    });

// Checkbox Listeners
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener("change", function() {
        const taskId = this.getAttribute("data-id");
        const isChecked = this.checked;
        fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                complete: isChecked
            })
        })
        .then(response => {
            if(!response.ok) throw new Error("Failed to update task completion status.");
            getTasks();  // Re-fetch the tasks to update the UI with the latest data
        })
        .catch(error => {
            console.error("Error updating task:", error);
        });
    });
});
}

document.getElementById("add-task").addEventListener("click", function() {
    const newTaskTitle = document.getElementById("new-task").value.trim();
    if (newTaskTitle) {
        fetch("http://127.0.0.1:5000/tasks", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: newTaskTitle
            })
        })
        .then(response => response.json())
        .then(data => {
            getTasks();
        })
        .catch(error => {
            console.error("Error adding task:", error);
        });
    }
});

getTasks(); 

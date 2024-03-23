class Task {
    #id;
    #description;

    // Constructor method for creating instances of Task
    constructor(id, description) {
        this.#id = id;
        this.#description = description;
    }
    // Getter method for retrieving the task ID
    get id() {
        return this.#id;
    }
    // Getter method for retrieving the task description
    get description() {
        return this.#description;
    }
}

// Export the Task class
export { Task };
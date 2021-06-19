import React, { Component } from "react";
import axios from "axios";
import GroceryList from "./GroceryList";
import "./Grocery.css";

export class Grocery extends Component {

    state = {
        groceryList: [],
        Input: "",
        error: null,
        errorMessage: "",
    }

    async componentDidMount() {
        try {
            let groceryArray = await axios.get(
                "http://localhost:3001/api/grocery/get-all-groceries",
                {
                    grocery: this.state.Input,
                }
            )

            

            this.setState({
                groceryList: groceryArray.data.payload
            })
        }
        catch (err) {
            console.log(err)
        }
    }

    handleTodoOnChange = (event) => {
        this.setState({
            Input: event.target.value,
            error: null,
            errorMessage: "",
        });
    };

    handleOnSubmit = async (event) => {
        event.preventDefault();

        if (this.state.Input.length === 0) {
            this.setState({
                error: true,
                errorMessage: "Cannot create empty grocery",
            });
        } else {
            let checkIfGroceryAlreadyExists = this.state.groceryList.findIndex(
                (item) =>
                    item.grocery.toLowerCase() ===
                    this.state.Input.toLowerCase()
            );

            if (checkIfGroceryAlreadyExists > -1) {
                this.setState({
                    error: true,
                    errorMessage: "Grocery already exists",
                });
            } else {
                try {
                    let NewGrocery = await axios.post(
                        "http://localhost:3001/api/grocery/create-grocery",
                        {
                            grocery: this.state.Input,
                        }
                    );

                    let newArray = [
                        ...this.state.groceryList, NewGrocery.data.payload
                        ,
                    ];
                    this.setState({
                        groceryList: newArray,
                        Input: "",
                    });
                }
                catch (err) {
                    console.log(err)
                }
            }
        }
    };

    sortByDate = async (sortOrder) => {

        try {
            let groceryArray = await axios.get(
                `http://localhost:3001/api/grocery/get-grocery-by-sort?sort=${sortOrder}`
            )
            this.setState({
                groceryList: groceryArray.data.payload
            })
        }
        catch (err) {
            console.log(err)
        }

        // let sortedTodos = this.state.todoList
        //   .sort((a, b) => {
        //     return new Date(a.dateAdded) - new Date(b.dateAdded);
        //   })
        //   .reverse();

        // this.setState({
        //   todoList: sortedTodos,
        // });
    };

    sortByPurchased = async (isPurchased) => {
        try {
            let groceryArray = await axios.get(
                `http://localhost:3001/api/grocery/get-grocery-by-done?isPurchased=${isPurchased}`
            )
            this.setState({
                groceryList: groceryArray.data.payload
            })
        }
        catch (err) {
            console.log(err)
        }
    };

    handleDeleteByID = async (id) => {

        try {
            let groceryArray = await axios.delete(
                `http://localhost:3001/api/grocery/delete-grocery-by-id/${id}`
            )
            let filteredArray = this.state.groceryList.filter(
                (item) => item._id !== groceryArray.data.payload._id
            );

            this.setState({
                groceryList: filteredArray
            })
        }
        catch (err) {
            console.log(err)
        }
        //console.log("handleDeleteByID id:", id);

        // let filteredArray = this.state.todoList.filter((item) => item.id !== id);

        // this.setState({
        //   todoList: filteredArray,
        // });
    };

    handleDoneByID = async (id, isPurchased) => {

        try {
            let groceryArray = await axios.put(
                `http://localhost:3001/api/grocery/update-grocery-by-id/${id}`,
                {
                    purchased: !isPurchased
                }
            )
            let updatedArray = this.state.groceryList.map((item) => {
                if (item._id === groceryArray.data.payload._id) {
                    item.purchased = groceryArray.data.payload.purchased;
                }
                return item;
            });

            this.setState({
                groceryList: updatedArray
            })
        }
        catch (err) {
            console.log(err)
        }


        // let updatedArray = this.state.todoList.map((item) => {
        //   if (item.id === id) {
        //     item.isDone = !item.isDone;
        //   }
        //   return item;
        // });

        // this.setState({
        //   todoList: updatedArray,
        // });
    };

    handleCheck  = async (id,priority) => {
  
    
        try {
            let grocery = await axios.put(
                `http://localhost:3001/api/grocery/update-grocery-by-id/${id}`,
                {
                    priority: priority
                }
            )
            let groceryArray = await axios.get(
                "http://localhost:3001/api/grocery/get-all-groceries")

            this.setState({
            groceryList: groceryArray.data.payload
              
            })
        }
        catch (err) {
            console.log(err)
        }
    }

    handleEditByID = async (id, editInput) => {
        try {
            let editedgrocery = await axios.put(
                `http://localhost:3001/api/grocery/update-grocery-by-id/${id}`,
                {
                    grocery: editInput,
                }
            );
            console.log(editedgrocery);
            let updatedArray = this.state.groceryList.map((item) => {
                if (item._id === id) {
                    item.grocery = editedgrocery.data.payload.grocery;
                }
                return item;
            });
            this.setState({
                groceryList: updatedArray,
            });
        } catch (e) {
            console.log(e);
        }



        // let updatedTodoArray = this.state.todoList.map((item) => {
        //   if (item.id === id) {
        //     item.todo = editInput;
        //   }
        //   return item;
        // });

        // this.setState({
        //   todoList: updatedTodoArray,
        // });
    };

    render() {
        return (
            <div>
                <div className="form-div">
                    <form onSubmit={this.handleOnSubmit}>
                        <input
                            name="Input"
                            type="text"
                            onChange={this.handleTodoOnChange}
                            value={this.state.Input}
                        />
                        <button type="submit">Submit</button>
                        <br />
                        <span style={{ color: "red" }}>
                            {this.state.error && this.state.errorMessage}
                        </span>
                    </form>
                </div>

                <div className="sorting">
                    <ul>
                        <li>
                            <button onClick={() => this.sortByDate("desc")}>
                                Sort by Date added- - Newest to oldest
                            </button>
                        </li>
                        <li>
                            <button onClick={() => this.sortByDate("asc")}>
                                Sort by Date  added-- Oldest to newest
                            </button>
                        </li>
                        <li>
                            <button onClick={() => this.sortByPurchased("true")}> Sort by Purchased</button>
                        </li>
                        <li>
                            <button onClick={() => this.sortByPurchased("false")}> Sort by Not Purchased</button>
                        </li>
                    </ul>
                </div>
                <div className="todo-div">
                    <ul>
                        {this.state.groceryList.map((item) => {
                            return (
                                <GroceryList
                                    key={item.id}
                                    item={item}
                                    handleDeleteByID={this.handleDeleteByID}
                                    handleDoneByID={this.handleDoneByID}
                                    handleEditByID={this.handleEditByID}
                                    handleCheck = {this.handleCheck}
                                />
                            );
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}

export default Grocery;


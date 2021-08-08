import React, { useState, useEffect } from "react";
import axios from "axios";
import GroceryList from "./GroceryList";
import InputBox from "./Input"
import "./Grocery.css";

import { ListsContext, InputContext } from "../../context/context"

function Grocery() {

    const [groceryList, setgroceryList] = useState([]);
    const [Input, setInput] = useState("");
    const [error, seterror] = useState(false);
    const [errorMessage, seterrorMessage] = useState("")

    useEffect(() => {
        GetGroceryList();
    }, []);


    async function GetGroceryList() {
        try {
            let groceryArray = await axios.get(
                "http://localhost:3001/api/grocery/get-all-groceries"
            )
            setgroceryList(groceryArray.data.payload)
            console.log(groceryArray.data.payload)
            console.log(groceryList)
        }
        catch (err) {
            console.log(err)
        }
    }

    function handleTodoOnChange(event) {
        setInput(event.target.value,)
        seterror(false)
        seterrorMessage("")
    };

    async function handleOnSubmit(event) {
        event.preventDefault();

        if (Input.length === 0) {
            seterror(true)
            seterrorMessage("Cannot create empty grocery")
        } else {
            let checkIfGroceryAlreadyExists = groceryList.findIndex(
                (item) =>
                    item.grocery.toLowerCase() ===
                    Input.toLowerCase()
            );

            if (checkIfGroceryAlreadyExists > -1) {
                seterror(true)
                seterrorMessage("Grocery already exists")
            } else {
                try {
                    let NewGrocery = await axios.post(
                        "http://localhost:3001/api/grocery/create-grocery",
                        {
                            grocery: Input,
                        }
                    );

                    let newArray = [...groceryList, NewGrocery.data.payload];

                    setgroceryList(newArray)
                    setInput("")
                }
                catch (err) {
                    console.log(err)
                }
            }
        }
    };

    async function sortByDate(sortOrder) {

        try {
            let groceryArray = await axios.get(
                `http://localhost:3001/api/grocery/get-grocery-by-sort?sort=${sortOrder}`
            )
            setgroceryList(groceryArray.data.payload)
        }
        catch (err) {
            console.log(err)
        }
    };

    async function sortByPurchased(isPurchased) {
        try {
            let groceryArray = await axios.get(
                `http://localhost:3001/api/grocery/get-grocery-by-done?isPurchased=${isPurchased}`
            )

            setgroceryList(groceryArray.data.payload)
        }
        catch (err) {
            console.log(err)
        }
    };

    async function handleDeleteByID(id) {
        try {
            let groceryArray = await axios.delete(
                `http://localhost:3001/api/grocery/delete-grocery-by-id/${id}`
            )
            let filteredArray = groceryList.filter(
                (item) => item._id !== groceryArray.data.payload._id
            );
            setgroceryList(filteredArray)
        }
        catch (err) {
            console.log(err)
        }
    };

    async function handleDoneByID(id, isPurchased) {
        try {
            let groceryArray = await axios.put(
                `http://localhost:3001/api/grocery/update-grocery-by-id/${id}`,
                {
                    purchased: !isPurchased
                }
            )
            let updatedArray = groceryList.map((item) => {
                if (item._id === groceryArray.data.payload._id) {
                    item.purchased = groceryArray.data.payload.purchased;
                }
                return item;
            });
            setgroceryList(updatedArray)
        }
        catch (err) {
            console.log(err)
        }
    };


    async function handleCheck(id, priority) {
        try {
            let grocery = await axios.put(
                `http://localhost:3001/api/grocery/update-grocery-by-id/${id}`,
                {
                    priority: priority
                }
            )
            let groceryArray = await axios.get(
                "http://localhost:3001/api/grocery/get-all-groceries")
            setgroceryList(groceryArray.data.payload)
        }
        catch (err) {
            console.log(err)
        }
    }

    async function handleEditByID(id, editInput) {
        try {
            let editedgrocery = await axios.put(
                `http://localhost:3001/api/grocery/update-grocery-by-id/${id}`,
                {
                    grocery: editInput,
                }
            );

            let updatedArray = groceryList.map((item) => {
                if (item._id === id) {
                    item.grocery = editedgrocery.data.payload.grocery;
                }
                return item;
            });
            setgroceryList(updatedArray)
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div>
            <InputContext.Provider
                value={{
                    handleOnSubmit,
                    handleTodoOnChange,
                    error,
                    Input,
                    errorMessage,
                }}>
                <InputBox />
            </InputContext.Provider>

            <div className="sorting">
                <ul>
                    <li>
                        <button onClick={() => sortByDate("desc")}>
                            Sort by Date added- - Newest to oldest
                        </button>
                    </li>
                    <li>
                        <button onClick={() => sortByDate("asc")}>
                            Sort by Date  added-- Oldest to newest
                        </button>
                    </li>
                    <li>
                        <button onClick={() => sortByPurchased("true")}> Sort by Purchased</button>
                    </li>
                    <li>
                        <button onClick={() => sortByPurchased("false")}> Sort by Not Purchased</button>
                    </li>
                </ul>
            </div>

            <div className="todo-div">
                <ul>
                    {groceryList.map((item) => {
                        return (
                            <ListsContext.Provider value={{
                                item,
                                handleDeleteByID,
                                handleDoneByID,
                                handleEditByID,
                                handleCheck
                            }}>
                                <GroceryList />
                            </ListsContext.Provider>
                        );
                    })}
                </ul>
            </div>
        </div>
    )
}


export default Grocery;


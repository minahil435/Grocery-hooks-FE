import React, { useState, useContext } from "react";
import { ListsContext } from "../../context/context"
import "./GroceryList.css";

function GroceryList() {

    const { handleDeleteByID, handleDoneByID, handleCheck, handleEditByID, item } = useContext(ListsContext);
    const { grocery, _id, purchased, priority } = item

    const [canEdit, setEdit] = useState(false);
    const [editInput, setInput] = useState(grocery);

    function onHandleEditClick() {
        setEdit(!canEdit)
    };

    function handleEditOnChange(event) {
        setInput(event.target.value)
    };

    function onHandleEditSubmit(id) {
        onHandleEditClick();
        handleEditByID(id, editInput);
    };

    function handleCheckinbox(id, priority) {
        if (priority === 0) {
            handleCheck(id, 1);
        }
        else {
            handleCheck(id, 0);
        }
    }

    return (
        <div className="todolist-div">
            <input type="checkbox" onChange={() => handleCheckinbox(_id, priority)} checked={priority === 0 ? false : true} />
            {canEdit ? (
                <input
                    type="text"
                    value={editInput}
                    onChange={handleEditOnChange}
                    name="editInput"
                />
            ) : (
                <li className={`li-style ${purchased ? "li-style-isDone" : ""}`}>
                    {item.grocery}
                </li>
            )}

            {canEdit ? (
                <button onClick={() => onHandleEditSubmit(_id)} id="edit-button">
                    Submit
                </button>
            ) : (
                <button onClick={onHandleEditClick} id="edit-button">
                    Edit
                </button>
            )}

            <button id="done-button" onClick={() => handleDoneByID(_id)}>
                Purchased
            </button>
            
            <button onClick={() => handleDeleteByID(_id)} id="delete-button">
                Delete
            </button>
        </div>
    )
}

export default GroceryList;
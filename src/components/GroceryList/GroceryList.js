import React, { Component } from "react";
import PropTypes from "prop-types";
import "./GroceryList.css";

export class GroceryList extends Component {
    state = {
        canEdit: false,
        editInput: this.props.item.grocery,
    };

    onHandleEditClick = () => {
        this.setState((prevState) => {
            return {
                canEdit: !prevState.canEdit,
            };
        });
    };

    handleEditOnChange = (event) => {
        this.setState({
            editInput: event.target.value,
        });
    };

    onHandleEditSubmit = (id) => {
        this.onHandleEditClick();
        this.props.handleEditByID(id, this.state.editInput);
    };

    handleCheckinbox = (id,priority)=>{
        if (priority === 0){
        this.props.handleCheck(id,1);
        }
        else{
            this.props.handleCheck(id, 0);
        }
      
    }

  

    render() {
        const { grocery, _id, purchased, priority } = this.props.item;
        const { handleDeleteByID, handleDoneByID,handleCheck } = this.props;
        const { canEdit, editInput } = this.state;

        return (

            <div className="todolist-div">
                <input type="checkbox" onChange={() => this.handleCheckinbox(_id ,priority)} checked ={ priority === 0 ? false : true}/>
                {canEdit ? (
                    <input
                        type="text"
                        value={editInput}
                        onChange={this.handleEditOnChange}
                        name="editInput"
                    />
                ) : (
                    <li className={`li-style ${purchased ? "li-style-isDone" : ""}`}>
                        {grocery}
                    </li>
                )}

                {canEdit ? (
                    <button onClick={() => this.onHandleEditSubmit(_id)} id="edit-button">
                        Submit
                    </button>
                ) : (
                    <button onClick={this.onHandleEditClick} id="edit-button">
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
}

GroceryList.propTypes = {
    item: PropTypes.object.isRequired,
    handleDeleteByID: PropTypes.func.isRequired,
    handleDoneByID: PropTypes.func.isRequired,
    handleEditByID: PropTypes.func.isRequired,
    handleCheck:PropTypes.func.isRequired
};

export default GroceryList;
import React, { useState, useContext } from "react";
import { InputContext } from "../../context/context"


function Input() {

    const { handleOnSubmit ,handleTodoOnChange,Input,error,errorMessage} = useContext(InputContext);

    return (
        <div className="form-div">
        <form onSubmit={handleOnSubmit}>
            <input
                name="Input"
                type="text"
                onChange={handleTodoOnChange}
                value={Input}
            />
            <button type="submit">Submit</button>
            <br />
            <span style={{ color: "red" }}>
                {error && errorMessage}
            </span>
        </form>
    </div>     
    );
}

export default Input;

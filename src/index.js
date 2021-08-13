import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Shipping List Script
// ****** select items **********

const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const grocerydescription = document.getElementById("grocerydescription");
const groceryquality = document.getElementById("groceryquality");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");
// edit option
let editElement;
let editElementDescription;
let editElementQuality;
let editFlag = false;
let editID = "";
let completeFlag = false;
// ****** event listeners **********

// submit form
form.addEventListener("submit", addItem);
// clear list
clearBtn.addEventListener("click", clearItems);
// display items onload
window.addEventListener("DOMContentLoaded", setupItems);

// ****** functions **********

// add item
function addItem(e) {
    e.preventDefault();
    const value = grocery.value;
    const valuedescription = grocerydescription.value;
    const valuequality = groceryquality.value;
    const id = new Date().getTime().toString();

    if (value !== "" && valuequality !== "" && !editFlag) {
        const element = document.createElement("article");
        let attr = document.createAttribute("data-id");
        attr.value = id;
        element.setAttributeNode(attr);
        element.classList.add("grocery-item");
        element.innerHTML = `<p class="titleName">${value}</p>
            <p class="titleDescription">${valuedescription}</p>
            <p class="titleQuality">${valuequality}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
              <!-- Complete status btn -->
              <button type="button" class="complete-btn">
                <i class="fas fa-unlock"></i>
              </button>
            </div>
          `;
        // add event listeners to both buttons;
        const deleteBtn = element.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", deleteItem);
        const editBtn = element.querySelector(".edit-btn");
        editBtn.addEventListener("click", editItem);
        const completeBtn = element.querySelector(".complete-btn");
        completeBtn.addEventListener("click", completeItem);

        // append child
        list.appendChild(element);
        // display alert
        displayAlert("item added to the list", "success");
        // show container
        container.classList.add("show-container");
        // set local storage
        addToLocalStorage(id, value, valuedescription, valuequality, completeFlag);
        // set back to default
        setBackToDefault();
    } else if (value !== "" && valuequality !== "" && editFlag && !completeFlag) {
        editElement.innerHTML = value;
        editElementDescription.innerHTML = valuedescription;
        editElementQuality.innerHTML = valuequality;
        displayAlert("value changed", "success");

        // edit  local storage
        editLocalStorage(editID, editElement, editElementDescription, editElementQuality, completeFlag);
        setBackToDefault();
    } else if (value !== "" && valuequality !== "" && editFlag && completeFlag) {
        editElement.innerHTML = value;
        editElementDescription.innerHTML = valuedescription;
        editElementQuality.innerHTML = valuequality;
        displayAlert("item completed", "success");

        // edit  local storage
        editLocalStorage(editID, editElement, editElementDescription, editElementQuality, completeFlag);
        setBackToDefault();
    }
    else {
        displayAlert("please enter task name and select due date", "danger");
    }
}
// display alert
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    // remove alert
    setTimeout(function () {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000);
}

// clear items
function clearItems() {
    const items = document.querySelectorAll(".grocery-item");
    if (items.length > 0) {
        items.forEach(function (item) {
            list.removeChild(item);
        });
    }
    container.classList.remove("show-container");
    displayAlert("empty list", "danger");
    setBackToDefault();
    localStorage.removeItem("list");
}

// delete item

function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;

    list.removeChild(element);

    if (list.children.length === 0) {
        container.classList.remove("show-container");
    }
    displayAlert("item removed", "danger");

    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
}

// Complete item
function completeItem(e) {
    const element = e.currentTarget.parentElement.parentElement.parentElement.parentElement;
    const elementdescription = e.currentTarget.parentElement.parentElement.parentElement;
    const elementquality = e.currentTarget.parentElement.parentElement;
    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling.previousElementSibling.previousElementSibling;
    editElementDescription = e.currentTarget.parentElement.previousElementSibling.previousElementSibling;
    editElementQuality = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    grocery.value = editElement.innerHTML;
    grocerydescription.value = editElementDescription.innerHTML;
    groceryquality.value = editElementQuality.innerHTML;

    editFlag = true;
    completeFlag = true;
    editID = element.dataset.id;
    //
    submitBtn.textContent = "Complete List";
}
// edit item
function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement.parentElement.parentElement;
    const elementdescription = e.currentTarget.parentElement.parentElement.parentElement;
    const elementquality = e.currentTarget.parentElement.parentElement;
    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling.previousElementSibling.previousElementSibling;
    editElementDescription = e.currentTarget.parentElement.previousElementSibling.previousElementSibling;
    editElementQuality = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    grocery.value = editElement.innerHTML;
    grocerydescription.value = editElementDescription.innerHTML;
    groceryquality.value = editElementQuality.innerHTML;

    editFlag = true;
    completeFlag = false;
    editID = element.dataset.id;
    //
    submitBtn.textContent = "Edit List";
}
// set back to defaults
function setBackToDefault() {
    grocery.value = "";
    grocerydescription.value = "";
    groceryquality.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "Add List";
}

// ****** local storage **********

// add to local storage
function addToLocalStorage(id, value, valuedescription, valuequality, completeFlag) {
    const grocery = { id, value, valuedescription, valuequality, completeFlag };
    let items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items));
    //console.log(items);
}

function getLocalStorage() {
    return localStorage.getItem("list")
        ? JSON.parse(localStorage.getItem("list"))
        : [];
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    items = items.filter(function (item) {
        if (item.id !== id) {
            return item;
        }
    });

    localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value, valuedescription, valuequality, completeFlag) {
    let items = getLocalStorage();

    items = items.map(function (item) {
        if (item.id === id) {
            item.value = value;
            item.valuedescription = valuedescription;
            item.valuequality = valuequality;
            item.completeFlag = completeFlag;
        }
        //console.log(items);
        return item;
    });
    //console.log(items);
    localStorage.setItem("list", JSON.stringify(items));
    
}

// SETUP LOCALSTORAGE.REMOVEITEM('LIST');

// ****** setup items **********

function setupItems() {
    let items = getLocalStorage();

    if (items.length > 0) {
        items.forEach(function (item) {
            createListItem(item.id, item.value, item.valuedescription, item.valuequality, item.completeFlag);
        });
        container.classList.add("show-container");
    }
}

function createListItem(id, value, valuedescription, valuequality, completeFlag) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");
    element.innerHTML = `<p class="titleName">${value}</p>
            <p class="titleDescription">${valuedescription}</p>
            <p class="titleQuality">${valuequality}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
    // add event listeners to both buttons;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);
    const completeBtn = element.querySelector(".complete-btn");
    completeBtn.addEventListener("click", completeItem);

    // append child
    list.appendChild(element);
}

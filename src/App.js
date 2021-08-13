import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
          <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css"
          />

          <section className="section-center">
              <form className="grocery-form">
                  <p className="alert"></p>
                  <h3><b>Todo List</b></h3>
                  <div className="form-control">
                      <div className="text-input">
                          <label><strong>Task Name</strong></label>
                          <input stype="text" id="grocery" placeholder="Laptop" />
                      </div>
                      <div className="text-input">
                          <label><strong>Description</strong></label>
                          <textarea type="" id="grocerydescription" placeholder="Hauwei Core i5"></textarea>
                      </div>
                      <div className="text-input">
                          <label><strong>Due Date</strong></label>
                          <input type="date" id="groceryquality" placeholder="" />
                      </div>
                      <button type="submit" class="submit-btn">Add List</button>
                  </div>
              </form>
              <div className="grocery-container">
                  <div className="grocery-list"></div>
                  <button class="clear-btn">clear items</button>
              </div>
          </section>
    </div>
  );
}

export default App;

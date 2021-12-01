"use strict";

const React = require("react");
const ReactDOM = require("react-dom");
const client = require("./client");

const follow = require('./follow'); // function to hop multiple links by "rel"

const root = "/api";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { employees: [], attributes: [] };
  }

  componentDidMount() {
    this.loadFromServer(this.state.pageSize);
  }

  loadFromServer(pageSize) {
    follow(client, root, [{ rel: "employees", params: { size: pageSize } }])
      .then((employeeCollection) => {
        return client({
          method: "GET",
          path: employeeCollection.entity._links.profile.href,
          headers: { Accept: "application/schema+json" },
        }).then((schema) => {
          this.schema = schema.entity;
          return employeeCollection;
        });
      })
      .done((employeeCollection) => {
        this.setState({
          employees: employeeCollection.entity._embedded.employees,
          attributes: Object.keys(this.schema.properties),
          pageSize: pageSize,
          links: employeeCollection.entity._links,
        });
      });
  }

  onCreate(newEmployee) {
    follow(client, root, ["employees"])
      .then((employeeCollection) => {
        return client({
          method: "POST",
          path: employeeCollection.entity._links.self.href,
          entity: newEmployee,
          headers: { "Content-Type": "application/json" },
        });
      })
      .then((response) => {
        return follow(client, root, [
          { rel: "employees", params: { size: this.state.pageSize } },
        ]);
      })
      .done((response) => {
        if (typeof response.entity._links.last !== "undefined") {
          this.onNavigate(response.entity._links.last.href);
        } else {
          this.onNavigate(response.entity._links.self.href);
        }
      });
  }

  render() {
    return (
      <div>
        <CreateDialog
          attributes={this.state.attributes}
          onCreate={this.onCreate}
        />
        <EmployeeList employees={this.state.employees} />
      </div>
    );
  }
}

class CreateDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const newEmployee = {};
    this.props.attributes.forEach((attribute) => {
      newEmployee[attribute] = ReactDOM.findDOMNode(
        this.refs[attribute]
      ).value.trim();
    });
    this.props.onCreate(newEmployee);

    // clear out the dialog's inputs
    this.props.attributes.forEach((attribute) => {
      ReactDOM.findDOMNode(this.refs[attribute]).value = "";
    });

    // Navigate away from the dialog to hide it.
    window.location = "#";
  }

  render() {
    // console.log(this.props.attributes.size);
    const inputs = this.props.attributes.map((attribute) => (
      <p key={attribute}>
        <input
          type="text"
          placeholder={attribute}
          ref={attribute}
          className="field"
        />
      </p>
    ));

    return (
      <div>
        <a href="#createEmployee">Create</a>

        <div id="createEmployee" className="modalDialog">
          <div>
            <a href="#" title="Close" className="close">
              X
            </a>

            <h2>Create new employee</h2>

            <form>
              {inputs}
              <button onClick={this.handleSubmit}>Create</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

class EmployeeList extends React.Component {
  render() {
    const employees = this.props.employees.map((employee) => (
      <Employee key={employee._links.self.href} employee={employee} />
    ));
    return (
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>{employees}</tbody>
      </table>
    );
  }
}

class Employee extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.employee.firstName}</td>
        <td>{this.props.employee.lastName}</td>
        <td>{this.props.employee.description}</td>
      </tr>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("react"));

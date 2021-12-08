"use strict";

import Employee from "./Employee";
import EmployeeList from "./EmployeeList";
import CreateDialog from "./CreateDialog";

const React = require("react");
const ReactDOM = require("react-dom");
const client = require("./client");
const when = require("when");

const follow = require("./follow"); // function to hop multiple links by "rel"

const root = "/api";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { employees: [], attributes: [], pageSize: 2, links: {} };
    this.updatePageSize = this.updatePageSize.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onNavigate = this.onNavigate.bind(this);
  }

  componentDidMount() {
    this.loadFromServer(this.state.pageSize);
  }

  // get from db, set state.
  loadFromServer(pageSize) {
    follow(client, root, [{ rel: "employees", params: { size: pageSize } }])
      .then((employeeCollection) => {
        return client({
          method: "GET",
          path: employeeCollection.entity._links.profile.href,
          headers: { Accept: "application/schema+json" },
        }).then((schema) => {
          this.schema = schema.entity; // store metadata
          this.links = employeeCollection.entity._links; // store nav links
          return employeeCollection;
        });
      })
      .then((employeeCollection) => {
        //  This is what you need to fetch an ETag header for each employee.
        return employeeCollection.entity._embedded.employees.map((employee) =>
          client({
            // from collection of employees to array of get promises
            method: "GET",
            path: employee._links.self.href,
          })
        );
      })
      .then((employeePromises) => {
        // resolved when all Get promises resolve
        return when.all(employeePromises);
      })
      .done((employees) => {
        // set state
        this.setState({
          employees: employees,
          attributes: Object.keys(this.schema.properties),
          pageSize: pageSize,
          links: this.links,
        });
      });
  }

  // post new record, get new records, fix nav links.
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

  //  http delete, get from db, set state.
  onDelete(employee) {
    client({ method: "DELETE", path: employee.entity._links.self.href }).done(
      (response) => {
        this.loadFromServer(this.state.pageSize);
      }
    );
  }

  updatePageSize(pageSize) {
    if (pageSize !== this.state.pageSize) {
      this.loadFromServer(pageSize);
    }
  }

  onNavigate(navUri) {
    client({
      method: "GET",
      path: navUri,
    })
      .then((employeeCollection) => {
        this.links = employeeCollection.entity._links;

        return employeeCollection.entity._embedded.employees.map((employee) =>
          client({
            method: "GET",
            path: employee._links.self.href,
          })
        );
      })
      .then((employeePromises) => {
        return when.all(employeePromises);
      })
      .done((employees) => {
        this.setState({
          employees: employees,
          attributes: Object.keys(this.schema.properties),
          pageSize: this.state.pageSize,
          links: this.links,
        });
      });
  }

  onUpdate(employee, updatedEmployee) {
    client({
      method: "PUT",
      path: employee.entity._links.self.href,
      entity: updatedEmployee,
      headers: {
        "Content-Type": "application/json",
        "If-Match": employee.headers.Etag,
      },
    }).done(
      (response) => {
        this.loadFromServer(this.state.pageSize);
      },
      (response) => {
        if (response.status.code === 412) {
          alert(
            "DENIED: Unable to update " +
              employee.entity._links.self.href +
              ". Your copy is stale."
          );
        }
      }
    );
  }

  render() {
    return (
      <div>
        <CreateDialog
          attributes={this.state.attributes}
          onCreate={this.onCreate}
        />
        <EmployeeList
          employees={this.state.employees}
          links={this.state.links}
          pageSize={this.state.pageSize}
          attributes={this.state.attributes}
          onNavigate={this.onNavigate}
          onUpdate={this.onUpdate}
          onDelete={this.onDelete}
          updatePageSize={this.updatePageSize}
        />
      </div>
    );
  }
}


ReactDOM.render(<App />, document.getElementById("react"));

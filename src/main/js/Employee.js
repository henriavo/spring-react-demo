const React = require("react");

import UpdateDialog from "./UpdateDialog";

export default class Employee extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    this.props.onDelete(this.props.employee);
  }

  render() {
    console.log("*******");
    console.log(this.props.employee.entity.manager.name);
    console.log("*******");
    return (
      <tr>
        <td>{this.props.employee.entity.firstName}</td>
        <td>{this.props.employee.entity.lastName}</td>
        <td>{this.props.employee.entity.description}</td>
        <td>{this.props.employee.entity.manager.name}</td>
        <td>
          <UpdateDialog
            employee={this.props.employee}
            attributes={this.props.attributes}
            onUpdate={this.props.onUpdate}
            loggedInManager={this.props.loggedInManager}
          />
        </td>
        <td>
          <button onClick={this.handleDelete}>Delete</button>
        </td>
      </tr>
    );
  }
}

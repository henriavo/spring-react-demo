const React = require("react");
const ReactDOM = require("react-dom");

export default class CreateDialog extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    // create new record
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
  
    onNavigate(navUri) {
      client({ method: "GET", path: navUri }).done((employeeCollection) => {
        this.setState({
          employees: employeeCollection.entity._embedded.employees,
          attributes: this.state.attributes,
          pageSize: this.state.pageSize,
          links: employeeCollection.entity._links,
        });
      });
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
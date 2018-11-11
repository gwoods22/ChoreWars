import React,  {Component} from 'react';

class Roles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //whether or not desc is shown
      show: [false, false, false, false, false, false ]
    };
    this.toggleRoles = this.toggleRoles.bind(this);
  }

  toggleRoles = (index) => {
    if(this.state.show[0]) {
      this.setState(prevState => ({
        // show: prevState.slice(0,index).concat([true]).concat(prevState.slice(index+1, prevState.length))
        show: [false, false, false, false, false, false ]
      }))
    } else {
      this.setState(prevState => ({
        // show: prevState.slice(0,index).concat([false]).concat(prevState.slice(index+1, prevState.length))
        show: [true, true, true, true, true, true ]
      }))
    }
    console.log('working');
  }

  render() {
    return (
      <div>
      <button onClick={() => {this.toggleRoles(0) } }>Descriptions</button>
        <table className="roles">
          <tbody>
            { [].concat(this.props.people)
              .sort(function compare(a, b) {
                if (a.role < b.role) return -1;
                if (a.role > b.role) return  1;
                return 0;
              })
              .map(p =>
                <tr key={p.id}>
                  <td>
                    {this.props.roles[p.role].name}
                     <span className="desc">
                       { this.state.show[p.role] &&
                         this.props.roles[p.role].description }
                     </span>
                  </td>
                  <td>{p.name}</td>
                </tr>
            )}
          </tbody>
          {/* Lucas' Code
          <tbody>
            {this.props.people.map(p =>
              <div>
                <tr key={p.id}>
                  <td onClick={() => {this.toggleRoles(this.props.roles[p.role])}}>{this.props.roles[p.role]}</td>
                  <td>{p.name}</td>
                </tr>
                <p> { this.props[this.props.roles[p.role]] ? this.props.roleDesc[this.props.roles[p.role]] : null } </p>
              </div>
            )}
          </tbody>*/}
        </table>
      </div>
    );
  }
}

export default Roles;

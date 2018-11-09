import React,  {Component} from 'react';

class Roles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: props.roles,
      people: props.people,
      //whether or not desc is shown
      'Counter Commander': false,
      'Sweeping Sergeant': false,
      'Living Room Lieutenant': false,
      'Garbage Governor': false,
      'Recycling Ranger': false,
      roleDesc: {
        'Counter Commander': "This is the counter desc",
        'Sweeping Sergeant': "This is the sweep desc",
        'Living Room Lieutenant': "This is the LR desc",
        'Garbage Governor': "This is the GG desc",
        'Recycling Ranger': "This is the RR desc",
        'Dish Deputy': "This is the DD desc"
      }
    };
    // this.state.people.sort(function compare(a, b) {
    //   if (a.role < b.role) return -1;
    //   if (a.role > b.role) return  1;
    //   return 0;
    // });
    console.log(this.state.people);
  }
  toggleRoles(role) {
    if(this.state[role]) {
      this.setState({role: false});
    } else {
      this.setState({role: true});
    }
  }
  render() {
    return (
      <div>
        <table className="roles">
          <tbody>
            {this.state.people.map(p =>
              <div>
                <tr key={p.id}>
                  <td onClick={() => {this.toggleRoles(this.state.roles[p.role])}}>{this.state.roles[p.role]}</td>
                  <td>{p.name}</td>
                </tr>
                <p> { this.state[this.state.roles[p.role]] ? this.state.roleDesc[this.state.roles[p.role]] : null } </p>
              </div>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Roles;
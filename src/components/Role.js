import React,  {Component} from 'react';

class Role extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDesc: false
        };
        this.toggleDesc = this.toggleDesc.bind(this);
    }
    toggleDesc = () => {
        const current = this.state.showDesc;
        this.setState( {showDesc: !current} );
    }
    render() {
        return (
            <tr key={this.props.id}>
            <td className="role-name" onClick={() => {this.toggleDesc()}}>
              {this.props.role}
               <span className="desc">
                 { this.state.showDesc &&
                   this.props.des }
               </span>
            </td>
            <td>{this.props.name}</td>
          </tr>  
        );
    }
}

export default Role;
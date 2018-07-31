import { h } from 'preact';
import ashnazg from 'ashnazg';
import { Redirect } from 'react-router-dom';

const fakeUserCount = 8;
const fakeUsers = [];

for(let i = 0; i < fakeUserCount; i++){
  let fakeUser = {
    id: `foobarbaz${i + 1}`,
    username: `user${i + 1}`,
    email: `fakeuser${i + 1}@example.com`,
    password: 'password',
    admin: false
  };
  fakeUsers.push(fakeUser);
}

module.exports = function(Component) {

  return class ManageUsers extends Component {

    constructor(props) {
      super(props);
      this.state = {
        selectedUser: {},
        view: 'list',
        newForm: {
          username: "",
          email: "",
          password: "",
          admin: false
        },
        editForm: {
          username: "",
          email: "",
          password: "",
          admin: false
        },
      };
      this.onSelectUser = this.onSelectUser.bind(this);
      this.onSetView = this.onSetView.bind(this);
      this.onChangeNewForm = this.onChangeNewForm.bind(this);
    }

    onSelectUser(e) {
      const id = e.target.getAttribute('id');
      if(id){
        for(let i = 0; i < fakeUsers.length; i++){
          if(fakeUsers[i].id === id){
            this.setState({
              selectedUser: fakeUsers[i],
              editForm: fakeUsers[i],
              view: 'profile'
            });
            return null;
          }
        }
        return null;
      } else {
        return null;
      }  
    }

    onSetView(e) {
      const view = e.target.getAttribute('view');
      if(view){ this.setState({ view }); }
    }

    onChangeNewForm(e) {
      let newForm = this.state.newForm;
      let fieldName = e.target.name;
      console.log(fieldName);
      let fieldValue = e.target.value;
    }

    render() {
      const users = fakeUsers.map((user, index) => {
        return (
          <a 
            class="panel-block"
            onClick={this.onSelectUser}
            id={user.id}
          >
            <span class="panel-icon">
              <i class="mdi mdi-account"></i>
            </span>
            {user.username}
          </a>
        );
      });
      return (
        <div class="ManageUsers">
          <div class="columns is-desktop">
            <div class="column is-7-desktop">
              
              {(this.state.view === 'list') ? (
                <div class="UsersPanel panel has-background-white">
                  <div class="panel-heading is-capitalized">
                    <div class="is-block">
                      <i class="mdi mdi-account-multiple"></i>&nbsp;&nbsp;Manage Users
                      <div class="toolbox is-pulled-right">
                        <div class="buttons has-addons">
                          <span 
                            class="button is-small is-success"
                            view="new"
                            onClick={this.onSetView}
                          >
                            <i class="mdi mdi-plus" view="new"></i>
                          </span>
                        </div>
                      </div>                      
                    </div>    
                  </div>
                  {users}
                </div>
              ) : null }

              {(this.state.view === 'profile') ? (
                <div class="UsersPanel panel has-background-white">
                  <div class="panel-heading is-capitalized">
                    <div class="is-block">
                      <i class="mdi mdi-account"></i>&nbsp;&nbsp;{this.state.selectedUser.username}
                      <div class="toolbox is-pulled-right">
                        <div class="buttons has-addons">
                          <span 
                            class="button is-small"
                            view="list"
                            onClick={this.onSetView}
                          >
                            <i class="mdi mdi-arrow-left-bold" view="list"></i>
                          </span>
                          <span 
                            class="button is-small is-link"
                            view="edit"
                            onClick={this.onSetView}
                          >
                            <i class="mdi mdi-pencil" view="edit"></i>
                          </span>
                        </div>
                      </div>                      
                    </div>    
                  </div>
                  <div class="panel-block">
                    <div class="columns is-multiline is-gapless">
                      
                      <div class="column is-12">
                        <div class="columns is-gapless">
                          <div class="column is-narrow">
                            <label class="label">Username</label>
                          </div>
                          <div class="column">   
                            {this.state.selectedUser.username}
                          </div>
                        </div>
                      </div>

                      <div class="column is-12">
                        <div class="columns is-gapless">
                          <div class="column is-narrow">
                            <label class="label">Email</label>
                          </div>
                          <div class="column">   
                            {this.state.selectedUser.email}
                          </div>
                        </div>
                      </div>

                      <div class="column is-12">
                        <div class="columns is-gapless">
                          <div class="column is-narrow">
                            <label class="label">Admin</label>
                          </div>
                          <div class="column">   
                            No
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ) : null }

              {(this.state.view === 'new') ? (
                <div class="UsersPanel panel has-background-white">
                  <div class="panel-heading is-capitalized">
                    <div class="is-block">
                      <i class="mdi mdi-account-plus"></i>&nbsp;&nbsp;New User
                      <div class="toolbox is-pulled-right">
                        <div class="buttons has-addons">
                          <span 
                            class="button is-small"
                            view="list"
                            onClick={this.onSetView}
                          >
                            <i class="mdi mdi-arrow-left-bold" view="list"></i>
                          </span>
                          <span 
                            class="button is-small is-success"
                            onClick={() => {
                              alert('save here');
                            }}
                          >
                            <i class="mdi mdi-content-save"></i>
                          </span>
                        </div>
                      </div>                      
                    </div>    
                  </div>
                  <div class="panel-block">
                    <div class="columns is-multiline is-gapless">
                      
                      <div class="column is-12">
                        <div class="columns is-gapless">
                          <div class="column is-narrow">
                            <label class="label">Username</label>
                          </div>
                          <div class="column">   
                            <input
                              class="input"
                              type="text"
                              name="username"
                              placeholder="username"
                              value={this.state.newForm.username}
                              onChange={this.onChangeNewForm}                            
                            />
                          </div>
                        </div>
                      </div>

                      <div class="column is-12">
                        <div class="columns is-gapless">
                          <div class="column is-narrow">
                            <label class="label">Email</label>
                          </div>
                          <div class="column">   
                          <input
                              class="input"
                              type="text"
                              name="email"
                              placeholder="usersemail@example.com"
                              value={this.state.newForm.email}
                              onChange={this.onChangeNewForm}                            
                            />
                          </div>
                        </div>
                      </div>

                      <div class="column is-12">
                        <div class="columns is-gapless">
                          <div class="column is-narrow">
                            <label class="label">Admin</label>
                          </div>
                          <div class="column">   
                          <div class="control">
                            <label class="radio">
                              <input 
                                type="radio" 
                                name="admin" 
                                onChange={this.onChangeNewForm}
                                value={false}
                                checked
                              />
                              &nbsp;No
                            </label>
                            <label class="radio">
                            <input 
                                type="radio" 
                                name="admin" 
                                onChange={this.onChangeNewForm}
                                value={true}
                              />
                              &nbsp;Yes
                            </label>                            
                          </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ) : null }

              {(this.state.view === 'edit') ? (
                <div class="UsersPanel panel has-background-white">
                  <div class="panel-heading is-capitalized">
                    <div class="is-block">
                      <i class="mdi mdi-account-edit"></i>&nbsp;&nbsp;Edit User
                      <div class="toolbox is-pulled-right">
                        <div class="buttons has-addons">
                          <span 
                            class="button is-small"
                            view="profile"
                            onClick={this.onSetView}
                          >
                            <i class="mdi mdi-arrow-left-bold" view="profile"></i>
                          </span>
                          <span 
                            class="button is-small is-success"
                            onClick={() => {
                              alert('save here');
                            }}
                          >
                            <i class="mdi mdi-content-save"></i>
                          </span>
                          <span 
                            class="button is-small is-danger"
                            onClick={() => {
                              alert('delete here');
                            }}
                          >
                            <i class="mdi mdi-delete"></i>
                          </span>
                        </div>
                      </div>                      
                    </div>    
                  </div>
                  <div class="panel-block">
                    <div class="columns is-multiline is-gapless">
                      
                      <div class="column is-12">
                        <div class="columns is-gapless">
                          <div class="column is-narrow">
                            <label class="label">Username</label>
                          </div>
                          <div class="column">   
                            <input
                              class="input"
                              type="text"
                              name="username"
                              placeholder="username"
                              value={this.state.editForm.username}
                              onChange={this.onChangeEditForm}                            
                            />
                          </div>
                        </div>
                      </div>

                      <div class="column is-12">
                        <div class="columns is-gapless">
                          <div class="column is-narrow">
                            <label class="label">Email</label>
                          </div>
                          <div class="column">   
                          <input
                              class="input"
                              type="text"
                              name="email"
                              placeholder="usersemail@example.com"
                              value={this.state.editForm.email}
                              onChange={this.onChangeEditForm}                            
                            />
                          </div>
                        </div>
                      </div>

                      <div class="column is-12">
                        <div class="columns is-gapless">
                          <div class="column is-narrow">
                            <label class="label">Admin</label>
                          </div>
                          <div class="column">   
                            <div class="control">
                              {(this.state.editForm.admin) ? (
                                <label class="radio">
                                  <input 
                                    type="radio" 
                                    name="admin" 
                                    onChange={this.onChangeEditForm}
                                    value={false}
                                  />
                                  &nbsp;No
                                </label>
                              ) : (
                                <label class="radio">
                                  <input 
                                    type="radio" 
                                    name="admin" 
                                    onChange={this.onChangeEditForm}
                                    value={false}
                                    checked
                                  />
                                  &nbsp;No
                                </label>
                              )}
                              {(this.state.editForm.admin) ? (
                                <label class="radio">
                                  <input 
                                    type="radio" 
                                    name="admin" 
                                    onChange={this.onChangeEditForm}
                                    value={true}
                                    checked
                                  />
                                  &nbsp;Yes
                                </label>
                              ) : (
                                <label class="radio">
                                  <input 
                                    type="radio" 
                                    name="admin" 
                                    onChange={this.onChangeEditForm}
                                    value={true}
                                  />
                                  &nbsp;Yes
                                </label>
                              )}
                            </div>
                          </div>  
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ) : null }

            </div>

            <div class="column is-5-desktop">

            </div>
          </div>  
        </div>
      );
    }
  }

}
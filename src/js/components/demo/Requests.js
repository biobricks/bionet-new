import { h } from 'preact';
import ashnazg from 'ashnazg';
import { Redirect } from 'react-router-dom';

module.exports = function(Component) {

  return class Requests extends Component {

    render() {
      return (
        <div class="Requests">
          <div class="columns is-desktop">
            <div class="column is-7-desktop">
              
              <div class="panel has-background-white">
                <div class="panel-heading">
                  <i class="mdi mdi-update"></i>&nbsp;&nbsp;Pending Requests
                </div>
              </div>

              <div class="panel has-background-white">  
                <div class="panel-heading">
                  <i class="mdi mdi-briefcase"></i>&nbsp;&nbsp;Waiting For Legal
                </div>  
                <a class="panel-block">
                  <span class="panel-icon">
                    <i class="mdi mdi-briefcase"></i>
                  </span>
                  Legal Item 1 
                </a>
              </div>

              <div class="panel has-background-white">  
                <div class="panel-heading">
                  <i class="mdi mdi-truck-delivery"></i>&nbsp;&nbsp;Ready To Ship
                </div>  
                <a class="panel-block">
                  <span class="panel-icon">
                    <i class="mdi mdi-truck-delivery"></i>
                  </span>
                  Ready To Ship Item 1
                </a>
              </div>

              <div class="panel has-background-white">  
                <div class="panel-heading">
                  <i class="mdi mdi-truck-fast"></i>&nbsp;&nbsp;Shipped
                </div>  
                <div class="panel-block">
                  No Requests have been shipped.
                </div>
              </div>

              <div class="panel has-background-white">  
                <div class="panel-heading">
                  <i class="mdi mdi-delete"></i>&nbsp;&nbsp;Trash
                </div>  
                <div class="panel-block">
                  No Requests in Trash.
                </div>
              </div>

            </div>

            <div class="column is-5-desktop">
              <div class="panel-heading">
                <i class="mdi mdi-briefcase"></i>&nbsp;&nbsp;Legal Item 1
              </div>
              <div class="panel-block">
                Legal Item Description
              </div>
            </div>
          </div>  
        </div>
      );
    }
  }

}
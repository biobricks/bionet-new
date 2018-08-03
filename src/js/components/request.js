
import {h} from 'preact';
import {Link} from 'react-router-dom';
import xtend from 'xtend';
import strftime from 'strftime';

import util from '../util.js';


module.exports = function(Component) {

  return class Request extends Component {

    constructor(props) {
      super(props);
      this.state = {
        error: false,
        loading: true,
        id: this.props.match.params.id,
        request: undefined
      };

      this.statusText = [
        "Unknown",
        "Waiting for approval by bionet node operator",
        "Waiting for Stanford Tech Transfer Office signature",
        "Waiting for requesting institute's Tech Transfer Office signature",
        "Ready to ship"
      ];

      this.statusTextDone = [
        "Unknown",
        "Approved",
        "Signed by Stanford Tech Transfer Office",
        "Signed by requesting institute's Tech Transfer Office",
        "Shipped"
      ];

      util.whenConnected(function() {
        this.getRequest();
      }.bind(this));
    }

    componentWillReceiveProps(nextProps) {

    }

    computePandaStatus(details) {
      if(!details || !details.fields) return 0;

      var approved = false;
      var stanfordSigned = false;
      var requesterSigned = false;

      var i, field;
      for(i=0; i < details.fields.length; i++) {
        field = details.fields[i];
        if(!field.assigned_to || !field.assigned_to.role) continue;

        if(field.assigned_to.role == 'approver'
           && field.assigned_to.has_completed) {
          approved = true;
        }
        if(field.assigned_to.role == 'stanford'
           && field.assigned_to.has_completed) {
          stanfordSigned = true;
        }
        if(field.assigned_to.role == 'recipient'
           && field.assigned_to.has_completed) {
          requesterSigned = true;
        }
      }

      if(!approved) return 1;
      if(!stanfordSigned) return 2;
      if(!requesterSigned) return 3;

      return 4;
    }

    getRequest() {

      app.remote.getRequest(this.state.id, function(err, r, pandaDetails) {
        if(err) {
          this.setState({
            error: err
          });
          return;
        }

        this.setState({
          loading: false,
          request: r,
          pandaStatus: this.computePandaStatus(pandaDetails)
        });

      }.bind(this));
    }

    trashMe(e) {
      e.preventDefault();
      app.remote.changeRequestTrashed(this.state.id, true, function(err) {
        if(err) return app.actions.notify(err, 'error');
        
        app.actions.route('/requests');

      }.bind(this));
    }

    unTrashMe(e) {
      e.preventDefault();
      app.remote.changeRequestTrashed(this.state.id, false, function(err) {
        if(err) return app.actions.notify(err, 'error');
        
        app.actions.route('/requests');

      }.bind(this));
    }

    unMarkAsSent(e) {
      e.preventDefault();
      app.remote.changeRequestStatus(this.state.id, 'shippable', function(err) {
        if(err) return app.actions.notify(err, 'error');

        this.changeState({
          request: {
            status: 'shippable'
          }
        });

        app.actions.notify("Marked as not yet shipped");
      }.bind(this));      
    }

    markAsSent(e) {
      e.preventDefault();
      app.remote.changeRequestStatus(this.state.id, 'sent', function(err) {
        if(err) return app.actions.notify(err, 'error');

        this.changeState({
          request: {
            status: 'sent'
          }
        });

        app.actions.notify("Marked as shipped");
      }.bind(this));      
    }

    approve(e) {
      e.preventDefault();
      
      app.actions.route('/request-approve/'+this.state.id);
    }

    buyShippingLabel(e) {
      e.preventDefault();
      
      if(!confirm("This will spend real money. Are you sure?")) {
        return;
      }

      app.remote.requestBuyShippingLabel(this.state.id, function(err, uriPath) {
        if(err) return app.actions.notify(err, 'error');

        app.actions.notify("Shipping label purchased!", 'success');

        this.changeState({
          shippingLabelURIPath: uriPath
        });
      }.bind(this));
    }

    printShippingLabel(e) {
      e.preventDefault();

      app.actions.notify("Sending to print server...");

      app.remote.requestPrintShippingLabel(this.state.id, function(err) {
        if(err) return app.actions.notify(err, 'error');

        app.actions.notify("Label has been sent to print server!", 'success');
      });
    }

	  render() {

      if(this.state.error) {
        return (
          <div>Error: <span>{this.state.error}</span></div>
        );
      }

      var loading = '';
      if(this.state.loading) {
        loading = (
          <div class="spinner">
            <div class="cssload-whirlpool"></div>
          </div>
        )
      }

      var actions = [];
      if(app.state.global.user) {
        if(this.state.request && this.state.request.trashed) {
          actions.push((
              <li><a href="#" onclick={this.unTrashMe.bind(this)}>Restore from trash</a></li>
          ));
        } else {
          actions.push((
              <li><a href="#" onclick={this.trashMe.bind(this)}>Move to trash</a></li>
          ));
          
          if(this.state.request && this.state.request.status === 'sent') {
            actions.push((
                <li><a href="#" onclick={this.unMarkAsSent.bind(this)}>Mark as not shipped</a></li>
            ));
          } else {
            actions.push((
                <li><a href="#" onclick={this.markAsSent.bind(this)}>Mark as shipped</a></li>
            ));

            if(this.state.request && this.state.request.status !== 'approved') {
              actions.push((
                  <li><a href="#" onclick={this.approve.bind(this)}>Approve this request</a></li>
              ));
            }
          }
          actions.push((
              <li><a href="#" onclick={this.buyShippingLabel.bind(this)}>Buy shipping label</a></li>
          ));
        }

      }

      var status = (
        <p>Status: Unknown</p>
      );
      
      var request = '';
      if(this.state.request) {

        var statusNumber;
        if(this.state.request.status === 'sent') {
          statusNumber = 5;
        } else if(this.state.request.status === 'approved') {
          statusNumber = 2;
        } else {
          statusNumber = this.state.pandaStatus;
        }

        var statusItems = [];
        var i;
        for(i=1; i < this.statusText.length; i++) {
          statusItems.push((
            <li className={(statusNumber === i) ? 'selected' : ''}>{(statusNumber > i) ? (this.statusTextDone[i] + ' ✓') : this.statusText[i]}</li>
          ));
        }
        if(statusItems.length) {
          status = (
            <div className="pandadoc-status">
              <p>Status:</p>
              <ul>{statusItems}</ul>
            </div>
          );
        }

        var orgAddress = [
          this.state.request.street1
        ];
        if(this.state.request.street2 && this.state.request.street2.trim()) {
          orgAddress.push(this.state.request.street2);
        }
        orgAddress.push(this.state.request.city);
        orgAddress.push(this.state.request.zip + ', ' + this.state.request.state);
        orgAddress = orgAddress.join("\n");

        var date;
        if(this.state.request.time) {
          date = strftime('%m/%d/%Y', new Date(this.state.request.time));
        }

        var shippingLabel;
        if(this.state.request.shippingLabelURIPath) {
          shippingLabel = (
            <div>
              <h3 style="padding: 15px 0">Shipping label</h3>
              <a href={this.state.request.shippingLabelURIPath}>
                <img src={this.state.request.shippingLabelURIPath} width="200" style="margin:10px"/>
              </a>
              <div class="field" style="margin-left:10px">
                <div class="control">
                  <input type="button" class="button is-link" value="Print shipping label" onClick={this.printShippingLabel.bind(this)} />
                </div>
              </div>
            </div>
          );
        }

        request = (
          <div>
            <p>Requested material: {this.state.request.virtualName}</p>
            <ul>{actions}</ul>
            <p>Requested on: {date || '?'}</p>
            {status}
            {shippingLabel}
            <p>Requested by: {this.state.request.name} - {this.state.request.email}</p>
            <p>Requesting organization: {this.state.request.company}</p>
            <p>Requesting individual: {this.state.request.name}</p>
            <p>Requesting shipping address: {orgAddress}</p>
            <p>Message from requester:</p>
            <pre>
              {this.state.request.msg}
            </pre>
            <p>Ship to:</p>
            <pre>
              {this.state.request.address}
            </pre>
          </div>
        );
      }

      return (
        <div>
          <h3>Request</h3>  
          {loading}

          {request}
        </div>
      )
    }
  }
}



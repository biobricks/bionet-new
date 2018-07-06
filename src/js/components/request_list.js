
import {h} from 'preact';
import {Link} from 'react-router-dom';
import xtend from 'xtend';
import strftime from 'strftime';

import util from '../util.js';


module.exports = function(Component) {

  return class RequestList extends Component {

    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        requests: []
      };

      util.whenConnected(function() {

        this.getRequests();
      }.bind(this));
    }

    componentWillReceiveProps(nextProps) {

//      util.whenConnected(function() {
//        this.getRequests();
//      }.bind(this));
    }

    getRequests() {

      var s = app.remote.getRequests();
      s.on('data', function(data) {

        if(!data.value.pandadocID) {
          this.setState({
            requests: this.state.requests.concat([data])
          });
        } else {
          app.remote.getRequestStatus(data.value.pandadocID, function(err, status) {
            if(err) {
              this.setState({
                requests: this.state.requests.concat([data])
              });
              return;
            }

            if(status === 'document.completed') {
              
              data.value.status = 'shippable';
            }

            this.setState({
              requests: this.state.requests.concat([data])
            });

          }.bind(this));
        }
      }.bind(this));

      s.on('end', function() {
        this.setState({
          loading: false,
        });
      }.bind(this));
    }

    renderRequestItem(r, className) {
      var time;
      if(r.value.time) {
        time = strftime('%m/%d/%Y', new Date(r.value.time))
      }
      return (
        <li className={className}>
          <Link to={'/request-show/'+r.key}>{time || '?'} - {r.value.virtualName || 'Unknown'} - {r.value.name} - {r.value.orgName}</Link>
        </li>
      )
    }

    emptyTrash(e) {
      e.preventDefault();

      if(!confirm("Are you sure you want to permanently delete all trashed requests?")) return;

      app.remote.emptyRequestTrash(function(err) {
        if(err) return app.actions.notify(err, 'error');

        app.actions.notify("Emptied trash");
        this.setState({
          loading: true,
          requests: []
        });
        this.getRequests();
      }.bind(this));
    }

	  render() {

      var loading = '';
      if(this.state.loading) {
        loading = (
          <div class="spinner">
            <div class="cssload-whirlpool"></div>
          </div>
        )
      }

      
      var requests = [];
      var readyToShipRequests = [];
      var shippedRequests = [];
      var trashedRequests = [];

      var i, r;
      for(i=0; i < this.state.requests.length; i++) {
        r = this.state.requests[i];
        if(r.value.trashed) {
          trashedRequests.push(this.renderRequestItem(r, 'trashed'));
        } else if(r.value.status === 'shippable') {
          readyToShipRequests.push(this.renderRequestItem(r, 'shipped'));
        } else if(r.value.status === 'sent') {
          shippedRequests.push(this.renderRequestItem(r, 'shipped'));
        } else {
          requests.push(this.renderRequestItem(r, ''));
        }
      }
      if(requests.length) {
        requests = ((
          <ul>{requests}</ul>
        ))
      } else {
        requests = (
            <p>No requests waiting for legal</p>
        );
      }

      if(readyToShipRequests.length) {
        readyToShipRequests = ((
          <ul>{readyToShipRequests}</ul>
        ))
      } else {
        readyToShipRequests = (
            <p>No requests currently ready to ship</p>
        );
      }

      if(shippedRequests.length) {
        shippedRequests = ((
          <ul>{shippedRequests}</ul>
        ))
      } else {
        shippedRequests = (
            <p>No requests have been shipped</p>
        );
      }

      if(trashedRequests.length) {
        trashedRequests = ((
          <div>
            <ul>{trashedRequests}</ul>
            <a href="#" onclick={this.emptyTrash.bind(this)}>Empty trash</a>
          </div>
        ))
      } else {
        trashedRequests = (
            <p>No requests in trash</p>
        );
      }

      return (
        <div className="request-list">
          <h2>Pending requests</h2>  
          {loading}

          <h3>Waiting for legal</h3>
          {requests}

          <h3>Ready to ship</h3>
          {readyToShipRequests}

          <h3>Shipped</h3>
          {shippedRequests}

          <h3>Trash</h3>
          {trashedRequests}
        </div>
      )
    }
  }
}



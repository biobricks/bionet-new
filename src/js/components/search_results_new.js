
var uuid = require('uuid').v4;
import {h} from 'preact';
import {NavLink, Link} from 'react-router-dom';

module.exports = function(Component) {

  return class SearchResults extends Component {

  render() {
    if(this.props.results.length <= 0) {
      if(this.props.page <= 1) {
        return (
            <p>No results found</p>
        );
      }
      return (
          <p>No more results available</p>
      );
    }

    let results = this.props.results.map((result, index) => {
    	return (
       <Link to={'/inventory/'+result.value.id} className="search-result panel-block">
			  	<div className="columns has-text-centered-mobile is-gapless">
			    	<div 
			    		className="column is-1"
					  	record={JSON.stringify(result)}
			  			onClick={ this.props.selectProfileView }
			    	>
		    			{ (result.form === 'Physical') ? (
								<i 
									className="result-icon mdi mdi-18px mdi-flask has-text-success" aria-hidden="true"
							  	record={JSON.stringify(result)}
					  			onClick={ this.props.selectProfileView }
								></i>
							) : (
								<i 
									className="result-icon mdi mdi-18px mdi-virtual-reality" aria-hidden="true"
							  	record={JSON.stringify(result)}
					  			onClick={ this.props.selectProfileView }
								></i>
							) }
			    	</div>
			    	<div 
			    		className="column is-3"
					  	record={JSON.stringify(result)}
			  			onClick={ this.props.selectProfileView }			    		
			    	>	
			    		<div 
			    			className="result title is-4"
						  	record={JSON.stringify(result)}
				  			onClick={ this.props.selectProfileView }		    			
			    		>
			    			{ result.value.name }
			    		</div>
			    	</div>				    	
			    	<div 
			    		className="column is-4"
					  	record={JSON.stringify(result)}
			  			onClick={ this.props.selectProfileView }	
			    	>
			    		<div 
			    			className="result description"
						  	record={JSON.stringify(result)}
				  			onClick={ this.props.selectProfileView }				    			
			    		>{ result.value.description }</div>
		      	</div>
			    	<div 
			    		className="column is-2 has-text-centered"
					  	record={JSON.stringify(result)}
			  			onClick={ this.props.selectProfileView }				    		
			    	>	
		      		<div 
		      			className="result status"
					  		record={JSON.stringify(result)}
			  				onClick={ this.props.selectProfileView }	
		      		>
								{ (result.value.hasInstance) ? (
									<i 
										className="result-icon mdi mdi-18px mdi-check-circle has-text-success" aria-hidden="true"
					  				record={JSON.stringify(result)}
			  						onClick={ this.props.selectProfileView }	
									></i>
								) : null }				
		      		</div>
		      	</div>
		      	<div 
		      		className="column is-3"
					  	record={JSON.stringify(result)}
			  			onClick={ this.props.selectProfileView }	
		      	>	
		      		<div 
		      			className="result license"
						  	record={JSON.stringify(result)}
			  				onClick={ this.props.selectProfileView }	
		      		>
			      		{ (result.value.license === "OpenMTA" || result.value.freegenes) ? (
			      			  <img src="/static/images/openmta-logo.png" alt="OpenMTA" className="openmta-icon"/>
			      		) : null }
			      		{ (result.value.license === "UBMTA") ? (
			      			<i className="result-icon mdi mdi-18px mdi-wall" />
			      		) : null }
			      		{ (result.value.license === "Limbo" || (result.value.license !== "UBMTA" && result.value.license === "OpenMTA" && !result.value.freegenes)) ? (
			      			<i className="result-icon mdi mdi-18px mdi-help-circle"/>
			      		) : null }
		      		</div>
		      	</div>			      	
		      </div>					    
			  </Link>
    	);
    });

    return ( 
      <div id="search-results-container">
				<nav className="panel has-background-white">
					{(this.props.results && this.props.results.length > 0) ? (
						<div>
						<div className="panel-block">
							<div className="columns has-text-centered-mobile is-gapless">
								<div className="column is-1">
									<a
										onClick={this.props.changeSortKey}
										sortkey='form'
									>
										P/V&nbsp;
										{(this.props.sortKey === 'form') ? (
											<i
												className={ (this.props.sortAsc) ? 'mdi mdi-18px mdi-virtual-reality has-text-dark' : 'mdi mdi-18px mdi-flask has-text-success' }
											/>
										) : null }
									</a>
								</div>
								<div className="column is-3">
									<a
										onClick={this.props.changeSortKey}
										sortkey='name'
									>
										Name&nbsp;
										{(this.props.sortKey === 'name') ? (
											<i
												className={ (this.props.sortAsc) ? 'mdi mdi-18px mdi-arrow-down-bold-circle has-text-dark' : 'mdi mdi-18px mdi-arrow-up-bold-circle has-text-dark' }
											/>
										) : null }										
									</a>
								</div>
								<div className="column is-4">
									<a
										onClick={this.props.changeSortKey}
										sortkey='description'
									>
										Description&nbsp;
										{(this.props.sortKey === 'description') ? (
											<i
												className={ (this.props.sortAsc) ? 'mdi mdi-18px mdi-arrow-up-bold-circle' : 'mdi mdi-18px mdi-arrow-down-bold-circle' }
											/>
										) : null }
									</a>
								</div>
								<div className="column is-2 has-text-centered">
									<a
										onClick={this.props.changeSortKey}
										sortkey='available'
									>
										Available&nbsp;
										{(this.props.sortKey === 'available') ? (
											<i
												className={ (this.props.sortAsc) ? 'mdi mdi-18px mdi-check-circle has-text-success' : 'mdi mdi-18px mdi-check-circle has-text-light' }
											/>
										) : null }
									</a>
								</div>
								<div className="column is-2">
									<a
										onClick={this.props.changeSortKey}
										sortkey='license'
									>
										License&nbsp;
										{(this.props.sortKey === 'license') ? (
											<i
												className={ (this.props.sortAsc) ? 'mdi mdi-18px mdi-arrow-up-bold-circle' : 'mdi mdi-18px mdi-arrow-down-bold-circle' }
											/>
										) : null }
									</a>
								</div>
							</div>
						</div>
						{ results }
						</div>
					) : null }
				</nav>        
      </div>      
    );
  }
}
}

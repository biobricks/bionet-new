import { h } from 'preact';
import { Link } from 'react-router-dom';
import fakeLabData from '../fake_lab';

module.exports = function(Component) {

  return class Test extends Component {
    
    constructor(props) {
      super(props);
      this.state = {
        selectedRecord: {},
        parentRecord: {},
        ancestors: [],
        searchResult: null,
        resultPath: []
      };
      this.selectRecord = this.selectRecord.bind(this);
      this.getRecordById = this.getRecordById.bind(this);
      this.getLabPath = this.getLabPath.bind(this);
      this.loadRecords = this.loadRecords.bind(this);
    }

    selectRecord(e) {

    }

    getRecordById(id, data) {
      if(typeof data === 'object'){
        if(id === data.id){ 
          let searchResult = data;
          this.setState({
            searchResult
          }); 
        }
        if(this.state.searchResult){ 
          return this.state.searchResult;
        } else {  
          if(data.children && data.children.length > 0){
            for(let i = 0; i < data.children.length; i++){
              let child = data.children[i];
              this.getRecordById(id, child);
            }
          }
        }
      }      
    }

    getLabPath(result, data) {
      //console.log(this.state.resultPath);
      if(result.parent){
        this.getRecordById(result.parent, fakeLabData);
        let searchResult = this.state.searchResult;
        let resultPath = this.state.resultPath;
        resultPath.unshift(searchResult);
        this.setState({
          resultPath,
          searchResult: null
        });
        this.getLabPath(searchResult, fakeLabData);
      }
    }

    loadRecords() {
      this.getRecordById(this.props.match.params.itemId, fakeLabData);
      //console.log(this.state.searchResult);
      let searchResult = this.state.searchResult;
      this.setState({
        resultPath: [
          searchResult
        ],
        searchResult: null
      });
      this.getLabPath(searchResult, fakeLabData);
    }

    componentDidMount() {
      this.loadRecords();
    }

    render() {
      const itemId = this.props.match.params.itemId || null;
      const breadCrumbs = this.state.resultPath.map((record, index) => {
        return (
          <li>
            <Link 
              to={`/ui/test/${record.id}`}
            >
              {record.name}
            </Link>
          </li>           
        );
      });
      return (
        <div>
          <nav class="breadcrumb is-capitalized" aria-label="breadcrumbs">
            <ul>
              { breadCrumbs }    
            </ul>  
          </nav>
        </div>
      )
    }

  }
}

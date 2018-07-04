import {h} from 'preact';
import {Link} from 'react-router-dom';

module.exports = function(Component) {

  return class SuggestPanel extends Component {

    constructor(props) {
      super(props);
      this.state = {
        suggestions: []
      };
      this.getSuggestions = this.getSuggestions.bind(this);
    }

    getSuggestions() {
      let suggestions  = [
        {
          "id": "HyAC6l1DWQ",
          "name": "dolores",
          "description": "Nihil molestiae sunt.",
          "parent": "S1YATekDZQ",
          "row": 1,
          "column": 1,
          "available": true,
          "license": "OpenMTA",
          "freeGenes": false,
          "freeGenesStage": 0,
          "provenance": "Unknown",
          "genotype": "None",
          "sequence": "ATGGGTCGTGGCCTGCATGTTGCCGTAGTTGGTGCAACGGGTGCTGTCGGCCAGCAGATGCTGAAAACTCTGGAGGACCGCAATTTCGAAATGGACACCCTGACGCTGCTGTCCAGCAAGCGCTC"
        },
        {
          "id": "ByJxCTl1DbQ",
          "name": "ullam",
          "description": "In quis eligendi ex dolore.",
          "parent": "S1YATekDZQ",
          "row": 1,
          "column": 2,
          "available": true,
          "license": "Limbo",
          "freeGenes": false,
          "freeGenesStage": 0,
          "provenance": "Unknown",
          "genotype": "None",
          "sequence": "ATGGGTCGTGGCCTGCATGTTGCCGTAGTTGGTGCAACGGGTGCTGTCGGCCAGCAGATGCTGAAAACTCTGGAGGACCGCAATTTCGAAATGGACACCCTGACGCTGCTGTCCAGCAAGCGCTC"
        },
        {
          "id": "ryexAaeJPWX",
          "name": "nobis",
          "description": "Et cum nihil ut est adipisci itaque.",
          "parent": "S1YATekDZQ",
          "row": 1,
          "column": 3,
          "available": true,
          "license": "OpenMTA",
          "freeGenes": false,
          "freeGenesStage": 0,
          "provenance": "Unknown",
          "genotype": "None",
          "sequence": "ATGGGTCGTGGCCTGCATGTTGCCGTAGTTGGTGCAACGGGTGCTGTCGGCCAGCAGATGCTGAAAACTCTGGAGGACCGCAATTTCGAAATGGACACCCTGACGCTGCTGTCCAGCAAGCGCTC"
        }        
      ];
      this.setState({
        suggestions
      });
    }

    componentDidMount() {
      this.getSuggestions();
    }

	  render() {
      let record = this.props.selectedRecord;
      let isContainer = Object.keys(record).indexOf('children') > -1;
      let isEditMode = this.props.editMode;
      let isNewMode = this.props.newMode;
      let suggestions = this.state.suggestions.map((suggestion, index) => {
        return (
          <a
            to={`/ui/lab-inventory/${suggestion.id}`}
            class="panel-block"
            href="#"
            id={suggestion.id}
            onClick={this.props.selectRecord}
          >
            <span class="panel-icon">
              <i class="mdi mdi-flask"></i>
            </span>
            {suggestion.name} 
          </a>
        )        
      });      
      return (
        <div class="MapPanel panel has-background-white">
          <div className="panel-heading">
            Suggestions
          </div>
          <div className="panel-block">
            Select An Existing Item (optional)
          </div>
          {suggestions}
        </div>
      )
    }
  }
}


import {h} from 'preact';
import {Link} from 'react-router-dom';

module.exports = function(Component) {

  return class Attributions extends Component {

    constructor(props) {
      super(props);
      this.state = {};
    }

	  render() {
      return (
        <div>
          <h1>Source code</h1>
          <p>The bionet web app is free and open source software. The source code is <a href="https://github.com/biobricks/bionet-new">here</a>. The core of the web app is available under the <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">GNU Affero General Public License Version 3</a> and all of the modules and libraries used in the bionet are available under a variety of free and open source licenses.</p>

          <h1>Attributions</h1>
          <h3>Symbols and icons</h3>
          <p>The following icons are licensed under the <a href="https://creativecommons.org/licenses/by/3.0/us/legalcode">Creative Commons Attribution 3.0 U.S. license</a> with attribution as follows:</p>
          <ul>
            <li><a href="/static/symbols/science.svg">Science by Eucalyp from the Noun Project</a></li>
            <li><a href="/static/symbols/good_genes.svg">Good Genes by Arthur Shlain from the Noun Project</a></li>
            <li><a href="/static/symbols/dna_research.svg">DNA Research by Arthur Shlain from the Noun Project</a></li>
            <li><a href="/static/symbols/plasmid.svg">plasmid by Tim Madle from the Noun Project</a></li>
            <li><a href="/static/symbols/shipping.svg">Shipping by Martin LEBRETON from the Noun Project</a></li>
          </ul>
        </div>
      )
    }
  }
}



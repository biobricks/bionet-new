import { h } from 'preact';
import ashnazg from 'ashnazg';
import { Redirect } from 'react-router-dom';
import util from '../../util.js';
import moment from 'moment';

module.exports = function (Component) {
  

  return class CanvasPage extends Component {

    constructor(props) {
      super(props);
      app.actions.inventory.initialize();
      this.state = {
        user: {},
        paint: false,
        clickX: [],
        clickY: [],
        clickDrag: [],
        imageURL: ''
      };
      ashnazg.listen('global.user', this.loggedInUser.bind(this));
      // Bindings
      this.loggedInUser = this.loggedInUser.bind(this);
      this.onDraw = this.onDraw.bind(this);
      this.onDrawMove = this.onDrawMove.bind(this);
      this.onDrawEnd = this.onDrawEnd.bind(this);
      this.addClick = this.addClick.bind(this);
      this.redrawCanvas = this.redrawCanvas.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
    }

    // load user info
    loggedInUser(loggedInUser) {
      // if logged in
      if (loggedInUser) { 
        // inventory types can be removed when removed from app.actions.inventory
        // otherwise it will throw an error
        //app.actions.inventory.getInventoryTypes();
        app.actions.inventory.getFavorites();
        app.actions.inventory.getWorkbenchContainer();
        // set the user state object to the logged in user
        this.setState({
          user: loggedInUser
        });
      // if not logged in  
      } else {
        // set the user state object to default empty object
        this.setState({
          user: {}
        });
      }
    }

    onDraw(e) {
     const canvas = document.getElementById('canvas'); 
     let mouseX = e.pageX - canvas.offsetLeft;
     let mouseY = (e.pageY - 50) - canvas.offsetTop;
     //console.log(canvas.offsetTop)
     //console.log('mouseX: ', mouseX);
     //console.log('mouseY: ', mouseY);
     this.setState({
       paint: true
     });
     this.addClick(mouseX, mouseY);
     this.redrawCanvas();     
    }

    onDrawMove(e) {
      if (this.state.paint === true) {
        const canvas = document.getElementById('canvas');
        let mouseX = e.pageX - canvas.offsetLeft;
        let mouseY = (e.pageY - 50) - canvas.offsetTop;
        this.addClick(mouseX, mouseY, true);
        this.redrawCanvas();        
      }
    }

    onDrawEnd(e) {
      this.setState({
        paint: false
      });
    }

    addClick(x, y, dragging) {
      let clickX = this.state.clickX;
      let clickY = this.state.clickY;
      let clickDrag = this.state.clickDrag;
      clickX.push(x);
      clickY.push(y);
      clickDrag.push(dragging);
      this.setState({
        clickX,
        clickY,
        clickDrag
      });
    }

    redrawCanvas() {
      const canvas = document.getElementById('canvas');
      const context = canvas.getContext("2d");
      const clickX = this.state.clickX;
      const clickY = this.state.clickY;
      const clickDrag = this.state.clickDrag;
      
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  
      context.strokeStyle = "#000000";
      context.lineJoin = "round";
      context.lineWidth = 3;
          
      for(let i = 0; i < clickX.length; i++) {		
        context.beginPath();
        if(clickDrag[i] && i){
          context.moveTo(clickX[i-1], clickY[i-1]);
         }else{
           context.moveTo(clickX[i]-1, clickY[i]);
         }
         context.lineTo(clickX[i], clickY[i]);
         context.closePath();
         context.stroke();
      }            
    }

    onSubmit(e) {
      e.preventDefault();
      const canvas = document.getElementById('canvas');
      this.setState({
        imageURL: canvas.toDataURL()
      });
    }

    // fired on first mount only
    componentDidMount() {
      util.whenConnected(function(){
        console.log('Canvas Component Mounted');
      }.bind(this));    
    }

    render() {

      return (
        <div class="CanvasPage">
          <div class="columns is-desktop">

            <div class="column is-12 is-6-desktop">
              <div class="panel">
                <div class="panel-heading">
                  <h3 class="mb-0">Document Title</h3>
                </div>
                <div class="panel-block is-block">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur placerat dictum dictum. Sed sed laoreet leo, sit amet congue metus. Fusce quis porttitor lorem. Mauris vehicula dolor leo, sed ultricies orci gravida et. Vestibulum tempus dui in lectus aliquet vulputate quis vel felis. Aenean at quam et dolor mollis luctus in pulvinar lectus. Mauris quis faucibus dui, vel vulputate lacus. Integer interdum ultrices tortor, ut aliquet nisi pulvinar ut. In risus nisl, maximus suscipit malesuada sit amet, tristique at leo. Nam accumsan congue quam luctus fermentum. Sed nulla sem, lacinia nec nisi ac, suscipit accumsan nulla. Praesent porttitor dictum est, luctus tincidunt justo faucibus ac. Vestibulum sollicitudin turpis tellus, porta pulvinar libero luctus volutpat. Phasellus luctus nisi eget congue faucibus. Quisque a tellus sed felis dictum feugiat ac id magna.</p>
                  <p>Nunc turpis mauris, tristique vel mattis a, ornare eget sem. Mauris ac diam posuere, bibendum eros sit amet, porttitor elit. Curabitur fermentum, purus eu volutpat egestas, tellus nisl consectetur dui, vitae efficitur dolor nulla nec sapien. Etiam eu efficitur ante, id mollis sem. Donec erat ligula, elementum sed sagittis in, consectetur in arcu. Ut ac pharetra lacus. Quisque vitae nibh vitae arcu imperdiet condimentum sit amet sit amet nisi. Integer at sollicitudin risus.</p>
                  <p>Sed fermentum blandit ipsum, sit amet sodales elit dapibus sit amet. Nullam efficitur, velit eget lobortis pretium, nisl dui ultrices velit, eget dignissim mi ex vel libero. Nulla facilisi. Nulla vel augue ultrices, viverra justo sed, rutrum arcu. Morbi interdum auctor dictum. Proin sed ultrices lorem, vitae posuere massa. Morbi massa ante, placerat vel neque sit amet, dictum laoreet est. Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi sagittis egestas suscipit. Pellentesque aliquam vel sem nec dictum. Aenean nunc nisi, elementum nec ligula eget, molestie consequat dolor. Nam efficitur molestie felis non consectetur. In ullamcorper sem eu quam condimentum tincidunt quis non nisi. Suspendisse blandit tempus turpis in congue. Nulla dapibus malesuada aliquet. Pellentesque vulputate neque ac augue gravida scelerisque.</p>
                  <p>Pellentesque magna lacus, sagittis a tincidunt eget, ullamcorper ac orci. Integer justo leo, tempus ac molestie nec, tempus rhoncus est. Ut at ipsum eget lectus fringilla semper vel non nisi. Aenean nec arcu quis risus vestibulum accumsan. Aenean libero lacus, convallis sed lobortis eu, vehicula vitae diam. Integer eleifend mi id nunc porta, sed pellentesque dolor suscipit. Mauris purus risus, congue vel ullamcorper eu, sollicitudin eget purus. Duis efficitur at odio ut venenatis. Aenean gravida vel erat ut dignissim. Pellentesque quis tempor dui. Aliquam venenatis ex nec justo mollis, id dignissim leo blandit. Quisque ut interdum velit, a ornare tortor. Sed suscipit euismod facilisis. Vivamus dignissim nec lacus eget facilisis.</p>
                </div>
                <div class="panel-block is-block">
                  <canvas 
                    id="canvas" 
                    style={{
                      "border": "1px solid black",
                    }}
                    width="500"
                    height="125"
                    onMouseDown={this.onDraw}
                    onMouseMove={this.onDrawMove}
                    onMouseUp={this.onDrawEnd}
                    onMouseLeave={this.onDrawEnd}
                    onTouchStart={this.onDraw}
                    onTouchMove={this.onDrawMove}
                    onTouchEnd={this.onDrawEnd}
                  />
                  <form onSubmit={this.onSubmit}>
                    <div class="field is-grouped">
                      <div class="control is-expanded">
                        <input type="text" class="input" placeholder="type your name"/>
                      </div>
                      <div class="control">
                        <button type="submit" class="button is-primary">Submit</button>
                      </div>
                    </div>    
                  </form>
                </div>
              </div>
            </div>

            <div class="column is-12 is-6-desktop">
              <div class="panel">
                <div class="panel-heading">
                  <h3 class="mb-0">Result</h3>
                </div>
                <div class="panel-block is-block">
                  {(this.state.imageURL.length > 0) ? (
                    <img src={this.state.imageURL}/>
                  ) : (
                    <p>Sign the document and submit the form.</p>
                  )}  
                </div>

              </div>
            </div>

          </div>
        </div>
      );
    }
  }
}
# Structure
State and Component structure.


## LabPanel
[/src/js/components/demo/LabPanel.js](https://github.com/biobricks/bionet-new/blob/master/src/js/components/demo/LabPanel.js) - The fullscreen lab view / edit using the free form editor.

### Props
None*  

### State

#### lab*
```
Type: Object  
Default: {}  
Attr: {  
  id: String,  
  name: String,  
  description: String,
  rows: Number,  
  columns: Number,  
  children: Array
}  
```
*The demo version has the lab data as a State object loading from [fake_lab](https://github.com/biobricks/bionet-new/blob/master/src/js/fake_lab.js) on the componentDidMount method. This is should be replaced in the working model with Lab Data Props.

#### editMode
Type: Boolean  
Default: false  
When set to false, the lab panel is in 'view mode'.  
When set to true, the lab panel is in 'edit mode'.
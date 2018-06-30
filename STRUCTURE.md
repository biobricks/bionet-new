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

## LabInventory
[/src/js/components/demo/LabInventory.js](https://github.com/biobricks/bionet-new/blob/master/src/js/components/demo/LabInventory.js) - The two-panel inventory component that passes state and props to the DataPanel and MapPanel components, keeping them in sync.

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
When set to true, the data panel is in 'edit mode', showing an edit form for the selectedRecord object.

#### newMode
Type: Boolean  
Default: false  
When set to true, the data panel is in 'new mode', showing:  
1. If the selectedRecord is a container, 'new mode' shows a form for a new physical to be placed within the container.
2. If the selectedRecord is a physical, 'new mode' shows a form for creation of new instances of the selectedRecord.

#### selectedRecord/parentRecord
Type: Object  
Default: Container or Physical Object

##### Container
```js
{
 id: String,
 name: String,
 description: String,
 rows: Number,
 columns: Number,
 parent: String  // id of parent record
 row: Number,    // location in parent
 column: Number, // location in parent
 children: Array // array of container and/or physical objects
}
```

##### Physical
```js
{
 id: String,
 name: String,
 description: String,
 parent: String  // id of parent record
 row: Number,    // location in parent
 column: Number, // location in parent
}
```

### Methods

#### getLabData()
The method loaded on componentDidMount() to get mock lab data from [fake_lab](https://github.com/biobricks/bionet-new/blob/master/src/js/fake_lab.js).

#### selectRecord(e)
Passed as Prop to DataPanel
This event method:  
1. Gets the id from the clicked on element.  
2. Triggers a getRecordById() on the clicked on record id
3. Triggers a getRecordById() on the clicked on record parent id
4. Sets the State for selectedRecord and parentRecord.

#### getRecordById(id, data)
A recursive loop to retrieve a single record object from the nested lab object.

#### toggleNewMode()
Passed as Prop to DataPanel
A method to toggle the State newMode between true and false.

#### toggleEditMode()
Passed as Prop to DataPanel
A method to toggle the State editMode between true and false.

#### onSaveNewClick()
Passed as Prop to DataPanel
An event method that handles the save button click within 'new mode' in DataPanel.

#### onSaveEditClick()
Passed as Prop to DataPanel
An event method that handles the save button click within 'edit mode' in DataPanel.

#### onDeleteClick()
Passed as Prop to DataPanel
An event method that handles the delete button click within 'edit mode' in DataPanel.
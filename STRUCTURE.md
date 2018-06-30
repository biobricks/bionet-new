# Structure
State and Component structure for the /src/js/demo/ components.  

```
App
| 
 --- LabPanel
|
 --- LabInventory
  |
   --- DataPanel
    |
     --- ContainerProfile
    |
     --- ContainerNewForm
    |
     --- ContainerEditForm
    |
     --- PhysicalProfile
    |
     --- PhysicalNewForm
    |
     --- PhysicalEditForm
  |
   --- MapPanel
```
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
[/src/js/components/demo/LabInventory.js](https://github.com/biobricks/bionet-new/blob/master/src/js/components/demo/LabInventory.js) - The two-panel inventory component that passes state and props to the [DataPanel](https://github.com/biobricks/bionet-new/blob/master/src/js/components/demo/DataPanel.js) and MapPanel components, keeping them in sync.  

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
2. Triggers a getRecordById() on the clicked on record id.  
3. Triggers a getRecordById() on the clicked on record parent id.  
4. Sets the State for selectedRecord and parentRecord.  

#### getRecordById(id, data)
A recursive loop to retrieve a single record object from the nested lab object.  

#### toggleNewMode()
Passed as Prop to [DataPanel](https://github.com/biobricks/bionet-new/blob/master/src/js/components/demo/DataPanel.js)  
A method to toggle the State newMode between true and false.  

#### toggleEditMode()
Passed as Prop to [DataPanel](https://github.com/biobricks/bionet-new/blob/master/src/js/components/demo/DataPanel.js)  
A method to toggle the State editMode between true and false.  

#### onSaveNewClick()
Passed as Prop to [DataPanel](https://github.com/biobricks/bionet-new/blob/master/src/js/components/demo/DataPanel.js)  
An event method that handles the save button click within 'new mode' in DataPanel.  

#### onSaveEditClick()
Passed as Prop to [DataPanel](https://github.com/biobricks/bionet-new/blob/master/src/js/components/demo/DataPanel.js)  
An event method that handles the save button click within 'edit mode' in DataPanel.  

#### onDeleteClick()
Passed as Prop to [DataPanel](https://github.com/biobricks/bionet-new/blob/master/src/js/components/demo/DataPanel.js)  
An event method that handles the delete button click within 'edit mode' in DataPanel.  


## DataPanel
[/src/js/components/demo/DataPanel.js](https://github.com/biobricks/bionet-new/blob/master/src/js/components/demo/DataPanel.js) - The left panel container component in the two-panel inventory component that holds Profile, New and Edit Forms for both Containers and Physicals.

### Props
The DataPanel component receives state and props from the LabInventory component.  
State: See [LabInventory > State](https://github.com/biobricks/bionet-new/blob/master/STRUCTURE.md#state-1).  
Props: See [LabInventory > Methods](https://github.com/biobricks/bionet-new/blob/master/STRUCTURE.md#methods).  


## MapPanel
[/src/js/components/demo/MapPanel.js](https://github.com/biobricks/bionet-new/blob/master/src/js/components/demo/MapPanel.js) - The right panel container component in the two-panel inventory component that holds Freeform, End-To-End and End-To-End With Image Views.  

### Props
The MapPanel component receives state from the LabInventory component.  
State: See [LabInventory > State](https://github.com/biobricks/bionet-new/blob/master/STRUCTURE.md#state-1).  







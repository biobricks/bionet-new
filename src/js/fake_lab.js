const shortid = require('shortid');
const faker = require('faker');

function fakeLabData() {
  // create lab object
  let lab = createLab({
    name: 'EndyLab',
    rows: 20,
    columns: 35
  });

  // create new freezer - each freezer has 3 shelves
  let freezer = createContainer({
    name: '-80 Freezer 1',
    parent: lab.id,
    row: 3, // 3 shelves
    column: 1
  });

  // create 3 shelves - each shelf has 4 racks
  let shelves = [];
  for(let i = 0; i < 3; i++){
    let newShelf = createContainer({
      name: `Shelf ${i + 1}`,
      rows: 1,
      columns: 4,
      parent: freezer.id,
      row: (i + 1),
      column: 1
    });
    shelves.push(newShelf);
  }

  // add shelves to freezer
  freezer.children = shelves;

  // add 4 racks to first shelf
  // set first shelf
  let firstShelf = freezer.children[0];
  //console.log(firstShelf);
  
  // make 4 racks - each rack holds 6 rows with 3 boxes in each row
  for(let i = 0; i < 4; i++){
    let newRack = createContainer({
      name: `Rack ${i + 1}`,
      rows: 6,
      columns: 3,
      parent: firstShelf.id,
      row: 1,
      column: (i + 1)
    });
    //console.log(newRack);
    firstShelf.children.push(newRack);
  }
  // save changes to shelf;
  freezer.children[0] = firstShelf;

  // add 3 boxes to first rack's first row
  // set first rack
  let firstRack = freezer.children[0].children[0];
  //console.log(firstRack);
  
  // make 3 boxes
  for(let i = 0; i < 3; i++){
    let newBox = createContainer({
      name: `Box ${i + 1}`,
      rows: 8,
      columns: 8,
      parent: firstRack.id,
      row: 1,
      column: (i + 1)
    });
    //console.log(newBox);
    firstRack.children.push(newBox);
  }

  //console.log(firstRack);

  // save changes to rack;
  freezer.children[0].children[0] = firstRack;


  // add 3 physicals to 1st Box

  // set first box
  let firstBox = freezer.children[0].children[0].children[0];
  //console.log(firstBox);  

  // make 3 Physicals
  for(let i = 0; i < 3; i++){
    let newPhysical = createPhysical({
      parent: firstBox.id,
      row: 1,
      column: (i + 1)
    });
    //console.log(newPhysical);
    firstBox.children.push(newPhysical);
  }

  //console.log(firstBox);

  // save changes to box;
  freezer.children[0].children[0].children[0] = firstBox;


  // add 3 physicals to 2nd Box

  // set first box
  let secondBox = freezer.children[0].children[0].children[1];
  //console.log(firstBox);  

  // make 3 Physicals
  for(let i = 0; i < 3; i++){
    let newPhysical = createPhysical({
      parent: secondBox.id,
      row: 1,
      column: (i + 1)
    });
    //console.log(newPhysical);
    secondBox.children.push(newPhysical);
  }

  //console.log(secondBox);

  // save changes to box;
  freezer.children[0].children[0].children[1] = secondBox;

  // add freezer to lab
  lab.children.push(freezer);

  // return populated lab object
  return lab;
}

function createLab(props) {
  let result = {
    id: shortid.generate(),
    name: props.name || faker.fake("{{lorem.word}}"),
    description: props.description || faker.fake("{{lorem.sentence}}"),
    rows: props.rows || getRandomInt(15,25),
    columns: props.columns || getRandomInt(15,25),
    children: props.children || []
  };
  return result;
}

function createContainer(props) {
  let result = {
    id: shortid.generate(),
    name: props.name || `${props.prefixName}-${props.prefixCount}` || faker.fake("{{lorem.word}}"),
    description: props.description || faker.fake("{{lorem.sentence}}"),
    rows: props.rows || getRandomInt(3,8),
    columns: props.columns || getRandomInt(3,8),
    parent: props.parent || "",
    row: props.row || getRandomInt(1,4),
    column: props.column || getRandomInt(1,4),
    children: props.children || []
  };
  return result;
}

function createContainers(count, props) {
  let resultArray= [];
  for(let i = 0; i < count; i++){
    resultArray.push(createContainer({
      prefixName: props.name || null,
      prefixCount: i + 1 
    }));
  }
  return resultArray;
}

function createPhysical(props) {
  let result = {
    id: shortid.generate(),
    name: props.name || faker.fake("{{lorem.word}}"),
    description: props.description || faker.fake("{{lorem.sentence}}"),
    parent: props.parent || "",
    row: props.row || getRandomInt(1,4),
    column: props.column || getRandomInt(1,4),
  };
  return result;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



module.exports.fakeLabData = fakeLabData;
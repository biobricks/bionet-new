module.exports = {
    
    initialize: function () {
        app.state.inventory = {
            listener:{},
            selection:{},
            physicalItem:null,
            virtualItem:null,
            favorites:[],
            moveItem:null,
            types:{}
        }
    },
    
    getSelectedItem: function() {
        if (!app.state.inventory.selection || !app.state.inventory.selection.id) return null
        const id = app.state.inventory.selection.id
        //console.log('getSelectedItem action:',app.state.inventory.path, app.state.inventory.selection)
        if (app.state.inventory.path && app.state.inventory.path.length>0) {
            const path = app.state.inventory.path
            const pathItem = path[path.length-1]
            if (pathItem.id === id) return pathItem
            
            const children = pathItem.children
            if (!children) return null
            //console.log('getSelectedItem searching child items')
            for (var i=0; i<children.length; i++) {
                if (children[i].id===id) return children[i]
            }
        }
        return null
    },
    
    getLastPathItem: function() {
        if (!app.state.inventory.path || !app.state.inventory.path.length>0) return null
        const path = app.state.inventory.path
        if (!path || path.length<1) return null
        const item = path[path.length-1]
        return item
    },
    
    getItemFromInventoryPath: function(id, pathIn) {
        const path = (pathIn) ? pathIn : app.state.inventory.path
        if (!path) return null
        //console.log('getItemFromInventoryPath:',path)
        for (var i=0; i<path.length; i++) {
            if (path[i].id===id) return path[i]
        }
        return null
    },
    
    selectCell: function(id, parentId, x, y, navigate) {
        //console.log('selectCell action:',id,parentId,x,y,navigate)
        //console.trace()
        const inventorySelection = {
            id: id,
            parentId: parentId,
            x: x,
            y: y,
            navigate:navigate
        }
        app.state.inventory.selection = inventorySelection

        if (navigate) {
            const idn = (id) ? id : parentId
            if (idn) {
                const url = "/inventory/"+idn
                //console.log('selectCell:',url)

              // TODO You are not allowed to directly modify the state.
              //      It must be done using app.setState or app.changeState
                app.state.history.push(url) 
            }
        }
        if (app.state.selectCellListener) app.state.selectCellListener(inventorySelection)
        if (app.state.inventory.listener.editCell) app.state.inventory.listener.editCell(inventorySelection)
        if (app.state.inventory.listener.assignPhysical) app.state.inventory.listener.assignPhysical(inventorySelection)
    },
    
    editItem: function(item) {
        //console.log('editItem action: ', item, app.state.inventory )
        app.state.inventory.physicalItem = item
        if (app.state.inventory.listener.physicalItem) app.state.inventory.listener.physicalItem(item)
    },
    
    updateItem: function(id, cb) {
        app.remote.get(id, function(err, item) {
            if (err) {
                app.actions.notify('Item '+id+' not found', 'error');
                if (cb) cb(err)
                return
            }
            if (cb) {
                const updatedItem = cb(null,item)
                app.remote.savePhysical(updatedItem, null, null, function (err, id) {
                    if (err) {
                        console.log(err)
                        return
                    }
                    const currentItem = app.actions.inventory.getLastPathItem()
                    app.actions.inventory.refreshInventoryPath(currentItem.id)
                })
            }
        })
        
    },
    
    editVirtualItem: function(id, cb) {
        //console.log('editVirtualItem action: ', id)
        if (!id) {
            if (cb) cb(null)
            else if (app.state.inventory.listener.virtualItem) app.state.inventory.listener.virtualItem(null)
            return null
        }
        app.remote.get(id, function(err, virtual) {
            if (err) {
                app.actions.notify('Virtual '+id+' not found', 'error');
                if (cb) cb(err)
                return
            }
            app.state.inventory.virtualItem = virtual
            if (cb) {
                cb(virtual)
            } else if (app.state.inventory.listener.virtualItem) app.state.inventory.listener.virtualItem(virtual)
            return null
        })
    },
    
    getLocationType: function( type ) {
        if (!app.state.inventory.types.locations) return
        const types = app.state.inventory.types.locations
        for (var i=0; i<types.length; i++) {
            if ( types[i].name === type ) return types[i]
        }
        return null
    },
    
    refreshInventoryPath: function(id, cb) {
        const url = "/inventory/"+id+"?r=true"
        //console.log('refreshInventoryPath:',url)
        app.state.inventory.forceRefresh=true
        app.state.history.push(url)
    },
    
    selectInventoryId: function(id, cb) {
        const url = "/inventory/"+id
        //console.log('getInventoryPath:',url)
        app.state.history.push(url)
    },
    
    getContainerSize: function() {
        var containerSize = window.innerWidth/8
        containerSize = (containerSize > 150) ? 150: containerSize
        if (!containerSize) containerSize = 150
        app.state.inventory.containerSize = containerSize
        return containerSize
    },
    
    getInventoryPath: function(id, cb) {
        //console.log('getInventoryPathRPC action id:',id)
        
        //console.trace()
        // TODO You are not allowed to manipulate state directly.
        //      You must use .setState or .changeState
        app.state.inventory.refresh=false
        if (!id) {
            if (cb) cb(new Error('Key not specified for inventory path'))
            return null
        }
        const locationPath = {}
        
        const debugcb=function(msg,data) {
            //console.log('getInventoryPath,'+msg,data)
        }
        var containerSize = this.getContainerSize()
        
        app.remote.getLocationPathChildren(id, function (err, locationPathAr) {
            //console.log('getInventoryPath, cb',locationPathAr)
            if (err) {
                console.log('getInventoryPath error:', err.message)
                if (cb) cb(err, null)
                return
            }
            locationPathAr.reverse()
            
            const findInChildren = function(id, children) {
                if (!children) return 0
                for (var i=0; i<children.length; i++) if (id===children[i].id) return i
                return 0
            }
            
            for (var i = 0; i < locationPathAr.length; i++) {
                var location = locationPathAr[i]
                var locationId = location.id
                var locationType = this.getLocationType(location.type)
                var xu = location.xUnits
                var yu = location.yUnits
                var xunits = (location.xUnits) ? location.xUnits : (locationType) ? locationType.xUnits : 1
                var yunits = (location.yUnits) ? location.yUnits : (locationType) ? locationType.yUnits : 1
                location.xUnits = xunits
                location.yUnits = yunits
                //console.log('getInventoryPath:',location,xu, yu,    xunits,yunits)
                var px=null
                var py=null
                var nextLocation = (i<locationPathAr.length-1) ? locationPathAr[i+1] : {}
                if (nextLocation.id) {
                    px = (nextLocation.parent_x) ? nextLocation.parent_x : 1
                    py = (nextLocation.parent_y) ? nextLocation.parent_y : findInChildren(nextLocation.id,location.children)+1
                }
                //var xunits = (!locationType.xUnits || locationType.xUnits===0) ? 1: locationType.xUnits
                //var yunits = (!locationType.yUnits || locationType.yUnits===0) ? 1: locationType.yUnits
                const subdivisions = this.generateSubdivisions(location.id, containerSize, containerSize, xunits, yunits, px, py)
                var cellMap = this.generateCellMap(location.children, location.type, xunits, yunits)
                this.mapOccupiedCellstoSubdivisions(subdivisions, cellMap, px, py)
                location.subdivisions = subdivisions
                //console.log('locationPathSubdivision:',JSON.stringify(subdivisions,null,2))

                locationPath[locationId] = location
            }
            const length = locationPathAr.length
            const item = (length>0) ? locationPathAr[length-1] : null
            app.state.inventory.path = locationPathAr
            if (item) this.selectCell(item.id, item.parent_id, item.parent_x, item.parent_y, false)
            //console.log('getInventoryPath action:')
            if (cb) cb(null, locationPathAr)
        }.bind(this),debugcb.bind(this))
    },
    
    mapOccupiedCellstoSubdivisions: function(subdivisions, cellMap, px, py) {

        for (var i = 0; i<subdivisions.length; i++) {
            var row = subdivisions[i]
            var cols=[]
            for (var j=0; j<row.length; j++) {
                var col = row[j]
                col.isActive = (col.parent_x === px && col.parent_y === py)
                var cell = cellMap[col.label]
                if (cell) {
                    col.isOccupied = true
                    col.name = (cell.name) ? cell.name : col.label
                    col.item = cell
                } else {
                    col.isOccupied = false
                    col.name = col.label
                }
            }
        }
    },
    
    generateLabel:function(parent_x, parent_y, xunits, yunits) {
        const x = parent_x
        const y = parent_y
        if (xunits>1 && yunits>1) return x+','+y
        if (xunits>1) return x
        if (yunits>1) return y
        return ''
    },

    generateSubdivisions: function(parent_id, pwidth, pheight, pxunits, pyunits,  px1, py1) {
        //console.log('subdivideContainer', pxunits, pyunits, pwidth, selectedItemId, px, py)

        const xunits = (!pxunits || pxunits===0) ? 1 : pxunits
        const yunits = (!pyunits || pyunits===0) ? 1 : pyunits
        const width = pwidth
        const height = pheight
        const dx = width / xunits
        const dy = height / yunits
        var px = px1
        var py = py1

        const generateCols =function(row) {
            const cols=[]
            const y = row+1
            for (var col=0; col<xunits; col++) {
                var x = col+1

                var label = app.actions.inventory.generateLabel(x, y, xunits, yunits)
                const cellId = "cell_"+label+"_parent_"+parent_id
                var storageCell = {
                    cellId:cellId,
                    label:label,
                    parent_id:parent_id,
                    parent_x:x,
                    parent_y:y,
                    width:dx,
                    height:dy
                }
                cols.push(storageCell)
            }
            return cols
        }

        const rows=[]
        for (var y=0; y<yunits; y++) {
            rows.push ( generateCols(y) )
        }
        return rows
    },
    
    generateCellMap: function(items, type, xunits, yunits) {
//        console.log('generateCellMap:', items)
        var cellMap={}
        if (!items) return cellMap
        for (var i=0; i<items.length; i++) {
            var item = items[i]
            if (!item || !item.parent_x || !item.parent_y) continue
            var px=0
            var py=0
            if (type && type.toLowerCase()==='lab') {
                px = (item.parent_x) ? item.parent_x-1 : 0
                py = (item.parent_y) ? item.parent_y-1 : i
            } else {
                px = item.parent_x-1
                py = item.parent_y-1
            }
            var cellId = app.actions.inventory.generateLabel(px+1, py+1, xunits, yunits)
            cellMap[cellId]=item
        }
        return cellMap
    },
    
    getWorkbenchContainer: function(cb){
        app.remote.getWorkbench(function(err, workbench) {
            if (err) {
                console.log('error retrieiving workbench container:',err)
                if (cb) cb(err)
                return
            }
            if (!app.state.inventory.workbench) app.state.inventory.workbench={}
            app.state.inventory.workbench.container = workbench
            if (cb) cb(null, workbench)
        })
    },

    getWorkbenchTree: function(cb){
        app.remote.workbenchTree(function(err,tree) {
            if (err) {
                console.log('error retrieiving workbench tree:',err)
                if (cb) cb(err)
                return
            }
            if (!app.state.inventory.workbench) app.state.inventory.workbench={}
            app.state.inventory.workbench.tree = tree
            if (cb) cb(null, tree)
        })
    },
    
    saveToWorkbench: function(id, cb) {
        if (!id) return
        app.remote.get(id, function(err, m) {
            if (err) {
                console.log('saveToWorkbench: id not found', err)
                if (cb) cb(err)
                return
            }
            console.log('saving to workbench:',m)
            app.remote.saveInWorkbench(m,null,null,function(err,id2) {
                if (err) {
                    console.log('error saving to workbench:',err)
                    if (cb) cb(err)
                    return
                }
                if (cb) cb(null, id2)
            })
        })
    },
    
    moveWorkbenchToContainer: function(containerId, x, y, cb) {
        this.getWorkbenchTree(function(err,tree) {
            if (err) {
                console.log('error moving workbench tree:',err)
                if (cb) cb(err)
                return
            }
            console.log('moveWorkbenchToContainer:',containerId)
            var remainingItems = tree.length-1
            // todo fetch empty cells for container
            for (var i=0; i<tree.length; i++) {
                var item = tree[i].value
                if (item) {
                    item.parent_id = containerId
                    // todo: set parent_x, parent_y to empty cells
                    console.log('moveWorkbenchToContainer, item:',item)
                    app.remote.savePhysical(item, null, null, function (err, id) {
                        if (remainingItems-- <= 0) {
                            if (cb) cb(null)
                        }
                    })
                }
            }
        }.bind(this))
    },
    
    getEmptyCellArray: function(subdivisions) {
        const emptyCellArray=[]
        for (var i=0; i<subdivisions.length; i++) {
            Array.prototype.push.apply(emptyCellArray, subdivisions[i].filter( function(cell) {
                return !cell.isOccupied
            }));
        }
        return emptyCellArray
    },
    
    isInstanceContainerSelected() {
        const currentItem = app.actions.inventory.getLastPathItem()
        if (currentItem && currentItem.type) {
            const currentSelectionType = currentItem.type.toLowerCase()
            if (currentSelectionType.indexOf('box')>=0) return true;
        }
        return false
    },
    
    getActiveTypes: function(type) {
        const isBox = type.toLowerCase().indexOf('box') >= 0
        if (!isBox) {
            const types=[]
            Array.prototype.push.apply(types, app.state.inventory.types.locations.filter( function(typeSpec) {
                return typeSpec.name !=='lab'
            }));
            return types
        }
        return app.state.inventory.types.materials
    },
    
    getTerms: function() {
        return app.settings.terms
    },
    
    getRootPathItem: function() {
        if (!app.state.inventory.path || !app.state.inventory.path.length>0) return null
        return app.state.inventory.path[0]
    },
    
    getInventoryTypes: function() {
        const dataTypes = app.settings.dataTypes

        const materials = []
        const locations = []

        // add generalized container type
        locations.push({
          name: "container",
          title:"Container",
          xUnits:1,
          yUnits:1,
          fields: {
            Description: 'text'
          }
        })
            
        for (var i = 0; i < dataTypes.length; i++) {
            const type = dataTypes[i]
            if (type.virtual === true) {
                type.url = '/create-virtual/' + encodeURI(type.name)
                materials.push(type)
            } else {
                type.url = '/create-physical/' + encodeURI(type.name)
                locations.push(type)
            }
        }
        const typeSpec = {
            materials: materials,
            locations: locations
        }
        app.state.inventory.types = typeSpec
        return typeSpec
    },
    
    getRootItem: function(cb) {
        var rootItem
        /*
        app.remote.getInventoryRoot(function(err,path,key) {
            console.log('getRootItem:',key,err,path)
            cb(err,key)
        })
        */
        app.remote.inventoryTree(function (err, children) {
            //console.log('getRootItem:',children)
            if (err) {
                console.log("getRootItem error:", err);
                if (cb) cb(err)
                return 
            }
            for (var i = 0; i < children.length; i++) {
                var item = children[i].value
                if (!item.parent_id && item.type === 'lab') {
                    if (cb) cb(null,item.id)
                    break;
                }
            }
        })
    },
    
    setSelectionMode: function (e) {

    },
    
    saveToInventory: function (physical, label, doPrint, cb) {
        app.remote.savePhysical(physical, label, doPrint, function (err, id) {
            if (err) {
                console.log(err)
            }
            if (cb) cb(err, id, physical.parent_x, physical.parent_y)
        })
    },
    
    getAttributesForType: function(type) {
        const dataTypes = app.settings.dataTypes
        const attributes = []
        for (var i = 0; i < dataTypes.length; i++) {
          const dataType = dataTypes[i]
          if (type === dataType.name) {
            var fields = dataType.fields
            if (fields === undefined) return attributes
            Object.keys(fields).forEach(function (key, index) {
              attributes.push({
                name: key,
                value: fields[key]
              })
            })
            break
          }
        }
        return attributes
    },

    generatePhysicals: function (virtualId, seriesName, instances, container_id, emptyCellArray, cb) {
        if (instances===0) {
            if (cb) cb(null)
            return
        }
        const instancesList = []
        for (var instance = 0; instance < instances; instance++) {
            
            // todo: generate hash value for new physical instance to avoid naming collisions
            const name = seriesName + '_' + instance
            var x=1
            var y=1
            if (emptyCellArray && emptyCellArray[instance]) {
                var cell = emptyCellArray[instance]
                x = cell.parent_x
                y = cell.parent_y
            } else {
                x = instance+1
            }
            
            const dbData = {
                name: name,
                type: 'physical',
                virtual_id:virtualId,
                parent_id: container_id,
                parent_x: x,
                parent_y: y
            }
            instancesList.push(dbData)
        }
        if (container_id) {
            var nrem = instancesList.length
            for (var i = 0; i < instancesList.length; i++) {
                console.log('saving physical:',instancesList[i])
                this.saveToInventory(instancesList[i], null, null, function (err,id,x,y) {
                    if (err) {
                        if (cb) cb(err)
                        return
                    }
                    for (var j=0; j<instancesList.length; j++) {
                        var instance = instancesList[j]
                        if (instance.parent_x === x && instance.parent_y === y) instance.id = id
                    }
                    if (--nrem <= 0) {
                        if (cb) cb(null,instancesList)
                    }
                })
            }
        } else {
            if (cb) cb()
        }
    },
    
    forceRefresh: function(id) {
        setTimeout(function(){
            app.state.inventory.forceRefresh=true
            this.selectInventoryId(id)
        }.bind(this), 1);
    },
    
    saveVirtual: function(virtualObj, cb) {
        console.log('saveVirtual action:',virtualObj)
        app.remote.saveVirtual(virtualObj, function (err, virtualId) {
            if (err) console.log('saveVirtual error:',err)
            if (cb) cb(err,virtualId)
        });
    },

    generatePhysicalsFromUpload: function (result, parent_id) {
        if (!csvData) return
        console.log('generatePhysicalsFromUpload csv:', csvData)
        const instancesList = []
        const lines = csvData.match(/[^\r\n]+/g);
        console.log('generatePhysicalsFromUpload lines:', lines)



        const headerLine = lines[0].match(/[^,]+/g)
        console.log('generatePhysicalsFromUpload headerLine:', headerLine)

        const isBionetBulkData = (headerLine.indexOf('customer_line_item_id') < 0)
        console.log('generatePhysicalsFromUpload: isBionet:', isBionetBulkData)

        const bionetBulkUpload = function () {
            const createVirtual = function (virtualObj, physicalInstances, container_id, well_id) {
                if (!physicalInstances || isNaN(physicalInstances)) return
                app.remote.saveVirtual(virtualObj, function (err, virtualId) {
                    if (err) return null // TODO handle error
                    generatePhysicals(virtualId, virtualObj.name, physicalInstances, container_id, well_id)
                });
            }
            const nameIdx = headerLine.indexOf('Name')
            const typeIdx = headerLine.indexOf('Type')
            const usernameIdx = headerLine.indexOf('Created By')
            const createdDateIdx = headerLine.indexOf('Created')
            const descriptionIdx = headerLine.indexOf('Description')
            const sequenceIdx = headerLine.indexOf('Sequence')
            const instancesIdx = headerLine.indexOf('Physical Instances')
            const genomeIdx = headerLine.indexOf('Genome')
            const wellIdx = headerLine.indexOf('Well')
            if (nameIdx < 0 || typeIdx < 0 || instancesIdx < 0) {
                app.toast('invalid format specified, missing name, type or instances')
                return
            }

            for (var i = 1; i < lines.length; i++) {
                var line = lines[i].match(/[^,]+/g)
                console.log('line:%s', JSON.stringify(line))
                var instances = line[instancesIdx]
                if (!instances || isNaN(instances)) continue
                var seriesName = line[nameIdx]
                var userName = line[usernameIdx]
                var virtualType = line[typeIdx]
                    //const timeCreated = line[createdDateIdx]
                var timeCreated = new Date().toDateString()
                var creator = {
                    user: userName,
                    time: timeCreated
                }
                var updated = {
                    user: userName,
                    time: timeCreated
                }
                var description = line[descriptionIdx]
                var sequence = line[sequenceIdx]
                var genome = line[genomeIdx]
                var well_id = null
                if (wellIdx >= 0) {
                    var well_id_str = line[wellIdx]
                    well_id = wellIdToObj(well_id_str)
                }
                var virtualObj = {
                    name: seriesName,
                    type: virtualType,
                    creator: creator,
                    "creator.user": userName,
                    "creator.time": timeCreated,
                    Description: description,
                    Sequence: sequence,
                    Genome: genome
                }
                createVirtual(virtualObj, instances, container_id, well_id)

            }
        }

    },

    generatePhysicalFromGenbankUpload: function (filename, result, parent_id) {
        this.genbankToJson(gbData, function (results) {

            if (!results || !results.length) {
                return app.ui.toast("Error reading file: " + filename);
            }

            var i, data;
            for (i = 0; i < results.length; i++) {
                if (!results[i].success) {
                    console.error("Error:", results.messages);
                    return app.ui.toast("Error reading file: " + filename);
                }
                data = results[i].parsedSequence;

                if (!data || !data.name) {
                    return app.ui.toast("Error reading file: " + filename);
                }

                // if no description, generate description from features
                if (!data.description || !data.description.trim()) {
                    data.description = (data.features) ? data.features.map(function (feat) {
                        return feat.name;
                    }).join(', ') : '';

                }

                var virtualObj = {
                    name: data.name,
                    type: 'vector',
                    Description: data.description,
                    Sequence: data.sequence,
                    filename: filename
                }
                createVirtual(virtualObj, 1, container_id);
            }
        }, {
            isProtein: false
        })
    },

    addFavorite: function (m, cb) {
        app.remote.saveFavLocation(m, null, null, function (err) {
            console.log('addFavorite action:',m,err)
            if (cb) cb(err)
        })
    },
    
    setMoveItem: function(item) {
        app.state.inventory.moveItem = item
        if (app.state.inventory.listener.moveItem) app.state.inventory.listener.moveItem(item)
    },

    getFavorites: function (cb) {
        //console.log('getFavorites action called')
        app.remote.favLocationsTree(function(err, userFavorites) {
            //console.log('getFavorites action:',err,userFavorites)
            app.state.favorites=userFavorites
            
            app.changeState({
                inventoryNav : {
                    favorites:userFavorites
                }
            })
            if (cb) cb(err, userFavorites)
        })
    },

    virtualSaveResult: function () {

    },
    
    addItem: function(type) {
        
    },
    
    delPhysical: function (id, cb) {
        var err = null
        app.remote.delPhysical(id, function (err, id) {
            if (cb) cb(err, id)
        })
    }
}

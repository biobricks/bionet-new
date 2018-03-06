module.exports = {
    
    initialize: function () {
        /*
        app.changeState({
            global: {
                test:[1,2,3],
                test2:{}
            }
        })
        */
        
        app.changeState({
            global: {
                moveItem: {},
                inventorySelection: {},
                inventoryTypes:{},
                inventoryItem: null,
                inventoryItemParent: null,
                virtualItem: null,
                inventoryItemParent: null,
                inventoryLocationPath: null,
                inventoryPath:null,
                inventoryRoot: null,
                rootId: null
            }
        });
        return
        
        app.changeState({
            global: {
                inventorySelection: {},
                inventoryTypes:{},
                inventoryItem: null,
                inventoryItemParent: null,
                virtualItem: null,
                inventoryItemParent: null,
                inventoryLocationPath: null,
                inventoryPath: null,
                inventoryRoot: null,
                rootId: null,
                moveItem: {},
                locations:[]
            }
        });
    },
    
    getSelectedItem: function() {
        if (!app.state.global.inventorySelection || !app.state.global.inventorySelection.id) return null
        const id = app.state.global.inventorySelection.id
        
        if (app.state.global.inventoryPath && app.state.global.inventoryPath.length>0) {
            const path = app.state.global.inventoryPath
            const pathItem = path[path.length-1]
            if (pathItem.id === id) return pathItem
            
            const children = pathItem.children
            if (!children) return null
            console.log('getSelectedItem searching child items')
            for (var i=0; i<children.length; i++) {
                if (children[i].id===id) return children[i]
            }
        }
        return null
    },
    
    getLastPathItem: function() {
        if (!app.state.global.inventoryPath || !app.state.global.inventoryPath.length>0) return null
        const path = app.state.global.inventoryPath
        if (!path || path.length<1) return null
        const item = path[path.length-1]
        return item
    },
    
    getItemFromInventoryPath: function(id, pathIn) {
        const path = (pathIn) ? pathIn : app.state.global.inventoryPath
        if (!path) return null
        //console.log('getItemFromInventoryPath:',path)
        //return
        for (var i=0; i<path.length; i++) {
            if (path[i].id===id) return path[i]
        }
        return null
    },
    
    selectCell: function(id, parentId, x, y, navigate) {
        console.log('selectCell action:',id,x,y)
        //console.trace()
        app.changeState({
            global: {
                inventorySelection: {
                    id: id,
                    parentId: parentId,
                    x: x,
                    y: y,
                    navigate:navigate
                }
            }
        });
    },
    
    editItem: function(item) {
        console.log('editItem action: ', item)
        const parent =  (item.parent_id) ? this.getItemFromInventoryPath(item.parent_id) : null
        app.changeState({
            global: {
                inventoryItem: null,
                inventoryItemParent: null
            }
        });
        app.changeState({
            global: {
                inventoryItem: item,
                inventoryItemParent: parent
            }
        });
    },
    
    editVirtualItem: function(item) {
        console.log('editVirtualItem action: ', item)
        app.changeState({
            global: {
                virtualItem: null,
                inventoryItemParent: null
            }
        });
        const parent =  (item.parent_id) ? this.getItemFromInventoryPath(item.parent_id) : null
        app.changeState({
            global: {
                virtualItem: item,
                inventoryItemParent: parent
            }
        });
    },
    
    getChildren:function(id, cb) {
        app.remote.getChildren(id, function(err, children) {
            if (err) return console.error(err);
            const ichildren = []
            var ypos=0
            for (var i = 0; i < children.length; i++) {
                var child = children[i]
                if (id === child.value.parent_id) {
                    var value = child.value
                    if (!value.parent_x) value.parent_x = 1
                    if (!value.parent_y) value.parent_y = ypos++
                    ichildren.push(value)
                }
            }
            cb(id, ichildren)
        })
    },
    
    getLocationType: function( type ) {
        if (!app.state.global.inventoryTypes.locations) return
        const types = app.state.global.inventoryTypes.locations
        for (var i=0; i<types.length; i++) {
            if ( types[i].name === type ) return types[i]
        }
        return null
    },
    
    getInventoryPath: function(id, cb) {
        if (!id) {
            if (cb) cb(null)
            return null
        }
        console.log('getInventoryPath action id:',id)
        const locationPath = {}
        var results = 0
        app.remote.getLocationPath(id, function (err, locationPathAr) {
            if (err) {
                console.log('getLocationPath error:', err)
                if (cb) cb(null)
                return null
            }
            
            app.changeState({
                global: {
                    inventoryLocationPath: locationPathAr
                }
            });
            locationPathAr.reverse()
            
            results = locationPathAr.length
            for (var i = 0; i < locationPathAr.length; i++) {
                var location = locationPathAr[i]
                var locationId = location.id
                var locationType = this.getLocationType(location.type)
                if (locationType) {
                    location.xUnits = locationType.xUnits
                    location.yUnits = locationType.yUnits
                }
                locationPath[locationId] = location
                this.getChildren(locationId, (pid, children) => {
                    locationPath[pid].children = children
                    if (--results <= 0) {
                        
                        app.changeState({
                            global: {
                                inventoryPath: null
                            }
                        });
                        
                        const length = locationPathAr.length
                        const item = (length>0) ? locationPathAr[length-1] : null
                        const parent = (length>1) ? locationPathAr[length-2] : null
                        var inventorySelection = null
                        if (item) {
                            inventorySelection = {
                                id: item.id,
                                parentId: item.parent_id,
                                x: item.parent_x,
                                y: item.parent_y,
                                navigate:true
                            }
                        }
                                //inventorySelection: inventorySelection
                        
                        app.changeState({
                            global: {
                                inventoryPath: locationPathAr
                            }
                        });
                        if (cb) cb(locationPath)
                        
                    }
                })
            }
        }.bind(this ))
    },
    
    getInventoryTypes: function() {
        
        const dataTypes = app.settings.dataTypes
        //console.log('getInventoryTypes, appSettings:',dataTypes)

        const materials = []
        const locations = []
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
        app.changeState({
            global: {
                inventoryTypes: null
            }
        });
        app.changeState({
            global: {
                inventoryTypes: typeSpec
            }
        });
        
        const createType = 'storage'
    },
    
    getRootItem: function(cb) {
        var rootItem
        app.remote.inventoryTree(function (err, children) {
            if (err) return console.log("ERROR:", err);

            for (var i = 0; i < children.length; i++) {
                var item = children[i].value
                if (!item.parent_id && item.type === 'lab') {;
                    app.changeState({
                        global: {
                            inventoryRoot: null
                        }
                    });
                    app.changeState({
                        global: {
                            inventoryRoot: item
                        }
                    });
                    if (cb) cb(item)
                    break;
                }
            }
        })
    },
    
    init: function (q) {
        this.getFavorites()
        if (q) {
            this.selectInventoryItem(q)
            return
        }

        const setRootId = function (id) {
            app.changeState({
                global: {
                    inventory: {
                        rootId: id
                    }
                }
            });
        }

        //app.global.inventory
        var rootItem
        BIONET.remote.inventoryTree(function (err, children) {
            if (err) return console.log("ERROR:", err);
            for (var i = 0; i < children.length; i++) {
                var item = children[i].value
                if (!item.parent_id && item.type === 'lab') {
                    setRootId(item.id)
                    rootItem = item
                    this.selectInventoryItem(rootId)
                    break;
                }
            }
        })
    },

    refreshInventoryPath: function (id) {
        console.log('refreshInventoryPath:', id)
        this.retrieveLocationPath(id, (path) => {
            BIONET_VIS.signal.setLocationPath.dispatch(id, path)
            BIONET.signal.getFavorites.dispatch()
            const selectedChildren = getChildTable(path[id].children)
            if (id.indexOf('p->') >= 0 || id.indexOf('v-') >= 0) {
                // todo: set component state
                //tag.editPart(path[id])
                //$('#edititem').show()
            } else {
                BIONET_DATAGRID.updateDataTable(selectedChildren)
                    // set component state
                    //$('#edititem').hide()
            }
        })
    },
    
        
    retrieveLocationPath: function (id, cb) {
        if (!id) return
        const locationPath = {}
        var results = 0
        BIONET.remote.getLocationPath(id, function (err, locationPathAr) {
            if (err) {
                console.log('getLocationPath error:', err)
                return
            }
            results = locationPathAr.length
            for (var i = 0; i < locationPathAr.length; i++) {
                var location = locationPathAr[i]
                var locationId = location.id
                locationPath[locationId] = location
                this.getChildren(locationId, (pid, children) => {
                    locationPath[pid].children = children
                    if (--results <= 0) {
                        cb(locationPath)
                    }
                })
            }
        })
    },

    selectInventoryItem: function (id, selectionModeVis) {
        BIONET.signal.setLayout.dispatch(tag.layout)
        const selectionMode = selectionModeVis || BIONET_VIS.getSelectionMode()
        if (selectionMode === BIONET.EDIT_SELECTION) {
            editSelection = BIONET_VIS.getEditSelection()
            if (editSelection && editSelection.dbData) {
                if (editSelection.dbData.type === 'physical') {
                    tag.editMaterial()
                } else {
                    tag.editItem()
                }
            }
            return
        } else if (selectionMode === BIONET.MOVE_SELECTION) {
            BIONET.signal.highlightItem.dispatch(BIONET_VIS.ZOOM_ITEM, id)
            BIONET_VIS.setMoveItemId(id)
            const currentItem = BIONET_VIS.getSelectedItem()
            console.log('selectInventoryItem: move', id, currentItem)
            return
        }

        retrieveLocationPath(id, (path) => {
            //console.log('retrieveLocationPath:', JSON.stringify(path, null, 2))
            BIONET_VIS.signal.setLocationPath.dispatch(id, path)
            const type = BIONET_VIS.getSelectedType()
            const currentItem = BIONET_VIS.getSelectedItem()
            console.log('retrieveLocationPath:', path, type, currentItem)
            if (currentItem) {
                tag.selectedName = currentItem.name
            }
            tag.createType = (type === 'box') ? 'material' : 'storage'
            const selectedChildren = getChildTable(path[id].children)
            updateLayout()
            if (type === 'part' || id.indexOf('v-') >= 0) {
                $('#edititem').show()
                tag.editPart(currentItem.dbData)
            } else {
                $('#edititem').hide()
                BIONET_DATAGRID.updateDataTable(selectedChildren)
                BIONET.signal.getFavorites.dispatch()
            }
            tag.update()
        })
    },

    setSelectionMode: function (e) {

    },
    
    saveToInventory: function (physical, label, doPrint, cb) {
        app.remote.savePhysical(physical, label, doPrint, function (err, id) {
            if (err) {
                console.log(err)
            }
            if (cb) cb(err, id)
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

    generatePhysicals: function (virtualId, seriesName, instances, container_id, well_id, cb) {
        const instancesList = []
        for (var instance = 0; instance < instances; instance++) {
            
            // todo: generate hash value for new physical instance to avoid naming collisions
            const name = seriesName + '_' + instance
            var parent_x, parent_y
            if (well_id) {
                parent_x = well_id.x
                parent_y = well_id.y
            } else {
                parent_x = 1
                parent_y = 1
            }
            
            const dbData = {
                name: name,
                type: 'physical',
                virtual_id:virtualId,
                parent_id: container_id,
                parent_x: parent_x+instance,
                parent_y: parent_y
            }
            instancesList.push(dbData)
        }
        if (container_id) {
            var nrem = instancesList.length
            for (var i = 0; i < instancesList.length; i++) {
                console.log('saving physical:',instancesList[i])
                this.saveToInventory(instancesList[i], null, null, function (n) {
                    if (--nrem <= 0) {
                        if (cb) cb()
                    }
                })
            }
            //if (cb) cb()
        } else {
            if (cb) cb()
        }
    },
    
    saveVirtual: function(virtualObj, physicalInstances, container_id, well_id, cb) {
        const thisModule = this
        console.log('saveVirtual action:',virtualObj, physicalInstances, container_id, well_id)
        app.remote.saveVirtual(virtualObj, function (err, virtualId) {
            if (!err) thisModule.generatePhysicals(virtualId, virtualObj.name, physicalInstances, container_id, well_id, function() {
                if (cb) cb(err,virtualId)
            })
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

                /*

                getPhysicalResult {"name":"myNewVector01_0","type":"physical","parent_id":"p-40f35523-9884-4361-8eae-e97466e7b25d","id":"p-9820ba76-5ff0-4270-bbc3-07079a796b76","created":{"user":"tsakach@gmail.com","time":1499278758},"updated":{"user":"tsakach@gmail.com","time":1499278758}}

                {"type":"vector","name":"myNewVector02","creator":{"user":"tsakach@gmail.com","time":"Wed Jul 05 2017"},"Description":"v02","Sequence":"abba","creator.user":"tsakach@gmail.com","creator.time":"Wed Jul 05 2017","Genotype":"abcd"}"
                */
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
            if (cb) cb(err)
        })
    },
    
    setMoveItem: function(item) {
        app.changeState({
            global: {
                moveItem: null
            }
        });
        app.changeState({
            global: {
                moveItem: item
            }
        });
    },

    getFavorites: function (cb) {
        console.log('getFavorites action called')
        app.remote.favLocationsTree(function(err, userFavorites) {
            console.log('getFavorites action:',userFavorites)
            app.changeState({
                global: {
                    favorites: null
                }
            });
            app.changeState({
                global: {
                    favorites: userFavorites
                }
            });
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

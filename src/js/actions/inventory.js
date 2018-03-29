module.exports = {
    
    initialize: function () {
        app.state.inventory={
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
                app.state.history.push(url)
            }
        }
        if (app.state.selectCellListener) app.state.selectCellListener(inventorySelection)
        if (app.state.inventory.listener.editCell) app.state.inventory.listener.editCell(inventorySelection)
    },
    
    editItem: function(item) {
        //console.log('editItem action: ', item, app.state.inventory )
        app.state.inventory.physicalItem = item
        if (app.state.inventory.listener.physicalItem) app.state.inventory.listener.physicalItem(item)
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
                return null
            }
            app.state.inventory.virtualItem = virtual
            if (cb) {
                cb(virtual)
            } else if (app.state.inventory.listener.virtualItem) app.state.inventory.listener.virtualItem(virtual)
            return null
        })
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
        app.state.inventory.refresh=true
        app.state.history.push(url)
    },
    
    selectInventoryId: function(id, cb) {
        const url = "/inventory/"+id
        //console.log('getInventoryPath:',url)
        app.state.history.push(url)
    },
    
    getInventoryPath: function(id, cb) {
        console.log('getInventoryPathRPC action id:',id)
        
        //console.trace()
        app.state.inventory.refresh=false
        if (!id) {
            if (cb) cb(null)
            return null
        }
        const locationPath = {}
        const debugcb=function(msg,data) {
            console.log('getInventoryPath,'+msg,data)
        }
        app.remote.getLocationPathChildren(id, function (err, locationPathAr) {
            console.log('getInventoryPath, cb',locationPathAr)
            if (err) {
                console.log('getInventoryPath error:', err)
                if (cb) cb(null)
                return null
            }
            locationPathAr.reverse()
            
            for (var i = 0; i < locationPathAr.length; i++) {
                var location = locationPathAr[i]
                var locationId = location.id
                var locationType = this.getLocationType(location.type)
                if (locationType) {
                    location.xUnits = locationType.xUnits
                    location.yUnits = locationType.yUnits
                }
                locationPath[locationId] = location
            }
            const length = locationPathAr.length
            const item = (length>0) ? locationPathAr[length-1] : null
            app.state.inventory.path = locationPathAr
            if (item) this.selectCell(item.id, item.parent_id, item.parent_x, item.parent_y, false)
            //console.log('getInventoryPath action:')
            if (cb) cb(locationPathAr)
        }.bind(this),debugcb.bind(this))
    },
    
    getRootPathItem: function() {
        if (!app.state.inventory.path || !app.state.inventory.path.length>0) return null
        return app.state.inventory.path[0]
    },
    
    getInventoryTypes: function() {
        const dataTypes = app.settings.dataTypes

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

    generatePhysicals: function (virtualId, seriesName, instances, container_id, well_id, cb) {
        if (instances===0) {
            if (cb) cb(null)
            return
        }
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
                this.saveToInventory(instancesList[i], null, null, function (err,id,x,y) {
                    for (var j=0; j<instancesList.length; j++) {
                        var instance = instancesList[j]
                        if (instance.parent_x === x && instance.parent_y === y) instance.id = id
                    }
                    if (--nrem <= 0) {
                        if (cb) cb(instancesList)
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
    
    saveVirtual: function(virtualObj, physicalInstances, container_id, well_id, cb) {
        const thisModule = this
        console.log('saveVirtual action:',virtualObj, physicalInstances, container_id, well_id)
        if (physicalInstances) {
            thisModule.generatePhysicals(virtualObj.id, virtualObj.name, physicalInstances, container_id, well_id, function(physicals) {
                if (cb) cb(null,virtualObj.id, physicals)
            })
            return
        }
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

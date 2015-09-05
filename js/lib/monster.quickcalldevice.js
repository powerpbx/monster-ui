define(function(require) {

	var $ = require("jquery"),
		_ = require("underscore"),
		monster = require("monster");
	var quickcalldevice = {


		populateDropdown: function(dropdown, _selected) {
return quickcalldevice;
			var quickcalldevice = this, selected = _selected;

                        quickcalldevice.usersGetDevicesData(function(devicesData) {
console.log(deviceData);
                            var devices = {};
                                _.each(devicesData, function(device) {
                                    if( (!('owner_id' in device) || device.owner_id === '' || device.owner_id === apps.auth.currentUser.id) ) {
                                            devices[device.id] = device;
                                    }
                            });

                        list: {devices};

                        }),


			$.each(quickcalldevice.list, function(i, data) {
				if(selected == data.id) {
					dropdown.append('<option value="' + data.id + '" SELECTED>' + data.name + '</option>');
				}
				else {
					dropdown.append('<option value="' + data.id + '">' + data.name + '</option>');
				}
			});
		},

                usersGetDevicesData: function(callback) {
                        var data = this;
                        monster.request({
                                resource: 'device.list',
                                data: {
                                        accountId: monster.apps.auth.currentAccount.id,
                                        filters: {
                                                paginate: 'false'
                                        }
                                },
                                success: function(data) {
                                        callback && callback(data.data);
                                }
                        });
console.log(data);
                },

                getSelectedFormatArray: function(id) {
                        if(this.list[id] !== 'undefined') return this.list[id];
                        else return this.list[''];
                }
        };
	return quickcalldevice;
});
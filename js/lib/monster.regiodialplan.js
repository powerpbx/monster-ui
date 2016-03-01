define(function(require) {

	var $ = require("jquery"),
		_ = require("underscore"),
		monster = require("monster");

	var regionaldialplan = {
			list: {
                                    "": { regiodialplan: '', country: "None", region: "", dial_plan: '{}' },
//                                    "4127": { regiodialplan: '4127', country: "Schweiz", region: "27", dial_plan: '{"^[1-9]\\\\d{6}$": { "description": "Regional","prefix": "+4127"},"(?:^\\\\+?41|^0041|^0)((?:[1-9][0-9])\\\\d{7})$": {"description": "National","prefix": "+41"},"(?:^\\\\+?41|^0041|^0)((?:86)\\\\d{10})$": { "description": "National-VM", "prefix": "+41" }, { "description": "Notfall VS", "prefix": "+4198","suffix": "27"}, "(?:^\\\\+|^00|^000|^0000)([1-9][1-9]\\\\d*)$": { "description": "CH-International","prefix": "+" }}' }
                },
		populateDropdown: function(dropdown, _selected) {
			var self = this, selected = _selected;

			$.each(self.list, function(i, data) {
				if(selected == data.regiodialplan) {
					dropdown.append("<option value='" + data.regiodialplan + "' SELECTED>'" + data.country + ' - ' + data.region  + '</option>');
				}
				else {
					dropdown.append("'<option value='" + data.regiodialplan + "'>" + data.country + ' - ' + data.region  + '</option>');
				}
			});
                }
        };
	return regionaldialplan;
});
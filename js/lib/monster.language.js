define(function(require) {

	var $ = require("jquery"),
		_ = require("underscore"),
		monster = require("monster");

	var language = {
	list: {
		"de-DE": {iso: "de-DE", long: "Deutsch (Deutschland)", shortformat: 'DD.MM.year', longformat: 'DD.MM.year - hh:mm:ss', longtimeformat: 'hh:mm:ss', timeformat: '24h' },
		"en-US": {iso: "en-US", long: "English (American)", shortformat: 'MM/DD/year', longformat: 'MM/DD/year - hh:mm:ss12h', longtimeformat: 'hh:mm:ss12h', timeformat: '12h' },
		"it-IT": {iso: "it-IT", long: "Italian (Italy)", shortformat: 'DD/MM/year', longformat: 'DD/MM/year - hh:mm', longtimeformat: 'hh:mm:ss', timeformat: '24h' },
		"fr-FR": {iso: "fr-FR", long: "French (French)", shortformat: 'DD/MM/year', longformat: 'DD/MM/year - hh:mm', longtimeformat: 'hh:mm:ss', timeformat: '24h' },
		"ro-RO": {iso: "ro-RO", long: "Romania (Romania)", shortformat: 'DD/MM/year', longformat: 'DD/MM/year - hh:mm', longtimeformat: 'hh:mm:ss', timeformat: '24h' },
		"ru-RU": {iso: "ru-RU", long: "Russian (Russian)", shortformat: 'DD/MM/year', longformat: 'DD/MM/year - hh:mm', longtimeformat: 'hh:mm:ss', timeformat: '24h' }
        },

		populateDropdown: function(dropdown, _selected) {
			var self = this, selected = _selected;

			$.each(self.list, function(i, data) {
				if(selected == data.iso) {
					dropdown.append('<option value="' + data.iso + '" SELECTED>' + data.long + '</option>');
				}
				else {
					dropdown.append('<option value="' + data.iso + '">' + data.long + '</option>');
				}
			});
		},

                getSelectedFormatArray: function(iso) {
                        if(this.list[iso] !== 'undefined') return this.list[iso];
                        else return this.list['de-DE'];
                }
        };
	return language;
});
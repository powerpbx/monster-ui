define(function(require) {

	var $ = require("jquery"),
		_ = require("underscore"),
		monster = require("monster");

	var ttsvoice = {
			list: {
                                    "femaleenUS": { voice: "female/en-US", trans: "Englisch UR" },
                                    "femalezhCN": { voice: "female/zh-CN", trans: "Chinese CN" },
                                    "femalejaJP": { voice: "female/ja-JP", trans: "Japanese JP" },
                                    "femalekoKR": { voice: "female/ko-KR", trans: "Korean KR" },
                                    "femaledaDK": { voice: "female/da-DK", trans: "Denmark DK" },
                                    "femaledeDE": { voice: "female/de-DE", trans: "Deutsch DE" },
                                    "femalecaES": { voice: "female/ca-ES", trans: "Espanol ES" },
                                    "femalefiFI": { voice: "female/fi-FI", trans: "Finish FI" },
                                    "femalefrFR": { voice: "female/fr-FR", trans: "Frances FR" },
                                    "femaleitIT": { voice: "female/it-IT", trans: "Italiano IT" },
                                    "femalenbNO": { voice: "female/nb-NO", trans: "Norwegian NO" },
                                    "femalenlNL": { voice: "female/nl-NL", trans: "Nederland NL" },
                                    "femaleplPL": { voice: "female/pl-PL", trans: "Polish PL" },
                                    "femaleptBR": { voice: "female/pt-BR", trans: "Portugese BR" },
                                    "femaleptPT": { voice: "female/pt-PT", trans: "Portugese PT" },
                                    "femaleruRU": { voice: "female/ru-RU", trans: "Russian RU" },
                                    "femalesvSE": { voice: "female/sv-SE", trans: "Swedish SE" },
                                    "femalehuHU": { voice: "female/hu-HU", trans: "Hungary HU" },
                                    "femalecsCZ": { voice: "female/cs-CZ", trans: "Czechian CS" },
                                    "femaletrTR": { voice: "female/tr-TR", trans: "Turcian TR" }
                },
		populateDropdown: function(dropdown, _selected) {
			var self = this, selected = _selected;

			$.each(self.list, function(i, data) {
				if(selected == data.voice) {
					dropdown.append('<option value="' + data.voice + '" SELECTED>' + data.trans + '</option>');
				}
				else {
					dropdown.append('<option value="' + data.voice + '">' + data.trans + '</option>');
				}
			});
                }
        };
	return ttsvoice;
});
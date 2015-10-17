define(function(require){
	var $ = require('jquery'),
		_ = require('underscore'),
		monster = require('monster'),
		toastr = require('toastr');

	var numberRegextern = {

		requests: {
		},

		subscribe: {
			'common.numberRegextern.renderPopup': 'numberRegexternEdit'
		},

		numberRegexternEdit: function(args) {
			var self = this;

                        if(monster.apps.auth.isReseller == true && monster.apps.auth.currentUser.priv_level === "admin") {
				self.numberRegexternResellerGetNumber(args.phoneNumber, function(dataNumber) {
				self.numberRegexternRenderReseller(dataNumber.data, args.callbacks);
                                });
                        } else {
				self.numberRegexternGetNumber(args.phoneNumber, function(dataNumber) {
				self.numberRegexternRender(dataNumber.data, args.callbacks);
                                });
			};
		},

		numberRegexternRenderReseller: function(dataNumber, callbacks) {
			var self = this;
				popup_html = $(monster.template(self, 'numberRegextern-reseller-layout', dataNumber || {})),

			popup_html.find('.save').on('click', function(ev) {
				ev.preventDefault();
				var regexternFormData = monster.ui.getFormData('number_regextern');
				regexternFormData.regextern.enabled = (regexternFormData.name && regexternFormData.regextern.name.length > 0) ? true : false,
				regexternFormData.regextern.pvt_modified = parseInt(Number(62167219200) + parseInt(Date.now())/1000),
				regexternFormData.regextern.pvt_changed = dataNumber.regextern.pvt_changed,
				regexternFormData.regextern.pvt_number_state = dataNumber.regextern.pvt_number_state,
				regexternFormData.regextern.reged_state = dataNumber.regextern.reged_state,
				regexternFormData.regextern.reged_status = dataNumber.regextern.reged_status;
				if(regexternFormData.force_outbound == false) regexternFormData.force_outbound = true; else regexternFormData.force_outbound = false;
				if(regexternFormData.pvt_module_name == false) regexternFormData.pvt_module_name = "wnm_other"; else regexternFormData.pvt_module_name = "wnm_local";

				self.numberRegexternUpdateNumber(dataNumber.id, regexternFormData,
					function(data) {
						var phoneNumber = monster.util.formatPhoneNumber(data.data.id),
							template = monster.template(self, '!' + self.i18n.active().regextern.successUpdate, { phoneNumber: phoneNumber });

						toastr.success(template);

						popup.dialog('destroy').remove();

						callbacks.success && callbacks.success(data);
					},
					function(data) {
						callbacks.error && callbacks.error(data);
					}
				);

			});

			popup_html.find('.cancel-link').on('click', function(e) {
				e.preventDefault();
				popup.dialog('destroy').remove();
			});

			popup = monster.ui.dialog(popup_html, {
				title: self.i18n.active().regextern.dialogTitle
			});
		},

		numberRegexternResellerGetNumber: function(phoneNumber, success, error) {
			var self = this;

			self.callApi({
				resource: 'numbers.get',
				data: {
					accountId: self.accountId,
					phoneNumber: encodeURIComponent(phoneNumber)
				},
				success: function(_data, status) {
					success && success(_data);
				},
				error: function(_data, status) {
					error && error(_data);
				}
			});
		},

		numberRegexternRender: function(dataNumber, callbacks) {
			var self = this,
				popup_html = $(monster.template(self, 'numberRegextern-layout', dataNumber.regextern || {})),
				popup;

			popup_html.find('.save').on('click', function(ev) {
				ev.preventDefault();
				var regexternFormData = monster.ui.getFormData('number_regextern');
				regexternFormData.enabled = (regexternFormData.name && regexternFormData.name.length > 0) ? true : false;
				regexternFormData.pvt_modified = parseInt(Number(62167219200) + parseInt(Date.now())/1000);

				$.extend(true, dataNumber, { regextern: regexternFormData });

				self.numberRegexternUpdateNumber(dataNumber.id, dataNumber,
					function(data) {
						var phoneNumber = monster.util.formatPhoneNumber(data.data.id),
							template = monster.template(self, '!' + self.i18n.active().regextern.successUpdate, { phoneNumber: phoneNumber });

						toastr.success(template);

						popup.dialog('destroy').remove();

						callbacks.success && callbacks.success(data);
					},
					function(data) {
						callbacks.error && callbacks.error(data);
					}
				);

			});

			popup_html.find('.cancel-link').on('click', function(e) {
				e.preventDefault();
				popup.dialog('destroy').remove();
			});

			popup = monster.ui.dialog(popup_html, {
				title: self.i18n.active().regextern.dialogTitle
			});
		},

		numberRegexternGetNumber: function(phoneNumber, success, error) {
			var self = this;

			self.callApi({
				resource: 'numbers.get',
				data: {
					accountId: self.accountId,
					phoneNumber: encodeURIComponent(phoneNumber)
				},
				success: function(_data, status) {
					success && success(_data);
				},
				error: function(_data, status) {
					error && error(_data);
				}
			});
		},

		numberRegexternUpdateNumber: function(phoneNumber, data, success, error) {
			var self = this;

			self.callApi({
				resource: 'numbers.update',
				data: {
					accountId: self.accountId,
					phoneNumber: encodeURIComponent(phoneNumber),
					data: data
				},
				success: function(_data, status) {
					success && success(_data);
				},
				error: function(_data, status) {
					error && error(_data);
				}
			});
		}
	};

	return numberRegextern;
});

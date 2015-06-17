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
			var self = this,
				popup_html = $(monster.template(self, 'numberRegextern-reseller-layout', dataNumber.regextern || {})),
				popup;

			popup_html.find('.save').on('click', function(ev) {
				ev.preventDefault();
				var regexternFormData = monster.ui.getFormData('number_regextern');
				regexternFormData.enabled = (regexternFormData.name && regexternFormData.name.length > 0) ? true : false;

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

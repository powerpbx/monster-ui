define(function(require){
	var $ = require('jquery'),
		_ = require('underscore'),
		monster = require('monster');

	var servicePlanDetails = {

		requests: {},

		subscribe: {
			'common.servicePlanDetails.render': 'servicePlanDetailsRender'
		},

		/* Arguments:
		** container: jQuery Div
		** servicePlan: servicePlanId or servicePlan data
		** useOwnPlans: if true, get the plan details from the account own plans, instead of its reseller's ones
		** callback: callback executed once we rendered the number control
		*/
		servicePlanDetailsRender: function(args) {
			var self = this,
				container = args.container,
				servicePlan = args.servicePlan || null,
				useOwnPlans = args.useOwnPlans || false,
				callback = args.callback;

			if(container) {
				if(typeof servicePlan === 'string') {
					self.callApi({
						resource: useOwnPlans ? 'servicePlan.get' : 'servicePlan.getAvailable',
						data: {
							accountId: self.accountId,
							planId: servicePlan
						},
						success: function(data, status) {
							self.renderServicePlanDetails(container, data.data, callback);
						}
					});
				} else {
					self.renderServicePlanDetails(container, servicePlan, callback);
				}
			} else {
				throw "You must provide a container!";
			}
		},

		renderServicePlanDetails: function(container, servicePlanData, callback) {

			var self = this;

				// for i18n create new object with translated names
				var  foo = { a: 1 }; var servicePlani18n = Object.create(foo);
				for (var property in servicePlanData.plan){
					if(self.i18n.active().servicePlanDetails.planLines[property]) {
						servicePlani18n[self.i18n.active().servicePlanDetails.planLines[property]] = servicePlanData.plan[property];
						for (var property_in in servicePlanData.plan[property]) {
							if(self.i18n.active().servicePlanDetails[servicePlanData.plan[property][property_in].name]) {
								servicePlani18n[self.i18n.active().servicePlanDetails.planLines[property]][property_in].name = self.i18n.active().servicePlanDetails[servicePlanData.plan[property][property_in].name];
								if(typeof servicePlanData.plan[property][property_in].expections === Array) {

									for (var i = 0 ;i > servicePlanData.plan[property][property_in].expections.length; i++) {
										if(self.i18n.active().servicePlanDetails[servicePlanData.plan[property][property_in].expections[i]]) {
											servicePlani18n[self.i18n.active().servicePlanDetails.planLines[property]][property_in].expections[i] = self.i18n.active().servicePlanDetails[servicePlanData.plan[property][property_in].expections[i]];
										}
									}
								}
							}
						};

					}
				};

				template = $(monster.template(self, 'servicePlanDetails-layout', {
					servicePlan: servicePlanData,
					servicePlani18n: servicePlani18n
				}));

			template.find('[data-toggle="tooltip"]').tooltip();

			container.empty().append(template);

			callback && callback({
				template: template,
				data: servicePlanData
			});
		}
	}

	return servicePlanDetails;
});

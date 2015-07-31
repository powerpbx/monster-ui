define(["require", "jquery", "underscore", "fileupload", "monster", "timepicker", "toastr"], function(e) {
    var t = e("jquery"),
        n = e("underscore"),
        r = e("fileupload"),
        i = e("monster"),
        s = e("timepicker"),
        o = e("toastr"),
        u = {
            requests: {
                "common.numbers.metadata": {
                    apiRoot: "https://kazoo.allip.ovh/number_manager/api/index.php/",
                    url: "numbers/{country}/meta",
                    verb: "POST"
                }
            },
            subscribe: {
                "common.port.render": "portRender"
            },
            isLaunchedInAppMode: !0,
            states: [{
                value: "unconfirmed",
                next: [1]
            }, {
                value: "submitted",
                next: [2, 4]
            }, {
                value: "pending",
                next: [3, 4, 5]
            }, {
                value: "scheduled",
                next: [4, 5]
            }, {
                value: "rejected",
                next: [1, 5]
            }, {
                value: "completed",
                next: []
            }],
            portRender: function(e) {
                var t = this,
                    e = e || {},
                    n = e.accountId || t.accountId,
                    r = {
                        width: "940px",
                        position: ["center", 20],
                        title: t.i18n.active().port.dialogTitle,
                        autoOpen: !1,
                        dialogClass: "port-container-dialog"
                    },
                    s = e.hasOwnProperty("parent") ? e.parent : i.ui.dialog("", r);
                e.hasOwnProperty("accountId") && (t.isLaunchedInAppMode = !1), t.portRenderPendingOrder(s, n)
            },
            portRenderPendingOrder: function(e, t) {
                var n = this;
                e.empty(), n.portListRequests(t, function(r) {
                    var s = function(t) {
                            return t = t.filter(function(e) {
                                return e.port_requests.length > 0
                            }), t.forEach(function(e, t) {
                                e.port_requests.sort(function(e, t) {
                                    return e.updated < t.updated ? 1 : -1
                                })
                            }), t
                        },
                        o = i.template(n, "port-pendingOrders", {
                            data: s(r),
                            isAdmin: i.apps.auth.originalAccount.superduper_admin
                        });
                    e.append(o), e.hasClass("ui-dialog-content") && e.dialog("open"), n.portRenderDynamicCells(e, {
                        data: r
                    }), n.portBindPendingOrderEvents(e, t, r)
                })
            },
            portBindPendingOrderEvents: function(e, n, r) {
                var s = this,
                    u = e.find("#orders_list");
                s.portPositionDialogBox(), u.find("span.pull-right a").on("click", function() {
                    s.portRenderAddNumber(e, n)
                }), u.find(".account-header").on("click", function() {
                    var e = t(this).parents(".account-section");
                    e.hasClass("active") ? e.find(".requests-wrapper").slideUp(function() {
                        e.find(".left-part i").removeClass("fa-chevron-down monster-white").addClass("fa-chevron-right"), e.removeClass("active")
                    }) : (e.addClass("animate"), e.find(".requests-wrapper").slideDown(function() {
                        e.find(".left-part i").removeClass("fa-chevron-right").addClass("fa-chevron-down monster-white"), e.removeClass("animate"), e.addClass("active")
                    }))
                }), u.find(".request-box .request-state").on("change", ".switch-state", function(n) {
                    var i = t(this),
                        a = i.parents(".request-box"),
                        f = a.data("account_id"),
                        l = a.data("id"),
                        c = i.val(),
                        h;
                    for (var p = 0, d = r.length; p < d; p++)
                        if (r[p].account_id === f)
                            for (var v = 0, d = r[p].port_requests.length; v < d; v++) r[p].port_requests[v].id === l && (h = r[p].port_requests[v]);
                    c === "rejected" ? (delete h.scheduled_date, s.portRequestChangeState(f, l, c, function(e) {
                        delete e.scheduled_date, s.portRequestUpdate(f, l, e, function(e) {
                            h = e, s.portRenderDynamicCells(u, {
                                state: c,
                                request: h,
                                portRequestId: l
                            }), o.success(s.i18n.active().port.toastr.success.request.update)
                        })
                    })) : c === "scheduled" ? s.portRenderScheduledDatePopup(e, {
                        callbackSave: function(e) {
                            s.portRequestChangeState(f, l, c, function(t) {
                                t.scheduled_date = e, s.portRequestUpdate(f, l, t, function(e) {
                                    h = e, s.portRenderDynamicCells(u, {
                                        state: h.port_state,
                                        request: h,
                                        portRequestId: l
                                    }), o.success(s.i18n.active().port.toastr.success.request.update)
                                })
                            }, function() {
                                o.error(s.i18n.active().port.toastr.error.request.update)
                            })
                        },
                        callbackCancel: function() {
                            s.portRenderDynamicCells(u, {
                                state: h.port_state,
                                request: h,
                                portRequestId: l
                            })
                        }
                    }) : s.portRequestChangeState(f, l, c, function(e) {
                        h = e, s.portRenderDynamicCells(u, {
                            state: h.port_state,
                            request: h,
                            portRequestId: l
                        }), a.find(".continue-request, .delete-request").remove(), o.success(s.i18n.active().port.toastr.success.request.update)
                    }, function() {
                        o.error(s.i18n.active().port.toastr.error.request.update)
                    }, function() {
                        s.portRenderDynamicCells(u, {
                            state: h.port_state,
                            request: h,
                            portRequestId: l
                        })
                    })
                }), u.find(".request-box .scheduled-date").on("click", ".edit", function() {
                    var n = t(this),
                        o = n.parents(".request-box").data("account_id"),
                        u = n.parents(".request-box").data("id"),
                        a, f;
                    for (var l = 0, c = r.length; l < c; l++)
                        if (r[l].account_id === o) {
                            for (var h = 0, c2 = r[l].port_requests.length; h < c2; h++)
                                if (r[l].port_requests[h].id === u) {
                                    a = r[l].port_requests[h], a.hasOwnProperty("scheduled_date") && (f = a.scheduled_date);
                                    break
                                }
                            break
                        }
                    s.portRenderScheduledDatePopup(e, {
                        scheduledDate: f,
                        callbackSave: function(e) {
                            t.extend(!0, a, {
                                scheduled_date: e
                            }), s.portRequestUpdate(o, u, a, function(e) {
                                a = e, n.text(i.util.toFriendlyDate(i.util.gregorianToDate(a.scheduled_date), "short"))
                            })
                        }
                    })
                }), u.find(".request-box .actions li").on("click", function() {
                    var r = t(this),
                        u = r.parents(".request-box").data("id");
                    s.portRequestGet(n, u, function(t) {
                        if (r.hasClass("continue-request")) {
                            var a = i.template(s, "port-submitDocuments", t),
                                f = {
                                    orders: [t]
                                };
                            e.empty().append(a), s.portRenderSubmitDocuments(e, n, f)
                        } else if (r.hasClass("info-request")) {
                            var a = i.template(s, "port-requestInfo", t),
                                l = {
                                    width: "560px",
                                    position: ["center", 20],
                                    title: s.i18n.active().port.infoPopup.title
                                };
                            i.ui.dialog(a, l)
                        } else r.hasClass("delete-request") ? s.portRequestDelete(n, u, function() {
                            r.parents(".request-box").remove(), o.success(s.i18n.active().port.toastr.success.request.delete)
                        }) : r.hasClass("comments-request") && s.portRenderComments(e, n, u)
                    })
                }), u.find(".filter-options .btn-group .btn:first-child").addClass("active"), u.find(".filter-options .btn-group:first-child .btn").on("click", function() {
                    var e = t(this),
                        n = u.find(".accounts-list > .requests-wrapper"),
                        r = n.hasClass("empty"),
                        i = u.find(".account-section"),
                        s = e.data("value");
                    if (s === "accounts") {
                        if (!e.hasClass("active") && !r) {
                            var o = {};
                            e.siblings().removeClass("active"), e.addClass("active"), n.addClass("empty"), n.find(".request-box").each(function(e, n) {
                                var n = t(n),
                                    r = n.data("account_id");
                                o.hasOwnProperty(r) ? o[r].push(n) : o[r] = [n], u.find('.account-section[data-id="' + r + '"] .requests-wrapper').append(n)
                            });
                            for (var a in o) u.find('.account-section[data-id="' + a + '"] .requests-wrapper').append(o[a].sort(function(e, n) {
                                return t(e).data("updated_date") < n.data("updated_date") ? 1 : -1
                            }))
                        }
                        i.fadeIn(400)
                    } else s === "requests" && !e.hasClass("active") && r && (e.siblings().removeClass("active"), e.addClass("active"), i.fadeOut(400, function() {
                        n.append(u.find(".request-box").sort(function(e, n) {
                            return t(e).data("updated_date") < t(n).data("updated_date") ? 1 : -1
                        })), n.removeClass("empty")
                    }))
                }), u.find(".filter-options .btn-group:last-child .btn").on("click", function() {
                    var e = t(this),
                        n = e.parent(),
                        r = n.find(".btn:first-child"),
                        i = [];
                    if (e.data("value") === "all") e.hasClass("active") || (n.find(".btn.active").removeClass("active"), e.addClass("active"));
                    else {
                        var s = !0;
                        r.hasClass("active") && r.removeClass("active"), e.toggleClass("active"), n.find(".btn").hasClass("active") || r.addClass("active"), n.find(".btn:not(:first-child)").each(function(e, n) {
                            if (!t(n).hasClass("active")) return s = !1, !1
                        }), s && (n.find(".btn.active").removeClass("active"), r.addClass("active"))
                    }
                    n.find(".btn.active").each(function(e, n) {
                        i.push(t(n).data("value"))
                    }), i.indexOf("all") > -1 ? u.find(".request-box").removeClass("hide").fadeIn() : u.find(".request-box").each(function(e, n) {
                        var n = t(n);
                        i.indexOf(n.data("state")) > -1 ? n.removeClass("hide").fadeIn() : n.fadeOut(400, function() {
                            n.addClass("hide")
                        })
                    })
                })
            },
            portRenderScheduledDatePopup: function(e, n) {
                var r = this,
                    s = n.hasOwnProperty("scheduledDate") ? {
                        scheduledDate: n.scheduledDate
                    } : {};
                template = t(i.template(r, "port-editScheduledDate", s)), popup = i.ui.dialog(template, {
                    title: r.i18n.active().port.pendingOrders.scheduledDatePopup.title
                }), r.portBindScheduledDatePopupEvents(e, popup, n)
            },
            portBindScheduledDatePopupEvents: function(e, n, r) {
                var s = this;
                i.ui.datepicker(n.find("#scheduled_date"), {
                    minDate: new Date,
                    beforeShowDay: t.datepicker.noWeekends
                }), n.find(".save-link").on("click", function() {
                    var e = i.util.dateToGregorian(n.find("#scheduled_date").datepicker("getDate"));
                    n.dialog("close"), r.hasOwnProperty("callbackSave") && r.callbackSave(e)
                }), n.find(".cancel-link").on("click", function() {
                    n.dialog("close"), r.hasOwnProperty("callbackCancel") && r.callbackCancel()
                })
            },
            portRenderComments: function(e, r, s) {
                var o = this;
                o.portRequestGet(r, s, function(e) {
                    var s = t(i.template(o, "port-commentsPopup", {
                            isAdmin: i.apps.auth.originalAccount.superduper_admin
                        })),
                        u = e.hasOwnProperty("comments") ? e.comments : [],
                        a = function() {
                            var t = {
                                    width: "960px",
                                    position: ["center", 20],
                                    title: o.i18n.active().port.commentsPopup.title
                                },
                                n = i.ui.dialog(s, t);
                            o.portBindCommentsEvents(n, r, e, u)
                        };
                    n.isEmpty(u) ? (s.find(".comments").hide(), a()) : o.portRequestListUsers(r, function(e) {
                        e = function(t) {
                            var n = {};
                            return t.forEach(function(e, t) {
                                n[e.id] = e.first_name.concat(" ", e.last_name)
                            }), n
                        }(e), u.forEach(function(t, n) {
                            t.author = e[t.user_id], t.isAdmin = i.apps.auth.originalAccount.superduper_admin;
                            if (t.superduper_comment ? i.apps.auth.originalAccount.superduper_admin : !0) s.find(".comments").append(i.template(o, "port-comment", t)), s.find(".comments .comment:last-child .comment-body").html(t.content)
                        }), a()
                    })
                })
            },
            portBindCommentsEvents: function(e, r, s, u) {
                var a = this;
                i.ui.wysiwyg(e.find(".wysiwyg-container")), e.find(".comments").on("click", ".delete-comment", function() {
                    var f = t(this),
                        l = f.parents(".comment"),
                        c = f.data("id");
                    i.ui.confirm(a.i18n.active().port.infoPopup.confirm.deleteComment, function() {
                        u.forEach(function(e, t, n) {
                            e.timestamp === c && u.splice(t, 1)
                        }), s.comments = u, a.portRequestUpdate(r, s.id, s, function(r) {
                            l.fadeOut("400", function() {
                                t(this).remove(), n.isEmpty(r.comments) && e.find(".comments").slideUp(), o.success(a.i18n.active().port.toastr.success.comment.delete)
                            })
                        })
                    })
                }), e.find(".actions .btn-success").on("click", function() {
                    var n = i.apps.auth.currentUser,
                        o = {
                            user_id: a.userId,
                            timestamp: i.util.dateToGregorian(new Date),
                            content: e.find(".wysiwyg-editor").html(),
                            superduper_comment: e.find("#superduper_comment").is(":checked")
                        };
                    u.push(o), s.comments = u, a.portRequestUpdate(r, s.id, s, function() {
                        o.author = n.first_name.concat(" ", n.last_name), o.isAdmin = i.apps.auth.originalAccount.superduper_admin, e.find(".comments").show().append(t(i.template(a, "port-comment", o))), e.find(".comments .comment:last-child .comment-body").html(o.content), e.find(".comments").animate({
                            scrollTop: e.find(".comments").scrollTop() + e.find(".comments .comment:last-child").position().top
                        }, 300, function() {
                            i.ui.highlight(t(this).find(".comment:last-child"))
                        }), e.find(".wysiwyg-editor").empty()
                    })
                })
            },
            portRenderAddNumber: function(e, t) {
                var n = this,
                    r = i.template(n, "port-addNumbers");
                e.empty().append(r), n.portBindAddNumberEvents(e, t)
            },
            portBindAddNumberEvents: function(e, t) {
                var n = this,
                    r = e.find("div#add_numbers");
                n.portPositionDialogBox(), n.portComingSoon(r, [".help-links li:not(.separator) a"]), r.find("#add_numbers_link").on("click", function() {
                    var i = r.find("input").val().split(" ");
                    i = i.filter(function(e, t) {
                        if (e && /(^1[0-9]{10}$)|(^[0-9]{10}$)/.test(e)) return e
                    }), i.length === 0 ? (o.error(n.i18n.active().port.toastr.error.number), r.find("div.row-fluid").addClass("error")) : n.portFormatNumbers(i, function(i) {
                        i.orders.length > 0 ? (r.find("div.row-fluid").removeClass("error"), r.find("#numbers_list")[0].value = "", r.find("button").unbind("click"), n.portRenderManagerOrders(e, t, i)) : r.find("#numbers_list")[0].value = ""
                    })
                })
            },
            portRenderManagerOrders: function(e, n, r) {
                var s = this,
                    o = t(i.template(s, "port-manageOrders", r));
                o.insertAfter(e.find("#add_numbers")), s.portBindManageOrdersEvents(e, n, r)
            },
            portBindManageOrdersEvents: function(e, n, r) {
                var s = this,
                    u = e.find("#port_container");
                s.portPositionDialogBox(), s.portCancelOrder(e, n, u), s.portComingSoon(u, ["#footer .help-links li:not(.separator) a"]), u.on("click", "#add_numbers_link", function() {
                    var e = u.find("div#add_numbers").find("input").val().split(" ");
                    e = e.filter(function(e, t) {
                        if (e && /(^1[0-9]{10}$)|(^[0-9]{10}$)/.test(e)) return e
                    }), e.length === 0 ? (o.error(s.i18n.active().port.toastr.error.number), u.find("div#add_numbers").find("div.row-fluid").addClass("error")) : s.portFormatNumbers(e, function(e) {
                        u.find("#numbers_list")[0].value = "", u.find("div#add_numbers").find("div.row-fluid").removeClass("error");
                        for (var n in e.orders) u.find("#manage_orders").find("div.order").each(function(r, i) {
                            var s = t(i).data("carrier");
                            if (s == e.orders[n].carrier) {
                                for (var o in e.orders[n].numbers) t(this).find("ul").append('<li data-value="' + e.orders[n].numbers[o] + '" data-carrier="' + s + '"><i class="fa fa-exclamation-triangle"></i>' + e.orders[n].numbers[o] + '<i class="fa fa-times-circle pull-right"></i></li>');
                                e.orders.splice(n, 1)
                            }
                        }), e.orders.length != 0 && u.find("div#manage_orders").find("div.row-fluid:last-child").append(t(i.template(s, "port-order", e.orders[n])))
                    })
                }), u.on("click", "#manage_orders li .remove-number", function() {
                    var r = t(this),
                        i = r.parent().parent();
                    r.parent().remove(), i.is(":empty") && i.parent().parent().remove(), u.find("div#manage_orders").find(".row-fluid:last-child").is(":empty") && (u.find("div#manage_orders").find(".row-fluid:last-child").animate({
                        height: "0px"
                    }, 500), s.portRenderAddNumber(e, n))
                }), u.find("#manage_orders_next_link").on("click", function() {
                    var o = u.find("#eula form");
                    i.ui.validate(o, {
                        messages: {
                            "conditions[]": {
                                required: s.i18n.active().port.requiredConditions,
                                minlength: s.i18n.active().port.requiredConditions
                            }
                        },
                        errorPlacement: function(e, t) {
                            e.insertAfter(u.find("#eula form .control-group:last-child"))
                        }
                    });
                    if (i.ui.valid(o)) {
                        var a = {
                            orders: []
                        };
                        u.find("div#manage_orders").find("div.order").each(function() {
                            var e = t(this),
                                n = {},
                                r = [];
                            t.each(e.find("li"), function(e, n) {
                                r.push(t(n).data("value"))
                            }), n.carrier = e.find("li:first-child").data("carrier"), n.numbers = r, a.orders.push(n)
                        }), r.orders.forEach(function(e, n) {
                            for (var r = 0, i = a.orders.length; r < i; r++)
                                if (a.orders[r].carrier === e.carrier) {
                                    t.extend(!0, a.orders[r], e);
                                    break
                                }
                        }), s[a.orders.length === 1 ? "portRenderSubmitDocuments" : "portRenderResumeOrders"](e, n, a)
                    } else u.find("div#eula").find("input").each(function() {
                        t(this).is(":checked") ? t(this).parents(".control-group").removeClass("error") : t(this).parents(".control-group").addClass("error")
                    })
                })
            },
            portRenderResumeOrders: function(e, n, r) {
                var s = this,
                    o = t(i.template(s, "port-resumeOrders", r));
                t.each(o.find(".row-fluid"), function(e, n) {
                    n = t(n), n.find(".order-key").text((parseInt(n.find(".order-key").text(), 10) + 1).toString())
                }), e.empty().append(o), s.portBindResumeOrdersEvents(e, n, r)
            },
            portBindResumeOrdersEvents: function(e, n, r) {
                var i = this,
                    s = e.find("#resume_orders");
                i.portPositionDialogBox(), s.find(".resume-order-btn").on("click", function() {
                    var s = t(this).data("index");
                    i.portRenderSubmitDocuments(e, n, r, s)
                })
            },
            portRenderSubmitDocuments: function(e, n, r, s) {
                var o = this,
                    s = s || 0,
                    u = t(i.template(o, "port-submitDocuments", r.orders[s]));
                e.empty().append(u), o.portBindSubmitDocumentsEvents(e, n, r, s)
            },
            portBindSubmitDocumentsEvents: function(e, n, r, s) {
                var u = this,
                    a = e.find("#port_container");
                u.portPositionDialogBox(), u.portCancelOrder(e, n, a, r, s), u.portComingSoon(a, ["#upload_bill .row-fluid.info a", "#loa h4 a", "#loa p a:not(#sign_doc)", "#footer .help-links li:not(.separator) a"]), a.find(".file-upload-container input").each(function(e, i) {
                    var a = t(i),
                        f = a.data("name"),
                        l = {
                            btnText: u.i18n.active().port.submitDocuments.changeButton,
                            mimeTypes: ["application/pdf"],
                            wrapperClass: "input-append",
                            success: function(e) {
                                r.orders[s].hasOwnProperty("id") ? r.orders[s].hasOwnProperty(f.concat(".pdf")) ? u.portRequestUpdateAttachment(n, r.orders[s].id, f.concat(".pdf"), e[0].file, function() {
                                    r.orders[s][f.concat("_attachment")] = e[0].file
                                }) : u.portRequestAddAttachment(n, r.orders[s].id, f.concat(".pdf"), e[0].file, function() {
                                    r.orders[s][f.concat("_attachment")] = e[0].file
                                }) : r.orders[s][f.concat("_attachment")] = e[0].file
                            },
                            error: function(e) {
                                for (var t in e) e[t].length > 0 && o.error(u.i18n.active().port.toastr.error[t].concat(e[t].join(", ")))
                            }
                        };
                    r.orders[s].hasOwnProperty("uploads") && r.orders[s].uploads.hasOwnProperty(f.concat(".pdf")) && (l.filesList = [f.concat(".pdf")]), f === "bill" ? (l.bigBtnClass = "btn btn-success span12", l.bigBtnText = u.i18n.active().port.submitDocuments.uploadBillButton, l.btnClass = "btn btn-success") : f === "loa" && (l.bigBtnClass = "btn span10", l.bigBtnText = u.i18n.active().port.submitDocuments.loaUploadStep, l.btnClass = "btn"), a.fileUpload(l)
                }), a.find("#upload_bill .remove-number").on("click", function() {
                    var i = t(this).parent(),
                        o = i.parent(),
                        a = i.data("value"),
                        f = r.orders[s].numbers.indexOf(a);
                    f >= 0 && (r.orders[s].numbers.slice(f, 1), i.remove()), o.is(":empty") && (r.orders.length > 1 ? (r.orders.splice(s, 1), u.portRenderResumeOrders(e, n, r)) : u.portReloadApp(e, n))
                }), a.find("#submit_documents_add_numbers_link").on("click", function() {
                    e.empty().append(i.template(u, "port-addNumbers")), u.portRenderManagerOrders(e, n, r)
                }), a.find("#submit_documents_save_link").on("click", function() {
                    var o = a.find("#transfer_name_form");
                    i.ui.validate(o);
                    if (i.ui.valid(o)) {
                        var f = i.ui.getFormData("transfer_name_form", ".", !0),
                            l = i.ui.getFormData("bill_form", ".", !0);
                        t.extend(!0, r.orders[s], l, f), u.portSaveOrder(e, n, r, s)
                    } else a.find(".monster-invalid").length > 0 && t("html, body").animate({
                        scrollTop: a.find(".monster-invalid").first().offset().top - 10
                    }, 300)
                }), a.find("#submit_documents_next_link").on("click", function() {
                    var o = r.orders[s],
                        f = o.hasOwnProperty("bill_attachment") || o.hasOwnProperty("uploads") && o.uploads.hasOwnProperty("bill.pdf") ? !0 : !1,
                        l = o.hasOwnProperty("loa_attachment") || o.hasOwnProperty("uploads") && o.uploads.hasOwnProperty("loa.pdf") ? !0 : !1,
                        c = a.find("#transfer_name_form"),
                        h = a.find("#bill_form"),
                        p = !0;
                    i.ui.validate(c), i.ui.validate(h), i.ui.valid(c) || (p = !1), i.ui.valid(h) || (p = !1);
                    if (!f || !l) p = !1, i.ui.alert("error", u.i18n.active().port.toastr.error.submit.document);
                    if (p) {
                        var d = i.ui.getFormData("transfer_name_form"),
                            v = i.ui.getFormData("bill_form");
                        o.hasOwnProperty("id") && (delete o.bill_attachment, delete o.loa_attachment), t.extend(!0, o, v, d), u.portRenderConfirmOrder(e, n, r, s)
                    } else a.find(".monster-invalid").length > 0 && t("html, body").animate({
                        scrollTop: a.find(".monster-invalid").first().offset().top - 10
                    }, 300)
                })
            },
            portRenderConfirmOrder: function(e, n, r, s) {
                var o = this,
                    u = r.orders[s],
                    a = i.util.dateToGregorian(i.util.getBusinessDate(4)),
                    f = u.hasOwnProperty("created") ? u.created : a,
                    l = u.hasOwnProperty("transfer_date") ? u.transfer_date : a,
                    c = t.extend(!0, {}, u, {
                        total: u.numbers.length,
                        price: u.numbers.length * 5,
                        transfer_date: a - l >= 0 ? a : l,
                        created: f
                    }),
                    h = t(i.template(o, "port-confirmOrder", c));
                e.empty().append(h), o.portBindConfirmOrderEvents(e, n, r, s)
            },
            portBindConfirmOrderEvents: function(e, n, r, s) {
                var o = this,
                    u = e.find("#port_container"),
                    a = u.find("input.date-input"),
                    f = u.find("#have_temporary_numbers"),
                    l = r.orders[s];
                o.portPositionDialogBox(), o.portCancelOrder(e, n, u, r, s), o.portComingSoon(u, ["#footer .help-links li:not(.separator) a"]), i.ui.datepicker(a, {
                    minDate: i.util.getBusinessDate(4),
                    beforeShowDay: t.datepicker.noWeekends,
                    onSelect: function(e, t) {
                        var n = u.find("#transfer_schedule_date"),
                            r = n.css("color"),
                            i = 200;
                        n.animate({
                            color: n.css("backgroundColor")
                        }, i, function() {
                            n.text(e), n.animate({
                                color: r
                            }, i)
                        })
                    }
                }), u.find("#numbers_to_buy option").last().prop("selected", "selected"), l.hasOwnProperty("temporary_numbers") && l.temporary_numbers > 0 ? (f.prop("checked", !0), u.find("#temporary_numbers_form div.row-fluid:nth-child(2)").slideDown("400", function() {
                    u.find("#numbers_to_buy").val(l.temporary_numbers - 1).prop("disabled", !1)
                })) : (f.prop("checked", !1), u.find("#numbers_to_buy").prop("disabled", !0), u.find("#temporary_numbers_form div.row-fluid:nth-child(2)").slideUp("400")), f.on("change", function() {
                    var e = t(this);
                    e.prop("checked") ? u.find("#temporary_numbers_form div.row-fluid:nth-child(2)").slideDown("400", function() {
                        u.find("#numbers_to_buy").prop("disabled", !1)
                    }) : (u.find("#numbers_to_buy").prop("disabled", !0), u.find("#temporary_numbers_form div.row-fluid:nth-child(2)").slideUp("400"))
                }), u.find("#numbers_to_buy option").each(function(e, n) {
                    var r = t(n);
                    r.val(parseInt(r.val(), 10) + 1).text(r.val())
                }), u.find("confirm_order_save_link").on("click", function() {
                    var a = i.ui.getFormData("notification_email_form", ".", !0),
                        f = i.ui.getFormData("temporary_numbers_form"),
                        c = i.ui.getFormData("transfer_date_form");
                    t.extend(!0, l, a, c, f), l.transfer_date = i.util.dateToGregorian(new Date(l.transfer_date)), u.find("#have_temporary_numbers").prop("checked") || delete l.temporary_numbers, o.portSaveOrder(e, n, r, s)
                }), u.find("#confirm_order_add_numbers_link").on("click", function() {
                    e.empty().append(i.template(o, "port-addNumbers")), o.portRenderManagerOrders(e, n, r)
                }), u.find("#confirm_order_submit_link").on("click", function() {
                    var a = u.find("#notification_email_form");
                    i.ui.validate(a);
                    if (i.ui.valid(a)) {
                        var f = i.ui.getFormData("notification_email_form"),
                            c = i.ui.getFormData("temporary_numbers_form"),
                            h = i.ui.getFormData("transfer_date_form");
                        t.extend(!0, l, f, h, c), l.transfer_date = i.util.dateToGregorian(new Date(l.transfer_date)), u.find("#have_temporary_numbers").prop("checked") || delete l.temporary_numbers, l.hasOwnProperty("id") ? o.portRequestUpdate(n, l.id, l, function() {
                            l.hasOwnProperty("port_sate") ? o.portReloadApp(e, n) : o.portRequestChangeState(n, l.id, "submitted", function() {
                                o.portReloadApp(e, n)
                            })
                        }) : o.portRequestAdd(n, l, function(t) {
                            r.orders.splice(s, 1), o.portRequestChangeState(n, t, "submitted", function() {
                                r.orders.length > 0 ? o.portRenderResumeOrders(e, n, r) : o.portReloadApp(e, n)
                            }, function() {}, function() {
                                o.portRequestDelete(n, t)
                            })
                        })
                    } else u.find(".monster-invalid").length > 0 && t("html, body").animate({
                        scrollTop: u.find(".monster-invalid").first().offset().top - 10
                    }, 300)
                })
            },
            portListRequests: function(e, t) {
                var n = this;
                i.parallel({
                    requests: function(t) {
                        n.portRequestList(e, function(e) {
                            t(null, e)
                        })
                    },
                    descendants: function(t) {
                        n.isLaunchedInAppMode ? n.portRequestListByDescendants(e, function(e) {
                            t(null, e)
                        }) : t(null, [])
                    }
                }, function(n, r) {
                    var s = r.descendants.sort(function(e, t) {
                        return e.account_name.toLowerCase() > t.account_name.toLowerCase() ? 1 : -1
                    });
                    r.requests.length && s.unshift({
                        account_id: e,
                        account_name: i.apps.auth.currentAccount.name,
                        port_requests: r.requests
                    });
                    for (var o = 0, u = s.length; o < u; o++) s[o].amount = s[o].port_requests.length;
                    t(s)
                })
            },
            portRenderDynamicCells: function(e, r) {
                var s = this,
                    o = i.apps.auth.originalAccount.superduper_admin,
                    u = s.states,
                    a = r.data,
                    f = r.request,
                    l = function(e) {
                        var t = [];
                        for (var n = 0, r = u.length; n < r; n++)
                            if (e === u[n].value) {
                                var i = u[n].next;
                                i.forEach(function(e, n) {
                                    t.push(u[e])
                                }), t.unshift(u[n]);
                                break
                            }
                        return t
                    },
                    c = function(r, u, a) {
                        var f = e.find('.request-box[data-id="' + r + '"]'),
                            c = f.data("account_id"),
                            h = f.find(".scheduled-date"),
                            p = f.find(".request-state");
                        f.data("state", u), f.data("scheduled_date", a.hasOwnProperty("scheduled_date") ? a.scheduled_date : ""), f.data("updated_date", a.updated);
                        if (o)
                            if (u === "completed") p.empty().text(s.i18n.active().port.state[u]), h.empty();
                            else {
                                var d;
                                p.empty().append(t(i.template(s, "port-selectStates", {
                                    states: l(u)
                                }))), u === "scheduled" ? (a.hasOwnProperty("scheduled_date") && (d = {
                                    scheduledDate: a.scheduled_date
                                }), h.empty().append(t(i.template(s, "port-scheduledDateCell", d)))) : h.empty().text(s.i18n.active().port.noScheduledDate)
                            } else p.empty().text(s.i18n.active().port.state[u]), u === "scheduled" ? h.empty().text(i.util.toFriendlyDate(a.scheduled_date, "short")) : h.empty().text(s.i18n.active().port.noScheduledDate)
                    };
                for (var h in u) u[h].text = s.i18n.active().port.state[u[h].value];
                if (r.hasOwnProperty("portRequestId")) c(r.portRequestId, r.state, f);
                else
                    for (var p = 0, d = a.length; p < d; p++) n.each(a[p].port_requests, function(e) {
                        c(e.id, e.port_state, e)
                    })
            },
            portPositionDialogBox: function() {
                t("html, body").animate({
                    scrollTop: "0"
                }, 100), t("body").height() - (t(".ui-dialog").height() + 80) <= 0 ? t(".ui-dialog").animate({
                    top: "80"
                }, 200) : t(".ui-dialog").animate({
                    top: t("body").height() / 2 - t(".ui-dialog").height() / 2
                }, 200)
            },
            portObjectsToArray: function(e) {
                if (typeof e.length != "undefined")
                    for (var t in e) {
                        var n = new Array;
                        for (var r in e[t].numbers) n.push(r);
                        delete e[t].numbers, e[t].numbers = n
                    } else {
                        var n = new Array;
                        for (var r in e.numbers) n.push(r);
                        delete e.numbers, e.numbers = n
                    }
                return e
            },
            portArrayToObjects: function(e) {
                if (Array.isArray(e.numbers)) {
                    var t = e.numbers;
                    delete e.numbers, e.numbers = new Object;
                    for (var n in t) e.numbers[t[n]] = new Object
                }
                return e
            },
            portReloadApp: function(e, n) {
                var r = this,
                    i = {};
                e.hasClass("ui-dialog-content") ? (e.dialog("close"), i.accountId = n) : (e.empty(), i.parent = t("#monster-content")), r.portRender(i)
            },
            portComingSoon: function(e, t) {
                var n = this;
                t.forEach(function(t, r) {
                    e.find(t).on("click", function(e) {
                        e.preventDefault(), i.ui.alert(n.i18n.active().port.comingSoon)
                    })
                })
            },
            portFormatNumbers: function(e, t) {
                var n = this;
                i.request({
                    resource: "common.numbers.metadata",
                    data: {
                        data: e,
                        country: "US"
                    },
                    success: function(e) {
                        e = e.data;
                        var r = [],
                            i = {
                                orders: []
                            };
                        for (var s in e) {
                            if (e[s].company == null || e[s].company == "undefined" || e[s].company == "") e[s].company = n.i18n.active().port.unknownCarrier;
                            r.indexOf(e[s].company) === -1 && r.push(e[s].company)
                        }
                        for (var o in r) {
                            var u = [],
                                a = {};
                            for (var s in e) e[s].company == r[o] && u.push(s);
                            a.carrier = r[o], a.numbers = u, i.orders[o] = a
                        }
                        t(i)
                    }
                })
            },
            portSaveOrder: function(e, t, n, r) {
                var i = this,
                    s = n.orders[r].hasOwnProperty("id");
                s ? i.portRequestUpdate(t, n.orders[r].id, n.orders[r], function() {
                    i.portReloadApp(e, t)
                }) : i.portRequestAdd(t, n.orders[r], function() {
                    n.orders.length > 1 ? (n.orders.splice(r, 1), i.portRenderResumeOrders(e, t, n)) : i.portReloadApp(e, t)
                })
            },
            portCancelOrder: function(e, t, n, r, s) {
                var o = this,
                    r = r || undefined,
                    s = s || 0;
                n.find("div#footer").find("button.btn-danger").on("click", function() {
                    typeof r == "undefined" ? o.portReloadApp(e, t) : i.ui.confirm(o.i18n.active().port.cancelOrderPopup, function() {
                        r.orders[s].hasOwnProperty("id") ? o.portRequestDelete(t, r.orders[s].id, function() {
                            o.portReloadApp(e, t)
                        }) : r.orders.length > 1 ? (r.orders.splice(s, 1), o.portRenderResumeOrders(e, t, r)) : o.portReloadApp(e, t)
                    })
                })
            },
            portRequestAdd: function(e, n, r, i) {
                var s = this,
                    o = {};
                n.hasOwnProperty("bill_attachment") && (o.bill = n.bill_attachment, delete n.bill_attachment), n.hasOwnProperty("loa_attachment") && (o.loa = n.loa_attachment, delete n.loa_attachment), n = t.extend(!0, n, {
                    port_state: "unconfirmed"
                }), n = s.portArrayToObjects(n), s.callApi({
                    resource: "port.create",
                    data: {
                        accountId: e,
                        data: n
                    },
                    success: function(t, n) {
                        var i = t.data.id;
                        o.hasOwnProperty("bill") ? s.portRequestAddAttachment(e, i, "bill.pdf", o.bill, function(t) {
                            o.hasOwnProperty("loa") ? s.portRequestAddAttachment(e, i, "loa.pdf", o.loa, function(e) {
                                r && r(i)
                            }) : r && r(i)
                        }) : o.hasOwnProperty("loa") ? s.portRequestAddAttachment(e, i, "loa.pdf", o.loa, function(e) {
                            r && r(i)
                        }) : r && r(i)
                    },
                    error: function(e, t) {
                        i && i()
                    }
                })
            },
            portRequestUpdate: function(e, t, n, r, i) {
                var s = this;
                n = s.portArrayToObjects(n), n.hasOwnProperty("bill_attachment") && delete n.bill_attachment, n.hasOwnProperty("loa_attachment") && delete n.loa_attachment, s.callApi({
                    resource: "port.update",
                    data: {
                        accountId: e,
                        portRequestId: t,
                        data: n
                    },
                    success: function(e, t) {
                        r && r(e.data)
                    },
                    error: function(e, t) {
                        i && i()
                    }
                })
            },
            portRequestDelete: function(e, t, n, r) {
                var i = this;
                i.callApi({
                    resource: "port.delete",
                    data: {
                        accountId: e,
                        portRequestId: t,
                        data: {}
                    },
                    success: function(e, t) {
                        n && n()
                    },
                    error: function(e, t) {
                        r && r()
                    }
                })
            },
            portRequestList: function(e, t, n) {
                var r = this;
                r.callApi({
                    resource: "port.list",
                    data: {
                        accountId: e,
                        data: {}
                    },
                    success: function(e, n) {
                        t && t(r.portObjectsToArray(e.data))
                    },
                    error: function(e, t) {
                        n && n()
                    }
                })
            },
            portRequestListByDescendants: function(e, t, n) {
                var r = this;
                r.callApi({
                    resource: "port.listDescendants",
                    data: {
                        accountId: e,
                        filters: {
                            paginate: !1
                        }
                    },
                    success: function(e, n) {
                        var e = e.data;
                        for (var i in e) e[i].port_requests = r.portObjectsToArray(e[i].port_requests);
                        t && t(e)
                    },
                    error: function(e, t) {
                        n && n()
                    }
                })
            },
            portRequestGet: function(e, t, n, r) {
                var i = this;
                i.callApi({
                    resource: "port.get",
                    data: {
                        accountId: e,
                        portRequestId: t,
                        data: {}
                    },
                    success: function(e, t) {
                        n && n(i.portObjectsToArray(e.data))
                    },
                    error: function(e, t) {
                        r && r()
                    }
                })
            },
            portRequestGetDescendants: function(e, t, n) {
                var r = this;
                r.callApi({
                    resource: "port.listDescendants",
                    data: {
                        accountId: e,
                        data: {}
                    },
                    success: function(e, n) {
                        t && t(e.data)
                    },
                    error: function(e, t) {
                        n && n()
                    }
                })
            },
            portRequestListAttachments: function(e, t, n, r) {
                var i = this;
                i.callApi({
                    resource: "port.listAttachments",
                    data: {
                        accountId: e,
                        portRequestId: t,
                        data: {}
                    },
                    success: function(e, t) {
                        n && n(e.data)
                    },
                    error: function(e, t) {
                        r && r()
                    }
                })
            },
            portRequestAddAttachment: function(e, t, n, r, i, s) {
                var o = this;
                o.callApi({
                    resource: "port.createAttachment",
                    data: {
                        accountId: e,
                        portRequestId: t,
                        documentName: n,
                        data: r
                    },
                    success: function(e, t) {
                        i && i(e.data)
                    },
                    error: function(e, t) {
                        s && s()
                    }
                })
            },
            portRequestUpdateAttachment: function(e, t, n, r, i, s) {
                var o = this;
                o.callApi({
                    resource: "port.updateAttachment",
                    data: {
                        accountId: e,
                        portRequestId: t,
                        documentName: n,
                        data: r
                    },
                    success: function(e, t) {
                        i && i()
                    },
                    error: function(e, t) {
                        s && s()
                    }
                })
            },
            portRequestDeleteAttachment: function(e, t, n) {
                var r = this;
                r.callApi({
                    resource: "port.deleteAttachment",
                    data: {
                        accountId: e,
                        portRequestId: t,
                        documentName: n,
                        data: {}
                    },
                    success: function(e, t) {
                        callbackSuccess && callbackSuccess()
                    },
                    error: function(e, t) {
                        callbackError && callbackError()
                    }
                })
            },
            portRequestGetAttachment: function(e, t, n, r, i) {
                var s = this;
                s.callApi({
                    resource: "port.getAttachment",
                    data: {
                        accountId: e,
                        portRequestId: t,
                        documentName: n,
                        data: {}
                    },
                    success: function(e, t) {
                        r && r(e.data)
                    },
                    error: function(e, t) {
                        i && i()
                    }
                })
            },
            portRequestChangeState: function(e, t, n, r, i, s) {
                var o = this;
                o.callApi({
                    resource: "port.changeState",
                    data: {
                        accountId: e,
                        portRequestId: t,
                        state: n,
                        data: {}
                    },
                    success: function(e, t) {
                        r && r(e.data)
                    },
                    error: function(e, t) {
                        parseInt(e.error, 10) !== 402 && i && i()
                    },
                    onChargesCancelled: function() {
                        s && s()
                    }
                })
            },
            portRequestReadyState: function(e, t, n, r, i) {
                var s = this;
                n.port_state = "submitted", s.callApi({
                    resource: "port.update",
                    data: {
                        accountId: e,
                        portRequestId: t,
                        data: n
                    },
                    success: function(e, t) {
                        r && r()
                    },
                    error: function(e, t) {
                        i && i()
                    }
                })
            },
            portRequestListUsers: function(e, t, n) {
                var r = this;
                r.callApi({
                    resource: "user.list",
                    data: {
                        accountId: e
                    },
                    success: function(e, n) {
                        t && t(e.data)
                    },
                    error: function(e, t) {
                        n && n()
                    }
                })
            }
        };
    return u
});

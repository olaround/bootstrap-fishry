(function(a) {
    function o(a) {
        site.oloTools.config.status = a
    }

    function m() {
        return site.oloTools.config.status
    }

    function b(a) {
        for (; a.length > 0;) a.shift()()
    }
    a.extend(site, {
        oloTools: {
            config: {
                status: "NOT_RDY",
                statusCodes: {
                    OLOREADY: "OLO_RDY",
                    OLONOTREADY: "NO_OLO_RDY",
                    WORKING: "GETTING_RDY",
                    NOTREADY: "NOT_RDY",
                    ERROR: "ERROR"
                },
                queues: {
                    oloReady: [],
                    oloReadyForce: [],
                    oloNotReady: [],
                    error: []
                },
                pageOLODataReady: function() {},
                persistRedirect: false,
                oloRedirect: "",
                oloCmd: ""
            },
            makeReady: function() {
                if (m() == site.oloTools.config.statusCodes.NOTREADY)
                    if (jsDPZ.util.empty(jsDPZ.app.customer.getCustomer().getSessionData().StoreID)) o(site.oloTools.config.statusCodes.OLONOTREADY),
                site.oloTools.processQueues(), site.data.hash.wait = false;
                else {
                    site.func.toggleLoading(true);
                    o(site.oloTools.config.statusCodes.WORKING);
                    var a = false,
                        b = 2;
                    jsDPZ.ajax.storeProfile({
                        StoreID: jsDPZ.app.customer.getCustomer().getSessionData().StoreID,
                        success: function(a) {
                            jsDPZ.app.store.setStoreFromPower(a)
                        },
                        error: function() {
                            a = true;
                            site.func.powerCommunicationError()
                        },
                        complete: function() {
                            b--
                        }
                    });
                    jsDPZ.ajax.menu({
                        StoreID: jsDPZ.app.customer.getCustomer().getSessionData().StoreID,
                        success: function(a) {
                            var b = "B2PCLAVA,B16PBIT,2LCOKE,B8PCSCB,PSANSAPH,W08PHOTW,MAGGFSAL,PINPASCA".split(",");
                            jsDPZ.app.catalog.setCatalog(a);
                            jsDPZ.app.catalog.setCrossSellItems && site.data.crossSellItemsQuickList && jsDPZ.app.catalog.setCrossSellItems(site.data.crossSellItemsQuickList(b));
                            jsDPZ.app.catalog.setCatalog(jsDPZ.app.catalog.getCatalog().data);
                            for (prodCode in site.data.productDefaults)
                                if (!simplr.util.mEmpty(jsDPZ.app.catalog.getCatalog().getProduct(prodCode))) jsDPZ.app.catalog.getCatalog().data.Products[prodCode].DefaultToppings = site.data.productDefaults[prodCode].DefaultToppings;
                                !site.isPaymentPage &&
                                killConfig.isActive("mBox")
                        },
                        error: function() {
                            a = true;
                            site.func.powerCommunicationError()
                        },
                        complete: function() {
                            b--
                        }
                    });
                    var g = setInterval(function() {
                        if (b == 0) site.func.toggleLoading(false), clearInterval(g), a ? o(site.oloTools.config.statusCodes.ERROR) : (jsDPZ.app.order.getOrder(), jsDPZ.app.store.getStore().isOnlineRightNow() ? (o(site.oloTools.config.statusCodes.OLOREADY), site.oloTools.config.pageOLODataReady()) : (site.func.overlayToggle(true, "codeOverlay", {}, {
                            code: "eOnlineOrderingUnavailable"
                        }), simplr.controller.mRouteAndExecute("/customer/store/delete"))),
                        site.oloTools.processQueues(), site.data.hash.wait = false
                    }, 25)
                }
            },
            processQueues: function() {
                m() == site.oloTools.config.statusCodes.OLOREADY ? (b(site.oloTools.config.queues.oloReadyForce), b(site.oloTools.config.queues.oloReady)) : m() == site.oloTools.config.statusCodes.OLONOTREADY ? b(site.oloTools.config.queues.oloNotReady) : m() == site.oloTools.config.statusCodes.ERROR && b(site.oloTools.config.queues.error);
                site.oloTools.config.queues.oloReady = [];
                site.oloTools.config.queues.oloReadyForce = [];
                site.oloTools.config.queues.oloNotReady = [];
                site.oloTools.config.queues.error = [];
                if (m() == site.oloTools.config.statusCodes.OLOREADY) {
                    if (!jsDPZ.util.empty(site.oloTools.config.oloRedirect)) {
                        site.oloTools.config.persistRedirect = false;
                        var a = site.oloTools.config.oloRedirect;
                        site.oloTools.config.oloRedirect = "";
                        if (!jsDPZ.util.empty(a)) window.location.hash == "#" + a ? simplr.controller.mRouteAndExecute(a) : window.location.hash = a
                    }
                    if (!jsDPZ.util.empty(site.oloTools.config.oloCmd)) a = site.oloTools.config.oloCmd, site.oloTools.config.oloCmd = "", simplr.controller.mRouteAndExecute(a)
                }
                if (!site.oloTools.config.persistRedirect) site.oloTools.config.oloRedirect =
                    ""
            },
            whenReady: function(b) {
                b = a.extend({
                    oloReady: function() {},
                    oloReadyForce: function() {},
                    oloNotReady: function() {
                        window.location.href.indexOf(site.data.hash.init) === -1 && site.func.setRedirect();
                        window.location.hash = site.data.hash.init
                    },
                    error: function() {
                        window.location.hash = site.data.hash.init
                    }
                }, b);
                site.oloTools.config.queues.oloReady.push(b.oloReady);
                site.oloTools.config.queues.oloReadyForce.push(b.oloReadyForce);
                site.oloTools.config.queues.oloNotReady.push(b.oloNotReady);
                site.oloTools.config.queues.error.push(b.error);
                site.oloTools.config.statusCodes.NOTREADY == m() ? site.oloTools.makeReady() : m() != site.oloTools.config.statusCodes.WORKING && site.oloTools.processQueues()
            },
            reset: function() {
                o(site.oloTools.config.statusCodes.NOTREADY)
            }
        }
    })
})(jQuery);
(function(a) {
    a.extend(site, {
        locationTools: {
            filterSearchDataForValidation: function(o, m, b) {
                var d = a.extend({}, o),
                    o = site.locationTools.isSearchableAddress(d, m, b);
                delete d.Locations;
                switch (b) {
                    case "House":
                        delete d.Location_Name;
                        delete d.Address_Line_2;
                        break;
                    case "Other":
                        delete d.Location_Name
                }
                o && a.each(d, function(a, b) {
                    jsDPZ.util.empty(b) && delete d[a]
                });
                return d
            },
            isSearchableAddress: function(a, m, b) {
                if (b === "Campus") return !jsDPZ.util.empty(a.Region) && !jsDPZ.util.empty(a.Campus) && !jsDPZ.util.empty(a.Dorm);
                else if (m === "Carryout" || m === "Locations") return !jsDPZ.util.empty(a.Postal_Code) || !jsDPZ.util.empty(a.Region) && !jsDPZ.util.empty(a.City);
                else if (m === "Delivery" && !jsDPZ.util.empty(a.Region) && !jsDPZ.util.empty(a.City) && !jsDPZ.util.empty(a.Street)) switch (b) {
                    case "House":
                        return true;
                    case "Apartment":
                        return !jsDPZ.util.empty(a.Address_Line_2);
                    case "Business":
                        return !jsDPZ.util.empty(a.Location_Name);
                    case "Hotel":
                    case "Dormitory":
                        return !jsDPZ.util.empty(a.Location_Name) && !jsDPZ.util.empty(a.Address_Line_2);
                    case "Other":
                        return true
                }
                return false
            },
            buildSearchParameters: function(a) {
                if (simplr.util.mEmpty(a.Dorm)) {
                    b = {
                        c: "",
                        s: "",
                        locationName: ""
                    };
                    d = ["City", "Region", "Postal_Code"];
                    e = 0;
                    for (g = d.length; e < g; e++) f = d[e], simplr.util.mEmpty(a[f]) || (b.c += (b.c != "" ? " " : "") + a[f] + (e == 0 ? "," : ""));
                    d = ["Street", "Address_Line_2"];
                    e = 0;
                    for (g = d.length; e < g; e++)
                        if (f = d[e], !simplr.util.mEmpty(a[f])) {
                            var m = a[f];
                            f == "Address_Line_2" && (m = (/\d/.test(m.charAt(0)) ? "#" : "") + m);
                            b.s += (jsDPZ.util.empty(b.s) ? "" : " ") + m
                        }
                    if (!simplr.util.mEmpty(a.Location_Name)) b.locationName =
                        a.Location_Name
                } else
                    for (var b = {
                        b: "",
                        u: ""
                    }, d = ["Dorm", "Room_Number"], e = 0, g = d.length; e < g; e++) {
                        var f = d[e];
                        simplr.util.mEmpty(a[f]) || (b[f == "Dorm" ? "b" : "u"] = a[f])
                    }
                return b
            },
            buildSessionParameters: function(a) {
                if (simplr.util.mEmpty(a.BuildingID)) {
                    b = {
                        c: "",
                        s: "",
                        locationName: ""
                    };
                    d = ["City", "Region", "PostalCode"];
                    e = 0;
                    for (g = d.length; e < g; e++) f = d[e], simplr.util.mEmpty(a[f]) || (b.c += (b.c != "" ? " " : "") + a[f] + (e == 0 ? "," : ""));
                    d = ["Street", "AddressLine2"];
                    e = 0;
                    for (g = d.length; e < g; e++)
                        if (f = d[e], !simplr.util.mEmpty(a[f])) {
                            var m =
                                a[f];
                            f == "AddressLine2" && (m = (/\d/.test(m.charAt(0)) ? "#" : "") + m);
                            b.s += (jsDPZ.util.empty(b.s) ? "" : " ") + m
                        }
                    if (!simplr.util.mEmpty(a.LocationName)) b.locationName = a.LocationName
                } else
                    for (var b = {
                        b: "",
                        u: ""
                    }, d = ["BuildingID", "AddressLine2"], e = 0, g = d.length; e < g; e++) {
                        var f = d[e];
                        simplr.util.mEmpty(a[f]) || (b[f == "BuildingID" ? "b" : "u"] = a[f])
                    }
                return b
            },
            getRegionListData: function(o) {
                var m = [];
                a.each(o.Regions, function(a, d) {
                    m.push({
                        value: d.Region,
                        label: d.RegionName
                    })
                });
                return m
            },
            getCampusListData: function(o) {
                var m = [];
                a.each(o.Sites,
                    function(a, d) {
                        m.push({
                            value: d.SiteID,
                            label: d.SiteName
                        })
                    });
                return m
            },
            getBuildingListData: function(o) {
                var m = [];
                a.each(o.Buildings, function(a, d) {
                    m.push({
                        value: d.BuildingID,
                        label: d.BuildingName
                    })
                });
                return m
            },
            addressToFieldData: function(o) {
                var m = {};
                a.each(o, function(a, d) {
                    jsDPZ.util.empty(d) || (m[a.match(/[A-Z0-9][a-z]*/g).join("_")] = d);
                    a == "AddressLine2" && d.charAt(0) == "#" && (m.Address_Line_2 = d.substr(1))
                });
                if (!jsDPZ.util.empty(o.BuildingID)) m.Dorm = o.BuildingID, m.Room_Number = o.AddressLine2, delete m.Building_I_D,
                delete m.Address_Line_2;
                return m
            },
            getSearchTypeByParameters: function(a) {
                var m = !jsDPZ.util.empty(a.s),
                    b = !jsDPZ.util.empty(a.c),
                    d = !jsDPZ.util.empty(a.b);
                jsDPZ.util.empty(a.u);
                return m || b ? 1 : d ? 2 : false
            },
            performStoreSearch: function(o) {
                site.func.toggleLoading(true);
                var o = a.extend(true, {
                    success: function() {},
                    error: function() {},
                    complete: function() {},
                    data: {}
                }, o),
                    m = o.data.locationName;
                delete o.data.locationName;
                if (site.locationTools.getSearchTypeByParameters(o.data) == 1) jsDPZ.ajax.storeSearch({
                    data: o.data,
                    success: function(a) {
                        var b =
                            jsDPZ.app.search.setStoreSearchFromPower(a).data;
                        if (!jsDPZ.util.empty(m)) b.SearchedAddress.LocationName = m;
                        o.success(a)
                    },
                    error: function(a) {
                        o.error(a);
                        site.func.powerCommunicationError()
                    },
                    complete: function() {
                        o.complete();
                        site.func.toggleLoading(false)
                    }
                });
                else if (site.locationTools.getSearchTypeByParameters(o.data) == 2) {
                    var b = o.data.b;
                    delete o.data.b;
                    jsDPZ.ajax.storesByBuilding({
                        building: b,
                        data: o.data,
                        success: function(a) {
                            var b = jsDPZ.app.search.setStoreSearchFromPower(a).data;
                            if (!jsDPZ.util.empty(m)) b.SearchedAddress.LocationName =
                                m;
                            o.success(a)
                        },
                        error: function(a) {
                            o.error(a);
                            site.func.powerCommunicationError()
                        },
                        complete: function() {
                            o.complete();
                            site.func.toggleLoading(false)
                        }
                    })
                }
            },
            showReengagementCoupon: function(a) {
                var m = 0,
                    b = setInterval(function() {
                        m += 1;
                        var a = jsDPZ.app.catalog.getCatalog().data.Coupons;
                        if (!simplr.util.mEmpty(a))
                            for (c in clearInterval(b), a) {
                                var e = a[c];
                                e.Tags.Reengagement == true && simplr.controller.mRouteAndExecute("/order/upsell/reengagement/?Reengagement=true&Code=" + e.Code)
                            }
                        m == 20 && clearInterval(b)
                    }, 100);
                a && a()
            }
        }
    })
})(jQuery);
(function(a) {
    a.extend(site, {
        catalogTools: {
            config: {
                categoryTypes: {
                    COUPON_1: "Coupon_1",
                    PRODUCT_1: "Product_1",
                    PRODUCT_2: "Product_2"
                },
                builderTypes: {
                    PIZZA: "Pizza",
                    CHICKEN: "Chicken",
                    OTHER: "OTHER"
                }
            },
            categoryExists: function(a) {
                return jsDPZ.util.empty(a) ? false : !jsDPZ.util.empty(jsDPZ.app.catalog.getCatalog().getCategoryData(a.section, a.category))
            },
            cleanseOrder: function() {
                for (var a = jsDPZ.app.catalog.getCatalog(), m = jsDPZ.app.order.getOrder(), b = false, d = m.data.Details.Variants.length - 1; d >= 0; d--) {
                    var e = false,
                        g =
                            m.data.Details.Variants[d],
                        f = jsDPZ.app.catalog.getCatalog().getVariant(g.Code);
                    if (simplr.util.mEmpty(f)) e = true;
                    else {
                        var j = a.getProduct(f.data.ProductCode);
                        if (!jsDPZ.util.empty(g.Sides)) {
                            for (var j = parseInt(j.data.Tags.MaxOptionQty), h = a.getAvailableVariantSidesData(f.data.Code), f = {}, k = 0, s = h.length; k < s; k++) f[h[k].Code] = true;
                            var h = 0,
                                n;
                            for (n in g.Sides)
                                if (f[n]) {
                                    if (h += g.Sides[n], h > j) {
                                        e = true;
                                        break
                                    }
                                } else {
                                    e = true;
                                    break
                                }
                        }
                    }
                    e && (m.data.Details.Variants.remove(d), b = true)
                }
                m.data.Details.Coupons = [];
                return b
            },
            createOrderVariantFromVariantCode: function(o,
                m) {
                var b = jsDPZ.app.catalog.getCatalog(),
                    b = b.getProduct(b.getVariant(o).data.ProductCode),
                    d = a.extend(true, {}, jsDPZ.config.dataModel.ORDER_VARIANT, {
                        Code: o,
                        Qty: 1
                    });
                a.each(b.getDefaultToppingsData(), function(a, b) {
                    d.Toppings[b.Code] = {
                        "1/1": b.Availability[0]
                    }
                });
                a.each(jsDPZ.util.stringToObjectParser(m), function(a, b) {
                    d.Toppings[a] = {
                        "1/1": b
                    }
                });
                a.each(b.getDefaultSidesData(), function(a, b) {
                    d.Sides[b.Code] = parseInt(b.Availability[0], 10)
                });
                return d
            },
            formDataToVariantData: function(o) {
                var m = a.extend(true, {}, jsDPZ.config.dataModel.ORDER_VARIANT);
                a.each(o, function(a, d) {
                    var e = a.split("|");
                    if (e[1] == "Topping") {
                        var g = d.split("|");
                        g[1] != 0 && (m.Toppings[e[2]] || (m.Toppings[e[2]] = {}), m.Toppings[e[2]][g[0]] = g[1])
                    } else if (e[1] == "Side") d > 0 && (m.Sides[e[2]] = parseInt(d, 10));
                    else if (e[1] == "Variant") m.Code = d;
                    else if (e[1] == "Quantity") m.Qty = parseInt(d, 10)
                });
                return m
            },
            genericProductOptionsFromURLParameters: function(o) {
                var m = {
                    Code: "",
                    Qty: 1,
                    Toppings: {},
                    Sides: {}
                };
                if (!jsDPZ.util.empty(o)) {
                    if (!jsDPZ.util.empty(o.code)) m.Code = o.code;
                    if (!jsDPZ.util.empty(o.qty)) m.Qty =
                        parseInt(o.qty, 10);
                    if (!jsDPZ.util.empty(o.toppings)) {
                        var b = o.toppings.split("|");
                        a.each(b, function(a, b) {
                            var g = b.split(":"),
                                f = g[1].split(";");
                            m.Toppings[g[0]] = {};
                            m.Toppings[g[0]][f[0]] = f[1]
                        })
                    }
                    jsDPZ.util.empty(o.sides) || (b = o.sides.split("|"), a.each(b, function(a, b) {
                        var g = b.split(":");
                        m.Sides[g[0]] = parseInt(g[1], 10)
                    }));
                    if (!jsDPZ.util.empty(o.amount)) m.Amount = o.amount
                }
                return m
            },
            getProductBuilderType: function(a) {
                var m = site.catalogTools.config.builderTypes.OTHER;
                if (!jsDPZ.util.empty(a.ProductType))
                    if (a.ProductType ==
                        "Pizza") m = site.catalogTools.config.builderTypes.PIZZA;
                    else if (a.ProductType == "Wings" && !a.Tags.SpecialtyChicken) m = site.catalogTools.config.builderTypes.CHICKEN;
                return m
            },
            getCategoryNavigationState: function(a) {
                var m = {
                    main: "",
                    sub: ""
                };
                if (!jsDPZ.util.empty(a.section))
                    if (a.section == "Coupons") m.main = site.data.navigation.states.main.COUPONS;
                    else if (a.section == "GroupOrdering") m.main = site.data.navigation.states.main.GROUPORDERING;
                else if (jsDPZ.util.empty(a.category)) m.main = site.data.navigation.states.main.ENTREES;
                else {
                    var b = a.category;
                    m.main = b == "Sandwich" || b == "Pasta" || b == "Wings" || b == "Pizza" || b == "BuildYourOwn" || b == "Feast" || b == "Legend" || b == "Artisan" ? site.data.navigation.states.main.ENTREES : site.data.navigation.states.main.SIDESANDDESSERTS
                } if (!jsDPZ.util.empty(a.category)) m.sub = a.category == "Legend" || a.category == "Feast" || a.category == "Artisan" ? "Pizza" : a.category;
                return m
            },
            getCategoryType: function(a) {
                if (!jsDPZ.util.empty(a.section) && !jsDPZ.util.empty(a.category))
                    if (a.section == "Coupons") return site.catalogTools.config.categoryTypes.COUPON_1;
                    else if (a = a.category, a == "Pasta" || a == "Sandwich" || a == "Pizza" || a == "Wings") return site.catalogTools.config.categoryTypes.PRODUCT_2;
                return site.catalogTools.config.categoryTypes.PRODUCT_1
            },
            getOrderCouponFromURLParameters: function(o) {
                var m = a.extend(true, {}, jsDPZ.config.dataModel.ORDER_COUPON);
                if (!jsDPZ.util.empty(o.code)) m.Code = o.code;
                if (!jsDPZ.util.empty(o.qty)) m.Qty = parseInt(o.qty, 10);
                if (!jsDPZ.util.empty(o.id)) m.ID = parseInt(o.id, 10);
                return m
            },
            isCustomizableProduct: function(a) {
                return !simplr.util.mEmpty(a) &&
                    (a = jsDPZ.app.catalog.getCatalog().getProduct(a), !simplr.util.mEmpty(a) && (a = a.data.ProductType, a == "Pizza" || a == "Sandwich" || a == "Wings" || a == "Pasta" || a == "Artisan" || a == "Bread")) ? true : false
            },
            orderVariantFromURLParameters: function(o) {
                var m = site.catalogTools.genericProductOptionsFromURLParameters(o);
                a.each(m, function(a, d) {
                    jsDPZ.util.empty(d) && delete m[a]
                });
                return newOrderVariant = a.extend(true, {}, jsDPZ.config.dataModel.ORDER_VARIANT, m)
            },
            orderVariantToURLParameterString: function(o) {
                if (jsDPZ.util.empty(o)) return "";
                else {
                    var m = "?code=" + o.Code;
                    jsDPZ.util.empty(o.Qty) || (m += "&qty=" + o.Qty);
                    jsDPZ.util.empty(o.Toppings) || (m += "&toppings=", a.each(o.Toppings, function(b, d) {
                        m += b + ":";
                        a.each(d, function(a, b) {
                            m += a + ";" + b
                        });
                        m += "|"
                    }), m = m.slice(0, m.length - 1));
                    jsDPZ.util.empty(o.Sides) || (m += "&sides=", a.each(o.Sides, function(a, d) {
                        m += a + ":" + d + "|"
                    }), m = m.slice(0, m.length - 1));
                    return m
                }
            },
            validateOrderDateTimeParamsFormat: function(a) {
                return /^(\d{4})-(\d{2})-(\d{2})/.test(a.date) && /(\d{2}):(\d{2}):(\d{2})/.test(a.time) ? true : false
            },
            isPastOrderDate: function() {
                var a =
                    jsDPZ.app.order.getOrder().data.Details.OrderDateTime;
                return simplr.util.mEmpty(a) ? false : jsDPZ.obj.dateTime(a).data <= jsDPZ.obj.dateTime(jsDPZ.app.store.getStore().data.StoreAsOfTime).data
            },
            isForceFutureOrder: function() {
                var o = jsDPZ.app.store.getStore(),
                    m = jsDPZ.app.order.getOrder(),
                    b = !simplr.util.mEmpty(m.data.Details.OrderDateTime) ? m.data.Details.OrderDateTime : o.data.StoreAsOfTime;
                return site.catalogTools.isPastOrderDate() ? true : simplr.util.mEmpty(m.data.Details.OrderDateTime) && !o.isOpenRightNow() ?
                    true : o.isOpenRightNow() && a.inArray(m.data.Details.ServiceMethod, o.getAvailableServiceMethods({
                        dtString: b,
                        deliveryAvailable: jsDPZ.app.customer.getCustomer().data.Session.DeliveryAvailable
                    })) == -1 ? true : false
            },
            getStoreTimeArr: function(o) {
                for (var o = a.extend({
                    date: "",
                    increment: 15,
                    minTime: "00:00",
                    maxTime: "23:59"
                }, o), m = jsDPZ.app.store.getStore(), b = jsDPZ.app.order.getOrder(), d = jsDPZ.obj.dateTime(o.date).getDayOfWeek(), m = m.data.ServiceHours[b.data.Details.ServiceMethod][d], b = [], d = jsDPZ.obj.dateTime(o.date +
                        " " + o.maxTime).data, e = jsDPZ.obj.dateTime(o.date + " " + o.minTime).data, g = 0; g < m.length; g++)
                    for (var f = jsDPZ.obj.dateTime(o.date + " " + m[g].OpenTime).data, j = jsDPZ.obj.dateTime(o.date + " " + m[g].CloseTime).data; f <= j;) f >= e && f <= d && site.catalogTools.isOrderableTime(f.getDateTimeObject().getPulseDateTimeString()) && b.push(f.getDateTimeObject()), f = new Date(f.getTime() + o.increment * 6E4);
                return b
            },
            isOrderableTime: function(a) {
                for (var m = false, b = jsDPZ.app.store.getStore(), d = jsDPZ.app.order.getOrder(), e = jsDPZ.obj.dateTime(a),
                        g = jsDPZ.obj.dateTime(b.data.StoreAsOfTime), f = e.getDayOfWeek(), j = (new Date(jsDPZ.obj.dateTime(a).data.getTime() + 864E5)).getDateTimeObject().getDayOfWeek(), a = (new Date(jsDPZ.obj.dateTime(a).data.getTime() - 864E5)).getDateTimeObject().getDayOfWeek(), d = d.data.Details.ServiceMethod, f = b.data.ServiceHours[d][f].sort(function(a, b) {
                            return parseFloat(a.OpenTime.replace(":", "")) - parseFloat(b.OpenTime.replace(":", ""))
                        }), g = new Date(g.data.getTime() + 36E5), g = e.data >= g, h = false, k = false, s = 0; s < f.length; s++) {
                    var n = f[s].OpenTime,
                        q = f[s].CloseTime,
                        C = jsDPZ.obj.dateTime(e.getDisplayFormat("YYYY-MM-DD") + " " + n + ":00"),
                        l = jsDPZ.obj.dateTime(e.getDisplayFormat("YYYY-MM-DD") + " " + q + ":00");
                    if (e.data.getTime() >= C.data.getTime() && e.data.getTime() <= l.data.getTime()) {
                        var w = false,
                            w = b.data.ServiceHours[d][a][1] ? b.data.ServiceHours[d][a][1].CloseTime == "23:59" : b.data.ServiceHours[d][a][0].CloseTime == "23:59";
                        e.data.getTime() >= C.data.getTime() + 18E5 ? h = true : w && n == "00:00" && (h = true);
                        n = b.data.ServiceHours[d][j][0].OpenTime == "00:00";
                        e.data.getTime() <=
                            l.data.getTime() - 18E5 ? k = true : n && q == "23:59" && (k = true);
                        if (h && k) break
                    }
                }
                g && h && k && (m = true);
                return m
            },
            friendlyToppingsAndSides: function(o) {
                var o = a.extend(true, {}, o),
                    m = jsDPZ.app.catalog.getCatalog();
                if (!jsDPZ.util.empty(m.getVariant(o.Code)))
                    for (var m = m.getDefaultVariantToppingsData(o.Code), b = 0; b < m.length; b++) {
                        var d = o.Toppings[m[b].Code];
                        jsDPZ.util.empty(d) ? o.Toppings[m[b].Code] = {
                            "1/1": "0"
                        } : d["1/1"] == m[b].Availability[0] && delete o.Toppings[m[b].Code]
                    }
                return o
            },
            getVariantToppingSideViewObj: function(o, m) {
                var b = [],
                    d = jsDPZ.app.catalog.getCatalog();
                a.each(o, function(e, g) {
                    var f = null;
                    if (g.Type && g.Type === "Coupon") f = jsDPZ.app.catalog.getCatalog().getCoupon(g.Code).data, jsDPZ.util.empty(f) || b.push({
                        id: void 0,
                        name: f.Name.replace(/"/g, "&quot;"),
                        productImage: '<img src="' + urlConfig.assets + "/images/img/coupons/thumbnails/" + f.ImageCode + '.jpg" alt="' + f.Name.replace(/"/g, "&quot;") + '" />',
                        price: f.Price == 0 ? "&nbsp;" : jsDPZ.obj.price(f.Price).getDisplayValue(),
                        qty: 1,
                        sides: {},
                        toppings: {},
                        url: "/order/coupons/new?code=" + f.Code + "&qty=1"
                    });
                    else if (f = jsDPZ.app.catalog.getCatalog().getVariant(g.Code).data, !jsDPZ.util.empty(f)) {
                        var j = jsDPZ.app.catalog.getCatalog().getProduct(f.ProductCode).data,
                            h = j.ProductType == "Pasta" || j.ProductType == "Sandwich",
                            k = "",
                            s = {};
                        a.each(site.data.uiConfig.AVAILABLE_LOCATIONS_HASH, function(a, b) {
                            s[a] = {
                                text: b,
                                values: []
                            }
                        });
                        var o = site.catalogTools.friendlyToppingsAndSides(g);
                        a.each(o.Toppings, function(b, e) {
                            var g = jsDPZ.app.catalog.getCatalog().getToppingsData(j.ProductType, b);
                            a.each(e, function(a, e) {
                                if (a !==
                                    "0" && b == "Cp") {
                                    var h = d.getProduct(f.ProductCode).data.DefaultToppings.indexOf("Cp=1") !== -1,
                                        k = f.flavorCode === "NPAN",
                                        j = e !== "0";
                                    (h && !j && !k || !h && j && !k || h && !j && k) && s[a].values.push(site.data.uiConfig.AVAILABLE_WEIGHTS_HASH[e].Prefix + g.Name)
                                } else a !== "0" && s[a].values.push(site.data.uiConfig.AVAILABLE_WEIGHTS_HASH[e].Prefix + g.Name)
                            })
                        });
                        k = {
                            component: "toppingPartDetails",
                            tokens: []
                        };
                        a.each(s, function(a, b) {
                            b.values.length > 0 && k.tokens.push({
                                partText: h ? "" : b.text + ":",
                                partToppings: b.values.join(", ")
                            })
                        });
                        var q = [];
                        a.each(o.Sides, function(a, b) {
                            var e = jsDPZ.app.catalog.getCatalog().getSidesData(j.ProductType, a);
                            q.push("(" + b + ") " + e.Name)
                        });
                        o = site.catalogTools.orderVariantToURLParameterString(g);
                        o = site.catalogTools.isCustomizableProduct(f.ProductCode) && !m ? "/product/" + f.ProductCode + "/builder/" + o : "/order/variant/new" + o;
                        o = {
                            id: g.ID,
                            name: f.Name.replace(/"/g, "&quot;"),
                            productDogEar: j.Tags.New ? "newDogEar" : "",
                            productDogEarText: j.Tags.New ? simplr.validation.mGetCodeMessage("iNewDogEar") : "",
                            productImage: '<img src="' + urlConfig.assets + "/images/img/products/thumbnails/" + j.ImageCode + '.jpg" alt="' + f.Name.replace(/"/g, "&quot;") + '" />',
                            price: g.Price == 0 ? "Free" : g.Price == -1 ? "&nbsp;" : jsDPZ.obj.price(g.Price).getDisplayValue(),
                            qty: g.Qty || 1,
                            sides: q.join(", "),
                            toppings: k,
                            url: o,
                            isNew: g.isNew
                        };
                        typeof o.isNew !== "boolean" && delete o.isNew;
                        b.push(o)
                    }
                });
                return b
            },
            defaultVariantToOrderVariant: function(o) {
                var m = jsDPZ.app.catalog.getCatalog(),
                    b = a.extend(true, {}, jsDPZ.config.dataModel.ORDER_VARIANT);
                if (!simplr.util.mEmpty(o)) {
                    var d = m.getVariant(o);
                    if (!simplr.util.mEmpty(d)) {
                        b.Qty =
                            1;
                        b.Code = o;
                        for (var e = m.getDefaultVariantToppingsData(o), d = 0, g = e.length; d < g; d++) b.Toppings[e[d].Code] = {
                            "1/1": e[d].Availability[0]
                        };
                        o = m.getDefaultVariantSidesData(o);
                        d = 0;
                        for (g = o.length; d < g; d++) b.Sides[o[d].Code] = parseInt(o[d].Availability[0])
                    }
                }
                return b
            }
        }
    })
})(jQuery);
(function(a) {
    a.extend(site, {
        customerTools: {
            filterPasswordDataForValidation: function(a) {
                return jsDPZ.util.empty(a) ? {} : {
                    Current_Password: a.Current_Password,
                    New_Password: [a.New_Password, a.Current_Password],
                    Confirm_New_Password: [a.Confirm_New_Password, a.New_Password]
                }
            },
            filterForgotPasswordDataForValidation: function(a) {
                return jsDPZ.util.empty(a) ? {} : {
                    New_Password: [a.New_Password, ""],
                    Confirm_New_Password: [a.Confirm_New_Password, a.New_Password]
                }
            },
            filterRegistrationDataForValidation: function(a) {
                if (!jsDPZ.util.empty(a.Confirm_Password) && !jsDPZ.util.empty(a.Password)) a.Confirm_Password = [a.Confirm_Password, a.Password];
                if (!jsDPZ.util.empty(a.Confirm_Email) && !jsDPZ.util.empty(a.Email)) a.Confirm_Email = [a.Confirm_Email, a.Email];
                return a
            },
            filterEmailPrefDataForValidation: function(a) {
                if (!jsDPZ.util.empty(a.Email) && typeof a.ConfirmEmail != "object") a.Confirm_Email = [a.Email, a.Confirm_Email];
                jsDPZ.util.empty(a.Email) && !jsDPZ.util.empty(a.Phone) && (delete a.Email, delete a.Confirm_Email);
                !jsDPZ.util.empty(a.Email) && jsDPZ.util.empty(a.Phone) && delete a.Phone;
                return a
            },
            isReadyForRegistration: function(a) {
                return !jsDPZ.util.empty(a) && !jsDPZ.util.empty(a.firstName) && !jsDPZ.util.empty(a.lastName) && !jsDPZ.util.empty(a.email) && !jsDPZ.util.empty(a.phone) && !jsDPZ.util.empty(a.city) && !jsDPZ.util.empty(a.region) && !jsDPZ.util.empty(a.postalCode) && !jsDPZ.util.empty(a.password) && !jsDPZ.util.empty(a.agreeToTermsOfUse) && a.agreeToTermsOfUse == "true" && !jsDPZ.util.empty(a.age13OrOlder) && a.age13OrOlder == "true" ? true : false
            },
            isReadyForProfileUpdate: function(a) {
                return !jsDPZ.util.empty(a) && !jsDPZ.util.empty(a.firstName) && !jsDPZ.util.empty(a.lastName) && !jsDPZ.util.empty(a.email) && !jsDPZ.util.empty(a.phone) ? true : false
            },
            createPasswordURLParameters: function(o) {
                var m = {};
                if (!simplr.util.mEmpty(o)) {
                    delete o.Confirm_New_Password;
                    for (var b in o) {
                        var d = a.isArray(o[b]) ? o[b][0] : o[b],
                            e = b.split("_");
                        e[0] = e[0].toLowerCase();
                        m[e.join("")] = d
                    }
                }
                return m
            },
            createRegistrationURLParameters: function(o) {
                var m = {};
                if (!simplr.util.mEmpty(o))
                    for (var b in o) {
                        var d = a.isArray(o[b]) ? o[b][0] : o[b],
                            e = b.split("_");
                        e[0] =
                            e[0].toLowerCase();
                        m[e.join("")] = d
                    }
                return m
            },
            registrationParametersToCustomerObject: function(o) {
                if (jsDPZ.util.empty(o)) return {};
                else {
                    var m = a.extend(true, {}, jsDPZ.obj.customer().data);
                    m.Addresses.push(a.extend(true, {}, jsDPZ.config.dataModel.ADDRESS, {
                        Name: o.addressName,
                        Type: o.addressType
                    }));
                    delete m.Session;
                    a.each(o, function(a, d) {
                        var e = a.charAt(0).toUpperCase() + a.slice(1);
                        e == "LocationName" || e == "Street" || e == "City" || e == "Region" || e == "PostalCode" || e == "AddressLine2" || e == "AddressLine3" || e == "AddressLine4" ||
                            e == "BuildingID" || e == "DeliveryInstructions" ? m.Addresses[0][e] = d : e == "AgreeToTermsOfUse" || e == "Age13OrOlder" || e == "EmailOptIn" ? m[e] = d == "true" : e != "ConfirmEmail" && e != "ConfirmPassword" && (m[e] = d)
                    });
                    return m
                }
            },
            getAddressByName: function(o) {
                return a.grep(jsDPZ.app.customer.getCustomer().data.Addresses, function(a) {
                    return jsDPZ.util.htmlUnEscape(a.Name) == o
                })[0]
            }
        }
    })
})(jQuery);
DateInput = function(a) {
    function o(m, b, d) {
        "object" != typeof b && (b = {});
        a.extend(this, o.DEFAULT_OPTS, b);
        this.input = a(m);
        this.bindMethodsToObj("show", "hide", "hideIfClickOutside", "keydownHandler", "selectDate");
        this.callback = d;
        this.build();
        this.selectDate();
        this.hide()
    }
    o.DEFAULT_OPTS = {
        month_names: "January February March April May June July August September October November December".split(" "),
        short_month_names: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
        short_day_names: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
        start_of_week: 1,
        future_date_only: false,
        days_in_future: 21,
        unorderable_dates: []
    };
    o.prototype = {
        build: function() {
            var m = a('<p class="month_nav"><span class="button prev" title="[Page-Up]">&lt;&lt;</span> <span class="month_name"></span> <span class="button next" title="[Page-Down]">&gt;&gt;</span></p>');
            this.monthNameSpan = a(".month_name", m);
            a(".prev", m).click(this.bindToObj(function() {
                this.moveMonthBy(-1)
            }));
            a(".next", m).click(this.bindToObj(function() {
                this.moveMonthBy(1)
            }));
            var b = a('<p class="year_nav"><span class="button prev" title="[Ctrl+Page-Up]">&lt;&lt;</span> <span class="year_name"></span> <span class="button next" title="[Ctrl+Page-Down]">&gt;&gt;</span></p>');
            this.yearNameSpan = a(".year_name", b);
            a(".prev", b).click(this.bindToObj(function() {
                this.moveMonthBy(-12)
            }));
            a(".next", b).click(this.bindToObj(function() {
                this.moveMonthBy(12)
            }));
            var m = a('<div class="nav"></div>').append(m, b),
                d = "<table><thead><tr>";
            a(this.adjustDays(this.short_day_names)).each(function() {
                d += "<th>" + this + "</th>"
            });
            d += "</tr></thead><tbody></tbody></table>";
            this.dateSelector = this.rootLayers = a('<div class="date_selector"></div>').append(m, d);
            a("body").append(this.dateSelector);
            a.browser.msie &&
                7 > a.browser.version && (this.ieframe = a('<iframe class="date_selector_ieframe" frameborder="0" src="#"></iframe>').insertBefore(this.dateSelector), this.rootLayers = this.rootLayers.add(this.ieframe), a(".button", m).mouseover(function() {
                    a(this).addClass("hover")
                }), a(".button", m).mouseout(function() {
                    a(this).removeClass("hover")
                }));
            this.tbody = a("tbody", this.dateSelector);
            this.input.change(this.bindToObj(function() {
                this.selectDate()
            }));
            this.selectDate()
        },
        selectMonth: function(m) {
            var b = new Date(m.getFullYear(),
                m.getMonth(), 1);
            if (!this.currentMonth || !(this.currentMonth.getFullYear() == b.getFullYear() && this.currentMonth.getMonth() == b.getMonth())) {
                this.currentMonth = b;
                for (var b = this.rangeStart(m), d = this.rangeEnd(m), d = this.daysBetween(b, d), e = "", g = 0; g <= d; g++) {
                    var f = new Date(b.getFullYear(), b.getMonth(), b.getDate() + g, 12, 0);
                    this.isFirstDayOfWeek(f) && (e += "<tr>");
                    e = f.getMonth() == m.getMonth() && (this.future_date_only ? this.isFuture(f) : 1) && this.isWithinDateRange(f) && this.isOrderableDay(f) ? e + ('<td class="selectable_day" date="' +
                        this.dateToString(f) + '">' + f.getDate() + "</td>") : e + ('<td class="unselected_month" date="' + this.dateToString(f) + '">' + f.getDate() + "</td>");
                    this.isLastDayOfWeek(f) && (e += "</tr>")
                }
                this.tbody.empty().append(e);
                this.monthNameSpan.empty().append(this.monthName(m));
                this.yearNameSpan.empty().append(this.currentMonth.getFullYear());
                a(".selectable_day", this.tbody).click(this.bindToObj(function(b) {
                    this.changeInput(a(b.target).attr("date"))
                }));
                a("td[date='" + this.dateToString(new Date) + "']", this.tbody).addClass("today");
                a("td.selectable_day", this.tbody).mouseover(function() {
                    a(this).addClass("hover")
                });
                a("td.selectable_day", this.tbody).mouseout(function() {
                    a(this).removeClass("hover")
                })
            }
            a(".selected", this.tbody).removeClass("selected");
            a("td[date='" + this.selectedDateString + "']", this.tbody).addClass("selected")
        },
        selectDate: function(a) {
            "undefined" == typeof a && (a = this.stringToDate(this.input.val()));
            a || (a = new Date);
            this.selectedDate = a;
            this.selectedDateString = this.dateToString(this.selectedDate);
            this.selectMonth(this.selectedDate)
        },
        changeInput: function(a) {
            this.input.val(a).change();
            this.hide();
            this.callback()
        },
        show: function() {
            this.rootLayers.css("display", "block");
            a([window, document.body]).click(this.hideIfClickOutside);
            this.input.unbind("focus", this.show);
            a(document.body).keydown(this.keydownHandler);
            this.setPosition()
        },
        hide: function() {
            this.rootLayers.css("display", "none");
            a([window, document.body]).unbind("click", this.hideIfClickOutside);
            this.input.focus(this.show);
            a(document.body).unbind("keydown", this.keydownHandler)
        },
        hideIfClickOutside: function(a) {
            a.target !=
                this.input[0] && !this.insideSelector(a) && this.hide()
        },
        insideSelector: function(a) {
            var b = this.dateSelector.position();
            b.right = b.left + this.dateSelector.outerWidth();
            b.bottom = b.top + this.dateSelector.outerHeight();
            return a.pageY < b.bottom && a.pageY > b.top && a.pageX < b.right && a.pageX > b.left
        },
        keydownHandler: function(a) {
            switch (a.keyCode) {
                case 9:
                case 27:
                    this.hide();
                    return;
                case 13:
                    this.changeInput(this.selectedDateString);
                    break;
                case 33:
                    this.moveDateMonthBy(a.ctrlKey ? -12 : -1);
                    break;
                case 34:
                    this.moveDateMonthBy(a.ctrlKey ?
                        12 : 1);
                    break;
                case 38:
                    this.moveDateBy(-7);
                    break;
                case 40:
                    this.moveDateBy(7);
                    break;
                case 37:
                    this.moveDateBy(-1);
                    break;
                case 39:
                    this.moveDateBy(1);
                    break;
                default:
                    return
            }
            a.preventDefault()
        },
        stringToDate: function(a) {
            var b;
            return (b = a.match(/^(\d{1,2}) ([^\s]+) (\d{4,4})$/)) ? new Date(b[3], this.shortMonthNum(b[2]), b[1], 12, 0) : null
        },
        dateToString: function(a) {
            return a.getDate() + " " + this.short_month_names[a.getMonth()] + " " + a.getFullYear()
        },
        setPosition: function() {
            var a = this.input.offset();
            this.rootLayers.css({
                top: a.top + this.input.outerHeight() + 10,
                left: a.left
            });
            this.ieframe && this.ieframe.css({
                width: this.dateSelector.outerWidth(),
                height: this.dateSelector.outerHeight()
            })
        },
        moveDateBy: function(a) {
            this.selectDate(new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() + a))
        },
        moveDateMonthBy: function(a) {
            var b = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + a, this.selectedDate.getDate());
            b.getMonth() == this.selectedDate.getMonth() + a + 1 && b.setDate(0);
            this.selectDate(b)
        },
        moveMonthBy: function(a) {
            this.selectMonth(new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + a, this.currentMonth.getDate()))
        },
        monthName: function(a) {
            return this.month_names[a.getMonth()]
        },
        bindToObj: function(a) {
            var b = this;
            return function() {
                return a.apply(b, arguments)
            }
        },
        bindMethodsToObj: function() {
            for (var a = 0; a < arguments.length; a++) this[arguments[a]] = this.bindToObj(this[arguments[a]])
        },
        indexFor: function(a, b) {
            for (var d = 0; d < a.length; d++)
                if (b == a[d]) return d
        },
        monthNum: function(a) {
            return this.indexFor(this.month_names,
                a)
        },
        shortMonthNum: function(a) {
            return this.indexFor(this.short_month_names, a)
        },
        shortDayNum: function(a) {
            return this.indexFor(this.short_day_names, a)
        },
        daysBetween: function(a, b) {
            a = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
            b = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
            return (b - a) / 864E5
        },
        changeDayTo: function(a, b, d) {
            a = d * (Math.abs(b.getDay() - a - 7 * d) % 7);
            return new Date(b.getFullYear(), b.getMonth(), b.getDate() + a)
        },
        rangeStart: function(a) {
            return this.changeDayTo(this.start_of_week, new Date(a.getFullYear(),
                a.getMonth()), -1)
        },
        rangeEnd: function(a) {
            return this.changeDayTo((this.start_of_week - 1) % 7, new Date(a.getFullYear(), a.getMonth() + 1, 0), 1)
        },
        isFirstDayOfWeek: function(a) {
            return a.getDay() == this.start_of_week
        },
        isLastDayOfWeek: function(a) {
            return a.getDay() == (this.start_of_week - 1) % 7
        },
        adjustDays: function(a) {
            for (var b = [], d = 0; d < a.length; d++) b[d] = a[(d + this.start_of_week) % 7];
            return b
        },
        isFuture: function(a) {
            return a >= (new Date).setHours(12, 0, 0, 0)
        },
        isWithinDateRange: function(a) {
            var b = (new Date).getTime() + 864E5 * this.days_in_future;
            return a <= new Date(b)
        },
        isOrderableDay: function(a) {
            for (var b = true, d = 0; d < this.unorderable_dates.length; d++)
                if (a.toDateString() == (new Date(this.unorderable_dates[d] + "T00:00:00")).toDateString()) {
                    b = false;
                    break
                }
            return b
        }
    };
    a.fn.date_input = function(a, b) {
        return this.each(function() {
            new o(this, a, b)
        })
    };
    return o
}(jQuery);
(function() {
    function a() {
        if (a.is(arguments[0], R)) {
            for (var b = arguments[0], e = ra[v](a, b.splice(0, 3 + a.is(b[0], N))), d = e.set(), g = 0, ab = b[t]; g < ab; g++) {
                var p = b[g] || {};
                f[k](p.type) && d[H](e[p.type]().attr(p))
            }
            return d
        }
        return ra[v](a, arguments)
    }

    function o() {
        for (var a = [], b = 0; b < 32; b++) a[b] = (~~(A.random() * 16))[X](16);
        a[12] = 4;
        a[16] = (a[16] & 3 | 8)[X](16);
        return "r-" + a[K]("")
    }

    function m(a, b, e) {
        function d() {
            var g = Array[h].slice.call(arguments, 0),
                p = g[K]("\u25ba"),
                f = d.cache = d.cache || {}, j = d.count = d.count || [];
            if (f[k](p)) return e ?
                e(f[p]) : f[p];
            j[t] >= 1E3 && delete f[j.shift()];
            j[H](p);
            f[p] = a[v](b, g);
            return e ? e(f[p]) : f[p]
        }
        return d
    }

    function b() {
        return this.x + z + this.y
    }

    function d(b) {
        return function(e, d, g, f) {
            var p = {
                back: b
            };
            a.is(g, "function") ? f = g : p.rot = g;
            e && e.constructor == G && (e = e.attrs.path);
            e && (p.along = e);
            return this.animate(p, d, f)
        }
    }

    function e(a, b, e, d, g, p) {
        function f(a, b) {
            var I, e, d, ba;
            for (d = a, e = 0; e < 8; e++) {
                ba = ((j * d + k) * d + h) * d - a;
                if (L(ba) < b) return d;
                I = (3 * j * d + 2 * k) * d + h;
                if (L(I) < 1.0E-6) break;
                d -= ba / I
            }
            I = 0;
            e = 1;
            d = a;
            if (d < I) return I;
            if (d > e) return e;
            for (; I < e;) {
                ba = ((j * d + k) * d + h) * d;
                if (L(ba - a) < b) break;
                a > ba ? I = d : e = d;
                d = (e - I) / 2 + I
            }
            return d
        }
        var h = 3 * b,
            k = 3 * (d - b) - h,
            j = 1 - h - k,
            s = 3 * e,
            q = 3 * (g - e) - s,
            l = 1 - s - q;
        return function(a, b) {
            var I = f(a, b);
            return ((l * I + q) * I + s) * I
        }(a, 1 / (200 * p))
    }
    a.version = "1.5.2";
    var g = /[, ]+/,
        f = {
            circle: 1,
            rect: 1,
            path: 1,
            ellipse: 1,
            text: 1,
            image: 1
        }, j = /\{(\d+)\}/g,
        h = "prototype",
        k = "hasOwnProperty",
        s = document,
        n = window,
        q = Object[h][k].call(n, "Raphael"),
        C = n.Raphael,
        l = function() {
            this.customAttributes = {}
        }, w, v = "apply",
        B = "createTouch" in s,
        z = " ",
        y = String,
        r = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend orientationchange touchcancel gesturestart gesturechange gestureend".split(z),
        u = {
            mousedown: "touchstart",
            mousemove: "touchmove",
            mouseup: "touchend"
        }, K = "join",
        t = "length",
        aa = y[h].toLowerCase,
        A = Math,
        Q = A.max,
        W = A.min,
        L = A.abs,
        J = A.pow,
        P = A.PI,
        N = "number",
        R = "array",
        X = "toString",
        bb = Object[h][X],
        H = "push",
        Da = /^url\(['"]?([^\)]+?)['"]?\)$/i,
        cb = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,
        db = {
            NaN: 1,
            Infinity: 1,
            "-Infinity": 1
        }, eb = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,
        O = A.round,
        E = parseFloat,
        Y = parseInt,
        ha = y[h].toUpperCase,
        ia = {
            blur: 0,
            "clip-rect": "0 0 1e9 1e9",
            cursor: "default",
            cx: 0,
            cy: 0,
            fill: "#fff",
            "fill-opacity": 1,
            font: '10px "Arial"',
            "font-family": '"Arial"',
            "font-size": "10",
            "font-style": "normal",
            "font-weight": 400,
            gradient: 0,
            height: 0,
            href: "http://raphaeljs.com/",
            opacity: 1,
            path: "M0,0",
            r: 0,
            rotation: 0,
            rx: 0,
            ry: 0,
            scale: "1 1",
            src: "",
            stroke: "#000",
            "stroke-dasharray": "",
            "stroke-linecap": "butt",
            "stroke-linejoin": "butt",
            "stroke-miterlimit": 0,
            "stroke-opacity": 1,
            "stroke-width": 1,
            target: "_blank",
            "text-anchor": "middle",
            title: "Raphael",
            translation: "0 0",
            width: 0,
            x: 0,
            y: 0
        }, sa = {
            along: "along",
            blur: N,
            "clip-rect": "csv",
            cx: N,
            cy: N,
            fill: "colour",
            "fill-opacity": N,
            "font-size": N,
            height: N,
            opacity: N,
            path: "path",
            r: N,
            rotation: "csv",
            rx: N,
            ry: N,
            scale: "csv",
            stroke: "colour",
            "stroke-opacity": N,
            "stroke-width": N,
            translation: "csv",
            width: N,
            x: N,
            y: N
        }, fb = /^(from|to|\d+%?)$/,
        ta = /\s*,\s*/,
        gb = {
            hs: 1,
            rg: 1
        }, hb = /,?([achlmqrstvxz]),?/gi,
        ib = /([achlmqstvz])[\s,]*((-?\d*\.?\d*(?:e[-+]?\d+)?\s*,?\s*)+)/ig,
        jb = /(-?\d*\.?\d*(?:e[-+]?\d+)?)\s*,?\s*/ig,
        Ea = /^r(?:\(([^,]+?)\s*,\s*([^\)]+?)\))?/,
        kb = function(a, b) {
            return a.key - b.key
        };
    a.type = n.SVGAngle || s.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML";
    if (a.type == "VML") {
        var T = s.createElement("div");
        T.innerHTML = '<v:shape adj="1"/>';
        T = T.firstChild;
        T.style.behavior = "url(#default#VML)";
        if (!(T && typeof T.adj == "object")) return a.type = null;
        T = null
    }
    a.svg = !(a.vml = a.type == "VML");
    l[h] = a[h];
    w = l[h];
    a._id = 0;
    a._oid = 0;
    a.fn = {};
    a.is = function(a, b) {
        b = aa.call(b);
        return b == "finite" ? !db[k](+a) : b == "null" && a === null || b == typeof a || b == "object" && a === Object(a) || b == "array" && Array.isArray && Array.isArray(a) || bb.call(a).slice(8, -1).toLowerCase() == b
    };
    a.angle = function(b, e, d, g, f, p) {
        return f == null ? (b -= d, e -= g, !b && !e ? 0 : ((b < 0) * 180 + A.atan(-e / -b) * 180 / P + 360) % 360) : a.angle(b, e, f, p) - a.angle(d, g, f, p)
    };
    a.rad = function(a) {
        return a % 360 * P / 180
    };
    a.deg = function(a) {
        return a * 180 / P % 360
    };
    a.snapTo =
        function(b, e, d) {
            d = a.is(d, "finite") ? d : 10;
            if (a.is(b, R))
                for (var g = b.length; g--;) {
                    if (L(b[g] - e) <= d) return b[g]
                } else {
                    b = +b;
                    g = e % b;
                    if (g < d) return e - g;
                    if (g > b - d) return e - g + b
                }
            return e
    };
    a.setWindow = function(a) {
        n = a;
        s = n.document
    };
    var ja = function(b) {
        if (a.vml) {
            var e = /^\s+|\s+$/g,
                d;
            try {
                var g = new ActiveXObject("htmlfile");
                g.write("<body>");
                g.close();
                d = g.body
            } catch (f) {
                d = createPopup().document.body
            }
            var p = d.createTextRange();
            ja = m(function(a) {
                try {
                    d.style.color = y(a).replace(e, "");
                    var b = p.queryCommandValue("ForeColor");
                    return "#" +
                        ("000000" + ((b & 255) << 16 | b & 65280 | (b & 16711680) >>> 16)[X](16)).slice(-6)
                } catch (I) {
                    return "none"
                }
            })
        } else {
            var h = s.createElement("i");
            h.title = "Rapha\u00ebl Colour Picker";
            h.style.display = "none";
            s.body.appendChild(h);
            ja = m(function(a) {
                h.style.color = a;
                return s.defaultView.getComputedStyle(h, "").getPropertyValue("color")
            })
        }
        return ja(b)
    }, Fa = function() {
            return "hsb(" + [this.h, this.s, this.b] + ")"
        }, lb = function() {
            return "hsl(" + [this.h, this.s, this.l] + ")"
        }, mb = function() {
            return this.hex
        };
    a.hsb2rgb = function(b, e, d, g) {
        if (a.is(b,
            "object") && "h" in b && "s" in b && "b" in b) d = b.b, e = b.s, b = b.h, g = b.o;
        return a.hsl2rgb(b, e, d / 2, g)
    };
    a.hsl2rgb = function(b, e, d, g) {
        if (a.is(b, "object") && "h" in b && "s" in b && "l" in b) d = b.l, e = b.s, b = b.h;
        if (b > 1 || e > 1 || d > 1) b /= 360, e /= 100, d /= 100;
        var f = {}, p = ["r", "g", "b"],
            h;
        if (e)
            for (var e = d < 0.5 ? d * (1 + e) : d + e - d * e, d = 2 * d - e, k = 0; k < 3; k++) h = b + 1 / 3 * -(k - 1), h < 0 && h++, h > 1 && h--, f[p[k]] = h * 6 < 1 ? d + (e - d) * 6 * h : h * 2 < 1 ? e : h * 3 < 2 ? d + (e - d) * (2 / 3 - h) * 6 : d;
        else f = {
            r: d,
            g: d,
            b: d
        };
        f.r *= 255;
        f.g *= 255;
        f.b *= 255;
        f.hex = "#" + (16777216 | f.b | f.g << 8 | f.r << 16).toString(16).slice(1);
        a.is(g, "finite") && (f.opacity = g);
        f.toString = mb;
        return f
    };
    a.rgb2hsb = function(b, e, d) {
        if (e == null && a.is(b, "object") && "r" in b && "g" in b && "b" in b) d = b.b, e = b.g, b = b.r;
        if (e == null && a.is(b, "string")) var g = a.getRGB(b),
        b = g.r, e = g.g, d = g.b;
        if (b > 1 || e > 1 || d > 1) b /= 255, e /= 255, d /= 255;
        var g = Q(b, e, d),
            f = W(b, e, d);
        if (f == g) return {
            h: 0,
            s: 0,
            b: g,
            toString: Fa
        };
        else f = g - f, b = b == g ? (e - d) / f : e == g ? 2 + (d - b) / f : 4 + (b - e) / f, b /= 6, b < 0 && b++, b > 1 && b--;
        return {
            h: b,
            s: f / g,
            b: g,
            toString: Fa
        }
    };
    a.rgb2hsl = function(b, e, d) {
        if (e == null && a.is(b, "object") && "r" in b && "g" in
            b && "b" in b) d = b.b, e = b.g, b = b.r;
        if (e == null && a.is(b, "string")) var g = a.getRGB(b),
        b = g.r, e = g.g, d = g.b;
        if (b > 1 || e > 1 || d > 1) b /= 255, e /= 255, d /= 255;
        var g = Q(b, e, d),
            f = W(b, e, d),
            p = (g + f) / 2;
        if (f == g) b = {
            h: 0,
            s: 0,
            l: p
        };
        else {
            var h = g - f,
                b = b == g ? (e - d) / h : e == g ? 2 + (d - b) / h : 4 + (b - e) / h;
            b /= 6;
            b < 0 && b++;
            b > 1 && b--;
            b = {
                h: b,
                s: p < 0.5 ? h / (g + f) : h / (2 - g - f),
                l: p
            }
        }
        b.toString = lb;
        return b
    };
    a._path2string = function() {
        return this.join(",").replace(hb, "$1")
    };
    a.getRGB = m(function(b) {
        if (!b || (b = y(b)).indexOf("-") + 1) return {
            r: -1,
            g: -1,
            b: -1,
            hex: "none",
            error: 1
        };
        if (b == "none") return {
            r: -1,
            g: -1,
            b: -1,
            hex: "none"
        };
        !(gb[k](b.toLowerCase().substring(0, 2)) || b.charAt() == "#") && (b = ja(b));
        var e, d, g, f, p;
        if (b = b.match(cb)) {
            b[2] && (g = Y(b[2].substring(5), 16), d = Y(b[2].substring(3, 5), 16), e = Y(b[2].substring(1, 3), 16));
            b[3] && (g = Y((p = b[3].charAt(3)) + p, 16), d = Y((p = b[3].charAt(2)) + p, 16), e = Y((p = b[3].charAt(1)) + p, 16));
            b[4] && (p = b[4].split(ta), e = E(p[0]), p[0].slice(-1) == "%" && (e *= 2.55), d = E(p[1]), p[1].slice(-1) == "%" && (d *= 2.55), g = E(p[2]), p[2].slice(-1) == "%" && (g *= 2.55), b[1].toLowerCase().slice(0, 4) == "rgba" && (f = E(p[3])),
                p[3] && p[3].slice(-1) == "%" && (f /= 100));
            if (b[5]) return p = b[5].split(ta), e = E(p[0]), p[0].slice(-1) == "%" && (e *= 2.55), d = E(p[1]), p[1].slice(-1) == "%" && (d *= 2.55), g = E(p[2]), p[2].slice(-1) == "%" && (g *= 2.55), (p[0].slice(-3) == "deg" || p[0].slice(-1) == "\u00b0") && (e /= 360), b[1].toLowerCase().slice(0, 4) == "hsba" && (f = E(p[3])), p[3] && p[3].slice(-1) == "%" && (f /= 100), a.hsb2rgb(e, d, g, f);
            if (b[6]) return p = b[6].split(ta), e = E(p[0]), p[0].slice(-1) == "%" && (e *= 2.55), d = E(p[1]), p[1].slice(-1) == "%" && (d *= 2.55), g = E(p[2]), p[2].slice(-1) == "%" &&
                (g *= 2.55), (p[0].slice(-3) == "deg" || p[0].slice(-1) == "\u00b0") && (e /= 360), b[1].toLowerCase().slice(0, 4) == "hsla" && (f = E(p[3])), p[3] && p[3].slice(-1) == "%" && (f /= 100), a.hsl2rgb(e, d, g, f);
            b = {
                r: e,
                g: d,
                b: g
            };
            b.hex = "#" + (16777216 | g | d << 8 | e << 16).toString(16).slice(1);
            a.is(f, "finite") && (b.opacity = f);
            return b
        }
        return {
            r: -1,
            g: -1,
            b: -1,
            hex: "none",
            error: 1
        }
    }, a);
    a.getColor = function(a) {
        var a = this.getColor.start = this.getColor.start || {
            h: 0,
            s: 1,
            b: a || 0.75
        }, b = this.hsb2rgb(a.h, a.s, a.b);
        a.h += 0.075;
        if (a.h > 1) a.h = 0, a.s -= 0.2, a.s <= 0 && (this.getColor.start = {
            h: 0,
            s: 1,
            b: a.b
        });
        return b.hex
    };
    a.getColor.reset = function() {
        delete this.start
    };
    a.parsePathString = m(function(b) {
        if (!b) return null;
        var e = {
            a: 7,
            c: 6,
            h: 1,
            l: 2,
            m: 2,
            q: 4,
            s: 4,
            t: 2,
            v: 1,
            z: 0
        }, d = [];
        a.is(b, R) && a.is(b[0], R) && (d = ka(b));
        d[t] || y(b).replace(ib, function(a, b, I) {
            var g = [],
                a = aa.call(b);
            I.replace(jb, function(a, b) {
                b && g[H](+b)
            });
            for (a == "m" && g[t] > 2 && (d[H]([b].concat(g.splice(0, 2))), a = "l", b = b == "m" ? "l" : "L"); g[t] >= e[a];)
                if (d[H]([b].concat(g.splice(0, e[a]))), !e[a]) break
        });
        d[X] = a._path2string;
        return d
    });
    a.findDotsAtSegment =
        function(a, b, e, d, g, p, f, h, k) {
            var j = 1 - k,
                s = J(j, 3) * a + J(j, 2) * 3 * k * e + j * 3 * k * k * g + J(k, 3) * f,
                j = J(j, 3) * b + J(j, 2) * 3 * k * d + j * 3 * k * k * p + J(k, 3) * h,
                q = a + 2 * k * (e - a) + k * k * (g - 2 * e + a),
                l = b + 2 * k * (d - b) + k * k * (p - 2 * d + b),
                r = e + 2 * k * (g - e) + k * k * (f - 2 * g + e),
                n = d + 2 * k * (p - d) + k * k * (h - 2 * p + d),
                a = (1 - k) * a + k * e,
                b = (1 - k) * b + k * d,
                g = (1 - k) * g + k * f,
                p = (1 - k) * p + k * h,
                h = 90 - A.atan((q - r) / (l - n)) * 180 / P;
            (q > r || l < n) && (h += 180);
            return {
                x: s,
                y: j,
                m: {
                    x: q,
                    y: l
                },
                n: {
                    x: r,
                    y: n
                },
                start: {
                    x: a,
                    y: b
                },
                end: {
                    x: g,
                    y: p
                },
                alpha: h
            }
    };
    var ma = m(function(a) {
        if (!a) return {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
        for (var a = la(a), b =
                0, e = 0, d = [], g = [], p, f = 0, h = a[t]; f < h; f++) p = a[f], p[0] == "M" ? (b = p[1], e = p[2], d[H](b), g[H](e)) : (b = nb(b, e, p[1], p[2], p[3], p[4], p[5], p[6]), d = d.concat(b.min.x, b.max.x), g = g.concat(b.min.y, b.max.y), b = p[5], e = p[6]);
        a = W[v](0, d);
        p = W[v](0, g);
        return {
            x: a,
            y: p,
            width: Q[v](0, d) - a,
            height: Q[v](0, g) - p
        }
    }),
        ka = function(b) {
            var e = [];
            if (!a.is(b, R) || !a.is(b && b[0], R)) b = a.parsePathString(b);
            for (var d = 0, g = b[t]; d < g; d++) {
                e[d] = [];
                for (var f = 0, p = b[d][t]; f < p; f++) e[d][f] = b[d][f]
            }
            e[X] = a._path2string;
            return e
        }, ua = m(function(b) {
            if (!a.is(b, R) || !a.is(b &&
                b[0], R)) b = a.parsePathString(b);
            var e = [],
                d = 0,
                g = 0,
                f = 0,
                p = 0,
                h = 0;
            b[0][0] == "M" && (d = b[0][1], g = b[0][2], f = d, p = g, h++, e[H](["M", d, g]));
            for (var k = b[t]; h < k; h++) {
                var j = e[h] = [],
                    D = b[h];
                if (D[0] != aa.call(D[0])) switch (j[0] = aa.call(D[0]), j[0]) {
                    case "a":
                        j[1] = D[1];
                        j[2] = D[2];
                        j[3] = D[3];
                        j[4] = D[4];
                        j[5] = D[5];
                        j[6] = +(D[6] - d).toFixed(3);
                        j[7] = +(D[7] - g).toFixed(3);
                        break;
                    case "v":
                        j[1] = +(D[1] - g).toFixed(3);
                        break;
                    case "m":
                        f = D[1], p = D[2];
                    default:
                        for (var s = 1, q = D[t]; s < q; s++) j[s] = +(D[s] - (s % 2 ? d : g)).toFixed(3)
                } else {
                    e[h] = [];
                    D[0] == "m" && (f =
                        D[1] + d, p = D[2] + g);
                    j = 0;
                    for (s = D[t]; j < s; j++) e[h][j] = D[j]
                }
                D = e[h][t];
                switch (e[h][0]) {
                    case "z":
                        d = f;
                        g = p;
                        break;
                    case "h":
                        d += +e[h][D - 1];
                        break;
                    case "v":
                        g += +e[h][D - 1];
                        break;
                    default:
                        d += +e[h][D - 2], g += +e[h][D - 1]
                }
            }
            e[X] = a._path2string;
            return e
        }, 0, ka),
        ea = m(function(b) {
            if (!a.is(b, R) || !a.is(b && b[0], R)) b = a.parsePathString(b);
            var e = [],
                d = 0,
                g = 0,
                f = 0,
                p = 0,
                h = 0;
            b[0][0] == "M" && (d = +b[0][1], g = +b[0][2], f = d, p = g, h++, e[0] = ["M", d, g]);
            for (var k = b[t]; h < k; h++) {
                var j = e[h] = [],
                    D = b[h];
                if (D[0] != ha.call(D[0])) switch (j[0] = ha.call(D[0]), j[0]) {
                    case "A":
                        j[1] =
                            D[1];
                        j[2] = D[2];
                        j[3] = D[3];
                        j[4] = D[4];
                        j[5] = D[5];
                        j[6] = +(D[6] + d);
                        j[7] = +(D[7] + g);
                        break;
                    case "V":
                        j[1] = +D[1] + g;
                        break;
                    case "H":
                        j[1] = +D[1] + d;
                        break;
                    case "M":
                        f = +D[1] + d, p = +D[2] + g;
                    default:
                        for (var s = 1, q = D[t]; s < q; s++) j[s] = +D[s] + (s % 2 ? d : g)
                } else {
                    s = 0;
                    for (q = D[t]; s < q; s++) e[h][s] = D[s]
                }
                switch (j[0]) {
                    case "Z":
                        d = f;
                        g = p;
                        break;
                    case "H":
                        d = j[1];
                        break;
                    case "V":
                        g = j[1];
                        break;
                    case "M":
                        f = e[h][e[h][t] - 2], p = e[h][e[h][t] - 1];
                    default:
                        d = e[h][e[h][t] - 2], g = e[h][e[h][t] - 1]
                }
            }
            e[X] = a._path2string;
            return e
        }, null, ka),
        Ga = function(a, b, e, d, g, p) {
            var f =
                1 / 3,
                h = 2 / 3;
            return [f * a + h * e, f * b + h * d, f * g + h * e, f * p + h * d, g, p]
        }, Ha = function(a, b, e, d, g, p, f, h, k, j) {
            var s = P * 120 / 180,
                q = P / 180 * (+g || 0),
                l = [],
                r, n = m(function(a, b, e) {
                    var d = a * A.cos(e) - b * A.sin(e),
                        a = a * A.sin(e) + b * A.cos(e);
                    return {
                        x: d,
                        y: a
                    }
                });
            if (j) u = j[0], r = j[1], p = j[2], o = j[3];
            else {
                r = n(a, b, -q);
                a = r.x;
                b = r.y;
                r = n(h, k, -q);
                h = r.x;
                k = r.y;
                A.cos(P / 180 * g);
                A.sin(P / 180 * g);
                r = (a - h) / 2;
                u = (b - k) / 2;
                o = r * r / (e * e) + u * u / (d * d);
                o > 1 && (o = A.sqrt(o), e *= o, d *= o);
                var o = e * e,
                    C = d * d,
                    o = (p == f ? -1 : 1) * A.sqrt(L((o * C - o * u * u - C * r * r) / (o * u * u + C * r * r))),
                    p = o * e * u / d + (a + h) / 2,
                    o = o * -d *
                        r / e + (b + k) / 2,
                    u = A.asin(((b - o) / d).toFixed(9));
                r = A.asin(((k - o) / d).toFixed(9));
                u = a < p ? P - u : u;
                r = h < p ? P - r : r;
                u < 0 && (u = P * 2 + u);
                r < 0 && (r = P * 2 + r);
                f && u > r && (u -= P * 2);
                !f && r > u && (r -= P * 2)
            } if (L(r - u) > s) {
                var l = r,
                    C = h,
                    v = k;
                r = u + s * (f && r > u ? 1 : -1);
                h = p + e * A.cos(r);
                k = o + d * A.sin(r);
                l = Ha(h, k, e, d, g, 0, f, C, v, [r, l, p, o])
            }
            p = r - u;
            g = A.cos(u);
            s = A.sin(u);
            f = A.cos(r);
            r = A.sin(r);
            p = A.tan(p / 4);
            e = 4 / 3 * e * p;
            p *= 4 / 3 * d;
            d = [a, b];
            a = [a + e * s, b - p * g];
            b = [h + e * r, k - p * f];
            h = [h, k];
            a[0] = 2 * d[0] - a[0];
            a[1] = 2 * d[1] - a[1];
            if (j) return [a, b, h].concat(l);
            else {
                l = [a, b, h].concat(l)[K]().split(",");
                j = [];
                h = 0;
                for (k = l[t]; h < k; h++) j[h] = h % 2 ? n(l[h - 1], l[h], q).y : n(l[h], l[h + 1], q).x;
                return j
            }
        }, na = function(a, b, e, d, g, p, f, h, k) {
            var j = 1 - k;
            return {
                x: J(j, 3) * a + J(j, 2) * 3 * k * e + j * 3 * k * k * g + J(k, 3) * f,
                y: J(j, 3) * b + J(j, 2) * 3 * k * d + j * 3 * k * k * p + J(k, 3) * h
            }
        }, nb = m(function(a, b, e, d, g, p, f, h) {
            var k = g - 2 * e + a - (f - 2 * g + e),
                j = 2 * (e - a) - 2 * (g - e),
                s = a - e,
                r = (-j + A.sqrt(j * j - 4 * k * s)) / 2 / k,
                k = (-j - A.sqrt(j * j - 4 * k * s)) / 2 / k,
                q = [b, h],
                l = [a, f];
            L(r) > "1e12" && (r = 0.5);
            L(k) > "1e12" && (k = 0.5);
            r > 0 && r < 1 && (r = na(a, b, e, d, g, p, f, h, r), l[H](r.x), q[H](r.y));
            k > 0 && k < 1 && (r = na(a, b, e, d, g, p,
                f, h, k), l[H](r.x), q[H](r.y));
            k = p - 2 * d + b - (h - 2 * p + d);
            j = 2 * (d - b) - 2 * (p - d);
            s = b - d;
            r = (-j + A.sqrt(j * j - 4 * k * s)) / 2 / k;
            k = (-j - A.sqrt(j * j - 4 * k * s)) / 2 / k;
            L(r) > "1e12" && (r = 0.5);
            L(k) > "1e12" && (k = 0.5);
            r > 0 && r < 1 && (r = na(a, b, e, d, g, p, f, h, r), l[H](r.x), q[H](r.y));
            k > 0 && k < 1 && (r = na(a, b, e, d, g, p, f, h, k), l[H](r.x), q[H](r.y));
            return {
                min: {
                    x: W[v](0, l),
                    y: W[v](0, q)
                },
                max: {
                    x: Q[v](0, l),
                    y: Q[v](0, q)
                }
            }
        }),
        la = m(function(a, b) {
            var e = ea(a),
                d = b && ea(b),
                g = {
                    x: 0,
                    y: 0,
                    bx: 0,
                    by: 0,
                    X: 0,
                    Y: 0,
                    qx: null,
                    qy: null
                }, f = {
                    x: 0,
                    y: 0,
                    bx: 0,
                    by: 0,
                    X: 0,
                    Y: 0,
                    qx: null,
                    qy: null
                }, h = function(a,
                    b) {
                    var e, d;
                    if (!a) return ["C", b.x, b.y, b.x, b.y, b.x, b.y];
                    !(a[0] in {
                        T: 1,
                        Q: 1
                    }) && (b.qx = b.qy = null);
                    switch (a[0]) {
                        case "M":
                            b.X = a[1];
                            b.Y = a[2];
                            break;
                        case "A":
                            a = ["C"].concat(Ha[v](0, [b.x, b.y].concat(a.slice(1))));
                            break;
                        case "S":
                            e = b.x + (b.x - (b.bx || b.x));
                            d = b.y + (b.y - (b.by || b.y));
                            a = ["C", e, d].concat(a.slice(1));
                            break;
                        case "T":
                            b.qx = b.x + (b.x - (b.qx || b.x));
                            b.qy = b.y + (b.y - (b.qy || b.y));
                            a = ["C"].concat(Ga(b.x, b.y, b.qx, b.qy, a[1], a[2]));
                            break;
                        case "Q":
                            b.qx = a[1];
                            b.qy = a[2];
                            a = ["C"].concat(Ga(b.x, b.y, a[1], a[2], a[3], a[4]));
                            break;
                        case "L":
                            a = ["C"].concat([b.x, b.y, a[1], a[2], a[1], a[2]]);
                            break;
                        case "H":
                            a = ["C"].concat([b.x, b.y, a[1], b.y, a[1], b.y]);
                            break;
                        case "V":
                            a = ["C"].concat([b.x, b.y, b.x, a[1], b.x, a[1]]);
                            break;
                        case "Z":
                            a = ["C"].concat([b.x, b.y, b.X, b.Y, b.X, b.Y])
                    }
                    return a
                }, k = function(a, b) {
                    if (a[b][t] > 7) {
                        a[b].shift();
                        for (var I = a[b]; I[t];) a.splice(b++, 0, ["C"].concat(I.splice(0, 6)));
                        a.splice(b, 1);
                        r = Q(e[t], d && d[t] || 0)
                    }
                }, j = function(a, b, I, g, f) {
                    if (a && b && a[f][0] == "M" && b[f][0] != "M") b.splice(f, 0, ["M", g.x, g.y]), I.bx = 0, I.by = 0, I.x = a[f][1], I.y = a[f][2], r = Q(e[t],
                        d && d[t] || 0)
                }, s = 0,
                r = Q(e[t], d && d[t] || 0);
            for (; s < r; s++) {
                e[s] = h(e[s], g);
                k(e, s);
                d && (d[s] = h(d[s], f));
                d && k(d, s);
                j(e, d, g, f, s);
                j(d, e, f, g, s);
                var q = e[s],
                    l = d && d[s],
                    n = q[t],
                    m = d && l[t];
                g.x = q[n - 2];
                g.y = q[n - 1];
                g.bx = E(q[n - 4]) || g.x;
                g.by = E(q[n - 3]) || g.y;
                f.bx = d && (E(l[m - 4]) || f.x);
                f.by = d && (E(l[m - 3]) || f.y);
                f.x = d && l[m - 2];
                f.y = d && l[m - 1]
            }
            return d ? [e, d] : e
        }, null, ka),
        Ia = m(function(b) {
            for (var e = [], d = 0, g = b[t]; d < g; d++) {
                var f = {}, p = b[d].match(/^([^:]*):?([\d\.]*)/);
                f.color = a.getRGB(p[1]);
                if (f.color.error) return null;
                f.color = f.color.hex;
                p[2] && (f.offset = p[2] + "%");
                e[H](f)
            }
            for (d = 1, g = e[t] - 1; d < g; d++)
                if (!e[d].offset) {
                    b = E(e[d - 1].offset || 0);
                    p = 0;
                    for (f = d + 1; f < g; f++)
                        if (e[f].offset) {
                            p = e[f].offset;
                            break
                        }
                    p || (p = 100, f = g);
                    p = E(p);
                    for (p = (p - b) / (f - d + 1); d < f; d++) b += p, e[d].offset = b + "%"
                }
            return e
        }),
        Ja = function(b, e, d, g) {
            if (a.is(b, "string") || a.is(b, "object")) {
                if (b = a.is(b, "string") ? s.getElementById(b) : b, b.tagName) return e == null ? {
                    container: b,
                    width: b.style.pixelWidth || b.offsetWidth,
                    height: b.style.pixelHeight || b.offsetHeight
                } : {
                    container: b,
                    width: e,
                    height: d
                }
            } else return {
                container: 1,
                x: b,
                y: e,
                width: d,
                height: g
            }
        }, va = function(a, b) {
            var e = this,
                d;
            for (d in b)
                if (b[k](d) && !(d in a)) switch (typeof b[d]) {
                    case "function":
                        (function(b) {
                            a[d] = a === e ? b : function() {
                                return b[v](e, arguments)
                            }
                        })(b[d]);
                        break;
                    case "object":
                        a[d] = a[d] || {};
                        va.call(this, a[d], b[d]);
                        break;
                    default:
                        a[d] = b[d]
                }
        }, ca = function(a, b) {
            a == b.top && (b.top = a.prev);
            a == b.bottom && (b.bottom = a.next);
            a.next && (a.next.prev = a.prev);
            a.prev && (a.prev.next = a.next)
        }, Ka = function(a, b) {
            if (b.top !== a) ca(a, b), a.next = null, a.prev = b.top, b.top.next = a, b.top = a
        }, La =
            function(a, b) {
                if (b.bottom !== a) ca(a, b), a.next = b.bottom, a.prev = null, b.bottom.prev = a, b.bottom = a
        }, Ma = function(a, b, e) {
            ca(a, e);
            b == e.top && (e.top = a);
            b.next && (b.next.prev = a);
            a.next = b.next;
            a.prev = b;
            b.next = a
        }, Na = function(a, b, e) {
            ca(a, e);
            b == e.bottom && (e.bottom = a);
            b.prev && (b.prev.next = a);
            a.prev = b.prev;
            b.prev = a;
            a.next = b
        }, Oa = function(a) {
            return function() {
                throw Error("Rapha\u00ebl: you are calling to method \u201c" + a + "\u201d of removed object");
            }
        };
    a.pathToRelative = ua;
    if (a.svg) {
        w.svgns = "http://www.w3.org/2000/svg";
        w.xlink = "http://www.w3.org/1999/xlink";
        var O = function(a) {
            return +a + (~~a === a) * 0.5
        }, x = function(a, b) {
                if (b)
                    for (var e in b) b[k](e) && a.setAttribute(e, y(b[e]));
                else return a = s.createElementNS(w.svgns, a), a.style.webkitTapHighlightColor = "rgba(0,0,0,0)", a
            };
        a[X] = function() {
            return "Your browser supports SVG.\nYou are running Rapha\u00ebl " + this.version
        };
        var Pa = function(a, b) {
            var e = x("path");
            b.canvas && b.canvas.appendChild(e);
            e = new G(e, b);
            e.type = "path";
            Z(e, {
                fill: "none",
                stroke: "#000",
                path: a
            });
            return e
        }, fa = function(a,
                b, e) {
                var d = "linear",
                    g = 0.5,
                    f = 0.5,
                    h = a.style,
                    b = y(b).replace(Ea, function(a, b, e) {
                        d = "radial";
                        b && e && (g = E(b), f = E(e), a = (f > 0.5) * 2 - 1, J(g - 0.5, 2) + J(f - 0.5, 2) > 0.25 && (f = A.sqrt(0.25 - J(g - 0.5, 2)) * a + 0.5) && f != 0.5 && (f = f.toFixed(5) - 1.0E-5 * a));
                        return ""
                    }),
                    b = b.split(/\s*\-\s*/);
                if (d == "linear") {
                    var k = b.shift(),
                        k = -E(k);
                    if (isNaN(k)) return null;
                    var k = [0, 0, A.cos(k * P / 180), A.sin(k * P / 180)],
                        j = 1 / (Q(L(k[2]), L(k[3])) || 1);
                    k[2] *= j;
                    k[3] *= j;
                    k[2] < 0 && (k[0] = -k[2], k[2] = 0);
                    k[3] < 0 && (k[1] = -k[3], k[3] = 0)
                }
                b = Ia(b);
                if (!b) return null;
                j = a.getAttribute("fill");
                (j = j.match(/^url\(#(.*)\)$/)) && e.defs.removeChild(s.getElementById(j[1]));
                j = x(d + "Gradient");
                j.id = o();
                x(j, d == "radial" ? {
                    fx: g,
                    fy: f
                } : {
                    x1: k[0],
                    y1: k[1],
                    x2: k[2],
                    y2: k[3]
                });
                e.defs.appendChild(j);
                e = 0;
                for (k = b[t]; e < k; e++) {
                    var r = x("stop");
                    x(r, {
                        offset: b[e].offset ? b[e].offset : !e ? "0%" : "100%",
                        "stop-color": b[e].color || "#fff"
                    });
                    j.appendChild(r)
                }
                x(a, {
                    fill: "url(#" + j.id + ")",
                    opacity: 1,
                    "fill-opacity": 1
                });
                h.fill = "";
                h.opacity = 1;
                return h.fillOpacity = 1
            }, wa = function(b) {
                var e = b.getBBox();
                x(b.pattern, {
                    patternTransform: a.format("translate({0},{1})",
                        e.x, e.y)
                })
            }, Z = function(b, e) {
                var d = {
                    "": [0],
                    none: [0],
                    "-": [3, 1],
                    ".": [1, 1],
                    "-.": [3, 1, 1, 1],
                    "-..": [3, 1, 1, 1, 1, 1],
                    ". ": [1, 3],
                    "- ": [4, 3],
                    "--": [8, 3],
                    "- .": [4, 3, 1, 3],
                    "--.": [8, 3, 1, 3],
                    "--..": [8, 3, 1, 3, 1, 3]
                }, f = b.node,
                    h = b.attrs,
                    p = b.rotate(),
                    j = function(a, b) {
                        if (b = d[aa.call(b)]) {
                            for (var g = a.attrs["stroke-width"] || "1", I = {
                                    round: g,
                                    square: g,
                                    butt: 0
                                }[a.attrs["stroke-linecap"] || e["stroke-linecap"]] || 0, h = [], p = b[t]; p--;) h[p] = b[p] * g + (p % 2 ? 1 : -1) * I;
                            x(f, {
                                "stroke-dasharray": h[K](",")
                            })
                        }
                    };
                e[k]("rotation") && (p = e.rotation);
                var r = y(p).split(g);
                r.length - 1 ? (r[1] = +r[1], r[2] = +r[2]) : r = null;
                E(p) && b.rotate(0, true);
                for (var q in e)
                    if (e[k](q) && ia[k](q)) {
                        var l = e[q];
                        h[q] = l;
                        switch (q) {
                            case "blur":
                                b.blur(l);
                                break;
                            case "rotation":
                                b.rotate(l, true);
                                break;
                            case "href":
                            case "title":
                            case "target":
                                var n = f.parentNode;
                                if (aa.call(n.tagName) != "a") {
                                    var m = x("a");
                                    n.insertBefore(m, f);
                                    m.appendChild(f);
                                    n = m
                                }
                                q == "target" && l == "blank" ? n.setAttributeNS(b.paper.xlink, "show", "new") : n.setAttributeNS(b.paper.xlink, q, l);
                                break;
                            case "cursor":
                                f.style.cursor = l;
                                break;
                            case "clip-rect":
                                n =
                                    y(l).split(g);
                                if (n[t] == 4) {
                                    b.clip && b.clip.parentNode.parentNode.removeChild(b.clip.parentNode);
                                    var u = x("clipPath"),
                                        m = x("rect");
                                    u.id = o();
                                    x(m, {
                                        x: n[0],
                                        y: n[1],
                                        width: n[2],
                                        height: n[3]
                                    });
                                    u.appendChild(m);
                                    b.paper.defs.appendChild(u);
                                    x(f, {
                                        "clip-path": "url(#" + u.id + ")"
                                    });
                                    b.clip = m
                                }
                                l || ((l = s.getElementById(f.getAttribute("clip-path").replace(/(^url\(#|\)$)/g, ""))) && l.parentNode.removeChild(l), x(f, {
                                    "clip-path": ""
                                }), delete b.clip);
                                break;
                            case "path":
                                if (b.type == "path") x(f, {
                                    d: l ? h.path = ea(l) : "M0,0"
                                });
                                break;
                            case "width":
                                if (f.setAttribute(q,
                                    l), h.fx) q = "x", l = h.x;
                                else break;
                            case "x":
                                h.fx && (l = -h.x - (h.width || 0));
                            case "rx":
                                if (q == "rx" && b.type == "rect") break;
                            case "cx":
                                r && (q == "x" || q == "cx") && (r[1] += l - h[q]);
                                f.setAttribute(q, l);
                                b.pattern && wa(b);
                                break;
                            case "height":
                                if (f.setAttribute(q, l), h.fy) q = "y", l = h.y;
                                else break;
                            case "y":
                                h.fy && (l = -h.y - (h.height || 0));
                            case "ry":
                                if (q == "ry" && b.type == "rect") break;
                            case "cy":
                                r && (q == "y" || q == "cy") && (r[2] += l - h[q]);
                                f.setAttribute(q, l);
                                b.pattern && wa(b);
                                break;
                            case "r":
                                b.type == "rect" ? x(f, {
                                    rx: l,
                                    ry: l
                                }) : f.setAttribute(q, l);
                                break;
                            case "src":
                                b.type == "image" && f.setAttributeNS(b.paper.xlink, "href", l);
                                break;
                            case "stroke-width":
                                f.style.strokeWidth = l;
                                f.setAttribute(q, l);
                                h["stroke-dasharray"] && j(b, h["stroke-dasharray"]);
                                break;
                            case "stroke-dasharray":
                                j(b, l);
                                break;
                            case "translation":
                                l = y(l).split(g);
                                l[0] = +l[0] || 0;
                                l[1] = +l[1] || 0;
                                r && (r[1] += l[0], r[2] += l[1]);
                                oa.call(b, l[0], l[1]);
                                break;
                            case "scale":
                                l = y(l).split(g);
                                b.scale(+l[0] || 1, +l[1] || +l[0] || 1, isNaN(E(l[2])) ? null : +l[2], isNaN(E(l[3])) ? null : +l[3]);
                                break;
                            case "fill":
                                if (n = y(l).match(Da)) {
                                    var u =
                                        x("pattern"),
                                        C = x("image");
                                    u.id = o();
                                    x(u, {
                                        x: 0,
                                        y: 0,
                                        patternUnits: "userSpaceOnUse",
                                        height: 1,
                                        width: 1
                                    });
                                    x(C, {
                                        x: 0,
                                        y: 0
                                    });
                                    C.setAttributeNS(b.paper.xlink, "href", n[1]);
                                    u.appendChild(C);
                                    l = s.createElement("img");
                                    l.style.cssText = "position:absolute;left:-9999em;top-9999em";
                                    l.onload = function() {
                                        x(u, {
                                            width: this.offsetWidth,
                                            height: this.offsetHeight
                                        });
                                        x(C, {
                                            width: this.offsetWidth,
                                            height: this.offsetHeight
                                        });
                                        s.body.removeChild(this);
                                        b.paper.safari()
                                    };
                                    s.body.appendChild(l);
                                    l.src = n[1];
                                    b.paper.defs.appendChild(u);
                                    f.style.fill =
                                        "url(#" + u.id + ")";
                                    x(f, {
                                        fill: "url(#" + u.id + ")"
                                    });
                                    b.pattern = u;
                                    b.pattern && wa(b);
                                    break
                                }
                                n = a.getRGB(l);
                                if (n.error) {
                                    if (({
                                        circle: 1,
                                        ellipse: 1
                                    }[k](b.type) || y(l).charAt() != "r") && fa(f, l, b.paper)) {
                                        h.gradient = l;
                                        h.fill = "none";
                                        break
                                    }
                                } else delete e.gradient, delete h.gradient, !a.is(h.opacity, "undefined") && a.is(e.opacity, "undefined") && x(f, {
                                    opacity: h.opacity
                                }), !a.is(h["fill-opacity"], "undefined") && a.is(e["fill-opacity"], "undefined") && x(f, {
                                    "fill-opacity": h["fill-opacity"]
                                });
                                n[k]("opacity") && x(f, {
                                    "fill-opacity": n.opacity > 1 ? n.opacity / 100 : n.opacity
                                });
                            case "stroke":
                                n = a.getRGB(l);
                                f.setAttribute(q, n.hex);
                                q == "stroke" && n[k]("opacity") && x(f, {
                                    "stroke-opacity": n.opacity > 1 ? n.opacity / 100 : n.opacity
                                });
                                break;
                            case "gradient":
                                (({
                                    circle: 1,
                                    ellipse: 1
                                })[k](b.type) || y(l).charAt() != "r") && fa(f, l, b.paper);
                                break;
                            case "opacity":
                                h.gradient && !h[k]("stroke-opacity") && x(f, {
                                    "stroke-opacity": l > 1 ? l / 100 : l
                                });
                            case "fill-opacity":
                                if (h.gradient) {
                                    if (n = s.getElementById(f.getAttribute("fill").replace(/^url\(#|\)$/g, ""))) n = n.getElementsByTagName("stop"), n[n[t] -
                                        1].setAttribute("stop-opacity", l);
                                    break
                                }
                            default:
                                q == "font-size" && (l = Y(l, 10) + "px"), n = q.replace(/(\-.)/g, function(a) {
                                    return ha.call(a.substring(1))
                                }), f.style[n] = l, f.setAttribute(q, l)
                        }
                    }
                ob(b, e);
                r ? b.rotate(r.join(z)) : E(p) && b.rotate(p, true)
            }, ob = function(b, e) {
                if (!(b.type != "text" || !e[k]("text") && !e[k]("font") && !e[k]("font-size") && !e[k]("x") && !e[k]("y"))) {
                    var d = b.attrs,
                        g = b.node,
                        f = g.firstChild ? Y(s.defaultView.getComputedStyle(g.firstChild, "").getPropertyValue("font-size"), 10) : 10;
                    if (e[k]("text")) {
                        for (d.text =
                            e.text; g.firstChild;) g.removeChild(g.firstChild);
                        for (var h = y(e.text).split("\n"), j = 0, l = h[t]; j < l; j++)
                            if (h[j]) {
                                var r = x("tspan");
                                j && x(r, {
                                    dy: f * 1.2,
                                    x: d.x
                                });
                                r.appendChild(s.createTextNode(h[j]));
                                g.appendChild(r)
                            }
                    } else {
                        h = g.getElementsByTagName("tspan");
                        for (j = 0, l = h[t]; j < l; j++) j && x(h[j], {
                            dy: f * 1.2,
                            x: d.x
                        })
                    }
                    x(g, {
                        y: d.y
                    });
                    f = b.getBBox();
                    (f = d.y - (f.y + f.height / 2)) && a.is(f, "finite") && x(g, {
                        y: d.y + f
                    })
                }
            }, G = function(b, e) {
                this[0] = b;
                this.id = a._oid++;
                this.node = b;
                b.raphael = this;
                this.paper = e;
                this.attrs = this.attrs || {};
                this.transformations = [];
                this._ = {
                    tx: 0,
                    ty: 0,
                    rt: {
                        deg: 0,
                        cx: 0,
                        cy: 0
                    },
                    sx: 1,
                    sy: 1
                };
                !e.bottom && (e.bottom = this);
                (this.prev = e.top) && (e.top.next = this);
                e.top = this;
                this.next = null
            }, F = G[h];
        G[h].rotate = function(b, e, d) {
            if (this.removed) return this;
            if (b == null) return this._.rt.cx ? [this._.rt.deg, this._.rt.cx, this._.rt.cy][K](z) : this._.rt.deg;
            var f = this.getBBox(),
                b = y(b).split(g);
            b[t] - 1 && (e = E(b[1]), d = E(b[2]));
            b = E(b[0]);
            e != null && e !== false ? this._.rt.deg = b : this._.rt.deg += b;
            d == null && (e = null);
            this._.rt.cx = e;
            this._.rt.cy = d;
            e = e == null ? f.x + f.width / 2 :
                e;
            d = d == null ? f.y + f.height / 2 : d;
            this._.rt.deg ? (this.transformations[0] = a.format("rotate({0} {1} {2})", this._.rt.deg, e, d), this.clip && x(this.clip, {
                transform: a.format("rotate({0} {1} {2})", -this._.rt.deg, e, d)
            })) : (this.transformations[0] = "", this.clip && x(this.clip, {
                transform: ""
            }));
            x(this.node, {
                transform: this.transformations[K](z)
            });
            return this
        };
        G[h].hide = function() {
            !this.removed && (this.node.style.display = "none");
            return this
        };
        G[h].show = function() {
            !this.removed && (this.node.style.display = "");
            return this
        };
        G[h].remove =
            function() {
                if (!this.removed) {
                    ca(this, this.paper);
                    this.node.parentNode.removeChild(this.node);
                    for (var a in this) delete this[a];
                    this.removed = true
                }
        };
        G[h].getBBox = function() {
            if (this.removed) return this;
            if (this.type == "path") return ma(this.attrs.path);
            if (this.node.style.display == "none") {
                this.show();
                var a = true
            }
            var b = {};
            try {
                b = this.node.getBBox()
            } catch (e) {} finally {
                b = b || {}
            }
            if (this.type == "text")
                for (var b = {
                    x: b.x,
                    y: Infinity,
                    width: 0,
                    height: 0
                }, d = 0, g = this.node.getNumberOfChars(); d < g; d++) {
                    var f = this.node.getExtentOfChar(d);
                    f.y < b.y && (b.y = f.y);
                    f.y + f.height - b.y > b.height && (b.height = f.y + f.height - b.y);
                    f.x + f.width - b.x > b.width && (b.width = f.x + f.width - b.x)
                }
            a && this.hide();
            return b
        };
        G[h].attr = function(b, e) {
            if (this.removed) return this;
            if (b == null) {
                var d = {}, g;
                for (g in this.attrs) this.attrs[k](g) && (d[g] = this.attrs[g]);
                this._.rt.deg && (d.rotation = this.rotate());
                (this._.sx != 1 || this._.sy != 1) && (d.scale = this.scale());
                d.gradient && d.fill == "none" && (d.fill = d.gradient) && delete d.gradient;
                return d
            }
            if (e == null && a.is(b, "string")) return b == "translation" ?
                oa.call(this) : b == "rotation" ? this.rotate() : b == "scale" ? this.scale() : b == "fill" && this.attrs.fill == "none" && this.attrs.gradient ? this.attrs.gradient : this.attrs[b];
            if (e == null && a.is(b, R)) {
                g = {};
                for (var d = 0, f = b.length; d < f; d++) g[b[d]] = this.attr(b[d]);
                return g
            }
            e != null ? (d = {}, d[b] = e) : b != null && a.is(b, "object") && (d = b);
            for (f in this.paper.customAttributes)
                if (this.paper.customAttributes[k](f) && d[k](f) && a.is(this.paper.customAttributes[f], "function")) {
                    g = this.paper.customAttributes[f].apply(this, [].concat(d[f]));
                    this.attrs[f] =
                        d[f];
                    for (var h in g) g[k](h) && (d[h] = g[h])
                }
            Z(this, d);
            return this
        };
        G[h].toFront = function() {
            if (this.removed) return this;
            this.node.parentNode.appendChild(this.node);
            var a = this.paper;
            a.top != this && Ka(this, a);
            return this
        };
        G[h].toBack = function() {
            if (this.removed) return this;
            this.node.parentNode.firstChild != this.node && (this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild), La(this, this.paper));
            return this
        };
        G[h].insertAfter = function(a) {
            if (this.removed) return this;
            var b = a.node || a[a.length -
                1].node;
            b.nextSibling ? b.parentNode.insertBefore(this.node, b.nextSibling) : b.parentNode.appendChild(this.node);
            Ma(this, a, this.paper);
            return this
        };
        G[h].insertBefore = function(a) {
            if (this.removed) return this;
            var b = a.node || a[0].node;
            b.parentNode.insertBefore(this.node, b);
            Na(this, a, this.paper);
            return this
        };
        G[h].blur = function(a) {
            if (+a !== 0) {
                var b = x("filter"),
                    e = x("feGaussianBlur");
                this.attrs.blur = a;
                b.id = o();
                x(e, {
                    stdDeviation: +a || 1.5
                });
                b.appendChild(e);
                this.paper.defs.appendChild(b);
                this._blur = b;
                x(this.node, {
                    filter: "url(#" + b.id + ")"
                })
            } else this._blur && (this._blur.parentNode.removeChild(this._blur), delete this._blur, delete this.attrs.blur), this.node.removeAttribute("filter")
        };
        var Qa = function(a, b, e, d) {
            var g = x("circle");
            a.canvas && a.canvas.appendChild(g);
            a = new G(g, a);
            a.attrs = {
                cx: b,
                cy: e,
                r: d,
                fill: "none",
                stroke: "#000"
            };
            a.type = "circle";
            x(g, a.attrs);
            return a
        }, Ra = function(a, b, e, d, g, f) {
                var h = x("rect");
                a.canvas && a.canvas.appendChild(h);
                a = new G(h, a);
                a.attrs = {
                    x: b,
                    y: e,
                    width: d,
                    height: g,
                    r: f || 0,
                    rx: f || 0,
                    ry: f || 0,
                    fill: "none",
                    stroke: "#000"
                };
                a.type = "rect";
                x(h, a.attrs);
                return a
            }, Sa = function(a, b, e, d, g) {
                var f = x("ellipse");
                a.canvas && a.canvas.appendChild(f);
                a = new G(f, a);
                a.attrs = {
                    cx: b,
                    cy: e,
                    rx: d,
                    ry: g,
                    fill: "none",
                    stroke: "#000"
                };
                a.type = "ellipse";
                x(f, a.attrs);
                return a
            }, Ta = function(a, b) {
                for (var e = 0, d = b.length; e < d; e++) {
                    var g = b[e],
                        f = x("image");
                    x(f, {
                        x: g.x,
                        y: g.y,
                        width: g.w,
                        height: g.h,
                        preserveAspectRatio: "none"
                    });
                    f.setAttributeNS(a.xlink, "href", g.src);
                    a.canvas && a.canvas.appendChild(f)
                }
            }, Ua = function(a, b, e, d, g, f) {
                var h = x("image");
                x(h, {
                    x: e,
                    y: d,
                    width: g,
                    height: f,
                    preserveAspectRatio: "none"
                });
                h.setAttributeNS(a.xlink, "href", b);
                a.canvas && a.canvas.appendChild(h);
                a = new G(h, a);
                a.attrs = {
                    x: e,
                    y: d,
                    width: g,
                    height: f,
                    src: b
                };
                a.type = "image";
                return a
            }, Va = function(a, b, e, d) {
                var g = x("text");
                x(g, {
                    x: b,
                    y: e,
                    "text-anchor": "middle"
                });
                a.canvas && a.canvas.appendChild(g);
                a = new G(g, a);
                a.attrs = {
                    x: b,
                    y: e,
                    "text-anchor": "middle",
                    text: d,
                    font: ia.font,
                    stroke: "none",
                    fill: "#000"
                };
                a.type = "text";
                Z(a, a.attrs);
                return a
            }, Wa = function(a, b) {
                this.width = a || this.width;
                this.height = b ||
                    this.height;
                this.canvas.setAttribute("width", this.width);
                this.canvas.setAttribute("height", this.height);
                return this
            }, ra = function() {
                var b = Ja[v](0, arguments),
                    e = b && b.container,
                    d = b.x,
                    g = b.y,
                    f = b.width,
                    b = b.height;
                if (!e) throw Error("SVG container not found.");
                var h = x("svg"),
                    d = d || 0,
                    g = g || 0,
                    f = f || 512,
                    b = b || 342;
                x(h, {
                    xmlns: "http://www.w3.org/2000/svg",
                    version: 1.1,
                    width: f,
                    height: b
                });
                e == 1 ? (h.style.cssText = "position:absolute;left:" + d + "px;top:" + g + "px", s.body.appendChild(h)) : e.firstChild ? e.insertBefore(h, e.firstChild) :
                    e.appendChild(h);
                e = new l;
                e.width = f;
                e.height = b;
                e.canvas = h;
                va.call(e, e, a.fn);
                e.clear();
                return e
            };
        w.clear = function() {
            for (var a = this.canvas; a.firstChild;) a.removeChild(a.firstChild);
            this.bottom = this.top = null;
            (this.desc = x("desc")).appendChild(s.createTextNode("Created with Rapha\u00ebl"));
            a.appendChild(this.desc);
            a.appendChild(this.defs = x("defs"))
        };
        w.remove = function() {
            this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
            for (var a in this) this[a] = Oa(a)
        }
    }
    if (a.vml) {
        var Xa = {
            M: "m",
            L: "l",
            C: "c",
            Z: "x",
            m: "t",
            l: "r",
            c: "v",
            z: "x"
        }, pb = /([clmz]),?([^clmz]*)/gi,
            qb = / progid:\S+Blur\([^\)]+\)/g,
            rb = /-?[^,\s-]+/g,
            da = 1E3 + z + 1E3,
            ga = {
                path: 1,
                rect: 1
            }, sb = function(a) {
                var b = /[ahqstv]/ig,
                    e = ea;
                y(a).match(b) && (e = la);
                b = /[clmz]/g;
                if (e == ea && !y(a).match(b)) return a = y(a).replace(pb, function(a, b, e) {
                    var d = [],
                        g = aa.call(b) == "m",
                        f = Xa[b];
                    e.replace(rb, function(a) {
                        g && d[t] == 2 && (f += d + Xa[b == "m" ? "l" : "L"], d = []);
                        d[H](O(a * 10))
                    });
                    return f + d
                });
                for (var b = e(a), d, a = [], g = 0, f = b[t]; g < f; g++) {
                    e = b[g];
                    d = aa.call(b[g][0]);
                    d == "z" && (d = "x");
                    for (var h = 1, k = e[t]; h < k; h++) d += O(e[h] * 10) + (h != k - 1 ? "," : "");
                    a[H](d)
                }
                return a[K](z)
            };
        a[X] = function() {
            return "Your browser doesn\u2019t support SVG. Falling down to VML.\nYou are running Rapha\u00ebl " + this.version
        };
        Pa = function(a, b) {
            var e = M("group");
            e.style.cssText = "position:absolute;left:0;top:0;width:" + b.width + "px;height:" + b.height + "px";
            e.coordsize = b.coordsize;
            e.coordorigin = b.coordorigin;
            var d = M("shape"),
                g = d.style;
            g.width = b.width + "px";
            g.height = b.height + "px";
            d.coordsize = da;
            d.coordorigin = b.coordorigin;
            e.appendChild(d);
            d = new G(d, e, b);
            g = {
                fill: "none",
                stroke: "#000"
            };
            a && (g.path = a);
            d.type = "path";
            d.path = [];
            d.Path = "";
            Z(d, g);
            b.canvas.appendChild(e);
            return d
        };
        Z = function(b, e) {
            b.attrs = b.attrs || {};
            var d = b.node,
                f = b.attrs,
                h = d.style,
                p;
            p = (e.x != f.x || e.y != f.y || e.width != f.width || e.height != f.height || e.r != f.r) && b.type == "rect";
            for (var j in e) e[k](j) && (f[j] = e[j]);
            if (p) f.path = Ya(f.x, f.y, f.width, f.height, f.r), b.X = f.x, b.Y = f.y, b.W = f.width, b.H = f.height;
            e.href && (d.href = e.href);
            e.title && (d.title = e.title);
            e.target && (d.target =
                e.target);
            e.cursor && (h.cursor = e.cursor);
            "blur" in e && b.blur(e.blur);
            if (e.path && b.type == "path" || p) d.path = sb(f.path);
            e.rotation != null && b.rotate(e.rotation, true);
            e.translation && (p = y(e.translation).split(g), oa.call(b, p[0], p[1]), b._.rt.cx != null && (b._.rt.cx += +p[0], b._.rt.cy += +p[1], b.setBox(b.attrs, p[0], p[1])));
            e.scale && (p = y(e.scale).split(g), b.scale(+p[0] || 1, +p[1] || +p[0] || 1, +p[2] || null, +p[3] || null));
            if ("clip-rect" in e) {
                p = y(e["clip-rect"]).split(g);
                if (p[t] == 4) {
                    p[2] = +p[2] + +p[0];
                    p[3] = +p[3] + +p[1];
                    j = d.clipRect ||
                        s.createElement("div");
                    var l = j.style,
                        r = d.parentNode;
                    l.clip = a.format("rect({1}px {2}px {3}px {0}px)", p);
                    if (!d.clipRect) l.position = "absolute", l.top = 0, l.left = 0, l.width = b.paper.width + "px", l.height = b.paper.height + "px", r.parentNode.insertBefore(j, r), j.appendChild(r), d.clipRect = j
                }
                if (!e["clip-rect"]) d.clipRect && (d.clipRect.style.clip = "")
            }
            if (b.type == "image" && e.src) d.src = e.src;
            if (b.type == "image" && e.opacity) d.filterOpacity = " progid:DXImageTransform.Microsoft.Alpha(opacity=" + e.opacity * 100 + ")", h.filter = (d.filterMatrix ||
                "") + (d.filterOpacity || "");
            e.font && (h.font = e.font);
            e["font-family"] && (h.fontFamily = '"' + e["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g, "") + '"');
            e["font-size"] && (h.fontSize = e["font-size"]);
            e["font-weight"] && (h.fontWeight = e["font-weight"]);
            e["font-style"] && (h.fontStyle = e["font-style"]);
            if (e.opacity != null || e["stroke-width"] != null || e.fill != null || e.stroke != null || e["stroke-width"] != null || e["stroke-opacity"] != null || e["fill-opacity"] != null || e["stroke-dasharray"] != null || e["stroke-miterlimit"] != null ||
                e["stroke-linejoin"] != null || e["stroke-linecap"] != null) {
                d = b.shape || d;
                p = d.getElementsByTagName("fill") && d.getElementsByTagName("fill")[0];
                j = false;
                !p && (j = p = M("fill"));
                if ("fill-opacity" in e || "opacity" in e) h = ((+f["fill-opacity"] + 1 || 2) - 1) * ((+f.opacity + 1 || 2) - 1) * ((+a.getRGB(e.fill).o + 1 || 2) - 1), h = W(Q(h, 0), 1), p.opacity = h;
                e.fill && (p.on = true);
                if (p.on == null || e.fill == "none") p.on = false;
                if (p.on && e.fill)
                    if (h = e.fill.match(Da)) p.src = h[1], p.type = "tile";
                    else if (p.color = a.getRGB(e.fill).hex, p.src = "", p.type = "solid", a.getRGB(e.fill).error &&
                    (b.type in {
                        circle: 1,
                        ellipse: 1
                    } || y(e.fill).charAt() != "r") && fa(b, e.fill)) f.fill = "none", f.gradient = e.fill;
                j && d.appendChild(p);
                p = d.getElementsByTagName("stroke") && d.getElementsByTagName("stroke")[0];
                j = false;
                !p && (j = p = M("stroke"));
                if (e.stroke && e.stroke != "none" || e["stroke-width"] || e["stroke-opacity"] != null || e["stroke-dasharray"] || e["stroke-miterlimit"] || e["stroke-linejoin"] || e["stroke-linecap"]) p.on = true;
                (e.stroke == "none" || p.on == null || e.stroke == 0 || e["stroke-width"] == 0) && (p.on = false);
                h = a.getRGB(e.stroke);
                p.on && e.stroke && (p.color = h.hex);
                h = ((+f["stroke-opacity"] + 1 || 2) - 1) * ((+f.opacity + 1 || 2) - 1) * ((+h.o + 1 || 2) - 1);
                l = (E(e["stroke-width"]) || 1) * 0.75;
                h = W(Q(h, 0), 1);
                e["stroke-width"] == null && (l = f["stroke-width"]);
                e["stroke-width"] && (p.weight = l);
                l && l < 1 && (h *= l) && (p.weight = 1);
                p.opacity = h;
                e["stroke-linejoin"] && (p.joinstyle = e["stroke-linejoin"] || "miter");
                p.miterlimit = e["stroke-miterlimit"] || 8;
                e["stroke-linecap"] && (p.endcap = e["stroke-linecap"] == "butt" ? "flat" : e["stroke-linecap"] == "square" ? "square" : "round");
                if (e["stroke-dasharray"]) h = {
                    "-": "shortdash",
                    ".": "shortdot",
                    "-.": "shortdashdot",
                    "-..": "shortdashdotdot",
                    ". ": "dot",
                    "- ": "dash",
                    "--": "longdash",
                    "- .": "dashdot",
                    "--.": "longdashdot",
                    "--..": "longdashdotdot"
                }, p.dashstyle = h[k](e["stroke-dasharray"]) ? h[e["stroke-dasharray"]] : "";
                j && d.appendChild(p)
            }
            if (b.type == "text") switch (h = b.paper.span.style, f.font && (h.font = f.font), f["font-family"] && (h.fontFamily = f["font-family"]), f["font-size"] && (h.fontSize = f["font-size"]), f["font-weight"] && (h.fontWeight = f["font-weight"]), f["font-style"] && (h.fontStyle =
                f["font-style"]), b.node.string && (b.paper.span.innerHTML = y(b.node.string).replace(/</g, "&#60;").replace(/&/g, "&#38;").replace(/\n/g, "<br>")), b.W = f.w = b.paper.span.offsetWidth, b.H = f.h = b.paper.span.offsetHeight, b.X = f.x, b.Y = f.y + O(b.H / 2), f["text-anchor"]) {
                case "start":
                    b.node.style["v-text-align"] = "left";
                    b.bbx = O(b.W / 2);
                    break;
                case "end":
                    b.node.style["v-text-align"] = "right";
                    b.bbx = -O(b.W / 2);
                    break;
                default:
                    b.node.style["v-text-align"] = "center"
            }
        };
        fa = function(a, b) {
            a.attrs = a.attrs || {};
            var e, d = "linear",
                g = ".5 .5";
            a.attrs.gradient = b;
            b = y(b).replace(Ea, function(a, b, e) {
                d = "radial";
                b && e && (b = E(b), e = E(e), J(b - 0.5, 2) + J(e - 0.5, 2) > 0.25 && (e = A.sqrt(0.25 - J(b - 0.5, 2)) * ((e > 0.5) * 2 - 1) + 0.5), g = b + z + e);
                return ""
            });
            b = b.split(/\s*\-\s*/);
            if (d == "linear") {
                var f = b.shift(),
                    f = -E(f);
                if (isNaN(f)) return null
            }
            var h = Ia(b);
            if (!h) return null;
            a = a.shape || a.node;
            e = a.getElementsByTagName("fill")[0] || M("fill");
            !e.parentNode && a.appendChild(e);
            if (h[t]) {
                e.on = true;
                e.method = "none";
                e.color = h[0].color;
                e.color2 = h[h[t] - 1].color;
                for (var k = [], j = 0, l = h[t]; j < l; j++) h[j].offset &&
                    k[H](h[j].offset + z + h[j].color);
                e.colors && (e.colors.value = k[t] ? k[K]() : "0% " + e.color);
                d == "radial" ? (e.type = "gradientradial", e.focus = "100%", e.focussize = g, e.focusposition = g) : (e.type = "gradient", e.angle = (270 - f) % 360)
            }
            return 1
        };
        G = function(b, e, d) {
            this[0] = b;
            this.id = a._oid++;
            this.node = b;
            b.raphael = this;
            this.Y = this.X = 0;
            this.attrs = {};
            this.Group = e;
            this.paper = d;
            this._ = {
                tx: 0,
                ty: 0,
                rt: {
                    deg: 0
                },
                sx: 1,
                sy: 1
            };
            !d.bottom && (d.bottom = this);
            (this.prev = d.top) && (d.top.next = this);
            d.top = this;
            this.next = null
        };
        F = G[h];
        F.rotate = function(a,
            b, e) {
            if (this.removed) return this;
            if (a == null) return this._.rt.cx ? [this._.rt.deg, this._.rt.cx, this._.rt.cy][K](z) : this._.rt.deg;
            a = y(a).split(g);
            a[t] - 1 && (b = E(a[1]), e = E(a[2]));
            a = E(a[0]);
            b != null ? this._.rt.deg = a : this._.rt.deg += a;
            e == null && (b = null);
            this._.rt.cx = b;
            this._.rt.cy = e;
            this.setBox(this.attrs, b, e);
            this.Group.style.rotation = this._.rt.deg;
            return this
        };
        F.setBox = function(a, b, e) {
            if (this.removed) return this;
            var d = this.Group.style,
                g = this.shape && this.shape.style || this.node.style,
                a = a || {}, f;
            for (f in a) a[k](f) &&
                (this.attrs[f] = a[f]);
            var b = b || this._.rt.cx,
                e = e || this._.rt.cy,
                h = this.attrs,
                j;
            switch (this.type) {
                case "circle":
                    a = h.cx - h.r;
                    f = h.cy - h.r;
                    j = h = h.r * 2;
                    break;
                case "ellipse":
                    a = h.cx - h.rx;
                    f = h.cy - h.ry;
                    j = h.rx * 2;
                    h = h.ry * 2;
                    break;
                case "image":
                    a = +h.x;
                    f = +h.y;
                    j = h.width || 0;
                    h = h.height || 0;
                    break;
                case "text":
                    this.textpath.v = ["m", O(h.x), ", ", O(h.y - 2), "l", O(h.x) + 1, ", ", O(h.y - 2)][K]("");
                    a = h.x - O(this.W / 2);
                    f = h.y - this.H / 2;
                    j = this.W;
                    h = this.H;
                    break;
                case "rect":
                case "path":
                    this.attrs.path ? (h = ma(this.attrs.path), a = h.x, f = h.y, j = h.width, h =
                        h.height) : (f = a = 0, j = this.paper.width, h = this.paper.height);
                    break;
                default:
                    f = a = 0, j = this.paper.width, h = this.paper.height
            }
            var b = (b == null ? a + j / 2 : b) - this.paper.width / 2,
                e = (e == null ? f + h / 2 : e) - this.paper.height / 2,
                l;
            d.left != (l = b + "px") && (d.left = l);
            d.top != (l = e + "px") && (d.top = l);
            this.X = ga[k](this.type) ? -b : a;
            this.Y = ga[k](this.type) ? -e : f;
            this.W = j;
            this.H = h;
            ga[k](this.type) ? (g.left != (l = -b * 10 + "px") && (g.left = l), g.top != (l = -e * 10 + "px") && (g.top = l)) : this.type == "text" ? (g.left != (l = -b + "px") && (g.left = l), g.top != (l = -e + "px") && (g.top =
                l)) : (d.width != (l = this.paper.width + "px") && (d.width = l), d.height != (l = this.paper.height + "px") && (d.height = l), g.left != (l = a - b + "px") && (g.left = l), g.top != (l = f - e + "px") && (g.top = l), g.width != (l = j + "px") && (g.width = l), g.height != (l = h + "px") && (g.height = l))
        };
        F.hide = function() {
            !this.removed && (this.Group.style.display = "none");
            return this
        };
        F.show = function() {
            !this.removed && (this.Group.style.display = "block");
            return this
        };
        F.getBBox = function() {
            return this.removed ? this : ga[k](this.type) ? ma(this.attrs.path) : {
                x: this.X + (this.bbx ||
                    0),
                y: this.Y,
                width: this.W,
                height: this.H
            }
        };
        F.remove = function() {
            if (!this.removed) {
                ca(this, this.paper);
                this.node.parentNode.removeChild(this.node);
                this.Group.parentNode.removeChild(this.Group);
                this.shape && this.shape.parentNode.removeChild(this.shape);
                for (var a in this) delete this[a];
                this.removed = true
            }
        };
        F.attr = function(b, e) {
            if (this.removed) return this;
            if (b == null) {
                var d = {}, g;
                for (g in this.attrs) this.attrs[k](g) && (d[g] = this.attrs[g]);
                this._.rt.deg && (d.rotation = this.rotate());
                (this._.sx != 1 || this._.sy != 1) &&
                    (d.scale = this.scale());
                d.gradient && d.fill == "none" && (d.fill = d.gradient) && delete d.gradient;
                return d
            }
            if (e == null && a.is(b, "string")) return b == "translation" ? oa.call(this) : b == "rotation" ? this.rotate() : b == "scale" ? this.scale() : b == "fill" && this.attrs.fill == "none" && this.attrs.gradient ? this.attrs.gradient : this.attrs[b];
            if (this.attrs && e == null && a.is(b, R)) {
                var f = {};
                for (g = 0, d = b[t]; g < d; g++) f[b[g]] = this.attr(b[g]);
                return f
            }
            e != null && (d = {}, d[b] = e);
            e == null && a.is(b, "object") && (d = b);
            if (d) {
                for (f in this.paper.customAttributes)
                    if (this.paper.customAttributes[k](f) &&
                        d[k](f) && a.is(this.paper.customAttributes[f], "function")) {
                        g = this.paper.customAttributes[f].apply(this, [].concat(d[f]));
                        this.attrs[f] = d[f];
                        for (var h in g) g[k](h) && (d[h] = g[h])
                    }
                if (d.text && this.type == "text") this.node.string = d.text;
                Z(this, d);
                d.gradient && ({
                    circle: 1,
                    ellipse: 1
                }[k](this.type) || y(d.gradient).charAt() != "r") && fa(this, d.gradient);
                (!ga[k](this.type) || this._.rt.deg) && this.setBox(this.attrs)
            }
            return this
        };
        F.toFront = function() {
            !this.removed && this.Group.parentNode.appendChild(this.Group);
            this.paper.top !=
                this && Ka(this, this.paper);
            return this
        };
        F.toBack = function() {
            if (this.removed) return this;
            this.Group.parentNode.firstChild != this.Group && (this.Group.parentNode.insertBefore(this.Group, this.Group.parentNode.firstChild), La(this, this.paper));
            return this
        };
        F.insertAfter = function(a) {
            if (this.removed) return this;
            a.constructor == S && (a = a[a.length - 1]);
            a.Group.nextSibling ? a.Group.parentNode.insertBefore(this.Group, a.Group.nextSibling) : a.Group.parentNode.appendChild(this.Group);
            Ma(this, a, this.paper);
            return this
        };
        F.insertBefore =
            function(a) {
                if (this.removed) return this;
                a.constructor == S && (a = a[0]);
                a.Group.parentNode.insertBefore(this.Group, a.Group);
                Na(this, a, this.paper);
                return this
        };
        F.blur = function(b) {
            var e = this.node.runtimeStyle,
                d = e.filter,
                d = d.replace(qb, ""); + b !== 0 ? (this.attrs.blur = b, e.filter = d + z + " progid:DXImageTransform.Microsoft.Blur(pixelradius=" + (+b || 1.5) + ")", e.margin = a.format("-{0}px 0 0 -{0}px", O(+b || 1.5))) : (e.filter = d, e.margin = 0, delete this.attrs.blur)
        };
        var Qa = function(a, b, e, d) {
            var g = M("group"),
                f = M("oval");
            g.style.cssText =
                "position:absolute;left:0;top:0;width:" + a.width + "px;height:" + a.height + "px";
            g.coordsize = da;
            g.coordorigin = a.coordorigin;
            g.appendChild(f);
            f = new G(f, g, a);
            f.type = "circle";
            Z(f, {
                stroke: "#000",
                fill: "none"
            });
            f.attrs.cx = b;
            f.attrs.cy = e;
            f.attrs.r = d;
            f.setBox({
                x: b - d,
                y: e - d,
                width: d * 2,
                height: d * 2
            });
            a.canvas.appendChild(g);
            return f
        }, Ya = function(b, e, d, g, f) {
                return f ? a.format("M{0},{1}l{2},0a{3},{3},0,0,1,{3},{3}l0,{5}a{3},{3},0,0,1,{4},{3}l{6},0a{3},{3},0,0,1,{4},{4}l0,{7}a{3},{3},0,0,1,{3},{4}z", b + f, e, d - f * 2, f, -f, g - f *
                    2, f * 2 - d, f * 2 - g) : a.format("M{0},{1}l{2},0,0,{3},{4},0z", b, e, d, g, -d)
            }, Ra = function(a, b, e, d, g, f) {
                var h = Ya(b, e, d, g, f),
                    a = a.path(h),
                    j = a.attrs;
                a.X = j.x = b;
                a.Y = j.y = e;
                a.W = j.width = d;
                a.H = j.height = g;
                j.r = f;
                j.path = h;
                a.type = "rect";
                return a
            }, Sa = function(a, b, e, d, g) {
                var f = M("group"),
                    h = M("oval");
                f.style.cssText = "position:absolute;left:0;top:0;width:" + a.width + "px;height:" + a.height + "px";
                f.coordsize = da;
                f.coordorigin = a.coordorigin;
                f.appendChild(h);
                h = new G(h, f, a);
                h.type = "ellipse";
                Z(h, {
                    stroke: "#000"
                });
                h.attrs.cx = b;
                h.attrs.cy =
                    e;
                h.attrs.rx = d;
                h.attrs.ry = g;
                h.setBox({
                    x: b - d,
                    y: e - g,
                    width: d * 2,
                    height: g * 2
                });
                a.canvas.appendChild(f);
                return h
            }, Ta = function(a, b) {
                for (var e = 0, d = b.length; e < d; e++) {
                    var g = b[e],
                        f = M("group"),
                        h = M("image");
                    f.style.cssText = "position:absolute;left:0;top:0;width:" + a.width + "px;height:" + a.height + "px";
                    f.coordsize = da;
                    f.coordorigin = a.coordorigin;
                    h.src = g.src;
                    f.appendChild(h);
                    h = new G(h, f, a);
                    h.type = "image";
                    h.attrs.src = g.src;
                    h.attrs.x = g.x;
                    h.attrs.y = g.y;
                    h.attrs.w = g.w;
                    h.attrs.h = g.h;
                    h.setBox({
                        x: g.x,
                        y: g.y,
                        width: g.w,
                        height: g.h
                    });
                    a.canvas.appendChild(f)
                }
            }, Ua = function(a, b, e, d, g, f) {
                var h = M("group"),
                    j = M("image");
                h.style.cssText = "position:absolute;left:0;top:0;width:" + a.width + "px;height:" + a.height + "px";
                h.coordsize = da;
                h.coordorigin = a.coordorigin;
                j.src = b;
                h.appendChild(j);
                j = new G(j, h, a);
                j.type = "image";
                j.attrs.src = b;
                j.attrs.x = e;
                j.attrs.y = d;
                j.attrs.w = g;
                j.attrs.h = f;
                j.setBox({
                    x: e,
                    y: d,
                    width: g,
                    height: f
                });
                a.canvas.appendChild(h);
                return j
            }, Va = function(b, e, d, g) {
                var f = M("group"),
                    h = M("shape"),
                    j = h.style,
                    k = M("path"),
                    l = M("textpath");
                f.style.cssText =
                    "position:absolute;left:0;top:0;width:" + b.width + "px;height:" + b.height + "px";
                f.coordsize = da;
                f.coordorigin = b.coordorigin;
                k.v = a.format("m{0},{1}l{2},{1}", O(e * 10), O(d * 10), O(e * 10) + 1);
                k.textpathok = true;
                j.width = b.width;
                j.height = b.height;
                l.string = y(g);
                l.on = true;
                h.appendChild(l);
                h.appendChild(k);
                f.appendChild(h);
                j = new G(l, f, b);
                j.shape = h;
                j.textpath = k;
                j.type = "text";
                j.attrs.text = g;
                j.attrs.x = e;
                j.attrs.y = d;
                j.attrs.w = 1;
                j.attrs.h = 1;
                Z(j, {
                    font: ia.font,
                    stroke: "none",
                    fill: "#000"
                });
                j.setBox();
                b.canvas.appendChild(f);
                return j
            },
            Wa = function(a, b) {
                var e = this.canvas.style;
                a == +a && (a += "px");
                b == +b && (b += "px");
                e.width = a;
                e.height = b;
                e.clip = "rect(0 " + a + " " + b + " 0)";
                return this
            }, M;
        s.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
        try {
            !s.namespaces.rvml && s.namespaces.add("rvml", "urn:schemas-microsoft-com:vml"), M = function(a) {
                return s.createElement("<rvml:" + a + ' class="rvml">')
            }
        } catch (zb) {
            M = function(a) {
                return s.createElement("<" + a + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')
            }
        }
        ra = function() {
            var b = Ja[v](0, arguments),
                e = b.container,
                d = b.height,
                g = b.width,
                f = b.x,
                b = b.y;
            if (!e) throw Error("VML container not found.");
            var h = new l,
                j = h.canvas = s.createElement("div"),
                k = j.style,
                f = f || 0,
                b = b || 0,
                g = g || 512,
                d = d || 342;
            g == +g && (g += "px");
            d == +d && (d += "px");
            h.width = 1E3;
            h.height = 1E3;
            h.coordsize = 1E4 + z + 1E4;
            h.coordorigin = "0 0";
            h.span = s.createElement("span");
            h.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";
            j.appendChild(h.span);
            k.cssText = a.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden",
                g, d);
            e == 1 ? (s.body.appendChild(j), k.left = f + "px", k.top = b + "px", k.position = "absolute") : e.firstChild ? e.insertBefore(j, e.firstChild) : e.appendChild(j);
            va.call(h, h, a.fn);
            return h
        };
        w.clear = function() {
            this.canvas.innerHTML = "";
            this.span = s.createElement("span");
            this.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";
            this.canvas.appendChild(this.span);
            this.bottom = this.top = null
        };
        w.remove = function() {
            this.canvas.parentNode.removeChild(this.canvas);
            for (var a in this) this[a] =
                Oa(a);
            return true
        }
    }
    T = navigator.userAgent.match(/Version\/(.*?)\s/);
    w.safari = navigator.vendor == "Apple Computer, Inc." && (T && T[1] < 4 || navigator.platform.slice(0, 2) == "iP") ? function() {
        var a = this.rect(-99, -99, this.width + 99, this.height + 99).attr({
            stroke: "none"
        });
        n.setTimeout(function() {
            a.remove()
        })
    } : function() {};
    for (var tb = function() {
            this.returnValue = false
        }, ub = function() {
                return this.originalEvent.preventDefault()
            }, vb = function() {
                this.cancelBubble = true
            }, wb = function() {
                return this.originalEvent.stopPropagation()
            },
            xb = function() {
                if (s.addEventListener) return function(a, b, e, d) {
                    var g = B && u[b] ? u[b] : b,
                        f = function(g) {
                            if (B && u[k](b))
                                for (var f = 0, h = g.targetTouches && g.targetTouches.length; f < h; f++)
                                    if (g.targetTouches[f].target == a) {
                                        h = g;
                                        g = g.targetTouches[f];
                                        g.originalEvent = h;
                                        g.preventDefault = ub;
                                        g.stopPropagation = wb;
                                        break
                                    }
                            return e.call(d, g)
                        };
                    a.addEventListener(g, f, false);
                    return function() {
                        a.removeEventListener(g, f, false);
                        return true
                    }
                };
                else if (s.attachEvent) return function(a, b, e, d) {
                    var g = function(a) {
                        a = a || n.event;
                        a.preventDefault =
                            a.preventDefault || tb;
                        a.stopPropagation = a.stopPropagation || vb;
                        return e.call(d, a)
                    };
                    a.attachEvent("on" + b, g);
                    return function() {
                        a.detachEvent("on" + b, g);
                        return true
                    }
                }
            }(), U = [], xa = function(a) {
                for (var b = a.clientX, e = a.clientY, d = s.documentElement.scrollTop || s.body.scrollTop, g = s.documentElement.scrollLeft || s.body.scrollLeft, f, h = U.length; h--;) {
                    f = U[h];
                    if (B)
                        for (var j = a.touches.length, k; j--;) {
                            if (k = a.touches[j], k.identifier == f.el._drag.id) {
                                b = k.clientX;
                                e = k.clientY;
                                (a.originalEvent ? a.originalEvent : a).preventDefault();
                                break
                            }
                        } else a.preventDefault();
                    b += g;
                    e += d;
                    f.move && f.move.call(f.move_scope || f.el, b - f.el._drag.x, e - f.el._drag.y, b, e, a)
                }
            }, ya = function(b) {
                a.unmousemove(xa).unmouseup(ya);
                for (var e = U.length, d; e--;) d = U[e], d.el._drag = {}, d.end && d.end.call(d.end_scope || d.start_scope || d.move_scope || d.el, b);
                U = []
            }, T = r[t]; T--;)(function(b) {
        a[b] = G[h][b] = function(e, d) {
            if (a.is(e, "function")) this.events = this.events || [], this.events.push({
                name: b,
                f: e,
                unbind: xb(this.shape || this.node || s, b, e, d || this)
            });
            return this
        };
        a["un" + b] = G[h]["un" +
            b
        ] = function(a) {
            for (var e = this.events, d = e[t]; d--;)
                if (e[d].name == b && e[d].f == a) {
                    e[d].unbind();
                    e.splice(d, 1);
                    !e.length && delete this.events;
                    break
                }
            return this
        }
    })(r[T]);
    F.hover = function(a, b, e, d) {
        return this.mouseover(a, e).mouseout(b, d || e)
    };
    F.unhover = function(a, b) {
        return this.unmouseover(a).unmouseout(b)
    };
    F.drag = function(b, e, d, g, f, h) {
        this._drag = {};
        this.mousedown(function(j) {
            (j.originalEvent || j).preventDefault();
            var k = s.documentElement.scrollTop || s.body.scrollTop,
                l = s.documentElement.scrollLeft || s.body.scrollLeft;
            this._drag.x = j.clientX + l;
            this._drag.y = j.clientY + k;
            this._drag.id = j.identifier;
            e && e.call(f || g || this, j.clientX + l, j.clientY + k, j);
            !U.length && a.mousemove(xa).mouseup(ya);
            U.push({
                el: this,
                move: b,
                end: d,
                move_scope: g,
                start_scope: f,
                end_scope: h
            })
        });
        return this
    };
    F.undrag = function(b, e, d) {
        for (e = U.length; e--;) U[e].el == this && U[e].move == b && U[e].end == d && U.splice(e++, 1);
        !U.length && a.unmousemove(xa).unmouseup(ya)
    };
    w.circle = function(a, b, e) {
        return Qa(this, a || 0, b || 0, e || 0)
    };
    w.rect = function(a, b, e, d, g) {
        return Ra(this, a || 0, b ||
            0, e || 0, d || 0, g || 0)
    };
    w.ellipse = function(a, b, e, d) {
        return Sa(this, a || 0, b || 0, e || 0, d || 0)
    };
    w.path = function(b) {
        b && !a.is(b, "string") && !a.is(b[0], R) && (b += "");
        return Pa(a.format[v](a, arguments), this)
    };
    w.imageArray = function(a) {
        return Ta(this, a)
    };
    w.image = function(a, b, e, d, g) {
        return Ua(this, a || "about:blank", b || 0, e || 0, d || 0, g || 0)
    };
    w.text = function(a, b, e) {
        return Va(this, a || 0, b || 0, y(e))
    };
    w.set = function(a) {
        arguments[t] > 1 && (a = Array[h].splice.call(arguments, 0, arguments[t]));
        return new S(a)
    };
    w.setSize = Wa;
    w.top = w.bottom =
        null;
    w.raphael = a;
    F.resetScale = function() {
        if (this.removed) return this;
        this._.sx = 1;
        this._.sy = 1;
        this.attrs.scale = "1 1"
    };
    F.scale = function(a, e, d, g) {
        if (this.removed) return this;
        if (a == null && e == null) return {
            x: this._.sx,
            y: this._.sy,
            toString: b
        };
        e = e || a;
        !+e && (e = a);
        var f, h, j = this.attrs;
        if (a != 0) {
            var k = this.getBBox(),
                l = k.x + k.width / 2,
                r = k.y + k.height / 2;
            f = L(a / this._.sx);
            h = L(e / this._.sy);
            var d = +d || d == 0 ? d : l,
                g = +g || g == 0 ? g : r,
                s = this._.sx > 0,
                q = this._.sy > 0,
                k = ~~ (a / L(a)),
                n = ~~ (e / L(e)),
                m = f * k,
                o = h * n,
                u = this.node.style,
                l = d + L(l - d) * m *
                    (l > d == s ? 1 : -1),
                r = g + L(r - g) * o * (r > g == q ? 1 : -1),
                C = a * k > e * n ? h : f;
            switch (this.type) {
                case "rect":
                case "image":
                    var v = j.width * f,
                        y = j.height * h;
                    this.attr({
                        height: y,
                        r: j.r * C,
                        width: v,
                        x: l - v / 2,
                        y: r - y / 2
                    });
                    break;
                case "circle":
                case "ellipse":
                    this.attr({
                        rx: j.rx * f,
                        ry: j.ry * h,
                        r: j.r * C,
                        cx: l,
                        cy: r
                    });
                    break;
                case "text":
                    this.attr({
                        x: l,
                        y: r
                    });
                    break;
                case "path":
                    for (var C = ua(j.path), w = true, s = s ? m : f, q = q ? o : h, o = 0, m = C[t]; o < m; o++) {
                        var B = C[o],
                            A = ha.call(B[0]);
                        if (!(A == "M" && w))
                            if (w = false, A == "A") B[C[o][t] - 2] *= s, B[C[o][t] - 1] *= q, B[1] *= f, B[2] *= h, B[5] = +(k + n ? !! +B[5] : !+B[5]);
                            else if (A == "H")
                            for (var A = 1, x = B[t]; A < x; A++) B[A] *= s;
                        else if (A == "V")
                            for (A = 1, x = B[t]; A < x; A++) B[A] *= q;
                        else
                            for (A = 1, x = B[t]; A < x; A++) B[A] *= A % 2 ? s : q
                    }
                    h = ma(C);
                    f = l - h.x - h.width / 2;
                    h = r - h.y - h.height / 2;
                    C[0][1] += f;
                    C[0][2] += h;
                    this.attr({
                        path: C
                    })
            }
            this.type in {
                text: 1,
                image: 1
            } && (k != 1 || n != 1) ? this.transformations ? (this.transformations[2] = "scale(".concat(k, ",", n, ")"), this.node.setAttribute("transform", this.transformations[K](z)), f = k == -1 ? -j.x - (v || 0) : j.x, h = n == -1 ? -j.y - (y || 0) : j.y, this.attr({
                    x: f,
                    y: h
                }), j.fx =
                k - 1, j.fy = n - 1) : (this.node.filterMatrix = " progid:DXImageTransform.Microsoft" + ".Matrix(M11=".concat(k, ", M12=0, M21=0, M22=", n, ", Dx=0, Dy=0, sizingmethod='auto expand', filtertype='bilinear')"), u.filter = (this.node.filterMatrix || "") + (this.node.filterOpacity || "")) : this.transformations ? (this.transformations[2] = "", this.node.setAttribute("transform", this.transformations[K](z)), j.fx = 0, j.fy = 0) : (this.node.filterMatrix = "", u.filter = (this.node.filterMatrix || "") + (this.node.filterOpacity || ""));
            j.scale = [a, e, d, g][K](z);
            this._.sx = a;
            this._.sy = e
        }
        return this
    };
    F.clone = function() {
        if (this.removed) return null;
        var a = this.attr();
        delete a.scale;
        delete a.translation;
        return this.paper[this.type]().attr(a)
    };
    var za = {}, pa = function(b, e, d, g, f, h, j, k, l) {
            var r = 0,
                s = 100,
                q = [b, e, d, g, f, h, j, k].join(),
                n = za[q],
                m, o;
            !n && (za[q] = n = {
                data: []
            });
            n.timer && clearTimeout(n.timer);
            n.timer = setTimeout(function() {
                delete za[q]
            }, 2E3);
            l != null && (s = ~~pa(b, e, d, g, f, h, j, k) * 10);
            for (var u = 0; u < s + 1; u++) {
                n.data[l] > u ? o = n.data[u * s] : (o = a.findDotsAtSegment(b, e, d, g, f, h, j, k,
                    u / s), n.data[u] = o);
                u && (r += J(J(m.x - o.x, 2) + J(m.y - o.y, 2), 0.5));
                if (l != null && r >= l) return o;
                m = o
            }
            if (l == null) return r
        }, r = function(b, e) {
            return function(d, g, f) {
                for (var d = la(d), h, j, k, l, r = "", s = {}, q = 0, n = 0, m = d.length; n < m; n++) {
                    k = d[n];
                    if (k[0] == "M") h = +k[1], j = +k[2];
                    else {
                        l = pa(h, j, k[1], k[2], k[3], k[4], k[5], k[6]);
                        if (q + l > g) {
                            if (e && !s.start) {
                                h = pa(h, j, k[1], k[2], k[3], k[4], k[5], k[6], g - q);
                                r += ["C", h.start.x, h.start.y, h.m.x, h.m.y, h.x, h.y];
                                if (f) return r;
                                s.start = r;
                                r = ["M", h.x, h.y + "C", h.n.x, h.n.y, h.end.x, h.end.y, k[5], k[6]][K]();
                                q +=
                                    l;
                                h = +k[5];
                                j = +k[6];
                                continue
                            }
                            if (!b && !e) return h = pa(h, j, k[1], k[2], k[3], k[4], k[5], k[6], g - q), {
                                x: h.x,
                                y: h.y,
                                alpha: h.alpha
                            }
                        }
                        q += l;
                        h = +k[5];
                        j = +k[6]
                    }
                    r += k
                }
                s.end = r;
                h = b ? q : e ? s : a.findDotsAtSegment(h, j, k[1], k[2], k[3], k[4], k[5], k[6], 1);
                h.alpha && (h = {
                    x: h.x,
                    y: h.y,
                    alpha: h.alpha
                });
                return h
            }
        }, Za = r(1),
        qa = r(),
        Aa = r(0, 1);
    F.getTotalLength = function() {
        if (this.type == "path") return this.node.getTotalLength ? this.node.getTotalLength() : Za(this.attrs.path)
    };
    F.getPointAtLength = function(a) {
        return this.type != "path" ? void 0 : qa(this.attrs.path,
            a)
    };
    F.getSubpath = function(a, b) {
        if (this.type == "path") {
            if (L(this.getTotalLength() - b) < "1e-6") return Aa(this.attrs.path, a).end;
            var e = Aa(this.attrs.path, b, 1);
            return a ? Aa(e, a).end : e
        }
    };
    a.easing_formulas = {
        linear: function(a) {
            return a
        },
        "<": function(a) {
            return J(a, 3)
        },
        ">": function(a) {
            return J(a - 1, 3) + 1
        },
        "<>": function(a) {
            a *= 2;
            if (a < 1) return J(a, 3) / 2;
            a -= 2;
            return (J(a, 3) + 2) / 2
        },
        backIn: function(a) {
            return a * a * (2.70158 * a - 1.70158)
        },
        backOut: function(a) {
            a -= 1;
            return a * a * (2.70158 * a + 1.70158) + 1
        },
        elastic: function(a) {
            return a ==
                0 || a == 1 ? a : J(2, -10 * a) * A.sin((a - 0.075) * 2 * P / 0.3) + 1
        },
        bounce: function(a) {
            a < 1 / 2.75 ? a *= 7.5625 * a : a < 2 / 2.75 ? (a -= 1.5 / 2.75, a = 7.5625 * a * a + 0.75) : a < 2.5 / 2.75 ? (a -= 2.25 / 2.75, a = 7.5625 * a * a + 0.9375) : (a -= 2.625 / 2.75, a = 7.5625 * a * a + 0.984375);
            return a
        }
    };
    var V = [],
        $a = function() {
            for (var b = +new Date, e = 0; e < V[t]; e++) {
                var d = V[e];
                if (!d.stop && !d.el.removed) {
                    var g = b - d.start,
                        f = d.ms,
                        h = d.easing,
                        j = d.from,
                        l = d.diff,
                        r = d.to,
                        s = d.t,
                        q = d.el,
                        d = {}, n;
                    if (g < f) {
                        var g = h(g / f),
                            m;
                        for (m in j)
                            if (j[k](m)) {
                                switch (sa[m]) {
                                    case "along":
                                        n = g * f * l[m];
                                        r.back && (n = r.len -
                                            n);
                                        h = qa(r[m], n);
                                        q.translate(l.sx - l.x || 0, l.sy - l.y || 0);
                                        l.x = h.x;
                                        l.y = h.y;
                                        q.translate(h.x - l.sx, h.y - l.sy);
                                        r.rot && q.rotate(l.r + h.alpha, h.x, h.y);
                                        break;
                                    case N:
                                        n = +j[m] + g * f * l[m];
                                        break;
                                    case "colour":
                                        n = "rgb(" + [Ba(O(j[m].r + g * f * l[m].r)), Ba(O(j[m].g + g * f * l[m].g)), Ba(O(j[m].b + g * f * l[m].b))][K](",") + ")";
                                        break;
                                    case "path":
                                        n = [];
                                        for (var h = 0, o = j[m][t]; h < o; h++) {
                                            n[h] = [j[m][h][0]];
                                            for (var u = 1, C = j[m][h][t]; u < C; u++) n[h][u] = +j[m][h][u] + g * f * l[m][h][u];
                                            n[h] = n[h][K](z)
                                        }
                                        n = n[K](z);
                                        break;
                                    case "csv":
                                        switch (m) {
                                            case "translation":
                                                n = g *
                                                    f * l[m][0] - s.x;
                                                h = g * f * l[m][1] - s.y;
                                                s.x += n;
                                                s.y += h;
                                                n = n + z + h;
                                                break;
                                            case "rotation":
                                                n = +j[m][0] + g * f * l[m][0];
                                                j[m][1] && (n += "," + j[m][1] + "," + j[m][2]);
                                                break;
                                            case "scale":
                                                n = [+j[m][0] + g * f * l[m][0], +j[m][1] + g * f * l[m][1], 2 in r[m] ? r[m][2] : "", 3 in r[m] ? r[m][3] : ""][K](z);
                                                break;
                                            case "clip-rect":
                                                n = [];
                                                for (h = 4; h--;) n[h] = +j[m][h] + g * f * l[m][h]
                                        }
                                        break;
                                    default:
                                        o = [].concat(j[m]);
                                        n = [];
                                        for (h = q.paper.customAttributes[m].length; h--;) n[h] = +o[h] + g * f * l[m][h]
                                }
                                d[m] = n
                            }
                        q.attr(d);
                        q._run && q._run.call(q)
                    } else r.along && (h = qa(r.along, r.len * !r.back),
                        q.translate(l.sx - (l.x || 0) + h.x - l.sx, l.sy - (l.y || 0) + h.y - l.sy), r.rot && q.rotate(l.r + h.alpha, h.x, h.y)), (s.x || s.y) && q.translate(-s.x, -s.y), r.scale && (r.scale += ""), q.attr(r), V.splice(e--, 1)
                }
            }
            a.svg && q && q.paper && q.paper.safari();
            V[t] && setTimeout($a)
        }, yb = function(b, e, d, g, f) {
            var h = d - g;
            e.timeouts.push(setTimeout(function() {
                a.is(f, "function") && f.call(e);
                e.animate(b, h, b.easing)
            }, g))
        }, Ba = function(a) {
            return Q(W(a, 255), 0)
        }, oa = function(a, e) {
            if (a == null) return {
                x: this._.tx,
                y: this._.ty,
                toString: b
            };
            this._.tx += +a;
            this._.ty += +e;
            switch (this.type) {
                case "circle":
                case "ellipse":
                    this.attr({
                        cx: +a + this.attrs.cx,
                        cy: +e + this.attrs.cy
                    });
                    break;
                case "rect":
                case "image":
                case "text":
                    this.attr({
                        x: +a + this.attrs.x,
                        y: +e + this.attrs.y
                    });
                    break;
                case "path":
                    var d = ua(this.attrs.path);
                    d[0][1] += +a;
                    d[0][2] += +e;
                    this.attr({
                        path: d
                    })
            }
            return this
        };
    F.animateWith = function(a, b, e, d, g) {
        for (var f = 0, h = V.length; f < h; f++)
            if (V[f].el.id == a.id) b.start = V[f].start;
        return this.animate(b, e, d, g)
    };
    F.animateAlong = d();
    F.animateAlongBack = d(1);
    F.onAnimation = function(a) {
        this._run =
            a || 0;
        return this
    };
    F.animate = function(b, d, f, h) {
        var j = this;
        j.timeouts = j.timeouts || [];
        if (a.is(f, "function") || !f) h = f || null;
        if (j.removed) return h && h.call(j), j;
        var l = {}, r = {}, s = false,
            q = {}, n;
        for (n in b)
            if (b[k](n) && (sa[k](n) || j.paper.customAttributes[k](n))) switch (s = true, l[n] = j.attr(n), l[n] == null && (l[n] = ia[n]), r[n] = b[n], sa[n]) {
                case "along":
                    var m = Za(b[n]),
                        o = qa(b[n], m * !! b.back),
                        u = j.getBBox();
                    q[n] = m / d;
                    q.tx = u.x;
                    q.ty = u.y;
                    q.sx = o.x;
                    q.sy = o.y;
                    r.rot = b.rot;
                    r.back = b.back;
                    r.len = m;
                    b.rot && (q.r = E(j.rotate()) || 0);
                    break;
                case N:
                    q[n] =
                        (r[n] - l[n]) / d;
                    break;
                case "colour":
                    l[n] = a.getRGB(l[n]);
                    m = a.getRGB(r[n]);
                    q[n] = {
                        r: (m.r - l[n].r) / d,
                        g: (m.g - l[n].g) / d,
                        b: (m.b - l[n].b) / d
                    };
                    break;
                case "path":
                    m = la(l[n], r[n]);
                    l[n] = m[0];
                    u = m[1];
                    q[n] = [];
                    m = 0;
                    for (o = l[n][t]; m < o; m++) {
                        q[n][m] = [0];
                        for (var C = 1, v = l[n][m][t]; C < v; C++) q[n][m][C] = (u[m][C] - l[n][m][C]) / d
                    }
                    break;
                case "csv":
                    o = y(b[n]).split(g);
                    u = y(l[n]).split(g);
                    switch (n) {
                        case "translation":
                            l[n] = [0, 0];
                            q[n] = [o[0] / d, o[1] / d];
                            break;
                        case "rotation":
                            l[n] = u[1] == o[1] && u[2] == o[2] ? u : [0, o[1], o[2]];
                            q[n] = [(o[0] - l[n][0]) / d, 0,
                                0
                            ];
                            break;
                        case "scale":
                            b[n] = o;
                            l[n] = y(l[n]).split(g);
                            q[n] = [(o[0] - l[n][0]) / d, (o[1] - l[n][1]) / d, 0, 0];
                            break;
                        case "clip-rect":
                            l[n] = y(l[n]).split(g);
                            q[n] = [];
                            for (m = 4; m--;) q[n][m] = (o[m] - l[n][m]) / d
                    }
                    r[n] = o;
                    break;
                default:
                    o = [].concat(b[n]);
                    u = [].concat(l[n]);
                    q[n] = [];
                    for (m = j.paper.customAttributes[n][t]; m--;) q[n][m] = ((o[m] || 0) - (u[m] || 0)) / d
            }
            if (s) {
                n = a.easing_formulas[f];
                if (!n)
                    if ((n = y(f).match(eb)) && n[t] == 5) {
                        var K = n;
                        n = function(a) {
                            return e(a, +K[1], +K[2], +K[3], +K[4], d)
                        }
                    } else n = function(a) {
                        return a
                    };
                V.push({
                    start: b.start || +new Date,
                    ms: d,
                    easing: n,
                    from: l,
                    diff: q,
                    to: r,
                    el: j,
                    t: {
                        x: 0,
                        y: 0
                    }
                });
                a.is(h, "function") && (j._ac = setTimeout(function() {
                    h.call(j)
                }, d));
                V[t] == 1 && setTimeout($a)
            } else {
                var f = [],
                    w, z;
                for (z in b)
                    if (b[k](z) && fb.test(z)) n = {
                        value: b[z]
                    }, z == "from" && (z = 0), z == "to" && (z = 100), n.key = Y(z, 10), f.push(n);
                f.sort(kb);
                f[0].key && f.unshift({
                    key: 0,
                    value: j.attrs
                });
                for (m = 0, o = f[t]; m < o; m++) yb(f[m].value, j, d / 100 * f[m].key, d / 100 * (f[m - 1] && f[m - 1].key || 0), f[m - 1] && f[m - 1].value.callback);
                (w = f[f[t] - 1].value.callback) && j.timeouts.push(setTimeout(function() {
                        w.call(j)
                    },
                    d))
            }
        return this
    };
    F.stop = function() {
        for (var a = 0; a < V.length; a++) V[a].el.id == this.id && V.splice(a--, 1);
        for (a = 0, ii = this.timeouts && this.timeouts.length; a < ii; a++) clearTimeout(this.timeouts[a]);
        this.timeouts = [];
        clearTimeout(this._ac);
        delete this._ac;
        return this
    };
    F.translate = function(a, b) {
        return this.attr({
            translation: a + " " + b
        })
    };
    F[X] = function() {
        return "Rapha\u00ebl\u2019s object"
    };
    a.ae = V;
    var S = function(a) {
        this.items = [];
        this[t] = 0;
        this.type = "set";
        if (a)
            for (var b = 0, e = a[t]; b < e; b++)
                if (a[b] && (a[b].constructor == G ||
                    a[b].constructor == S)) this[this.items[t]] = this.items[this.items[t]] = a[b], this[t]++
    };
    S[h][H] = function() {
        for (var a, b, e = 0, d = arguments[t]; e < d; e++)
            if ((a = arguments[e]) && (a.constructor == G || a.constructor == S)) b = this.items[t], this[b] = this.items[b] = a, this[t]++;
        return this
    };
    S[h].pop = function() {
        delete this[this[t]--];
        return this.items.pop()
    };
    for (var Ca in F) F[k](Ca) && (S[h][Ca] = function(a) {
        return function() {
            for (var b = 0, e = this.items[t]; b < e; b++) this.items[b][a][v](this.items[b], arguments);
            return this
        }
    }(Ca));
    S[h].attr =
        function(b, e) {
            if (b && a.is(b, R) && a.is(b[0], "object"))
                for (var d = 0, g = b[t]; d < g; d++) this.items[d].attr(b[d]);
            else {
                d = 0;
                for (g = this.items[t]; d < g; d++) this.items[d].attr(b, e)
            }
            return this
    };
    S[h].animate = function(b, e, d, g) {
        (a.is(d, "function") || !d) && (g = d || null);
        var f = this.items[t],
            h = f,
            j, k = this,
            l;
        g && (l = function() {
            !--f && g.call(k)
        });
        d = a.is(d, "string") ? d : l;
        for (j = this.items[--h].animate(b, e, d, l); h--;) this.items[h] && !this.items[h].removed && this.items[h].animateWith(j, b, e, d, l);
        return this
    };
    S[h].insertAfter = function(a) {
        for (var b =
            this.items[t]; b--;) this.items[b].insertAfter(a);
        return this
    };
    S[h].getBBox = function() {
        for (var a = [], b = [], e = [], d = [], g = this.items[t]; g--;) {
            var f = this.items[g].getBBox();
            a[H](f.x);
            b[H](f.y);
            e[H](f.x + f.width);
            d[H](f.y + f.height)
        }
        a = W[v](0, a);
        b = W[v](0, b);
        return {
            x: a,
            y: b,
            width: Q[v](0, e) - a,
            height: Q[v](0, d) - b
        }
    };
    S[h].clone = function(a) {
        for (var a = new S, b = 0, e = this.items[t]; b < e; b++) a[H](this.items[b].clone());
        return a
    };
    a.registerFont = function(a) {
        if (!a.face) return a;
        this.fonts = this.fonts || {};
        var b = {
            w: a.w,
            face: {},
            glyphs: {}
        },
            e = a.face["font-family"],
            d;
        for (d in a.face) a.face[k](d) && (b.face[d] = a.face[d]);
        if (this.fonts[e]) this.fonts[e][H](b);
        else this.fonts[e] = [b]; if (!a.svg) {
            b.face["units-per-em"] = Y(a.face["units-per-em"], 10);
            for (var g in a.glyphs)
                if (a.glyphs[k](g) && (e = a.glyphs[g], b.glyphs[g] = {
                    w: e.w,
                    k: {},
                    d: e.d && "M" + e.d.replace(/[mlcxtrv]/g, function(a) {
                        return {
                            l: "L",
                            c: "C",
                            x: "z",
                            t: "m",
                            r: "l",
                            v: "c"
                        }[a] || "M"
                    }) + "z"
                }, e.k))
                    for (var f in e.k) e[k](f) && (b.glyphs[g].k[f] = e.k[f])
        }
        return a
    };
    w.getFont = function(b, e, d, g) {
        g = g || "normal";
        d = d ||
            "normal";
        e = +e || {
            normal: 400,
            bold: 700,
            lighter: 300,
            bolder: 800
        }[e] || 400;
        if (a.fonts) {
            var f = a.fonts[b];
            if (!f) {
                var b = RegExp("(^|\\s)" + b.replace(/[^\w\d\s+!~.:_-]/g, "") + "(\\s|$)", "i"),
                    h;
                for (h in a.fonts)
                    if (a.fonts[k](h) && b.test(h)) {
                        f = a.fonts[h];
                        break
                    }
            }
            var j;
            if (f) {
                h = 0;
                for (b = f[t]; h < b; h++)
                    if (j = f[h], j.face["font-weight"] == e && (j.face["font-style"] == d || !j.face["font-style"]) && j.face["font-stretch"] == g) break
            }
            return j
        }
    };
    w.print = function(b, e, d, f, h, j, k) {
        var j = j || "middle",
            k = Q(W(k || 0, 1), -1),
            l = this.set(),
            n = y(d).split(""),
            r = 0;
        a.is(f, d) && (f = this.getFont(f));
        if (f) {
            for (var d = (h || 16) / f.face["units-per-em"], q = f.face.bbox.split(g), h = +q[0], j = +q[1] + (j == "baseline" ? q[3] - q[1] + +f.face.descent : (q[3] - q[1]) / 2), q = 0, s = n[t]; q < s; q++) {
                var m = q && f.glyphs[n[q - 1]] || {}, o = f.glyphs[n[q]];
                r += q ? (m.w || f.w) + (m.k && m.k[n[q]] || 0) + f.w * k : 0;
                o && o.d && l[H](this.path(o.d).attr({
                    fill: "#000",
                    stroke: "none",
                    translation: [r, 0]
                }))
            }
            l.scale(d, d, h, j).translate(b - h, e - j)
        }
        return l
    };
    a.format = function(b, e) {
        var d = a.is(e, R) ? [0].concat(e) : arguments;
        b && a.is(b, "string") && d[t] -
            1 && (b = b.replace(j, function(a, b) {
                return d[++b] == null ? "" : d[b]
            }));
        return b || ""
    };
    a.ninja = function() {
        q ? n.Raphael = C : delete Raphael;
        return a
    };
    a.el = F;
    a.st = S[h];
    q ? n.Raphael = a : Raphael = a
})();
var PizzaDisplayFactory = {
    getPizzaDisplay: function() {
        var a;
        a = document.createElement("canvas");
        a = a.getContext && a.getContext("2d") ? new CanvasPizzaDisplay : new pizzaBuilder("#pizzaCanvas", {
            ImageDir: urlConfig.assets + "/images/builder/pizza"
        });
        Interface.ensureImplements(a, PizzaDisplay);
        return a
    }
}, CanvasPizzaDisplay = function() {
        function a(a) {
            var b = document.getElementById(a + "_canvas");
            if (!b) b = document.createElement("canvas"), b.width = d.CanvasSize.Width, b.height = d.CanvasSize.Height, b.id = a + "_canvas", b.style.display =
                "block", b.style.position = "absolute", b.style.zIndex = 1, d.CanvasContainer.appendChild(b);
            return b
        }

        function o(b) {
            b = a(b);
            b.width = b.width
        }

        function m(b, g, f, j, h, k) {
            b = a(b).getContext("2d");
            h && k ? b.drawImage(d.ComponentImages[g], f, j, h, k) : b.drawImage(d.ComponentImages[g], f, j);
            return b.canvas
        }

        function b(a) {
            var b, f, j, h, k, s = $.extend(true, {}, d.ToppingConfig[a], d.Toppings[a]),
                n = s.Part.split("/"),
                q = d.FlavorPatterns[d.FlavorCode] || "radial",
                C = function(a) {
                    return a - Math.ceil(Math.random() * a * 2)
                };
            o(a);
            if (q == "radial")
                for (var l =
                    d.PatternSettings[q].Size.Width / 2 - d.ToppingWidth / 2 + d.PatternSettings[q].OffsetLeft, w = d.PatternSettings[q].Size.Height / 2 - d.ToppingHeight / 2 + d.PatternSettings[q].OffsetTop, v = 0, q = Math.ceil(d.PatternSettings[q].Size.Width / 2 / s.Spacing) - 1; v < q; v++)
                    for (var B = 360 / parseInt(n[1]) * (parseInt(n[0]) - 1) + 90, z = B + 360 / parseInt(n[1]); B < z;) b = v * s.Spacing, a = b * Math.cos(B * Math.PI / 180) + l, b = b * Math.sin(B * Math.PI / 180) + w, a = Math.floor(C(s.Scatter) + a), b = Math.floor(C(s.Scatter) + b), f = d.ToppingWidth, j = d.ToppingHeight, h = s.Code + "-" + Math.ceil(Math.random() *
                        s.Variations), k = s.Code, m(k, h, a, b, f, j), B += (s.Spacing + 15 / s.Weight) / v + s.RadialPadding;
            else if (q == "linear") {
                a = Math.floor(Math.sqrt(n[1]));
                b = n[1] / a;
                l = d.PatternSettings[q].Size.Width / b;
                w = d.PatternSettings[q].Size.Height / a;
                v = d.PatternSettings[q].OffsetLeft + (n[0] - 1) % b * l;
                n = d.PatternSettings[q].OffsetTop + (Math.ceil(n[0] / (n[1] / a)) - 1) * w;
                for (B = v; B < l + v; B += s.Spacing + 10 / s.Weight)
                    for (z = n; z < w + n; z += s.Spacing + 10 / s.Weight) a = C(s.Scatter) + (B - d.ToppingWidth / 2) + d.PatternSettings[q].OffsetLeft, b = C(s.Scatter) + (z - d.ToppingHeight /
                        2) + d.PatternSettings[q].OffsetTop, f = d.ToppingWidth, j = d.ToppingHeight, h = s.Code + "-" + Math.ceil(Math.random() * s.Variations), k = s.Code, m(k, h, a, b, f, j)
            }
        }
        var d = {
            CanvasContainer: {},
            CanvasContainerID: "pizzaCanvas",
            CrustList: "BK,DEEPDISH,GLUTENF,HANDTOSS,PAN,THIN,NPAN".split(","),
            ImageDir: urlConfig.assets + "/images/builder/pizza",
            ComponentImages: {},
            FlavorCode: "HANDTOSS",
            FlavorPatterns: {
                PAN: "linear"
            },
            PatternSettings: {
                radial: {
                    Size: {
                        Width: 300,
                        Height: 315
                    },
                    OffsetTop: 0,
                    OffsetLeft: 0
                },
                linear: {
                    Size: {
                        Width: 300,
                        Height: 315
                    },
                    OffsetTop: 0,
                    OffsetLeft: 0
                }
            },
            Toppings: {},
            ToppingWidth: 150,
            ToppingHeight: 150,
            ToppingConfigDefaults: {
                zIndex: 1,
                Scatter: 10,
                Code: "",
                Spacing: 30,
                Part: "1/1",
                RadialPadding: 5,
                Variations: 1,
                Weight: 1
            },
            ToppingConfig: {
                B: {
                    Spacing: 48,
                    zIndex: 2
                },
                Du: {
                    Spacing: 35,
                    Variations: 3,
                    zIndex: 2
                },
                E: {
                    Spacing: 30,
                    Variations: 3,
                    zIndex: 1
                },
                Fe: {
                    Spacing: 35,
                    Variations: 4,
                    zIndex: 3
                },
                G: {
                    Spacing: 35,
                    Variations: 3,
                    zIndex: 3
                },
                H: {
                    Spacing: 34,
                    Variations: 2,
                    zIndex: 2,
                    Scatter: 4
                },
                Ht: {
                    Spacing: 35,
                    Variations: 2,
                    zIndex: 4
                },
                J: {
                    Spacing: 32,
                    Variations: 4,
                    zIndex: 3
                },
                K: {
                    Spacing: 26,
                    Variations: 3,
                    zIndex: 2
                },
                M: {
                    Spacing: 32,
                    Variations: 4,
                    zIndex: 3
                },
                N: {
                    Spacing: 30,
                    Variations: 3,
                    zIndex: 3
                },
                O: {
                    Spacing: 35,
                    Variations: 3,
                    zIndex: 3
                },
                P: {
                    Spacing: 34,
                    Variations: 3,
                    Scatter: 5
                },
                Pm: {
                    Spacing: 34,
                    Variations: 3,
                    zIndex: 2
                },
                Py: {
                    Spacing: 40,
                    zIndex: 5
                },
                R: {
                    Spacing: 27,
                    Variations: 3,
                    zIndex: 3
                },
                Rr: {
                    Spacing: 35,
                    Variations: 4,
                    zIndex: 3
                },
                S: {
                    Spacing: 26,
                    Variations: 3,
                    zIndex: 2
                },
                Sa: {
                    Spacing: 35,
                    RadialPadding: 18,
                    zIndex: 2,
                    Variations: 3
                },
                Sb: {
                    Spacing: 36,
                    zIndex: 2,
                    Variations: 5,
                    RadialPadding: 22,
                    Scatter: 3
                },
                Si: {
                    Spacing: 29,
                    Variations: 3,
                    zIndex: 3
                },
                Td: {
                    Spacing: 32,
                    Variations: 3,
                    zIndex: 3
                },
                Z: {
                    Spacing: 35,
                    Variations: 5,
                    zIndex: 3
                },
                V: {
                    Spacing: 26,
                    Variations: 3,
                    zIndex: 3,
                    Scatter: 7
                }
            },
            CanvasSize: {
                Height: 315,
                Width: 300
            }
        };
        return function() {
            d.Toppings = {};
            d.CanvasContainer = document.getElementById(d.CanvasContainerID);
            for (var a in d.ToppingConfig) {
                d.ToppingConfig[a] = $.extend(true, {}, d.ToppingConfigDefaults, d.ToppingConfig[a], d.Toppings[a]);
                for (var g = 0; g < d.ToppingConfig[a].Variations; g++) {
                    var f = new Image;
                    f.src = d.ImageDir + "/toppings/" + a + "-" + (g + 1) + ".png";
                    d.ComponentImages[a +
                        "-" + (g + 1)] = f
                }
            }
            g = 0;
            for (a = d.CrustList.length; g < a; g++) {
                var f = new Image,
                    j = new Image,
                    h = d.CrustList[g];
                f.src = d.ImageDir + "/crusts/" + h + ".png";
                j.src = d.ImageDir + "/crusts/" + h + "_mask.png";
                d.ComponentImages[h] = f;
                d.ComponentImages[h + "_mask"] = j
            }
            this.setTopping = function(a) {
                a.Weight !== "0" ? (d.Toppings[a.Code] = a, b(a.Code)) : (delete d.Toppings[a.Code], o(a.Code))
            };
            this.setToppings = function(a) {
                for (var b in a) this.setTopping(a[b])
            };
            this.setCrustType = function(a) {
                d.FlavorCode = a;
                o("crust");
                o("mask");
                m("crust", d.FlavorCode,
                    0, 0).style.zIndex = 0;
                m("mask", d.FlavorCode + "_mask", 0, 0).style.zIndex = 15;
                for (var e in d.Toppings) b(e)
            };
            this.toJSON = function() {
                return $.extend({}, d)
            }
        }
    }();
(function(a) {
    function o(b, f) {
        this.toJSON = function() {
            return a.extend({}, e)
        };
        e = a.extend(true, {}, d, {
            Style: {
                Selector: b
            }
        }, f);
        var j = a('<div id="' + e.Style.Base + '"></div>').css(a.extend(true, {}, e.DefaultCSS, {
            background: "url('" + e.ImageDir + "/crusts/" + e.Flavor + ".png') no-repeat top left"
        })),
            j = j.add(a('<div id="' + e.Style.Mask + '"></div>').css(a.extend(true, {}, e.DefaultCSS, {
                background: "url('" + e.ImageDir + "/crusts/" + e.Flavor + "_mask.png') no-repeat top left"
            })));
        a(e.Style.Selector).html(j)
    }

    function m(a, b) {
        var d = e,
            h = d.Toppings[b],
            k = h.Part.split("/"),
            s = [],
            n = d.FlavorPatterns[d.Flavor],
            q = function(a) {
                return a - Math.ceil(Math.random() * a * 2)
            };
        if (d.ToppingConfig[b])
            if (n == "radial") {
                for (var m = d.PatternSettings[n].Size.Width / 2 - d.ToppingWidth / 2 + d.PatternSettings[n].OffsetLeft, l = d.PatternSettings[n].Size.Height / 2 - d.ToppingHeight / 2 + d.PatternSettings[n].OffsetTop, o = 0, n = Math.ceil(d.PatternSettings[n].Size.Width / 2 / h.Spacing) - 1; o < n; o++)
                    for (var v = 360 / parseInt(k[1]) * (parseInt(k[0]) - 1) + 90, B = v + 360 / parseInt(k[1]); v < B;) {
                        var z = o * h.Spacing,
                            y = z * Math.cos(v * Math.PI / 180) + m,
                            z = z * Math.sin(v * Math.PI / 180) + l;
                        s.push({
                            x: Math.floor(q(h.Scatter) + y),
                            y: Math.floor(q(h.Scatter) + z),
                            w: d.ToppingWidth,
                            h: d.ToppingHeight,
                            src: d.ImageDir + "/toppings/" + h.Code + "-" + Math.ceil(Math.random() * h.Variations) + ".png"
                        });
                        v += (h.Spacing + 15 / h.Weight) / o + h.RadialPadding
                    }
                e.Layers[h.Code].imageArray(s)
            } else if (n == "linear") {
            v = Math.floor(Math.sqrt(k[1]));
            o = k[1] / v;
            m = d.PatternSettings[n].Size.Width / o;
            l = d.PatternSettings[n].Size.Height / v;
            o = d.PatternSettings[n].OffsetLeft + (k[0] - 1) % o *
                m;
            k = d.PatternSettings[n].OffsetTop + (Math.ceil(k[0] / (k[1] / v)) - 1) * l;
            for (v = o; v < m + o; v += h.Spacing + 10 / h.Weight)
                for (B = k; B < l + k; B += h.Spacing + 10 / h.Weight) s.push({
                    x: q(h.Scatter) + (v - d.ToppingWidth / 2) + d.PatternSettings[n].OffsetLeft,
                    y: q(h.Scatter) + (B - d.ToppingHeight / 2) + d.PatternSettings[n].OffsetTop,
                    w: d.ToppingWidth,
                    h: d.ToppingHeight,
                    src: d.ImageDir + "/toppings/" + h.Code + "-" + Math.ceil(Math.random() * h.Variations) + ".png"
                });
            e.Layers[h.Code].imageArray(s)
        }
    }

    function b() {
        var b = e.ImageDir + "/crusts/" + e.Flavor;
        a("#" + e.Style.Base).css({
            background: "url('" + b + ".png') no-repeat top left"
        });
        for (var d in e.Toppings)
            if (d !== "" && e.Toppings[d].Update) {
                if (typeof e.Layers[d] === "undefined") {
                    var j = "placementCanvas-layer_" + d,
                        h = a.extend(true, {}, e.DefaultCSS, {
                            zIndex: e.DefaultCSS.zIndex + e.Toppings[d].zIndex
                        });
                    a(e.Style.Selector).append(a('<div id="' + j + '"></div>').css(h));
                    e.Layers[d] = Raphael(a("#" + j).get(0), e.Size.Width, e.Size.Height);
                    if (h.zIndex > e.MaxZIndex) e.MaxZIndex = h.zIndex
                }
                e.Layers[d].clear();
                m(this, d);
                e.Toppings[d].Update = false
            }
        a("#" + e.Style.Mask).css({
            background: "url('" + b + "_mask.png') no-repeat top left",
            zIndex: e.MaxZIndex + 1
        })
    }
    var d = {
        Flavor: "HANDTOSS",
        FlavorPatterns: {
            HANDTOSS: "radial",
            THIN: "radial",
            BK: "radial",
            DEEPDISH: "radial",
            PAN: "linear",
            GLUTENF: "radial",
            NPAN: "radial"
        },
        PatternSettings: {
            radial: {
                Size: {
                    Height: 330,
                    Width: 330
                },
                OffsetTop: -15,
                OffsetLeft: -14
            },
            linear: {
                Size: {
                    Width: 200,
                    Height: 285
                },
                OffsetTop: 2,
                OffsetLeft: 32
            }
        },
        ImageDir: "images/pizza",
        Layers: {},
        DefaultCSS: {
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            zIndex: 100,
            background: "",
            overflow: "hidden"
        },
        Style: {
            Selector: "",
            Base: "crust",
            Mask: "crustMask"
        },
        Size: {
            Height: 330,
            Width: 330
        },
        MaxZIndex: 1,
        Toppings: {},
        ToppingWidth: 150,
        ToppingHeight: 150,
        ToppingConfigDefaults: {
            Update: false,
            zIndex: 1,
            Scatter: 10,
            Code: "",
            Spacing: 30,
            Part: "1/1",
            RadialPadding: 5,
            Variations: 1,
            Weight: 1
        },
        ToppingConfig: {
            B: {
                Spacing: 48,
                Variations: 1,
                zIndex: 2
            },
            Du: {
                Spacing: 40,
                Variations: 3,
                zIndex: 2
            },
            E: {
                Spacing: 30,
                Variations: 3,
                zIndex: 1
            },
            Fe: {
                Spacing: 35,
                Variations: 4,
                zIndex: 3
            },
            G: {
                Spacing: 35,
                Variations: 3,
                zIndex: 3
            },
            H: {
                Spacing: 34,
                Variations: 2,
                zIndex: 2,
                Scatter: 4
            },
            Ht: {
                Spacing: 35,
                Variations: 2,
                zIndex: 4
            },
            J: {
                Spacing: 32,
                Variations: 4,
                zIndex: 3
            },
            K: {
                Spacing: 26,
                Variations: 3,
                zIndex: 2
            },
            M: {
                Spacing: 32,
                Variations: 4,
                zIndex: 3
            },
            N: {
                Spacing: 30,
                Variations: 3,
                zIndex: 3
            },
            O: {
                Spacing: 35,
                Variations: 3,
                zIndex: 3
            },
            P: {
                Spacing: 34,
                Variations: 3,
                zIndex: 1,
                Scatter: 5
            },
            Pm: {
                Spacing: 34,
                Variations: 3,
                zIndex: 2
            },
            Py: {
                Spacing: 40,
                Variations: 1,
                zIndex: 5
            },
            R: {
                Spacing: 27,
                Variations: 3,
                zIndex: 3
            },
            Rr: {
                Spacing: 35,
                Variations: 4,
                zIndex: 3
            },
            S: {
                Spacing: 26,
                Variations: 3,
                zIndex: 2
            },
            Sa: {
                Spacing: 38,
                Variations: 3,
                zIndex: 2,
                RadialPadding: 18
            },
            Sb: {
                Spacing: 36,
                Variations: 5,
                zIndex: 2,
                RadialPadding: 22,
                Scatter: 3
            },
            Si: {
                Spacing: 24,
                Variations: 3,
                zIndex: 3
            },
            Td: {
                Spacing: 32,
                Variations: 3,
                zIndex: 3
            },
            Z: {
                Spacing: 40,
                Variations: 5,
                zIndex: 3
            },
            V: {
                Spacing: 26,
                Variations: 3,
                zIndex: 3,
                Scatter: 7
            }
        }
    }, e = {};
    window.pizzaBuilder = function(a, b) {
        return new o(a, b)
    };
    window.pizzaBuilder.preloadImages = function(b) {
        for (var e in d.FlavorPatterns) {
            var j = a("<div/>").css({
                background: "url('" + b + "/crusts/" + e + ".png') no-repeat top left"
            });
            a("body").append(j)
        }
        setTimeout(function() {
            for (var e in d.FlavorPatterns) {
                var f =
                    a("<div/>").css({
                        background: "url('" + b + "/crusts/" + e + "_mask.png') no-repeat top left"
                    });
                a("body").append(f)
            }
        }, 250);
        setTimeout(function() {
            for (var a in d.ToppingConfig)
                for (var e = 1, f = d.ToppingConfig[a].Variations; e <= f; e++)(new Image).src = b + "/toppings/" + a + "-" + e + ".png"
        }, 500)
    };
    o.prototype.setCrustType = function(a) {
        e.Flavor = a;
        for (key in e.Toppings) e.Toppings[key].Update = true;
        b()
    };
    o.prototype.setTopping = function(d, f) {
        var j = a.extend({}, e.ToppingConfigDefaults, e.ToppingConfig[d.Code], d);
        j.Update = typeof e.Toppings[j.Code] ==
            "undefined" ? true : e.Toppings[j.Code].Part != j.Part || e.Toppings[j.Code].Weight != j.Weight;
        e.Toppings[j.Code] = j;
        f || b()
    };
    o.prototype.setToppings = function(a) {
        for (var e in a) this.setTopping(a[e], true);
        b()
    }
})(jQuery);
(function(a) {
    window.useDynamicTitleTags = true;
    simplr.controller.mAddBases(["order"]);
    a.extend(true, site, {
        data: {
            hash: {
                init: "/locations/search/",
                wait: true
            },
            uiConfig: {
                orderSummaryScroller: null,
                checkoutDetailsScroller: null
            },
            navigation: {
                states: {
                    main: {
                        HOME: "home",
                        ENTREES: "entrees",
                        SIDESANDDESSERTS: "sides",
                        DRINKS: "drinks",
                        COUPONS: "coupons",
                        GROUPORDERING: "groupOrdering"
                    }
                }
            },
            popularItems: [],
            crossSellItemsQuickList: [],
            couponWizardImportantProductCodes: {},
            hotDeals: {
                foodQuickListData: [],
                couponCodes: []
            },
            stJudeVariants: ["STJUDE",
                "STJUDE2", "STJUDE5", "STJUDE10"
            ]
        },
        initPage: function() {
            pizzaBuilder.preloadImages(urlConfig.assets + "/images/builder/pizza");
            if (window.location.hash != "") site.oloTools.config.oloRedirect = "";
            site.storage.remove("hasShownCarryoutWarning");
            site.storage.remove("hasShownDeliveryWarning");
            site.oloTools.makeReady();
            simplr.view.mRender({
                name: "main_sub_navigation",
                data: {
                    mIndex: -1,
                    sIndex: -1
                },
                selector: "#js-subNavigationPage"
            });
            simplr.view.mRender({
                name: "order_column",
                data: {},
                selector: "#js-myOrderPage"
            });
            simplr.view.mRender({
                name: "profile_column",
                data: {},
                selector: "#js-myProfilePage"
            });
            site.data.uiConfig.orderSummaryScroller = simplr.ui.widget.oTrackableScrollingElement({
                containerSelector: "#js-splitFrame",
                elementSelector: ".pageRightColumn",
                animateSpeed: 500,
                refreshSpeed: 100
            })
        },
        oloTools: {
            config: {
                pageOLODataReady: function() {
                    jsDPZ.app.customer.getCustomer().data.Session.IsReordering || site.func.resetOrderingData()
                },
                oloRedirect: "/section/Food/category/AllEntrees/"
            }
        },
        func: {
            showColumn: function() {
                window.scroll(0, 0);
                site.data.uiConfig.orderSummaryScroller.reset();
                a("#js-splitFrame").show();
                a("#js-fullFrame").hide()
            },
            showFull: function() {
                window.scroll(0, 0);
                a("#js-splitFrame").hide();
                a("#js-fullFrame").show()
            },
            changeNavigationState: function(b) {
                b = a.extend({
                    main: "",
                    sub: ""
                }, b);
                b.main == "groupOrdering" ? a("#js-hotDeals").hide() : a("#js-hotDeals").show();
                a("#discountDashboard").is(":visible") && site.func.positionDiscountDashboard();
                simplr.view.mRender({
                    name: "main_sub_navigation",
                    data: {
                        main: b.main,
                        sub: b.sub
                    },
                    selector: "#js-subNavigationPage"
                })
            },
            changeServiceMethod: function(a,
                d) {
                var d = d || {}, e = jsDPZ.app.order.getOrder().data;
                jsDPZ.app.customer.getCustomer().getSessionData().ServiceMethod = a;
                e.Details.ServiceMethod = a;
                if (a == "Carryout") e.Customer.Address.DeliveryInstructions = "", !d.noWarnSubstitute && jsDPZ.app.order.getOrder().data.Details.SubstitutedStore && site.func.overlayToggle(true, "codeOverlay", {}, {
                    code: "iCarryoutStoreSubstitute",
                    label: jsDPZ.app.store.getStore().getAddress().getDisplayAddress().join("<br/>"),
                    success: true
                });
                site.storage.save("ServiceType", a);
                jsDPZ.app.order.getOrder().orderChanged()
            },
            resetOrderingData: function(b) {
                for (var b = a.extend({
                    runValidate: false
                }, b), d = jsDPZ.app.order.getOrder().data.Details, e = [], g = 0, f = d.Coupons.length; g < f; g++) {
                    var j = d.Coupons[g];
                    e.push("/order/coupons/new?code=" + j.Code + "&qty=" + j.Qty)
                }
                site.catalogTools.cleanseOrder();
                simplr.view.mRender({
                    name: "order_column",
                    data: {},
                    selector: "#js-myOrderPage"
                });
                simplr.view.mRender({
                    name: "profile_column",
                    data: {},
                    selector: "#js-myProfilePage"
                });
                simplr.view.mRender({
                    name: "hotDealsInColumn",
                    data: {},
                    selector: "#js-hotDeals"
                });
                simplr.view.mRender({
                    name: "promoInColumn",
                    data: {},
                    selector: "#js-sidePromo"
                });
                if (e.length > 0) {
                    g = 0;
                    for (f = e.length; g < f; g++) simplr.controller.mRouteAndExecute(e[g])
                } else d.Variants.length > 0 && (!site.func.isOnCheckoutPage() || b.runValidate == true) && simplr.controller.mRouteAndExecute("/order/validate/");
                site.sessionTools.save()
            },
            changeInOrder: function() {
                simplr.view.mRender({
                    name: "order_column",
                    data: {},
                    selector: "#js-myOrderPage"
                });
                simplr.view.mRender({
                    name: "hotDealsInColumn",
                    data: {},
                    selector: "#js-hotDeals"
                });
                if (jsDPZ.app.customer.getCustomer().data.Session.WatchEasyOrder) jsDPZ.app.customer.getCustomer().data.Session.OrderModified =
                    true;
                site.sessionTools.save()
            },
            addVariant: function(a) {
                a = jsDPZ.app.order.addVariantAndReturnStatus(a);
                simplr.util.mEmpty(a.SuccessCodes) ? simplr.util.mEmpty(a.ErrorCodes) || site.func.overlayToggle(true, "codeOverlay", {}, {
                    code: a.ErrorCodes[0]
                }) : site.func.overlayToggle(true, "codeOverlay", {}, {
                    success: true,
                    code: a.SuccessCodes[0]
                });
                return a.Success
            },
            addCoupon: function(b) {
                var d = jsDPZ.app.order.addCouponAndReturnStatus(b),
                    e = jsDPZ.app.order.getOrder().data.Details.ServiceMethod,
                    g = e == "Carryout" ? a.validator.labels.Carryout :
                        a.validator.labels.Delivery,
                    f = e == "Carryout" ? "Delivery" : "Carryout",
                    e = e == "Carryout" ? a.validator.labels.Delivery : a.validator.labels.Carryout;
                if (simplr.util.mEmpty(d.SuccessCodes)) {
                    if (!simplr.util.mEmpty(d.ErrorCodes)) site.data.couponUnavailable = b.Code, d.ErrorCodes == "eCouponServiceMethod" ? site.func.overlayToggle(true, "codeOverlay", {}, {
                        code: d.ErrorCodes[0],
                        label: [e, g, e, "#/order/coupons/new?code=" + b.Code + "&qty=" + b.Qty, e]
                    }, function() {
                        a("#changeServiceAddCoupon").click(function(b) {
                            b.preventDefault();
                            b = a("#orderDetailsInColumn #Service_Method_" +
                                f);
                            site.func.changeServiceMethod(f);
                            simplr.controller.mRouteAndExecute(site.func.buildURL({
                                url: a("#changeServiceAddCoupon").attr("href")
                            }));
                            b.attr("checked", "true")
                        })
                    }) : d.ErrorCodes != "eCouponDuplicate" && !site.func.isGroupOrdering() && site.func.overlayToggle(true, "codeOverlay", {}, {
                        code: d.ErrorCodes[0]
                    })
                } else site.func.overlayToggle(true, "codeOverlay", {}, {
                    success: true,
                    code: d.SuccessCodes[0]
                });
                d.Success && (site.func.toggleLoading(true), jsDPZ.ajax.coupon({
                    StoreID: jsDPZ.app.customer.getCustomer().data.Session.StoreID,
                    CouponCode: b.Code,
                    success: function(a) {
                        jsDPZ.app.order.updateFulfillerFromPowerCoupon(a);
                        simplr.controller.mRouteAndExecute("/order/validate/");
                        if (site.func.isGroupOrdering()) jsDPZ.app.order.getOrder().data.Tags.usingGroupOrderingCoupons = true
                    },
                    error: function() {
                        site.func.powerCommunicationError()
                    },
                    complete: function() {
                        site.func.toggleLoading(false);
                        simplr.view.mRender({
                            name: "coupon_enter_form",
                            data: {},
                            selector: "#couponEnterCode .js-couponEnterForm"
                        });
                        simplr.view.mRender({
                            name: "coupon_enter_form",
                            data: {},
                            selector: "#allEntrees .js-couponEnterForm"
                        });
                        simplr.view.mRender({
                            name: "coupon_enter_form",
                            data: {},
                            selector: "#orderCheckoutPage .js-couponEnterForm"
                        })
                    }
                }));
                return d.Success
            },
            isOnCheckoutPage: function() {
                return location.hash == "#/checkout/"
            },
            updateFulfillerStatus: function() {
                var b = a.extend(true, [], jsDPZ.app.order.getOrder().data.Fulfiller.Groups),
                    d = a.extend(true, {}, jsDPZ.app.order.getOrder().data.Details),
                    e = [];
                a.each(b, function(b, f) {
                    var g = [],
                        h = [];
                    a.each(f.UnFulfilled, function(b, e) {
                        var f = true;
                        a.each(e,
                            function(e, j) {
                                a.each(j.Variants, function(e, j) {
                                    a.each(d.Variants, function(a, e) {
                                        if (e.Code == j && e.Qty > 0) return f = false, e.Qty -= 1, e.Qty == 0 && h.push(a), g.push(b), f
                                    });
                                    return f
                                });
                                return f
                            })
                    });
                    a.each(g.sort(function(a, b) {
                        return b - a
                    }), function(a, b) {
                        f.UnFulfilled.remove(b)
                    });
                    a.each(h.sort(function(a, b) {
                        return b - a
                    }), function(a, b) {
                        d.Variants.remove(b)
                    });
                    f.UnFulfilled.length === 0 && e.push(f.GroupID)
                });
                for (var g = 0, f = e.length; g < f; g++)
                    for (var j = e[g], h = 0; h < b.length; h++)
                        if (b[h].GroupID == j) {
                            b.remove(h);
                            break
                        }
                return b
            },
            processPowerOrderResponse: function(b,
                d) {
                var e = false;
                jsDPZ.app.order.updateOrderFromPower(b);
                jsDPZ.util.empty(b.Order.StatusItems) || a.each(b.Order.StatusItems, function(b, d) {
                    var j = d.Code == "ServiceMethodNotAllowed" || d.Code == "PosOrderSubmitError" && d.PulseText == "Out of Delivery Area" ? "eServiceMethodChanged" : d.Code == "StoreInWarningTimeForCarryout" && jsDPZ.util.empty(site.storage.load("hasShownCarryoutWarning")) ? "_ServiceMethodCarryoutWarning" : d.Code == "StoreInWarningTimeForDelivery" && jsDPZ.util.empty(site.storage.load("hasShownDeliveryWarning")) ?
                        "iStoreClosingWarning" : d.Code == "StoreClosedForCarryout" ? "eLobbyClosed" : d.Code == "ShopRunnerSessionInvalid" ? "_ShopRunnerSessionInvalid" : d.Code == "StoreClosedForFutureTime" || d.Code == "PosUnknownError" && d.PulseText == "Advance Order Date is more than 30 days from now" || d.Code == "PosUnknownError" && d.PulseText == "Advance Order Time is too soon" ? "eOrderDateTimeInvalid" : d.Code == "MissingStreetNumberAndName" ? "eMissingStreetNumberAndName" : d.Code == "StoreInWarningTimeForDelivery" || d.Code == "StoreInWarningTimeForCarryout" ||
                        d.Code == "AutoAddedOrderId" || d.Code == "CashLimitExceeded" || d.Code == "PosOrderIncomplete" && d.PulseText == "No Items In Order" || d.Code == "BelowMinimumDeliveryAmount" ? "" : d.Code == "StoreClosed" ? "StoreClosed" : "eGenericPointOfServiceError";
                    if (j == "eServiceMethodChanged") {
                        var h = jsDPZ.app.customer.getCustomer().getSessionData(),
                            k = h.ServiceMethod;
                        site.func.changeServiceMethod(k == "Delivery" ? "Carryout" : "Delivery", {
                            noWarnSubstitute: true
                        });
                        if (k == "Delivery") jsDPZ.app.customer.getCustomer().getSessionData().DeliveryAvailable =
                            false, simplr.util.mEmpty(h.Address.Street) && (site.storage.save("ServiceType", "Delivery"), j = "eAddressIncompleteError");
                        site.func.overlayToggle(true, "codeOverlay", {}, {
                            code: j
                        });
                        simplr.view.mRender({
                            name: "profile_column",
                            data: {},
                            selector: "#js-myProfilePage"
                        });
                        e = true
                    } else j == "_ServiceMethodCarryoutWarning" ? (site.func.overlayToggle(true, "serviceMethodCarryoutWarningOverlay", {}, {}), site.storage.save("hasShownCarryoutWarning", "true")) : j == "iStoreClosingWarning" ? (h = jsDPZ.app.store.getStore(), h = jsDPZ.obj.dateTime(h.data.StoreAsOfTime.split(" ")[0] +
                        " " + h.getServiceMethodBusinessDayTimes({
                            serviceMethod: "Delivery"
                        }).CloseTime).getDisplayFormat("_h:mma_p"), site.func.overlayToggle(true, "codeOverlay", {}, {
                        label: h,
                        code: j,
                        success: true
                    }), site.storage.save("hasShownDeliveryWarning", "true")) : j == "eLobbyClosed" ? (simplr.controller.mRouteAndExecute("/customer/store/delete"), site.func.overlayToggle(true, "codeOverlay", {}, {
                        code: j
                    })) : j == "_ShopRunnerSessionInvalid" ? site.func.logoutShoprunner() : j == "eOrderDateTimeInvalid" || j == "StoreClosed" ? site.func.overlayToggle(true,
                        "changeOrderTimingOverlay", {}, {}) : j == "eGenericPointOfServiceError" ? (site.trigger.onEvent({
                        breadcrumb: ["Order", "PointOfServiceError", (!simplr.util.mEmpty(d.Code) ? "Code:" + d.Code : "") + (!simplr.util.mEmpty(d.PulseCode) ? " - PulseCode:" + d.PulseCode : "") + (!simplr.util.mEmpty(d.PulseText) ? " - PulseText:" + d.PulseText : "")]
                    }), site.func.overlayToggle(true, "codeOverlay", {}, {
                        code: "eGenericPointOfServiceError",
                        label: site.format.phoneNumber({
                            number: jsDPZ.app.store.getStore().data.Phone
                        })
                    })) : j == "eMissingStreetNumberAndName" &&
                        site.func.overlayToggle(true, "codeOverlay", {}, {
                            code: j
                        }, function() {
                            a("#genericOverlay .js-closeButton").on("click", function(a) {
                                a.preventDefault();
                                window.location.hash = "#/locations/search/"
                            })
                        })
                });
                jsDPZ.util.empty(b.Order.Coupons) || a.each(b.Order.Coupons, function(b, e) {
                    e.StatusItems && a.each(e.StatusItems, function(b, d) {
                        var g = d.Code == "UsageCountViolation" ? "eCouponUsageCountViolation" : d.Code == "InvalidServiceMethodForCoupon" ? "eCouponServiceMethodChanged" : d.Code == "CouponExclusivityViolation" ? "eCouponDuplicate" :
                            d.Code == "BelowMinimumOrderAmount" ? "eCouponBelowMinimumOrderAmount" : "";
                        if (g == "eCouponUsageCountViolation" || g == "eCouponServiceMethodChanged" || g == "eCouponDuplicate" && !site.func.isGroupOrdering()) {
                            var s = jsDPZ.app.order.getOrder().data.Details.ServiceMethod,
                                n = s == "Carryout" ? a.validator.labels.Carryout : a.validator.labels.Delivery,
                                s = s == "Carryout" ? a.validator.labels.Delivery : a.validator.labels.Carryout;
                            site.func.overlayToggle(true, "couponCodeWithRemoveOverlay", {}, {
                                code: g,
                                CouponID: e.ID,
                                label: [s, n, n, s, n, s]
                            })
                        } else if (g ==
                            "eCouponBelowMinimumOrderAmount") n = jsDPZ.app.catalog.getCatalog().getCoupon(e.Code).data, site.func.overlayToggle(true, "codeOverlay", {}, {
                            code: g,
                            label: n.Tags.MinimumOrderAmount
                        })
                    })
                });
                site.func.changeInOrder();
                b.Status > -1 ? simplr.controller.mRouteAndExecute("/fulfiller/") : e && (jsDPZ.app.order.getOrder().orderChanged(), simplr.controller.mRouteAndExecute(d))
            }
        }
    });
    var o = simplr.util.mGetUrlParameter();
    if (!simplr.util.mEmpty(o)) {
        if (!simplr.util.mEmpty(o.redirect)) site.oloTools.config.persistRedirect = true, site.oloTools.config.oloRedirect =
            o.redirect;
        if (!simplr.util.mEmpty(o.cmd)) site.oloTools.config.oloCmd = o.cmd
    }(function() {
        function b(a, b) {
            for (var d = 0, j = b.length; d < j; d++)
                if (b[d].Code == a) return true;
            return false
        }

        function d(e) {
            var d = false,
                f = jsDPZ.app.order.getOrder().data.Details.Coupons;
            if (!b(e.data.Code, f)) {
                var j = e.getCombineFlag();
                a.each(f, function(a, b) {
                    var e = jsDPZ.app.catalog.getCatalog().getCoupon(b.Code).getCombineFlag();
                    return !(d = !(j == "Normal" && e == "Complementary" || j == "Complementary" && e == "Normal" || j == "Complementary" && e == "Complementary"))
                })
            }
            return d
        }
        simplr.controller.mAddCommands({
            addCouponToOrder: {
                route: ["order", "coupons", "new"],
                callback: function(a) {
                    site.oloTools.whenReady({
                        oloReady: function() {
                            if (!jsDPZ.util.empty(a.parameters.code)) {
                                site.trigger.onEvent({
                                    group: "Entrees",
                                    subGroup: "Add a Coupon"
                                });
                                var b = jsDPZ.app.catalog.getCatalog().getCoupon(a.parameters.code);
                                jsDPZ.util.empty(b) ? (site.func.toggleLoading(true), jsDPZ.ajax.coupon({
                                    StoreID: jsDPZ.app.customer.getCustomer().data.Session.StoreID,
                                    CouponCode: a.parameters.code,
                                    success: function(b) {
                                        jsDPZ.app.catalog.setCouponFromPower(b);
                                        a.parameters.code = b.Code;
                                        b = jsDPZ.app.catalog.getCatalog().getCoupon(a.parameters.code);
                                        d(b) ? site.func.overlayToggle(true, "couponExclusivityOverlay", {}, a.parameters) : site.func.addCoupon(site.catalogTools.getOrderCouponFromURLParameters(a.parameters))
                                    },
                                    error: function() {
                                        jsDPZ.app.customer.getCustomer().data.Session.Reorder ? site.data.couponUnavailable = a.parameters.code : site.func.overlayToggle(true, "codeOverlay", {}, {
                                            code: "eCouponInvalid"
                                        })
                                    },
                                    complete: function() {
                                        site.func.toggleLoading(false)
                                    },
                                    async: false
                                })) :
                                    d(b) ? site.func.overlayToggle(true, "couponExclusivityOverlay", {}, a.parameters) : site.func.addCoupon(site.catalogTools.getOrderCouponFromURLParameters(a.parameters))
                            }
                        }
                    })
                }
            }
        })
    })();
    simplr.controller.mAddCommands({
        addVariantToOrder: {
            route: ["order", "variant", "new"],
            callback: function(b) {
                site.oloTools.whenReady({
                    oloReady: function() {
                        if (!jsDPZ.util.empty(b.parameters.code)) {
                            var d = site.catalogTools.orderVariantFromURLParameters(b.parameters);
                            if (site.func.addVariant(d)) {
                                var e = jsDPZ.app.catalog.getCatalog(),
                                    g = e.getVariant(d.Code).data,
                                    e = e.getProduct(g.ProductCode).data,
                                    g = {
                                        route: b,
                                        group: e.ProductType,
                                        subGroup: jsDPZ.util.htmlUnEscape(g.Name)
                                    };
                                switch (e.ProductType) {
                                    case "GSalad":
                                        g.group = "Salad";
                                        break;
                                    case "Sides":
                                        g.group = "Extras";
                                        break;
                                    case "Wings":
                                        g.group = "Chicken"
                                }
                                g.title = g.group + " " + g.subGroup + " Add to Cart";
                                site.trigger.onEvent(g);
                                a("body").trigger("/order/variant/new/");
                                simplr.controller.mRouteAndExecute("/order/validate/")
                            }
                        }
                        if (killConfig.isActive("stJude"))
                            for (i = 0; i < site.data.stJudeVariants.length; i++)
                                if (site.data.stJudeVariants[i] ===
                                    d.Code) {
                                    setTimeout(function() {
                                        a("#js-sidePromo").slideUp("slow")
                                    }, 500);
                                    break
                                }
                    }
                })
            }
        }
    });
    simplr.controller.mAddCommands({
        autoLocateStore: {
            route: ["locate", "view"],
            callback: function(b) {
                site.func.changeNavigationState({
                    main: "",
                    sub: ""
                });
                site.func.showColumn();
                site.locationTools.getSearchTypeByParameters(b.parameters) ? site.locationTools.performStoreSearch({
                    data: b.parameters,
                    success: function(d) {
                        var e = "",
                            g = false,
                            f = jsDPZ.app.customer.getCustomer().data,
                            j = f.Session.Address,
                            h = b.parameters.type;
                        h == "Carryout" && !simplr.util.mEmpty(site.storage.load("PrevStoreID")) ?
                            a.each(jsDPZ.app.search.getStoreSearch().getStores(), function(a, b) {
                                if (b.data.StoreID == site.storage.load("PrevStoreID") && b.isOnlineRightNow() && b.data.AllowCarryoutOrders) return e = b.data.StoreID, false
                            }) : h == "Delivery" && a.each(jsDPZ.app.search.getStoreSearch().getStores(), function(a, b) {
                                if (b.data.IsDeliveryStore && b.isOnlineRightNow() && b.data.AllowDeliveryOrders) return e = b.data.StoreID, g = b.data.Substituted, false
                            });
                        if (d.Stores.length > 0 && j.SaveToProfile && (delete j.SaveToProfile, site.sessionTools.save({
                                async: false
                            }),
                            site.func.customerLoggedIn())) f.Session.AddressSelection = j.Name, simplr.controller.mRouteAndExecute(site.func.buildURL({
                            url: "#/customer/location/create",
                            parameters: j
                        }));
                        site.storage.save("dpz_customer_address", jsDPZ.dataConversion.JSONObjectToString(j));
                        simplr.util.mEmpty(e) ? window.location.hash = site.func.buildURL({
                            url: "#/locations/search/",
                            parameters: b.parameters
                        }) : (simplr.controller.mRouteAndExecute(site.func.buildURL({
                                url: "#/customer/store/update",
                                parameters: {
                                    StoreID: e,
                                    Substituted: g,
                                    ServiceMethod: h
                                }
                            })),
                            site.func.tryRedirect("#/section/Food/category/AllEntrees/"))
                    }
                }) : simplr.controller.mRouteAndExecute("/locations/search/")
            }
        }
    });
    simplr.controller.mAddCommands({
        locateStore: {
            route: ["locate-store", "view"],
            callback: function(a) {
                site.oloTools.whenReady({
                    oloReady: function() {
                        jsDPZ.app.order.getOrder();
                        var d = jsDPZ.app.customer.getCustomer().data.Session,
                            e = site.func.buildURL({
                                url: "/",
                                parameters: a.parameters
                            }),
                            e = e ? "/pages/order/route.jsp" + e : "/pages/order/#/checkout/";
                        site.func.toggleLoading(true);
                        site.func.setRedirect(urlConfig.localRoot +
                            e);
                        site.storage.save("PrevStoreID", d.StoreID);
                        simplr.controller.mRouteAndExecute(site.func.buildURL({
                            url: "#/locate/?type=" + d.ServiceMethod,
                            parameters: site.locationTools.buildSessionParameters(d.Address)
                        }));
                        site.func.showFull()
                    }
                })
            }
        }
    });
    simplr.controller.mAddCommands({
        category: {
            route: ["section", "category", "view"],
            callback: function(b) {
                site.oloTools.whenReady({
                    oloReady: function() {
                        var d = {
                            route: b,
                            group: "",
                            subGroup: ""
                        };
                        site.func.showColumn();
                        a(".buttonCheckout").show();
                        site.trigger.onEvent({
                            title: "Entrees Home ABTest"
                        });
                        if (site.catalogTools.categoryExists(b.resources)) {
                            var e = {
                                section: b.resources.section,
                                category: b.resources.category
                            }, g = jsDPZ.app.catalog.getCatalog().getCategoryData(e.section, e.category),
                                f = site.catalogTools.getCategoryType(e),
                                g = {
                                    categoryParams: e,
                                    categoryData: g
                                };
                            site.func.changeNavigationState(site.catalogTools.getCategoryNavigationState(e));
                            if (f == site.catalogTools.config.categoryTypes.COUPON_1) {
                                e = b.resources.category;
                                switch (e) {
                                    case "All":
                                        d.group = "Coupons";
                                        d.subGroup = "All";
                                        break;
                                    case "MostPopular":
                                        d.group =
                                            "Coupons";
                                        d.subGroup = "Most Popular";
                                        break;
                                    case "Feeds1To2":
                                        d.group = "Coupons";
                                        d.subGroup = "Feeds 1-2";
                                        break;
                                    case "Feeds3To5":
                                        d.group = "Coupons";
                                        d.subGroup = "Feeds 3-5";
                                        break;
                                    case "Feeds6Plus":
                                        d.group = "Coupons";
                                        d.subGroup = "Feeds 6 Plus";
                                        break;
                                    case "LunchOffers":
                                        d.group = "Coupons";
                                        d.subGroup = "Lunch Offers";
                                        break;
                                    case "EnterCode":
                                        d.group = "Coupons";
                                        d.subGroup = "Enter Code";
                                        break;
                                    default:
                                        d.group = "", d.subGroup = ""
                                }
                                site.trigger.onPage(d);
                                simplr.view.mRender({
                                    name: "category_coupon1",
                                    data: g,
                                    selector: "#js-pageSplit"
                                })
                            } else {
                                e =
                                    b.resources.category;
                                switch (e) {
                                    case "GSalad":
                                        d.group = "Salad";
                                        d.subGroup = "Salad";
                                        break;
                                    case "Sides":
                                        d.group = "Extras";
                                        d.subGroup = "Extras";
                                        break;
                                    case "Wings":
                                        d.group = "Chicken";
                                        d.subGroup = "Chicken";
                                        break;
                                    default:
                                        d.group = b.resources.category, d.subGroup = b.resources.category
                                }
                                site.trigger.onPage(d);
                                simplr.view.mRender({
                                    name: "category_product2",
                                    data: g,
                                    selector: "#js-pageSplit"
                                })
                            }
                        } else e = {
                            section: b.resources.section,
                            category: b.resources.category
                        }, b.resources.category == "AllSides" ? (d.group = "Sides", d.subGroup =
                            "All", site.trigger.onPage(d), simplr.view.mRender({
                                name: "all_sides",
                                data: {
                                    categoryParams: e
                                },
                                selector: "#js-pageSplit"
                            }), site.func.changeNavigationState({
                                main: site.data.navigation.states.main.SIDESANDDESSERTS,
                                sub: "All"
                            })) : b.resources.category == "AllDrinks" ? (d.group = "Drinks", d.subGroup = "All", site.trigger.onPage(d), simplr.view.mRender({
                            name: "all_drinks",
                            data: {
                                categoryParams: e
                            },
                            selector: "#js-pageSplit"
                        }), site.func.changeNavigationState({
                            main: site.data.navigation.states.main.DRINKS,
                            sub: "All"
                        })) : b.resources.category ==
                            "EnterCode" ? (d.group = "Coupons", d.subGroup = "Enter Code", site.trigger.onPage(d), simplr.view.mRender({
                                name: "coupon_enter_code",
                                data: {
                                    categoryParams: e
                                },
                                selector: "#js-pageSplit"
                            }), site.func.changeNavigationState(site.catalogTools.getCategoryNavigationState(b.resources))) : b.resources.section == "GroupOrdering" ? (d.group = "Group Ordering", d.subGroup = b.resources.category, site.trigger.onPage(d), simplr.view.mRender({
                                name: "group_ordering",
                                data: {
                                    categoryParams: e
                                },
                                selector: "#js-pageSplit"
                            }), site.func.changeNavigationState(site.catalogTools.getCategoryNavigationState(b.resources))) :
                            (b.resources.section == "Coupons" && site.func.overlayToggle(true, "codeOverlay", {}, {
                            code: "eCouponsNotAvailable"
                        }, function() {
                            window.location.hash = "#/section/Food/category/AllEntrees/"
                        }), d.group = "Entrees", d.subGroup = "All", site.trigger.onPage(d), simplr.view.mRender({
                            name: "all_entrees",
                            data: {
                                categoryParams: e
                            },
                            selector: "#js-pageSplit"
                        }), site.func.changeNavigationState({
                            main: site.data.navigation.states.main.ENTREES,
                            sub: "All"
                        }))
                    }
                })
            }
        }
    });
    simplr.controller.mAddCommands({
        orderCheckout: {
            route: ["checkout", "view"],
            callback: function(a) {
                site.oloTools.whenReady({
                    oloReady: function() {
                        jsDPZ.app.order.getOrder().data.Details.Variants.length > 0 ? (site.trigger.onPage({
                            route: a,
                            group: "Checkout",
                            subGroup: "Review Order",
                            title: "Checkout Review Order"
                        }), jsDPZ.app.customer.getCustomer().data.Session.IsEasyOrder || jsDPZ.app.customer.getCustomer().data.Session.IsRecentOrder ? simplr.controller.mRouteAndExecute("/order/price/?checkout=1") : killConfig.isActive("mBox") ? setTimeout(function() {
                            site.data.ABData.upsellAtBasket ? simplr.controller.mRouteAndExecute("/order/price/?checkout=1") :
                                (site.func.toggleLoading(false), simplr.controller.mRouteAndExecute("/order/upsell/"))
                        }, 800) : simplr.controller.mRouteAndExecute("/order/upsell/")) : window.location.hash = "/section/Food/category/AllEntrees/"
                    }
                })
            }
        }
    });
    simplr.controller.mAddCommands({
        deleteVariantFromOrder: {
            route: ["order", "coupons", "delete"],
            callback: function(b) {
                site.oloTools.whenReady({
                    oloReady: function() {
                        if (!jsDPZ.util.empty(b.resources.coupons)) {
                            var d = jsDPZ.app.order.getOrder(),
                                d = a.extend(true, {}, d.getItemData({
                                    ID: b.resources.coupons
                                }));
                            simplr.util.mEmpty(d) || (site.trigger.onEvent({
                                title: "Coupons Remove Coupon",
                                group: "Coupons",
                                subGroup: "Remove Coupon " + d.Code
                            }), jsDPZ.app.order.getOrder().removeCoupon({
                                ID: d.ID
                            }), simplr.controller.mRouteAndExecute("/order/validate/"), simplr.view.mRender({
                                name: "coupon_enter_form",
                                data: {},
                                selector: "#couponEnterCode .js-couponEnterForm"
                            }), simplr.view.mRender({
                                name: "coupon_enter_form",
                                data: {},
                                selector: "#allEntrees .js-couponEnterForm"
                            }), simplr.view.mRender({
                                name: "coupon_enter_form",
                                data: {},
                                selector: "#orderCheckoutPage .js-couponEnterForm"
                            }))
                        }
                    }
                })
            }
        }
    });
    simplr.controller.mAddCommands({
        deleteCustomerStore: {
            route: ["customer", "store", "delete"],
            callback: function() {
                site.oloTools.reset();
                jsDPZ.app.customer.getCustomer().data.Session.StoreID = "";
                jsDPZ.app.store.setStore();
                site.sessionTools.save();
                simplr.view.mRender({
                    name: "profile_column",
                    data: {},
                    selector: "#js-myProfilePage"
                });
                simplr.view.mRender({
                    name: "order_column",
                    data: {},
                    selector: "#js-myOrderPage"
                });
                var a = jsDPZ.app.order.getOrder(),
                    a = site.locationTools.buildSearchParameters(site.locationTools.addressToFieldData(a.data.Customer.Address)),
                    a = site.func.buildURL({
                        url: "#/locations/results/?type=all",
                        parameters: a
                    });
                window.location.hash = a
            }
        }
    });
    simplr.controller.mAddCommands({
        deleteVariantFromOrder: {
            route: ["order", "variant", "delete"],
            callback: function(b) {
                site.oloTools.whenReady({
                    oloReady: function() {
                        if (!jsDPZ.util.empty(b.resources.variant)) {
                            var d = jsDPZ.app.order.getOrder(),
                                e = a.extend(true, {}, d.getItemData({
                                    ID: b.resources.variant
                                }));
                            simplr.util.mEmpty(e) || (site.trigger.onEvent({
                                title: "Entrees Remove Variant",
                                group: "Entrees",
                                subGroup: "Remove Variant " + e.Code
                            }), d.removeVariant({
                                ID: e.ID
                            }), simplr.controller.mRouteAndExecute("/order/validate/"))
                        }
                        if (killConfig.isActive("stJude"))
                            for (i = 0; i < site.data.stJudeVariants.length; i++)
                                if (site.data.stJudeVariants[i] === e.Code) {
                                    setTimeout(function() {
                                        a("#js-sidePromo").slideDown("slow")
                                    }, 500);
                                    break
                                }
                    }
                })
            }
        }
    });
    simplr.controller.mAddCommands({
        order_product_edit: {
            route: ["order", "variant", "view"],
            callback: function(b) {
                site.oloTools.whenReady({
                    oloReady: function() {
                        if (!jsDPZ.util.empty(b.resources.variant)) {
                            var d = jsDPZ.app.order.getOrder().getItemData({
                                ID: b.resources.variant
                            });
                            if (!jsDPZ.util.empty(d)) {
                                site.trigger.onPage({
                                    route: b
                                });
                                var e = jsDPZ.app.catalog.getCatalog().getProduct(jsDPZ.app.catalog.getCatalog().getVariant(d.Code).data.ProductCode).data,
                                    g = site.catalogTools.getProductBuilderType(e),
                                    d = {
                                        productCode: e.Code,
                                        orderVariantID: d.ID,
                                        code: d.Code,
                                        toppings: d.Toppings,
                                        sides: d.Sides,
                                        qty: d.Qty
                                    }, g = site.catalogTools.getProductBuilderType(e);
                                g == site.catalogTools.config.builderTypes.OTHER ? site.func.overlayToggle(true, "builderDefault", {}, d) : g == site.catalogTools.config.builderTypes.PIZZA ?
                                    site.func.overlayToggle(true, "builderPizza", {}, d) : g == site.catalogTools.config.builderTypes.CHICKEN && site.func.overlayToggle(true, "builderChicken", {}, d);
                                a("#js-splitFrame, #js-fullFrame").is(":visible") || (site.func.showColumn(), simplr.view.mRender({
                                    name: "all_entrees",
                                    data: {},
                                    selector: "#js-pageSplit"
                                }), site.func.changeNavigationState({
                                    main: site.data.navigation.states.main.ENTREES,
                                    sub: "All"
                                }))
                            }
                        }
                    }
                })
            }
        }
    });
    simplr.controller.mAddCommands({
        category: {
            route: ["fulfiller", "view"],
            callback: function(b) {
                site.oloTools.whenReady({
                    oloReady: function() {
                        var d =
                            jsDPZ.app.order.getOrder().data.Details.Coupons,
                            e = a.extend(true, {}, jsDPZ.app.order.getOrder().data.Details),
                            g = false;
                        a.each(d, function(a, b) {
                            if (!b.Fulfilled && !site.func.isGroupOrdering()) return g = true, false
                        });
                        if (g) {
                            site.trigger.onPage({
                                route: b,
                                group: "Coupons",
                                subGroup: "Coupon Wizard"
                            });
                            var d = site.func.updateFulfillerStatus(),
                                f = {}, j = -1;
                            b.parameters.code ? (groupID = b.parameters.code, j = b.parameters.id, a.each(d, function(a, b) {
                                f = b;
                                return false
                            })) : a.each(d, function(b, d) {
                                groupID = d.GroupID;
                                a.each(e.Coupons, function(a,
                                    b) {
                                    if (groupID == b.Code) return j = b.ID, f = d, false
                                });
                                return false
                            });
                            site.func.overlayToggle(true, "fulfillerWizard", {}, {
                                group: f,
                                orderID: j
                            })
                        }
                    }
                })
            }
        }
    });
    simplr.controller.mAddCommands({
        locations: {
            route: ["locations", "view"],
            callback: function(b) {
                site.func.changeNavigationState({
                    main: "",
                    sub: ""
                });
                a(".buttonCheckout").hide();
                if (site.locationTools.getSearchTypeByParameters(b.parameters)) jsDPZ.app.search.getStoreSearch().getSearchedAddress().getDisplayAddress().length ? (jsDPZ.app.search.getStoreSearch().getStores().length ==
                    0 ? (site.trigger.onPage({
                        uri: location.pathname + (location.hash != "" ? location.hash.split("?")[0] : "") + "error",
                        route: b,
                        eventType: "error",
                        title: "Location No Results",
                        group: "Location Error",
                        subGroup: "Location Error"
                    }), simplr.view.mRender({
                        name: "locations_no_results",
                        data: b,
                        selector: "#js-pageSplit"
                    })) : (site.trigger.onPage({
                        route: b,
                        title: "Location Results",
                        group: "Location Results",
                        subGroup: "Location Results"
                    }), simplr.view.mRender({
                        name: "locations_results",
                        data: b,
                        selector: "#js-pageSplit"
                    })), site.func.showColumn()) :
                    site.locationTools.performStoreSearch({
                        data: b.parameters,
                        success: function() {
                            jsDPZ.app.search.getStoreSearch().getStores().length == 0 ? (site.trigger.onPage({
                                uri: location.pathname + (location.hash != "" ? location.hash.split("?")[0] : "") + "error",
                                route: b,
                                eventType: "error",
                                title: "Location No Results",
                                group: "Location Error",
                                subGroup: "Location Error"
                            }), simplr.view.mRender({
                                name: "locations_no_results",
                                data: b,
                                selector: "#js-pageSplit"
                            })) : (site.trigger.onPage({
                                route: b,
                                title: "Location Results",
                                group: "Location Results",
                                subGroup: "Location Results"
                            }), simplr.view.mRender({
                                name: "locations_results",
                                data: b,
                                selector: "#js-pageSplit"
                            }))
                        },
                        complete: function() {
                            site.func.showColumn()
                        }
                    });
                else {
                    var d = {
                        uri: "/en/pages/order/#/locations/search/",
                        route: b,
                        title: "Location Search",
                        group: "Location Main",
                        subGroup: "Location Main"
                    }, e = "locations_search";
                    simplr.util.mGetUrlParameter("locations") && (d = {
                        uri: "/en/pages/order/#/locations/findStore/",
                        route: b,
                        title: "Locations Find Store",
                        group: "findstore",
                        subGroup: "findstore"
                    });
                    site.func.segmentedContent([-1],
                        function() {
                            killConfig.isActive("ABlocator") && a("html").attr("lang") === "en" && (e = "locations_search_b", d = {
                                uri: "/en/pages/order/#/locations/servicemethod/test1211",
                                route: b,
                                title: "Location Service Method Form",
                                group: "Locations",
                                subGroup: "Landing"
                            })
                        });
                    site.trigger.onPage(d);
                    site.func.customerSemiLoggedIn() ? jsDPZ.ajax.customerLogin({
                        data: {
                            rememberMe: true
                        },
                        success: function(a) {
                            jsDPZ.app.customer.setCustomerFromPower(a);
                            site.sessionTools.save({
                                async: false
                            })
                        },
                        complete: function() {
                            simplr.view.mRender({
                                name: e,
                                data: {
                                    shoprunner: b.resources.locations === "shoprunner",
                                    locations: simplr.util.mGetUrlParameter("locations") ? "Locations" : ""
                                },
                                selector: "#js-pageSplit"
                            });
                            site.func.showColumn()
                        }
                    }) : (simplr.view.mRender({
                        name: e,
                        data: {
                            shoprunner: b.resources.locations === "shoprunner",
                            locations: simplr.util.mGetUrlParameter("locations") ? "Locations" : ""
                        },
                        selector: "#js-pageSplit"
                    }), site.func.showColumn())
                }
            }
        }
    });
    simplr.controller.mAddCommands({
        viewOrderTime: {
            route: ["order", "time", "view"],
            callback: function(a) {
                site.oloTools.whenReady({
                    oloReady: function() {
                        site.trigger.onPage({
                            route: a
                        });
                        site.func.overlayToggle(true, "changeOrderTimingOverlay", {}, {})
                    }
                })
            }
        },
        updateOrderTime: {
            route: ["order", "time", "update"],
            callback: function(b) {
                site.oloTools.whenReady({
                    oloReady: function() {
                        var d = jsDPZ.app.store.getStore(),
                            e = jsDPZ.app.order.getOrder(),
                            g = false,
                            f = site.catalogTools.validateOrderDateTimeParamsFormat(b.parameters) ? b.parameters.date + " " + b.parameters.time : "";
                        if (simplr.util.mEmpty(f) || site.catalogTools.isOrderableTime(f)) {
                            var j = !simplr.util.mEmpty(f) ? f : d.data.StoreAsOfTime,
                                d = d.getAvailableServiceMethods({
                                    dtString: j,
                                    deliveryAvailable: jsDPZ.app.customer.getCustomer().data.Session.DeliveryAvailable
                                });
                            if (a.inArray(e.data.Details.ServiceMethod, d) != -1) e.data.Details.OrderDateTime = f, g = true
                        }
                        g ? (jsDPZ.app.order.getOrder().orderChanged(), site.func.resetOrderingData({
                            runValidate: true
                        })) : site.func.overlayToggle(true, "changeOrderTimingOverlay", {}, {
                            code: "eOrderDateTimeInvalid"
                        })
                    }
                })
            }
        }
    });
    simplr.controller.mAddCommands({
        locations: {
            route: ["order", "price", "view"],
            callback: function(b) {
                function d(b, d) {
                    if (!jsDPZ.app.order.getOrder().data.HideSizeUpsell &&
                        b.Order.Coupons.length === 0) {
                        for (var f = jsDPZ.app.catalog.getCatalog(), j = jsDPZ.app.order.getOrderForPowerData(), h = [], k = 0, m = b.Order.Products.length; k < m; k++) {
                            var n = b.Order.Products[k];
                            if (n.CategoryCode === "Pizza" && n.Qty == 1 && (n = f.getVariant(n.Code), !jsDPZ.util.empty(n))) {
                                var q = f.getProductSizesData(n.data.ProductCode);
                                if (q)
                                    for (var o = 0, l = q.length; o < l; o++) {
                                        var w = q[o + 1];
                                        if (n.data.SizeCode === q[o].Code && w && (w = f.getVariantOfProduct(n.data.ProductCode, n.data.FlavorCode, w.Code), !jsDPZ.util.empty(w))) {
                                            j.Order.Products[k].Code =
                                                w.data.Code;
                                            h.push({
                                                Type: "sizeUpsell",
                                                Variant: a.extend(true, {}, jsDPZ.app.order.getOrder().data.Details.Variants[k], {
                                                    Code: w.data.Code
                                                }),
                                                Size: f.getSizesData("Pizza", w.data.SizeCode).Name
                                            });
                                            break
                                        }
                                    }
                            }
                            if (!jsDPZ.util.empty(h)) break
                        }
                        jsDPZ.util.empty(h) ? d(b) : jsDPZ.ajax.priceOrder({
                            data: j,
                            success: function(a) {
                                for (var f = 0, j = h.length; f < j; f++)
                                    for (var k = 0, l = a.Order.Products.length; k < l; k++)
                                        if (h[f].Variant.ID === a.Order.Products[k].ID) {
                                            for (var l = 0, n = b.Order.Products.length; l < n; l++)
                                                if (h[f].Variant.ID === b.Order.Products[l].ID) {
                                                    h[f].Price =
                                                        a.Order.Products[k].Price - b.Order.Products[k].Price;
                                                    break
                                                }
                                            break
                                        }
                                b.UpsellProducts = h;
                                d(b)
                            },
                            error: function() {
                                site.func.powerCommunicationError()
                            },
                            complete: function() {
                                site.func.toggleLoading(false)
                            }
                        })
                    } else d(b)
                }
                site.oloTools.whenReady({
                    oloReadyForce: function() {
                        var e = jsDPZ.app.customer.getCustomer().data,
                            g = e.Session.Reorder,
                            f = site.data.couponUnavailable;
                        a.each(jsDPZ.app.order.getOrder().data.Details.Coupons, function(a, b) {
                            var d = jsDPZ.app.catalog.getCatalog().getCoupon(b.Code);
                            if (jsDPZ.util.empty(d)) jsDPZ.ajax.coupon({
                                StoreID: jsDPZ.app.order.getOrder().data.Details.StoreID,
                                CouponCode: b.Code,
                                success: function(a) {
                                    jsDPZ.app.catalog.setCouponFromPower(a);
                                    if (!jsDPZ.app.catalog.isCouponActive(b.Code).Success) e.Session.Reorder ? site.data.couponUnavailable = f = b.Code : site.func.overlayToggle(true, "codeOverlay", {}, {
                                        code: "eCouponInvalid"
                                    }), simplr.controller.mRouteAndExecute("/order/coupons/" + b.ID + "/delete")
                                },
                                error: function() {
                                    e.Session.Reorder ? site.data.couponUnavailable = f = b.Code : site.func.overlayToggle(true, "codeOverlay", {}, {
                                        code: "eCouponInvalid"
                                    });
                                    simplr.controller.mRouteAndExecute("/order/coupons/" +
                                        b.ID + "/delete")
                                },
                                complete: function() {
                                    site.func.toggleLoading(false)
                                },
                                async: false
                            });
                            else if (!jsDPZ.app.catalog.isCouponActive(b.Code).Success) e.Session.Reorder ? site.data.couponUnavailable = f = b.Code : site.func.overlayToggle(true, "codeOverlay", {}, {
                                code: "eCouponInvalid"
                            }), simplr.controller.mRouteAndExecute("/order/coupons/" + b.ID + "/delete")
                        });
                        site.func.toggleLoading(true);
                        jsDPZ.ajax.priceOrder({
                            data: jsDPZ.app.order.getOrderForPowerData(),
                            success: function(j) {
                                site.func.processPowerOrderResponse(j, b.url);
                                a(document).trigger("/order/price/",
                                    j);
                                if (simplr.util.mEmpty(b.parameters.payment)) {
                                    if (!simplr.util.mEmpty(b.parameters.checkout)) jsDPZ.app.order.getOrder().data.Details.Variants.length > 0 ? d(j, function(a) {
                                        site.func.changeNavigationState();
                                        site.func.showFull();
                                        e.Session.Reorder = g;
                                        site.data.couponUnavailable = f;
                                        simplr.view.mRender({
                                            name: "checkout",
                                            data: a,
                                            selector: "#js-pageFull"
                                        })
                                    }) : window.location.hash = "/section/Food/category/AllEntrees/"
                                } else window.location = urlConfig.localRoot + "/pages/order/payment.jsp"
                            },
                            error: function() {
                                site.func.powerCommunicationError()
                            },
                            complete: function() {
                                site.func.toggleLoading(false)
                            }
                        })
                    }
                })
            }
        }
    });
    simplr.controller.mAddCommands({
        sectionCategoryProductPage: {
            route: ["section", "category", "product", "view"],
            callback: function(a) {
                site.oloTools.whenReady({
                    oloReady: function() {
                        if (site.catalogTools.categoryExists(a.resources))
                            if (jsDPZ.util.empty(a.resources.product)) window.location.hash = "/section/Food/category/AllEntrees/";
                            else {
                                site.trigger.onPage({
                                    route: a
                                });
                                site.func.changeNavigationState(site.catalogTools.getCategoryNavigationState({
                                    section: a.resources.section,
                                    category: a.resources.category
                                }));
                                var d = site.func.buildURL({
                                    url: "#/product/" + a.resources.product + "/",
                                    parameters: a.parameters
                                });
                                simplr.controller.mRouteAndExecute(d)
                            } else window.location.hash = "/section/Food/category/AllEntrees/"
                    }
                })
            }
        },
        product_page: {
            route: ["product", "view"],
            callback: function(b) {
                site.oloTools.whenReady({
                    oloReady: function() {
                        if (jsDPZ.util.empty(b.resources.product)) window.location.hash = "/section/Food/category/AllEntrees/";
                        else {
                            var d = jsDPZ.app.catalog.getCatalog().getProduct(b.resources.product);
                            jsDPZ.util.empty(d) ? window.location.hash = "/section/Food/category/AllEntrees/" : (a(function() {
                                site.trigger.onPage({
                                    title: "Customer Reviews Page",
                                    group: " Customer Reviews",
                                    subGroup: " Customer Reviews"
                                })
                            }), site.func.showColumn(), d = a.extend({}, d.data), simplr.view.mRender({
                                name: "product_page",
                                data: d,
                                selector: "#js-pageSplit"
                            }))
                        }
                    }
                })
            }
        },
        productBuilder: {
            route: ["product", "builder", "view"],
            callback: function(b) {
                site.oloTools.whenReady({
                    oloReady: function() {
                        if (!jsDPZ.util.empty(b.resources.product)) {
                            var d = jsDPZ.app.catalog.getCatalog().getProduct(b.resources.product);
                            if (jsDPZ.util.empty(d)) window.location.hash = "/section/Food/category/AllEntrees/", site.func.overlayToggle(true, "codeOverlay", {}, {
                                code: "productNotInStore"
                            });
                            else {
                                var e = b.resources.product,
                                    e = jsDPZ.app.catalog.getCatalog().getProduct(e).data,
                                    g = e.ProductType,
                                    e = e.Name;
                                g == "Wings" ? g = "Chicken" : g == "GSalad" ? g = "Salad" : g == "Sides" && (g = "Extras");
                                site.trigger.onPage({
                                    route: b,
                                    title: g + " Builder",
                                    group: g,
                                    subGroup: e
                                });
                                e = d.data;
                                d = site.catalogTools.genericProductOptionsFromURLParameters(b.parameters);
                                d = {
                                    couponCode: b.parameters.couponCode,
                                    productCode: e.Code,
                                    code: d.Code || simplr.util.mGetUrlParameter("code"),
                                    toppings: d.Toppings,
                                    sides: d.Sides,
                                    qty: d.Qty
                                };
                                e = site.catalogTools.getProductBuilderType(e);
                                e == site.catalogTools.config.builderTypes.OTHER ? site.func.overlayToggle(true, "builderDefault", {}, d) : e == site.catalogTools.config.builderTypes.PIZZA ? site.func.overlayToggle(true, "builderPizza", {}, d) : e == site.catalogTools.config.builderTypes.CHICKEN && site.func.overlayToggle(true, "builderChicken", {}, d);
                                a("#js-splitFrame, #js-fullFrame").is(":visible") ||
                                    (site.func.showColumn(), simplr.view.mRender({
                                    name: "all_entrees",
                                    data: {},
                                    selector: "#js-pageSplit"
                                }), site.func.changeNavigationState({
                                    main: site.data.navigation.states.main.ENTREES,
                                    sub: "All"
                                }));
                                if (window.location.hash.indexOf("/builder/") !== -1) window.location.hash = "/section/Food/category/AllEntrees/"
                            }
                        }
                    }
                })
            }
        }
    });
    simplr.controller.mAddCommands({
        updateCustomerStore: {
            route: ["customer", "store", "update"],
            callback: function(b) {
                if (!jsDPZ.util.empty(b.parameters.StoreID) && !jsDPZ.util.empty(b.parameters.ServiceMethod)) {
                    var d =
                        jsDPZ.app.order.getOrder().data,
                        e = jsDPZ.app.customer.getCustomer().data;
                    site.storage.remove("hasShownCarryoutWarning");
                    site.storage.remove("hasShownDeliveryWarning");
                    jsDPZ.app.search.updateSessionStoreFromSearch(b.parameters.StoreID);
                    site.storage.save("ServiceType", b.parameters.ServiceMethod);
                    site.storage.save("PrevStoreID", b.parameters.StoreID);
                    site.storage.save("dpz_customer_address", jsDPZ.dataConversion.JSONObjectToString(e.Session.Address));
                    d.Customer.Address = a.extend(true, {}, e.Session.Address);
                    d.Details.StoreID = jsDPZ.app.customer.getCustomer().data.Session.StoreID;
                    d.Details.SubstitutedStore = b.parameters.Substituted === "true";
                    site.func.changeServiceMethod(b.parameters.ServiceMethod);
                    site.sessionTools.save();
                    site.oloTools.reset()
                }
            }
        }
    });
    simplr.controller.mAddCommands({
        updateVariantInOrder: {
            route: ["order", "variant", "update"],
            callback: function(b) {
                site.oloTools.whenReady({
                    oloReady: function() {
                        if (!jsDPZ.util.empty(b.resources.variant)) {
                            var d = a.extend(site.catalogTools.orderVariantFromURLParameters(b.parameters), {
                                ID: b.resources.variant
                            });
                            site.func.addVariant(d) && (site.trigger.onEvent({
                                group: "Entrees",
                                subGroup: "Update Variant " + d.Code
                            }), a(document).trigger("/order/variant/update/", {
                                id: b.resources.variant
                            }), simplr.controller.mRouteAndExecute("/order/validate/"))
                        }
                    }
                })
            }
        }
    });
    simplr.controller.mAddCommands({
        locations: {
            route: ["order", "validate", "view"],
            callback: function(b) {
                site.oloTools.whenReady({
                    oloReadyForce: function() {
                        var d = jsDPZ.app.customer.getCustomer().data;
                        d.Session.AfterUpsell ? (d.Session.AfterUpsell = false,
                            simplr.controller.mRouteAndExecute("/order/price/?payment=1")) : site.func.isOnCheckoutPage() ? simplr.controller.mRouteAndExecute("/order/price/?checkout=1") : (site.func.toggleLoading(true), jsDPZ.ajax.validateOrder({
                            data: jsDPZ.app.order.getOrderForPowerData(),
                            success: function(e) {
                                if (e.Status < 0) site.trigger.onEvent({
                                    title: "Error Page",
                                    group: "Error",
                                    subGroup: "Validate Order Error " + e.Status + " - " + e.StatusItems[0].Code,
                                    eventType: "error"
                                });
                                site.func.processPowerOrderResponse(e, b.url);
                                a(document).trigger("/order/validate/",
                                    e)
                            },
                            error: function() {
                                site.func.powerCommunicationError()
                            },
                            complete: function() {
                                site.func.toggleLoading(false)
                            }
                        }))
                    }
                })
            }
        }
    });
    simplr.view.mAddViews({
        all_entrees: {
            html: function() {
                for (var a = {
                    pastPopularItemsForm: {
                        component: "selectPastPopularItemsForm",
                        tokens: {
                            popularItems1: "",
                            popularItems2: ""
                        }
                    }
                }, d = jsDPZ.app.catalog.getOrderableQuickList(site.data.popularItems), e = jsDPZ.app.catalog.getCatalog(), g = "", f = [], j = [], h = 0; h < d.data.length; h++) g = e.getProduct(e.getVariant(d.data[h].Code).data.ProductCode).data.ProductType,
                g == "Pizza" ? f.push(d.data[h]) : j.push(d.data[h]);
                g = site.catalogTools.getVariantToppingSideViewObj(f, true);
                h = 0;
                for (d = g.length; h < d; h++) e = simplr.layout.mAssembleLayout({
                    component: "selectPopularItems",
                    tokens: g[h]
                }), a.pastPopularItemsForm.tokens.popularItems1 += e + (h == d - 1 ? "" : "</li><li>");
                j = site.catalogTools.getVariantToppingSideViewObj(j, true);
                h = 0;
                for (d = j.length; h < d; h++) e = simplr.layout.mAssembleLayout({
                    component: "selectPopularItems",
                    tokens: j[h]
                }), a.pastPopularItemsForm.tokens.popularItems2 += e + (h == d - 1 ? "" : "</li><li>");
                return simplr.layout.mAssembleLayout({
                    component: "allEntreesComponent",
                    tokens: a
                })
            },
            callback: function(b, d) {
                function e(b, e) {
                    var d = a("#js-mainSiteNavigation a.active").text();
                    site.trigger.onEvent({
                        title: d + " " + b,
                        group: d,
                        subGroup: b,
                        so: "entreesall",
                        panelNumber: e,
                        panelName: b
                    })
                }
                this.extend_callbackTop();
                var g = a(".item", b);
                g.hover(function() {
                    a(this).addClass("hover")
                }, function() {
                    a(this).removeClass("hover")
                });
                var f = a(".header a", b);
                a(".js-toggle .header a", b).on("click", function(b) {
                    b.preventDefault();
                    b = a(this).closest(".js-toggle").is(".active");
                    g.removeClass("active");
                    b || g.eq(f.index(this)).addClass("active")
                }).add(".item a").on("click", function(d) {
                    var f = a("h2", this).text(),
                        d = a(d.target).closest(".item").index(".item", b) + 4;
                    e(f, d)
                });
                a("[data-role='wt-event']", b).on("click", function() {
                    var b = a(this).data("wt-panelname"),
                        d = a(this).data("wt-panelnumber");
                    e(b, d)
                });
                simplr.view.mRender({
                    name: "coupon_enter_form",
                    data: {},
                    selector: b + " .js-couponEnterForm"
                });
                var j = d.main == site.data.navigation.states.main.COUPONS ? "Coupons" : "Food";
                a(".item", b).filter("[id*='entree-']").each(function() {
                    var b =
                        a(this).attr("id").split("-")[1];
                    site.catalogTools.categoryExists({
                        section: j,
                        category: b
                    }) || a(this).remove()
                });
                a(".eachItem", b).each(function() {
                    jsDPZ.util.empty(a(this).next().text()) && a(this).remove()
                });
                a(".pastPopularItemsContent ul a", b).click(function(b) {
                    b.preventDefault();
                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: a(this).attr("href")
                    }))
                });
                a(".js-buildYourOwnPizza", b).click(function(b) {
                    b.preventDefault();
                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: a(this).attr("href")
                    }))
                });
                a("#orderTouts a", b).on("click", function(b) {
                    b.preventDefault();
                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: a(this).attr("href")
                    }))
                });
                a("#twoMedium a, #mixMatch a, #mixMatchHero a, #mixMatchRight a", b).on("click", function(b) {
                    b.preventDefault();
                    var b = a(this).data("wt-panelnumber"),
                        e = a(this).data("wt-panelname");
                    site.func.overlayToggle(true, "panUpsellOverlay", {}, {
                        recoverable: true,
                        toutAddCoupon: true,
                        panelNumber: b,
                        panelName: e,
                        defaultCoupon: "9193",
                        upsellCoupon: "9194",
                        couponPrice: "2.00"
                    })
                });
                var h = new Date(2014, 2, 24, 3, 0, 0);
                site.func.isTimedContent(new Date(2011, 0, 20, 3, 0, 0), new Date(2032, 5, 3, 3, 0, 0), function(b) {
                    b >= h ? (a("#fiftyPercentOff").remove(), b.getDay() >= 1 && b.getDay() <= 4 ? b.getDay() == 1 && b.getHours() < 3 ? (a(".fss").attrShow(), a(".mtwt").remove()) : (a(".mtwt").attrShow(), a(".fss").remove()) : (a("#fiftyPercentOff").attrShow(), b.getDay() == 5 && b.getHours() < 3 ? (a(".mtwt").attrShow(), a(".fss").remove()) : (a(".fss").attrShow(), a(".mtwt").remove()))) : a("#panPizza, #mixMatchRight, #mixMatch, #panPizzaSmall, #monThursCarryout, #twoMedium").remove();
                    a("#orderTouts li:hidden").remove()
                });
                site.func.fixMissingImages(a("img", b));
                site.func.isGroupOrdering() && (a.extend(d, jsDPZ.app.order.getOrderForPowerData().Order, {
                    Promotions: jsDPZ.app.order.getOrder().data.Details.Promotions
                }), site.func.showDiscountDashboard(d))
            },
            extend_callbackTop: function() {}
        }
    });
    simplr.view.mAddViews({
        all_drinks: {
            html: function(b) {
                var d = a.extend({
                    categoryData: {},
                    categoryParams: {
                        section: "",
                        category: ""
                    }
                }, b),
                    e = {
                        categories: {
                            component: "category2SubComponent",
                            tokens: []
                        }
                    }, g = jsDPZ.app.catalog.getCatalog(),
                    f = [];
                a.each(["Drinks"], function(a, b) {
                    var e = g.getCategoryData("Food", b);
                    !simplr.util.mEmpty(e) && e.Products.length > 0 && f.push(e)
                });
                a.each(f, function(b, f) {
                    if (f.Products.length > 0 && f.Code != "BuildYourOwn") {
                        var k = {
                            component: "category2ProductComponent",
                            tokens: []
                        };
                        a.each(f.Products, function(b, e) {
                            var j = g.getProduct(e).data,
                                m = {
                                    productName: j.Name,
                                    productCode: j.Code,
                                    productDogEar: j.Tags.New ? "newDogEar" : "",
                                    productDogEarText: j.Tags.New ? simplr.validation.mGetCodeMessage("iNewDogEar") : "",
                                    productImage: j.ImageCode,
                                    productDescription: j.Description,
                                    productClass: b % 4 == 0 ? "" : "productMargin",
                                    sectionCode: d.categoryParams.section,
                                    categoryCode: f.Code,
                                    noRatings: simplr.util.mEmpty(j.Rating) ? "js-hasNoRatings" : ""
                                };
                            simplr.util.mEmpty(j.Rating) || a.extend(m, {
                                productRating: j.Rating.AverageRating.toFixed(1),
                                ratingImage: parseFloat(j.Rating.AverageRating).toFixed(1).replace(".", "_"),
                                productReviewsCount: j.Rating.ReviewsCount,
                                pluralizeCount: j.Rating.ReviewsCount > 1 ? "s" : ""
                            });
                            k.tokens.push(m)
                        });
                        e.categories.tokens.push({
                            categoryName: f.Name,
                            categoryProducts: k
                        })
                    }
                });
                return simplr.layout.mAssembleLayout({
                    component: "category2Component",
                    tokens: e
                })
            },
            callback: function(b, d) {
                a(".js-hasNoRatings", b).remove();
                a(".products", b).each(function() {
                    for (var b = a(".product", this), d = b.splice(0, 4); d.length > 0;) {
                        var f = 0;
                        a(d).each(function() {
                            var b = a(this).height();
                            f = b > f ? b : f
                        }).height(f);
                        d = b.splice(0, 4)
                    }
                });
                a("a", b).not(".js-readReviewsLink").click(function(b) {
                    b.preventDefault();
                    var b = a(this).attr("href").split("#")[1].split("/")[2],
                        b = jsDPZ.app.catalog.getCatalog().getProduct(b).data,
                        d = b.ProductType;
                    site.trigger.onEvent({
                        title: d + " " + b.Name + " Open Builder",
                        group: d,
                        subGroup: b.Name,
                        clickType: a(this).data("clicked-element")
                    });
                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: a(this).attr("href")
                    }))
                });
                site.func.fixMissingImages(a("img", b));
                site.func.isGroupOrdering() && (a.extend(d, jsDPZ.app.order.getOrderForPowerData().Order, {
                    Promotions: jsDPZ.app.order.getOrder().data.Details.Promotions
                }), site.func.showDiscountDashboard(d))
            }
        }
    });
    simplr.view.mAddViews({
        all_sides: {
            html: function(b) {
                var d =
                    a.extend({
                        categoryData: {},
                        categoryParams: {
                            section: "",
                            category: ""
                        }
                    }, b),
                    e = {
                        categories: {
                            component: "category2SubComponent",
                            tokens: []
                        }
                    }, g = jsDPZ.app.catalog.getCatalog(),
                    f = [];
                a.each(["Bread", "GSalad", "Chips", "Dessert", "Sides"], function(a, b) {
                    var e = g.getCategoryData("Food", b);
                    !simplr.util.mEmpty(e) && e.Products.length > 0 && f.push(e)
                });
                a.each(f, function(b, f) {
                    if (f.Products.length > 0 && f.Code != "BuildYourOwn") {
                        var k = {
                            component: "category2ProductComponent",
                            tokens: []
                        };
                        a.each(f.Products, function(b, e) {
                            var j = g.getProduct(e).data,
                                m = {
                                    productName: j.Name,
                                    productCode: j.Code,
                                    productDogEar: j.Tags.New ? "newDogEar" : "",
                                    productDogEarText: j.Tags.New ? simplr.validation.mGetCodeMessage("iNewDogEar") : "",
                                    productImage: j.ImageCode,
                                    productDescription: j.Description,
                                    productClass: b % 4 == 0 ? "" : "productMargin",
                                    sectionCode: d.categoryParams.section,
                                    categoryCode: f.Code,
                                    noRatings: simplr.util.mEmpty(j.Rating) ? "js-hasNoRatings" : ""
                                };
                            simplr.util.mEmpty(j.Rating) || a.extend(m, {
                                productRating: j.Rating.AverageRating.toFixed(1),
                                ratingImage: parseFloat(j.Rating.AverageRating).toFixed(1).replace(".",
                                    "_"),
                                productReviewsCount: j.Rating.ReviewsCount,
                                pluralizeCount: j.Rating.ReviewsCount > 1 ? "s" : ""
                            });
                            k.tokens.push(m)
                        });
                        e.categories.tokens.push({
                            categoryName: f.Name,
                            categoryProducts: k
                        })
                    }
                });
                return simplr.layout.mAssembleLayout({
                    component: "category2Component",
                    tokens: e
                })
            },
            callback: function(b, d) {
                a(".js-hasNoRatings", b).remove();
                a(".products", b).each(function() {
                    for (var b = a(".product", this), d = b.splice(0, 4); d.length > 0;) {
                        var f = 0;
                        a(d).each(function() {
                            var b = a(this).height();
                            f = b > f ? b : f
                        }).height(f);
                        d = b.splice(0, 4)
                    }
                });
                a("a", b).not(".js-readReviewsLink").click(function(b) {
                    b.preventDefault();
                    var b = a(this).attr("href").split("#")[1].split("/")[2],
                        b = jsDPZ.app.catalog.getCatalog().getProduct(b).data,
                        d = b.ProductType;
                    site.trigger.onEvent({
                        title: d + " " + b.Name + " Open Builder",
                        group: d,
                        subGroup: b.Name,
                        clickType: a(this).data("clicked-element")
                    });
                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: a(this).attr("href")
                    }))
                });
                site.func.fixMissingImages(a("img", b));
                site.func.isGroupOrdering() && (a.extend(d, jsDPZ.app.order.getOrderForPowerData().Order, {
                    Promotions: jsDPZ.app.order.getOrder().data.Details.Promotions
                }), site.func.showDiscountDashboard(d))
            }
        }
    });
    simplr.view.mAddViews({
        variantDetails: {
            html: function(a) {
                return simplr.layout.mAssembleLayout({
                    component: "itemizedVariant",
                    tokens: site.catalogTools.getVariantToppingSideViewObj([a])
                })
            },
            callback: function() {}
        },
        builderPizza: {
            html: function(b) {
                var b = a.extend({
                    couponCode: "",
                    orderVariantID: "",
                    code: "",
                    productCode: "",
                    toppings: {},
                    sides: {},
                    qty: 1
                }, b),
                    d = jsDPZ.app.catalog.getCatalog(),
                    e = d.getProduct(b.productCode).data,
                    g = e.Variants,
                    f = d.getProductFlavorsData(e.Code),
                    j = {
                        component: "builderPizzaSauces",
                        tokens: []
                    }, h = {
                        component: "builderPizzaCheese",
                        tokens: []
                    }, k = {
                        component: "builderPizzaToppings",
                        tokens: []
                    }, m = {
                        component: "builderPizzaToppings",
                        tokens: []
                    }, n = {
                        component: "builderPizzaToppings",
                        tokens: []
                    }, q = {
                        component: "builderPizzaToppings",
                        tokens: []
                    }, o = {
                        component: "builderPizzaVariantsWithSection",
                        tokens: []
                    }, l = "";
                if (!simplr.util.mEmpty(b.couponCode)) {
                    for (var w = jsDPZ.app.order.getOrder().data, l = d.getCoupon(b.couponCode).data.Name,
                            v = w.Details.Coupons, B = [], z = 0, y = w.Fulfiller.Groups.length; z < y; z++) w.Fulfiller.Groups[z].GroupID == b.couponCode && (B = w.Fulfiller.Groups[z]);
                    z = 0;
                    for (y = v.length; z < y; z++)
                        if (w = v[z], b.couponCode === w.Code) {
                            orderCouponID = w.ID;
                            break
                        }
                    for (var v = site.func.updateFulfillerStatus(), r, z = 0; z < v.length; z++) v[z].GroupID == b.couponCode && (r = v[z]);
                    l = {
                        component: "CouponInfoHeader",
                        tokens: {
                            groupID: b.couponCode,
                            groupDescription: l,
                            orderID: orderCouponID,
                            currentCount: B.TotalSteps - r.UnFulfilled.length + 1,
                            totalCount: B.TotalSteps
                        }
                    }
                }
                a.each(g,
                    function(b, e) {
                        var g = d.getVariant(e).data;
                        a.each(f, function(a, b) {
                            if (g.FlavorCode === b.Code) return jsDPZ.util.empty(b.Variants) && (b.Variants = []), b.Variants.push(g), b.Price = jsDPZ.obj.price(g.Price).getDisplayValue(), false
                        })
                    });
                f.sort(function(a, b) {
                    return a.SortSeq < b.SortSeq ? -1 : a.SortSeq > b.SortSeq ? 1 : 0
                });
                a.each(f, function(b, f) {
                    var g = {
                        sectionName: d.getFlavorsData(e.ProductType, f.Code).Name,
                        sectionDescription: d.getFlavorsData(e.ProductType, f.Code).Description,
                        productVariantList: {
                            component: "builderPizzaVariantOptions",
                            tokens: []
                        }
                    };
                    a.each(f.Variants, function(a, b) {
                        var f = b.Name;
                        b.SizeCode !== "" && (f = d.getSizesData(e.ProductType, b.SizeCode), f = f.Description !== "" ? f.Description : f.Name);
                        g.productVariantList.tokens.push({
                            sizeCode: b.SizeCode,
                            flavorCode: b.FlavorCode,
                            productCode: e.Code,
                            variantCode: b.Code,
                            variantPrice: jsDPZ.obj.price(b.Price).getDisplayValue(),
                            variantDescription: f
                        })
                    });
                    o.tokens.push(g)
                });
                a.each(d.getAvailableProductToppingsData(e.Code), function(b, d) {
                    var f = "";
                    if (simplr.util.mEmpty(d.Tags.WholeOnly))
                        for (var b = 0,
                                g = site.data.uiConfig.AVAILABLE_PARTS_CLASS_ARRAY.length; b < g; b++) f += '<label class="' + a.trim(site.data.uiConfig.AVAILABLE_PARTS_CLASS_ARRAY[b].label) + 'Inactive portion"><input type="radio" name="Part|' + d.Code + '" value="' + site.data.uiConfig.AVAILABLE_LOCATIONS_ARRAY[b].value + '"/></label>';
                    else f = "<input type='hidden' id='part' name='Part|" + d.Code + "' value='1/1' />";
                    for (var l = [], b = 0, g = d.Availability.length; b < g; b++) {
                        var r = d.Availability[b];
                        parseFloat(r) > 0 && l.push({
                            value: r,
                            label: site.data.uiConfig.AVAILABLE_WEIGHTS_HASH[r].Describe
                        })
                    }
                    g =
                        '<select class="weight" name="Weight|' + d.Code + '">' + site.func.buildOptionList({
                            listValues: l,
                            defaultValue: "1"
                        }) + "</select>";
                    f = {
                        productCode: e.Code,
                        toppingCode: d.Code,
                        toppingName: d.Name,
                        toppingShortName: simplr.util.mTruncateString({
                            string: d.Name,
                            size: 18,
                            postfix: "...",
                            smart: false
                        }),
                        toppingParts: f,
                        toppingWeights: g,
                        toppingType: ""
                    };
                    if (d.Tags.Cheese) f.toppingType = "cheese", h.tokens.push(f);
                    else if (d.Tags.Sauce) f.toppingType = "sauce", j.tokens.push(f);
                    else if (d.Tags.Meat) f.toppingType = "meat", k.tokens.length > 6 ?
                        m.tokens.push(f) : k.tokens.push(f);
                    else if (d.Tags.NonMeat) f.toppingType = "nonmeat", n.tokens.length > 6 ? q.tokens.push(f) : n.tokens.push(f)
                });
                return simplr.layout.mAssembleLayout({
                    component: "genericOverlay",
                    tokens: {
                        overlayContent: {
                            component: "builderPizza",
                            tokens: {
                                couponInfo: l,
                                productVariants: o,
                                productCode: e.Code,
                                productName: e.Name,
                                productDescription: e.Description,
                                productToppingCheese: h,
                                productToppingSauces: j,
                                productToppingMeatsCol1: k,
                                productToppingMeatsCol2: m,
                                productToppingNonmeatsCol1: n,
                                productToppingNonmeatsCol2: q
                            }
                        }
                    }
                })
            },
            callback: function(b, d) {
                site.func.setPizzaBuilder();
                for (var e = a.extend({
                    orderVariantID: "",
                    qty: 1,
                    code: "",
                    productCode: "",
                    couponCode: "",
                    sides: {},
                    toppings: {}
                }, d), g = jsDPZ.app.catalog.getCatalog(), f = g.getProduct(e.productCode), j, h = site.func.updateFulfillerStatus(), k, m = 0; m < h.length; m++)
                    if (h[m].GroupID == e.couponCode && (k = h[m], k.TotalSteps - k.UnFulfilled.length === 0 && k.UnFulfilled && k.UnFulfilled[0])) e.flavorCode = k.UnFulfilled[0][0].FlavorCode;
                e.code && (j = g.getVariant(e.code));
                a("ul.feedSize-template li").each(function() {
                    var b =
                        a(this).attr("id").split("-")[1],
                        d = a(this).html();
                    site.data.uiConfig.AVAILABLE_FEEDSIZE_HASH[b] = d;
                    site.data.uiConfig.AVAILABLE_FEEDSIZE_ARRAY.push({
                        size: b,
                        feeds: d
                    })
                }).parent().remove();
                a("#sizeCrustWrapper .product:last, #cheeseSauceWrapper .product:last, #toppingsWrapper .product:last", b).css("border", "0");
                a("#sizeCrustWrapper .product:eq(4)", b).css({
                    clear: "left",
                    "min-height": "0"
                });
                var n = a(window).width() / 2 - a(".overlayContent", b).width() / 2 + 25,
                    q = a(".overlayContent", b).offset().top + 130;
                a(".js-closePizzaMessage",
                    b).on("click", function(a) {
                    a.preventDefault();
                    o.hide()
                });
                var o = {
                    data: {
                        isActive: false,
                        hasSeen: [],
                        showPrev: true,
                        showNext: true,
                        wrapperID: "#sizeCrustWrapper"
                    },
                    hasSeen: function(b) {
                        return a.inArray(b, this.data.hasSeen) >= 0
                    },
                    show: function(d) {
                        if (!l.data.initialLoad && !this.data.isActive && !this.hasSeen(d)) this.data.isActive = true, this.data.hasSeen.push(d), this.data.showPrev = a(".js-prev", b).is(":visible"), this.data.showNext = a(".js-next", b).is(":visible"), this.data.wrapperID = a(".builderWrapper > div:visible", b),
                        a(".builderWrapper > div, .js-prev, .js-next, .js-addToOrder, .js-hideUI", b).hide(), a(".js-blockUI", b).show(), a(d, b).show(), a(".builderWrapper").css("marginTop", "36px")
                    },
                    hide: function() {
                        a(".builderWrapper", b).css("marginTop", "-1px");
                        a(".builderWrapper > div, .js-blockUI", b).hide();
                        a(".js-addToOrder, .js-hideUI", b).show();
                        a(this.data.wrapperID, b).show();
                        a(".js-prev", b).toggle(this.data.showPrev);
                        a(".js-next", b).toggle(this.data.showNext);
                        this.data.isActive = false
                    }
                }, l = {
                        data: {
                            maxOptionQty: parseFloat(f.data.Tags.MaxOptionQty),
                            partsOverlap: {
                                "1/1": {
                                    count: 0,
                                    map: ["1/2", "2/2"]
                                },
                                "1/2": {
                                    count: 0,
                                    map: ["1/4", "2/4"]
                                },
                                "2/2": {
                                    count: 0,
                                    map: ["3/4", "4/4"]
                                },
                                "1/4": {
                                    count: 0,
                                    map: []
                                },
                                "2/4": {
                                    count: 0,
                                    map: []
                                },
                                "3/4": {
                                    count: 0,
                                    map: []
                                },
                                "4/4": {
                                    count: 0,
                                    map: []
                                }
                            },
                            initialLoad: true,
                            isNew: jsDPZ.util.empty(e.orderVariantID),
                            crustType: j ? j.data.FlavorCode : "",
                            toppings: {}
                        },
                        ignoreThisToppingQty: function(a) {
                            return !simplr.util.mEmpty(g.getToppingsData(f.data.ProductType, a).Tags.IgnoreQty)
                        },
                        getToppingWeight: function(a, b) {
                            var d = 0;
                            if (!simplr.util.mEmpty(a) && !l.ignoreThisToppingQty(a) &&
                                (d = Math.ceil(b), a === "C" || a === "Cp" && l.data.crustType === "NPAN")) d > 1 ? d-- : d = 0;
                            return d
                        },
                        setPartCount: function(a, b) {
                            var d = l.data.partsOverlap[a].map;
                            if (d.length === 0) l.data.partsOverlap[a].count += parseInt(b);
                            else
                                for (var e = 0, f = d.length; e < f; e++) l.setPartCount(d[e], b)
                        },
                        getPartCount: function(a) {
                            var b = l.data.partsOverlap[a].map,
                                d = 0;
                            if (b.length === 0) d = l.data.partsOverlap[a].count;
                            else
                                for (var a = 0, e = b.length; a < e; a++) {
                                    var f = l.getPartCount(b[a]);
                                    f > d && (d = f)
                                }
                            return d
                        },
                        exceedsMaxOptionQty: function(a, b, d) {
                            var e = false,
                                d = l.getToppingWeight(a, d),
                                f;
                            for (f in l.data.partsOverlap) l.data.partsOverlap[f].count = 0;
                            for (var g in l.data.toppings) {
                                f = l.data.toppings[g];
                                var h = l.getToppingWeight(f.Code, f.Weight);
                                f.Code !== a && h > 0 && l.setPartCount(f.Part, h)
                            }
                            d > 0 && (a = l.getPartCount(b) + d, l.data.crustType == "NPAN" && a++, a > l.data.maxOptionQty ? e = true : l.setPartCount(b, d));
                            return e
                        },
                        exceedsWarnAfterOptionQty: function() {
                            return f.data.Code === "S_PIZZA" && l.getPartCount("1/1") > j.data.Tags.WarnAfterOptionQty
                        },
                        setFlavor: function(d) {
                            v.setCrustType(d);
                            l.data.crustType = d;
                            l.updateDescription();
                            d === "GLUTENF" ? o.show("#glutenFreePizza") : d === "NPAN" && l.exceedsWarnAfterOptionQty() && o.show("#handmadePanPizza");
                            a("input.selectTopping", b).each(function() {
                                a(this).attr("name").indexOf("|Xm") != -1 && (d === "NPAN" ? (a(this).closest(".topping").hide(), a(this).is(":checked") && (a(".sauceSelection .topping input:eq(0)").attr("checked", "checked").click().attr("checked", "checked"), site.func.bubbleOverlayToggle(true, {
                                    xPos: n,
                                    yPos: q
                                }, {
                                    code: "eHandmadePanSauceChanged"
                                }))) : a(this).closest(".topping").show());
                                a(this).attr("name").indexOf("|Cp") != -1 && (d === "NPAN" ? a(this).closest(".topping").hide() : d !== "NPAN" && a(this).closest(".topping").show())
                            })
                        },
                        setTopping: function(a, b, d) {
                            if (!l.exceedsMaxOptionQty(a, b, d) || l.ignoreThisToppingQty(a)) l.data.crustType === "NPAN" && l.exceedsWarnAfterOptionQty() && o.show("#handmadePanPizza"), b = {
                                Code: a,
                                Weight: d,
                                Part: b
                            }, l.data.toppings[a] = b, v.setTopping(b), l.data.initialLoad || l.updateDescription()
                        },
                        setToppings: function(d) {
                            var h = {
                                "1/2": 0,
                                "1/1": 1,
                                "2/2": 2,
                                "3/4": 3,
                                "4/4": 4,
                                "1/4": 5,
                                "2/4": 6
                            },
                                j;
                            for (j in d) {
                                var k = {
                                    Code: j,
                                    Weight: d[j].weight,
                                    Part: d[j].part
                                };
                                l.data.toppings[j] = k;
                                a("select[name='Weight|" + j + "']").val(k.Weight);
                                a(".selectTopping[name='" + e.productCode + "|Topping|" + j + "']").click();
                                a("input[name='Part|" + j + "']").parent().eq(h[k.Part]).click();
                                g.getToppingsData(f.data.ProductType, j).Tags.Sauce && a(".selectSauce", b).click()
                            }
                            l.updateDescription()
                        },
                        removeTopping: function(a) {
                            l.setTopping(a, "0", "0")
                        },
                        updateHeightChanger: function() {
                            if (a("#pizzaSummaryInColumn", b).height() > 220) {
                                var d = a("#pizzaSummaryInColumn",
                                    b).height() - 220;
                                a(".visualWrapper #heightChanger", b).css({
                                    height: d
                                })
                            }
                        },
                        updateDescription: function() {
                            var b = {};
                            a.each(l.data.toppings, function(a, d) {
                                if (d.Code && d.Part && d.Part != 0) b[d.Code] = {}, b[d.Code][d.Part] = d.Weight
                            });
                            var d = {
                                Code: a("input[name='" + e.productCode + "|Variant']:checked").val(),
                                ID: 1,
                                Price: 0,
                                Qty: e.qty,
                                Sides: e.sides,
                                Toppings: b
                            };
                            simplr.view.mRender({
                                name: "variantDetails",
                                data: d,
                                selector: "#variantDescription"
                            });
                            l.updateHeightChanger()
                        },
                        getOrderVariantData: function() {
                            var a = simplr.form.mGetValues(b),
                                d = {}, e;
                            for (e in a)
                                if (a[e] != false && e.indexOf("Part") == -1 && e.indexOf("Weight") == -1) {
                                    var f = e.split("|");
                                    f.length == 3 ? (f = f[2], d[e] = a["Part|" + f] + "|" + a["Weight|" + f]) : d[e] = a[e]
                                }
                            return d
                        }
                    };
                a(".progressWrapper .step").on("click", function() {
                    a(".progressWrapper .step").removeClass("activeStep").filter(this).prevAll(".step").add(this).addClass("activeStep");
                    a(this).nextAll(".seperator, .rightEndcap").removeClass("activeSeperator seperatorBoth rightActiveEndcap");
                    a(this).next(".seperator").addClass("activeSeperator");
                    a(this).prevAll(".seperator").addClass("seperatorBoth");
                    a(this).next(".rightEndcap").addClass("rightActiveEndcap");
                    a(".builderWrapper", b).children().hide().filter("#" + a(this).attr("id") + "Wrapper").show();
                    var d = a(".activeStep").size();
                    a(".js-prev", b).toggle(d > 1);
                    a(".js-next", b).toggle(d < 3);
                    site.trigger.onEvent({
                        uri: "/en/pages/order/#/builder/panel/" + (d == 1 ? "CrustSize" : d == 2 ? "CheeseSauce" : "Toppings"),
                        title: "Builder Pizza Panel " + (d == 1 ? "CrustSize" : d == 2 ? "CheeseSauce" : "Toppings"),
                        group: "Builder",
                        subGroup: "Builder Pizza Panel"
                    });
                    if (!o.hasSeen("#cheeseUpsell") && d === 3 && !(l.getPartCount("1/1") > (l.data.crustType === "NPAN" ? 2 : 9)) && l.data.toppings.C && l.data.toppings.C.Part === "1/1" && l.data.toppings.C.Weight == 1 && jsDPZ.app.order.getOrder().data.Details.Coupons.length) o.show("#cheeseUpsell"), site.trigger.onEvent({
                        uri: "/builder/upsell/cheeseupsell",
                        title: "Builder Cheese Upsell Exposed",
                        group: "Builder",
                        subGroup: "Cheese Upsell"
                    });
                    a(".js-addToOrderVariantDetails.test", b).toggle(d === 3);
                    a(".js-addToOrderBottomRight.test", b).toggle(d !== 3)
                }).eq(0).click();
                a(".js-next").on("click", function(b) {
                    b.preventDefault();
                    a(".activeStep:last").nextAll(".step:first").click();
                    if (!o.hasSeen("#cheeseUpsell") && o.data.wrapperID === "#cheeseSauceWrapper" && !(l.getPartCount("1/1") > (l.data.crustType === "NPAN" ? 2 : 9)) && l.data.toppings.C && l.data.toppings.C.Part === "1/1" && l.data.toppings.C.Weight == 1 && jsDPZ.app.order.getOrder().data.Details.Coupons.length) o.show("#cheeseUpsell"), site.trigger.onEvent({
                        uri: "/builder/upsell/cheeseupsell",
                        title: "Builder Cheese Upsell Exposed",
                        group: "Builder",
                        subGroup: "Cheese Upsell"
                    })
                });
                a(".js-prev").on("click", function(b) {
                    b.preventDefault();
                    a(".activeStep:last").prevAll(".step:first").click()
                });
                a(".toppingSettings .portion", b).on("click", function(b) {
                    b.preventDefault();
                    b.stopImmediatePropagation();
                    var b = a("input:checked", a(this).parent()).val(),
                        d = a("select.weight", a(this).parent()).attr("name").split("|")[1],
                        e = a("input", this).val(),
                        f = a("select.weight", a(this).parent()).val();
                    e !== b && (l.exceedsMaxOptionQty(d, e, f) ? site.func.bubbleOverlayToggle(true, {
                        xPos: n,
                        yPos: q
                    }, {
                        code: "eMaxPizzaToppingsQty",
                        label: site.data.uiConfig.AVAILABLE_LOCATIONS_HASH[e].toLowerCase()
                    }) : (l.data.initialLoad || d === "C" && e != "1/1" && site.func.bubbleOverlayToggle(true, {
                        xPos: n,
                        yPos: q
                    }, {
                        code: "eHalfCheesePizza"
                    }), l.setTopping(d, e, f), a("input", this).attr("checked", "checked"), a(this).parent().children(".portion").attr("class", function(a, b) {
                        return b.replace(/(\S+)Active/, "$1Inactive")
                    }), a(this).attr("class", function(a, b) {
                        return b.replace(/(\S+)Inactive/, "$1Active")
                    })))
                });
                var w = "0";
                a(".toppingSettings select",
                    b).on("focus", function() {
                    w = a(this).val()
                }).on("change", function() {
                    var b = a(this).attr("name").split("|")[1],
                        d = a("input:checked", a(this).parent()).val() || "1/1",
                        e = a(this).val();
                    l.exceedsMaxOptionQty(b, d, e) ? (a(this).val(w), site.func.bubbleOverlayToggle(true, {
                        xPos: n,
                        yPos: q
                    }, {
                        code: "eMaxPizzaToppingsQty",
                        label: site.data.uiConfig.AVAILABLE_LOCATIONS_HASH[d].toLowerCase()
                    })) : l.setTopping(b, d, e)
                });
                a("select.quantity", b).append(site.func.buildQtyOptionList(e.qty));
                a(".selectSauce", b).on("click", function() {
                    var b =
                        a(this).closest(".product").children(".toppingSettings");
                    l.data.initialLoad || a(".selectTopping", b).each(function() {
                        var b = a(this).attr("name").split("|")[2];
                        l.removeTopping(b)
                    }).removeAttr("checked");
                    if (a(this).is(":checked") || l.data.initialLoad) {
                        if (b.show(), !l.data.initialLoad) {
                            var d = a(".selectTopping:checked", b);
                            d.length === 0 && (d = a(".selectTopping", b).eq(0), d.attr("checked", "checked").closest(".topping").children(".toppingSettings").show());
                            b = d.attr("name").split("|")[2];
                            l.setTopping(b, "1/1", "1");
                            site.func.bubbleOverlayToggle(true, {
                                xPos: n,
                                yPos: q
                            }, {
                                code: "eNonVisualPizzaTopping"
                            })
                        }
                    } else b.hide()
                });
                a(".selectTopping", b).on("click", function(b) {
                    var d = a(this).closest(".topping").children(".toppingSettings"),
                        e = a(this).attr("name").split("|")[2];
                    a(this).is(":radio") && a.each(a(this).closest(".toppingSettings").find(":radio").not(this), function() {
                        var b = a(this).attr("name").split("|")[2];
                        a(this).removeAttr("checked").parent().siblings(".toppingSettings").hide();
                        l.removeTopping(b)
                    });
                    !a(this).is(":checked") && !l.data.initialLoad ? (d.hide(), l.removeTopping(e), e === "C" && site.func.bubbleOverlayToggle(true, {
                        xPos: n,
                        yPos: q
                    }, {
                        code: "eRemoveCheeseVisualBuilder"
                    })) : l.exceedsMaxOptionQty(e, "1/1", "1") && !l.ignoreThisToppingQty(e) ? (b.preventDefault(), b.stopImmediatePropagation(), site.func.bubbleOverlayToggle(true, {
                        xPos: n,
                        yPos: q
                    }, {
                        code: "eMaxPizzaToppingsQty",
                        label: site.data.uiConfig.AVAILABLE_LOCATIONS_HASH["1/1"].toLowerCase()
                    })) : (d.show(), l.setTopping(e, "1/1", "1"), l.data.initialLoad || (a(".weight", d).val(1), a(".portion",
                        d).eq(1).click()), e !== "C" && !l.data.initialLoad && !v.toJSON().ToppingConfig[e] && site.func.bubbleOverlayToggle(true, {
                        xPos: n,
                        yPos: q
                    }, {
                        code: "eNonVisualPizzaTopping"
                    }))
                });
                var v = PizzaDisplayFactory.getPizzaDisplay(),
                    B = {};
                !simplr.util.mEmpty(e.orderVariantID) || !simplr.util.mEmpty(e.toppings) ? a.each(e.toppings, function(b, d) {
                    a.each(d, function(a, d) {
                        B[b] = {
                            part: a,
                            weight: d
                        }
                    })
                }) : (h = g.getDefaultProductToppingsData(e.productCode), a.each(h, function(a, b) {
                    B[b.Code] = {
                        part: "1/1",
                        weight: b.Availability[0]
                    }
                }));
                l.setToppings(B);
                a("input[name='" + e.productCode + "|Variant']", b).on("change", function() {
                    j = g.getVariant(a(this).val());
                    l.setFlavor(a(this).attr("data-flavorcode"));
                    var d = a(this).attr("data-sizecode");
                    site.func.visualPizzaBubbleOverlayToggle(true, {
                        feeds: site.data.uiConfig.AVAILABLE_FEEDSIZE_HASH[d],
                        size: g.getSizesData("Pizza", d).Name
                    });
                    a(".js-upsellCheckbox input", b).attr("checked", a(this).attr("data-flavorcode") === "NPAN")
                });
                h = null;
                simplr.util.mEmpty(e.code) ? (h = a(".product:eq(0) input[name='" + e.productCode + "|Variant'][data-sizeCode='" +
                    site.data.defaultPizzaSize + "']", b), h.size() == 0 && (h = a(".product:eq(0) input[name='" + e.productCode + "|Variant']", b).eq(0))) : (h = e.flavorCode ? a("input[name='" + e.productCode + "|Variant'][data-flavorcode='" + e.flavorCode + "']", b) : a("input[name='" + e.productCode + "|Variant'][value='" + e.code + "']", b), h.size() == 0 ? h = a(".product:eq(0) input[name='" + e.productCode + "|Variant']", b).eq(0) : a("input[name='" + e.productCode + "|Variant'][value='" + e.code + "']", b).click());
                h.click();
                l.data.initialLoad = false;
                a(".js-isEdit, .js-isNew",
                    b).filter(l.data.isNew ? ".js-isEdit" : ".js-isNew").remove();
                a(".js-productQuantity", b).append(site.func.buildQtyOptionList(e.qty));
                a("#cheeseSauceWrapper select").length == 0 && (a("#cheeseSauceWrapper .product").hide(), a("#cheeseSauceWrapper .noCheeseAndSauce").show());
                l.updateHeightChanger();
                if (l.data.isNew) {
                    var z = site.storage.load("unsaved-pizza");
                    site.storage.remove("unsaved-pizza");
                    z && (a("#loadUnsavedPizza", b).fadeIn(1500).on("click", function(a) {
                        a.preventDefault();
                        a = jsDPZ.dataConversion.JSONStringToObject(z);
                        site.func.bubbleOverlayToggle(false);
                        site.func.overlayToggle(true, "builderPizza", {}, a)
                    }), a("#loadUnsavedPizza", b).on("hover", function() {
                        site.func.bubbleOverlayToggle(true, {
                            xPos: n,
                            yPos: q + 30
                        }, {
                            code: "eIncompletePizza"
                        })
                    }, function() {
                        site.func.bubbleOverlayToggle(false)
                    }));
                    f.data.Code != "S_PIZZA" && o.show("#configureSpecialtyPizza")
                }
                a(".js-cheeseUpsell", b).on("click", function() {
                    l.setTopping("C", "1/1", "1.5");
                    a('[name="Weight|C"]').val(1.5);
                    site.trigger.onEvent({
                        uri: "/en/pages/order/#/builder/cheeseupsell/accept",
                        title: "Builder Cheese Upsell Accept Offer",
                        group: "Builder",
                        subGroup: "Cheese Upsell"
                    })
                });
                a(".js-cheeseUpsellClose", b).on("click", function() {
                    site.trigger.onEvent({
                        uri: "/en/pages/order/#/builder/cheeseupsell/decline",
                        title: "Builder Cheese Upsell Decline Offer",
                        group: "Builder",
                        subGroup: "Cheese Upsell"
                    })
                });
                a("form", b).on("submit", function(d) {
                    d.preventDefault();
                    d = l.getPartCount("1/1") > (l.data.crustType === "NPAN" ? 2 : 9);
                    if (!o.hasSeen("#cheeseUpsell") && !d && l.data.toppings.C && l.data.toppings.C.Part === "1/1" &&
                        l.data.toppings.C.Weight == 1)
                        if (jsDPZ.app.order.getOrder().data.Details.Coupons.length) o.hide("#configureSpecialtyPizza"), o.show("#cheeseUpsell"), site.trigger.onEvent({
                            uri: "/builder/upsell/cheeseupsell",
                            title: "Builder Cheese Upsell Exposed",
                            group: "Builder",
                            subGroup: "Cheese Upsell"
                        }), a(".js-cheeseUpsell, .js-cheeseUpsellClose", b).on("click", function() {
                            var a = l.getOrderVariantData();
                            site.func.overlayToggle(false);
                            site.func.visualPizzaBubbleOverlayToggle(false);
                            var b = "/order/variant/" + e.orderVariantID +
                                "/update";
                            l.data.isNew && (b = "/order/variant/new");
                            b += site.catalogTools.orderVariantToURLParameterString(site.catalogTools.formDataToVariantData(a));
                            simplr.controller.mRouteAndExecute(b)
                        });
                        else {
                            d = l.getOrderVariantData();
                            site.func.overlayToggle(false);
                            site.func.visualPizzaBubbleOverlayToggle(false);
                            var f = "/order/variant/" + e.orderVariantID + "/update";
                            l.data.isNew && (f = "/order/variant/new");
                            f += site.catalogTools.orderVariantToURLParameterString(site.catalogTools.formDataToVariantData(d));
                            simplr.controller.mRouteAndExecute(f)
                        } else d =
                            l.getOrderVariantData(), site.func.overlayToggle(false), site.func.visualPizzaBubbleOverlayToggle(false), f = "/order/variant/" + e.orderVariantID + "/update", l.data.isNew && (f = "/order/variant/new"), f += site.catalogTools.orderVariantToURLParameterString(site.catalogTools.formDataToVariantData(d)), simplr.controller.mRouteAndExecute(f)
                });
                site.func.setupLayerCloseEvents({
                    closeSelector: ".js-closeButton, .js-removeCoupon",
                    layerSelector: b,
                    callback: function(b) {
                        if (a(this).hasClass(".js-closeButton") && o.data.wrapperID ===
                            "#cheeseUpsell") site.trigger.onEvent({
                            uri: "/en/pages/order/#/builder/cheeseupsell/Xtoclose",
                            title: "Builder Cheese Upsell XtoClose",
                            group: "Builder",
                            subGroup: "Cheese Upsell"
                        });
                        Object.size = function(a) {
                            var b = 0,
                                d;
                            for (d in a) a.hasOwnProperty(d) && b++;
                            return b
                        };
                        var d = site.catalogTools.formDataToVariantData(l.getOrderVariantData());
                        if (Object.size(d.Toppings) > 2 || Object.size(d.Toppings) == 2 && !d.Toppings.X || d.Code != "14SCREEN") a.each(d, function(a, b) {
                            a != "Price" && a != "ID" && (d[a.toLowerCase()] = b);
                            delete d[a]
                        }), d.productCode =
                            e.productCode, site.storage.save("unsaved-pizza", jsDPZ.dataConversion.JSONObjectToString(d));
                        site.func.visualPizzaBubbleOverlayToggle(false);
                        a(b).is(".js-removeCoupon") && simplr.controller.mRouteAndExecute(a(b).attr("href"))
                    }
                });
                var y = a("input[data-sizecode='" + h.attr("data-sizecode") + "'][data-flavorcode='HANDTOSS']", b);
                a(".js-upsellCheckbox input", b).on("click", function() {
                    a(this).is(":checked") ? (y = a("input[name='" + e.productCode + "|Variant']:checked", b), a("input[name='" + e.productCode + "|Variant'][data-flavorcode='NPAN']",
                        b).click(), site.trigger.onEvent({
                        uri: "/en/pages/order/#/builder/panupsell/accept",
                        title: "Builder Pan Upsell Accept Offer",
                        group: "Builder",
                        subGroup: "Pan Upsell"
                    })) : y && y.click()
                })
            }
        }
    });
    simplr.view.mAddViews({
        builderChicken: {
            html: function(b) {
                var b = a.extend({
                    couponCode: "",
                    orderVariantID: "",
                    code: "",
                    productCode: "",
                    toppings: {},
                    sides: {},
                    qty: 1
                }, b),
                    d = jsDPZ.app.catalog.getCatalog(),
                    e = d.getProduct(b.productCode).data,
                    g = "";
                if (!simplr.util.mEmpty(b.couponCode)) {
                    for (var f = jsDPZ.app.order.getOrder().data, g = d.getCoupon(b.couponCode).data.Name,
                            j = f.Details.Coupons, h = [], k = 0, m = f.Fulfiller.Groups.length; k < m; k++) f.Fulfiller.Groups[k].GroupID == b.couponCode && (h = f.Fulfiller.Groups[k]);
                    k = 0;
                    for (m = j.length; k < m; k++)
                        if (f = j[k], b.couponCode === f.Code) {
                            orderCouponID = f.ID;
                            break
                        }
                    for (var j = site.func.updateFulfillerStatus(), n, k = 0; k < j.length; k++) j[k].GroupID == b.couponCode && (n = j[k]);
                    g = {
                        component: "CouponInfoHeader",
                        tokens: {
                            groupID: b.couponCode,
                            groupDescription: g,
                            orderID: orderCouponID,
                            currentCount: h.TotalSteps - n.UnFulfilled.length + 1,
                            totalCount: h.TotalSteps
                        }
                    }
                }
                n =
                    d.getProduct(e.Code).data.Variants;
                var q = d.getProductFlavorsData(e.Code);
                a.each(n, function(b, e) {
                    var f = d.getVariant(e).data;
                    a.each(q, function(a, b) {
                        if (f.FlavorCode == b.Code) return jsDPZ.util.empty(b.Variants) && (b.Variants = []), b.Variants.push(f), b.Price = jsDPZ.obj.price(f.Price).getDisplayValue(), false
                    })
                });
                var o = {
                    component: "builderVariantsWithSection",
                    tokens: []
                };
                a.each(q, function(b, f) {
                    var g = {
                        sectionName: d.getFlavorsData(e.ProductType, f.Code).Name,
                        productVariantList: {
                            component: "builderVariantOptions",
                            tokens: []
                        }
                    };
                    a.each(f.Variants, function(a, b) {
                        var f = b.Name;
                        b.SizeCode != "" && (f = d.getSizesData(e.ProductType, b.SizeCode), f = f.Description != "" ? f.Description : f.Name);
                        g.productVariantList.tokens.push({
                            sizeCode: b.SizeCode,
                            flavorCode: b.FlavorCode,
                            productCode: e.Code,
                            variantCode: b.Code,
                            variantPrice: jsDPZ.obj.price(b.Price).getDisplayValue(),
                            variantDescription: f
                        })
                    });
                    o.tokens.push(g)
                });
                n = d.getAvailableProductSidesData(e.Code);
                var l = {
                    component: "otherProductSides",
                    tokens: []
                };
                a.each(n, function(a, b) {
                    var f = d.getProduct("F_" + b.Code),
                        g = "<select class='sideSelect' name='" + e.Code + "|Side|" + b.Code + "'>" + site.func.buildSideOptionList(0) + "</select>";
                    l.tokens.push({
                        sideName: !simplr.util.mEmpty(f) ? f.data.Name : "",
                        sideQty: g,
                        sideCode: b.Code,
                        sideImage: !simplr.util.mEmpty(f) ? f.data.ImageCode : "noimage",
                        sideDescription: !simplr.util.mEmpty(f) ? f.data.Description : ""
                    })
                });
                return simplr.layout.mAssembleLayout({
                    component: "genericOverlay",
                    tokens: {
                        overlayContent: {
                            component: "builderChicken",
                            tokens: {
                                couponInfo: g,
                                productVariants: o,
                                productQty: b.qty,
                                productSides: l,
                                productCode: e.Code,
                                productName: e.Name,
                                productDescription: e.Description,
                                productDogEar: e.Tags.New ? "newDogEar" : "",
                                productDogEarText: e.Tags.New ? simplr.validation.mGetCodeMessage("iNewDogEar") : "",
                                productImage: e.ImageCode
                            }
                        }
                    }
                })
            },
            callback: function(b, d) {
                var e = a.extend({
                    orderVariantID: "",
                    qty: 1
                }, d),
                    g = jsDPZ.util.empty(e.orderVariantID);
                a(".tbody", b).each(function() {
                    a(".row:last", this).addClass("last")
                });
                a(".sideItem:last", b).addClass("sideItemLast");
                var f = a(".detailsServingOptions h3 a", b);
                a("input[name='" + e.productCode +
                    "|Variant']", b).click(function() {
                    var d = jsDPZ.app.catalog.getCatalog().getDefaultVariantSidesData(a(this).val()),
                        g = 0;
                    a.each(d, function(d, f) {
                        g += parseInt(f.Availability[0], 10);
                        simplr.util.mEmpty(e.orderVariantID) && a("select[name='" + e.productCode + "|Side|" + f.Code + "']", b).val(f.Availability[0])
                    });
                    a("span.size", b).text(a(this).parent().prev().text() + " ");
                    a("span.numCups", b).text(g + " ");
                    a("span.plural, span.singular", b).hide().filter(g == 1 ? ".singular" : ".plural").show();
                    a(this).is(":visible") || (d = a("a", a(this).parent().parent().parent().parent().prev()),
                        f.filter(".active").not(d).removeClass("active").parent().next().hide(), a(d).addClass("active").parent().next().show())
                });
                f.click(function(d) {
                    d.preventDefault();
                    if (!a(this).is(".active")) {
                        var d = a(this).parent().next(),
                            f = a("input[name='" + e.productCode + "|Variant']:checked", b).attr("data-sizeCode"),
                            f = a("input[name='" + e.productCode + "|Variant'][data-sizeCode='" + f + "']", d);
                        f.size() > 0 ? f.click() : a("input:eq(0)", d).click()
                    }
                });
                a("input[name='" + e.productCode + "|Variant']", b).filter(simplr.util.mEmpty(e.code) ?
                    ":eq(0)" : "[value='" + e.code + "']").click();
                if (!g || !simplr.util.mEmpty(e.toppings)) a(".sideSelect", b).val("0"), a.each(e.sides, function(b) {
                    a("select[name='" + e.productCode + "|Side|" + b + "']").val(e.sides[b])
                });
                a(".js-isEdit, .js-isNew", b).filter(g ? ".js-isEdit" : ".js-isNew").remove();
                a("form", b).submit(function(a) {
                    a.preventDefault();
                    site.func.overlayToggle(false);
                    simplr.controller.mRouteAndExecute((g ? "/order/variant/new" : "/order/variant/" + e.orderVariantID + "/update") + site.catalogTools.orderVariantToURLParameterString(site.catalogTools.formDataToVariantData(simplr.form.mGetValues(b))))
                });
                a(".js-cancel", b).closest(".overlayContent").size() == 0 && a(".js-cancel", b).remove();
                a(".js-closeButton").click(function() {
                    site.trigger.onEvent({
                        title: "Chicken " + a("h1", b).text() + " x to close",
                        group: "Chicken",
                        subGroup: a.trim(a("h1", b).text().replace("Domino's", "").replace("Builder", ""))
                    })
                });
                site.func.setupLayerCloseEvents({
                    closeSelector: ".js-closeButton, .js-removeCoupon, .js-cancel",
                    layerSelector: b,
                    callback: function(b) {
                        a(b).is(".js-removeCoupon") && simplr.controller.mRouteAndExecute(a(b).attr("href"))
                    }
                });
                site.func.fixMissingImages(a("img", b))
            }
        }
    });
    simplr.view.mAddViews({
        builderDefault: {
            html: function(b) {
                var b = a.extend({
                    couponCode: "",
                    orderVariantID: "",
                    code: "",
                    productCode: "",
                    toppings: {},
                    sides: {},
                    qty: 1
                }, b),
                    d = jsDPZ.app.catalog.getCatalog(),
                    e = d.getProduct(b.productCode).data,
                    g = "";
                if (!simplr.util.mEmpty(b.couponCode)) {
                    for (var f = jsDPZ.app.order.getOrder().data, g = d.getCoupon(b.couponCode).data.Name, j = f.Details.Coupons, h = [], k = 0, m = f.Fulfiller.Groups.length; k < m; k++) f.Fulfiller.Groups[k].GroupID == b.couponCode &&
                        (h = f.Fulfiller.Groups[k]);
                    k = 0;
                    for (m = j.length; k < m; k++)
                        if (f = j[k], b.couponCode === f.Code) {
                            orderCouponID = f.ID;
                            break
                        }
                    for (var j = site.func.updateFulfillerStatus(), n, k = 0; k < j.length; k++) j[k].GroupID == b.couponCode && (n = j[k]);
                    g = {
                        component: "CouponInfoHeader",
                        tokens: {
                            groupID: b.couponCode,
                            groupDescription: g,
                            orderID: orderCouponID,
                            currentCount: h.TotalSteps - n.UnFulfilled.length + 1,
                            totalCount: h.TotalSteps
                        }
                    }
                }
                var q = {
                    component: "builderVariantsWithoutSection",
                    tokens: {
                        productVariantList: {
                            component: "builderVariantOptions",
                            tokens: []
                        }
                    }
                };
                a.each(e.Variants, function(a, b) {
                    var f = d.getVariant(b).data;
                    if (!f.Tags.Hidden) {
                        var g = f.Name;
                        f.SizeCode != "" ? (g = d.getSizesData(e.ProductType, f.SizeCode), g = g.Description != "" ? g.Description : g.Name) : f.FlavorCode != "" && (g = d.getFlavorsData(e.ProductType, f.FlavorCode), g = g.Description != "" ? g.Description : g.Name);
                        q.tokens.productVariantList.tokens.push({
                            productCode: e.Code,
                            flavorCode: f.FlavorCode,
                            sizeCode: f.SizeCode,
                            variantCode: f.Code,
                            variantPrice: jsDPZ.obj.price(f.Price).getDisplayValue(),
                            variantDescription: g
                        })
                    }
                });
                var o = {
                    component: "detailsContent",
                    tokens: {
                        productToppings: {
                            component: "builderDefaultToppings",
                            tokens: []
                        }
                    }
                }, l = {
                        component: "detailsContent",
                        tokens: {
                            productToppings: {
                                component: "builderDefaultToppings",
                                tokens: []
                            }
                        }
                    }, w = {};
                !simplr.util.mEmpty(b.orderVariantID) || !simplr.util.mEmpty(b.toppings) ? a.each(b.toppings, function(b, d) {
                    a.each(d, function(a, d) {
                        w[b] = d
                    })
                }) : a.each(d.getDefaultProductToppingsData(b.productCode), function(a, b) {
                    w[b.Code] = b.Availability[0]
                });
                var v = e.Tags.IncludedInMaxOptionQty || [];
                a.each(d.getAvailableProductToppingsData(e.Code),
                    function(b, d) {
                        var f = {
                            component: "category1ComponentOptionsAvailabilty",
                            tokens: []
                        };
                        a.each(site.data.uiConfig.AVAILABLE_WEIGHTS_ARRAY, function(b, g) {
                            f.tokens.push({
                                productCode: e.Code,
                                toppingCode: d.Code,
                                weight: g.value,
                                isDefault: w[d.Code] == g.value ? "js-isDefault" : "",
                                isQtyIncluded: a.inArray(d.Code, v) >= 0 ? "js-qtyIncluded" : "",
                                isQtyExcluded: d.Tags.IgnoreQty ? "js-qtyExcluded" : "",
                                isOption: a.inArray(g.value, d.Availability) == -1 ? "js-notOption" : ""
                            })
                        });
                        d.Tags.Sauce == true ? l.tokens.productToppings.tokens.push({
                            exclusiveGroupClass: "js-isSauce",
                            toppingCode: d.Code,
                            toppingName: d.Name,
                            toppingsAvailability: f
                        }) : o.tokens.productToppings.tokens.push({
                            exclusiveGroupClass: "js-isTopping",
                            toppingCode: d.Code,
                            toppingName: d.Name,
                            toppingsAvailability: f
                        })
                    });
                n = d.getAvailableProductSidesData(e.Code);
                var B = {
                    component: "otherProductSides",
                    tokens: []
                };
                a.each(n, function(a, b) {
                    var f = d.getProduct("F_" + b.Code),
                        g = "<select class='sideSelect' name='" + e.Code + "|Side|" + b.Code + "'>" + site.func.buildSideOptionList(0) + "</select>";
                    B.tokens.push({
                        sideName: !simplr.util.mEmpty(f) ? f.data.Name : "",
                        sideQty: g,
                        sideCode: b.Code,
                        sideImage: !simplr.util.mEmpty(f) ? f.data.ImageCode : "noimage",
                        sideDescription: !simplr.util.mEmpty(f) ? f.data.Description : ""
                    })
                });
                return simplr.layout.mAssembleLayout({
                    component: "genericOverlay",
                    tokens: {
                        overlayContent: {
                            component: "builderDefault",
                            tokens: {
                                couponInfo: g,
                                productCode: e.Code,
                                productDogEar: e.Tags.New ? "newDogEar" : "",
                                productDogEarText: e.Tags.New ? simplr.validation.mGetCodeMessage("iNewDogEar") : "",
                                productImage: e.ImageCode,
                                productName: e.Name,
                                productDescription: e.Description,
                                toppingDetailContent: o,
                                sauceDetailContent: l,
                                productVariants: q,
                                productQty: b.qty,
                                productSides: B
                            }
                        }
                    }
                })
            },
            callback: function(b, d) {
                var e = a.extend({
                    orderVariantID: "",
                    qty: 1
                }, d),
                    g = jsDPZ.util.empty(e.orderVariantID),
                    f = parseFloat(jsDPZ.app.catalog.getCatalog().getProduct(e.productCode).data.Tags.MaxOptionQty),
                    j = parseFloat(jsDPZ.app.catalog.getCatalog().getProduct(e.productCode).data.Tags.MaxSauceQty),
                    h = function() {
                        var d = 0;
                        a(".toppingsTable input:checked", b).not(".js-qtyExcluded").each(function() {
                            d += a(this).hasClass("js-qtyIncluded") ?
                                1 : parseFloat(a(this).val().split("|")[1])
                        });
                        return d
                    }, k = function() {
                        var d = 0;
                        a("#js-sauces input:checked", b).each(function() {
                            d += parseFloat(a(this).val().split("|")[1])
                        });
                        return d
                    };
                a(".js-notOption", b).parent().addClass("hidden");
                a(".tbody", b).each(function() {
                    a(".row:last", this).addClass("last")
                });
                a(".sideItem:last", b).addClass("sideItemLast");
                a(".js-isEdit, .js-isNew", b).filter(g ? ".js-isEdit" : ".js-isNew").remove();
                a(".js-productQuantity", b).append(site.func.buildQtyOptionList(e.qty));
                var m = jsDPZ.app.catalog.getCatalog().getProduct(e.productCode).data;
                simplr.util.mEmpty(m.AvailableSides) && a("#js-sides", b).remove();
                a(".js-isSauce").length === 0 && a("#js-sauces", b).remove();
                a(".js-isTopping").length === 0 && a("#js-toppings", b).remove();
                a(".variantTable input", b).click(function() {
                    var d = jsDPZ.app.catalog.getCatalog().getDefaultVariantSidesData(a(this).val()),
                        f = 0;
                    a.each(d, function(d, g) {
                        f += parseInt(g.Availability[0], 10);
                        simplr.util.mEmpty(e.orderVariantID) && a("select[name='" + e.productCode + "|Side|" + g.Code + "']", b).val(g.Availability[0])
                    });
                    a("span.size", b).text(a(this).parent().prev().text() +
                        " ");
                    a("span.numCups", b).text(f + " ");
                    a("span.plural, span.singular", b).hide().filter(f == 1 ? ".singular" : ".plural").show()
                });
                a("input[name='" + e.productCode + "|Variant']", b).filter(simplr.util.mEmpty(e.code) ? ":eq(0)" : "[value='" + e.code + "']").click();
                a(".toppingsTable .row", b).each(function() {
                    a("input:eq(0)", this).click();
                    a(".js-isDefault", this).click()
                });
                a(".toppingsTable input", b).click(function(b) {
                    if (h() > f) {
                        var d = parseFloat(a(this).val().split("|")[1]),
                            d = "1/1|" + (f - (h() - d));
                        a("input[value='" + d + "']", a(this).parent().parent()).click();
                        site.func.bubbleOverlayToggle(true, {
                            xPos: b.pageX + 10,
                            yPos: b.pageY
                        }, {
                            code: "eMaxToppingsQty",
                            label: m.ProductType.toLowerCase()
                        })
                    } else site.func.bubbleOverlayToggle(false)
                });
                var n = a(".js-isSauce", b);
                a("input", n).click(function(d) {
                    if (j > 1) {
                        var e = false;
                        k() > j && (e = parseFloat(a(this).val().split("|")[1]), e = "1/1|" + (j - (k() - e)), a("input[value='" + e + "']", a(this).parent().parent()).attr("checked", "checked"), e = true);
                        a(".js-isSauce input:checked", b).not("[value='1/1|0']").size() > j && (a("input[value='1/1|0']", a(this).parent().parent()).attr("checked",
                            "checked"), e = true);
                        e ? site.func.bubbleOverlayToggle(true, {
                            xPos: d.pageX + 10,
                            yPos: d.pageY
                        }, {
                            code: "eMaxSauceQty",
                            label: m.ProductType.toLowerCase()
                        }) : site.func.bubbleOverlayToggle(false)
                    } else a(this).val() != "1/1|0" && n.not(a(this).parent().parent()).each(function() {
                        a("input:eq(0)", this).click()
                    })
                });
                if (!g || !simplr.util.mEmpty(e.toppings)) a(".sideSelect", b).val("0"), a.each(e.sides, function(b) {
                    a("select[name='" + e.productCode + "|Side|" + b + "']").val(e.sides[b])
                });
                a("form", b).submit(function(a) {
                    a.preventDefault();
                    site.func.overlayToggle(false);
                    simplr.controller.mRouteAndExecute((g ? "/order/variant/new" : "/order/variant/" + e.orderVariantID + "/update") + site.catalogTools.orderVariantToURLParameterString(site.catalogTools.formDataToVariantData(simplr.form.mGetValues(b))))
                });
                a(".js-cancel", b).closest(".overlayContent").size() == 0 && a(".js-cancel", b).remove();
                a(".js-closeButton").click(function() {
                    var e = jsDPZ.app.catalog.getCatalog().getProduct(d.productCode).data.ProductType;
                    site.trigger.onEvent({
                        title: e + " " + a("h1", b).text() + " x to close",
                        group: e,
                        subGroup: a.trim(a("h1", b).text().replace("Domino's", "").replace("Builder", ""))
                    })
                });
                site.func.setupLayerCloseEvents({
                    closeSelector: ".js-closeButton, .js-removeCoupon, .js-cancel",
                    layerSelector: b,
                    callback: function(b) {
                        a(b).is(".js-removeCoupon") && simplr.controller.mRouteAndExecute(a(b).attr("href"))
                    }
                });
                site.func.fixMissingImages(a("img", b))
            }
        }
    });
    simplr.view.mAddViews({
        category_coupon1: {
            html: function(b) {
                var b = a.extend({
                    categoryData: {},
                    productCode: ""
                }, b),
                    d = {
                        categoryName: b.categoryData.Name,
                        coupons: {
                            component: "categoryCouponsCouponComponent",
                            tokens: []
                        },
                        featuredCoupon: {}
                    }, b = jsDPZ.util.empty(b.productCode) ? b.categoryData.Products : [b.productCode];
                a.each(b, function(b, g) {
                    if (jsDPZ.app.catalog.isCouponActive(g).Success || jsDPZ.app.catalog.getCatalog().getCoupon(g).data.Tags.Featured) {
                        var f = jsDPZ.app.catalog.getCatalog().getCoupon(g);
                        if (jsDPZ.util.empty(f.data.Tags.Featured)) d.coupons.tokens.push({
                            description: f.data.Name,
                            price: jsDPZ.obj.price(f.data.Price).getDisplayValue(),
                            code: f.data.Code,
                            couponImage: f.data.ImageCode
                        });
                        else {
                            var j = window.location.href.toString().match(/lang=([a-z]{2})/),
                                j = j ? j[1] : a("html").attr("lang");
                            f.data.ImageCode == "OLO50" && j == "es" && (f.data.ImageCode += "_es");
                            d.featuredCoupon = {
                                component: "featuredCouponComponent",
                                tokens: {
                                    code: f.data.Code,
                                    couponImage: '<img src="' + urlConfig.assets + "/images/img/coupons/featured/" + f.data.ImageCode + '.jpg" alt="" />'
                                }
                            }
                        }
                    }
                });
                return simplr.layout.mAssembleLayout({
                    component: "categoryCouponsComponent",
                    tokens: d
                })
            },
            callback: function(b, d) {
                a(".js-addCoupon",
                    b).click(function(b) {
                    b.preventDefault();
                    var b = a(this).attr("data-code"),
                        d = a(this).parents(".featuredCoupon").size() > 0 ? "Featured Coupon" : "Coupon " + b;
                    site.trigger.onEvent({
                        title: d,
                        group: "Coupons",
                        subGroup: d == "Featured Coupon " ? "Featured Coupon" : b
                    });
                    b === "9193" ? site.func.overlayToggle(true, "panUpsellOverlay", {}, {
                        recoverable: true,
                        toutAddCoupon: true,
                        panelNumber: "4",
                        panelName: "featuredcoupon",
                        defaultCoupon: "9193",
                        upsellCoupon: "9194",
                        couponPrice: "2.00"
                    }) : b === "8633" ? site.func.overlayToggle(true, "sandwichSliceOverlay", {}, {
                        recoverable: true,
                        toutAddCoupon: true,
                        panelNumber: "4",
                        panelName: "featuredcoupon",
                        defaultCoupon: "8633",
                        upsellCoupon: "8634",
                        couponPrice: "5"
                    }) : simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: a(this).attr("href")
                    }))
                });
                site.func.fixMissingImages(a("img", b));
                site.func.isGroupOrdering() && (a.extend(d, jsDPZ.app.order.getOrderForPowerData().Order, {
                    Promotions: jsDPZ.app.order.getOrder().data.Details.Promotions
                }), site.func.showDiscountDashboard(d));
                a("#discountDashboard").is(":visible") && site.func.positionDiscountDashboard()
            }
        }
    });
    simplr.view.mAddViews({
        category_product2: {
            html: function(b) {
                var d = a.extend({
                    categoryData: {},
                    categoryParams: {
                        section: "",
                        category: ""
                    }
                }, b),
                    e = {
                        categories: {
                            component: "category2SubComponent",
                            tokens: []
                        }
                    }, g = jsDPZ.app.catalog.getCatalog(),
                    b = [d.categoryData].concat(d.categoryData.Categories);
                a.each(b, function(b, j) {
                    if (j.Products.length > 0 && j.Code != "BuildYourOwn") {
                        var h = {
                            component: "category2ProductComponent",
                            tokens: []
                        };
                        a.each(j.Products, function(b, e) {
                            var f = g.getProduct(e).data,
                                m = {
                                    productName: f.Name,
                                    productCode: f.Code,
                                    productDogEar: f.Tags.New ? "newDogEar" : "",
                                    productDogEarText: f.Tags.New ? simplr.validation.mGetCodeMessage("iNewDogEar") : "",
                                    productImage: f.ImageCode,
                                    productDescription: f.Description,
                                    productClass: b % 4 == 0 ? "" : "productMargin",
                                    sectionCode: d.categoryParams.section,
                                    categoryCode: j.Code,
                                    noRatings: simplr.util.mEmpty(f.Rating) ? "js-hasNoRatings" : ""
                                };
                            simplr.util.mEmpty(f.Rating) || a.extend(m, {
                                productRating: f.Rating.AverageRating.toFixed(1),
                                ratingImage: parseFloat(f.Rating.AverageRating).toFixed(1).replace(".", "_"),
                                productReviewsCount: f.Rating.ReviewsCount,
                                pluralizeCount: f.Rating.ReviewsCount > 1 ? "s" : ""
                            });
                            h.tokens.push(m)
                        });
                        e.categories.tokens.push({
                            categoryName: j.Name,
                            categoryProducts: h
                        })
                    }
                });
                return simplr.layout.mAssembleLayout({
                    component: "category2Component",
                    tokens: e
                })
            },
            callback: function(b, d) {
                a(".js-hasNoRatings", b).remove();
                a(".products", b).each(function() {
                    for (var b = a(".product", this), d = b.splice(0, 4); d.length > 0;) {
                        var f = 0;
                        a(d).each(function() {
                            var b = a(this).height();
                            f = b > f ? b : f
                        }).height(f);
                        d = b.splice(0, 4)
                    }
                });
                a("a", b).not(".js-readReviewsLink").click(function(b) {
                    b.preventDefault();
                    var b = a(this).attr("href").split("#")[1].split("/")[2],
                        b = jsDPZ.app.catalog.getCatalog().getProduct(b).data,
                        d = b.ProductType;
                    d == "GSalad" ? d = "Salad" : d == "Wings" && (d = "Chicken");
                    site.trigger.onEvent({
                        title: d + " " + b.Name + " Open Builder",
                        group: d,
                        subGroup: b.Name,
                        clickType: a(this).data("clicked-element")
                    });
                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: a(this).attr("href")
                    }))
                });
                site.func.isGroupOrdering() && (a.extend(d, jsDPZ.app.order.getOrderForPowerData().Order, {
                        Promotions: jsDPZ.app.order.getOrder().data.Details.Promotions
                    }),
                    site.func.showDiscountDashboard(d));
                a("#discountDashboard").is(":visible") && site.func.positionDiscountDashboard();
                site.func.fixMissingImages(a("img", b))
            }
        }
    });
    simplr.view.mAddViews({
        checkout: {
            html: function(b) {
                var d = jsDPZ.app.catalog.getCatalog(),
                    e = jsDPZ.app.store.getStore(),
                    g = e.data,
                    f = jsDPZ.app.order.getOrder().data,
                    j = jsDPZ.app.customer.getCustomer().data,
                    h = jsDPZ.app.catalog.getCrossSellQuicklist().data.slice(0, 4),
                    k = b.Order.StatusItems,
                    m = {
                        component: "errorNotification",
                        tokens: []
                    };
                if (k && k.length)
                    for (var n =
                        0, q = k.length; n < q; n++)
                        if (k[n].Code == "BelowMinimumDeliveryAmount") {
                            m.tokens.push({
                                text: simplr.validation.mGetCodeMessage("eOrderMinimumDeliveryFee", jsDPZ.obj.price(e.data.MinimumDeliveryOrderAmount).getDisplayValue())
                            });
                            break
                        }
                var n = !simplr.util.mEmpty(f.Details.OrderDateTime) ? f.Details.OrderDateTime : g.StoreAsOfTime,
                    g = site.locationTools.buildSearchParameters(site.locationTools.addressToFieldData(f.Customer.Address)),
                    k = e.getAvailableServiceMethods({
                        dtString: n,
                        deliveryAvailable: jsDPZ.app.customer.getCustomer().getSessionData().DeliveryAvailable
                    }),
                    o = {
                        component: "viewOrderTokens",
                        tokens: {
                            viewOrderItemizedVariants: {
                                component: "orderItemizedVariants",
                                tokens: []
                            },
                            promoMessages: {
                                component: "messageBox",
                                tokens: []
                            },
                            viewOrderItemizedCoupons: {
                                component: "orderItemizedCoupons",
                                tokens: []
                            }
                        }
                    };
                if (f.Details.Promotions && f.Details.Promotions.Redeemable) {
                    n = 0;
                    for (q = f.Details.Promotions.Redeemable.length; n < q; n++) {
                        var l = site.data.messages[f.Details.Promotions.Redeemable[n].Code];
                        l && l.title && l.message && o.tokens.promoMessages.tokens.push({
                            title: l.title,
                            description: l.message
                        })
                    }
                }
                o.tokens.viewOrderItemizedVariants.tokens =
                    site.catalogTools.getVariantToppingSideViewObj(f.Details.Variants);
                var w = 0;
                if (b.UpsellProducts) {
                    n = 0;
                    for (q = b.UpsellProducts.length; n < q; n++)
                        for (var l = 0, v = o.tokens.viewOrderItemizedVariants.tokens.length; l < v; l++)
                            if (b.UpsellProducts[n].Variant.ID === o.tokens.viewOrderItemizedVariants.tokens[l].id) w++, o.tokens.viewOrderItemizedVariants.tokens[l].upsellClass = "showSize", o.tokens.viewOrderItemizedVariants.tokens[l].variantSize = jsDPZ.util.htmlUnEscape(b.UpsellProducts[n].Size), o.tokens.viewOrderItemizedVariants.tokens[l].variantPrice =
                                jsDPZ.obj.price(b.UpsellProducts[n].Price).getDisplayValue(), o.tokens.viewOrderItemizedVariants.tokens[l].variantParams = site.catalogTools.orderVariantToURLParameterString(b.UpsellProducts[n].Variant)
                }
                n = a.map(h, function(a) {
                    return a.Code
                });
                site.trigger.onEvent({
                    title: "Display Upsells on Review Page",
                    group: "Checkout",
                    subGroup: "Review Page Upsells",
                    uri: "/checkout/review/displayupsells",
                    subData: n.join(";")
                });
                b = {
                    component: "crossSell",
                    tokens: []
                };
                n = 0;
                for (q = h.length; n < q; n++) l = h[n], l.Price = h[n].Type == "Coupon" ?
                    jsDPZ.app.catalog.getCatalog().getCoupon(l.Code).data.Price : jsDPZ.app.catalog.getCatalog().getVariant(l.Code).data.Price;
                b.tokens = site.catalogTools.getVariantToppingSideViewObj(h);
                n = 0;
                for (q = b.tokens.length; n < q; n++) b.tokens[n].productClass = n % 4 == 0 ? "" : "productMargin";
                a.each(f.Details.Coupons, function(a, b) {
                    var e = d.getCoupon(b.Code);
                    jsDPZ.util.empty(e) ? site.data.couponUnavailable = b.Code : (o.tokens.viewOrderItemizedCoupons.tokens.push({
                        id: b.ID,
                        price: b.Price != 0 ? jsDPZ.obj.price(b.Price).getDisplayValue() : "",
                        code: b.Code,
                        name: e.data.Name,
                        fulfilledClass: !b.Fulfilled && !e.data.Tags.OverrideAmount ? "unfullfilled" : "",
                        hiddenClass: b.Code === "SJRD" ? "none" : ""
                    }), site.data.couponUnavailable = "")
                });
                if (site.data.couponUnavailable && j.Session.Reorder) site.data.couponUnavailable = "", o.tokens.viewOrderItemizedCoupons.tokens.push({
                    id: "",
                    price: "",
                    code: "",
                    name: "",
                    fulfilledClass: "unavailable"
                });
                j.Session.Reorder = false;
                j = [];
                simplr.util.mEmpty(e.data.StoreID) || (j = e.getAddress().getDisplayAddress(), simplr.util.mEmpty(e.data.LocationInfo) ||
                    j.push(e.data.LocationInfo), j.push(site.format.phoneNumber({
                        number: e.data.Phone
                    })));
                var e = {
                    component: "beverageUpsell",
                    tokens: []
                }, B = true,
                    z = [];
                a.each(jsDPZ.app.order.getOrder().data.Details.Variants, function(a, b) {
                    var d = jsDPZ.app.catalog.getCatalog().getVariant(b.Code).data.ProductCode;
                    B && jsDPZ.app.catalog.getCatalog().getProduct(d).data.ProductType == "Drinks" && (site.data.beverageUpsell.cascade ? z.push(d) : B = false)
                });
                if (B) {
                    h = site.data.beverageUpsell.productCodes;
                    w = [];
                    n = 0;
                    for (q = h.length; n < q; n++) {
                        var y = d.getProduct(h[n]).data ||
                            d.getProduct("F_WATER").data,
                            r = {};
                        if (y && a.inArray(y.Code, z) == -1 && a.inArray(y.Code, w) == -1) {
                            r.productCode = y.Code;
                            r.defaultSize = "";
                            r.name = y.Name;
                            r.productImage = '<img src="' + urlConfig.assets + "/images/img/products/thumbnails/" + y.ImageCode + '.jpg" alt="' + y.Name.replace(/"/g, "&quot;") + '" />';
                            r.variants = [];
                            l = 0;
                            for (v = y.Variants.length; l < v; l++) {
                                var u = d.getVariant(y.Variants[l]).data;
                                if (u && (r.variants.push({
                                    label: d.getSizesData(y.ProductType, u.SizeCode).Name,
                                    value: u.Code
                                }), u.SizeCode == "2LTB")) r.defaultSize = u.Code
                            }
                            r.variants =
                                site.func.buildOptionList({
                                    listValues: r.variants
                                });
                            r.qty = site.func.buildQtyOptionList(25);
                            e.tokens.push(r);
                            w.push(y.Code)
                        }
                    }
                }
                return simplr.layout.mAssembleLayout({
                    component: "checkoutComponent",
                    tokens: {
                        infoNotifications: m,
                        storeResultsURL: "#" + site.func.buildURL({
                            url: "#/locations/results/?type=all",
                            parameters: g
                        }),
                        serviceMethodDeliveryClass: a.inArray("Delivery", k) == -1 ? "disabled" : "",
                        serviceMethodCarryoutClass: a.inArray("Carryout", k) == -1 ? "disabled" : "",
                        storeNumber: f.Details.StoreID,
                        storeInformation: j.join("</li><li>"),
                        locationInformation: jsDPZ.obj.address(f.Customer.Address).getDisplayAddress().join("</li><li>"),
                        futureOrderDate: jsDPZ.util.empty(f.Details.OrderDateTime) ? "" : jsDPZ.obj.dateTime(f.Details.OrderDateTime).getDisplayFormat(),
                        orderTokens: o,
                        orderFoodBeverage: jsDPZ.obj.price(f.Details.Amounts.FoodAndBeverage).getDisplayValue(),
                        orderDominosDollars: f.Details.Amounts.DominosDollars > 0 ? "&minus; " + jsDPZ.obj.price(f.Details.Amounts.DominosDollars).getDisplayValue() : "",
                        orderSavings: jsDPZ.obj.price(f.Details.Amounts.Savings).getUsableValue() > jsDPZ.obj.price(site.data.uiConfig.ADJUSTMENT_THRESHOLD).getUsableValue() ? jsDPZ.obj.price(f.Details.Amounts.Savings).getDisplayValue() : "",
                        orderSurcharge: f.Details.Amounts.Surcharge > 0 ? jsDPZ.obj.price(f.Details.Amounts.Surcharge).getDisplayValue() : "",
                        orderDeliveryFee: f.Details.Amounts.DeliveryFee > 0 ? jsDPZ.obj.price(f.Details.Amounts.DeliveryFee).getDisplayValue() : "",
                        orderTaxes: f.Details.Amounts.Tax > 0 ? jsDPZ.obj.price(f.Details.Amounts.Tax).getDisplayValue() : "",
                        orderBottle: f.Details.Amounts.Bottle > 0 ? jsDPZ.obj.price(f.Details.Amounts.Bottle).getDisplayValue() : "",
                        orderTotal: jsDPZ.obj.price(f.Details.Amounts.Customer).getDisplayValue(),
                        crossSellItems: b,
                        beverageUpsellItems: e
                    }
                })
            },
            callback: function(b, d) {
                jsDPZ.app.customer.getCustomer().data.Session.IsReordering = false;
                var e = jsDPZ.app.catalog.getCatalog(),
                    g = jsDPZ.app.order.getOrder().data,
                    f = jsDPZ.app.customer.getCustomer().data;
                site.catalogTools.isForceFutureOrder() && site.func.overlayToggle(true, "changeOrderTimingOverlay", {}, {});
                if (f.Session.IsEasyOrder) f.Session.WatchEasyOrder = true;
                site.sessionTools.save({
                    async: false
                });
                a(".js-beverageUpsellProduct", b).size() === 0 && (a(".js-beverageUpsell", b).remove(), a(".js-orderSummaryTableHeader", b).children().toggle());
                site.data.beverageUpsell.dropdown ? (a(".js-beverageDropdown, .js-addBeverage", b).show(), a(".js-beverageUpsellProduct", b).each(function() {
                    a(".js-beverageSize", this).on({
                        change: function() {
                            a(".js-beverageSize", b).removeClass("error")
                        },
                        focus: function() {
                            site.trigger.onEvent({
                                uri: "/en/pages/order/#/checkout/drinkupsell/selectsize",
                                title: "Checkout Drink Upsell Dropdown Select Size",
                                group: "Checkout",
                                subGroup: "Drink Upsell Dropdown Select Size"
                            })
                        }
                    });
                    a(".js-beverageQty", this).val(0).on("change", function() {
                        a(this).removeClass("error")
                    })
                })) : (a(".js-beverageRadio", b).show(), a(".js-beverageUpsellProduct", b).each(function() {
                    a(".name, .productImage, input", this).addClass("pointer");
                    var b = "#/product/" + a(this).data("product") + "/builder/";
                    b += a(this).data("default") ? "?code=" + a(this).data("default") : "";
                    a(this).children().on("click", function(d) {
                        d.preventDefault();
                        a(d.target).is(":radio") &&
                            a(d.target).prop("checked", false);
                        site.trigger.onEvent({
                            uri: "/en/pages/order/#/checkout/drinkupsell/radiobuttonaccept",
                            title: "Checkout Drink Upsell Radio Button Accept Offer",
                            group: "Checkout",
                            subGroup: "Drink Upsell Radio Button Accept"
                        });
                        simplr.controller.mRouteAndExecute(site.func.buildURL({
                            url: b
                        }))
                    })
                }));
                a(".js-addBeverage", b).on("click", function() {
                    var d = false;
                    a(".js-beverageUpsellProduct", b).each(function() {
                        if (a(".js-beverageSize", this).val() != 0)
                            if (d = true, a(".js-beverageQty", this).val() != 0) {
                                var b =
                                    e.getVariant(a(".js-beverageSize", this).val()).data,
                                    f = e.getProduct(b.ProductCode).data;
                                site.trigger.onEvent({
                                    uri: "/en/pages/order/#/checkout/drinkupsell/addtocart",
                                    title: f.ProductType + " " + jsDPZ.util.htmlUnEscape(b.Name) + " Add to Cart",
                                    group: f.ProductType,
                                    subGroup: jsDPZ.util.htmlUnEscape(b.Name)
                                });
                                simplr.controller.mRouteAndExecute(site.func.buildURL({
                                    url: "#/order/variant/new?code=" + a(".js-beverageSize", this).val() + "&qty=" + a(".js-beverageQty", this).val()
                                }))
                            } else a(".js-beverageQty", this).addClass("error")
                    });
                    d || a(".js-beverageSize", b).addClass("error")
                });
                site.func.refreshShoprunner();
                setTimeout(function() {
                    a("#genericOverlay").css("top", "30px")
                }, 1E3);
                a(".js-addMoreItems", b).on("click", function() {
                    site.trigger.onEvent({
                        title: "Checkout - Clicked on Add More Items",
                        group: "Checkout",
                        subGroup: "Add More Items",
                        uri: "/checkout/addmoreitemsclick"
                    })
                });
                g.Details.Coupons.length == 0 && a(".js-couponMessaging", b).remove();
                g.Details.Amounts.DeliveryFee == 0 && g.Details.ServiceMethod == "Delivery" ? (a(".js-deliveryCost", b).remove(),
                    typeof jsDPZ.app.order.getOrder().data.Partners.ShopRunner !== "undefined" ? a(".js-deliveryLabel", b).remove() : a("#sr_shippingSummaryDiv", b).remove()) : g.Details.Amounts.DeliveryFee > 0 && g.Details.ServiceMethod == "Delivery" ? a(".js-deliveryFree, #sr_shippingSummaryDiv", b).remove() : a(".js-deliveryFree", b).parent().empty();
                a(".js-total:empty", b).parent().remove();
                a(".orderSummaryContent :empty", b).not("img, input, select, .clr").remove();
                a(".js-qtyValue", b).each(function() {
                    a("select", a(this).parent()).append(site.func.buildQtyOptionList(a(this).val())).change(function() {
                        var b =
                            a(this).attr("name").split("|")[0],
                            d = a.extend(true, {}, jsDPZ.app.order.getOrder().getItemData({
                                ID: b
                            }), {
                                Qty: a(this).val()
                            }),
                            b = "/order/variant/" + b + "/update" + site.catalogTools.orderVariantToURLParameterString(d);
                        simplr.controller.mRouteAndExecute(b)
                    })
                }).remove();
                a(".fullLineItem a", b).click(function(b) {
                    b.preventDefault();
                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: a(this).attr("href")
                    }))
                });
                a(".js-removeVariant, .js-removeCoupon", b).click(function(b) {
                    b.preventDefault();
                    b.stopPropagation();
                    if (site.func.isUsingGroupOrderingCoupons() && a(this).is(".js-removeCoupon")) jsDPZ.app.order.getOrder().data.Tags.removeCoupon = true;
                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: a(this).attr("href")
                    }))
                });
                a(".unfullfilled, .js-fulfillCoupon", b).click(function(b) {
                    b.preventDefault();
                    site.func.isGroupOrdering() ? window.location.hash = "#/section/GroupOrdering/category/Pizza/" : simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: "#/fulfiller/",
                        parameters: {
                            code: a(this).attr("data-code"),
                            id: a(this).attr("data-id")
                        }
                    }))
                });
                simplr.view.mRender({
                    name: "coupon_enter_form",
                    data: {
                        checkout: true
                    },
                    selector: b + " .js-couponEnterForm"
                });
                site.data.uiConfig.checkoutDetailsScroller != null && site.data.uiConfig.checkoutDetailsScroller.destroy();
                site.data.uiConfig.checkoutDetailsScroller = simplr.ui.widget.oTrackableScrollingElement({
                    containerSelector: a("#js-checkoutColumns", b),
                    elementSelector: ".pageRightColumn",
                    animateSpeed: 500,
                    refreshSpeed: 100
                });
                a(".disabled", b).remove();
                a(".genericList", b).each(function() {
                    var b = a("li", this);
                    b.filter(":last").text() !=
                        "" && b.size() > 1 ? b.eq(0).remove() : b.not(":first").remove()
                });
                var f = jsDPZ.app.order.getOrder().data.Details.ServiceMethod,
                    j = a(".js-serviceMethod", b);
                j.click(function() {
                    site.func.changeServiceMethod(a(this).val());
                    simplr.controller.mRouteAndExecute("/order/price/?checkout=1");
                    simplr.view.mRender({
                        name: "profile_column",
                        data: {},
                        selector: "#js-myProfilePage"
                    })
                });
                f ? j.filter("[value='" + f + "']").attr("checked", "true") : j.eq(0).attr("checked", "true").click();
                a(".js-serviceMethod", b).size() === 2 && a(".js-serviceMethodChange",
                    b).remove();
                a("a.js-changeTiming", b).click(function(b) {
                    b.preventDefault();
                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: a(this).attr("href")
                    }))
                });
                a(".crossSells .products", b).each(function() {
                    for (var b = a(".product", this), d = b.splice(0, 4); d.length > 0;) {
                        var e = 0;
                        a(d).each(function() {
                            var b = a(this).height();
                            e = b > e ? b : e
                        }).height(e);
                        d = b.splice(0, 4)
                    }
                });
                a(".crossSells a", b).click(function(b) {
                    b.preventDefault();
                    b = a(this).attr("href");
                    site.trigger.onEvent({
                        breadcrumb: ["Order", "Cross Sell", b.split("code=")[1].split("&")[0]]
                    });
                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: b
                    }))
                });
                a(".crossSells .product", b).size() == 0 && a(".crossSells", b).remove();
                a("a.submitButton", b).click(function(b) {
                    b.preventDefault();
                    var b = a(this).attr("href"),
                        d = jsDPZ.app.order.getOrder().data.Details.Amounts.Customer;
                    (Math.ceil(d).toFixed(2) - d).toFixed(2);
                    jsDPZ.app.order.getOrder();
                    var e = true,
                        f = site.data.sidePromo && site.data.sidePromo.productCode;
                    a.each(jsDPZ.app.order.getOrder().data.Details.Variants, function(a, b) {
                        var d = jsDPZ.app.catalog.getCatalog();
                        e && d.getProduct(d.getVariant(b.Code).data.ProductCode).data.Code == f && (e = false)
                    });
                    jsDPZ.app.order.getOrder().data.HasSeenUpsell ? window.location = b : simplr.controller.mRouteAndExecute("/order/upsell/")
                });
                a(".js-sizeUpsell", b).on("click", function(b) {
                    b.preventDefault();
                    site.trigger.onEvent({
                        uri: "/en/pages/order/#/checkout/sizeupsell/inlineaccept",
                        title: "Checkout Size Upsell Inline Accept Offer",
                        group: "Checkout",
                        subGroup: "Size Upsell Inline Yes"
                    });
                    g.HideSizeUpsell = true;
                    simplr.controller.mRouteAndExecute(a(this).attr("href"))
                });
                a(".js-crossSell a", b).on("click", function() {
                    site.trigger.onEvent({
                        group: "ClickOnReviewPageCrossSell",
                        subGroup: a(this).attr("href").split("code=")[1]
                    })
                });
                site.func.fixMissingImages(a("img", b));
                site.func.isGroupOrdering() ? (a.extend(d, jsDPZ.app.order.getOrderForPowerData().Order, {
                    Promotions: jsDPZ.app.order.getOrder().data.Details.Promotions
                }, {
                    Products: d.Order.Products
                }), site.func.showDiscountDashboard(d), a(".pageLeftColumn").addClass("discountDashboard"), site.func.positionDiscountDashboard()) : a(".pageLeftColumn").removeClass("discountDashboard")
            }
        }
    });
    simplr.view.mAddViews({
        coupon_enter_code: {
            html: function() {
                return simplr.layout.mAssembleLayout({
                    component: "couponEnterCode",
                    tokens: {}
                })
            },
            callback: function(a) {
                simplr.view.mRender({
                    name: "coupon_enter_form",
                    data: {},
                    selector: a + " .js-couponEnterForm"
                })
            }
        },
        coupon_enter_form: {
            html: function(b) {
                var d = jsDPZ.app.order.getOrder().data,
                    e = [];
                a.each(d.Details.Coupons, function(a, b) {
                    var d = jsDPZ.app.catalog.getCatalog().getCoupon(b.Code);
                    !jsDPZ.util.empty(d) && !d.data.Tags.NoEntry && b.Code !== "SJRD" && e.push({
                        id: b.ID,
                        code: b.Code
                    })
                });
                var g = false;
                if (b.checkout && d.Details.Promotions && d.Details.Promotions.Valid)
                    for (var f in d.Details.Promotions.Valid) d.Details.Promotions.Valid[f].Code === "DominosDollars" && d.Details.Promotions.Valid[f].ValidInStore && (g = true);
                return simplr.layout.mAssembleLayout({
                    component: "enterCouponCodeForm",
                    tokens: {
                        showDominosDollars: g ? "" : "none",
                        couponList: {
                            component: "couponListItem",
                            tokens: e
                        }
                    }
                })
            },
            callback: function(b) {
                a(".js-removeCoupon", b).on("click", function(b) {
                    b.preventDefault();
                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: a(this).attr("href")
                    }))
                });
                site.func.formFocus();
                site.func.setupContentPopups();
                a("form", b).validate({
                    rules: {
                        Coupon_Code: {
                            required: true
                        }
                    },
                    submitHandler: function(b) {
                        var e = jsDPZ.app.catalog.getCatalog().getCoupon(a.trim(b.Coupon_Code.value).toUpperCase());
                        !jsDPZ.util.empty(e) && e.data.Tags.NoEntry ? site.func.overlayToggle(true, "codeOverlay", {}, {
                            code: "eCouponInvalid"
                        }) : simplr.controller.mRouteAndExecute(site.func.buildURL({
                            url: b.action,
                            parameters: {
                                code: b.Coupon_Code.value,
                                qty: 1
                            }
                        }))
                    },
                    errorPlacement: function(a, b) {
                        a.appendTo(b.parent())
                    }
                })
            }
        }
    });
    simplr.view.mAddViews({
        fulfillerWizard: {
            html: function(b) {
                var d = {
                    component: "fulfillerWizardItem",
                    tokens: []
                }, e = jsDPZ.app.catalog.getCatalog(),
                    g = {
                        component: "CouponInfoHeader",
                        tokens: {
                            groupID: b.group.GroupID,
                            groupDescription: e.getCoupon(b.group.GroupID).data.Name,
                            orderID: b.orderID,
                            currentCount: b.group.TotalSteps - b.group.UnFulfilled.length + 1,
                            totalCount: b.group.TotalSteps
                        }
                    };
                a.each(b.group.UnFulfilled, function(f, g) {
                    var h = {
                        component: "fulfillerWizardProduct",
                        tokens: []
                    }, k = {
                            component: "fulfillerWizardProduct",
                            tokens: []
                        };
                    a.each(g, function(d, f) {
                        var g = e.getProduct(f.Code),
                            j = "",
                            l = "",
                            m = f.Variants.length - 1,
                            o = f.Variants.length > 6;
                        a.each(f.Variants, function(a, d) {
                            var h = e.getVariant(d),
                                k = "";
                            jsDPZ.util.empty(h.data.FlavorCode) ? k += h.data.Name : (o && !jsDPZ.util.empty(h.data.SizeCode) && (k += e.getSizesData(g.data.ProductType, h.data.SizeCode).Name + " "), k += e.getFlavorsData(g.data.ProductType, h.data.FlavorCode).Name);
                            var s = "",
                                s = site.catalogTools.isCustomizableProduct(f.Code) ? "/product/" + f.Code + "/builder/?couponCode=" + b.group.GroupID +
                                    "&code=" + d : "/order/variant/new" + site.catalogTools.orderVariantToURLParameterString(site.catalogTools.defaultVariantToOrderVariant(d));
                            if (g.data.ProductType == "Pizza" && (h.data.FlavorCode == "HANDTOSS" || jsDPZ.util.empty(l))) l = simplr.util.mEmpty(site.data.couponWizardImportantProductCodes[f.Code]) ? '<a href="#' + s + '">Order This Pizza</a>' : '<a href="#' + s + '">Build Your Pizza</a>';
                            j += '<a class="js-addProductFromFulfiller" href="#' + s + '">' + k + "</a>" + (a != m ? " | " : "")
                        });
                        jsDPZ.util.empty(l) || (j = l);
                        simplr.util.mEmpty(site.data.couponWizardImportantProductCodes[f.Code]) ?
                            h.tokens.push({
                                productName: g.data.Name,
                                productDogEar: g.data.Tags.New ? "newDogEar" : "",
                                productDogEarText: g.data.Tags.New ? simplr.validation.mGetCodeMessage("iNewDogEar") : "",
                                productImage: g.data.ImageCode,
                                variantLinks: j
                            }) : k.tokens.push({
                                productName: g.data.Name,
                                productDogEar: g.data.Tags.New ? "newDogEar" : "",
                                productDogEarText: g.data.Tags.New ? simplr.validation.mGetCodeMessage("iNewDogEar") : "",
                                productImage: g.data.ImageCode,
                                variantLinks: j
                            })
                    });
                    d.tokens.push({
                        wizardImportantItems: k,
                        wizardProducts: h,
                        currentCount: f + 1,
                        totalCount: b.group.UnFulfilled.length
                    });
                    return false
                });
                return simplr.layout.mAssembleLayout({
                    component: "genericOverlay",
                    tokens: {
                        overlayContent: {
                            component: "fulfillerWizard",
                            tokens: {
                                wizardItems: d,
                                couponInfo: g
                            }
                        }
                    }
                })
            },
            callback: function(b) {
                a(".pageBox", b).each(function() {
                    a(".product", this).length == 0 && (a(this).prev().remove(), a(this).remove())
                });
                a(".product a", b).click(function(b) {
                    b.preventDefault();
                    site.func.overlayToggle(false);
                    var b = "",
                        e = a(this).attr("href").match(/code=\w*/)[0].split("=")[1],
                        b = e.match(/\d{2}SCREEN/),
                        e = jsDPZ.app.catalog.getCatalog().getVariant(e).data;
                    site.trigger.onEvent({
                        title: "Coupon Wizard " + e.Name,
                        group: "Coupons",
                        subGroup: "Coupon Wizard " + (b ? "BYO" : "Specialty")
                    });
                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: a(this).attr("href")
                    }))
                });
                site.func.setupLayerCloseEvents({
                    closeSelector: ".js-closeButton, .js-removeCoupon",
                    layerSelector: b,
                    callback: function(b) {
                        if (a(b).is(".js-removeCoupon")) site.trigger.onEvent({
                            title: "Coupon Wizard Remove Coupon",
                            group: "Coupons",
                            subGroup: "Coupon Wizard Remove Coupon"
                        }),
                        simplr.controller.mRouteAndExecute(site.func.buildURL({
                            url: a(b).attr("href")
                        }));
                        else site.trigger.onEvent({
                            title: "Coupon Wizard X to close",
                            group: "Coupons",
                            subGroup: "X to Close"
                        })
                    }
                });
                site.func.fixMissingImages(a("img", b))
            }
        }
    });
    simplr.view.mAddViews({
        group_ordering: {
            html: function(b) {
                function d(b, d) {
                    for (var e = b.Description, f = {
                            component: "groupOrderingProduct",
                            tokens: []
                        }, k = 0, m = b.Products.length; k < m; k++) a.each(g, function(a, e) {
                        if (e.Code == b.Products[k]) {
                            var g = "none",
                                h = "",
                                m = "pizza";
                            if (!jsDPZ.util.empty(e.Tags.Banner) &&
                                (e.Tags.Banner == "glutenFree" || e.Tags.Banner == "glutenFreeVegetarian")) g = "glutenFree";
                            d || (h = '<span class="price">' + jsDPZ.obj.price(jsDPZ.app.catalog.getCatalog().getVariant(e.ReferencedProductCode).data.Price).getDisplayValue() + "</span>", m = "sides");
                            g = {
                                code: e.Code,
                                description: e.Description,
                                name: e.Name,
                                size: e.Size,
                                options: e.Options,
                                reference: e.ReferencedProductCode,
                                tags: e.Tags,
                                image: '<span class="dogEar ' + e.Tags.Banner + '"></span><img src="' + urlConfig.assets + "/images/img/products/thumbnails/groupOrdering/" + e.Code + '.jpg" alt="" />',
                                dietary: g,
                                price: h,
                                category: m
                            };
                            d ? j.push(g) : f.tokens.push(g)
                        }
                    });
                    d || (categoryToken = {
                        categoryName: e,
                        categoryProducts: f
                    }, jsDPZ.util.empty(categoryToken.categoryProducts.tokens) || h.categories.tokens.push(categoryToken))
                }
                a.extend({
                    categoryData: {},
                    categoryParams: {
                        section: "",
                        category: ""
                    }
                }, b);
                for (var e = jsDPZ.app.catalog.getCatalog().data.Categorization.PreconfiguredProducts.Categories, g = jsDPZ.app.catalog.getCatalog().data.PreconfiguredProducts, f = {}, j = [], h = {
                        categories: {
                            component: "sideCategory",
                            tokens: []
                        }
                    }, b = b.categoryParams.category == "Pizza" ? site.func.hasGroupOrderingCoupons() ? simplr.validation.mGetCodeMessage("step1coupons") : simplr.validation.mGetCodeMessage("step1nocoupons") : simplr.validation.mGetCodeMessage("step2"), k = 0, m = e.length; k < m; k++) e[k].Code == "GroupOrdering" && (f = e[k]);
                jsDPZ.util.empty(f) || a.each(f.Categories, function(a, b) {
                    b.Code == "GroupOrderingPizza" ? d(b, true) : d(b, false)
                });
                return simplr.layout.mAssembleLayout({
                    component: "groupOrdering",
                    tokens: {
                        subheaderMessage: b,
                        pizzaContainer: {
                            component: "pizzaContainer",
                            tokens: {
                                groupOrderingPizzas: {
                                    component: "groupOrderingProduct",
                                    tokens: j
                                }
                            }
                        },
                        sidesContainer: {
                            component: "sidesContainer",
                            tokens: h
                        }
                    }
                })
            },
            callback: function(b, d) {
                function e() {
                    if (!site.func.isGroupOrdering() && site.func.hasGroupOrderingCoupons()) {
                        var a = g(),
                            b = jsDPZ.app.catalog.getCatalog().data.CouponTiers.MultiplePizza.Coupons[0];
                        if (jsDPZ.app.catalog.getCatalog().getCoupon(b).data.Tags.CouponTierThreshold <= a && !site.func.isGroupOrdering()) jsDPZ.app.order.getOrder().data.Tags = {
                            GroupOrdering: true,
                            usingGroupOrderingCoupons: false,
                            removeCoupon: false
                        }, simplr.controller.mRouteAndExecute("/order/validate/")
                    }
                }

                function g() {
                    for (var a = jsDPZ.app.order.getOrder().data.Details.Variants, b = 0, d = 0, e = a.length; d < e; d++) {
                        var f = jsDPZ.app.catalog.getCatalog().getVariant(a[d].Code).data.ProductCode,
                            f = jsDPZ.app.catalog.getCatalog().getProduct(f).data.ProductType;
                        if (f == "Pizza" || f == "Artisan") b += a[d].Qty
                    }
                    return b
                }

                function f() {
                    var b = jsDPZ.app.order.getOrder().data.Details.Variants,
                        d = jsDPZ.app.catalog.getCatalog().data.PreconfiguredProducts;
                    a(".js-pizzaControls").attr({
                        "data-id": 0,
                        "data-qty": 0
                    });
                    a(".js-productQty, .js-removeItem, .js-addItem").hide();
                    a(".js-newItem").show();
                    for (var e = 0, f = b.length; e < f; e++) a.each(d, function(d, f) {
                        if (b[e].Code == f.ReferencedProductCode) {
                            var g = [];
                            a.each(b[e].Toppings, function(a, b) {
                                var d = a + ", " + JSON.stringify(b);
                                g.push(d)
                            });
                            g.sort();
                            var k = site.catalogTools.createOrderVariantFromVariantCode(f.ReferencedProductCode, f.Options),
                                m = [];
                            a.each(k.Toppings, function(a, b) {
                                var d = a + ", " + JSON.stringify(b);
                                m.push(d)
                            });
                            m.sort();
                            j(g, m) && h(f, b[e])
                        }
                    });
                    k()
                }

                function j(a,
                    b) {
                    if (a.length !== b.length) return false;
                    for (var d = a.length; d--;)
                        if (a[d] !== b[d]) return false;
                    return true
                }

                function h(b, d) {
                    for (var e = a(".gOProduct"), f = 0, g = e.length; f < g; f++) a(".js-pizzaControls", e[f]).attr("data-prodcode") == b.ReferencedProductCode && a(".js-pizzaControls", e[f]).attr("data-options") == b.Options && (a(".js-pizzaControls", e[f]).attr({
                        "data-id": d.ID,
                        "data-qty": d.Qty
                    }), a(".js-productQty", e[f]).show(), a(".js-productCount", e[f]).html(d.Qty), a(".js-newItem", e[f]).hide(), a(".js-removeItem, .js-addItem",
                        e[f]).show())
                }

                function k() {
                    for (var b = g(), d = a(".js-pizzaControls"), e = 0, f = 0, f = 0, h = d.length; f < h; f++) e += parseInt(a(d[f]).attr("data-qty"));
                    f = b - e;
                    f > 0 ? (a(".js-productQtyBYOP").show(), a(".js-productQtyBYOP .js-productCount").html(f)) : (a(".js-productQtyBYOP").hide(), a(".js-productQtyBYOP .js-productCount").html("0"))
                }
                jsDPZ.app.order.getOrderForPowerData();
                var m = site.func.hasGroupOrderingCoupons() ? simplr.validation.mGetCodeMessage("byopcoupons") : simplr.validation.mGetCodeMessage("byopnocoupons"),
                    n = "#gO-" +
                        d.categoryParams.category;
                a(".js-groupOrderingCategory").hide();
                a(n).show();
                a(".gOProduct.byop .productDescription").html(m).addClass("noCoupons");
                site.func.hasGroupOrderingCoupons() ? (a(".js-discountText").show(), a(".gOProduct.byop .productDescription").removeClass("noCoupons")) : (a(".js-discountText").hide(), a(".gOProduct.byop .productDescription").addClass("noCoupons"));
                site.func.stackAttack(b);
                site.func.setupContentPopups(b);
                site.func.fixMissingImages(a("img", b));
                site.func.setDiscountDashboardNavButtons(d);
                f();
                !site.func.isGroupOrdering() && site.func.hasGroupOrderingCoupons() && e();
                site.func.isGroupOrdering() && !a("#discountDashboard").is(":visible") && (a.extend(d, jsDPZ.app.order.getOrderForPowerData().Order, {
                    Promotions: jsDPZ.app.order.getOrder().data.Details.Promotions
                }), site.func.showDiscountDashboard(d));
                a(".productInfo", b).on("hover", function() {
                    a("p", this).toggle()
                });
                a(".footerDisclaimer a").on("click", function(a) {
                    a.preventDefault();
                    site.trigger.onEvent({
                        group: "Group Order",
                        subGroup: "Full Menu",
                        title: "Group Order - Full Menu",
                        uri: "/group_order/full_menu"
                    });
                    window.location.hash = "/section/Food/category/AllEntrees/"
                });
                a(".js-newItem, .js-addItem").on("click", function(b) {
                    b.preventDefault();
                    var e = a(this).parent(),
                        b = e.attr("data-prodcat") == "pizza";
                    a(".js-productQty").removeClass("gOPulse");
                    if (!site.func.isGroupOrdering() && b) jsDPZ.app.order.getOrder().data.Tags = {
                        GroupOrdering: true,
                        usingGroupOrderingCoupons: false,
                        removeCoupon: false
                    };
                    var f = "/order/variant/new";
                    f += b ? site.catalogTools.orderVariantToURLParameterString(site.catalogTools.createOrderVariantFromVariantCode(a(e).attr("data-prodcode"),
                        a(e).attr("data-options"))) : site.catalogTools.orderVariantToURLParameterString(site.catalogTools.defaultVariantToOrderVariant(a(e).attr("data-prodcode")));
                    e.attr("data-dietarytag") == "glutenFree" && !site.seenGlutenFreeDisclaimer ? (site.func.overlayToggle(true, "glutenFreeDisclaimer", {}, {
                        url: f
                    }), site.seenGlutenFreeDisclaimer = true) : simplr.controller.mRouteAndExecute(f);
                    a(document).one("/order/validate/", function(b, f) {
                        for (var g = f.Order.Products, h = 0, j = g.length; h < j; h++) g[h].IsNew && (a(e).attr({
                            "data-id": g[h].ID,
                            "data-qty": g[h].Qty
                        }), a(".js-productQty", e.parent().parent()).show().addClass("gOPulse"), a(".js-productCount", e.parent().parent()).html(g[h].Qty), g[h].Qty > 0 && (a(".js-newItem", e).hide(), a(".js-removeItem, .js-addItem", e).show()));
                        !a("#discountDashboard").is(":visible") && site.func.isUsingGroupOrderingCoupons() && (a.extend(d, f.Order), site.func.showDiscountDashboard(d))
                    })
                });
                a(".js-removeItem").on("click", function(b) {
                    b.preventDefault();
                    a(".js-productQty").removeClass("gOPulse");
                    var d = a(this).parent(),
                        e =
                            a(d).attr("data-id"),
                        b = a(d).attr("data-qty") - 1;
                    a(d).attr("data-qty", b);
                    if (b > 0) {
                        var g = a.extend(true, {}, jsDPZ.app.order.getOrder().getItemData({
                            ID: e
                        }), {
                            Qty: b
                        }),
                            e = "/order/variant/" + e + "/update" + site.catalogTools.orderVariantToURLParameterString(g);
                        a(".js-productCount", d.parent().parent()).html(b)
                    } else e = "/order/variant/" + e + "/delete", a(".js-newItem", d).show(), a(".js-removeItem, .js-addItem", d).hide(), a(".js-productQty", d.parent().parent()).hide();
                    simplr.controller.mRouteAndExecute(e);
                    a(document).one("/order/validate/",
                        function() {
                            a(".js-productQty", d.parent().parent()).addClass("gOPulse");
                            f()
                        })
                });
                a(document).on("/order/validate/", function(b, e) {
                    f();
                    site.func.isGroupOrdering() && !a("#discountDashboard").is(":visible") && (a.extend(d, e.Order), site.func.showDiscountDashboard(d))
                });
                a(".js-buildYourOwnPizza", b).click(function(b) {
                    b.preventDefault();
                    if (!site.func.isGroupOrdering()) jsDPZ.app.order.getOrder().data.Tags = {
                        GroupOrdering: true,
                        isUsingGroupOrderingCoupons: false,
                        removeCoupon: false
                    };
                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: a(this).attr("href")
                    }))
                });
                a(".js-pizzaCalculator, .js-pizzaRecalculate").on("click", function(b) {
                    b.preventDefault();
                    a(".calculatorView").animate({
                        left: "+=490px"
                    });
                    site.trigger.onEvent({
                        group: "Group Order",
                        subGroup: "Calculator",
                        title: "Group Order - Calculator",
                        uri: "/group_order/calculator"
                    })
                });
                a("#NumberOfPeople, #SlicesPerPerson").on("input", function() {
                    this.value = this.value.replace(/[^0-9]/g, "");
                    var b = a("#NumberOfPeople").val(),
                        d = a("#SlicesPerPerson").val(),
                        e = 0,
                        e = Math.ceil((b || 0) * (d || 0) / 8);
                    a(".js-numberOfPizzas").html(e)
                });
                a(".js-pizzaCalcDone").on("click", function(b) {
                    b.preventDefault();
                    a(".js-numberOfPizzas").html() == "0" ? (a(".pizzaCalcDefaultState").show(), a(".pizzaCalcFinishedState").hide(), a(".calculatorView").animate({
                        left: "-=490px"
                    })) : (a(".pizzaCalcDefaultState").hide(), a(".pizzaCalcFinishedState").show(), a(".js-numberOfPeople").html(a("#NumberOfPeople").val()), a(".js-slicesPerPerson").html(a("#SlicesPerPerson").val()), a(".js-pizzasNeeded").html(a(".js-numberOfPizzas").html()), a(".calculatorView").animate({
                            left: "-=490px"
                        }),
                        site.trigger.onEvent({
                            group: "Group Order",
                            subGroup: "Calculator Results",
                            title: "Group Order - Calculator Results",
                            uri: "/group_order/calculator_results"
                        }))
                });
                a(".js-pizzaCalcHelp").on("click", function() {
                    site.trigger.onEvent({
                        group: "Group Order",
                        subGroup: "Calculator Help",
                        title: "Group Order - Calculator Help",
                        uri: "/group_order/calculator_help"
                    });
                    site.func.overlayToggle(true, "pizzaCalculatorHelp", {}, {})
                });
                a("#NumberOfPeople, #SlicesPerPerson").on("focus", function() {
                    a(this).select()
                })
            }
        }
    });
    simplr.view.mAddViews({
        hotDealsInColumn: {
            html: function() {
                if (site.oloTools.config.status ==
                    site.oloTools.config.statusCodes.OLOREADY) {
                    for (var a = jsDPZ.app.catalog.getOrderableQuickList(site.data.hotDeals.foodQuickListData, 4).data, d = [], e = 0, g = a.length; e < g; e++) {
                        var f = a[e],
                            j = "#/order/variant/new" + site.catalogTools.orderVariantToURLParameterString(f),
                            j = '<a href="' + j + '">' + f.Description + "</a>";
                        d.push(j)
                    }
                    a = [];
                    f = [];
                    e = 0;
                    for (g = site.data.hotDeals.couponCodes.length; e < g; e++) j = site.data.hotDeals.couponCodes[e], f.length < 2 ? simplr.util.mEmpty(jsDPZ.app.catalog.getCatalog().getCoupon(j)) || f.push(j) : e = g;
                    e =
                        0;
                    for (g = f.length; e < g; e++) {
                        var h = jsDPZ.app.catalog.getCatalog().getCoupon(f[e]).data.Name,
                            j = site.func.buildURL({
                                url: "#/order/coupons/new",
                                parameters: {
                                    code: f[e],
                                    qty: 1
                                }
                            }),
                            j = '<a href="#' + j + '">' + h + "</a>";
                        a.push(j)
                    }
                    f = "";
                    d = d.concat(a);
                    e = 0;
                    for (g = d.length; e < g; e++) f += d[e] + (e == g - 1 ? "" : "</li><li>");
                    return simplr.layout.mAssembleLayout({
                        component: "hotDealsInColumn",
                        tokens: {
                            items: f
                        }
                    })
                } else return ""
            },
            callback: function(b) {
                a(".genericList li:eq(0)", b).is(":empty") ? a(b).empty() : (a("li:last", b).addClass("last"), a("a",
                    b).click(function(b) {
                    b.preventDefault();
                    site.trigger.onEvent({
                        title: "Right Nav Entrees and Sides Hot Deals",
                        uri: "/rightnav/hot-deals",
                        group: "Right Nav",
                        subGroup: "Hot Deals"
                    });
                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: a(this).attr("href")
                    }))
                }))
            }
        }
    });
    simplr.view.mAddViews({
        locations_no_results: {
            html: function() {
                return simplr.layout.mAssembleLayout({
                    component: "locationNoResultsComponent",
                    tokens: {
                        yourLocation: jsDPZ.app.search.getStoreSearch().getSearchedAddress().getDisplayAddress().join(" ")
                    }
                })
            },
            callback: function() {}
        }
    });
    simplr.view.mAddViews({
        locations_results: {
            html: function() {
                var b = [],
                    d = [];
                a.each(jsDPZ.app.search.getStoreSearch().getStores(), function(e, g) {
                    var f = g.data.ServiceIsOpen.Delivery && g.data.IsDeliveryStore,
                        j = g.data.ServiceIsOpen.Carryout,
                        h = [];
                    simplr.util.mEmpty(g.data.ServiceHoursDescription.Carryout) || h.push({
                        serviceHours: g.data.ServiceHoursDescription.Carryout.split("\n").join("</li><li>")
                    });
                    var k = [];
                    simplr.util.mEmpty(g.data.ServiceHoursDescription.Delivery) || k.push({
                        serviceHours: g.data.ServiceHoursDescription.Delivery.split("\n").join("</li><li>")
                    });
                    simplr.util.mEmpty(g.data.HolidaysDescription) || k.push({
                        serviceHours: g.data.HolidaysDescription.split("\n").join("</li><li>")
                    });
                    var m = g.getAddress().getDisplayAddress();
                    simplr.util.mEmpty(g.data.LocationInfo) || m.push(g.data.LocationInfo);
                    m.push('<a class="phone js-showPhone" data-phone="' + site.format.phoneNumber({
                        number: g.data.Phone
                    }) + '" href="#/section/Food/category/AllEntrees"><b>Phone Number &raquo;</b></a>');
                    var n = true;
                    simplr.util.mEmpty(g.data.ServiceHoursDescription.Delivery) && simplr.util.mEmpty(g.data.ServiceHoursDescription.Carryout) && !g.isOnlineRightNow() && (n = false);
                    f = {
                        storeID: g.data.StoreID,
                        storeAddress: m.join("</li><li>"),
                        carryoutHours: {
                            component: "storeHourEntryComponent",
                            tokens: h
                        },
                        deliveryHours: {
                            component: "storeHourEntryComponent",
                            tokens: k
                        },
                        holidayHours: {
                            component: "storeHourEntryComponent",
                            tokens: []
                        },
                        dataShowStoreClosed: n,
                        dataOnline: g.isOnlineRightNow(),
                        dataOpen: g.isOpenRightNow(),
                        dataDelivery: f,
                        dataCarryout: j,
                        dataOrderable: (g.data.AllowCarryoutOrders ? "Carryout" : "") + (g.data.AllowDeliveryOrders ? " Delivery" : ""),
                        dataServices: "Carryout" + (g.data.IsDeliveryStore ? " Delivery" : ""),
                        dataSubstituted: g.data.Substituted
                    };
                    d.push(a.extend(true, {}, f, {
                        dataType: "Carryout"
                    }));
                    g.data.IsDeliveryStore && b.push(a.extend(true, {}, f, {
                        dataType: "Delivery"
                    }))
                });
                return simplr.layout.mAssembleLayout({
                    component: "locationResultsComponent",
                    tokens: {
                        yourLocation: jsDPZ.app.search.getStoreSearch().getSearchedAddress().getDisplayAddress().join(" "),
                        deliveryResults: {
                            component: "locationResultsEntryComponent",
                            tokens: b
                        },
                        carryoutResults: {
                            component: "locationResultsEntryComponent",
                            tokens: d
                        }
                    }
                })
            },
            callback: function(b, d) {
                function e() {
                    a(".js-showPhone", b).each(function() {
                        a(this).parent().html(a(this).data("phone"))
                    })
                }
                a(".section:eq(0) .js-orderCarryoutNow, .section:eq(0) .js-futureCarryoutOrder", b).remove();
                a(".section:eq(1) .js-orderDeliveryNow, .section:eq(1) .js-futureDeliveryOrder", b).remove();
                if (d.parameters.type == "Carryout") a(".section:eq(0)", b).remove();
                else {
                    var g = false;
                    a.each(jsDPZ.app.search.getStoreSearch().getStores(), function(a, b) {
                        if (b.data.IsDeliveryStore && !b.data.ServiceIsOpen.Delivery) return g =
                            true, false
                    });
                    var f = jsDPZ.app.search.getStoreSearch().data.Granularity;
                    g ? a(".js-deliveryUnavailable").show() : a(".section:eq(0) table").size() == 0 && (jsDPZ.util.empty(d.parameters.s) && f != "Exact" ? a(".js-refineResults").show() : a(".js-noDeliveryResults").show())
                }
                a(".js-store", b).each(function(b, d) {
                    a(".hours div", d).each(function() {
                        a("ul", this).size() == 0 && a(this).remove()
                    });
                    a(d).attr("data-open") == "true" ? a(".js-storeClosed", d).remove() : a(".js-carryoutClosed", d).remove();
                    a(d).attr("data-showclosed") == "false" &&
                        (a(".js-storeClosed", d).remove(), a(".js-carryoutClosed", d).remove());
                    a(d).attr("data-carryout") == "true" && a(".js-carryoutClosed", d).remove();
                    a(d).attr("data-services").indexOf("Delivery") == -1 && (a(".js-deliveryAvailable", d).remove(), a(".js-orderingDeliveryUnavailable", d).remove());
                    a(d).attr("data-services").indexOf("Carryout") == -1 && (a(".js-carryoutAvailable", d).remove(), a(".js-orderingCarryoutUnavailable", d).remove());
                    a(d).attr("data-online") == "true" ? (a(".js-orderingUnavailable", d).remove(), a(d).attr("data-orderable").indexOf("Carryout") != -1 && a(".js-orderingCarryoutUnavailable", d).remove(), a(d).attr("data-orderable").indexOf("Delivery") != -1 && a(".js-orderingDeliveryUnavailable", d).remove()) : (a(".js-orderingCarryoutUnavailable", d).remove(), a(".js-orderingDeliveryUnavailable", d).remove());
                    a(d).attr("data-online") != "true" ? a(".js-futureDeliveryOrder, .js-futureCarryoutOrder, .js-orderDeliveryNow, .js-orderCarryoutNow", d).remove() : a(d).attr("data-orderable").indexOf("Carryout") == -1 && a(d).attr("data-type") == "Carryout" ? a(".js-futureDeliveryOrder, .js-futureCarryoutOrder, .js-orderDeliveryNow, .js-orderCarryoutNow",
                        d).remove() : a(d).attr("data-orderable").indexOf("Delivery") == -1 && a(d).attr("data-type") == "Delivery" && a(".js-futureDeliveryOrder, .js-futureCarryoutOrder, .js-orderDeliveryNow, .js-orderCarryoutNow", d).remove();
                    a(d).attr("data-open") != "true" ? a(".js-orderDeliveryNow, .js-orderCarryoutNow", d).remove() : a(d).attr("data-type") == "Delivery" && a(d).attr("data-delivery") == "false" ? a(".js-orderDeliveryNow, .js-orderCarryoutNow", d).remove() : a(d).attr("data-type") == "Carryout" && a(d).attr("data-carryout") == "false" ?
                        a(".js-orderDeliveryNow, .js-orderCarryoutNow", d).remove() : a(".js-futureDeliveryOrder, .js-futureCarryoutOrder", d).remove();
                    a(".js-orderDeliveryNow, .js-futureDeliveryOrder, .js-orderCarryoutNow, .js-futureCarryoutOrder", d).on("click", function(b) {
                        b.preventDefault();
                        b = a(this).attr("data-type");
                        site.trigger.onEvent({
                            uri: "/locations/results/" + b.toLowerCase(),
                            title: "Location Results " + b,
                            group: b + " Locations",
                            subGroup: b + " Order"
                        });
                        simplr.controller.mRouteAndExecute(site.func.buildURL({
                            url: "#/customer/store/update",
                            parameters: {
                                StoreID: a(d).attr("data-storeID"),
                                Substituted: b == "Delivery" ? a(d).attr("data-substituted") : "false",
                                ServiceMethod: b
                            }
                        }));
                        site.func.tryRedirect("#/section/Food/category/AllEntrees/")
                    })
                });
                a(".js-showPhone", b).on("click", function(a) {
                    a.preventDefault();
                    site.trigger.onEvent({
                        title: "Location Results Show Phone Number",
                        group: "Location Results",
                        subGroup: "Show Phone Number"
                    });
                    site.locationTools.showReengagementCoupon(function() {
                        e()
                    })
                });
                jsDPZ.app.order.getOrder().data.HasSeenReengagement == true && e()
            }
        }
    });
    simplr.view.mAddViews({
        locations_search: {
            html: function() {
                for (var a = jsDPZ.app.customer.getCustomer().data, d = [], e = site.storage.load("dpz_customer_address") ? jsDPZ.dataConversion.JSONStringToObject(site.storage.load("dpz_customer_address")) : jsDPZ.obj.address().data, g = 0, f = a.Addresses.length; g < f; g++) {
                    var j = a.Addresses[g];
                    d.push({
                        id: g,
                        locationName: j.LocationName,
                        addressName: j.Name,
                        addressType: j.Type,
                        addressDescription: jsDPZ.obj.address(j).getDisplayAddress().join(" "),
                        street: j.Type === "Campus" ? j.AddressLine3 : j.Street,
                        addressLine2: j.AddressLine2 ? "#" + j.AddressLine2 : "",
                        city: j.City,
                        region: j.Region,
                        postalCode: j.PostalCode,
                        deliveryInstructions: j.DeliveryInstructions
                    })
                }
                g = site.func.customerLoggedIn() ? "locationsWelcomeBack" : site.func.customerSemiLoggedIn() ? "locationsSemiLoggedIn" : "locationsSignIn";
                a = site.func.customerLoggedIn() ? a.FirstName : "";
                return simplr.layout.mAssembleLayout({
                    component: "locationPageComponent",
                    tokens: {
                        profileMessage: {
                            component: g,
                            tokens: {
                                name: a
                            }
                        },
                        addressList: {
                            component: "customerAddressSaved",
                            tokens: d
                        },
                        addressFields: {
                            component: "customerAddressFields",
                            tokens: {
                                locationName: e.LocationName,
                                addressName: e.Name,
                                street: e.Street,
                                addressLine2: e.AddressLine2,
                                city: e.City,
                                postalCode: e.PostalCode,
                                deliveryInstructions: e.DeliveryInstructions
                            }
                        }
                    }
                })
            },
            callback: function(b, d) {
                function e() {
                    a(".deliveryInstructions", b).show()
                }

                function g(a, b) {
                    j.Session.Address = a;
                    j.Session.AddressSelection = b || "__OTHER_ADDRESS__";
                    site.sessionTools.save({
                        async: false
                    });
                    site.storage.save("ServiceType", k.settings.serviceType);
                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: "#/locate/?type=" + k.settings.serviceType,
                        parameters: site.locationTools.buildSessionParameters(a)
                    }))
                }
                var f = jsDPZ.app.order.getOrder().data,
                    j = jsDPZ.app.customer.getCustomer().data,
                    h = site.storage.load("dpz_customer_address") ? jsDPZ.dataConversion.JSONStringToObject(site.storage.load("dpz_customer_address")) : jsDPZ.obj.address().data,
                    k = {
                        el: a("form", b),
                        settings: {
                            serviceType: d.locations || site.storage.load("ServiceType") || "Delivery",
                            addressType: h.Type || "House",
                            saveToProfile: false
                        },
                        init: function() {
                            a(".js-deleteAddress", b).remove();
                            a(".js-region, .js-campusRegion", b).val(h.Region);
                            a('[value="' + this.settings.serviceType + '"]', b).prop("checked", true).parent().addClass("active").siblings().removeClass("active");
                            a('[value="' + this.settings.addressType + '"]', b).prop("checked", true).parent().addClass("active").siblings().removeClass("active");
                            this.el.focusClass().validate(this.validation);
                            this.el.renderFields();
                            switch (this.settings.addressType) {
                                case "House":
                                    a('label[for="Address_Line_2"] span', b).text(a.validator.labels["Suite/Apt#"]);
                                    break;
                                case "Apartment":
                                    a('label[for="Location_Name"] span', b).text(a.validator.labels.ApartmentName);
                                    a('label[for="Address_Line_2"] span', b).text(a.validator.labels["Suite/Apt#"]);
                                    break;
                                case "Business":
                                    a('label[for="Location_Name"] span', b).text(a.validator.labels.BusinessName);
                                    a('label[for="Address_Line_2"] span', b).text(a.validator.labels["Suite/Apt#"]);
                                    break;
                                case "Hotel":
                                    a('label[for="Location_Name"] span', b).text(a.validator.labels.HotelName);
                                    a('label[for="Address_Line_2"] span', b).text(a.validator.labels["Room#"]);
                                    break;
                                case "Dormitory":
                                    a('label[for="Location_Name"] span', b).text(a.validator.labels.DormitoryName);
                                    a('label[for="Address_Line_2"] span', b).text(a.validator.labels["Room#"]);
                                    break;
                                case "Other":
                                    a('label[for="Address_Line_2"] span', b).text(a.validator.labels["Unit#"])
                            }
                        },
                        validation: {
                            rules: {
                                Service_Type: {
                                    required: true
                                },
                                Address_Type: {
                                    required: true
                                },
                                Location_Name: {
                                    showOptional: function() {
                                        return k.settings.addressType === "Apartment" || k.settings.addressType === "Business" || k.settings.addressType === "Hotel" ||
                                            k.settings.addressType === "Dormitory"
                                    }
                                },
                                Street: {
                                    required: function() {
                                        return k.settings.addressType !== "Campus" && (k.settings.saveToProfile || k.settings.serviceType === "Delivery")
                                    },
                                    showOptional: function() {
                                        return k.settings.addressType !== "Campus"
                                    }
                                },
                                Address_Line_2: {
                                    required: function() {
                                        return k.settings.addressType === "Apartment" || k.settings.addressType === "Hotel" || k.settings.addressType === "Dormitory"
                                    },
                                    showOptional: function() {
                                        return k.settings.addressType === "House" || k.settings.addressType === "Business" || k.settings.addressType ===
                                            "Other"
                                    }
                                },
                                City: {
                                    required: function() {
                                        return k.settings.addressType !== "Campus" && (k.settings.saveToProfile || a(".js-postalCode", b).val() === "" || a(".js-city", b).val() !== "" && a(".js-region", b).val() !== "")
                                    },
                                    showOptional: function() {
                                        return k.settings.addressType !== "Campus"
                                    }
                                },
                                Region: {
                                    required: function() {
                                        return k.settings.addressType !== "Campus" && (k.settings.saveToProfile || a(".js-postalCode", b).val() === "" || a(".js-city", b).val() !== "" && a(".js-region", b).val() !== "")
                                    },
                                    showOptional: function() {
                                        return k.settings.addressType !==
                                            "Campus"
                                    }
                                },
                                Postal_Code: {
                                    postalcode: true,
                                    required: function() {
                                        return k.settings.addressType !== "Campus" && (k.settings.saveToProfile || a(".js-postalCode", b).val() !== "" || a(".js-city", b).val() === "" && a(".js-region", b).val() === "")
                                    },
                                    showOptional: function() {
                                        return k.settings.addressType !== "Campus"
                                    }
                                },
                                Region_Campus: {
                                    required: function() {
                                        return k.settings.addressType === "Campus"
                                    }
                                },
                                Campus: {
                                    required: function() {
                                        return k.settings.addressType === "Campus"
                                    }
                                },
                                Dorm: {
                                    required: function() {
                                        return k.settings.addressType === "Campus"
                                    }
                                },
                                Room_Number: {
                                    showOptional: function() {
                                        return k.settings.addressType === "Campus"
                                    }
                                },
                                Save_Address: {
                                    showOptional: function() {
                                        return site.func.customerLoggedIn()
                                    }
                                },
                                Address_Name: {
                                    showOptional: function() {
                                        return k.settings.saveToProfile
                                    },
                                    uniqueAddress: true
                                },
                                Delivery_Instructions: {
                                    showOptional: function() {
                                        return k.settings.saveToProfile && k.settings.serviceType === "Delivery"
                                    }
                                },
                                Is_Default: {
                                    showOptional: function() {
                                        return k.settings.saveToProfile
                                    }
                                }
                            },
                            submitHandler: function(b) {
                                if (a(".js-addressSelection").is(":checked")) {
                                    var b =
                                        a(".js-addressSelection:checked").val(),
                                        d = site.customerTools.getAddressByName(b);
                                    g(d, b)
                                } else {
                                    var e = simplr.form.mGetValues(b),
                                        f = {
                                            LocationName: e.Location_Name,
                                            Street: e.Street,
                                            AddressLine2: e.Address_Line_2,
                                            City: e.City,
                                            Region: e.Region,
                                            PostalCode: e.Postal_Code,
                                            DeliveryInstructions: e.Delivery_Instructions,
                                            Type: e.Address_Type,
                                            Name: e.Address_Name,
                                            SaveToProfile: e.Save_Address,
                                            BuildingID: e.Dorm,
                                            IsDefault: e.Is_Default === "" ? true : false
                                        };
                                    if (f.IsDefault)
                                        for (b = 0; b < j.Addresses.length; b++) j.Addresses[b].IsDefault =
                                            false;
                                    f.Type !== "Campus" ? g(f) : site.locationTools.performStoreSearch({
                                        data: site.locationTools.buildSessionParameters(f),
                                        success: function() {
                                            var b = jsDPZ.app.search.getStoreSearch().getSearchedAddress().data;
                                            a.extend(f, {
                                                Street: b.Street,
                                                AddressLine2: e.Room_Number,
                                                AddressLine3: b.AddressLine3,
                                                LocationName: b.AddressLine4,
                                                City: b.City,
                                                Region: b.Region,
                                                PostalCode: b.PostalCode,
                                                CampusID: e.Campus,
                                                BuildingID: e.Dorm,
                                                IsDefault: e.Is_Default
                                            });
                                            g(f)
                                        }
                                    })
                                }
                            }
                        }
                    };
                k.init();
                if (killConfig.isActive("shoprunner")) {
                    site.func.refreshShoprunner();
                    var m = 0;
                    if (d.shoprunner) var n = setInterval(function() {
                        if (simplr.util.mEmpty(simplr.cookie.mGet({
                            name: "sr_token"
                        }))) try {
                            sr_$.learn("banner")
                        } catch (b) {}(a("#sr_global").length > 0 || m >= 50) && clearInterval(n);
                        m += 1
                    }, 100)
                }
                if (simplr.util.mGetUrlParameter("route") && typeof f.Partners.DOMINOS === "undefined" && !jsDPZ.app.customer.getCustomer().data.Session.HasSeenRoutingMessage) jsDPZ.app.customer.getCustomer().data.Session.HasSeenRoutingMessage = true, site.sessionTools.save({
                    async: false
                }), site.func.overlayToggle(true,
                    "codeOverlay", {}, {
                        code: f.Details.Coupons.length ? "eRoutingCouponMessage" : "eRoutingMessage",
                        success: true
                    });
                a(".js-changeServiceType label.active", b).is(".Delivery") && e();
                a(".js-login", b).on("click", function(a) {
                    a.preventDefault();
                    site.trigger.onEvent({
                        group: "Account",
                        subGroup: "Sign In",
                        title: "Account - Sign In",
                        uri: "/account/signin"
                    });
                    site.func.showLoginPopup()
                });
                a(".js-changeServiceType label", b).on("click", function(d) {
                    d.preventDefault();
                    d = a("input[type='radio']", this);
                    d.prop("checked", true).parent().addClass("active").siblings().removeClass("active");
                    k.settings.serviceType = d.val();
                    k.el.renderFields();
                    a(this).is(".Delivery") ? e() : a(".deliveryInstructions", b).hide()
                });
                a(".js-changeAddressType label", b).on("click", function(d) {
                    d.preventDefault();
                    d = a("input[type='radio']", this);
                    d.prop("checked", true).parent().addClass("active").siblings().removeClass("active");
                    k.settings.addressType = d.val();
                    k.el.renderFields();
                    switch (k.settings.addressType) {
                        case "Apartment":
                            a('label[for="Location_Name"] span', b).text(a.validator.labels.ApartmentName);
                            a('label[for="Address_Line_2"] span',
                                b).text(a.validator.labels["Suite/Apt#"]);
                            break;
                        case "Business":
                            a('label[for="Location_Name"] span', b).text(a.validator.labels.BusinessName);
                            a('label[for="Address_Line_2"] span', b).text(a.validator.labels["Suite/Apt#"]);
                            break;
                        case "Hotel":
                            a('label[for="Location_Name"] span', b).text(a.validator.labels.HotelName);
                            a('label[for="Address_Line_2"] span', b).text(a.validator.labels["Room#"]);
                            break;
                        case "Dormitory":
                            a('label[for="Location_Name"] span', b).text(a.validator.labels.DormitoryName);
                            a('label[for="Address_Line_2"] span',
                                b).text(a.validator.labels["Room#"]);
                            break;
                        case "Other":
                            a('label[for="Address_Line_2"] span', b).text(a.validator.labels["Unit#"]);
                            break;
                        case "House":
                            a('label[for="Address_Line_2"] span', b).text(a.validator.labels["Suite/Apt#"])
                    }
                });
                a(".js-editAddress", b).click(function(b) {
                    b.preventDefault();
                    site.trigger.onEvent({
                        group: "Account",
                        subGroup: "Edit Location",
                        title: "Account - Edit Location",
                        uri: "/account/editlocation"
                    });
                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: "#/customer/location/" + a(this).data("id") + "/view"
                    }))
                });
                a(".js-saveToProfile", b).on("click", function() {
                    k.settings.saveToProfile = a(this).is(":checked");
                    k.el.renderFields();
                    if (k.settings.saveToProfile) site.trigger.onEvent({
                        group: "Location Main",
                        subGroup: "Save New Address Yes",
                        title: "Location - Save New Address Yes",
                        uri: "/location/savenewaddressyes"
                    });
                    else site.trigger.onEvent({
                        group: "Location Main",
                        subGroup: "Save New Address No",
                        title: "Location - Save New Address No",
                        uri: "/location/savenewaddressno"
                    })
                }).prop("checked", k.settings.saveToProfile);
                a(".js-showOtherAddress", b).on("click", function() {
                    site.trigger.onEvent({
                        group: "Location Main",
                        subGroup: "Choose Other Address",
                        title: "Location - Choose Other Address",
                        uri: "/location/chooseotheraddress"
                    });
                    a(".js-otherAddress", b).slideDown("slow");
                    a(".js-addressSelection", b).prop("checked", false)
                });
                a(".js-addressSelection", b).on("change", function() {
                    site.trigger.onEvent({
                        group: "Location Main",
                        subGroup: "Choose Saved Location",
                        title: "Location - Choose Saved Location",
                        uri: "/location/choosesavedlocation"
                    });
                    a(".js-otherAddress", b).hide()
                });
                a(".primary", b).not(":first").remove();
                (site.func.customerLoggedIn() || site.func.customerSemiLoggedIn()) && j.Session.AddressSelection && j.Session.AddressSelection !== "__OTHER_ADDRESS__" ? (f = a(".js-addressSelection", b).eq(0), j.Session.AddressSelection && (f = a(".js-addressSelection[value='" + j.Session.AddressSelection + "']", b)), f.prop("checked", true)) : (site.func.customerLoggedIn() || site.func.customerSemiLoggedIn()) && j.Session.AddressSelection === "" && j.Addresses.length > 0 ? (j.Session.AddressSelection =
                    "", a(".js-addressSelection", b).eq(0).prop("checked", true)) : (a(".js-showOtherAddress", b).prop("checked", true), a(".js-otherAddress", b).show(), a(".js-addressSelection", b).prop("checked", false));
                a(".js-addressSelection", b).size() === 0 && a(".entryList", b).remove();
                var o = a(".js-campusRegion", b),
                    C = a(".js-campusCampus", b),
                    l = a(".js-campusDorm", b);
                jsDPZ.ajax.regions({
                    success: function(a) {
                        o.append(site.func.buildOptionList({
                            listValues: site.locationTools.getRegionListData(a)
                        }))
                    },
                    error: function() {
                        site.func.powerCommunicationError()
                    }
                });
                o.on("change", function() {
                    a("option", C).not(":first").remove();
                    jsDPZ.ajax.sitesByRegion({
                        region: a(this).val(),
                        success: function(a) {
                            C.append(site.func.buildOptionList({
                                listValues: site.locationTools.getCampusListData(a)
                            })).change()
                        },
                        error: function() {
                            site.func.powerCommunicationError()
                        }
                    })
                });
                C.on("change", function() {
                    a("option", l).not(":first").remove();
                    jsDPZ.ajax.buildingsBySite({
                        site: a(this).val(),
                        success: function(a) {
                            l.append(site.func.buildOptionList({
                                listValues: site.locationTools.getBuildingListData(a)
                            })).change()
                        },
                        error: function() {
                            site.func.powerCommunicationError()
                        }
                    })
                });
                if (h.Type === "Campus") var w = setInterval(function() {
                    a("option", o).size() > 1 && (clearInterval(w), o.val(h.Region).change());
                    var b = setInterval(function() {
                        a("option", C).size() > 1 && (clearInterval(b), C.val(h.CampusID).change());
                        var d = setInterval(function() {
                            a("option", l).size() > 1 && (clearInterval(d), l.val(h.BuildingID).change())
                        }, 100)
                    }, 100)
                }, 100);
                a(".js-isCampusSuggestPopup", b).click(function(b) {
                    b.preventDefault();
                    site.trigger.onEvent({
                        uri: location.pathname + (location.hash != "" ? location.hash : "") + "campus/suggest",
                        title: "Location Search Suggest Campus",
                        group: "Location Type Suggest",
                        subGroup: "Campus Suggest"
                    });
                    window.open(a(this).attr("href"), "", "width=900,height=400,resizable=no,scrollbars=no,toolbar=no,location=no,menubar=no")
                })
            }
        }
    });
    simplr.view.mAddViews({
        main_sub_navigation: {
            html: function(a) {
                return a.main == site.data.navigation.states.main.ENTREES ? simplr.layout.mAssembleLayout({
                    component: "navigationEntrees",
                    tokens: {}
                }) : a.main == site.data.navigation.states.main.SIDESANDDESSERTS ?
                    simplr.layout.mAssembleLayout({
                        component: "navigationSidesAndDesserts",
                        tokens: {}
                    }) : a.main == site.data.navigation.states.main.DRINKS ? simplr.layout.mAssembleLayout({
                        component: "navigationDrinks",
                        tokens: {}
                    }) : a.main == site.data.navigation.states.main.COUPONS ? simplr.layout.mAssembleLayout({
                        component: "navigationCoupons",
                        tokens: {}
                    }) : a.main == site.data.navigation.states.main.GROUPORDERING ? simplr.layout.mAssembleLayout({
                        component: "navigationGroupOrdering",
                        tokens: {}
                    }) : ""
            },
            callback: function(b, d) {
                site.func.isGroupOrderingAvailable() ?
                    a(".navigation-groupOrdering").parent().show() : a(".navigation-groupOrdering").parent().hide();
                var e = d.main == site.data.navigation.states.main.COUPONS ? "Coupons" : "Food";
                a("li", b).filter("[id*='csn-']").each(function() {
                    var b = a(this).attr("id").split("-")[1];
                    d.main != "groupOrdering" && !site.catalogTools.categoryExists({
                        section: e,
                        category: b
                    }) && (a(this).next(".divider").remove(), a(this).remove())
                });
                a("#js-mainSiteNavigation").find("a.navigation-coupons").attr("href", a(".js-couponCategories a", b).first().attr("href"));
                var g = !jsDPZ.util.empty(jsDPZ.app.store.getStore().data.StoreID);
                window.location.hash.indexOf("#/locations/") != -1 && !g ? (a("#js-mainSiteNavigation").find("a").not(".navigation-home").addClass("hidden"), a("#js-mainSiteNavigation a").removeClass("active").filter(".navigation-home").addClass("active")) : (a("#js-mainSiteNavigation").find("a").not(".navigation-home").removeClass("hidden"), a("#js-mainSiteNavigation a").removeClass("active").filter(".navigation-" + d.main).addClass("active"));
                a("a.navigation-" +
                    d.sub, b).addClass("active");
                a(".js-buildYourOwnPizza", b).click(function(b) {
                    b.preventDefault();
                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: a(this).attr("href")
                    }))
                });
                a("#js-subNavigationPage a").click(function() {
                    var b = a(".mainNavigation a.active").text();
                    site.trigger.onEvent({
                        title: b + " Sub Nav " + a(this).text(),
                        group: b,
                        subGroup: "Sub Navigation"
                    })
                })
            }
        }
    });
    simplr.view.mAddViews({
        couponExclusivityOverlay: {
            html: function() {
                var a = "couponExclusivityOverlay";
                site.func.isGroupOrdering() && !site.func.isUsingGroupOrderingCoupons() &&
                    (a = "couponExclusivityOverlayGroupOrdering");
                return simplr.layout.mAssembleLayout({
                    component: "genericOverlay",
                    tokens: {
                        overlayContent: {
                            component: a,
                            tokens: {}
                        }
                    }
                })
            },
            callback: function(b, d) {
                site.func.setupLayerCloseEvents({
                    layerSelector: b
                });
                site.func.isGroupOrdering() ? a(".js-closeButton").hide() : a(".js-closeButton").show();
                a(".js-continue", b).on("click", function(b) {
                    b.preventDefault();
                    site.func.overlayToggle(false);
                    site.func.addCoupon(site.catalogTools.getOrderCouponFromURLParameters(d));
                    if (site.func.isGroupOrdering()) jsDPZ.app.order.getOrder().data.Tags.GroupOrdering =
                        false, jsDPZ.app.order.getOrder().data.Tags.usingGroupOrderingCoupons = false, a("#js-discountDashboard").hide(), a(".pageLeftColumn").removeClass("discountDashboard")
                });
                a(".js-continue-go", b).on("click", function(b) {
                    b.preventDefault();
                    site.func.overlayToggle(false);
                    a("#js-discountDashboard").show();
                    site.func.addCoupon(site.catalogTools.getOrderCouponFromURLParameters(d))
                });
                a(".js-closeButton-go", b).on("click", function(b) {
                    b.preventDefault();
                    site.func.overlayToggle(false);
                    jsDPZ.app.order.getOrder().data.Tags.GroupOrdering =
                        false;
                    jsDPZ.app.order.getOrder().data.Tags.usingGroupOrderingCoupons = false;
                    a("#js-discountDashboard").hide();
                    a(".pageLeftColumn").removeClass("discountDashboard")
                });
                site.func.setupLayerCloseEvents({
                    closeSelector: ".js-closeButton",
                    layerSelector: b
                })
            }
        },
        couponCodeWithRemoveOverlay: {
            html: function(b) {
                var b = a.extend({
                    success: false,
                    code: "",
                    label: ""
                }, b),
                    d = a.type(b.label) === "array" ? b.label : [b.label];
                return simplr.layout.mAssembleLayout({
                    component: "genericOverlay",
                    tokens: {
                        overlayContent: {
                            component: "codeOverlay",
                            tokens: {
                                codeClass: b.success ? "informationText" : "errorText",
                                message: site.func.tokenizeCodeMessage.apply(this, [b.code].concat(d))
                            }
                        }
                    }
                })
            },
            callback: function(b, d) {
                site.trigger.onEvent({
                    uri: "/error/" + d.code,
                    title: "Error or Alert " + d.code,
                    group: "Error",
                    subGroup: d.code,
                    eventType: "error"
                });
                a(".js-closeButton", b).on("click", function(b) {
                    b.preventDefault();
                    d.code === "eCouponServiceMethodChanged" ? a("#Service_Method_Carryout").click() : simplr.controller.mRouteAndExecute("/order/coupons/" + d.CouponID + "/delete")
                });
                a(".js-continueButton",
                    b).on("click", function(a) {
                    a.preventDefault();
                    simplr.controller.mRouteAndExecute("/order/coupons/" + d.CouponID + "/delete")
                });
                site.func.setupLayerCloseEvents({
                    closeSelector: ".js-closeButton, .js-continueButton",
                    layerSelector: b
                })
            }
        },
        serviceMethodCarryoutWarningOverlay: {
            html: function() {
                var a = jsDPZ.app.store.getStore(),
                    d = jsDPZ.obj.dateTime("2001-01-01 " + a.getServiceMethodBusinessDayTimes({
                        serviceMethod: "Carryout"
                    }).CloseTime),
                    a = jsDPZ.obj.dateTime("2001-01-01 " + a.getServiceMethodBusinessDayTimes({
                        serviceMethod: "Delivery"
                    }).CloseTime);
                return simplr.layout.mAssembleLayout({
                    component: "genericOverlay",
                    tokens: {
                        overlayContent: {
                            component: "serviceMethodCarryoutWarningOverlay",
                            tokens: {
                                carryoutCloseTime: d.getDisplayFormat("_h:mma_p"),
                                deliveryCloseTime: a.getDisplayFormat("_h:mma_p")
                            }
                        }
                    }
                })
            },
            callback: function(a) {
                site.func.setupLayerCloseEvents({
                    layerSelector: a
                })
            }
        }
    });
    simplr.view.mAddViews({
        order_column: {
            html: function() {
                if (site.oloTools.config.status == site.oloTools.config.statusCodes.OLOREADY) {
                    var b = jsDPZ.app.catalog.getCatalog(),
                        d = jsDPZ.app.order.getOrder().data,
                        e = {
                            viewItemizedVariants: {
                                component: "itemizedVariants",
                                tokens: []
                            },
                            viewItemizedCoupons: {
                                component: "itemizedCoupons",
                                tokens: []
                            },
                            promoMessages: {
                                component: "messageBox",
                                tokens: []
                            },
                            orderFoodBeverage: jsDPZ.obj.price(d.Details.Amounts.FoodAndBeverage).getDisplayValue(),
                            orderDominosDollars: d.Details.Amounts.DominosDollars > 0 ? "&minus; " + jsDPZ.obj.price(d.Details.Amounts.DominosDollars).getDisplayValue() : "",
                            orderSavings: jsDPZ.obj.price(d.Details.Amounts.Savings).getUsableValue() > jsDPZ.obj.price(site.data.uiConfig.ADJUSTMENT_THRESHOLD).getUsableValue() ? jsDPZ.obj.price(d.Details.Amounts.Savings).getDisplayValue() : "",
                            orderSurcharge: d.Details.Amounts.Surcharge > 0 ? jsDPZ.obj.price(d.Details.Amounts.Surcharge).getDisplayValue() : "",
                            orderDeliveryFee: d.Details.Amounts.DeliveryFee > 0 ? jsDPZ.obj.price(d.Details.Amounts.DeliveryFee).getDisplayValue() : "",
                            orderTaxes: d.Details.Amounts.Tax > 0 ? jsDPZ.obj.price(d.Details.Amounts.Tax).getDisplayValue() : "",
                            orderBottle: d.Details.Amounts.Bottle > 0 ? jsDPZ.obj.price(d.Details.Amounts.Bottle).getDisplayValue() : "",
                            orderTotal: jsDPZ.obj.price(d.Details.Amounts.Customer).getDisplayValue()
                        };
                    if (d.Details.Promotions && d.Details.Promotions.Redeemable)
                        for (var g = 0, f = d.Details.Promotions.Redeemable.length; g < f; g++) {
                            var j = site.data.messages[d.Details.Promotions.Redeemable[g].Code];
                            j && j.title && j.message && e.promoMessages.tokens.push({
                                title: j.title,
                                description: j.message
                            })
                        }
                    e.viewItemizedVariants.tokens = site.catalogTools.getVariantToppingSideViewObj(d.Details.Variants);
                    for (g = 0, f = e.viewItemizedVariants.tokens.length; g < f; g++) e.viewItemizedVariants.tokens[g].isNew = e.viewItemizedVariants.tokens[g].isNew ==
                        true ? "new" : "";
                    j = jsDPZ.app.order.getOrder().data.Details.Variants;
                    for (g = 0, f = j.length; g < f; g++) j[g].isNew = false;
                    a.each(d.Details.Coupons, function(a, d) {
                        var f = b.getCoupon(d.Code);
                        jsDPZ.util.empty(f) || e.viewItemizedCoupons.tokens.push({
                            id: d.ID,
                            price: d.Price != 0 ? jsDPZ.obj.price(d.Price).getDisplayValue() : "",
                            code: d.Code,
                            name: f.data.Name,
                            fulfilledClass: !d.Fulfilled && !f.data.Tags.OverrideAmount ? "unfullfilled" : "",
                            hiddenClass: d.Code === "SJRD" ? "none" : ""
                        })
                    });
                    return simplr.layout.mAssembleLayout({
                        component: "orderInColumn",
                        tokens: e
                    })
                } else return ""
            },
            callback: function(b) {
                var d = jsDPZ.app.order.getOrder().data;
                site.data.ABData.priceMyOrder.hasOwnProperty("inTest") && site.data.ABData.priceMyOrder.inTest && a(".js-priceOrder").remove();
                location.hash.indexOf("#/locations/") >= 0 ? a(".buttonCheckout", b).remove() : a(".buttonCheckout", b).show();
                d.Details.Variants.length == 0 ? a(".buttonCheckout", b).remove() : a(".js-emptyMessage", b).remove();
                d.Details.Coupons.length == 0 ? a(".js-couponMessaging", b).remove() : a(".js-emptyMessage", b).remove();
                d.Details.Coupons.length == 0 && a(".js-couponMessaging", b).remove();
                d.Details.Amounts.DeliveryFee == 0 && d.Details.ServiceMethod == "Delivery" ? (a(".js-deliveryCost", b).remove(), typeof jsDPZ.app.order.getOrder().data.Partners.ShopRunner !== "undefined" ? a(".js-deliveryLabel", b).remove() : a("#sr_shippingSummaryDiv", b).remove()) : d.Details.Amounts.DeliveryFee > 0 && d.Details.ServiceMethod == "Delivery" ? a(".js-deliveryFree, #sr_shippingSummaryDiv", b).remove() : a(".js-deliveryFree", b).parent().empty();
                a(".js-total:empty",
                    b).parent().remove();
                a(".orderSummaryContent :empty", b).not("img, input, select, .clr").remove();
                a(".itemList", b).each(function() {
                    a(this).children().size() == 0 && a(this).remove()
                });
                a(".js-qtyValue", b).each(function() {
                    a("select", a(this).parent()).append(site.func.buildQtyOptionList(a(this).val())).change(function() {
                        var b = a(this).attr("name").split("|")[0],
                            d = a.extend(true, {}, jsDPZ.app.order.getOrder().getItemData({
                                ID: b
                            }), {
                                Qty: a(this).val()
                            }),
                            d = "/order/variant/" + b + "/update" + site.catalogTools.orderVariantToURLParameterString(d);
                        a(document).trigger("/order/change/", {
                            action: "update",
                            id: b,
                            qty: a(this).val()
                        });
                        simplr.controller.mRouteAndExecute(d)
                    })
                }).remove();
                a(".miniLineItem h3 a", b).click(function(b) {
                    b.preventDefault();
                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: a(this).attr("href")
                    }))
                });
                parseFloat(jsDPZ.app.order.getOrder().data.Details.Amounts.FoodAndBeverage) > 0 && (a(".orderTotals", b).show(), a(".js-priceOrder", b).remove());
                a(".js-priceOrder", b).click(function(b) {
                    b.preventDefault();
                    site.trigger.onEvent({
                        title: "Right Nav Price Order",
                        uri: "/rightnav/priceorder",
                        group: "Right Nav",
                        subGroup: "Price Order"
                    });
                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: a(this).attr("href")
                    }))
                });
                a(".js-incompleteCoupon", b).click(function() {
                    site.trigger.onEvent({
                        title: "Right Nav Incomplete Coupon",
                        uri: "/rightnav/incompleteoupon",
                        group: "Right Nav",
                        subGroup: "Incomplete Coupon"
                    })
                });
                a(".js-removeVariant, .js-removeCoupon", b).click(function(b) {
                    b.preventDefault();
                    b.stopPropagation();
                    var b = "Variant",
                        d = "/rightnav/removevariant";
                    a(this).is(".js-removeCoupon") &&
                        (b = "Coupon", d = "/rightnav/removecoupon");
                    site.trigger.onEvent({
                        title: "Right Nav Remove " + b,
                        uri: d,
                        group: "Right Nav",
                        subGroup: "Remove " + b
                    });
                    if (site.func.isUsingGroupOrderingCoupons() && b == "Coupon") jsDPZ.app.order.getOrder().data.Tags.removeCoupon = true;
                    a("body").trigger("/order/change/", {
                        action: "remove",
                        url: a(this).attr("href")
                    });
                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: a(this).attr("href")
                    }))
                });
                a(".unfullfilled, .js-fulfillCoupon", b).click(function(b) {
                    b.preventDefault();
                    site.func.isGroupOrdering() ?
                        window.location.hash = "#/section/GroupOrdering/category/Pizza/" : simplr.controller.mRouteAndExecute(site.func.buildURL({
                            url: "#/fulfiller/",
                            parameters: {
                                code: a(this).attr("data-code"),
                                id: a(this).attr("data-id")
                            }
                        }))
                });
                a(".new", b).animateColor({
                    begin: "#FF9999",
                    end: "#E5EDF3",
                    duration: 2E3
                }, function() {
                    a(".new", b).removeClass("new")
                })
            }
        }
    });
    simplr.view.mAddViews({
        changeOrderTimingOverlay: {
            html: function(b) {
                var d = "",
                    e = jsDPZ.app.store.getStore(),
                    g = site.locationTools.buildSearchParameters(site.locationTools.addressToFieldData(jsDPZ.app.order.getOrder().data.Customer.Address));
                jsDPZ.util.empty(b.code) || (d = {
                    component: "errorNotification",
                    tokens: {
                        text: simplr.validation.mGetCodeMessage(b.code)
                    }
                });
                var f = [];
                jsDPZ.util.empty(e.data.ServiceHoursDescription) || a.each(e.data.ServiceHoursDescription, function(a, b) {
                    f.push({
                        serviceType: a,
                        serviceHours: b.split("\n").join("</li><li>")
                    })
                });
                return simplr.layout.mAssembleLayout({
                    component: "genericOverlay",
                    tokens: {
                        overlayContent: {
                            component: "changeOrderTimingOverlay",
                            tokens: {
                                notifications: d,
                                storeHours: {
                                    component: "storeHourFureOrderComponent",
                                    tokens: f
                                },
                                storeResultsURL: "#" + site.func.buildURL({
                                    url: "#/locations/results/?type=all",
                                    parameters: g
                                })
                            }
                        }
                    }
                })
            },
            callback: function(b) {
                function d(d) {
                    for (var e = site.catalogTools.getStoreTimeArr({
                        date: d,
                        minTime: "00:00",
                        maxTime: "23:59"
                    }), d = [], f = 0, g = e.length; f < g; f++) d.push({
                        value: e[f].getDisplayFormat("HH:mm:00"),
                        label: e[f].getDisplayFormat("_h:mm a_p")
                    });
                    e = a("#Future_Time", b);
                    a("option", e).not(":first").remove();
                    a("option:first", e).val("");
                    e.append(site.func.buildOptionList({
                        listValues: d,
                        defaultValue: ""
                    }))
                }
                var e = jsDPZ.app.order.getOrder(),
                    g = jsDPZ.app.store.getStore();
                a(".js-closeButton", b).remove();
                g.isOpenRightNow() ? (a(".js-storeClosed", b).remove(), a.inArray(e.data.Details.ServiceMethod, g.getAvailableServiceMethods({
                    dtString: g.data.StoreAsOfTime,
                    deliveryAvailable: jsDPZ.app.customer.getCustomer().data.Session.DeliveryAvailable
                })) != -1 ? a(".js-storeOpen", b).remove() : a(".js-orderNow", b).remove()) : a(".js-orderNow, .js-storeOpen", b).remove();
                var f = simplr.util.mEmpty(e.data.Details.OrderDateTime),
                    j = f ? jsDPZ.obj.dateTime(g.data.StoreAsOfTime) :
                        jsDPZ.obj.dateTime(e.data.Details.OrderDateTime),
                    h = j.getDayOfWeek(),
                    k = [],
                    g = g.data.ServiceHours.Carryout[h];
                if (e.data.Details.ServiceMethod != "Delivery" && parseInt(j.getDisplayFormat("HHmm"), 10) > parseInt(g[1] ? parseInt(g[1].CloseTime.replace(":", ""), 10) : parseInt(g[0].CloseTime.replace(":", ""), 10))) k.push(j.getDisplayFormat("YYYY-MM-DD")), j = (new Date(j.data.getTime() + 864E5)).getDateTimeObject();
                e = j.getDisplayFormat("YYYY-MM-DD");
                d(e);
                a(".date_input", b).val(e);
                f || a("#Future_Time", b).val(j.getDisplayFormat("HH:mm:00"));
                a.extend(DateInput.DEFAULT_OPTS, {
                    stringToDate: function(a) {
                        return (a = a.match(/^(\d{4,4})-(\d{2,2})-(\d{2,2})$/)) ? new Date(a[1], a[2] - 1, a[3]) : null
                    },
                    dateToString: function(a) {
                        var b = (a.getMonth() + 1).toString(),
                            d = a.getDate().toString();
                        b.length == 1 && (b = "0" + b);
                        d.length == 1 && (d = "0" + d);
                        return a.getFullYear() + "-" + b + "-" + d
                    }
                });
                a(".date_input", b).date_input({
                    future_date_only: true,
                    unorderable_dates: k
                }, function() {
                    d(a(this.input).val())
                });
                a(".storeLink", b).not(":last").click(function() {
                    site.func.overlayToggle(false)
                });
                a("a.js-viewRestrictions", b).toggle(function() {
                    a("#orderTimingRestrictions", b).show();
                    a("span", this).hide().eq(1).show()
                }, function() {
                    a("#orderTimingRestrictions", b).hide();
                    a("span", this).hide().eq(0).show()
                });
                site.func.formFocus();
                a("form", b).validate({
                    rules: {
                        Future_Date: {
                            required: true
                        },
                        Future_Time: {
                            required: true
                        }
                    },
                    submitHandler: function(a) {
                        site.func.overlayToggle(false);
                        simplr.controller.mRouteAndExecute(site.func.buildURL({
                            url: a.action,
                            parameters: {
                                date: a.Future_Date.value,
                                time: a.Future_Time.value
                            }
                        }))
                    },
                    errorPlacement: function(a, b) {
                        a.appendTo(b.closest(".formEntry"))
                    }
                });
                a("a.js-orderNow", b).click(function(b) {
                    b.preventDefault();
                    site.func.overlayToggle(false);
                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: a(this).attr("href")
                    }))
                })
            }
        }
    });
    simplr.view.mAddViews({
        profile_column: {
            html: function() {
                var b = jsDPZ.app.store.getStore(),
                    d = jsDPZ.app.order.getOrder(),
                    e = site.locationTools.buildSearchParameters(site.locationTools.addressToFieldData(d.data.Customer.Address)),
                    g = !simplr.util.mEmpty(d.data.Details.OrderDateTime) ?
                        d.data.Details.OrderDateTime : b.data.StoreAsOfTime,
                    g = b.getAvailableServiceMethods({
                        dtString: g,
                        deliveryAvailable: jsDPZ.app.customer.getCustomer().getSessionData().DeliveryAvailable
                    }),
                    f = [];
                simplr.util.mEmpty(b.data.StoreID) || (f = b.getAddress().getDisplayAddress(), simplr.util.mEmpty(b.data.LocationInfo) || f.push(b.data.LocationInfo), f.push('<a class="phone" data-phone="' + site.format.phoneNumber({
                    number: b.data.Phone
                }) + '" href="#/section/Food/category/AllEntrees"><b>Phone Number &raquo;</b></a>'));
                return simplr.layout.mAssembleLayout({
                    component: "profileInColumn",
                    tokens: {
                        storeResultsURL: "#" + site.func.buildURL({
                            url: "#/locations/results/?type=all",
                            parameters: e
                        }),
                        serviceMethodDeliveryClass: a.inArray("Delivery", g) == -1 ? "disabled" : "",
                        serviceMethodCarryoutClass: a.inArray("Carryout", g) == -1 ? "disabled" : "",
                        storeNumber: d.data.Details.StoreID,
                        storeInformation: f.join("</li><li>"),
                        locationInformation: jsDPZ.obj.address(d.data.Customer.Address).getDisplayAddress().join("</li><li>"),
                        futureOrderDate: jsDPZ.util.empty(d.data.Details.OrderDateTime) ? "" : jsDPZ.obj.dateTime(d.data.Details.OrderDateTime).getDisplayFormat()
                    }
                })
            },
            callback: function(b) {
                a(".disabled", b).remove();
                var d = jsDPZ.app.order.getOrder().data.Details.ServiceMethod,
                    e = a(".js-serviceMethod", b);
                e.click(function() {
                    site.func.changeServiceMethod(a(this).val());
                    simplr.controller.mRouteAndExecute("/order/validate/")
                });
                d ? e.filter("[value='" + d + "']").attr("checked", "true") : e.eq(0).attr("checked", "true").click();
                a(".js-serviceMethod", b).size() === 2 && a(".js-serviceMethodChange", b).remove();
                a("a.js-changeTiming", b).click(function(b) {
                    b.preventDefault();
                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                        url: a(this).attr("href")
                    }))
                });
                a(".genericList", b).each(function(b, d) {
                    var e = a("li", d);
                    e.filter(":last").text() != "" && e.size() > 1 ? e.filter(":first").remove() : e.not(":first").remove()
                });
                a("#orderDetailsInColumn h3 a", b).click(function() {
                    var b = a(this).parent().text();
                    site.trigger.onEvent({
                        uri: "/rightnav/" + b.toLowerCase().replace(/ /g, ""),
                        title: "Right Nav " + b,
                        group: "Right Nav",
                        subGroup: b
                    })
                });
                site.func.refreshShoprunner()
            }
        }
    });
    simplr.view.mAddViews({
        discountDashboard: {
            html: function(b) {
                var d = this.util,
                    e = jsDPZ.app.catalog.getCatalog().data.CouponTiers.MultiplePizza.Coupons,
                    g = [];
                if (e.length)
                    for (var f = jsDPZ.app.catalog.getCatalog().data.Coupons, j = 0, h = e.length; j < h; j++) a.each(f, function(a, b) {
                        b.Code == e[j] && g.push({
                            code: b.Code,
                            name: b.Name,
                            percent: b.Tags.CouponTierPercentOff,
                            threshold: b.Tags.CouponTierThreshold
                        })
                    });
                return simplr.layout.mAssembleLayout({
                    component: "discountDashboard",
                    tokens: {
                        totalPizzas: d.countPizzas(b.Products),
                        pizzaCeiling: {
                            component: "pizzaCeiling",
                            tokens: g
                        }
                    }
                })
            },
            callback: function(b, d) {
                var e = this.util,
                    g;
                e.applyCoupon(d);
                e.setActiveCircle(d.Promotions);
                e.updateCounters(e.countPizzas(d.Products));
                site.func.setDiscountDashboardNavButtons(d);
                a("#headerMin .dashboardToggle").on("click", function() {
                    a("#headerMin").hide();
                    a("#headerMax").show();
                    a("#dashboardContent").slideDown("fast", function() {
                        site.func.positionDiscountDashboard()
                    });
                    site.trigger.onEvent({
                        group: "Group Order",
                        subGroup: "Dashboard Maximize",
                        title: "Group Order - Dashboard Maximize",
                        uri: "/group_order/dashboard_maximize"
                    })
                });
                a("#headerMax .dashboardToggle").on("click", function() {
                    a("#headerMax").hide();
                    a("#headerMin").show();
                    a("#dashboardContent").slideUp("fast",
                        function() {
                            site.func.positionDiscountDashboard()
                        });
                    site.trigger.onEvent({
                        group: "Group Order",
                        subGroup: "Dashboard Minimize",
                        title: "Group Order - Dashboard Minimize",
                        uri: "/group_order/dashboard_minimize"
                    })
                });
                a(".content-nextButtons a", b).on("click", function(b) {
                    b.preventDefault();
                    var b = a(this).attr("data-category"),
                        d = "",
                        d = b == "pizzas" ? "Pizzas" : b == "drinks_sides" ? "Drinks & Sides" : "Checkout";
                    site.trigger.onEvent({
                        group: "Group Order",
                        subGroup: d,
                        title: "Group Order - " + d,
                        uri: "/group_order/" + b
                    });
                    window.location.hash =
                        a(this).attr("href")
                });
                a(document).on("/order/validate/ /order/price/", function(b, d) {
                    var g = e.countPizzas(d.Order.Products),
                        k = jsDPZ.app.order.getOrder().data.Tags;
                    g <= 0 || k.removeCoupon ? (a("#discountDashboard").hide(), a(".pageLeftColumn").removeClass("discountDashboard"), k.GroupOrdering = false, k.usingGroupOrderingCoupons = false, e.removeGroupOrderingCoupons(d.Order.Coupons)) : (a(".js-totalPizzas").html(e.countPizzas(d.Order.Products)), e.setActiveCircle(d.Order.Promotions), e.updateCounters(g), e.applyCoupon(d.Order))
                });
                a(".thresholdRing", b).hover(function() {
                    var b = this,
                        d = {};
                    g = setTimeout(function() {
                        d = {
                            position: a(b).position(),
                            pizzas: a(b).attr("data-threshold"),
                            percent: a(b).attr("data-percent")
                        };
                        simplr.view.mRender({
                            name: "discountHoverOverlay",
                            data: d,
                            selector: "#js-discountHover"
                        });
                        a("#discountHover").show()
                    }, 1E3)
                }, function() {
                    a("#discountHover").hide();
                    clearTimeout(g)
                })
            },
            util: {
                setActiveCircle: function(b) {
                    var b = this.getGroupOrderingCoupon(b),
                        d = a(".thresholdRing");
                    d.removeClass("activeRing").attr("data-percentcomplete",
                        0);
                    a(".thresholdContainer").attr("data-percentcomplete", 0).removeClass("gOPulse");
                    for (var e = 0, g = d.length; e < g; e++)
                        if (jsDPZ.util.empty(b)) a(d[0]).addClass("activeRing"), a(".js-triangle").css("left", function() {
                            return 26 + (5 - d.length) * 26
                        });
                        else if (a(d[e]).attr("data-code") == b.code) {
                        a(".thresholdContainer", d[e]).removeClass("gOPulse");
                        var f = e;
                        b.status == "Complete" && (f = e + 1, a(d[e]).attr("data-percentcomplete", 100), a(".thresholdContainer", d[e]).attr("data-percentcomplete", 100).addClass("gOPulse"));
                        a(d[f]).addClass("activeRing");
                        if (f > 0)
                            for (var j = 0; j < e; j++) a(d[j]).attr("data-percentcomplete", 100), a(".thresholdContainer", d[j]).attr("data-percentcomplete", 100);
                        a(".js-triangle").css("left", function() {
                            f < 5 || (f = 4);
                            return f < d.length ? (5 - d.length) * 26 + (f + 1) * 26 + f * 26 : (5 - d.length) * 26 + d.length * 26 + (d.length - 1) * 26
                        })
                    }
                },
                countPizzas: function(a) {
                    for (var d = 0, e = 0, g = a.length; e < g; e++)
                        if (a[e].CategoryCode == "Pizza" || a[e].CategoryCode == "Artisan") d += a[e].Qty;
                    return d
                },
                applyCoupon: function(a) {
                    var d = a.Promotions,
                        a = a.Coupons;
                    if (!jsDPZ.app.order.getOrder().data.Tags.removeCoupon && !jsDPZ.util.empty(d.Redeemable))
                        for (var e = 0, g = d.Redeemable.length; e < g; e++) {
                            if (d.Redeemable[e].Code == "MultiplePizza") {
                                var f = d.Redeemable[e].CouponCode,
                                    j = jsDPZ.app.catalog.getCatalog().getCoupon(f),
                                    h = false;
                                if (a.length)
                                    for (var k = 0, m = a.length; k < m; k++) h = a[k].Code == f;
                                if (!h) {
                                    if (!site.func.isGroupOrdering()) jsDPZ.app.order.getOrder().data.Tags.GroupOrdering = true, jsDPZ.app.order.getOrder().data.Tags.usingGroupOrderingCoupons = true;
                                    this.removeGroupOrderingCoupons(a)
                                }
                                simplr.controller.mRouteAndExecute(site.func.buildURL({
                                    url: "#/order/coupons/new?code=" + f + "&qty=1"
                                }))
                            }
                            this.updateDiscount(j);
                            this.updateNextDiscount(d.Redeemable[e])
                        }
                },
                removeGroupOrderingCoupons: function(a) {
                    for (var d = 0, e = a.length; d < e; d++) {
                        var g = jsDPZ.app.catalog.getCatalog().getCoupon(a[d].Code);
                        if (!jsDPZ.util.empty(g.data.Tags) && g.data.Tags.CouponTier == "MultiplePizza") {
                            g = jsDPZ.app.order.getOrder().data.Tags;
                            if (g.removeCoupon) g.GroupOrdering = false, g.usingGroupOrderingCoupons = false;
                            simplr.controller.mRouteAndExecute(site.func.buildURL({
                                url: "#/order/coupons/" + a[d].ID + "/delete"
                            }))
                        }
                    }
                },
                updateDiscount: function(b) {
                    var d =
                        a(".thresholdContainer"),
                        e = a(d[0]).attr("data-percentcomplete") < 100 ? 0 : b.data.Tags.CouponTierPercentOff,
                        g = a(".js-percentOff").html();
                    if (e != g) var f = setInterval(function() {
                        g < e ? g++ : g > e ? g-- : clearTimeout(f);
                        a(".js-percentOff").html(g)
                    }, 100);
                    else a(".js-percentOff").html(e);
                    a(".js-pizzaDiscountLevel").html(b.data.Tags.CouponTierThreshold)
                },
                updateNextDiscount: function(b) {
                    for (var d = a(".thresholdRing"), e, g = 0, f = d.length; g < f; g++) a(d[g]).attr("data-code") == b.CouponCode && (a("h1.discountLevels span").html(simplr.validation.mGetCodeMessage("discountLevelNext")),
                        g == 0 && b.Status != "Complete" ? e = a(d[g]).attr("data-code") : g > 0 && g < f - 1 || g == 0 && b.Status == "Complete" ? e = a(d[g + 1]).attr("data-code") : (e = a(d[g]).attr("data-code"), a("h1.discountLevels span").html(simplr.validation.mGetCodeMessage("discountLevelCurrent"))));
                    e && (b = jsDPZ.app.catalog.getCatalog().getCoupon(e), a(".js-nextPercentOff").html(b.data.Tags.CouponTierPercentOff), a(".js-nextDiscountLevel").html(b.data.Tags.CouponTierThreshold))
                },
                updateCounters: function(b) {
                    for (var d = a(".thresholdRing"), e = a(".activeRing").attr("data-threshold"),
                            g, f = 0, j = d.length; f < j; f++) a(d[f]).hasClass("activeRing") && (g = a(d[f - 1]).attr("data-threshold") || 0);
                    b = Math.round((b - g) / (e - g) * 10) * 10;
                    a(".activeRing").attr("data-percentcomplete", b);
                    site.func.positionDiscountDashboard()
                },
                getGroupOrderingCoupon: function(a) {
                    if (!jsDPZ.util.empty(a.Redeemable))
                        for (var d = 0, e = a.Redeemable.length; d < e; d++)
                            if (a.Redeemable[d].Code == "MultiplePizza") return {
                                code: a.Redeemable[d].CouponCode,
                                status: a.Redeemable[d].Status
                            }
                }
            }
        },
        discountHoverOverlay: {
            html: function(a) {
                return simplr.layout.mAssembleLayout({
                    component: "discountHover",
                    tokens: {
                        pizzaLevel: a.pizzas,
                        percentLevel: a.percent
                    }
                })
            },
            callback: function(b, d) {
                a("#discountHover").css("left", function() {
                    return d.position.left - 120
                })
            }
        }
    });
    simplr.view.mAddViews({
        customer_location_view: {
            html: function(a) {
                return simplr.layout.mAssembleLayout({
                    component: "genericOverlay",
                    tokens: {
                        overlayContent: {
                            component: "customerLocation",
                            tokens: {
                                addressFields: {
                                    component: "customerAddressFields",
                                    tokens: {
                                        locationName: a.LocationName,
                                        addressName: a.Name,
                                        addressType: a.Type,
                                        street: a.Street,
                                        addressLine2: a.AddressLine2,
                                        city: a.City,
                                        region: a.Region,
                                        postalCode: a.PostalCode,
                                        deliveryInstructions: a.DeliveryInstructions
                                    }
                                }
                            }
                        }
                    }
                })
            },
            callback: function(b, d) {
                var e = {
                    el: a("form", b),
                    settings: {
                        addressType: d.Type || "House"
                    },
                    init: function() {
                        a(".js-region, .js-campusRegion", b).val(d.Region);
                        a('[value="' + this.settings.addressType + '"]', b).prop("checked", true).parent().addClass("active").siblings().removeClass("active");
                        this.el.focusClass().validate(this.validation);
                        this.el.renderFields();
                        switch (this.settings.addressType) {
                            case "House":
                                a('label[for="Address_Line_2"] span',
                                    b).text(a.validator.labels["Suite/Apt#"]);
                                break;
                            case "Apartment":
                                a('label[for="Location_Name"] span', b).text(a.validator.labels.ApartmentName);
                                a('label[for="Address_Line_2"] span', b).text(a.validator.labels["Suite/Apt#"]);
                                break;
                            case "Business":
                                a('label[for="Location_Name"] span', b).text(a.validator.labels.BusinessName);
                                a('label[for="Address_Line_2"] span', b).text(a.validator.labels["Suite/Apt#"]);
                                break;
                            case "Hotel":
                                a('label[for="Location_Name"] span', b).text(a.validator.labels.HotelName);
                                a('label[for="Address_Line_2"] span',
                                    b).text(a.validator.labels["Room#"]);
                                break;
                            case "Dormitory":
                                a('label[for="Location_Name"] span', b).text(a.validator.labels.DormitoryName);
                                a('label[for="Address_Line_2"] span', b).text(a.validator.labels["Room#"]);
                                break;
                            case "Other":
                                a('label[for="Address_Line_2"] span', b).text(a.validator.labels["Unit#"])
                        }
                    },
                    validation: {
                        rules: {
                            Address_Type: {
                                required: true
                            },
                            Location_Name: {
                                showOptional: function() {
                                    return e.settings.addressType === "Apartment" || e.settings.addressType === "Business" || e.settings.addressType ===
                                        "Hotel" || e.settings.addressType === "Dormitory"
                                }
                            },
                            Street: {
                                required: function() {
                                    return e.settings.addressType !== "Campus"
                                }
                            },
                            Address_Line_2: {
                                required: function() {
                                    return e.settings.addressType === "Apartment" || e.settings.addressType === "Hotel" || e.settings.addressType === "Dormitory"
                                },
                                showOptional: function() {
                                    return e.settings.addressType === "House" || e.settings.addressType === "Business" || e.settings.addressType === "Other"
                                }
                            },
                            City: {
                                required: function() {
                                    return e.settings.addressType !== "Campus"
                                }
                            },
                            Region: {
                                required: function() {
                                    return e.settings.addressType !==
                                        "Campus"
                                }
                            },
                            Postal_Code: {
                                postalcode: true,
                                required: function() {
                                    return e.settings.addressType !== "Campus"
                                }
                            },
                            Region_Campus: {
                                required: function() {
                                    return e.settings.addressType === "Campus"
                                }
                            },
                            Campus: {
                                required: function() {
                                    return e.settings.addressType === "Campus"
                                }
                            },
                            Dorm: {
                                required: function() {
                                    return e.settings.addressType === "Campus"
                                }
                            },
                            Room_Number: {
                                showOptional: function() {
                                    return e.settings.addressType === "Campus"
                                }
                            },
                            Address_Name: {
                                showOptional: true,
                                uniqueAddress: d.Name
                            },
                            Delivery_Instructions: {
                                showOptional: true
                            }
                        },
                        submitHandler: function(b) {
                            var e =
                                simplr.form.mGetValues(b),
                                f = {
                                    LocationName: e.Location_Name,
                                    Street: e.Street,
                                    AddressLine2: e.Address_Line_2,
                                    City: e.City,
                                    Region: e.Region,
                                    PostalCode: e.Postal_Code,
                                    DeliveryInstructions: e.Delivery_Instructions,
                                    Type: e.Address_Type,
                                    Name: e.Address_Name,
                                    CampusID: e.Address_Type === "Campus" ? e.Campus : "",
                                    BuildingID: e.Address_Type === "Campus" ? e.Dorm : ""
                                };
                            f.Type !== "Campus" ? simplr.controller.mRouteAndExecute(site.func.buildURL({
                                url: "#/customer/location/" + d.Name + "/update",
                                parameters: f
                            })) : site.locationTools.performStoreSearch({
                                data: site.locationTools.buildSessionParameters(f),
                                success: function() {
                                    var b = jsDPZ.app.search.getStoreSearch().getSearchedAddress().data;
                                    a.extend(f, {
                                        Street: b.Street,
                                        AddressLine2: e.Room_Number,
                                        AddressLine3: b.AddressLine3,
                                        LocationName: b.AddressLine4,
                                        City: b.City,
                                        Region: b.Region,
                                        PostalCode: b.PostalCode
                                    });
                                    simplr.controller.mRouteAndExecute(site.func.buildURL({
                                        url: "#/customer/location/" + d.Name + "/update",
                                        parameters: f
                                    }))
                                }
                            })
                        }
                    }
                };
                e.init();
                a(".js-changeAddressType label", b).on("click", function(d) {
                    d.preventDefault();
                    d = a("input[type='radio']", this);
                    d.prop("checked",
                        true).parent().addClass("active").siblings().removeClass("active");
                    e.settings.addressType = d.val();
                    e.el.renderFields();
                    switch (e.settings.addressType) {
                        case "Apartment":
                            a('label[for="Location_Name"] span', b).text(a.validator.labels.ApartmentName);
                            a('label[for="Address_Line_2"] span', b).text(a.validator.labels["Suite/Apt#"]);
                            break;
                        case "Business":
                            a('label[for="Location_Name"] span', b).text(a.validator.labels.BusinessName);
                            a('label[for="Address_Line_2"] span', b).text(a.validator.labels["Suite/Apt#"]);
                            break;
                        case "Hotel":
                            a('label[for="Location_Name"] span', b).text(a.validator.labels.HotelName);
                            a('label[for="Address_Line_2"] span', b).text(a.validator.labels["Room#"]);
                            break;
                        case "Dormitory":
                            a('label[for="Location_Name"] span', b).text(a.validator.labels.DormitoryName);
                            a('label[for="Address_Line_2"] span', b).text(a.validator.labels["Room#"]);
                            break;
                        case "Other":
                            a('label[for="Address_Line_2"] span', b).text(a.validator.labels["Unit#"]);
                            break;
                        case "House":
                            a('label[for="Address_Line_2"] span', b).text(a.validator.labels["Suite/Apt#"])
                    }
                });
                var g = a(".js-campusRegion", b),
                    f = a(".js-campusCampus", b),
                    j = a(".js-campusDorm", b);
                jsDPZ.ajax.regions({
                    success: function(a) {
                        g.append(site.func.buildOptionList({
                            listValues: site.locationTools.getRegionListData(a)
                        }))
                    },
                    error: function() {
                        site.func.powerCommunicationError()
                    }
                });
                g.on("change", function() {
                    a("option", f).not(":first").remove();
                    jsDPZ.ajax.sitesByRegion({
                        region: a(this).val(),
                        success: function(a) {
                            f.append(site.func.buildOptionList({
                                listValues: site.locationTools.getCampusListData(a)
                            })).change()
                        },
                        error: function() {
                            site.func.powerCommunicationError()
                        }
                    })
                });
                f.on("change", function() {
                    a("option", j).not(":first").remove();
                    jsDPZ.ajax.buildingsBySite({
                        site: a(this).val(),
                        success: function(a) {
                            j.append(site.func.buildOptionList({
                                listValues: site.locationTools.getBuildingListData(a)
                            })).change()
                        },
                        error: function() {
                            site.func.powerCommunicationError()
                        }
                    })
                });
                if (d.Type === "Campus") var h = setInterval(function() {
                    a("option", g).size() > 1 && (clearInterval(h), g.val(d.Region).change());
                    var b = setInterval(function() {
                        a("option", f).size() > 1 && (clearInterval(b), f.val(d.CampusID || d.LocationName).change());
                        var e = setInterval(function() {
                            a("option", j).size() > 1 && (clearInterval(e), j.val(d.BuildingID).change())
                        }, 100)
                    }, 100)
                }, 100);
                a(".overlayContentFrame").css("width", "605px");
                site.func.setupLayerCloseEvents({
                    layerSelector: b
                })
            }
        }
    });
    killConfig.localData.shoprunner = true;
    killConfig.localData.mBox = true;
    a.extend(true, site.data, {
        srTimeout: null,
        popularItems: [{
            Code: "14SCREEN",
            Toppings: {},
            Sides: {}
        }, {
            Code: "14SCREEN",
            Toppings: {
                P: {
                    "1/1": "1"
                }
            },
            Sides: {}
        }, {
            Code: "12SCREEN",
            Toppings: {
                H: {
                    "1/1": "1"
                },
                N: {
                    "1/1": "1"
                }
            },
            Sides: {}
        }, {
            Code: "12SCREEN",
            Toppings: {
                M: {
                    "1/1": "1"
                },
                P: {
                    "1/1": "1"
                }
            },
            Sides: {}
        }, {
            Code: "P12IREPV",
            Toppings: {},
            Sides: {}
        }, {
            Code: "PSANSACB",
            Toppings: {},
            Sides: {}
        }, {
            Code: "PINPASCA",
            Toppings: {},
            Sides: {}
        }, {
            Code: "W08PBBQW",
            Toppings: {},
            Sides: {}
        }, {
            Code: "CHSBREAD",
            Toppings: {},
            Sides: {}
        }, {
            Code: "B2PCLAVA",
            Toppings: {},
            Sides: {}
        }],
        crossSellItemsQuickList: function(b) {
            var d = [];
            a.each(b, function(b, g) {
                d.push({
                    Code: g,
                    Toppings: {},
                    Sides: {},
                    Conditional: function() {
                        var b = true,
                            d = jsDPZ.app.catalog.getCatalog(),
                            e = d.getProduct(d.getVariant(g).data.ProductCode).data.ProductType;
                        a.each(jsDPZ.app.order.getOrder().data.Details.Variants, function(a, g) {
                            b && d.getProduct(d.getVariant(g.Code).data.ProductCode).data.ProductType == e && (b = false)
                        });
                        return b
                    }
                })
            });
            return d
        },
        _crossSellItemsQuickList: [{
            Code: "B2PCLAVA",
            Toppings: {},
            Sides: {},
            Conditional: function() {
                var b = true;
                a.each(jsDPZ.app.order.getOrder().data.Details.Variants, function(a, e) {
                    var g = jsDPZ.app.catalog.getCatalog();
                    b && g.getProduct(g.getVariant(e.Code).data.ProductCode).data.ProductType == "Dessert" && (b = false)
                });
                return b
            }
        }, {
            Code: "B16PBIT",
            Toppings: {},
            Sides: {},
            Conditional: function() {
                var b = true;
                a.each(jsDPZ.app.order.getOrder().data.Details.Variants, function(a, e) {
                    var g = jsDPZ.app.catalog.getCatalog();
                    b && g.getProduct(g.getVariant(e.Code).data.ProductCode).data.ProductType == "Bread" && (b = false)
                });
                return b
            }
        }, {
            Code: "2LCOKE",
            Toppings: {},
            Sides: {},
            Conditional: function() {
                var b = true;
                a.each(jsDPZ.app.order.getOrder().data.Details.Variants, function(a, e) {
                    var g = jsDPZ.app.catalog.getCatalog();
                    b && g.getProduct(g.getVariant(e.Code).data.ProductCode).data.ProductType ==
                        "Drinks" && (b = false)
                });
                return b
            }
        }, {
            Code: "B8PCSCB",
            Toppings: {},
            Sides: {},
            Conditional: function() {
                var b = true;
                a.each(jsDPZ.app.order.getOrder().data.Details.Variants, function(a, e) {
                    var g = jsDPZ.app.catalog.getCatalog();
                    b && g.getProduct(g.getVariant(e.Code).data.ProductCode).data.ProductType == "Bread" && (b = false)
                });
                return b
            }
        }, {
            Code: "W08PHOTW",
            Toppings: {},
            Sides: {},
            Conditional: function() {
                var b = true;
                a.each(jsDPZ.app.order.getOrder().data.Details.Variants, function(a, e) {
                    var g = jsDPZ.app.catalog.getCatalog();
                    b && g.getProduct(g.getVariant(e.Code).data.ProductCode).data.ProductType ==
                        "Wings" && (b = false)
                });
                return b
            }
        }, {
            Code: "PSANSAPH",
            Toppings: {},
            Sides: {},
            Conditional: function() {
                var b = true;
                a.each(jsDPZ.app.order.getOrder().data.Details.Variants, function(a, e) {
                    var g = jsDPZ.app.catalog.getCatalog();
                    b && g.getProduct(g.getVariant(e.Code).data.ProductCode).data.ProductType == "Sandwich" && (b = false)
                });
                return b
            }
        }, {
            Code: "MAGGFSAL",
            Toppings: {},
            Sides: {},
            Conditional: function() {
                var b = true;
                a.each(jsDPZ.app.order.getOrder().data.Details.Variants, function(a, e) {
                    var g = jsDPZ.app.catalog.getCatalog();
                    b &&
                        g.getProduct(g.getVariant(e.Code).data.ProductCode).data.ProductType == "GSalad" && (b = false)
                });
                return b
            }
        }, {
            Code: "PINPASCA",
            Toppings: {},
            Sides: {},
            Conditional: function() {
                var b = true;
                a.each(jsDPZ.app.order.getOrder().data.Details.Variants, function(a, e) {
                    var g = jsDPZ.app.catalog.getCatalog();
                    b && g.getProduct(g.getVariant(e.Code).data.ProductCode).data.ProductType == "Pasta" && (b = false)
                });
                return b
            }
        }],
        couponWizardImportantProductCodes: {
            S_BUILD: 1,
            S_PIZZA: 1,
            S_BONEIN: 1,
            S_BONELESS: 1
        },
        hotDeals: {
            foodQuickListData: [],
            couponCodes: site.func.isPromoActive(new Date(2014,
                2, 17, 3, 0, 0), new Date(2014, 2, 24, 3, 0, 0)) ? [9413, 9193] : [9184, 9193]
        },
        sidePromo: {
            productCode: "F_STJUDE"
        },
        beverageUpsell: {
            productCodes: ["F_COKE", "F_DIET", "F_SPRITE"]
        }
    });
    a.extend(true, site.func, {
        refreshShoprunner: function() {
            if (killConfig.isActive("shoprunner")) clearTimeout(site.data.srTimeout), typeof sr_$ != "undefined" ? (sr_$.cookie.check(), sr_$.actions.refresh_page()) : site.data.srTimeout = setTimeout(function() {
                site.func.refreshShoprunner()
            }, 100)
        },
        logoutShoprunner: function() {
            delete jsDPZ.app.order.getOrder().data.Partners.ShopRunner;
            site.sessionTools.save({
                async: false
            });
            killConfig.isActive("shoprunner") && sr_$.signOut()
        }
    });
    simplr.controller.mAddCommands({
        orderUpsell: {
            route: ["order", "upsell", "view"],
            callback: function(a) {
                site.oloTools.whenReady({
                    oloReady: function() {
                        if (!simplr.util.mEmpty(a.parameters.Reengagement) && !simplr.util.mEmpty(a.parameters.Code)) {
                            site.trigger.onPage({
                                route: a,
                                title: "Coupon | Continue Online Ordering",
                                group: "Coupons",
                                subGroup: "Reengagement"
                            });
                            var d = jsDPZ.app.catalog.getCatalog().data.Coupons[a.parameters.Code];
                            if (!jsDPZ.app.order.getOrder().data.HasSeenReengagement) jsDPZ.app.order.getOrder().data.HasSeenReengagement = true, site.trigger.onPage({
                                route: a
                            }), site.sessionTools.save({
                                async: false
                            }), site.func.overlayToggle(true, "upsellReengageOverlay", {
                                keepCentered: true
                            }, d)
                        } else d = jsDPZ.app.catalog.getCrossSellQuicklist().data.slice(0, 1), !jsDPZ.app.order.getOrder().data.HasSeenUpsell && d.length > 0 ? (site.trigger.onPage({
                            route: a,
                            uri: "/en/pages/order/#/checkout/upsell/" + d[0].Code,
                            title: "Checkout Upsell",
                            group: "Checkout",
                            subGroup: "Upsell"
                        }), jsDPZ.app.order.getOrder().data.HasSeenUpsell = true, site.sessionTools.save({
                            async: false
                        }), d[0].Type === "Coupon" ? site.func.overlayToggle(true, "upsellCouponOverlay", {
                            keepCentered: true
                        }, d[0]) : site.func.overlayToggle(true, "upsellProductOverlay", {
                            keepCentered: true
                        }, d[0])) : jsDPZ.app.customer.getCustomer().data.Session.IsEasyOrder || jsDPZ.app.customer.getCustomer().data.Session.IsRecentOrder ? window.location = urlConfig.localRoot + "/pages/order/payment.jsp" : simplr.controller.mRouteAndExecute("/order/price/?checkout=1")
                    }
                })
            }
        }
    });
    simplr.view.mAddViews({
        product_page: {
            html: function(b) {
                b = a.extend({}, b);
                return simplr.layout.mAssembleLayout({
                    component: "productPage",
                    tokens: {
                        productCode: b.Code,
                        productName: b.Name,
                        productDescripton: b.Description,
                        productDogEar: b.Tags.New ? "newDogEar" : "",
                        productDogEarText: b.Tags.New ? simplr.validation.mGetCodeMessage("iNewDogEar") : "",
                        productImage: b.ImageCode
                    }
                })
            },
            callback: function(b, d) {
                a.extend({
                    Code: ""
                }, d);
                a(".buttonType3", b).click(function(b) {
                    b.preventDefault();
                    window.location = a("#js-subNavigationPage .active").attr("href") ||
                        a(".subNavigation .active").attr("href")
                });
                site.func.fixMissingImages(a("img", b))
            }
        }
    });
    simplr.view.mAddViews({
        upsellProductOverlay: {
            html: function(b) {
                var d = jsDPZ.app.catalog.getCatalog(),
                    b = d.getVariant(b.Code).data,
                    d = d.getProduct(b.ProductCode).data,
                    e = d.ImageCode;
                d.Code === "F_STJUDE" && (e += "_" + b.Code, a("html").attr("lang") == "es" && (e += "_ES"));
                return simplr.layout.mAssembleLayout({
                    component: "genericOverlay",
                    tokens: {
                        overlayContent: {
                            component: "upsellProductOverlay",
                            tokens: {
                                variantName: d.Code === "F_STJUDE" ? d.Name : b.Name,
                                variantPrice: jsDPZ.obj.price(b.Price).getDisplayValue(),
                                productImage: e,
                                productName: d.Name
                            }
                        }
                    }
                })
            },
            callback: function(b, d) {
                var e = "";
                jsDPZ.util.empty(jsDPZ.app.order.getOrder().data.Details.Amounts) || (e = jsDPZ.obj.price(jsDPZ.app.order.getOrder().data.Details.Amounts.Savings).getDisplayValue());
                site.data.ABData.savingsHeader && (e = site.data.productUpsellHeader.replace("$[savings]", e), a("#upsellProductOverlay .contentBox .js-upsellHeader").html(e));
                a(".overlayContentFrame").css("width", "800px");
                site.func.setupLayerCloseEvents({
                    layerSelector: b,
                    closeSelector: ".js-closeButton, .js-continue, .js-nothanks",
                    callback: function(b) {
                        var e = jsDPZ.app.catalog.getCatalog().getVariant(d.Code).data,
                            j = simplr.cookie.mGet({
                                name: "routePast"
                            });
                        if (j) site.trigger.onPage(jsDPZ.dataConversion.JSONStringToObject(j));
                        if (a(b).is(".js-continue")) {
                            site.trigger.onEvent({
                                uri: "/en/pages/order/#/checkout/upsell/addProduct/" + e.Code,
                                title: "Checkout Upsell Add Product",
                                group: "Checkout",
                                subGroup: "Upsell Light Box Add Product"
                            });
                            if (jsDPZ.app.customer.getCustomer().data.Session.IsEasyOrder) jsDPZ.app.customer.getCustomer().data.Session.OrderModified = true;
                            if (jsDPZ.app.customer.getCustomer().data.Session.IsEasyOrder || jsDPZ.app.customer.getCustomer().data.Session.IsRecentOrder || site.data.ABData.upsellAtBasket) jsDPZ.app.customer.getCustomer().data.Session.AfterUpsell = true;
                            simplr.controller.mRouteAndExecute("/order/variant/new" + site.catalogTools.orderVariantToURLParameterString(d))
                        } else {
                            if (a(b).is(".js-nothanks")) site.trigger.onEvent({
                                uri: "/en/pages/order/#/checkout/upsell/doNotAddProduct/" + e.Code,
                                title: "Checkout Upsell Do Not Add Product",
                                group: "Checkout",
                                subGroup: "Upsell Light Box No Thanks"
                            });
                            else site.trigger.onEvent({
                                uri: "/en/pages/order/#/checkout/upsell/cancelProduct/" + e.Code,
                                title: "Checkout Upsell Cancel Product",
                                group: "Checkout",
                                subGroup: "Upsell Light Box Close"
                            });
                            jsDPZ.app.customer.getCustomer().data.Session.IsEasyOrder || jsDPZ.app.customer.getCustomer().data.Session.IsRecentOrder || site.data.ABData.upsellAtBasket ? window.location = urlConfig.localRoot + "/pages/order/payment.jsp" :
                                simplr.controller.mRouteAndExecute("/order/price/?checkout=1")
                        }
                    }
                })
            }
        },
        upsellCouponOverlay: {
            html: function(a) {
                a = jsDPZ.app.catalog.getCatalog().getCoupon(a.Code).data;
                return simplr.layout.mAssembleLayout({
                    component: "genericOverlay",
                    tokens: {
                        overlayContent: {
                            component: "upsellCouponOverlay",
                            tokens: {
                                couponName: a.Name,
                                couponPrice: jsDPZ.obj.price(a.Price).getDisplayValue(),
                                couponImage: a.ImageCode
                            }
                        }
                    }
                })
            },
            callback: function(b, d) {
                site.func.onPage({
                    route: d
                });
                a(".overlayContentFrame").css("width", "800px");
                a(".js-reengagement",
                    b).remove();
                site.func.setupLayerCloseEvents({
                    layerSelector: b,
                    closeSelector: ".js-closeButton, .js-continue, .js-nothanks",
                    callback: function(b) {
                        var g = simplr.cookie.mGet({
                            name: "routePast"
                        });
                        if (g) site.trigger.onPage(jsDPZ.dataConversion.JSONStringToObject(g));
                        if (a(b).is(".js-continue")) {
                            site.trigger.onEvent({
                                uri: "/en/pages/order/#/checkout/upsell/addCoupon",
                                title: "Checkout Upsell Add Coupon",
                                group: "Checkout",
                                subGroup: "Upsell Light Box Add Product"
                            });
                            if (jsDPZ.app.customer.getCustomer().data.Session.IsEasyOrder ||
                                jsDPZ.app.customer.getCustomer().data.Session.IsRecentOrder) jsDPZ.app.customer.getCustomer().data.Session.AfterUpsell = true;
                            simplr.controller.mRouteAndExecute("/order/coupons/new" + site.catalogTools.orderVariantToURLParameterString(d) + "&qty=1")
                        } else {
                            if (a(b).is(".js-nothanks")) site.trigger.onEvent({
                                uri: "/en/pages/order/#/checkout/upsell/cancelCoupon",
                                title: "Checkout Upsell Cancel Coupon",
                                group: "Checkout",
                                subGroup: "Upsell Light Box No Thanks"
                            });
                            else site.trigger.onEvent({
                                uri: "/en/pages/order/#/checkout/upsell/cancelCoupon",
                                title: "Checkout Upsell Cancel Coupon",
                                group: "Checkout",
                                subGroup: "Upsell Light Box Close"
                            });
                            jsDPZ.app.customer.getCustomer().data.Session.IsEasyOrder || jsDPZ.app.customer.getCustomer().data.Session.IsRecentOrder ? window.location = urlConfig.localRoot + "/pages/order/payment.jsp" : simplr.controller.mRouteAndExecute("/order/price/?checkout=1")
                        }
                    }
                })
            }
        },
        upsellReengageOverlay: {
            html: function(a) {
                a = jsDPZ.app.catalog.getCatalog().getCoupon(a.Code).data;
                return simplr.layout.mAssembleLayout({
                    component: "genericOverlay",
                    tokens: {
                        overlayContent: {
                            component: "upsellCouponOverlay",
                            tokens: {
                                couponName: a.Name,
                                couponPrice: jsDPZ.obj.price(a.Price).getDisplayValue(),
                                couponImage: a.ImageCode
                            }
                        }
                    }
                })
            },
            callback: function(b, d) {
                a(".overlayContentFrame").css("width", "800px");
                a(".js-upsell", b).remove();
                site.func.setupLayerCloseEvents({
                    layerSelector: b,
                    closeSelector: ".js-closeButton, .js-continue, .js-nothanks",
                    callback: function(b) {
                        var g = simplr.cookie.mGet({
                            name: "routePast"
                        });
                        if (g) site.trigger.onPage(jsDPZ.dataConversion.JSONStringToObject(g));
                        if (a(b).is(".js-continue")) site.trigger.onEvent({
                            uri: "/en/pages/order/#/reengagement/",
                            title: "Reengagement Light Box Add Coupon",
                            group: "Checkout",
                            subGroup: "Reengagement Light Box Add Coupon"
                        }), simplr.controller.mRouteAndExecute("/order/coupons/new" + site.catalogTools.orderVariantToURLParameterString(d) + "&qty=1"), window.location.hash = "/section/Food/category/AllEntrees/";
                        else if (a(b).is(".js-nothanks")) site.trigger.onEvent({
                            uri: "/en/pages/order/#/checkout/upsell/cancelCoupon",
                            title: "Reengagement Light Box Cancel Coupon",
                            group: "Checkout",
                            subGroup: "Upsell Light Box No Thanks"
                        });
                        else site.trigger.onEvent({
                            uri: "/en/pages/order/#/checkout/upsell/cancelCoupon",
                            title: "Reengagement Light Box Cancel Coupon",
                            group: "Checkout",
                            subGroup: "Reengagement Light Box Close"
                        })
                    }
                })
            }
        },
        roundUpOverlay: {
            html: function(a) {
                return simplr.layout.mAssembleLayout({
                    component: "genericOverlay",
                    tokens: {
                        overlayContent: {
                            component: "roundUpOverlay",
                            tokens: {
                                productImage: a.imageCode,
                                newTotal: a.newTotal,
                                roundUp: a.roundUp
                            }
                        }
                    }
                })
            },
            callback: function(b, d) {
                a(".overlayContentFrame").css("width",
                    "800px");
                site.func.setupLayerCloseEvents({
                    layerSelector: b,
                    closeSelector: ".js-closeButton, .js-continue, .js-nothanks",
                    callback: function(b) {
                        var g = simplr.cookie.mGet({
                            name: "routePast"
                        });
                        if (g) site.trigger.onPage(jsDPZ.dataConversion.JSONStringToObject(g));
                        if (a(b).is(".js-continue")) {
                            site.trigger.onEvent({
                                uri: "/en/pages/order/#/checkout/upsell/addProduct/StJudeRoundup",
                                title: "Checkout Upsell Add Product",
                                group: "Checkout",
                                subGroup: "Upsell Light Box Add Product"
                            });
                            if (jsDPZ.app.customer.getCustomer().data.Session.IsEasyOrder) jsDPZ.app.customer.getCustomer().data.Session.OrderModified =
                                true;
                            jsDPZ.app.customer.getCustomer().data.Session.AfterUpsell = true;
                            simplr.controller.mRouteAndExecute("/order/coupons/new" + site.catalogTools.orderVariantToURLParameterString({
                                Code: d.coupon
                            }) + "&qty=1");
                            simplr.controller.mRouteAndExecute("/order/variant/new" + site.catalogTools.orderVariantToURLParameterString({
                                Code: d.variant
                            }) + "&amount=" + d.roundUp)
                        } else {
                            if (a(b).is(".js-nothanks")) site.trigger.onEvent({
                                uri: "/en/pages/order/#/checkout/upsell/doNotAddProduct/StJudeRoundup",
                                title: "Checkout Upsell Do Not Add Product",
                                group: "Checkout",
                                subGroup: "Upsell Light Box No Thanks"
                            });
                            else site.trigger.onEvent({
                                uri: "/en/pages/order/#/checkout/upsell/cancelProduct/StJudeRoundup",
                                title: "Checkout Upsell Cancel Product",
                                group: "Checkout",
                                subGroup: "Upsell Light Box Close"
                            });
                            setTimeout(function() {
                                window.location = urlConfig.localRoot + "/pages/order/payment.jsp"
                            }, 100)
                        }
                    }
                })
            }
        },
        savingsOverlay: {
            html: function(a) {
                var d = this.util,
                    e = site.data.sidePromo.productCode,
                    g = jsDPZ.app.catalog.getCatalog(),
                    e = g.getProduct(e).data,
                    f = [];
                a.showSavings && (f =
                    d.addDonateSavings(f, a.savings));
                f = d.createVariantTokens(e.Code, g, e.Variants, f);
                this.viewTokens.overlayContent.tokens = {
                    productImage: a.imageCode,
                    productCode: e.Code,
                    newTotal: a.newTotal,
                    productQty: 1,
                    savings: a.savings,
                    roundUp: a.roundUp,
                    productVariants: {
                        component: "promoVariantsWithoutSection",
                        tokens: {
                            productVariantList: {
                                component: "promoVariantOptions",
                                tokens: f
                            }
                        }
                    }
                };
                return simplr.layout.mAssembleLayout({
                    component: "genericOverlay",
                    tokens: this.viewTokens
                })
            },
            callback: function(b, d) {
                var e = this.util;
                a(".overlayContentFrame").css("width",
                    "800px");
                e.setDefaultSelection(b);
                site.func.setupLayerCloseEvents({
                    layerSelector: b,
                    closeSelector: ".js-closeButton, .js-continue, .js-nothanks",
                    callback: function(g) {
                        var f = simplr.form.mGetValues(b);
                        e.addPastRoute();
                        a(g).is(".js-continue") ? (site.trigger.onEvent(e.createWTObj("Accept", e.getSelectionWTString(f))), e.updateIfEasyOrderModified(), jsDPZ.app.customer.getCustomer().data.Session.AfterUpsell = true, e.addVariantToOrder(f, d.savings, d.coupon, d.variant)) : (site.trigger.onEvent(e.createWTObj(a(g).is(".js-nothanks") ?
                            "NoThanks" : "Close")), setTimeout(function() {
                            window.location = urlConfig.localRoot + "/pages/order/payment.jsp"
                        }, 100))
                    }
                })
            },
            viewTokens: {
                overlayContent: {
                    component: "savingsOverlay",
                    tokens: {
                        productImage: "",
                        productCode: "",
                        newTotal: 0,
                        productVariants: {},
                        savings: 0,
                        roundUp: 0,
                        productQty: 0
                    }
                }
            },
            util: {
                addDonateSavings: function(a, d) {
                    a.push({
                        productCode: "F_STJUDE",
                        flavorCode: "",
                        sizeCode: "",
                        variantCode: "STJUDERU",
                        variantPrice: d,
                        variantDescription: "Donate My Savings"
                    });
                    return a
                },
                createVariantTokens: function(b, d, e, g) {
                    a.each(e,
                        function(a, e) {
                            var h = d.getVariant(e).data;
                            tmp = {};
                            h.Tags.Hidden || (h.FlavorCode != "" ? tmp = d.getFlavorsData(productData.ProductType, h.FlavorCode) : h.SizeCode != "" && (tmp = d.getSizesData(productData.ProductType, h.SizeCode)), g.push({
                                productCode: b,
                                flavorCode: h.FlavorCode,
                                sizeCode: h.SizeCode,
                                variantCode: h.Code,
                                variantPrice: jsDPZ.obj.price(h.Price).getDisplayValue().split(".")[0],
                                variantDescription: jsDPZ.obj.price(h.Price).getDisplayValue().split(".")[0]
                            }))
                        });
                    return g
                },
                addPastRoute: function() {
                    var a = simplr.cookie.mGet({
                        name: "routePast"
                    });
                    if (a) site.trigger.onPage(jsDPZ.dataConversion.JSONStringToObject(a))
                },
                createWTObj: function(a, d) {
                    switch (a) {
                        case "Accept":
                            return {
                                uri: "/en/pages/order/#/checkout/upsell/addProduct/StJudeSavings" + (d || ""),
                                title: "Checkout Upsell Add Product",
                                group: "Checkout",
                                subGroup: "Upsell Light Box Add Product"
                            };
                        case "NoThanks":
                            return {
                                uri: "/en/pages/order/#/checkout/upsell/doNotAddProduct/StJudeSavings",
                                title: "Checkout Upsell Do Not Add Product",
                                group: "Checkout",
                                subGroup: "Upsell Light Box No Thanks"
                            };
                        default:
                            return {
                                uri: "/en/pages/order/#/checkout/upsell/cancelProduct/StJudeSavings",
                                title: "Checkout Upsell Cancel Product",
                                group: "Checkout",
                                subGroup: "Upsell Light Box Close"
                            }
                    }
                },
                updateIfEasyOrderModified: function() {
                    if (jsDPZ.app.customer.getCustomer().data.Session.IsEasyOrder) jsDPZ.app.customer.getCustomer().data.Session.OrderModified = true
                },
                setDefaultSelection: function(b) {
                    a(".promoVariants input[type='radio']:eq(0)", b).trigger("click")
                },
                addVariantToOrder: function(a, d, e, g) {
                    this.executeRoutes(this.getVariantRouteStrings(a, d, e, g))
                },
                getSelectionWTString: function(a) {
                    switch (site.catalogTools.formDataToVariantData(a).Code) {
                        case "STJUDERU":
                            return "savings";
                        case "STJUDE1":
                            return "1dollar";
                        case "STJUDE2":
                            return "2dollar";
                        case "STJUDE5":
                            return "5dollar";
                        case "STJUDE10":
                            return "10dollar";
                        default:
                            return ""
                    }
                },
                getVariantRouteStrings: function(a, d, e, g) {
                    var d = d || 0,
                        e = e || "",
                        g = g || "",
                        a = site.catalogTools.formDataToVariantData(a),
                        f = [];
                    a.Code == "STJUDERU" ? (f.push("/order/coupons/new" + site.catalogTools.orderVariantToURLParameterString({
                        Code: e
                    }) + "&qty=1"), f.push("/order/variant/new" + site.catalogTools.orderVariantToURLParameterString({
                        Code: g
                    }) + "&amount=" + d)) : f.push("/order/variant/new" +
                        site.catalogTools.orderVariantToURLParameterString(a));
                    return f
                },
                executeRoutes: function(b) {
                    a.isArray(b) && a.each(b, function(a, b) {
                        simplr.controller.mRouteAndExecute(b)
                    })
                }
            }
        }
    });
    var m = simplr.view.mData().Views.profile_column;
    simplr.view.mAddViews({
        profile_column: {
            html: function(a) {
                return m.html(a)
            },
            callback: function(b, d) {
                function e() {
                    a(".phone").each(function() {
                        a(this).parent().html(a(this).data("phone"))
                    })
                }
                m.callback(b, d);
                a(".phone", b).on("click", function(a) {
                    a.preventDefault();
                    site.trigger.onEvent({
                        title: "Profile In Column Show Phone Number",
                        group: "Profile In Column",
                        subGroup: "Show Phone Number"
                    });
                    site.locationTools.showReengagementCoupon(function() {
                        e()
                    })
                });
                jsDPZ.app.order.getOrder().data.HasSeenReengagement == true && e()
            }
        }
    });
    simplr.view.mAddViews({
        promoInColumn: {
            html: function(b) {
                if (site.oloTools.config.status == site.oloTools.config.statusCodes.OLOREADY && site.data.sidePromo.productCode) {
                    var b = a.extend({
                        couponCode: "",
                        orderVariantID: "",
                        code: "",
                        productCode: site.data.sidePromo.productCode,
                        toppings: {},
                        sides: {},
                        qty: 1
                    }, b),
                        d = jsDPZ.app.catalog.getCatalog(),
                        e = d.getProduct(b.productCode).data,
                        g = {
                            component: "promoVariantsWithoutSection",
                            tokens: {
                                productVariantList: {
                                    component: "promoVariantOptions",
                                    tokens: []
                                }
                            }
                        };
                    return e ? (a.each(e.Variants, function(a, b) {
                        var h = d.getVariant(b).data;
                        h.Tags.Hidden || (h.FlavorCode != "" ? d.getFlavorsData(e.ProductType, h.FlavorCode) : h.SizeCode != "" && d.getSizesData(e.ProductType, h.SizeCode), g.tokens.productVariantList.tokens.push({
                            productCode: e.Code,
                            flavorCode: h.FlavorCode,
                            sizeCode: h.SizeCode,
                            variantCode: h.Code,
                            variantPrice: jsDPZ.obj.price(h.Price).getDisplayValue().split(".")[0],
                            variantDescription: jsDPZ.obj.price(h.Price).getDisplayValue().split(".")[0]
                        }))
                    }), simplr.layout.mAssembleLayout({
                        component: "promoInColumn",
                        tokens: {
                            productCode: e.Code,
                            productName: e.Name,
                            productDescription: e.Description,
                            productVariants: g,
                            productQty: b.qty
                        }
                    })) : ""
                } else return ""
            },
            callback: function(b) {
                killConfig.isActive("stJude") || a("#js-sidePromo").remove();
                var d = true,
                    e = site.data.sidePromo && site.data.sidePromo.productCode;
                a.each(jsDPZ.app.order.getOrder().data.Details.Variants, function(a, b) {
                    var j = jsDPZ.app.catalog.getCatalog();
                    d && j.getProduct(j.getVariant(b.Code).data.ProductCode).data.Code == e && (d = false)
                });
                d || a("#js-sidePromo").hide();
                a("form", b).submit(function(d) {
                    d.preventDefault();
                    d = {
                        STJUDE1: " 1dollar",
                        STJUDE2: " 2dollar",
                        STJUDE5: " 5dollar",
                        STJUDE10: " 10dollar"
                    };
                    a("input[type='radio']", this).val();
                    var e = simplr.form.mGetValues(b),
                        j = site.catalogTools.formDataToVariantData(e),
                        e = site.catalogTools.orderVariantToURLParameterString(j),
                        d = d[j.Code] ? d[j.Code] : "";
                    site.trigger.onEvent({
                        uri: "/Rightnav/StJude/AddProduct/" + a("input[type='radio']",
                            this).val(),
                        title: "Right Nav St Jude Upsell Add Product" + d,
                        group: "Right Nav Upsell",
                        subGroup: "Upsell Add Product"
                    });
                    simplr.controller.mRouteAndExecute("/order/variant/new" + e)
                })
            }
        }
    })
})(jQuery);

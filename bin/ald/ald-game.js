! function() {
	function e() {
		function e(e) {
			return !/^\d+(.\d+)*$/.test(e.stageId) || e.stageId.length > 32 ? (console.warn("关卡stageId必须符合传参规则,请参考文档。"), !1) : !("string" !== s(e.stageName) || e.stageName.length > 32) || (console.warn("关卡名称为必传字段,且长度小于32个字符,请参考文档"), !1)
		}
		var t = "",
			n = "",
			r = 0;
		this.onStart = function(a) {
			if (e(a)) {
				var o = {};
				r = Date.now(), o.sid = a.stageId, o.snm = a.stageName, o.state = "start", n = "" + Date.now() + Math.floor(1e7 * Math.random()), t = o, ("string" === s(a.userId) && a.userId) < 32 && (this.uid = a.uid), this.request()
			}
		}, this.onRunning = function(n) {
			if (e(n)) {
				var r = {
					params: {}
				};
				if (("string" === s(n.userId) && n.userId) < 32 && (this.uid = n.uid), !s(n.event) && C.join(",").indexOf(n.event + ",") != -1) return void C.join(",");
				if (r.event = n.event, "object" === s(n.params)) {
					if ("string" !== s(n.params.itemName) || n.params.itemName.length > 32) return void console.warn("道具/商品名称为必传字段，且长度小于32个字符，详情请参考文档");
					r.params.itnm = n.params.itemName, "string" === s(n.params.itemId) && n.params.itemId.length < 32 && (r.params.itid = n.params.itemId), "number" === s(n.params.itemCount) && n.params.itemCount.length < 32 ? r.params.itco = n.params.itemCount : r.params.itco = 1, n.event.indexOf("pay") !== -1 && ("number" === s(n.params.itemMoney) && n.params.itemMoney.length < 32 ? r.params.money = n.params.itemMoney : r.params.money = 0), "string" === s(n.params.desc) && n.params.desc.length < 64 && (r.params.desc = n.params.desc), r.state = "running", r.sid = n.stageId, r.snm = n.stageName, t = r, this.request()
				}
			}
		}, this.onEnd = function(n) {
			if (e(n)) {
				var a = {};
				if (a.state = "end", ("string" === s(n.userId) && n.userId) < 32 && (this.uid = n.uid), !s(n.event) && E.join(",").indexOf(n.event + ",") !== -1) return void E.join(",");
				a.sid = n.stageId, a.snm = n.stageName, a.event = n.event, a.sdr = 0 !== r ? Date.now() - r : "", a.params = {}, "object" === s(n.params) && "string" === s(n.params.desc) && n.params.desc.length < 64 && (a.params.desc = n.params.desc), t = a, this.request()
			}
		}, this.request = function() {
			var e = d(v);
			t.ss = n, e.ct = t, c(e, "screen")
		}
	}

	function t() {
		return new Promise(function(e, t) {
			wx.getSetting({
				success: function(t) {
					t.authSetting["scope.userInfo"] ? wx.getUserInfo({
						success: function(t) {
							O = f(t.userInfo.avatarUrl.split("/")), e(t)
						},
						fail: function() {
							e("")
						}
					}) : e("")
				},
				fail: function() {
					e("")
				}
			})
		})
	}

	function n() {
		return new Promise(function(e, t) {
			wx.getNetworkType({
				success: function(t) {
					e(t)
				},
				fail: function() {
					e("")
				}
			})
		})
	}

	function r() {
		return new Promise(function(e, t) {
			"1044" == x.scene ? wx.getShareInfo({
				shareTicket: x.shareTicket,
				success: function(t) {
					e(t)
				},
				fail: function() {
					e("")
				}
			}) : e("")
		})
	}

	function a() {
		return new Promise(function(e, t) {
			g.getLocation ? wx.getLocation({
				success: function(t) {
					e(t)
				},
				fail: function() {
					e("")
				}
			}) : wx.getSetting({
				success: function(t) {
					t.authSetting["scope.userLocation"] ? (wx.getLocation({
						success: function(t) {
							e(t)
						},
						fail: function() {
							e("")
						}
					}), e("")) : e("")
				},
				fail: function() {
					e("")
				}
			})
		})
	}

	function s(e) {
		function t(e) {
			return Object.prototype.toString.call(e)
		}
		var n = {};
		return "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function(e, t) {
				n["[object " + e + "]"] = e.toLowerCase()
			}),
			function() {
				return null == e ? e : "object" == typeof e || "function" == typeof e ? n[t.call(e)] || "object" : typeof e
			}()
	}

	function o() {
		function e() {
			return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
		}
		return e() + e() + e() + e() + e() + e() + e() + e()
	}

	function i() {
		this.concurrency = 4, this.queue = [], this.tasks = [], this.activeCount = 0;
		var e = this;
		this.push = function(t) {
			this.tasks.push(new Promise(function(n, r) {
				var a = function() {
					e.activeCount++, t().then(function(e) {
						n(e)
					}).then(function() {
						e.next()
					})
				};
				e.activeCount < e.concurrency ? a() : e.queue.push(a)
			}))
		}, this.all = function() {
			return Promise.all(this.tasks)
		}, this.next = function() {
			e.activeCount--, e.queue.length > 0 && e.queue.shift()()
		}
	}

	function c(e, t) {
		function n() {
			return new Promise(function(t, n) {
				wx.request({
					url: "https://" + h + ".aldwx.com/d.html",
					data: e,
					header: {
						se: w || "",
						op: _ || "",
						img: O || ""
					},
					method: "GET",
					fail: function() {
						t("")
					},
					success: function(e) {
						t(200 == e.statusCode ? "" : "status error")
					}
				})
			})
		}
		S++, e.as = b, e.at = I, e.rq_c = S, e.ifo = p, e.ak = g.app_key, e.uu = m, e.v = l, e.st = Date.now(), e.ev = t, e.wsr = x, "" !== u(e.ufo) && (e.ufo = e.ufo), e.ec = y, wx.Queue.push(n)
	}

	function u(e) {
		if (void 0 === e || "" === e) return "";
		var t = {};
		for (var n in e) "rawData" != n && "errMsg" != n && (t[n] = e[n]);
		return t
	}

	function d(e) {
		var t = {};
		for (var n in e) t[n] = e[n];
		return t
	}

	function f(e) {
		for (var t = "", n = 0; n < e.length; n++) e[n].length > t.length && (t = e[n]);
		return t
	}
	var l = "2.0.0",
		h = "glog",
		g = require("./ald-game-conf");
	"" === g.app_key && console.error("请在配置文件中填写您的app_key"), g.app_key = g.app_key.replace(/\s/g, ""),
		function() {
			wx.request({
				url: "https://" + h + ".aldwx.com/config/app.json",
				method: "GET",
				success: function(e) {
					200 === e.statusCode && (e.data.version != l && console.warn("您的SDK不是最新版本，请尽快升级！"), e.data.warn && console.warn(e.data.warn), e.data.error && console.error(e.data.error))
				}
			})
		}();
	var p = "",
		m = function() {
			var e = "";
			try {
				e = wx.getStorageSync("aldstat_uuid"), wx.setStorageSync("ald_ifo", !0)
			} catch (t) {
				e = "uuid_getstoragesync"
			}
			if (e) p = !1;
			else {
				e = o(), p = !0;
				try {
					wx.setStorageSync("aldstat_uuid", e)
				} catch (e) {
					wx.setStorageSync("aldstat_uuid", "uuid_getstoragesync")
				}
			}
			return e
		}(),
		v = {},
		w = "",
		_ = "",
		y = 0,
		S = "",
		x = wx.getLaunchOptionsSync(),
		q = Date.now(),
		I = "" + Date.now() + Math.floor(1e7 * Math.random()),
		b = "" + Date.now() + Math.floor(1e7 * Math.random()),
		M = 0,
		k = "",
		O = "",
		j = !0,
		D = !1,
		N = ["aldSendEvent", "aldOnShareAppMessage", "aldShareAppMessage", "aldSendSession", "aldSendOpenid", "aldLevelEvent"],
		C = ["payStart", "paySuccess", "payFail", "die", "revive", "tools", "award"],
		E = ["complete", "fail"];
	void 0 === wx.Queue && (wx.Queue = new i, wx.Queue.all()),
		function() {
			return Promise.all([t(), n(), a()])
		}().then(function(e) {
			"" !== e[2] ? (v.lat = e[2].latitude || "", v.lng = e[2].longitude || "", v.spd = e[2].speed || "") : (v.lat = "", v.lng = "", v.spd = ""), "" !== e[1] ? v.nt = e[1].networkType || "" : v.nt = "";
			var t = d(v);
			"" !== e[0] && (t.ufo = e[0], k = e[0]), c(t, "init")
		}), wx.onShow(function(e) {
			if (x = e, M = Date.now(), !j && !D) {
				I = "" + Date.now() + Math.floor(1e7 * Math.random()), p = !1;
				try {
					wx.setStorageSync("ald_ifo", !1)
				} catch (e) {}
			}
			j = !1, D = !1;
			var t = d(v),
				n = d(v);
			t.sm = M - q, e.query.ald_share_src && e.shareTicket && "1044" === e.scene ? (n.tp = "ald_share_click", r().then(function(e) {
				n.ct = e, c(n, "event")
			})) : e.query.ald_share_src && (n.tp = "ald_share_click", n.ct = "1", c(n, "event")), c(t, "show")
		}), wx.onHide(function() {
			var e = d(v);
			e.dr = Date.now() - M, "" === k ? wx.getSetting({
				success: function(t) {
					t.authSetting["scope.userInfo"] ? wx.getUserInfo({
						success: function(t) {
							e.ufo = t, k = t, O = f(t.userInfo.avatarUrl.split("/")), c(e, "hide")
						}
					}) : c(e, "hide")
				}
			}) : c(e, "hide")
		}), wx.onError(function(e) {
			var t = d(v);
			t.tp = "ald_error_message", t.ct = e, y++, c(t, "event")
		});
	var P = {
		aldSendEvent: function(e, t) {
			var n = d(v);
			"" !== e && "string" == typeof e && e.length <= 255 ? (n.tp = e, "string" == typeof t && t.length <= 255 ? (n.ct = String(t), c(n, "event")) : "object" == typeof t ? (JSON.stringify(t).length >= 255 && console.error("自定义事件参数不能超过255个字符"), n.ct = JSON.stringify(t), c(n, "event")) : void 0 === t || "" === t ? c(n, "event") : console.error("事件参数必须为String,Object类型,且参数长度不能超过255个字符")) : console.error("事件名称必须为String类型且不能超过255个字符")
		},
		aldOnShareAppMessage: function(e) {
			wx.onShareAppMessage(function() {
				D = !0;
				var t = e(),
					n = "";
				n = void 0 !== x.query.ald_share_src ? void 0 !== t.query ? (x.query.ald_share_src.indexOf(m), t.query + "&ald_share_src=" + x.query.ald_share_src + "," + m) : (x.query.ald_share_src.indexOf(m), "ald_share_src=" + x.query.ald_share_src + "," + m) : void 0 !== t.query ? t.query + "&ald_share_src=" + m : "ald_share_src=" + m, "undefined" != s(t.ald_desc) && (n += "&ald_desc=" + t.ald_desc), t.query = n;
				var r = d(v);
				return r.ct = t, r.ct.sho = 1, r.tp = "ald_share_chain", c(r, "event"), t
			})
		},
		aldShareAppMessage: function(e) {
			D = !0;
			var t = e,
				n = "";
			n = void 0 !== x.query.ald_share_src ? void 0 !== t.query ? (x.query.ald_share_src.indexOf(m), t.query + "&ald_share_src=" + x.query.ald_share_src + "," + m) : (x.query.ald_share_src.indexOf(m), "ald_share_src=" + x.query.ald_share_src + "," + m) : void 0 !== t.query ? t.query + "&ald_share_src=" + m : "ald_share_src=" + m;
			var r = d(v);
			"undefined" != s(t.ald_desc) && (n += "&ald_desc=" + t.ald_desc), t.query = n, r.ct = t, r.tp = "ald_share_chain", c(r, "event"), wx.shareAppMessage(t)
		},
		aldSendSession: function(e) {
			if ("" === e || !e) return void console.error("请传入从后台获取的session_key");
			var t = d(v);
			t.tp = "session", t.ct = "session", w = e, "" === k ? wx.getSetting({
				success: function(e) {
					e.authSetting["scope.userInfo"] ? wx.getUserInfo({
						success: function(e) {
							t.ufo = e, c(t, "event")
						}
					}) : c(t, "event")
				}
			}) : (t.ufo = k, "" !== k && (t.gid = ""), c(t, "event"))
		},
		aldSendOpenid: function(e) {
			if ("" === e || !e) return void console.error("openID不能为空");
			_ = e;
			var t = d(v);
			t.tp = "openid", t.ct = "openid", c(t, "event")
		}
	};
	wx.aldStage = new e;
	for (var L = 0; L < N.length; L++) ! function(e, t) {
		Object.defineProperty(wx, e, {
			value: t,
			writable: !1,
			enumerable: !0,
			configurable: !0
		})
	}(N[L], P[N[L]]);
	try {
		var A = wx.getSystemInfoSync();
		v.br = A.brand || "", v.md = A.model, v.pr = A.pixelRatio, v.sw = A.screenWidth, v.sh = A.screenHeight, v.ww = A.windowWidth, v.wh = A.windowHeight, v.lang = A.language, v.wv = A.version, v.sv = A.system, v.wvv = A.platform, v.fs = A.fontSizeSetting, v.wsdk = A.SDKVersion, v.bh = A.benchmarkLevel || "", v.bt = A.battery || "", v.wf = A.wifiSignal || "", v.lng = "", v.lat = "", v.nt = "", v.spd = "", v.ufo = ""
	} catch (e) {}
}();
(function () {
    'use strict';

    class StaticData {
        static getLevelData(p) {
            if (this.levels == null || this.levels.length <= 0 || p >= this.levels.length) {
                return null;
            }
            return this.levels[p];
        }
        static setIsIphoneX(is) {
            this.gameHeight = 750 * Laya.Browser.clientHeight / Laya.Browser.clientWidth;
            this.clientScale = this.gameHeight / Laya.Browser.clientHeight;
            this.heightOffsetScale = (this.gameHeight - 1334) / (1624 - 1334);
            if (this.gameHeight - 1334 > 0) {
                this.offY = (this.gameHeight - 1334) / 2;
            }
            this.isIphoneX = is;
            if (!is) {
                if (Laya.Browser.clientHeight / Laya.Browser.clientWidth > 2) {
                    this.isIphoneX = true;
                }
            }
            console.log("IsIphoneX=", this.isIphoneX);
            console.log("size Laya.Browser.client:", Laya.Browser.clientWidth, Laya.Browser.clientHeight);
            console.log("size game:", this.gameWidth, this.gameHeight);
            console.log("size stage:", Laya.stage.width, Laya.stage.height);
            console.log("size clientScale:", this.clientScale);
            console.log("size heightOffsetScale:", this.heightOffsetScale);
            console.log("size offY:", this.offY);
        }
        static getGameListSize() {
            if (StaticData.gameList == null) {
                return 0;
            }
            else {
                return StaticData.gameList.length;
            }
        }
        static getGameListRadom(num) {
            if (num == 0) {
                return null;
            }
            let ids = [];
            let newGameList = [];
            if (StaticData.gameList != null && StaticData.getGameListSize() >= num) {
                let goon = true;
                while (goon) {
                    let i = Number((Math.random() * (StaticData.getGameListSize() - 1)).toFixed());
                    if (ids.indexOf(i) < 0) {
                        ids.push(i);
                        newGameList.push(StaticData.gameList[i]);
                    }
                    if (ids.length == num) {
                        goon = false;
                    }
                }
                return newGameList;
            }
            else {
                return null;
            }
        }
    }
    StaticData.LEVEL = "LEVEL";
    StaticData.COIN = "COIN";
    StaticData.coin = 0;
    StaticData.allowDie = true;
    StaticData.level = 1;
    StaticData.isIphoneX = false;
    StaticData.clientScale = 1;
    StaticData.heightOffsetScale = 0;
    StaticData.offY = 0;
    StaticData.gameWidth = 750;
    StaticData.gameHeight = 1334;
    StaticData.isMisLead = false;
    StaticData.AutoSkipToSign = true;
    StaticData.AutoSkipToSkin = true;
    StaticData.ChangeFriendGetCoin = 200;
    StaticData.GetCoinTimesNumber = 0;
    StaticData.GetCoinTimes = 3;
    StaticData.carOrEggFree = false;

    class SingtonClass {
        constructor() { }
        static Instance(...param) {
            let Class = this;
            if (!Class._instance) {
                Class._instance = new Class(...param);
            }
            return Class._instance;
        }
    }

    const roundRectPath = (x, y, w, h, r) => {
        return [
            ["moveTo", x + r, 0],
            ["lineTo", x + w - r, 0],
            ["arcTo", x + w, y, x + w, y + r, r],
            ["lineTo", x + w, y + h - r],
            ["arcTo", x + w, y + h, x + w - r, y + h, r],
            ["lineTo", x + r, y + h],
            ["arcTo", x, y + h, x, y + h - r, r],
            ["lineTo", x, y + r],
            ["arcTo", x, y, x + r, y, r],
            ["closePath"]
        ];
    };

    class TipsUtil extends SingtonClass {
        constructor() {
            super();
            this.root = null;
            this.LoadingBox = null;
            this.LoadingTimer = null;
            if (!this.root) {
                this.root = Laya.stage.addChild(new Laya.Sprite());
                this.root.zOrder = 1001;
            }
        }
        static alert(content, options = {}, yes = null) {
            TipsUtil.Instance().alert(content, options, yes);
        }
        alert(content, options = {}, yes = null) { }
        static msg(content, options = {}, end = null) {
            TipsUtil.Instance().msg(content, options, end);
        }
        msg(content, options = { time: 1500 }, end = null) {
            let box = this.root.addChild(new Laya.Box());
            let bg = box.addChild(new Laya.Sprite());
            let txt = box.addChild(new Laya.Label());
            txt.text = content;
            txt.font = "SimHei";
            txt.color = "#ffffff";
            txt.padding = "15,15,15,15";
            txt.fontSize = 30;
            box.width = bg.width = txt.width;
            box.height = bg.height = txt.height;
            bg.graphics.drawPath(0, 0, roundRectPath(0, 0, txt.width, txt.height, 10), { fillStyle: "#000000" });
            bg.alpha = 0.5;
            box.x = (Laya.stage.width - box.width) / 2;
            box.y = (Laya.stage.height - box.height) / 2;
            setTimeout(() => {
                box.removeSelf();
                if (end)
                    end();
            }, options.time || 1500);
        }
        static confirm(content, options = {}, yes = null, cancel = null) {
            TipsUtil.Instance().confirm(content, options, yes, cancel);
        }
        confirm(content, options = {}, yes = null, cancel = null) {
            let box = this.root.addChild(new Laya.Box());
            let imgBg = box.addChild(new Laya.Sprite());
            let txtContent = box.addChild(new Laya.Label());
            let txtTitle = box.addChild(new Laya.Label());
            let txtBtnCancel = box.addChild(new Laya.Label());
            let txtBtnYes = box.addChild(new Laya.Label());
            txtTitle.dataSource = txtBtnCancel.dataSource = txtBtnYes.dataSource = txtContent.dataSource = {
                padding: "20,20,20,20",
                font: "SimHei",
                fontSize: 30,
                width: Laya.stage.width * 0.6,
                color: "#000000",
                align: "center",
                x: 0,
                y: 0,
                text: "提示",
                overflow: "hidden",
            };
            txtContent.dataSource = {
                padding: "20,20,40,20",
                overflow: "",
                fontSize: 25,
                wordWrap: true,
                text: content,
                color: options.contentColor || "#5A5A5A",
                y: txtTitle.height,
            };
            txtBtnCancel.dataSource = {
                text: options.cancelText || '否',
                width: txtTitle.width / 2,
                y: txtTitle.height + txtContent.height,
            };
            txtBtnYes.dataSource = {
                text: options.yesText || '是',
                width: txtTitle.width / 2,
                color: "#169C24",
                y: txtTitle.height + txtContent.height,
                x: txtTitle.width / 2,
            };
            box.dataSource = {
                width: Laya.stage.width * 0.6,
                height: txtTitle.height + txtContent.height + txtBtnYes.height,
                x: Laya.stage.width * 0.2,
                y: (Laya.stage.height - txtTitle.height - txtContent.height - txtBtnYes.height) / 2,
            };
            imgBg.graphics.drawPath(0, 0, roundRectPath(0, 0, box.width, box.height, 10), { fillStyle: "#FFFFFF" });
            imgBg.graphics.drawLine(0, txtTitle.height + txtContent.height, box.width, txtTitle.height + txtContent.height, "#D2D2D2", 1);
            imgBg.graphics.drawLine(box.width / 2, txtTitle.height + txtContent.height, box.width / 2, box.height, "#D2D2D2", 1);
            txtBtnCancel.on(Laya.Event.CLICK, this, (e) => { box.removeSelf(); if (cancel)
                cancel(); });
            txtBtnYes.on(Laya.Event.CLICK, this, (e) => { box.removeSelf(); if (yes)
                yes(); });
        }
        static showLoading() { TipsUtil.Instance().showLoading(); }
        static hideLoading() { TipsUtil.Instance().hideLoading(); }
        showLoading() {
            if (!this.LoadingBox) {
                let arr = [
                    { x: Math.SQRT1_2, y: Math.SQRT1_2 }, { x: 0, y: 1 },
                    { x: -Math.SQRT1_2, y: Math.SQRT1_2 }, { x: -1, y: 0 },
                    { x: -Math.SQRT1_2, y: -Math.SQRT1_2 }, { x: 0, y: -1 },
                    { x: Math.SQRT1_2, y: -Math.SQRT1_2 }, { x: 1, y: 0 },
                ];
                this.LoadingBox = this.root.addChild(new Laya.Box());
                this.LoadingBox.width = this.LoadingBox.height = 120;
                this.LoadingBox.anchorX = this.LoadingBox.anchorY = 0.5;
                this.LoadingBox.x = Laya.stage.width / 2;
                this.LoadingBox.y = Laya.stage.height / 2;
                for (let i = 0; i < 8; i++) {
                    this.LoadingBox.graphics.drawCircle(arr[i].x * 60 + 60, arr[i].y * 60 + 60, 14 - i, "rgba(255,255,255," + (1 - 0.05 * i) + ")");
                }
            }
            this.LoadingBox.visible = true;
            this.LoadingTimer && clearInterval(this.LoadingTimer);
            this.LoadingTimer = setInterval(() => {
                this.LoadingBox.rotation -= 2;
            }, 30);
        }
        hideLoading() {
            this.LoadingTimer && clearInterval(this.LoadingTimer);
            this.LoadingBox.visible = false;
        }
    }

    class md5 {
        constructor() {
            this.hexcase = 0;
            this.b64pad = "";
        }
        hex_md5(s) { return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(s))); }
        b64_md5(s) { return this.rstr2b64(this.rstr_md5(this.str2rstr_utf8(s))); }
        any_md5(s, e) { return this.rstr2any(this.rstr_md5(this.str2rstr_utf8(s)), e); }
        hex_hmac_md5(k, d) { return this.rstr2hex(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); }
        b64_hmac_md5(k, d) { return this.rstr2b64(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); }
        any_hmac_md5(k, d, e) { return this.rstr2any(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)), e); }
        md5_vm_test() {
            return this.hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
        }
        rstr_md5(s) {
            return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
        }
        rstr_hmac_md5(key, data) {
            var bkey = this.rstr2binl(key);
            if (bkey.length > 16)
                bkey = this.binl_md5(bkey, key.length * 8);
            var ipad = Array(16), opad = Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }
            var hash = this.binl_md5(ipad.concat(this.rstr2binl(data)), 512 + data.length * 8);
            return this.binl2rstr(this.binl_md5(opad.concat(hash), 512 + 128));
        }
        rstr2hex(input) {
            try {
                this.hexcase;
            }
            catch (e) {
                this.hexcase = 0;
            }
            var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var output = "";
            var x;
            for (var i = 0; i < input.length; i++) {
                x = input.charCodeAt(i);
                output += hex_tab.charAt((x >>> 4) & 0x0F)
                    + hex_tab.charAt(x & 0x0F);
            }
            return output;
        }
        rstr2b64(input) {
            try {
                this.b64pad;
            }
            catch (e) {
                this.b64pad = '';
            }
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var output = "";
            var len = input.length;
            for (var i = 0; i < len; i += 3) {
                var triplet = (input.charCodeAt(i) << 16)
                    | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0)
                    | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > input.length * 8)
                        output += this.b64pad;
                    else
                        output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
                }
            }
            return output;
        }
        rstr2any(input, encoding) {
            var divisor = encoding.length;
            var i, j, q, x, quotient;
            var dividend = Array(Math.ceil(input.length / 2));
            for (i = 0; i < dividend.length; i++) {
                dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
            }
            var full_length = Math.ceil(input.length * 8 /
                (Math.log(encoding.length) / Math.log(2)));
            var remainders = Array(full_length);
            for (j = 0; j < full_length; j++) {
                quotient = Array();
                x = 0;
                for (i = 0; i < dividend.length; i++) {
                    x = (x << 16) + dividend[i];
                    q = Math.floor(x / divisor);
                    x -= q * divisor;
                    if (quotient.length > 0 || q > 0)
                        quotient[quotient.length] = q;
                }
                remainders[j] = x;
                dividend = quotient;
            }
            var output = "";
            for (i = remainders.length - 1; i >= 0; i--)
                output += encoding.charAt(remainders[i]);
            return output;
        }
        str2rstr_utf8(input) {
            var output = "";
            var i = -1;
            var x, y;
            while (++i < input.length) {
                x = input.charCodeAt(i);
                y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
                if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
                    x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                    i++;
                }
                if (x <= 0x7F)
                    output += String.fromCharCode(x);
                else if (x <= 0x7FF)
                    output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
                else if (x <= 0xFFFF)
                    output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
                else if (x <= 0x1FFFFF)
                    output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
            }
            return output;
        }
        str2rstr_utf16le(input) {
            var output = "";
            for (var i = 0; i < input.length; i++)
                output += String.fromCharCode(input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
            return output;
        }
        str2rstr_utf16be(input) {
            var output = "";
            for (var i = 0; i < input.length; i++)
                output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF, input.charCodeAt(i) & 0xFF);
            return output;
        }
        rstr2binl(input) {
            var output = Array(input.length >> 2);
            for (var i = 0; i < output.length; i++)
                output[i] = 0;
            for (var i = 0; i < input.length * 8; i += 8)
                output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
            return output;
        }
        binl2rstr(input) {
            var output = "";
            for (var i = 0; i < input.length * 32; i += 8)
                output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
            return output;
        }
        binl_md5(x, len) {
            x[len >> 5] |= 0x80 << ((len) % 32);
            x[(((len + 64) >>> 9) << 4) + 14] = len;
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;
            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
                a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
                a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
                a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
                a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
                a = this.safe_add(a, olda);
                b = this.safe_add(b, oldb);
                c = this.safe_add(c, oldc);
                d = this.safe_add(d, oldd);
            }
            return [a, b, c, d];
        }
        md5_cmn(q, a, b, x, s, t) {
            return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
        }
        md5_ff(a, b, c, d, x, s, t) {
            return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }
        md5_gg(a, b, c, d, x, s, t) {
            return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }
        md5_hh(a, b, c, d, x, s, t) {
            return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
        }
        md5_ii(a, b, c, d, x, s, t) {
            return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        }
        safe_add(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }
        bit_rol(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        }
    }

    class HttpUtil {
        constructor() {
            this.TOKEN = '';
            HttpUtil._instance = this;
        }
        static get Instance() {
            if (!HttpUtil._instance)
                new HttpUtil();
            return HttpUtil._instance;
        }
        static request(param) {
            HttpUtil.Instance.request(param);
        }
        request(param) {
            param = this.param(param);
            let r = new Laya.HttpRequest();
            r.once(Laya.Event.COMPLETE, this, () => { if (param.complete)
                param.complete(r.data); });
            r.once(Laya.Event.ERROR, this, err => { if (param.error)
                param.error(err); });
            r.send(param.url, this.obj2str(param.data), param.method, param.responseType);
        }
        param(param = {}) {
            let d = param.data || {};
            param.data = d;
            param.method = param.method || 'post';
            param.responseType = param.responseType || 'json';
            return param;
        }
        objSort(param) {
            var newkeyArray = Object.keys(param).sort();
            var newParam = {};
            for (var i = 0; i < newkeyArray.length; i++) {
                newParam[newkeyArray[i]] = param[newkeyArray[i]];
            }
            return newParam;
        }
        createSign(param) {
            for (let i in ['sign', 'id', 'action', 'api', 'version'])
                if (typeof (param[i]) != "undefined")
                    delete param[i];
            var newParam = this.objSort(param);
            var signString = '';
            for (var i in newParam) {
                signString += i + newParam[i];
            }
            return new md5().hex_md5(signString);
        }
        obj2str(param) {
            let str = '';
            for (let k in param) {
                str += '&' + k + '=' + param[k];
            }
            return str.substring(1);
        }
    }

    class LocalStorageUtil extends SingtonClass {
        constructor() {
            super();
        }
        static add(key, val) {
            Laya.LocalStorage.setItem(LocalStorageUtil.rootPath + key, val);
        }
        static remove(key) {
            Laya.LocalStorage.removeItem(LocalStorageUtil.rootPath + key);
        }
        static getString(key) {
            return Laya.LocalStorage.getItem(LocalStorageUtil.rootPath + key);
        }
        static getNumber(key) {
            let val = Laya.LocalStorage.getItem(LocalStorageUtil.rootPath + key);
            if (val == null || val == "") {
                return 0;
            }
            else {
                return Number(val);
            }
        }
        static getBoolean(key, df = false) {
            let val = Laya.LocalStorage.getItem(LocalStorageUtil.rootPath + key);
            console.log("val=", val);
            if (val != null && val != "") {
                return val == "1";
            }
            else {
                return df;
            }
        }
        static setBoolean(key, is) {
            Laya.LocalStorage.setItem(LocalStorageUtil.rootPath + key, is ? "1" : "0");
        }
    }
    LocalStorageUtil.rootPath = "motor";

    class SoundUtil extends SingtonClass {
        static init() {
            SoundUtil.isPlayMusic = LocalStorageUtil.getBoolean("isPlayMusic", true);
            SoundUtil.playBgm();
        }
        static stopMusic() {
            if (SoundUtil.isPlayMusic) {
                SoundUtil.isPlayMusic = false;
                LocalStorageUtil.setBoolean("isPlayMusic", SoundUtil.isPlayMusic);
                Laya.SoundManager.stopMusic();
                Laya.SoundManager.stopAllSound();
                Laya.timer.once(50, this, () => {
                    Laya.SoundManager.playMusic("music/bgm.mp3", 0, null);
                    Laya.SoundManager.stopAll();
                });
            }
        }
        static playMusic() {
            if (!SoundUtil.isPlayMusic) {
                SoundUtil.isPlayMusic = true;
                LocalStorageUtil.setBoolean("isPlayMusic", SoundUtil.isPlayMusic);
                SoundUtil.playBgm();
            }
        }
        static playBgm() {
            if (SoundUtil.isPlayMusic) {
                Laya.SoundManager.stopMusic();
                Laya.SoundManager.playMusic("music/bgm.mp3", 0, null);
            }
        }
        static playCoin() {
            if (SoundUtil.isPlayMusic) {
                Laya.SoundManager.stopSound("music/coin.wav");
                Laya.SoundManager.playSound("music/coin.wav");
            }
        }
        static playStartGame() {
            if (SoundUtil.isPlayMusic) {
                Laya.SoundManager.stopSound("music/start.wav");
                Laya.SoundManager.playSound("music/start.wav");
            }
        }
    }

    class ThreePartyUtil extends SingtonClass {
        static showVidoeAd() {
            try {
                console.log("app通信 无回调");
                if (GamePlatform.platformName == GamePlatform.IOS) {
                    var bridge = Laya.Browser.window["PlatformClass"].createClass("JSBridge");
                    bridge.call("showVideoAd:", "接收到数据----123");
                }
                else if (GamePlatform.platformName == GamePlatform.ANDROID) {
                    var bridge = Laya.Browser.window["PlatformClass"].createClass("demo.JSBridge");
                    bridge.call("showVideoAd", "接收到数据----123");
                }
            }
            catch (error) { }
        }
        static showVdWithCallBack(options) {
            try {
                console.log("app通信 有回调 options=", options);
                if (GamePlatform.platformName == GamePlatform.ANDROID) {
                    var bridge = Laya.Browser.window["PlatformClass"].createClass("demo.JSBridge");
                    bridge.callWithBack((obj) => {
                        console.log("return obj=", obj);
                        if (obj && obj == 1) {
                            options.success && options.success();
                        }
                        else {
                            options.fail && options.fail();
                        }
                    }, "showVideoAdWithCallBack", String(options.type));
                }
                else if (GamePlatform.platformName == GamePlatform.IOS) {
                    var bridge = Laya.Browser.window["PlatformClass"].createClass("JSBridge");
                    bridge.callWithBack((obj) => {
                        console.log("return obj=", obj);
                        if (obj && obj == 1) {
                            options.success && options.success();
                        }
                        else {
                            options.fail && options.fail();
                        }
                    }, "showVideoAdWithCallBack:", options.type);
                }
            }
            catch (error) { }
        }
    }

    class OppoADUtil extends SingtonClass {
        static init() {
            if (GamePlatform.platformName == GamePlatform.OPPO) {
                OppoADUtil.initAD();
                OppoADUtil.initVideo();
            }
        }
        static initAD() {
            GamePlatform.platform.initAdService({
                appId: OppoADUtil.APP_ID,
                isDebug: false,
                success: function (res) {
                    console.log("oppo initAD success");
                },
                fail: function (res) {
                    console.log("oppo initAD fail:" + res.code + res.msg);
                },
                complete: function (res) {
                    console.log("oppo initAD complete");
                }
            });
        }
        static initVideo() {
            OppoADUtil.videoAd = GamePlatform.platform.createRewardedVideoAd({
                posId: OppoADUtil.VIDEO_ID,
            });
            OppoADUtil.videoAd.load();
            OppoADUtil.videoAd.onLoad(() => {
                console.log("oppo video load success");
                if (OppoADUtil.videoAdIsLoad) {
                    OppoADUtil.video();
                }
                else {
                    OppoADUtil.videoAdIsLoad = true;
                }
            });
            OppoADUtil.videoAd.onVideoStart(() => {
                console.log("oppo video onVideoStart");
            });
            OppoADUtil.videoAd.onError((err) => {
                console.log("oppo video onError:", err);
                if (OppoADUtil.adOptions != null && OppoADUtil.adOptions != undefined && OppoADUtil.adOptions.error) {
                    OppoADUtil.adOptions.error();
                    SoundUtil.playBgm();
                    OppoADUtil.videoAdIsLoad = false;
                    OppoADUtil.videoAd.load();
                }
            });
            OppoADUtil.videoAd.onClose((res) => {
                console.log("oppo video onClose");
                if (res.isEnded) {
                    if (OppoADUtil.adOptions != null && OppoADUtil.adOptions != undefined && OppoADUtil.adOptions.success)
                        OppoADUtil.adOptions.success();
                }
                else {
                    if (OppoADUtil.adOptions != null && OppoADUtil.adOptions != undefined && OppoADUtil.adOptions.fail)
                        OppoADUtil.adOptions.fail();
                }
                SoundUtil.playBgm();
                OppoADUtil.videoAdIsLoad = false;
                OppoADUtil.videoAd.load();
            });
        }
        static video(options = {}) {
            if (OppoADUtil.videoAdIsLoad) {
                OppoADUtil.adOptions = options;
                OppoADUtil.videoAd.show();
            }
            else {
                OppoADUtil.videoAdIsLoad = true;
                OppoADUtil.videoAd.load();
            }
        }
        static initBanner() {
            if (OppoADUtil.isShowBanner) {
                return;
            }
            else {
                console.log("oppo initBanner");
                OppoADUtil.isShowBanner = true;
                Laya.timer.once(500, this, () => {
                    OppoADUtil.bannerAd = GamePlatform.platform.createBannerAd({
                        posId: OppoADUtil.BANNER_ID
                    });
                    OppoADUtil.bannerAd.show();
                });
            }
        }
        static showBanner() {
            if (!OppoADUtil.isShowBanner) {
                console.log("oppo showBanner");
                OppoADUtil.initBanner();
            }
        }
        static hideBanner() {
            Laya.timer.clearAll(this);
            if (OppoADUtil.bannerAd != null && OppoADUtil.isShowBanner) {
                console.log("oppo hideBanner");
                OppoADUtil.isShowBanner = false;
                OppoADUtil.bannerAd.destroy();
            }
        }
    }
    OppoADUtil.VIDEO_ID = "134256";
    OppoADUtil.BANNER_ID = "134254";
    OppoADUtil.APP_ID = "30213416";
    OppoADUtil.videoAdIsLoad = false;
    OppoADUtil.isShowBanner = false;

    class WxADUtil extends SingtonClass {
        static init() {
            if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                WxADUtil.initVideo();
                if (GamePlatform.platformName == GamePlatform.WX) {
                    WxADUtil.initBanner();
                    WxADUtil.initStartBanner();
                }
                WxADUtil.initShare();
            }
        }
        static initVideo() {
            let id = Math.floor(Math.random() * this.ads.length);
            WxADUtil.rewardedVideoAd = GamePlatform.platform.createRewardedVideoAd(this.ads[id]);
            WxADUtil.rewardedVideoAd.load();
            WxADUtil.rewardedVideoAd.onClose(res => {
                if (res.isEnded) {
                    if (WxADUtil.adOptions != null && WxADUtil.adOptions != undefined && WxADUtil.adOptions.success)
                        WxADUtil.adOptions.success();
                }
                else {
                    if (WxADUtil.adOptions != null && WxADUtil.adOptions != undefined && WxADUtil.adOptions.fail)
                        WxADUtil.adOptions.fail();
                }
                SoundUtil.playBgm();
            });
            WxADUtil.rewardedVideoAd.onError(err => {
                console.log("ad onError:", err);
                if (WxADUtil.adOptions != null && WxADUtil.adOptions != undefined && WxADUtil.adOptions.error)
                    WxADUtil.adOptions.error();
                SoundUtil.playBgm();
            });
        }
        static initBanner() {
            if (WxADUtil.bannerAD != null) {
                WxADUtil.bannerAD.hide();
                WxADUtil.bannerAD.destroy();
            }
            WxADUtil.bannerAD = GamePlatform.platform.createBannerAd(WxADUtil.bannerObj);
            WxADUtil.bannerAD.offError();
            WxADUtil.bannerAD.offLoad();
            WxADUtil.bannerAD.offResize();
            WxADUtil.bannerAD.onError(err => {
                WxADUtil.loadTime++;
                console.log("wx initBanner onError");
                if (WxADUtil.loadTime <= 3) {
                    WxADUtil.initBanner();
                }
            });
            WxADUtil.bannerAD.onLoad(() => {
                WxADUtil.isLoad = true;
            });
            WxADUtil.bannerAD.onResize(() => {
                if (StaticData.isIphoneX) {
                    WxADUtil.bannerAD.style.top = wx.getSystemInfoSync().screenHeight - WxADUtil.bannerAD.style.realHeight - (50 / StaticData.clientScale);
                }
                else {
                    WxADUtil.bannerAD.style.top = wx.getSystemInfoSync().screenHeight - WxADUtil.bannerAD.style.realHeight;
                }
            });
        }
        static initStartBanner() {
            if (WxADUtil.startBannerAD != null) {
                WxADUtil.startBannerAD.hide();
                WxADUtil.startBannerAD.destroy();
            }
            WxADUtil.startBannerObj.style.width = 600 / StaticData.clientScale;
            WxADUtil.startBannerObj.style.left = (StaticData.gameWidth - 600) / StaticData.clientScale / 2;
            WxADUtil.startBannerAD = GamePlatform.platform.createBannerAd(WxADUtil.startBannerObj);
            WxADUtil.startBannerAD.offError();
            WxADUtil.startBannerAD.offLoad();
            WxADUtil.startBannerAD.offResize();
            WxADUtil.startBannerAD.onError(err => {
                WxADUtil.startLoadTime++;
                if (WxADUtil.startLoadTime <= 3) {
                    WxADUtil.initStartBanner();
                }
            });
            WxADUtil.startBannerAD.onLoad(() => {
                WxADUtil.isLoad = true;
            });
            WxADUtil.startBannerAD.onResize(() => {
                if (StaticData.isIphoneX) {
                    WxADUtil.startBannerAD.style.top = wx.getSystemInfoSync().screenHeight - WxADUtil.startBannerAD.style.realHeight - (50 / StaticData.clientScale);
                }
                else {
                    WxADUtil.startBannerAD.style.top = wx.getSystemInfoSync().screenHeight - WxADUtil.startBannerAD.style.realHeight;
                }
            });
        }
        static initShare() {
            GamePlatform.platform.showShareMenu({
                withShareTicket: true
            });
            GamePlatform.platform.onShareAppMessage(() => {
                if (GamePlatform.platformName == GamePlatform.WX) {
                    if (Laya.Browser.onWeiXin) {
                        let id = Math.floor(Math.random() * WxADUtil.WxShareData.length);
                        return {
                            title: WxADUtil.WxShareData[id].title,
                            imageUrlId: WxADUtil.WxShareData[id].id,
                            imageUrl: WxADUtil.WxShareData[id].url,
                        };
                    }
                }
            });
        }
        static getADMidleY() {
            if (WxADUtil.bannerAD == null) {
                return 0;
            }
            let top = WxADUtil.bannerAD.style.top;
            let h = WxADUtil.bannerAD.style.realHeight;
            let y = top + h / 2;
            return y * StaticData.clientScale;
        }
        static showBannerAd() {
            if (GamePlatform.platformName == GamePlatform.OPPO) {
                OppoADUtil.showBanner();
            }
            else {
                if (WxADUtil.bannerAD != null) {
                    WxADUtil.bannerAD.show();
                }
            }
        }
        static showStartBannerAd() {
            if (GamePlatform.platformName == GamePlatform.OPPO) {
                OppoADUtil.showBanner();
            }
            else {
                if (WxADUtil.startBannerAD != null) {
                    WxADUtil.startBannerAD.show();
                }
            }
        }
        static hideBannerAd() {
            if (GamePlatform.platformName == GamePlatform.OPPO) {
                OppoADUtil.hideBanner();
            }
            else {
                if (WxADUtil.bannerAD != null) {
                    WxADUtil.bannerAD.hide();
                }
                if (WxADUtil.startBannerAD != null) {
                    WxADUtil.startBannerAD.hide();
                }
            }
        }
        static adOrShare(options = {}) {
            if (GamePlatform.platformName == GamePlatform.OPPO) {
                OppoADUtil.video(options);
            }
            else {
                WxADUtil.video(options);
            }
        }
        static video(options = {}) {
            if (GamePlatform.platformName == GamePlatform.WX) {
                if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                    WxADUtil.adOptions = options;
                    WxADUtil.rewardedVideoAd.show();
                }
                else {
                    options.fail && options.fail();
                }
            }
            else if (GamePlatform.platformName == GamePlatform.IOS || GamePlatform.platformName == GamePlatform.ANDROID) {
                options.type = "video";
                ThreePartyUtil.showVdWithCallBack(options);
            }
            else {
                options.success && options.success();
            }
        }
        static share(options = {}) {
            if (GamePlatform.platformName == GamePlatform.WX) {
                if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                    let id = Math.floor(Math.random() * WxADUtil.WxShareData.length);
                    GamePlatform.platform.shareAppMessage({
                        title: WxADUtil.WxShareData[id].title,
                        imageUrlId: WxADUtil.WxShareData[id].id,
                        imageUrl: WxADUtil.WxShareData[id].url,
                    });
                    if (options.success) {
                        GamePlatform.platform.offShow(options.success);
                        GamePlatform.platform.onShow(options.success);
                    }
                }
            }
            else if (GamePlatform.platformName == GamePlatform.IOS || GamePlatform.platformName == GamePlatform.ANDROID) {
                options.type = "share";
                ThreePartyUtil.showVdWithCallBack(options);
            }
            else {
                options.success && options.success();
            }
        }
    }
    WxADUtil.isLoad = false;
    WxADUtil.maxShowAdTimes = 5;
    WxADUtil.loadTime = 0;
    WxADUtil.startLoadTime = 0;
    WxADUtil.realHeight = 0;
    WxADUtil.top = 0;
    WxADUtil.ads = [{
            adUnitId: 'adunit-3059d35561628657'
        }, {
            adUnitId: 'adunit-dc964c0a9729e4d9'
        }];
    WxADUtil.bannerObj = {
        adUnitId: 'adunit-5da1fd35bf9c4dec',
        style: {
            left: 0,
            top: StaticData.gameHeight - 300,
            width: 750
        },
        adIntervals: 30
    };
    WxADUtil.startBannerObj = {
        adUnitId: 'adunit-5da1fd35bf9c4dec',
        style: {
            left: 0,
            top: StaticData.gameHeight - 300,
            width: 600
        },
        adIntervals: 30
    };
    WxADUtil.WxShareData = [{
            title: "这个坑，你能出来算我输！",
            url: "https://mmocgame.qpic.cn/wechatgame/O1rMXa54WwYibS1faszaNQgoRfGKvh3APGZ4ol1WibIfXZzxHdIColibQ1p31sG5A1R/0",
            id: "hC6RQAwSRKWO8kEbBW2NNw"
        },
        {
            title: "车门已经焊死了，谁也别想下车！",
            url: "https://mmocgame.qpic.cn/wechatgame/O1rMXa54WwbPZtf0B4kCewuCwqxj3vqoH1WbfMOVCZesCcTFfLlBOp0suic4J618l/0",
            id: "yKhLLPqSSRKFLIQinvzt-g"
        }, {
            title: "道路千万条，安全第一条。行车不规范，蛋蛋两行泪~",
            url: "https://mmocgame.qpic.cn/wechatgame/O1rMXa54WwYhad1uPHrFQjCZ8kZqm06U27N2rHkHfdKsJPocRcntNmDIzkflcxcJ/0",
            id: "nmPzL9e1QZ2VfCc2q-BL2Q"
        }
    ];

    class GamePlatform extends SingtonClass {
        static init() {
            SoundUtil.init();
            switch (GamePlatform.platformName) {
                case GamePlatform.WX:
                    this.initWx();
                    break;
                case GamePlatform.QQ:
                    this.initQq();
                    break;
                case GamePlatform.OPPO:
                    this.initOppo();
                    break;
                case GamePlatform.VIVO:
                    this.initVivo();
                    break;
                case GamePlatform.IOS:
                    this.initIos();
                    break;
                case GamePlatform.ANDROID:
                    this.initAndroid();
                    break;
                default:
                    break;
            }
        }
        static initWx() {
            if (Laya.Browser.onWeiXin) {
                GamePlatform.platform = Laya.Browser.window.wx;
                GamePlatform.platform.getSystemInfo({
                    success: function (res) {
                        var model = res.model;
                        if (model.search(/iPhone X/i) != -1) {
                            StaticData.setIsIphoneX(true);
                        }
                        else {
                            StaticData.setIsIphoneX(false);
                        }
                    }
                });
                WxADUtil.init();
                GamePlatform.platform.onHide(() => {
                });
                GamePlatform.platform.onShow(() => {
                    SoundUtil.playBgm();
                });
                GamePlatform.openDataContext = new WxOpenDataContext();
            }
            else {
                StaticData.setIsIphoneX(false);
            }
        }
        static initQq() {
            if (Laya.Browser.onQQMiniGame) {
                GamePlatform.platform = Laya.Browser.window.qq;
                GamePlatform.platform.getSystemInfo({
                    success: function (res) {
                        var model = res.model;
                        if (model.search(/iPhone X/i) != -1) {
                            StaticData.setIsIphoneX(true);
                        }
                        else {
                            StaticData.setIsIphoneX(false);
                        }
                    }
                });
                WxADUtil.init();
                GamePlatform.platform.onHide(() => {
                });
                GamePlatform.platform.onShow(() => {
                    SoundUtil.playBgm();
                });
                GamePlatform.openDataContext = new WxOpenDataContext();
            }
            else {
                StaticData.setIsIphoneX(false);
            }
        }
        static initOppo() {
            StaticData.setIsIphoneX(false);
            GamePlatform.platform = Laya.Browser.window.qg;
            OppoADUtil.init();
            GamePlatform.platform.setEnableDebug({
                enableDebug: false
            });
        }
        static initVivo() { StaticData.setIsIphoneX(false); }
        static initIos() {
            StaticData.setIsIphoneX(false);
        }
        static initAndroid() {
            StaticData.setIsIphoneX(false);
        }
        static topBtnPos(view) {
            if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                let data = GamePlatform.platform.getMenuButtonBoundingClientRect();
                let off = (data.height * StaticData.clientScale - view.height) / 2;
                view.y = data.top * StaticData.clientScale + off;
            }
            else {
                view.y = 20;
            }
        }
    }
    GamePlatform.VIVO = "vivo";
    GamePlatform.OPPO = "oppo";
    GamePlatform.WX = "wx";
    GamePlatform.QQ = "qq";
    GamePlatform.IOS = "ios";
    GamePlatform.ANDROID = "android";
    GamePlatform.WB = "wb";
    GamePlatform.platformName = GamePlatform.WB;
    class WxOpenDataContext {
        createDisplayObject(type, width, height) { return new Laya.WXOpenDataViewer(); }
        ;
        postMessage(obj) { (new Laya.WXOpenDataViewer()).postMsg(obj); }
        ;
    }

    class Api {
        static getRootUrl() {
            if (GamePlatform.platformName == GamePlatform.QQ) {
                return "https://qq.xyxapi.com/home/lxdd";
            }
            else {
                return "https://lxdd.xyxapi.com";
            }
        }
    }
    Api.misleadUrl = Api.getRootUrl() + "/index.php?act=user";
    Api.loginUrl = Api.getRootUrl() + "/index.php?act=userinfo";
    Api.gameListUrl = Api.getRootUrl() + "/index.php?act=gamelist";
    Api.startGameUrl = Api.getRootUrl() + "/index.php?act=index";
    Api.endGameUrl = Api.getRootUrl() + "/index.php?act=end";
    Api.leadOutUrl = Api.getRootUrl() + "/index.php?act=game";
    Api.leadOutSuccessUrl = Api.getRootUrl() + "/index.php?act=cgame";

    class UserData extends SingtonClass {
        static getNickName() {
            return this._nickName;
        }
        static getSex() {
            return this._sex;
        }
        static getAge() {
            return this._age;
        }
        static getAvatar() {
            return this._avatarUrl;
        }
        static initUserInfo(nickName, sex, age, avatarUrl) {
            this._nickName = nickName;
            this._sex = sex;
            this._age = age;
            this._avatarUrl = avatarUrl;
        }
        static set Code(code) {
            this._code = code;
        }
        static get Code() {
            return this._code;
        }
        static set OpenId(id) {
            this._openId = id;
        }
        static get OpenId() {
            return this._openId;
        }
        static isLogin() {
            return this._nickName != null && this._avatarUrl != null;
        }
        static setOpenUser() {
            if (this._openId != null && StaticData.levels != null) {
                let open = GamePlatform.openDataContext.createDisplayObject();
                let stationName;
                if (StaticData.level == 0) {
                    stationName = "出发地";
                }
                else {
                    stationName = StaticData.getLevelData(StaticData.level - 1).stationInfo.name;
                }
                let data = { command: "user", openid: this._openId, score: StaticData.level, station_name: stationName };
                open.postMsg(data);
            }
        }
    }

    class ConfigData {
    }
    ConfigData.version = "1.3.3";
    ConfigData.MaxReLiveTime = 2;
    ConfigData.StartGameDialog = "scene/dialogView/StartGameDialog.scene";
    ConfigData.ShopDialog = "scene/dialogView/GameShop.scene";
    ConfigData.RankDialog = "scene/dialogView/RankDialog.scene";
    ConfigData.MuneDialog = "scene/dialogView/MuneDialog.scene";
    ConfigData.OthersGamesDialog = "scene/dialogView/OthersGamesDialog.scene";
    ConfigData.PauseDialog = "scene/dialogView/PauseDialog.scene";
    ConfigData.SignDialog = "scene/dialogView/SignDialog.scene";
    ConfigData.GameOverDialog = "scene/dialogView/GameOverDialog.scene";
    ConfigData.GetCoinTimesDialog = "scene/dialogView/GetCoinTimesDialog.scene";
    ConfigData.GameFinishDialog = "scene/dialogView/GameFinishDialog.scene";
    ConfigData.AwardDialog = "scene/dialogView/GameAwardDialog.scene";
    ConfigData.SkinFreeDialog = "scene/dialogView/SkinFreeDialog.scene";
    ConfigData.FreeSkinOfStartDialog = "scene/dialogView/FreeSkinOfStartDialog.scene";
    ConfigData.FLBoxDialog = "scene/dialogView/FLBoxDialog.scene";

    class GameHttp {
        constructor() {
            this.getTime = 0;
            this.maxGetTime = 3;
            this.isMisleadTime = 0;
            this.isRequiered = false;
            GameHttp._instance = this;
        }
        static get Instance() {
            if (!GameHttp._instance)
                new GameHttp();
            return GameHttp._instance;
        }
        login() {
            if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                this.getTime++;
                GamePlatform.platform.login({
                    success: res => {
                        console.log("login res:", res);
                        if (res.code) {
                            UserData.Code = res.code;
                            let obj = GamePlatform.platform.getLaunchOptionsSync();
                            let _AppID = "0";
                            let Sence = obj.scene;
                            if (obj.query == undefined || obj.query == null) {
                                Sence = "0";
                            }
                            else {
                                if (obj.query.scene == undefined || obj.query == null) {
                                    Sence = "0";
                                }
                                else {
                                    Sence = obj.query.scene;
                                }
                            }
                            let _Sence = decodeURIComponent(Sence);
                            this.getTime = 0;
                            this.loginPath = Api.loginUrl + "&version=" + ConfigData.version + "&code=" + res.code + "&scene=" + _Sence + "&uid=" + _AppID;
                            this.loginToService();
                        }
                    },
                    fail: err => {
                        if (this.getTime < this.maxGetTime) {
                            this.login();
                        }
                        else {
                            console.log("login fail");
                        }
                    }
                });
            }
            else {
                console.log("请在微信开发工具上调试");
            }
        }
        loginToService() {
            this.getTime++;
            HttpUtil.request({
                url: this.loginPath,
                method: "get",
                complete: res => {
                    this.getTime = 0;
                    UserData.OpenId = res.data.openid;
                    UserData.setOpenUser();
                    GameHttp.Instance.getLeadOut();
                    GameHttp.Instance.isMislead();
                    console.log("后台登录成功:", res);
                },
                error: err => {
                    if (this.getTime < this.maxGetTime) {
                        this.loginToService();
                    }
                    else {
                        console.log("后台登录失败");
                    }
                }
            });
        }
        getLeadOut() {
            console.log("后台获取游戏列表");
            if (UserData.OpenId) {
                this.getTime++;
                let path = Api.gameListUrl + "&openid=" + UserData.OpenId + "&version=" + ConfigData.version;
                HttpUtil.request({
                    url: path,
                    method: "get",
                    complete: res => {
                        if (res.result_code == 1) {
                            StaticData.gameList = res.data.gamelist;
                            console.log("网络游戏列表加载成功");
                        }
                    },
                    error: err => {
                        if (this.getTime < this.maxGetTime) {
                            this.getLeadOut();
                        }
                        else {
                            console.log("后台 获取游戏列表  请求失败");
                        }
                    }
                });
            }
        }
        isMislead() {
            if (UserData.OpenId) {
                this.isMisleadTime++;
                let path = Api.misleadUrl + "&openid=" + UserData.OpenId + "&version=" + ConfigData.version;
                HttpUtil.request({
                    url: path,
                    method: "get",
                    complete: res => {
                        StaticData.isMisLead = res.data.casualClick == "1";
                        console.info("isMislead:", StaticData.isMisLead);
                    },
                    error: err => {
                        if (this.isMisleadTime < this.maxGetTime) {
                            this.isMislead();
                        }
                        else {
                            console.log("后台 获取是否误点  请求失败");
                        }
                    }
                });
            }
        }
        leadOut(id) {
            if (UserData.OpenId) {
                let path = Api.leadOutUrl + "&openid=" + UserData.OpenId + "&version=" + ConfigData.version + "&id=" + id;
                HttpUtil.request({
                    url: path,
                    method: "get",
                    complete: res => {
                    },
                    error: err => {
                        console.info("leadOut.error", err);
                    }
                });
            }
        }
        leadOutSuccess(id) {
            if (UserData.OpenId) {
                let path = Api.leadOutSuccessUrl + "&openid=" + UserData.OpenId + "&version=" + ConfigData.version + "&id=" + id;
                HttpUtil.request({
                    url: path,
                    method: "get",
                    complete: res => {
                    },
                    error: err => {
                        console.info("leadOutSuccess.error", err);
                    }
                });
            }
        }
        startGame() {
            if (UserData.OpenId) {
                let path = Api.startGameUrl + "&openid=" + UserData.OpenId + "&version=" + ConfigData.version;
                HttpUtil.request({
                    url: path,
                    method: "get",
                    complete: res => {
                        StaticData.game_id = res.data.id;
                    },
                    error: err => {
                        console.info("startGame.error", err);
                    }
                });
            }
        }
        endGame() {
            if (UserData.OpenId) {
                if (!this.isRequiered) {
                    console.log("requier");
                    this.isRequiered = true;
                }
                let path = Api.endGameUrl + "&openid=" + UserData.OpenId + "&version=" + ConfigData.version + "&id=" + StaticData.game_id + "&level=" + (StaticData.level + 1);
                HttpUtil.request({
                    url: path,
                    method: "get",
                    complete: res => {
                    },
                    error: err => {
                        console.info("endGame.error", err);
                    }
                });
            }
        }
    }

    class AldUtil extends SingtonClass {
        static stageStart() {
            if (GamePlatform.platformName == GamePlatform.WX) {
                let obj = {
                    "stageId": String(StaticData.level + 1),
                    "stageName": String(StaticData.getLevelData(StaticData.level).stationInfo.name),
                    "userId": UserData.OpenId
                };
                try {
                    if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                        GamePlatform.platform.aldStage.onStart(obj);
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
        static stageRunning() {
            if (GamePlatform.platformName == GamePlatform.WX) {
                let obj = {
                    "stageId": String(StaticData.level + 1),
                    "stageName": String(StaticData.getLevelData(StaticData.level).stationInfo.name),
                    "userId": UserData.OpenId,
                    "event": "revive"
                };
                console.log("ald running:", obj);
                try {
                    if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                        GamePlatform.platform.aldStage.onRunning(obj);
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
        static stageEnd(_event) {
            if (GamePlatform.platformName == GamePlatform.WX) {
                let obj = {
                    "stageId": String(StaticData.level + 1),
                    "stageName": String(StaticData.getLevelData(StaticData.level).stationInfo.name),
                    "userId": UserData.OpenId,
                    "event": _event ? "complete" : "fail"
                };
                console.log("ald end:", obj);
                try {
                    if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                        GamePlatform.platform.aldStage.onEnd(obj);
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
        static upload(obj) {
            if (GamePlatform.platformName == GamePlatform.WX) {
                if (obj == null) {
                    TipsUtil.msg("----------阿拉丁：未知----------");
                    return;
                }
                try {
                    console.log("ald-upload：", obj);
                    if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                        GamePlatform.platform.aldSendEvent(obj == null ? "未知" : obj);
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
    }

    class LeadOutUtil extends SingtonClass {
        static leadOut(gameInfo, dc_pois) {
            AldUtil.upload(dc_pois);
            if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                GameHttp.Instance.leadOut(gameInfo.id);
                GamePlatform.platform.navigateToMiniProgram({
                    appId: gameInfo.appid,
                    path: gameInfo.url,
                    extraData: {
                        foo: 'bar'
                    },
                    envVersion: 'release',
                    success(res) {
                        console.log('更多游戏打开成功');
                        GameHttp.Instance.leadOutSuccess(gameInfo.id);
                    }
                });
            }
            else {
                TipsUtil.msg("仅在微信中使用");
            }
        }
    }

    class LeadOutListRunTime extends Laya.Sprite {
        constructor() {
            super();
            this.hadLoadGameList = false;
            this.scroll = 0;
            this.offScroll = -2;
            this.loadTime = 0;
            this.show = true;
            LeadOutListRunTime._instance = this;
        }
        static getInstance() {
            return LeadOutListRunTime._instance;
        }
        onEnable() {
            this.visible = false;
            this.gameList = this.getChildByName("gameList");
        }
        init(isBottom) {
            if (GamePlatform.platformName == GamePlatform.WX) {
                if (isBottom) {
                    this.y = StaticData.gameHeight - this.height;
                    if (StaticData.isIphoneX) {
                        this.y -= 50;
                    }
                }
                this.initData();
            }
            else {
                this.visible = false;
            }
        }
        initData() {
            this.loadTime++;
            if (this.loadTime > 10) {
                this.visible = false;
                return;
            }
            this.gl = StaticData.getGameListRadom(StaticData.getGameListSize());
            if (this.gl != null && this.gl.length > 0) {
                if (this.show) {
                    this.visible = true;
                }
                this.hadLoadGameList = true;
                let cmaskSpr = new Laya.Sprite();
                cmaskSpr.width = 138;
                cmaskSpr.height = 138;
                cmaskSpr.loadImage("images/leadout_icon_bg.png");
                for (let i = 0; i < this.gl.length; i++) {
                    let itemDate = this.gl[i];
                    let itemView = this.gameList.getChildAt(i);
                    let gameIcon = itemView.getChildByName("gameIcon");
                    let gameName = itemView.getChildByName("gameName");
                    if (gameIcon != null) {
                        gameIcon.loadImage(itemDate.img, Laya.Handler.create(this, () => {
                            gameIcon.mask = cmaskSpr;
                        }));
                    }
                    gameName.text = itemDate.title;
                    itemView.on(Laya.Event.CLICK, this, function () {
                        LeadOutUtil.leadOut(itemDate, this.ald_pois);
                    });
                }
                Laya.timer.frameLoop(2, this, () => {
                    this.scroll += this.offScroll;
                    if (this.scroll <= (-this.gameList.width + StaticData.gameWidth)) {
                        this.offScroll *= -1;
                    }
                    else if (this.scroll >= 0) {
                        this.offScroll *= -1;
                    }
                    this.gameList.x = this.scroll;
                });
            }
            else {
                this.hadLoadGameList = false;
                Laya.timer.clearAll(this);
                Laya.timer.once(1000, this, this.initData);
            }
        }
        setAldPois(pois) {
            this.ald_pois = pois;
            console.log("LeadOutListRunTime 阿拉丁代号：", pois);
        }
        ;
        isShow(isShow) {
            this.show = isShow;
            this.visible = isShow;
        }
    }

    class BaseModle extends SingtonClass {
        constructor() { super(); }
    }

    class CoinModle extends BaseModle {
        static init(debugNum) {
            if (debugNum) {
                this.coin = debugNum;
            }
            else {
                this.coin = LocalStorageUtil.getNumber(this.COIN);
            }
        }
        static doubleCoin(isDouble) {
            this.isDoubleCoin = isDouble;
        }
        static addCoin(addNum) {
            this.coin += addNum;
            LocalStorageUtil.add(this.COIN, this.coin);
            TipsUtil.msg("获得" + addNum + "金币");
            BaseDialogManage.getInstance().refreshCoin();
            SoundUtil.playCoin();
        }
        static reduceCoin(reduceNum) {
            if (this.coin < reduceNum) {
                TipsUtil.msg("金币不足");
            }
            else {
                this.coin -= reduceNum;
                LocalStorageUtil.add(this.COIN, this.coin);
                if (BaseDialogManage.getInstance() != null) {
                    BaseDialogManage.getInstance().refreshCoin();
                }
            }
        }
        static getCoin() {
            return this.coin;
        }
    }
    CoinModle.isDoubleCoin = false;
    CoinModle.COIN = "COIN";
    CoinModle.coin = 0;

    class DialogModle {
        static addDialog(dialogTag) {
            this.dialogList.push(dialogTag);
        }
        static popDialog() {
            if (this.dialogList.length > 0) {
                this.dialogList.pop();
            }
        }
        static getDialogCount() {
            return this.dialogList.length;
        }
    }
    DialogModle.dialogList = [];

    class ViewUtil {
        static goneViews(views) {
            if (views != null) {
                for (let spr of views) {
                    if (spr != null) {
                        spr.visible = false;
                    }
                }
            }
        }
        static visibleViews(views) {
            if (views != null) {
                for (let spr of views) {
                    if (spr != null) {
                        spr.visible = true;
                    }
                }
            }
        }
        static adapterPositionJL(view) {
            if (view != null
                && (GamePlatform.platformName == GamePlatform.WX || GamePlatform.platformName == GamePlatform.QQ)
                && (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame)) {
                let data = GamePlatform.platform.getMenuButtonBoundingClientRect();
                let off = (data.height * StaticData.clientScale - view.height) / 2;
                view.y = data.top * StaticData.clientScale + off;
            }
        }
    }

    class BaseDialogManage extends Laya.Script {
        constructor() {
            super();
            this.isShowBanner = false;
            this.hadLoadGameList = false;
            BaseDialogManage.Instance = this;
        }
        static getInstance() {
            return BaseDialogManage.Instance;
        }
        onEnable() {
            console.log("------------------onEnable");
            DialogModle.addDialog(this.owner.url);
            WxADUtil.hideBannerAd();
            this.contentSpr = this.owner.getChildByName("contentSpr");
            if (this.contentSpr) {
                this.initActionSprite();
            }
            this.findView();
            this.initView();
            this.adapterWindow();
            this.initData();
            this.setLeadOutData();
            if (this.no && !this.isShowBanner) {
                this.setIsShowMisLead(StaticData.isMisLead);
            }
            this.startAni();
            this.initCoin();
        }
        onStart() {
            switch (this.owner.url) {
                case ConfigData.StartGameDialog:
                    AldUtil.upload("\u9996\u9875");
                    break;
                case ConfigData.GameOverDialog:
                    AldUtil.upload("\u590D\u6D3B\u9875");
                    break;
                case ConfigData.GetCoinTimesDialog:
                    AldUtil.upload("\u6E38\u620F\u5931\u8D25\u91D1\u5E01\u7ED3\u7B97\u9875");
                    break;
                case ConfigData.GameFinishDialog:
                    AldUtil.upload("\u518D\u6765\u4E00\u6B21\u9875");
                    break;
                case ConfigData.AwardDialog:
                    AldUtil.upload("\u901A\u5173\u9875");
                    break;
                case ConfigData.PauseDialog:
                    AldUtil.upload("\u6682\u505C\u9875");
                    break;
                case ConfigData.MuneDialog:
                    AldUtil.upload("\u83DC\u5355\u9875");
                    break;
                case ConfigData.RankDialog:
                    AldUtil.upload("\u6392\u884C\u9875");
                    break;
                case ConfigData.ShopDialog:
                    AldUtil.upload("\u5546\u57CE\u9875");
                    break;
                case ConfigData.SignDialog:
                    AldUtil.upload("\u7B7E\u5230\u9875");
                    break;
                case ConfigData.SkinFreeDialog:
                    AldUtil.upload("\u76AE\u80A4\u8BD5\u7528\u9875");
                    break;
                case ConfigData.FLBoxDialog:
                    AldUtil.upload("\u5B9D\u7BB1\u9875");
                    break;
                case ConfigData.OthersGamesDialog:
                    AldUtil.upload("\u5176\u4ED6\u6E38\u620F\u9875");
                    break;
                default: break;
            }
        }
        onDisable() {
            DialogModle.popDialog();
            console.log("-------------onDisable");
            Laya.timer.clearAll(this);
            Laya.Tween.clearAll(this);
            WxADUtil.hideBannerAd();
            this.isShowBanner = false;
        }
        onDestroy() {
            console.log("-------------onDestroy");
            Laya.timer.clearAll(this);
            Laya.Tween.clearAll(this);
            this.isShowBanner = false;
            WxADUtil.hideBannerAd();
        }
        findView() { }
        ;
        initView() { }
        ;
        adapterWindow() {
            this.owner.height = StaticData.gameHeight;
            this.owner.pos(0, 0);
            if (this.midleLeadOutSpr) {
                this.midleLeadOutSpr.y += 222 * StaticData.heightOffsetScale;
            }
            if (this.yes) {
                this.yes.y += 248 * StaticData.heightOffsetScale;
                this.scaleBYes(this.yes);
            }
            if (this.no) {
                this.no.y += 243 * StaticData.heightOffsetScale;
            }
        }
        scaleBYes(view) {
            Laya.Tween.to(view, { scaleX: 1.1, scaleY: 1.1 }, 500, null, Laya.Handler.create(this, () => {
                this.scaleSYes(view);
            }));
        }
        scaleSYes(view) {
            Laya.Tween.to(view, { scaleX: 1, scaleY: 1 }, 500, null, Laya.Handler.create(this, () => {
                this.scaleBYes(view);
            }));
        }
        initData() { }
        ;
        setLeadOutData() { }
        yesAction() { }
        noAction() { }
        cancelAction() { }
        onClickAction(v) { }
        ;
        setIsShowMisLead(isShow, view) {
            let oldY;
            if (isShow) {
                if (view == null) {
                    view = this.no;
                    oldY = view.y;
                    view.y = WxADUtil.getADMidleY() > 1150 ? WxADUtil.getADMidleY() : 1150;
                }
                else {
                    oldY = view.y;
                    view.y = StaticData.gameHeight - 200;
                }
                view.visible = true;
                try {
                    Laya.timer.clearAll(this);
                    Laya.timer.once(1000, this, () => {
                        this.isShowBanner = true;
                        WxADUtil.showBannerAd();
                        Laya.Tween.to(view, { "y": oldY }, 300, null, null, 200);
                    });
                }
                catch (error) { }
            }
            else {
                this.isShowBanner = true;
                WxADUtil.showBannerAd();
                if (view == null) {
                    this.no.visible = false;
                    this.no.fontSize = 30;
                    this.no.alpha = 0.3;
                    Laya.timer.once(1000, this, function () {
                        this.no.visible = true;
                    });
                }
                else {
                    view.visible = true;
                }
            }
        }
        startAni() {
            let goOn = true;
            let id = 1;
            while (goOn) {
                let name = "ani" + id;
                let ani = this.owner[name];
                if (ani != null) {
                    ani.play();
                    id++;
                }
                else {
                    goOn = false;
                }
            }
        }
        initActionSprite() {
            this.yes = this.contentSpr.getChildByName("yes");
            this.no = this.contentSpr.getChildByName("no");
            this.cancel = this.contentSpr.getChildByName("cancel");
            this.midleLeadOutSpr = this.contentSpr.getChildByName("listSpr");
            this.horizontalLeadOutSpr = this.contentSpr.getChildByName("bottomLeadOut");
            if (this.yes) {
                this.yes.on(Laya.Event.CLICK, this, () => {
                    this.yesAction();
                });
            }
            if (this.no) {
                this.no.on(Laya.Event.CLICK, this, () => {
                    this.noAction();
                });
            }
            if (this.cancel) {
                this.cancel.on(Laya.Event.CLICK, this, () => {
                    this.cancelAction();
                });
            }
        }
        initCoin() {
            this.coinBox = this.owner.getChildByName("coinBox");
            if (this.coinBox != null) {
                ViewUtil.adapterPositionJL(this.coinBox);
                this.refreshCoin();
            }
        }
        ;
        refreshCoin() {
            if (this.coinBox != null) {
                let coinLb = this.coinBox.getChildByName("coinLb");
                let coinNum = CoinModle.getCoin();
                if (coinLb != null) {
                    if (coinNum >= 10000) {
                        coinLb.text = (coinNum / 1000).toFixed(1) + "k";
                    }
                    else {
                        coinLb.text = String(coinNum);
                    }
                }
            }
        }
    }

    class FLBoxDialogManage extends BaseDialogManage {
        onAwake() {
            let bg = this.owner.getChildByName("bg");
            bg.graphics.clear();
            bg.graphics.drawRect(0, 0, StaticData.gameWidth, StaticData.gameHeight, "#000000");
            bg.alpha = 0.8;
        }
        yesAction() {
            WxADUtil.adOrShare({
                success: () => {
                    CoinModle.addCoin(100);
                }
            });
        }
    }

    class EnumSkinUtil {
        static getUseCarSkin() {
            let skin = SkinModle.getSelectCarSkin();
            let ald_skin_use;
            switch (skin.id) {
                case "1":
                    ald_skin_use = "\u4F7F\u7528\u6B21\u6570-\u5C0F\u84DD\u8F66";
                    break;
                case "2":
                    ald_skin_use = "\u4F7F\u7528\u6B21\u6570-\u8FF7\u5F69\u8F66";
                    break;
                case "3":
                    ald_skin_use = "\u4F7F\u7528\u6B21\u6570-\u7C89\u8272\u76AE\u5361";
                    break;
                case "4":
                    ald_skin_use = "\u4F7F\u7528\u6B21\u6570-\u7EA2\u8272\u76AE\u5361";
                    break;
                case "5":
                    ald_skin_use = "\u4F7F\u7528\u6B21\u6570-\u7D2B\u85AF\u8F66";
                    break;
                case "6":
                    ald_skin_use = "\u4F7F\u7528\u6B21\u6570-\u6728\u677F\u8F66";
                    break;
                case "7":
                    ald_skin_use = "\u4F7F\u7528\u6B21\u6570-\u9EC4\u91D1\u6728\u677F\u8F66";
                    break;
                case "8":
                    ald_skin_use = "\u4F7F\u7528\u6B21\u6570-\u7231\u5FC3\u8E0F\u677F\u8F66";
                    break;
                case "10":
                    ald_skin_use = "\u4F7F\u7528\u6B21\u6570-\u8349\u7EFF\u8F6E\u6ED1";
                    break;
                case "11":
                    ald_skin_use = "\u4F7F\u7528\u6B21\u6570-\u70AB\u5F69\u8F6E\u6ED1";
                    break;
                default:
                    ald_skin_use = "\u4F7F\u7528\u6B21\u6570-\u5C0F\u84DD\u8F66";
                    break;
            }
            return ald_skin_use;
        }
        static getUseEggSkin() {
            let skin = SkinModle.getSelectEggSkin();
            let ald_skin_use;
            switch (skin.id) {
                case "1":
                    ald_skin_use = "\u4F7F\u7528\u6B21\u6570-\u9E21\u86CB";
                    break;
                case "2":
                    ald_skin_use = "\u4F7F\u7528\u6B21\u6570-\u7C89\u86CB";
                    break;
                case "3":
                    ald_skin_use = "\u4F7F\u7528\u6B21\u6570-\u661F\u661F\u86CB";
                    break;
                case "4":
                    ald_skin_use = "\u4F7F\u7528\u6B21\u6570-\u5C0F\u7EFF\u86CB";
                    break;
                case "5":
                    ald_skin_use = "\u4F7F\u7528\u6B21\u6570-\u51B0\u86CB";
                    break;
                case "6":
                    ald_skin_use = "\u4F7F\u7528\u6B21\u6570-\u8FF7\u5F69\u86CB";
                    break;
                case "7":
                    ald_skin_use = "\u4F7F\u7528\u6B21\u6570-\u6CE2\u7EB9\u86CB";
                    break;
                case "8":
                    ald_skin_use = "\u4F7F\u7528\u6B21\u6570-\u82B1\u82B1\u86CB";
                    break;
                case "9":
                    ald_skin_use = "\u4F7F\u7528\u6B21\u6570-\u5FC3\u86CB";
                    break;
                default:
                    ald_skin_use = "\u4F7F\u7528\u6B21\u6570-\u9E21\u86CB";
                    break;
            }
            return ald_skin_use;
        }
        static getBuyCarSkin(id) {
            let emun_car;
            switch (id) {
                case "1":
                    emun_car = "\u8D2D\u4E70\u6B21\u6570-\u5C0F\u84DD\u8F66";
                    break;
                case "2":
                    emun_car = "\u8D2D\u4E70\u6B21\u6570-\u8FF7\u5F69\u8F66";
                    break;
                case "3":
                    emun_car = "\u8D2D\u4E70\u6B21\u6570-\u7C89\u8272\u76AE\u5361";
                    break;
                case "4":
                    emun_car = "\u8D2D\u4E70\u6B21\u6570-\u7EA2\u8272\u76AE\u5361";
                    break;
                case "5":
                    emun_car = "\u8D2D\u4E70\u6B21\u6570-\u7D2B\u85AF\u8F66";
                    break;
                case "6":
                    emun_car = "\u8D2D\u4E70\u6B21\u6570-\u6728\u677F\u8F66";
                    break;
                case "7":
                    emun_car = "\u8D2D\u4E70\u6B21\u6570-\u9EC4\u91D1\u6728\u677F\u8F66";
                    break;
                case "8":
                    emun_car = "\u8D2D\u4E70\u6B21\u6570-\u7231\u5FC3\u8E0F\u677F\u8F66";
                    break;
                case "10":
                    emun_car = "\u8D2D\u4E70\u6B21\u6570-\u8349\u7EFF\u8F6E\u6ED1";
                    break;
                case "11":
                    emun_car = "\u8D2D\u4E70\u6B21\u6570-\u70AB\u5F69\u8F6E\u6ED1";
                    break;
                default:
                    emun_car = "\u8D2D\u4E70\u6B21\u6570-\u5C0F\u84DD\u8F66";
                    break;
            }
            return emun_car;
        }
        static getBuyEggSkin(id) {
            let emun_egg;
            switch (id) {
                case "1":
                    emun_egg = "\u8D2D\u4E70\u6B21\u6570-\u9E21\u86CB";
                    break;
                case "2":
                    emun_egg = "\u8D2D\u4E70\u6B21\u6570-\u7C89\u86CB";
                    break;
                case "3":
                    emun_egg = "\u8D2D\u4E70\u6B21\u6570-\u661F\u661F\u86CB";
                    break;
                case "4":
                    emun_egg = "\u8D2D\u4E70\u6B21\u6570-\u5C0F\u7EFF\u86CB";
                    break;
                case "5":
                    emun_egg = "\u8D2D\u4E70\u6B21\u6570-\u51B0\u86CB";
                    break;
                case "6":
                    emun_egg = "\u8D2D\u4E70\u6B21\u6570-\u8FF7\u5F69\u86CB";
                    break;
                case "7":
                    emun_egg = "\u8D2D\u4E70\u6B21\u6570-\u6CE2\u7EB9\u86CB";
                    break;
                case "8":
                    emun_egg = "\u8D2D\u4E70\u6B21\u6570-\u82B1\u82B1\u86CB";
                    break;
                case "9":
                    emun_egg = "\u8D2D\u4E70\u6B21\u6570-\u5FC3\u86CB";
                    break;
                default:
                    emun_egg = "\u8D2D\u4E70\u6B21\u6570-\u9E21\u86CB";
                    break;
            }
            return emun_egg;
        }
    }

    class SkinModle extends BaseModle {
        static init(skin1, skin2) {
            this.carSkinInfo = skin1;
            this.eggSkinInfo = skin2;
            let hadBuy = LocalStorageUtil.getString(this.hadBuyCarKey);
            let buyJson;
            if (hadBuy && hadBuy != null) {
                buyJson = JSON.parse(hadBuy);
            }
            for (let cs of this.carSkinInfo) {
                cs.hadBuy = cs.id == "1";
                if (buyJson != null) {
                    for (let i of buyJson) {
                        if (cs.id == Number(i)) {
                            cs.hadBuy = true;
                            break;
                        }
                    }
                }
            }
            let hadBuyEgg = LocalStorageUtil.getString(this.hadBuyEggKey);
            let buyEggJson;
            if (hadBuyEgg && hadBuyEgg != null) {
                buyEggJson = JSON.parse(hadBuyEgg);
            }
            for (let cs of this.eggSkinInfo) {
                cs.hadBuy = cs.id == "1";
                if (buyEggJson != null) {
                    for (let i of buyEggJson) {
                        if (cs.id == Number(i)) {
                            cs.hadBuy = true;
                            break;
                        }
                    }
                }
            }
            if (LocalStorageUtil.getString(this.useCarSkinKey) == null || LocalStorageUtil.getString(this.useCarSkinKey).length <= 0) {
                this.selectCarSkinID = "1";
            }
            else {
                this.selectCarSkinID = LocalStorageUtil.getString(this.useCarSkinKey);
            }
            if (LocalStorageUtil.getString(this.useEggSkinKey) == null || LocalStorageUtil.getString(this.useEggSkinKey).length <= 0) {
                this.selectEggSkinID = "1";
            }
            else {
                this.selectEggSkinID = LocalStorageUtil.getString(this.useEggSkinKey);
            }
            if (this.selectCarSkinID == "0") {
                this.selectCarSkinID = "1";
                this.setSelectCarSkinID(this.selectCarSkinID);
            }
            if (this.selectEggSkinID == "0") {
                this.selectEggSkinID = "1";
                this.setSelectCarSkinID(this.selectEggSkinID);
            }
        }
        static setSelectCarSkinID(id) {
            this.selectCarSkinID = id;
            LocalStorageUtil.add(this.useCarSkinKey, this.selectCarSkinID);
        }
        static getCarSkins() {
            return this.carSkinInfo;
        }
        static getCarSkinById(id) {
            if (this.carSkinInfo != null && this.carSkinInfo.length > 0) {
                for (let skin of this.carSkinInfo) {
                    if (skin.id == id) {
                        return skin;
                    }
                }
                return null;
            }
            else {
                return null;
            }
        }
        static getCarSkin(p) {
            if (this.carSkinInfo != null && this.carSkinInfo.length > 0) {
                return this.carSkinInfo[p];
            }
            else {
                return null;
            }
        }
        static getSelectCarSkin() {
            if (this.freeCarSkinID != "0") {
                let skin = this.getCarSkinById(this.freeCarSkinID);
                return skin;
            }
            else {
                let skin = this.getCarSkinById(this.selectCarSkinID);
                return skin;
            }
        }
        static addCarSkin(id) {
            let hadBuy = LocalStorageUtil.getString(this.hadBuyCarKey);
            let buyJson;
            if (hadBuy && hadBuy != null) {
                buyJson = JSON.parse(hadBuy);
            }
            else {
                buyJson = [];
            }
            buyJson.push(id);
            LocalStorageUtil.add(this.hadBuyCarKey, JSON.stringify(buyJson));
            AldUtil.upload(EnumSkinUtil.getBuyCarSkin(id));
            for (let cs of this.carSkinInfo) {
                if (cs.id == id) {
                    TipsUtil.msg("恭喜获得新皮肤");
                    cs.hadBuy = true;
                    break;
                }
            }
        }
        static setSelectEggSkinID(id) {
            this.selectEggSkinID = id;
            LocalStorageUtil.add(this.useEggSkinKey, this.selectEggSkinID);
        }
        static getEggSkins() {
            return this.eggSkinInfo;
        }
        static getEggSkin(p) {
            if (this.eggSkinInfo != null && this.eggSkinInfo.length > 0) {
                return this.eggSkinInfo[p];
            }
            else {
                return null;
            }
        }
        static getEggSkinById(id) {
            if (this.eggSkinInfo != null && this.eggSkinInfo.length > 0) {
                for (let skin of this.eggSkinInfo) {
                    if (skin.id == id) {
                        return skin;
                    }
                }
                return null;
            }
            else {
                return null;
            }
        }
        static getSelectEggSkin() {
            if (this.freeEggSkinID != "0") {
                return this.getEggSkinById(this.freeEggSkinID);
            }
            else {
                return this.getEggSkinById(this.selectEggSkinID);
            }
        }
        static addEggSkin(id) {
            let hadBuy = LocalStorageUtil.getString(this.hadBuyEggKey);
            let buyJson;
            if (hadBuy && hadBuy != null) {
                buyJson = JSON.parse(hadBuy);
            }
            else {
                buyJson = [];
            }
            AldUtil.upload(EnumSkinUtil.getBuyEggSkin(id));
            buyJson.push(id);
            LocalStorageUtil.add(this.hadBuyEggKey, JSON.stringify(buyJson));
            for (let cs of this.eggSkinInfo) {
                if (cs.id == id) {
                    cs.hadBuy = true;
                    break;
                }
            }
        }
    }
    SkinModle.selectCarSkinID = "1";
    SkinModle.selectEggSkinID = "1";
    SkinModle.freeCarSkinID = "0";
    SkinModle.freeEggSkinID = "0";
    SkinModle.hadBuyCarKey = "hadBuyCar";
    SkinModle.hadBuyEggKey = "hadBuyEgg";
    SkinModle.useCarSkinKey = "useCarSkinKey";
    SkinModle.useEggSkinKey = "useEggSkinKey";

    class FreeSkinOfStartDialogManage extends BaseDialogManage {
        findView() {
            this.textSpr = this.contentSpr.getChildByName("textSpr");
        }
        initView() {
            this.skinType = Math.random();
            if (this.skinType <= 0.7) {
                this.textSpr.loadImage("images/freeCarSkin.png");
            }
            else {
                this.textSpr.loadImage("images/freeEggSkin.png");
            }
            this.horizontalLeadOutSpr.setAldPois("\u76AE\u80A4\u8BD5\u7528-\u5BFC\u51FA");
            this.horizontalLeadOutSpr.init(true);
        }
        adapterWindow() {
            super.adapterWindow();
            this.textSpr.y += StaticData.offY;
        }
        initData() {
            let skinId;
            if (this.skinType <= 0.7) {
                skinId = Math.round((Math.random() * 9)) + 2;
                skinId = Math.min(11, skinId);
                skinId = Math.max(2, skinId);
                if (skinId == 9) {
                    skinId = 8;
                }
                SkinModle.freeCarSkinID = String(skinId);
            }
            else {
                skinId = Math.round((Math.random() * 7)) + 2;
                skinId = Math.min(9, skinId);
                skinId = Math.max(2, skinId);
                SkinModle.freeEggSkinID = String(skinId);
            }
        }
        yesAction() {
            AldUtil.upload("\u76AE\u80A4\u8BD5\u7528-\u4F7F\u7528");
            WxADUtil.adOrShare({
                success: () => {
                },
                fail: () => {
                    this.noAction();
                },
                error: () => {
                    this.noAction();
                }
            });
        }
        noAction() {
            AldUtil.upload("\u76AE\u80A4\u8BD5\u7528-\u8DF3\u8FC7");
            SkinModle.freeCarSkinID = "0";
            SkinModle.freeEggSkinID = "0";
        }
    }

    class DialogBgRunTime extends Laya.Sprite {
        onAwake() {
            this.graphics.clear();
            this.graphics.drawRect(0, 0, StaticData.gameWidth, StaticData.gameHeight, "#000000");
            this.alpha = 0.8;
        }
    }

    class GameState extends SingtonClass {
    }
    GameState.NOT_START = 0;
    GameState.START = 1;
    GameState.PUASE = 2;
    GameState.FINISH = 3;
    GameState.OVER = 4;

    class BaseScript extends Laya.Script {
        onAwake() {
            if (this.owner instanceof Laya.Dialog) {
                this.owner.height = StaticData.gameHeight;
            }
            else {
                this.owner.scene.height = StaticData.gameHeight;
            }
        }
    }

    class GameManage extends BaseScript {
        constructor() {
            super();
            this.reliveTime = 0;
            this.name = "GameManage";
            GameManage.manageOwner = this;
        }
        static getManage() {
            return GameManage.manageOwner;
        }
        onEnable() {
            this.findView();
            this.initView();
            Laya.Dialog.open(ConfigData.StartGameDialog, true, null, Laya.Handler.create(this, (dialog) => {
                let getCoinDate = LocalStorageUtil.getString("getCoinDate");
                let date = new Date();
                let today_date = String(date.getDate());
                if (getCoinDate && getCoinDate != today_date) {
                    let d = dialog;
                    Laya.timer.once(500, this, () => {
                        if (d && !d.destroyed && d.visible) {
                            Laya.Dialog.open(ConfigData.FLBoxDialog);
                            LocalStorageUtil.add("getCoinDate", today_date);
                        }
                    });
                }
                else if (getCoinDate == null) {
                    LocalStorageUtil.add("getCoinDate", today_date);
                }
            }));
        }
        onUpdate() {
            if (DialogModle.getDialogCount() > 0) {
                ViewUtil.goneViews([this.leadOut, this.pauseSpr]);
            }
            else {
                ViewUtil.visibleViews([this.leadOut, this.pauseSpr]);
            }
        }
        findView() {
            this.leadOut = this.owner.getChildByName("bottomLeadOut");
            this.pauseSpr = this.owner.getChildByName("pauseSpr");
            this.gameBox = this.owner.getChildByName("gameBox");
        }
        initView() {
            this.pauseSpr.on(Laya.Event.CLICK, this, this.clickAction);
            this.leadOut.setAldPois("\u6E38\u620F\u9875-\u5BFC\u51FA");
            this.leadOut.init(true);
            Laya.Physics.I.worldRoot = this.gameBox;
        }
        adapterWindow() {
            ViewUtil.adapterPositionJL(this.pauseSpr);
        }
        gameStart(isNewGame, startAction) {
            console.log("开始游戏");
            if (isNewGame) {
                GameHttp.Instance.startGame();
                AldUtil.stageStart();
                if (startAction != null) {
                    switch (startAction) {
                        case ConfigData.FreeSkinOfStartDialog:
                            Laya.Dialog.open(ConfigData.FreeSkinOfStartDialog, false);
                            break;
                        default:
                            break;
                    }
                }
                else {
                    SoundUtil.playStartGame();
                    this.gameState = GameState.START;
                }
            }
            else {
                this.gameState = GameState.START;
            }
        }
        gamePause() {
            console.log("暂停游戏");
            this.gameState = GameState.PUASE;
        }
        gameFinish() {
            console.log("游戏关卡完成");
            this.gameState = GameState.FINISH;
            if (StaticData.level >= StaticData.levels.length - 1) {
                TipsUtil.msg("恭喜完成全部关卡");
            }
            else {
                Laya.Dialog.open(ConfigData.AwardDialog);
                this.reliveTime = 0;
            }
        }
        gameOver() {
            if (this.gameState == GameState.OVER || this.gameState == GameState.FINISH) {
                return;
            }
            console.log("游戏结束");
            if (StaticData.allowDie) {
                this.gameState = GameState.OVER;
                if (this.reliveTime >= ConfigData.MaxReLiveTime) {
                    this.reliveTime = 0;
                    Laya.Dialog.open(ConfigData.GetCoinTimesDialog);
                }
                else {
                    Laya.Dialog.open(ConfigData.GameOverDialog);
                }
            }
        }
        restart(showDialog) {
            console.log("重新开始");
            this.refreshUI();
            this.reliveTime = 0;
            if (showDialog) {
                this.gameStart(true, ConfigData.FreeSkinOfStartDialog);
            }
            else {
                this.gameStart(true);
            }
        }
        refreshUI() {
            console.log("刷新界面");
        }
        nextLevel() {
            console.log("开始下一关游戏");
            this.gameStart(true);
        }
        reLive() {
            console.log("reLive");
            this.reliveTime++;
            this.gameStart(false);
        }
        mouseHandle(e) {
            switch (e.type) {
                case Laya.Event.MOUSE_DOWN:
                    break;
                case Laya.Event.MOUSE_UP:
                    break;
            }
        }
        clickAction(e) {
            switch (e.target.name) {
                case "pauseSpr":
                    Laya.Dialog.open(ConfigData.PauseDialog);
                    break;
                default:
                    break;
            }
        }
    }

    class SkinConfig {
        static getEggSkinBig(point) {
            return SkinConfig.eggBig + point + ".png";
        }
        static getEggSkinSmall(point) {
            return SkinConfig.eggSmall + point + ".png";
        }
        static getCarSkinBig(point) {
            return SkinConfig.carSkinBig + point + ".png";
        }
        static getCarSkinSmall(point) {
            return SkinConfig.carSkinSmall + point + ".png";
        }
        static getCarBodySkin(point) {
            return SkinConfig.carBody + point + ".png";
        }
        static getLunziSkin(point, b) {
            return SkinConfig.lunzi + point + ".png";
        }
        static getGameBg(point) {
            return SkinConfig.game_bg + point + ".png";
        }
        static getGameFg(point) {
            return SkinConfig.game_fg + point + ".png";
        }
        static getGameBot(point) {
            return SkinConfig.game_bot + point + ".png";
        }
        static getGameLoadColor(point) {
            let p = Number(point) - 1;
            return SkinConfig.loadColor[p < 0 ? 0 : p];
        }
    }
    SkinConfig.carSkinBig = "images/carSkin/carSkinBig/car_skin_";
    SkinConfig.carSkinSmall = "images/carSkin/carSkinSmall/car_skin_";
    SkinConfig.lunzi = "images/carSkin/lunzi/lunzi_";
    SkinConfig.carBody = "images/carSkin/carBody/carBody_";
    SkinConfig.eggSmall = "images/eggSkin/eggSkinSmall/egg_skin_";
    SkinConfig.eggBig = "images/eggSkin/eggSkinBig/egg_skin_";
    SkinConfig.game_bg = "images/game_bg/bg/bg_img_x_";
    SkinConfig.game_fg = "images/game_bg/fg/fg_img_x_";
    SkinConfig.game_bot = "images/game_bg/bot/bot_img_x_";
    SkinConfig.loadColor = ["#FFDCBF", "#DFDEFF", "#DEE1FF", "#96cafa", "#A5CAE9", "#C798B2"];

    class AwardDialogManage extends BaseDialogManage {
        onEnable() {
            super.onEnable();
            let coin = Math.floor((StaticData.getLevelData(StaticData.level).stationInfo.x / 100));
            CoinModle.addCoin(CoinModle.isDoubleCoin ? coin * 2 : coin);
            SkinModle.freeCarSkinID = "0";
            SkinModle.freeEggSkinID = "0";
            CoinModle.doubleCoin(false);
            GameHttp.Instance.endGame();
            AldUtil.stageEnd(true);
            if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                let open = GamePlatform.openDataContext.createDisplayObject();
                open.postMsg({ command: "set_score", score: StaticData.level, station_name: StaticData.level == 0 ? "出发地" : StaticData.getLevelData(StaticData.level - 1).stationInfo.name });
            }
            let leadOut = this.owner.getChildByName("bottomLeadOut");
            leadOut.setAldPois("\u901A\u5173\u7ED3\u7B97\u9875-\u5BFC\u51FA");
            leadOut.init(true);
        }
        findView() {
            this.titleSpr = this.contentSpr.getChildByName("titleLb");
            this.closeLb = this.contentSpr.getChildByName("_no");
            this.getAwardSpr = this.contentSpr.getChildByName("getAwardSpr");
            this.awardLabel = this.contentSpr.getChildByName("awardNameLb");
            this.midleSpr = this.contentSpr.getChildByName("midleSpr");
            this.coinLb = this.contentSpr.getChildByName("coinLb");
        }
        initView() {
            this.closeLb.on(Laya.Event.CLICK, this, this.closeDialog);
            this.getAwardSpr.on(Laya.Event.CLICK, this, this.getAward);
            this.coinLb.visible = false;
            let levelInfo = StaticData.getLevelData(StaticData.level);
            this.awardData = levelInfo.awards;
            if (this.awardData.type == "carSkin") {
                let carSkin = SkinModle.getCarSkinById(String(this.awardData.id));
                this.awardLabel.text = "- " + carSkin.skinName + " -";
                this.midleSpr.loadImage(SkinConfig.getCarSkinBig(carSkin.id), Laya.Handler.create(this, () => {
                    this.midleSpr.x = (StaticData.gameWidth - this.midleSpr.width) / 2;
                }));
            }
            else if (this.awardData.type == "eggSkin") {
                let eggSkin = SkinModle.getEggSkinById(this.awardData.id);
                this.awardLabel.text = "- " + eggSkin.skinName + " -";
                this.midleSpr.loadImage(SkinConfig.getEggSkinBig(eggSkin.id), Laya.Handler.create(this, () => {
                    this.midleSpr.x = (StaticData.gameWidth - this.midleSpr.width) / 2;
                }));
            }
            this.closeLb.visible = false;
            this.closeLb.fontSize = 30;
            this.closeLb.alpha = 0.3;
            Laya.timer.once(1000, this, function () {
                this.closeLb.visible = true;
            });
            this.scaleBYes(this.getAwardSpr);
        }
        adapterWindow() {
            super.adapterWindow();
            if (StaticData.isIphoneX) {
                this.getAwardSpr.y = 950;
                this.closeLb.y = 1124;
            }
        }
        closeDialog() {
            this.owner.close();
            this.nextLevel();
        }
        getAward() {
            AldUtil.upload("\u901A\u5173\u7ED3\u7B97\u9875-\u83B7\u5F97\u76AE\u80A4");
            WxADUtil.adOrShare({
                success: () => {
                    if (this.awardData.type == "carSkin") {
                        SkinModle.freeCarSkinID = String(this.awardData.id);
                    }
                    else if (this.awardData.type == "eggSkin") {
                        SkinModle.freeEggSkinID = String(this.awardData.id);
                    }
                    this.owner.close();
                    this.nextLevel();
                }
            });
        }
        nextLevel() {
            StaticData.level += 1;
            if (StaticData.level >= StaticData.levels.length) {
                StaticData.level -= 1;
            }
            LocalStorageUtil.add(StaticData.LEVEL, StaticData.level);
            GameManage.manageOwner.nextLevel();
        }
    }

    class LeadOutGridRunTime extends Laya.Sprite {
        constructor() {
            super();
            LeadOutGridRunTime._instance = this;
        }
        static getInstance() {
            if (LeadOutGridRunTime.prototype == null) {
                LeadOutGridRunTime._instance = new LeadOutGridRunTime();
            }
            return LeadOutGridRunTime._instance;
        }
        onAwake() {
            this.gameList = this.getChildByName("gameList");
            if (GamePlatform.platformName == GamePlatform.WX) {
                this.initData();
            }
            else {
                this.visible = false;
            }
        }
        initData() {
            this.gl = StaticData.getGameListRadom(6);
            if (this.gl != null && this.gl.length > 0) {
                this.gameList.array = this.gl;
                this.gameList.renderHandler = Laya.Handler.create(this, this.updateItem, null, false);
            }
        }
        updateItem(call, index) {
            let item = this.gl[index];
            if (item != null) {
                let gameIcon = call.getChildByName("gameIcon");
                let gameName = call.getChildByName("gameName");
                if (gameIcon != null) {
                    gameIcon.loadImage(item.img, Laya.Handler.create(this, () => {
                        let cmaskSpr = new Laya.Sprite();
                        cmaskSpr.width = gameIcon.width;
                        cmaskSpr.height = gameIcon.height;
                        cmaskSpr.loadImage("images/leadout_icon_bg.png");
                        gameIcon.mask = cmaskSpr;
                    }));
                }
                gameName.text = item.title;
                call.on(Laya.Event.CLICK, this, function () {
                    LeadOutUtil.leadOut(item, this.ald_pois);
                });
            }
            else {
                call.visible = false;
            }
        }
        setAldPois(pois) {
            this.ald_pois = pois;
            console.log("LeadOutGridRunTime 阿拉丁代号：", pois);
        }
    }

    class SignModle extends BaseModle {
        static init() {
            SignModle.lastSignDate = LocalStorageUtil.getNumber(SignModle.KEY_LastSignDate);
            SignModle.lastSignMonth = LocalStorageUtil.getNumber(SignModle.KEY_LastSignMonth);
            SignModle.hadCarAward = LocalStorageUtil.getNumber(SignModle.KEY_hadCarAward);
            let date = new Date();
            let today_date = date.getDate();
            let today_month = date.getMonth() + 1;
            SignModle.todaySigned = (SignModle.lastSignDate == today_date && SignModle.lastSignMonth == today_month);
            SignModle.signDays = LocalStorageUtil.getNumber(SignModle.KEY_SignDays);
            if (SignModle.signDays == 7 && !SignModle.todaySigned) {
                SignModle.signDays = 0;
                LocalStorageUtil.add(SignModle.KEY_SignDays, SignModle.signDays);
            }
        }
        static getSignDays() {
            return SignModle.signDays;
        }
        static getLastSignDate() {
            return SignModle.lastSignDate;
        }
        static getTodaySigned() {
            return SignModle.todaySigned;
        }
        static sign(doubleAward) {
            if (SignModle.signDays == 6) {
                if (SignModle.hadCarAward == 0) {
                    SkinModle.addCarSkin(SignModle.carAward.id);
                    SignModle.hadCarAward = 1;
                    LocalStorageUtil.add(SignModle.KEY_hadCarAward, SignModle.hadCarAward);
                }
                else {
                    let coinNum = SignModle.coinNum[SignModle.signDays];
                    if (doubleAward) {
                        CoinModle.addCoin(coinNum * 2);
                    }
                    else {
                        CoinModle.addCoin(coinNum);
                    }
                }
            }
            else {
                let coinNum = SignModle.coinNum[SignModle.signDays];
                if (doubleAward) {
                    CoinModle.addCoin(coinNum * 2);
                }
                else {
                    CoinModle.addCoin(coinNum);
                }
            }
            SignModle.signDays += 1;
            LocalStorageUtil.add(SignModle.KEY_SignDays, SignModle.signDays);
            let date = new Date();
            SignModle.lastSignMonth = date.getMonth() + 1;
            SignModle.lastSignDate = date.getDate();
            LocalStorageUtil.add(SignModle.KEY_LastSignMonth, SignModle.lastSignMonth);
            LocalStorageUtil.add(SignModle.KEY_LastSignDate, SignModle.lastSignDate);
            SignModle.todaySigned = true;
        }
        static isLastDay(today_date, today_month) {
            if (today_month == SignModle.lastSignMonth + 1 || (today_month == 1 && SignModle.lastSignMonth == 12)) {
                if ((SignModle.lastSignMonth == 1
                    || SignModle.lastSignMonth == 3
                    || SignModle.lastSignMonth == 5
                    || SignModle.lastSignMonth == 7
                    || SignModle.lastSignMonth == 8
                    || SignModle.lastSignMonth == 10
                    || SignModle.lastSignMonth == 12)
                    && SignModle.lastSignDate == 31) {
                    return true;
                }
                else if ((SignModle.lastSignMonth == 4
                    || SignModle.lastSignMonth == 6
                    || SignModle.lastSignMonth == 9
                    || SignModle.lastSignMonth == 11)
                    && SignModle.lastSignDate == 30) {
                    return true;
                }
                else if (SignModle.lastSignMonth == 2
                    && (SignModle.lastSignDate == 28 || SignModle.lastSignDate == 29)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    }
    SignModle.KEY_SignDays = "KEY_SignDays";
    SignModle.KEY_LastSignDate = "KEY_LastSignDate";
    SignModle.KEY_LastSignMonth = "KEY_LastSignMonth";
    SignModle.KEY_hadCarAward = "KEY_hadCarAward";
    SignModle.signDays = 0;
    SignModle.lastSignDate = 0;
    SignModle.lastSignMonth = 0;
    SignModle.todaySigned = false;
    SignModle.hadCarAward = 0;
    SignModle.coinNum = [50, 80, 120, 180, 280, 400, 600];
    SignModle.carAward = { "id": 8, "name": "爱心踏板车", "img": "images/carSkin/carSkinBig/car_skin_8.png", "x": 253, "y": 44 };

    class GameFinishDialogManage extends BaseDialogManage {
        constructor() {
            super(...arguments);
            this.hadShare = false;
        }
        findView() {
            this._title = this.contentSpr.getChildByName("_title");
            this.stationLb = this.contentSpr.getChildByName("stationLb");
            this.yesBox = this.contentSpr.getChildByName("yesBox");
            this.yesSpr = this.yesBox.getChildByName("yesSpr");
            this.changeBtn = this.yesBox.getChildByName("changeBtn");
            this.goHomeBtn = this.yesBox.getChildByName("goHomeBtn");
            this.awardBtn = this.yesBox.getChildByName("awardBtn");
            this.fcSpr = this.awardBtn.getChildByName("fcSpr");
            this.fcNumLb = this.fcSpr.getChildByName("fcNumLb");
            this.addGame = this.owner.getChildByName("addGame");
        }
        initView() {
            this.fcNumLb.text = StaticData.ChangeFriendGetCoin + "";
            this.stationLb.text = "- 下一站 " + StaticData.getLevelData(StaticData.level).stationInfo.name + " -";
            this.changeBtn.on(Laya.Event.CLICK, this, this.onClickAction);
            this.goHomeBtn.on(Laya.Event.CLICK, this, this.onClickAction);
            this.awardBtn.on(Laya.Event.CLICK, this, this.onClickAction);
            if (GamePlatform.platformName != GamePlatform.WX && GamePlatform.platformName != GamePlatform.QQ) {
                this.addGame.visible = false;
            }
            this.yesSpr.on(Laya.Event.CLICK, this, () => {
                this.yesAction();
            });
        }
        ;
        initData() {
            if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                let open = GamePlatform.openDataContext.createDisplayObject();
                open.postMsg({ command: "set_score", score: StaticData.level, station_name: "第" + StaticData.level + "关" });
            }
            if (GamePlatform.platformName != GamePlatform.WX && GamePlatform.platformName != GamePlatform.QQ) {
                this.changeBtn.visible = false;
                this.awardBtn.visible = false;
            }
        }
        adapterWindow() {
            super.adapterWindow();
            this._title.y += 167 * StaticData.heightOffsetScale;
            this.stationLb.y += 167 * StaticData.heightOffsetScale;
            this.yesBox.y += 248 * StaticData.heightOffsetScale;
            if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                let data = GamePlatform.platform.getMenuButtonBoundingClientRect();
                let off = (data.height * StaticData.clientScale - this.addGame.height) / 2;
                this.addGame.y = data.top * StaticData.clientScale + off;
            }
        }
        setLeadOutData() {
            this.midleLeadOutSpr.setAldPois("\u6E38\u620F\u7ED3\u675F\u9875-\u5BFC\u51FA");
            this.setIsShowMisLead(StaticData.isMisLead, this.yesBox);
        }
        onClickAction(e) {
            switch (e.target.name) {
                case "changeBtn":
                case "awardBtn":
                    AldUtil.upload("\u6E38\u620F\u7ED3\u675F\u9875-\u5206\u4EAB");
                    WxADUtil.share({
                        success: () => {
                            if (!this.hadShare) {
                                CoinModle.addCoin(StaticData.ChangeFriendGetCoin);
                                this.hadShare = true;
                            }
                        }
                    });
                    break;
                case "goHomeBtn":
                    this.gotoHome();
                    break;
                default: break;
            }
        }
        yesAction() {
            this.reStart();
        }
        reStart() {
            AldUtil.upload("\u6E38\u620F\u7ED3\u675F\u9875-\u518D\u6765\u4E00\u6B21");
            GameManage.manageOwner.gameState = GameState.NOT_START;
            GameManage.manageOwner.restart(true);
            this.owner.close();
        }
        gotoHome() {
            AldUtil.upload("\u6E38\u620F\u7ED3\u675F\u9875-\u8FD4\u56DE\u9996\u9875");
            GameManage.manageOwner.refreshUI();
            Laya.Dialog.open(ConfigData.StartGameDialog);
            Laya.Dialog.open(ConfigData.StartGameDialog, true, null, Laya.Handler.create(this, (dialog) => {
                if (StaticData.AutoSkipToSign && !SignModle.getTodaySigned()) {
                    let d = dialog;
                    Laya.timer.once(1000, this, () => {
                        if (d && !d.destroyed && d.visible) {
                            StaticData.AutoSkipToSign = false;
                            Laya.Dialog.open(ConfigData.SignDialog);
                        }
                    });
                }
            }));
        }
    }

    class GameOverDialogRunTime extends BaseDialogManage {
        constructor() {
            super(...arguments);
            this.hadShare = false;
        }
        findView() {
            this.stationLabel = this.contentSpr.getChildByName("stationLabel");
            this.rangeLabel = this.contentSpr.getChildByName("rangeLabel");
        }
        ;
        initView() {
            this.stationLabel.text = "- 下一站 " + StaticData.getLevelData(StaticData.level).stationInfo.name + " -";
        }
        adapterWindow() {
            super.adapterWindow();
            this.rangeLabel.y += 167 * StaticData.heightOffsetScale;
            this.stationLabel.y += 167 * StaticData.heightOffsetScale;
            this.midleLeadOutSpr.setAldPois("\u590D\u6D3B\u9875-\u5BFC\u51FA");
        }
        yesAction() {
            AldUtil.upload("\u590D\u6D3B\u9875-\u590D\u6D3B");
            WxADUtil.adOrShare({
                success: () => {
                    this.reLiveAction();
                }, fail: () => {
                    this.noAction();
                }
            });
        }
        noAction() {
            AldUtil.upload("\u590D\u6D3B\u9875-\u4E0D\u590D\u6D3B");
            Laya.Dialog.open(ConfigData.GetCoinTimesDialog);
        }
        reLiveAction() {
            WxADUtil.hideBannerAd();
            GameManage.manageOwner.reLive();
            this.owner.close();
        }
    }

    class ShopManage extends BaseDialogManage {
        constructor() {
            super(...arguments);
            this.carItem = Laya.Box;
            this.eggItem = Laya.Box;
            this.showTab = 0;
            this.eggLocation = [{ x: 353, y: 268 }, { x: 331, y: 280 }, { x: 345, y: 309 }, { x: 363, y: 259 }];
        }
        onEnable() {
            super.onEnable();
            this.selectCarId = SkinModle.selectCarSkinID;
            this.selectEggId = SkinModle.selectEggSkinID;
            this.bg = this.owner.getChildByName("bgImg");
            this.showCarSpr = this.owner.getChildByName("showCarSpr");
            this.showEggSpr = this.owner.getChildByName("showEggSpr");
            this.homeImg = this.owner.getChildByName("homeImg");
            this.eggTabSpr = this.owner.getChildByName("eggTabSpr");
            this.eggLb = this.eggTabSpr.getChildAt(0);
            this.carTabSpr = this.owner.getChildByName("carTabSpr");
            this.carLb = this.carTabSpr.getChildAt(0);
            this.carList = this.owner.getChildByName("carList");
            this.eggList = this.owner.getChildByName("eggList");
            this.initCarList();
            this.initEggList();
            this.hadSpr = this.owner.getChildByName("hadSpr");
            this.havntSpr = this.owner.getChildByName("havntSpr");
            this.freeSpr = this.havntSpr.getChildByName("freeSpr");
            this.buySpr = this.havntSpr.getChildByName("buySpr");
            this.buyCoinLb = this.buySpr.getChildByName("buyCoinLb");
            this.bg.height = StaticData.gameHeight;
            this.homeImg.y += StaticData.offY - 5;
            this.eggTabSpr.y += StaticData.offY - 5;
            this.carTabSpr.y += StaticData.offY - 5;
            this.carList.y += StaticData.offY - 5;
            this.eggList.y += StaticData.offY - 5;
            this.havntSpr.y += StaticData.offY - 5;
            this.hadSpr.y += StaticData.offY - 5;
            this.showCarSpr.y += StaticData.offY - 5;
            this.showEggSpr.y += StaticData.offY - 5;
            if (StaticData.isIphoneX) {
                this.bg.loadImage("images/shop_bg.png");
            }
            this.bindEvent();
            this.showEgg();
        }
        bindEvent() {
            this.homeImg.on(Laya.Event.CLICK, this, this.goHome);
            this.buySpr.on(Laya.Event.CLICK, this, this.buy);
            this.freeSpr.on(Laya.Event.CLICK, this, this.freeGet);
            this.hadSpr.on(Laya.Event.CLICK, this, this.startGame);
            this.eggTabSpr.on(Laya.Event.CLICK, this, this.showEgg);
            this.carTabSpr.on(Laya.Event.CLICK, this, this.showCar);
        }
        initCarList() {
            this.carList.array = SkinModle.getCarSkins();
            this.carList.renderHandler = Laya.Handler.create(this, this.updateCarItem, null, false);
            this.carList.scrollBar.hide = true;
            this.carList.scrollBar.elasticBackTime = 200;
            this.carList.scrollBar.elasticDistance = 20;
        }
        buy() {
            if (this.showTab == 1) {
                this.buyEgg();
            }
            else {
                this.buyCar();
            }
        }
        updateCarItem(cell, index) {
            let skinImg = cell.getChildByName("skinSpr");
            let skinBean = this.carList.array[index];
            skinImg.loadImage(SkinConfig.getCarSkinSmall(skinBean.id));
            let maskSpr = cell.getChildByName("maskSpr");
            maskSpr.visible = !skinBean.hadBuy;
            let isUsed = SkinModle.selectCarSkinID == skinBean.id;
            let usedSpr = cell.getChildByName("usedSpr");
            usedSpr.visible = isUsed;
            let isSelect = (this.selectCarId == skinBean.id);
            let bgSpr = cell.getChildByName("bgSpr");
            bgSpr.loadImage(isSelect ? "images/shop_select.png" : "images/shop_unselect.png");
            cell.on(Laya.Event.CLICK, this, function () {
                if (skinBean.hadBuy) {
                    this.selectCarId = skinBean.id;
                    SkinModle.setSelectCarSkinID(this.selectCarId);
                    this.carList.refresh();
                    this.showCarSkin();
                }
                else {
                    this.selectCarId = skinBean.id;
                    this.carList.refresh();
                    this.showCarSkin();
                }
            });
        }
        showCarSkin() {
            let skin = SkinModle.getCarSkinById(this.selectCarId);
            this.showCarSpr.loadImage(SkinConfig.getCarSkinBig(skin.id));
            let offY = StaticData.offY;
            switch (skin.skinModle) {
                case 1:
                    this.showEggSpr.pos(this.eggLocation[0].x, this.eggLocation[0].y + offY);
                    break;
                case 2:
                    this.showEggSpr.pos(this.eggLocation[1].x, this.eggLocation[1].y + offY);
                    break;
                case 3:
                    this.showEggSpr.pos(this.eggLocation[0].x, this.eggLocation[0].y + offY);
                    break;
                case 4:
                    this.showEggSpr.pos(this.eggLocation[2].x, this.eggLocation[2].y + offY);
                    break;
                case 5:
                    this.showEggSpr.pos(this.eggLocation[3].x, this.eggLocation[3].y + offY);
                    break;
                default:
                    this.showEggSpr.pos(this.eggLocation[0].x, this.eggLocation[0].y + offY);
                    break;
            }
            if (skin.hadBuy) {
                this.havntSpr.visible = false;
                this.hadSpr.visible = true;
            }
            else {
                this.havntSpr.visible = true;
                this.hadSpr.visible = false;
                if (skin.getWay == "sign") {
                    this.buySpr.loadImage("images/get_by_sign.png");
                    this.buyCoinLb.visible = false;
                }
                else if (skin.getWay == "coin") {
                    this.buySpr.loadImage("images/btn_32.png");
                    this.buyCoinLb.visible = true;
                    this.buyCoinLb.text = skin.coin;
                }
            }
        }
        buyCar() {
            let skin = SkinModle.getCarSkinById(this.selectCarId);
            if (skin.getWay == "coin") {
                if (CoinModle.getCoin() >= skin.coin) {
                    TipsUtil.msg("购买成功");
                    CoinModle.reduceCoin(skin.coin);
                    SkinModle.addCarSkin(skin.id);
                    SkinModle.setSelectCarSkinID(this.selectCarId);
                    this.carList.refresh();
                    this.showCarSkin();
                }
                else {
                    TipsUtil.msg("金币不足");
                }
            }
            else if (skin.getWay == "sign") {
                Laya.Dialog.open(ConfigData.SignDialog);
            }
        }
        initEggList() {
            this.eggList.array = SkinModle.getEggSkins();
            this.eggList.renderHandler = Laya.Handler.create(this, this.updateEggItem, null, false);
            this.eggList.scrollBar.hide = true;
            this.eggList.scrollBar.elasticBackTime = 200;
            this.eggList.scrollBar.elasticDistance = 20;
        }
        updateEggItem(cell, index) {
            let skinImg = cell.getChildByName("skinSpr");
            let skinBean = this.eggList.array[index];
            skinImg.loadImage(SkinConfig.getEggSkinBig(skinBean.id));
            let maskSpr = cell.getChildByName("maskSpr");
            maskSpr.visible = !skinBean.hadBuy;
            let isUsed = SkinModle.selectEggSkinID == skinBean.id;
            let usedSpr = cell.getChildByName("usedSpr");
            usedSpr.visible = isUsed;
            let isSelect = this.selectEggId == skinBean.id;
            let bgSpr = cell.getChildByName("bgSpr");
            bgSpr.loadImage(isSelect ? "images/shop_select.png" : "images/shop_unselect.png");
            cell.on(Laya.Event.CLICK, this, function () {
                if (skinBean.hadBuy) {
                    this.selectEggId = skinBean.id;
                    SkinModle.setSelectEggSkinID(skinBean.id);
                    this.eggList.refresh();
                    this.showEggSkin();
                }
                else {
                    this.selectEggId = skinBean.id;
                    this.eggList.refresh();
                    this.showEggSkin();
                }
            });
        }
        showEggSkin() {
            let skin = SkinModle.getEggSkinById(this.selectEggId);
            this.showEggSpr.loadImage(SkinConfig.getEggSkinSmall(skin.id));
            if (skin.hadBuy) {
                this.havntSpr.visible = false;
                this.hadSpr.visible = true;
            }
            else {
                this.havntSpr.visible = true;
                this.hadSpr.visible = false;
                this.buySpr.loadImage("images/btn_32.png");
                this.buyCoinLb.visible = true;
                this.buyCoinLb.text = skin.coin;
            }
        }
        buyEgg() {
            let skin = SkinModle.getEggSkinById(this.selectEggId);
            if (CoinModle.getCoin() >= skin.coin) {
                TipsUtil.msg("购买成功");
                CoinModle.reduceCoin(skin.coin);
                SkinModle.addEggSkin(skin.id);
                SkinModle.setSelectEggSkinID(this.selectEggId);
                this.eggList.refresh();
                this.showEggSkin();
            }
            else {
                TipsUtil.msg("金币不足");
            }
        }
        showEgg() {
            if (this.showTab == 1) {
                return;
            }
            this.showTab = 1;
            this.carList.visible = false;
            this.eggList.visible = true;
            this.eggTabSpr.loadImage("images/shop_btn_bg.png");
            this.carTabSpr.loadImage("images/shop_btn_s_bg.png");
            this.carLb.alpha = 0.3;
            this.eggLb.alpha = 1;
            this.showCarSkin();
            this.showEggSkin();
        }
        showCar() {
            if (this.showTab == 2) {
                return;
            }
            this.showTab = 2;
            this.carList.visible = true;
            this.eggList.visible = false;
            this.carTabSpr.loadImage("images/shop_btn_bg.png");
            this.carLb.alpha = 1.0;
            this.eggTabSpr.loadImage("images/shop_btn_s_bg.png");
            this.eggLb.alpha = 0.3;
            this.showCarSkin();
            this.showEggSkin();
        }
        goHome() {
            this.owner.close();
            Laya.Dialog.open(ConfigData.StartGameDialog);
        }
        startGame() {
            this.owner.close();
            GameManage.manageOwner.gameStart(true);
        }
        freeGet() {
            WxADUtil.adOrShare({
                success: () => {
                    this.getFree();
                }
            });
        }
        getFree() {
            if (this.showTab == 1) {
                SkinModle.freeEggSkinID = this.selectEggId;
            }
            else {
                SkinModle.freeCarSkinID = this.selectCarId;
            }
            this.owner.close();
            GameManage.manageOwner.gameStart(true);
        }
    }

    class GamaOverAwardDialogManage extends BaseDialogManage {
        constructor() {
            super(...arguments);
            this.isTimesGet = true;
            this.coinTimes = 1;
        }
        findView() {
            this.titleSpr = this.contentSpr.getChildByName("titleSpr");
            this.midleBgSpr = this.contentSpr.getChildByName("midleBgSpr");
            this.midleSpr = this.contentSpr.getChildByName("midleSpr");
            this.coinNumberLb = this.contentSpr.getChildByName("coinNumberLb");
            this._3TimesBtn = this.contentSpr.getChildByName("_3TimesBtn");
            this.timeGetLb = this.contentSpr.getChildByName("timeGetLb");
            this.checkBoxSpr = this.contentSpr.getChildByName("checkBoxSpr");
            this.checkBoxSel = this.contentSpr.getChildByName("checkBoxSel");
        }
        initView() {
            StaticData.GetCoinTimesNumber = Math.floor(((StaticData.getLevelData(StaticData.level).stationInfo.x - StaticData.remainderRange) / 200));
            this.coinNum = StaticData.GetCoinTimesNumber;
            this.coinTimes = StaticData.GetCoinTimes;
            this.timeGetLb.text = "观看视频" + this.coinTimes + "倍奖励";
            this.coinNumberLb.text = "+" + (this.coinNum * this.coinTimes);
            this._3TimesBtn.on(Laya.Event.CLICK, this, this.onClickAction);
            this.timeGetLb.on(Laya.Event.CLICK, this, this.onClickAction);
            this.checkBoxSpr.on(Laya.Event.CLICK, this, this.onClickAction);
            this.checkBoxSel.on(Laya.Event.CLICK, this, this.onClickAction);
        }
        initData() {
            AldUtil.upload(EnumSkinUtil.getUseCarSkin());
            AldUtil.upload(EnumSkinUtil.getUseEggSkin());
            SkinModle.freeCarSkinID = "0";
            SkinModle.freeEggSkinID = "0";
            CoinModle.doubleCoin(false);
            GameHttp.Instance.endGame();
            AldUtil.stageEnd(false);
        }
        adapterWindow() {
            super.adapterWindow();
            this.titleSpr.y += 124 * StaticData.heightOffsetScale;
            this.midleBgSpr.y += 124 * StaticData.heightOffsetScale;
            this.midleSpr.y += 124 * StaticData.heightOffsetScale;
            this.coinNumberLb.y += 124 * StaticData.heightOffsetScale;
            this._3TimesBtn.y += 170 * StaticData.heightOffsetScale;
            this.timeGetLb.y += 170 * StaticData.heightOffsetScale;
            this.checkBoxSpr.y += 170 * StaticData.heightOffsetScale;
            this.checkBoxSel.y += 170 * StaticData.heightOffsetScale;
            this.scaleBYes(this._3TimesBtn);
            this.horizontalLeadOutSpr.setAldPois("\u91D1\u5E01\u7FFB\u500D\u9875-\u5BFC\u51FA");
            this.horizontalLeadOutSpr.init(true);
        }
        onClickAction(e) {
            switch (e.target.name) {
                case "_3TimesBtn":
                    this.getCoin();
                    break;
                case "timeGetLb":
                case "checkBoxSpr":
                case "checkBoxSel":
                    if (this.isTimesGet) {
                        this.isTimesGet = false;
                        this.coinNumberLb.text = "+" + this.coinNum;
                    }
                    else {
                        this.isTimesGet = true;
                        this.coinNumberLb.text = "+" + (this.coinNum * this.coinTimes);
                    }
                    this.checkBoxSel.visible = this.isTimesGet;
                    break;
            }
        }
        getCoin() {
            if (this.isTimesGet) {
                WxADUtil.adOrShare({
                    success: () => {
                        if (this.coinNum == 3) {
                            AldUtil.upload("\u91D1\u5E01\u7FFB\u500D\u9875-3\u500D\u9886\u53D6");
                        }
                        else if (this.coinNum == 5) {
                            AldUtil.upload("\u91D1\u5E01\u7FFB\u500D\u9875-5\u500D\u9886\u53D6");
                        }
                        this.coinNum = this.coinTimes * this.coinNum;
                        CoinModle.addCoin(this.coinNum);
                        this.skipNextPage();
                    },
                    fail: () => {
                        AldUtil.upload("\u91D1\u5E01\u7FFB\u500D\u9875-\u666E\u901A\u9886\u53D6");
                        CoinModle.addCoin(this.coinNum);
                        this.skipNextPage();
                    }
                });
            }
            else {
                AldUtil.upload("\u91D1\u5E01\u7FFB\u500D\u9875-\u666E\u901A\u9886\u53D6");
                CoinModle.addCoin(this.coinNum);
                this.skipNextPage();
            }
        }
        skipNextPage() {
            if (this.coinTimes == 5) {
                Laya.Dialog.open(ConfigData.StartGameDialog);
            }
            else {
                Laya.Dialog.open(ConfigData.GameFinishDialog);
            }
        }
    }

    class MuneDialogManage extends BaseDialogManage {
        onEnable() {
            super.onEnable();
            this.owner.popupEffect = new Laya.Handler(this, function (dialog) {
                dialog.x = -StaticData.gameWidth;
                dialog.y = 0;
                dialog.scaleX = 1;
                dialog.scaleY = 1;
                Laya.Tween.to(dialog, { x: 0, y: 0 }, 300, Laya.Ease.linearNone);
            });
            this.owner.closeEffect = new Laya.Handler(this, function (dialog) {
                Laya.Tween.to(dialog, { x: -StaticData.gameWidth, y: 0 }, 500, Laya.Ease.linearNone);
            });
            this.bgImg = this.owner.getChildByName("bgImg");
            this.backSpr = this.owner.getChildByName("backSpr");
            this.soundSpr = this.owner.getChildByName("soundSpr");
            this.kfSpr = this.owner.getChildByName("kfSpr");
            this.quanSpr = this.owner.getChildByName("quanSpr");
            this.hotSpr = this.owner.getChildByName("hotGameSpr");
            this._back = this.owner.getChildByName("_back");
            this.owner.y = 0;
            this.owner.height = StaticData.gameHeight;
            this.backSpr.height = StaticData.gameHeight;
            this.backSpr.on(Laya.Event.CLICK, this, () => {
                Laya.Dialog.open(ConfigData.StartGameDialog);
                this.owner.close();
                if (GamePlatform.platformName == GamePlatform.WX && Laya.Browser.onWeiXin && this.wxbutton != null) {
                    this.wxbutton.destroy();
                }
            });
            if (SoundUtil.isPlayMusic) {
                this.soundSpr.loadImage("images/mune_v.png");
            }
            else {
                this.soundSpr.loadImage("images/mune_v_n.png");
            }
            this.soundSpr.on(Laya.Event.CLICK, this, () => {
                if (SoundUtil.isPlayMusic) {
                    SoundUtil.stopMusic();
                    this.soundSpr.loadImage("images/mune_v_n.png");
                }
                else {
                    SoundUtil.playMusic();
                    this.soundSpr.loadImage("images/mune_v.png");
                }
            });
            this.kfSpr.on(Laya.Event.CLICK, this, () => {
                if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                    GamePlatform.platform.openCustomerServiceConversation({});
                }
            });
            this.hotSpr.on(Laya.Event.CLICK, this, () => {
                Laya.Dialog.open(ConfigData.OthersGamesDialog);
            });
            this._back.on(Laya.Event.CLICK, this, () => {
                Laya.Dialog.open(ConfigData.StartGameDialog);
                this.owner.close();
            });
            if (GamePlatform.platformName == GamePlatform.WX && Laya.Browser.onWeiXin) {
                let sysInfo = GamePlatform.platform.getSystemInfoSync();
                let wxWidth = sysInfo.screenWidth;
                let wxHeight = sysInfo.screenHeight;
                let xPercent = this.quanSpr.x / StaticData.gameWidth;
                let yPercent = this.quanSpr.y / StaticData.gameHeight;
                let wPercent = this.quanSpr.width / StaticData.gameWidth;
                let hPercent = this.quanSpr.height / StaticData.gameHeight;
                this.wxbutton = GamePlatform.platform.createGameClubButton({
                    type: "image",
                    image: 'images/mune_q.png',
                    icon: "white",
                    style: {
                        left: wxWidth * xPercent,
                        top: wxHeight * yPercent,
                        width: wxWidth * wPercent,
                        height: wxHeight * hPercent,
                    }
                });
            }
            if (GamePlatform.platformName != GamePlatform.WX) {
                this.kfSpr.visible = false;
                this.quanSpr.visible = false;
                this.hotSpr.visible = false;
            }
        }
        onDisable() {
            super.onDisable();
            if (GamePlatform.platformName == GamePlatform.WX && Laya.Browser.onWeiXin && this.wxbutton != null) {
                this.wxbutton.destroy();
            }
        }
    }

    class LeadOutGrid2RunTime extends Laya.Sprite {
        constructor() {
            super();
            LeadOutGrid2RunTime._instance = this;
        }
        static getInstance() {
            if (LeadOutGrid2RunTime.prototype == null) {
                LeadOutGrid2RunTime._instance = new LeadOutGrid2RunTime();
            }
            return LeadOutGrid2RunTime._instance;
        }
        onAwake() {
            this.gameList = this.getChildByName("gameList");
            if (GamePlatform.platformName == GamePlatform.WX) {
                this.initData();
            }
            else {
                this.visible = false;
            }
        }
        initData() {
            this.gl = StaticData.getGameListRadom(9);
            if (this.gl != null && this.gl.length > 0) {
                this.gameList.array = this.gl;
                this.gameList.renderHandler = Laya.Handler.create(this, this.updateItem, null, false);
            }
        }
        updateItem(call, index) {
            let item = this.gl[index];
            if (item != null) {
                let gameIcon = call.getChildByName("gameIcon");
                let gameName = call.getChildByName("gameName");
                if (gameIcon != null) {
                    gameIcon.loadImage(item.img, Laya.Handler.create(this, () => {
                        let cmaskSpr = new Laya.Sprite();
                        cmaskSpr.width = gameIcon.width;
                        cmaskSpr.height = gameIcon.height;
                        cmaskSpr.loadImage("images/leadout_icon_bg.png");
                        gameIcon.mask = cmaskSpr;
                    }));
                }
                gameName.text = item.title;
                call.on(Laya.Event.CLICK, this, function () {
                    LeadOutUtil.leadOut(item, this.ald_pois);
                });
            }
            else {
                call.visible = false;
            }
        }
        setAldPois(pois) {
            this.ald_pois = pois;
            console.log("LeadOutGrid2RunTime 阿拉丁代号：", pois);
        }
    }

    class OthersGameDialog extends BaseDialogManage {
        findView() {
            this.close = this.contentSpr.getChildByName("_close");
            this.leadOut = this.contentSpr.getChildByName("listSpr2");
            this.bgSpr = this.contentSpr.getChildByName("bgSpr");
        }
        initView() {
            this.close.on(Laya.Event.CLICK, this, () => {
                this.owner.close();
                Laya.Dialog.open(ConfigData.StartGameDialog);
            });
            this.leadOut.setAldPois("\u5176\u4ED6\u6E38\u620F\u9875-\u5BFC\u51FA");
        }
        adapterWindow() {
            super.adapterWindow();
            this.close.y += StaticData.offY;
            this.leadOut.y += StaticData.offY;
            this.bgSpr.y += StaticData.offY;
        }
    }

    class PauseDialogManage extends BaseDialogManage {
        findView() {
            this.continueSpr = this.contentSpr.getChildByName("continueSpr");
            this.goHome = this.contentSpr.getChildByName("goHome");
            this.voiceSpr = this.contentSpr.getChildByName("voiceSpr");
            this.replay = this.contentSpr.getChildByName("replay");
        }
        initView() {
            this.continueSpr.on(Laya.Event.CLICK, this, () => { this.owner.close(); });
            this.replay.on(Laya.Event.CLICK, this, () => {
                this.owner.close();
                GameManage.getManage().restart();
            });
            this.goHome.on(Laya.Event.CLICK, this, () => {
                SkinModle.freeCarSkinID = "0";
                SkinModle.freeEggSkinID = "0";
                CoinModle.doubleCoin(false);
                GameManage.manageOwner.refreshUI();
                Laya.Dialog.open(ConfigData.StartGameDialog);
            });
            this.voiceSpr.on(Laya.Event.CLICK, this, () => {
                if (SoundUtil.isPlayMusic) {
                    this.voiceSpr.loadImage("images/no_voice.png");
                    SoundUtil.stopMusic();
                }
                else {
                    this.voiceSpr.loadImage("images/voice.png");
                    SoundUtil.playMusic();
                }
            });
            if (SoundUtil.isPlayMusic) {
                this.voiceSpr.loadImage("images/voice.png");
            }
            else {
                this.voiceSpr.loadImage("images/no_voice.png");
            }
            this.horizontalLeadOutSpr.setAldPois("\u6682\u505C\u9875-\u5BFC\u51FA");
            this.horizontalLeadOutSpr.init(false);
        }
        adapterWindow() {
            super.adapterWindow();
            this.continueSpr.y += StaticData.offY;
            this.goHome.y += StaticData.offY;
            this.voiceSpr.y += StaticData.offY;
            this.replay.y += StaticData.offY;
            this.horizontalLeadOutSpr.y += StaticData.offY;
            WxADUtil.showBannerAd();
        }
    }

    class RankDiaogManage extends BaseDialogManage {
        onEnable() {
            super.onEnable();
            this.closeSpr = this.contentSpr.getChildByName("close");
            this.otherGame = this.contentSpr.getChildByName("otherGames");
            this.inviteSpr = this.contentSpr.getChildByName("inviteSpr");
            this.ownerItem = this.contentSpr.getChildByName("ownerItem");
            this.rankPanel = this.contentSpr.getChildByName("rankPanel");
            this.rankPanel.vScrollBar.hide = true;
            this.rankPanel.vScrollBar.elasticBackTime = 200;
            this.rankPanel.vScrollBar.elasticDistance = 120;
            this.closeSpr.on(Laya.Event.CLICK, this, this.closeAction);
            this.otherGame.on(Laya.Event.CLICK, this, () => {
                AldUtil.upload("\u6392\u884C\u699C\u9875-\u597D\u53CB\u5728\u73A9");
                Laya.Dialog.open(ConfigData.OthersGamesDialog);
            });
            this.inviteSpr.on(Laya.Event.CLICK, this, () => {
                AldUtil.upload("\u6392\u884C\u699C\u9875-\u5206\u4EAB\u9080\u8BF7");
                WxADUtil.share({});
            });
            this.showRankList();
        }
        closeAction() {
            this.owner.close();
            Laya.Dialog.open(ConfigData.StartGameDialog);
        }
        showRankList() {
            if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                let open = this.rankPanel.addChild(GamePlatform.openDataContext.createDisplayObject());
                open.width = this.rankPanel.width;
                open.height = 110 * 10;
                open.postMsg({
                    command: "rank_list",
                    data: { width: this.rankPanel.width, height: 110 * 10 }
                });
            }
        }
        showOwner() {
            if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                let open = this.ownerItem.addChild(GamePlatform.openDataContext.createDisplayObject());
                open.width = this.ownerItem.width;
                open.height = this.ownerItem.height;
                open.postMsg({
                    command: "rank_owner",
                    data: { width: this.rankPanel.width, height: this.ownerItem.height }
                });
            }
        }
    }

    class SignManage extends BaseDialogManage {
        constructor() {
            super(...arguments);
            this.isChecked = true;
        }
        onEnable() {
            super.onEnable();
            this.contentSpr.y += StaticData.offY;
            let cancelSpr = this.contentSpr.getChildByName("cancelSpr");
            let doSign = this.contentSpr.getChildByName("doSign");
            let signBox = this.contentSpr.getChildByName("signBox");
            cancelSpr.on(Laya.Event.CLICK, this, () => {
                this.owner.close();
            });
            doSign.on(Laya.Event.CLICK, this, () => {
                if (SignModle.getTodaySigned()) {
                    this.owner.close();
                }
                else {
                    if (this.isChecked) {
                        WxADUtil.adOrShare({
                            success: () => {
                                SignModle.sign(true);
                                this.owner.close();
                            },
                            fail: () => {
                                SignModle.sign(false);
                                this.owner.close();
                            }
                        });
                    }
                    else {
                        SignModle.sign(false);
                        this.owner.close();
                    }
                }
            });
            this.initSignDay();
            if (SignModle.getTodaySigned()) {
                doSign.loadImage("images/sign_tomorrow.png");
            }
            this.checkBox = this.contentSpr.getChildByName("checkBox");
            this.checkLb = this.contentSpr.getChildByName("checkLb");
            this.checkBox.visible = !SignModle.getTodaySigned();
            this.checkLb.visible = !SignModle.getTodaySigned();
            this.checkBox.on(Laya.Event.CLICK, this, this.checkAction);
            this.checkLb.on(Laya.Event.CLICK, this, this.checkAction);
        }
        checkAction() {
            this.isChecked = !this.isChecked;
            if (this.isChecked) {
                this.checkBox.loadImage("images/box_select.png");
            }
            else {
                this.checkBox.loadImage("images/box_unselect.png");
            }
        }
        initSignDay() {
            let signBox = this.contentSpr.getChildByName("signBox");
            this.day1 = signBox.getChildByName("day1");
            this.day2 = signBox.getChildByName("day2");
            this.day3 = signBox.getChildByName("day3");
            this.day4 = signBox.getChildByName("day4");
            this.day5 = signBox.getChildByName("day5");
            this.day6 = signBox.getChildByName("day6");
            this.day7 = signBox.getChildByName("day7");
            this.daySprs = [this.day1, this.day2, this.day3, this.day4, this.day5, this.day6, this.day7];
            this.setSignData();
        }
        setSignData() {
            for (let i = 0; i < this.daySprs.length; i++) {
                if (i < 6) {
                    let daySignedBgSpr = this.daySprs[i].getChildByName("daySignedBgSpr");
                    let dayBgSpr = this.daySprs[i].getChildByName("dayBgSpr");
                    let dayLb = this.daySprs[i].getChildByName("dayLb");
                    let coinLb = this.daySprs[i].getChildByName("coinLb");
                    let maskSpr = this.daySprs[i].getChildByName("maskSpr");
                    dayLb.text = "第" + (i + 1) + "天";
                    coinLb.text = String(SignModle.coinNum[i]);
                    if (i < SignModle.getSignDays()) {
                        daySignedBgSpr.visible = true;
                        maskSpr.visible = true;
                        dayBgSpr.visible = false;
                    }
                    else if (i == SignModle.getSignDays() && SignModle.getSignDays() < 5 && !SignModle.getTodaySigned()) {
                        daySignedBgSpr.visible = true;
                        maskSpr.visible = false;
                        dayBgSpr.visible = false;
                    }
                    else {
                        daySignedBgSpr.visible = false;
                        maskSpr.visible = false;
                        dayBgSpr.visible = true;
                    }
                }
                else {
                    let signAwardLb = this.daySprs[i].getChildByName("signAwardLb");
                    let imgSpr = this.daySprs[i].getChildByName("imgSpr");
                    let maskSpr = this.daySprs[i].getChildByName("maskSpr");
                    if (SignModle.hadCarAward == 0) {
                        signAwardLb.text = SignModle.carAward.name;
                        imgSpr.loadImage(SignModle.carAward.img);
                        imgSpr.pos(SignModle.carAward.x, SignModle.carAward.y);
                    }
                    else {
                        signAwardLb.text = String(SignModle.coinNum[i]) + " 金币";
                        imgSpr.loadImage("images/award_coin.png");
                    }
                    if (SignModle.getSignDays() == 7 && SignModle.getTodaySigned()) {
                        maskSpr.visible = true;
                    }
                    else {
                        maskSpr.visible = false;
                    }
                }
            }
        }
        onDisable() {
            super.onDisable();
            Laya.Dialog.open(ConfigData.StartGameDialog);
        }
    }

    class SkinFreeDialogManage extends BaseDialogManage {
        findView() {
            this.titleLb = this.contentSpr.getChildByName("titleLb");
            this.midleBg = this.contentSpr.getChildByName("midleBg");
            this.freeSkinList = this.contentSpr.getChildByName("freeSkinList");
        }
        initView() {
            StaticData.carOrEggFree = !StaticData.carOrEggFree;
            this.freeSkins = [];
            let go = true;
            while (go) {
                let skinId;
                if (StaticData.carOrEggFree) {
                    skinId = Math.round((Math.random() * 9)) + 2;
                    skinId = Math.min(11, skinId);
                    skinId = Math.max(2, skinId);
                    if (skinId == 9) {
                        skinId = 8;
                    }
                }
                else {
                    skinId = Math.round((Math.random() * 7)) + 2;
                    skinId = Math.min(9, skinId);
                    skinId = Math.max(2, skinId);
                }
                if (String(skinId) != SkinModle.selectCarSkinID) {
                    let isAdd = false;
                    for (let id of this.freeSkins) {
                        if (id == skinId) {
                            isAdd = true;
                            break;
                        }
                    }
                    if (!isAdd) {
                        this.freeSkins.push(skinId);
                    }
                    if (this.freeSkins.length == 4) {
                        go = false;
                    }
                }
            }
            this.freeSkinList.array = this.freeSkins;
            this.freeSkinList.renderHandler = Laya.Handler.create(this, this.updateItem, null, false);
        }
        updateItem(call, index) {
            let item = this.freeSkins[index];
            if (item != null) {
                let carSkinSpr = call.getChildByName("carSkinSpr");
                let eggSkinSpr = call.getChildByName("eggSkinSpr");
                let userBtn = call.getChildByName("userBtn");
                if (StaticData.carOrEggFree) {
                    carSkinSpr.loadImage(SkinConfig.getCarSkinBig(item));
                }
                else {
                    eggSkinSpr.loadImage(SkinConfig.getEggSkinBig(item));
                }
                userBtn.on(Laya.Event.CLICK, this, () => {
                    AldUtil.upload("\u968F\u673A\u76AE\u80A4\u8BD5\u7528-\u4F7F\u7528");
                    WxADUtil.adOrShare({
                        success: () => {
                            if (StaticData.carOrEggFree) {
                                SkinModle.freeCarSkinID = String(item);
                            }
                            else {
                                SkinModle.freeEggSkinID = String(item);
                            }
                            this.owner.close();
                        },
                        fail: () => {
                            this.owner.close();
                        }
                    });
                });
            }
            else {
                call.visible = false;
            }
        }
        adapterWindow() {
            super.adapterWindow();
            this.titleLb.y += 222 * StaticData.heightOffsetScale;
            this.midleBg.y += 222 * StaticData.heightOffsetScale;
            this.freeSkinList.y += 222 * StaticData.heightOffsetScale;
        }
        yesAction() {
            AldUtil.upload("\u968F\u673A\u76AE\u80A4\u8BD5\u7528-\u4F7F\u7528");
            WxADUtil.adOrShare({
                success: () => {
                    let freeId = String(this.freeSkins[Math.round(Math.random() * 3)]);
                    if (StaticData.carOrEggFree) {
                        SkinModle.freeCarSkinID = freeId;
                    }
                    else {
                        SkinModle.freeEggSkinID = freeId;
                    }
                    this.owner.close();
                },
                fail: () => {
                    this.owner.close();
                }
            });
        }
        noAction() {
            AldUtil.upload("\u968F\u673A\u76AE\u80A4\u8BD5\u7528-\u8DF3\u8FC7");
            this.owner.close();
        }
        onDisable() {
            super.onDisable();
            WxADUtil.hideBannerAd();
            GameManage.manageOwner.gameStart(false);
        }
    }

    class StartDialogManage extends BaseDialogManage {
        constructor() {
            super(...arguments);
            this.loadTime = 0;
        }
        onEnable() {
            super.onEnable();
            Laya.timer.once(3000, this, () => {
                ThreePartyUtil.showVidoeAd();
            });
        }
        findView() {
            this.horizontalLeadOutSpr = this.owner.getChildByName("bottomLeadOut");
            this.startGameSpr = this.owner.getChildByName('startGameSpr');
            this.startTxtSpr = this.owner.getChildByName('startTxtSpr');
            this.stationNameLb = this.owner.getChildByName("stationNameLb");
            this.nowStationLb = this.owner.getChildByName("nowStationLb");
            this.shopSpr = this.owner.getChildByName('shopSpr');
            this.muneSpr = this.owner.getChildByName('muneSpr');
            this.rankSpr = this.owner.getChildByName('rankSpr');
            this.leadOutSpr1 = this.owner.getChildByName('leadOutSpr1');
            this.leadOutSpr2 = this.owner.getChildByName('leadOutSpr2');
            this.leadOutSpr3 = this.owner.getChildByName('leadOutSpr3');
            this.leadOutSpr4 = this.owner.getChildByName('leadOutSpr4');
            this.leadOutSpr_1 = this.leadOutSpr1.getChildByName('leadOutSpr_1');
            this.leadOutSpr_2 = this.leadOutSpr2.getChildByName('leadOutSpr_2');
            this.leadOutSpr_3 = this.leadOutSpr3.getChildByName('leadOutSpr_3');
            this.leadOutSpr_4 = this.leadOutSpr4.getChildByName('leadOutSpr_4');
            this.signSpr = this.owner.getChildByName("signSpr");
            this.pointSpr = this.signSpr.getChildByName("pointSpr");
            this.pointSpr.visible = !SignModle.getTodaySigned();
        }
        initView() {
            if (StaticData.level == 0) {
                this.stationNameLb.text = "";
                this.nowStationLb.text = "出发地";
            }
            else {
                this.stationNameLb.text = "- 第 " + (StaticData.level) + " 站 -";
            }
            GameManage.manageOwner.gameState = GameState.NOT_START;
            this.startGameSpr.on(Laya.Event.CLICK, this, this.onClickAction);
            this.shopSpr.on(Laya.Event.CLICK, this, this.onClickAction);
            this.rankSpr.on(Laya.Event.CLICK, this, this.onClickAction);
            this.muneSpr.on(Laya.Event.CLICK, this, this.onClickAction);
            this.signSpr.on(Laya.Event.CLICK, this, this.onClickAction);
        }
        adapterWindow() {
            super.adapterWindow();
            this.startTxtSpr.y += StaticData.offY;
            this.muneSpr.y += 173 * StaticData.heightOffsetScale;
            this.rankSpr.y += 173 * StaticData.heightOffsetScale;
            this.shopSpr.y += 173 * StaticData.heightOffsetScale;
            this.signSpr.y += 173 * StaticData.heightOffsetScale;
            this.leadOutSpr1.y += 173 * StaticData.heightOffsetScale;
            this.leadOutSpr2.y += 173 * StaticData.heightOffsetScale;
            this.leadOutSpr3.y += 173 * StaticData.heightOffsetScale;
            this.leadOutSpr4.y += 173 * StaticData.heightOffsetScale;
            if (GamePlatform.platformName != GamePlatform.WX) {
                this.rankSpr.visible = false;
                this.muneSpr.y = this.rankSpr.y;
            }
            WxADUtil.showStartBannerAd();
        }
        setLeadOutData() {
            if (GamePlatform.platformName != GamePlatform.WX) {
                return;
            }
            this.loadTime++;
            if (this.loadTime > 10) {
                console.log("导出加载失败");
                return;
            }
            if (StaticData.gameList != null && StaticData.getGameListSize() > 4) {
                this.hadLoadGameList = true;
                let cmaskSpr = new Laya.Sprite();
                cmaskSpr.width = 100;
                cmaskSpr.height = 100;
                cmaskSpr.loadImage("images/leadout_icon_bg.png");
                this.listGame = StaticData.getGameListRadom(4);
                if (this.listGame != null) {
                    this.leadOutSpr_1.loadImage(this.listGame[0].img, Laya.Handler.create(this, () => {
                        this.leadOutSpr_1.mask = cmaskSpr;
                    }));
                    this.leadOutSpr_2.loadImage(this.listGame[1].img, Laya.Handler.create(this, () => {
                        this.leadOutSpr_2.mask = cmaskSpr;
                    }));
                    this.leadOutSpr_3.loadImage(this.listGame[2].img, Laya.Handler.create(this, () => {
                        this.leadOutSpr_3.mask = cmaskSpr;
                    }));
                    this.leadOutSpr_4.loadImage(this.listGame[3].img, Laya.Handler.create(this, () => {
                        this.leadOutSpr_4.mask = cmaskSpr;
                    }));
                    this.leadOutSpr_1.on(Laya.Event.CLICK, this, this.onClickAction);
                    this.leadOutSpr_2.on(Laya.Event.CLICK, this, this.onClickAction);
                    this.leadOutSpr_3.on(Laya.Event.CLICK, this, this.onClickAction);
                    this.leadOutSpr_4.on(Laya.Event.CLICK, this, this.onClickAction);
                    this.leadOutSpr1.visible = true;
                    this.leadOutSpr2.visible = true;
                    this.leadOutSpr3.visible = true;
                    this.leadOutSpr4.visible = true;
                }
            }
            else {
                this.hadLoadGameList = false;
                Laya.timer.clearAll(this);
                Laya.timer.once(1000, this, this.setLeadOutData, null, false);
            }
        }
        onClickAction(e) {
            switch (e.target.name) {
                case "startGameSpr":
                    this.startGame();
                    break;
                case "shopSpr":
                    this.shop();
                    break;
                case "muneSpr":
                    this.mune();
                    break;
                case "rankSpr":
                    this.rank();
                    break;
                case "signSpr":
                    this.sign();
                    break;
                case "leadOutSpr_1":
                    LeadOutUtil.leadOut(this.listGame[0], "\u9996\u9875-\u53F31\u5BFC\u51FA");
                    break;
                case "leadOutSpr_2":
                    LeadOutUtil.leadOut(this.listGame[1], "\u9996\u9875-\u53F32\u5BFC\u51FA");
                    break;
                case "leadOutSpr_3":
                    LeadOutUtil.leadOut(this.listGame[2], "\u9996\u9875-\u53F33\u5BFC\u51FA");
                    break;
                case "leadOutSpr_4":
                    LeadOutUtil.leadOut(this.listGame[3], "\u9996\u9875-\u53F34\u5BFC\u51FA");
                    break;
                default:
                    break;
            }
        }
        shop() {
            AldUtil.upload("\u9996\u9875-\u76AE\u80A4");
            Laya.Dialog.open(ConfigData.ShopDialog);
        }
        rank() {
            AldUtil.upload("\u9996\u9875-\u6392\u884C");
            Laya.Dialog.open(ConfigData.RankDialog);
        }
        mune() {
            AldUtil.upload("\u9996\u9875-\u83DC\u5355");
            Laya.Dialog.open(ConfigData.MuneDialog);
        }
        sign() {
            AldUtil.upload("\u9996\u9875-\u7B7E\u5230");
            Laya.Dialog.open(ConfigData.SignDialog);
        }
        startGame() {
            GameManage.manageOwner.gameStart(true);
            this.owner.close();
            if (LocalStorageUtil.getBoolean("isNewUser", true)) {
                LocalStorageUtil.setBoolean("isNewUser", false);
            }
            else {
                Laya.Dialog.open(ConfigData.SkinFreeDialog);
            }
        }
    }

    class StartGameInitModle extends BaseModle {
        static initData() {
            GameHttp.Instance.login();
            CoinModle.init();
            SignModle.init();
            let l = LocalStorageUtil.getNumber(StaticData.LEVEL);
            if (l != null) {
                StaticData.level = Number(l);
            }
            else {
                LocalStorageUtil.add(StaticData.LEVEL, StaticData.level);
            }
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, () => {
                this.loadProgress++;
                Laya.Scene.open("scene/game/game.scene");
            }));
        }
        static loadLevelJson() {
            StaticData.levels = Laya.loader.getRes("level.json");
        }
        static loadSkinJson() {
            SkinModle.init(Laya.loader.getRes("skin.json").carSkin, Laya.loader.getRes("skin.json").eggSkin);
        }
    }
    StartGameInitModle.loadProgress = 0;
    StartGameInitModle.jsons = [];

    class Loading extends Laya.Script {
        onEnable() {
            AldUtil.upload("\u52A0\u8F7D\u9875");
            this.box = this.owner.getChildByName("box");
            this.loadingLb = this.box.getChildByName("loadingLb");
            if (!StaticData.isIphoneX) {
                this.box.y -= StaticData.offY;
            }
            else {
                this.box.y = 0;
            }
        }
        onStart() {
            StartGameInitModle.initData();
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("runtimes/LeadOutListRunTime.ts", LeadOutListRunTime);
            reg("manages/dialogManage/FLBoxDialogManage.ts", FLBoxDialogManage);
            reg("manages/dialogManage/FreeSkinOfStartDialogManage.ts", FreeSkinOfStartDialogManage);
            reg("runtimes/DialogBgRunTime.ts", DialogBgRunTime);
            reg("manages/dialogManage/AwardDialogManage.ts", AwardDialogManage);
            reg("runtimes/LeadOutGridRunTime.ts", LeadOutGridRunTime);
            reg("manages/dialogManage/GameFinishDialogManage.ts", GameFinishDialogManage);
            reg("manages/dialogManage/GameOverDialogManage.ts", GameOverDialogRunTime);
            reg("manages/dialogManage/ShopManage.ts", ShopManage);
            reg("manages/dialogManage/GetCoinTimtsDialogManage.ts", GamaOverAwardDialogManage);
            reg("manages/dialogManage/MuneDialogManage.ts", MuneDialogManage);
            reg("runtimes/LeadOutGrid2RunTime.ts", LeadOutGrid2RunTime);
            reg("manages/dialogManage/OthersGameDialog.ts", OthersGameDialog);
            reg("manages/dialogManage/PauseDialogManage.ts", PauseDialogManage);
            reg("manages/dialogManage/RankDiaogManage.ts", RankDiaogManage);
            reg("manages/dialogManage/SignManage.ts", SignManage);
            reg("manages/dialogManage/SkinFreeDialogManage.ts", SkinFreeDialogManage);
            reg("manages/dialogManage/StartDialogManage.ts", StartDialogManage);
            reg("manages/GameManage.ts", GameManage);
            reg("manages/Loading.ts", Loading);
        }
    }
    GameConfig.width = 750;
    GameConfig.height = 1334;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "center";
    GameConfig.startScene = "scene/game/loading.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();
    GamePlatform.init();

}());

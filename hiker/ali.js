const ali = {
    rulePath: 'hiker://files/rules/icy/ali.js',
    urls: {
        settingPath: 'hiker://files/rules/icy/icy-settings-ali.json',
        customerSettingPath: 'hiker://files/rules/icy/icy-ali-customer.json',
        tokenPath: 'hiker://files/rules/icy/icy-ali-token.json',
    
        // settingHtmlPath: 'file:///storage/emulated/0/Android/data/com.example.hikerview/files/Documents/rules/icy/icy-settings-ali.html',

        remoteConfig: ['https://gitee.com/fly1397/hiker-icy/raw/master/settings-ali.json', 'https://cdn.jsdelivr.net/gh/fly1397/hiker-icy/settings-ali.json', 'http://lficy.com:30000/mrfly/hiker-icy/raw/master/settings-ali.json'],
    },
    images: {
        zimu: 'https://lanmeiguojiang.com/tubiao/more/186.png',
        folder: 'https://lanmeiguojiang.com/tubiao/more/201.png',
        img: 'https://lanmeiguojiang.com/tubiao/more/295.png',
        video: 'https://lanmeiguojiang.com/tubiao/more/321.png',
        audio: 'https://lanmeiguojiang.com/tubiao/music/115.svg',
        book: 'https://lanmeiguojiang.com/tubiao/more/133.png',
        unknown: 'https://lanmeiguojiang.com/tubiao/more/2.png',
        order: 'https://lanmeiguojiang.com/tubiao/more/31.png',
        view: 'https://lanmeiguojiang.com/tubiao/more/213.png',
        source: 'https://lanmeiguojiang.com/tubiao/movie/16.svg',
    },
    version: '2023/02/19',
    randomPic: 'htt/ps://api.lmrjk.cn/mt', //二次元 http://api.lmrjk.cn/img/api.php 美女 https://api.lmrjk.cn/mt
    // dev 模式优先从本地git获取
    isDev: false,

    // 强制更新config
    forceConfigUpdate: false,
    // 阿里共享账号设置
    usePublicToken: false,
    publicToken: '',
    //开起热搜榜
    useSuggestQuery: true,
    sourcePlay: false,

    // 颜色
    primaryColor: '#f47983',
    
    update: function(){
        const version = getItem('icy_ali_version');
        if(version !== null && Number(version) !== 0 && version != this.version) {
            var js = $.toString(() => {
                eval(fetch("hiker://files/rules/icy/ali.js"));
                ali.initConfig(true);
                setItem("icy_ali_version", ali.version);
                refreshPage();
                confirm({
                    title:"更新成功",
                    content:"最新版本：" + ali.version
                })
            })
            // eval(js)
            confirm({
                title: '版本更新 ',
                content: (version || 'N/A') +'=>'+ this.version + '\n1,修复登录及播放的问题',
                confirm: 'eval(fetch("hiker://files/rules/icy/ali.js"));ali.initConfig(true);setItem("icy_ali_version", ali.version);refreshPage();confirm({title:"更新成功",content:"最新版本：" + ali.version})'
            })
        }
    },
    formatBytes: function(a, b) { 
        if (0 == a) return "0 B"; 
        var c = 1024, d = b || 2, e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); 
        return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
    },
    getEmptyTitle: function(_title, _desc){
        // 修复部分贴没有标题，提取「分享主题」作为标题
        let desc = _desc.trim();
        let title = _title;
        if(!title){
            const maName = desc.match(/[译|片]\s*名\s*(.*)/);
            const maDesc = desc.match(/「(.*)」，?/);
            const maDesc_2 = desc.match(/『(.*)』/);
            if(maName && maName[1]){
                title = maName[1].split('◎')[0].replace('：', '');
            }else if(maDesc) {
                title = maDesc[1].split('」')[0];
            } else if(maDesc_2) {
                title = maDesc_2[1];
            } else {
                if(desc.includes('，')){
                    title = desc.split(/，/)[0];
                } else {
                    title = desc.split(/\s+/)[0];
                    if(title.length < 2) {
                        title = desc
                    }
                }
            }
        }
        const titleDom = '<div class="fortext">' + title || '' + '</div>';
        let result = parseDomForHtml(titleDom, '.fortext&&Text');
        let len = 24;
        if(result.length > len) {
            result = result.substr(0, len) + '...'
        }
        return result;
    },
    formatDate: function(_date, _fmt) {
        let fmt = _fmt || "yyyy-MM-dd HH:mm:ss";
        const date = !isNaN(_date) ? new Date(_date*1000) : new Date(_date);
        const o = {
            "M+": date.getMonth() + 1, //月份 
            "d+": date.getDate(), //日 
            "h+": date.getHours()%12 == 0 ? 12 : date.getHours()%12,
            "H+": date.getHours(), //小时 
            "m+": date.getMinutes(), //分 
            "s+": date.getSeconds(), //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds() //毫秒 
        };
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
        }
        for(let k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt; 
    },
    formatSize: function(size){
        if(!size) {
            return '';
        }
        const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let i = 0;
        while (size >= 1024) {
            size /= 1024;
            i++;
        }
        size = i ? Number(size.toFixed(2)) : size;
        return `${size} ${units[i]}`;
    },
    searchFetch: function(host, url, keyword, page, cookie){
        const {fyarea, fyclass, fyyear, fysort} = this.getFilter(true);
        const link = url.replace('**', keyword).replace('fypage', (((page||1) - 1) * 20)).replace('fyarea', fyarea).replace('fyclass', fyclass).replace('fyyear', fyyear).replace('fysort', fysort);
        const headers = {"Referer": link, 'User-Agent': MOBILE_UA,};
        headers['cookie'] = (cookie || '');
        return fetch(link, {headers: headers});
    },
    activeModel: function(searchPage) {
        let model_search = getVar('icy_ali_model');
        this.getConfig();
        const {searchModel} = this;
        if(searchPage) {
            model_search = getVar('icy_ali_model_search');
        }
        let deafultModel = searchModel[0];
        const hasToken = fileExist(this.urls.tokenPath) == 'true' || fileExist(this.urls.tokenPath) == true;
        if(hasToken) {
            deafultModel = null;
        }
        return searchModel ? searchModel.find(item => item.val == model_search) || (searchPage ? searchModel[0] : deafultModel): null;
    },
    objData: function(obj, path){
        let _obj = obj;
        path.split('&&').forEach(_path => {
            _obj = _obj[_path];
        })
        return _obj;
    },
    strData: function(obj, path){
        let _obj = obj;
        path.split('&&').forEach(_path => {
            _obj = _obj[_path];
        })
        return _obj;
    },
    searchModel: [],
    emptyRule: $("#noLoading#").lazyRule(()=>{return "toast://Emmm~~!"}),
    getConfig: function(){
        const {settingPath, remoteConfig, customerSettingPath} = this.urls;
        putVar('icy_ali_customer', customerSettingPath);
        const haveSetting = fileExist(settingPath) == 'true' || fileExist(settingPath) == true;
        let json = haveSetting ? fetch(settingPath) : '';
        const firstConfigPath = this.isDev ? remoteConfig[2] : remoteConfig[0];
        if(!json) {
            json = fetch(firstConfigPath);
          if(!json || !json.includes('name')) {
            json = fetch(remoteConfig[1]);
          }
          if(!json || !json.includes('name')) {
            json = fetch(remoteConfig[2]);
          }
        }
        if(!haveSetting && json) {
          writeFile(settingPath, json);
        }
        if(json) {
            this.searchModel = JSON.parse(json).sort((a,b) => a.index - b.index);
            const haveCustomerSetting = fileExist(customerSettingPath) == 'true' || fileExist(customerSettingPath) == true;
            
            this.searchModel = JSON.parse(json).sort((a,b) => a.index - b.index);
            if(haveCustomerSetting) {
                const customerSetting = JSON.parse(fetch(customerSettingPath));
                if(customerSetting.customerResouce) {
                    this.searchModel = JSON.parse(json).map(item => {
                        const customer = customerSetting.customerResouce.find(_customer => _customer.key == item.key);
                        this.mergeObj(customer || {},item);
                        return item;
                    }).sort((a,b) => a.index - b.index);
                }
                this.usePublicToken = customerSetting.usePublicToken;
                this.publicToken = customerSetting.publicToken;
                this.useSuggestQuery = customerSetting.useSuggestQuery;
                this.primaryColor = customerSetting.primaryColor;
                this.sourcePlay = !!customerSetting.sourcePlay;
            }
        }
    },
    initConfig: function(forceConfigUpdate){
        const {settingPath, remoteConfig, customerSettingPath} = this.urls;
        putVar('icy_ali_customer', customerSettingPath);

        const firstConfigPath = this.isDev ? remoteConfig[2] : remoteConfig[0];
        const haveSetting = fileExist(settingPath) == 'true' || fileExist(settingPath) == true;
        let json = haveSetting ? fetch(settingPath) : '';
        if(!json || forceConfigUpdate || this.isDev) {
            json = fetch(firstConfigPath);
          if(!json || !json.includes('name')) {
            json = fetch(remoteConfig[1]);
          }
          if(!json || !json.includes('name')) {
            json = fetch(remoteConfig[2]);
          }
        }
        if(json) {
            writeFile(settingPath, json);            
            this.searchModel = JSON.parse(json).sort((a,b) => a.index - b.index);
        }
        const haveCustomerSetting = fileExist(customerSettingPath) == 'true' || fileExist(customerSettingPath) == true;
        if(haveCustomerSetting) {
            const customerSetting = JSON.parse(fetch(customerSettingPath));
            if(customerSetting.customerResouce) {
                let customerResouce = [];
                this.searchModel.forEach(item => {
                    const customer = customerSetting.customerResouce.find(_customer => _customer.key == item.key);
                    if(customer) {
                        customer.val = item.val;
                        customer.name = item.name;
                        customer.key = item.key;
                        customer.needKey = item.needKey;
                        customerResouce.push(customer);
                    } else {
                        customerResouce.push({
                            val: item.val,
                            key: item.key,
                            name: item.name,
                            needKey: item.needKey,
                            index: (customerResouce.length + 1)
                        });
                    }
                    
                });
                customerSetting.customerResouce = customerResouce;
            }
            writeFile(customerSettingPath, JSON.stringify(customerSetting));
        }       
    },
    mergeObj: function(targt, source){
        Object.keys(targt).forEach(key => {
            source[key] = targt[key];
        })
    },
    updateRule: function(){
        let ruleCode = "海阔视界规则分享，当前分享的是：小程序￥home_rule_v2￥base64://@云盘汇影@eyJsYXN0X2NoYXB0ZXJfcnVsZSI6IiIsInRpdGxlIjoi5LqR55uY5rGH5b2xIiwiYXV0aG9yIjoiTXJGbHkiLCJ1cmwiOiJoaWtlcjovL2VtcHR5JCQkZnlwYWdlIiwidmVyc2lvbiI6NiwiY29sX3R5cGUiOiJ0ZXh0XzEiLCJjbGFzc19uYW1lIjoiIiwidHlwZSI6ImFsbCIsImNsYXNzX3VybCI6IiIsImFyZWFfbmFtZSI6IiIsImFyZWFfdXJsIjoiIiwic29ydF9uYW1lIjoiIiwieWVhcl9uYW1lIjoiIiwic29ydF91cmwiOiIiLCJ5ZWFyX3VybCI6IiIsImZpbmRfcnVsZSI6ImpzOlxuZXZhbChmZXRjaCgnaGlrZXI6Ly9maWxlcy9ydWxlcy9pY3kvYWxpLmpzJykpO1xuYWxpLmhvbWVQYWdlKCk7Iiwic2VhcmNoX3VybCI6Imhpa2VyOi8vZW1wdHkkJCQqKiQkJGZ5cGFnZSQkJCIsImdyb3VwIjoi4pGg5o6o6I2QIiwic2VhcmNoRmluZCI6ImpzOlxuZXZhbChmZXRjaCgnaGlrZXI6Ly9maWxlcy9ydWxlcy9pY3kvYWxpLmpzJykpO1xuYWxpLnNlYXJjaFBhZ2UodHJ1ZSk7XG4iLCJkZXRhaWxfY29sX3R5cGUiOiJtb3ZpZV8xIiwiZGV0YWlsX2ZpbmRfcnVsZSI6ImpzOlxuZXZhbChmZXRjaCgnaGlrZXI6Ly9maWxlcy9ydWxlcy9pY3kvYWxpLmpzJykpO1xuYWxpLmRldGFpbFBhZ2UoKTsiLCJzZGV0YWlsX2NvbF90eXBlIjoibW92aWVfMSIsInNkZXRhaWxfZmluZF9ydWxlIjoiIiwidWEiOiJtb2JpbGUiLCJwcmVSdWxlIjoidmFyIGFsaWpzID0gZmV0Y2goJ2h0dHBzOi8vZ2l0ZWUuY29tL2ZseTEzOTcvaGlrZXItaWN5L3Jhdy9tYXN0ZXIvYWxpLmpzJyk7XG5pZighYWxpanMgfHwgIWFsaWpzLmluY2x1ZGVzKCdhbGknKSl7XG5cdGFsaWpzID0gZmV0Y2goJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9naC9mbHkxMzk3L2hpa2VyLWljeS9hbGkuanMnKVxufVxuaWYoIWFsaWpzIHx8ICFhbGlqcy5pbmNsdWRlcygnYWxpJykpe1xuXHRhbGlqcyA9IGZldGNoKCdodHRwOi8vbGZpY3kuY29tOjMwMDAwL21yZmx5L2hpa2VyLWljeS9yYXcvbWFzdGVyL2FsaS5qcycpXG59XG5pZihhbGlqcykge1xuXHR3cml0ZUZpbGUoXCJoaWtlcjovL2ZpbGVzL3J1bGVzL2ljeS9hbGkuanNcIixhbGlqcyk7XG5cdGV2YWwoYWxpanMpO1xuXHRhbGkucHJlUnVsZSgpO1xufVxuIiwicGFnZXMiOiJbe1wiY29sX3R5cGVcIjpcIm1vdmllXzNcIixcIm5hbWVcIjpcIue9keebmOivpuaDhVwiLFwicGF0aFwiOlwiZGV0YWlsXCIsXCJydWxlXCI6XCJqczpcXG5ldmFsKGZldGNoKCdoaWtlcjovL2ZpbGVzL3J1bGVzL2ljeS9hbGkuanMnKSk7XFxuYWxpLmluaXRDb25maWcoKTtcXG5hbGkuYWxpUnVsZSgpO1wifSx7XCJjb2xfdHlwZVwiOlwibW92aWVfMV9sZWZ0X3BpY1wiLFwibmFtZVwiOlwi6LWE5rqQ572R6aG16K+m5oOFXCIsXCJwYXRoXCI6XCJzaXRlLWRldGFpbFwiLFwicnVsZVwiOlwianM6XFxuZXZhbChmZXRjaCgnaGlrZXI6Ly9maWxlcy9ydWxlcy9pY3kvYWxpLmpzJykpO1xcbmFsaS5kZXRhaWxQYWdlKCk7XCJ9LHtcImNvbF90eXBlXCI6XCJtb3ZpZV8zXCIsXCJuYW1lXCI6XCLkuKrkurrnvZHnm5jor6bmg4VcIixcInBhdGhcIjpcImRyaXZlXCIsXCJydWxlXCI6XCJqczpcXG5ldmFsKGZldGNoKCdoaWtlcjovL2ZpbGVzL3J1bGVzL2ljeS9hbGkuanMnKSk7XFxuYWxpLmluaXRDb25maWcoKTtcXG5hbGkubXlBbGlSdWxlKCk7XCJ9XSIsImljb24iOiJodHRwczovL2dpdGVlLmNvbS9mbHkxMzk3L2hpa2VyLWljeS9yYXcvbWFzdGVyL2FsaXl1bi5wbmcifQ==";
        let importUrl = "rule://" + base64Encode(ruleCode);
        return importUrl;
    },
    getRefreshToken: function(_url) {
        const {tokenPath} = this.urls;
        const haveToken = fileExist(tokenPath) == 'true' || fileExist(tokenPath) == true;
        setPageTitle('阿里云盘');
        addListener('onClose', () => {
            let token = getVar('icy-ali-tokens');
            if(token) {
                saveFile('hiker://files/rules/icy/icy-ali-token.json', token);
            }
            clearVar('icy-ali-tokens')
        })
        let d = [];
        let url = _url || 'https://www.aliyundrive.com/drive';
        // if(getItem('haveShared', '') && !haveToken) {
        //     // url = 'https://pages.aliyundrive.com/mobile-page/web/beinvited.html?code=8281833';
        //     // url = 'https://www.aliyundrive.com/s/BFiLLN5Uu58';
        //     setItem('haveShared', '1')
        // }
        var js = $.toString(()=> {
            var isShare = location.href.startsWith('https://www.aliyundrive.com/s/');
            var isInvited = location.href.startsWith('https://pages.aliyundrive.com/');
            var click = false;
            const tokenFunction = function () {
                var token = null;
                var deviceID = "";
                if(isShare) {
                    try{
                        if(!click){
                            var btn = document.querySelector('.btn--2uN28');
                            if(btn) {
                                btn.click();
                                click=true; 
                            }
                        }
                    } catch(e){};
                    var saved = false;
                    var savetext = document.querySelector('.title--lRzap');
                    if(savetext) {
                        saved = savetext.innerText=='转存成功';
                    }
                    var _token = JSON.parse(localStorage.getItem('token'));
                    if(
                        _token && _token.user_id && 
                        (
                            (saved && isShare)
                        )
                    ){
                        alert('保存成功，感谢支持！');
                        localStorage.clear();
                        fy_bridge_app.back();
                        return;
                    }
                } else if(isInvited) {
                    try{
                        if(!click){
                            var btn = document.querySelector('.BeInvited--btn--eapb4-i');
                            if(btn) {
                                btn.click();
                                click=true; 
                            }
                        }
                    } catch(e){};
                    var _token = JSON.parse(localStorage.getItem('token'));
                    if(
                        _token && _token.user_id
                    ){
                        alert('注册成功，返回后重新选择登录页面进行登录！');                   
                        localStorage.clear();
                        fy_bridge_app.back();
                        return;
                    }
                } else {
                    token = JSON.parse(localStorage.getItem('token'));
                    deviceID = localStorage.getItem('APLUS_CNA').includes('_') ? localStorage.getItem('APLUS_CNA').split('_')[1] : '';
                    // if(!location.href.startsWith('https://auth.aliyundrive.com') || !location.href.startsWith('https://www.aliyundrive.com/sign/callback')) {
                    //     location.replace('https://auth.aliyundrive.com/v2/oauth/authorize?login_type=custom&response_type=code&redirect_uri=https%3A%2F%2Fwww.aliyundrive.com%2Fsign%2Fcallback&client_id=25dzX3vbYqktVxyX&state=%7B%22origin%22%3A%22*%22%7D#/login')
                    // }
                }
                if(token && token.user_id){
                    let token_url = 'hiker://files/rules/icy/icy-ali-token.json';
                    let _tokens = JSON.parse(request(token_url) || '[]');
                    let tokens = _tokens.length ? _tokens : (_tokens.user_id ? [_tokens] : [] );
                    let _token = tokens.find(item => item.user_id == token.user_id);
                    token.deviceID = deviceID
                    if(_token) {
                        _token = token;
                    } else {
                        tokens.push(token)
                    }
                    // alert(JSON.stringify(tokens))
                    fy_bridge_app.putVar('icy-ali-tokens', JSON.stringify(tokens))
                    // fy_bridge_app.writeFile('hiker://files/rules/icy/icy-ali-token.json',JSON.stringify(tokens));
                    localStorage.clear();
                    alert('TOKEN获取成功，请勿泄漏个人隐私!退出该页面后刷新重试！');
                    // if(location.href.includes('auth.aliyundrive.com')) {
                    //     fy_bridge_app.back();
                    // }else if(location.href.includes('beinvited')) {
                    //     fy_bridge_app.back();
                    // } else if(!location.href.includes('#token') && isShare) {
                    //     location.href = 'https://www.aliyundrive.com/drive#token';
                    // }
                    fy_bridge_app.back();
                    return;
                }else{
                    token_timer();
                }
            }
            var token_timer= function(){
                setTimeout(tokenFunction, 300)
            };
            token_timer();
            tokenFunction();

        })
        d.push({
            url: url,
            col_type: 'x5_webview_single',
            desc: '100%&&float',
            extra: {
                canBack: true,
                js: js,
            }
        })
        setHomeResult({
            data: d
        })
    },
    getAliToken: function() {
        let needRefresh = true;
        const {tokenPath, customerSettingPath} = this.urls;
        this.getConfig();
        if(this.usePublicToken && this.publicToken) {
            try {
                eval('function tokenFunction(){\n'+this.publicToken+'\n};');
                if(tokenFunction().replace('Bearer ', '')) {
                    return tokenFunction().replace('Bearer ', '');
                } else {
                    return 'toast://共享TOKEN获取失败，建议重启app再试试！'
                }
            } catch(e){
                return 'toast://共享TOKEN代码运行失败了'
            }
        }
        try {
            const haveToken = fileExist(tokenPath) == 'true' || fileExist(tokenPath) == true;
            
            if(haveToken) {
                let _tokens = JSON.parse(readFile(tokenPath) || '[]');
                let tokens = _tokens.length ? _tokens : (_tokens && _tokens.user_id ? [_tokens] : [] );
                let customerSettings = JSON.parse(fetch(customerSettingPath));
                let token = tokens.find(item => item.user_id == customerSettings.user_id) || tokens[0];
                let deviceID = token.deviceID;
                if((token && (!token.access_token || !token.refresh_token)) || !token) {
                    deleteFile(tokenPath);
                    return 'toast://TOKEN获取失败，已经删除阿里登录信息，重新登录试试'
                }
                if(!!needRefresh) {
                    const tokenRes = JSON.parse(fetch('https://auth.aliyundrive.com/v2/account/token', {
                        headers: {
                            "Content-Type": "application/json",
                            "User-Agent": MOBILE_UA,
                        },
                        method: 'POST',
                        body: '{"refresh_token":"'+token.refresh_token+'","grant_type":"refresh_token"}',
                    }));
                    if(tokenRes && tokenRes.user_id) {
                        tokenRes.deviceID = deviceID;
                        var access_token = tokenRes.access_token;
                        putVar("access_token", access_token);
                        let _token = tokens.find(item => item.user_id == tokenRes.user_id);
                        if(_token) {
                            tokens = tokens.map(item => {
                                if(item.user_id == tokenRes.user_id) {
                                    item = tokenRes;
                                }
                                return item;
                            })
                        } else {
                            tokens.push(tokenRes);
                        }
                        saveFile(tokenPath,JSON.stringify(tokens));
                        return access_token;
                    } else if(tokenRes.code && tokenRes.code.included('InvalidParameter.RefreshToken')) {
                        return 'toast://登录状态已经过期，需要重新登录'
                    } else if(tokenRes.message){
                        return 'toast://' + tokenRes.message
                    }
                } else {
                    let _access_token = token.access_token || token.token;
                    putVar("access_token", _access_token);
                    return _access_token;
                }
            } else {
                this.aliLogin();
                return false;
            }
        } catch (e) {
            log(JSON.stringify(e));
            // deleteFile(tokenPath);
            return 'toast://TOKEN获取失败，重新登录试试'
        }

    },
    pageManually: function(host, url){
        setPageTitle('云盘汇影--手动档')
        let d = [];
        var js = $.toString((url)=> {
            var isShare = location.href.startsWith('https://www.aliyundrive.com/s/');
            var timer = function(){
                setTimeout(()=>{
                    if(isShare){
                        fba.open(JSON.stringify({
                            rule:'云盘汇影',
                            url:'hiker://page/detail?rule=云盘汇影&url='+location.href+'??fypage'
                        }));
                        history.back(-1);
                    }else{
                        document.querySelector('.davwheat-ad').style.display = 'none';
                        timer();
                    }
                },500)
            };
            timer();

        }, url)
        d.push({
            url: host,
            col_type: 'x5_webview_single',
            desc: '100%&&float',
            extra: {
                canBack: true,
                js: js
            }
        })
        setHomeResult({
            data: d
        })
    },
    aliLogin: function(_d){
        let d = _d || []
        setPageTitle('阿里云盘账号设置');
        const {tokenPath, customerSettingPath} = this.urls;

        if(!getVar('icy_ali_customer','')) {
            putVar('icy_ali_customer', customerSettingPath)
        }
        if(!getVar('icy_ali_tokenPath','')) {
            putVar('icy_ali_tokenPath', tokenPath)
        }

        let customerSettings = JSON.parse(fetch(getVar('icy_ali_customer')) || '{}');
        const haveToken = fileExist(tokenPath) == 'true' || fileExist(tokenPath) == true;
        if(!haveToken) {
            d.push({
                title: '还没有设置阿里云盘账号信息',
                desc: '阿里云盘在线观看需要设置登录信息，\n您可以选择登录/注册账号，或者他人共享的账号！',
                url: this.emptyRule,
                col_type: 'text_1'
            })
        } else {
            let _tokens = JSON.parse(readFile(tokenPath) || '[]');
            let tokens = _tokens.length ? _tokens : (_tokens && _tokens.user_id ? [_tokens] : [] );

            let user_id = customerSettings && tokens[0] ? customerSettings.user_id || tokens[0].user_id : '';
            tokens.forEach((item, index) => {
                let title = item.user_id == user_id ? "<b>当前登录："+'<span style="color: '+ this.primaryColor +'">⭐ '+item.nick_name+'</span></b>' : item.nick_name;
                d.push({
                    title: title,
                    desc: '切换账号',
                    img: item.avatar+'@Referer=https://www.aliyundrive.com/',
                    url: $('#noLoading#').lazyRule((token) => {
                        eval(fetch('hiker://files/rules/icy/ali.js'));
                        ali.activeToken = token;
                        let customerSettings = JSON.parse(fetch(getVar('icy_ali_customer')));
                        customerSettings.user_id = token.user_id;
                        writeFile(getVar('icy_ali_customer'), JSON.stringify(customerSettings));
                        refreshPage(false);
                        return 'toast://账号切换至：' + token.nick_name;;
                    }, item),
                    col_type: 'avatar',
                })
                d.push({
                    title: '““””<small><span style="color: #999999">❌ 删除阿里云盘账号: <b>' + item.nick_name + '</b></span></small>',
                    url: $("确定要删除？")
                        .confirm((index) => {
                            let _tokens = JSON.parse(readFile(getVar('icy_ali_tokenPath')) || '[]');
                            let tokens = _tokens.length ? _tokens : (_tokens.user_id ? [_tokens] : [] );
                            tokens.splice(index, 1);
                            saveFile(getVar('icy_ali_tokenPath'), JSON.stringify(tokens));
                            refreshPage(false);
                            return 'toast://删除成功';
                    }, index),
                    col_type: 'text_1'
                })
            })
        }

        d.push({
            col_type: "line_blank"
        });
        d.push({
            title: '登录阿里云盘',
            desc: '支持查看个人云盘文件，支持多账号模式\n登录后会自动清除信息方便下次重新登录',
            url: $('hiker://empty').rule(() => {
                eval(fetch('hiker://files/rules/icy/ali.js'));
                ali.getRefreshToken();
            }),
            col_type: 'text_1'
        })
        d.push({
            title: '注册阿里云盘',
            desc: '支持作者邀请码注册，这里不做登录处理',
            url: $('hiker://empty').rule(() => {
                eval(fetch('hiker://files/rules/icy/ali.js'));
                ali.getRefreshToken('https://pages.aliyundrive.com/mobile-page/web/beinvited.html?code=1906385');
            }),
            col_type: 'text_1'
        })
        d.push({
            col_type: "line_blank"
        });
        d.push({
            title: '去启用共享账号',
            desc: '随时可以在设置页面启用或关闭共享账号',
            url: $('hiker://empty').rule(() => {
                eval(fetch('hiker://files/rules/icy/ali.js'));
                ali.settingPage();
            }),
            col_type: 'text_1'
        })
        if(!_d) {
            setResult({data: d});
        }
    },
    preRule: function(){
        const {settingPath, customerSettingPath, tokenPath} = this.urls;
        this.initConfig(this.forceConfigUpdate);
        this.getConfig();
        this.update();
        const activeModel = this.activeModel();
        if(!getVar('icy_ali_model') && activeModel) {
            const {areas, cats, years, sorts, val} = activeModel;
            putVar('icy_ali_model', val || '');
            if(areas) {
                const _areas = areas.filter(item => item.withType != -1);
                putVar('icy_ali_area', _areas[0] ? _areas[0].val : '');
            }
            if(cats) {
                const _cats = cats.filter(item => item.withType != -1);
                putVar('icy_ali_cat', _cats[0] ? _cats[0].val : '');
            }
            if(years) {
                const _years = years.filter(item => item.withType != -1);
                putVar('icy_ali_year', _years[0] ? _years[0].val : '');
            }
            if(sorts) {
                const _sorts = sorts.filter(item => item.withType != -1);
                putVar('icy_ali_sort' , _sorts[0] ? _sorts[0].val : '')
            }
            putVar("icy_ali_search", '');
        };
        if(!getVar('icy_ali_customer','')) {
            putVar('icy_ali_customer', customerSettingPath)
        }
        if(!getVar('icy_ali_tokenPath','')) {
            putVar('icy_ali_tokenPath', tokenPath)
        }
        if(!getVar('icy_ali_setting','')) {
            putVar('icy_ali_setting', settingPath)
        }
    },
    manualLogin: function(key){

        const { customerSettingPath} = this.urls;
        let activeModel = this.activeModel();
        const haveCustomerSetting = fileExist(customerSettingPath) == 'true' || fileExist(customerSettingPath) == true;
        if(haveCustomerSetting) {
            const customerSetting = JSON.parse(fetch(getVar('icy_ali_customer')));
            if(customerSetting.customerResouce) {
                activeModel = customerSetting.customerResouce.find(item => item.key == activeModel.key) || activeModel;
            }
        } else {
            this.getConfig();
        }
        var host = activeModel.val;
        setPageTitle('资源站登录');
        let d = [];
        var js = $.toString((key)=> {
            const tokenFunction = function () {
                var cookie = null;
                cookie = fy_bridge_app.getCookie(location.href);
                if(cookie){
                    let customer_url = 'hiker://files/rules/icy/icy-ali-customer.json';
                    let customerSetting = JSON.parse(request(customer_url) || '[]');
                    let activeModel = customerSetting.customerResouce.find(item => item.key == key);
                    activeModel.cookie = cookie;
                    alert(cookie)
                    fy_bridge_app.writeFile(customer_url,JSON.stringify(customerSetting));
                    alert('COOKIE获取成功,请返回后刷新页面重试');
                    fy_bridge_app.back();
                    return;
                }else{
                    alert('没有cookie')
                }
            }
            var doButton = false
            const insertFN = function() {
                var loginButton = document.querySelector('#getCookie');
                if(loginButton) {
                    if(!doButton) {
                        alert('登录完成后点击底部获取cookie按钮')
                        loginButton.addEventListener('click', tokenFunction);
                        doButton = true;
                    }
                } else {

                    HTMLElement.prototype.appendHTML = function(html) {
                        var divTemp = document.createElement("div"), nodes = null
                            , fragment = document.createDocumentFragment();
                        divTemp.innerHTML = html;
                        nodes = divTemp.childNodes;
                        for (var i=0, length=nodes.length; i<length; i+=1) {
                            fragment.appendChild(nodes[i].cloneNode(true));
                        }
                        this.appendChild(fragment);
                        nodes = null;
                        fragment = null;
                    };
                    document.body.appendHTML(`<div style="
                        position: fixed;
                        z-index: 10000;
                        height: 50px;
                        bottom: 0;
                        width: 100%;
                        text-align: center;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    "><button id="getCookie" style="
                        background: #67C23A;
                        border: 0;
                        border-radius: 10px;
                        line-height: 40px;
                        padding: 0 20px;
                        min-width: 200px;
                        color: #fff;
                    ">获取cookie</button></div>`);

                    token_timer();
                }
            }
            var token_timer= function(){
                setTimeout(insertFN, 1000)
            };
            insertFN();
            document.onreadystatechange = function() {
                if(document.readyState == 'complete') {
                    token_timer();
                    insertFN();
                }
            }
            

        }, key)
        d.push({
            url: host,
            col_type: 'x5_webview_single',
            desc: '100%&&float',
            extra: {
                canBack: true,
                js: js,
            }
        })
        setHomeResult({
            data: d
        })

    },
    login: function (key){
        const { customerSettingPath} = this.urls;
        let activeModel = this.activeModel();
        const haveCustomerSetting = fileExist(customerSettingPath) == 'true' || fileExist(customerSettingPath) == true;
        if(haveCustomerSetting) {
            const customerSetting = JSON.parse(fetch(getVar('icy_ali_customer')));
            if(customerSetting.customerResouce) {
                activeModel = customerSetting.customerResouce.find(item => item.key == activeModel.key) || activeModel;
            }
        } else {
            this.getConfig();
        }

        const {username, password, val} = activeModel;
        var host = val;
        if(!username || !password) {
            confirm({
                title: '请设置用户名密码',
                content: '输入对应的账号和密码！',
            });
            return false;
        }
        const pageResult = JSON.parse(fetch(host, {
            headers: {'User-Agent': MOBILE_UA,},
            withHeaders: true
        }));
        let cookie = pageResult.headers['set-cookie'].join(';');
        const _token = pageResult.headers['x-csrf-token'].join(';');
        cookie = cookie.split(';').filter(item => !item.includes('Path=') && !item.includes('Expires=') && !item.includes('Max-Age=') && !item.includes('SameSite=') && item.includes('=')).join(';')
        const token = pageResult.body.match(/csrfToken":"([\w|\d]*)"/);
        if(!token || !token[1] || !cookie) {
            return false;
        }
        const login = JSON.parse(fetch(host + '/login', {
            headers: {
                "Content-Type": "application/json",
                "User-Agent": MOBILE_UA,
                "cookie": cookie,
                "X-CSRF-Token": token[1],
            },
            method: 'POST',
            body: '{"identification": "'+username+'","password": "'+password+'","remember":true}',
            withHeaders: true
        }));
        if(login.body && login.body.includes('errors') && login.body.includes('not_authenticated')) {
            confirm({
                title: '登录失败',
                content: '需要配置正确的账号和密码！',
            });
            activeModel.loginError = true;
        } else if(login.headers['set-cookie'] && login.headers['set-cookie'].length) {
            activeModel.loginError = false;
            activeModel.cookie = login.headers['set-cookie'].join(';');
        }
            
        
        writeFile(customerSettingPath, JSON.stringify(customerSetting));
    },
    settingPage: function(key){
        addListener('onClose', $.toString((params) => {
            params.forEach(item => {
                clearVar(item)
            })
        }, ["select_index", "login", "publicToken"]))
        const {settingPath, customerSettingPath, tokenPath} = this.urls;
        var d = [];
        setPageTitle('设置');
        const haveCustomerSetting = fileExist(customerSettingPath) == 'true' || fileExist(customerSettingPath) == true;
        const haveToken = fileExist(tokenPath) == 'true' || fileExist(tokenPath) == true;
        let customerSettings = null;
        if(!getVar('icy_ali_customer','')) {
            putVar('icy_ali_customer', customerSettingPath)
        }
        if(!haveCustomerSetting || (haveCustomerSetting && !JSON.parse(fetch(customerSettingPath)).customerResouce)) {
            const customer = [];
            const settings = JSON.parse(fetch(settingPath)).sort((a,b) => a.index - b.index);
            settings.forEach(item => {
                const config = {
                    name: item.name,
                    key: item.key,
                    index: item.index,
                }
                if(item.needKey) {
                    config.val = item.val;
                    config.needKey = item.needKey;
                    config.username = item.username;
                    config.password = item.password;
                    config.cookie = item.cookie;
                }
                customer.push(config)
            })
            customerSettings = {customerResouce:customer, usePublicToken: false, publicToken: '', useSuggestQuery: true, primaryColor: '#f47983', sourcePlay: false};
            writeFile(getVar('icy_ali_customer'), JSON.stringify(customerSettings));
        }

        customerSettings = JSON.parse(fetch(getVar('icy_ali_customer')));

        let primaryColor = customerSettings.primaryColor;
        const customerResouce = customerSettings.customerResouce.sort((a,b) => a.index - b.index).map((item, index) => {item.index = index; return item;});
        const loginList = customerResouce.filter(item => item.needKey).map(item => item.name);
        const selectLoginName = getVar("login", '') || (customerResouce.find(item => item.key == key) ? customerResouce.find(item => item.key == key).name : getVar("login", ''));
        const selectLogin = customerResouce.filter(item => item.needKey).find(item => item.name == selectLoginName);
        d.push({
            title: '💘 排序',
            desc: '先点一个资源站，再点另外一个，会与目标对换位置',
            url: this.emptyRule,
            col_type: 'text_1'
        })
        const selectIndex = getVar('select_index', '');
        customerResouce.forEach((item, index) => {
            var name = item.name.includes(' ') ? item.name.split(' ')[1].trim() : item.name;
            var title = String(index) === selectIndex ? "““””<b>"+'<span style="color: '+primaryColor+'">'+name+'</span></b>' : name;
            d.push({
                title: title,
                url: $("#noLoading#").lazyRule((key, index, _customerSettings)=>{
                    const customerSettings = JSON.parse(JSON.stringify(_customerSettings));
                    var selectIndex = getVar('select_index', '');
                    if(!selectIndex) {
                        putVar('select_index', String(index));
                        refreshPage(false);
                        return "hiker://empty"
                    }
                    let source = null;
                    let source_index = null;
                    let target = customerSettings.customerResouce.find(item => item.key == key);
                    let targetIndex = customerSettings.customerResouce.findIndex(item => item.key == key);
                    if(selectIndex && selectIndex != index) {
                        source = customerSettings.customerResouce.find(item => item.index == selectIndex);
                        source_index = JSON.parse(JSON.stringify(source)).index;
                        target.index = source_index;
                        source.index = targetIndex;
                    }
                    writeFile(getVar('icy_ali_customer'), JSON.stringify(customerSettings));
                    putVar('select_index', '');
                    refreshPage(false);
                    return selectIndex != index ? 'toast://保存成功' : "hiker://empty";
                }, item.key, index, customerSettings),
                col_type: 'text_3'
            })
        })
        d.push({
            col_type: "line_blank"
        });
        d.push({
            title: '🔍 海阔搜索设置 hiker://search',
            desc: '默认为当前/排序第一的资源网站, 可以多选',
            url: 'hiker://search',
            col_type: 'text_1'
        })
        const activeModel = this.activeModel();
        customerResouce.forEach(item => {
            var name = item.name.includes(' ') ? item.name.split(' ')[1].trim() : item.name;
            var title = (!!item.forHikerSearch) ? "““””<b>"+'<span style="color: '+ primaryColor +'">'+name+'</span></b>' : name;
            d.push({
                title: title,
                url: $("#noLoading#").lazyRule((key, _customerSettings, activeModelKey)=>{
                    const customerSettings = JSON.parse(JSON.stringify(_customerSettings));
                    // if(key == activeModelKey && customerSettings.customerResouce.filter(item => item.forHikerSearch).length < 2) {
                    //     return 'toast://这个是当前资源站，不能排除哦！';
                    // }
                    let target = customerSettings.customerResouce.find(item => item.key == key);
                    if(target) {
                        target.forHikerSearch = !target.forHikerSearch;
                    }
                    writeFile(getVar('icy_ali_customer'), JSON.stringify(customerSettings));
                    refreshPage(false);
                    return 'toast://保存成功';
                }, item.key, customerSettings, (activeModel ? activeModel.key : '')),
                col_type: 'text_3'
            })
        })
        d.push({
            col_type: "line_blank"
        });
        // const loginlazy = $(loginList, 2)
        //     .select(() => {
        //         putVar("login",input);
        //         refreshPage(false);
        // });
        // d.push({
        //     title: '🔓 资源网站登录设置',
        //     desc: (selectLoginName || '⛏️ 请选择资源网站') + '   ❗保存时会重置登录信息',
        //     url: loginlazy,
        //     col_type: 'text_1'
        // })
        // if(selectLogin) {
        //     d.push({
        //         title: "用户名",
        //         desc: "请输入用户名",
        //         col_type: 'input',
        //         extra: {
        //             titleVisible: false,
        //             defaultValue: selectLogin.username,
        //             type: '',
        //             onChange: 'putVar("' + selectLogin.key + '_username", input)'
        //         }
        //     })
        //     d.push({
        //         title: "密码",
        //         desc: "请输入密码",
        //         col_type: 'input',
        //         extra: {
        //             titleVisible: false,
        //             defaultValue: selectLogin.password,
        //             type: '',
        //             onChange: 'putVar("' + selectLogin.key + '_password", input)'
        //         }
        //     })
        //     d.push({
        //         title: '保存账号',
        //         col_type: 'text_center_1',
        //         url: $()
        //             .lazyRule((key, customerSettings) => {
        //             const item = customerSettings.customerResouce.find(item => item.key == key);
        //             item.username = getVar(key + '_username','');
        //             item.password = getVar(key + '_password','');
        //             item.loginError = false;
        //             item.cookie = '';
        //             writeFile(getVar('icy_ali_customer'), JSON.stringify(customerSettings));
        //             return 'toast://保存成功，需要返回刷新登录'
        //         }, selectLogin.key, customerSettings)
        //     })
        //     d.push({
        //         col_type: "blank_block"
        //     });
        //     d.push({
        //         title: '““””<small><span style="color:#4395FF;">资源站账号注册 >></span></small>',
        //         url: 'web://' + selectLogin.val,
        //         col_type: 'text_center_1'
        //     })
        // }
        // d.push({
        //     col_type: "line_blank"
        // });
        d.push({
            title: '““””🔥 热门搜索词  <b><span style="color: '+ primaryColor +'">' + (customerSettings.useSuggestQuery ? '启用' : '不启用') + '</span></b>',
            desc: '数据来源：360影视',
            url: $("#noLoading#").lazyRule((useSuggestQuery, customerSettings)=>{
                customerSettings.useSuggestQuery = !useSuggestQuery;
                writeFile(getVar('icy_ali_customer'), JSON.stringify(customerSettings));
                refreshPage(false);
                return 'toast://'+ (customerSettings.useSuggestQuery ? '启用' : '关闭') +'热门搜索词成功';
            }, customerSettings.useSuggestQuery, customerSettings),
            col_type: 'text_1'
        })
        d.push({
            title: '““””' + '🎨 自定义主要颜色, 当前颜色 <b><span style="color:' + primaryColor+ '">'+primaryColor+'</span></b>',
            col_type: 'text_1',
            url: $(primaryColor, '格式为#加6位颜色代码 eq: #FF0000')
                .input(() => {
                if(!!input && !/^#[\w|\d]{6}$/i.test(input)) {
                    return "toast://颜色代码不对哦";
                }
                let customerSettings = JSON.parse(fetch(getVar('icy_ali_customer')));
                customerSettings.primaryColor = input || '#f47983';
                writeFile(getVar('icy_ali_customer'), JSON.stringify(customerSettings));
                refreshPage();
                return "toast://保存成功";
            })
        })
        d.push({
            title: '♻️ 重新导入最新规则',
            desc: '部分修改可能会涉及规则更改，保持最新规则吧！',
            col_type: 'text_1',
            url: this.updateRule(),
        })
        
        d.push({
            col_type: "line_blank"
        });
        d.push({
            title: '““””😬 阿里云盘共享账号  <b><span style="color: '+ primaryColor +'">' + (customerSettings.usePublicToken ? '启用' : '不启用') + '</span></b>',
            desc: '会优先使用共享账号，不支持查看共享账号内文件，最好用自己的账号哦',
            url: $("#noLoading#").lazyRule((usePublicToken, customerSettings)=>{
                customerSettings.usePublicToken = !usePublicToken;
                writeFile(getVar('icy_ali_customer'), JSON.stringify(customerSettings));
                refreshPage(false);
                return 'toast://'+ (customerSettings.usePublicToken ? '启用' : '关闭') +'共享账号成功';
            }, customerSettings.usePublicToken, customerSettings),
            col_type: 'text_1'
        })
        if(customerSettings.usePublicToken) {
            d.push({
                title: "共享代码",
                desc: "请输入js代码，需要return <access_token>",
                col_type: 'input',
                extra: {
                    titleVisible: false,
                    defaultValue: customerSettings.publicToken,
                    type: 'textarea',
                    height: -1,
                    onChange: 'putVar("publicToken", input)'
                }
            })
            d.push({
                title: '保存',
                col_type: 'text_center_1',
                url: $()
                    .lazyRule((customerSettings) => {
                    customerSettings.publicToken = getVar('publicToken','');
                    writeFile(getVar('icy_ali_customer'), JSON.stringify(customerSettings));
                    return 'toast://保存成功'
                }, customerSettings)
            })
        }
        let _tokens = JSON.parse(readFile(tokenPath) || '[]');
        let tokens = _tokens.length ? _tokens : (_tokens.user_id ? [_tokens] : [] );
        let token = tokens.find(item => item.user_id == (customerSettings.user_id || (tokens[0] ? tokens[0].user_id : '')));
        d.push({
            title: '““””🦄 登录阿里云盘账号  <b><span style="color: '+ primaryColor +'">' + (haveToken ? '已经登录' + tokens.length + '个账号' : '') + '</span></b>',
            desc: (token ? '当前登录账号：' + token.nick_name + '\n' : '') + '支持查看个人账号内文件，支持多账号模式，点击切换账号。',
            url: $('hiker://empty').rule(() => {
                eval(fetch('hiker://files/rules/icy/ali.js'));
                ali.aliLogin();
            }),
            col_type: 'text_1'
        })
        d.push({
            title: '““””🎬 播放模式  <b><span style="color: '+ primaryColor +'">' + (customerSettings.sourcePlay ? '原始文件播放' : '转码播放') + '</span></b>',
            desc: customerSettings.sourcePlay ? '原始文件播放支持最高分辨率，文件可能会很大，建议使用第三方播放器，或者投屏播放，分享链接直接观看有效期10分钟，建议保存到自己网盘内观看32小时有效' : '转码模式不支持音轨切换，可以节省流量。\n清晰度最高1080P，分享链接建议使用转码模式，个人网盘内建议使用原始文件播放',
            url: $("#noLoading#").lazyRule((sourcePlay, customerSettings)=>{
                customerSettings.sourcePlay = !sourcePlay;
                writeFile(getVar('icy_ali_customer'), JSON.stringify(customerSettings));
                refreshPage(false);
                return 'toast://设置成功';
            }, customerSettings.sourcePlay, customerSettings),
            col_type: 'text_1'
        })
        d.push({
            col_type: "line_blank"
        });
        if(haveToken) {
            d.push({
                title: '☢️ 删除阿里云盘账号',
                desc: '清除阿里云盘所有账号登录信息',
                url: $("确定要删除？")
                    .confirm(() => {
                    deleteFile('hiker://files/rules/icy/icy-ali-token.json');
                    refreshPage();
                    return "toast://已删除";
                }),
                col_type: 'text_1'
            })
        }
        d.push({
            title: '☢️ 恢复默认设置',
            desc: '清除所有用户设置，包括用户名密码等',
            url: $("确定要恢复？")
                .confirm(() => {
                deleteFile(getVar('icy_ali_customer'));
                refreshPage();
                return "toast://已恢复默认设置";
            }),
            col_type: 'text_1'
        })
        setResult(d);
    },
    homePage: function() {
        var d = [];
        var page = Number(MY_URL.split('$$$')[1]);
        if(page == 1) {
            if(MY_RULE.version != 0 && MY_RULE.version != '6' && !Number(getVar('newVersion', ''))) {
                confirm({
                    title: '温馨提示',
                    content: '小程序有最新版本了，为保障正常使用，请更新小程序至最新版本。',
                    confirm: '',
                    cancel: ''
                })
                putVar('newVersion', '1');
            }
            if (getItem("ali-accept", "") == "") {
                setItem("ali-accept", "1");
                confirm({
                    title: '温馨提示',
                    content: '以上数据来源于网络\n如喜欢，请支持官方\n\n此规则仅限学习交流使用\n请于导入后24小时内删除!\n\n任何组织或个人不得以任何方式方法\n传播此规则的整体或部分！!\n\n感谢大佬们提供的技术支持!!!',
                    confirm: '',
                    cancel: ''
                })
            }
            d.push({
                title: '<b><span style="color: '+ this.primaryColor +';">云盘汇影</span></b>&nbsp;&nbsp;&nbsp;<small>👉👉<span style="color:#999999;">个人设置</span>👈👈</small>',
                img: 'https://gitee.com/fly1397/hiker-icy/raw/master/aliyun.png',
                col_type: 'avatar',
                url: $('hiker://empty').rule(() => {
                    eval(fetch('hiker://files/rules/icy/ali.js'));
                    ali.settingPage();
                }),
            })
            d.push({
                url: $.toString(()=> {
                    if(input.trim()) {
                        putVar("icy_ali_search",input);
                        var link = 'hiker://empty$$$' + input + '$$$fypage$$$';
                        return $(link).rule(()=> {
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            ali.searchPage();
                        })
                    } else {
                        return 'toast://请输入影片名称，或者网盘链接';
                    }
                }),
                title: '搜索',
                desc: "支持输入云盘分享链接",
                col_type: "input"
            });
            this.rendererFilterList(d);
        }
        if(this.activeModel()) {

            const {cats, sorts, val, name, key, dataType} = this.activeModel();
            if(key == 'rjiang') {
                this.homeDataR(d);
            } else if(dataType == 'html') {
                this.homeDataHTML(d);
            } else if(dataType == 'json') {
                this.homeDataJSON(d);
            } else {
                this.homeData(d);
            }
    
    
            d.push({
                col_type: "blank_block"
            });
        } else if(fileExist(this.urls.tokenPath) == 'true' || fileExist(this.urls.tokenPath) == true){
            this.myAliRule(d);
        }
        setResult(d);
    },
    getFilter: function(isSearchPage){
        const suffix = isSearchPage ? '_search' : '';
        return {
            fyarea: getVar('icy_ali_area'+suffix),
            fyclass: getVar('icy_ali_cat'+suffix),
            fyyear: getVar('icy_ali_year'+suffix),
            fysort: getVar('icy_ali_sort'+suffix),
        }
    },
    rendererFilterList: function(d, isSearchPage){
        const hasToken = fileExist(this.urls.tokenPath) == 'true' || fileExist(this.urls.tokenPath) == true
        const activeModel = this.activeModel(isSearchPage);
        const {searchModel} = this;
        const withoutType = isSearchPage ? 1 : -1;
        const suffix = isSearchPage ? '_search' : '';
        if(this.useSuggestQuery) {
            this.rendererSuggest(d, isSearchPage);
        }
        if(!isSearchPage) {
            // home page
            if(hasToken) {
                var title = !activeModel ? "““””<b>"+'<span style="color: '+ this.primaryColor +'">⭐ 🦄 我的云盘</span></b>' : '🦄 我的云盘';

                d.push({
                    title: title,
                    url: "hiker://page/drive?url=https://www.aliyundrive.com/drive/??fypage",
                    col_type:'scroll_button'
                })
            }
            
            this.rendererFilter(d, searchModel, 'icy_ali_model', () => {
                // callback
                eval(fetch('hiker://files/rules/icy/ali.js'));
                const activeModel = ali.activeModel();
                if(activeModel) {
                    const {areas, cats, years, sorts, val} = activeModel;
                    putVar('icy_ali_model_search', val)
                    if(areas) {
                        const _areas = areas.filter(item => item.withType != -1);
                        putVar('icy_ali_area', _areas[0] ? _areas[0].val : '');
                        putVar('icy_ali_area_search', _areas[0] ? _areas[0].val : '');
                    }
                    if(cats) {
                        const _cats = cats.filter(item => item.withType != -1);
                        putVar('icy_ali_cat', _cats[0] ? _cats[0].val : '');
                        putVar('icy_ali_cat_search', _cats[0] ? _cats[0].val : '');
                    }
                    if(years) {
                        const _years = years.filter(item => item.withType != -1);
                        putVar('icy_ali_year', _years[0] ? _years[0].val : '');
                        putVar('icy_ali_year_search', _years[0] ? _years[0].val : '');
                    }
                    if(sorts) {
                        const _sorts = sorts.filter(item => item.withType != -1);
                        putVar('icy_ali_sort' , _sorts[0] ? _sorts[0].val : '')
                        putVar('icy_ali_sort_search' , _sorts[0] ? _sorts[0].val : '')
                    }
                }
            });
        } else {
            // search page
            this.rendererFilter(d, searchModel, 'icy_ali_model_search', () => {
                // callback
                eval(fetch('hiker://files/rules/icy/ali.js'));
                const activeModel = ali.activeModel(true);
                if(activeModel) {
                    const {areas, cats, years, sorts} = activeModel;

                    if(areas) {
                        const _areas = areas.filter(item => item.withType != 1);
                        putVar('icy_ali_area_search', _areas[0] ? _areas[0].val : '');
                    }
                    if(cats) {
                        const _cats = cats.filter(item => item.withType != 1);
                        putVar('icy_ali_cat_search', _cats[0] ? _cats[0].val : '');
                    }
                    if(years) {
                        const _years = years.filter(item => item.withType != 1);
                        putVar('icy_ali_year_search', _years[0] ? _years[0].val : '');
                    }
                    if(sorts) {
                        const _sorts = sorts.filter(item => item.withType != 1);
                        putVar('icy_ali_sort_search' , _sorts[0] ? _sorts[0].val : '')
                    }
                }
            });
        }
        if(activeModel) {

            const {areas, cats, years, sorts} = activeModel;
            if(areas) {
                const _areas = areas.filter(item => item.withType != withoutType);
                this.rendererFilter(d, _areas, 'icy_ali_area'+ suffix);
            }
            if(cats) {
                const _cats = cats.filter(item => item.withType != withoutType) || [];
                this.rendererFilter(d, _cats, 'icy_ali_cat'+ suffix, () => {
                    putVar('icy_ali_subcat' , '');
                });
                const activeCat = getVar('icy_ali_cat'+ suffix) || '';
                const cat = _cats.find(item => item.val === activeCat);
                if(cat && cat.sub && cat.sub.length) {
                    this.rendererFilter(d, cat.sub, 'icy_ali_subcat'+ suffix);
                }
            }
            if(years) {
                const _years = years.filter(item => item.withType != withoutType);
                this.rendererFilter(d, _years, 'icy_ali_year'+ suffix);
            }
            if(sorts) {
                const _sorts = sorts.filter(item => item.withType != withoutType);
                this.rendererFilter(d, _sorts, 'icy_ali_sort'+ suffix);
            }
        }

        d.push({
            col_type: "line_blank"
        });
    },
    rendererFilter: function(d, data, key, cb){
        if(!data || !data.length || data.length == 1) {
            return false;
        }
        data.forEach(item => {
            var title = item.val == getVar(key) ? "““””<b>"+'<span style="color: '+ this.primaryColor +'">⭐ '+item.name+'</span></b>' : item.name;
            d.push({
                title: title,
                url: $("#noLoading#").lazyRule((key, val, cb)=>{
                    putVar(key,val);
                    if(cb) {
                        cb();
                    }
                    refreshPage(false);
                    return "hiker://empty"
                }, key, item.val, cb),
                col_type:'scroll_button'
            })
        })
        d.push({
            col_type: "blank_block"
        });
    },
    rendererSuggest: function(d, atSearchPage) {
        try {
            const {data} = JSON.parse(fetch('https://api.web.360kan.com/v1/query/addef?ver=2&fmt=json'));
            d.push({
                title: '大家都在搜：',
                url: this.emptyRule,
                col_type: 'scroll_button'
            });
            data.filter(item => !item.title.startsWith('必看经典')).forEach(item => {
                if(atSearchPage) {
                    d.push({
                        title: item.title,
                        url: $("#noLoading#").lazyRule((item)=>{
                            putVar("icy_ali_search",item);
                            refreshPage(false);
                            return "hiker://empty"
                        }, item.title),
                        col_type: 'scroll_button'
                    });
                } else {
                    d.push({
                        title: item.title,
                        url: $("#noLoading#").lazyRule((item)=>{
                            putVar("icy_ali_search",item);
                            var link = 'hiker://empty$$$' + item + '$$$fypage$$$';
                            return $(link).rule(()=> {
                                eval(fetch('hiker://files/rules/icy/ali.js'));
                                ali.searchPage();
                            })
                        }, item.title),
                        col_type: 'scroll_button'
                    });
                }
            })
            d.push({
                col_type: "blank_block"
            });
          } catch (e) {}
    },
    homeData: function(d) {
        const activeModel = this.activeModel();
        const {val, cats, key, cookie, username, password, loginError, filterTags, needKey} = activeModel;
        var cat = getVar('icy_ali_cat') || cats[0].val;
        var subcat = getVar('icy_ali_subcat') || '';
        var sort = getVar('icy_ali_sort') || '';
        var page = Number(MY_URL.split('$$$')[1]);
        var url = val + '/api/discussions?include=user%2ClastPostedUser%2Ctags%2CfirstPost%2CfirstPost%2ClastPost&filter%5Btag%5D='+(subcat || cat)+'&sort='+sort+'&page%5Boffset%5D=' + (page - 1) * 20;
        const headers = {"Referer": url, 'User-Agent': MOBILE_UA,};
        const _cookie = cookie || '';
        if(_cookie) {

            headers['cookie'] = _cookie;
        }
        const res = fetch(url, {headers: headers});
        if(res.includes('complete a CAPTCHA') || res.includes('Checking your browser before accessing')) {
            d.push({
                title: '““””需要点击这里<b><span style="color: '+ this.primaryColor +'">手动打开</span></b>继续浏览',
                desc: '由于该站点限制，无法正常读取数据，手动打开后浏览即可！',
                url: $("hiker://empty").rule((host, url)=>{
                    eval(fetch('hiker://files/rules/icy/ali.js'));
                    ali.pageManually(host,url);
                }, val, url),
                col_type: 'text_1'
            })
            return;
        }
        if(page == 1 && (res.includes('l2sp'))) {
            d.push({
                title: '““””需要登录才能查看链接<b><span style="color: '+ this.primaryColor +'">🔑 点击登录</span></b>',
                url: $("hiker://empty").rule((key)=>{
                    eval(fetch('hiker://files/rules/icy/ali.js'));
                    ali.manualLogin(key);
                    // refreshPage(false);
                    
                    // return 'hiker://empty';
                }, key),
                col_type: 'text_1'
            })
            //  else {
            //     let loginTitle = loginError ? '用户名密码错误' : '需要登录才能查看链接';
            //     d.push({
            //         title: '““””'+loginTitle+'<b><span style="color: '+ this.primaryColor +'">🔒 点击配置用户名密码</span></b>',
            //         url: $("hiker://empty").rule((key)=>{
            //             eval(fetch('hiker://files/rules/icy/ali.js'));
            //             ali.settingPage(key);
            //         }, key),

            //         col_type: 'text_1'
            //     })
            // }
        } else if(page == 1 && (res.includes('Checking if the site connection is secure'))) {
            d.push({
                title: '““””需要获取cookie才可访问<b><span style="color: '+ this.primaryColor +'">🔑 点击获取Cookie</span></b>',
                url: $("hiker://empty").rule((key)=>{
                    eval(fetch('hiker://files/rules/icy/ali.js'));
                    ali.manualLogin(key);
                    // refreshPage(false);
                    
                    // return 'hiker://empty';
                }, key),
                col_type: 'text_1'
            })
            //  else {
            //     let loginTitle = loginError ? '用户名密码错误' : '需要登录才能查看链接';
            //     d.push({
            //         title: '““””'+loginTitle+'<b><span style="color: '+ this.primaryColor +'">🔒 点击配置用户名密码</span></b>',
            //         url: $("hiker://empty").rule((key)=>{
            //             eval(fetch('hiker://files/rules/icy/ali.js'));
            //             ali.settingPage(key);
            //         }, key),

            //         col_type: 'text_1'
            //     })
            // }
        }
        var result = {
            data: [],
            included: []
        };
        try {
            if(res) {

                result = JSON.parse(res);
                const {data, included, links} = result;
                const host = links.first.match(/https?:\/\/(\w+\.?)+/)[0];
                let _data = data;
                if(filterTags && data) {
                    _data = data.filter(item => !!item.relationships.tags.data.filter(_item => filterTags.includes(Number(_item.id))).length);
                }
                this.itemData(activeModel, false, data, included, host, d, page);
            } else {
                d.push({
                    title: '页面失联了💔',
                    desc: '点击访问原始网页',
                    url: 'web://' + val,
                    col_type: "text_1"
                });
            }
        } catch (e) {
            d.push({
                title: '页面失联了💔',
                desc: '点击访问原始网页',
                url: 'web://' + val,
                col_type: "text_1"
            });
            log(JSON.stringify(e));
        }
    },
    itemData: function(activeModel, fromHikerSearch, data, included, host, d, page, keyword){
        const {name} = activeModel;
        if(data && data.length) {
            data.forEach((dataitem) => {
                const {attributes, relationships} = dataitem;
                let postid = '';
                if(relationships.firstPost) {
                    postid = relationships.firstPost.data.id;
                } else if(relationships.lastPost) {
                    postid = relationships.lastPost.data.id;
                } else if(relationships.post) {
                    postid = relationships.post.data.id;
                } else if(relationships.posts) {
                    postid = relationships.posts.data[0].id;
                }
                const post = included.find(_post => _post.id == postid && _post.type == 'posts');
                if(!post) {
                    return false;
                }
                const {attributes: {contentHtml}} = post;
                const contentDome = '<div class="fortext">' + contentHtml || '' + '</div>';
                const pic = parseDomForHtml(contentDome, '.fortext&&img&&src') || '';
                const descStr = parseDomForHtml(contentDome, '.fortext&&Text');
                const comment = (!fromHikerSearch && attributes.commentCount > 1) ? '  <small><span style="color: #999999">💬 ' + (attributes.commentCount - 1) + '</span></small>' : '';
                d.push({
                    title: fromHikerSearch ? this.getEmptyTitle(attributes.title, descStr) : '““””' + this.getEmptyTitle(attributes.title, descStr) + comment,
                    pic_url: pic,
                    content: descStr,
                    desc: fromHikerSearch ? name : descStr,
                    url: $('hiker://empty?url='+host + '/d/' + attributes.slug).rule((dataitem, post, host) => {
                        var d = [];
                        eval(fetch('hiker://files/rules/icy/ali.js'));
                        ali.detailData(dataitem, post, host, d);
                        setHomeResult({
                            data: d
                        })
                    }, dataitem, post, host),
                    col_type: pic ? "movie_1_left_pic" : 'text_1'
                })
            });
        } else if(page == 1){
            this.rendererEmpty(d, keyword, fromHikerSearch);
        }
    },
    rendererEmpty: function(d, keyword, fromHikerSearch) {
        if(keyword) {
            if(!fromHikerSearch) {
                d.push({
                    title: '““””😞 暂时没有搜索到<b><span style="color: '+ this.primaryColor +'">'+ keyword+'</span></b>有关资源',
                    url: this.emptyRule,
                    col_type: 'text_1'
                })
                d.push({
                    title: '““””<small>✔️ <span style="color: #999999">请尽量搜索影片全称，如果没有找到你想要的结果，可以尝试更改关键词搜索！</span></small>',
                    url: this.emptyRule,
                    col_type: 'text_1'
                }) 
                d.push({
                    col_type: "line_blank"
                });
            }
        } else {
            d.push({
                title: '““””😞 没有找到数据，试试其他分类吧！',
                url: this.emptyRule,
                col_type: 'text_1'
            })
        }
    },
    searchPage: function(fromHikerSearch){
        var res = {};
        var d = [];
        const [, _keyword, _page] = MY_URL.split('$$$');
        if(fromHikerSearch) {
            putVar('icy_ali_search', _keyword);
        }
        this.getConfig();
        const activeModel = this.activeModel(true);
        if(!getVar('icy_ali_model_search') && activeModel) {
            const {areas, cats, years, sorts, val} = activeModel;
            putVar('icy_ali_model_search', getVar('icy_ali_model', '') || val);
            if(areas) {
                const _areas = areas.filter(item => item.withType != -1);
                putVar('icy_ali_area', _areas[0] ? _areas[0].val : '');
            }
            if(cats) {
                const _cats = cats.filter(item => item.withType != -1);
                putVar('icy_ali_cat', _cats[0] ? _cats[0].val : '');
            }
            if(years) {
                const _years = years.filter(item => item.withType != -1);
                putVar('icy_ali_year', _years[0] ? _years[0].val : '');
            }
            if(sorts) {
                const _sorts = sorts.filter(item => item.withType != -1);
                putVar('icy_ali_sort' , _sorts[0] ? _sorts[0].val : '')
            }
            putVar("icy_ali_search", '');
        };

        let keyword = getVar('icy_ali_search') || _keyword || '';
        var _links = keyword.match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)\/\w*/g) || [];
        if(_links.length) {
            // 如果直接是链接
            setPageTitle('网盘链接');
            _links.forEach((link, index) => {
                d.push({
                    title: '🔗 ' + (_links.length > 1 ? '链接'+(index+1)+'：' : '')  + link,
                    url: 'hiker://page/detail?url=' + link + '??fypage',
                    col_type: "text_1"
                });
            })
        } else {

            setPageTitle(keyword + '的搜索结果');
            let page = _page;
            if(page == 1 && !fromHikerSearch) {
                d.push({
                    url: $.toString(()=>{
                        if(input.trim()) {
                            putVar("icy_ali_search", input);
                            refreshPage(false);
                        } else {
                            return 'toast://请输入影片名称，或网盘链接';
                        }
                    }),
                    title: '搜索',
                    col_type: "input",
                    extra: {
                        defaultValue: keyword
                    }
                });
                
                this.rendererFilterList(d, true);
                
            }
            const search = (activeModel,fromHikerSearch,keyword, page, d ) => {
                try {
                    const {username, password, loginError, key, dataType, filterTags, name, cookie} = activeModel;
                    if(dataType == 'html') {
                        this.searchHTML(activeModel, fromHikerSearch, keyword, page, d);
                    } else if(dataType == 'json') {
                        this.searchJSON(activeModel, fromHikerSearch, keyword, page, d)
                    } else if(key == 'rjiang') {
                        this.searchR(activeModel, fromHikerSearch ,keyword, page, d);
                    } else {
                        const searchResult = this.searchFetch(activeModel.val, activeModel.searchUrl,keyword, page, cookie);
                        if(page == 1 && searchResult.includes('l2sp')) {
                            d.push({
                                title: '““””需要登录才能查看链接<b><span style="color: '+ this.primaryColor +'">🔑 点击登录</span></b>',
                                url: $("hiker://empty").rule((key)=>{
                                    eval(fetch('hiker://files/rules/icy/ali.js'));
                                    ali.manualLogin(key);
                                    // refreshPage(false);
                                    
                                    // return 'hiker://empty';
                                }, key),
                                col_type: 'text_1'
                            })
                            // if(username && password && !loginError) {
                            //     d.push({
                            //         title: !fromHikerSearch ? '““””需要登录才能查看链接<b><span style="color: '+ this.primaryColor +'">🔑 点击登录</span></b>' : '需要登录才能查看链接 🔑 点击登录',
                            //         url: $("hiker://empty").lazyRule((key)=>{
                            //             eval(fetch('hiker://files/rules/icy/ali.js'));
                            //             ali.login(key);
                            //             refreshPage(false);
                                        
                            //             return 'hiker://empty';
                            //         }, key),
                            //         col_type: 'text_1'
                            //     })
                            // } else {
                            //     let loginTitle = loginError ? '用户名密码错误' : '需要登录才能查看链接';
                            //     d.push({
                            //         title: !fromHikerSearch ? '““””'+loginTitle+'<b><span style="color: '+ this.primaryColor +'">🔒 点击配置用户名密码</span></b>' : loginTitle + '🔒 点击配置用户名密码',
                            //         url: $("hiker://empty").rule((key)=>{
                            //             eval(fetch('hiker://files/rules/icy/ali.js'));
                            //             ali.settingPage(key);
                            //         }, key),
                
                            //         col_type: 'text_1'
                            //     })
                            // }
                        }
                        if(searchResult.includes('complete a CAPTCHA') || searchResult.includes('Checking your browser before accessing')) {
                            d.push({
                                title: '““””需要点击这里<b><span style="color: '+ this.primaryColor +'">手动打开</span></b>继续浏览',
                                desc: '由于该站点限制，无法正常读取数据，手动打开后浏览即可！',
                                url: $("hiker://empty").rule((host, keyword)=>{
                                    eval(fetch('hiker://files/rules/icy/ali.js'));
                                    ali.pageManually(host+'?q='+keyword, '');
                                }, activeModel.val, keyword),
                                col_type: 'text_1'
                            })
                            return;
                        } else {
                            const {data, included, links} = JSON.parse(searchResult);
                            const host = links.first.match(/https?:\/\/(\w+\.?)+/)[0];
                            let _data = data;
                            if(filterTags && data) {
                                _data = data.filter(item => !!item.relationships.tags.data.filter(_item => filterTags.includes(Number(_item.id))).length);
                            }
                            this.itemData(activeModel, fromHikerSearch, _data, included, host, d, page, keyword);
                        }
    
                    }
                } catch(e) {
                    d.push({
                        title: '搜索失败，错误: ' + JSON.stringify(e),
                        col_type: "long_text"
                    });
                    log(JSON.stringify(e))
                }
            }
            const hikerSearchModel = this.searchModel.filter(item => !!item.forHikerSearch);
            if(fromHikerSearch && hikerSearchModel.length) {
                this.aliSearch(keyword, page, d)
                hikerSearchModel.forEach((model) => {
                    search(model,fromHikerSearch,keyword, page, d)
                })
            } else {
                search(activeModel,fromHikerSearch,keyword, page, d)
            }
        }

        res.data = d;
        setHomeResult(res);
    },
    aliSearch: function(keyword, page, _d) {
        addListener('onClose', $.toString((params) => {
            params.forEach(item => {
                clearVar(item)
            })
        }, ['icy_ali_next_marker']))
        this.getConfig();
        var access_token = this.getAliToken();
        if(!access_token || access_token.startsWith('toast')) {
            return;
        }

        var d = _d || [];
        const {tokenPath, customerSettingPath} = this.urls
        let _tokens = JSON.parse(readFile(tokenPath) || '[]');
        let tokens = _tokens.length ? _tokens : (_tokens.user_id ? [_tokens] : [] );
        let customerSettings = JSON.parse(fetch(customerSettingPath));
        let token = tokens.find(item => item.user_id == customerSettings.user_id) || tokens[0];
        access_token = token.access_token;
        var drive_id = token.default_drive_id;
        var device_id = token.device_id;
        var user_id = token.user_id;
        var deviceID = token.deviceID;
        if(!drive_id) {
            return 'toast://TOKEN获取失败，重新登录试试'
        }
        if(page == 1) {
            putVar('icy_ali_next_marker', '');
        }

        var next_marker = getVar('icy_ali_next_marker', '');
        if(page != 1 && !next_marker) {
            return;
        }
        const getFileList = (access_token, drive_id, keyword, next_marker) => {
            var order_by = getItem('icy_ali_order_by', 'name');
            var order_direction = getItem('icy_ali_order_direction', 'ASC');
            var folderRes = null;
            const data = {
                "drive_id": drive_id,
                "limit":100,
                "image_thumbnail_process": "image/resize,w_400/format,jpeg",
                "image_url_process": "image/resize,w_1920/format,jpeg",
                "video_thumbnail_process": "video/snapshot,t_1000,f_jpg,ar_auto,w_300",
                "query": `name match "`+ keyword + '"',
                "order_by": order_by+ ' ' + order_direction
            }
            if(next_marker) {
                data.marker = next_marker;
            }
            // if(page > 1 && next_marker && folderRes) {
            //     data.parent_file_id = folderRes.file_id;
            // }
            return fetch('https://api.aliyundrive.com/adrive/v3/file/search', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': access_token,
                },
                body: JSON.stringify(data),
                method: 'POST'
            });
        }

        if(!getItem('icy_ali_order_by')) {
            setItem('icy_ali_order_by', 'name');
        }
        if(!getItem('icy_ali_order_direction')) {
            setItem('icy_ali_order_direction', 'ASC');
        }

        var rescod = null;
        try {
            rescod = JSON.parse(getFileList(access_token, drive_id, keyword, next_marker));
        } catch (e){
        }
        if(rescod.code) {
            d.push({
                title: rescod.message,
                url: this.emptyRule,
                col_type: "text_center_1"
            });
            return;
        }

        
        
        const col_type = 'text_1';
        
        putVar('icy_ali_next_marker', rescod.next_marker || '');

        if(rescod.punished_file_count) {
            d.push({
                title: '⚠️ 部分文件由于违规，已封禁',
                url: this.emptyRule,
                col_type: "text_center_1"
            });
        }

        
        const fnName = (fileExist(this.urls.tokenPath) == 'true' || fileExist(this.urls.tokenPath) == true || this.usePublicToken) ? 'lazyRule' : 'rule';
        const zimuExtension = ['srt', 'vtt', 'ass'];
        const zimuList = rescod.items.filter(_item => zimuExtension.includes(_item.file_extension));
        rescod.items.forEach((_item, index) => {
            const {type, category, name, file_id, thumbnail, updated_at, url, size} = _item;
            let title = name;
            let len = 26;
            let len2 = len / 2;
            if(name.length >= len && col_type == 'avatar') {
                title = name.substr(0, len2) + '...'+name.substr(name.length - len2);
            }
            let desc = this.formatDate(updated_at, 'MM/dd HH:mm') + '     ' + this.formatSize(size);
            let pic_url = thumbnail+'#.jpg' + '@headers={"Referer":"https://www.aliyundrive.com/"}';
            let longClick = [{
                title: '下载',
                js: $.toString((_download,drive_id ,file_id) => {
                    if(_download) {
                        return 'download://' + _download
                    } else {
                        eval(fetch('hiker://files/rules/icy/ali.js'));
                        return 'download://' + ali.get_download_url(drive_id ,file_id);
                    }
                    
                }, url ,drive_id ,file_id)
            }]
            switch(category || type){
                case 'video':
                    let zimuItemList = null;
                    let videoName = name.split('.'+_item.file_extension)[0];
                    if(zimuList.length) {
                        zimuItemList = zimuList.filter(_zimu => _zimu.name.startsWith(videoName));
                    }
                    let videolazy = '';
                    let _zimuList = (zimuItemList && zimuItemList.length) ? zimuItemList : zimuList;

                    if(fnName == 'rule') {
                        videolazy = $('hiker://empty' + file_id).rule(() => {
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            var access_token = ali.getAliToken();
                            return "toast://登录后需要重新刷新页面哦！"
                        })
                    } else if(_zimuList  && !!_zimuList.length && (zimuItemList.length > 1 || !zimuItemList.length)) {
                        videolazy = $(['不需要字幕'].concat(_zimuList.map(_zimu => _zimu.name.replace(videoName, '字幕'))), 1)
                        .select((file_id, drive_id, list, videoName,user_id, device_id) => {
                            // showLoading('加载中');
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            var access_token = ali.getAliToken();
                            if(access_token) {
                                let name = input;
                                let zimuItem = null;
                                if(input != '不需要字幕') {
                                    if(name.startsWith('字幕')){
                                        name = name.replace('字幕', videoName);
                                    }
                                    zimuItem = list.find(_zimu => _zimu.name == name);
                                }
                                return $('hiker://empty' + file_id).lazyRule((file_id , zimuItem, drive_id,user_id, device_id) => {
                                    eval(fetch('hiker://files/rules/icy/ali.js'));
                                    return ali.videoProxy({file_id:file_id, zimuItem:zimuItem, drive_id:drive_id,user_id:user_id, device_id:device_id});
                                },file_id , zimuItem, drive_id,user_id, device_id)
                            } else {
                                return "toast://登录后需要重新刷新页面哦！"
                            }

                        }, file_id, drive_id, _zimuList, videoName,user_id, device_id);
                    } else {
                        videolazy = $('hiker://empty' + file_id).lazyRule((drive_id, file_id, fnName, zimuItemList,user_id, device_id) => {
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            var access_token = ali.getAliToken();
                            if(access_token) {
                                let zimuItem = null;
                                if(zimuItemList && zimuItemList.length) {
                                    zimuItem = zimuItemList[0]
                                }
                                return ali.videoProxy({file_id: file_id, zimuItem: zimuItem, drive_id: drive_id,user_id: user_id, device_id:device_id});
                            } else {
                                return "toast://登录后需要重新刷新页面哦！"
                            }
                        }, drive_id, file_id, fnName, zimuItemList,user_id, device_id)
                    }
                    d.push({
                        title: '🎬 ' + title,
                        pic_url: pic_url || this.images.video,
                        desc: desc,
                        url: videolazy,
                        extra: {
                            id: drive_id + file_id,
                            longClick: longClick
                        },
                        col_type: col_type

                    });
                break;
                case 'image':
                    d.push({
                        title: '🖼 ' + title,
                        desc: desc,
                        pic_url: pic_url || this.images.img,
                        url: pic_url,
                        extra: {
                            longClick: longClick
                        },
                        col_type: col_type

                    });
                break;
                case 'folder':
                    d.push({
                        title: '📂 ' + title,
                        desc: desc,
                        pic_url: this.images.folder,
                        url: 'hiker://page/drive?url=https://www.aliyundrive.com/drive/folder/'+file_id + '??fypage',
                        col_type: col_type

                    });
                break;
                case 'audio':
                    d.push({
                        title: '🎻 ' + title,
                        desc: desc,
                        pic_url: pic_url || this.images.audio,
                        url: $('hiker://empty'+ file_id)[fnName]((drive_id, file_id, fnName) => {
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            var access_token = ali.getAliToken();
                            if(access_token) {
                                if(fnName == 'rule') {
                                    back(true);
                                }
                                return ali.lazyAliAudio('', '', file_id, drive_id);
                            } else {
                                return "toast://登录后需要重新刷新页面哦！"
                            }
                        }, drive_id, file_id, fnName),
                        extra: {
                            longClick: longClick
                        },
                        col_type: col_type

                    });
                break;
                default: 
                    pic_url = category == 'doc' ? this.images.book : this.images.unknown;
                    let _title = title;
                    if(category == 'doc') {
                        _title = '📙 ' + title;
                    } else if(zimuExtension.includes(_item.file_extension)) {
                        _title = '🕸️ ' + title;
                        pic_url = this.images.zimu;
                    } else {
                        _title = '❓ ' + title;
                    }
                    d.push({
                        title: _title,
                        pic_url: thumbnail || pic_url,
                        desc: desc,
                        url: category != 'doc' ? 'toast://不支持预览，请长按下载后查看' : $('hiker://empty'+file_id).rule((drive_id, file_id) => {
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            ali.lazyAliDoc('', '', file_id, drive_id);
                        }, drive_id, file_id),
                        extra: {
                            longClick: longClick
                        },
                        col_type: col_type

                    });
            }

        });
    },
    // 资源站点详细页面
    detailPage: function() {
        var cookie, val ;
        if(this.activeModel()) {
            var {cookie, val} = this.activeModel();
        }
        let host = val;
        let _query = '';
        if(MY_URL.includes('?host=')) {
            // host = MY_URL.split('?host=')[1].split('/d/') [0];
            [host, _query] = MY_URL.split('?host=')[1].split('/d/');
        } else {
            [,_query] = MY_URL.split(/[?|$|#]{2}/).filter(item => !!item);
        }
        // const [host, _query] = MY_URL.split('?host=')[1].split('/d/');
        const [,slug, page] = _query.split(/[?|$|#]{2}/).filter(item => !!item);
        const headers = {"Referer": host, 'User-Agent': MOBILE_UA,};
        if(cookie) {
            headers['cookie'] = cookie;
        }

        var res = {};
        var d = [];
        let url = host + '/api/discussions/'+slug;
        let resCode = null;
        let pageRes = null;
        if(page == 1) {
            resCode = JSON.parse(fetch(url, {headers: headers}));
            if(resCode.errors) {
                d.push({
                    title: '页面失联了💔',
                    desc: '点击访问原始网页',
                    col_type: "text_1",
                    url: 'web://' + val,
                });
                log(JSON.stringify(resCode))
            } else {
                const {data, included, links} = resCode;
                const {relationships, attributes: {title, createdAt}} = data;
                setPageTitle(title);
                const postid = relationships.posts.data[0].id;
                const posts = included.filter(_post => _post.type === 'posts' && !!relationships.posts.data.find(_p => _p.id == _post.id && _p.type == 'posts'));
                const post = included.find(_post => _post.id === postid);
                const {attributes: {contentHtml}} = post;
                const contentDome = '<div class="fortext">' + contentHtml || '' + '</div>';
                const texts = parseDomForHtml(contentDome, '.fortext&&Text');
                let _title = this.getEmptyTitle(title, texts);
                d.push({
                    title: "““””<b>"+'<span style="color: '+ this.primaryColor +'">'+_title+'</span></b>\n' + "““””<small>"+'<span style="color: #999999">创建于：'+this.formatDate(createdAt)+'</span></small>',
                    url: host + '/d/' + slug,
                    col_type: "text_1"
                });
                this.detailPostPageData(posts, d, page);
            }
        } else {
            resCode = JSON.parse(fetch(url, {headers: headers}));
            if(resCode.errors) {
                d.push({
                    title: '页面失联了💔',
                    desc: '点击访问原始网页',
                    col_type: "text_1",
                    url: 'web://' + val,
                });
                log(JSON.stringify(resCode))
            } else {
                let start = (page-1)*20;
                if(resCode.data.relationships.posts.data.length > 20) {
                    const postIds = resCode.data.relationships.posts.data.map(item => item.id).slice(start, start+20); 
                    url = host + '/api/posts?filter[id]='+postIds.join(',');
                    pageRes = JSON.parse(fetch(url, {headers: headers}));
                    this.detailPostPageData(pageRes.data, d, page);
                }
            }
        }
        res.data = d;
        setHomeResult(res);
    },
    // TODO
    detailRule: function(url) {
        return $.toString(()=> {
            var link = 'hiker://empty?url=' + url;
            return $(link).rule(() => {
                eval(fetch('hiker://files/rules/icy/ali.js'));
                ali.aliRule();
            })
        })
    },
    // 详细页面数据
    detailData: function(data, post, host,d) {
        const {attributes: {title, commentCount, slug},relationships} = data;
        const {attributes: {contentHtml}} = post;
        const contentDome = '<div class="fortext">' + contentHtml || '' + '</div>';
        const texts = parseDomForHtml(contentDome, '.fortext&&Text');
        let _title = this.getEmptyTitle(title, texts);
        setPageTitle(_title);
        let expand = !!Number(getVar('icy_ali_expand'+slug , ''));
        d.push({
            title: "““””<b>"+'<span style="color: '+ this.primaryColor +'">'+_title+'</span></b>\n' + "““””<small>"+'<span style="color: #999999">请点击下面资源链接访问，\n如果有误请点这里查看帖子内容或原始页面！</span></small>',
            url: host + '/d/' + slug,
            col_type: "text_1"
        });

        let _linksArr = texts.match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net|pan\.quark\.cn\/s)\/\w*/g) || [];
        let _links = [];
        const codes = texts.split(/(?:https:\/\/www\.aliyundrive\.com\/s[\/\w*]*)|(?:https:\/\/alywp\.net[\/\w*]*)|(?:https:\/\/pan\.quark\.cn\/s[\/\w*]*)/ig) || [];
        const siteReg = new RegExp('href="('+host+'\/d\/(-|\\w|\\d)*)"', 'ig');
        if(!expand && _linksArr.length > 5) {
            _links = _linksArr.slice(0, 5);
        } else {
            _links = _linksArr;
        }
        _links.forEach((link, index) => {
            let code = '';
            let item_title = '🔗 ' + (_links.length > 1 ? '链接'+(index+1)+'：' : '链接：');
            let isquark = link.includes('pan.quark.cn');
            if(codes[index]) {
                const code_match = codes[index].match(/提取码|访问码/);
                if(code_match && code_match[0]) {
                    code = codes[index].split(/提取码|访问码/)[1].match(/[a-zA-z0-9]+/)[0];
                }
                item_title = this.getEmptyTitle('', codes[index]) || item_title || _title;
            }
            d.push({
                // title: '🔗 ' + (_links.length > 1 ? '链接'+(index+1)+'：' : '')  + link + (code ? '  提取码：' + code : ''),
                title: '““””' + item_title + '\n<small><span style="color: #999999">'+link + (code ? '  提取码：' + code : '')+'</span></small>',
                // desc: link + (code ? '  提取码：' + code : ''),
                url: isquark ? 'qklink://www.uc.cn/b20b84fd735a8dd3f7541129bacc4e9a?action=open_url&url=' + link : 'hiker://page/detail?url=' + link + (code ? '?share_pwd=' + code: '') + '??fypage',
                col_type: "text_1"
            });
        })
        if(!_links.length && !contentDome.match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net|pan\.quark\.cn\/s)\/\w*/g)) {
            d.push({
                title: '““””<small><span style="color: #999999">没有匹配到链接？点击查看原网页内容！</span></small>',
                url: host + '/d/' + slug,
                col_type: "text_1"
            });
        } else if(_linksArr.length > 5){
            d.push({
                title: expand ? '收起' : '展开',
                url: $("#noLoading#").lazyRule((slug)=>{
                    putVar('icy_ali_expand'+slug, Number(!Number(getVar('icy_ali_expand'+slug))));
                    refreshPage(false);
                    return "hiker://empty"
                }, slug),
                col_type: "text_center_1"
            });
        }
        d.push({
            col_type: "line_blank"
        });
        d.push({
            title: '✨ 帖子内容',
            url: this.emptyRule,
            col_type: "text_1"
        });
        d.push({
            title: contentHtml.replace(/href="https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)(\/|\w|\d)*/ig, function(e,t) {
                return 'href="hiker://page/detail?url=' + e.split('href="')[1] + '??fypage';
            }).replace('www.alixiaozhan.net', 'pan.wuenci.com').replace(siteReg, function(e,t) {
                return 'href="hiker://page/site-detail?host=' + t+'??'+t.split('/d/')[1].split('-')[0] +'??fypage"';
            }).replace(/href="https:\/\/(pan\.quark\.cn\/s)(\/|\w|\d)*/ig, function(e,t) {
                return 'href="qklink://www.uc.cn/b20b84fd735a8dd3f7541129bacc4e9a?action=open_url&url=' + e.split('href="')[1];
            }),
            col_type: "rich_text"
        })
        if(commentCount > 1) {
            d.push({
                col_type: "line_blank"
            });
            let urlMore = 'hiker://page/site-detail?host='+host+'/d/'+slug+'??'+slug+'??fypage';
            d.push({
                title: '✨ 点击查看全部帖子内容, 共' + (commentCount - 1) + '条回帖',
                url: urlMore,
                col_type: 'text_1'
            })
        }
    },
    // 详细帖子列表
    detailPostPageData: function(posts, d, page){
        if(page == 1) {
            d.push({
                title: '✨ 全部帖子内容',
                url: this.emptyRule,
                col_type: "text_1"
            });
        }
        const val = this.activeModel() ? this.activeModel().val : MY_URL ;
        const host = val.match(/https?:\/\/(\w+\.?)+/)[0];
        const siteReg = new RegExp('href="('+host+'\/d\/(-|\\w|\\d)*)"', 'ig');
        posts.forEach(post => {
            const { contentHtml } = post.attributes
            if(contentHtml) {
                // log(contentHtml.replace(/href="https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)(\/|\w|\d)*/ig, function(e,t) {
                //     return 'href="hiker://page/detail?url=' + e.split('href="')[1] + '??fypage';
                // }).replace(siteReg, function(e,t) {
                //     return 'href="hiker://page/site-detail?host=' + t+'??'+t.split('/d/')[1] +'??fypage"';
                // }))
                d.push({
                    title: contentHtml.replace(/href="https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)(\/|\w|\d)*/ig, function(e,t) {
                        return 'href="hiker://page/detail?url=' + e.split('href="')[1] + '??fypage';
                    }).replace('www.alixiaozhan.net', 'pan.wuenci.com').replace(siteReg, function(e,t) {
                        return 'href="hiker://page/site-detail?host=' + t+'??'+t.split('/d/')[1].split('-')[0] +'??fypage"';
                    }).replace(/href="https:\/\/(pan\.quark\.cn\/s)(\/|\w|\d)*/ig, function(e,t) {
                        return 'href="qklink://www.uc.cn/b20b84fd735a8dd3f7541129bacc4e9a?action=open_url&url=' + e.split('href="')[1];
                    }),
                    col_type: "rich_text"
                })
                d.push({
                    col_type: "line_blank"
                });
            }
        })
    },

    // 云盘规则
    lazyOneDriver: function(link) {
        var _play = JSON.parse(fetch(link, {
            headers: {
                'User-Agent': MOBILE_UA,
            },
            redirect: false,
            withStatusCode: true
        })).headers;
        if(_play && _play.location && _play.location[0]) {
            let cookie = _play['set-cookie'] ? _play['set-cookie'].join(';') : getVar('oneDriverCookie','');
            if(!cookie) {
                let _cookie = fetchCookie(_play.location[0]);
                if(_cookie && _cookie.length) {
                    cookie = _cookie.join(';')
                }
            }
            if(cookie){
                putVar('oneDriverCookie', cookie);
            }
            var pageUrl = _play.location[0];
            const _page_query = {};
            const [pageHost ,pageQuery] = pageUrl.split('?');
            const user = pageHost.split('personal/')[1].split('/_layouts')[0];
            pageQuery.split('&').forEach(query => {
                const [key, val] = query.split('=');
                _page_query[key] = val;
            })
            const graphql = {
                "query": "query (\n        $listServerRelativeUrl: String!,$renderListDataAsStreamParameters: RenderListDataAsStreamParameters!,$renderListDataAsStreamQueryString: String!,$spoSuiteLinksQueryString: String!\n        )\n      {\n      \n      legacy {\n      spoSuiteLinks(\n      queryString: $spoSuiteLinksQueryString\n      )          \n      renderListDataAsStream(\n      listServerRelativeUrl: $listServerRelativeUrl,\n      parameters: $renderListDataAsStreamParameters,\n      queryString: $renderListDataAsStreamQueryString\n      )\n    }\n      \n      \n  perf {\n    executionTime\n    overheadTime\n    parsingTime\n    queryCount\n    validationTime\n    resolvers {\n      name\n      queryCount\n      resolveTime\n      waitTime\n    }\n  }\n    }",
                "variables": {
                    "listServerRelativeUrl": "/personal/tammybrown_autoseed_tk/Documents",
                    "renderListDataAsStreamParameters": {
                        "renderOptions": 12295,
                        "addRequiredFields": true,
                        "folderServerRelativeUrl": "/personal/tammybrown_autoseed_tk/Documents/iNpaSSwbjmgx/[Sakurato] 86—Eitishikkusu— [12][AVC-8bit 1080p@60FPS AAC][CHT].mp4"
                    },
                    "renderListDataAsStreamQueryString": "@a1='%2Fpersonal%2Ftammybrown%5Fautoseed%5Ftk%2FDocuments'&RootFolder=%2Fpersonal%2Ftammybrown%5Fautoseed%5Ftk%2FDocuments%2FiNpaSSwbjmgx%2F%5BSakurato%5D%2086%E2%80%94Eitishikkusu%E2%80%94%20%5B12%5D%5BAVC%2D8bit%201080p%4060FPS%20AAC%5D%5BCHT%5D%2Emp4&TryNewExperienceSingle=TRUE",
                    "spoSuiteLinksQueryString": "Locale=en-US&v=2&mobilereq=0&msajax=1"
                }
            }
            const document = _page_query.id.split('Documents')[0] + 'Documents';
            graphql.variables.listServerRelativeUrl = decodeURIComponent(document);
            const _names = _page_query.id.split('.');
            const folder = _names.slice(0, _names.length - 1).join('.');
            graphql.variables.renderListDataAsStreamParameters.folderServerRelativeUrl = decodeURIComponent(_page_query.id);
            graphql.variables.renderListDataAsStreamQueryString = "@a1='"+document+"'&RootFolder="+_page_query.id+"&TryNewExperienceSingle=TRUE";
            const postDataUrl = "https://dbdc-my.sharepoint.com/personal/"+user+"/_api/web/GetListUsingPath(DecodedUrl=@a1)/RenderListDataAsStream?@a1="+decodeURIComponent("'"+document+"'")+"&RootFolder="+decodeURIComponent(_page_query.id)+"&TryNewExperienceSingle=TRUE";
            const postData = {
                "parameters": {
                    "RenderOptions": 5707527,
                    "AllowMultipleValueFilterForTaxonomyFields": true,
                    "AddRequiredFields": true,
                    "FilterOutChannelFoldersInDefaultDocLib": true
                }
            }
            const graphqlUrl = "https://dbdc-my.sharepoint.com/personal/"+user+"/_api/v2.1/graphql";
            const pageResult = JSON.parse(fetch(graphqlUrl, {
                headers: {
                    'User-Agent': MOBILE_UA,
                    'Referer': pageHost,
                    'Content-Type': 'application/json',
                    'cookie': cookie,
                },
                body: JSON.stringify(graphql),
                method: 'POST',
                withStatusCode: true
            }));
            // const pageResult = JSON.parse(fetch(postDataUrl, {
            //     headers: {
            //         'User-Agent': MOBILE_UA,
            //         'Referer': pageHost,
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(postData),
            //     method: 'POST',
            //     withStatusCode: true
            // }));
            const correlationid = pageResult.headers['sprequestguid'];
            const json = JSON.parse(pageResult.body);
            // const Row = json.data.legacy.renderListDataAsStream.ListData.Row;
            const {rootFolder, ListData: {Row}} = json.data.legacy.renderListDataAsStream;
            var res = {};
            var d = [];
            let _folders = rootFolder.split('/');
            let folderName = _folders[_folders.length - 1];
            setPageTitle(folderName);
            if(_page_query.parent || (!!Row && !Row.length)) {
                let _link = "https://dbdc-my.sharepoint.com/personal/"+user+"/_layouts/15/download.aspx?SourceUrl="+_page_query.id+"&ccat=0&correlationid=" + correlationid + '&memoryPosition=full#isVideo=true#';
                d.push({
                    title: '🎬 '+ folderName,
                    url: encodeURI(decodeURIComponent(_link)) + ';{cookie@'+cookie.split(';')[0]+'}',
                    col_type: 'text_1'
                })
                // return encodeURI(decodeURIComponent(_link)) + ';{cookie@'+cookie.split(';')[0]+'}';
            } else {
                Row.forEach((item) => {
                    let _link = "https://dbdc-my.sharepoint.com/personal/"+user+"/_layouts/15/download.aspx?SourceUrl="+item.FileRef+"&ccat=0&correlationid=" + correlationid + '&memoryPosition=full#isVideo=true#';
                    d.push({
                        title: '🎬 '+ item.FileLeafRef,
                        url: encodeURI(decodeURIComponent(_link)) + ';{cookie@'+cookie.split(';')[0]+'}',
                        col_type: 'text_1'
                    })
                })
            }

            res.data = d;
            setHomeResult(res);
        }
    },
    videoProxy: function(dataParam){
        let {file_id, share_id, share_token, zimuItem, drive_id,user_id, device_id, download_url} = dataParam;
        var access_token = this.getAliToken();
        if(!access_token) {
            return 'toast://还没登录？';
        }
        if(access_token && access_token.startsWith('toast')) {
            return access_token;
        }
        var json = null;
        if(share_id) {
            json = JSON.parse(fetch('https://api.aliyundrive.com/adrive/v2/file/get_video_preview_play_info_by_share', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': access_token,
                    'X-Share-Token': share_token,
                    'x-device-id': drive_id
                },
                body: '{"share_id":"' + share_id + '","category":"live_transcoding","file_id":"' + file_id + '","template_id":"", "get_preview_url":true,"get_subtitle_info":true}',
                method: 'POST',
            }));
        } else if(drive_id) {
            json = JSON.parse(fetch('https://api.aliyundrive.com/adrive/v2/file/get_video_preview_play_info', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': access_token,
                },
                body: '{"drive_id":"' + drive_id + '","category":"live_transcoding","file_id":"' + file_id + '","template_id":""}',
                method: 'POST',
            }));
        }
        var tid = ["FHD", "HD", "SD", "LD"];
        var tidName = ["全高清", "高清", "标清", "流畅"];
        if(json.code && json.message) {
            if(json.code.includes('AccessTokenInvalid')) {
                this.getAliToken(true);
                return this.videoProxy(dataParam);
                // eval(fetch('hiker://files/rules/icy/ali.js'));
                // var access_token = ali.getAliToken(true);
                // // confirm({
                // //     title: 'TOKEN失效了',
                // //     content: '重新刷新规则或页面再试试！',
                // // });
                // refreshPage();
                // return "toast://token 失效了，再点击试试！";
            } else if(json.code.includes('NotFound.VideoPreviewInfo')) {
                if(share_id) {
                    const result_link = this.get_share_link_download_url(share_id, share_token, file_id);
                    if(result_link.includes('.wmv')) {
                        return 'toast://WMV格式暂时不支持播放！'
                    }
                    return result_link + '#isVideo=true#;{Referer@https://www.aliyundrive.com/}';
                }
                return 'toast://该格式暂时不支持播放！'
            } else {
                return "toast://" + json.message;
            }
        }
        let zimu = '';
        if(zimuItem) {
            try {
                zimu = zimuItem.download_url || zimuItem.url || this.get_share_link_download_url(share_id, share_token, zimuItem.file_id);
            } catch(e) {}
            let zimuStr = fetch(zimu, {
                headers: {
                    'Referer': 'https://www.aliyundrive.com/'
                }
            });
            try {
                let path = 'hiker://files/rules/icy/cache/cache.' + zimuItem.file_extension;
                let realPath = 'file:///storage/emulated/0/Android/data/com.example.hikerview/files/Documents/rules/icy/cache/cache.' + zimuItem.file_extension;
                deleteFile(path);
                if(zimuStr) {
                    writeFile(path, zimuStr);
                    zimu = realPath
                }
            } catch (e){}
        }
        // 原始文件播放 4k有问题，存在无声音的情况
        // return this.get_share_link_download_url(share_id, share_token, file_id) + '#isVideo=true#;{Referer@https://www.aliyundrive.com/}';
        var link = "";
        var result = {urls: [], headers:[], names: [], subtitle: ''};
        if(this.sourcePlay) {
            result.urls.push((share_id ? this.get_share_link_download_url(share_id, share_token, file_id) : download_url) + '#isVideo=true#');
            result.headers.push({'Referer': 'https://www.aliyundrive.com/'})
            result.names.push('原始文件播放');
            if(zimu && (zimu.startsWith('http') || zimu.includes('icy/cache'))) {
                result.subtitle = zimu;
            }
            return JSON.stringify(result);
            // log(JSON.stringify(result))
            // log((drive_id ? this.get_download_url(drive_id, file_id) : this.get_share_link_download_url(share_id, share_token, file_id)) + '#isVideo=true#')
            // return (drive_id ? this.get_download_url(drive_id, file_id) : this.get_share_link_download_url(share_id, share_token, file_id)) + '#isVideo=true#';
        }
        try {
            var playList = json.video_preview_play_info.live_transcoding_task_list;
            tid.forEach((value, index) => {
                var _link = playList.find(e => e.template_id == value);
                if (!!_link) {
                    // 多线路
                    let playLink = ''
                    if(share_id) {

                        playLink = 'http://113.107.160.110:3000/apis/yun-play/'+share_id+'/'+file_id+'/'+access_token+'/'+share_token+'/'+value+'/'+drive_id+'/'+user_id+'/'+device_id+'/index.m3u8';
                    } else if(drive_id) {
                        playLink = 'http://113.107.160.110:3000/apis/my-yun-play/'+file_id+'/'+drive_id+'/'+access_token+'/'+value+'/index.m3u8';
                    }
                    result.urls.push(playLink);
                    result.headers.push({'Referer': 'https://www.aliyundrive.com/'})
                    result.names.push(tidName[index]);
                    if(zimu && (zimu.startsWith('http') || zimu.includes('icy/cache'))) {
                        result.subtitle = zimu;
                    }
                    return playLink;
                }
            });
        } catch (err) {
            link = err
        }
        return JSON.stringify(result);
    },
    lazyAli: function(shareId, sharetoken, input){
        var access_token = this.getAliToken();
        if(access_token && access_token.startsWith('toast')) {
            return access_token;
        }
        if(!access_token) {
            return 'toast://还没登录？';
        }
        var json = JSON.parse(fetch('https://api.aliyundrive.com/v2/file/get_share_link_video_preview_play_info', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': access_token,
                'X-Share-Token': sharetoken,
                'x-device-id': drive_id
            },
            body: '{"share_id":"' + shareId + '","category":"live_transcoding","file_id":"' + input + '","template_id":""}',
            method: 'POST',
        }));
        var tid = ["FHD", "HD", "SD", "LD"];
        var tidName = ["全高清", "高清", "标清", "流畅"];
        var bfArr = [];
        if(json.code && json.message) {
            if(json.code.includes('AccessTokenInvalid')) {
                this.getAliToken(true);
                return this.lazyAli(shareId, sharetoken, input);
                // eval(fetch('hiker://files/rules/icy/ali.js'));
                // var access_token = ali.getAliToken();
                // confirm({
                //     title: 'TOKEN失效了',
                //     content: '重新刷新规则或页面再试试！',
                // });
                // refreshPage();
                // return false;
            } else {
                return "toast://" + json.message;
            }
        }
        var link = "";
        var result = {urls: [], names: [], headers: []};
        try {
            var playList = json.video_preview_play_info.live_transcoding_task_list;
            tid.forEach((value, index) => {
                var _link = playList.find(e => e.template_id == value);
                if (!!_link) {
                    // 多线路
                    result.urls.push(_link.url);
                    result.names.push(tidName[index]);
                    result.headers.push({'Referer': 'https://www.aliyundrive.com/'});
                    bfArr.push({
                        url: _link.url,
                        options: {
                            headers: {
                                'User-Agent': MOBILE_UA,
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Referer': 'https://www.aliyundrive.com/'
                            },
                            redirect: false,
                            withStatusCode: true
                        }
                    })
                    // throw _link.url
                }
            });
        } catch (err) {
            link = err
        }
        // const time = Math.ceil(new Date().getTime() / 1000) + 3600*3; // 有效期 10天
        if(!!result.urls.length) {
            const arrResult = batchFetch(bfArr);
            const bcmArr = [];
            arrResult.forEach((_item, index) => {
                const arrItemData = JSON.parse(_item);
                if(arrItemData.headers && arrItemData.headers.location) {
                    // log(arrItemData.headers.location[0])
                    // const _playUrl = arrItemData.headers.location[0].replace(/x-oss-expires=(\d+)/, 'x-oss-expires=' + time)
                    result.urls[index] = arrItemData.headers.location[0];
                    bcmArr.push({
                        url: arrItemData.headers.location[0],
                        options: {
                            headers: {
                                'Referer': 'https://www.aliyundrive.com/'
                            }
                        }
                    })
                }
            })
            try {
                const m3u8List = batchCacheM3u8(bcmArr);
                result.urls = m3u8List;
            } catch(e) {

            }
            return JSON.stringify(result);
        }

        // 播放原始视频， 无法投屏
        // var json = JSON.parse(fetch('https://api.aliyundrive.com/v2/file/get_share_link_download_url', {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': getVar("access_token"),
        //         'X-Share-Token': sharetoken
        //     },
        //     body: '{"share_id":"' + shareId + '","file_id":"' + input + '","expire_sec":600}',
        //     method: 'POST',
        // }));
        // if(json.code && json.message) {
        //     if(json.code.includes('AccessTokenInvalid')) {
        //         log('TOKEN过期了，重新获取TOKEN');
        //         this.lazyAli(shareId, sharetoken, input);
        //     } else {
        //         return "toast://" + json.message;
        //     }
        // }
        // var _play = JSON.parse(fetch(json.url, {
        //     headers: {
        //         'User-Agent': MOBILE_UA,
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //         'Referer': 'https://www.aliyundrive.com/'
        //     },
        //     redirect: false,
        //     withStatusCode: true
        // }));
        // if(_play && _play.headers && _play.headers.location) {
        //     return _play.headers.location[0] + '#isVideo=true#;{Referer@https://www.aliyundrive.com/}'
        // } else {
        //     return "toast://" + _play.body;
        // }
    },
    lazyAliImage: function(shareId, sharetoken, input){
        var access_token = this.getAliToken();
        if(access_token && access_token.startsWith('toast')) {
            return access_token;
        }
        if(!access_token) {
            return 'toast://还没登录？';
        }
        var json = JSON.parse(fetch('https://api.aliyundrive.com/v2/file/get_share_link_download_url', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': access_token,
                'X-Share-Token': sharetoken
            },
            body: '{"share_id":"' + shareId + '","expire_sec":600,"file_id":"' + input + '"}',
            method: 'POST'
        }));
        if(json.code && json.message) {
            if(json.code.includes('AccessTokenInvalid')) {
                this.getAliToken(true);
                return this.lazyAliImage(shareId, sharetoken, input);
                // eval(fetch('hiker://files/rules/icy/ali.js'));
                // var access_token = ali.getAliToken(true);
                // refreshPage();
                // return "toast://TOKEN失效了， 请重新试试！错误信息：" + json.message;
            } else {
                return "toast://" + json.message;
            }
        }
        var link = json.url;
        var _play = JSON.parse(fetch(link, {
            headers: {
                'User-Agent': MOBILE_UA,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'https://www.aliyundrive.com/'
            },
            redirect: false,
            withStatusCode: true
        })).headers;
        if(_play && _play.location) {
            return 'pics://'+_play.location[0]+'#.jpg' + '@headers={"Referer":"https://www.aliyundrive.com/"}';
        } else {
            return "toast://" + _play.body;
        }
    },
    lazyAliDoc: function(shareId, sharetoken, file_id, drive_id){
        var access_token = this.getAliToken();
        if(access_token && access_token.startsWith('toast')) {
            return access_token;
        }
        if(!access_token) {
            return 'toast://还没登录？';
        }
        var json = null;
        if(shareId) {
            json = JSON.parse(fetch('https://api.aliyundrive.com/v2/file/get_office_preview_url', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': access_token,
                    'X-Share-Token': sharetoken,
                    'x-device-id': drive_id
                },
                body: '{"share_id":"' + shareId + '","file_id":"' + file_id + '"}',
                method: 'POST'
            }));
        } else if(drive_id){
            json = JSON.parse(fetch('https://api.aliyundrive.com/v2/file/get_office_preview_url', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': access_token,
                    'x-device-id': drive_id
                },
                body: '{"drive_id":"' + drive_id + '","file_id":"' + file_id + '"}',
                method: 'POST'
            }));
        }
        if(json.code && json.message) {
            if(json.code.includes('AccessTokenInvalid')) {
                this.getAliToken(true);
                return this.lazyAliDoc(shareId, sharetoken, file_id, drive_id);
                // eval(fetch('hiker://files/rules/icy/ali.js'));
                // var access_token = ali.getAliToken(true);
                // refreshPage();
                // return "toast://TOKEN失效了， 请重新试试！错误信息：" + json.message;
            } else {
                return "toast://" + json.message;
            }
        }
        let d = [];
        d.push({
            url: json.preview_url + '??' +json.access_token,
            col_type: 'x5_webview_single',
            desc: '100%&&float',
            extra: {
                canBack: true,
                js: "var token =location.href.split('??')[1]; if(!document.cookie.includes(token)) {document.cookie = 'wwo_token=' + location.href.split('??')[1];location.reload();}"
            }
        })
        setHomeResult({
            data: d
        })
    },
    get_share_link_download_url: function(shareId, sharetoken, file_id){
        var access_token = this.getAliToken();
        if(access_token && access_token.startsWith('toast')) {
            return access_token;
        }
        if(!access_token) {
            return 'toast://还没登录？';
        }
        const data = {"expire_sec":600,"file_id":file_id ,"share_id": shareId};
        var json = JSON.parse(fetch('https://api.aliyundrive.com/v2/file/get_share_link_download_url', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': access_token,
                'X-Share-Token': sharetoken
            },
            body: JSON.stringify(data),
            method: 'POST'
        }));
        if(json.code && json.message) {
            if(json.code.includes('AccessTokenInvalid')) {
                this.getAliToken(true);
                return this.get_share_link_download_url(shareId, sharetoken, input);
                // eval(fetch('hiker://files/rules/icy/ali.js'));
                // var access_token = ali.getAliToken(true);
                // refreshPage();
                // return "toast://TOKEN失效了， 请重新试试！错误信息：" + json.message;
            } else {
                return "toast://" + json.message;
            }
        }
        var link = json.download_url;
        var _play = JSON.parse(fetch(link, {
            headers: {
                'User-Agent': MOBILE_UA,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'https://www.aliyundrive.com/'
            },
            redirect: false,
            withStatusCode: true
        })).headers;
        if(_play && _play.location) {
            return _play.location[0]
        } else {
            return "toast://" + _play.body;
        }
    },
    get_download_url: function(drive_id, file_id, deviceID){
        var access_token = this.getAliToken();
        if(access_token && access_token.startsWith('toast')) {
            return access_token;
        }
        if(!access_token) {
            return 'toast://还没登录？';
        }
        const data = {"expire_sec":115200,"file_id":file_id ,"drive_id": drive_id};
        var json = JSON.parse(fetch('https://api.aliyundrive.com/v2/file/get_download_url', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': access_token,
                'x-device-id': deviceID
            },
            body: JSON.stringify(data),
            method: 'POST'
        }));
        if(json.code && json.message) {
            if(json.code.includes('AccessTokenInvalid')) {
                this.getAliToken(true);
                return this.get_download_url(drive_id, file_id);
                // eval(fetch('hiker://files/rules/icy/ali.js'));
                // var access_token = ali.getAliToken(true);
                // refreshPage();
                // return "toast://TOKEN失效了， 请重新试试！错误信息：" + json.message;
            } else {
                return "toast://" + json.message;
            }
        }
        if(json && json.url) {
            return json.url;
        } else {
            return "toast://没有获取到下载地址";
        }
    },
    lazyAliAudio: function(shareId, sharetoken, file_id, drive_id){
        var access_token = this.getAliToken();
        if(access_token && access_token.startsWith('toast')) {
            return access_token;
        }
        if(!access_token) {
            return 'toast://还没登录？';
        }
        var json = null;
        var link = '';
        if(shareId) {
            json = JSON.parse(fetch('https://api.aliyundrive.com/v2/file/get_share_link_download_url', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': access_token,
                    'X-Share-Token': sharetoken,
                    'x-device-id': drive_id
                },
                body: '{"share_id":"' + shareId + '","get_audio_play_info":true,"file_id":"' + file_id + '"}',
                method: 'POST'
            }));  
            link = json.download_url;
        } else if (drive_id) {
            json = JSON.parse(fetch('https://api.aliyundrive.com/v2/databox/get_audio_play_info', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': access_token,
                    'x-device-id': drive_id
                },
                body: '{"drive_id":"' + drive_id + '","file_id":"' + file_id + '"}',
                method: 'POST'
            }));  
        }
        if(json.code && json.message) {
            if(json.code.includes('AccessTokenInvalid')) {
                this.getAliToken(true);
                return this.lazyAliAudio(shareId, sharetoken, file_id, drive_id);
                // eval(fetch('hiker://files/rules/icy/ali.js'));
                // var access_token = ali.getAliToken(true);
                // refreshPage();
                // return "toast://TOKEN失效了， 请重新试试！错误信息：" + json.message;
            } else {
                return "toast://" + json.message;
            }
        }

        if(json.audio_template_list) {
            link = json.audio_template_list[json.audio_template_list.length-1].url
        }
        if(drive_id) {
            link = json.template_list[json.template_list.length-1].url;
            return link + '#isMusic=true#;{Referer@https://www.aliyundrive.com/}'
        }
        var _play = JSON.parse(fetch(link, {
            headers: {
                'User-Agent': MOBILE_UA,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'https://www.aliyundrive.com/'
            },
            redirect: false,
            withStatusCode: true
        })).headers;
        if(_play && _play.location) {
            return _play.location[0] + '#isMusic=true#;{Referer@https://www.aliyundrive.com/}'
        } else {
            return "toast://" + _play.body;
        }
    },
    aliRule: function() {
        addListener('onClose', $.toString((params) => {
            params.forEach(item => {
                clearVar(item)
            })
        }, ["folderName", "icy_ali_folder", "icy_ali_next_marker"]))
        
        this.getConfig();
        var access_token = this.getAliToken();
        if(!access_token) {
            return 'toast://还没登录？';
        } else if(access_token.startsWith('toast')) {
            return access_token;
        }

        const {tokenPath, customerSettingPath} = this.urls
        let _tokens = JSON.parse(readFile(tokenPath) || '[]');
        let tokens = _tokens.length ? _tokens : (_tokens.user_id ? [_tokens] : [] );
        let customerSettings = JSON.parse(fetch(customerSettingPath));
        let token = tokens.find(item => item.user_id == customerSettings.user_id) || tokens[0];
        access_token = token.access_token;
        var drive_id = token.default_drive_id;
        var device_id = token.device_id;
        var user_id = token.user_id;
        var deviceID = token.deviceID;
        if(!drive_id) {
            return 'toast://TOKEN获取失败，重新登录试试'
        }
        const [shareLink, _page] = MY_URL.split(/[?|$|#]{2}/).filter(item => !!item);
        const [link, _share_pwd] = shareLink.split('?share_pwd=');
        const [_link, _folderID] = link.split('/folder/');
        var shareId = '';
        var share_pwd = (_share_pwd || '').split('#name=')[0] || '';
        var folderID = _folderID || '';
        var page = _page || 1;
        if(page == 1) {
            putVar('icy_ali_next_marker', '');
            putVar('icy_ali_folder', folderID);
        } else {
            folderID = getVar('icy_ali_folder', '')
        }
        var next_marker = getVar('icy_ali_next_marker', '');
        if(page != 1 && !next_marker) {
            setHomeResult({
                data: [{title: "““””<center><small>"+'<span style="color: #999999">～～～我是有底线的～～～</span></small></center>', url: this.emptyRule, col_type: 'text_center_1'}]
            });
            return 'toast://到底了！';
        }
        if (/aliyundrive/.test(_link)) {
            shareId = _link.split('com/s/')[1];
        } else if (/alywp/.test(_link)) {
            var result_link = JSON.parse(fetch(_link, {
                headers: {
                    'User-Agent': MOBILE_UA,
                },
                redirect: false,
                withHeaders: true
            })).headers.location[0];
            shareId = result_link.split('com/s/')[1];
        }
        let _name = MY_URL.split('#name=')[1];
        let parentName = _name ? base64Decode(_name.split('??')[0]) : '';
        const _data = {
            parent_name: parentName,
            folder_id: folderID,
            file_id: '',
            file_name: '',
            share_id: shareId,
            share_pwd: share_pwd,
            expiration: '',
        };
        var saveLink = 'smartdrive://share/browse?shareId='+shareId+'&sharePwd='+share_pwd;
        var sharetoken = '';
        var expiration = undefined;
        var shareInfo_res = JSON.parse(fetch('https://api.aliyundrive.com/adrive/v3/share_link/get_share_by_anonymous?share_id=' + shareId, {
            headers: {
                'Content-Type': 'application/json',
                'x-device-id': drive_id
            },
            body: '{"share_id":"' + shareId + '"}',
            method: 'POST'
        }));

        var sharetoken_res = JSON.parse(fetch('https://api.aliyundrive.com/v2/share_link/get_share_token', {
            headers: {
                'Content-Type': 'application/json',
                'x-device-id': drive_id
            },
            body: '{"share_pwd":"'+share_pwd+'","share_id":"' + shareId + '"}',
            method: 'POST'
        }));
        var getDateDiff = (expiration) => {
            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var month = day * 30;
    
            var now = new Date().getTime();
            var diffValue = new Date(expiration).getTime() - now;
            var monthC =diffValue/month;
            var dayC =diffValue/day;
            var hourC =diffValue/hour;
            var minC =diffValue/minute;
            if(minC<=60){
                result = Math.ceil(minC) + '分钟内有效';
            } else if(hourC<=24){
                 result = Math.ceil(hourC) + '小时内有效';
             } else if(dayC<=30){
                 result = Math.ceil(dayC) +"天内有效";
             } else {
                result = Math.ceil(monthC) +"月内有效";
             }
            return result;
        }
        if(shareInfo_res && !!shareInfo_res.display_name) {
            expiration = shareInfo_res.expiration;
            setPageTitle(shareInfo_res.display_name);
        }
        if(!!sharetoken_res.share_token) {
            sharetoken = sharetoken_res.share_token;
        } else if(sharetoken_res.code == 'InvalidResource.SharePwd') {
            this.needSharePWD(link);
            return false;
        } else if(sharetoken_res.code.includes('Cancelled') || sharetoken_res.code.includes('Expired')) {
            var d = [];
            d.push({
                title: "““””<center><small>"+'<span style="color: #999999">来晚啦，该分享已失效!</span></small></center>',
                url: this.emptyRule,
                col_type: "text_center_1"
            });
            setHomeResult({
                data: d
            });
            return false;
        } else if(sharetoken_res.code) {
            var d = [];
            let message = sharetoken_res.message;
            if(sharetoken_res.code.includes('Forbidden')){
                message = '文件违规\n根据相关法律法规要求，该文件已禁止访问';
            } else if(sharetoken_res.code.includes('ShareLinkTokenInvalid')){
                message = '你打开的链接有误，请重试';
            }
            d.push({
                title: "““””<center><b>"+'<span style="color: '+ this.primaryColor +'">'+message+'</span></b></center>',
                url: this.emptyRule,
                col_type: "text_center_1"
            });
            setHomeResult({
                data: d
            });
            return false;
        }
        if(!sharetoken) {
            confirm({
                title: '稍等一会儿',
                content: 'TOKEN还没有获取到，重新刷新再试试！'
            });
            return false;
        }
        const getFileList = (sharetoken, shareId, folderID, next_marker, drive_id) => {
            var order_by = getItem('icy_ali_order_by', 'name');
            var order_direction = getItem('icy_ali_order_direction', 'ASC');
            var folderRes = null;
            if(folderID) {
                let [_myUrl, _fypage] = MY_URL.split('??');
                MY_URL = _myUrl.split('/folder')[0] + '/folder/' + folderID + '??' +_fypage;
                // MY_URL = MY_URL.split('/folder')[0] + '/folder/' + folderID;
                folderRes = JSON.parse(fetch('https://api.aliyundrive.com/adrive/v2/file/get_by_share', {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Share-Token': sharetoken,
                        'x-device-id': drive_id
                    },
                    body: '{"share_id": "'+shareId+'","file_id": "'+folderID+'","fields":"*","image_thumbnail_process":"image/resize,w_400/format,jpeg","image_url_process":"image/resize,w_375/format,jpeg","video_thumbnail_process":"video/snapshot,t_1000,f_jpg,ar_auto,w_375"}',
                    method: 'POST'
                }));
                let folderName = folderRes.name;
                putVar('icy_ali_folder', folderRes.file_id);
                setPageTitle(folderName);

                _data.folder_id = folderID;
                _data.parent_name += ';' +folderName;
            }
            const data = {"share_id": shareId,"parent_file_id": (folderID ? folderID : 'root'),"limit":100,"image_thumbnail_process":"image/resize,w_160/format,jpeg","image_url_process":"image/resize,w_1920/format,jpeg","video_thumbnail_process":"video/snapshot,t_1000,f_jpg,ar_auto,w_300","order_by": order_by,"order_direction": order_direction}
            if(next_marker) {
                data.marker = next_marker;
            }
            if(page > 1 && next_marker && folderRes) {
                data.parent_file_id = folderRes.file_id;
            }
            return fetch('https://api.aliyundrive.com/adrive/v2/file/list_by_share', {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Share-Token': sharetoken,
                    'x-device-id': drive_id
                },
                body: JSON.stringify(data),
                method: 'POST'
            });
        }

        if(!getItem('icy_ali_order_by')) {
            setItem('icy_ali_order_by', 'name');
        }
        if(!getItem('icy_ali_order_direction')) {
            setItem('icy_ali_order_direction', 'ASC');
        }
        var d = [];
        if(page == 1) {
            const searchRule = getItem('icy_ali_searchRule', '青豆');
            let folderName = getVar('folderName', '');

            d.push({
                title: '““””使用小程序：<b><span style="color: '+ this.primaryColor +'">' + searchRule + '</span></b> 搜索  <small><span style="color: #999999">点击设置</span></small>',
                url: $(searchRule, '请输入小程序名称 eq: 青豆')
                    .input(() => {
                    setItem('icy_ali_searchRule', input);
                    refreshPage();
                    return "toast://保存成功";
                }),
                // url: $('hiker://empty').rule(() => {
                //     eval(fetch('hiker://files/rules/icy/ali.js'));
                //     ali.settingPage();
                // }),
                col_type: 'text_1'
            })
            if(searchRule) {
                d.push({
                    title: '搜索',
                    // url: "'hiker://search?s=' + input + '&rule='" + searchRule,
                    url: $.toString((searchRule)=> {
                        if(searchRule) {
                            if(input.trim()) {
                                var link = 'hiker://search?s=' + input + '&rule=' + searchRule;
                                return link;
                            } else {
                                return 'toast://请输入影片名称';
                            }
                        } else {
                            return 'toast://请先设置小程序吧';
                        }
                    }, searchRule),
                    col_type: "input",
                    desc: '使用其他规则搜索影片信息',
                    extra: {
                        defaultValue: folderName,
                    }
                });
            }
            const sortLazy = $(['名称正序', '名称倒序', '时间正序', '时间倒序'], 1)
            .select(() => {
                setItem("icy_ali_order",input);
                if(input.includes('名称')) {
                    setItem('icy_ali_order_by', 'name');
                } else {
                    setItem('icy_ali_order_by', 'updated_at');
                }
                if(input.includes('正序')) {
                    setItem('icy_ali_order_direction', 'ASC');
                } else {
                    setItem('icy_ali_order_direction', 'DESC');
                }
                refreshPage(false);
            });
            var sort = getItem('icy_ali_order', '名称正序');

            d.push({
                title: '⇅' + sort,
                pic_url: this.images.order,
                url: sortLazy,
                col_type: 'text_3'
            })
            // var order_by_arr = [{name: '名称', val: 'name'},{name: '修改时间', val: 'updated_at'}];
            // var order_direction_arr = [{name: '升序', val: 'ASC'},{name: '降序', val: 'DESC'}];
            // this.rendererFilter(d, order_by_arr, 'icy_ali_order_by');
            // this.rendererFilter(d, order_direction_arr, 'icy_ali_order_direction');
            const viewLazy = $(['列表模式', '图文模式', '全文件名模式'], 1)
            .select(() => {
                setItem("icy_ali_view",input);
                refreshPage(false);
                return "hiker://empty"
            });
            var viewName = getItem('icy_ali_view', '列表模式');
            if(!viewName.includes('模式')) {
                viewName = '列表模式';
                setItem("icy_ali_view",'列表模式');
            }
            d.push({
                title: '👀' + viewName,
                pic_url: this.images.view,
                url: viewLazy,
                col_type: 'text_3'
            })
            d.push({
                title: '🎬' + (this.sourcePlay ? '原始文件播放' : '转码播放'),
                pic_url: this.images.source,
                url: $("#noLoading#").lazyRule((sourcePlay)=>{
                    eval(fetch('hiker://files/rules/icy/ali.js'));
                    customerSettings = JSON.parse(fetch(getVar('icy_ali_customer')));
                    customerSettings.sourcePlay = !sourcePlay;
                    writeFile(getVar('icy_ali_customer'), JSON.stringify(customerSettings));
                    refreshPage(false);
                    return "hiker://empty"
                },this.sourcePlay),
                col_type: 'text_3'
            })
            if(typeof saveLink != 'undefined' && !!saveLink) {
                let expiration_text = '';
                if(typeof expiration != 'undefined') {
                    expiration_text = '有效期限：' + (expiration ? getDateDiff(expiration) +'，请尽快保存！' : '永久有效');
                }
                d.push({
                    title: '““””<b>✨✨✨✨<span style="color: '+ this.primaryColor +'">保存到我的阿里云盘</span>✨✨✨✨</b>\n' + "““””<small>"+'<span style="color: #999999">'+expiration_text+'</span></small>',
                    url: saveLink,
                    col_type: "text_center_1"
                });
            }
        }
        var rescod = null;
        try {
            rescod = JSON.parse(getFileList(sharetoken, shareId, folderID, next_marker, drive_id));
        } catch (e){
            confirm({
                title: '出错了',
                content: '获取数据出了点问题, 刷新页面试试！',
                confirm: 'refreshPage()'
            })
        }
        // if((page != 1 && !next_marker) || !rescod) {
        //     setHomeResult({
        //         data: d
        //     });
        //     return 'toast://到底了！';
        // }
        if(rescod.code) {
            if(rescod.code.includes('AccessTokenInvalid')) {
                this.needSharePWD(link);
            } else if(rescod.code.includes('ForbiddenNoPermission')) {
                d.push({
                    title: "““””<center><b>"+'<span style="color: #ff0000">打开的链接有误，请重试</span></b></center>',
                    url: this.emptyRule,
                    col_type: "text_center_1"
                });
                setHomeResult({
                    data: d
                });
                return false;
            } else {
                d.push({
                    title: "““””<center><b>"+'<span style="color: #ff0000">'+rescod.message+'</span></b></center>',
                    url: this.emptyRule,
                    col_type: "text_center_1"
                });
                setHomeResult({
                    data: d
                });
                return false;
            }
        }

        
        if(!!rescod && (!rescod.items || !rescod.items.length)) {
            d.push({
                title: "““””<center><small>"+'<span style="color: #999999">空文件夹</span></small></center>',
                url: this.emptyRule,
                col_type: "text_center_1"
            });
        }
        const col_type = getItem('icy_ali_view', '列表模式') == '列表模式' ? 'avatar' : (getItem('icy_ali_view', '列表模式') == '全文件名模式' ? 'text_1' :'movie_3_marquee');
        // 如果只包含一个文件夹， 直接取内容
        if(rescod.items.length === 1 && rescod.items[0].type == 'folder') {
            const folderItem = rescod.items[0];
            try {

                _data.parent_name += ';' +folderItem.name;
                rescod = JSON.parse(getFileList(sharetoken, shareId, folderItem.file_id, next_marker));
                putVar('icy_ali_folder', folderItem.file_id);
            } catch (e){
                confirm({
                    title: '出错了',
                    content: '获取数据出了点问题, 刷新页面试试！',
                    confirm: 'refreshPage()'
                })
            }
            
        }
        putVar('icy_ali_next_marker', rescod.next_marker || '');

        if(rescod.punished_file_count) {
            d.push({
                title: "““””<center><small>"+'<span style="color: #999999">⚠️ 部分文件由于违规，已封禁</span></small></center>',
                url: this.emptyRule,
                col_type: "text_center_1"
            });
        }

        const fnName = (fileExist(this.urls.tokenPath) == 'true' || fileExist(this.urls.tokenPath) == true || this.usePublicToken) ? 'lazyRule' : 'rule';
        const zimuExtension = ['srt', 'vtt', 'ass', 'ssa'];
        const zimuList = rescod.items.filter(_item => zimuExtension.includes(_item.file_extension));
        rescod.items.forEach((_item, index) => {
            const {type, category, name, file_id, thumbnail, updated_at, size} = _item;
            let title = name;
            let len = 26;
            let len2 = len / 2;
            if(name.length >= len && col_type == 'avatar') {
                title = name.substr(0, len2) + '...'+name.substr(name.length - len2);
            }
            let desc = this.formatDate(updated_at, 'MM/dd HH:mm') + '     ' + this.formatSize(size);
            let pic_url = thumbnail+'#.jpg' + '@headers={"Referer":"https://www.aliyundrive.com/"}' || this.randomPic +'?t='+new Date().getTime() + '' +index;
            let longClick = [{
                title: '下载',
                js: $.toString((shareId,sharetoken,file_id) => {
                    eval(fetch('hiker://files/rules/icy/ali.js'));
                    return 'download://' + ali.get_share_link_download_url(shareId,sharetoken,file_id);
                },shareId,sharetoken,file_id)
            }]
            switch(category || type){
                case 'video':
                    let zimuItemList = null;
                    let videoName = name.split('.'+_item.file_extension)[0];
                    if(zimuList.length) {
                        zimuItemList = zimuList.filter(_zimu => _zimu.name.startsWith(videoName));
                    }
                    let videolazy = '';
                    let _zimuList = (zimuItemList && !!zimuItemList.length) ? zimuItemList : zimuList;

                    if(fnName == 'rule') {
                        videolazy = $('hiker://empty' + file_id).rule(() => {
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            var access_token = ali.getAliToken();
                            return "toast://登录后需要重新刷新页面哦！"
                        })
                    } else if(_zimuList && !!_zimuList.length  && (zimuItemList.length > 1 || !zimuItemList.length)) {
                        videolazy = $(['不需要字幕'].concat(_zimuList.map(_zimu => _zimu.name.replace(videoName, '字幕'))), 1)
                        .select((file_id, shareId, sharetoken, list, videoName, deviceID, drive_id, user_id, device_id) => {
                            showLoading('加载中');
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            var access_token = ali.getAliToken();
                            if(access_token) {
                                let name = input;
                                let zimuItem = null;
                                if(input != '不需要字幕') {
                                    if(name.startsWith('字幕')){
                                        name = name.replace('字幕', videoName);
                                    }
                                    zimuItem = list.find(_zimu => _zimu.name == name);
                                }
                                return ali.videoProxy({file_id:file_id, share_id: shareId, share_token:sharetoken, zimuItem:zimuItem, drive_id:drive_id, user_id:user_id, device_id: device_id});
                            } else {
                                return "toast://登录后需要重新刷新页面哦！"
                            }


                        }, file_id, shareId, sharetoken, _zimuList, videoName, deviceID, drive_id, user_id, device_id);
                    } else {
                        videolazy = $('hiker://empty' + file_id).lazyRule((shareId, sharetoken, file_id, fnName, zimuItemList, deviceID, drive_id, user_id, device_id) => {
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            var access_token = ali.getAliToken();
                            if(access_token) {
                                let zimuItem = null;
                                if(zimuItemList && zimuItemList.length) {
                                    zimuItem = zimuItemList[0]
                                }
                                return ali.videoProxy({file_id:file_id, share_id: shareId, share_token:sharetoken, zimuItem:zimuItem, drive_id:drive_id, user_id:user_id, device_id: device_id});
                            } else {
                                return "toast://登录后需要重新刷新页面哦！"
                            }
                        }, shareId, sharetoken, file_id, fnName, zimuItemList, deviceID, drive_id, user_id, device_id)
                    }
                    d.push({
                        title: '🎬 ' + title,
                        pic_url: pic_url || this.images.video,
                        desc: desc,
                        url: videolazy,
                        extra: {
                            id: shareId + file_id,
                            longClick: longClick
                        },
                        col_type: col_type

                    });
                break;
                case 'image':
                    d.push({
                        title: '🖼 ' + title,
                        desc: desc,
                        pic_url: pic_url || this.images.img,
                        url: $('hiker://empty'+ file_id)[fnName]((shareId, sharetoken, file_id, fnName) => {
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            var access_token = ali.getAliToken();
                            if(access_token) {
                                if(fnName == 'rule') {
                                    back(true);
                                }
                                return ali.lazyAliImage(shareId, sharetoken, file_id);
                            } else {
                                return "toast://登录后需要重新刷新页面哦！"
                            }
                        }, shareId, sharetoken, file_id, fnName),
                        extra: {
                            longClick: longClick
                        },
                        col_type: col_type

                    });
                break;
                case 'folder':
                    d.push({
                        title: '📂 ' + title,
                        desc: desc,
                        pic_url: this.images.folder,
                        url: 'hiker://page/detail?url=https://www.aliyundrive.com/s/'+shareId+'/folder/'+file_id + '?share_pwd='+share_pwd+'#name='+base64Encode(parentName+ ';'+title)+'??fypage',
                        col_type: col_type

                    });
                break;
                case 'audio':
                    d.push({
                        title: '🎻 ' + title,
                        desc: desc,
                        pic_url: pic_url || this.images.audio,
                        url: $('hiker://empty'+ file_id)[fnName]((shareId, sharetoken, file_id, fnName) => {
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            var access_token = ali.getAliToken();
                            if(access_token) {
                                if(fnName == 'rule') {
                                    back(true);
                                }
                                return ali.lazyAliAudio(shareId, sharetoken, file_id);
                            } else {
                                return "toast://登录后需要重新刷新页面哦！"
                            }
                        }, shareId, sharetoken, file_id, fnName),
                        extra: {
                            longClick: longClick
                        },
                        col_type: col_type

                    });
                break;
                default: 
                    pic_url = category == 'doc' ? this.images.book : this.images.unknown;
                    const docLazy = $('hiker://empty'+file_id).lazyRule((shareId, sharetoken, file_id) => {
                        eval(fetch('hiker://files/rules/icy/ali.js'));
                        return ali.get_share_link_download_url(shareId, sharetoken, file_id);
                    }, shareId, sharetoken, file_id);
                    let _title = title;
                    if(category == 'doc') {
                        _title = '📙 ' + title;
                    } else if(zimuExtension.includes(_item.file_extension)) {
                        _title = '🕸️ ' + title;
                        pic_url = this.images.zimu;
                    } else {
                        _title = '❓ ' + title;
                    }
                    d.push({
                        title: _title,
                        pic_url: thumbnail || pic_url,
                        desc: desc,
                        url: category != 'doc' ? 'toast://不支持预览，请长按下载后查看' : $('hiker://empty'+file_id).rule((shareId, sharetoken, file_id) => {
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            ali.lazyAliDoc(shareId, sharetoken, file_id);
                        }, shareId, sharetoken, file_id),
                        extra: {
                            longClick: longClick
                        },
                        col_type: col_type

                    });
            }

        });
        setHomeResult({
            data: d
        });
    },
    myAliRule: function(_d) {
        addListener('onClose', $.toString((params) => {
            params.forEach(item => {
                clearVar(item)
            })
        }, ["folderName", 'icy_ali_next_marker', 'icy_ali_folder', 'icy_ali_searchKey']))
        this.getConfig();
        var access_token = this.getAliToken();
        if(!access_token) {
            return 'toast://还没登录？';
        } else if(access_token.startsWith('toast')) {
            return access_token;
        }

        var d = _d || [];
        const {tokenPath, customerSettingPath} = this.urls
        let _tokens = JSON.parse(readFile(tokenPath) || '[]');
        let tokens = _tokens.length ? _tokens : (_tokens.user_id ? [_tokens] : [] );
        let customerSettings = JSON.parse(fetch(customerSettingPath));
        let token = tokens.find(item => item.user_id == customerSettings.user_id) || tokens[0];
        access_token = token.access_token;
        var drive_id = token.default_drive_id;
        var device_id = token.device_id;
        var user_id = token.user_id;
        var deviceID = token.deviceID;
        if(!drive_id) {
            return 'toast://TOKEN获取失败，重新登录试试'
        }
        var folderID = (MY_URL.includes('$$$') ? MY_URL.split('$$$') : MY_URL.split('??'))[0].split('folder/')[1] || '';
        var page = MY_PAGE || (MY_URL.includes('$$$') ? MY_URL.split('$$$') : MY_URL.split('??'))[1] || 1;
        let searchKey = getVar('icy_ali_searchKey', '');
        if(page == 1) {
            putVar('icy_ali_next_marker', '');
            putVar('icy_ali_folder', '');
        } else {
            folderID = getVar('icy_ali_folder', '')
        }

        var next_marker = getVar('icy_ali_next_marker', '');
        if(page != 1 && !next_marker) {
            setHomeResult({
                data: [{title: "““””<center><small>"+'<span style="color: #999999">～～～我是有底线的～～～</span></small></center>', url: this.emptyRule, col_type: 'text_center_1'}]
            });
            return 'toast://到底了！';
        }
        const getFileList = (access_token, drive_id, folderID, next_marker) => {
            var order_by = getItem('icy_ali_order_by', 'name');
            var order_direction = getItem('icy_ali_order_direction', 'ASC');
            var folderRes = null;
            // if(folderID) {
            //     let [_myUrl, _fypage] = MY_URL.split('??');
            //     MY_URL = _myUrl.split('/folder')[0] + '/folder/' + folderID + '??' +_fypage;
            //     // MY_URL = MY_URL.split('/folder')[0] + '/folder/' + folderID;
            //     folderRes = JSON.parse(fetch('https://api.aliyundrive.com/v2/file/get', {
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'Authorization': access_token,
            //         },
            //         body: '{"share_id": "'+shareId+'","file_id": "'+folderID+'","fields":"*","image_thumbnail_process":"image/resize,w_400/format,jpeg","image_url_process":"image/resize,w_375/format,jpeg","video_thumbnail_process":"video/snapshot,t_1000,f_jpg,ar_auto,w_375"}',
            //         method: 'POST'
            //     }));
            //     let folderName = folderRes.name;
            //     putVar('icy_ali_folder', folderRes.file_id);
            //     setPageTitle(folderName);
            // }
            const data = {
                "drive_id": drive_id,
                "parent_file_id": (folderID ? folderID : 'root'),
                "limit":22300,
                "all": true,
                "url_expire_sec": 86400,
                "image_thumbnail_process": "image/resize,w_400/format,jpeg",
                "image_url_process": "image/resize,w_1920/format,jpeg",
                "video_thumbnail_process": "video/snapshot,t_1000,f_jpg,ar_auto,w_300",
                "order_by": order_by,
                "order_direction": order_direction
            }
            putVar('icy_ali_folder', folderID);
            if(next_marker) {
                data.marker = next_marker;
            }
            // if(page > 1 && next_marker && folderRes) {
            //     data.parent_file_id = folderRes.file_id;
            // }
            return fetch('https://api.aliyundrive.com/adrive/v3/file/list', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': access_token,
                },
                body: JSON.stringify(data),
                method: 'POST'
            });
        }
        const searchFileList = (access_token, drive_id, keyword, next_marker) => {
            var order_by = getItem('icy_ali_order_by', 'name');
            var category = getItem('icy_ali_category', '')
            var order_direction = getItem('icy_ali_order_direction', 'ASC');
            var folderRes = null;
            const data = {
                "drive_id": drive_id,
                "limit":100,
                "image_thumbnail_process": "image/resize,w_400/format,jpeg",
                "image_url_process": "image/resize,w_1920/format,jpeg",
                "video_thumbnail_process": "video/snapshot,t_1000,f_jpg,ar_auto,w_300",
                "query": `name match "`+ keyword +`"`+ category,
                "order_by": order_by+ ' ' + order_direction
            }
            if(next_marker) {
                data.marker = next_marker;
            }
            // if(page > 1 && next_marker && folderRes) {
            //     data.parent_file_id = folderRes.file_id;
            // }
            return fetch('https://api.aliyundrive.com/adrive/v3/file/search', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': access_token,
                    'x-device-id': drive_id
                },
                body: JSON.stringify(data),
                method: 'POST'
            });
        }

        if(!getItem('icy_ali_order_by')) {
            setItem('icy_ali_order_by', 'name');
        }
        if(!getItem('icy_ali_order_direction')) {
            setItem('icy_ali_order_direction', 'ASC');
        }
        if(page == 1) {
            if(!folderID) {
                d.push({
                    title: "<b>当前登录："+'<span style="color: '+ this.primaryColor +'">⭐ '+token.nick_name+'</span></b>',
                    desc: '切换账号',
                    img: token.avatar+'@Referer=https://www.aliyundrive.com/',
                    url: tokens.length > 1 ? $(tokens.map(item => item.nick_name), 2)
                        .select(() => {
                            let _tokens = JSON.parse(readFile(getVar('icy_ali_tokenPath')) || '[]');
                            let tokens = _tokens.length ? _tokens : (_tokens.user_id ? [_tokens] : [] );
                            let token = tokens.find(item => item.nick_name == input);
                            let customerSettings = JSON.parse(fetch(getVar('icy_ali_customer')));
                            customerSettings.user_id = token.user_id;
                            writeFile(getVar('icy_ali_customer'), JSON.stringify(customerSettings));
                            ["folderName", 'icy_ali_next_marker', 'icy_ali_folder'].forEach(item => {
                                clearVar(item)
                            })
                            refreshPage(false);
                            return 'toast://账号切换至：' + token.nick_name;
                    }) : $('hiker://empty').rule((d) => {
                        eval(fetch('hiker://files/rules/icy/ali.js'));
                        ali.aliLogin(d);
                    }, _d),
                    col_type: 'avatar',
                })
            }
            if(!_d) {
                const searchRule = getItem('icy_ali_searchRule', '阿里云盘') || '阿里云盘';
                let folderName = getVar('folderName', '');
                const searchAli = searchRule == '阿里云盘' || !searchRule;
    
                d.push({
                    title: '““””' + (searchAli ? '' : '使用小程序：')+'<b><span style="color: '+ this.primaryColor +'">' + searchRule + '</span></b> 搜索  <small><span style="color: #999999">点击设置</span></small>',
                    url: $(searchRule, '搜索个人云盘或用小程序搜索\neq: 青豆；阿里云盘')
                        .input(() => {
                        setItem('icy_ali_searchRule', input);
                        refreshPage();
                        return "toast://保存成功";
                    }),
                    // url: $('hiker://empty').rule(() => {
                    //     eval(fetch('hiker://files/rules/icy/ali.js'));
                    //     ali.settingPage();
                    // }),
                    col_type: 'text_1'
                })
                d.push({
                    title: '搜索',
                    // url: "'hiker://search?s=' + input + '&rule='" + searchRule,
                    url: $.toString((searchRule, searchAli)=> {
                        if(input.trim()) {
                            if(searchAli) {
                                putVar('icy_ali_searchKey', input.trim());
                                putVar('icy_ali_folder', '');
                                refreshPage();
                            } else {
                                var link = 'hiker://search?s=' + input.trim() + '&rule=' + searchRule;
                                return link;
                            }
                        } else {
                            if(searchAli){
                                clearVar('icy_ali_searchKey');
                                refreshPage();
                                return 'toast://退出搜索';
                            } else {
                                return 'toast://'+ (searchAli ? '请输入关键字' : '请输入影片名称');
                            }
                        }
                    }, searchRule, searchAli),
                    col_type: "input",
                    desc: searchAli ? '搜索网盘内文件,留空则退出搜索模式' : '使用其他规则搜索影片信息',
                    extra: {
                        defaultValue: searchKey,
                    }
                });
                if(searchAli) {
                    ['全部,', '图片, and category = "image"', '视频, and category = "video"', '文件夹, and category = "folder"','文档, and category = "doc"','音频, and category = "audio"'].forEach((item) => {
                        const [_title,value] = item.split(',')
                        var title = value == getItem('icy_ali_category', '') ? "““””<b>"+'<span style="color: '+ this.primaryColor +'">'+_title+'</span></b>' : _title;
                        d.push({
                            title: title,
                            url: $("#noLoading#").lazyRule((value)=>{
                                setItem("icy_ali_category",value);
                                refreshPage(false);
                                return "hiker://empty"
                            },value),
                            col_type: 'scroll_button'
                        })
                    })
                }
            }
            const sortLazy = $(['名称正序', '名称倒序', '时间正序', '时间倒序'], 1)
            .select(() => {
                setItem("icy_ali_order",input);
                if(input.includes('名称')) {
                    setItem('icy_ali_order_by', 'name');
                } else {
                    setItem('icy_ali_order_by', 'updated_at');
                }
                if(input.includes('正序')) {
                    setItem('icy_ali_order_direction', 'ASC');
                } else {
                    setItem('icy_ali_order_direction', 'DESC');
                }
                refreshPage(false);
            });
            var sort = getItem('icy_ali_order', '名称正序');

            d.push({
                title: '⇅' + sort,
                pic_url: this.images.order,
                url: sortLazy,
                col_type: 'text_3'
            })
            // var order_by_arr = [{name: '名称', val: 'name'},{name: '修改时间', val: 'updated_at'}];
            // var order_direction_arr = [{name: '升序', val: 'ASC'},{name: '降序', val: 'DESC'}];
            // this.rendererFilter(d, order_by_arr, 'icy_ali_order_by');
            // this.rendererFilter(d, order_direction_arr, 'icy_ali_order_direction');
            const viewLazy = $(['列表模式', '图文模式', '全文件名模式'], 1)
            .select(() => {
                setItem("icy_ali_view",input);
                refreshPage(false);
                return "hiker://empty"
            });
            var viewName = getItem('icy_ali_view', '列表模式');
            if(!viewName.includes('模式')) {
                viewName = '列表模式';
                setItem("icy_ali_view",'列表模式');
            }
            d.push({
                title: '👀' + viewName,
                pic_url: this.images.view,
                url: viewLazy,
                col_type: 'text_3'
            })
            d.push({
                title: '🎬' + (this.sourcePlay ? '原始文件播放' : '转码播放'),
                pic_url: this.images.source,
                url: $("#noLoading#").lazyRule((sourcePlay)=>{
                    eval(fetch('hiker://files/rules/icy/ali.js'));
                    customerSettings = JSON.parse(fetch(getVar('icy_ali_customer')));
                    customerSettings.sourcePlay = !sourcePlay;
                    writeFile(getVar('icy_ali_customer'), JSON.stringify(customerSettings));
                    refreshPage(false);
                    return "hiker://empty"
                },this.sourcePlay),
                col_type: 'text_3'
            })
        }

        var rescod = null;
        try {
            if(searchKey) {
                rescod = JSON.parse(searchFileList(access_token, drive_id, searchKey, next_marker));
            } else {
                rescod = JSON.parse(getFileList(access_token, drive_id, folderID, next_marker));
            }
        } catch (e){
            confirm({
                title: '出错了',
                content: '获取数据出了点问题, 刷新页面试试！',
                confirm: 'refreshPage()'
            })
        }
        // if((page != 1 && !next_marker) || !rescod) {
        //     setHomeResult({
        //         data: d
        //     });
        //     return 'toast://到底了！';
        // }
        if(rescod.code) {
            if(rescod.code == 'AccessTokenInvalid') {
                this.getAliToken(true);
                refreshPage();
            }
            d.push({
                title: "““””<center><b>"+'<span style="color: #ff0000">'+rescod.message+'</span></b></center>',
                url: this.emptyRule,
                col_type: "text_center_1"
            });
            setHomeResult({
                data: d
            });
            return false;
        }

        
        if(!!rescod && (!rescod.items || !rescod.items.length)) {
            d.push({
                title: "““””<center><small>"+'<span style="color: #999999">空文件夹</span></small></center>',
                url: this.emptyRule,
                col_type: "text_center_1"
            });
        }
        const col_type = getItem('icy_ali_view', '列表模式') == '列表模式' ? 'avatar' : (getItem('icy_ali_view', '列表模式') == '全文件名模式' ? 'text_1' :'movie_3_marquee');
        // 如果只包含一个文件夹， 直接取内容
        // if(rescod.items.length === 1 && rescod.items[0].type == 'folder') {
        //     const folderItem = rescod.items[0];
        //     try {
        //         rescod = JSON.parse(getFileList(sharetoken, shareId, folderItem.file_id, next_marker));
        //         putVar('icy_ali_folder', folderItem.file_id);
        //     } catch (e){
        //         confirm({
        //             title: '出错了',
        //             content: '获取数据出了点问题, 刷新页面试试！',
        //             confirm: 'refreshPage()'
        //         })
        //     }
            
        // }
        putVar('icy_ali_next_marker', rescod.next_marker || '');

        if(rescod.punished_file_count) {
            d.push({
                title: "““””<center><small>"+'<span style="color: #999999">⚠️ 部分文件由于违规，已封禁</span></small></center>',
                url: this.emptyRule,
                col_type: "text_center_1"
            });
        }

        
        const fnName = (fileExist(this.urls.tokenPath) == 'true' || fileExist(this.urls.tokenPath) == true || this.usePublicToken) ? 'lazyRule' : 'rule';
        const zimuExtension = ['srt', 'vtt', 'ass'];
        const zimuList = rescod.items.filter(_item => zimuExtension.includes(_item.file_extension));
        rescod.items.forEach((_item, index) => {
            const {type, category, name, file_id, thumbnail, updated_at, url, size} = _item;
            let title = name;
            let len = 26;
            let len2 = len / 2;
            if(name.length >= len && col_type == 'avatar') {
                title = name.substr(0, len2) + '...'+name.substr(name.length - len2);
            }
            let desc = this.formatDate(updated_at, 'MM/dd HH:mm') + '     ' + this.formatSize(size);
            let pic_url = thumbnail+'#.jpg' + '@headers={"Referer":"https://www.aliyundrive.com/"}';
            
            let longClick = [{
                title: '下载',
                js: $.toString((_download,drive_id ,file_id) => {
                    if(_download) {
                        return 'download://' + _download
                    } else {
                        eval(fetch('hiker://files/rules/icy/ali.js'));
                        return 'download://' + ali.get_download_url(drive_id ,file_id);
                    }
                    
                }, url ,drive_id ,file_id)
            }]
            switch(category || type){
                case 'video':
                    let zimuItemList = null;
                    let videoName = name.split('.'+_item.file_extension)[0];
                    if(zimuList.length) {
                        zimuItemList = zimuList.filter(_zimu => _zimu.name.startsWith(videoName));
                    }
                    let videolazy = '';
                    let _zimuList = (zimuItemList && zimuItemList.length) ? zimuItemList : zimuList;

                    if(fnName == 'rule') {
                        videolazy = $('hiker://empty' + file_id).rule(() => {
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            var access_token = ali.getAliToken();
                            return "toast://登录后需要重新刷新页面哦！"
                        })
                    } else if(_zimuList  && !!_zimuList.length && (zimuItemList.length > 1 || !zimuItemList.length)) {
                        videolazy = $(['不需要字幕'].concat(_zimuList.map(_zimu => _zimu.name.replace(videoName, '字幕'))), 1)
                        .select((file_id, drive_id, list, videoName, deviceID, url) => {
                            // showLoading('加载中');
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            var access_token = ali.getAliToken();
                            if(access_token) {
                                let name = input;
                                let zimuItem = null;
                                if(input != '不需要字幕') {
                                    if(name.startsWith('字幕')){
                                        name = name.replace('字幕', videoName);
                                    }
                                    zimuItem = list.find(_zimu => _zimu.name == name);
                                }
                                return $('hiker://empty' + file_id).lazyRule((file_id , zimuItem, drive_id, deviceID, url) => {
                                    eval(fetch('hiker://files/rules/icy/ali.js'));
                                    return ali.videoProxy({file_id:file_id, zimuItem: zimuItem, drive_id: drive_id, deviceID: deviceID, download_url: url});
                                },file_id , zimuItem, drive_id, deviceID, url)
                            } else {
                                return "toast://登录后需要重新刷新页面哦！"
                            }

                        }, file_id, drive_id, _zimuList, videoName, deviceID, url);
                    } else {
                        videolazy = $('hiker://empty' + file_id).lazyRule((drive_id, file_id, fnName, zimuItemList, deviceID, url) => {
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            var access_token = ali.getAliToken();
                            if(access_token) {
                                let zimuItem = null;
                                if(zimuItemList && zimuItemList.length) {
                                    zimuItem = zimuItemList[0]
                                }
                                return ali.videoProxy({file_id:file_id, zimuItem: zimuItem, drive_id: drive_id, deviceID: deviceID, download_url: url});
                            } else {
                                return "toast://登录后需要重新刷新页面哦！"
                            }
                        }, drive_id, file_id, fnName, zimuItemList, deviceID, url)
                    }
                    d.push({
                        title: '🎬 ' + title,
                        pic_url: pic_url || this.images.video,
                        desc: desc,
                        url: videolazy,
                        extra: {
                            id: drive_id + file_id,
                            longClick: longClick
                        },
                        col_type: col_type

                    });
                break;
                case 'image':
                    d.push({
                        title: '🖼 ' + title,
                        desc: desc,
                        pic_url: pic_url || this.images.img,
                        url: pic_url,
                        extra: {
                            longClick: longClick
                        },
                        col_type: col_type

                    });
                break;
                case 'folder':
                    d.push({
                        title: '📂 ' + title,
                        desc: desc,
                        pic_url: this.images.folder,
                        url: 'hiker://page/drive?url=https://www.aliyundrive.com/drive/folder/'+file_id + '??fypage',
                        col_type: col_type

                    });
                break;
                case 'audio':
                    d.push({
                        title: '🎻 ' + title,
                        desc: desc,
                        pic_url: pic_url || this.images.audio,
                        url: $('hiker://empty'+ file_id)[fnName]((drive_id, file_id, fnName) => {
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            var access_token = ali.getAliToken();
                            if(access_token) {
                                if(fnName == 'rule') {
                                    back(true);
                                }
                                return ali.lazyAliAudio('', '', file_id, drive_id);
                            } else {
                                return "toast://登录后需要重新刷新页面哦！"
                            }
                        }, drive_id, file_id, fnName),
                        extra: {
                            longClick: longClick
                        },
                        col_type: col_type

                    });
                break;
                default: 
                    pic_url = category == 'doc' ? this.images.book : this.images.unknown;
                    let _title = title;
                    if(category == 'doc') {
                        _title = '📙 ' + title;
                    } else if(zimuExtension.includes(_item.file_extension)) {
                        _title = '🕸️ ' + title;
                        pic_url = this.images.zimu;
                    } else {
                        _title = '❓ ' + title;
                    }
                    d.push({
                        title: _title,
                        pic_url: thumbnail || pic_url,
                        desc: desc,
                        url: category != 'doc' ? 'toast://不支持预览，请长按下载后查看' : $('hiker://empty'+file_id).rule((drive_id, file_id) => {
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            ali.lazyAliDoc('', '', file_id, drive_id);
                        }, drive_id, file_id),
                        extra: {
                            longClick: longClick
                        },
                        col_type: col_type

                    });
            }

        });
        if(!_d) {
            setHomeResult({
                data: d
            });
        }
    },
    needSharePWD: function(link) {
        var d = [];
        d.push({
            url: $('').input((link)=> {
                if(input.trim()) {
                    return 'hiker://page/detail?url=' + link + '?share_pwd=' + input + '??fypage';
                } else {
                    return 'toast://请输入提取码';
                }
            }, link),
            title: '““””🔑 <b><span style="color: '+ this.primaryColor +'">请输入提取码</span></b>',
            col_type: "text_1"
        })
        setHomeResult({
            data: d
        });
    },
    // 匹配 dataType = json的模式
    homeDataJSON: function(d) {

        const activeModel = this.activeModel();
        const {val, homeDataPath, key, method, postUrl, postData} = activeModel;
        var page = Number(MY_URL.split('$$$')[1]);
        
        try {
            
            const [listPath, , , ] = homeDataPath.split(';')
            const {fyarea, fyclass, fyyear, fysort} = this.getFilter();
            let url = val.replace('fyarea', fyarea).replace('fyclass', fyclass).replace('fyyear', fyyear).replace('fysort', fysort).replace('fypage', page);
            if(key == 'ujuso') {
                let kid = getVar('ujuso', '') || getItem('ujuso', '');
                if(kid) {
                    url = url.replace(/kid=([\w|\d]*)&/, 'kid='+getVar('ujuso', '')+'&');
                    setItem('ujuso', kid);
                }
            }
            let result = '';
            if(method && method == 'POST') {
                let data = postData.replace('**', '最新').replace('fyarea', fyarea).replace('fyclass', fyclass).replace('fyyear', fyyear).replace('fysort', fysort).replace('fypage', page);
                
                result = fetch(postUrl, {
                    headers: {
                        "Content-Type": "application/json",
                        "User-Agent": MOBILE_UA,
                        "Referer": url,
                    },
                    method: 'POST',
                    body: JSON.parse(data),
                });
            } else {
                result = fetch(url);
            }
            if(key == 'upsou') {
                result = base64Decode(result);

            }
            const items = this.objData(JSON.parse(result), listPath);
            this.listPageJSON(items, homeDataPath, d, activeModel, page);
        } catch(e) {
            if(page == 1) {
                if(key == 'ujuso') {
                    d.push({
                        title: '需要验证才能继续',
                        desc: '点击去网站验证后返回试试吧',
                        url: $('hiker://empty').rule(() => {
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            ali.pageVerify();
                        }),
                        col_type: 'text_1'
                    })
                } else {
                    d.push({
                        title: '页面失联了💔',
                        desc: '点击访问原始网页',
                        col_type: "text_1",
                        url: 'web://' + val,
                    });
                    log(JSON.stringify(e))
                }
            }
        }
    },
    pageVerify: function(){
        let d = [];
        let url = 'https://old.ujuso.com/#/main/search?q=%E5%BD%B1%E8%A7%86';
        var js = $.toString(()=> {
            var tip = false;
            var token_timer= function(){
                setTimeout(()=>{
                    var verify = document.querySelector('.recaptcha');
                    var kid = JSON.parse(localStorage.getItem('kid'));
                    if(
                        !verify && kid
                    ){
                        fy_bridge_app.putVar('ujuso', kid);
                        if(!tip) {
                            alert('验证码刷新成功，退出该页面后刷新重试！');
                            tip = true;
                            fy_bridge_app.back();
                        }
                    }else{
                        token_timer();
                    }},3000)
            };
            token_timer();

        })
        d.push({
            url: url,
            col_type: 'x5_webview_single',
            desc: '100%&&float',
            extra: {
                canBack: true,
                js: js
            }
        })
        setHomeResult({
            data: d
        })
    },
    searchJSON: function(activeModel, fromHikerSearch, keyword, page, d) {
        try {
            const {searchUrl, searchDataPath, key, val, method, postUrl, postData} = activeModel;
            const [listPath, , , ] = searchDataPath.split(';')
            const {fyarea, fyclass, fyyear, fysort} = this.getFilter(true);
            let url = searchUrl.replace('**', keyword).replace('fyarea', fyarea).replace('fyclass', fyclass).replace('fyyear', fyyear).replace('fysort', fysort).replace('fypage', page);
            if(key == 'ujuso') {
                let kid = getVar('ujuso', '') || getItem('ujuso', '');
                if(kid) {
                    url = url.replace(/kid=([\w|\d]*)&/, 'kid='+getVar('ujuso', '')+'&');
                    setItem('ujuso', kid);
                }
            }
            let result = '';
            if(method && method == 'POST') {
                let data = postData.replace('**', keyword).replace('fyarea', fyarea).replace('fyclass', fyclass).replace('fyyear', fyyear).replace('fysort', fysort).replace('fypage', page);
                result = fetch(postUrl, {
                    headers: {
                        "Content-Type": "application/json",
                        "User-Agent": MOBILE_UA,
                        "Referer": url,
                    },
                    method: 'POST',
                    body: JSON.parse(data),
                });
            } else {
                result = fetch(url);
            }
            if(key == 'upsou') {
                result = base64Decode(result);
            }
            const items = this.objData(JSON.parse(result), listPath);
            this.listPageJSON(items, searchDataPath, d, activeModel, page, keyword, fromHikerSearch);
        } catch(e) {
            if(page == 1) {
                if(key == 'ujuso') {
                    d.push({
                        title: '可能需要验证',
                        url: $('hiker://empty').rule(() => {
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            ali.pageVerify();
                        }),
                        col_type: 'text_1'
                    })
                } else {
                    d.push({
                        title: '页面失联了💔',
                        desc: '点击访问原始网页',
                        col_type: "text_1",
                        url: 'web://' + val,
                    });
                    log(JSON.stringify(e))
                }
            }
        }
    },
    listPageJSON: function(items, dataPath, d, activeModel, page, keyword, fromHikerSearch) {
        const {name, detailLinkPre, key, itemsExcloudByLink} = activeModel;
        const [, titlePath, linkPath, descPath] = dataPath.split(';')
        if(!!items && !!items.length) {
            items.forEach((dataitem) => {
                let title = this.objData(dataitem, titlePath) || '';
                let _link = this.objData(dataitem, linkPath) || '';
                let link = (detailLinkPre || '') + _link;
                if(itemsExcloudByLink && itemsExcloudByLink !== '') {
                    if(new RegExp(itemsExcloudByLink).test(_link) && !_link.startsWith('https://www.aliyundrive.com/s/')) {
                        return false;
                    }
                }
                const desc = this.objData(dataitem, descPath) || '';
                const contentDome = '<div class="fortext">' + desc || '' + '</div>';
                const pic = parseDomForHtml(contentDome, '.fortext&&img&&src') || '';
                const descStr = parseDomForHtml(contentDome, '.fortext&&Text');
                title = this.getEmptyTitle(title, descStr);
                const isShareLink = link.startsWith('https://www.aliyundrive.com/s/');
                let lazy = $(link).rule((title, link, desc) => {
                    var d = [];
                    eval(fetch('hiker://files/rules/icy/ali.js'));
                    ali.detailDataJSON(title, link , desc, d);
                    setHomeResult({
                        data: d
                    })
                }, title, link, desc)
                if(key == 'upsou') {
                    if(dataitem && dataitem.id == '-1') {
                        return false
                    }
                //     link = link.replace('download.html?url=', 'download?url=');
                //     lazy = $(link).lazyRule(() => {
                //         let result = fetch(input, {
                //             headers: {
                //                 'Referer': 'https://upyunso.com/',
                //                 'Origin': 'https://upyunso.com',
                //                 'User-Agent': MOBILE_UA
                //             },
                //         });
                //         result = JSON.parse(base64Decode(result));
                //         const isShareLink = result.result.res_url.startsWith('https://www.aliyundrive.com/s/');
                //         return isShareLink ? 'hiker://page/detail?url=' + result.result.res_url + '??fypage' : result.result.res_url
                //     })
                }
                d.push({
                    title: title,
                    pic_url: pic,
                    desc: fromHikerSearch ? name : descStr,
                    content: descStr,
                    url: isShareLink ? 'hiker://page/detail?url=' + link + '??fypage' : lazy,
                    col_type: pic ? "movie_1_left_pic" : 'text_1'
                })
            })
        } else if(page == 1) {
            this.rendererEmpty(d, keyword, fromHikerSearch);
        }
    },
    detailDataJSON: function(title, realLink, contentHtml, d) {
        d.push({
            title: "““””<b>"+'<span style="color: '+ this.primaryColor +'">'+title+'</span></b>\n' + "““””<small>"+'<span style="color: #999999">请点击下面资源链接访问，\n如果有误请点这里查看帖子内容或原始页面！</span></small>',
            url: realLink,
            col_type: "text_1"
        });
        const contentDome = '<div class="fortext">' + contentHtml || '' + '</div>';
        const texts = parseDomForHtml(contentDome, '.fortext&&Text');

        const _links = texts.match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net|pan\.quark\.cn\/s)\/\w*/g) || [];
        const codes = texts.split(/(?:https:\/\/www\.aliyundrive\.com\/s[\/\w*]*)|(?:https:\/\/alywp\.net[\/\w*]*)|(?:https:\/\/pan\.quark\.cn\/s[\/\w*]*)/ig) || [];
        _links.forEach((link, index) => {
            let code = '';
            let item_title = '🔗 ' + (_links.length > 1 ? '链接'+(index+1)+'：' : '链接：');
            let isquark = link.includes('pan.quark.cn');
            if(codes[index]) {
                const code_match = codes[index].match(/提取码|访问码/);
                if(code_match && code_match[0]) {
                    code = codes[index].split(/提取码|访问码/)[1].match(/[a-zA-z0-9]+/)[0];
                }
                item_title = this.getEmptyTitle('', codes[index]) || item_title || _title;
            }
            d.push({
                // title: '🔗 ' + (_links.length > 1 ? '链接'+(index+1)+'：' : '')  + link + (code ? '  提取码：' + code : ''),
                title: '““””' + item_title + '\n<small><span style="color: #999999">'+link + (code ? '  提取码：' + code : '')+'</span></small>',
                url: isquark ? 'qklink://www.uc.cn/b20b84fd735a8dd3f7541129bacc4e9a?action=open_url&url=' + link : 'hiker://page/detail?url=' + link + (code ? '?share_pwd=' + code: '') + '??fypage',
                col_type: "text_1"
            });
        })
        if(!_links.length && !contentDome.match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net|pan\.quark\.cn\/s)\/\w*/g)) {
            d.push({
                title: '““””<small><span style="color: #999999">没有匹配到链接？点击查看原网页内容！</span></small>',
                url: realLink,
                col_type: "text_1"
            });
        }
        d.push({
            col_type: "line_blank"
        });
        d.push({
            title: '✨ 帖子内容',
            url: this.emptyRule,
            col_type: "text_1"
        });
        d.push({
            title: contentHtml.replace(/href="https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)(\/|\w|\d)*/ig, function(e,t) {
                return 'href="hiker://page/detail?url=' + e.split('href="')[1];
            }).replace(/href="https:\/\/(pan\.quark\.cn\/s)(\/|\w|\d)*/ig, function(e,t) {
                return 'href="qklink://www.uc.cn/b20b84fd735a8dd3f7541129bacc4e9a?action=open_url&url=' + e.split('href="')[1];
            }),
            col_type: "rich_text"
        })
    },
    // 匹配 dataType = html的模式
    homeDataHTML: function(d) {
        let activeModel = this.activeModel();
        const {val, homeDataPath, needcookie, key} = activeModel;
        var page = Number(MY_URL.split('$$$')[1]);
        
        try {
            const [listPath, , , ] = homeDataPath.split(';')
            const {fyarea, fyclass, fyyear, fysort} = this.getFilter();
            let dom = '';
            let cookie = getVar(key, '');
            let url = val.replace('fyarea', fyarea).replace('fyclass', fyclass).replace('fyyear', fyyear).replace('fysort', fysort).replace('fypage', page);

            if(!!needcookie && !cookie) {
                const pageResult = JSON.parse(fetch(url, {
                    headers: {'User-Agent': MOBILE_UA,},
                    withHeaders: true
                }));
                cookie = pageResult.headers['set-cookie'].join(';');
                dom = fetch(url, {
                    headers: {
                        "User-Agent": MOBILE_UA,
                        "cookie": cookie,
                    }
                })

            } else {
                dom = fetch(url, {
                    headers: {
                        "User-Agent": MOBILE_UA,
                        "cookie": cookie,
                    }
                })
            }
            const items = parseDomForArray(dom, listPath);
            if(!!needcookie && cookie) {
                if(items.length) {
                    putVar(key, cookie)
                }
            }
            this.listPageHTML(items, homeDataPath, d, page, activeModel);
        } catch(e) {
            if(page == 1) {
                d.push({
                    title: '页面失联了💔',
                    desc: '点击访问原始网页',
                    col_type: "text_1",
                    url: 'web://' + val,
                });
                log(JSON.stringify(e))
            }
        }
    },
    searchHTML: function(activeModel, fromHikerSearch, keyword, page, d) {
        try {
            const {searchUrl, searchDataPath , homeDataPath, val, key, needcookie} = activeModel;
            const _path = searchDataPath || homeDataPath;
            const [listPath, , , ] = _path.split(';');
            const {fyarea, fyclass, fyyear, fysort} = this.getFilter(true);
            let dom = '';
            let cookie = getVar(key, '');
            let url = searchUrl.replace('**', keyword).replace('fyarea', fyarea).replace('fyclass', fyclass).replace('fyyear', fyyear).replace('fysort', fysort).replace('fypage', page);

            if(!!needcookie && !cookie) {
                const pageResult = JSON.parse(fetch(url, {
                    headers: {'User-Agent': MOBILE_UA,},
                    withHeaders: true
                }));
                cookie = pageResult.headers['set-cookie'].join(';');
                dom = fetch(url, {
                    headers: {
                        "User-Agent": MOBILE_UA,
                        "cookie": cookie,
                    }
                })

            } else {
                dom = fetch(url, {
                    headers: {
                        "User-Agent": MOBILE_UA,
                        "cookie": cookie,
                    }
                })
            }
            const items = parseDomForArray(dom, listPath);
            if(!!needcookie && cookie) {
                if(items.length) {
                    putVar(key, cookie)
                }
            }
            this.listPageHTML(items, _path, d, page, activeModel, keyword, fromHikerSearch);
        } catch(e) {
            if(page == 1) {
                d.push({
                    title: '页面失联了💔',
                    desc: '点击访问原始网页',
                    col_type: "text_1",
                    url: 'web://' + val,
                });
                log(JSON.stringify(e))
            }
        }
    },
    listPageHTML: function(items, dataPath, d, page, activeModel, keyword, fromHikerSearch) {
        const {name, detailLinkPre, itemsExcloudByLink, detailPath, key, needcookie} = activeModel;
        const [, titlePath, linkPath, descPath] = dataPath.split(';')
        if(items && items.length) {
            items.forEach((dataitem) => {
                const title = parseDomForHtml(dataitem, titlePath);
                const _link = parseDomForHtml(dataitem, linkPath);
                let link = detailLinkPre + _link;
                if(key == 'pansou') {
                    link = link.replace('/s/', '/cv/')
                }
                if(itemsExcloudByLink) {
                    if(new RegExp(itemsExcloudByLink).test(_link) && !_link.startsWith('https://www.aliyundrive.com/s/')) {
                        return false;
                    }
                }
                let descArr = []
                descPath.split('+').forEach(_p => {
                    descArr.push(parseDomForHtml(dataitem, _p) || '')
                })
                let desc = descArr.join('\n');
                const contentDome = '<div class="fortext">' + desc || '' + '</div>';
                const pic = parseDomForHtml(contentDome, '.fortext&&img&&src') || '';
                var lazy = $('').lazyRule(() => {
                    const res = JSON.parse(fetch(input, {
                        headers: {'User-Agent': MOBILE_UA, 'Referer': input},
                        withHeaders: true
                    }));
                    var link = '';
                    if(res.url && res.url.match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)\/\w*/g)) {
                        link = res.url
                    } else {
                        let _link = parseDomForHtml(res.body, 'a&&href').match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)\/\w*/g);
                        if(!_link) {
                            _link = res.body.match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)\/\w*/g);
                        }
                        link = _link ? _link[0] : '';
                    }
                    if(link) {
                        return 'hiker://page/detail?url=' + link + '??fypage';
                    } else {
                        return "toast://好像出错了！"
                    }
                })
                if(key == 'qianfan') {
                    lazy = $('').lazyRule(() => {
                        const res = JSON.parse(fetch(input, {
                            headers: {'User-Agent': MOBILE_UA, 'Referer': input},
                            withHeaders: true
                        }));
                        let url = parseDomForHtml(res.body, ".item-detail-info&&.pan-url&&data-url");
                        let flag = parseDomForHtml(res.body, ".item-detail-info&&.pan-url&&id");
                        let folder = parseDomForHtml(res.body, ".item-detail-info&&.pan-url&&data-parent-id");
                        for (let obj of flag) {
                            if (isNaN(parseInt(obj))) {
                                let flagNum = parseInt(obj, 16);
                                url = url.substring(0, flagNum) + url.substring(flagNum + 1, flagNum + 10000)
                            }
                        }
                        url = base64Decode(url);
                        if(folder) {
                            url += '/folder/' + folder;
                        }
                        let _links = url.match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)(\/\w*)*/g) || [];
                        if (_links.length > 0){
                            return 'hiker://page/detail?url=' + _links[0] + '??fypage';
                        } else {
                            return "toast://好像出错了！"
                        }
                    })
                }
                if(!!detailPath) {
                    lazy = $('').rule((_title, _detailPath, key, needcookie) => {
                        let _url = MY_URL;
                        let title = _title;                        
                        let detailPath = _detailPath;
                        if(MY_URL.includes('??')) {
                            [_url, title,detailPath,] = MY_URL.split('??');
                        }
                        let dom = '';
                        let cookie = getVar(key, '');

                        if(!!needcookie && !cookie) {
                            const pageResult = JSON.parse(fetch(_url, {
                                headers: {'User-Agent': MOBILE_UA,},
                                withHeaders: true
                            }));
                            cookie = pageResult.headers['set-cookie'].join(';');
                            dom = fetch(_url, {
                                headers: {
                                    "User-Agent": MOBILE_UA,
                                    "cookie": cookie,
                                }
                            })

                        } else {
                            dom = fetch(_url, {
                                headers: {
                                    "User-Agent": MOBILE_UA,
                                    "cookie": cookie,
                                }
                            })
                        }
                        const content = parseDomForHtml(dom, detailPath).split('<div class="card-body">')[0].replace(/<style.*\/style>/g, '').replace(/<script.*\/script>/g, '').replace(/\s*fr\s*om\s*w\s*ww\.yun\s*pan\s*zi\s*yuan\.co\s*m/g, '');
                        var d = [];
                        if(!!needcookie && cookie) {
                            if(content) {
                                putVar(key, cookie)
                            }
                        }
                        eval(fetch('hiker://files/rules/icy/ali.js'));
                        ali.detailPageHTML(title, _url, content, d);
                        setHomeResult({data: d});
                    }, title, detailPath, key, needcookie)
                }
                if(title) {
                    d.push({
                        title: title,
                        pic_url: pic,
                        url: link + lazy,
                        content: desc,
                        desc:  fromHikerSearch ? name : desc,
                        col_type: pic ? "movie_1_left_pic" : 'text_1'
                    })
                }
            })
        } else if(page == 1) {
            this.rendererEmpty(d, keyword, fromHikerSearch);
        }
    },
    // 详细页面数据
    detailPageHTML: function(title, link, contentHtml,d) {
        setPageTitle(title);
        d.push({
            title: "““””<b>"+'<span style="color: '+ this.primaryColor +'">'+title+'</span></b>\n' + "““””<small>"+'<span style="color: #999999">请点击下面资源链接访问，\n如果有误请点这里查看帖子内容或原始页面！</span></small>',
            url: link,
            col_type: "text_1"
        });
        const contentDome = '<div class="fortext">' + contentHtml || '' + '</div>';
        const texts = parseDomForHtml(contentDome, '.fortext&&Text');

        const _links = texts.match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net|pan\.quark\.cn\/s)\/\w*/g) || contentDome.match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net|pan\.quark\.cn\/s)\/\w*/g) || [];
        const codes = texts.split(/(?:https:\/\/www\.aliyundrive\.com\/s[\/\w*]*)|(?:https:\/\/alywp\.net[\/\w*]*)|(?:https:\/\/pan\.quark\.cn\/s[\/\w*]*)/ig) || [];
        _links.forEach((link, index) => {
            let code = '';
            let item_title = '🔗 ' + (_links.length > 1 ? '链接'+(index+1)+'：' : '链接：');
            if(codes[index]) {
                const code_match = codes[index].match(/提取码|访问码/);
                if(code_match && code_match[0]) {
                    code = codes[index].split(/提取码|访问码/)[1].match(/[a-zA-z0-9]+/)[0];
                }
                item_title = this.getEmptyTitle('', codes[index]) || item_title || title;
            }
            d.push({
                // title: '🔗 ' + (_links.length > 1 ? '链接'+(index+1)+'：' : '')  + link + (code ? '  提取码：' + code : ''),
                title: '““””' + item_title + '\n<small><span style="color: #999999">'+link + (code ? '  提取码：' + code : '')+'</span></small>',
                url: 'hiker://page/detail?url=' + link + (code ? '?share_pwd=' + code: '') + '??fypage',
                col_type: "text_1"
            });
        })
        if(!_links.length && !contentDome.match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net|pan\.quark\.cn\/s)\/\w*/g)) {
            d.push({
                title: '““””<small><span style="color: #999999">没有匹配到链接？点击查看原网页内容！</span></small>',
                url: link,
                col_type: "text_1"
            });
        }
        d.push({
            col_type: "line_blank"
        });
        d.push({
            title: '✨ 帖子内容',
            url: this.emptyRule,
            col_type: "text_1"
        });
        d.push({
            title: contentHtml.replace(/href="https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)(\/|\w|\d)*/ig, function(e,t) {
                return 'href="hiker://page/detail?url=' + e.split('href="')[1] + '??fypage';
            }).replace(/href="https:\/\/(pan\.quark\.cn\/s)(\/|\w|\d)*/ig, function(e,t) {
                return 'href="qklink://www.uc.cn/b20b84fd735a8dd3f7541129bacc4e9a?action=open_url&url=' + e.split('href="')[1];
            }),
            col_type: "rich_text"
        })
    },
    // onedriver  R酱
    homeDataR: function(d) {
        const {val} = this.activeModel();
        var page = Number(MY_URL.split('$$$')[1]);
        try {
            const {code, data} = JSON.parse(fetch(val.replace('fypage', (page - 1) *50)));
            if(code == 22300 && data && data.length) {
                data.forEach((_item) => {
                    const {title, id, add_at, size} = _item;
                    d.push({
                        title: title,
                        url: $('https://share-api.rhilip.info/items/'+id).rule(() => {
                            const _play = JSON.parse(fetch(MY_URL, {
                                headers: {
                                    'User-Agent': MOBILE_UA,
                                },
                            }));
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            ali.lazyOneDriver(_play.data.raw_link);
                        }),
                        desc:  '添加时间：'+this.formatDate(add_at)+'  大小：'+ this.formatBytes(size),
                        col_type: 'text_1'
                    })
                })
            } else {
                this.rendererEmpty(d);
            }
        } catch(e) {}
    },
    searchR: function(activeModel, fromHikerSearch, keyword, page, d) {
        try {
            const {name, searchUrl} = activeModel;
            const {code, data} = JSON.parse(fetch(searchUrl.replace('**', keyword).replace('fypage', (page - 1) *50)));
            if(code == 22300 && data && data.length) {
                data.forEach((_item) => {
                    const {title, id, add_at, size} = _item;
                    const desc = '添加时间：'+this.formatDate(add_at)+'  大小：'+ this.formatBytes(size);
                    d.push({
                        title: title,
                        url: $('https://share-api.rhilip.info/items/'+id).rule(() => {
                            const _play = JSON.parse(fetch(MY_URL, {
                                headers: {
                                    'User-Agent': MOBILE_UA,
                                },
                            }));
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            ali.lazyOneDriver(_play.data.raw_link);
                        }),
                        content: desc,
                        desc:  fromHikerSearch ? name : desc,
                        col_type: 'text_1'
                    })
                })
            } else {
                this.rendererEmpty(d, keyword, fromHikerSearch);
            }
        } catch(e) {}
    },
}
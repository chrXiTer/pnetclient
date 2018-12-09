var util = {
    htmlEncode:function (html: string){
        var temp = document.createElement ("div");
        (temp.textContent != undefined ) ? (temp.textContent = html) : (temp.innerText = html);
        var output = temp.innerHTML;
        return output;
    },
    htmlDecode:function (text: string){
        var temp = document.createElement("div");
        temp.innerHTML = text;
        var output = temp.innerText || temp.textContent;
        return output;
    },
    getIpsFromStr:function(str: string){
        let ip = /(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}/g;
        let hosts = str.match(ip) || []
        return hosts
    }
};

export default util
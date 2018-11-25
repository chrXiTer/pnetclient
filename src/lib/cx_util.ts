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
    }
};

export default util
// ==UserScript==
// @name         美剧天堂：一键复制所有下载链接
// @namespace    https://github.com/patsoncy/mjtt
// @version      0.1.0
// @description  shows how to use babel compiler
// @author       patsoncy
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser-polyfill.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser.min.js
// @match        http://www.meijutt.com/content/*
// @grant        GM_setClipboard
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
    /* jshint ignore:end */
    /* jshint esnext:true */

    const downloadBlockSelector = 'div.o_list_cn_r',
    	  checkboxSelector      = 'input[type=checkbox]';

    class MJTT {
    	constructor(){
    		this.nodes = [];
    	}

    	init(){
    		let self = this,
    		    downloadBlock = [].slice.apply(document.querySelectorAll(downloadBlockSelector));

    		self.nodes = downloadBlock.map((block,index) => {
                let checkboxs = [].slice.apply(block.querySelectorAll(checkboxSelector));
    			return {
                    firstLineDesc : block.querySelector(`#s${index}p0`).innerHTML,
                    downloadLinks : self.uniq(checkboxs.map((checkbox) => checkbox.value))
                }
    		})
    		return self;
    	}

    	uniq(arr){
    		let tmp = {},
    			newArr = [];
    		for (var i = 0; i < arr.length; i++) {
    			let t = arr[i];
    			if(!tmp[t]){
    				tmp[t] = 1;
    				newArr.push(t);
    			}
    		}
    		return newArr;
    	}

    	draw(){
            let body = document.body,
                firstNode = body.children[0],
                btnsBlock = document.createElement('div');

            for (let i = 0; i < this.nodes.length; i++) {
                let btnObj = this.nodes[i];
                let btn = document.createElement('button');
                btn.innerHTML = btnObj.firstLineDesc;
                btn.value = btnObj.downloadLinks.join('\n');
                btn.addEventListener('click',handleClick);
                btnsBlock.appendChild(btn);
            };
            body.insertBefore(btnsBlock,firstNode);
            this.btnsBlock = btnsBlock;
    	}

        handleClick(e){
            GM_setClipboard(e.target.value);
            let p = document.createElement('p');
            p.style.color = 'red';
            p.innerHTML = 'copy!';
            this.btnsBlock.appendChild(p);
        }
    }

    new MJTT().init().draw();

    /* jshint ignore:start */
]]></>).toString();
                  var c = babel.transform(inline_src);
eval(c.code);
/* jshint ignore:end */
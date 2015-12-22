// ==UserScript==
// @name         美剧天堂：一键复制所有下载链接
// @namespace    https://github.com/patsoncy/mjtt
// @version      0.1.1
// @description  在剧集页面右边增加一排按钮，点击按钮可以复制改版本的所有下载链接
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
    	  checkboxSelector      = 'input[type=checkbox]',
          btnsBlockStyle        = 'width:200px;position:fixed;right:0;top:40%;z-index:999',
          btnStyle              = 'display:block;width:100%;padding:20px;color:#f34d41;background:#efefef';

    class MJTT {
    	constructor(){
    		this.nodes = [];
    	}

    	init(){
    		let self = this,
    		    downloadBlocks = [].slice.apply(document.querySelectorAll(downloadBlockSelector))
                                  .filter((block) => block.querySelectorAll('input[type=checkbox]').length > 0);

    		self.nodes = downloadBlocks.map((block,index) => {
                let checkboxs = [].slice.apply(block.querySelectorAll(checkboxSelector));
    			return {
                    firstLineDesc : block.innerText.split('\n')[0],
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
                btnsBlock.style.cssText = btnsBlockStyle;
            for (let i = 0; i < this.nodes.length; i++) {
                let btnObj = this.nodes[i];
                let btn = document.createElement('button');
                btn.innerHTML = btnObj.firstLineDesc + '(一共' + btnObj.downloadLinks + '集)';
                btn.value = btnObj.downloadLinks.join('\n');
                btn.addEventListener('click',this.handleClick);
                btn.style.cssText = btnStyle;
                btnsBlock.appendChild(btn);
            };
            body.insertBefore(btnsBlock,firstNode);
    	}

        handleClick(e){
            GM_setClipboard(e.target.value);
            let p = document.createElement('p');
            p.style.color = 'red';
            p.innerHTML = 'copied!';
            e.target.parentNode.appendChild(p);
        }
    }

    new MJTT().init().draw();

    /* jshint ignore:start */
]]></>).toString();
var c = babel.transform(inline_src);
eval(c.code);
/* jshint ignore:end */
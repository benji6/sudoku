"use strict";!function e(r,t,n){function o(u,c){if(!t[u]){if(!r[u]){var a="function"==typeof require&&require;if(!c&&a)return a(u,!0);if(i)return i(u,!0);var l=new Error("Cannot find module '"+u+"'");throw l.code="MODULE_NOT_FOUND",l}var f=t[u]={exports:{}};r[u][0].call(f.exports,function(e){var t=r[u][1][e];return o(t?t:e)},f,f.exports,e,r,t,n)}return t[u].exports}for(var i="function"==typeof require&&require,u=0;u<n.length;u++)o(n[u]);return o}({1:[function(r,e,t){var n=function(){var r=function(r){return function(e){return e.appendChild(r)}},e=function(r){return function e(t){return function(n){var o,i=r(n),u=function(r){r.count||(r.count=1);for(var t=0;t<r.count;t++)o=i(r,t),r.children&&e(r.children)(o)};if(t.constructor===Array){var c;for(c=0;c<t.length;c++)u(t[c])}else u(t)}}},t=function(e,t,n){return"function"==typeof e?void r(document.createTextNode(e(n)))(t):void r(document.createTextNode(e))(t)},n=function(e){return function(n,o){o||(o=0);var i=document.createElement(n.tag);for(var u in n)if(n.hasOwnProperty(u))switch(u){case"tag":break;case"count":break;case"children":break;case"colspan":i.setAttribute("colspan",n.colspan);break;case"variable":this[n.variable]=i;break;case"text":t(n.text,i,o);break;case"callback":n.callback(i,e,o);break;default:void 0!==i[u]&&(i[u]="function"==typeof n[u]?n[u](o):n[u])}return r(i)(e),i}};return function(r,t){return t?void e(n)(r)(t):function(t){e(n)(r)(t)}}}();"object"==typeof e&&(e.exports=n)},{}],2:[function(e,t,n){function o(){E(C),E(k);var r=function(){var r=0;return function(){return r++}}();M({tag:"table",children:{tag:"tr",count:"3",children:{tag:"td",count:"3",children:{tag:"table",children:{tag:"tr",count:"3",children:{tag:"td",count:"3",children:{tag:"select",id:r,children:{tag:"option",count:"10",text:function(r){return r?r:""}}}}}}}}},k)}function u(){var e=0;for(intBrute=0,i=0,x=1,j=1,z=1,r=0,rr=0,rrfun=0,c=0,cc=0,ccfun=0,booChange=!1,count=0,strInvalidPzlReadout="",arrMemory=[],arrPossValues=[],arrGuessCell=[],arr=[],i=0;i<=80;i++)arr[i]=[];for(i=0;i<=80;i++)for(j=0;j<=8;j++)arr[i][j]=!0;if(l()===!1)return void(C.innerHTML="Puzzle setup is invalid: "+strInvalidPzlReadout);if(a()===!0)return void(C.innerHTML="Puzzle complete!");for(e=0;1023>=e;e++)if(booChange=!1,f(),s(),d(),intBrute>0&&l()===!1&&h(),booChange===!1){if(l()===!0&&a()===!0)return void(C.innerHTML="Puzzle complete!");v()}}function a(){for(i=0;i<=80;i++){var r=document.getElementById(i),e=r.options[r.selectedIndex].value;if(""===e)return!1}return!0}function l(){f();var e,t,n=0,o=!1;for(i=0;i<=80;i++){var u=document.getElementById(i),a=u.options[u.selectedIndex].value;if(""!==a){for(r=m(i),x=9*r-9;x<9*r;x++)if(e=document.getElementById(x),t=e.options[e.selectedIndex].value,a==t&&i!=x)return strInvalidPzlReadout="cell id: "+i+", duplicate in row: "+r,!1;for(c=g(i),x=1;x<=9;x++)if(9==c?(n=9*x-1,e=document.getElementById(n),t=e.options[e.selectedIndex].value):(n=c+9*x-10,e=document.getElementById(n),t=e.options[e.selectedIndex].value),a==t&&i!=n)return strInvalidPzlReadout="cell id: "+i+", duplicate in column: "+c,!1;for(rrfun=3*Math.floor((r+2)/3)-2,ccfun=3*Math.floor((c+2)/3)-2,rr=rrfun;rr<=rrfun+2;rr++)for(cc=ccfun;cc<=ccfun+2;cc++)if(x=cc+9*(rr-1)-1,e=document.getElementById(x),t=e.options[e.selectedIndex].value,a==t&&i!=x)return strInvalidPzlReadout="cell id: "+i+", duplicate in child square row: "+rr+" & child square column: "+cc,!1}else{for(o=!0,z=0;z<=8;z++)if(arr[i][z]===!0){o=!1;break}if(o===!0)return strInvalidPzlReadout="cell id: "+i+", no possible values",!1}}return!0}function f(){if(intBrute>0)for(i=0;i<=80;i++)for(j=0;j<=8;j++)arr[i][j]=!0;for(i=0;i<=80;i++){var e=document.getElementById(i),t=e.options[e.selectedIndex].value;if(""!==t){for(r=m(i),c=g(i),j=0;j<=8;j++)arr[i][j]=!1;for(x=9*r-9;x<9*r;x++)arr[x][t-1]=!1;for(x=1;x<=9;x++)9==c?arr[9*x-1][t-1]=!1:arr[c+9*x-10][t-1]=!1;for(rrfun=3*Math.floor((r+2)/3)-2,ccfun=3*Math.floor((c+2)/3)-2,rr=rrfun;rr<=rrfun+2;rr++)for(cc=ccfun;cc<=ccfun+2;cc++)arr[cc+9*(rr-1)-1][t-1]=!1}}}function s(){var r=0;for(i=0;i<=80;i++){var e=document.getElementById(i),t=e.options[e.selectedIndex].value;if(""===t){for(r=0,j=1;j<=9&&2!=r;j++)arr[i][j-1]===!0&&(r+=1,z=j);1==r&&(document.getElementById(i).value=z,booChange=!0)}}}function d(){var r=0,e=0;for(x=1;x<=9;x++)for(z=1;z<=9;z++){for(count=0,y=1;y<=9;y++)if(arr[y+9*x-10][z-1]===!0){if(count+=1,2==count)break;solx=x,soly=y,solz=z}1==count&&(document.getElementById(soly+9*solx-10).value=solz,booChange=!0)}for(y=1;y<=9;y++)for(z=0;z<=8;z++){for(count=0,x=1;x<=9;x++)if(arr[y+9*x-10][z]===!0){if(count+=1,2==count)break;solx=x,soly=y,solz=z+1}1==count&&(document.getElementById(soly+9*solx-10).value=solz,booChange=!0)}for(r=1;3>=r;r++)for(r=3*r,e=1;3>=e;e++)for(e=3*e,z=1;z<=9;z++){for(count=0,x=r-2;x<=r;x++){for(y=e-2;y<=e;y++)if(arr[y+9*x-10][z-1]===!0){if(count+=1,2===count)break;solx=x,soly=y,solz=z}if(2===count)break}1==count&&(document.getElementById(soly+9*solx-10).value=solz,booChange=!0)}}function v(){var r=9,e=0;for(arrMemory[intBrute]=[],arrPossValues[intBrute]=[],i=0;i<=80;i++){var t=document.getElementById(i),n=t.options[t.selectedIndex].value;arrMemory[intBrute][i]=n}for(i=0;i<=80;i++)for(count=0,z=0;z<=8&&!(arr[i][z]===!0&&(count+=1,count>=r));z++)count>1&&(r=count,arrGuessCell[intBrute]=i);for(z=0;z<=8;z++)arr[arrGuessCell[intBrute]][z]===!0&&arrPossValues[intBrute].push(z+1);e=Math.floor(Math.random()*arrPossValues[intBrute].length),z=arrPossValues[intBrute][e],document.getElementById(arrGuessCell[intBrute]).value=z,booChange=!0,arrPossValues[intBrute].splice(e,1),intBrute+=1}function h(){var r=0;for(intBrute-=1,i=0;i<=80;i++)document.getElementById(i).value=arrMemory[intBrute][i];0===arrPossValues[intBrute].length?(arrMemory.splice(intBrute,1),arrPossValues.splice(intBrute,1),arrGuessCell.splice(intBrute,1),h()):(r=1==arrPossValues[intBrute].length?0:Math.floor(Math.random()*arrPossValues[intBrute].length),z=arrPossValues[intBrute][r],document.getElementById(arrGuessCell[intBrute]).value=z,booChange=!0,arrPossValues[intBrute].splice(r,1),intBrute+=1)}function m(r){return Math.ceil((r+1)/9)}function g(r){return(r+1)/9-Math.floor((r+1)/9)===0?9:Math.round(r+1-9*Math.floor((r+1)/9))}function p(){o(),document.body.appendChild(P)}function b(){console.log(P.firstChild),P.parentNode&&P.parentNode.removeChild(P)}var B,I,k,C,P,M=e("jsml-parse"),E=function(r){for(;r.firstChild;)r.removeChild(r.firstChild)};M([{tag:"div",callback:function(r){P=r},children:[{tag:"h1",text:"Sudoku Solver"},{tag:"div",className:"center",children:[{tag:"button",text:"New Puzzle",callback:function(r){B=r,r.onfocus=function(){this.blur&&this.blur()}}},{tag:"button",text:"Solve",callback:function(r){I=r,r.onfocus=function(){this.blur&&this.blur()}}}]},{tag:"div",callback:function(r){k=r}},{tag:"div",className:"center",callback:function(r){C=r}}]}],document.body),B.onclick=o,I.onclick=u,window.sudoku={on:p,off:b},window.sudoku.on()},{"jsml-parse":1}]},{},[2]);
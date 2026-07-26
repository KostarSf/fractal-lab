(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e){let t=Object.create(null);for(let n of e.split(`,`))t[n]=1;return e=>e in t}var t={},n=[],r=()=>{},i=()=>!1,a=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),o=e=>e.startsWith(`onUpdate:`),s=Object.assign,c=(e,t)=>{let n=e.indexOf(t);n>-1&&e.splice(n,1)},l=Object.prototype.hasOwnProperty,u=(e,t)=>l.call(e,t),d=Array.isArray,f=e=>x(e)===`[object Map]`,p=e=>x(e)===`[object Set]`,m=e=>x(e)===`[object Date]`,h=e=>typeof e==`function`,g=e=>typeof e==`string`,_=e=>typeof e==`symbol`,v=e=>typeof e==`object`&&!!e,y=e=>(v(e)||h(e))&&h(e.then)&&h(e.catch),b=Object.prototype.toString,x=e=>b.call(e),S=e=>x(e).slice(8,-1),C=e=>x(e)===`[object Object]`,w=e=>g(e)&&e!==`NaN`&&e[0]!==`-`&&``+parseInt(e,10)===e,T=e(`,key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted`),ee=e=>{let t=Object.create(null);return(n=>t[n]||(t[n]=e(n)))},E=/-\w/g,D=ee(e=>e.replace(E,e=>e.slice(1).toUpperCase())),te=/\B([A-Z])/g,O=ee(e=>e.replace(te,`-$1`).toLowerCase()),k=ee(e=>e.charAt(0).toUpperCase()+e.slice(1)),A=ee(e=>e?`on${k(e)}`:``),j=(e,t)=>!Object.is(e,t),ne=(e,...t)=>{for(let n=0;n<e.length;n++)e[n](...t)},M=(e,t,n,r=!1)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:r,value:n})},re=e=>{let t=parseFloat(e);return isNaN(t)?e:t},ie,ae=()=>ie||=typeof globalThis<`u`?globalThis:typeof self<`u`?self:typeof window<`u`?window:typeof global<`u`?global:{};function oe(e){if(d(e)){let t={};for(let n=0;n<e.length;n++){let r=e[n],i=g(r)?ue(r):oe(r);if(i)for(let e in i)t[e]=i[e]}return t}else if(g(e)||v(e))return e}var se=/;(?![^(]*\))/g,ce=/:([^]+)/,le=/\/\*[^]*?\*\//g;function ue(e){let t={};return e.replace(le,``).split(se).forEach(e=>{if(e){let n=e.split(ce);n.length>1&&(t[n[0].trim()]=n[1].trim())}}),t}function de(e){let t=``;if(g(e))t=e;else if(d(e))for(let n=0;n<e.length;n++){let r=de(e[n]);r&&(t+=r+` `)}else if(v(e))for(let n in e)e[n]&&(t+=n+` `);return t.trim()}var fe=`itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`,pe=e(fe);fe+``;function me(e){return!!e||e===``}function he(e,t){if(e.length!==t.length)return!1;let n=!0;for(let r=0;n&&r<e.length;r++)n=ge(e[r],t[r]);return n}function ge(e,t){if(e===t)return!0;let n=m(e),r=m(t);if(n||r)return n&&r?e.getTime()===t.getTime():!1;if(n=_(e),r=_(t),n||r)return e===t;if(n=d(e),r=d(t),n||r)return n&&r?he(e,t):!1;if(n=v(e),r=v(t),n||r){if(!n||!r||Object.keys(e).length!==Object.keys(t).length)return!1;for(let n in e){let r=e.hasOwnProperty(n),i=t.hasOwnProperty(n);if(r&&!i||!r&&i||!ge(e[n],t[n]))return!1}}return String(e)===String(t)}function _e(e,t){return e.findIndex(e=>ge(e,t))}var ve=e=>!!(e&&e.__v_isRef===!0),N=e=>g(e)?e:e==null?``:d(e)||v(e)&&(e.toString===b||!h(e.toString))?ve(e)?N(e.value):JSON.stringify(e,ye,2):String(e),ye=(e,t)=>ve(t)?ye(e,t.value):f(t)?{[`Map(${t.size})`]:[...t.entries()].reduce((e,[t,n],r)=>(e[be(t,r)+` =>`]=n,e),{})}:p(t)?{[`Set(${t.size})`]:[...t.values()].map(e=>be(e))}:_(t)?be(t):v(t)&&!d(t)&&!C(t)?String(t):t,be=(e,t=``)=>_(e)?`Symbol(${e.description??t})`:e,P,xe=class{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this._warnOnRun=!0,this.__v_skip=!0,!e&&P&&(P.active?(this.parent=P,this.index=(P.scopes||=[]).push(this)-1):(this._active=!1,this._warnOnRun=!1))}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let e,t;if(this.scopes){let n=this.scopes.slice();for(e=0,t=n.length;e<t;e++)n[e].pause()}for(e=0,t=this.effects.length;e<t;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let e,t;if(this.scopes){let n=this.scopes.slice();for(e=0,t=n.length;e<t;e++)n[e].resume()}let n=this.effects.slice();for(e=0,t=n.length;e<t;e++)n[e].resume()}}run(e){if(this._active){let t=P;try{return P=this,e()}finally{P=t}}}on(){++this._on===1&&(this.prevScope=P,P=this)}off(){if(this._on>0&&--this._on===0){if(P===this)P=this.prevScope;else{let e=P;for(;e;){if(e.prevScope===this){e.prevScope=this.prevScope;break}e=e.prevScope}}this.prevScope=void 0}}stop(e){if(this._active){this._active=!1;let t,n;for(t=0,n=this.effects.length;t<n;t++)this.effects[t].stop();for(this.effects.length=0,t=0,n=this.cleanups.length;t<n;t++)this.cleanups[t]();if(this.cleanups.length=0,this.scopes){let e=this.scopes.slice();for(t=0,n=e.length;t<n;t++)e[t].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){let e=this.parent.scopes.pop();e&&e!==this&&(this.parent.scopes[this.index]=e,e.index=this.index)}this.parent=void 0}}};function Se(e){return new xe(e)}function Ce(){return P}function we(e,t=!1){P&&P.cleanups.push(e)}var F,Te=new WeakSet,Ee=class{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,P&&(P.active?P.effects.push(this):this.flags&=-2)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Te.has(this)&&(Te.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Ae(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Ue(this),Ne(this);let e=F,t=ze;F=this,ze=!0;try{return this.fn()}finally{Pe(this),F=e,ze=t,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)Le(e);this.deps=this.depsTail=void 0,Ue(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?Te.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Fe(this)&&this.run()}get dirty(){return Fe(this)}},De=0,Oe,ke;function Ae(e,t=!1){if(e.flags|=8,t){e.next=ke,ke=e;return}e.next=Oe,Oe=e}function je(){De++}function Me(){if(--De>0)return;if(ke){let e=ke;for(ke=void 0;e;){let t=e.next;e.next=void 0,e.flags&=-9,e=t}}let e;for(;Oe;){let t=Oe;for(Oe=void 0;t;){let n=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(t){e||=t}t=n}}if(e)throw e}function Ne(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function Pe(e){let t,n=e.depsTail,r=n;for(;r;){let e=r.prevDep;r.version===-1?(r===n&&(n=e),Le(r),Re(r)):t=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=e}e.deps=t,e.depsTail=n}function Fe(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(Ie(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function Ie(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===We)||(e.globalVersion=We,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!Fe(e))))return;e.flags|=2;let t=e.dep,n=F,r=ze;F=e,ze=!0;try{Ne(e);let n=e.fn(e._value);(t.version===0||j(n,e._value))&&(e.flags|=128,e._value=n,t.version++)}catch(e){throw t.version++,e}finally{F=n,ze=r,Pe(e),e.flags&=-3}}function Le(e,t=!1){let{dep:n,prevSub:r,nextSub:i}=e;if(r&&(r.nextSub=i,e.prevSub=void 0),i&&(i.prevSub=r,e.nextSub=void 0),n.subs===e&&(n.subs=r,!r&&n.computed)){n.computed.flags&=-5;for(let e=n.computed.deps;e;e=e.nextDep)Le(e,!0)}!t&&!--n.sc&&n.map&&n.map.delete(n.key)}function Re(e){let{prevDep:t,nextDep:n}=e;t&&(t.nextDep=n,e.prevDep=void 0),n&&(n.prevDep=t,e.nextDep=void 0)}var ze=!0,Be=[];function Ve(){Be.push(ze),ze=!1}function He(){let e=Be.pop();ze=e===void 0||e}function Ue(e){let{cleanup:t}=e;if(e.cleanup=void 0,t){let e=F;F=void 0;try{t()}finally{F=e}}}var We=0,Ge=class{constructor(e,t){this.sub=e,this.dep=t,this.version=t.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}},Ke=class{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(e){if(!F||!ze||F===this.computed)return;let t=this.activeLink;if(t===void 0||t.sub!==F)t=this.activeLink=new Ge(F,this),F.deps?(t.prevDep=F.depsTail,F.depsTail.nextDep=t,F.depsTail=t):F.deps=F.depsTail=t,qe(t);else if(t.version===-1&&(t.version=this.version,t.nextDep)){let e=t.nextDep;e.prevDep=t.prevDep,t.prevDep&&(t.prevDep.nextDep=e),t.prevDep=F.depsTail,t.nextDep=void 0,F.depsTail.nextDep=t,F.depsTail=t,F.deps===t&&(F.deps=e)}return t}trigger(e){this.version++,We++,this.notify(e)}notify(e){je();try{for(let e=this.subs;e;e=e.prevSub)e.sub.notify()&&e.sub.dep.notify()}finally{Me()}}};function qe(e){if(e.dep.sc++,e.sub.flags&4){let t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let e=t.deps;e;e=e.nextDep)qe(e)}let n=e.dep.subs;n!==e&&(e.prevSub=n,n&&(n.nextSub=e)),e.dep.subs=e}}var Je=new WeakMap,Ye=Symbol(``),Xe=Symbol(``),Ze=Symbol(``);function I(e,t,n){if(ze&&F){let t=Je.get(e);t||Je.set(e,t=new Map);let r=t.get(n);r||(t.set(n,r=new Ke),r.map=t,r.key=n),r.track()}}function Qe(e,t,n,r,i,a){let o=Je.get(e);if(!o){We++;return}let s=e=>{e&&e.trigger()};if(je(),t===`clear`)o.forEach(s);else{let i=d(e),a=i&&w(n);if(i&&n===`length`){let e=Number(r);o.forEach((t,n)=>{(n===`length`||n===Ze||!_(n)&&n>=e)&&s(t)})}else switch((n!==void 0||o.has(void 0))&&s(o.get(n)),a&&s(o.get(Ze)),t){case`add`:i?a&&s(o.get(`length`)):(s(o.get(Ye)),f(e)&&s(o.get(Xe)));break;case`delete`:i||(s(o.get(Ye)),f(e)&&s(o.get(Xe)));break;case`set`:f(e)&&s(o.get(Ye));break}}Me()}function $e(e,t){let n=Je.get(e);return n&&n.get(t)}function et(e){let t=L(e);return t===e?t:(I(t,`iterate`,Ze),zt(e)?t:t.map(Ht))}function tt(e){return I(e=L(e),`iterate`,Ze),e}function nt(e,t){return Rt(e)?Ut(Lt(e)?Ht(t):t):Ht(t)}var rt={__proto__:null,[Symbol.iterator](){return it(this,Symbol.iterator,e=>nt(this,e))},concat(...e){return et(this).concat(...e.map(e=>d(e)?et(e):e))},entries(){return it(this,`entries`,e=>(e[1]=nt(this,e[1]),e))},every(e,t){return ot(this,`every`,e,t,void 0,arguments)},filter(e,t){return ot(this,`filter`,e,t,e=>e.map(e=>nt(this,e)),arguments)},find(e,t){return ot(this,`find`,e,t,e=>nt(this,e),arguments)},findIndex(e,t){return ot(this,`findIndex`,e,t,void 0,arguments)},findLast(e,t){return ot(this,`findLast`,e,t,e=>nt(this,e),arguments)},findLastIndex(e,t){return ot(this,`findLastIndex`,e,t,void 0,arguments)},forEach(e,t){return ot(this,`forEach`,e,t,void 0,arguments)},includes(...e){return ct(this,`includes`,e)},indexOf(...e){return ct(this,`indexOf`,e)},join(e){return et(this).join(e)},lastIndexOf(...e){return ct(this,`lastIndexOf`,e)},map(e,t){return ot(this,`map`,e,t,void 0,arguments)},pop(){return lt(this,`pop`)},push(...e){return lt(this,`push`,e)},reduce(e,...t){return st(this,`reduce`,e,t)},reduceRight(e,...t){return st(this,`reduceRight`,e,t)},shift(){return lt(this,`shift`)},some(e,t){return ot(this,`some`,e,t,void 0,arguments)},splice(...e){return lt(this,`splice`,e)},toReversed(){return et(this).toReversed()},toSorted(e){return et(this).toSorted(e)},toSpliced(...e){return et(this).toSpliced(...e)},unshift(...e){return lt(this,`unshift`,e)},values(){return it(this,`values`,e=>nt(this,e))}};function it(e,t,n){let r=tt(e),i=r[t]();return r!==e&&!zt(e)&&(i._next=i.next,i.next=()=>{let e=i._next();return e.done||(e.value=n(e.value)),e}),i}var at=Array.prototype;function ot(e,t,n,r,i,a){let o=tt(e),s=o!==e&&!zt(e),c=o[t];if(c!==at[t]){let t=c.apply(e,a);return s?Ht(t):t}let l=n;o!==e&&(s?l=function(t,r){return n.call(this,nt(e,t),r,e)}:n.length>2&&(l=function(t,r){return n.call(this,t,r,e)}));let u=c.call(o,l,r);return s&&i?i(u):u}function st(e,t,n,r){let i=tt(e),a=i!==e&&!zt(e),o=n,s=!1;i!==e&&(a?(s=r.length===0,o=function(t,r,i){return s&&(s=!1,t=nt(e,t)),n.call(this,t,nt(e,r),i,e)}):n.length>3&&(o=function(t,r,i){return n.call(this,t,r,i,e)}));let c=i[t](o,...r);return s?nt(e,c):c}function ct(e,t,n){let r=L(e);I(r,`iterate`,Ze);let i=r[t](...n);return(i===-1||i===!1)&&Bt(n[0])?(n[0]=L(n[0]),r[t](...n)):i}function lt(e,t,n=[]){Ve(),je();let r=L(e)[t].apply(e,n);return Me(),He(),r}var ut=e(`__proto__,__v_isRef,__isVue`),dt=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!==`arguments`&&e!==`caller`).map(e=>Symbol[e]).filter(_));function ft(e){_(e)||(e=String(e));let t=L(this);return I(t,`has`,e),t.hasOwnProperty(e)}var pt=class{constructor(e=!1,t=!1){this._isReadonly=e,this._isShallow=t}get(e,t,n){if(t===`__v_skip`)return e.__v_skip;let r=this._isReadonly,i=this._isShallow;if(t===`__v_isReactive`)return!r;if(t===`__v_isReadonly`)return r;if(t===`__v_isShallow`)return i;if(t===`__v_raw`)return n===(r?i?jt:At:i?kt:Ot).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(n)?e:void 0;let a=d(e);if(!r){let e;if(a&&(e=rt[t]))return e;if(t===`hasOwnProperty`)return ft}let o=Reflect.get(e,t,R(e)?e:n);if((_(t)?dt.has(t):ut(t))||(r||I(e,`get`,t),i))return o;if(R(o)){let e=a&&w(t)?o:o.value;return r&&v(e)?Ft(e):e}return v(o)?r?Ft(o):Nt(o):o}},mt=class extends pt{constructor(e=!1){super(!1,e)}set(e,t,n,r){let i=e[t],a=d(e)&&w(t);if(!this._isShallow){let e=Rt(i);if(!zt(n)&&!Rt(n)&&(i=L(i),n=L(n)),!a&&R(i)&&!R(n))return e||(i.value=n),!0}let o=a?Number(t)<e.length:u(e,t),s=Reflect.set(e,t,n,R(e)?e:r);return e===L(r)&&s&&(o?j(n,i)&&Qe(e,`set`,t,n,i):Qe(e,`add`,t,n)),s}deleteProperty(e,t){let n=u(e,t),r=e[t],i=Reflect.deleteProperty(e,t);return i&&n&&Qe(e,`delete`,t,void 0,r),i}has(e,t){let n=Reflect.has(e,t);return(!_(t)||!dt.has(t))&&I(e,`has`,t),n}ownKeys(e){return I(e,`iterate`,d(e)?`length`:Ye),Reflect.ownKeys(e)}},ht=class extends pt{constructor(e=!1){super(!0,e)}set(e,t){return!0}deleteProperty(e,t){return!0}},gt=new mt,_t=new ht,vt=new mt(!0),yt=e=>e,bt=e=>Reflect.getPrototypeOf(e);function xt(e,t,n){return function(...r){let i=this.__v_raw,a=L(i),o=f(a),c=e===`entries`||e===Symbol.iterator&&o,l=e===`keys`&&o,u=i[e](...r),d=n?yt:t?Ut:Ht;return!t&&I(a,`iterate`,l?Xe:Ye),s(Object.create(u),{next(){let{value:e,done:t}=u.next();return t?{value:e,done:t}:{value:c?[d(e[0]),d(e[1])]:d(e),done:t}}})}}function St(e){return function(...t){return e===`delete`?!1:e===`clear`?void 0:this}}function Ct(e,t){let n={get(n){let r=this.__v_raw,i=L(r),a=L(n);e||(j(n,a)&&I(i,`get`,n),I(i,`get`,a));let{has:o}=bt(i),s=t?yt:e?Ut:Ht;if(o.call(i,n))return s(r.get(n));if(o.call(i,a))return s(r.get(a));r!==i&&r.get(n)},get size(){let t=this.__v_raw;return!e&&I(L(t),`iterate`,Ye),t.size},has(t){let n=this.__v_raw,r=L(n),i=L(t);return e||(j(t,i)&&I(r,`has`,t),I(r,`has`,i)),t===i?n.has(t):n.has(t)||n.has(i)},forEach(n,r){let i=this,a=i.__v_raw,o=L(a),s=t?yt:e?Ut:Ht;return!e&&I(o,`iterate`,Ye),a.forEach((e,t)=>n.call(r,s(e),s(t),i))}};return s(n,e?{add:St(`add`),set:St(`set`),delete:St(`delete`),clear:St(`clear`)}:{add(e){let n=L(this),r=bt(n),i=L(e),a=!t&&!zt(e)&&!Rt(e)?i:e;return r.has.call(n,a)||j(e,a)&&r.has.call(n,e)||j(i,a)&&r.has.call(n,i)||(n.add(a),Qe(n,`add`,a,a)),this},set(e,n){!t&&!zt(n)&&!Rt(n)&&(n=L(n));let r=L(this),{has:i,get:a}=bt(r),o=i.call(r,e);o||=(e=L(e),i.call(r,e));let s=a.call(r,e);return r.set(e,n),o?j(n,s)&&Qe(r,`set`,e,n,s):Qe(r,`add`,e,n),this},delete(e){let t=L(this),{has:n,get:r}=bt(t),i=n.call(t,e);i||=(e=L(e),n.call(t,e));let a=r?r.call(t,e):void 0,o=t.delete(e);return i&&Qe(t,`delete`,e,void 0,a),o},clear(){let e=L(this),t=e.size!==0,n=e.clear();return t&&Qe(e,`clear`,void 0,void 0,void 0),n}}),[`keys`,`values`,`entries`,Symbol.iterator].forEach(r=>{n[r]=xt(r,e,t)}),n}function wt(e,t){let n=Ct(e,t);return(t,r,i)=>r===`__v_isReactive`?!e:r===`__v_isReadonly`?e:r===`__v_raw`?t:Reflect.get(u(n,r)&&r in t?n:t,r,i)}var Tt={get:wt(!1,!1)},Et={get:wt(!1,!0)},Dt={get:wt(!0,!1)},Ot=new WeakMap,kt=new WeakMap,At=new WeakMap,jt=new WeakMap;function Mt(e){switch(e){case`Object`:case`Array`:return 1;case`Map`:case`Set`:case`WeakMap`:case`WeakSet`:return 2;default:return 0}}function Nt(e){return Rt(e)?e:It(e,!1,gt,Tt,Ot)}function Pt(e){return It(e,!1,vt,Et,kt)}function Ft(e){return It(e,!0,_t,Dt,At)}function It(e,t,n,r,i){if(!v(e)||e.__v_raw&&!(t&&e.__v_isReactive)||e.__v_skip||!Object.isExtensible(e))return e;let a=i.get(e);if(a)return a;let o=Mt(S(e));if(o===0)return e;let s=new Proxy(e,o===2?r:n);return i.set(e,s),s}function Lt(e){return Rt(e)?Lt(e.__v_raw):!!(e&&e.__v_isReactive)}function Rt(e){return!!(e&&e.__v_isReadonly)}function zt(e){return!!(e&&e.__v_isShallow)}function Bt(e){return e?!!e.__v_raw:!1}function L(e){let t=e&&e.__v_raw;return t?L(t):e}function Vt(e){return!u(e,`__v_skip`)&&Object.isExtensible(e)&&M(e,`__v_skip`,!0),e}var Ht=e=>v(e)?Nt(e):e,Ut=e=>v(e)?Ft(e):e;function R(e){return e?e.__v_isRef===!0:!1}function z(e){return Wt(e,!1)}function Wt(e,t){return R(e)?e:new Gt(e,t)}var Gt=class{constructor(e,t){this.dep=new Ke,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=t?e:L(e),this._value=t?e:Ht(e),this.__v_isShallow=t}get value(){return this.dep.track(),this._value}set value(e){let t=this._rawValue,n=this.__v_isShallow||zt(e)||Rt(e);e=n?e:L(e),j(e,t)&&(this._rawValue=e,this._value=n?e:Ht(e),this.dep.trigger())}};function B(e){return R(e)?e.value:e}var Kt={get:(e,t,n)=>t===`__v_raw`?e:B(Reflect.get(e,t,n)),set:(e,t,n,r)=>{let i=e[t];return R(i)&&!R(n)?(i.value=n,!0):Reflect.set(e,t,n,r)}};function qt(e){return Lt(e)?e:new Proxy(e,Kt)}function Jt(e){let t=d(e)?Array(e.length):{};for(let n in e)t[n]=Qt(e,n);return t}var Yt=class{constructor(e,t,n){this._object=e,this._defaultValue=n,this.__v_isRef=!0,this._value=void 0,this._key=_(t)?t:String(t),this._raw=L(e);let r=!0,i=e;if(!d(e)||_(this._key)||!w(this._key))do r=!Bt(i)||zt(i);while(r&&(i=i.__v_raw));this._shallow=r}get value(){let e=this._object[this._key];return this._shallow&&(e=B(e)),this._value=e===void 0?this._defaultValue:e}set value(e){if(this._shallow&&R(this._raw[this._key])){let t=this._object[this._key];if(R(t)){t.value=e;return}}this._object[this._key]=e}get dep(){return $e(this._raw,this._key)}},Xt=class{constructor(e){this._getter=e,this.__v_isRef=!0,this.__v_isReadonly=!0,this._value=void 0}get value(){return this._value=this._getter()}};function Zt(e,t,n){return R(e)?e:h(e)?new Xt(e):v(e)&&arguments.length>1?Qt(e,t,n):z(e)}function Qt(e,t,n){return new Yt(e,t,n)}var $t=class{constructor(e,t,n){this.fn=e,this.setter=t,this._value=void 0,this.dep=new Ke(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=We-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!t,this.isSSR=n}notify(){if(this.flags|=16,!(this.flags&8)&&F!==this)return Ae(this,!0),!0}get value(){let e=this.dep.track();return Ie(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}};function en(e,t,n=!1){let r,i;return h(e)?r=e:(r=e.get,i=e.set),new $t(r,i,n)}var tn={},nn=new WeakMap,rn=void 0;function an(e,t=!1,n=rn){if(n){let t=nn.get(n);t||nn.set(n,t=[]),t.push(e)}}function on(e,n,i=t){let{immediate:a,deep:o,once:s,scheduler:l,augmentJob:u,call:f}=i,p=e=>o?e:zt(e)||o===!1||o===0?sn(e,1):sn(e),m,g,_,v,y=!1,b=!1;if(R(e)?(g=()=>e.value,y=zt(e)):Lt(e)?(g=()=>p(e),y=!0):d(e)?(b=!0,y=e.some(e=>Lt(e)||zt(e)),g=()=>e.map(e=>{if(R(e))return e.value;if(Lt(e))return p(e);if(h(e))return f?f(e,2):e()})):g=h(e)?n?f?()=>f(e,2):e:()=>{if(_){Ve();try{_()}finally{He()}}let t=rn;rn=m;try{return f?f(e,3,[v]):e(v)}finally{rn=t}}:r,n&&o){let e=g,t=o===!0?1/0:o;g=()=>sn(e(),t)}let x=Ce(),S=()=>{m.stop(),x&&x.active&&c(x.effects,m)};if(s&&n){let e=n;n=(...t)=>{let n=e(...t);return S(),n}}let C=b?Array(e.length).fill(tn):tn,w=e=>{if(!(!(m.flags&1)||!m.dirty&&!e))if(n){let t=m.run();if(e||o||y||(b?t.some((e,t)=>j(e,C[t])):j(t,C))){_&&_();let e=rn;rn=m;try{let e=[t,C===tn?void 0:b&&C[0]===tn?[]:C,v];C=t,f?f(n,3,e):n(...e)}finally{rn=e}}}else m.run()};return u&&u(w),m=new Ee(g),m.scheduler=l?()=>l(w,!1):w,v=e=>an(e,!1,m),_=m.onStop=()=>{let e=nn.get(m);if(e){if(f)f(e,4);else for(let t of e)t();nn.delete(m)}},n?a?w(!0):C=m.run():l?l(w.bind(null,!0),!0):m.run(),S.pause=m.pause.bind(m),S.resume=m.resume.bind(m),S.stop=S,S}function sn(e,t=1/0,n){if(t<=0||!v(e)||e.__v_skip||(n||=new Map,(n.get(e)||0)>=t))return e;if(n.set(e,t),t--,R(e))sn(e.value,t,n);else if(d(e))for(let r=0;r<e.length;r++)sn(e[r],t,n);else if(p(e)||f(e))e.forEach(e=>{sn(e,t,n)});else if(C(e)){for(let r in e)sn(e[r],t,n);for(let r of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,r)&&sn(e[r],t,n)}return e}function cn(e,t,n,r){try{return r?e(...r):e()}catch(e){un(e,t,n)}}function ln(e,t,n,r){if(h(e)){let i=cn(e,t,n,r);return i&&y(i)&&i.catch(e=>{un(e,t,n)}),i}if(d(e)){let i=[];for(let a=0;a<e.length;a++)i.push(ln(e[a],t,n,r));return i}}function un(e,n,r,i=!0){let a=n?n.vnode:null,{errorHandler:o,throwUnhandledErrorInProduction:s}=n&&n.appContext.config||t;if(n){let t=n.parent,i=n.proxy,a=`https://vuejs.org/error-reference/#runtime-${r}`;for(;t;){let n=t.ec;if(n){for(let t=0;t<n.length;t++)if(n[t](e,i,a)===!1)return}t=t.parent}if(o){Ve(),cn(o,null,10,[e,i,a]),He();return}}dn(e,r,a,i,s)}function dn(e,t,n,r=!0,i=!1){if(i)throw e;console.error(e)}var V=[],fn=-1,pn=[],mn=null,hn=0,gn=Promise.resolve(),_n=null;function vn(e){let t=_n||gn;return e?t.then(this?e.bind(this):e):t}function yn(e){let t=fn+1,n=V.length;for(;t<n;){let r=t+n>>>1,i=V[r],a=Tn(i);a<e||a===e&&i.flags&2?t=r+1:n=r}return t}function bn(e){if(!(e.flags&1)){let t=Tn(e),n=V[V.length-1];!n||!(e.flags&2)&&t>=Tn(n)?V.push(e):V.splice(yn(t),0,e),e.flags|=1,xn()}}function xn(){_n||=gn.then(En)}function Sn(e){d(e)?pn.push(...e):mn&&e.id===-1?mn.splice(hn+1,0,e):e.flags&1||(pn.push(e),e.flags|=1),xn()}function Cn(e,t,n=fn+1){for(;n<V.length;n++){let t=V[n];if(t&&t.flags&2){if(e&&t.id!==e.uid)continue;V.splice(n,1),n--,t.flags&4&&(t.flags&=-2),t(),t.flags&4||(t.flags&=-2)}}}function wn(e){if(pn.length){let e=[...new Set(pn)].sort((e,t)=>Tn(e)-Tn(t));if(pn.length=0,mn){mn.push(...e);return}for(mn=e,hn=0;hn<mn.length;hn++){let e=mn[hn];e.flags&4&&(e.flags&=-2),e.flags&8||e(),e.flags&=-2}mn=null,hn=0}}var Tn=e=>e.id==null?e.flags&2?-1:1/0:e.id;function En(e){try{for(fn=0;fn<V.length;fn++){let e=V[fn];e&&!(e.flags&8)&&(e.flags&4&&(e.flags&=-2),cn(e,e.i,e.i?15:14),e.flags&4||(e.flags&=-2))}}finally{for(;fn<V.length;fn++){let e=V[fn];e&&(e.flags&=-2)}fn=-1,V.length=0,wn(e),_n=null,(V.length||pn.length)&&En(e)}}var Dn=null,On=null;function kn(e){let t=Dn;return Dn=e,On=e&&e.type.__scopeId||null,t}function An(e,t=Dn,n){if(!t||e._n)return e;let r=(...n)=>{r._d&&Zi(-1);let i=kn(t),a=qi.length,o;try{o=e(...n)}finally{for(let e=qi.length;e>a;e--)Yi();kn(i),r._d&&Zi(1)}return o};return r._n=!0,r._c=!0,r._d=!0,r}function jn(e,n){if(Dn===null)return e;let r=Pa(Dn),i=e.dirs||=[];for(let e=0;e<n.length;e++){let[a,o,s,c=t]=n[e];a&&(h(a)&&(a={mounted:a,updated:a}),a.deep&&sn(o),i.push({dir:a,instance:r,value:o,oldValue:void 0,arg:s,modifiers:c}))}return e}function Mn(e,t,n,r){let i=e.dirs,a=t&&t.dirs;for(let o=0;o<i.length;o++){let s=i[o];a&&(s.oldValue=a[o].value);let c=s.dir[r];c&&(Ve(),ln(c,n,8,[e.el,s,e,t]),He())}}function Nn(e,t){if(va){let n=va.provides,r=va.parent&&va.parent.provides;r===n&&(n=va.provides=Object.create(r)),n[e]=t}}function Pn(e,t,n=!1){let r=ya();if(r||$r){let i=$r?$r._context.provides:r?r.parent==null||r.ce?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(i&&e in i)return i[e];if(arguments.length>1)return n&&h(t)?t.call(r&&r.proxy):t}}function Fn(){return!!(ya()||$r)}var In=Symbol.for(`v-scx`),Ln=()=>Pn(In);function Rn(e,t,n){return zn(e,t,n)}function zn(e,n,i=t){let{immediate:a,deep:o,flush:c,once:l}=i,u=s({},i),d=n&&a||!n&&c!==`post`,f;if(Ta){if(c===`sync`){let e=Ln();f=e.__watcherHandles||=[]}else if(!d){let e=()=>{};return e.stop=r,e.resume=r,e.pause=r,e}}let p=va;u.call=(e,t,n)=>ln(e,p,t,n);let m=!1;c===`post`?u.scheduler=e=>{Ai(e,p&&p.suspense)}:c!==`sync`&&(m=!0,u.scheduler=(e,t)=>{t?e():bn(e)}),u.augmentJob=e=>{n&&(e.flags|=4),m&&(e.flags|=2,p&&(e.id=p.uid,e.i=p))};let h=on(e,n,u);return Ta&&(f?f.push(h):d&&h()),h}function Bn(e,t,n){let r=this.proxy,i=g(e)?e.includes(`.`)?Vn(r,e):()=>r[e]:e.bind(r,r),a;h(t)?a=t:(a=t.handler,n=t);let o=Sa(this),s=zn(i,a.bind(r),n);return o(),s}function Vn(e,t){let n=t.split(`.`);return()=>{let t=e;for(let e=0;e<n.length&&t;e++)t=t[n[e]];return t}}var Hn=new WeakMap,Un=Symbol(`_vte`),Wn=e=>e.__isTeleport,Gn=e=>e&&(e.disabled||e.disabled===``),Kn=e=>e&&(e.defer||e.defer===``),qn=e=>typeof SVGElement<`u`&&e instanceof SVGElement,Jn=e=>typeof MathMLElement==`function`&&e instanceof MathMLElement,Yn=(e,t)=>{let n=e&&e.to;return g(n)?t?t(n):null:n},Xn={name:`Teleport`,__isTeleport:!0,process(e,t,n,r,i,a,o,s,c,l){let{mc:u,pc:d,pbc:f,o:{insert:p,querySelector:m,createText:h,createComment:g,parentNode:_}}=l,v=Gn(t.props),{dynamicChildren:y}=t,b=(e,t,n)=>{e.shapeFlag&16&&u(e.children,t,n,i,a,o,s,c)},x=(e=t)=>{let n=Gn(e.props),r=e.target=Yn(e.props,m),a=tr(r,e,h,p);r&&(o!==`svg`&&qn(r)?o=`svg`:o!==`mathml`&&Jn(r)&&(o=`mathml`),i&&i.isCE&&(i.ce._teleportTargets||(i.ce._teleportTargets=new Set)).add(r),n||(b(e,r,a),er(e,!1)))},S=e=>{let t=()=>{if(Hn.get(e)===t){if(Hn.delete(e),Gn(e.props)){let t=_(e.el)||n;b(e,t,e.anchor),er(e,!0)}x(e)}};Hn.set(e,t),Ai(t,a)};if(e==null){let e=t.el=h(``),i=t.anchor=h(``);if(p(e,n,r),p(i,n,r),Kn(t.props)||a&&a.pendingBranch){S(t);return}v&&(b(t,n,i),er(t,!0)),x()}else{t.el=e.el;let r=t.anchor=e.anchor,u=Hn.get(e);if(u){u.flags|=8,Hn.delete(e),S(t);return}t.targetStart=e.targetStart;let p=t.target=e.target,h=t.targetAnchor=e.targetAnchor,g=Gn(e.props),_=g?n:p,b=g?r:h;if(o===`svg`||qn(p)?o=`svg`:(o===`mathml`||Jn(p))&&(o=`mathml`),y?(f(e.dynamicChildren,y,_,i,a,o,s),Ii(e,t,!0)):c||d(e,t,_,b,i,a,o,s,!1),v)g?t.props&&e.props&&t.props.to!==e.props.to&&(t.props.to=e.props.to):Zn(t,n,r,l,1);else if((t.props&&t.props.to)!==(e.props&&e.props.to)){let e=Yn(t.props,m);e&&(t.target=e,Zn(t,e,null,l,0))}else g&&Zn(t,p,h,l,1);er(t,v)}},remove(e,t,n,{um:r,o:{remove:i}},a){let{shapeFlag:o,children:s,anchor:c,targetStart:l,targetAnchor:u,target:d,props:f}=e,p=Gn(f),m=a||!p,h=Hn.get(e);if(h&&(h.flags|=8,Hn.delete(e)),d&&(i(l),i(u)),a&&i(c),!h&&(p||d)&&o&16)for(let e=0;e<s.length;e++){let i=s[e];r(i,t,n,m,!!i.dynamicChildren)}},move:Zn,hydrate:Qn};function Zn(e,t,n,{o:{insert:r},m:i},a=2){a===0&&r(e.targetAnchor,t,n);let{el:o,anchor:s,shapeFlag:c,children:l,props:u}=e,d=a===2;if(d&&r(o,t,n),!Hn.has(e)&&(!d||Gn(u))&&c&16)for(let e=0;e<l.length;e++)i(l[e],t,n,2);d&&r(s,t,n)}function Qn(e,t,n,r,i,a,{o:{nextSibling:o,parentNode:s,querySelector:c,insert:l,createText:u}},d){function f(e,n){let r=n;for(;r;){if(r&&r.nodeType===8){if(r.data===`teleport start anchor`)t.targetStart=r;else if(r.data===`teleport anchor`){t.targetAnchor=r,e._lpa=t.targetAnchor&&o(t.targetAnchor);break}}r=o(r)}}function p(e,t){t.anchor=d(o(e),t,s(e),n,r,i,a)}let m=t.target=Yn(t.props,c),h=Gn(t.props);if(m){let c=m._lpa||m.firstChild;t.shapeFlag&16&&(h?(p(e,t),f(m,c),t.targetAnchor||tr(m,t,u,l,s(e)===m?e:null)):(t.anchor=o(e),f(m,c),t.targetAnchor||tr(m,t,u,l),d(c&&o(c),t,m,n,r,i,a))),er(t,h)}else h&&t.shapeFlag&16&&(p(e,t),t.targetStart=e,t.targetAnchor=o(e));return t.anchor&&o(t.anchor)}var $n=Xn;function er(e,t){let n=e.ctx;if(n&&n.ut){let r,i;for(t?(r=e.el,i=e.anchor):(r=e.targetStart,i=e.targetAnchor);r&&r!==i;)r.nodeType===1&&r.setAttribute(`data-v-owner`,n.uid),r=r.nextSibling;n.ut()}}function tr(e,t,n,r,i=null){let a=t.targetStart=n(``),o=t.targetAnchor=n(``);return a[Un]=o,e&&(r(a,e,i),r(o,e,i)),o}var nr=Symbol(`_leaveCb`);function rr(e,t){e.shapeFlag&6&&e.component?(e.transition=t,rr(e.component.subTree,t)):e.shapeFlag&128?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t}function ir(e,t){return h(e)?s({name:e.name},t,{setup:e}):e}function ar(e){e.ids=[e.ids[0]+e.ids[2]+++`-`,0,0]}function or(e,t){let n;return!!((n=Object.getOwnPropertyDescriptor(e,t))&&!n.configurable)}var sr=new WeakMap;function cr(e,n,r,a,o=!1){if(d(e)){e.forEach((e,t)=>cr(e,n&&(d(n)?n[t]:n),r,a,o));return}if(ur(a)&&!o){a.shapeFlag&512&&a.type.__asyncResolved&&a.component.subTree.component&&cr(e,n,r,a.component.subTree);return}let s=a.shapeFlag&4?Pa(a.component):a.el,l=o?null:s,{i:f,r:p}=e,m=n&&n.r,_=f.refs===t?f.refs={}:f.refs,v=f.setupState,y=L(v),b=v===t?i:e=>!or(_,e)&&u(y,e),x=(e,t)=>!(t&&or(_,t));if(m!=null&&m!==p){if(lr(n),g(m))_[m]=null,b(m)&&(v[m]=null);else if(R(m)){let e=n;x(m,e.k)&&(m.value=null),e.k&&(_[e.k]=null)}}if(h(p))cn(p,f,12,[l,_]);else{let t=g(p),n=R(p);if(t||n){let i=()=>{if(e.f){let n=t?b(p)?v[p]:_[p]:x(p)||!e.k?p.value:_[e.k];if(o)d(n)&&c(n,s);else if(d(n))n.includes(s)||n.push(s);else if(t)_[p]=[s],b(p)&&(v[p]=_[p]);else{let t=[s];x(p,e.k)&&(p.value=t),e.k&&(_[e.k]=t)}}else t?(_[p]=l,b(p)&&(v[p]=l)):n&&(x(p,e.k)&&(p.value=l),e.k&&(_[e.k]=l))};if(l){let t=()=>{i(),sr.delete(e)};t.id=-1,sr.set(e,t),Ai(t,r)}else lr(e),i()}}}function lr(e){let t=sr.get(e);t&&(t.flags|=8,sr.delete(e))}ae().requestIdleCallback,ae().cancelIdleCallback;var ur=e=>!!e.type.__asyncLoader,dr=e=>e.type.__isKeepAlive;function fr(e,t){mr(e,`a`,t)}function pr(e,t){mr(e,`da`,t)}function mr(e,t,n=va){let r=e.__wdc||=()=>{let t=n;for(;t;){if(t.isDeactivated)return;t=t.parent}return e()};if(gr(t,r,n),n){let e=n.parent;for(;e&&e.parent;)dr(e.parent.vnode)&&hr(r,t,n,e),e=e.parent}}function hr(e,t,n,r){let i=gr(t,e,r,!0);Cr(()=>{c(r[t],i)},n)}function gr(e,t,n=va,r=!1){if(n){let i=n[e]||(n[e]=[]),a=t.__weh||=(...r)=>{Ve();let i=Sa(n),a=ln(t,n,e,r);return i(),He(),a};return r?i.unshift(a):i.push(a),a}}var _r=e=>(t,n=va)=>{(!Ta||e===`sp`)&&gr(e,(...e)=>t(...e),n)},vr=_r(`bm`),yr=_r(`m`),br=_r(`bu`),xr=_r(`u`),Sr=_r(`bum`),Cr=_r(`um`),wr=_r(`sp`),Tr=_r(`rtg`),Er=_r(`rtc`);function Dr(e,t=va){gr(`ec`,e,t)}var Or=Symbol.for(`v-ndc`);function kr(e,t,n,r){let i,a=n&&n[r],o=d(e);if(o||g(e)){let n=o&&Lt(e),r=!1,s=!1;n&&(r=!zt(e),s=Rt(e),e=tt(e)),i=Array(e.length);for(let n=0,o=e.length;n<o;n++)i[n]=t(r?s?Ut(Ht(e[n])):Ht(e[n]):e[n],n,void 0,a&&a[n])}else if(typeof e==`number`){i=Array(e);for(let n=0;n<e;n++)i[n]=t(n+1,n,void 0,a&&a[n])}else if(v(e))if(e[Symbol.iterator])i=Array.from(e,(e,n)=>t(e,n,void 0,a&&a[n]));else{let n=Object.keys(e);i=Array(n.length);for(let r=0,o=n.length;r<o;r++){let o=n[r];i[r]=t(e[o],o,r,a&&a[r])}}else i=[];return n&&(n[r]=i),i}var Ar=e=>e?wa(e)?Pa(e):Ar(e.parent):null,jr=s(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>Ar(e.parent),$root:e=>Ar(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>Br(e),$forceUpdate:e=>e.f||=()=>{bn(e.update)},$nextTick:e=>e.n||=vn.bind(e.proxy),$watch:e=>Bn.bind(e)}),Mr=(e,n)=>e!==t&&!e.__isScriptSetup&&u(e,n),Nr={get({_:e},n){if(n===`__v_skip`)return!0;let{ctx:r,setupState:i,data:a,props:o,accessCache:s,type:c,appContext:l}=e;if(n[0]!==`$`){let e=s[n];if(e!==void 0)switch(e){case 1:return i[n];case 2:return a[n];case 4:return r[n];case 3:return o[n]}else if(Mr(i,n))return s[n]=1,i[n];else if(a!==t&&u(a,n))return s[n]=2,a[n];else if(u(o,n))return s[n]=3,o[n];else if(r!==t&&u(r,n))return s[n]=4,r[n];else Fr&&(s[n]=0)}let d=jr[n],f,p;if(d)return n===`$attrs`&&I(e.attrs,`get`,``),d(e);if((f=c.__cssModules)&&(f=f[n]))return f;if(r!==t&&u(r,n))return s[n]=4,r[n];if(p=l.config.globalProperties,u(p,n))return p[n]},set({_:e},n,r){let{data:i,setupState:a,ctx:o}=e;return Mr(a,n)?(a[n]=r,!0):i!==t&&u(i,n)?(i[n]=r,!0):u(e.props,n)||n[0]===`$`&&n.slice(1)in e?!1:(o[n]=r,!0)},has({_:{data:e,setupState:n,accessCache:r,ctx:i,appContext:a,props:o,type:s}},c){let l;return!!(r[c]||e!==t&&c[0]!==`$`&&u(e,c)||Mr(n,c)||u(o,c)||u(i,c)||u(jr,c)||u(a.config.globalProperties,c)||(l=s.__cssModules)&&l[c])},defineProperty(e,t,n){return n.get==null?u(n,`value`)&&this.set(e,t,n.value,null):e._.accessCache[t]=0,Reflect.defineProperty(e,t,n)}};function Pr(e){return d(e)?e.reduce((e,t)=>(e[t]=null,e),{}):e}var Fr=!0;function Ir(e){let t=Br(e),n=e.proxy,i=e.ctx;Fr=!1,t.beforeCreate&&Rr(t.beforeCreate,e,`bc`);let{data:a,computed:o,methods:s,watch:c,provide:l,inject:u,created:f,beforeMount:p,mounted:m,beforeUpdate:g,updated:_,activated:y,deactivated:b,beforeDestroy:x,beforeUnmount:S,destroyed:C,unmounted:w,render:T,renderTracked:ee,renderTriggered:E,errorCaptured:D,serverPrefetch:te,expose:O,inheritAttrs:k,components:A,directives:j,filters:ne}=t;if(u&&Lr(u,i,null),s)for(let e in s){let t=s[e];h(t)&&(i[e]=t.bind(n))}if(a){let t=a.call(n,n);v(t)&&(e.data=Nt(t))}if(Fr=!0,o)for(let e in o){let t=o[e],a=G({get:h(t)?t.bind(n,n):h(t.get)?t.get.bind(n,n):r,set:!h(t)&&h(t.set)?t.set.bind(n):r});Object.defineProperty(i,e,{enumerable:!0,configurable:!0,get:()=>a.value,set:e=>a.value=e})}if(c)for(let e in c)zr(c[e],i,n,e);if(l){let e=h(l)?l.call(n):l;Reflect.ownKeys(e).forEach(t=>{Nn(t,e[t])})}f&&Rr(f,e,`c`);function M(e,t){d(t)?t.forEach(t=>e(t.bind(n))):t&&e(t.bind(n))}if(M(vr,p),M(yr,m),M(br,g),M(xr,_),M(fr,y),M(pr,b),M(Dr,D),M(Er,ee),M(Tr,E),M(Sr,S),M(Cr,w),M(wr,te),d(O))if(O.length){let t=e.exposed||={};O.forEach(e=>{Object.defineProperty(t,e,{get:()=>n[e],set:t=>n[e]=t,enumerable:!0})})}else e.exposed||={};T&&e.render===r&&(e.render=T),k!=null&&(e.inheritAttrs=k),A&&(e.components=A),j&&(e.directives=j),te&&ar(e)}function Lr(e,t,n=r){d(e)&&(e=Gr(e));for(let n in e){let r=e[n],i;i=v(r)?`default`in r?Pn(r.from||n,r.default,!0):Pn(r.from||n):Pn(r),R(i)?Object.defineProperty(t,n,{enumerable:!0,configurable:!0,get:()=>i.value,set:e=>i.value=e}):t[n]=i}}function Rr(e,t,n){ln(d(e)?e.map(e=>e.bind(t.proxy)):e.bind(t.proxy),t,n)}function zr(e,t,n,r){let i=r.includes(`.`)?Vn(n,r):()=>n[r];if(g(e)){let n=t[e];h(n)&&Rn(i,n)}else if(h(e))Rn(i,e.bind(n));else if(v(e))if(d(e))e.forEach(e=>zr(e,t,n,r));else{let r=h(e.handler)?e.handler.bind(n):t[e.handler];h(r)&&Rn(i,r,e)}}function Br(e){let t=e.type,{mixins:n,extends:r}=t,{mixins:i,optionsCache:a,config:{optionMergeStrategies:o}}=e.appContext,s=a.get(t),c;return s?c=s:!i.length&&!n&&!r?c=t:(c={},i.length&&i.forEach(e=>Vr(c,e,o,!0)),Vr(c,t,o)),v(t)&&a.set(t,c),c}function Vr(e,t,n,r=!1){let{mixins:i,extends:a}=t;a&&Vr(e,a,n,!0),i&&i.forEach(t=>Vr(e,t,n,!0));for(let i in t)if(!(r&&i===`expose`)){let r=Hr[i]||n&&n[i];e[i]=r?r(e[i],t[i]):t[i]}return e}var Hr={data:Ur,props:Jr,emits:Jr,methods:qr,computed:qr,beforeCreate:Kr,created:Kr,beforeMount:Kr,mounted:Kr,beforeUpdate:Kr,updated:Kr,beforeDestroy:Kr,beforeUnmount:Kr,destroyed:Kr,unmounted:Kr,activated:Kr,deactivated:Kr,errorCaptured:Kr,serverPrefetch:Kr,components:qr,directives:qr,watch:Yr,provide:Ur,inject:Wr};function Ur(e,t){return t?e?function(){return s(h(e)?e.call(this,this):e,h(t)?t.call(this,this):t)}:t:e}function Wr(e,t){return qr(Gr(e),Gr(t))}function Gr(e){if(d(e)){let t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function Kr(e,t){return e?[...new Set([].concat(e,t))]:t}function qr(e,t){return e?s(Object.create(null),e,t):t}function Jr(e,t){return e?d(e)&&d(t)?[...new Set([...e,...t])]:s(Object.create(null),Pr(e),Pr(t??{})):t}function Yr(e,t){if(!e)return t;if(!t)return e;let n=s(Object.create(null),e);for(let r in t)n[r]=Kr(e[r],t[r]);return n}function Xr(){return{app:null,config:{isNativeTag:i,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}var Zr=0;function Qr(e,t){return function(n,r=null){h(n)||(n=s({},n)),r!=null&&!v(r)&&(r=null);let i=Xr(),a=new WeakSet,o=[],c=!1,l=i.app={_uid:Zr++,_component:n,_props:r,_container:null,_context:i,_instance:null,version:Ia,get config(){return i.config},set config(e){},use(e,...t){return a.has(e)||(e&&h(e.install)?(a.add(e),e.install(l,...t)):h(e)&&(a.add(e),e(l,...t))),l},mixin(e){return i.mixins.includes(e)||i.mixins.push(e),l},component(e,t){return t?(i.components[e]=t,l):i.components[e]},directive(e,t){return t?(i.directives[e]=t,l):i.directives[e]},mount(a,o,s){if(!c){let u=l._ceVNode||ia(n,r);return u.appContext=i,s===!0?s=`svg`:s===!1&&(s=void 0),o&&t?t(u,a):e(u,a,s),c=!0,l._container=a,a.__vue_app__=l,Pa(u.component)}},onUnmount(e){o.push(e)},unmount(){c&&(ln(o,l._instance,16),e(null,l._container),delete l._container.__vue_app__)},provide(e,t){return i.provides[e]=t,l},runWithContext(e){let t=$r;$r=l;try{return e()}finally{$r=t}}};return l}}var $r=null,ei=(e,t)=>t===`modelValue`||t===`model-value`?e.modelModifiers:e[`${t}Modifiers`]||e[`${D(t)}Modifiers`]||e[`${O(t)}Modifiers`];function ti(e,n,...r){if(e.isUnmounted)return;let i=e.vnode.props||t,a=r,o=n.startsWith(`update:`),s=o&&ei(i,n.slice(7));s&&(s.trim&&(a=r.map(e=>g(e)?e.trim():e)),s.number&&(a=r.map(re)));let c,l=i[c=A(n)]||i[c=A(D(n))];!l&&o&&(l=i[c=A(O(n))]),l&&ln(l,e,6,a);let u=i[c+`Once`];if(u){if(!e.emitted)e.emitted={};else if(e.emitted[c])return;e.emitted[c]=!0,ln(u,e,6,a)}}var ni=new WeakMap;function ri(e,t,n=!1){let r=n?ni:t.emitsCache,i=r.get(e);if(i!==void 0)return i;let a=e.emits,o={},c=!1;if(!h(e)){let r=e=>{let n=ri(e,t,!0);n&&(c=!0,s(o,n))};!n&&t.mixins.length&&t.mixins.forEach(r),e.extends&&r(e.extends),e.mixins&&e.mixins.forEach(r)}return!a&&!c?(v(e)&&r.set(e,null),null):(d(a)?a.forEach(e=>o[e]=null):s(o,a),v(e)&&r.set(e,o),o)}function ii(e,t){return!e||!a(t)?!1:(t=t.slice(2),t=t===`Once`?t:t.replace(/Once$/,``),u(e,t[0].toLowerCase()+t.slice(1))||u(e,O(t))||u(e,t))}function ai(e){let{type:t,vnode:n,proxy:r,withProxy:i,propsOptions:[a],slots:s,attrs:c,emit:l,render:u,renderCache:d,props:f,data:p,setupState:m,ctx:h,inheritAttrs:g}=e,_=kn(e),v,y;try{if(n.shapeFlag&4){let e=i||r,t=e;v=ua(u.call(t,e,d,f,m,p,h)),y=c}else{let e=t;v=ua(e.length>1?e(f,{attrs:c,slots:s,emit:l}):e(f,null)),y=t.props?c:oi(c)}}catch(t){qi.length=0,un(t,e,1),v=ia(Gi)}let b=v;if(y&&g!==!1){let e=Object.keys(y),{shapeFlag:t}=b;e.length&&t&7&&(a&&e.some(o)&&(y=si(y,a)),b=sa(b,y,!1,!0))}return n.dirs&&(b=sa(b,null,!1,!0),b.dirs=b.dirs?b.dirs.concat(n.dirs):n.dirs),n.transition&&rr(b,n.transition),v=b,kn(_),v}var oi=e=>{let t;for(let n in e)(n===`class`||n===`style`||a(n))&&((t||={})[n]=e[n]);return t},si=(e,t)=>{let n={};for(let r in e)(!o(r)||!(r.slice(9)in t))&&(n[r]=e[r]);return n};function ci(e,t,n){let{props:r,children:i,component:a}=e,{props:o,children:s,patchFlag:c}=t,l=a.emitsOptions;if(t.dirs||t.transition)return!0;if(n&&c>=0){if(c&1024)return!0;if(c&16)return r?li(r,o,l):!!o;if(c&8){let e=t.dynamicProps;for(let t=0;t<e.length;t++){let n=e[t];if(ui(o,r,n)&&!ii(l,n))return!0}}}else return(i||s)&&(!s||!s.$stable)?!0:r===o?!1:r?!o||li(r,o,l):!!o;return!1}function li(e,t,n){let r=Object.keys(t);if(r.length!==Object.keys(e).length)return!0;for(let i=0;i<r.length;i++){let a=r[i];if(ui(t,e,a)&&!ii(n,a))return!0}return!1}function ui(e,t,n){let r=e[n],i=t[n];return n===`style`&&v(r)&&v(i)?!ge(r,i):r!==i}function di({vnode:e,parent:t,suspense:n},r){for(;t;){let n=t.subTree;if(n.suspense&&n.suspense.activeBranch===e&&(n.suspense.vnode.el=n.el=r,e=n),n===e)(e=t.vnode).el=r,t=t.parent;else break}n&&n.activeBranch===e&&(n.vnode.el=r)}var fi={},pi=()=>Object.create(fi),mi=e=>Object.getPrototypeOf(e)===fi;function hi(e,t,n,r=!1){let i={},a=pi();e.propsDefaults=Object.create(null),_i(e,t,i,a);for(let t in e.propsOptions[0])t in i||(i[t]=void 0);n?e.props=r?i:Pt(i):e.type.props?e.props=i:e.props=a,e.attrs=a}function gi(e,t,n,r){let{props:i,attrs:a,vnode:{patchFlag:o}}=e,s=L(i),[c]=e.propsOptions,l=!1;if((r||o>0)&&!(o&16)){if(o&8){let n=e.vnode.dynamicProps;for(let r=0;r<n.length;r++){let o=n[r];if(ii(e.emitsOptions,o))continue;let d=t[o];if(c)if(u(a,o))d!==a[o]&&(a[o]=d,l=!0);else{let t=D(o);i[t]=vi(c,s,t,d,e,!1)}else d!==a[o]&&(a[o]=d,l=!0)}}}else{_i(e,t,i,a)&&(l=!0);let r;for(let a in s)(!t||!u(t,a)&&((r=O(a))===a||!u(t,r)))&&(c?n&&(n[a]!==void 0||n[r]!==void 0)&&(i[a]=vi(c,s,a,void 0,e,!0)):delete i[a]);if(a!==s)for(let e in a)(!t||!u(t,e))&&(delete a[e],l=!0)}l&&Qe(e.attrs,`set`,``)}function _i(e,n,r,i){let[a,o]=e.propsOptions,s=!1,c;if(n)for(let t in n){if(T(t))continue;let l=n[t],d;a&&u(a,d=D(t))?!o||!o.includes(d)?r[d]=l:(c||={})[d]=l:ii(e.emitsOptions,t)||(!(t in i)||l!==i[t])&&(i[t]=l,s=!0)}if(o){let n=L(r),i=c||t;for(let t=0;t<o.length;t++){let s=o[t];r[s]=vi(a,n,s,i[s],e,!u(i,s))}}return s}function vi(e,t,n,r,i,a){let o=e[n];if(o!=null){let e=u(o,`default`);if(e&&r===void 0){let e=o.default;if(o.type!==Function&&!o.skipFactory&&h(e)){let{propsDefaults:a}=i;if(n in a)r=a[n];else{let o=Sa(i);r=a[n]=e.call(null,t),o()}}else r=e;i.ce&&i.ce._setProp(n,r)}o[0]&&(a&&!e?r=!1:o[1]&&(r===``||r===O(n))&&(r=!0))}return r}var yi=new WeakMap;function bi(e,r,i=!1){let a=i?yi:r.propsCache,o=a.get(e);if(o)return o;let c=e.props,l={},f=[],p=!1;if(!h(e)){let t=e=>{p=!0;let[t,n]=bi(e,r,!0);s(l,t),n&&f.push(...n)};!i&&r.mixins.length&&r.mixins.forEach(t),e.extends&&t(e.extends),e.mixins&&e.mixins.forEach(t)}if(!c&&!p)return v(e)&&a.set(e,n),n;if(d(c))for(let e=0;e<c.length;e++){let n=D(c[e]);xi(n)&&(l[n]=t)}else if(c)for(let e in c){let t=D(e);if(xi(t)){let n=c[e],r=l[t]=d(n)||h(n)?{type:n}:s({},n),i=r.type,a=!1,o=!0;if(d(i))for(let e=0;e<i.length;++e){let t=i[e],n=h(t)&&t.name;if(n===`Boolean`){a=!0;break}else n===`String`&&(o=!1)}else a=h(i)&&i.name===`Boolean`;r[0]=a,r[1]=o,(a||u(r,`default`))&&f.push(t)}}let m=[l,f];return v(e)&&a.set(e,m),m}function xi(e){return e[0]!==`$`&&!T(e)}var Si=e=>e===`_`||e===`_ctx`||e===`$stable`,Ci=e=>d(e)?e.map(ua):[ua(e)],wi=(e,t,n)=>{if(t._n)return t;let r=An((...e)=>Ci(t(...e)),n);return r._c=!1,r},Ti=(e,t,n)=>{let r=e._ctx;for(let n in e){if(Si(n))continue;let i=e[n];if(h(i))t[n]=wi(n,i,r);else if(i!=null){let e=Ci(i);t[n]=()=>e}}},Ei=(e,t)=>{let n=Ci(t);e.slots.default=()=>n},Di=(e,t,n)=>{for(let r in t)(n||!Si(r))&&(e[r]=t[r])},Oi=(e,t,n)=>{let r=e.slots=pi();if(e.vnode.shapeFlag&32){let e=t._;e?(Di(r,t,n),n&&M(r,`_`,e,!0)):Ti(t,r)}else t&&Ei(e,t)},ki=(e,n,r)=>{let{vnode:i,slots:a}=e,o=!0,s=t;if(i.shapeFlag&32){let e=n._;e?r&&e===1?o=!1:Di(a,n,r):(o=!n.$stable,Ti(n,a)),s=n}else n&&(Ei(e,n),s={default:1});if(o)for(let e in a)!Si(e)&&s[e]==null&&delete a[e]},Ai=Hi;function ji(e){return Mi(e)}function Mi(e,i){let a=ae();a.__VUE__=!0;let{insert:o,remove:s,patchProp:c,createElement:l,createText:u,createComment:d,setText:f,setElementText:p,parentNode:m,nextSibling:h,setScopeId:g=r,insertStaticContent:_}=e,v=(e,t,n,r=null,i=null,a=null,o=void 0,s=null,c=!!t.dynamicChildren)=>{if(e===t)return;e&&!ta(e,t)&&(r=ge(e),de(e,i,a,!0),e=null),t.patchFlag===-2&&(c=!1,t.dynamicChildren=null);let{type:l,ref:u,shapeFlag:d}=t;switch(l){case Wi:y(e,t,n,r);break;case Gi:b(e,t,n,r);break;case Ki:e??x(t,n,r,o);break;case Ui:A(e,t,n,r,i,a,o,s,c);break;default:d&1?w(e,t,n,r,i,a,o,s,c):d&6?j(e,t,n,r,i,a,o,s,c):(d&64||d&128)&&l.process(e,t,n,r,i,a,o,s,c,N)}u!=null&&i?cr(u,e&&e.ref,a,t||e,!t):u==null&&e&&e.ref!=null&&cr(e.ref,null,a,e,!0)},y=(e,t,n,r)=>{if(e==null)o(t.el=u(t.children),n,r);else{let n=t.el=e.el;t.children!==e.children&&f(n,t.children)}},b=(e,t,n,r)=>{e==null?o(t.el=d(t.children||``),n,r):t.el=e.el},x=(e,t,n,r)=>{[e.el,e.anchor]=_(e.children,t,n,r,e.el,e.anchor)},S=({el:e,anchor:t},n,r)=>{let i;for(;e&&e!==t;)i=h(e),o(e,n,r),e=i;o(t,n,r)},C=({el:e,anchor:t})=>{let n;for(;e&&e!==t;)n=h(e),s(e),e=n;s(t)},w=(e,t,n,r,i,a,o,s,c)=>{if(t.type===`svg`?o=`svg`:t.type===`math`&&(o=`mathml`),e==null)ee(t,n,r,i,a,o,s,c);else{let n=e.el&&e.el._isVueCE?e.el:null;try{n&&n._beginPatch(),te(e,t,i,a,o,s,c)}finally{n&&n._endPatch()}}},ee=(e,t,n,r,i,a,s,u)=>{let d,f,{props:m,shapeFlag:h,transition:g,dirs:_}=e;if(d=e.el=l(e.type,a,m&&m.is,m),h&8?p(d,e.children):h&16&&D(e.children,d,null,r,i,Ni(e,a),s,u),_&&Mn(e,null,r,`created`),E(d,e,e.scopeId,s,r),m){for(let e in m)e!==`value`&&!T(e)&&c(d,e,null,m[e],a,r);`value`in m&&c(d,`value`,null,m.value,a),(f=m.onVnodeBeforeMount)&&ma(f,r,e)}_&&Mn(e,null,r,`beforeMount`);let v=Fi(i,g);v&&g.beforeEnter(d),o(d,t,n),((f=m&&m.onVnodeMounted)||v||_)&&Ai(()=>{try{f&&ma(f,r,e),v&&g.enter(d),_&&Mn(e,null,r,`mounted`)}finally{}},i)},E=(e,t,n,r,i)=>{if(n&&g(e,n),r)for(let t=0;t<r.length;t++)g(e,r[t]);if(i){let n=i.subTree;if(t===n||Vi(n.type)&&(n.ssContent===t||n.ssFallback===t)){let t=i.vnode;E(e,t,t.scopeId,t.slotScopeIds,i.parent)}}},D=(e,t,n,r,i,a,o,s,c=0)=>{for(let l=c;l<e.length;l++){let c=e[l]=s?da(e[l]):ua(e[l]);v(null,c,t,n,r,i,a,o,s)}},te=(e,n,r,i,a,o,s)=>{let l=n.el=e.el,{patchFlag:u,dynamicChildren:d,dirs:f}=n;u|=e.patchFlag&16;let m=e.props||t,h=n.props||t,g;if(r&&Pi(r,!1),(g=h.onVnodeBeforeUpdate)&&ma(g,r,n,e),f&&Mn(n,e,r,`beforeUpdate`),r&&Pi(r,!0),d&&(!e.dynamicChildren||e.dynamicChildren.length!==d.length)&&(u=0,s=!1,d=null),(m.innerHTML&&h.innerHTML==null||m.textContent&&h.textContent==null)&&p(l,``),d?O(e.dynamicChildren,d,l,r,i,Ni(n,a),o):s||se(e,n,l,null,r,i,Ni(n,a),o,!1),u>0){if(u&16)k(l,m,h,r,a);else if(u&2&&m.class!==h.class&&c(l,`class`,null,h.class,a),u&4&&c(l,`style`,m.style,h.style,a),u&8){let e=n.dynamicProps;for(let t=0;t<e.length;t++){let n=e[t],i=m[n],o=h[n];(o!==i||n===`value`)&&c(l,n,i,o,a,r)}}u&1&&e.children!==n.children&&p(l,n.children)}else!s&&d==null&&k(l,m,h,r,a);((g=h.onVnodeUpdated)||f)&&Ai(()=>{g&&ma(g,r,n,e),f&&Mn(n,e,r,`updated`)},i)},O=(e,t,n,r,i,a,o)=>{for(let s=0;s<t.length;s++){let c=e[s],l=t[s],u=c.el&&(c.type===Ui||!ta(c,l)||c.shapeFlag&198)?m(c.el):n;v(c,l,u,null,r,i,a,o,!0)}},k=(e,n,r,i,a)=>{if(n!==r){if(n!==t)for(let t in n)!T(t)&&!(t in r)&&c(e,t,n[t],null,a,i);for(let t in r){if(T(t))continue;let o=r[t],s=n[t];o!==s&&t!==`value`&&c(e,t,s,o,a,i)}`value`in r&&c(e,`value`,n.value,r.value,a)}},A=(e,t,n,r,i,a,s,c,l)=>{let d=t.el=e?e.el:u(``),f=t.anchor=e?e.anchor:u(``),{patchFlag:p,dynamicChildren:m,slotScopeIds:h}=t;h&&(c=c?c.concat(h):h),e==null?(o(d,n,r),o(f,n,r),D(t.children||[],n,f,i,a,s,c,l)):p>0&&p&64&&m&&e.dynamicChildren&&e.dynamicChildren.length===m.length?(O(e.dynamicChildren,m,n,i,a,s,c),(t.key!=null||i&&t===i.subTree)&&Ii(e,t,!0)):se(e,t,n,f,i,a,s,c,l)},j=(e,t,n,r,i,a,o,s,c)=>{t.slotScopeIds=s,e==null?t.shapeFlag&512?i.ctx.activate(t,n,r,o,c):M(t,n,r,i,a,o,c):re(e,t,c)},M=(e,t,n,r,i,a,o)=>{let s=e.component=_a(e,r,i);if(dr(e)&&(s.ctx.renderer=N),Ea(s,!1,o),s.asyncDep){if(i&&i.registerDep(s,ie,o),!e.el){let r=s.subTree=ia(Gi);b(null,r,t,n),e.placeholder=r.el}}else ie(s,e,t,n,i,a,o)},re=(e,t,n)=>{let r=t.component=e.component;if(ci(e,t,n))if(r.asyncDep&&!r.asyncResolved){oe(r,t,n);return}else r.next=t,r.update();else t.el=e.el,r.vnode=t},ie=(e,t,n,r,i,a,o)=>{let s=()=>{if(e.isMounted){let{next:t,bu:n,u:r,parent:s,vnode:c}=e;{let n=Ri(e);if(n){t&&(t.el=c.el,oe(e,t,o)),n.asyncDep.then(()=>{Ai(()=>{e.isUnmounted||l()},i)});return}}let u=t,d;Pi(e,!1),t?(t.el=c.el,oe(e,t,o)):t=c,n&&ne(n),(d=t.props&&t.props.onVnodeBeforeUpdate)&&ma(d,s,t,c),Pi(e,!0);let f=ai(e),p=e.subTree;e.subTree=f,v(p,f,m(p.el),ge(p),e,i,a),t.el=f.el,u===null&&di(e,f.el),r&&Ai(r,i),(d=t.props&&t.props.onVnodeUpdated)&&Ai(()=>ma(d,s,t,c),i)}else{let o,{el:s,props:c}=t,{bm:l,m:u,parent:d,root:f,type:p}=e,m=ur(t);if(Pi(e,!1),l&&ne(l),!m&&(o=c&&c.onVnodeBeforeMount)&&ma(o,d,t),Pi(e,!0),s&&be){let t=()=>{e.subTree=ai(e),be(s,e.subTree,e,i,null)};m&&p.__asyncHydrate?p.__asyncHydrate(s,e,t):t()}else{f.ce&&f.ce._hasShadowRoot()&&f.ce._injectChildStyle(p,e.parent?e.parent.type:void 0);let o=e.subTree=ai(e);v(null,o,n,r,e,i,a),t.el=o.el}if(u&&Ai(u,i),!m&&(o=c&&c.onVnodeMounted)){let e=t;Ai(()=>ma(o,d,e),i)}(t.shapeFlag&256||d&&ur(d.vnode)&&d.vnode.shapeFlag&256)&&e.a&&Ai(e.a,i),e.isMounted=!0,t=n=r=null}};e.scope.on();let c=e.effect=new Ee(s);e.scope.off();let l=e.update=c.run.bind(c),u=e.job=c.runIfDirty.bind(c);u.i=e,u.id=e.uid,c.scheduler=()=>bn(u),Pi(e,!0),l()},oe=(e,t,n)=>{t.component=e;let r=e.vnode.props;e.vnode=t,e.next=null,gi(e,t.props,r,n),ki(e,t.children,n),Ve(),Cn(e),He()},se=(e,t,n,r,i,a,o,s,c=!1)=>{let l=e&&e.children,u=e?e.shapeFlag:0,d=t.children,{patchFlag:f,shapeFlag:m}=t;if(f>0){if(f&128){le(l,d,n,r,i,a,o,s,c);return}else if(f&256){ce(l,d,n,r,i,a,o,s,c);return}}m&8?(u&16&&he(l,i,a),d!==l&&p(n,d)):u&16?m&16?le(l,d,n,r,i,a,o,s,c):he(l,i,a,!0):(u&8&&p(n,``),m&16&&D(d,n,r,i,a,o,s,c))},ce=(e,t,r,i,a,o,s,c,l)=>{e||=n,t||=n;let u=e.length,d=t.length,f=Math.min(u,d),p;for(p=0;p<f;p++){let n=t[p]=l?da(t[p]):ua(t[p]);v(e[p],n,r,null,a,o,s,c,l)}u>d?he(e,a,o,!0,!1,f):D(t,r,i,a,o,s,c,l,f)},le=(e,t,r,i,a,o,s,c,l)=>{let u=0,d=t.length,f=e.length-1,p=d-1;for(;u<=f&&u<=p;){let n=e[u],i=t[u]=l?da(t[u]):ua(t[u]);if(ta(n,i))v(n,i,r,null,a,o,s,c,l);else break;u++}for(;u<=f&&u<=p;){let n=e[f],i=t[p]=l?da(t[p]):ua(t[p]);if(ta(n,i))v(n,i,r,null,a,o,s,c,l);else break;f--,p--}if(u>f){if(u<=p){let e=p+1,n=e<d?t[e].el:i;for(;u<=p;)v(null,t[u]=l?da(t[u]):ua(t[u]),r,n,a,o,s,c,l),u++}}else if(u>p)for(;u<=f;)de(e[u],a,o,!0),u++;else{let m=u,h=u,g=new Map;for(u=h;u<=p;u++){let e=t[u]=l?da(t[u]):ua(t[u]);e.key!=null&&g.set(e.key,u)}let _,y=0,b=p-h+1,x=!1,S=0,C=Array(b);for(u=0;u<b;u++)C[u]=0;for(u=m;u<=f;u++){let n=e[u];if(y>=b){de(n,a,o,!0);continue}let i;if(n.key!=null)i=g.get(n.key);else for(_=h;_<=p;_++)if(C[_-h]===0&&ta(n,t[_])){i=_;break}i===void 0?de(n,a,o,!0):(C[i-h]=u+1,i>=S?S=i:x=!0,v(n,t[i],r,null,a,o,s,c,l),y++)}let w=x?Li(C):n;for(_=w.length-1,u=b-1;u>=0;u--){let e=h+u,n=t[e],f=t[e+1],p=e+1<d?f.el||Bi(f):i;C[u]===0?v(null,n,r,p,a,o,s,c,l):x&&(_<0||u!==w[_]?ue(n,r,p,2):_--)}}},ue=(e,t,n,r,i=null)=>{let{el:a,type:c,transition:l,children:u,shapeFlag:d}=e;if(d&6){ue(e.component.subTree,t,n,r);return}if(d&128){e.suspense.move(t,n,r);return}if(d&64){c.move(e,t,n,N);return}if(c===Ui){o(a,t,n);for(let e=0;e<u.length;e++)ue(u[e],t,n,r);o(e.anchor,t,n);return}if(c===Ki){S(e,t,n);return}if(r!==2&&d&1&&l)if(r===0)l.persisted&&!a[nr]?o(a,t,n):(l.beforeEnter(a),o(a,t,n),Ai(()=>l.enter(a),i));else{let{leave:r,delayLeave:i,afterLeave:c}=l,u=()=>{e.ctx.isUnmounted?s(a):o(a,t,n)},d=()=>{let e=a._isLeaving||!!a[nr];a._isLeaving&&a[nr](!0),l.persisted&&!e?u():r(a,()=>{u(),c&&c()})};i?i(a,u,d):d()}else o(a,t,n)},de=(e,t,n,r=!1,i=!1)=>{let{type:a,props:o,ref:s,children:c,dynamicChildren:l,shapeFlag:u,patchFlag:d,dirs:f,cacheIndex:p,memo:m}=e;if(d===-2&&(i=!1),s!=null&&(Ve(),cr(s,null,n,e,!0),He()),p!=null&&(t.renderCache[p]=void 0),u&256){t.ctx.deactivate(e);return}let h=u&1&&f,g=!ur(e),_;if(g&&(_=o&&o.onVnodeBeforeUnmount)&&ma(_,t,e),u&6)me(e.component,n,r);else{if(u&128){e.suspense.unmount(n,r);return}h&&Mn(e,null,t,`beforeUnmount`),u&64?e.type.remove(e,t,n,N,r):l&&!l.hasOnce&&(a!==Ui||d>0&&d&64)?he(l,t,n,!1,!0):(a===Ui&&d&384||!i&&u&16)&&he(c,t,n),r&&fe(e)}let v=m!=null&&p==null;(g&&(_=o&&o.onVnodeUnmounted)||h||v)&&Ai(()=>{_&&ma(_,t,e),h&&Mn(e,null,t,`unmounted`),v&&(e.el=null)},n)},fe=e=>{let{type:t,el:n,anchor:r,transition:i}=e;if(t===Ui){pe(n,r);return}if(t===Ki){C(e);return}let a=()=>{s(n),i&&!i.persisted&&i.afterLeave&&i.afterLeave()};if(e.shapeFlag&1&&i&&!i.persisted){let{leave:t,delayLeave:r}=i,o=()=>t(n,a);r?r(e.el,a,o):o()}else a()},pe=(e,t)=>{let n;for(;e!==t;)n=h(e),s(e),e=n;s(t)},me=(e,t,n)=>{let{bum:r,scope:i,job:a,subTree:o,um:s,m:c,a:l}=e;zi(c),zi(l),r&&ne(r),i.stop(),a&&(a.flags|=8,de(o,e,t,n)),s&&Ai(s,t),Ai(()=>{e.isUnmounted=!0},t)},he=(e,t,n,r=!1,i=!1,a=0)=>{for(let o=a;o<e.length;o++)de(e[o],t,n,r,i)},ge=e=>{if(e.shapeFlag&6)return ge(e.component.subTree);if(e.shapeFlag&128)return e.suspense.next();let t=h(e.anchor||e.el),n=t&&t[Un];return n?h(n):t},_e=!1,ve=(e,t,n)=>{let r;e==null?t._vnode&&(de(t._vnode,null,null,!0),r=t._vnode.component):v(t._vnode||null,e,t,null,null,null,n),t._vnode=e,_e||=(_e=!0,Cn(r),wn(),!1)},N={p:v,um:de,m:ue,r:fe,mt:M,mc:D,pc:se,pbc:O,n:ge,o:e},ye,be;return i&&([ye,be]=i(N)),{render:ve,hydrate:ye,createApp:Qr(ve,ye)}}function Ni({type:e,props:t},n){return n===`svg`&&e===`foreignObject`||n===`mathml`&&e===`annotation-xml`&&t&&t.encoding&&t.encoding.includes(`html`)?void 0:n}function Pi({effect:e,job:t},n){n?(e.flags|=32,t.flags|=4):(e.flags&=-33,t.flags&=-5)}function Fi(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function Ii(e,t,n=!1){let r=e.children,i=t.children;if(d(r)&&d(i))for(let e=0;e<r.length;e++){let t=r[e],a=i[e];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=i[e]=da(i[e]),a.el=t.el),!n&&a.patchFlag!==-2&&Ii(t,a)),a.type===Wi&&(a.patchFlag===-1&&(a=i[e]=da(a)),a.el=t.el),a.type===Gi&&!a.el&&(a.el=t.el)}}function Li(e){let t=e.slice(),n=[0],r,i,a,o,s,c=e.length;for(r=0;r<c;r++){let c=e[r];if(c!==0){if(i=n[n.length-1],e[i]<c){t[r]=i,n.push(r);continue}for(a=0,o=n.length-1;a<o;)s=a+o>>1,e[n[s]]<c?a=s+1:o=s;c<e[n[a]]&&(a>0&&(t[r]=n[a-1]),n[a]=r)}}for(a=n.length,o=n[a-1];a-->0;)n[a]=o,o=t[o];return n}function Ri(e){let t=e.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:Ri(t)}function zi(e){if(e)for(let t=0;t<e.length;t++)e[t].flags|=8}function Bi(e){if(e.placeholder)return e.placeholder;let t=e.component;return t?Bi(t.subTree):null}var Vi=e=>e.__isSuspense;function Hi(e,t){t&&t.pendingBranch?d(e)?t.effects.push(...e):t.effects.push(e):Sn(e)}var Ui=Symbol.for(`v-fgt`),Wi=Symbol.for(`v-txt`),Gi=Symbol.for(`v-cmt`),Ki=Symbol.for(`v-stc`),qi=[],Ji=null;function H(e=!1){qi.push(Ji=e?null:[])}function Yi(){qi.pop(),Ji=qi[qi.length-1]||null}var Xi=1;function Zi(e,t=!1){Xi+=e,e<0&&Ji&&t&&(Ji.hasOnce=!0)}function Qi(e){return e.dynamicChildren=Xi>0?Ji||n:null,Yi(),Xi>0&&Ji&&Ji.push(e),e}function U(e,t,n,r,i,a){return Qi(W(e,t,n,r,i,a,!0))}function $i(e,t,n,r,i){return Qi(ia(e,t,n,r,i,!0))}function ea(e){return e?e.__v_isVNode===!0:!1}function ta(e,t){return e.type===t.type&&e.key===t.key}var na=({key:e})=>e??null,ra=({ref:e,ref_key:t,ref_for:n})=>(typeof e==`number`&&(e=``+e),e==null?null:g(e)||R(e)||h(e)?{i:Dn,r:e,k:t,f:!!n}:e);function W(e,t=null,n=null,r=0,i=null,a=e===Ui?0:1,o=!1,s=!1){let c={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&na(t),ref:t&&ra(t),scopeId:On,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:a,patchFlag:r,dynamicProps:i,dynamicChildren:null,appContext:null,ctx:Dn};return s?(fa(c,n),a&128&&e.normalize(c)):n&&(c.shapeFlag|=g(n)?8:16),Xi>0&&!o&&Ji&&(c.patchFlag>0||a&6)&&c.patchFlag!==32&&Ji.push(c),c}var ia=aa;function aa(e,t=null,n=null,r=0,i=null,a=!1){if((!e||e===Or)&&(e=Gi),ea(e)){let r=sa(e,t,!0);return n&&fa(r,n),Xi>0&&!a&&Ji&&(r.shapeFlag&6?Ji[Ji.indexOf(e)]=r:Ji.push(r)),r.patchFlag=-2,r}if(Fa(e)&&(e=e.__vccOpts),t){t=oa(t);let{class:e,style:n}=t;e&&!g(e)&&(t.class=de(e)),v(n)&&(Bt(n)&&!d(n)&&(n=s({},n)),t.style=oe(n))}let o=g(e)?1:Vi(e)?128:Wn(e)?64:v(e)?4:h(e)?2:0;return W(e,t,n,r,i,o,a,!0)}function oa(e){return e?Bt(e)||mi(e)?s({},e):e:null}function sa(e,t,n=!1,r=!1){let{props:i,ref:a,patchFlag:o,children:s,transition:c}=e,l=t?pa(i||{},t):i,u={__v_isVNode:!0,__v_skip:!0,type:e.type,props:l,key:l&&na(l),ref:t&&t.ref?n&&a?d(a)?a.concat(ra(t)):[a,ra(t)]:ra(t):a,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:s,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==Ui?o===-1?16:o|16:o,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:c,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&sa(e.ssContent),ssFallback:e.ssFallback&&sa(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce};return c&&r&&rr(u,c.clone(u)),u}function ca(e=` `,t=0){return ia(Wi,null,e,t)}function la(e=``,t=!1){return t?(H(),$i(Gi,null,e)):ia(Gi,null,e)}function ua(e){return e==null||typeof e==`boolean`?ia(Gi):d(e)?ia(Ui,null,e.slice()):ea(e)?da(e):ia(Wi,null,String(e))}function da(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:sa(e)}function fa(e,t){let n=0,{shapeFlag:r}=e;if(t==null)t=null;else if(d(t))n=16;else if(typeof t==`object`)if(r&65){let n=t.default;n&&(n._c&&(n._d=!1),fa(e,n()),n._c&&(n._d=!0));return}else{n=32;let r=t._;!r&&!mi(t)?t._ctx=Dn:r===3&&Dn&&(Dn.slots._===1?t._=1:(t._=2,e.patchFlag|=1024))}else if(h(t)){if(r&65){fa(e,{default:t});return}t={default:t,_ctx:Dn},n=32}else t=String(t),r&64?(n=16,t=[ca(t)]):n=8;e.children=t,e.shapeFlag|=n}function pa(...e){let t={};for(let n=0;n<e.length;n++){let r=e[n];for(let e in r)if(e===`class`)t.class!==r.class&&(t.class=de([t.class,r.class]));else if(e===`style`)t.style=oe([t.style,r.style]);else if(a(e)){let n=t[e],i=r[e];i&&n!==i&&!(d(n)&&n.includes(i))?t[e]=n?[].concat(n,i):i:i==null&&n==null&&!o(e)&&(t[e]=i)}else e!==``&&(t[e]=r[e])}return t}function ma(e,t,n,r=null){ln(e,t,7,[n,r])}var ha=Xr(),ga=0;function _a(e,n,r){let i=e.type,a=(n?n.appContext:e.appContext)||ha,o={uid:ga++,vnode:e,type:i,parent:n,appContext:a,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new xe(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:n?n.provides:Object.create(a.provides),ids:n?n.ids:[``,0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:bi(i,a),emitsOptions:ri(i,a),emit:null,emitted:null,propsDefaults:t,inheritAttrs:i.inheritAttrs,ctx:t,data:t,props:t,attrs:t,slots:t,refs:t,setupState:t,setupContext:null,suspense:r,suspenseId:r?r.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return o.ctx={_:o},o.root=n?n.root:o,o.emit=ti.bind(null,o),e.ce&&e.ce(o),o}var va=null,ya=()=>va||Dn,ba,xa;{let e=ae(),t=(t,n)=>{let r;return(r=e[t])||(r=e[t]=[]),r.push(n),e=>{r.length>1?r.forEach(t=>t(e)):r[0](e)}};ba=t(`__VUE_INSTANCE_SETTERS__`,e=>va=e),xa=t(`__VUE_SSR_SETTERS__`,e=>Ta=e)}var Sa=e=>{let t=va;return ba(e),e.scope.on(),()=>{e.scope.off(),ba(t)}},Ca=()=>{va&&va.scope.off(),ba(null)};function wa(e){return e.vnode.shapeFlag&4}var Ta=!1;function Ea(e,t=!1,n=!1){t&&xa(t);let{props:r,children:i}=e.vnode,a=wa(e);hi(e,r,a,t),Oi(e,i,n||t);let o=a?Da(e,t):void 0;return t&&xa(!1),o}function Da(e,t){let n=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,Nr);let{setup:r}=n;if(r){Ve();let n=e.setupContext=r.length>1?Na(e):null,i=Sa(e),a=cn(r,e,0,[e.props,n]),o=y(a);if(He(),i(),(o||e.sp)&&!ur(e)&&ar(e),o){if(a.then(Ca,Ca),t)return a.then(n=>{Oa(e,n,t)}).catch(t=>{un(t,e,0)});e.asyncDep=a}else Oa(e,a,t)}else ja(e,t)}function Oa(e,t,n){h(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:v(t)&&(e.setupState=qt(t)),ja(e,n)}var ka,Aa;function ja(e,t,n){let i=e.type;if(!e.render){if(!t&&ka&&!i.render){let t=i.template||Br(e).template;if(t){let{isCustomElement:n,compilerOptions:r}=e.appContext.config,{delimiters:a,compilerOptions:o}=i;i.render=ka(t,s(s({isCustomElement:n,delimiters:a},r),o))}}e.render=i.render||r,Aa&&Aa(e)}{let t=Sa(e);Ve();try{Ir(e)}finally{He(),t()}}}var Ma={get(e,t){return I(e,`get`,``),e[t]}};function Na(e){return{attrs:new Proxy(e.attrs,Ma),slots:e.slots,emit:e.emit,expose:t=>{e.exposed=t||{}}}}function Pa(e){return e.exposed?e.exposeProxy||=new Proxy(qt(Vt(e.exposed)),{get(t,n){if(n in t)return t[n];if(n in jr)return jr[n](e)},has(e,t){return t in e||t in jr}}):e.proxy}function Fa(e){return h(e)&&`__vccOpts`in e}var G=(e,t)=>en(e,t,Ta),Ia=`3.5.40`,La=void 0,Ra=typeof window<`u`&&window.trustedTypes;if(Ra)try{La=Ra.createPolicy(`vue`,{createHTML:e=>e})}catch{}var za=La?e=>La.createHTML(e):e=>e,Ba=`http://www.w3.org/2000/svg`,Va=`http://www.w3.org/1998/Math/MathML`,Ha=typeof document<`u`?document:null,Ua=Ha&&Ha.createElement(`template`),Wa={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{let t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,r)=>{let i=t===`svg`?Ha.createElementNS(Ba,e):t===`mathml`?Ha.createElementNS(Va,e):n?Ha.createElement(e,{is:n}):Ha.createElement(e);return e===`select`&&r&&r.multiple!=null&&i.setAttribute(`multiple`,r.multiple),i},createText:e=>Ha.createTextNode(e),createComment:e=>Ha.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>Ha.querySelector(e),setScopeId(e,t){e.setAttribute(t,``)},insertStaticContent(e,t,n,r,i,a){let o=n?n.previousSibling:t.lastChild;if(i&&(i===a||i.nextSibling))for(;t.insertBefore(i.cloneNode(!0),n),!(i===a||!(i=i.nextSibling)););else{Ua.innerHTML=za(r===`svg`?`<svg>${e}</svg>`:r===`mathml`?`<math>${e}</math>`:e);let i=Ua.content;if(r===`svg`||r===`mathml`){let e=i.firstChild;for(;e.firstChild;)i.appendChild(e.firstChild);i.removeChild(e)}t.insertBefore(i,n)}return[o?o.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}},Ga=Symbol(`_vtc`);function Ka(e,t,n){let r=e[Ga];r&&(t=(t?[t,...r]:[...r]).join(` `)),t==null?e.removeAttribute(`class`):n?e.setAttribute(`class`,t):e.className=t}var qa=Symbol(`_vod`),Ja=Symbol(`_vsh`),Ya=Symbol(``),Xa=/(?:^|;)\s*display\s*:/;function Za(e,t,n){let r=e.style,i=g(n),a=!1;if(n&&!i){if(t)if(g(t))for(let e of t.split(`;`)){let t=e.slice(0,e.indexOf(`:`)).trim();n[t]??$a(r,t,``)}else for(let e in t)n[e]??$a(r,e,``);for(let i in n){i===`display`&&(a=!0);let o=n[i];o==null?$a(r,i,``):ro(e,i,!g(t)&&t?t[i]:void 0,o)||$a(r,i,o)}}else if(i){if(t!==n){let e=r[Ya];e&&(n+=`;`+e),r.cssText=n,a=Xa.test(n)}}else t&&e.removeAttribute(`style`);qa in e&&(e[qa]=a?r.display:``,e[Ja]&&(r.display=`none`))}var Qa=/\s*!important$/;function $a(e,t,n){if(d(n))n.forEach(n=>$a(e,t,n));else if(n??=``,t.startsWith(`--`))e.setProperty(t,n);else{let r=no(e,t);Qa.test(n)?e.setProperty(O(r),n.replace(Qa,``),`important`):e[r]=n}}var eo=[`Webkit`,`Moz`,`ms`],to={};function no(e,t){let n=to[t];if(n)return n;let r=D(t);if(r!==`filter`&&r in e)return to[t]=r;r=k(r);for(let n=0;n<eo.length;n++){let i=eo[n]+r;if(i in e)return to[t]=i}return t}function ro(e,t,n,r){return e.tagName===`TEXTAREA`&&(t===`width`||t===`height`)&&g(r)&&n===r}var io=`http://www.w3.org/1999/xlink`;function ao(e,t,n,r,i,a=pe(t)){r&&t.startsWith(`xlink:`)?n==null?e.removeAttributeNS(io,t.slice(6,t.length)):e.setAttributeNS(io,t,n):n==null||a&&!me(n)?e.removeAttribute(t):e.setAttribute(t,a?``:_(n)?String(n):n)}function oo(e,t,n,r,i){if(t===`innerHTML`||t===`textContent`){n!=null&&(e[t]=t===`innerHTML`?za(n):n);return}let a=e.tagName;if(t===`value`&&a!==`PROGRESS`&&!a.includes(`-`)){let r=a===`OPTION`?e.getAttribute(`value`)||``:e.value,i=n==null?e.type===`checkbox`?`on`:``:String(n);(r!==i||!(`_value`in e))&&(e.value=i),n??e.removeAttribute(t),e._value=n;return}let o=!1;if(n===``||n==null){let r=typeof e[t];r===`boolean`?n=me(n):n==null&&r===`string`?(n=``,o=!0):r===`number`&&(n=0,o=!0)}try{e[t]=n}catch{}o&&e.removeAttribute(i||t)}function so(e,t,n,r){e.addEventListener(t,n,r)}function co(e,t,n,r){e.removeEventListener(t,n,r)}var lo=Symbol(`_vei`);function uo(e,t,n,r,i=null){let a=e[lo]||(e[lo]={}),o=a[t];if(r&&o)o.value=r;else{let[n,s]=mo(t);r?so(e,n,a[t]=vo(r,i),s):o&&(co(e,n,o,s),a[t]=void 0)}}var fo=/(Once|Passive|Capture)$/,po=/^on:?(?:Once|Passive|Capture)$/;function mo(e){let t,n;for(;(n=e.match(fo))&&!po.test(e);)t||={},e=e.slice(0,e.length-n[1].length),t[n[1].toLowerCase()]=!0;return[e[2]===`:`?e.slice(3):O(e.slice(2)),t]}var ho=0,go=Promise.resolve(),_o=()=>ho||=(go.then(()=>ho=0),Date.now());function vo(e,t){let n=e=>{if(!e._vts)e._vts=Date.now();else if(e._vts<=n.attached)return;let r=n.value;if(d(r)){let n=e.stopImmediatePropagation;e.stopImmediatePropagation=()=>{n.call(e),e._stopped=!0};let i=r.slice(),a=[e];for(let n=0;n<i.length&&!e._stopped;n++){let e=i[n];e&&ln(e,t,5,a)}}else ln(r,t,5,[e])};return n.value=e,n.attached=_o(),n}var yo=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,bo=(e,t,n,r,i,s)=>{let c=i===`svg`;t===`class`?Ka(e,r,c):t===`style`?Za(e,n,r):a(t)?o(t)||uo(e,t,n,r,s):(t[0]===`.`?(t=t.slice(1),!0):t[0]===`^`?(t=t.slice(1),!1):xo(e,t,r,c))?(oo(e,t,r),!e.tagName.includes(`-`)&&(t===`value`||t===`checked`||t===`selected`)&&ao(e,t,r,c,s,t!==`value`)):e._isVueCE&&(So(e,t)||e._def.__asyncLoader&&(/[A-Z]/.test(t)||!g(r)))?oo(e,D(t),r,s,t):(t===`true-value`?e._trueValue=r:t===`false-value`&&(e._falseValue=r),ao(e,t,r,c))};function xo(e,t,n,r){if(r)return!!(t===`innerHTML`||t===`textContent`||t in e&&yo(t)&&h(n));if(t===`spellcheck`||t===`draggable`||t===`translate`||t===`autocorrect`||t===`sandbox`&&e.tagName===`IFRAME`||t===`form`||t===`list`&&e.tagName===`INPUT`||t===`type`&&e.tagName===`TEXTAREA`)return!1;if(t===`width`||t===`height`){let t=e.tagName;if(t===`IMG`||t===`VIDEO`||t===`CANVAS`||t===`SOURCE`)return!1}return yo(t)&&g(n)?!1:t in e}function So(e,t){let n=e._def.props;if(!n)return!1;let r=D(t);return Array.isArray(n)?n.some(e=>D(e)===r):Object.keys(n).some(e=>D(e)===r)}var Co=e=>{let t=e.props[`onUpdate:modelValue`]||!1;return d(t)?e=>ne(t,e):t};function wo(e){e.target.composing=!0}function To(e){let t=e.target;t.composing&&(t.composing=!1,t.dispatchEvent(new Event(`input`)))}var Eo=Symbol(`_assign`);function Do(e,t,n){return t&&(e=e.trim()),n&&(e=re(e)),e}var Oo={created(e,{modifiers:{lazy:t,trim:n,number:r}},i){e[Eo]=Co(i);let a=r||i.props&&i.props.type===`number`;so(e,t?`change`:`input`,t=>{t.target.composing||e[Eo](Do(e.value,n,a))}),(n||a)&&so(e,`change`,()=>{e.value=Do(e.value,n,a)}),t||(so(e,`compositionstart`,wo),so(e,`compositionend`,To),so(e,`change`,To))},mounted(e,{value:t}){e.value=t??``},beforeUpdate(e,{value:t,oldValue:n,modifiers:{lazy:r,trim:i,number:a}},o){if(e[Eo]=Co(o),e.composing)return;let s=(a||e.type===`number`)&&!/^0\d/.test(e.value)?re(e.value):e.value,c=t??``;if(s===c)return;let l=e.getRootNode();(l instanceof Document||l instanceof ShadowRoot)&&l.activeElement===e&&e.type!==`range`&&(r&&t===n||i&&e.value.trim()===c)||(e.value=c)}},ko={deep:!0,created(e,t,n){e[Eo]=Co(n),so(e,`change`,()=>{let t=e._modelValue,n=No(e),r=e.checked,i=e[Eo];if(d(t)){let e=_e(t,n),a=e!==-1;if(r&&!a)i(t.concat(n));else if(!r&&a){let n=[...t];n.splice(e,1),i(n)}}else if(p(t)){let e=new Set(t);r?e.add(n):e.delete(n),i(e)}else i(Po(e,r))})},mounted:Ao,beforeUpdate(e,t,n){e[Eo]=Co(n),Ao(e,t,n)}};function Ao(e,{value:t,oldValue:n},r){e._modelValue=t;let i;if(d(t))i=_e(t,r.props.value)>-1;else if(p(t))i=t.has(r.props.value);else{if(t===n)return;i=ge(t,Po(e,!0))}e.checked!==i&&(e.checked=i)}var jo={deep:!0,created(e,{value:t,modifiers:{number:n}},r){e._modelValue=t,so(e,`change`,()=>{let t=Array.prototype.filter.call(e.options,e=>e.selected).map(e=>n?re(No(e)):No(e));e[Eo](e.multiple?p(e._modelValue)?new Set(t):t:t[0]),e._assigning=!0,vn(()=>{e._assigning=!1})}),e[Eo]=Co(r)},mounted(e,{value:t}){Mo(e,t)},beforeUpdate(e,{value:t},n){e._modelValue=t,e[Eo]=Co(n)},updated(e,{value:t}){e._assigning||Mo(e,t)}};function Mo(e,t){let n=e.multiple,r=d(t);if(!(n&&!r&&!p(t))){for(let i=0,a=e.options.length;i<a;i++){let a=e.options[i],o=No(a);if(n)if(r){let e=typeof o;e===`string`||e===`number`?a.selected=t.some(e=>String(e)===String(o)):a.selected=_e(t,o)>-1}else a.selected=t.has(o);else if(ge(No(a),t)){e.selectedIndex!==i&&(e.selectedIndex=i);return}}!n&&e.selectedIndex!==-1&&(e.selectedIndex=-1)}}function No(e){return`_value`in e?e._value:e.value}function Po(e,t){let n=t?`_trueValue`:`_falseValue`;return n in e?e[n]:t}var Fo=[`ctrl`,`shift`,`alt`,`meta`],Io={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>`button`in e&&e.button!==0,middle:e=>`button`in e&&e.button!==1,right:e=>`button`in e&&e.button!==2,exact:(e,t)=>Fo.some(n=>e[`${n}Key`]&&!t.includes(n))},Lo=(e,t)=>{if(!e)return e;let n=e._withMods||={},r=t.join(`.`);return n[r]||(n[r]=((n,...r)=>{for(let e=0;e<t.length;e++){let r=Io[t[e]];if(r&&r(n,t))return}return e(n,...r)}))},Ro=s({patchProp:bo},Wa),zo;function Bo(){return zo||=ji(Ro)}var Vo=((...e)=>{let t=Bo().createApp(...e),{mount:n}=t;return t.mount=e=>{let r=Uo(e);if(!r)return;let i=t._component;!h(i)&&!i.render&&!i.template&&(i.template=r.innerHTML),r.nodeType===1&&(r.textContent=``);let a=n(r,!1,Ho(r));return r instanceof Element&&(r.removeAttribute(`v-cloak`),r.setAttribute(`data-v-app`,``)),a},t});function Ho(e){if(e instanceof SVGElement)return`svg`;if(typeof MathMLElement==`function`&&e instanceof MathMLElement)return`mathml`}function Uo(e){return g(e)?document.querySelector(e):e}var Wo=typeof window<`u`,Go,Ko=e=>Go=e,qo=Symbol();function Jo(e){return e&&typeof e==`object`&&Object.prototype.toString.call(e)===`[object Object]`&&typeof e.toJSON!=`function`}var Yo=typeof window==`object`&&window.window===window?window:typeof self==`object`&&self.self===self?self:typeof global==`object`&&global.global===global?global:typeof globalThis==`object`?globalThis:{HTMLElement:null};function Xo(e,{autoBom:t=!1}={}){return t&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob([`﻿`,e],{type:e.type}):e}function Zo(e,t,n){let r=new XMLHttpRequest;r.open(`GET`,e),r.responseType=`blob`,r.onload=function(){ns(r.response,t,n)},r.onerror=function(){console.error(`could not download file`)},r.send()}function Qo(e){let t=new XMLHttpRequest;t.open(`HEAD`,e,!1);try{t.send()}catch{}return t.status>=200&&t.status<=299}function $o(e){try{e.dispatchEvent(new MouseEvent(`click`))}catch{let t=new MouseEvent(`click`,{bubbles:!0,cancelable:!0,view:window,detail:0,screenX:80,screenY:20,clientX:80,clientY:20,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,button:0,relatedTarget:null});e.dispatchEvent(t)}}var es=typeof navigator==`object`?navigator:{userAgent:``},ts=/Macintosh/.test(es.userAgent)&&/AppleWebKit/.test(es.userAgent)&&!/Safari/.test(es.userAgent),ns=Wo?typeof HTMLAnchorElement<`u`&&`download`in HTMLAnchorElement.prototype&&!ts?rs:`msSaveOrOpenBlob`in es?is:as:()=>{};function rs(e,t=`download`,n){let r=document.createElement(`a`);r.download=t,r.rel=`noopener`,typeof e==`string`?(r.href=e,r.origin===location.origin?$o(r):Qo(r.href)?Zo(e,t,n):(r.target=`_blank`,$o(r))):(r.href=URL.createObjectURL(e),setTimeout(function(){URL.revokeObjectURL(r.href)},4e4),setTimeout(function(){$o(r)},0))}function is(e,t=`download`,n){if(typeof e==`string`)if(Qo(e))Zo(e,t,n);else{let t=document.createElement(`a`);t.href=e,t.target=`_blank`,setTimeout(function(){$o(t)})}else navigator.msSaveOrOpenBlob(Xo(e,n),t)}function as(e,t,n,r){if(r||=open(``,`_blank`),r&&(r.document.title=r.document.body.innerText=`downloading...`),typeof e==`string`)return Zo(e,t,n);let i=e.type===`application/octet-stream`,a=/constructor/i.test(String(Yo.HTMLElement))||`safari`in Yo,o=/CriOS\/[\d]+/.test(navigator.userAgent);if((o||i&&a||ts)&&typeof FileReader<`u`){let t=new FileReader;t.onloadend=function(){let e=t.result;if(typeof e!=`string`)throw r=null,Error(`Wrong reader.result type`);e=o?e:e.replace(/^data:[^;]*;/,`data:attachment/file;`),r?r.location.href=e:location.assign(e),r=null},t.readAsDataURL(e)}else{let t=URL.createObjectURL(e);r?r.location.assign(t):location.href=t,r=null,setTimeout(function(){URL.revokeObjectURL(t)},4e4)}}var{assign:os}=Object;function ss(){let e=Se(!0),t=e.run(()=>z({})),n=[],r=[],i=Vt({install(e){Ko(i),i._a=e,e.provide(qo,i),e.config.globalProperties.$pinia=i,r.forEach(e=>n.push(e)),r=[]},use(e){return this._a?n.push(e):r.push(e),this},_p:n,_a:null,_e:e,_s:new Map,state:t});return i}var cs=()=>{};function ls(e,t,n,r=cs){e.add(t);let i=()=>{e.delete(t)&&r()};return!n&&Ce()&&we(i),i}function us(e,...t){e.forEach(e=>{e(...t)})}var ds=e=>e(),fs=Symbol(),ps=Symbol();function ms(e,t){e instanceof Map&&t instanceof Map?t.forEach((t,n)=>e.set(n,t)):e instanceof Set&&t instanceof Set&&t.forEach(e.add,e);for(let n in t){if(!Object.hasOwn(t,n))continue;let r=t[n],i=e[n];Jo(i)&&Jo(r)&&Object.hasOwn(e,n)&&!R(r)&&!Lt(r)?e[n]=ms(i,r):e[n]=r}return e}var hs=Symbol();function gs(e){return!e||typeof e!=`object`||!Object.hasOwn(e,hs)}var{assign:_s}=Object;function vs(e){return!!(R(e)&&e.effect)}function ys(e,t,n,r){let{state:i,actions:a,getters:o}=t,s=n.state.value[e],c;function l(){return s||(n.state.value[e]=i?i():{}),_s(Jt(n.state.value[e]),a,Object.keys(o||{}).reduce((t,r)=>(t[r]=Vt(G(()=>{Ko(n);let t=n._s.get(e);return o[r].call(t,t)})),t),{}))}return c=bs(e,l,t,n,r,!0),c}function bs(e,t,n={},r,i,a){let o,s=_s({actions:{}},n),c={deep:!0},l,u,d=new Set,f=new Set,p,m=r.state.value[e];!a&&!m&&(r.state.value[e]={});let h;function g(t){let n;l=u=!1,typeof t==`function`?(t(r.state.value[e]),n={type:`patch function`,storeId:e,events:p}):(ms(r.state.value[e],t),n={type:`patch object`,payload:t,storeId:e,events:p});let i=h=Symbol();vn().then(()=>{h===i&&(l=!0)}),u=!0,us(d,n,r.state.value[e])}let _=a?function(){let{state:e}=n,t=e?e():{};this.$patch(e=>{_s(e,t)})}:cs;function v(){o.stop(),d.clear(),f.clear(),r._s.delete(e)}let y=(t,n=``)=>{if(fs in t)return t[ps]=n,t;let i=function(){Ko(r);let n=Array.from(arguments),a=new Set,o=new Set;function s(e){a.add(e)}function c(e){o.add(e)}us(f,{args:n,name:i[ps],store:b,after:s,onError:c});let l;try{l=t.apply(this&&this.$id===e?this:b,n)}catch(e){throw us(o,e),e}return l instanceof Promise?l.then(e=>(us(a,e),e)).catch(e=>(us(o,e),Promise.reject(e))):(us(a,l),l)};return i[fs]=!0,i[ps]=n,i},b=Nt({_p:r,$id:e,$onAction:ls.bind(null,f),$patch:g,$reset:_,$subscribe(t,n={}){if(d.has(t))return cs;let i=ls(d,t,n.detached,()=>a()),a=o.run(()=>Rn(()=>r.state.value[e],r=>{(n.flush===`sync`?u:l)&&t({storeId:e,type:`direct`,events:p},r)},_s({},c,n)));return i},$dispose:v});r._s.set(e,b);let x=(r._a&&r._a.runWithContext||ds)(()=>r._e.run(()=>(o=Se()).run(()=>t({action:y}))));for(let t in x){let n=x[t];R(n)&&!vs(n)||Lt(n)?a||(m&&gs(n)&&(R(n)?n.value=m[t]:ms(n,m[t])),r.state.value[e][t]=n):typeof n==`function`&&(x[t]=y(n,t),s.actions[t]=n)}return _s(b,x),_s(L(b),x),Object.defineProperty(b,"$state",{get:()=>r.state.value[e],set:e=>{g(t=>{_s(t,e)})}}),r._p.forEach(e=>{let t=o.run(()=>e({store:b,app:r._a,pinia:r,options:s}));_s(b,t)}),m&&a&&n.hydrate&&n.hydrate(b.$state,m),l=!0,u=!0,b}function xs(e,t,n){let r,i=typeof t==`function`;r=i?n:t;function a(n,a){let o=Fn();return n||=o?Pn(qo,null):null,n&&Ko(n),n=Go,n._s.has(e)||(i?bs(e,t,r,n):ys(e,r,n)),n._s.get(e)}return a.$id=e,a}function Ss(e){let t=L(e),n={};for(let r in t){let i=t[r];i?.effect?n[r]=G({get:()=>e[r],set(t){e[r]=t}}):(R(i)||Lt(i))&&(n[r]=Zt(e,r))}return n}var Cs=[2,2],ws=Math.sqrt(3)/6,Ts=[[-1,-Math.sqrt(3)/3],[1,-Math.sqrt(3)/3],[0,2*Math.sqrt(3)/3]];function Es(e,t,n){let r=[];for(let i=0;i<t;i+=1)for(let a=0;a<e;a+=1)n[i*e+a]&&r.push({matrix:[1/e,0,0,1/t],translate:[a/e,i/t]});return r}function Ds(e){return{id:e.id,label:e.label,description:e.description,renderer:`geometric-ifs`,initialView:{center:[0,0],scale:2.35},preview:{view:{center:[0,0],scale:2.35},recursionDepth:7,geometricColoring:e.coloring,palette:e.palette},parameters:[],geometricIfs:{backend:`grid`,baseArea:{shape:`rectangle`,size:Cs},grid:{columns:3,rows:3,mask:e.mask},transforms:Es(3,3,e.mask),contractionRatio:1/3,recommendedMaxDepth:15,defaultDepth:7,defaultColoring:e.coloring}}}var Os=[!0,!0,!0,!0,!1,!0,!0,!0,!0],ks=[!0,!1,!0,!1,!0,!1,!0,!1,!0],As=[!1,!0,!1,!0,!0,!0,!1,!0,!1],js=Ts.map(e=>({matrix:[.5,0,0,.5],translate:[e[0]*.5,e[1]*.5]})),Ms=[{id:`mandelbrot`,label:`Множество Мандельброта`,description:`Классическая орбита z² + c, начинающаяся в нуле.`,renderer:`escape-time`,initialView:{center:[-.65,0],scale:3.1},preview:{view:{center:[-.65,0],scale:3.1},iterations:240,palette:0,colorDensity:.062},suggestedIterations:320,iterationControl:{label:`Итерации`,min:40,max:1500,step:10},escapePower:2,deepZoom:{backend:`mandelbrot-perturbation`,maxMagnification:1e35},parameters:[],shader:{setup:`
        vec2 z = vec2(0.0);
        vec2 c = point;
      `,iterate:`
        z = complexSquare(z) + c;
      `,escaped:`dot(z, z) > 4.0`}},{id:`julia`,label:`Множество Жюлиа`,description:`Та же квадратичная динамика с фиксированным параметром c.`,renderer:`escape-time`,initialView:{center:[0,0],scale:3.2},preview:{view:{center:[0,0],scale:3.2},iterations:260,palette:0,colorDensity:.062},suggestedIterations:360,iterationControl:{label:`Итерации`,min:40,max:1500,step:10},escapePower:2,deepZoom:{backend:`julia-perturbation`,maxMagnification:1e35},parameters:[{key:`constant`,label:`Константа c`,uniform:`u_juliaConstant`,type:`complex`,defaultValue:[-.745,.113],step:.001}],shader:{setup:`
        vec2 z = point;
        vec2 c = u_juliaConstant;
      `,iterate:`
        z = complexSquare(z) + c;
      `,escaped:`dot(z, z) > 4.0`}},{id:`burning-ship`,label:`Burning Ship`,description:`Перед возведением в квадрат обе координаты z берутся по модулю.`,renderer:`escape-time`,initialView:{center:[-.45,-.5],scale:3.4},preview:{view:{center:[-.45,-.5],scale:3.4},iterations:260,palette:2,colorDensity:.058},suggestedIterations:380,iterationControl:{label:`Итерации`,min:40,max:1500,step:10},escapePower:2,deepZoom:{backend:`burning-ship-perturbation`,maxMagnification:1e35},parameters:[],shader:{setup:`
        vec2 z = vec2(0.0);
        vec2 c = point;
      `,iterate:`
        z = complexSquare(abs(z)) + c;
      `,escaped:`dot(z, z) > 4.0`}},{id:`tricorn`,label:`Трикорн`,description:`Антиголоморфный вариант Мандельброта: conjugate(z)² + c.`,renderer:`escape-time`,initialView:{center:[0,0],scale:3.5},preview:{view:{center:[0,0],scale:3.5},iterations:240,palette:1,colorDensity:.06},suggestedIterations:340,iterationControl:{label:`Итерации`,min:40,max:1500,step:10},escapePower:2,deepZoom:{backend:`tricorn-perturbation`,maxMagnification:1e35},parameters:[],shader:{setup:`
        vec2 z = vec2(0.0);
        vec2 c = point;
      `,iterate:`
        z = vec2(z.x * z.x - z.y * z.y, -2.0 * z.x * z.y) + c;
      `,escaped:`dot(z, z) > 4.0`}},{id:`phoenix`,label:`Феникс`,description:`Орбита с памятью: следующий шаг зависит от предыдущего z.`,renderer:`escape-time`,initialView:{center:[0,0],scale:3.2},preview:{view:{center:[0,0],scale:3.2},iterations:280,palette:0,colorDensity:.052},suggestedIterations:380,iterationControl:{label:`Итерации`,min:40,max:1500,step:10},escapePower:2,deepZoom:{backend:`phoenix-perturbation`,maxMagnification:1e35},parameters:[{key:`constant`,label:`Константа c`,uniform:`u_phoenixConstant`,type:`complex`,defaultValue:[.5667,0],step:.001},{key:`memory`,label:`Память p`,uniform:`u_phoenixMemory`,type:`number`,defaultValue:-.5,step:.01}],shader:{setup:`
        vec2 z = point;
        vec2 previousZ = vec2(0.0);
      `,iterate:`
        vec2 nextZ = complexSquare(z) + u_phoenixConstant + u_phoenixMemory * previousZ;
        previousZ = z;
        z = nextZ;
      `,escaped:`dot(z, z) > 4.0`}},{id:`newton`,label:`Newton`,description:`Бассейны притяжения трёх корней полинома z³ − 1.`,renderer:`root-basin`,basinBackend:`newton-cubic`,initialView:{center:[0,0],scale:4},preview:{view:{center:[0,0],scale:4},iterations:70,palette:0,colorDensity:.075},suggestedIterations:80,iterationControl:{label:`Итерации`,min:10,max:600,step:5},deepZoom:{backend:`newton-cubic-perturbation`,maxMagnification:1e35},parameters:[{key:`tolerance`,label:`Допуск сходимости`,uniform:`u_convergenceTolerance`,type:`number`,defaultValue:1e-5,step:1e-5,min:1e-7,max:.01}]},{id:`nova`,label:`Nova`,description:`Параметрическая плоскость метода Ньютона с добавлением координаты c.`,renderer:`root-basin`,basinBackend:`nova-cubic`,initialView:{center:[0,0],scale:3.6},preview:{view:{center:[0,0],scale:3.6},iterations:100,palette:0,colorDensity:.075},suggestedIterations:120,iterationControl:{label:`Итерации`,min:20,max:500,step:5},deepZoom:{backend:`nova-cubic-perturbation`,maxMagnification:1e35},parameters:[{key:`relaxation`,label:`Relaxation r`,uniform:`u_novaRelaxation`,type:`number`,defaultValue:1,step:.05,min:-2,max:2},{key:`escapeRadius`,label:`Радиус выхода`,uniform:`u_novaEscapeRadius`,type:`number`,defaultValue:32,step:1,min:2,max:256},{key:`tolerance`,label:`Допуск сходимости`,uniform:`u_convergenceTolerance`,type:`number`,defaultValue:1e-5,step:1e-5,min:1e-7,max:.01}]},{id:`clifford`,label:`Clifford attractor`,description:`Хаотическая траектория, проявляющаяся через плотность накопленных точек.`,renderer:`point-attractor`,attractorBackend:`clifford`,initialView:{center:[0,0],scale:4.8},preview:{view:{center:[0,0],scale:4.8},palette:0,parameters:{pointCount:18e4,exposure:.11,pointSize:1.25}},suggestedIterations:1,parameters:[{key:`a`,label:`Параметр a`,uniform:`u_cliffordA`,type:`number`,defaultValue:-1.4,step:.01,min:-3,max:3},{key:`b`,label:`Параметр b`,uniform:`u_cliffordB`,type:`number`,defaultValue:1.6,step:.01,min:-3,max:3},{key:`c`,label:`Параметр c`,uniform:`u_cliffordC`,type:`number`,defaultValue:1,step:.01,min:-3,max:3},{key:`d`,label:`Параметр d`,uniform:`u_cliffordD`,type:`number`,defaultValue:.7,step:.01,min:-3,max:3},{key:`burnIn`,label:`Пропустить точек`,uniform:`u_cliffordBurnIn`,type:`number`,defaultValue:100,step:50,min:0,max:1e5},{key:`pointCount`,label:`Количество точек`,uniform:`u_cliffordPointCount`,type:`number`,defaultValue:5e5,step:5e4,min:1e3,max:2e6},{key:`exposure`,label:`Экспозиция`,uniform:`u_cliffordExposure`,type:`number`,defaultValue:.045,step:.005,min:.005,max:.3,affectsOrbit:!1},{key:`pointSize`,label:`Размер точки`,uniform:`u_cliffordPointSize`,type:`number`,defaultValue:1.25,step:.25,min:1,max:5,affectsOrbit:!1}]},{id:`sierpinski-triangle`,label:`Треугольник Серпинского`,description:`Три угловые копии равностороннего треугольника на каждом уровне.`,renderer:`geometric-ifs`,initialView:{center:[0,ws],scale:2.1},preview:{view:{center:[0,ws],scale:2.1},recursionDepth:10,geometricColoring:`gradient`,palette:0},parameters:[],geometricIfs:{backend:`triangle-corners`,baseArea:{shape:`triangle`,vertices:Ts},transforms:js,contractionRatio:.5,recommendedMaxDepth:22,defaultDepth:10,defaultColoring:`gradient`}},Ds({id:`sierpinski-carpet`,label:`Ковёр Серпинского`,description:`Квадратная сетка 3×3 без центральной ячейки на каждом уровне.`,mask:Os,coloring:`level`,palette:1}),Ds({id:`vicsek-corners`,label:`Vicsek · углы`,description:`Центральная и четыре угловые ячейки сетки 3×3.`,mask:ks,coloring:`gradient`,palette:2}),Ds({id:`vicsek-cross`,label:`Vicsek · крест`,description:`Центральная и четыре осевые ячейки сетки 3×3.`,mask:As,coloring:`level`,palette:3})];function Ns(e){return Object.fromEntries(e.parameters.map(e=>[e.key,e.type===`complex`?[...e.defaultValue]:e.defaultValue]))}var Ps=9e15,Fs=1e9,Is=`0123456789abcdef`,Ls=`2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058`,Rs=`3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789`,zs={precision:20,rounding:4,modulo:1,toExpNeg:-7,toExpPos:21,minE:-Ps,maxE:Ps,crypto:!1},Bs,Vs,K=!0,Hs=`[DecimalError] `,Us=Hs+`Invalid argument: `,Ws=Hs+`Precision limit exceeded`,Gs=Hs+`crypto unavailable`,Ks=`[object Decimal]`,q=Math.floor,J=Math.pow,qs=/^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i,Js=/^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i,Ys=/^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i,Xs=/^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,Zs=1e7,Y=7,Qs=9007199254740991,$s=Ls.length-1,ec=Rs.length-1,X={toStringTag:Ks};X.absoluteValue=X.abs=function(){var e=new this.constructor(this);return e.s<0&&(e.s=1),$(e)},X.ceil=function(){return $(new this.constructor(this),this.e+1,2)},X.clampedTo=X.clamp=function(e,t){var n,r=this,i=r.constructor;if(e=new i(e),t=new i(t),!e.s||!t.s)return new i(NaN);if(e.gt(t))throw Error(Us+t);return n=r.cmp(e),n<0?e:r.cmp(t)>0?t:new i(r)},X.comparedTo=X.cmp=function(e){var t,n,r,i,a=this,o=a.d,s=(e=new a.constructor(e)).d,c=a.s,l=e.s;if(!o||!s)return!c||!l?NaN:c===l?o===s?0:!o^c<0?1:-1:c;if(!o[0]||!s[0])return o[0]?c:s[0]?-l:0;if(c!==l)return c;if(a.e!==e.e)return a.e>e.e^c<0?1:-1;for(r=o.length,i=s.length,t=0,n=r<i?r:i;t<n;++t)if(o[t]!==s[t])return o[t]>s[t]^c<0?1:-1;return r===i?0:r>i^c<0?1:-1},X.cosine=X.cos=function(){var e,t,n=this,r=n.constructor;return n.d?n.d[0]?(e=r.precision,t=r.rounding,r.precision=e+Math.max(n.e,n.sd())+Y,r.rounding=1,n=ic(r,Sc(r,n)),r.precision=e,r.rounding=t,$(Vs==2||Vs==3?n.neg():n,e,t,!0)):new r(1):new r(NaN)},X.cubeRoot=X.cbrt=function(){var e,t,n,r,i,a,o,s,c,l,u=this,d=u.constructor;if(!u.isFinite()||u.isZero())return new d(u);for(K=!1,a=u.s*J(u.s*u,1/3),!a||Math.abs(a)==1/0?(n=Z(u.d),e=u.e,(a=(e-n.length+1)%3)&&(n+=a==1||a==-2?`0`:`00`),a=J(n,1/3),e=q((e+1)/3)-(e%3==(e<0?-1:2)),a==1/0?n=`5e`+e:(n=a.toExponential(),n=n.slice(0,n.indexOf(`e`)+1)+e),r=new d(n),r.s=u.s):r=new d(a.toString()),o=(e=d.precision)+3;;)if(s=r,c=s.times(s).times(s),l=c.plus(u),r=Q(l.plus(u).times(s),l.plus(c),o+2,1),Z(s.d).slice(0,o)===(n=Z(r.d)).slice(0,o))if(n=n.slice(o-3,o+1),n==`9999`||!i&&n==`4999`){if(!i&&($(s,e+1,0),s.times(s).times(s).eq(u))){r=s;break}o+=4,i=1}else{(!+n||!+n.slice(1)&&n.charAt(0)==`5`)&&($(r,e+1,1),t=!r.times(r).times(r).eq(u));break}return K=!0,$(r,e,d.rounding,t)},X.decimalPlaces=X.dp=function(){var e,t=this.d,n=NaN;if(t){if(e=t.length-1,n=(e-q(this.e/Y))*Y,e=t[e],e)for(;e%10==0;e/=10)n--;n<0&&(n=0)}return n},X.dividedBy=X.div=function(e){return Q(this,new this.constructor(e))},X.dividedToIntegerBy=X.divToInt=function(e){var t=this,n=t.constructor;return $(Q(t,new n(e),0,1,1),n.precision,n.rounding)},X.equals=X.eq=function(e){return this.cmp(e)===0},X.floor=function(){return $(new this.constructor(this),this.e+1,3)},X.greaterThan=X.gt=function(e){return this.cmp(e)>0},X.greaterThanOrEqualTo=X.gte=function(e){var t=this.cmp(e);return t==1||t===0},X.hyperbolicCosine=X.cosh=function(){var e,t,n,r,i,a=this,o=a.constructor,s=new o(1);if(!a.isFinite())return new o(a.s?1/0:NaN);if(a.isZero())return s;n=o.precision,r=o.rounding,o.precision=n+Math.max(a.e,a.sd())+4,o.rounding=1,i=a.d.length,i<32?(e=Math.ceil(i/3),t=(1/xc(4,e)).toString()):(e=16,t=`2.3283064365386962890625e-10`),a=bc(o,1,a.times(t),new o(1),!0);for(var c,l=e,u=new o(8);l--;)c=a.times(a),a=s.minus(c.times(u.minus(c.times(u))));return $(a,o.precision=n,o.rounding=r,!0)},X.hyperbolicSine=X.sinh=function(){var e,t,n,r,i=this,a=i.constructor;if(!i.isFinite()||i.isZero())return new a(i);if(t=a.precision,n=a.rounding,a.precision=t+Math.max(i.e,i.sd())+4,a.rounding=1,r=i.d.length,r<3)i=bc(a,2,i,i,!0);else{e=1.4*Math.sqrt(r),e=e>16?16:e|0,i=i.times(1/xc(5,e)),i=bc(a,2,i,i,!0);for(var o,s=new a(5),c=new a(16),l=new a(20);e--;)o=i.times(i),i=i.times(s.plus(o.times(c.times(o).plus(l))))}return a.precision=t,a.rounding=n,$(i,t,n,!0)},X.hyperbolicTangent=X.tanh=function(){var e,t,n=this,r=n.constructor;return n.isFinite()?n.isZero()?new r(n):(e=r.precision,t=r.rounding,r.precision=e+7,r.rounding=1,Q(n.sinh(),n.cosh(),r.precision=e,r.rounding=t)):new r(n.s)},X.inverseCosine=X.acos=function(){var e=this,t=e.constructor,n=e.abs().cmp(1),r=t.precision,i=t.rounding;return n===-1?e.isZero()?cc(t,r+4,i).times(.5):(t.precision=r+6,t.rounding=1,e=new t(1).minus(e).div(e.plus(1)).sqrt().atan(),t.precision=r,t.rounding=i,e.times(2)):n===0?e.isNeg()?cc(t,r,i):new t(0):new t(NaN)},X.inverseHyperbolicCosine=X.acosh=function(){var e,t,n=this,r=n.constructor;return n.lte(1)?new r(n.eq(1)?0:NaN):n.isFinite()?(e=r.precision,t=r.rounding,r.precision=e+Math.max(Math.abs(n.e),n.sd())+4,r.rounding=1,K=!1,n=n.times(n).minus(1).sqrt().plus(n),K=!0,r.precision=e,r.rounding=t,n.ln()):new r(n)},X.inverseHyperbolicSine=X.asinh=function(){var e,t,n=this,r=n.constructor;return!n.isFinite()||n.isZero()?new r(n):(e=r.precision,t=r.rounding,r.precision=e+2*Math.max(Math.abs(n.e),n.sd())+6,r.rounding=1,K=!1,n=n.times(n).plus(1).sqrt().plus(n),K=!0,r.precision=e,r.rounding=t,n.ln())},X.inverseHyperbolicTangent=X.atanh=function(){var e,t,n,r,i=this,a=i.constructor;return i.isFinite()?i.e>=0?new a(i.abs().eq(1)?i.s/0:i.isZero()?i:NaN):(e=a.precision,t=a.rounding,r=i.sd(),Math.max(r,e)<2*-i.e-1?$(new a(i),e,t,!0):(a.precision=n=r-i.e,i=Q(i.plus(1),new a(1).minus(i),n+e,1),a.precision=e+4,a.rounding=1,i=i.ln(),a.precision=e,a.rounding=t,i.times(.5))):new a(NaN)},X.inverseSine=X.asin=function(){var e,t,n,r,i=this,a=i.constructor;return i.isZero()?new a(i):(t=i.abs().cmp(1),n=a.precision,r=a.rounding,t===-1?(a.precision=n+6,a.rounding=1,i=i.div(new a(1).minus(i.times(i)).sqrt().plus(1)).atan(),a.precision=n,a.rounding=r,i.times(2)):t===0?(e=cc(a,n+4,r).times(.5),e.s=i.s,e):new a(NaN))},X.inverseTangent=X.atan=function(){var e,t,n,r,i,a,o,s,c,l=this,u=l.constructor,d=u.precision,f=u.rounding;if(!l.isFinite()){if(!l.s)return new u(NaN);if(d+4<=ec)return o=cc(u,d+4,f).times(.5),o.s=l.s,o}else if(l.isZero())return new u(l);else if(l.abs().eq(1)&&d+4<=ec)return o=cc(u,d+4,f).times(.25),o.s=l.s,o;for(u.precision=s=d+10,u.rounding=1,n=Math.min(28,s/Y+2|0),e=n;e;--e)l=l.div(l.times(l).plus(1).sqrt().plus(1));for(K=!1,t=Math.ceil(s/Y),r=1,c=l.times(l),o=new u(l),i=l;e!==-1;)if(i=i.times(c),a=o.minus(i.div(r+=2)),i=i.times(c),o=a.plus(i.div(r+=2)),o.d[t]!==void 0)for(e=t;o.d[e]===a.d[e]&&e--;);return n&&(o=o.times(2<<n-1)),K=!0,$(o,u.precision=d,u.rounding=f,!0)},X.isFinite=function(){return!!this.d},X.isInteger=X.isInt=function(){return!!this.d&&q(this.e/Y)>this.d.length-2},X.isNaN=function(){return!this.s},X.isNegative=X.isNeg=function(){return this.s<0},X.isPositive=X.isPos=function(){return this.s>0},X.isZero=function(){return!!this.d&&this.d[0]===0},X.lessThan=X.lt=function(e){return this.cmp(e)<0},X.lessThanOrEqualTo=X.lte=function(e){return this.cmp(e)<1},X.logarithm=X.log=function(e){var t,n,r,i,a,o,s,c,l=this,u=l.constructor,d=u.precision,f=u.rounding,p=5;if(e==null)e=new u(10),t=!0;else{if(e=new u(e),n=e.d,e.s<0||!n||!n[0]||e.eq(1))return new u(NaN);t=e.eq(10)}if(n=l.d,l.s<0||!n||!n[0]||l.eq(1))return new u(n&&!n[0]?-1/0:l.s==1?n?0:1/0:NaN);if(t)if(n.length>1)a=!0;else{for(i=n[0];i%10==0;)i/=10;a=i!==1}if(K=!1,s=d+p,o=hc(l,s),r=t?sc(u,s+10):hc(e,s),c=Q(o,r,s,1),nc(c.d,i=d,f))do if(s+=10,o=hc(l,s),r=t?sc(u,s+10):hc(e,s),c=Q(o,r,s,1),!a){+Z(c.d).slice(i+1,i+15)+1==0x5af3107a4000&&(c=$(c,d+1,0));break}while(nc(c.d,i+=10,f));return K=!0,$(c,d,f)},X.minus=X.sub=function(e){var t,n,r,i,a,o,s,c,l,u,d,f,p=this,m=p.constructor;if(e=new m(e),!p.d||!e.d)return!p.s||!e.s?e=new m(NaN):p.d?e.s=-e.s:e=new m(e.d||p.s!==e.s?p:NaN),e;if(p.s!=e.s)return e.s=-e.s,p.plus(e);if(l=p.d,f=e.d,s=m.precision,c=m.rounding,!l[0]||!f[0]){if(f[0])e.s=-e.s;else if(l[0])e=new m(p);else return new m(c===3?-0:0);return K?$(e,s,c):e}if(n=q(e.e/Y),u=q(p.e/Y),l=l.slice(),a=u-n,a){for(d=a<0,d?(t=l,a=-a,o=f.length):(t=f,n=u,o=l.length),r=Math.max(Math.ceil(s/Y),o)+2,a>r&&(a=r,t.length=1),t.reverse(),r=a;r--;)t.push(0);t.reverse()}else{for(r=l.length,o=f.length,d=r<o,d&&(o=r),r=0;r<o;r++)if(l[r]!=f[r]){d=l[r]<f[r];break}a=0}for(d&&(t=l,l=f,f=t,e.s=-e.s),o=l.length,r=f.length-o;r>0;--r)l[o++]=0;for(r=f.length;r>a;){if(l[--r]<f[r]){for(i=r;i&&l[--i]===0;)l[i]=Zs-1;--l[i],l[r]+=Zs}l[r]-=f[r]}for(;l[--o]===0;)l.pop();for(;l[0]===0;l.shift())--n;return l[0]?(e.d=l,e.e=oc(l,n),K?$(e,s,c):e):new m(c===3?-0:0)},X.modulo=X.mod=function(e){var t,n=this,r=n.constructor;return e=new r(e),!n.d||!e.s||e.d&&!e.d[0]?new r(NaN):!e.d||n.d&&!n.d[0]?$(new r(n),r.precision,r.rounding):(K=!1,r.modulo==9?(t=Q(n,e.abs(),0,3,1),t.s*=e.s):t=Q(n,e,0,r.modulo,1),t=t.times(e),K=!0,n.minus(t))},X.naturalExponential=X.exp=function(){return mc(this)},X.naturalLogarithm=X.ln=function(){return hc(this)},X.negated=X.neg=function(){var e=new this.constructor(this);return e.s=-e.s,$(e)},X.plus=X.add=function(e){var t,n,r,i,a,o,s,c,l,u,d=this,f=d.constructor;if(e=new f(e),!d.d||!e.d)return!d.s||!e.s?e=new f(NaN):d.d||(e=new f(e.d||d.s===e.s?d:NaN)),e;if(d.s!=e.s)return e.s=-e.s,d.minus(e);if(l=d.d,u=e.d,s=f.precision,c=f.rounding,!l[0]||!u[0])return u[0]||(e=new f(d)),K?$(e,s,c):e;if(a=q(d.e/Y),r=q(e.e/Y),l=l.slice(),i=a-r,i){for(i<0?(n=l,i=-i,o=u.length):(n=u,r=a,o=l.length),a=Math.ceil(s/Y),o=a>o?a+1:o+1,i>o&&(i=o,n.length=1),n.reverse();i--;)n.push(0);n.reverse()}for(o=l.length,i=u.length,o-i<0&&(i=o,n=u,u=l,l=n),t=0;i;)t=(l[--i]=l[i]+u[i]+t)/Zs|0,l[i]%=Zs;for(t&&(l.unshift(t),++r),o=l.length;l[--o]==0;)l.pop();return e.d=l,e.e=oc(l,r),K?$(e,s,c):e},X.precision=X.sd=function(e){var t,n=this;if(e!==void 0&&e!==!!e&&e!==1&&e!==0)throw Error(Us+e);return n.d?(t=lc(n.d),e&&n.e+1>t&&(t=n.e+1)):t=NaN,t},X.round=function(){var e=this,t=e.constructor;return $(new t(e),e.e+1,t.rounding)},X.sine=X.sin=function(){var e,t,n=this,r=n.constructor;return n.isFinite()?n.isZero()?new r(n):(e=r.precision,t=r.rounding,r.precision=e+Math.max(n.e,n.sd())+Y,r.rounding=1,n=yc(r,Sc(r,n)),r.precision=e,r.rounding=t,$(Vs>2?n.neg():n,e,t,!0)):new r(NaN)},X.squareRoot=X.sqrt=function(){var e,t,n,r,i,a,o=this,s=o.d,c=o.e,l=o.s,u=o.constructor;if(l!==1||!s||!s[0])return new u(!l||l<0&&(!s||s[0])?NaN:s?o:1/0);for(K=!1,l=Math.sqrt(+o),l==0||l==1/0?(t=Z(s),(t.length+c)%2==0&&(t+=`0`),l=Math.sqrt(t),c=q((c+1)/2)-(c<0||c%2),l==1/0?t=`5e`+c:(t=l.toExponential(),t=t.slice(0,t.indexOf(`e`)+1)+c),r=new u(t)):r=new u(l.toString()),n=(c=u.precision)+3;;)if(a=r,r=a.plus(Q(o,a,n+2,1)).times(.5),Z(a.d).slice(0,n)===(t=Z(r.d)).slice(0,n))if(t=t.slice(n-3,n+1),t==`9999`||!i&&t==`4999`){if(!i&&($(a,c+1,0),a.times(a).eq(o))){r=a;break}n+=4,i=1}else{(!+t||!+t.slice(1)&&t.charAt(0)==`5`)&&($(r,c+1,1),e=!r.times(r).eq(o));break}return K=!0,$(r,c,u.rounding,e)},X.tangent=X.tan=function(){var e,t,n=this,r=n.constructor;return n.isFinite()?n.isZero()?new r(n):(e=r.precision,t=r.rounding,r.precision=e+10,r.rounding=1,n=n.sin(),n.s=1,n=Q(n,new r(1).minus(n.times(n)).sqrt(),e+10,0),r.precision=e,r.rounding=t,$(Vs==2||Vs==4?n.neg():n,e,t,!0)):new r(NaN)},X.times=X.mul=function(e){var t,n,r,i,a,o,s,c,l,u=this,d=u.constructor,f=u.d,p=(e=new d(e)).d;if(e.s*=u.s,!f||!f[0]||!p||!p[0])return new d(!e.s||f&&!f[0]&&!p||p&&!p[0]&&!f?NaN:!f||!p?e.s/0:e.s*0);for(n=q(u.e/Y)+q(e.e/Y),c=f.length,l=p.length,c<l&&(a=f,f=p,p=a,o=c,c=l,l=o),a=[],o=c+l,r=o;r--;)a.push(0);for(r=l;--r>=0;){for(t=0,i=c+r;i>r;)s=a[i]+p[r]*f[i-r-1]+t,a[i--]=s%Zs|0,t=s/Zs|0;a[i]=(a[i]+t)%Zs|0}for(;!a[--o];)a.pop();return t?++n:a.shift(),e.d=a,e.e=oc(a,n),K?$(e,d.precision,d.rounding):e},X.toBinary=function(e,t){return Cc(this,2,e,t)},X.toDecimalPlaces=X.toDP=function(e,t){var n=this,r=n.constructor;return n=new r(n),e===void 0?n:(tc(e,0,Fs),t===void 0?t=r.rounding:tc(t,0,8),$(n,e+n.e+1,t))},X.toExponential=function(e,t){var n,r=this,i=r.constructor;return e===void 0?n=ac(r,!0):(tc(e,0,Fs),t===void 0?t=i.rounding:tc(t,0,8),r=$(new i(r),e+1,t),n=ac(r,!0,e+1)),r.isNeg()&&!r.isZero()?`-`+n:n},X.toFixed=function(e,t){var n,r,i=this,a=i.constructor;return e===void 0?n=ac(i):(tc(e,0,Fs),t===void 0?t=a.rounding:tc(t,0,8),r=$(new a(i),e+i.e+1,t),n=ac(r,!1,e+r.e+1)),i.isNeg()&&!i.isZero()?`-`+n:n},X.toFraction=function(e){var t,n,r,i,a,o,s,c,l,u,d,f,p=this,m=p.d,h=p.constructor;if(!m)return new h(p);if(l=n=new h(1),r=c=new h(0),t=new h(r),a=t.e=lc(m)-p.e-1,o=a%Y,t.d[0]=J(10,o<0?Y+o:o),e==null)e=a>0?t:l;else{if(s=new h(e),!s.isInt()||s.lt(l))throw Error(Us+s);e=s.gt(t)?a>0?t:l:s}for(K=!1,s=new h(Z(m)),u=h.precision,h.precision=a=m.length*Y*2;d=Q(s,t,0,1,1),i=n.plus(d.times(r)),i.cmp(e)!=1;)n=r,r=i,i=l,l=c.plus(d.times(i)),c=i,i=t,t=s.minus(d.times(i)),s=i;return i=Q(e.minus(n),r,0,1,1),c=c.plus(i.times(l)),n=n.plus(i.times(r)),c.s=l.s=p.s,f=Q(l,r,a,1).minus(p).abs().cmp(Q(c,n,a,1).minus(p).abs())<1?[l,r]:[c,n],h.precision=u,K=!0,f},X.toHexadecimal=X.toHex=function(e,t){return Cc(this,16,e,t)},X.toNearest=function(e,t){var n=this,r=n.constructor;if(n=new r(n),e==null){if(!n.d)return n;e=new r(1),t=r.rounding}else{if(e=new r(e),t===void 0?t=r.rounding:tc(t,0,8),!n.d)return e.s?n:e;if(!e.d)return e.s&&=n.s,e}return e.d[0]?(K=!1,n=Q(n,e,0,t,1).times(e),K=!0,$(n)):(e.s=n.s,n=e),n},X.toNumber=function(){return+this},X.toOctal=function(e,t){return Cc(this,8,e,t)},X.toPower=X.pow=function(e){var t,n,r,i,a,o,s=this,c=s.constructor,l=+(e=new c(e));if(!s.d||!e.d||!s.d[0]||!e.d[0])return new c(J(+s,l));if(s=new c(s),s.eq(1))return s;if(r=c.precision,a=c.rounding,e.eq(1))return $(s,r,a);if(t=q(e.e/Y),t>=e.d.length-1&&(n=l<0?-l:l)<=Qs)return i=dc(c,s,n,r),e.s<0?new c(1).div(i):$(i,r,a);if(o=s.s,o<0){if(t<e.d.length-1)return new c(NaN);if(e.d[t]&1||(o=1),s.e==0&&s.d[0]==1&&s.d.length==1)return s.s=o,s}return n=J(+s,l),t=n==0||!isFinite(n)?q(l*(Math.log(`0.`+Z(s.d))/Math.LN10+s.e+1)):new c(n+``).e,t>c.maxE+1||t<c.minE-1?new c(t>0?o/0:0):(K=!1,c.rounding=s.s=1,n=Math.min(12,(t+``).length),i=mc(e.times(hc(s,r+n)),r),i.d&&(i=$(i,r+5,1),nc(i.d,r,a)&&(t=r+10,i=$(mc(e.times(hc(s,t+n)),t),t+5,1),+Z(i.d).slice(r+1,r+15)+1==0x5af3107a4000&&(i=$(i,r+1,0)))),i.s=o,K=!0,c.rounding=a,$(i,r,a))},X.toPrecision=function(e,t){var n,r=this,i=r.constructor;return e===void 0?n=ac(r,r.e<=i.toExpNeg||r.e>=i.toExpPos):(tc(e,1,Fs),t===void 0?t=i.rounding:tc(t,0,8),r=$(new i(r),e,t),n=ac(r,e<=r.e||r.e<=i.toExpNeg,e)),r.isNeg()&&!r.isZero()?`-`+n:n},X.toSignificantDigits=X.toSD=function(e,t){var n=this,r=n.constructor;return e===void 0?(e=r.precision,t=r.rounding):(tc(e,1,Fs),t===void 0?t=r.rounding:tc(t,0,8)),$(new r(n),e,t)},X.toString=function(){var e=this,t=e.constructor,n=ac(e,e.e<=t.toExpNeg||e.e>=t.toExpPos);return e.isNeg()&&!e.isZero()?`-`+n:n},X.truncated=X.trunc=function(){return $(new this.constructor(this),this.e+1,1)},X.valueOf=X.toJSON=function(){var e=this,t=e.constructor,n=ac(e,e.e<=t.toExpNeg||e.e>=t.toExpPos);return e.isNeg()?`-`+n:n};function Z(e){var t,n,r,i=e.length-1,a=``,o=e[0];if(i>0){for(a+=o,t=1;t<i;t++)r=e[t]+``,n=Y-r.length,n&&(a+=uc(n)),a+=r;o=e[t],r=o+``,n=Y-r.length,n&&(a+=uc(n))}else if(o===0)return`0`;for(;o%10==0;)o/=10;return a+o}function tc(e,t,n){if(e!==~~e||e<t||e>n)throw Error(Us+e)}function nc(e,t,n,r){var i,a,o,s;for(a=e[0];a>=10;a/=10)--t;return--t<0?(t+=Y,i=0):(i=Math.ceil((t+1)/Y),t%=Y),a=J(10,Y-t),s=e[i]%a|0,r==null?t<3?(t==0?s=s/100|0:t==1&&(s=s/10|0),o=n<4&&s==99999||n>3&&s==49999||s==5e4||s==0):o=(n<4&&s+1==a||n>3&&s+1==a/2)&&(e[i+1]/a/100|0)==J(10,t-2)-1||(s==a/2||s==0)&&(e[i+1]/a/100|0)==0:t<4?(t==0?s=s/1e3|0:t==1?s=s/100|0:t==2&&(s=s/10|0),o=(r||n<4)&&s==9999||!r&&n>3&&s==4999):o=((r||n<4)&&s+1==a||!r&&n>3&&s+1==a/2)&&(e[i+1]/a/1e3|0)==J(10,t-3)-1,o}function rc(e,t,n){for(var r,i=[0],a,o=0,s=e.length;o<s;){for(a=i.length;a--;)i[a]*=t;for(i[0]+=Is.indexOf(e.charAt(o++)),r=0;r<i.length;r++)i[r]>n-1&&(i[r+1]===void 0&&(i[r+1]=0),i[r+1]+=i[r]/n|0,i[r]%=n)}return i.reverse()}function ic(e,t){var n,r,i;if(t.isZero())return t;r=t.d.length,r<32?(n=Math.ceil(r/3),i=(1/xc(4,n)).toString()):(n=16,i=`2.3283064365386962890625e-10`),e.precision+=n,t=bc(e,1,t.times(i),new e(1));for(var a=n;a--;){var o=t.times(t);t=o.times(o).minus(o).times(8).plus(1)}return e.precision-=n,t}var Q=(function(){function e(e,t,n){var r,i=0,a=e.length;for(e=e.slice();a--;)r=e[a]*t+i,e[a]=r%n|0,i=r/n|0;return i&&e.unshift(i),e}function t(e,t,n,r){var i,a;if(n!=r)a=n>r?1:-1;else for(i=a=0;i<n;i++)if(e[i]!=t[i]){a=e[i]>t[i]?1:-1;break}return a}function n(e,t,n,r){for(var i=0;n--;)e[n]-=i,i=+(e[n]<t[n]),e[n]=i*r+e[n]-t[n];for(;!e[0]&&e.length>1;)e.shift()}return function(r,i,a,o,s,c){var l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,ee,E,D,te=r.constructor,O=r.s==i.s?1:-1,k=r.d,A=i.d;if(!k||!k[0]||!A||!A[0])return new te(!r.s||!i.s||(k?A&&k[0]==A[0]:!A)?NaN:k&&k[0]==0||!A?O*0:O/0);for(c?(p=1,u=r.e-i.e):(c=Zs,p=Y,u=q(r.e/p)-q(i.e/p)),E=A.length,T=k.length,_=new te(O),v=_.d=[],d=0;A[d]==(k[d]||0);d++);if(A[d]>(k[d]||0)&&u--,a==null?(S=a=te.precision,o=te.rounding):S=s?a+(r.e-i.e)+1:a,S<0)v.push(1),m=!0;else{if(S=S/p+2|0,d=0,E==1){for(f=0,A=A[0],S++;(d<T||f)&&S--;d++)C=f*c+(k[d]||0),v[d]=C/A|0,f=C%A|0;m=f||d<T}else{for(f=c/(A[0]+1)|0,f>1&&(A=e(A,f,c),k=e(k,f,c),E=A.length,T=k.length),w=E,y=k.slice(0,E),b=y.length;b<E;)y[b++]=0;D=A.slice(),D.unshift(0),ee=A[0],A[1]>=c/2&&++ee;do f=0,l=t(A,y,E,b),l<0?(x=y[0],E!=b&&(x=x*c+(y[1]||0)),f=x/ee|0,f>1?(f>=c&&(f=c-1),h=e(A,f,c),g=h.length,b=y.length,l=t(h,y,g,b),l==1&&(f--,n(h,E<g?D:A,g,c))):(f==0&&(l=f=1),h=A.slice()),g=h.length,g<b&&h.unshift(0),n(y,h,b,c),l==-1&&(b=y.length,l=t(A,y,E,b),l<1&&(f++,n(y,E<b?D:A,b,c))),b=y.length):l===0&&(f++,y=[0]),v[d++]=f,l&&y[0]?y[b++]=k[w]||0:(y=[k[w]],b=1);while((w++<T||y[0]!==void 0)&&S--);m=y[0]!==void 0}v[0]||v.shift()}if(p==1)_.e=u,Bs=m;else{for(d=1,f=v[0];f>=10;f/=10)d++;_.e=d+u*p-1,$(_,s?a+_.e+1:a,o,m)}return _}})();function $(e,t,n,r){var i,a,o,s,c,l,u,d,f,p=e.constructor;out:if(t!=null){if(d=e.d,!d)return e;for(i=1,s=d[0];s>=10;s/=10)i++;if(a=t-i,a<0)a+=Y,o=t,u=d[f=0],c=u/J(10,i-o-1)%10|0;else if(f=Math.ceil((a+1)/Y),s=d.length,f>=s)if(r){for(;s++<=f;)d.push(0);u=c=0,i=1,a%=Y,o=a-Y+1}else break out;else{for(u=s=d[f],i=1;s>=10;s/=10)i++;a%=Y,o=a-Y+i,c=o<0?0:u/J(10,i-o-1)%10|0}if(r=r||t<0||d[f+1]!==void 0||(o<0?u:u%J(10,i-o-1)),l=n<4?(c||r)&&(n==0||n==(e.s<0?3:2)):c>5||c==5&&(n==4||r||n==6&&(a>0?o>0?u/J(10,i-o):0:d[f-1])%10&1||n==(e.s<0?8:7)),t<1||!d[0])return d.length=0,l?(t-=e.e+1,d[0]=J(10,(Y-t%Y)%Y),e.e=-t||0):d[0]=e.e=0,e;if(a==0?(d.length=f,s=1,f--):(d.length=f+1,s=J(10,Y-a),d[f]=o>0?(u/J(10,i-o)%J(10,o)|0)*s:0),l)for(;;)if(f==0){for(a=1,o=d[0];o>=10;o/=10)a++;for(o=d[0]+=s,s=1;o>=10;o/=10)s++;a!=s&&(e.e++,d[0]==Zs&&(d[0]=1));break}else{if(d[f]+=s,d[f]!=Zs)break;d[f--]=0,s=1}for(a=d.length;d[--a]===0;)d.pop()}return K&&(e.e>p.maxE?(e.d=null,e.e=NaN):e.e<p.minE&&(e.e=0,e.d=[0])),e}function ac(e,t,n){if(!e.isFinite())return gc(e);var r,i=e.e,a=Z(e.d),o=a.length;return t?(n&&(r=n-o)>0?a=a.charAt(0)+`.`+a.slice(1)+uc(r):o>1&&(a=a.charAt(0)+`.`+a.slice(1)),a=a+(e.e<0?`e`:`e+`)+e.e):i<0?(a=`0.`+uc(-i-1)+a,n&&(r=n-o)>0&&(a+=uc(r))):i>=o?(a+=uc(i+1-o),n&&(r=n-i-1)>0&&(a=a+`.`+uc(r))):((r=i+1)<o&&(a=a.slice(0,r)+`.`+a.slice(r)),n&&(r=n-o)>0&&(i+1===o&&(a+=`.`),a+=uc(r))),a}function oc(e,t){var n=e[0];for(t*=Y;n>=10;n/=10)t++;return t}function sc(e,t,n){if(t>$s)throw K=!0,n&&(e.precision=n),Error(Ws);return $(new e(Ls),t,1,!0)}function cc(e,t,n){if(t>ec)throw Error(Ws);return $(new e(Rs),t,n,!0)}function lc(e){var t=e.length-1,n=t*Y+1;if(t=e[t],t){for(;t%10==0;t/=10)n--;for(t=e[0];t>=10;t/=10)n++}return n}function uc(e){for(var t=``;e--;)t+=`0`;return t}function dc(e,t,n,r){var i,a=new e(1),o=Math.ceil(r/Y+4);for(K=!1;;){if(n%2&&(a=a.times(t),wc(a.d,o)&&(i=!0)),n=q(n/2),n===0){n=a.d.length-1,i&&a.d[n]===0&&++a.d[n];break}t=t.times(t),wc(t.d,o)}return K=!0,a}function fc(e){return e.d[e.d.length-1]&1}function pc(e,t,n){for(var r,i,a=new e(t[0]),o=0;++o<t.length;){if(i=new e(t[o]),!i.s){a=i;break}r=a.cmp(i),(r===n||r===0&&a.s===n)&&(a=i)}return a}function mc(e,t){var n,r,i,a,o,s,c,l=0,u=0,d=0,f=e.constructor,p=f.rounding,m=f.precision;if(!e.d||!e.d[0]||e.e>17)return new f(e.d?e.d[0]?e.s<0?0:1/0:1:e.s?e.s<0?0:e:NaN);for(t==null?(K=!1,c=m):c=t,s=new f(.03125);e.e>-2;)e=e.times(s),d+=5;for(r=Math.log(J(2,d))/Math.LN10*2+5|0,c+=r,n=a=o=new f(1),f.precision=c;;){if(a=$(a.times(e),c,1),n=n.times(++u),s=o.plus(Q(a,n,c,1)),Z(s.d).slice(0,c)===Z(o.d).slice(0,c)){for(i=d;i--;)o=$(o.times(o),c,1);if(t==null)if(l<3&&nc(o.d,c-r,p,l))f.precision=c+=10,n=a=s=new f(1),u=0,l++;else return $(o,f.precision=m,p,K=!0);else return f.precision=m,o}o=s}}function hc(e,t){var n,r,i,a,o,s,c,l,u,d,f,p=1,m=10,h=e,g=h.d,_=h.constructor,v=_.rounding,y=_.precision;if(h.s<0||!g||!g[0]||!h.e&&g[0]==1&&g.length==1)return new _(g&&!g[0]?-1/0:h.s==1?g?0:h:NaN);if(t==null?(K=!1,u=y):u=t,_.precision=u+=m,n=Z(g),r=n.charAt(0),Math.abs(a=h.e)<0x5543df729c000){for(;r<7&&r!=1||r==1&&n.charAt(1)>3;)h=h.times(e),n=Z(h.d),r=n.charAt(0),p++;a=h.e,r>1?(h=new _(`0.`+n),a++):h=new _(r+`.`+n.slice(1))}else return l=sc(_,u+2,y).times(a+``),h=hc(new _(r+`.`+n.slice(1)),u-m).plus(l),_.precision=y,t==null?$(h,y,v,K=!0):h;for(d=h,c=o=h=Q(h.minus(1),h.plus(1),u,1),f=$(h.times(h),u,1),i=3;;){if(o=$(o.times(f),u,1),l=c.plus(Q(o,new _(i),u,1)),Z(l.d).slice(0,u)===Z(c.d).slice(0,u))if(c=c.times(2),a!==0&&(c=c.plus(sc(_,u+2,y).times(a+``))),c=Q(c,new _(p),u,1),t==null)if(nc(c.d,u-m,v,s))_.precision=u+=m,l=o=h=Q(d.minus(1),d.plus(1),u,1),f=$(h.times(h),u,1),i=s=1;else return $(c,_.precision=y,v,K=!0);else return _.precision=y,c;c=l,i+=2}}function gc(e){return String(e.s*e.s/0)}function _c(e,t){var n,r,i;for((n=t.indexOf(`.`))>-1&&(t=t.replace(`.`,``)),(r=t.search(/e/i))>0?(n<0&&(n=r),n+=+t.slice(r+1),t=t.substring(0,r)):n<0&&(n=t.length),r=0;t.charCodeAt(r)===48;r++);for(i=t.length;t.charCodeAt(i-1)===48;--i);if(t=t.slice(r,i),t){if(i-=r,e.e=n=n-r-1,e.d=[],r=(n+1)%Y,n<0&&(r+=Y),r<i){for(r&&e.d.push(+t.slice(0,r)),i-=Y;r<i;)e.d.push(+t.slice(r,r+=Y));t=t.slice(r),r=Y-t.length}else r-=i;for(;r--;)t+=`0`;e.d.push(+t),K&&(e.e>e.constructor.maxE?(e.d=null,e.e=NaN):e.e<e.constructor.minE&&(e.e=0,e.d=[0]))}else e.e=0,e.d=[0];return e}function vc(e,t){var n,r,i,a,o,s,c,l,u;if(t.indexOf(`_`)>-1){if(t=t.replace(/(\d)_(?=\d)/g,`$1`),Xs.test(t))return _c(e,t)}else if(t===`Infinity`||t===`NaN`)return+t||(e.s=NaN),e.e=NaN,e.d=null,e;if(Js.test(t))n=16,t=t.toLowerCase();else if(qs.test(t))n=2;else if(Ys.test(t))n=8;else throw Error(Us+t);for(a=t.search(/p/i),a>0?(c=+t.slice(a+1),t=t.substring(2,a)):t=t.slice(2),a=t.indexOf(`.`),o=a>=0,r=e.constructor,o&&(t=t.replace(`.`,``),s=t.length,a=s-a,i=dc(r,new r(n),a,a*2)),l=rc(t,n,Zs),u=l.length-1,a=u;l[a]===0;--a)l.pop();return a<0?new r(e.s*0):(e.e=oc(l,u),e.d=l,K=!1,o&&(e=Q(e,i,s*4)),c&&(e=e.times(Math.abs(c)<54?J(2,c):fl.pow(2,c))),K=!0,e)}function yc(e,t){var n,r=t.d.length;if(r<3)return t.isZero()?t:bc(e,2,t,t);n=1.4*Math.sqrt(r),n=n>16?16:n|0,t=t.times(1/xc(5,n)),t=bc(e,2,t,t);for(var i,a=new e(5),o=new e(16),s=new e(20);n--;)i=t.times(t),t=t.times(a.plus(i.times(o.times(i).minus(s))));return t}function bc(e,t,n,r,i){var a,o,s,c,l=1,u=e.precision,d=Math.ceil(u/Y);for(K=!1,c=n.times(n),s=new e(r);;){if(o=Q(s.times(c),new e(t++*t++),u,1),s=i?r.plus(o):r.minus(o),r=Q(o.times(c),new e(t++*t++),u,1),o=s.plus(r),o.d[d]!==void 0){for(a=d;o.d[a]===s.d[a]&&a--;);if(a==-1)break}a=s,s=r,r=o,o=a,l++}return K=!0,o.d.length=d+1,o}function xc(e,t){for(var n=e;--t;)n*=e;return n}function Sc(e,t){var n,r=t.s<0,i=cc(e,e.precision,1),a=i.times(.5);if(t=t.abs(),t.lte(a))return Vs=r?4:1,t;if(n=t.divToInt(i),n.isZero())Vs=r?3:2;else{if(t=t.minus(n.times(i)),t.lte(a))return Vs=fc(n)?r?2:3:r?4:1,t;Vs=fc(n)?r?1:4:r?3:2}return t.minus(i).abs()}function Cc(e,t,n,r){var i,a,o,s,c,l,u,d,f,p=e.constructor,m=n!==void 0;if(m?(tc(n,1,Fs),r===void 0?r=p.rounding:tc(r,0,8)):(n=p.precision,r=p.rounding),!e.isFinite())u=gc(e);else{for(u=ac(e),o=u.indexOf(`.`),m?(i=2,t==16?n=n*4-3:t==8&&(n=n*3-2)):i=t,o>=0&&(u=u.replace(`.`,``),f=new p(1),f.e=u.length-o,f.d=rc(ac(f),10,i),f.e=f.d.length),d=rc(u,10,i),a=c=d.length;d[--c]==0;)d.pop();if(!d[0])u=m?`0p+0`:`0`;else{if(o<0?a--:(e=new p(e),e.d=d,e.e=a,e=Q(e,f,n,r,0,i),d=e.d,a=e.e,l=Bs),o=d[n],s=i/2,l||=d[n+1]!==void 0,l=r<4?(o!==void 0||l)&&(r===0||r===(e.s<0?3:2)):o>s||o===s&&(r===4||l||r===6&&d[n-1]&1||r===(e.s<0?8:7)),d.length=n,l)for(;++d[--n]>i-1;)d[n]=0,n||(++a,d.unshift(1));for(c=d.length;!d[c-1];--c);for(o=0,u=``;o<c;o++)u+=Is.charAt(d[o]);if(m){if(c>1)if(t==16||t==8){for(o=t==16?4:3,--c;c%o;c++)u+=`0`;for(d=rc(u,i,t),c=d.length;!d[c-1];--c);for(o=1,u=`1.`;o<c;o++)u+=Is.charAt(d[o])}else u=u.charAt(0)+`.`+u.slice(1);u=u+(a<0?`p`:`p+`)+a}else if(a<0){for(;++a;)u=`0`+u;u=`0.`+u}else if(++a>c)for(a-=c;a--;)u+=`0`;else a<c&&(u=u.slice(0,a)+`.`+u.slice(a))}u=(t==16?`0x`:t==2?`0b`:t==8?`0o`:``)+u}return e.s<0?`-`+u:u}function wc(e,t){if(e.length>t)return e.length=t,!0}function Tc(e){return new this(e).abs()}function Ec(e){return new this(e).acos()}function Dc(e){return new this(e).acosh()}function Oc(e,t){return new this(e).plus(t)}function kc(e){return new this(e).asin()}function Ac(e){return new this(e).asinh()}function jc(e){return new this(e).atan()}function Mc(e){return new this(e).atanh()}function Nc(e,t){e=new this(e),t=new this(t);var n,r=this.precision,i=this.rounding,a=r+4;return!e.s||!t.s?n=new this(NaN):!e.d&&!t.d?(n=cc(this,a,1).times(t.s>0?.25:.75),n.s=e.s):!t.d||e.isZero()?(n=t.s<0?cc(this,r,i):new this(0),n.s=e.s):!e.d||t.isZero()?(n=cc(this,a,1).times(.5),n.s=e.s):t.s<0?(this.precision=a,this.rounding=1,n=this.atan(Q(e,t,a,1)),t=cc(this,a,1),this.precision=r,this.rounding=i,n=e.s<0?n.minus(t):n.plus(t)):n=this.atan(Q(e,t,a,1)),n}function Pc(e){return new this(e).cbrt()}function Fc(e){return $(e=new this(e),e.e+1,2)}function Ic(e,t,n){return new this(e).clamp(t,n)}function Lc(e){if(!e||typeof e!=`object`)throw Error(Hs+`Object expected`);var t,n,r,i=e.defaults===!0,a=[`precision`,1,Fs,`rounding`,0,8,`toExpNeg`,-Ps,0,`toExpPos`,0,Ps,`maxE`,0,Ps,`minE`,-Ps,0,`modulo`,0,9];for(t=0;t<a.length;t+=3)if(n=a[t],i&&(this[n]=zs[n]),(r=e[n])!==void 0)if(q(r)===r&&r>=a[t+1]&&r<=a[t+2])this[n]=r;else throw Error(Us+n+`: `+r);if(n=`crypto`,i&&(this[n]=zs[n]),(r=e[n])!==void 0)if(r===!0||r===!1||r===0||r===1)if(r)if(typeof crypto<`u`&&crypto&&(crypto.getRandomValues||crypto.randomBytes))this[n]=!0;else throw Error(Gs);else this[n]=!1;else throw Error(Us+n+`: `+r);return this}function Rc(e){return new this(e).cos()}function zc(e){return new this(e).cosh()}function Bc(e){var t,n,r;function i(e){var t,n,r,a=this;if(!(a instanceof i))return new i(e);if(a.constructor=i,Gc(e)){a.s=e.s,K?!e.d||e.e>i.maxE?(a.e=NaN,a.d=null):e.e<i.minE?(a.e=0,a.d=[0]):(a.e=e.e,a.d=e.d.slice()):(a.e=e.e,a.d=e.d?e.d.slice():e.d);return}if(r=typeof e,r===`number`){if(e===0){a.s=1/e<0?-1:1,a.e=0,a.d=[0];return}if(e<0?(e=-e,a.s=-1):a.s=1,e===~~e&&e<1e7){for(t=0,n=e;n>=10;n/=10)t++;K?t>i.maxE?(a.e=NaN,a.d=null):t<i.minE?(a.e=0,a.d=[0]):(a.e=t,a.d=[e]):(a.e=t,a.d=[e]);return}if(e*0!=0){e||(a.s=NaN),a.e=NaN,a.d=null;return}return _c(a,e.toString())}if(r===`string`)return(n=e.charCodeAt(0))===45?(e=e.slice(1),a.s=-1):(n===43&&(e=e.slice(1)),a.s=1),Xs.test(e)?_c(a,e):vc(a,e);if(r===`bigint`)return e<0?(e=-e,a.s=-1):a.s=1,_c(a,e.toString());throw Error(Us+e)}if(i.prototype=X,i.ROUND_UP=0,i.ROUND_DOWN=1,i.ROUND_CEIL=2,i.ROUND_FLOOR=3,i.ROUND_HALF_UP=4,i.ROUND_HALF_DOWN=5,i.ROUND_HALF_EVEN=6,i.ROUND_HALF_CEIL=7,i.ROUND_HALF_FLOOR=8,i.EUCLID=9,i.config=i.set=Lc,i.clone=Bc,i.isDecimal=Gc,i.abs=Tc,i.acos=Ec,i.acosh=Dc,i.add=Oc,i.asin=kc,i.asinh=Ac,i.atan=jc,i.atanh=Mc,i.atan2=Nc,i.cbrt=Pc,i.ceil=Fc,i.clamp=Ic,i.cos=Rc,i.cosh=zc,i.div=Vc,i.exp=Hc,i.floor=Uc,i.hypot=Wc,i.ln=Kc,i.log=qc,i.log10=Yc,i.log2=Jc,i.max=Xc,i.min=Zc,i.mod=Qc,i.mul=$c,i.pow=el,i.random=tl,i.round=nl,i.sign=rl,i.sin=il,i.sinh=al,i.sqrt=ol,i.sub=sl,i.sum=cl,i.tan=ll,i.tanh=ul,i.trunc=dl,e===void 0&&(e={}),e&&e.defaults!==!0)for(r=[`precision`,`rounding`,`toExpNeg`,`toExpPos`,`maxE`,`minE`,`modulo`,`crypto`],t=0;t<r.length;)e.hasOwnProperty(n=r[t++])||(e[n]=this[n]);return i.config(e),i}function Vc(e,t){return new this(e).div(t)}function Hc(e){return new this(e).exp()}function Uc(e){return $(e=new this(e),e.e+1,3)}function Wc(){var e,t,n=new this(0);for(K=!1,e=0;e<arguments.length;)if(t=new this(arguments[e++]),t.d)n.d&&(n=n.plus(t.times(t)));else{if(t.s)return K=!0,new this(1/0);n=t}return K=!0,n.sqrt()}function Gc(e){return e instanceof fl||e&&e.toStringTag===Ks||!1}function Kc(e){return new this(e).ln()}function qc(e,t){return new this(e).log(t)}function Jc(e){return new this(e).log(2)}function Yc(e){return new this(e).log(10)}function Xc(){return pc(this,arguments,-1)}function Zc(){return pc(this,arguments,1)}function Qc(e,t){return new this(e).mod(t)}function $c(e,t){return new this(e).mul(t)}function el(e,t){return new this(e).pow(t)}function tl(e){var t,n,r,i,a=0,o=new this(1),s=[];if(e===void 0?e=this.precision:tc(e,1,Fs),r=Math.ceil(e/Y),!this.crypto)for(;a<r;)s[a++]=Math.random()*1e7|0;else if(crypto.getRandomValues)for(t=crypto.getRandomValues(new Uint32Array(r));a<r;)i=t[a],i>=429e7?t[a]=crypto.getRandomValues(new Uint32Array(1))[0]:s[a++]=i%1e7;else if(crypto.randomBytes){for(t=crypto.randomBytes(r*=4);a<r;)i=t[a]+(t[a+1]<<8)+(t[a+2]<<16)+((t[a+3]&127)<<24),i>=214e7?crypto.randomBytes(4).copy(t,a):(s.push(i%1e7),a+=4);a=r/4}else throw Error(Gs);for(r=s[--a],e%=Y,r&&e&&(i=J(10,Y-e),s[a]=(r/i|0)*i);s[a]===0;a--)s.pop();if(a<0)n=0,s=[0];else{for(n=-1;s[0]===0;n-=Y)s.shift();for(r=1,i=s[0];i>=10;i/=10)r++;r<Y&&(n-=Y-r)}return o.e=n,o.d=s,o}function nl(e){return $(e=new this(e),e.e+1,this.rounding)}function rl(e){return e=new this(e),e.d?e.d[0]?e.s:0*e.s:e.s||NaN}function il(e){return new this(e).sin()}function al(e){return new this(e).sinh()}function ol(e){return new this(e).sqrt()}function sl(e,t){return new this(e).sub(t)}function cl(){var e=0,t=arguments,n=new this(t[e]);for(K=!1;n.s&&++e<t.length;)n=n.plus(t[e]);return K=!0,$(n,this.precision,this.rounding)}function ll(e){return new this(e).tan()}function ul(e){return new this(e).tanh()}function dl(e){return $(e=new this(e),e.e+1,1)}X[Symbol.for(`nodejs.util.inspect.custom`)]=X.toString,X[Symbol.toStringTag]=`Decimal`;var fl=X.constructor=Bc(zs);Ls=new fl(Ls),Rs=new fl(Rs);var pl=`1e-35`,ml=`8`,hl=40,gl=340;function _l(e){return Number.isFinite(e)&&e>=1e4}function vl(e){let t=new fl(e).e;return Math.min(gl,Math.max(50,Math.max(0,-t)+hl))}function yl(e){return fl.clone({precision:vl(e),rounding:fl.ROUND_HALF_EVEN,toExpNeg:-1e3,toExpPos:1e3})}function bl(e,t){return e.toSignificantDigits(t).toString()}function xl(e,t){let n=Number.isFinite(t)&&t>0?Math.max(Number(pl),Math.min(Number(ml),t)):Number(pl);return{center:[String(e[0]),String(e[1])],scale:String(n)}}function Sl(e,t,n){let r=fl.clone({precision:gl,rounding:fl.ROUND_HALF_EVEN,toExpNeg:-1e3,toExpPos:1e3}),i=new r(e[0]),a=new r(e[1]),o=new r(t);if(!i.isFinite()||!a.isFinite()||!Number.isFinite(i.toNumber())||!Number.isFinite(a.toNumber()))throw Error(`Координаты должны быть конечными числами.`);if(!o.isFinite()||o.lte(0))throw Error(`Масштаб должен быть положительным конечным числом.`);return{center:[i.toString(),a.toString()],scale:new r(n.toString()).dividedBy(o).toString()}}function Cl(e,t){let n=new(yl(t))(e.toString()).dividedBy(t);return Math.abs(n.e)>=12?n.toExponential():n.toString()}function wl(e,t=pl){let n=yl(e.scale),r=vl(e.scale),i=n.min(ml,n.max(pl,new n(t))),a=n.max(i,n.min(ml,new n(e.scale)));return{center:e.center,scale:bl(a,r)}}function Tl(e){return{center:[Number(e.center[0]),Number(e.center[1])],scale:Number(e.scale)}}function El(e,t){let n=yl(e.scale),r=vl(e.scale),i=new n(e.scale);return{center:[bl(new n(e.center[0]).plus(i.times(t[0].toString())),r),bl(new n(e.center[1]).plus(i.times(t[1].toString())),r)],scale:e.scale}}function Dl(e,t,n,r,i=pl){if(!Number.isFinite(r)||r<=0)return e;let a=yl(e.scale),o=vl(e.scale),s=new a(e.scale),c=a.min(ml,a.max(pl,new a(i))),l=s.times(r.toString());return l=a.max(c,a.min(ml,l)),{center:[0,1].map(r=>bl(new a(e.center[r]).plus(s.times(t[r].toString())).minus(l.times(n[r].toString())),o)),scale:bl(l,o)}}function Ol(e,t,n){return new(yl(n))(e).minus(t).toNumber()}function kl(e,t){let n=Math.max(0,-new fl(t).e),r=Math.max(6,Math.min(36,n+3));return new fl(e).toFixed(r).replace(`-`,`−`)}var Al=Ms[0];function jl(e){return Ms.find(t=>t.id===e)??Al}function Ml(e){let t=jl(e).initialView;return xl(t.center,t.scale)}function Nl(e){let t=jl(e);return t.deepZoom?.maxMagnification===void 0?t.renderer===`geometric-ifs`?String(t.initialView.scale*t.geometricIfs.contractionRatio**t.geometricIfs.recommendedMaxDepth):pl:String(t.initialView.scale/t.deepZoom.maxMagnification)}function Pl(e){return e.renderer===`geometric-ifs`?1:e.suggestedIterations}function Fl(e,t){let n=wl(t,Nl(e.activeFormulaId)),r=Tl(n);e.center=r.center,e.scale=r.scale,e.exactCenter=[n.center[0],n.center[1]],e.exactScale=n.scale}var Il=xs(`fractal`,{state:()=>{let e=Ml(Al.id),t=Tl(e);return{activeFormulaId:Al.id,center:t.center,scale:t.scale,exactCenter:[e.center[0],e.center[1]],exactScale:e.scale,maxIterations:Pl(Al),palette:0,colorDensity:.075,colorOffset:0,smoothColors:!0,recursionDepthMode:`auto`,recursionDepth:8,geometricColoring:`level`,parameterValues:Ns(Al)}},getters:{activeFormula:e=>jl(e.activeFormulaId),magnification:e=>jl(e.activeFormulaId).initialView.scale/e.scale},actions:{selectFormula(e){let t=jl(e);this.activeFormulaId=t.id,Fl(this,Ml(t.id)),this.maxIterations=Pl(t),this.parameterValues=Ns(t),t.renderer===`geometric-ifs`&&(this.recursionDepthMode=`auto`,this.recursionDepth=t.geometricIfs.defaultDepth,this.geometricColoring=t.geometricIfs.defaultColoring)},resetCamera(){Fl(this,Ml(this.activeFormulaId)),this.colorOffset=0},panByPixels(e,t,n){let r=Math.max(n,1);Fl(this,El({center:this.exactCenter,scale:this.exactScale},[-e/r,t/r]))},panByNormalized(e){Fl(this,El({center:this.exactCenter,scale:this.exactScale},e))},setCamera(e,t){Fl(this,xl(e,t))},setExactCamera(e){Fl(this,e)},transformCamera(e,t,n){let r={center:this.exactCenter,scale:this.exactScale},i=Dl(r,e,t,n,Nl(this.activeFormulaId));(i.center[0]!==r.center[0]||i.center[1]!==r.center[1]||i.scale!==r.scale)&&Fl(this,i)},zoomFromCenter(e){this.transformCamera([0,0],[0,0],e)},setParameter(e,t){let n=this.activeFormula.parameters.find(t=>t.key===e),r=t;n?.type===`number`&&typeof t==`number`&&(r=Math.max(n.min??-1/0,Math.min(n.max??1/0,t))),this.parameterValues={...this.parameterValues,[e]:r}},setRecursionDepth(e){let t=this.activeFormula,n=t.renderer===`geometric-ifs`?t.geometricIfs.recommendedMaxDepth:32;this.recursionDepth=Math.max(1,Math.min(n,Math.trunc(e)))}}}),Ll=class extends Error{constructor(){super(`Расчёт аттрактора отменён.`),this.name=`CliffordTrajectoryCancelledError`}},Rl=class{#e;#t;#n=0;request(e){this.cancel();let t=++this.#n,n=new Worker(new URL(`/fractal-lab/assets/clifford.worker-HSDpcMNi.js`,``+import.meta.url),{type:`module`});return this.#e=n,new Promise((r,i)=>{this.#t=i,n.onmessage=e=>{let n=e.data;if(n.type===`error`&&n.requestId===t){this.#r(),i(Error(n.message));return}n.type===`result`&&n.result.requestId===t&&(this.#r(),r(n.result))},n.onerror=e=>{this.#r(),i(Error(e.message||`Ошибка worker аттрактора Clifford.`))},n.postMessage({...e,requestId:t})})}cancel(){if(!this.#e)return;this.#e.terminate(),this.#e=void 0;let e=this.#t;this.#t=void 0,e?.(new Ll)}#r(){this.#e?.terminate(),this.#e=void 0,this.#t=void 0}},zl=2052,Bl=`#version 300 es
precision highp float;

const vec2 POSITIONS[3] = vec2[3](
  vec2(-1.0, -1.0),
  vec2(3.0, -1.0),
  vec2(-1.0, 3.0)
);

void main() {
  gl_Position = vec4(POSITIONS[gl_VertexID], 0.0, 1.0);
}
`;function Vl(e){return e.parameters.map(e=>`uniform ${e.type===`complex`?`vec2`:`float`} ${e.uniform};`).join(`
`)}function Hl(e){return`#version 300 es
precision highp float;

out vec4 outColor;

uniform vec2 u_resolution;
uniform vec2 u_center;
uniform float u_scale;
uniform int u_maxIterations;
uniform int u_palette;
uniform float u_colorDensity;
uniform float u_colorOffset;
uniform bool u_smoothColors;

${Vl(e)}

vec2 complexSquare(vec2 value) {
  return vec2(
    value.x * value.x - value.y * value.y,
    2.0 * value.x * value.y
  );
}

vec3 cosinePalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318530718 * (c * t + d));
}

vec3 palette(float t) {
  if (u_palette == 1) {
    return cosinePalette(
      t,
      vec3(0.50),
      vec3(0.50),
      vec3(1.0),
      vec3(0.00, 0.10, 0.20)
    );
  }

  if (u_palette == 2) {
    return cosinePalette(
      t,
      vec3(0.52, 0.48, 0.42),
      vec3(0.48, 0.44, 0.38),
      vec3(1.0, 0.8, 0.6),
      vec3(0.00, 0.12, 0.20)
    );
  }

  if (u_palette == 3) {
    return cosinePalette(
      t,
      vec3(0.48, 0.50, 0.54),
      vec3(0.46, 0.48, 0.44),
      vec3(1.0, 1.0, 1.0),
      vec3(0.72, 0.42, 0.18)
    );
  }

  return cosinePalette(
    t,
    vec3(0.46, 0.44, 0.53),
    vec3(0.50, 0.45, 0.48),
    vec3(1.0, 0.82, 0.66),
    vec3(0.74, 0.52, 0.28)
  );
}

float noise(vec2 position) {
  return fract(sin(dot(position, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 pixel = gl_FragCoord.xy - 0.5 * u_resolution;
  vec2 point = u_center + pixel * (u_scale / u_resolution.y);

  ${e.shader.setup}

  int iteration = 0;
  int postEscapeIterations = 0;
  bool didEscape = false;

  for (int i = 0; i < ${zl}; i++) {
    if (!didEscape && i >= u_maxIterations) {
      break;
    }

    bool wasEscaped = didEscape;
    ${e.shader.iterate}

    if (!didEscape && ${e.shader.escaped}) {
      iteration = i;
      didEscape = true;
      if (!u_smoothColors || dot(z, z) > 1e24) {
        break;
      }
    }

    if (wasEscaped) {
      postEscapeIterations += 1;
      if (
        postEscapeIterations >= 4 ||
        dot(z, z) > 1e24
      ) {
        break;
      }
    }
  }

  if (!didEscape) {
    outColor = vec4(0.012, 0.016, 0.027, 1.0);
    return;
  }

  float colorIteration = float(iteration);
  if (u_smoothColors) {
    float logMagnitude = 0.5 * log(max(dot(z, z), 1.000001));
    float smoothing = log(max(logMagnitude / log(2.0), 0.000001));
    colorIteration +=
      1.0 +
      float(postEscapeIterations) -
      smoothing / log(${e.escapePower.toFixed(1)});
  }

  float colorPosition = colorIteration * u_colorDensity + u_colorOffset;
  vec3 color = max(palette(colorPosition), vec3(0.0));

  color += (noise(gl_FragCoord.xy) - 0.5) / 255.0;
  outColor = vec4(color, 1.0);
}
`}var Ul=[`u_resolution`,`u_center`,`u_scale`,`u_maxIterations`,`u_palette`,`u_colorDensity`,`u_colorOffset`,`u_smoothColors`];function Wl(e,t,n){let r=e.createShader(t);if(!r)throw Error(`WebGL не смог создать шейдер.`);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS)){let t=e.getShaderInfoLog(r)??`Неизвестная ошибка компиляции.`;throw e.deleteShader(r),Error(`Ошибка компиляции GLSL:\n${t}`)}return r}function Gl(e,t,n){let r=Wl(e,e.VERTEX_SHADER,t),i=Wl(e,e.FRAGMENT_SHADER,n),a=e.createProgram();if(!a)throw e.deleteShader(r),e.deleteShader(i),Error(`WebGL не смог создать программу.`);if(e.attachShader(a,r),e.attachShader(a,i),e.linkProgram(a),e.deleteShader(r),e.deleteShader(i),!e.getProgramParameter(a,e.LINK_STATUS)){let t=e.getProgramInfoLog(a)??`Неизвестная ошибка линковки.`;throw e.deleteProgram(a),Error(`Ошибка линковки WebGL-программы:\n${t}`)}return a}function Kl(e,t,n){let r=e.getUniformLocation(t,n);if(r===null)throw Error(`Uniform ${n} отсутствует в шейдере.`);return r}var ql=class{#e;#t;#n;#r;#i;#a=new Map;#o=new Map;constructor(e){let t=e.getContext(`webgl2`,{alpha:!1,antialias:!1,depth:!1,powerPreference:`high-performance`,preserveDrawingBuffer:!1,stencil:!1});if(!t)throw Error(`WebGL2 недоступен. Проверьте поддержку браузера и аппаратное ускорение.`);let n=t.createVertexArray();if(!n)throw Error(`WebGL не смог создать vertex array.`);this.#e=e,this.#t=t,this.#n=n,t.bindVertexArray(n)}setFormula(e){let t=Gl(this.#t,Bl,Hl(e)),n=new Map,r=new Map;for(let e of Ul)n.set(e,Kl(this.#t,t,e));for(let n of e.parameters)r.set(n.key,Kl(this.#t,t,n.uniform));this.#i&&this.#t.deleteProgram(this.#i),this.#r=e,this.#i=t,this.#a=n,this.#o=r}resize(e){let t=Math.min(window.devicePixelRatio||1,2)*e,n=Math.max(1,Math.round(this.#e.clientWidth*t)),r=Math.max(1,Math.round(this.#e.clientHeight*t));return this.#e.width===n&&this.#e.height===r?!1:(this.#e.width=n,this.#e.height=r,!0)}render(e){if(!this.#i||!this.#r)throw Error(`Формула не выбрана.`);let t=this.#t;t.disable(t.BLEND),t.viewport(0,0,this.#e.width,this.#e.height),t.useProgram(this.#i),t.bindVertexArray(this.#n),t.uniform2f(this.#a.get(`u_resolution`),this.#e.width,this.#e.height),t.uniform2f(this.#a.get(`u_center`),e.center[0],e.center[1]),t.uniform1f(this.#a.get(`u_scale`),e.scale),t.uniform1i(this.#a.get(`u_maxIterations`),e.maxIterations),t.uniform1i(this.#a.get(`u_palette`),e.palette),t.uniform1f(this.#a.get(`u_colorDensity`),e.colorDensity),t.uniform1f(this.#a.get(`u_colorOffset`),e.colorOffset),t.uniform1i(this.#a.get(`u_smoothColors`),+!!e.smoothColors);for(let n of this.#r.parameters){let r=this.#o.get(n.key),i=e.parameters[n.key];!r||i===void 0||(n.type===`complex`&&Array.isArray(i)?t.uniform2f(r,i[0],i[1]):n.type===`number`&&typeof i==`number`&&t.uniform1f(r,i))}t.drawArrays(t.TRIANGLES,0,3)}dispose(){this.#i&&=(this.#t.deleteProgram(this.#i),void 0),this.#t.deleteVertexArray(this.#n)}},Jl=2048;function Yl(e){return e.parameters.map(e=>`uniform ${e.type===`complex`?`vec2`:`float`} ${e.uniform};`).join(`
`)}function Xl(e){return e.basinBackend===`newton-cubic`?`
  vec2 z = point;
  int resultKind = 0;
  int rootIndex = 0;
  int iteration = 0;
  int convergenceRefinementSteps = 0;
  float finalMetric = 1.0;
  float smoothingThreshold = max(u_convergenceTolerance, 1e-12);
  vec2 previousZ = z;
  bool hasPreviousZ = false;

  for (int i = 0; i < ${Jl}; i++) {
    if (i >= u_maxIterations) {
      break;
    }

    vec2 zBeforeStep = z;
    vec2 correction;
    if (!calculateNewtonCorrection(z, correction)) {
      break;
    }

    float currentMetric = length(correction);
    z -= correction;
    iteration = i;
    finalMetric = currentMetric;

    if (dot(correction, correction) <= u_convergenceTolerance * u_convergenceTolerance) {
      rootIndex = nearestRoot(z);
      vec2 root = cubicRoot(rootIndex);
      vec2 localError = zBeforeStep - root;
      if (hasPreviousZ) {
        localError = iterateNewtonLocalError(previousZ - root, root);
      }
      localError = iterateNewtonLocalError(localError, root);
      finalMetric = stableComplexMagnitude(localError);
      convergenceRefinementSteps = 1;
      resultKind = 1;
      break;
    }

    previousZ = zBeforeStep;
    hasPreviousZ = true;
  }
`:`
  vec2 z = vec2(1.0, 0.0);
  vec2 c = point;
  int resultKind = 0;
  int rootIndex = 0;
  int iteration = 0;
  float previousMetric = 1.0;
  float finalMetric = 1.0;
  float smoothingThreshold = max(u_convergenceTolerance, 1e-12);
  bool hasPreviousMetric = false;
  float escapeRadiusSquared = u_novaEscapeRadius * u_novaEscapeRadius;

  for (int i = 0; i < ${Jl}; i++) {
    if (i >= u_maxIterations) {
      break;
    }

    float previousMagnitude = length(z);
    vec2 correction;
    if (!calculateNewtonCorrection(z, correction)) {
      break;
    }

    vec2 nextZ = z - u_novaRelaxation * correction + c;
    vec2 delta = nextZ - z;
    z = nextZ;
    iteration = i;
    float currentMetric = length(delta);
    finalMetric = currentMetric;

    if (dot(z, z) > escapeRadiusSquared) {
      previousMetric = previousMagnitude;
      finalMetric = length(z);
      smoothingThreshold = max(u_novaEscapeRadius, 1e-12);
      hasPreviousMetric = true;
      resultKind = 2;
      break;
    }
    if (dot(delta, delta) <= u_convergenceTolerance * u_convergenceTolerance) {
      rootIndex = nearestRoot(z);
      resultKind = 1;
      break;
    }

    previousMetric = currentMetric;
    hasPreviousMetric = true;
  }
`}function Zl(e){return e.basinBackend===`newton-cubic`?`
    colorIteration += quadraticConvergencePhase(
      finalMetric,
      smoothingThreshold,
      convergenceRefinementSteps
    );
`:`
    colorIteration += hasPreviousMetric
      ? thresholdCrossingPhase(previousMetric, finalMetric, smoothingThreshold)
      : 1.0;
`}function Ql(e){return`#version 300 es
precision highp float;

out vec4 outColor;

uniform vec2 u_resolution;
uniform vec2 u_center;
uniform float u_scale;
uniform int u_maxIterations;
uniform int u_palette;
uniform float u_colorDensity;
uniform float u_colorOffset;
uniform bool u_smoothColors;

${Yl(e)}

vec2 complexSquare(vec2 value) {
  return vec2(
    value.x * value.x - value.y * value.y,
    2.0 * value.x * value.y
  );
}

vec2 complexMultiply(vec2 left, vec2 right) {
  return vec2(
    left.x * right.x - left.y * right.y,
    left.x * right.y + left.y * right.x
  );
}

vec2 complexDivide(vec2 numerator, vec2 denominator, float denominatorSquared) {
  return vec2(
    dot(numerator, denominator),
    numerator.y * denominator.x - numerator.x * denominator.y
  ) / denominatorSquared;
}

bool stableComplexDivide(
  vec2 numerator,
  vec2 denominator,
  out vec2 quotient
) {
  float denominatorScale = max(abs(denominator.x), abs(denominator.y));
  if (denominatorScale == 0.0) {
    return false;
  }

  vec2 normalizedDenominator = denominator / denominatorScale;
  float denominatorSquared = dot(
    normalizedDenominator,
    normalizedDenominator
  );
  quotient =
    complexDivide(
      numerator,
      normalizedDenominator,
      denominatorSquared
    ) /
    denominatorScale;
  return !any(isnan(quotient)) && !any(isinf(quotient));
}

bool divideFastOrStable(
  vec2 numerator,
  vec2 denominator,
  out vec2 quotient
) {
  float denominatorSquared = dot(denominator, denominator);
  if (
    denominatorSquared >= 1e-20 &&
    denominatorSquared <= 1e20
  ) {
    quotient = complexDivide(
      numerator,
      denominator,
      denominatorSquared
    );
    return !any(isnan(quotient)) && !any(isinf(quotient));
  }
  return stableComplexDivide(numerator, denominator, quotient);
}

bool calculateNewtonCorrection(
  vec2 value,
  out vec2 correction
) {
  vec2 reciprocal;
  if (!divideFastOrStable(vec2(1.0, 0.0), value, reciprocal)) {
    return false;
  }

  // (z^3 - 1) / (3 z^2) = (z - 1 / z^2) / 3. The equivalent
  // reciprocal form stays finite after a close pass by the pole, where z is
  // huge but z^3 would overflow a highp float.
  vec2 reciprocalSquared = complexSquare(reciprocal);
  correction = (value - reciprocalSquared) / 3.0;
  return !any(isnan(correction)) && !any(isinf(correction));
}

int nearestRoot(vec2 value) {
  const vec2 ROOT_0 = vec2(1.0, 0.0);
  const vec2 ROOT_1 = vec2(-0.5, 0.866025403784);
  const vec2 ROOT_2 = vec2(-0.5, -0.866025403784);
  float distance0 = dot(value - ROOT_0, value - ROOT_0);
  float distance1 = dot(value - ROOT_1, value - ROOT_1);
  float distance2 = dot(value - ROOT_2, value - ROOT_2);
  if (distance0 <= distance1 && distance0 <= distance2) return 0;
  if (distance1 <= distance2) return 1;
  return 2;
}

vec2 cubicRoot(int index) {
  if (index == 0) return vec2(1.0, 0.0);
  if (index == 1) return vec2(-0.5, 0.866025403784);
  return vec2(-0.5, -0.866025403784);
}

float stableComplexMagnitude(vec2 value) {
  float scale = max(abs(value.x), abs(value.y));
  if (scale == 0.0) {
    return 0.0;
  }
  return scale * length(value / scale);
}

vec2 iterateNewtonLocalError(vec2 error, vec2 root) {
  vec2 errorSquared = complexSquare(error);
  vec2 numerator = complexMultiply(errorSquared, 3.0 * root + 2.0 * error);
  vec2 denominator = 3.0 * complexSquare(root + error);
  float denominatorSquared = dot(denominator, denominator);
  if (denominatorSquared < 1e-20) {
    return vec2(0.0);
  }
  return complexDivide(numerator, denominator, denominatorSquared);
}

float thresholdCrossingPhase(
  float previousMetric,
  float currentMetric,
  float threshold
) {
  vec3 metrics = vec3(previousMetric, currentMetric, threshold);
  if (
    any(isnan(metrics)) ||
    any(isinf(metrics)) ||
    any(lessThanEqual(metrics, vec3(0.0)))
  ) {
    return 1.0;
  }

  float previousLog = log(previousMetric);
  float currentLog = log(currentMetric);
  float denominator = currentLog - previousLog;
  if (abs(denominator) < 1e-6) {
    return 1.0;
  }

  return clamp((log(threshold) - previousLog) / denominator, 0.0, 1.0);
}

float quadraticConvergencePhase(
  float currentMetric,
  float threshold,
  int refinementSteps
) {
  if (currentMetric == 0.0) {
    return 0.0;
  }
  if (
    isnan(currentMetric) ||
    isinf(currentMetric) ||
    isnan(threshold) ||
    isinf(threshold) ||
    currentMetric < 0.0 ||
    currentMetric >= 1.0 ||
    threshold <= 0.0 ||
    threshold >= 1.0
  ) {
    return 1.0;
  }

  float metricLog = -log(currentMetric);
  float thresholdLog = -log(threshold);
  float phase =
    1.0 +
    float(max(refinementSteps, 0)) -
    log(metricLog / thresholdLog) / log(2.0);
  return clamp(phase, 0.0, 1.0);
}

vec3 cosinePalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318530718 * (c * t + d));
}

vec3 palette(float t) {
  if (u_palette == 1) {
    return cosinePalette(t, vec3(0.50), vec3(0.50), vec3(1.0), vec3(0.00, 0.10, 0.20));
  }
  if (u_palette == 2) {
    return cosinePalette(
      t,
      vec3(0.52, 0.48, 0.42),
      vec3(0.48, 0.44, 0.38),
      vec3(1.0, 0.8, 0.6),
      vec3(0.00, 0.12, 0.20)
    );
  }
  if (u_palette == 3) {
    return cosinePalette(
      t,
      vec3(0.48, 0.50, 0.54),
      vec3(0.46, 0.48, 0.44),
      vec3(1.0),
      vec3(0.72, 0.42, 0.18)
    );
  }
  return cosinePalette(
    t,
    vec3(0.46, 0.44, 0.53),
    vec3(0.50, 0.45, 0.48),
    vec3(1.0, 0.82, 0.66),
    vec3(0.74, 0.52, 0.28)
  );
}

float noise(vec2 position) {
  return fract(sin(dot(position, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 pixel = gl_FragCoord.xy - 0.5 * u_resolution;
  vec2 point = u_center + pixel * (u_scale / u_resolution.y);

${Xl(e)}

  if (resultKind == 0) {
    outColor = vec4(0.012, 0.016, 0.027, 1.0);
    return;
  }

  float colorIteration = float(iteration);
  if (u_smoothColors) {
${Zl(e)}
  }

  float normalizedIteration =
    clamp(colorIteration / max(float(u_maxIterations), 1.0), 0.0, 1.0);
  float rootPosition = float(rootIndex) / 3.0;
  float colorPosition;
  if (resultKind == 2) {
    colorPosition = colorIteration * u_colorDensity + u_colorOffset;
  } else {
    colorPosition =
      rootPosition +
      colorIteration * u_colorDensity * 0.18 +
      u_colorOffset;
  }

  float shade = 0.58 + 0.42 * (1.0 - normalizedIteration);

  vec3 color = max(palette(colorPosition), vec3(0.0)) * shade;
  if (resultKind == 2) {
    color *= vec3(0.64, 0.78, 1.0);
  }
  color += (noise(gl_FragCoord.xy) - 0.5) / 255.0;
  outColor = vec4(color, 1.0);
}
`}var $l=[`u_resolution`,`u_center`,`u_scale`,`u_maxIterations`,`u_palette`,`u_colorDensity`,`u_colorOffset`,`u_smoothColors`],eu=class{#e;#t;#n;#r;#i;#a=new Map;#o=new Map;constructor(e){let t=e.getContext(`webgl2`);if(!t)throw Error(`WebGL2 недоступен для root-basin renderer.`);let n=t.createVertexArray();if(!n)throw Error(`WebGL не смог создать root-basin vertex array.`);this.#e=e,this.#t=t,this.#n=n}setFormula(e){let t=Gl(this.#t,Bl,Ql(e)),n=new Map,r=new Map;for(let e of $l)n.set(e,Kl(this.#t,t,e));for(let n of e.parameters)r.set(n.key,Kl(this.#t,t,n.uniform));this.#i&&this.#t.deleteProgram(this.#i),this.#r=e,this.#i=t,this.#a=n,this.#o=r}resize(e){let t=Math.min(window.devicePixelRatio||1,2)*e,n=Math.max(1,Math.round(this.#e.clientWidth*t)),r=Math.max(1,Math.round(this.#e.clientHeight*t));return this.#e.width===n&&this.#e.height===r?!1:(this.#e.width=n,this.#e.height=r,!0)}render(e){if(!this.#r||!this.#i)throw Error(`Root-basin формула не выбрана.`);let t=this.#t;t.disable(t.BLEND),t.viewport(0,0,this.#e.width,this.#e.height),t.useProgram(this.#i),t.bindVertexArray(this.#n),t.uniform2f(this.#a.get(`u_resolution`),this.#e.width,this.#e.height),t.uniform2f(this.#a.get(`u_center`),e.center[0],e.center[1]),t.uniform1f(this.#a.get(`u_scale`),e.scale),t.uniform1i(this.#a.get(`u_maxIterations`),e.maxIterations),t.uniform1i(this.#a.get(`u_palette`),e.palette),t.uniform1f(this.#a.get(`u_colorDensity`),e.colorDensity),t.uniform1f(this.#a.get(`u_colorOffset`),e.colorOffset),t.uniform1i(this.#a.get(`u_smoothColors`),+!!e.smoothColors),this.#s(e.parameters),t.drawArrays(t.TRIANGLES,0,3)}dispose(){this.#i&&=(this.#t.deleteProgram(this.#i),void 0),this.#t.deleteVertexArray(this.#n)}#s(e){for(let t of this.#r.parameters){let n=this.#o.get(t.key),r=e[t.key];!n||r===void 0||(t.type===`complex`&&Array.isArray(r)?this.#t.uniform2f(n,r[0],r[1]):t.type===`number`&&typeof r==`number`&&this.#t.uniform1f(n,r))}}},tu=`#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_center;
uniform float u_scale;
uniform float u_pointSize;
uniform int u_pointCount;

out float v_progress;
out vec2 v_position;

void main() {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 position = vec2(
    2.0 * (a_position.x - u_center.x) / (u_scale * aspect),
    2.0 * (a_position.y - u_center.y) / u_scale
  );
  gl_Position = vec4(position, 0.0, 1.0);
  gl_PointSize = u_pointSize;
  v_progress = float(gl_VertexID) / max(float(u_pointCount - 1), 1.0);
  v_position = a_position;
}
`,nu=`#version 300 es
precision highp float;

in float v_progress;
in vec2 v_position;
out vec4 outColor;

uniform int u_palette;
uniform float u_colorOffset;
uniform float u_exposure;

vec3 cosinePalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318530718 * (c * t + d));
}

vec3 palette(float t) {
  if (u_palette == 1) {
    return cosinePalette(t, vec3(0.50), vec3(0.50), vec3(1.0), vec3(0.00, 0.10, 0.20));
  }
  if (u_palette == 2) {
    return cosinePalette(
      t,
      vec3(0.52, 0.48, 0.42),
      vec3(0.48, 0.44, 0.38),
      vec3(1.0, 0.8, 0.6),
      vec3(0.00, 0.12, 0.20)
    );
  }
  if (u_palette == 3) {
    return cosinePalette(
      t,
      vec3(0.48, 0.50, 0.54),
      vec3(0.46, 0.48, 0.44),
      vec3(1.0),
      vec3(0.72, 0.42, 0.18)
    );
  }
  return cosinePalette(
    t,
    vec3(0.46, 0.44, 0.53),
    vec3(0.50, 0.45, 0.48),
    vec3(1.0, 0.82, 0.66),
    vec3(0.74, 0.52, 0.28)
  );
}

void main() {
  float radius = length(gl_PointCoord - vec2(0.5));
  float coverage = 1.0 - smoothstep(0.28, 0.5, radius);
  float colorPosition =
    dot(v_position, vec2(0.11, 0.17)) +
    v_progress * 0.025 +
    u_colorOffset;
  vec3 color = max(palette(colorPosition), vec3(0.0));
  outColor = vec4(color, coverage * u_exposure);
}
`,ru=[`u_resolution`,`u_center`,`u_scale`,`u_pointSize`,`u_pointCount`,`u_palette`,`u_colorOffset`,`u_exposure`],iu=class{#e;#t;#n;#r;#i;#a=new Map;#o;#s=0;constructor(e){let t=e.getContext(`webgl2`);if(!t)throw Error(`WebGL2 недоступен для Clifford renderer.`);let n=t.createVertexArray(),r=t.createBuffer();if(!n||!r)throw Error(`WebGL не смог создать ресурсы Clifford renderer.`);this.#e=e,this.#t=t,this.#n=Gl(t,tu,nu),this.#r=n,this.#i=r,t.bindVertexArray(n),t.bindBuffer(t.ARRAY_BUFFER,r),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0);for(let e of ru)this.#a.set(e,Kl(t,this.#n,e));let i=t.getParameter(t.ALIASED_POINT_SIZE_RANGE);this.#o=i[1]??1}setPoints(e){let t=this.#t;t.bindBuffer(t.ARRAY_BUFFER,this.#i),t.bufferData(t.ARRAY_BUFFER,e,t.STATIC_DRAW),this.#s=Math.trunc(e.length/2)}clearPoints(){this.#s=0}resize(e){let t=Math.min(window.devicePixelRatio||1,2)*e,n=Math.max(1,Math.round(this.#e.clientWidth*t)),r=Math.max(1,Math.round(this.#e.clientHeight*t));return this.#e.width===n&&this.#e.height===r?!1:(this.#e.width=n,this.#e.height=r,!0)}render(e){let t=this.#t;if(t.viewport(0,0,this.#e.width,this.#e.height),t.clearColor(.004,.006,.012,1),t.clear(t.COLOR_BUFFER_BIT),this.#s===0)return;let n=this.#e.clientWidth>0?this.#e.width/this.#e.clientWidth:1,r=Math.min(this.#o,Math.max(1,e.pointSize*n)),i=Math.max(1,Math.min(this.#s,Math.trunc(this.#s*Math.max(.05,Math.min(1,e.pointFraction)))));t.useProgram(this.#n),t.bindVertexArray(this.#r),t.enable(t.BLEND),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.SRC_ALPHA,t.ONE),t.uniform2f(this.#a.get(`u_resolution`),this.#e.width,this.#e.height),t.uniform2f(this.#a.get(`u_center`),e.center[0],e.center[1]),t.uniform1f(this.#a.get(`u_scale`),e.scale),t.uniform1f(this.#a.get(`u_pointSize`),r),t.uniform1i(this.#a.get(`u_pointCount`),i),t.uniform1i(this.#a.get(`u_palette`),e.palette),t.uniform1f(this.#a.get(`u_colorOffset`),e.colorOffset),t.uniform1f(this.#a.get(`u_exposure`),Math.max(0,e.exposure)),t.drawArrays(t.POINTS,0,i),t.disable(t.BLEND)}dispose(){this.#t.deleteBuffer(this.#i),this.#t.deleteVertexArray(this.#r),this.#t.deleteProgram(this.#n)}};function au(e){if(!Number.isFinite(e.contractionRatio)||e.contractionRatio<=0||e.contractionRatio>=1)throw Error(`Коэффициент сокращения IFS должен быть между 0 и 1.`);if(!Number.isInteger(e.recommendedMaxDepth)||e.recommendedMaxDepth<1||e.recommendedMaxDepth>32)throw Error(`Глубина IFS должна быть от 1 до 32.`);if(!Number.isInteger(e.defaultDepth)||e.defaultDepth<1||e.defaultDepth>e.recommendedMaxDepth)throw Error(`Начальная глубина IFS выходит за рекомендуемый предел.`);if(e.transforms.length===0||e.transforms.some(e=>!lu(e)))throw Error(`IFS должен содержать конечные аффинные преобразования.`);if(e.backend===`grid`){let{columns:t,rows:n,mask:r}=e.grid,i=t*n;if(!Number.isInteger(t)||!Number.isInteger(n)||t<2||n<2||i>16||r.length!==i)throw Error(`Grid IFS поддерживает от 2 до 16 ячеек.`);if(r.filter(Boolean).length!==e.transforms.length)throw Error(`Число grid-преобразований не совпадает с маской IFS.`);if(e.baseArea.size.length!==2||e.baseArea.size.some(e=>!Number.isFinite(e)||e<=0))throw Error(`Базовый прямоугольник IFS должен иметь положительный размер.`);return}if(Math.abs(su(e.baseArea.vertices))<2**-52)throw Error(`Базовый треугольник IFS не должен быть вырожденным.`)}function ou(e,t,n){let r=Math.max(Number.MIN_VALUE,Math.abs(e)),i=Math.max(1,t),a=(n.backend===`grid`?Math.max(n.baseArea.size[0],n.baseArea.size[1]):cu(n.baseArea.vertices))*i/r,o=Math.ceil(Math.log(Math.max(1,a/1.35))/-Math.log(n.contractionRatio));return Math.max(1,Math.min(n.recommendedMaxDepth,o))}function su(e){let[t,n,r]=e;return(n[0]-t[0])*(r[1]-t[1])-(r[0]-t[0])*(n[1]-t[1])}function cu(e){let t=e.map(e=>e[0]),n=e.map(e=>e[1]);return Math.max(Math.max(...t)-Math.min(...t),Math.max(...n)-Math.min(...n))}function lu(e){return[...e.matrix,...e.translate].every(Number.isFinite)}var uu=`#version 300 es
precision highp float;
precision highp int;

out vec4 outColor;

uniform vec2 u_resolution;
uniform vec2 u_center;
uniform float u_scale;
uniform int u_ruleType;
uniform vec2 u_baseSize;
uniform vec2 u_triangleA;
uniform vec2 u_triangleB;
uniform vec2 u_triangleC;
uniform ivec2 u_gridSize;
uniform int u_gridMask[16];
uniform float u_contractionRatio;
uniform int u_recursionDepth;
uniform bool u_autoDepth;
uniform int u_palette;
uniform int u_colorMode;
uniform float u_colorOffset;

vec3 cosinePalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318530718 * (c * t + d));
}

vec3 palette(float t) {
  if (u_palette == 1) {
    return cosinePalette(
      t,
      vec3(0.50),
      vec3(0.50),
      vec3(1.0),
      vec3(0.00, 0.10, 0.20)
    );
  }
  if (u_palette == 2) {
    return cosinePalette(
      t,
      vec3(0.52, 0.48, 0.42),
      vec3(0.48, 0.44, 0.38),
      vec3(1.0, 0.8, 0.6),
      vec3(0.00, 0.12, 0.20)
    );
  }
  if (u_palette == 3) {
    return cosinePalette(
      t,
      vec3(0.48, 0.50, 0.54),
      vec3(0.46, 0.48, 0.44),
      vec3(1.0),
      vec3(0.72, 0.42, 0.18)
    );
  }
  return cosinePalette(
    t,
    vec3(0.46, 0.44, 0.53),
    vec3(0.50, 0.45, 0.48),
    vec3(1.0, 0.82, 0.66),
    vec3(0.74, 0.52, 0.28)
  );
}

vec3 triangleCoordinates(vec2 point) {
  float denominator =
    (u_triangleB.y - u_triangleC.y) * (u_triangleA.x - u_triangleC.x) +
    (u_triangleC.x - u_triangleB.x) * (u_triangleA.y - u_triangleC.y);
  float first = (
    (u_triangleB.y - u_triangleC.y) * (point.x - u_triangleC.x) +
    (u_triangleC.x - u_triangleB.x) * (point.y - u_triangleC.y)
  ) / denominator;
  float second = (
    (u_triangleC.y - u_triangleA.y) * (point.x - u_triangleC.x) +
    (u_triangleA.x - u_triangleC.x) * (point.y - u_triangleC.y)
  ) / denominator;
  return vec3(first, second, 1.0 - first - second);
}

float noise(vec2 position) {
  return fract(sin(dot(position, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 pixel = gl_FragCoord.xy - 0.5 * u_resolution;
  vec2 point = u_center + pixel * (u_scale / u_resolution.y);
  vec2 localPoint = point / u_baseSize + 0.5;
  vec3 trianglePoint = triangleCoordinates(point);
  float edgeDistance;
  bool inside;

  if (u_ruleType == 0) {
    vec2 rectangleEdge = 0.5 * u_baseSize - abs(point);
    edgeDistance = min(rectangleEdge.x, rectangleEdge.y);
    inside = all(greaterThanEqual(localPoint, vec2(0.0))) &&
      all(lessThanEqual(localPoint, vec2(1.0)));
  } else {
    edgeDistance = min(trianglePoint.x, min(trianglePoint.y, trianglePoint.z));
    inside = all(greaterThanEqual(trianglePoint, vec3(0.0))) &&
      all(lessThanEqual(trianglePoint, vec3(1.0)));
  }

  vec3 background = vec3(0.006, 0.008, 0.014);
  if (!inside) {
    outColor = vec4(background, 1.0);
    return;
  }

  float baseExtent = max(u_baseSize.x, u_baseSize.y);
  float childPixels = baseExtent * u_resolution.y / u_scale;
  float address = 0.0;
  float terminalLevel = 0.0;
  float holeStrength = 0.0;
  bool removed = false;

  for (int level = 0; level < 32; level++) {
    if (level >= u_recursionDepth) {
      break;
    }

    childPixels *= u_contractionRatio;
    terminalLevel = float(level + 1);

    if (u_ruleType == 0) {
      vec2 scaled = localPoint * vec2(u_gridSize);
      vec2 indexed = min(scaled, vec2(u_gridSize) - vec2(0.000001));
      ivec2 cell = ivec2(floor(indexed));
      int cellIndex = cell.y * u_gridSize.x + cell.x;
      if (u_gridMask[cellIndex] == 0) {
        removed = true;
      }
      address = fract(address * 0.37 + float(cellIndex + 1) * 0.119);
      localPoint = scaled - vec2(cell);
    } else {
      int corner = -1;
      if (trianglePoint.x >= 0.5) {
        corner = 0;
      } else if (trianglePoint.y >= 0.5) {
        corner = 1;
      } else if (trianglePoint.z >= 0.5) {
        corner = 2;
      }
      if (corner < 0) {
        removed = true;
      } else {
        trianglePoint *= 2.0;
        if (corner == 0) {
          trianglePoint.x -= 1.0;
        } else if (corner == 1) {
          trianglePoint.y -= 1.0;
        } else {
          trianglePoint.z -= 1.0;
        }
        address = fract(address * 0.43 + float(corner + 1) * 0.217);
      }
    }

    if (removed) {
      holeStrength = u_autoDepth ? smoothstep(0.68, 1.35, childPixels) : 1.0;
      break;
    }
  }

  float colorPosition = u_colorOffset;
  if (u_colorMode == 1) {
    colorPosition += terminalLevel * 0.113 + address * 0.72;
  } else if (u_colorMode == 2) {
    colorPosition += dot(point, vec2(0.19, 0.27)) + address * 0.48;
  }
  vec3 figure = max(palette(colorPosition), vec3(0.0));
  vec3 color = removed ? mix(figure, background, holeStrength) : figure;

  float edgeWidth = max(fwidth(edgeDistance), 0.000001);
  float outerCoverage = smoothstep(-edgeWidth, edgeWidth, edgeDistance);
  color = mix(background, color, outerCoverage);
  color += (noise(gl_FragCoord.xy) - 0.5) / 255.0;
  outColor = vec4(max(color, vec3(0.0)), 1.0);
}
`,du=[`u_resolution`,`u_center`,`u_scale`,`u_ruleType`,`u_baseSize`,`u_triangleA`,`u_triangleB`,`u_triangleC`,`u_gridSize`,`u_gridMask[0]`,`u_contractionRatio`,`u_recursionDepth`,`u_autoDepth`,`u_palette`,`u_colorMode`,`u_colorOffset`],fu={solid:0,level:1,gradient:2},pu=class{#e;#t;#n;#r;#i=new Map;#a;constructor(e){let t=e.getContext(`webgl2`,{alpha:!1,antialias:!1,depth:!1,powerPreference:`high-performance`,preserveDrawingBuffer:!1,stencil:!1});if(!t)throw Error(`WebGL2 недоступен для geometric IFS renderer.`);let n=t.createVertexArray();if(!n)throw Error(`WebGL не смог создать vertex array для geometric IFS.`);this.#e=e,this.#t=t,this.#n=Gl(t,Bl,uu),this.#r=n,t.bindVertexArray(n);for(let e of du)this.#i.set(e,Kl(t,this.#n,e))}setFormula(e){au(e.geometricIfs),this.#a=e}resize(e){let t=Math.min(window.devicePixelRatio||1,2)*e,n=Math.max(1,Math.round(this.#e.clientWidth*t)),r=Math.max(1,Math.round(this.#e.clientHeight*t));return this.#e.width===n&&this.#e.height===r?!1:(this.#e.width=n,this.#e.height=r,!0)}render(e){let t=this.#a;if(!t)throw Error(`Geometric IFS-фрактал не выбран.`);let n=this.#t,r=t.geometricIfs,i=ou(e.scale,this.#e.height,r),a=e.recursionDepthMode===`auto`?i:Math.max(1,Math.min(r.recommendedMaxDepth,Math.trunc(e.recursionDepth))),o=new Int32Array(16),s=[2,2],c=[3,3],l=[[-1,-1],[1,-1],[0,1]];if(r.backend===`grid`)s=r.baseArea.size,c=[r.grid.columns,r.grid.rows],r.grid.mask.forEach((e,t)=>{o[t]=+!!e});else{l=r.baseArea.vertices;let e=l.map(e=>e[0]),t=l.map(e=>e[1]);s=[Math.max(...e)-Math.min(...e),Math.max(...t)-Math.min(...t)]}n.disable(n.BLEND),n.viewport(0,0,this.#e.width,this.#e.height),n.useProgram(this.#n),n.bindVertexArray(this.#r),n.uniform2f(this.#i.get(`u_resolution`),this.#e.width,this.#e.height),n.uniform2f(this.#i.get(`u_center`),e.center[0],e.center[1]),n.uniform1f(this.#i.get(`u_scale`),e.scale),n.uniform1i(this.#i.get(`u_ruleType`),r.backend===`grid`?0:1),n.uniform2f(this.#i.get(`u_baseSize`),s[0],s[1]),n.uniform2f(this.#i.get(`u_triangleA`),l[0][0],l[0][1]),n.uniform2f(this.#i.get(`u_triangleB`),l[1][0],l[1][1]),n.uniform2f(this.#i.get(`u_triangleC`),l[2][0],l[2][1]),n.uniform2i(this.#i.get(`u_gridSize`),c[0],c[1]),n.uniform1iv(this.#i.get(`u_gridMask[0]`),o),n.uniform1f(this.#i.get(`u_contractionRatio`),r.contractionRatio),n.uniform1i(this.#i.get(`u_recursionDepth`),a),n.uniform1i(this.#i.get(`u_autoDepth`),+(e.recursionDepthMode===`auto`)),n.uniform1i(this.#i.get(`u_palette`),e.palette),n.uniform1i(this.#i.get(`u_colorMode`),fu[e.coloring]),n.uniform1f(this.#i.get(`u_colorOffset`),e.colorOffset),n.drawArrays(n.TRIANGLES,0,3)}dispose(){this.#t.deleteProgram(this.#n),this.#t.deleteVertexArray(this.#r)}},mu=`fractal-lab-previews-v5`,hu=`renderer-v5`,gu=480,_u=300,vu=new Map,yu=new Map,bu=Promise.resolve(),xu,Su,Cu,wu,Tu,Eu,Du,Ou,ku;function Au(e){let t=`${hu}-${e.id}`,n=vu.get(t);if(n)return Promise.resolve(n);let r=yu.get(t);if(r)return r;let i=ju(e,t).catch(e=>{throw yu.delete(t),e});return yu.set(t,i),i}async function ju(e,t){let n=await Uu(t),r=n??await Mu(()=>Pu(e));n||Wu(t,r);let i=URL.createObjectURL(r);return vu.set(t,i),i}function Mu(e){let t=bu.then(Nu).then(e);return bu=t.then(()=>void 0,()=>void 0),t}function Nu(){return new Promise(e=>{if(`requestIdleCallback`in window){window.requestIdleCallback(()=>e(),{timeout:250});return}setTimeout(e,16)})}async function Pu(e){let t={...Ns(e),...e.preview.parameters};if(e.renderer===`escape-time`){let{canvas:n,renderer:r}=Lu();return r.setFormula(e),r.render(Fu(e,t)),Hu(n)}if(e.renderer===`root-basin`){let{canvas:n,renderer:r}=Ru();return r.setFormula(e),r.render(Fu(e,t)),Hu(n)}if(e.renderer===`geometric-ifs`){let{canvas:t,renderer:n}=Iu();return n.setFormula(e),n.render({center:e.preview.view.center,scale:e.preview.view.scale,recursionDepthMode:`manual`,recursionDepth:e.preview.recursionDepth??e.geometricIfs.defaultDepth,coloring:e.preview.geometricColoring??e.geometricIfs.defaultColoring,palette:e.preview.palette??0,colorOffset:e.preview.colorOffset??0}),Hu(t)}let{canvas:n,renderer:r,client:i}=zu(),a=await i.request({a:Vu(t,`a`,-1.4),b:Vu(t,`b`,1.6),c:Vu(t,`c`,1),d:Vu(t,`d`,.7),burnIn:Vu(t,`burnIn`,100),pointCount:Vu(t,`pointCount`,18e4)});return r.setPoints(a.values),r.render({center:e.preview.view.center,scale:e.preview.view.scale,palette:e.preview.palette??0,colorOffset:e.preview.colorOffset??0,exposure:Vu(t,`exposure`,.11),pointSize:Vu(t,`pointSize`,1.25),pointFraction:1}),Hu(n)}function Fu(e,t){return{center:e.preview.view.center,scale:e.preview.view.scale,maxIterations:e.preview.iterations??e.suggestedIterations,palette:e.preview.palette??0,colorDensity:e.preview.colorDensity??.075,colorOffset:e.preview.colorOffset??0,smoothColors:!0,parameters:t}}function Iu(){return(!Tu||!Eu)&&(Tu=Bu(),Eu=new pu(Tu)),{canvas:Tu,renderer:Eu}}function Lu(){return(!xu||!Su)&&(xu=Bu(),Su=new ql(xu)),{canvas:xu,renderer:Su}}function Ru(){return(!Cu||!wu)&&(Cu=Bu(),wu=new eu(Cu)),{canvas:Cu,renderer:wu}}function zu(){return(!Du||!Ou||!ku)&&(Du=Bu(),Ou=new iu(Du),ku=new Rl),{canvas:Du,renderer:Ou,client:ku}}function Bu(){let e=document.createElement(`canvas`);return e.width=gu,e.height=_u,e}function Vu(e,t,n){let r=e[t];return typeof r==`number`?r:n}function Hu(e){return new Promise((t,n)=>{e.toBlob(e=>{if(e){t(e);return}n(Error(`Браузер не смог создать изображение превью.`))},`image/webp`,.9)})}async function Uu(e){if(!(typeof caches>`u`))try{return(await(await caches.open(mu)).match(Gu(e)))?.blob()}catch{return}}async function Wu(e,t){if(!(typeof caches>`u`))try{await(await caches.open(mu)).put(Gu(e),new Response(t,{headers:{"Content-Type":t.type||`image/webp`}}))}catch{}}function Gu(e){return new URL(`/__fractal-previews__/${encodeURIComponent(e)}.webp`,window.location.href).href}var Ku=[`data-status`],qu=[`src`],Ju={key:1,class:`preview-error`},Yu={key:2,class:`preview-loader`},Xu=ir({__name:`FractalPreview`,props:{formula:{}},setup(e){let t=e,n=z(),r=z(``),i=z(`idle`),a,o=!1;yr(()=>{if(!n.value||!(`IntersectionObserver`in window)){s();return}a=new IntersectionObserver(e=>{e.some(e=>e.isIntersecting)&&(a?.disconnect(),a=void 0,s())},{rootMargin:`240px`}),a.observe(n.value)}),Sr(()=>{o=!0,a?.disconnect()});async function s(){if(i.value===`idle`){i.value=`loading`;try{let e=await Au(t.formula);o||(r.value=e,i.value=`ready`)}catch{o||(i.value=`error`)}}}return(e,t)=>(H(),U(`span`,{ref_key:`root`,ref:n,class:`fractal-preview`,"data-status":i.value,"aria-hidden":`true`},[r.value?(H(),U(`img`,{key:0,src:r.value,alt:``},null,8,qu)):i.value===`error`?(H(),U(`span`,Ju,[...t[0]||=[W(`svg`,{viewBox:`0 0 24 24`},[W(`path`,{d:`M6.5 17.5 17.5 6.5M6.5 6.5l11 11`})],-1),ca(` Превью недоступно `,-1)]])):(H(),U(`span`,Yu,[...t[1]||=[W(`i`,null,null,-1),W(`i`,null,null,-1),W(`i`,null,null,-1)]]))],8,Ku))}}),Zu=(e,t)=>{let n=e.__vccOpts||e;for(let[e,r]of t)n[e]=r;return n},Qu=Zu(Xu,[[`__scopeId`,`data-v-ea460355`]]),$u={class:`picker-shell`},ed={class:`navigator-tools`},td={class:`formula-search`},nd={class:`category-filters`,"aria-label":`Категория формулы`},rd=[`aria-pressed`,`onClick`],id=[`aria-label`],ad=[`data-renderer`,`aria-pressed`,`onClick`],od={class:`card-visual`},sd={class:`card-index`},cd={key:0,class:`active-badge`},ld={class:`card-copy`},ud={class:`card-category`},dd={class:`card-description`},fd={key:0,class:`empty-results`},pd=Zu(ir({__name:`FormulaPickerDialog`,emits:[`close`],setup(e,{emit:t}){let n=t,r=Il(),{activeFormula:i}=Ss(r),a=z(),o=z(),s=z(``),c=z(`all`),l=G(()=>{let e=s.value.trim().toLocaleLowerCase(`ru`);return Ms.filter(t=>{let n=c.value===`all`||t.renderer===c.value,r=e.length===0||`${t.label} ${t.description}`.toLocaleLowerCase(`ru`).includes(e);return n&&r})});yr(async()=>{await vn(),a.value?.showModal(),o.value?.focus()});function u(){if(a.value?.open){a.value.close();return}n(`close`)}function d(e){r.selectFormula(e),u()}function f(e){e.target===a.value&&u()}function p(e){return e.renderer===`root-basin`?`Root basin`:e.renderer===`point-attractor`?`Attractor`:e.renderer===`geometric-ifs`?`Geometric IFS`:`Escape time`}return(e,t)=>(H(),$i($n,{to:`body`},[W(`dialog`,{ref_key:`dialog`,ref:a,class:`formula-picker`,"aria-labelledby":`formula-picker-title`,onCancel:Lo(u,[`prevent`]),onClick:f,onClose:t[1]||=e=>n(`close`)},[W(`section`,$u,[W(`header`,{class:`picker-header`},[t[3]||=W(`div`,{class:`picker-heading`},[W(`h2`,{id:`formula-picker-title`},`Каталог фракталов`),W(`p`,null,`Формулы, геометрические IFS, бассейны и странные аттракторы`)],-1),W(`button`,{class:`picker-close`,type:`button`,"aria-label":`Закрыть`,onClick:u},[...t[2]||=[W(`svg`,{viewBox:`0 0 24 24`,"aria-hidden":`true`},[W(`path`,{d:`m6.5 6.5 11 11m0-11-11 11`})],-1)]])]),W(`div`,ed,[W(`label`,td,[t[4]||=W(`svg`,{viewBox:`0 0 24 24`,"aria-hidden":`true`},[W(`circle`,{cx:`10.5`,cy:`10.5`,r:`5.75`}),W(`path`,{d:`m15 15 4 4`})],-1),jn(W(`input`,{ref_key:`searchInput`,ref:o,"onUpdate:modelValue":t[0]||=e=>s.value=e,type:`search`,placeholder:`Название или описание…`,"aria-label":`Поиск формулы`},null,512),[[Oo,s.value]]),t[5]||=W(`kbd`,null,`Esc`,-1)]),W(`div`,nd,[(H(),U(Ui,null,kr([[`all`,`Все`],[`escape-time`,`Escape`],[`root-basin`,`Basins`],[`point-attractor`,`Attractors`],[`geometric-ifs`,`IFS`]],e=>W(`button`,{key:e[0],type:`button`,"aria-pressed":c.value===e[0],onClick:t=>c.value=e[0]},N(e[1]),9,rd)),64))])]),W(`div`,{class:`formula-grid`,"aria-label":`Доступно формул: ${l.value.length}`},[(H(!0),U(Ui,null,kr(l.value,(e,n)=>(H(),U(`button`,{key:e.id,class:de([`formula-card`,{"is-active":e.id===B(i).id}]),"data-renderer":e.renderer,type:`button`,"aria-pressed":e.id===B(i).id,onClick:t=>d(e.id)},[W(`span`,od,[ia(Qu,{formula:e},null,8,[`formula`]),W(`span`,sd,N(String(n+1).padStart(2,`0`)),1),e.id===B(i).id?(H(),U(`span`,cd,[...t[6]||=[W(`i`,null,null,-1),ca(` Открыт `,-1)]])):la(``,!0)]),W(`span`,ld,[W(`span`,ud,N(p(e)),1),W(`strong`,null,N(e.label),1),W(`span`,dd,N(e.description),1)])],10,ad))),128))],8,id),l.value.length===0?(H(),U(`div`,fd,[...t[7]||=[W(`span`,null,`∅`,-1),ca(` По такому запросу формул пока нет `,-1)]])):la(``,!0)])],544)]))}}),[[`__scopeId`,`data-v-dcbb9e62`]]),md={class:`controls`,"aria-label":`Настройки фрактала`},hd={class:`controls-heading`},gd={class:`heading-actions`},_d={class:`panel-actions`},vd=[`disabled`],yd={key:0,"aria-hidden":`true`},bd={class:`control-stack`},xd={class:`field formula-picker-field`},Sd={class:`formula-description`},Cd={key:0,id:`formula-parameters`,class:`formula-parameters`},wd={key:0,class:`complex-pair`},Td={class:`number-input`},Ed=[`step`,`value`,`onInput`],Dd={class:`number-input`},Od=[`step`,`value`,`onInput`],kd={key:1,class:`number-input`},Ad=[`step`,`min`,`max`,`value`,`onInput`],jd={class:`field`},Md={class:`select-wrap`},Nd={key:0,class:`field range-field`},Pd={for:`recursion-depth`},Fd=[`max`],Id={class:`field`},Ld={class:`select-wrap`},Rd={key:2,class:`field range-field`},zd={for:`iterations`},Bd=[`min`,`max`,`step`],Vd={class:`field`},Hd={class:`select-wrap`},Ud={key:3,class:`toggle-field`},Wd={key:4,class:`field range-field`},Gd={for:`color-density`},Kd={class:`controls-footer`},qd=Zu(ir({__name:`ControlPanel`,props:{exporting:{type:Boolean}},emits:[`exportPng`,`hide`],setup(e,{emit:t}){let n=t,r=Il(),{activeFormula:i,colorDensity:a,geometricColoring:o,maxIterations:s,palette:c,parameterValues:l,recursionDepth:u,recursionDepthMode:d,smoothColors:f}=Ss(r),p=G(()=>i.value.renderer===`geometric-ifs`),m=G(()=>i.value.renderer===`geometric-ifs`?i.value.geometricIfs.recommendedMaxDepth:32),h=G(()=>i.value.renderer===`root-basin`?`GPU root-basin renderer`:i.value.renderer===`point-attractor`?`Worker + GPU point renderer`:i.value.renderer===`geometric-ifs`?`GPU geometric IFS renderer`:`GPU escape-time renderer`),g=z(!1);yr(()=>{window.addEventListener(`keydown`,_)}),Sr(()=>{window.removeEventListener(`keydown`,_)});function _(e){let t=/Mac|iPhone|iPad|iPod/.test(navigator.platform)?e.metaKey:e.ctrlKey;e.key.toLocaleLowerCase()!==`k`||!t||e.altKey||e.shiftKey||(e.preventDefault(),g.value=!0)}function v(e){return e.target.value}function y(e){let t=v(e);if(t.trim()===``)return;let n=Number(t);return Number.isFinite(n)?n:void 0}function b(e){let t=l.value[e];return typeof t==`number`?t:0}function x(e,t){let n=l.value[e];return Array.isArray(n)?n[t]:0}function S(e,t){let n=y(t);n!==void 0&&r.setParameter(e,n)}function C(e,t,n){let i=y(n),a=l.value[e];if(i===void 0||!Array.isArray(a))return;let o=[a[0],a[1]];o[t]=i,r.setParameter(e,o)}return(t,l)=>(H(),U(`aside`,md,[W(`div`,hd,[l[14]||=W(`div`,null,[W(`span`,{class:`eyebrow`},`Исследование`),W(`h1`,null,`Параметры`)],-1),W(`div`,gd,[W(`button`,{class:`icon-button`,type:`button`,"aria-label":`Сбросить вид`,title:`Сбросить вид`,onClick:l[0]||=(...e)=>B(r).resetCamera&&B(r).resetCamera(...e)},[...l[12]||=[W(`svg`,{viewBox:`0 0 24 24`,"aria-hidden":`true`},[W(`path`,{d:`M4.9 6.8A8.5 8.5 0 1 1 3.6 15M4 4v4h4`})],-1)]]),W(`button`,{class:`icon-button`,type:`button`,"aria-label":`Скрыть панель параметров`,title:`Скрыть панель`,onClick:l[1]||=e=>n(`hide`)},[...l[13]||=[W(`svg`,{viewBox:`0 0 24 24`,"aria-hidden":`true`},[W(`path`,{d:`M8 5 3 12l5 7M3.5 12H21`})],-1)]])])]),W(`div`,_d,[W(`button`,{class:`export-button`,type:`button`,disabled:e.exporting,onClick:l[2]||=e=>n(`exportPng`)},[l[16]||=W(`svg`,{viewBox:`0 0 24 24`,"aria-hidden":`true`},[W(`path`,{d:`M12 3v12m-4-4 4 4 4-4M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4`})],-1),W(`span`,null,[W(`strong`,null,N(e.exporting?`Готовим PNG…`:`Сохранить PNG`),1),l[15]||=W(`small`,null,`Чистый рендер · разрешение 2×`,-1)]),e.exporting?(H(),U(`i`,yd)):la(``,!0)],8,vd)]),W(`div`,bd,[W(`div`,xd,[l[18]||=W(`span`,null,`Формула`,-1),W(`button`,{class:`formula-picker-button`,type:`button`,"aria-label":`Открыть выбор формулы`,onClick:l[3]||=e=>g.value=!0},[W(`span`,null,N(B(i).label),1),l[17]||=W(`svg`,{viewBox:`0 0 24 24`,"aria-hidden":`true`},[W(`path`,{d:`m8 10 4 4 4-4`})],-1)])]),W(`p`,Sd,N(B(i).description),1),B(i).parameters.length>0?(H(),U(`div`,Cd,[l[21]||=W(`div`,{class:`section-rule`},null,-1),(H(!0),U(Ui,null,kr(B(i).parameters,e=>(H(),U(`label`,{key:e.key,class:`field`},[W(`span`,null,N(e.label),1),e.type===`complex`?(H(),U(`span`,wd,[W(`span`,Td,[l[19]||=W(`span`,null,`Re`,-1),W(`input`,{type:`number`,step:e.step,value:x(e.key,0),onInput:t=>C(e.key,0,t)},null,40,Ed)]),W(`span`,Dd,[l[20]||=W(`span`,null,`Im`,-1),W(`input`,{type:`number`,step:e.step,value:x(e.key,1),onInput:t=>C(e.key,1,t)},null,40,Od)])])):(H(),U(`span`,kd,[W(`input`,{type:`number`,step:e.step,min:e.min,max:e.max,value:b(e.key),onInput:t=>S(e.key,t)},null,40,Ad)]))]))),128))])):la(``,!0),l[31]||=W(`div`,{class:`section-rule`},null,-1),p.value?(H(),U(Ui,{key:1},[W(`label`,jd,[l[23]||=W(`span`,null,`Глубина рекурсии`,-1),W(`span`,Md,[jn(W(`select`,{"onUpdate:modelValue":l[4]||=e=>R(d)?d.value=e:null},[...l[22]||=[W(`option`,{value:`auto`},`Auto · по масштабу`,-1),W(`option`,{value:`manual`},`Manual · фиксированная`,-1)]],512),[[jo,B(d)]])])]),B(d)===`manual`?(H(),U(`label`,Nd,[W(`span`,null,[l[24]||=W(`span`,null,`Количество уровней`,-1),W(`output`,Pd,N(B(u)),1)]),jn(W(`input`,{id:`recursion-depth`,"onUpdate:modelValue":l[5]||=e=>R(u)?u.value=e:null,type:`range`,min:`1`,max:m.value,step:`1`},null,8,Fd),[[Oo,B(u),void 0,{number:!0}]])])):la(``,!0),W(`label`,Id,[l[26]||=W(`span`,null,`Окрашивание`,-1),W(`span`,Ld,[jn(W(`select`,{"onUpdate:modelValue":l[6]||=e=>R(o)?o.value=e:null},[...l[25]||=[W(`option`,{value:`solid`},`Однотонное`,-1),W(`option`,{value:`level`},`По уровню`,-1),W(`option`,{value:`gradient`},`Градиент`,-1)]],512),[[jo,B(o)]])])])],64)):B(i).iterationControl?(H(),U(`label`,Rd,[W(`span`,null,[W(`span`,null,N(B(i).iterationControl.label),1),W(`output`,zd,N(B(s)),1)]),jn(W(`input`,{id:`iterations`,"onUpdate:modelValue":l[7]||=e=>R(s)?s.value=e:null,type:`range`,min:B(i).iterationControl.min,max:B(i).iterationControl.max,step:B(i).iterationControl.step},null,8,Bd),[[Oo,B(s),void 0,{number:!0}]])])):la(``,!0),W(`label`,Vd,[l[28]||=W(`span`,null,`Палитра`,-1),W(`span`,Hd,[jn(W(`select`,{"onUpdate:modelValue":l[8]||=e=>R(c)?c.value=e:null},[...l[27]||=[W(`option`,{value:0},`Ultraviolet`,-1),W(`option`,{value:1},`Electric tide`,-1),W(`option`,{value:2},`Solar flare`,-1),W(`option`,{value:3},`Arctic dusk`,-1)]],512),[[jo,B(c),void 0,{number:!0}]])])]),B(i).renderer===`escape-time`||B(i).renderer===`root-basin`?(H(),U(`label`,Ud,[l[29]||=W(`span`,null,[W(`span`,null,`Сглаживание`),W(`small`,null,`Плавные переходы между итерациями`)],-1),jn(W(`input`,{"onUpdate:modelValue":l[9]||=e=>R(f)?f.value=e:null,type:`checkbox`,role:`switch`,"aria-label":`Сглаживать цвета`},null,512),[[ko,B(f)]])])):la(``,!0),B(i).renderer===`escape-time`||B(i).renderer===`root-basin`?(H(),U(`label`,Wd,[W(`span`,null,[l[30]||=W(`span`,null,`Плотность цвета`,-1),W(`output`,Gd,N(B(a).toFixed(3)),1)]),jn(W(`input`,{id:`color-density`,"onUpdate:modelValue":l[10]||=e=>R(a)?a.value=e:null,type:`range`,min:`0.015`,max:`0.2`,step:`0.005`},null,512),[[Oo,B(a),void 0,{number:!0}]])])):la(``,!0)]),W(`footer`,Kd,[l[32]||=W(`span`,{class:`gpu-status`},[W(`i`,{"aria-hidden":`true`}),ca(` WebGL2`)],-1),W(`span`,null,N(h.value),1)]),g.value?(H(),$i(pd,{key:0,onClose:l[11]||=e=>g.value=!1})):la(``,!0)]))}}),[[`__scopeId`,`data-v-53814bd7`]]),Jd={class:`coordinate-fields`},Yd={class:`zoom-field`},Xd={class:`zoom-input`},Zd={key:0,class:`coordinate-error`,role:`alert`},Qd={class:`coordinate-line`},$d=Zu(ir({__name:`CoordinatesDialog`,emits:[`close`],setup(e,{emit:t}){let n=t,r=Il(),{activeFormula:i,exactCenter:a,exactScale:o}=Ss(r),s=z(),c=z(),l=z(a.value[0]),u=z(a.value[1]),d=z(Cl(i.value.initialView.scale,o.value)),f=z(``),p=z(!1),m=G(()=>`${l.value.trim()}, ${u.value.trim()}, ${d.value.trim()}`);yr(async()=>{await vn(),s.value?.showModal(),c.value?.focus(),c.value?.select()});function h(){if(s.value?.open){s.value.close();return}n(`close`)}function g(e){e.target===s.value&&h()}function _(){f.value=``;try{let e=Sl([l.value.trim(),u.value.trim()],d.value.trim(),i.value.initialView.scale);r.setExactCamera(e),h()}catch(e){f.value=e instanceof Error?e.message:`Проверьте формат координат и масштаба.`}}async function v(){f.value=``;try{navigator.clipboard?.writeText?await navigator.clipboard.writeText(m.value):y(m.value),p.value=!0,window.setTimeout(()=>{p.value=!1},1600)}catch{try{y(m.value),p.value=!0}catch{f.value=`Не удалось скопировать строку. Выделите значения вручную.`}}}function y(e){let t=document.createElement(`textarea`);t.value=e,t.style.position=`fixed`,t.style.opacity=`0`,document.body.append(t),t.select();let n=document.execCommand(`copy`);if(t.remove(),!n)throw Error(`Clipboard API недоступен.`)}return(e,t)=>(H(),$i($n,{to:`body`},[W(`dialog`,{ref_key:`dialog`,ref:s,class:`coordinates-dialog`,"aria-labelledby":`coordinates-title`,onCancel:Lo(h,[`prevent`]),onClick:g,onClose:t[3]||=e=>n(`close`)},[W(`form`,{class:`coordinates-shell`,onSubmit:Lo(_,[`prevent`])},[W(`header`,{class:`coordinates-header`},[t[5]||=W(`div`,null,[W(`span`,{class:`dialog-eyebrow`},`Точный переход`),W(`h2`,{id:`coordinates-title`},`Координаты и масштаб`),W(`p`,null,`Введите центр комплексной плоскости и увеличение относительно исходного вида.`)],-1),W(`button`,{class:`dialog-close`,type:`button`,"aria-label":`Закрыть`,onClick:h},[...t[4]||=[W(`svg`,{viewBox:`0 0 24 24`,"aria-hidden":`true`},[W(`path`,{d:`m6.5 6.5 11 11m0-11-11 11`})],-1)]])]),W(`div`,Jd,[W(`label`,null,[t[6]||=W(`span`,null,`Действительная часть · Re`,-1),jn(W(`input`,{ref_key:`realInput`,ref:c,"onUpdate:modelValue":t[0]||=e=>l.value=e,type:`text`,inputmode:`decimal`,autocomplete:`off`,spellcheck:`false`},null,512),[[Oo,l.value]])]),W(`label`,null,[t[7]||=W(`span`,null,`Мнимая часть · Im`,-1),jn(W(`input`,{"onUpdate:modelValue":t[1]||=e=>u.value=e,type:`text`,inputmode:`decimal`,autocomplete:`off`,spellcheck:`false`},null,512),[[Oo,u.value]])]),W(`label`,Yd,[t[9]||=W(`span`,null,`Увеличение · Zoom`,-1),W(`span`,Xd,[jn(W(`input`,{"onUpdate:modelValue":t[2]||=e=>d.value=e,type:`text`,inputmode:`decimal`,autocomplete:`off`,spellcheck:`false`},null,512),[[Oo,d.value]]),t[8]||=W(`i`,null,`×`,-1)])])]),f.value?(H(),U(`p`,Zd,N(f.value),1)):la(``,!0),W(`div`,Qd,[W(`code`,null,N(m.value),1),W(`button`,{type:`button`,onClick:v},[t[10]||=W(`svg`,{viewBox:`0 0 24 24`,"aria-hidden":`true`},[W(`rect`,{x:`8`,y:`8`,width:`10`,height:`10`,rx:`2`}),W(`path`,{d:`M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2`})],-1),ca(` `+N(p.value?`Скопировано`:`Копировать строку`),1)])]),W(`footer`,{class:`coordinate-actions`},[W(`button`,{class:`secondary-action`,type:`button`,onClick:h},`Отмена`),t[11]||=W(`button`,{class:`primary-action`,type:`submit`},`Перейти к виду`,-1)])],32)],544)]))}}),[[`__scopeId`,`data-v-26f8ad4d`]]),ef=class extends Error{constructor(){super(`Расчёт опорной орбиты отменён.`),this.name=`ReferenceOrbitCancelledError`}},tf=class{#e;#t;#n=0;request(e){this.cancel();let t=++this.#n,n=new Worker(new URL(`/fractal-lab/assets/reference-orbit.worker-2pRE0q2_.js`,``+import.meta.url),{type:`module`});return this.#e=n,new Promise((r,i)=>{this.#t=i,n.onmessage=e=>{let n=e.data;if(n.type===`error`&&n.requestId===t){this.#r(),i(Error(n.message));return}n.type===`result`&&n.result.requestId===t&&(this.#r(),r(n.result))},n.onerror=e=>{this.#r(),i(Error(e.message||`Ошибка deep-zoom worker.`))},n.postMessage({...e,requestId:t})})}cancel(){if(!this.#e)return;this.#e.terminate(),this.#e=void 0;let e=this.#t;this.#t=void 0,e?.(new ef)}#r(){this.#e?.terminate(),this.#e=void 0,this.#t=void 0}},nf=new Set([`mandelbrot-perturbation`,`julia-perturbation`,`tricorn-perturbation`,`burning-ship-perturbation`,`phoenix-perturbation`,`newton-cubic-perturbation`,`nova-cubic-perturbation`]);function rf(e){return e!==void 0&&nf.has(e)}var af=2048;function of(e){return e===`newton-cubic-perturbation`?`uniform float u_convergenceTolerance;`:`
uniform float u_novaRelaxation;
uniform float u_novaEscapeRadius;
uniform float u_convergenceTolerance;
`}function sf(e){return e===`newton-cubic-perturbation`?`
  // Newton has no additive plane delta after the initial step. Keep its
  // perturbation normalized so a contracting prefix cannot flush it to zero
  // before a later expanding part of the orbit.
  const float INITIAL_DELTA_EXPONENT = -96.0;
  const float INITIAL_DELTA_SCALE = 7.922816251426434e28;
  vec2 deltaMantissa =
    u_centerDelta * INITIAL_DELTA_SCALE +
    pixel * ((u_scale * INITIAL_DELTA_SCALE) / u_resolution.y);
  float deltaExponent = INITIAL_DELTA_EXPONENT;
  normalizeExtendedDelta(deltaMantissa, deltaExponent);
  vec2 deltaCurrent = materializeExtendedDelta(deltaMantissa, deltaExponent);
  vec4 referenceStart = fetchReference(0);
  vec2 actualZ = addReference(referenceStart, deltaCurrent);
  bool useDirectExtendedOrbit =
    u_scale < 1e-16 &&
    maxNorm(combineReference(referenceStart)) <= 4.0 * u_scale;
  vec2 directMantissa = vec2(0.0);
  float directExponent = 0.0;
  if (useDirectExtendedOrbit) {
    directMantissa = referenceStart.xy;
    normalizeExtendedDelta(directMantissa, directExponent);
    vec2 directLowMantissa = referenceStart.zw;
    float directLowExponent = 0.0;
    normalizeExtendedDelta(directLowMantissa, directLowExponent);
    vec2 combinedDirectMantissa;
    float combinedDirectExponent;
    addExtendedValues(
      directMantissa,
      directExponent,
      directLowMantissa,
      directLowExponent,
      combinedDirectMantissa,
      combinedDirectExponent
    );
    directMantissa = combinedDirectMantissa;
    directExponent = combinedDirectExponent;
    addExtendedValues(
      directMantissa,
      directExponent,
      deltaMantissa,
      deltaExponent,
      combinedDirectMantissa,
      combinedDirectExponent
    );
    directMantissa = combinedDirectMantissa;
    directExponent = combinedDirectExponent;
  }
  vec2 previousZ = actualZ;
  bool hasPreviousZ = false;
  int referenceIndex = 0;
  int resultKind = 0;
  int rootIndex = 0;
  int iteration = 0;
  int convergenceRefinementSteps = 0;
  float finalMetric = 1.0;
  float smoothingThreshold = max(u_convergenceTolerance, 1e-12);

  for (int i = 0; i < ${af}; i++) {
    if (i >= u_maxIterations) {
      break;
    }

    if (useDirectExtendedOrbit) {
      bool directIsMaterialized =
        directExponent >= -62.0 &&
        directExponent <= 120.0;
      vec2 directCurrent = directIsMaterialized
        ? materializeExtendedDelta(directMantissa, directExponent)
        : vec2(0.0);
      vec2 correction = vec2(1e20, 0.0);
      bool hasCorrection =
        directIsMaterialized &&
        calculateNewtonCorrection(directCurrent, correction);
      vec2 nextDirectMantissa;
      float nextDirectExponent;
      if (
        !iterateExtendedNewton(
          directMantissa,
          directExponent,
          nextDirectMantissa,
          nextDirectExponent
        )
      ) {
        break;
      }

      iteration = i;
      finalMetric = hasCorrection
        ? stableComplexMagnitude(correction)
        : 1e20;
      if (
        hasCorrection &&
        dot(correction, correction) <=
          u_convergenceTolerance * u_convergenceTolerance
      ) {
        actualZ = materializeExtendedDelta(
          nextDirectMantissa,
          nextDirectExponent
        );
        rootIndex = nearestRoot(actualZ);
        vec2 root = cubicRoot(rootIndex);
        vec2 localError = directCurrent - root;
        if (hasPreviousZ) {
          localError = iterateNewtonLocalError(previousZ - root, root);
        }
        localError = iterateNewtonLocalError(localError, root);
        finalMetric = stableComplexMagnitude(localError);
        convergenceRefinementSteps = 1;
        resultKind = 1;
        break;
      }

      if (directIsMaterialized) {
        previousZ = directCurrent;
        hasPreviousZ = true;
      }
      directMantissa = nextDirectMantissa;
      directExponent = nextDirectExponent;
      continue;
    }

    vec4 referenceCurrent = fetchReference(referenceIndex);
    vec2 actualCurrent = addReference(referenceCurrent, deltaCurrent);
    vec2 correction;
    if (!calculateNewtonCorrection(actualCurrent, correction)) {
      break;
    }

    vec2 nextDeltaMantissa;
    float nextDeltaExponent;
    if (
      !calculateNextNewtonDelta(
        referenceCurrent,
        deltaCurrent,
        deltaMantissa,
        deltaExponent,
        nextDeltaMantissa,
        nextDeltaExponent
      )
    ) {
      break;
    }

    vec2 nextDeltaCurrent = materializeExtendedDelta(
      nextDeltaMantissa,
      nextDeltaExponent
    );
    int nextReferenceIndex = referenceIndex + 1;
    if (nextReferenceIndex >= u_referenceCount) {
      break;
    }
    vec4 nextReferenceCurrent = fetchReference(nextReferenceIndex);
    actualZ = addReference(nextReferenceCurrent, nextDeltaCurrent);
    iteration = i;
    finalMetric = length(correction);

    if (dot(correction, correction) <= u_convergenceTolerance * u_convergenceTolerance) {
      rootIndex = nearestRoot(actualZ);
      vec2 root = cubicRoot(rootIndex);
      vec2 localError = actualCurrent - root;
      if (hasPreviousZ) {
        localError = iterateNewtonLocalError(previousZ - root, root);
      }
      localError = iterateNewtonLocalError(localError, root);
      finalMetric = stableComplexMagnitude(localError);
      convergenceRefinementSteps = 1;
      resultKind = 1;
      break;
    }

    previousZ = actualCurrent;
    hasPreviousZ = true;
    deltaMantissa = nextDeltaMantissa;
    deltaExponent = nextDeltaExponent;
    deltaCurrent = nextDeltaCurrent;
    referenceIndex = nextReferenceIndex;
  }
`:`
  vec2 deltaCurrent = vec2(0.0);
  vec2 actualZ = addReference(fetchReference(0), deltaCurrent);
  int referenceIndex = 0;
  int resultKind = 0;
  int rootIndex = 0;
  int iteration = 0;
  float previousMetric = 1.0;
  float finalMetric = 1.0;
  float smoothingThreshold = max(u_convergenceTolerance, 1e-12);
  bool hasPreviousMetric = false;
  float escapeRadiusSquared = u_novaEscapeRadius * u_novaEscapeRadius;

  for (int i = 0; i < ${af}; i++) {
    if (i >= u_maxIterations) {
      break;
    }

    vec4 referenceCurrent = fetchReference(referenceIndex);
    vec2 actualCurrent = addReference(referenceCurrent, deltaCurrent);
    vec2 correctionDelta;
    if (!calculateCorrectionDelta(referenceCurrent, deltaCurrent, correctionDelta)) {
      break;
    }

    vec2 nextDeltaCurrent =
      deltaCurrent -
      u_novaRelaxation * correctionDelta +
      planeDelta;
    int nextReferenceIndex = referenceIndex + 1;
    vec4 nextReferenceCurrent = fetchReference(nextReferenceIndex);
    actualZ = addReference(nextReferenceCurrent, nextDeltaCurrent);
    vec2 stepDelta = actualZ - actualCurrent;
    iteration = i;
    finalMetric = length(stepDelta);

    if (dot(actualZ, actualZ) > escapeRadiusSquared) {
      previousMetric = length(actualCurrent);
      finalMetric = length(actualZ);
      smoothingThreshold = max(u_novaEscapeRadius, 1e-12);
      hasPreviousMetric = true;
      resultKind = 2;
      break;
    }
    if (dot(stepDelta, stepDelta) <= u_convergenceTolerance * u_convergenceTolerance) {
      rootIndex = nearestRoot(actualZ);
      resultKind = 1;
      break;
    }

    previousMetric = finalMetric;
    hasPreviousMetric = true;
    bool referenceExhausted = nextReferenceIndex >= u_referenceCount - 1;
    bool closerToCriticalPoint = maxNorm(actualZ) < maxNorm(nextDeltaCurrent);
    if (referenceExhausted || closerToCriticalPoint) {
      deltaCurrent = subtractReference(actualZ, fetchReference(0));
      referenceIndex = 0;
    } else {
      deltaCurrent = nextDeltaCurrent;
      referenceIndex = nextReferenceIndex;
    }
  }
`}function cf(e){return e===`newton-cubic-perturbation`?`
    colorIteration += quadraticConvergencePhase(
      finalMetric,
      smoothingThreshold,
      convergenceRefinementSteps
    );
`:`
    colorIteration += hasPreviousMetric
      ? thresholdCrossingPhase(previousMetric, finalMetric, smoothingThreshold)
      : 1.0;
`}function lf(e){return`#version 300 es
precision highp float;
precision highp sampler2D;

out vec4 outColor;

uniform vec2 u_resolution;
uniform vec2 u_centerDelta;
uniform float u_scale;
uniform int u_maxIterations;
uniform int u_palette;
uniform float u_colorDensity;
uniform float u_colorOffset;
uniform bool u_smoothColors;
uniform sampler2D u_referenceOrbit;
uniform int u_referenceCount;
${of(e)}

vec2 complexSquare(vec2 value) {
  return vec2(
    value.x * value.x - value.y * value.y,
    2.0 * value.x * value.y
  );
}

vec2 complexMultiply(vec2 left, vec2 right) {
  return vec2(
    left.x * right.x - left.y * right.y,
    left.x * right.y + left.y * right.x
  );
}

vec2 complexDivide(vec2 numerator, vec2 denominator, float denominatorSquared) {
  return vec2(
    dot(numerator, denominator),
    numerator.y * denominator.x - numerator.x * denominator.y
  ) / denominatorSquared;
}

vec4 fetchReference(int index) {
  return texelFetch(u_referenceOrbit, ivec2(0, index), 0);
}

vec2 combineReference(vec4 reference) {
  return reference.xy + reference.zw;
}

vec2 addReference(vec4 reference, vec2 delta) {
  return reference.xy + (reference.zw + delta);
}

vec2 subtractReference(vec2 actual, vec4 reference) {
  return (actual - reference.xy) - reference.zw;
}

float maxNorm(vec2 value) {
  return max(abs(value.x), abs(value.y));
}

void normalizeExtendedDelta(
  inout vec2 mantissa,
  inout float exponent
) {
  float magnitude = maxNorm(mantissa);
  if (magnitude == 0.0) {
    exponent = 0.0;
    return;
  }

  float shift = floor(log2(magnitude));
  mantissa *= exp2(-shift);
  exponent += shift;
}

vec2 materializeExtendedDelta(vec2 mantissa, float exponent) {
  if (exponent < -120.0) {
    return vec2(0.0);
  }
  return mantissa * exp2(exponent);
}

bool stableComplexDivide(
  vec2 numerator,
  vec2 denominator,
  out vec2 quotient
) {
  float denominatorScale = maxNorm(denominator);
  if (denominatorScale == 0.0) {
    return false;
  }

  vec2 normalizedDenominator = denominator / denominatorScale;
  float denominatorSquared = dot(
    normalizedDenominator,
    normalizedDenominator
  );
  quotient =
    complexDivide(
      numerator,
      normalizedDenominator,
      denominatorSquared
    ) /
    denominatorScale;
  return !any(isnan(quotient)) && !any(isinf(quotient));
}

bool divideFastOrStable(
  vec2 numerator,
  vec2 denominator,
  out vec2 quotient
) {
  float denominatorSquared = dot(denominator, denominator);
  if (
    denominatorSquared >= 1e-20 &&
    denominatorSquared <= 1e20
  ) {
    quotient = complexDivide(
      numerator,
      denominator,
      denominatorSquared
    );
    return !any(isnan(quotient)) && !any(isinf(quotient));
  }
  return stableComplexDivide(numerator, denominator, quotient);
}

bool calculateNewtonCorrection(
  vec2 value,
  out vec2 correction
) {
  vec2 reciprocal;
  if (!divideFastOrStable(vec2(1.0, 0.0), value, reciprocal)) {
    return false;
  }

  vec2 reciprocalSquared = complexSquare(reciprocal);
  correction = (value - reciprocalSquared) / 3.0;
  return !any(isnan(correction)) && !any(isinf(correction));
}

bool divideFastOrStableInPlace(
  inout vec2 value,
  vec2 denominator
) {
  vec2 quotient;
  if (!divideFastOrStable(value, denominator, quotient)) {
    return false;
  }
  value = quotient;
  return true;
}

bool divideExtendedBy(
  inout vec2 mantissa,
  inout float exponent,
  vec2 denominator
) {
  float denominatorScale = maxNorm(denominator);
  if (denominatorScale == 0.0) {
    return false;
  }
  if (maxNorm(mantissa) == 0.0) {
    return true;
  }

  float denominatorExponent = floor(log2(denominatorScale));
  float denominatorMantissaScale =
    denominatorScale * exp2(-denominatorExponent);
  vec2 normalizedDenominator =
    (denominator / denominatorScale) * denominatorMantissaScale;
  float denominatorSquared = dot(
    normalizedDenominator,
    normalizedDenominator
  );
  mantissa = complexDivide(
    mantissa,
    normalizedDenominator,
    denominatorSquared
  );
  exponent -= denominatorExponent;
  normalizeExtendedDelta(mantissa, exponent);
  return !any(isnan(mantissa)) && !any(isinf(mantissa));
}

void addExtendedValues(
  vec2 leftMantissa,
  float leftExponent,
  vec2 rightMantissa,
  float rightExponent,
  out vec2 resultMantissa,
  out float resultExponent
) {
  resultExponent = max(leftExponent, rightExponent);
  float leftShift = leftExponent - resultExponent;
  float rightShift = rightExponent - resultExponent;
  vec2 alignedLeft =
    leftShift < -120.0
      ? vec2(0.0)
      : leftMantissa * exp2(leftShift);
  vec2 alignedRight =
    rightShift < -120.0
      ? vec2(0.0)
      : rightMantissa * exp2(rightShift);
  resultMantissa = alignedLeft + alignedRight;
  normalizeExtendedDelta(resultMantissa, resultExponent);
}

bool divideExtendedByExtended(
  inout vec2 mantissa,
  inout float exponent,
  vec2 denominatorMantissa,
  float denominatorExponent
) {
  if (!divideExtendedBy(mantissa, exponent, denominatorMantissa)) {
    return false;
  }
  exponent -= denominatorExponent;
  normalizeExtendedDelta(mantissa, exponent);
  return !any(isnan(mantissa)) && !any(isinf(mantissa));
}

bool iterateExtendedNewton(
  vec2 currentMantissa,
  float currentExponent,
  out vec2 nextMantissa,
  out float nextExponent
) {
  if (maxNorm(currentMantissa) == 0.0) {
    return false;
  }

  vec2 linearMantissa = currentMantissa * (2.0 / 3.0);
  float linearExponent = currentExponent;
  normalizeExtendedDelta(linearMantissa, linearExponent);
  if (currentExponent > 10.0) {
    nextMantissa = linearMantissa;
    nextExponent = linearExponent;
    return true;
  }

  vec2 reciprocalMantissa = vec2(1.0 / 3.0, 0.0);
  float reciprocalExponent = 0.0;
  if (
    !divideExtendedByExtended(
      reciprocalMantissa,
      reciprocalExponent,
      currentMantissa,
      currentExponent
    ) ||
    !divideExtendedByExtended(
      reciprocalMantissa,
      reciprocalExponent,
      currentMantissa,
      currentExponent
    )
  ) {
    return false;
  }
  if (currentExponent < -20.0) {
    nextMantissa = reciprocalMantissa;
    nextExponent = reciprocalExponent;
    return true;
  }

  addExtendedValues(
    linearMantissa,
    linearExponent,
    reciprocalMantissa,
    reciprocalExponent,
    nextMantissa,
    nextExponent
  );
  return !any(isnan(nextMantissa)) && !any(isinf(nextMantissa));
}

bool calculateNextNewtonDelta(
  vec4 packedReference,
  vec2 delta,
  vec2 deltaMantissa,
  float deltaExponent,
  out vec2 nextMantissa,
  out float nextExponent
) {
  vec2 reference = combineReference(packedReference);
  vec2 actual = addReference(packedReference, delta);
  float referenceScale = maxNorm(reference);
  float actualScale = maxNorm(actual);
  if (referenceScale == 0.0 || actualScale == 0.0) {
    return false;
  }

  if (
    min(referenceScale, actualScale) >= 1e-3 &&
    max(referenceScale, actualScale) <= 1e3
  ) {
    vec2 denominator = complexMultiply(
      complexSquare(reference),
      complexSquare(actual)
    );
    float denominatorSquared = dot(denominator, denominator);
    vec2 reciprocalTerm = complexDivide(
      2.0 * reference + delta,
      denominator,
      denominatorSquared
    );
    vec2 factor = (vec2(2.0, 0.0) - reciprocalTerm) / 3.0;
    nextMantissa = complexMultiply(deltaMantissa, factor);
    nextExponent = deltaExponent;
    normalizeExtendedDelta(nextMantissa, nextExponent);
    return !any(isnan(nextMantissa)) && !any(isinf(nextMantissa));
  }

  // Δ' = 2Δ/3 - Δ(2Z+Δ)/(3 Z²(Z+Δ)²). Keep both terms in
  // mantissa/exponent form: near the pole the quotient can be larger than
  // float while the represented orbit remains valid.
  vec2 linearMantissa = deltaMantissa * (2.0 / 3.0);
  float linearExponent = deltaExponent;
  normalizeExtendedDelta(linearMantissa, linearExponent);

  vec2 reciprocalMantissa = complexMultiply(
    deltaMantissa,
    2.0 * reference + delta
  );
  float reciprocalExponent = deltaExponent;
  normalizeExtendedDelta(reciprocalMantissa, reciprocalExponent);
  if (
    !divideExtendedBy(reciprocalMantissa, reciprocalExponent, reference) ||
    !divideExtendedBy(reciprocalMantissa, reciprocalExponent, reference) ||
    !divideExtendedBy(reciprocalMantissa, reciprocalExponent, actual) ||
    !divideExtendedBy(reciprocalMantissa, reciprocalExponent, actual)
  ) {
    return false;
  }
  reciprocalMantissa *= -1.0 / 3.0;
  normalizeExtendedDelta(reciprocalMantissa, reciprocalExponent);

  addExtendedValues(
    linearMantissa,
    linearExponent,
    reciprocalMantissa,
    reciprocalExponent,
    nextMantissa,
    nextExponent
  );
  return !any(isnan(nextMantissa)) && !any(isinf(nextMantissa));
}

bool calculateReciprocalPerturbationTerm(
  vec4 packedReference,
  vec2 delta,
  out vec2 reciprocalTerm
) {
  vec2 reference = combineReference(packedReference);
  vec2 actual = addReference(packedReference, delta);
  vec2 numerator = 2.0 * reference + delta;
  float referenceScale = maxNorm(reference);
  float actualScale = maxNorm(actual);

  if (
    min(referenceScale, actualScale) >= 1e-3 &&
    max(referenceScale, actualScale) <= 1e3
  ) {
    vec2 denominator = complexMultiply(
      complexSquare(reference),
      complexSquare(actual)
    );
    float denominatorSquared = dot(denominator, denominator);
    reciprocalTerm = complexDivide(
      numerator,
      denominator,
      denominatorSquared
    );
    return !any(isnan(reciprocalTerm)) && !any(isinf(reciprocalTerm));
  }

  reciprocalTerm = numerator;
  if (
    !divideFastOrStableInPlace(reciprocalTerm, reference) ||
    !divideFastOrStableInPlace(reciprocalTerm, reference) ||
    !divideFastOrStableInPlace(reciprocalTerm, actual) ||
    !divideFastOrStableInPlace(reciprocalTerm, actual)
  ) {
    return false;
  }
  return true;
}

bool calculateCorrectionDelta(
  vec4 packedReference,
  vec2 delta,
  out vec2 correctionDelta
) {
  vec2 reciprocalTerm;
  if (!calculateReciprocalPerturbationTerm(packedReference, delta, reciprocalTerm)) {
    return false;
  }
  correctionDelta = complexMultiply(
    delta,
    (vec2(1.0, 0.0) + reciprocalTerm) / 3.0
  );
  return !any(isnan(correctionDelta)) && !any(isinf(correctionDelta));
}

int nearestRoot(vec2 value) {
  const vec2 ROOT_0 = vec2(1.0, 0.0);
  const vec2 ROOT_1 = vec2(-0.5, 0.866025403784);
  const vec2 ROOT_2 = vec2(-0.5, -0.866025403784);
  float distance0 = dot(value - ROOT_0, value - ROOT_0);
  float distance1 = dot(value - ROOT_1, value - ROOT_1);
  float distance2 = dot(value - ROOT_2, value - ROOT_2);
  if (distance0 <= distance1 && distance0 <= distance2) return 0;
  if (distance1 <= distance2) return 1;
  return 2;
}

vec2 cubicRoot(int index) {
  if (index == 0) return vec2(1.0, 0.0);
  if (index == 1) return vec2(-0.5, 0.866025403784);
  return vec2(-0.5, -0.866025403784);
}

float stableComplexMagnitude(vec2 value) {
  float scale = max(abs(value.x), abs(value.y));
  if (scale == 0.0) {
    return 0.0;
  }
  return scale * length(value / scale);
}

vec2 iterateNewtonLocalError(vec2 error, vec2 root) {
  vec2 errorSquared = complexSquare(error);
  vec2 numerator = complexMultiply(errorSquared, 3.0 * root + 2.0 * error);
  vec2 denominator = 3.0 * complexSquare(root + error);
  float denominatorSquared = dot(denominator, denominator);
  if (denominatorSquared < 1e-20) {
    return vec2(0.0);
  }
  return complexDivide(numerator, denominator, denominatorSquared);
}

float thresholdCrossingPhase(
  float previousMetric,
  float currentMetric,
  float threshold
) {
  vec3 metrics = vec3(previousMetric, currentMetric, threshold);
  if (
    any(isnan(metrics)) ||
    any(isinf(metrics)) ||
    any(lessThanEqual(metrics, vec3(0.0)))
  ) {
    return 1.0;
  }

  float previousLog = log(previousMetric);
  float currentLog = log(currentMetric);
  float denominator = currentLog - previousLog;
  if (abs(denominator) < 1e-6) {
    return 1.0;
  }

  return clamp((log(threshold) - previousLog) / denominator, 0.0, 1.0);
}

float quadraticConvergencePhase(
  float currentMetric,
  float threshold,
  int refinementSteps
) {
  if (currentMetric == 0.0) {
    return 0.0;
  }
  if (
    isnan(currentMetric) ||
    isinf(currentMetric) ||
    isnan(threshold) ||
    isinf(threshold) ||
    currentMetric < 0.0 ||
    currentMetric >= 1.0 ||
    threshold <= 0.0 ||
    threshold >= 1.0
  ) {
    return 1.0;
  }

  float metricLog = -log(currentMetric);
  float thresholdLog = -log(threshold);
  float phase =
    1.0 +
    float(max(refinementSteps, 0)) -
    log(metricLog / thresholdLog) / log(2.0);
  return clamp(phase, 0.0, 1.0);
}

vec3 cosinePalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318530718 * (c * t + d));
}

vec3 palette(float t) {
  if (u_palette == 1) {
    return cosinePalette(t, vec3(0.50), vec3(0.50), vec3(1.0), vec3(0.00, 0.10, 0.20));
  }
  if (u_palette == 2) {
    return cosinePalette(
      t,
      vec3(0.52, 0.48, 0.42),
      vec3(0.48, 0.44, 0.38),
      vec3(1.0, 0.8, 0.6),
      vec3(0.00, 0.12, 0.20)
    );
  }
  if (u_palette == 3) {
    return cosinePalette(
      t,
      vec3(0.48, 0.50, 0.54),
      vec3(0.46, 0.48, 0.44),
      vec3(1.0),
      vec3(0.72, 0.42, 0.18)
    );
  }
  return cosinePalette(
    t,
    vec3(0.46, 0.44, 0.53),
    vec3(0.50, 0.45, 0.48),
    vec3(1.0, 0.82, 0.66),
    vec3(0.74, 0.52, 0.28)
  );
}

float noise(vec2 position) {
  return fract(sin(dot(position, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 pixel = gl_FragCoord.xy - 0.5 * u_resolution;
  vec2 planeDelta = u_centerDelta + pixel * (u_scale / u_resolution.y);

${sf(e)}

  if (resultKind == 0) {
    outColor = vec4(0.012, 0.016, 0.027, 1.0);
    return;
  }

  float colorIteration = float(iteration);
  if (u_smoothColors) {
${cf(e)}
  }

  float normalizedIteration =
    clamp(colorIteration / max(float(u_maxIterations), 1.0), 0.0, 1.0);
  float rootPosition = float(rootIndex) / 3.0;
  float colorPosition;
  if (resultKind == 2) {
    colorPosition = colorIteration * u_colorDensity + u_colorOffset;
  } else {
    colorPosition =
      rootPosition +
      colorIteration * u_colorDensity * 0.18 +
      u_colorOffset;
  }

  float shade = 0.58 + 0.42 * (1.0 - normalizedIteration);
  vec3 color = max(palette(colorPosition), vec3(0.0)) * shade;
  if (resultKind == 2) {
    color *= vec3(0.64, 0.78, 1.0);
  }
  color += (noise(gl_FragCoord.xy) - 0.5) / 255.0;
  outColor = vec4(color, 1.0);
}
`}var uf=2052,df={"mandelbrot-perturbation":{texelsPerIteration:1,uniforms:``,parameterGuard:``,initialize:`
      vec2 deltaCurrent = vec2(0.0);
      vec2 deltaPrevious = vec2(0.0);
    `,iterate:`
      nextDeltaCurrent =
        2.0 * multiplyReference(referenceCurrent, deltaCurrent) +
        complexSquare(deltaCurrent) +
        planeDelta;
      nextDeltaPrevious = deltaCurrent;
    `,rebase:`
      deltaCurrent = subtractReference(actualZ, referenceStartCurrent);
    `},"julia-perturbation":{texelsPerIteration:1,uniforms:`uniform vec2 u_juliaConstant;`,parameterGuard:`
      if (any(isnan(u_juliaConstant))) {
        discard;
      }
    `,initialize:`
      vec2 deltaCurrent = planeDelta;
      vec2 deltaPrevious = vec2(0.0);
    `,iterate:`
      nextDeltaCurrent =
        2.0 * multiplyReference(referenceCurrent, deltaCurrent) +
        complexSquare(deltaCurrent);
      nextDeltaPrevious = deltaCurrent;
    `,rebase:`
      deltaCurrent = subtractReference(actualZ, referenceStartCurrent);
    `},"tricorn-perturbation":{texelsPerIteration:1,uniforms:``,parameterGuard:``,initialize:`
      vec2 deltaCurrent = vec2(0.0);
      vec2 deltaPrevious = vec2(0.0);
    `,iterate:`
      vec4 conjugatedReference = vec4(
        referenceCurrent.x,
        -referenceCurrent.y,
        referenceCurrent.z,
        -referenceCurrent.w
      );
      vec2 conjugatedDelta = complexConjugate(deltaCurrent);
      nextDeltaCurrent =
        2.0 * multiplyReference(conjugatedReference, conjugatedDelta) +
        complexSquare(conjugatedDelta) +
        planeDelta;
      nextDeltaPrevious = deltaCurrent;
    `,rebase:`
      deltaCurrent = subtractReference(actualZ, referenceStartCurrent);
    `},"burning-ship-perturbation":{texelsPerIteration:1,uniforms:``,parameterGuard:``,initialize:`
      vec2 deltaCurrent = vec2(0.0);
      vec2 deltaPrevious = vec2(0.0);
    `,iterate:`
      vec4 transformedReference = absoluteReference(referenceCurrent);
      vec2 transformedDelta = absolutePerturbationDelta(
        referenceCurrent,
        deltaCurrent
      );
      nextDeltaCurrent =
        2.0 * multiplyReference(transformedReference, transformedDelta) +
        complexSquare(transformedDelta) +
        planeDelta;
      nextDeltaPrevious = deltaCurrent;
    `,rebase:`
      deltaCurrent = subtractReference(actualZ, referenceStartCurrent);
    `},"phoenix-perturbation":{texelsPerIteration:2,uniforms:`
      uniform vec2 u_phoenixConstant;
      uniform float u_phoenixMemory;
    `,parameterGuard:`
      if (any(isnan(u_phoenixConstant)) || isnan(u_phoenixMemory)) {
        discard;
      }
    `,initialize:`
      vec2 deltaCurrent = planeDelta;
      vec2 deltaPrevious = vec2(0.0);
    `,iterate:`
      nextDeltaCurrent =
        2.0 * multiplyReference(referenceCurrent, deltaCurrent) +
        complexSquare(deltaCurrent) +
        u_phoenixMemory * deltaPrevious;
      nextDeltaPrevious = deltaCurrent;
    `,rebase:`
      deltaCurrent = subtractReference(actualZ, referenceStartCurrent);
      deltaPrevious = subtractReference(actualPreviousZ, referenceStartPrevious);
    `}};function ff(e){return e===`newton-cubic-perturbation`||e===`nova-cubic-perturbation`?1:df[e].texelsPerIteration}function pf(e){if(e===`newton-cubic-perturbation`||e===`nova-cubic-perturbation`)return lf(e);let t=df[e],n=t.texelsPerIteration===2?`fetchReference(referenceIndex, 1)`:`vec4(0.0)`,r=t.texelsPerIteration===2?`fetchReference(nextReferenceIndex, 1)`:`vec4(0.0)`,i=t.texelsPerIteration===2?`addReference(nextReferencePrevious, nextDeltaPrevious)`:`actualCurrent`,a=t.texelsPerIteration===2?`fetchReference(0, 1)`:`vec4(0.0)`;return`#version 300 es
precision highp float;
precision highp sampler2D;

out vec4 outColor;

uniform vec2 u_resolution;
uniform vec2 u_centerDelta;
uniform float u_scale;
uniform int u_maxIterations;
uniform int u_palette;
uniform float u_colorDensity;
uniform float u_colorOffset;
uniform bool u_smoothColors;
uniform sampler2D u_referenceOrbit;
uniform int u_referenceCount;
${t.uniforms}

vec2 complexSquare(vec2 value) {
  return vec2(
    value.x * value.x - value.y * value.y,
    2.0 * value.x * value.y
  );
}

vec2 complexMultiply(vec2 left, vec2 right) {
  return vec2(
    left.x * right.x - left.y * right.y,
    left.x * right.y + left.y * right.x
  );
}

vec2 complexConjugate(vec2 value) {
  return vec2(value.x, -value.y);
}

vec4 fetchReference(int index, int component) {
  return texelFetch(
    u_referenceOrbit,
    ivec2(component, index),
    0
  );
}

vec2 combineReference(vec4 reference) {
  return reference.xy + reference.zw;
}

vec2 addReference(vec4 reference, vec2 delta) {
  return reference.xy + (reference.zw + delta);
}

vec2 subtractReference(vec2 actual, vec4 reference) {
  return (actual - reference.xy) - reference.zw;
}

vec2 multiplyReference(vec4 reference, vec2 value) {
  return
    complexMultiply(reference.xy, value) +
    complexMultiply(reference.zw, value);
}

vec4 absoluteReference(vec4 reference) {
  vec2 value = combineReference(reference);
  vec2 direction = vec2(
    value.x > 0.0 ? 1.0 : (value.x < 0.0 ? -1.0 : 0.0),
    value.y > 0.0 ? 1.0 : (value.y < 0.0 ? -1.0 : 0.0)
  );
  return vec4(reference.xy * direction, reference.zw * direction);
}

float absolutePerturbationDeltaComponent(
  float referenceHigh,
  float referenceLow,
  float delta
) {
  float reference = referenceHigh + referenceLow;
  float actual = referenceHigh + (referenceLow + delta);

  if (reference > 0.0) {
    return actual >= 0.0
      ? delta
      : -2.0 * referenceHigh + (-2.0 * referenceLow - delta);
  }
  if (reference < 0.0) {
    return actual <= 0.0
      ? -delta
      : 2.0 * referenceHigh + (2.0 * referenceLow + delta);
  }
  return abs(delta);
}

vec2 absolutePerturbationDelta(vec4 reference, vec2 delta) {
  return vec2(
    absolutePerturbationDeltaComponent(reference.x, reference.z, delta.x),
    absolutePerturbationDeltaComponent(reference.y, reference.w, delta.y)
  );
}

float maxNorm(vec2 value) {
  return max(abs(value.x), abs(value.y));
}

vec3 cosinePalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318530718 * (c * t + d));
}

vec3 palette(float t) {
  if (u_palette == 1) {
    return cosinePalette(
      t,
      vec3(0.50),
      vec3(0.50),
      vec3(1.0),
      vec3(0.00, 0.10, 0.20)
    );
  }

  if (u_palette == 2) {
    return cosinePalette(
      t,
      vec3(0.52, 0.48, 0.42),
      vec3(0.48, 0.44, 0.38),
      vec3(1.0, 0.8, 0.6),
      vec3(0.00, 0.12, 0.20)
    );
  }

  if (u_palette == 3) {
    return cosinePalette(
      t,
      vec3(0.48, 0.50, 0.54),
      vec3(0.46, 0.48, 0.44),
      vec3(1.0, 1.0, 1.0),
      vec3(0.72, 0.42, 0.18)
    );
  }

  return cosinePalette(
    t,
    vec3(0.46, 0.44, 0.53),
    vec3(0.50, 0.45, 0.48),
    vec3(1.0, 0.82, 0.66),
    vec3(0.74, 0.52, 0.28)
  );
}

float noise(vec2 position) {
  return fract(sin(dot(position, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  ${t.parameterGuard}
  vec2 pixel = gl_FragCoord.xy - 0.5 * u_resolution;
  vec2 planeDelta = u_centerDelta + pixel * (u_scale / u_resolution.y);
  ${t.initialize}
  vec2 actualZ = vec2(0.0);
  int referenceIndex = 0;
  int iteration = 0;
  int postEscapeIterations = 0;
  bool didEscape = false;

  for (int i = 0; i < ${uf}; i++) {
    if (!didEscape && i >= u_maxIterations) {
      break;
    }

    bool wasEscaped = didEscape;
    vec4 referenceCurrent = fetchReference(referenceIndex, 0);
    vec4 referencePrevious = ${n};
    vec2 actualCurrent = addReference(referenceCurrent, deltaCurrent);
    vec2 nextDeltaCurrent = vec2(0.0);
    vec2 nextDeltaPrevious = deltaPrevious;
    ${t.iterate}

    int nextReferenceIndex = referenceIndex + 1;
    vec4 nextReferenceCurrent = fetchReference(nextReferenceIndex, 0);
    vec4 nextReferencePrevious = ${r};
    actualZ = addReference(nextReferenceCurrent, nextDeltaCurrent);
    vec2 actualPreviousZ = ${i};
    deltaCurrent = nextDeltaCurrent;
    deltaPrevious = nextDeltaPrevious;

    if (!didEscape && dot(actualZ, actualZ) > 4.0) {
      iteration = i;
      didEscape = true;
      if (!u_smoothColors || dot(actualZ, actualZ) > 1e24) {
        break;
      }
    }

    bool referenceExhausted = nextReferenceIndex >= u_referenceCount - 1;
    bool closerToCriticalPoint = maxNorm(actualZ) < maxNorm(deltaCurrent);
    if (referenceExhausted || closerToCriticalPoint) {
      vec4 referenceStartCurrent = fetchReference(0, 0);
      vec4 referenceStartPrevious = ${a};
      ${t.rebase}
      referenceIndex = 0;
    } else {
      referenceIndex = nextReferenceIndex;
    }

    if (wasEscaped) {
      postEscapeIterations += 1;
      if (
        postEscapeIterations >= 4 ||
        dot(actualZ, actualZ) > 1e24
      ) {
        break;
      }
    }
  }

  if (!didEscape) {
    outColor = vec4(0.012, 0.016, 0.027, 1.0);
    return;
  }

  float colorIteration = float(iteration);
  if (u_smoothColors) {
    float logMagnitude = 0.5 * log(max(dot(actualZ, actualZ), 1.000001));
    float smoothing = log(max(logMagnitude / log(2.0), 0.000001));
    colorIteration +=
      1.0 +
      float(postEscapeIterations) -
      smoothing / log(2.0);
  }

  float colorPosition = colorIteration * u_colorDensity + u_colorOffset;
  vec3 color = max(palette(colorPosition), vec3(0.0));
  color += (noise(gl_FragCoord.xy) - 0.5) / 255.0;
  outColor = vec4(color, 1.0);
}
`}pf(`mandelbrot-perturbation`);var mf=[`u_resolution`,`u_centerDelta`,`u_scale`,`u_maxIterations`,`u_palette`,`u_colorDensity`,`u_colorOffset`,`u_smoothColors`,`u_referenceOrbit`,`u_referenceCount`],hf=class{#e;#t;#n;#r;#i;#a;#o=new Map;#s=new Map;#c=0;constructor(e){let t=e.getContext(`webgl2`,{alpha:!1,antialias:!1,depth:!1,powerPreference:`high-performance`,preserveDrawingBuffer:!1,stencil:!1});if(!t)throw Error(`WebGL2 недоступен для deep zoom.`);let n=t.createVertexArray(),r=t.createTexture();if(!n||!r)throw Error(`WebGL не смог создать ресурсы deep zoom.`);this.#e=e,this.#t=t,this.#n=n,this.#r=r,this.#l(`mandelbrot-perturbation`)}setReferenceOrbit(e){let t=this.#t,n=ff(e.backend);if(e.texelsPerIteration!==n)throw Error(`Deep-zoom backend ${e.backend} ожидал ${n} texel на итерацию, получено ${e.texelsPerIteration}.`);let r=t.getParameter(t.MAX_TEXTURE_SIZE);if(e.orbitLength>r||e.texelsPerIteration>r)throw Error(`Опорная орбита (${e.orbitLength} итераций) превышает лимит GPU (${r}).`);this.#l(e.backend),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.#r),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,t.RGBA32F,e.texelsPerIteration,e.orbitLength,0,t.RGBA,t.FLOAT,e.values),this.#c=e.orbitLength}resize(e){let t=Math.min(window.devicePixelRatio||1,2)*e,n=Math.max(1,Math.round(this.#e.clientWidth*t)),r=Math.max(1,Math.round(this.#e.clientHeight*t));return this.#e.width===n&&this.#e.height===r?!1:(this.#e.width=n,this.#e.height=r,!0)}render(e){if(this.#c<2)throw Error(`Опорная орбита deep zoom ещё не подготовлена.`);if(e.backend!==this.#i||!this.#a)throw Error(`Deep-zoom renderer получил состояние другого backend'а.`);let t=this.#t;t.disable(t.BLEND),t.viewport(0,0,this.#e.width,this.#e.height),t.useProgram(this.#a),t.bindVertexArray(this.#n),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.#r),t.uniform2f(this.#o.get(`u_resolution`),this.#e.width,this.#e.height),t.uniform2f(this.#o.get(`u_centerDelta`),e.centerDelta[0],e.centerDelta[1]),t.uniform1f(this.#o.get(`u_scale`),e.scale),t.uniform1i(this.#o.get(`u_maxIterations`),e.maxIterations),t.uniform1i(this.#o.get(`u_palette`),e.palette),t.uniform1f(this.#o.get(`u_colorDensity`),e.colorDensity),t.uniform1f(this.#o.get(`u_colorOffset`),e.colorOffset),t.uniform1i(this.#o.get(`u_smoothColors`),+!!e.smoothColors),t.uniform1i(this.#o.get(`u_referenceOrbit`),0),t.uniform1i(this.#o.get(`u_referenceCount`),this.#c),this.#u(e.parameters),t.drawArrays(t.TRIANGLES,0,3)}dispose(){this.#t.deleteTexture(this.#r),this.#t.deleteVertexArray(this.#n),this.#a&&this.#t.deleteProgram(this.#a)}#l(e){if(e===this.#i)return;let t=Gl(this.#t,Bl,pf(e)),n=new Map;for(let e of mf)n.set(e,Kl(this.#t,t,e));let r=new Map,i=e===`julia-perturbation`?[[`constant`,`u_juliaConstant`]]:e===`phoenix-perturbation`?[[`constant`,`u_phoenixConstant`],[`memory`,`u_phoenixMemory`]]:e===`newton-cubic-perturbation`?[[`tolerance`,`u_convergenceTolerance`]]:e===`nova-cubic-perturbation`?[[`relaxation`,`u_novaRelaxation`],[`escapeRadius`,`u_novaEscapeRadius`],[`tolerance`,`u_convergenceTolerance`]]:[];for(let[e,n]of i)r.set(e,Kl(this.#t,t,n));this.#a&&this.#t.deleteProgram(this.#a),this.#i=e,this.#a=t,this.#o=n,this.#s=r,this.#c=0}#u(e){for(let[t,n]of this.#s){let r=e[t];Array.isArray(r)?this.#t.uniform2f(n,r[0],r[1]):typeof r==`number`?this.#t.uniform1f(n,r):t===`constant`&&this.#i===`julia-perturbation`?this.#t.uniform2f(n,-.745,.113):t===`constant`&&this.#i===`phoenix-perturbation`?this.#t.uniform2f(n,.5667,0):t===`memory`&&this.#t.uniform1f(n,-.5)}}},gf={key:0,class:`render-error`},_f=[`data-state`,`data-limit`],vf=[`data-state`],yf=ir({__name:`FractalCanvas`,setup(e,{expose:t}){let n=Il(),r=z(),i=z(``),a=z(`idle`),o=z(0),s=z(``),c=z(`idle`),l=z(0),u=z(``),d=G(()=>{let e=n.activeFormula;if(rf(e.deepZoom?.backend))return e.deepZoom.backend}),f=G(()=>d.value!==void 0&&_l(n.magnification)),p=G(()=>{let e=n.activeFormula.deepZoom?.maxMagnification;return e!==void 0&&n.magnification>=e*.999999999999}),m=G(()=>n.activeFormula.renderer===`point-attractor`),h=G(()=>{if(a.value===`preparing`)return`Подготовка опорной орбиты…`;if(a.value===`ready`){let e=n.activeFormula.deepZoom?.maxMagnification;return p.value&&e!==void 0?`Deep zoom · предел ${e.toExponential(2)}×`:`Deep zoom · ${o.value} digits`}return a.value===`error`?s.value||`Deep zoom недоступен`:`Deep zoom`}),g=G(()=>c.value===`preparing`?`Расчёт траектории…`:c.value===`ready`?`Clifford · ${l.value.toLocaleString(`ru-RU`)} точек`:c.value===`error`?u.value||`Аттрактор недоступен`:`Clifford attractor`),_,v,y,b,x,S,C=``,w,T=new tf,ee=new Rl,E,D,te,O,k,A=1,j=new Map,ne=n.$subscribe(()=>ve(),{detached:!0});Rn(()=>n.activeFormulaId,()=>{if(r.value)try{ie(),i.value=``,ve()}catch(e){ue(e)}},{flush:`sync`}),Rn([()=>n.activeFormulaId,()=>Se()],()=>we(),{flush:`sync`}),Rn(()=>[n.maxIterations,n.colorDensity,n.parameterValues],()=>_e(),{deep:!0}),Rn(()=>[n.activeFormulaId,n.exactCenter[0],n.exactCenter[1],n.exactScale,n.maxIterations,P(d.value,n.parameterValues)],()=>ye(),{flush:`sync`}),yr(()=>{M(),E=new ResizeObserver(()=>ve()),E.observe(r.value),window.addEventListener(`keydown`,ge),r.value.addEventListener(`webglcontextlost`,re),r.value.addEventListener(`webglcontextrestored`,M)}),Sr(()=>{ne(),E?.disconnect(),window.removeEventListener(`keydown`,ge),r.value?.removeEventListener(`webglcontextlost`,re),r.value?.removeEventListener(`webglcontextrestored`,M),D!==void 0&&window.cancelAnimationFrame(D),te!==void 0&&window.clearTimeout(te),O!==void 0&&window.clearTimeout(O),k!==void 0&&window.clearTimeout(k),T.cancel(),ee.cancel(),ae()});function M(){if(r.value)try{ae(),S=void 0,C=``,_=new ql(r.value),v=new eu(r.value),y=new iu(r.value),b=new pu(r.value),ie();try{x=new hf(r.value),s.value=``}catch(e){x=void 0,a.value=`error`,s.value=e instanceof Error?e.message:String(e)}i.value=``,ye(),we(),ve()}catch(e){ae(),ue(e)}}function re(e){e.preventDefault(),_=void 0,v=void 0,y=void 0,b=void 0,x=void 0,S=void 0,w=void 0,T.cancel(),ee.cancel(),i.value=`Контекст WebGL потерян. Ожидаем восстановления GPU.`}function ie(){let e=n.activeFormula;e.renderer===`escape-time`?_?.setFormula(e):e.renderer===`root-basin`?v?.setFormula(e):e.renderer===`geometric-ifs`&&b?.setFormula(e)}function ae(){_?.dispose(),v?.dispose(),y?.dispose(),b?.dispose(),x?.dispose(),_=void 0,v=void 0,y=void 0,b=void 0,x=void 0}async function oe(){if(!r.value)throw Error(`Canvas фрактала ещё не готов к экспорту.`);i.value=``;let e=Math.max(1,Math.round(r.value.clientWidth)),t=Math.max(1,Math.round(r.value.clientHeight)),a=e*2,o=t*2,s=document.createElement(`canvas`);s.width=a,s.height=o,s.style.position=`fixed`,s.style.left=`-100000px`,s.style.top=`0`,s.style.width=`${e}px`,s.style.height=`${t}px`,s.style.pointerEvents=`none`,document.body.append(s);let c;try{let e=n.activeFormula,t=d.value,r=P(t,n.parameterValues);if(f.value&&t&&S?.backend===t&&C===r){let e=new hf(s);c=e,e.setReferenceOrbit(S),e.render({backend:t,centerDelta:[Ol(n.exactCenter[0],S.center[0],n.exactScale),Ol(n.exactCenter[1],S.center[1],n.exactScale)],scale:Number(n.exactScale),maxIterations:n.maxIterations,palette:n.palette,colorDensity:n.colorDensity,colorOffset:n.colorOffset,smoothColors:n.smoothColors,parameters:n.parameterValues})}else if(e.renderer===`escape-time`){let t=new ql(s);c=t,t.setFormula(e),t.render({center:n.center,scale:n.scale,maxIterations:n.maxIterations,palette:n.palette,colorDensity:n.colorDensity,colorOffset:n.colorOffset,smoothColors:n.smoothColors,parameters:n.parameterValues})}else if(e.renderer===`root-basin`){let t=new eu(s);c=t,t.setFormula(e),t.render({center:n.center,scale:n.scale,maxIterations:n.maxIterations,palette:n.palette,colorDensity:n.colorDensity,colorOffset:n.colorOffset,smoothColors:n.smoothColors,parameters:n.parameterValues})}else if(e.renderer===`point-attractor`){if(!w)throw Error(`Траектория аттрактора ещё не готова к экспорту.`);let e=new iu(s);c=e,e.setPoints(w),e.render({center:n.center,scale:n.scale,palette:n.palette,colorOffset:n.colorOffset,exposure:Ce(`exposure`,.045),pointSize:Ce(`pointSize`,1.25),pointFraction:1})}else{let t=new pu(s);c=t,t.setFormula(e),t.render({center:n.center,scale:n.scale,recursionDepthMode:n.recursionDepthMode,recursionDepth:n.recursionDepth,coloring:n.geometricColoring,palette:n.palette,colorOffset:n.colorOffset})}let i=s.getContext(`webgl2`);if(!i||i.drawingBufferWidth!==a||i.drawingBufferHeight!==o)throw Error(`GPU не поддерживает экспорт ${a.toLocaleString(`ru-RU`)} × ${o.toLocaleString(`ru-RU`)} px.`);ce(await se(s),le(e.id,a,o))}catch(e){throw ue(e),e}finally{c?.dispose(),s.remove()}}function se(e){return new Promise((t,n)=>{e.toBlob(e=>{e?t(e):n(Error(`Браузер не смог создать PNG из текущего вида.`))},`image/png`)})}function ce(e,t){let n=URL.createObjectURL(e),r=document.createElement(`a`);r.href=n,r.download=t,r.click(),window.setTimeout(()=>URL.revokeObjectURL(n),1e3)}function le(e,t,n){return`fractal-${e}-${new Date().toISOString().replaceAll(`:`,`-`).replace(/\.\d{3}Z$/,`Z`)}-${t}x${n}.png`}function ue(e){i.value=e instanceof Error?e.message:String(e)}function de(e){e.pointerType===`mouse`&&e.button!==0||j.size>=2||(j.set(e.pointerId,[e.clientX,e.clientY]),r.value.setPointerCapture(e.pointerId),r.value.classList.add(`is-dragging`),A=.58)}function fe(e){let t=j.get(e.pointerId);if(!(!t||!r.value))if(j.size===1)n.panByPixels(e.clientX-t[0],e.clientY-t[1],r.value.clientHeight),j.set(e.pointerId,[e.clientX,e.clientY]);else{let t=Ee();j.set(e.pointerId,[e.clientX,e.clientY]);let r=Ee();t&&r&&r.distance>0&&n.transformCamera(Te(t.midpoint[0],t.midpoint[1]),Te(r.midpoint[0],r.midpoint[1]),t.distance/r.distance)}}function pe(e){j.delete(e.pointerId)&&(r.value?.classList.toggle(`is-dragging`,j.size>0),j.size===0&&(A=1,ve()))}function me(e){e.preventDefault();let t=Te(e.clientX,e.clientY),r=Math.exp(Math.max(-120,Math.min(120,e.deltaY))*.002);n.transformCamera(t,t,r),_e()}function he(e){let t=Te(e.clientX,e.clientY);n.transformCamera(t,t,.45),_e()}function ge(e){if(!(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement)){if(e.key===`ArrowLeft`)n.panByNormalized([-.08,0]);else if(e.key===`ArrowRight`)n.panByNormalized([.08,0]);else if(e.key===`ArrowUp`)n.panByNormalized([0,.08]);else if(e.key===`ArrowDown`)n.panByNormalized([0,-.08]);else if(e.key===`+`||e.key===`=`)n.zoomFromCenter(.8);else if(e.key===`-`)n.zoomFromCenter(1.25);else return;e.preventDefault(),_e()}}function _e(){A=.68,ve(),te!==void 0&&window.clearTimeout(te),te=window.setTimeout(()=>{A=1,te=void 0,ve()},140)}function ve(){D===void 0&&(D=window.requestAnimationFrame(()=>{if(D=void 0,!(!r.value||r.value.clientWidth===0||r.value.clientHeight===0))try{let e=n.activeFormula,t=d.value,r=P(t,n.parameterValues);f.value&&t&&x&&S?.backend===t&&C===r?(x.resize(A),x.render({backend:t,centerDelta:[Ol(n.exactCenter[0],S.center[0],n.exactScale),Ol(n.exactCenter[1],S.center[1],n.exactScale)],scale:Number(n.exactScale),maxIterations:n.maxIterations,palette:n.palette,colorDensity:n.colorDensity,colorOffset:n.colorOffset,smoothColors:n.smoothColors,parameters:n.parameterValues})):e.renderer===`escape-time`&&_?(_.resize(A),_.render({center:n.center,scale:n.scale,maxIterations:n.maxIterations,palette:n.palette,colorDensity:n.colorDensity,colorOffset:n.colorOffset,smoothColors:n.smoothColors,parameters:n.parameterValues})):e.renderer===`root-basin`&&v?(v.resize(A),v.render({center:n.center,scale:n.scale,maxIterations:n.maxIterations,palette:n.palette,colorDensity:n.colorDensity,colorOffset:n.colorOffset,smoothColors:n.smoothColors,parameters:n.parameterValues})):e.renderer===`point-attractor`&&y?(y.resize(A),y.render({center:n.center,scale:n.scale,palette:n.palette,colorOffset:n.colorOffset,exposure:Ce(`exposure`,.045),pointSize:Ce(`pointSize`,1.25),pointFraction:A*A})):e.renderer===`geometric-ifs`&&b&&(b.resize(A),b.render({center:n.center,scale:n.scale,recursionDepthMode:n.recursionDepthMode,recursionDepth:n.recursionDepth,coloring:n.geometricColoring,palette:n.palette,colorOffset:n.colorOffset}))}catch(e){ue(e)}}))}function ye(){if(T.cancel(),O!==void 0&&(window.clearTimeout(O),O=void 0),!f.value){S=void 0,C=``,a.value=`idle`,o.value=0;return}if(!x){a.value=`error`;return}a.value=`preparing`,s.value=``,O=window.setTimeout(()=>{O=void 0,be()},120)}async function be(){let e=d.value;if(!e)return;let t=[n.exactCenter[0],n.exactCenter[1]],i=n.exactScale,c=n.maxIterations,l=xe(n.parameterValues),u=P(e,l),p=r.value?r.value.clientWidth/Math.max(1,r.value.clientHeight):1;try{let r=await T.request({backend:e,parameters:l,center:t,scale:i,maxIterations:c,viewportAspect:p});if(!f.value||d.value!==e||P(d.value,n.parameterValues)!==u||n.exactCenter[0]!==t[0]||n.exactCenter[1]!==t[1]||n.exactScale!==i||n.maxIterations!==c)return;x?.setReferenceOrbit(r),S=r,C=u,o.value=r.precisionDigits,a.value=`ready`,ve()}catch(e){if(e instanceof ef)return;a.value=`error`,s.value=e instanceof Error?e.message:String(e)}}function P(e,t){return e?`${e}|${(e===`julia-perturbation`?[`constant`]:e===`phoenix-perturbation`?[`constant`,`memory`]:e===`nova-cubic-perturbation`?[`relaxation`]:[]).map(e=>`${e}:${JSON.stringify(t[e])}`).join(`|`)}`:``}function xe(e){let t={};for(let[n,r]of Object.entries(e))t[n]=Array.isArray(r)?[r[0],r[1]]:r;return t}function Se(){let e=n.activeFormula;return e.renderer===`point-attractor`?e.parameters.filter(e=>e.affectsOrbit!==!1).map(e=>`${e.key}:${String(n.parameterValues[e.key])}`).join(`|`):``}function Ce(e,t){let r=n.parameterValues[e];return typeof r==`number`&&Number.isFinite(r)?r:t}function we(){if(ee.cancel(),k!==void 0&&(window.clearTimeout(k),k=void 0),!m.value){y?.clearPoints(),w=void 0,c.value=`idle`,l.value=0;return}if(!y){c.value=`error`,u.value=`WebGL2 renderer аттрактора недоступен.`;return}c.value=`preparing`,u.value=``,k=window.setTimeout(()=>{k=void 0,F()},100)}async function F(){let e=Se(),t={a:Ce(`a`,-1.4),b:Ce(`b`,1.6),c:Ce(`c`,1),d:Ce(`d`,.7),burnIn:Ce(`burnIn`,100),pointCount:Ce(`pointCount`,5e5)};try{let n=await ee.request(t);if(!m.value||Se()!==e)return;y?.setPoints(n.values),w=n.values,l.value=n.pointCount,c.value=`ready`,ve()}catch(e){if(e instanceof Ll)return;c.value=`error`,u.value=e instanceof Error?e.message:String(e)}}function Te(e,t){let n=r.value.getBoundingClientRect();return[(e-n.left-n.width*.5)/n.height,(n.height*.5-(t-n.top))/n.height]}function Ee(){let[e,t]=j.values();if(!(!e||!t))return{midpoint:[(e[0]+t[0])*.5,(e[1]+t[1])*.5],distance:Math.hypot(t[0]-e[0],t[1]-e[1])}}return t({exportPng:oe}),(e,t)=>(H(),U(Ui,null,[W(`canvas`,{ref_key:`canvas`,ref:r,id:`fractal-canvas`,"aria-label":`Визуализация фрактала`,onPointerdown:de,onPointermove:fe,onPointerup:pe,onPointercancel:pe,onWheel:me,onDblclick:he},null,544),i.value?(H(),U(`div`,gf,[t[0]||=W(`strong`,null,`Не удалось запустить GPU-рендерер`,-1),W(`span`,null,N(i.value),1)])):la(``,!0),f.value?(H(),U(`div`,{key:1,class:`deep-zoom-status`,"data-state":a.value,"data-limit":p.value,role:`status`},[t[1]||=W(`i`,{"aria-hidden":`true`},null,-1),W(`span`,null,N(h.value),1)],8,_f)):la(``,!0),m.value?(H(),U(`div`,{key:2,class:`deep-zoom-status attractor-status`,"data-state":c.value,role:`status`},[t[2]||=W(`i`,{"aria-hidden":`true`},null,-1),W(`span`,null,N(g.value),1)],8,vf)):la(``,!0)],64))}}),bf={class:`stage`,"aria-label":`Область просмотра фрактала`},xf={class:`topbar`},Sf={id:`zoom-readout`},Cf={id:`center-readout`};Vo(ir({__name:`App`,setup(e){let{exactCenter:t,exactScale:n,magnification:r}=Ss(Il()),i=z(),a=z(!window.matchMedia(`(max-width: 760px)`).matches),o=z(!1),s=z(!1),c=G(()=>`${u(r.value)}×`),l=G(()=>`${kl(t.value[0],n.value)} ${t.value[1].startsWith(`-`)?`−`:`+`} ${kl(t.value[1].replace(`-`,``),n.value)}i`);function u(e){return e>=1e6?e.toExponential(2):e>=100?Math.round(e).toLocaleString(`ru-RU`):e>=10?e.toFixed(1):e.toFixed(2)}async function d(){if(!(!i.value||s.value)){s.value=!0;try{await i.value.exportPng()}catch{}finally{s.value=!1}}}return(e,t)=>(H(),U(`main`,{class:de([`viewer`,{"has-controls":a.value}])},[W(`section`,bf,[ia(yf,{ref_key:`fractalCanvas`,ref:i},null,512),W(`header`,xf,[t[6]||=W(`div`,{class:`brand`},[W(`span`,{class:`brand-mark`,"aria-hidden":`true`}),W(`span`,null,`Fractal Lab`)],-1),W(`button`,{class:`coordinates`,type:`button`,"aria-label":`Открыть точные координаты и масштаб`,title:`Задать точные координаты и масштаб`,onClick:t[0]||=e=>o.value=!0},[W(`span`,Sf,N(c.value),1),t[4]||=W(`span`,{class:`coordinate-divider`},null,-1),W(`span`,Cf,N(l.value),1),t[5]||=W(`svg`,{viewBox:`0 0 24 24`,"aria-hidden":`true`},[W(`path`,{d:`m9 15 6-6m-4 0h4v4`})],-1)])]),t[7]||=W(`div`,{class:`gesture-hint`},[W(`span`,{class:`desktop-hint`},`Перетаскивание — перемещение`),W(`span`,{class:`desktop-hint`},`Колесо — масштаб`),W(`span`,{class:`mobile-hint`},`Один палец — перемещение · два — масштаб`)],-1)]),a.value?(H(),$i(qd,{key:0,exporting:s.value,onHide:t[1]||=e=>a.value=!1,onExportPng:d},null,8,[`exporting`])):(H(),U(`button`,{key:1,class:`show-controls-button`,type:`button`,"aria-label":`Показать панель параметров`,title:`Показать панель параметров`,onClick:t[2]||=e=>a.value=!0},[...t[8]||=[W(`svg`,{viewBox:`0 0 24 24`,"aria-hidden":`true`},[W(`path`,{d:`M4 7h10M4 12h16M4 17h10`}),W(`circle`,{cx:`17`,cy:`7`,r:`2`}),W(`circle`,{cx:`13`,cy:`17`,r:`2`})],-1),W(`span`,null,`Параметры`,-1)]])),o.value?(H(),$i($d,{key:2,onClose:t[3]||=e=>o.value=!1})):la(``,!0)],2))}})).use(ss()).mount(`#app`);
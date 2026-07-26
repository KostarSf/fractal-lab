(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e){let t=Object.create(null);for(let n of e.split(`,`))t[n]=1;return e=>e in t}var t={},n=[],r=()=>{},i=()=>!1,a=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),o=e=>e.startsWith(`onUpdate:`),s=Object.assign,c=(e,t)=>{let n=e.indexOf(t);n>-1&&e.splice(n,1)},l=Object.prototype.hasOwnProperty,u=(e,t)=>l.call(e,t),d=Array.isArray,f=e=>x(e)===`[object Map]`,p=e=>x(e)===`[object Set]`,m=e=>x(e)===`[object Date]`,h=e=>typeof e==`function`,g=e=>typeof e==`string`,_=e=>typeof e==`symbol`,v=e=>typeof e==`object`&&!!e,y=e=>(v(e)||h(e))&&h(e.then)&&h(e.catch),b=Object.prototype.toString,x=e=>b.call(e),S=e=>x(e).slice(8,-1),C=e=>x(e)===`[object Object]`,w=e=>g(e)&&e!==`NaN`&&e[0]!==`-`&&``+parseInt(e,10)===e,T=e(`,key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted`),ee=e=>{let t=Object.create(null);return(n=>t[n]||(t[n]=e(n)))},E=/-\w/g,D=ee(e=>e.replace(E,e=>e.slice(1).toUpperCase())),O=/\B([A-Z])/g,k=ee(e=>e.replace(O,`-$1`).toLowerCase()),A=ee(e=>e.charAt(0).toUpperCase()+e.slice(1)),j=ee(e=>e?`on${A(e)}`:``),te=(e,t)=>!Object.is(e,t),ne=(e,...t)=>{for(let n=0;n<e.length;n++)e[n](...t)},M=(e,t,n,r=!1)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:r,value:n})},re=e=>{let t=parseFloat(e);return isNaN(t)?e:t},ie,ae=()=>ie||=typeof globalThis<`u`?globalThis:typeof self<`u`?self:typeof window<`u`?window:typeof global<`u`?global:{};function oe(e){if(d(e)){let t={};for(let n=0;n<e.length;n++){let r=e[n],i=g(r)?ue(r):oe(r);if(i)for(let e in i)t[e]=i[e]}return t}else if(g(e)||v(e))return e}var se=/;(?![^(]*\))/g,ce=/:([^]+)/,le=/\/\*[^]*?\*\//g;function ue(e){let t={};return e.replace(le,``).split(se).forEach(e=>{if(e){let n=e.split(ce);n.length>1&&(t[n[0].trim()]=n[1].trim())}}),t}function N(e){let t=``;if(g(e))t=e;else if(d(e))for(let n=0;n<e.length;n++){let r=N(e[n]);r&&(t+=r+` `)}else if(v(e))for(let n in e)e[n]&&(t+=n+` `);return t.trim()}var de=`itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`,fe=e(de);de+``;function pe(e){return!!e||e===``}function me(e,t){if(e.length!==t.length)return!1;let n=!0;for(let r=0;n&&r<e.length;r++)n=he(e[r],t[r]);return n}function he(e,t){if(e===t)return!0;let n=m(e),r=m(t);if(n||r)return n&&r?e.getTime()===t.getTime():!1;if(n=_(e),r=_(t),n||r)return e===t;if(n=d(e),r=d(t),n||r)return n&&r?me(e,t):!1;if(n=v(e),r=v(t),n||r){if(!n||!r||Object.keys(e).length!==Object.keys(t).length)return!1;for(let n in e){let r=e.hasOwnProperty(n),i=t.hasOwnProperty(n);if(r&&!i||!r&&i||!he(e[n],t[n]))return!1}}return String(e)===String(t)}function ge(e,t){return e.findIndex(e=>he(e,t))}var _e=e=>!!(e&&e.__v_isRef===!0),P=e=>g(e)?e:e==null?``:d(e)||v(e)&&(e.toString===b||!h(e.toString))?_e(e)?P(e.value):JSON.stringify(e,ve,2):String(e),ve=(e,t)=>_e(t)?ve(e,t.value):f(t)?{[`Map(${t.size})`]:[...t.entries()].reduce((e,[t,n],r)=>(e[ye(t,r)+` =>`]=n,e),{})}:p(t)?{[`Set(${t.size})`]:[...t.values()].map(e=>ye(e))}:_(t)?ye(t):v(t)&&!d(t)&&!C(t)?String(t):t,ye=(e,t=``)=>_(e)?`Symbol(${e.description??t})`:e,F,be=class{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this._warnOnRun=!0,this.__v_skip=!0,!e&&F&&(F.active?(this.parent=F,this.index=(F.scopes||=[]).push(this)-1):(this._active=!1,this._warnOnRun=!1))}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let e,t;if(this.scopes){let n=this.scopes.slice();for(e=0,t=n.length;e<t;e++)n[e].pause()}for(e=0,t=this.effects.length;e<t;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let e,t;if(this.scopes){let n=this.scopes.slice();for(e=0,t=n.length;e<t;e++)n[e].resume()}let n=this.effects.slice();for(e=0,t=n.length;e<t;e++)n[e].resume()}}run(e){if(this._active){let t=F;try{return F=this,e()}finally{F=t}}}on(){++this._on===1&&(this.prevScope=F,F=this)}off(){if(this._on>0&&--this._on===0){if(F===this)F=this.prevScope;else{let e=F;for(;e;){if(e.prevScope===this){e.prevScope=this.prevScope;break}e=e.prevScope}}this.prevScope=void 0}}stop(e){if(this._active){this._active=!1;let t,n;for(t=0,n=this.effects.length;t<n;t++)this.effects[t].stop();for(this.effects.length=0,t=0,n=this.cleanups.length;t<n;t++)this.cleanups[t]();if(this.cleanups.length=0,this.scopes){let e=this.scopes.slice();for(t=0,n=e.length;t<n;t++)e[t].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){let e=this.parent.scopes.pop();e&&e!==this&&(this.parent.scopes[this.index]=e,e.index=this.index)}this.parent=void 0}}};function xe(e){return new be(e)}function Se(){return F}function Ce(e,t=!1){F&&F.cleanups.push(e)}var I,we=new WeakSet,Te=class{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,F&&(F.active?F.effects.push(this):this.flags&=-2)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,we.has(this)&&(we.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||ke(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,He(this),Me(this);let e=I,t=Re;I=this,Re=!0;try{return this.fn()}finally{Ne(this),I=e,Re=t,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)Ie(e);this.deps=this.depsTail=void 0,He(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?we.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Pe(this)&&this.run()}get dirty(){return Pe(this)}},Ee=0,De,Oe;function ke(e,t=!1){if(e.flags|=8,t){e.next=Oe,Oe=e;return}e.next=De,De=e}function Ae(){Ee++}function je(){if(--Ee>0)return;if(Oe){let e=Oe;for(Oe=void 0;e;){let t=e.next;e.next=void 0,e.flags&=-9,e=t}}let e;for(;De;){let t=De;for(De=void 0;t;){let n=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(t){e||=t}t=n}}if(e)throw e}function Me(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function Ne(e){let t,n=e.depsTail,r=n;for(;r;){let e=r.prevDep;r.version===-1?(r===n&&(n=e),Ie(r),Le(r)):t=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=e}e.deps=t,e.depsTail=n}function Pe(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(Fe(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function Fe(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===Ue)||(e.globalVersion=Ue,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!Pe(e))))return;e.flags|=2;let t=e.dep,n=I,r=Re;I=e,Re=!0;try{Me(e);let n=e.fn(e._value);(t.version===0||te(n,e._value))&&(e.flags|=128,e._value=n,t.version++)}catch(e){throw t.version++,e}finally{I=n,Re=r,Ne(e),e.flags&=-3}}function Ie(e,t=!1){let{dep:n,prevSub:r,nextSub:i}=e;if(r&&(r.nextSub=i,e.prevSub=void 0),i&&(i.prevSub=r,e.nextSub=void 0),n.subs===e&&(n.subs=r,!r&&n.computed)){n.computed.flags&=-5;for(let e=n.computed.deps;e;e=e.nextDep)Ie(e,!0)}!t&&!--n.sc&&n.map&&n.map.delete(n.key)}function Le(e){let{prevDep:t,nextDep:n}=e;t&&(t.nextDep=n,e.prevDep=void 0),n&&(n.prevDep=t,e.nextDep=void 0)}var Re=!0,ze=[];function Be(){ze.push(Re),Re=!1}function Ve(){let e=ze.pop();Re=e===void 0||e}function He(e){let{cleanup:t}=e;if(e.cleanup=void 0,t){let e=I;I=void 0;try{t()}finally{I=e}}}var Ue=0,We=class{constructor(e,t){this.sub=e,this.dep=t,this.version=t.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}},Ge=class{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(e){if(!I||!Re||I===this.computed)return;let t=this.activeLink;if(t===void 0||t.sub!==I)t=this.activeLink=new We(I,this),I.deps?(t.prevDep=I.depsTail,I.depsTail.nextDep=t,I.depsTail=t):I.deps=I.depsTail=t,Ke(t);else if(t.version===-1&&(t.version=this.version,t.nextDep)){let e=t.nextDep;e.prevDep=t.prevDep,t.prevDep&&(t.prevDep.nextDep=e),t.prevDep=I.depsTail,t.nextDep=void 0,I.depsTail.nextDep=t,I.depsTail=t,I.deps===t&&(I.deps=e)}return t}trigger(e){this.version++,Ue++,this.notify(e)}notify(e){Ae();try{for(let e=this.subs;e;e=e.prevSub)e.sub.notify()&&e.sub.dep.notify()}finally{je()}}};function Ke(e){if(e.dep.sc++,e.sub.flags&4){let t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let e=t.deps;e;e=e.nextDep)Ke(e)}let n=e.dep.subs;n!==e&&(e.prevSub=n,n&&(n.nextSub=e)),e.dep.subs=e}}var qe=new WeakMap,Je=Symbol(``),Ye=Symbol(``),Xe=Symbol(``);function L(e,t,n){if(Re&&I){let t=qe.get(e);t||qe.set(e,t=new Map);let r=t.get(n);r||(t.set(n,r=new Ge),r.map=t,r.key=n),r.track()}}function Ze(e,t,n,r,i,a){let o=qe.get(e);if(!o){Ue++;return}let s=e=>{e&&e.trigger()};if(Ae(),t===`clear`)o.forEach(s);else{let i=d(e),a=i&&w(n);if(i&&n===`length`){let e=Number(r);o.forEach((t,n)=>{(n===`length`||n===Xe||!_(n)&&n>=e)&&s(t)})}else switch((n!==void 0||o.has(void 0))&&s(o.get(n)),a&&s(o.get(Xe)),t){case`add`:i?a&&s(o.get(`length`)):(s(o.get(Je)),f(e)&&s(o.get(Ye)));break;case`delete`:i||(s(o.get(Je)),f(e)&&s(o.get(Ye)));break;case`set`:f(e)&&s(o.get(Je));break}}je()}function Qe(e,t){let n=qe.get(e);return n&&n.get(t)}function $e(e){let t=R(e);return t===e?t:(L(t,`iterate`,Xe),Rt(e)?t:t.map(Vt))}function et(e){return L(e=R(e),`iterate`,Xe),e}function tt(e,t){return Lt(e)?Ht(It(e)?Vt(t):t):Vt(t)}var nt={__proto__:null,[Symbol.iterator](){return rt(this,Symbol.iterator,e=>tt(this,e))},concat(...e){return $e(this).concat(...e.map(e=>d(e)?$e(e):e))},entries(){return rt(this,`entries`,e=>(e[1]=tt(this,e[1]),e))},every(e,t){return at(this,`every`,e,t,void 0,arguments)},filter(e,t){return at(this,`filter`,e,t,e=>e.map(e=>tt(this,e)),arguments)},find(e,t){return at(this,`find`,e,t,e=>tt(this,e),arguments)},findIndex(e,t){return at(this,`findIndex`,e,t,void 0,arguments)},findLast(e,t){return at(this,`findLast`,e,t,e=>tt(this,e),arguments)},findLastIndex(e,t){return at(this,`findLastIndex`,e,t,void 0,arguments)},forEach(e,t){return at(this,`forEach`,e,t,void 0,arguments)},includes(...e){return st(this,`includes`,e)},indexOf(...e){return st(this,`indexOf`,e)},join(e){return $e(this).join(e)},lastIndexOf(...e){return st(this,`lastIndexOf`,e)},map(e,t){return at(this,`map`,e,t,void 0,arguments)},pop(){return ct(this,`pop`)},push(...e){return ct(this,`push`,e)},reduce(e,...t){return ot(this,`reduce`,e,t)},reduceRight(e,...t){return ot(this,`reduceRight`,e,t)},shift(){return ct(this,`shift`)},some(e,t){return at(this,`some`,e,t,void 0,arguments)},splice(...e){return ct(this,`splice`,e)},toReversed(){return $e(this).toReversed()},toSorted(e){return $e(this).toSorted(e)},toSpliced(...e){return $e(this).toSpliced(...e)},unshift(...e){return ct(this,`unshift`,e)},values(){return rt(this,`values`,e=>tt(this,e))}};function rt(e,t,n){let r=et(e),i=r[t]();return r!==e&&!Rt(e)&&(i._next=i.next,i.next=()=>{let e=i._next();return e.done||(e.value=n(e.value)),e}),i}var it=Array.prototype;function at(e,t,n,r,i,a){let o=et(e),s=o!==e&&!Rt(e),c=o[t];if(c!==it[t]){let t=c.apply(e,a);return s?Vt(t):t}let l=n;o!==e&&(s?l=function(t,r){return n.call(this,tt(e,t),r,e)}:n.length>2&&(l=function(t,r){return n.call(this,t,r,e)}));let u=c.call(o,l,r);return s&&i?i(u):u}function ot(e,t,n,r){let i=et(e),a=i!==e&&!Rt(e),o=n,s=!1;i!==e&&(a?(s=r.length===0,o=function(t,r,i){return s&&(s=!1,t=tt(e,t)),n.call(this,t,tt(e,r),i,e)}):n.length>3&&(o=function(t,r,i){return n.call(this,t,r,i,e)}));let c=i[t](o,...r);return s?tt(e,c):c}function st(e,t,n){let r=R(e);L(r,`iterate`,Xe);let i=r[t](...n);return(i===-1||i===!1)&&zt(n[0])?(n[0]=R(n[0]),r[t](...n)):i}function ct(e,t,n=[]){Be(),Ae();let r=R(e)[t].apply(e,n);return je(),Ve(),r}var lt=e(`__proto__,__v_isRef,__isVue`),ut=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!==`arguments`&&e!==`caller`).map(e=>Symbol[e]).filter(_));function dt(e){_(e)||(e=String(e));let t=R(this);return L(t,`has`,e),t.hasOwnProperty(e)}var ft=class{constructor(e=!1,t=!1){this._isReadonly=e,this._isShallow=t}get(e,t,n){if(t===`__v_skip`)return e.__v_skip;let r=this._isReadonly,i=this._isShallow;if(t===`__v_isReactive`)return!r;if(t===`__v_isReadonly`)return r;if(t===`__v_isShallow`)return i;if(t===`__v_raw`)return n===(r?i?At:kt:i?Ot:Dt).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(n)?e:void 0;let a=d(e);if(!r){let e;if(a&&(e=nt[t]))return e;if(t===`hasOwnProperty`)return dt}let o=Reflect.get(e,t,z(e)?e:n);if((_(t)?ut.has(t):lt(t))||(r||L(e,`get`,t),i))return o;if(z(o)){let e=a&&w(t)?o:o.value;return r&&v(e)?Pt(e):e}return v(o)?r?Pt(o):Mt(o):o}},pt=class extends ft{constructor(e=!1){super(!1,e)}set(e,t,n,r){let i=e[t],a=d(e)&&w(t);if(!this._isShallow){let e=Lt(i);if(!Rt(n)&&!Lt(n)&&(i=R(i),n=R(n)),!a&&z(i)&&!z(n))return e||(i.value=n),!0}let o=a?Number(t)<e.length:u(e,t),s=Reflect.set(e,t,n,z(e)?e:r);return e===R(r)&&s&&(o?te(n,i)&&Ze(e,`set`,t,n,i):Ze(e,`add`,t,n)),s}deleteProperty(e,t){let n=u(e,t),r=e[t],i=Reflect.deleteProperty(e,t);return i&&n&&Ze(e,`delete`,t,void 0,r),i}has(e,t){let n=Reflect.has(e,t);return(!_(t)||!ut.has(t))&&L(e,`has`,t),n}ownKeys(e){return L(e,`iterate`,d(e)?`length`:Je),Reflect.ownKeys(e)}},mt=class extends ft{constructor(e=!1){super(!0,e)}set(e,t){return!0}deleteProperty(e,t){return!0}},ht=new pt,gt=new mt,_t=new pt(!0),vt=e=>e,yt=e=>Reflect.getPrototypeOf(e);function bt(e,t,n){return function(...r){let i=this.__v_raw,a=R(i),o=f(a),c=e===`entries`||e===Symbol.iterator&&o,l=e===`keys`&&o,u=i[e](...r),d=n?vt:t?Ht:Vt;return!t&&L(a,`iterate`,l?Ye:Je),s(Object.create(u),{next(){let{value:e,done:t}=u.next();return t?{value:e,done:t}:{value:c?[d(e[0]),d(e[1])]:d(e),done:t}}})}}function xt(e){return function(...t){return e===`delete`?!1:e===`clear`?void 0:this}}function St(e,t){let n={get(n){let r=this.__v_raw,i=R(r),a=R(n);e||(te(n,a)&&L(i,`get`,n),L(i,`get`,a));let{has:o}=yt(i),s=t?vt:e?Ht:Vt;if(o.call(i,n))return s(r.get(n));if(o.call(i,a))return s(r.get(a));r!==i&&r.get(n)},get size(){let t=this.__v_raw;return!e&&L(R(t),`iterate`,Je),t.size},has(t){let n=this.__v_raw,r=R(n),i=R(t);return e||(te(t,i)&&L(r,`has`,t),L(r,`has`,i)),t===i?n.has(t):n.has(t)||n.has(i)},forEach(n,r){let i=this,a=i.__v_raw,o=R(a),s=t?vt:e?Ht:Vt;return!e&&L(o,`iterate`,Je),a.forEach((e,t)=>n.call(r,s(e),s(t),i))}};return s(n,e?{add:xt(`add`),set:xt(`set`),delete:xt(`delete`),clear:xt(`clear`)}:{add(e){let n=R(this),r=yt(n),i=R(e),a=!t&&!Rt(e)&&!Lt(e)?i:e;return r.has.call(n,a)||te(e,a)&&r.has.call(n,e)||te(i,a)&&r.has.call(n,i)||(n.add(a),Ze(n,`add`,a,a)),this},set(e,n){!t&&!Rt(n)&&!Lt(n)&&(n=R(n));let r=R(this),{has:i,get:a}=yt(r),o=i.call(r,e);o||=(e=R(e),i.call(r,e));let s=a.call(r,e);return r.set(e,n),o?te(n,s)&&Ze(r,`set`,e,n,s):Ze(r,`add`,e,n),this},delete(e){let t=R(this),{has:n,get:r}=yt(t),i=n.call(t,e);i||=(e=R(e),n.call(t,e));let a=r?r.call(t,e):void 0,o=t.delete(e);return i&&Ze(t,`delete`,e,void 0,a),o},clear(){let e=R(this),t=e.size!==0,n=e.clear();return t&&Ze(e,`clear`,void 0,void 0,void 0),n}}),[`keys`,`values`,`entries`,Symbol.iterator].forEach(r=>{n[r]=bt(r,e,t)}),n}function Ct(e,t){let n=St(e,t);return(t,r,i)=>r===`__v_isReactive`?!e:r===`__v_isReadonly`?e:r===`__v_raw`?t:Reflect.get(u(n,r)&&r in t?n:t,r,i)}var wt={get:Ct(!1,!1)},Tt={get:Ct(!1,!0)},Et={get:Ct(!0,!1)},Dt=new WeakMap,Ot=new WeakMap,kt=new WeakMap,At=new WeakMap;function jt(e){switch(e){case`Object`:case`Array`:return 1;case`Map`:case`Set`:case`WeakMap`:case`WeakSet`:return 2;default:return 0}}function Mt(e){return Lt(e)?e:Ft(e,!1,ht,wt,Dt)}function Nt(e){return Ft(e,!1,_t,Tt,Ot)}function Pt(e){return Ft(e,!0,gt,Et,kt)}function Ft(e,t,n,r,i){if(!v(e)||e.__v_raw&&!(t&&e.__v_isReactive)||e.__v_skip||!Object.isExtensible(e))return e;let a=i.get(e);if(a)return a;let o=jt(S(e));if(o===0)return e;let s=new Proxy(e,o===2?r:n);return i.set(e,s),s}function It(e){return Lt(e)?It(e.__v_raw):!!(e&&e.__v_isReactive)}function Lt(e){return!!(e&&e.__v_isReadonly)}function Rt(e){return!!(e&&e.__v_isShallow)}function zt(e){return e?!!e.__v_raw:!1}function R(e){let t=e&&e.__v_raw;return t?R(t):e}function Bt(e){return!u(e,`__v_skip`)&&Object.isExtensible(e)&&M(e,`__v_skip`,!0),e}var Vt=e=>v(e)?Mt(e):e,Ht=e=>v(e)?Pt(e):e;function z(e){return e?e.__v_isRef===!0:!1}function B(e){return Ut(e,!1)}function Ut(e,t){return z(e)?e:new Wt(e,t)}var Wt=class{constructor(e,t){this.dep=new Ge,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=t?e:R(e),this._value=t?e:Vt(e),this.__v_isShallow=t}get value(){return this.dep.track(),this._value}set value(e){let t=this._rawValue,n=this.__v_isShallow||Rt(e)||Lt(e);e=n?e:R(e),te(e,t)&&(this._rawValue=e,this._value=n?e:Vt(e),this.dep.trigger())}};function V(e){return z(e)?e.value:e}var Gt={get:(e,t,n)=>t===`__v_raw`?e:V(Reflect.get(e,t,n)),set:(e,t,n,r)=>{let i=e[t];return z(i)&&!z(n)?(i.value=n,!0):Reflect.set(e,t,n,r)}};function Kt(e){return It(e)?e:new Proxy(e,Gt)}function qt(e){let t=d(e)?Array(e.length):{};for(let n in e)t[n]=Zt(e,n);return t}var Jt=class{constructor(e,t,n){this._object=e,this._defaultValue=n,this.__v_isRef=!0,this._value=void 0,this._key=_(t)?t:String(t),this._raw=R(e);let r=!0,i=e;if(!d(e)||_(this._key)||!w(this._key))do r=!zt(i)||Rt(i);while(r&&(i=i.__v_raw));this._shallow=r}get value(){let e=this._object[this._key];return this._shallow&&(e=V(e)),this._value=e===void 0?this._defaultValue:e}set value(e){if(this._shallow&&z(this._raw[this._key])){let t=this._object[this._key];if(z(t)){t.value=e;return}}this._object[this._key]=e}get dep(){return Qe(this._raw,this._key)}},Yt=class{constructor(e){this._getter=e,this.__v_isRef=!0,this.__v_isReadonly=!0,this._value=void 0}get value(){return this._value=this._getter()}};function Xt(e,t,n){return z(e)?e:h(e)?new Yt(e):v(e)&&arguments.length>1?Zt(e,t,n):B(e)}function Zt(e,t,n){return new Jt(e,t,n)}var Qt=class{constructor(e,t,n){this.fn=e,this.setter=t,this._value=void 0,this.dep=new Ge(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Ue-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!t,this.isSSR=n}notify(){if(this.flags|=16,!(this.flags&8)&&I!==this)return ke(this,!0),!0}get value(){let e=this.dep.track();return Fe(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}};function $t(e,t,n=!1){let r,i;return h(e)?r=e:(r=e.get,i=e.set),new Qt(r,i,n)}var en={},tn=new WeakMap,nn=void 0;function rn(e,t=!1,n=nn){if(n){let t=tn.get(n);t||tn.set(n,t=[]),t.push(e)}}function an(e,n,i=t){let{immediate:a,deep:o,once:s,scheduler:l,augmentJob:u,call:f}=i,p=e=>o?e:Rt(e)||o===!1||o===0?on(e,1):on(e),m,g,_,v,y=!1,b=!1;if(z(e)?(g=()=>e.value,y=Rt(e)):It(e)?(g=()=>p(e),y=!0):d(e)?(b=!0,y=e.some(e=>It(e)||Rt(e)),g=()=>e.map(e=>{if(z(e))return e.value;if(It(e))return p(e);if(h(e))return f?f(e,2):e()})):g=h(e)?n?f?()=>f(e,2):e:()=>{if(_){Be();try{_()}finally{Ve()}}let t=nn;nn=m;try{return f?f(e,3,[v]):e(v)}finally{nn=t}}:r,n&&o){let e=g,t=o===!0?1/0:o;g=()=>on(e(),t)}let x=Se(),S=()=>{m.stop(),x&&x.active&&c(x.effects,m)};if(s&&n){let e=n;n=(...t)=>{let n=e(...t);return S(),n}}let C=b?Array(e.length).fill(en):en,w=e=>{if(!(!(m.flags&1)||!m.dirty&&!e))if(n){let t=m.run();if(e||o||y||(b?t.some((e,t)=>te(e,C[t])):te(t,C))){_&&_();let e=nn;nn=m;try{let e=[t,C===en?void 0:b&&C[0]===en?[]:C,v];C=t,f?f(n,3,e):n(...e)}finally{nn=e}}}else m.run()};return u&&u(w),m=new Te(g),m.scheduler=l?()=>l(w,!1):w,v=e=>rn(e,!1,m),_=m.onStop=()=>{let e=tn.get(m);if(e){if(f)f(e,4);else for(let t of e)t();tn.delete(m)}},n?a?w(!0):C=m.run():l?l(w.bind(null,!0),!0):m.run(),S.pause=m.pause.bind(m),S.resume=m.resume.bind(m),S.stop=S,S}function on(e,t=1/0,n){if(t<=0||!v(e)||e.__v_skip||(n||=new Map,(n.get(e)||0)>=t))return e;if(n.set(e,t),t--,z(e))on(e.value,t,n);else if(d(e))for(let r=0;r<e.length;r++)on(e[r],t,n);else if(p(e)||f(e))e.forEach(e=>{on(e,t,n)});else if(C(e)){for(let r in e)on(e[r],t,n);for(let r of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,r)&&on(e[r],t,n)}return e}function sn(e,t,n,r){try{return r?e(...r):e()}catch(e){ln(e,t,n)}}function cn(e,t,n,r){if(h(e)){let i=sn(e,t,n,r);return i&&y(i)&&i.catch(e=>{ln(e,t,n)}),i}if(d(e)){let i=[];for(let a=0;a<e.length;a++)i.push(cn(e[a],t,n,r));return i}}function ln(e,n,r,i=!0){let a=n?n.vnode:null,{errorHandler:o,throwUnhandledErrorInProduction:s}=n&&n.appContext.config||t;if(n){let t=n.parent,i=n.proxy,a=`https://vuejs.org/error-reference/#runtime-${r}`;for(;t;){let n=t.ec;if(n){for(let t=0;t<n.length;t++)if(n[t](e,i,a)===!1)return}t=t.parent}if(o){Be(),sn(o,null,10,[e,i,a]),Ve();return}}un(e,r,a,i,s)}function un(e,t,n,r=!0,i=!1){if(i)throw e;console.error(e)}var H=[],dn=-1,fn=[],pn=null,mn=0,hn=Promise.resolve(),gn=null;function _n(e){let t=gn||hn;return e?t.then(this?e.bind(this):e):t}function vn(e){let t=dn+1,n=H.length;for(;t<n;){let r=t+n>>>1,i=H[r],a=wn(i);a<e||a===e&&i.flags&2?t=r+1:n=r}return t}function yn(e){if(!(e.flags&1)){let t=wn(e),n=H[H.length-1];!n||!(e.flags&2)&&t>=wn(n)?H.push(e):H.splice(vn(t),0,e),e.flags|=1,bn()}}function bn(){gn||=hn.then(Tn)}function xn(e){d(e)?fn.push(...e):pn&&e.id===-1?pn.splice(mn+1,0,e):e.flags&1||(fn.push(e),e.flags|=1),bn()}function Sn(e,t,n=dn+1){for(;n<H.length;n++){let t=H[n];if(t&&t.flags&2){if(e&&t.id!==e.uid)continue;H.splice(n,1),n--,t.flags&4&&(t.flags&=-2),t(),t.flags&4||(t.flags&=-2)}}}function Cn(e){if(fn.length){let e=[...new Set(fn)].sort((e,t)=>wn(e)-wn(t));if(fn.length=0,pn){pn.push(...e);return}for(pn=e,mn=0;mn<pn.length;mn++){let e=pn[mn];e.flags&4&&(e.flags&=-2),e.flags&8||e(),e.flags&=-2}pn=null,mn=0}}var wn=e=>e.id==null?e.flags&2?-1:1/0:e.id;function Tn(e){try{for(dn=0;dn<H.length;dn++){let e=H[dn];e&&!(e.flags&8)&&(e.flags&4&&(e.flags&=-2),sn(e,e.i,e.i?15:14),e.flags&4||(e.flags&=-2))}}finally{for(;dn<H.length;dn++){let e=H[dn];e&&(e.flags&=-2)}dn=-1,H.length=0,Cn(e),gn=null,(H.length||fn.length)&&Tn(e)}}var En=null,Dn=null;function On(e){let t=En;return En=e,Dn=e&&e.type.__scopeId||null,t}function kn(e,t=En,n){if(!t||e._n)return e;let r=(...n)=>{r._d&&Xi(-1);let i=On(t),a=Ki.length,o;try{o=e(...n)}finally{for(let e=Ki.length;e>a;e--)Ji();On(i),r._d&&Xi(1)}return o};return r._n=!0,r._c=!0,r._d=!0,r}function An(e,n){if(En===null)return e;let r=Na(En),i=e.dirs||=[];for(let e=0;e<n.length;e++){let[a,o,s,c=t]=n[e];a&&(h(a)&&(a={mounted:a,updated:a}),a.deep&&on(o),i.push({dir:a,instance:r,value:o,oldValue:void 0,arg:s,modifiers:c}))}return e}function jn(e,t,n,r){let i=e.dirs,a=t&&t.dirs;for(let o=0;o<i.length;o++){let s=i[o];a&&(s.oldValue=a[o].value);let c=s.dir[r];c&&(Be(),cn(c,n,8,[e.el,s,e,t]),Ve())}}function Mn(e,t){if(_a){let n=_a.provides,r=_a.parent&&_a.parent.provides;r===n&&(n=_a.provides=Object.create(r)),n[e]=t}}function Nn(e,t,n=!1){let r=va();if(r||Qr){let i=Qr?Qr._context.provides:r?r.parent==null||r.ce?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(i&&e in i)return i[e];if(arguments.length>1)return n&&h(t)?t.call(r&&r.proxy):t}}function Pn(){return!!(va()||Qr)}var Fn=Symbol.for(`v-scx`),In=()=>Nn(Fn);function Ln(e,t,n){return Rn(e,t,n)}function Rn(e,n,i=t){let{immediate:a,deep:o,flush:c,once:l}=i,u=s({},i),d=n&&a||!n&&c!==`post`,f;if(wa){if(c===`sync`){let e=In();f=e.__watcherHandles||=[]}else if(!d){let e=()=>{};return e.stop=r,e.resume=r,e.pause=r,e}}let p=_a;u.call=(e,t,n)=>cn(e,p,t,n);let m=!1;c===`post`?u.scheduler=e=>{ki(e,p&&p.suspense)}:c!==`sync`&&(m=!0,u.scheduler=(e,t)=>{t?e():yn(e)}),u.augmentJob=e=>{n&&(e.flags|=4),m&&(e.flags|=2,p&&(e.id=p.uid,e.i=p))};let h=an(e,n,u);return wa&&(f?f.push(h):d&&h()),h}function zn(e,t,n){let r=this.proxy,i=g(e)?e.includes(`.`)?Bn(r,e):()=>r[e]:e.bind(r,r),a;h(t)?a=t:(a=t.handler,n=t);let o=xa(this),s=Rn(i,a.bind(r),n);return o(),s}function Bn(e,t){let n=t.split(`.`);return()=>{let t=e;for(let e=0;e<n.length&&t;e++)t=t[n[e]];return t}}var Vn=new WeakMap,Hn=Symbol(`_vte`),Un=e=>e.__isTeleport,Wn=e=>e&&(e.disabled||e.disabled===``),Gn=e=>e&&(e.defer||e.defer===``),Kn=e=>typeof SVGElement<`u`&&e instanceof SVGElement,qn=e=>typeof MathMLElement==`function`&&e instanceof MathMLElement,Jn=(e,t)=>{let n=e&&e.to;return g(n)?t?t(n):null:n},Yn={name:`Teleport`,__isTeleport:!0,process(e,t,n,r,i,a,o,s,c,l){let{mc:u,pc:d,pbc:f,o:{insert:p,querySelector:m,createText:h,createComment:g,parentNode:_}}=l,v=Wn(t.props),{dynamicChildren:y}=t,b=(e,t,n)=>{e.shapeFlag&16&&u(e.children,t,n,i,a,o,s,c)},x=(e=t)=>{let n=Wn(e.props),r=e.target=Jn(e.props,m),a=er(r,e,h,p);r&&(o!==`svg`&&Kn(r)?o=`svg`:o!==`mathml`&&qn(r)&&(o=`mathml`),i&&i.isCE&&(i.ce._teleportTargets||(i.ce._teleportTargets=new Set)).add(r),n||(b(e,r,a),$n(e,!1)))},S=e=>{let t=()=>{if(Vn.get(e)===t){if(Vn.delete(e),Wn(e.props)){let t=_(e.el)||n;b(e,t,e.anchor),$n(e,!0)}x(e)}};Vn.set(e,t),ki(t,a)};if(e==null){let e=t.el=h(``),i=t.anchor=h(``);if(p(e,n,r),p(i,n,r),Gn(t.props)||a&&a.pendingBranch){S(t);return}v&&(b(t,n,i),$n(t,!0)),x()}else{t.el=e.el;let r=t.anchor=e.anchor,u=Vn.get(e);if(u){u.flags|=8,Vn.delete(e),S(t);return}t.targetStart=e.targetStart;let p=t.target=e.target,h=t.targetAnchor=e.targetAnchor,g=Wn(e.props),_=g?n:p,b=g?r:h;if(o===`svg`||Kn(p)?o=`svg`:(o===`mathml`||qn(p))&&(o=`mathml`),y?(f(e.dynamicChildren,y,_,i,a,o,s),Fi(e,t,!0)):c||d(e,t,_,b,i,a,o,s,!1),v)g?t.props&&e.props&&t.props.to!==e.props.to&&(t.props.to=e.props.to):Xn(t,n,r,l,1);else if((t.props&&t.props.to)!==(e.props&&e.props.to)){let e=Jn(t.props,m);e&&(t.target=e,Xn(t,e,null,l,0))}else g&&Xn(t,p,h,l,1);$n(t,v)}},remove(e,t,n,{um:r,o:{remove:i}},a){let{shapeFlag:o,children:s,anchor:c,targetStart:l,targetAnchor:u,target:d,props:f}=e,p=Wn(f),m=a||!p,h=Vn.get(e);if(h&&(h.flags|=8,Vn.delete(e)),d&&(i(l),i(u)),a&&i(c),!h&&(p||d)&&o&16)for(let e=0;e<s.length;e++){let i=s[e];r(i,t,n,m,!!i.dynamicChildren)}},move:Xn,hydrate:Zn};function Xn(e,t,n,{o:{insert:r},m:i},a=2){a===0&&r(e.targetAnchor,t,n);let{el:o,anchor:s,shapeFlag:c,children:l,props:u}=e,d=a===2;if(d&&r(o,t,n),!Vn.has(e)&&(!d||Wn(u))&&c&16)for(let e=0;e<l.length;e++)i(l[e],t,n,2);d&&r(s,t,n)}function Zn(e,t,n,r,i,a,{o:{nextSibling:o,parentNode:s,querySelector:c,insert:l,createText:u}},d){function f(e,n){let r=n;for(;r;){if(r&&r.nodeType===8){if(r.data===`teleport start anchor`)t.targetStart=r;else if(r.data===`teleport anchor`){t.targetAnchor=r,e._lpa=t.targetAnchor&&o(t.targetAnchor);break}}r=o(r)}}function p(e,t){t.anchor=d(o(e),t,s(e),n,r,i,a)}let m=t.target=Jn(t.props,c),h=Wn(t.props);if(m){let c=m._lpa||m.firstChild;t.shapeFlag&16&&(h?(p(e,t),f(m,c),t.targetAnchor||er(m,t,u,l,s(e)===m?e:null)):(t.anchor=o(e),f(m,c),t.targetAnchor||er(m,t,u,l),d(c&&o(c),t,m,n,r,i,a))),$n(t,h)}else h&&t.shapeFlag&16&&(p(e,t),t.targetStart=e,t.targetAnchor=o(e));return t.anchor&&o(t.anchor)}var Qn=Yn;function $n(e,t){let n=e.ctx;if(n&&n.ut){let r,i;for(t?(r=e.el,i=e.anchor):(r=e.targetStart,i=e.targetAnchor);r&&r!==i;)r.nodeType===1&&r.setAttribute(`data-v-owner`,n.uid),r=r.nextSibling;n.ut()}}function er(e,t,n,r,i=null){let a=t.targetStart=n(``),o=t.targetAnchor=n(``);return a[Hn]=o,e&&(r(a,e,i),r(o,e,i)),o}var tr=Symbol(`_leaveCb`);function nr(e,t){e.shapeFlag&6&&e.component?(e.transition=t,nr(e.component.subTree,t)):e.shapeFlag&128?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t}function rr(e,t){return h(e)?s({name:e.name},t,{setup:e}):e}function ir(e){e.ids=[e.ids[0]+e.ids[2]+++`-`,0,0]}function ar(e,t){let n;return!!((n=Object.getOwnPropertyDescriptor(e,t))&&!n.configurable)}var or=new WeakMap;function sr(e,n,r,a,o=!1){if(d(e)){e.forEach((e,t)=>sr(e,n&&(d(n)?n[t]:n),r,a,o));return}if(lr(a)&&!o){a.shapeFlag&512&&a.type.__asyncResolved&&a.component.subTree.component&&sr(e,n,r,a.component.subTree);return}let s=a.shapeFlag&4?Na(a.component):a.el,l=o?null:s,{i:f,r:p}=e,m=n&&n.r,_=f.refs===t?f.refs={}:f.refs,v=f.setupState,y=R(v),b=v===t?i:e=>!ar(_,e)&&u(y,e),x=(e,t)=>!(t&&ar(_,t));if(m!=null&&m!==p){if(cr(n),g(m))_[m]=null,b(m)&&(v[m]=null);else if(z(m)){let e=n;x(m,e.k)&&(m.value=null),e.k&&(_[e.k]=null)}}if(h(p))sn(p,f,12,[l,_]);else{let t=g(p),n=z(p);if(t||n){let i=()=>{if(e.f){let n=t?b(p)?v[p]:_[p]:x(p)||!e.k?p.value:_[e.k];if(o)d(n)&&c(n,s);else if(d(n))n.includes(s)||n.push(s);else if(t)_[p]=[s],b(p)&&(v[p]=_[p]);else{let t=[s];x(p,e.k)&&(p.value=t),e.k&&(_[e.k]=t)}}else t?(_[p]=l,b(p)&&(v[p]=l)):n&&(x(p,e.k)&&(p.value=l),e.k&&(_[e.k]=l))};if(l){let t=()=>{i(),or.delete(e)};t.id=-1,or.set(e,t),ki(t,r)}else cr(e),i()}}}function cr(e){let t=or.get(e);t&&(t.flags|=8,or.delete(e))}ae().requestIdleCallback,ae().cancelIdleCallback;var lr=e=>!!e.type.__asyncLoader,ur=e=>e.type.__isKeepAlive;function dr(e,t){pr(e,`a`,t)}function fr(e,t){pr(e,`da`,t)}function pr(e,t,n=_a){let r=e.__wdc||=()=>{let t=n;for(;t;){if(t.isDeactivated)return;t=t.parent}return e()};if(hr(t,r,n),n){let e=n.parent;for(;e&&e.parent;)ur(e.parent.vnode)&&mr(r,t,n,e),e=e.parent}}function mr(e,t,n,r){let i=hr(t,e,r,!0);Sr(()=>{c(r[t],i)},n)}function hr(e,t,n=_a,r=!1){if(n){let i=n[e]||(n[e]=[]),a=t.__weh||=(...r)=>{Be();let i=xa(n),a=cn(t,n,e,r);return i(),Ve(),a};return r?i.unshift(a):i.push(a),a}}var gr=e=>(t,n=_a)=>{(!wa||e===`sp`)&&hr(e,(...e)=>t(...e),n)},_r=gr(`bm`),vr=gr(`m`),yr=gr(`bu`),br=gr(`u`),xr=gr(`bum`),Sr=gr(`um`),Cr=gr(`sp`),wr=gr(`rtg`),Tr=gr(`rtc`);function Er(e,t=_a){hr(`ec`,e,t)}var Dr=Symbol.for(`v-ndc`);function Or(e,t,n,r){let i,a=n&&n[r],o=d(e);if(o||g(e)){let n=o&&It(e),r=!1,s=!1;n&&(r=!Rt(e),s=Lt(e),e=et(e)),i=Array(e.length);for(let n=0,o=e.length;n<o;n++)i[n]=t(r?s?Ht(Vt(e[n])):Vt(e[n]):e[n],n,void 0,a&&a[n])}else if(typeof e==`number`){i=Array(e);for(let n=0;n<e;n++)i[n]=t(n+1,n,void 0,a&&a[n])}else if(v(e))if(e[Symbol.iterator])i=Array.from(e,(e,n)=>t(e,n,void 0,a&&a[n]));else{let n=Object.keys(e);i=Array(n.length);for(let r=0,o=n.length;r<o;r++){let o=n[r];i[r]=t(e[o],o,r,a&&a[r])}}else i=[];return n&&(n[r]=i),i}var kr=e=>e?Ca(e)?Na(e):kr(e.parent):null,Ar=s(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>kr(e.parent),$root:e=>kr(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>zr(e),$forceUpdate:e=>e.f||=()=>{yn(e.update)},$nextTick:e=>e.n||=_n.bind(e.proxy),$watch:e=>zn.bind(e)}),jr=(e,n)=>e!==t&&!e.__isScriptSetup&&u(e,n),Mr={get({_:e},n){if(n===`__v_skip`)return!0;let{ctx:r,setupState:i,data:a,props:o,accessCache:s,type:c,appContext:l}=e;if(n[0]!==`$`){let e=s[n];if(e!==void 0)switch(e){case 1:return i[n];case 2:return a[n];case 4:return r[n];case 3:return o[n]}else if(jr(i,n))return s[n]=1,i[n];else if(a!==t&&u(a,n))return s[n]=2,a[n];else if(u(o,n))return s[n]=3,o[n];else if(r!==t&&u(r,n))return s[n]=4,r[n];else Pr&&(s[n]=0)}let d=Ar[n],f,p;if(d)return n===`$attrs`&&L(e.attrs,`get`,``),d(e);if((f=c.__cssModules)&&(f=f[n]))return f;if(r!==t&&u(r,n))return s[n]=4,r[n];if(p=l.config.globalProperties,u(p,n))return p[n]},set({_:e},n,r){let{data:i,setupState:a,ctx:o}=e;return jr(a,n)?(a[n]=r,!0):i!==t&&u(i,n)?(i[n]=r,!0):u(e.props,n)||n[0]===`$`&&n.slice(1)in e?!1:(o[n]=r,!0)},has({_:{data:e,setupState:n,accessCache:r,ctx:i,appContext:a,props:o,type:s}},c){let l;return!!(r[c]||e!==t&&c[0]!==`$`&&u(e,c)||jr(n,c)||u(o,c)||u(i,c)||u(Ar,c)||u(a.config.globalProperties,c)||(l=s.__cssModules)&&l[c])},defineProperty(e,t,n){return n.get==null?u(n,`value`)&&this.set(e,t,n.value,null):e._.accessCache[t]=0,Reflect.defineProperty(e,t,n)}};function Nr(e){return d(e)?e.reduce((e,t)=>(e[t]=null,e),{}):e}var Pr=!0;function Fr(e){let t=zr(e),n=e.proxy,i=e.ctx;Pr=!1,t.beforeCreate&&Lr(t.beforeCreate,e,`bc`);let{data:a,computed:o,methods:s,watch:c,provide:l,inject:u,created:f,beforeMount:p,mounted:m,beforeUpdate:g,updated:_,activated:y,deactivated:b,beforeDestroy:x,beforeUnmount:S,destroyed:C,unmounted:w,render:T,renderTracked:ee,renderTriggered:E,errorCaptured:D,serverPrefetch:O,expose:k,inheritAttrs:A,components:j,directives:te,filters:ne}=t;if(u&&Ir(u,i,null),s)for(let e in s){let t=s[e];h(t)&&(i[e]=t.bind(n))}if(a){let t=a.call(n,n);v(t)&&(e.data=Mt(t))}if(Pr=!0,o)for(let e in o){let t=o[e],a=Fa({get:h(t)?t.bind(n,n):h(t.get)?t.get.bind(n,n):r,set:!h(t)&&h(t.set)?t.set.bind(n):r});Object.defineProperty(i,e,{enumerable:!0,configurable:!0,get:()=>a.value,set:e=>a.value=e})}if(c)for(let e in c)Rr(c[e],i,n,e);if(l){let e=h(l)?l.call(n):l;Reflect.ownKeys(e).forEach(t=>{Mn(t,e[t])})}f&&Lr(f,e,`c`);function M(e,t){d(t)?t.forEach(t=>e(t.bind(n))):t&&e(t.bind(n))}if(M(_r,p),M(vr,m),M(yr,g),M(br,_),M(dr,y),M(fr,b),M(Er,D),M(Tr,ee),M(wr,E),M(xr,S),M(Sr,w),M(Cr,O),d(k))if(k.length){let t=e.exposed||={};k.forEach(e=>{Object.defineProperty(t,e,{get:()=>n[e],set:t=>n[e]=t,enumerable:!0})})}else e.exposed||={};T&&e.render===r&&(e.render=T),A!=null&&(e.inheritAttrs=A),j&&(e.components=j),te&&(e.directives=te),O&&ir(e)}function Ir(e,t,n=r){d(e)&&(e=Wr(e));for(let n in e){let r=e[n],i;i=v(r)?`default`in r?Nn(r.from||n,r.default,!0):Nn(r.from||n):Nn(r),z(i)?Object.defineProperty(t,n,{enumerable:!0,configurable:!0,get:()=>i.value,set:e=>i.value=e}):t[n]=i}}function Lr(e,t,n){cn(d(e)?e.map(e=>e.bind(t.proxy)):e.bind(t.proxy),t,n)}function Rr(e,t,n,r){let i=r.includes(`.`)?Bn(n,r):()=>n[r];if(g(e)){let n=t[e];h(n)&&Ln(i,n)}else if(h(e))Ln(i,e.bind(n));else if(v(e))if(d(e))e.forEach(e=>Rr(e,t,n,r));else{let r=h(e.handler)?e.handler.bind(n):t[e.handler];h(r)&&Ln(i,r,e)}}function zr(e){let t=e.type,{mixins:n,extends:r}=t,{mixins:i,optionsCache:a,config:{optionMergeStrategies:o}}=e.appContext,s=a.get(t),c;return s?c=s:!i.length&&!n&&!r?c=t:(c={},i.length&&i.forEach(e=>Br(c,e,o,!0)),Br(c,t,o)),v(t)&&a.set(t,c),c}function Br(e,t,n,r=!1){let{mixins:i,extends:a}=t;a&&Br(e,a,n,!0),i&&i.forEach(t=>Br(e,t,n,!0));for(let i in t)if(!(r&&i===`expose`)){let r=Vr[i]||n&&n[i];e[i]=r?r(e[i],t[i]):t[i]}return e}var Vr={data:Hr,props:qr,emits:qr,methods:Kr,computed:Kr,beforeCreate:Gr,created:Gr,beforeMount:Gr,mounted:Gr,beforeUpdate:Gr,updated:Gr,beforeDestroy:Gr,beforeUnmount:Gr,destroyed:Gr,unmounted:Gr,activated:Gr,deactivated:Gr,errorCaptured:Gr,serverPrefetch:Gr,components:Kr,directives:Kr,watch:Jr,provide:Hr,inject:Ur};function Hr(e,t){return t?e?function(){return s(h(e)?e.call(this,this):e,h(t)?t.call(this,this):t)}:t:e}function Ur(e,t){return Kr(Wr(e),Wr(t))}function Wr(e){if(d(e)){let t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function Gr(e,t){return e?[...new Set([].concat(e,t))]:t}function Kr(e,t){return e?s(Object.create(null),e,t):t}function qr(e,t){return e?d(e)&&d(t)?[...new Set([...e,...t])]:s(Object.create(null),Nr(e),Nr(t??{})):t}function Jr(e,t){if(!e)return t;if(!t)return e;let n=s(Object.create(null),e);for(let r in t)n[r]=Gr(e[r],t[r]);return n}function Yr(){return{app:null,config:{isNativeTag:i,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}var Xr=0;function Zr(e,t){return function(n,r=null){h(n)||(n=s({},n)),r!=null&&!v(r)&&(r=null);let i=Yr(),a=new WeakSet,o=[],c=!1,l=i.app={_uid:Xr++,_component:n,_props:r,_container:null,_context:i,_instance:null,version:Ia,get config(){return i.config},set config(e){},use(e,...t){return a.has(e)||(e&&h(e.install)?(a.add(e),e.install(l,...t)):h(e)&&(a.add(e),e(l,...t))),l},mixin(e){return i.mixins.includes(e)||i.mixins.push(e),l},component(e,t){return t?(i.components[e]=t,l):i.components[e]},directive(e,t){return t?(i.directives[e]=t,l):i.directives[e]},mount(a,o,s){if(!c){let u=l._ceVNode||ra(n,r);return u.appContext=i,s===!0?s=`svg`:s===!1&&(s=void 0),o&&t?t(u,a):e(u,a,s),c=!0,l._container=a,a.__vue_app__=l,Na(u.component)}},onUnmount(e){o.push(e)},unmount(){c&&(cn(o,l._instance,16),e(null,l._container),delete l._container.__vue_app__)},provide(e,t){return i.provides[e]=t,l},runWithContext(e){let t=Qr;Qr=l;try{return e()}finally{Qr=t}}};return l}}var Qr=null,$r=(e,t)=>t===`modelValue`||t===`model-value`?e.modelModifiers:e[`${t}Modifiers`]||e[`${D(t)}Modifiers`]||e[`${k(t)}Modifiers`];function ei(e,n,...r){if(e.isUnmounted)return;let i=e.vnode.props||t,a=r,o=n.startsWith(`update:`),s=o&&$r(i,n.slice(7));s&&(s.trim&&(a=r.map(e=>g(e)?e.trim():e)),s.number&&(a=r.map(re)));let c,l=i[c=j(n)]||i[c=j(D(n))];!l&&o&&(l=i[c=j(k(n))]),l&&cn(l,e,6,a);let u=i[c+`Once`];if(u){if(!e.emitted)e.emitted={};else if(e.emitted[c])return;e.emitted[c]=!0,cn(u,e,6,a)}}var ti=new WeakMap;function ni(e,t,n=!1){let r=n?ti:t.emitsCache,i=r.get(e);if(i!==void 0)return i;let a=e.emits,o={},c=!1;if(!h(e)){let r=e=>{let n=ni(e,t,!0);n&&(c=!0,s(o,n))};!n&&t.mixins.length&&t.mixins.forEach(r),e.extends&&r(e.extends),e.mixins&&e.mixins.forEach(r)}return!a&&!c?(v(e)&&r.set(e,null),null):(d(a)?a.forEach(e=>o[e]=null):s(o,a),v(e)&&r.set(e,o),o)}function ri(e,t){return!e||!a(t)?!1:(t=t.slice(2),t=t===`Once`?t:t.replace(/Once$/,``),u(e,t[0].toLowerCase()+t.slice(1))||u(e,k(t))||u(e,t))}function ii(e){let{type:t,vnode:n,proxy:r,withProxy:i,propsOptions:[a],slots:s,attrs:c,emit:l,render:u,renderCache:d,props:f,data:p,setupState:m,ctx:h,inheritAttrs:g}=e,_=On(e),v,y;try{if(n.shapeFlag&4){let e=i||r,t=e;v=la(u.call(t,e,d,f,m,p,h)),y=c}else{let e=t;v=la(e.length>1?e(f,{attrs:c,slots:s,emit:l}):e(f,null)),y=t.props?c:ai(c)}}catch(t){Ki.length=0,ln(t,e,1),v=ra(Wi)}let b=v;if(y&&g!==!1){let e=Object.keys(y),{shapeFlag:t}=b;e.length&&t&7&&(a&&e.some(o)&&(y=oi(y,a)),b=oa(b,y,!1,!0))}return n.dirs&&(b=oa(b,null,!1,!0),b.dirs=b.dirs?b.dirs.concat(n.dirs):n.dirs),n.transition&&nr(b,n.transition),v=b,On(_),v}var ai=e=>{let t;for(let n in e)(n===`class`||n===`style`||a(n))&&((t||={})[n]=e[n]);return t},oi=(e,t)=>{let n={};for(let r in e)(!o(r)||!(r.slice(9)in t))&&(n[r]=e[r]);return n};function si(e,t,n){let{props:r,children:i,component:a}=e,{props:o,children:s,patchFlag:c}=t,l=a.emitsOptions;if(t.dirs||t.transition)return!0;if(n&&c>=0){if(c&1024)return!0;if(c&16)return r?ci(r,o,l):!!o;if(c&8){let e=t.dynamicProps;for(let t=0;t<e.length;t++){let n=e[t];if(li(o,r,n)&&!ri(l,n))return!0}}}else return(i||s)&&(!s||!s.$stable)?!0:r===o?!1:r?!o||ci(r,o,l):!!o;return!1}function ci(e,t,n){let r=Object.keys(t);if(r.length!==Object.keys(e).length)return!0;for(let i=0;i<r.length;i++){let a=r[i];if(li(t,e,a)&&!ri(n,a))return!0}return!1}function li(e,t,n){let r=e[n],i=t[n];return n===`style`&&v(r)&&v(i)?!he(r,i):r!==i}function ui({vnode:e,parent:t,suspense:n},r){for(;t;){let n=t.subTree;if(n.suspense&&n.suspense.activeBranch===e&&(n.suspense.vnode.el=n.el=r,e=n),n===e)(e=t.vnode).el=r,t=t.parent;else break}n&&n.activeBranch===e&&(n.vnode.el=r)}var di={},fi=()=>Object.create(di),pi=e=>Object.getPrototypeOf(e)===di;function mi(e,t,n,r=!1){let i={},a=fi();e.propsDefaults=Object.create(null),gi(e,t,i,a);for(let t in e.propsOptions[0])t in i||(i[t]=void 0);n?e.props=r?i:Nt(i):e.type.props?e.props=i:e.props=a,e.attrs=a}function hi(e,t,n,r){let{props:i,attrs:a,vnode:{patchFlag:o}}=e,s=R(i),[c]=e.propsOptions,l=!1;if((r||o>0)&&!(o&16)){if(o&8){let n=e.vnode.dynamicProps;for(let r=0;r<n.length;r++){let o=n[r];if(ri(e.emitsOptions,o))continue;let d=t[o];if(c)if(u(a,o))d!==a[o]&&(a[o]=d,l=!0);else{let t=D(o);i[t]=_i(c,s,t,d,e,!1)}else d!==a[o]&&(a[o]=d,l=!0)}}}else{gi(e,t,i,a)&&(l=!0);let r;for(let a in s)(!t||!u(t,a)&&((r=k(a))===a||!u(t,r)))&&(c?n&&(n[a]!==void 0||n[r]!==void 0)&&(i[a]=_i(c,s,a,void 0,e,!0)):delete i[a]);if(a!==s)for(let e in a)(!t||!u(t,e))&&(delete a[e],l=!0)}l&&Ze(e.attrs,`set`,``)}function gi(e,n,r,i){let[a,o]=e.propsOptions,s=!1,c;if(n)for(let t in n){if(T(t))continue;let l=n[t],d;a&&u(a,d=D(t))?!o||!o.includes(d)?r[d]=l:(c||={})[d]=l:ri(e.emitsOptions,t)||(!(t in i)||l!==i[t])&&(i[t]=l,s=!0)}if(o){let n=R(r),i=c||t;for(let t=0;t<o.length;t++){let s=o[t];r[s]=_i(a,n,s,i[s],e,!u(i,s))}}return s}function _i(e,t,n,r,i,a){let o=e[n];if(o!=null){let e=u(o,`default`);if(e&&r===void 0){let e=o.default;if(o.type!==Function&&!o.skipFactory&&h(e)){let{propsDefaults:a}=i;if(n in a)r=a[n];else{let o=xa(i);r=a[n]=e.call(null,t),o()}}else r=e;i.ce&&i.ce._setProp(n,r)}o[0]&&(a&&!e?r=!1:o[1]&&(r===``||r===k(n))&&(r=!0))}return r}var vi=new WeakMap;function yi(e,r,i=!1){let a=i?vi:r.propsCache,o=a.get(e);if(o)return o;let c=e.props,l={},f=[],p=!1;if(!h(e)){let t=e=>{p=!0;let[t,n]=yi(e,r,!0);s(l,t),n&&f.push(...n)};!i&&r.mixins.length&&r.mixins.forEach(t),e.extends&&t(e.extends),e.mixins&&e.mixins.forEach(t)}if(!c&&!p)return v(e)&&a.set(e,n),n;if(d(c))for(let e=0;e<c.length;e++){let n=D(c[e]);bi(n)&&(l[n]=t)}else if(c)for(let e in c){let t=D(e);if(bi(t)){let n=c[e],r=l[t]=d(n)||h(n)?{type:n}:s({},n),i=r.type,a=!1,o=!0;if(d(i))for(let e=0;e<i.length;++e){let t=i[e],n=h(t)&&t.name;if(n===`Boolean`){a=!0;break}else n===`String`&&(o=!1)}else a=h(i)&&i.name===`Boolean`;r[0]=a,r[1]=o,(a||u(r,`default`))&&f.push(t)}}let m=[l,f];return v(e)&&a.set(e,m),m}function bi(e){return e[0]!==`$`&&!T(e)}var xi=e=>e===`_`||e===`_ctx`||e===`$stable`,Si=e=>d(e)?e.map(la):[la(e)],Ci=(e,t,n)=>{if(t._n)return t;let r=kn((...e)=>Si(t(...e)),n);return r._c=!1,r},wi=(e,t,n)=>{let r=e._ctx;for(let n in e){if(xi(n))continue;let i=e[n];if(h(i))t[n]=Ci(n,i,r);else if(i!=null){let e=Si(i);t[n]=()=>e}}},Ti=(e,t)=>{let n=Si(t);e.slots.default=()=>n},Ei=(e,t,n)=>{for(let r in t)(n||!xi(r))&&(e[r]=t[r])},Di=(e,t,n)=>{let r=e.slots=fi();if(e.vnode.shapeFlag&32){let e=t._;e?(Ei(r,t,n),n&&M(r,`_`,e,!0)):wi(t,r)}else t&&Ti(e,t)},Oi=(e,n,r)=>{let{vnode:i,slots:a}=e,o=!0,s=t;if(i.shapeFlag&32){let e=n._;e?r&&e===1?o=!1:Ei(a,n,r):(o=!n.$stable,wi(n,a)),s=n}else n&&(Ti(e,n),s={default:1});if(o)for(let e in a)!xi(e)&&s[e]==null&&delete a[e]},ki=Vi;function Ai(e){return ji(e)}function ji(e,i){let a=ae();a.__VUE__=!0;let{insert:o,remove:s,patchProp:c,createElement:l,createText:u,createComment:d,setText:f,setElementText:p,parentNode:m,nextSibling:h,setScopeId:g=r,insertStaticContent:_}=e,v=(e,t,n,r=null,i=null,a=null,o=void 0,s=null,c=!!t.dynamicChildren)=>{if(e===t)return;e&&!ea(e,t)&&(r=he(e),N(e,i,a,!0),e=null),t.patchFlag===-2&&(c=!1,t.dynamicChildren=null);let{type:l,ref:u,shapeFlag:d}=t;switch(l){case Ui:y(e,t,n,r);break;case Wi:b(e,t,n,r);break;case Gi:e??x(t,n,r,o);break;case Hi:j(e,t,n,r,i,a,o,s,c);break;default:d&1?w(e,t,n,r,i,a,o,s,c):d&6?te(e,t,n,r,i,a,o,s,c):(d&64||d&128)&&l.process(e,t,n,r,i,a,o,s,c,P)}u!=null&&i?sr(u,e&&e.ref,a,t||e,!t):u==null&&e&&e.ref!=null&&sr(e.ref,null,a,e,!0)},y=(e,t,n,r)=>{if(e==null)o(t.el=u(t.children),n,r);else{let n=t.el=e.el;t.children!==e.children&&f(n,t.children)}},b=(e,t,n,r)=>{e==null?o(t.el=d(t.children||``),n,r):t.el=e.el},x=(e,t,n,r)=>{[e.el,e.anchor]=_(e.children,t,n,r,e.el,e.anchor)},S=({el:e,anchor:t},n,r)=>{let i;for(;e&&e!==t;)i=h(e),o(e,n,r),e=i;o(t,n,r)},C=({el:e,anchor:t})=>{let n;for(;e&&e!==t;)n=h(e),s(e),e=n;s(t)},w=(e,t,n,r,i,a,o,s,c)=>{if(t.type===`svg`?o=`svg`:t.type===`math`&&(o=`mathml`),e==null)ee(t,n,r,i,a,o,s,c);else{let n=e.el&&e.el._isVueCE?e.el:null;try{n&&n._beginPatch(),O(e,t,i,a,o,s,c)}finally{n&&n._endPatch()}}},ee=(e,t,n,r,i,a,s,u)=>{let d,f,{props:m,shapeFlag:h,transition:g,dirs:_}=e;if(d=e.el=l(e.type,a,m&&m.is,m),h&8?p(d,e.children):h&16&&D(e.children,d,null,r,i,Mi(e,a),s,u),_&&jn(e,null,r,`created`),E(d,e,e.scopeId,s,r),m){for(let e in m)e!==`value`&&!T(e)&&c(d,e,null,m[e],a,r);`value`in m&&c(d,`value`,null,m.value,a),(f=m.onVnodeBeforeMount)&&pa(f,r,e)}_&&jn(e,null,r,`beforeMount`);let v=Pi(i,g);v&&g.beforeEnter(d),o(d,t,n),((f=m&&m.onVnodeMounted)||v||_)&&ki(()=>{try{f&&pa(f,r,e),v&&g.enter(d),_&&jn(e,null,r,`mounted`)}finally{}},i)},E=(e,t,n,r,i)=>{if(n&&g(e,n),r)for(let t=0;t<r.length;t++)g(e,r[t]);if(i){let n=i.subTree;if(t===n||Bi(n.type)&&(n.ssContent===t||n.ssFallback===t)){let t=i.vnode;E(e,t,t.scopeId,t.slotScopeIds,i.parent)}}},D=(e,t,n,r,i,a,o,s,c=0)=>{for(let l=c;l<e.length;l++){let c=e[l]=s?ua(e[l]):la(e[l]);v(null,c,t,n,r,i,a,o,s)}},O=(e,n,r,i,a,o,s)=>{let l=n.el=e.el,{patchFlag:u,dynamicChildren:d,dirs:f}=n;u|=e.patchFlag&16;let m=e.props||t,h=n.props||t,g;if(r&&Ni(r,!1),(g=h.onVnodeBeforeUpdate)&&pa(g,r,n,e),f&&jn(n,e,r,`beforeUpdate`),r&&Ni(r,!0),d&&(!e.dynamicChildren||e.dynamicChildren.length!==d.length)&&(u=0,s=!1,d=null),(m.innerHTML&&h.innerHTML==null||m.textContent&&h.textContent==null)&&p(l,``),d?k(e.dynamicChildren,d,l,r,i,Mi(n,a),o):s||se(e,n,l,null,r,i,Mi(n,a),o,!1),u>0){if(u&16)A(l,m,h,r,a);else if(u&2&&m.class!==h.class&&c(l,`class`,null,h.class,a),u&4&&c(l,`style`,m.style,h.style,a),u&8){let e=n.dynamicProps;for(let t=0;t<e.length;t++){let n=e[t],i=m[n],o=h[n];(o!==i||n===`value`)&&c(l,n,i,o,a,r)}}u&1&&e.children!==n.children&&p(l,n.children)}else!s&&d==null&&A(l,m,h,r,a);((g=h.onVnodeUpdated)||f)&&ki(()=>{g&&pa(g,r,n,e),f&&jn(n,e,r,`updated`)},i)},k=(e,t,n,r,i,a,o)=>{for(let s=0;s<t.length;s++){let c=e[s],l=t[s],u=c.el&&(c.type===Hi||!ea(c,l)||c.shapeFlag&198)?m(c.el):n;v(c,l,u,null,r,i,a,o,!0)}},A=(e,n,r,i,a)=>{if(n!==r){if(n!==t)for(let t in n)!T(t)&&!(t in r)&&c(e,t,n[t],null,a,i);for(let t in r){if(T(t))continue;let o=r[t],s=n[t];o!==s&&t!==`value`&&c(e,t,s,o,a,i)}`value`in r&&c(e,`value`,n.value,r.value,a)}},j=(e,t,n,r,i,a,s,c,l)=>{let d=t.el=e?e.el:u(``),f=t.anchor=e?e.anchor:u(``),{patchFlag:p,dynamicChildren:m,slotScopeIds:h}=t;h&&(c=c?c.concat(h):h),e==null?(o(d,n,r),o(f,n,r),D(t.children||[],n,f,i,a,s,c,l)):p>0&&p&64&&m&&e.dynamicChildren&&e.dynamicChildren.length===m.length?(k(e.dynamicChildren,m,n,i,a,s,c),(t.key!=null||i&&t===i.subTree)&&Fi(e,t,!0)):se(e,t,n,f,i,a,s,c,l)},te=(e,t,n,r,i,a,o,s,c)=>{t.slotScopeIds=s,e==null?t.shapeFlag&512?i.ctx.activate(t,n,r,o,c):M(t,n,r,i,a,o,c):re(e,t,c)},M=(e,t,n,r,i,a,o)=>{let s=e.component=ga(e,r,i);if(ur(e)&&(s.ctx.renderer=P),Ta(s,!1,o),s.asyncDep){if(i&&i.registerDep(s,ie,o),!e.el){let r=s.subTree=ra(Wi);b(null,r,t,n),e.placeholder=r.el}}else ie(s,e,t,n,i,a,o)},re=(e,t,n)=>{let r=t.component=e.component;if(si(e,t,n))if(r.asyncDep&&!r.asyncResolved){oe(r,t,n);return}else r.next=t,r.update();else t.el=e.el,r.vnode=t},ie=(e,t,n,r,i,a,o)=>{let s=()=>{if(e.isMounted){let{next:t,bu:n,u:r,parent:s,vnode:c}=e;{let n=Li(e);if(n){t&&(t.el=c.el,oe(e,t,o)),n.asyncDep.then(()=>{ki(()=>{e.isUnmounted||l()},i)});return}}let u=t,d;Ni(e,!1),t?(t.el=c.el,oe(e,t,o)):t=c,n&&ne(n),(d=t.props&&t.props.onVnodeBeforeUpdate)&&pa(d,s,t,c),Ni(e,!0);let f=ii(e),p=e.subTree;e.subTree=f,v(p,f,m(p.el),he(p),e,i,a),t.el=f.el,u===null&&ui(e,f.el),r&&ki(r,i),(d=t.props&&t.props.onVnodeUpdated)&&ki(()=>pa(d,s,t,c),i)}else{let o,{el:s,props:c}=t,{bm:l,m:u,parent:d,root:f,type:p}=e,m=lr(t);if(Ni(e,!1),l&&ne(l),!m&&(o=c&&c.onVnodeBeforeMount)&&pa(o,d,t),Ni(e,!0),s&&ye){let t=()=>{e.subTree=ii(e),ye(s,e.subTree,e,i,null)};m&&p.__asyncHydrate?p.__asyncHydrate(s,e,t):t()}else{f.ce&&f.ce._hasShadowRoot()&&f.ce._injectChildStyle(p,e.parent?e.parent.type:void 0);let o=e.subTree=ii(e);v(null,o,n,r,e,i,a),t.el=o.el}if(u&&ki(u,i),!m&&(o=c&&c.onVnodeMounted)){let e=t;ki(()=>pa(o,d,e),i)}(t.shapeFlag&256||d&&lr(d.vnode)&&d.vnode.shapeFlag&256)&&e.a&&ki(e.a,i),e.isMounted=!0,t=n=r=null}};e.scope.on();let c=e.effect=new Te(s);e.scope.off();let l=e.update=c.run.bind(c),u=e.job=c.runIfDirty.bind(c);u.i=e,u.id=e.uid,c.scheduler=()=>yn(u),Ni(e,!0),l()},oe=(e,t,n)=>{t.component=e;let r=e.vnode.props;e.vnode=t,e.next=null,hi(e,t.props,r,n),Oi(e,t.children,n),Be(),Sn(e),Ve()},se=(e,t,n,r,i,a,o,s,c=!1)=>{let l=e&&e.children,u=e?e.shapeFlag:0,d=t.children,{patchFlag:f,shapeFlag:m}=t;if(f>0){if(f&128){le(l,d,n,r,i,a,o,s,c);return}else if(f&256){ce(l,d,n,r,i,a,o,s,c);return}}m&8?(u&16&&me(l,i,a),d!==l&&p(n,d)):u&16?m&16?le(l,d,n,r,i,a,o,s,c):me(l,i,a,!0):(u&8&&p(n,``),m&16&&D(d,n,r,i,a,o,s,c))},ce=(e,t,r,i,a,o,s,c,l)=>{e||=n,t||=n;let u=e.length,d=t.length,f=Math.min(u,d),p;for(p=0;p<f;p++){let n=t[p]=l?ua(t[p]):la(t[p]);v(e[p],n,r,null,a,o,s,c,l)}u>d?me(e,a,o,!0,!1,f):D(t,r,i,a,o,s,c,l,f)},le=(e,t,r,i,a,o,s,c,l)=>{let u=0,d=t.length,f=e.length-1,p=d-1;for(;u<=f&&u<=p;){let n=e[u],i=t[u]=l?ua(t[u]):la(t[u]);if(ea(n,i))v(n,i,r,null,a,o,s,c,l);else break;u++}for(;u<=f&&u<=p;){let n=e[f],i=t[p]=l?ua(t[p]):la(t[p]);if(ea(n,i))v(n,i,r,null,a,o,s,c,l);else break;f--,p--}if(u>f){if(u<=p){let e=p+1,n=e<d?t[e].el:i;for(;u<=p;)v(null,t[u]=l?ua(t[u]):la(t[u]),r,n,a,o,s,c,l),u++}}else if(u>p)for(;u<=f;)N(e[u],a,o,!0),u++;else{let m=u,h=u,g=new Map;for(u=h;u<=p;u++){let e=t[u]=l?ua(t[u]):la(t[u]);e.key!=null&&g.set(e.key,u)}let _,y=0,b=p-h+1,x=!1,S=0,C=Array(b);for(u=0;u<b;u++)C[u]=0;for(u=m;u<=f;u++){let n=e[u];if(y>=b){N(n,a,o,!0);continue}let i;if(n.key!=null)i=g.get(n.key);else for(_=h;_<=p;_++)if(C[_-h]===0&&ea(n,t[_])){i=_;break}i===void 0?N(n,a,o,!0):(C[i-h]=u+1,i>=S?S=i:x=!0,v(n,t[i],r,null,a,o,s,c,l),y++)}let w=x?Ii(C):n;for(_=w.length-1,u=b-1;u>=0;u--){let e=h+u,n=t[e],f=t[e+1],p=e+1<d?f.el||zi(f):i;C[u]===0?v(null,n,r,p,a,o,s,c,l):x&&(_<0||u!==w[_]?ue(n,r,p,2):_--)}}},ue=(e,t,n,r,i=null)=>{let{el:a,type:c,transition:l,children:u,shapeFlag:d}=e;if(d&6){ue(e.component.subTree,t,n,r);return}if(d&128){e.suspense.move(t,n,r);return}if(d&64){c.move(e,t,n,P);return}if(c===Hi){o(a,t,n);for(let e=0;e<u.length;e++)ue(u[e],t,n,r);o(e.anchor,t,n);return}if(c===Gi){S(e,t,n);return}if(r!==2&&d&1&&l)if(r===0)l.persisted&&!a[tr]?o(a,t,n):(l.beforeEnter(a),o(a,t,n),ki(()=>l.enter(a),i));else{let{leave:r,delayLeave:i,afterLeave:c}=l,u=()=>{e.ctx.isUnmounted?s(a):o(a,t,n)},d=()=>{let e=a._isLeaving||!!a[tr];a._isLeaving&&a[tr](!0),l.persisted&&!e?u():r(a,()=>{u(),c&&c()})};i?i(a,u,d):d()}else o(a,t,n)},N=(e,t,n,r=!1,i=!1)=>{let{type:a,props:o,ref:s,children:c,dynamicChildren:l,shapeFlag:u,patchFlag:d,dirs:f,cacheIndex:p,memo:m}=e;if(d===-2&&(i=!1),s!=null&&(Be(),sr(s,null,n,e,!0),Ve()),p!=null&&(t.renderCache[p]=void 0),u&256){t.ctx.deactivate(e);return}let h=u&1&&f,g=!lr(e),_;if(g&&(_=o&&o.onVnodeBeforeUnmount)&&pa(_,t,e),u&6)pe(e.component,n,r);else{if(u&128){e.suspense.unmount(n,r);return}h&&jn(e,null,t,`beforeUnmount`),u&64?e.type.remove(e,t,n,P,r):l&&!l.hasOnce&&(a!==Hi||d>0&&d&64)?me(l,t,n,!1,!0):(a===Hi&&d&384||!i&&u&16)&&me(c,t,n),r&&de(e)}let v=m!=null&&p==null;(g&&(_=o&&o.onVnodeUnmounted)||h||v)&&ki(()=>{_&&pa(_,t,e),h&&jn(e,null,t,`unmounted`),v&&(e.el=null)},n)},de=e=>{let{type:t,el:n,anchor:r,transition:i}=e;if(t===Hi){fe(n,r);return}if(t===Gi){C(e);return}let a=()=>{s(n),i&&!i.persisted&&i.afterLeave&&i.afterLeave()};if(e.shapeFlag&1&&i&&!i.persisted){let{leave:t,delayLeave:r}=i,o=()=>t(n,a);r?r(e.el,a,o):o()}else a()},fe=(e,t)=>{let n;for(;e!==t;)n=h(e),s(e),e=n;s(t)},pe=(e,t,n)=>{let{bum:r,scope:i,job:a,subTree:o,um:s,m:c,a:l}=e;Ri(c),Ri(l),r&&ne(r),i.stop(),a&&(a.flags|=8,N(o,e,t,n)),s&&ki(s,t),ki(()=>{e.isUnmounted=!0},t)},me=(e,t,n,r=!1,i=!1,a=0)=>{for(let o=a;o<e.length;o++)N(e[o],t,n,r,i)},he=e=>{if(e.shapeFlag&6)return he(e.component.subTree);if(e.shapeFlag&128)return e.suspense.next();let t=h(e.anchor||e.el),n=t&&t[Hn];return n?h(n):t},ge=!1,_e=(e,t,n)=>{let r;e==null?t._vnode&&(N(t._vnode,null,null,!0),r=t._vnode.component):v(t._vnode||null,e,t,null,null,null,n),t._vnode=e,ge||=(ge=!0,Sn(r),Cn(),!1)},P={p:v,um:N,m:ue,r:de,mt:M,mc:D,pc:se,pbc:k,n:he,o:e},ve,ye;return i&&([ve,ye]=i(P)),{render:_e,hydrate:ve,createApp:Zr(_e,ve)}}function Mi({type:e,props:t},n){return n===`svg`&&e===`foreignObject`||n===`mathml`&&e===`annotation-xml`&&t&&t.encoding&&t.encoding.includes(`html`)?void 0:n}function Ni({effect:e,job:t},n){n?(e.flags|=32,t.flags|=4):(e.flags&=-33,t.flags&=-5)}function Pi(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function Fi(e,t,n=!1){let r=e.children,i=t.children;if(d(r)&&d(i))for(let e=0;e<r.length;e++){let t=r[e],a=i[e];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=i[e]=ua(i[e]),a.el=t.el),!n&&a.patchFlag!==-2&&Fi(t,a)),a.type===Ui&&(a.patchFlag===-1&&(a=i[e]=ua(a)),a.el=t.el),a.type===Wi&&!a.el&&(a.el=t.el)}}function Ii(e){let t=e.slice(),n=[0],r,i,a,o,s,c=e.length;for(r=0;r<c;r++){let c=e[r];if(c!==0){if(i=n[n.length-1],e[i]<c){t[r]=i,n.push(r);continue}for(a=0,o=n.length-1;a<o;)s=a+o>>1,e[n[s]]<c?a=s+1:o=s;c<e[n[a]]&&(a>0&&(t[r]=n[a-1]),n[a]=r)}}for(a=n.length,o=n[a-1];a-->0;)n[a]=o,o=t[o];return n}function Li(e){let t=e.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:Li(t)}function Ri(e){if(e)for(let t=0;t<e.length;t++)e[t].flags|=8}function zi(e){if(e.placeholder)return e.placeholder;let t=e.component;return t?zi(t.subTree):null}var Bi=e=>e.__isSuspense;function Vi(e,t){t&&t.pendingBranch?d(e)?t.effects.push(...e):t.effects.push(e):xn(e)}var Hi=Symbol.for(`v-fgt`),Ui=Symbol.for(`v-txt`),Wi=Symbol.for(`v-cmt`),Gi=Symbol.for(`v-stc`),Ki=[],qi=null;function U(e=!1){Ki.push(qi=e?null:[])}function Ji(){Ki.pop(),qi=Ki[Ki.length-1]||null}var Yi=1;function Xi(e,t=!1){Yi+=e,e<0&&qi&&t&&(qi.hasOnce=!0)}function Zi(e){return e.dynamicChildren=Yi>0?qi||n:null,Ji(),Yi>0&&qi&&qi.push(e),e}function W(e,t,n,r,i,a){return Zi(G(e,t,n,r,i,a,!0))}function Qi(e,t,n,r,i){return Zi(ra(e,t,n,r,i,!0))}function $i(e){return e?e.__v_isVNode===!0:!1}function ea(e,t){return e.type===t.type&&e.key===t.key}var ta=({key:e})=>e??null,na=({ref:e,ref_key:t,ref_for:n})=>(typeof e==`number`&&(e=``+e),e==null?null:g(e)||z(e)||h(e)?{i:En,r:e,k:t,f:!!n}:e);function G(e,t=null,n=null,r=0,i=null,a=e===Hi?0:1,o=!1,s=!1){let c={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&ta(t),ref:t&&na(t),scopeId:Dn,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:a,patchFlag:r,dynamicProps:i,dynamicChildren:null,appContext:null,ctx:En};return s?(da(c,n),a&128&&e.normalize(c)):n&&(c.shapeFlag|=g(n)?8:16),Yi>0&&!o&&qi&&(c.patchFlag>0||a&6)&&c.patchFlag!==32&&qi.push(c),c}var ra=ia;function ia(e,t=null,n=null,r=0,i=null,a=!1){if((!e||e===Dr)&&(e=Wi),$i(e)){let r=oa(e,t,!0);return n&&da(r,n),Yi>0&&!a&&qi&&(r.shapeFlag&6?qi[qi.indexOf(e)]=r:qi.push(r)),r.patchFlag=-2,r}if(Pa(e)&&(e=e.__vccOpts),t){t=aa(t);let{class:e,style:n}=t;e&&!g(e)&&(t.class=N(e)),v(n)&&(zt(n)&&!d(n)&&(n=s({},n)),t.style=oe(n))}let o=g(e)?1:Bi(e)?128:Un(e)?64:v(e)?4:h(e)?2:0;return G(e,t,n,r,i,o,a,!0)}function aa(e){return e?zt(e)||pi(e)?s({},e):e:null}function oa(e,t,n=!1,r=!1){let{props:i,ref:a,patchFlag:o,children:s,transition:c}=e,l=t?fa(i||{},t):i,u={__v_isVNode:!0,__v_skip:!0,type:e.type,props:l,key:l&&ta(l),ref:t&&t.ref?n&&a?d(a)?a.concat(na(t)):[a,na(t)]:na(t):a,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:s,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==Hi?o===-1?16:o|16:o,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:c,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&oa(e.ssContent),ssFallback:e.ssFallback&&oa(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce};return c&&r&&nr(u,c.clone(u)),u}function sa(e=` `,t=0){return ra(Ui,null,e,t)}function ca(e=``,t=!1){return t?(U(),Qi(Wi,null,e)):ra(Wi,null,e)}function la(e){return e==null||typeof e==`boolean`?ra(Wi):d(e)?ra(Hi,null,e.slice()):$i(e)?ua(e):ra(Ui,null,String(e))}function ua(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:oa(e)}function da(e,t){let n=0,{shapeFlag:r}=e;if(t==null)t=null;else if(d(t))n=16;else if(typeof t==`object`)if(r&65){let n=t.default;n&&(n._c&&(n._d=!1),da(e,n()),n._c&&(n._d=!0));return}else{n=32;let r=t._;!r&&!pi(t)?t._ctx=En:r===3&&En&&(En.slots._===1?t._=1:(t._=2,e.patchFlag|=1024))}else if(h(t)){if(r&65){da(e,{default:t});return}t={default:t,_ctx:En},n=32}else t=String(t),r&64?(n=16,t=[sa(t)]):n=8;e.children=t,e.shapeFlag|=n}function fa(...e){let t={};for(let n=0;n<e.length;n++){let r=e[n];for(let e in r)if(e===`class`)t.class!==r.class&&(t.class=N([t.class,r.class]));else if(e===`style`)t.style=oe([t.style,r.style]);else if(a(e)){let n=t[e],i=r[e];i&&n!==i&&!(d(n)&&n.includes(i))?t[e]=n?[].concat(n,i):i:i==null&&n==null&&!o(e)&&(t[e]=i)}else e!==``&&(t[e]=r[e])}return t}function pa(e,t,n,r=null){cn(e,t,7,[n,r])}var ma=Yr(),ha=0;function ga(e,n,r){let i=e.type,a=(n?n.appContext:e.appContext)||ma,o={uid:ha++,vnode:e,type:i,parent:n,appContext:a,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new be(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:n?n.provides:Object.create(a.provides),ids:n?n.ids:[``,0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:yi(i,a),emitsOptions:ni(i,a),emit:null,emitted:null,propsDefaults:t,inheritAttrs:i.inheritAttrs,ctx:t,data:t,props:t,attrs:t,slots:t,refs:t,setupState:t,setupContext:null,suspense:r,suspenseId:r?r.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return o.ctx={_:o},o.root=n?n.root:o,o.emit=ei.bind(null,o),e.ce&&e.ce(o),o}var _a=null,va=()=>_a||En,ya,ba;{let e=ae(),t=(t,n)=>{let r;return(r=e[t])||(r=e[t]=[]),r.push(n),e=>{r.length>1?r.forEach(t=>t(e)):r[0](e)}};ya=t(`__VUE_INSTANCE_SETTERS__`,e=>_a=e),ba=t(`__VUE_SSR_SETTERS__`,e=>wa=e)}var xa=e=>{let t=_a;return ya(e),e.scope.on(),()=>{e.scope.off(),ya(t)}},Sa=()=>{_a&&_a.scope.off(),ya(null)};function Ca(e){return e.vnode.shapeFlag&4}var wa=!1;function Ta(e,t=!1,n=!1){t&&ba(t);let{props:r,children:i}=e.vnode,a=Ca(e);mi(e,r,a,t),Di(e,i,n||t);let o=a?Ea(e,t):void 0;return t&&ba(!1),o}function Ea(e,t){let n=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,Mr);let{setup:r}=n;if(r){Be();let n=e.setupContext=r.length>1?Ma(e):null,i=xa(e),a=sn(r,e,0,[e.props,n]),o=y(a);if(Ve(),i(),(o||e.sp)&&!lr(e)&&ir(e),o){if(a.then(Sa,Sa),t)return a.then(n=>{Da(e,n,t)}).catch(t=>{ln(t,e,0)});e.asyncDep=a}else Da(e,a,t)}else Aa(e,t)}function Da(e,t,n){h(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:v(t)&&(e.setupState=Kt(t)),Aa(e,n)}var Oa,ka;function Aa(e,t,n){let i=e.type;if(!e.render){if(!t&&Oa&&!i.render){let t=i.template||zr(e).template;if(t){let{isCustomElement:n,compilerOptions:r}=e.appContext.config,{delimiters:a,compilerOptions:o}=i;i.render=Oa(t,s(s({isCustomElement:n,delimiters:a},r),o))}}e.render=i.render||r,ka&&ka(e)}{let t=xa(e);Be();try{Fr(e)}finally{Ve(),t()}}}var ja={get(e,t){return L(e,`get`,``),e[t]}};function Ma(e){return{attrs:new Proxy(e.attrs,ja),slots:e.slots,emit:e.emit,expose:t=>{e.exposed=t||{}}}}function Na(e){return e.exposed?e.exposeProxy||=new Proxy(Kt(Bt(e.exposed)),{get(t,n){if(n in t)return t[n];if(n in Ar)return Ar[n](e)},has(e,t){return t in e||t in Ar}}):e.proxy}function Pa(e){return h(e)&&`__vccOpts`in e}var Fa=(e,t)=>$t(e,t,wa),Ia=`3.5.40`,La=void 0,Ra=typeof window<`u`&&window.trustedTypes;if(Ra)try{La=Ra.createPolicy(`vue`,{createHTML:e=>e})}catch{}var za=La?e=>La.createHTML(e):e=>e,Ba=`http://www.w3.org/2000/svg`,Va=`http://www.w3.org/1998/Math/MathML`,Ha=typeof document<`u`?document:null,Ua=Ha&&Ha.createElement(`template`),Wa={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{let t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,r)=>{let i=t===`svg`?Ha.createElementNS(Ba,e):t===`mathml`?Ha.createElementNS(Va,e):n?Ha.createElement(e,{is:n}):Ha.createElement(e);return e===`select`&&r&&r.multiple!=null&&i.setAttribute(`multiple`,r.multiple),i},createText:e=>Ha.createTextNode(e),createComment:e=>Ha.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>Ha.querySelector(e),setScopeId(e,t){e.setAttribute(t,``)},insertStaticContent(e,t,n,r,i,a){let o=n?n.previousSibling:t.lastChild;if(i&&(i===a||i.nextSibling))for(;t.insertBefore(i.cloneNode(!0),n),!(i===a||!(i=i.nextSibling)););else{Ua.innerHTML=za(r===`svg`?`<svg>${e}</svg>`:r===`mathml`?`<math>${e}</math>`:e);let i=Ua.content;if(r===`svg`||r===`mathml`){let e=i.firstChild;for(;e.firstChild;)i.appendChild(e.firstChild);i.removeChild(e)}t.insertBefore(i,n)}return[o?o.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}},Ga=Symbol(`_vtc`);function Ka(e,t,n){let r=e[Ga];r&&(t=(t?[t,...r]:[...r]).join(` `)),t==null?e.removeAttribute(`class`):n?e.setAttribute(`class`,t):e.className=t}var qa=Symbol(`_vod`),Ja=Symbol(`_vsh`),Ya=Symbol(``),Xa=/(?:^|;)\s*display\s*:/;function Za(e,t,n){let r=e.style,i=g(n),a=!1;if(n&&!i){if(t)if(g(t))for(let e of t.split(`;`)){let t=e.slice(0,e.indexOf(`:`)).trim();n[t]??$a(r,t,``)}else for(let e in t)n[e]??$a(r,e,``);for(let i in n){i===`display`&&(a=!0);let o=n[i];o==null?$a(r,i,``):ro(e,i,!g(t)&&t?t[i]:void 0,o)||$a(r,i,o)}}else if(i){if(t!==n){let e=r[Ya];e&&(n+=`;`+e),r.cssText=n,a=Xa.test(n)}}else t&&e.removeAttribute(`style`);qa in e&&(e[qa]=a?r.display:``,e[Ja]&&(r.display=`none`))}var Qa=/\s*!important$/;function $a(e,t,n){if(d(n))n.forEach(n=>$a(e,t,n));else if(n??=``,t.startsWith(`--`))e.setProperty(t,n);else{let r=no(e,t);Qa.test(n)?e.setProperty(k(r),n.replace(Qa,``),`important`):e[r]=n}}var eo=[`Webkit`,`Moz`,`ms`],to={};function no(e,t){let n=to[t];if(n)return n;let r=D(t);if(r!==`filter`&&r in e)return to[t]=r;r=A(r);for(let n=0;n<eo.length;n++){let i=eo[n]+r;if(i in e)return to[t]=i}return t}function ro(e,t,n,r){return e.tagName===`TEXTAREA`&&(t===`width`||t===`height`)&&g(r)&&n===r}var io=`http://www.w3.org/1999/xlink`;function ao(e,t,n,r,i,a=fe(t)){r&&t.startsWith(`xlink:`)?n==null?e.removeAttributeNS(io,t.slice(6,t.length)):e.setAttributeNS(io,t,n):n==null||a&&!pe(n)?e.removeAttribute(t):e.setAttribute(t,a?``:_(n)?String(n):n)}function oo(e,t,n,r,i){if(t===`innerHTML`||t===`textContent`){n!=null&&(e[t]=t===`innerHTML`?za(n):n);return}let a=e.tagName;if(t===`value`&&a!==`PROGRESS`&&!a.includes(`-`)){let r=a===`OPTION`?e.getAttribute(`value`)||``:e.value,i=n==null?e.type===`checkbox`?`on`:``:String(n);(r!==i||!(`_value`in e))&&(e.value=i),n??e.removeAttribute(t),e._value=n;return}let o=!1;if(n===``||n==null){let r=typeof e[t];r===`boolean`?n=pe(n):n==null&&r===`string`?(n=``,o=!0):r===`number`&&(n=0,o=!0)}try{e[t]=n}catch{}o&&e.removeAttribute(i||t)}function so(e,t,n,r){e.addEventListener(t,n,r)}function co(e,t,n,r){e.removeEventListener(t,n,r)}var lo=Symbol(`_vei`);function uo(e,t,n,r,i=null){let a=e[lo]||(e[lo]={}),o=a[t];if(r&&o)o.value=r;else{let[n,s]=mo(t);r?so(e,n,a[t]=vo(r,i),s):o&&(co(e,n,o,s),a[t]=void 0)}}var fo=/(Once|Passive|Capture)$/,po=/^on:?(?:Once|Passive|Capture)$/;function mo(e){let t,n;for(;(n=e.match(fo))&&!po.test(e);)t||={},e=e.slice(0,e.length-n[1].length),t[n[1].toLowerCase()]=!0;return[e[2]===`:`?e.slice(3):k(e.slice(2)),t]}var ho=0,go=Promise.resolve(),_o=()=>ho||=(go.then(()=>ho=0),Date.now());function vo(e,t){let n=e=>{if(!e._vts)e._vts=Date.now();else if(e._vts<=n.attached)return;let r=n.value;if(d(r)){let n=e.stopImmediatePropagation;e.stopImmediatePropagation=()=>{n.call(e),e._stopped=!0};let i=r.slice(),a=[e];for(let n=0;n<i.length&&!e._stopped;n++){let e=i[n];e&&cn(e,t,5,a)}}else cn(r,t,5,[e])};return n.value=e,n.attached=_o(),n}var yo=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,bo=(e,t,n,r,i,s)=>{let c=i===`svg`;t===`class`?Ka(e,r,c):t===`style`?Za(e,n,r):a(t)?o(t)||uo(e,t,n,r,s):(t[0]===`.`?(t=t.slice(1),!0):t[0]===`^`?(t=t.slice(1),!1):xo(e,t,r,c))?(oo(e,t,r),!e.tagName.includes(`-`)&&(t===`value`||t===`checked`||t===`selected`)&&ao(e,t,r,c,s,t!==`value`)):e._isVueCE&&(So(e,t)||e._def.__asyncLoader&&(/[A-Z]/.test(t)||!g(r)))?oo(e,D(t),r,s,t):(t===`true-value`?e._trueValue=r:t===`false-value`&&(e._falseValue=r),ao(e,t,r,c))};function xo(e,t,n,r){if(r)return!!(t===`innerHTML`||t===`textContent`||t in e&&yo(t)&&h(n));if(t===`spellcheck`||t===`draggable`||t===`translate`||t===`autocorrect`||t===`sandbox`&&e.tagName===`IFRAME`||t===`form`||t===`list`&&e.tagName===`INPUT`||t===`type`&&e.tagName===`TEXTAREA`)return!1;if(t===`width`||t===`height`){let t=e.tagName;if(t===`IMG`||t===`VIDEO`||t===`CANVAS`||t===`SOURCE`)return!1}return yo(t)&&g(n)?!1:t in e}function So(e,t){let n=e._def.props;if(!n)return!1;let r=D(t);return Array.isArray(n)?n.some(e=>D(e)===r):Object.keys(n).some(e=>D(e)===r)}var Co=e=>{let t=e.props[`onUpdate:modelValue`]||!1;return d(t)?e=>ne(t,e):t};function wo(e){e.target.composing=!0}function To(e){let t=e.target;t.composing&&(t.composing=!1,t.dispatchEvent(new Event(`input`)))}var Eo=Symbol(`_assign`);function Do(e,t,n){return t&&(e=e.trim()),n&&(e=re(e)),e}var Oo={created(e,{modifiers:{lazy:t,trim:n,number:r}},i){e[Eo]=Co(i);let a=r||i.props&&i.props.type===`number`;so(e,t?`change`:`input`,t=>{t.target.composing||e[Eo](Do(e.value,n,a))}),(n||a)&&so(e,`change`,()=>{e.value=Do(e.value,n,a)}),t||(so(e,`compositionstart`,wo),so(e,`compositionend`,To),so(e,`change`,To))},mounted(e,{value:t}){e.value=t??``},beforeUpdate(e,{value:t,oldValue:n,modifiers:{lazy:r,trim:i,number:a}},o){if(e[Eo]=Co(o),e.composing)return;let s=(a||e.type===`number`)&&!/^0\d/.test(e.value)?re(e.value):e.value,c=t??``;if(s===c)return;let l=e.getRootNode();(l instanceof Document||l instanceof ShadowRoot)&&l.activeElement===e&&e.type!==`range`&&(r&&t===n||i&&e.value.trim()===c)||(e.value=c)}},ko={deep:!0,created(e,t,n){e[Eo]=Co(n),so(e,`change`,()=>{let t=e._modelValue,n=No(e),r=e.checked,i=e[Eo];if(d(t)){let e=ge(t,n),a=e!==-1;if(r&&!a)i(t.concat(n));else if(!r&&a){let n=[...t];n.splice(e,1),i(n)}}else if(p(t)){let e=new Set(t);r?e.add(n):e.delete(n),i(e)}else i(Po(e,r))})},mounted:Ao,beforeUpdate(e,t,n){e[Eo]=Co(n),Ao(e,t,n)}};function Ao(e,{value:t,oldValue:n},r){e._modelValue=t;let i;if(d(t))i=ge(t,r.props.value)>-1;else if(p(t))i=t.has(r.props.value);else{if(t===n)return;i=he(t,Po(e,!0))}e.checked!==i&&(e.checked=i)}var jo={deep:!0,created(e,{value:t,modifiers:{number:n}},r){e._modelValue=t,so(e,`change`,()=>{let t=Array.prototype.filter.call(e.options,e=>e.selected).map(e=>n?re(No(e)):No(e));e[Eo](e.multiple?p(e._modelValue)?new Set(t):t:t[0]),e._assigning=!0,_n(()=>{e._assigning=!1})}),e[Eo]=Co(r)},mounted(e,{value:t}){Mo(e,t)},beforeUpdate(e,{value:t},n){e._modelValue=t,e[Eo]=Co(n)},updated(e,{value:t}){e._assigning||Mo(e,t)}};function Mo(e,t){let n=e.multiple,r=d(t);if(!(n&&!r&&!p(t))){for(let i=0,a=e.options.length;i<a;i++){let a=e.options[i],o=No(a);if(n)if(r){let e=typeof o;e===`string`||e===`number`?a.selected=t.some(e=>String(e)===String(o)):a.selected=ge(t,o)>-1}else a.selected=t.has(o);else if(he(No(a),t)){e.selectedIndex!==i&&(e.selectedIndex=i);return}}!n&&e.selectedIndex!==-1&&(e.selectedIndex=-1)}}function No(e){return`_value`in e?e._value:e.value}function Po(e,t){let n=t?`_trueValue`:`_falseValue`;return n in e?e[n]:t}var Fo=[`ctrl`,`shift`,`alt`,`meta`],Io={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>`button`in e&&e.button!==0,middle:e=>`button`in e&&e.button!==1,right:e=>`button`in e&&e.button!==2,exact:(e,t)=>Fo.some(n=>e[`${n}Key`]&&!t.includes(n))},Lo=(e,t)=>{if(!e)return e;let n=e._withMods||={},r=t.join(`.`);return n[r]||(n[r]=((n,...r)=>{for(let e=0;e<t.length;e++){let r=Io[t[e]];if(r&&r(n,t))return}return e(n,...r)}))},Ro=s({patchProp:bo},Wa),zo;function Bo(){return zo||=Ai(Ro)}var Vo=((...e)=>{let t=Bo().createApp(...e),{mount:n}=t;return t.mount=e=>{let r=Uo(e);if(!r)return;let i=t._component;!h(i)&&!i.render&&!i.template&&(i.template=r.innerHTML),r.nodeType===1&&(r.textContent=``);let a=n(r,!1,Ho(r));return r instanceof Element&&(r.removeAttribute(`v-cloak`),r.setAttribute(`data-v-app`,``)),a},t});function Ho(e){if(e instanceof SVGElement)return`svg`;if(typeof MathMLElement==`function`&&e instanceof MathMLElement)return`mathml`}function Uo(e){return g(e)?document.querySelector(e):e}var Wo=typeof window<`u`,Go,Ko=e=>Go=e,qo=Symbol();function Jo(e){return e&&typeof e==`object`&&Object.prototype.toString.call(e)===`[object Object]`&&typeof e.toJSON!=`function`}var Yo=typeof window==`object`&&window.window===window?window:typeof self==`object`&&self.self===self?self:typeof global==`object`&&global.global===global?global:typeof globalThis==`object`?globalThis:{HTMLElement:null};function Xo(e,{autoBom:t=!1}={}){return t&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob([`﻿`,e],{type:e.type}):e}function Zo(e,t,n){let r=new XMLHttpRequest;r.open(`GET`,e),r.responseType=`blob`,r.onload=function(){ns(r.response,t,n)},r.onerror=function(){console.error(`could not download file`)},r.send()}function Qo(e){let t=new XMLHttpRequest;t.open(`HEAD`,e,!1);try{t.send()}catch{}return t.status>=200&&t.status<=299}function $o(e){try{e.dispatchEvent(new MouseEvent(`click`))}catch{let t=new MouseEvent(`click`,{bubbles:!0,cancelable:!0,view:window,detail:0,screenX:80,screenY:20,clientX:80,clientY:20,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,button:0,relatedTarget:null});e.dispatchEvent(t)}}var es=typeof navigator==`object`?navigator:{userAgent:``},ts=/Macintosh/.test(es.userAgent)&&/AppleWebKit/.test(es.userAgent)&&!/Safari/.test(es.userAgent),ns=Wo?typeof HTMLAnchorElement<`u`&&`download`in HTMLAnchorElement.prototype&&!ts?rs:`msSaveOrOpenBlob`in es?is:as:()=>{};function rs(e,t=`download`,n){let r=document.createElement(`a`);r.download=t,r.rel=`noopener`,typeof e==`string`?(r.href=e,r.origin===location.origin?$o(r):Qo(r.href)?Zo(e,t,n):(r.target=`_blank`,$o(r))):(r.href=URL.createObjectURL(e),setTimeout(function(){URL.revokeObjectURL(r.href)},4e4),setTimeout(function(){$o(r)},0))}function is(e,t=`download`,n){if(typeof e==`string`)if(Qo(e))Zo(e,t,n);else{let t=document.createElement(`a`);t.href=e,t.target=`_blank`,setTimeout(function(){$o(t)})}else navigator.msSaveOrOpenBlob(Xo(e,n),t)}function as(e,t,n,r){if(r||=open(``,`_blank`),r&&(r.document.title=r.document.body.innerText=`downloading...`),typeof e==`string`)return Zo(e,t,n);let i=e.type===`application/octet-stream`,a=/constructor/i.test(String(Yo.HTMLElement))||`safari`in Yo,o=/CriOS\/[\d]+/.test(navigator.userAgent);if((o||i&&a||ts)&&typeof FileReader<`u`){let t=new FileReader;t.onloadend=function(){let e=t.result;if(typeof e!=`string`)throw r=null,Error(`Wrong reader.result type`);e=o?e:e.replace(/^data:[^;]*;/,`data:attachment/file;`),r?r.location.href=e:location.assign(e),r=null},t.readAsDataURL(e)}else{let t=URL.createObjectURL(e);r?r.location.assign(t):location.href=t,r=null,setTimeout(function(){URL.revokeObjectURL(t)},4e4)}}var{assign:os}=Object;function ss(){let e=xe(!0),t=e.run(()=>B({})),n=[],r=[],i=Bt({install(e){Ko(i),i._a=e,e.provide(qo,i),e.config.globalProperties.$pinia=i,r.forEach(e=>n.push(e)),r=[]},use(e){return this._a?n.push(e):r.push(e),this},_p:n,_a:null,_e:e,_s:new Map,state:t});return i}var cs=()=>{};function ls(e,t,n,r=cs){e.add(t);let i=()=>{e.delete(t)&&r()};return!n&&Se()&&Ce(i),i}function us(e,...t){e.forEach(e=>{e(...t)})}var ds=e=>e(),fs=Symbol(),ps=Symbol();function ms(e,t){e instanceof Map&&t instanceof Map?t.forEach((t,n)=>e.set(n,t)):e instanceof Set&&t instanceof Set&&t.forEach(e.add,e);for(let n in t){if(!Object.hasOwn(t,n))continue;let r=t[n],i=e[n];Jo(i)&&Jo(r)&&Object.hasOwn(e,n)&&!z(r)&&!It(r)?e[n]=ms(i,r):e[n]=r}return e}var hs=Symbol();function gs(e){return!e||typeof e!=`object`||!Object.hasOwn(e,hs)}var{assign:_s}=Object;function vs(e){return!!(z(e)&&e.effect)}function ys(e,t,n,r){let{state:i,actions:a,getters:o}=t,s=n.state.value[e],c;function l(){return s||(n.state.value[e]=i?i():{}),_s(qt(n.state.value[e]),a,Object.keys(o||{}).reduce((t,r)=>(t[r]=Bt(Fa(()=>{Ko(n);let t=n._s.get(e);return o[r].call(t,t)})),t),{}))}return c=bs(e,l,t,n,r,!0),c}function bs(e,t,n={},r,i,a){let o,s=_s({actions:{}},n),c={deep:!0},l,u,d=new Set,f=new Set,p,m=r.state.value[e];!a&&!m&&(r.state.value[e]={});let h;function g(t){let n;l=u=!1,typeof t==`function`?(t(r.state.value[e]),n={type:`patch function`,storeId:e,events:p}):(ms(r.state.value[e],t),n={type:`patch object`,payload:t,storeId:e,events:p});let i=h=Symbol();_n().then(()=>{h===i&&(l=!0)}),u=!0,us(d,n,r.state.value[e])}let _=a?function(){let{state:e}=n,t=e?e():{};this.$patch(e=>{_s(e,t)})}:cs;function v(){o.stop(),d.clear(),f.clear(),r._s.delete(e)}let y=(t,n=``)=>{if(fs in t)return t[ps]=n,t;let i=function(){Ko(r);let n=Array.from(arguments),a=new Set,o=new Set;function s(e){a.add(e)}function c(e){o.add(e)}us(f,{args:n,name:i[ps],store:b,after:s,onError:c});let l;try{l=t.apply(this&&this.$id===e?this:b,n)}catch(e){throw us(o,e),e}return l instanceof Promise?l.then(e=>(us(a,e),e)).catch(e=>(us(o,e),Promise.reject(e))):(us(a,l),l)};return i[fs]=!0,i[ps]=n,i},b=Mt({_p:r,$id:e,$onAction:ls.bind(null,f),$patch:g,$reset:_,$subscribe(t,n={}){if(d.has(t))return cs;let i=ls(d,t,n.detached,()=>a()),a=o.run(()=>Ln(()=>r.state.value[e],r=>{(n.flush===`sync`?u:l)&&t({storeId:e,type:`direct`,events:p},r)},_s({},c,n)));return i},$dispose:v});r._s.set(e,b);let x=(r._a&&r._a.runWithContext||ds)(()=>r._e.run(()=>(o=xe()).run(()=>t({action:y}))));for(let t in x){let n=x[t];z(n)&&!vs(n)||It(n)?a||(m&&gs(n)&&(z(n)?n.value=m[t]:ms(n,m[t])),r.state.value[e][t]=n):typeof n==`function`&&(x[t]=y(n,t),s.actions[t]=n)}return _s(b,x),_s(R(b),x),Object.defineProperty(b,"$state",{get:()=>r.state.value[e],set:e=>{g(t=>{_s(t,e)})}}),r._p.forEach(e=>{let t=o.run(()=>e({store:b,app:r._a,pinia:r,options:s}));_s(b,t)}),m&&a&&n.hydrate&&n.hydrate(b.$state,m),l=!0,u=!0,b}function xs(e,t,n){let r,i=typeof t==`function`;r=i?n:t;function a(n,a){let o=Pn();return n||=o?Nn(qo,null):null,n&&Ko(n),n=Go,n._s.has(e)||(i?bs(e,t,r,n):ys(e,r,n)),n._s.get(e)}return a.$id=e,a}function Ss(e){let t=R(e),n={};for(let r in t){let i=t[r];i?.effect?n[r]=Fa({get:()=>e[r],set(t){e[r]=t}}):(z(i)||It(i))&&(n[r]=Xt(e,r))}return n}var Cs=[{id:`mandelbrot`,label:`Множество Мандельброта`,description:`Классическая орбита z² + c, начинающаяся в нуле.`,renderer:`escape-time`,initialView:{center:[-.65,0],scale:3.1},preview:{view:{center:[-.65,0],scale:3.1},iterations:240,palette:0,colorDensity:.062},suggestedIterations:320,iterationControl:{label:`Итерации`,min:40,max:1500,step:10},escapePower:2,deepZoom:{backend:`mandelbrot-perturbation`,maxMagnification:1e35},parameters:[],shader:{setup:`
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
      `,escaped:`dot(z, z) > 4.0`}},{id:`newton`,label:`Newton`,description:`Бассейны притяжения трёх корней полинома z³ − 1.`,renderer:`root-basin`,basinBackend:`newton-cubic`,initialView:{center:[0,0],scale:4},preview:{view:{center:[0,0],scale:4},iterations:70,palette:0,colorDensity:.075},suggestedIterations:80,iterationControl:{label:`Итерации`,min:10,max:300,step:5},parameters:[{key:`tolerance`,label:`Допуск сходимости`,uniform:`u_convergenceTolerance`,type:`number`,defaultValue:1e-5,step:1e-5,min:1e-7,max:.01}]},{id:`nova`,label:`Nova`,description:`Параметрическая плоскость метода Ньютона с добавлением координаты c.`,renderer:`root-basin`,basinBackend:`nova-cubic`,initialView:{center:[0,0],scale:3.6},preview:{view:{center:[0,0],scale:3.6},iterations:100,palette:0,colorDensity:.075},suggestedIterations:120,iterationControl:{label:`Итерации`,min:20,max:500,step:5},parameters:[{key:`relaxation`,label:`Relaxation r`,uniform:`u_novaRelaxation`,type:`number`,defaultValue:1,step:.05,min:-2,max:2},{key:`escapeRadius`,label:`Радиус выхода`,uniform:`u_novaEscapeRadius`,type:`number`,defaultValue:32,step:1,min:2,max:256},{key:`tolerance`,label:`Допуск сходимости`,uniform:`u_convergenceTolerance`,type:`number`,defaultValue:1e-5,step:1e-5,min:1e-7,max:.01}]},{id:`clifford`,label:`Clifford attractor`,description:`Хаотическая траектория, проявляющаяся через плотность накопленных точек.`,renderer:`point-attractor`,attractorBackend:`clifford`,initialView:{center:[0,0],scale:4.8},preview:{view:{center:[0,0],scale:4.8},palette:0,parameters:{pointCount:18e4,exposure:.11,pointSize:1.25}},suggestedIterations:1,parameters:[{key:`a`,label:`Параметр a`,uniform:`u_cliffordA`,type:`number`,defaultValue:-1.4,step:.01,min:-3,max:3},{key:`b`,label:`Параметр b`,uniform:`u_cliffordB`,type:`number`,defaultValue:1.6,step:.01,min:-3,max:3},{key:`c`,label:`Параметр c`,uniform:`u_cliffordC`,type:`number`,defaultValue:1,step:.01,min:-3,max:3},{key:`d`,label:`Параметр d`,uniform:`u_cliffordD`,type:`number`,defaultValue:.7,step:.01,min:-3,max:3},{key:`burnIn`,label:`Пропустить точек`,uniform:`u_cliffordBurnIn`,type:`number`,defaultValue:100,step:50,min:0,max:1e5},{key:`pointCount`,label:`Количество точек`,uniform:`u_cliffordPointCount`,type:`number`,defaultValue:5e5,step:5e4,min:1e3,max:2e6},{key:`exposure`,label:`Экспозиция`,uniform:`u_cliffordExposure`,type:`number`,defaultValue:.045,step:.005,min:.005,max:.3,affectsOrbit:!1},{key:`pointSize`,label:`Размер точки`,uniform:`u_cliffordPointSize`,type:`number`,defaultValue:1.25,step:.25,min:1,max:5,affectsOrbit:!1}]}];function ws(e){return Object.fromEntries(e.parameters.map(e=>[e.key,e.type===`complex`?[...e.defaultValue]:e.defaultValue]))}var Ts=9e15,Es=1e9,Ds=`0123456789abcdef`,Os=`2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058`,ks=`3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789`,As={precision:20,rounding:4,modulo:1,toExpNeg:-7,toExpPos:21,minE:-Ts,maxE:Ts,crypto:!1},js,Ms,K=!0,Ns=`[DecimalError] `,Ps=Ns+`Invalid argument: `,Fs=Ns+`Precision limit exceeded`,Is=Ns+`crypto unavailable`,Ls=`[object Decimal]`,q=Math.floor,J=Math.pow,Rs=/^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i,zs=/^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i,Bs=/^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i,Vs=/^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,Hs=1e7,Y=7,Us=9007199254740991,Ws=Os.length-1,Gs=ks.length-1,X={toStringTag:Ls};X.absoluteValue=X.abs=function(){var e=new this.constructor(this);return e.s<0&&(e.s=1),$(e)},X.ceil=function(){return $(new this.constructor(this),this.e+1,2)},X.clampedTo=X.clamp=function(e,t){var n,r=this,i=r.constructor;if(e=new i(e),t=new i(t),!e.s||!t.s)return new i(NaN);if(e.gt(t))throw Error(Ps+t);return n=r.cmp(e),n<0?e:r.cmp(t)>0?t:new i(r)},X.comparedTo=X.cmp=function(e){var t,n,r,i,a=this,o=a.d,s=(e=new a.constructor(e)).d,c=a.s,l=e.s;if(!o||!s)return!c||!l?NaN:c===l?o===s?0:!o^c<0?1:-1:c;if(!o[0]||!s[0])return o[0]?c:s[0]?-l:0;if(c!==l)return c;if(a.e!==e.e)return a.e>e.e^c<0?1:-1;for(r=o.length,i=s.length,t=0,n=r<i?r:i;t<n;++t)if(o[t]!==s[t])return o[t]>s[t]^c<0?1:-1;return r===i?0:r>i^c<0?1:-1},X.cosine=X.cos=function(){var e,t,n=this,r=n.constructor;return n.d?n.d[0]?(e=r.precision,t=r.rounding,r.precision=e+Math.max(n.e,n.sd())+Y,r.rounding=1,n=Ys(r,pc(r,n)),r.precision=e,r.rounding=t,$(Ms==2||Ms==3?n.neg():n,e,t,!0)):new r(1):new r(NaN)},X.cubeRoot=X.cbrt=function(){var e,t,n,r,i,a,o,s,c,l,u=this,d=u.constructor;if(!u.isFinite()||u.isZero())return new d(u);for(K=!1,a=u.s*J(u.s*u,1/3),!a||Math.abs(a)==1/0?(n=Z(u.d),e=u.e,(a=(e-n.length+1)%3)&&(n+=a==1||a==-2?`0`:`00`),a=J(n,1/3),e=q((e+1)/3)-(e%3==(e<0?-1:2)),a==1/0?n=`5e`+e:(n=a.toExponential(),n=n.slice(0,n.indexOf(`e`)+1)+e),r=new d(n),r.s=u.s):r=new d(a.toString()),o=(e=d.precision)+3;;)if(s=r,c=s.times(s).times(s),l=c.plus(u),r=Q(l.plus(u).times(s),l.plus(c),o+2,1),Z(s.d).slice(0,o)===(n=Z(r.d)).slice(0,o))if(n=n.slice(o-3,o+1),n==`9999`||!i&&n==`4999`){if(!i&&($(s,e+1,0),s.times(s).times(s).eq(u))){r=s;break}o+=4,i=1}else{(!+n||!+n.slice(1)&&n.charAt(0)==`5`)&&($(r,e+1,1),t=!r.times(r).times(r).eq(u));break}return K=!0,$(r,e,d.rounding,t)},X.decimalPlaces=X.dp=function(){var e,t=this.d,n=NaN;if(t){if(e=t.length-1,n=(e-q(this.e/Y))*Y,e=t[e],e)for(;e%10==0;e/=10)n--;n<0&&(n=0)}return n},X.dividedBy=X.div=function(e){return Q(this,new this.constructor(e))},X.dividedToIntegerBy=X.divToInt=function(e){var t=this,n=t.constructor;return $(Q(t,new n(e),0,1,1),n.precision,n.rounding)},X.equals=X.eq=function(e){return this.cmp(e)===0},X.floor=function(){return $(new this.constructor(this),this.e+1,3)},X.greaterThan=X.gt=function(e){return this.cmp(e)>0},X.greaterThanOrEqualTo=X.gte=function(e){var t=this.cmp(e);return t==1||t===0},X.hyperbolicCosine=X.cosh=function(){var e,t,n,r,i,a=this,o=a.constructor,s=new o(1);if(!a.isFinite())return new o(a.s?1/0:NaN);if(a.isZero())return s;n=o.precision,r=o.rounding,o.precision=n+Math.max(a.e,a.sd())+4,o.rounding=1,i=a.d.length,i<32?(e=Math.ceil(i/3),t=(1/fc(4,e)).toString()):(e=16,t=`2.3283064365386962890625e-10`),a=dc(o,1,a.times(t),new o(1),!0);for(var c,l=e,u=new o(8);l--;)c=a.times(a),a=s.minus(c.times(u.minus(c.times(u))));return $(a,o.precision=n,o.rounding=r,!0)},X.hyperbolicSine=X.sinh=function(){var e,t,n,r,i=this,a=i.constructor;if(!i.isFinite()||i.isZero())return new a(i);if(t=a.precision,n=a.rounding,a.precision=t+Math.max(i.e,i.sd())+4,a.rounding=1,r=i.d.length,r<3)i=dc(a,2,i,i,!0);else{e=1.4*Math.sqrt(r),e=e>16?16:e|0,i=i.times(1/fc(5,e)),i=dc(a,2,i,i,!0);for(var o,s=new a(5),c=new a(16),l=new a(20);e--;)o=i.times(i),i=i.times(s.plus(o.times(c.times(o).plus(l))))}return a.precision=t,a.rounding=n,$(i,t,n,!0)},X.hyperbolicTangent=X.tanh=function(){var e,t,n=this,r=n.constructor;return n.isFinite()?n.isZero()?new r(n):(e=r.precision,t=r.rounding,r.precision=e+7,r.rounding=1,Q(n.sinh(),n.cosh(),r.precision=e,r.rounding=t)):new r(n.s)},X.inverseCosine=X.acos=function(){var e=this,t=e.constructor,n=e.abs().cmp(1),r=t.precision,i=t.rounding;return n===-1?e.isZero()?$s(t,r+4,i).times(.5):(t.precision=r+6,t.rounding=1,e=new t(1).minus(e).div(e.plus(1)).sqrt().atan(),t.precision=r,t.rounding=i,e.times(2)):n===0?e.isNeg()?$s(t,r,i):new t(0):new t(NaN)},X.inverseHyperbolicCosine=X.acosh=function(){var e,t,n=this,r=n.constructor;return n.lte(1)?new r(n.eq(1)?0:NaN):n.isFinite()?(e=r.precision,t=r.rounding,r.precision=e+Math.max(Math.abs(n.e),n.sd())+4,r.rounding=1,K=!1,n=n.times(n).minus(1).sqrt().plus(n),K=!0,r.precision=e,r.rounding=t,n.ln()):new r(n)},X.inverseHyperbolicSine=X.asinh=function(){var e,t,n=this,r=n.constructor;return!n.isFinite()||n.isZero()?new r(n):(e=r.precision,t=r.rounding,r.precision=e+2*Math.max(Math.abs(n.e),n.sd())+6,r.rounding=1,K=!1,n=n.times(n).plus(1).sqrt().plus(n),K=!0,r.precision=e,r.rounding=t,n.ln())},X.inverseHyperbolicTangent=X.atanh=function(){var e,t,n,r,i=this,a=i.constructor;return i.isFinite()?i.e>=0?new a(i.abs().eq(1)?i.s/0:i.isZero()?i:NaN):(e=a.precision,t=a.rounding,r=i.sd(),Math.max(r,e)<2*-i.e-1?$(new a(i),e,t,!0):(a.precision=n=r-i.e,i=Q(i.plus(1),new a(1).minus(i),n+e,1),a.precision=e+4,a.rounding=1,i=i.ln(),a.precision=e,a.rounding=t,i.times(.5))):new a(NaN)},X.inverseSine=X.asin=function(){var e,t,n,r,i=this,a=i.constructor;return i.isZero()?new a(i):(t=i.abs().cmp(1),n=a.precision,r=a.rounding,t===-1?(a.precision=n+6,a.rounding=1,i=i.div(new a(1).minus(i.times(i)).sqrt().plus(1)).atan(),a.precision=n,a.rounding=r,i.times(2)):t===0?(e=$s(a,n+4,r).times(.5),e.s=i.s,e):new a(NaN))},X.inverseTangent=X.atan=function(){var e,t,n,r,i,a,o,s,c,l=this,u=l.constructor,d=u.precision,f=u.rounding;if(!l.isFinite()){if(!l.s)return new u(NaN);if(d+4<=Gs)return o=$s(u,d+4,f).times(.5),o.s=l.s,o}else if(l.isZero())return new u(l);else if(l.abs().eq(1)&&d+4<=Gs)return o=$s(u,d+4,f).times(.25),o.s=l.s,o;for(u.precision=s=d+10,u.rounding=1,n=Math.min(28,s/Y+2|0),e=n;e;--e)l=l.div(l.times(l).plus(1).sqrt().plus(1));for(K=!1,t=Math.ceil(s/Y),r=1,c=l.times(l),o=new u(l),i=l;e!==-1;)if(i=i.times(c),a=o.minus(i.div(r+=2)),i=i.times(c),o=a.plus(i.div(r+=2)),o.d[t]!==void 0)for(e=t;o.d[e]===a.d[e]&&e--;);return n&&(o=o.times(2<<n-1)),K=!0,$(o,u.precision=d,u.rounding=f,!0)},X.isFinite=function(){return!!this.d},X.isInteger=X.isInt=function(){return!!this.d&&q(this.e/Y)>this.d.length-2},X.isNaN=function(){return!this.s},X.isNegative=X.isNeg=function(){return this.s<0},X.isPositive=X.isPos=function(){return this.s>0},X.isZero=function(){return!!this.d&&this.d[0]===0},X.lessThan=X.lt=function(e){return this.cmp(e)<0},X.lessThanOrEqualTo=X.lte=function(e){return this.cmp(e)<1},X.logarithm=X.log=function(e){var t,n,r,i,a,o,s,c,l=this,u=l.constructor,d=u.precision,f=u.rounding,p=5;if(e==null)e=new u(10),t=!0;else{if(e=new u(e),n=e.d,e.s<0||!n||!n[0]||e.eq(1))return new u(NaN);t=e.eq(10)}if(n=l.d,l.s<0||!n||!n[0]||l.eq(1))return new u(n&&!n[0]?-1/0:l.s==1?n?0:1/0:NaN);if(t)if(n.length>1)a=!0;else{for(i=n[0];i%10==0;)i/=10;a=i!==1}if(K=!1,s=d+p,o=oc(l,s),r=t?Qs(u,s+10):oc(e,s),c=Q(o,r,s,1),qs(c.d,i=d,f))do if(s+=10,o=oc(l,s),r=t?Qs(u,s+10):oc(e,s),c=Q(o,r,s,1),!a){+Z(c.d).slice(i+1,i+15)+1==0x5af3107a4000&&(c=$(c,d+1,0));break}while(qs(c.d,i+=10,f));return K=!0,$(c,d,f)},X.minus=X.sub=function(e){var t,n,r,i,a,o,s,c,l,u,d,f,p=this,m=p.constructor;if(e=new m(e),!p.d||!e.d)return!p.s||!e.s?e=new m(NaN):p.d?e.s=-e.s:e=new m(e.d||p.s!==e.s?p:NaN),e;if(p.s!=e.s)return e.s=-e.s,p.plus(e);if(l=p.d,f=e.d,s=m.precision,c=m.rounding,!l[0]||!f[0]){if(f[0])e.s=-e.s;else if(l[0])e=new m(p);else return new m(c===3?-0:0);return K?$(e,s,c):e}if(n=q(e.e/Y),u=q(p.e/Y),l=l.slice(),a=u-n,a){for(d=a<0,d?(t=l,a=-a,o=f.length):(t=f,n=u,o=l.length),r=Math.max(Math.ceil(s/Y),o)+2,a>r&&(a=r,t.length=1),t.reverse(),r=a;r--;)t.push(0);t.reverse()}else{for(r=l.length,o=f.length,d=r<o,d&&(o=r),r=0;r<o;r++)if(l[r]!=f[r]){d=l[r]<f[r];break}a=0}for(d&&(t=l,l=f,f=t,e.s=-e.s),o=l.length,r=f.length-o;r>0;--r)l[o++]=0;for(r=f.length;r>a;){if(l[--r]<f[r]){for(i=r;i&&l[--i]===0;)l[i]=Hs-1;--l[i],l[r]+=Hs}l[r]-=f[r]}for(;l[--o]===0;)l.pop();for(;l[0]===0;l.shift())--n;return l[0]?(e.d=l,e.e=Zs(l,n),K?$(e,s,c):e):new m(c===3?-0:0)},X.modulo=X.mod=function(e){var t,n=this,r=n.constructor;return e=new r(e),!n.d||!e.s||e.d&&!e.d[0]?new r(NaN):!e.d||n.d&&!n.d[0]?$(new r(n),r.precision,r.rounding):(K=!1,r.modulo==9?(t=Q(n,e.abs(),0,3,1),t.s*=e.s):t=Q(n,e,0,r.modulo,1),t=t.times(e),K=!0,n.minus(t))},X.naturalExponential=X.exp=function(){return ac(this)},X.naturalLogarithm=X.ln=function(){return oc(this)},X.negated=X.neg=function(){var e=new this.constructor(this);return e.s=-e.s,$(e)},X.plus=X.add=function(e){var t,n,r,i,a,o,s,c,l,u,d=this,f=d.constructor;if(e=new f(e),!d.d||!e.d)return!d.s||!e.s?e=new f(NaN):d.d||(e=new f(e.d||d.s===e.s?d:NaN)),e;if(d.s!=e.s)return e.s=-e.s,d.minus(e);if(l=d.d,u=e.d,s=f.precision,c=f.rounding,!l[0]||!u[0])return u[0]||(e=new f(d)),K?$(e,s,c):e;if(a=q(d.e/Y),r=q(e.e/Y),l=l.slice(),i=a-r,i){for(i<0?(n=l,i=-i,o=u.length):(n=u,r=a,o=l.length),a=Math.ceil(s/Y),o=a>o?a+1:o+1,i>o&&(i=o,n.length=1),n.reverse();i--;)n.push(0);n.reverse()}for(o=l.length,i=u.length,o-i<0&&(i=o,n=u,u=l,l=n),t=0;i;)t=(l[--i]=l[i]+u[i]+t)/Hs|0,l[i]%=Hs;for(t&&(l.unshift(t),++r),o=l.length;l[--o]==0;)l.pop();return e.d=l,e.e=Zs(l,r),K?$(e,s,c):e},X.precision=X.sd=function(e){var t,n=this;if(e!==void 0&&e!==!!e&&e!==1&&e!==0)throw Error(Ps+e);return n.d?(t=ec(n.d),e&&n.e+1>t&&(t=n.e+1)):t=NaN,t},X.round=function(){var e=this,t=e.constructor;return $(new t(e),e.e+1,t.rounding)},X.sine=X.sin=function(){var e,t,n=this,r=n.constructor;return n.isFinite()?n.isZero()?new r(n):(e=r.precision,t=r.rounding,r.precision=e+Math.max(n.e,n.sd())+Y,r.rounding=1,n=uc(r,pc(r,n)),r.precision=e,r.rounding=t,$(Ms>2?n.neg():n,e,t,!0)):new r(NaN)},X.squareRoot=X.sqrt=function(){var e,t,n,r,i,a,o=this,s=o.d,c=o.e,l=o.s,u=o.constructor;if(l!==1||!s||!s[0])return new u(!l||l<0&&(!s||s[0])?NaN:s?o:1/0);for(K=!1,l=Math.sqrt(+o),l==0||l==1/0?(t=Z(s),(t.length+c)%2==0&&(t+=`0`),l=Math.sqrt(t),c=q((c+1)/2)-(c<0||c%2),l==1/0?t=`5e`+c:(t=l.toExponential(),t=t.slice(0,t.indexOf(`e`)+1)+c),r=new u(t)):r=new u(l.toString()),n=(c=u.precision)+3;;)if(a=r,r=a.plus(Q(o,a,n+2,1)).times(.5),Z(a.d).slice(0,n)===(t=Z(r.d)).slice(0,n))if(t=t.slice(n-3,n+1),t==`9999`||!i&&t==`4999`){if(!i&&($(a,c+1,0),a.times(a).eq(o))){r=a;break}n+=4,i=1}else{(!+t||!+t.slice(1)&&t.charAt(0)==`5`)&&($(r,c+1,1),e=!r.times(r).eq(o));break}return K=!0,$(r,c,u.rounding,e)},X.tangent=X.tan=function(){var e,t,n=this,r=n.constructor;return n.isFinite()?n.isZero()?new r(n):(e=r.precision,t=r.rounding,r.precision=e+10,r.rounding=1,n=n.sin(),n.s=1,n=Q(n,new r(1).minus(n.times(n)).sqrt(),e+10,0),r.precision=e,r.rounding=t,$(Ms==2||Ms==4?n.neg():n,e,t,!0)):new r(NaN)},X.times=X.mul=function(e){var t,n,r,i,a,o,s,c,l,u=this,d=u.constructor,f=u.d,p=(e=new d(e)).d;if(e.s*=u.s,!f||!f[0]||!p||!p[0])return new d(!e.s||f&&!f[0]&&!p||p&&!p[0]&&!f?NaN:!f||!p?e.s/0:e.s*0);for(n=q(u.e/Y)+q(e.e/Y),c=f.length,l=p.length,c<l&&(a=f,f=p,p=a,o=c,c=l,l=o),a=[],o=c+l,r=o;r--;)a.push(0);for(r=l;--r>=0;){for(t=0,i=c+r;i>r;)s=a[i]+p[r]*f[i-r-1]+t,a[i--]=s%Hs|0,t=s/Hs|0;a[i]=(a[i]+t)%Hs|0}for(;!a[--o];)a.pop();return t?++n:a.shift(),e.d=a,e.e=Zs(a,n),K?$(e,d.precision,d.rounding):e},X.toBinary=function(e,t){return mc(this,2,e,t)},X.toDecimalPlaces=X.toDP=function(e,t){var n=this,r=n.constructor;return n=new r(n),e===void 0?n:(Ks(e,0,Es),t===void 0?t=r.rounding:Ks(t,0,8),$(n,e+n.e+1,t))},X.toExponential=function(e,t){var n,r=this,i=r.constructor;return e===void 0?n=Xs(r,!0):(Ks(e,0,Es),t===void 0?t=i.rounding:Ks(t,0,8),r=$(new i(r),e+1,t),n=Xs(r,!0,e+1)),r.isNeg()&&!r.isZero()?`-`+n:n},X.toFixed=function(e,t){var n,r,i=this,a=i.constructor;return e===void 0?n=Xs(i):(Ks(e,0,Es),t===void 0?t=a.rounding:Ks(t,0,8),r=$(new a(i),e+i.e+1,t),n=Xs(r,!1,e+r.e+1)),i.isNeg()&&!i.isZero()?`-`+n:n},X.toFraction=function(e){var t,n,r,i,a,o,s,c,l,u,d,f,p=this,m=p.d,h=p.constructor;if(!m)return new h(p);if(l=n=new h(1),r=c=new h(0),t=new h(r),a=t.e=ec(m)-p.e-1,o=a%Y,t.d[0]=J(10,o<0?Y+o:o),e==null)e=a>0?t:l;else{if(s=new h(e),!s.isInt()||s.lt(l))throw Error(Ps+s);e=s.gt(t)?a>0?t:l:s}for(K=!1,s=new h(Z(m)),u=h.precision,h.precision=a=m.length*Y*2;d=Q(s,t,0,1,1),i=n.plus(d.times(r)),i.cmp(e)!=1;)n=r,r=i,i=l,l=c.plus(d.times(i)),c=i,i=t,t=s.minus(d.times(i)),s=i;return i=Q(e.minus(n),r,0,1,1),c=c.plus(i.times(l)),n=n.plus(i.times(r)),c.s=l.s=p.s,f=Q(l,r,a,1).minus(p).abs().cmp(Q(c,n,a,1).minus(p).abs())<1?[l,r]:[c,n],h.precision=u,K=!0,f},X.toHexadecimal=X.toHex=function(e,t){return mc(this,16,e,t)},X.toNearest=function(e,t){var n=this,r=n.constructor;if(n=new r(n),e==null){if(!n.d)return n;e=new r(1),t=r.rounding}else{if(e=new r(e),t===void 0?t=r.rounding:Ks(t,0,8),!n.d)return e.s?n:e;if(!e.d)return e.s&&=n.s,e}return e.d[0]?(K=!1,n=Q(n,e,0,t,1).times(e),K=!0,$(n)):(e.s=n.s,n=e),n},X.toNumber=function(){return+this},X.toOctal=function(e,t){return mc(this,8,e,t)},X.toPower=X.pow=function(e){var t,n,r,i,a,o,s=this,c=s.constructor,l=+(e=new c(e));if(!s.d||!e.d||!s.d[0]||!e.d[0])return new c(J(+s,l));if(s=new c(s),s.eq(1))return s;if(r=c.precision,a=c.rounding,e.eq(1))return $(s,r,a);if(t=q(e.e/Y),t>=e.d.length-1&&(n=l<0?-l:l)<=Us)return i=nc(c,s,n,r),e.s<0?new c(1).div(i):$(i,r,a);if(o=s.s,o<0){if(t<e.d.length-1)return new c(NaN);if(e.d[t]&1||(o=1),s.e==0&&s.d[0]==1&&s.d.length==1)return s.s=o,s}return n=J(+s,l),t=n==0||!isFinite(n)?q(l*(Math.log(`0.`+Z(s.d))/Math.LN10+s.e+1)):new c(n+``).e,t>c.maxE+1||t<c.minE-1?new c(t>0?o/0:0):(K=!1,c.rounding=s.s=1,n=Math.min(12,(t+``).length),i=ac(e.times(oc(s,r+n)),r),i.d&&(i=$(i,r+5,1),qs(i.d,r,a)&&(t=r+10,i=$(ac(e.times(oc(s,t+n)),t),t+5,1),+Z(i.d).slice(r+1,r+15)+1==0x5af3107a4000&&(i=$(i,r+1,0)))),i.s=o,K=!0,c.rounding=a,$(i,r,a))},X.toPrecision=function(e,t){var n,r=this,i=r.constructor;return e===void 0?n=Xs(r,r.e<=i.toExpNeg||r.e>=i.toExpPos):(Ks(e,1,Es),t===void 0?t=i.rounding:Ks(t,0,8),r=$(new i(r),e,t),n=Xs(r,e<=r.e||r.e<=i.toExpNeg,e)),r.isNeg()&&!r.isZero()?`-`+n:n},X.toSignificantDigits=X.toSD=function(e,t){var n=this,r=n.constructor;return e===void 0?(e=r.precision,t=r.rounding):(Ks(e,1,Es),t===void 0?t=r.rounding:Ks(t,0,8)),$(new r(n),e,t)},X.toString=function(){var e=this,t=e.constructor,n=Xs(e,e.e<=t.toExpNeg||e.e>=t.toExpPos);return e.isNeg()&&!e.isZero()?`-`+n:n},X.truncated=X.trunc=function(){return $(new this.constructor(this),this.e+1,1)},X.valueOf=X.toJSON=function(){var e=this,t=e.constructor,n=Xs(e,e.e<=t.toExpNeg||e.e>=t.toExpPos);return e.isNeg()?`-`+n:n};function Z(e){var t,n,r,i=e.length-1,a=``,o=e[0];if(i>0){for(a+=o,t=1;t<i;t++)r=e[t]+``,n=Y-r.length,n&&(a+=tc(n)),a+=r;o=e[t],r=o+``,n=Y-r.length,n&&(a+=tc(n))}else if(o===0)return`0`;for(;o%10==0;)o/=10;return a+o}function Ks(e,t,n){if(e!==~~e||e<t||e>n)throw Error(Ps+e)}function qs(e,t,n,r){var i,a,o,s;for(a=e[0];a>=10;a/=10)--t;return--t<0?(t+=Y,i=0):(i=Math.ceil((t+1)/Y),t%=Y),a=J(10,Y-t),s=e[i]%a|0,r==null?t<3?(t==0?s=s/100|0:t==1&&(s=s/10|0),o=n<4&&s==99999||n>3&&s==49999||s==5e4||s==0):o=(n<4&&s+1==a||n>3&&s+1==a/2)&&(e[i+1]/a/100|0)==J(10,t-2)-1||(s==a/2||s==0)&&(e[i+1]/a/100|0)==0:t<4?(t==0?s=s/1e3|0:t==1?s=s/100|0:t==2&&(s=s/10|0),o=(r||n<4)&&s==9999||!r&&n>3&&s==4999):o=((r||n<4)&&s+1==a||!r&&n>3&&s+1==a/2)&&(e[i+1]/a/1e3|0)==J(10,t-3)-1,o}function Js(e,t,n){for(var r,i=[0],a,o=0,s=e.length;o<s;){for(a=i.length;a--;)i[a]*=t;for(i[0]+=Ds.indexOf(e.charAt(o++)),r=0;r<i.length;r++)i[r]>n-1&&(i[r+1]===void 0&&(i[r+1]=0),i[r+1]+=i[r]/n|0,i[r]%=n)}return i.reverse()}function Ys(e,t){var n,r,i;if(t.isZero())return t;r=t.d.length,r<32?(n=Math.ceil(r/3),i=(1/fc(4,n)).toString()):(n=16,i=`2.3283064365386962890625e-10`),e.precision+=n,t=dc(e,1,t.times(i),new e(1));for(var a=n;a--;){var o=t.times(t);t=o.times(o).minus(o).times(8).plus(1)}return e.precision-=n,t}var Q=(function(){function e(e,t,n){var r,i=0,a=e.length;for(e=e.slice();a--;)r=e[a]*t+i,e[a]=r%n|0,i=r/n|0;return i&&e.unshift(i),e}function t(e,t,n,r){var i,a;if(n!=r)a=n>r?1:-1;else for(i=a=0;i<n;i++)if(e[i]!=t[i]){a=e[i]>t[i]?1:-1;break}return a}function n(e,t,n,r){for(var i=0;n--;)e[n]-=i,i=+(e[n]<t[n]),e[n]=i*r+e[n]-t[n];for(;!e[0]&&e.length>1;)e.shift()}return function(r,i,a,o,s,c){var l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,ee,E,D,O=r.constructor,k=r.s==i.s?1:-1,A=r.d,j=i.d;if(!A||!A[0]||!j||!j[0])return new O(!r.s||!i.s||(A?j&&A[0]==j[0]:!j)?NaN:A&&A[0]==0||!j?k*0:k/0);for(c?(p=1,u=r.e-i.e):(c=Hs,p=Y,u=q(r.e/p)-q(i.e/p)),E=j.length,T=A.length,_=new O(k),v=_.d=[],d=0;j[d]==(A[d]||0);d++);if(j[d]>(A[d]||0)&&u--,a==null?(S=a=O.precision,o=O.rounding):S=s?a+(r.e-i.e)+1:a,S<0)v.push(1),m=!0;else{if(S=S/p+2|0,d=0,E==1){for(f=0,j=j[0],S++;(d<T||f)&&S--;d++)C=f*c+(A[d]||0),v[d]=C/j|0,f=C%j|0;m=f||d<T}else{for(f=c/(j[0]+1)|0,f>1&&(j=e(j,f,c),A=e(A,f,c),E=j.length,T=A.length),w=E,y=A.slice(0,E),b=y.length;b<E;)y[b++]=0;D=j.slice(),D.unshift(0),ee=j[0],j[1]>=c/2&&++ee;do f=0,l=t(j,y,E,b),l<0?(x=y[0],E!=b&&(x=x*c+(y[1]||0)),f=x/ee|0,f>1?(f>=c&&(f=c-1),h=e(j,f,c),g=h.length,b=y.length,l=t(h,y,g,b),l==1&&(f--,n(h,E<g?D:j,g,c))):(f==0&&(l=f=1),h=j.slice()),g=h.length,g<b&&h.unshift(0),n(y,h,b,c),l==-1&&(b=y.length,l=t(j,y,E,b),l<1&&(f++,n(y,E<b?D:j,b,c))),b=y.length):l===0&&(f++,y=[0]),v[d++]=f,l&&y[0]?y[b++]=A[w]||0:(y=[A[w]],b=1);while((w++<T||y[0]!==void 0)&&S--);m=y[0]!==void 0}v[0]||v.shift()}if(p==1)_.e=u,js=m;else{for(d=1,f=v[0];f>=10;f/=10)d++;_.e=d+u*p-1,$(_,s?a+_.e+1:a,o,m)}return _}})();function $(e,t,n,r){var i,a,o,s,c,l,u,d,f,p=e.constructor;out:if(t!=null){if(d=e.d,!d)return e;for(i=1,s=d[0];s>=10;s/=10)i++;if(a=t-i,a<0)a+=Y,o=t,u=d[f=0],c=u/J(10,i-o-1)%10|0;else if(f=Math.ceil((a+1)/Y),s=d.length,f>=s)if(r){for(;s++<=f;)d.push(0);u=c=0,i=1,a%=Y,o=a-Y+1}else break out;else{for(u=s=d[f],i=1;s>=10;s/=10)i++;a%=Y,o=a-Y+i,c=o<0?0:u/J(10,i-o-1)%10|0}if(r=r||t<0||d[f+1]!==void 0||(o<0?u:u%J(10,i-o-1)),l=n<4?(c||r)&&(n==0||n==(e.s<0?3:2)):c>5||c==5&&(n==4||r||n==6&&(a>0?o>0?u/J(10,i-o):0:d[f-1])%10&1||n==(e.s<0?8:7)),t<1||!d[0])return d.length=0,l?(t-=e.e+1,d[0]=J(10,(Y-t%Y)%Y),e.e=-t||0):d[0]=e.e=0,e;if(a==0?(d.length=f,s=1,f--):(d.length=f+1,s=J(10,Y-a),d[f]=o>0?(u/J(10,i-o)%J(10,o)|0)*s:0),l)for(;;)if(f==0){for(a=1,o=d[0];o>=10;o/=10)a++;for(o=d[0]+=s,s=1;o>=10;o/=10)s++;a!=s&&(e.e++,d[0]==Hs&&(d[0]=1));break}else{if(d[f]+=s,d[f]!=Hs)break;d[f--]=0,s=1}for(a=d.length;d[--a]===0;)d.pop()}return K&&(e.e>p.maxE?(e.d=null,e.e=NaN):e.e<p.minE&&(e.e=0,e.d=[0])),e}function Xs(e,t,n){if(!e.isFinite())return sc(e);var r,i=e.e,a=Z(e.d),o=a.length;return t?(n&&(r=n-o)>0?a=a.charAt(0)+`.`+a.slice(1)+tc(r):o>1&&(a=a.charAt(0)+`.`+a.slice(1)),a=a+(e.e<0?`e`:`e+`)+e.e):i<0?(a=`0.`+tc(-i-1)+a,n&&(r=n-o)>0&&(a+=tc(r))):i>=o?(a+=tc(i+1-o),n&&(r=n-i-1)>0&&(a=a+`.`+tc(r))):((r=i+1)<o&&(a=a.slice(0,r)+`.`+a.slice(r)),n&&(r=n-o)>0&&(i+1===o&&(a+=`.`),a+=tc(r))),a}function Zs(e,t){var n=e[0];for(t*=Y;n>=10;n/=10)t++;return t}function Qs(e,t,n){if(t>Ws)throw K=!0,n&&(e.precision=n),Error(Fs);return $(new e(Os),t,1,!0)}function $s(e,t,n){if(t>Gs)throw Error(Fs);return $(new e(ks),t,n,!0)}function ec(e){var t=e.length-1,n=t*Y+1;if(t=e[t],t){for(;t%10==0;t/=10)n--;for(t=e[0];t>=10;t/=10)n++}return n}function tc(e){for(var t=``;e--;)t+=`0`;return t}function nc(e,t,n,r){var i,a=new e(1),o=Math.ceil(r/Y+4);for(K=!1;;){if(n%2&&(a=a.times(t),hc(a.d,o)&&(i=!0)),n=q(n/2),n===0){n=a.d.length-1,i&&a.d[n]===0&&++a.d[n];break}t=t.times(t),hc(t.d,o)}return K=!0,a}function rc(e){return e.d[e.d.length-1]&1}function ic(e,t,n){for(var r,i,a=new e(t[0]),o=0;++o<t.length;){if(i=new e(t[o]),!i.s){a=i;break}r=a.cmp(i),(r===n||r===0&&a.s===n)&&(a=i)}return a}function ac(e,t){var n,r,i,a,o,s,c,l=0,u=0,d=0,f=e.constructor,p=f.rounding,m=f.precision;if(!e.d||!e.d[0]||e.e>17)return new f(e.d?e.d[0]?e.s<0?0:1/0:1:e.s?e.s<0?0:e:NaN);for(t==null?(K=!1,c=m):c=t,s=new f(.03125);e.e>-2;)e=e.times(s),d+=5;for(r=Math.log(J(2,d))/Math.LN10*2+5|0,c+=r,n=a=o=new f(1),f.precision=c;;){if(a=$(a.times(e),c,1),n=n.times(++u),s=o.plus(Q(a,n,c,1)),Z(s.d).slice(0,c)===Z(o.d).slice(0,c)){for(i=d;i--;)o=$(o.times(o),c,1);if(t==null)if(l<3&&qs(o.d,c-r,p,l))f.precision=c+=10,n=a=s=new f(1),u=0,l++;else return $(o,f.precision=m,p,K=!0);else return f.precision=m,o}o=s}}function oc(e,t){var n,r,i,a,o,s,c,l,u,d,f,p=1,m=10,h=e,g=h.d,_=h.constructor,v=_.rounding,y=_.precision;if(h.s<0||!g||!g[0]||!h.e&&g[0]==1&&g.length==1)return new _(g&&!g[0]?-1/0:h.s==1?g?0:h:NaN);if(t==null?(K=!1,u=y):u=t,_.precision=u+=m,n=Z(g),r=n.charAt(0),Math.abs(a=h.e)<0x5543df729c000){for(;r<7&&r!=1||r==1&&n.charAt(1)>3;)h=h.times(e),n=Z(h.d),r=n.charAt(0),p++;a=h.e,r>1?(h=new _(`0.`+n),a++):h=new _(r+`.`+n.slice(1))}else return l=Qs(_,u+2,y).times(a+``),h=oc(new _(r+`.`+n.slice(1)),u-m).plus(l),_.precision=y,t==null?$(h,y,v,K=!0):h;for(d=h,c=o=h=Q(h.minus(1),h.plus(1),u,1),f=$(h.times(h),u,1),i=3;;){if(o=$(o.times(f),u,1),l=c.plus(Q(o,new _(i),u,1)),Z(l.d).slice(0,u)===Z(c.d).slice(0,u))if(c=c.times(2),a!==0&&(c=c.plus(Qs(_,u+2,y).times(a+``))),c=Q(c,new _(p),u,1),t==null)if(qs(c.d,u-m,v,s))_.precision=u+=m,l=o=h=Q(d.minus(1),d.plus(1),u,1),f=$(h.times(h),u,1),i=s=1;else return $(c,_.precision=y,v,K=!0);else return _.precision=y,c;c=l,i+=2}}function sc(e){return String(e.s*e.s/0)}function cc(e,t){var n,r,i;for((n=t.indexOf(`.`))>-1&&(t=t.replace(`.`,``)),(r=t.search(/e/i))>0?(n<0&&(n=r),n+=+t.slice(r+1),t=t.substring(0,r)):n<0&&(n=t.length),r=0;t.charCodeAt(r)===48;r++);for(i=t.length;t.charCodeAt(i-1)===48;--i);if(t=t.slice(r,i),t){if(i-=r,e.e=n=n-r-1,e.d=[],r=(n+1)%Y,n<0&&(r+=Y),r<i){for(r&&e.d.push(+t.slice(0,r)),i-=Y;r<i;)e.d.push(+t.slice(r,r+=Y));t=t.slice(r),r=Y-t.length}else r-=i;for(;r--;)t+=`0`;e.d.push(+t),K&&(e.e>e.constructor.maxE?(e.d=null,e.e=NaN):e.e<e.constructor.minE&&(e.e=0,e.d=[0]))}else e.e=0,e.d=[0];return e}function lc(e,t){var n,r,i,a,o,s,c,l,u;if(t.indexOf(`_`)>-1){if(t=t.replace(/(\d)_(?=\d)/g,`$1`),Vs.test(t))return cc(e,t)}else if(t===`Infinity`||t===`NaN`)return+t||(e.s=NaN),e.e=NaN,e.d=null,e;if(zs.test(t))n=16,t=t.toLowerCase();else if(Rs.test(t))n=2;else if(Bs.test(t))n=8;else throw Error(Ps+t);for(a=t.search(/p/i),a>0?(c=+t.slice(a+1),t=t.substring(2,a)):t=t.slice(2),a=t.indexOf(`.`),o=a>=0,r=e.constructor,o&&(t=t.replace(`.`,``),s=t.length,a=s-a,i=nc(r,new r(n),a,a*2)),l=Js(t,n,Hs),u=l.length-1,a=u;l[a]===0;--a)l.pop();return a<0?new r(e.s*0):(e.e=Zs(l,u),e.d=l,K=!1,o&&(e=Q(e,i,s*4)),c&&(e=e.times(Math.abs(c)<54?J(2,c):rl.pow(2,c))),K=!0,e)}function uc(e,t){var n,r=t.d.length;if(r<3)return t.isZero()?t:dc(e,2,t,t);n=1.4*Math.sqrt(r),n=n>16?16:n|0,t=t.times(1/fc(5,n)),t=dc(e,2,t,t);for(var i,a=new e(5),o=new e(16),s=new e(20);n--;)i=t.times(t),t=t.times(a.plus(i.times(o.times(i).minus(s))));return t}function dc(e,t,n,r,i){var a,o,s,c,l=1,u=e.precision,d=Math.ceil(u/Y);for(K=!1,c=n.times(n),s=new e(r);;){if(o=Q(s.times(c),new e(t++*t++),u,1),s=i?r.plus(o):r.minus(o),r=Q(o.times(c),new e(t++*t++),u,1),o=s.plus(r),o.d[d]!==void 0){for(a=d;o.d[a]===s.d[a]&&a--;);if(a==-1)break}a=s,s=r,r=o,o=a,l++}return K=!0,o.d.length=d+1,o}function fc(e,t){for(var n=e;--t;)n*=e;return n}function pc(e,t){var n,r=t.s<0,i=$s(e,e.precision,1),a=i.times(.5);if(t=t.abs(),t.lte(a))return Ms=r?4:1,t;if(n=t.divToInt(i),n.isZero())Ms=r?3:2;else{if(t=t.minus(n.times(i)),t.lte(a))return Ms=rc(n)?r?2:3:r?4:1,t;Ms=rc(n)?r?1:4:r?3:2}return t.minus(i).abs()}function mc(e,t,n,r){var i,a,o,s,c,l,u,d,f,p=e.constructor,m=n!==void 0;if(m?(Ks(n,1,Es),r===void 0?r=p.rounding:Ks(r,0,8)):(n=p.precision,r=p.rounding),!e.isFinite())u=sc(e);else{for(u=Xs(e),o=u.indexOf(`.`),m?(i=2,t==16?n=n*4-3:t==8&&(n=n*3-2)):i=t,o>=0&&(u=u.replace(`.`,``),f=new p(1),f.e=u.length-o,f.d=Js(Xs(f),10,i),f.e=f.d.length),d=Js(u,10,i),a=c=d.length;d[--c]==0;)d.pop();if(!d[0])u=m?`0p+0`:`0`;else{if(o<0?a--:(e=new p(e),e.d=d,e.e=a,e=Q(e,f,n,r,0,i),d=e.d,a=e.e,l=js),o=d[n],s=i/2,l||=d[n+1]!==void 0,l=r<4?(o!==void 0||l)&&(r===0||r===(e.s<0?3:2)):o>s||o===s&&(r===4||l||r===6&&d[n-1]&1||r===(e.s<0?8:7)),d.length=n,l)for(;++d[--n]>i-1;)d[n]=0,n||(++a,d.unshift(1));for(c=d.length;!d[c-1];--c);for(o=0,u=``;o<c;o++)u+=Ds.charAt(d[o]);if(m){if(c>1)if(t==16||t==8){for(o=t==16?4:3,--c;c%o;c++)u+=`0`;for(d=Js(u,i,t),c=d.length;!d[c-1];--c);for(o=1,u=`1.`;o<c;o++)u+=Ds.charAt(d[o])}else u=u.charAt(0)+`.`+u.slice(1);u=u+(a<0?`p`:`p+`)+a}else if(a<0){for(;++a;)u=`0`+u;u=`0.`+u}else if(++a>c)for(a-=c;a--;)u+=`0`;else a<c&&(u=u.slice(0,a)+`.`+u.slice(a))}u=(t==16?`0x`:t==2?`0b`:t==8?`0o`:``)+u}return e.s<0?`-`+u:u}function hc(e,t){if(e.length>t)return e.length=t,!0}function gc(e){return new this(e).abs()}function _c(e){return new this(e).acos()}function vc(e){return new this(e).acosh()}function yc(e,t){return new this(e).plus(t)}function bc(e){return new this(e).asin()}function xc(e){return new this(e).asinh()}function Sc(e){return new this(e).atan()}function Cc(e){return new this(e).atanh()}function wc(e,t){e=new this(e),t=new this(t);var n,r=this.precision,i=this.rounding,a=r+4;return!e.s||!t.s?n=new this(NaN):!e.d&&!t.d?(n=$s(this,a,1).times(t.s>0?.25:.75),n.s=e.s):!t.d||e.isZero()?(n=t.s<0?$s(this,r,i):new this(0),n.s=e.s):!e.d||t.isZero()?(n=$s(this,a,1).times(.5),n.s=e.s):t.s<0?(this.precision=a,this.rounding=1,n=this.atan(Q(e,t,a,1)),t=$s(this,a,1),this.precision=r,this.rounding=i,n=e.s<0?n.minus(t):n.plus(t)):n=this.atan(Q(e,t,a,1)),n}function Tc(e){return new this(e).cbrt()}function Ec(e){return $(e=new this(e),e.e+1,2)}function Dc(e,t,n){return new this(e).clamp(t,n)}function Oc(e){if(!e||typeof e!=`object`)throw Error(Ns+`Object expected`);var t,n,r,i=e.defaults===!0,a=[`precision`,1,Es,`rounding`,0,8,`toExpNeg`,-Ts,0,`toExpPos`,0,Ts,`maxE`,0,Ts,`minE`,-Ts,0,`modulo`,0,9];for(t=0;t<a.length;t+=3)if(n=a[t],i&&(this[n]=As[n]),(r=e[n])!==void 0)if(q(r)===r&&r>=a[t+1]&&r<=a[t+2])this[n]=r;else throw Error(Ps+n+`: `+r);if(n=`crypto`,i&&(this[n]=As[n]),(r=e[n])!==void 0)if(r===!0||r===!1||r===0||r===1)if(r)if(typeof crypto<`u`&&crypto&&(crypto.getRandomValues||crypto.randomBytes))this[n]=!0;else throw Error(Is);else this[n]=!1;else throw Error(Ps+n+`: `+r);return this}function kc(e){return new this(e).cos()}function Ac(e){return new this(e).cosh()}function jc(e){var t,n,r;function i(e){var t,n,r,a=this;if(!(a instanceof i))return new i(e);if(a.constructor=i,Ic(e)){a.s=e.s,K?!e.d||e.e>i.maxE?(a.e=NaN,a.d=null):e.e<i.minE?(a.e=0,a.d=[0]):(a.e=e.e,a.d=e.d.slice()):(a.e=e.e,a.d=e.d?e.d.slice():e.d);return}if(r=typeof e,r===`number`){if(e===0){a.s=1/e<0?-1:1,a.e=0,a.d=[0];return}if(e<0?(e=-e,a.s=-1):a.s=1,e===~~e&&e<1e7){for(t=0,n=e;n>=10;n/=10)t++;K?t>i.maxE?(a.e=NaN,a.d=null):t<i.minE?(a.e=0,a.d=[0]):(a.e=t,a.d=[e]):(a.e=t,a.d=[e]);return}if(e*0!=0){e||(a.s=NaN),a.e=NaN,a.d=null;return}return cc(a,e.toString())}if(r===`string`)return(n=e.charCodeAt(0))===45?(e=e.slice(1),a.s=-1):(n===43&&(e=e.slice(1)),a.s=1),Vs.test(e)?cc(a,e):lc(a,e);if(r===`bigint`)return e<0?(e=-e,a.s=-1):a.s=1,cc(a,e.toString());throw Error(Ps+e)}if(i.prototype=X,i.ROUND_UP=0,i.ROUND_DOWN=1,i.ROUND_CEIL=2,i.ROUND_FLOOR=3,i.ROUND_HALF_UP=4,i.ROUND_HALF_DOWN=5,i.ROUND_HALF_EVEN=6,i.ROUND_HALF_CEIL=7,i.ROUND_HALF_FLOOR=8,i.EUCLID=9,i.config=i.set=Oc,i.clone=jc,i.isDecimal=Ic,i.abs=gc,i.acos=_c,i.acosh=vc,i.add=yc,i.asin=bc,i.asinh=xc,i.atan=Sc,i.atanh=Cc,i.atan2=wc,i.cbrt=Tc,i.ceil=Ec,i.clamp=Dc,i.cos=kc,i.cosh=Ac,i.div=Mc,i.exp=Nc,i.floor=Pc,i.hypot=Fc,i.ln=Lc,i.log=Rc,i.log10=Bc,i.log2=zc,i.max=Vc,i.min=Hc,i.mod=Uc,i.mul=Wc,i.pow=Gc,i.random=Kc,i.round=qc,i.sign=Jc,i.sin=Yc,i.sinh=Xc,i.sqrt=Zc,i.sub=Qc,i.sum=$c,i.tan=el,i.tanh=tl,i.trunc=nl,e===void 0&&(e={}),e&&e.defaults!==!0)for(r=[`precision`,`rounding`,`toExpNeg`,`toExpPos`,`maxE`,`minE`,`modulo`,`crypto`],t=0;t<r.length;)e.hasOwnProperty(n=r[t++])||(e[n]=this[n]);return i.config(e),i}function Mc(e,t){return new this(e).div(t)}function Nc(e){return new this(e).exp()}function Pc(e){return $(e=new this(e),e.e+1,3)}function Fc(){var e,t,n=new this(0);for(K=!1,e=0;e<arguments.length;)if(t=new this(arguments[e++]),t.d)n.d&&(n=n.plus(t.times(t)));else{if(t.s)return K=!0,new this(1/0);n=t}return K=!0,n.sqrt()}function Ic(e){return e instanceof rl||e&&e.toStringTag===Ls||!1}function Lc(e){return new this(e).ln()}function Rc(e,t){return new this(e).log(t)}function zc(e){return new this(e).log(2)}function Bc(e){return new this(e).log(10)}function Vc(){return ic(this,arguments,-1)}function Hc(){return ic(this,arguments,1)}function Uc(e,t){return new this(e).mod(t)}function Wc(e,t){return new this(e).mul(t)}function Gc(e,t){return new this(e).pow(t)}function Kc(e){var t,n,r,i,a=0,o=new this(1),s=[];if(e===void 0?e=this.precision:Ks(e,1,Es),r=Math.ceil(e/Y),!this.crypto)for(;a<r;)s[a++]=Math.random()*1e7|0;else if(crypto.getRandomValues)for(t=crypto.getRandomValues(new Uint32Array(r));a<r;)i=t[a],i>=429e7?t[a]=crypto.getRandomValues(new Uint32Array(1))[0]:s[a++]=i%1e7;else if(crypto.randomBytes){for(t=crypto.randomBytes(r*=4);a<r;)i=t[a]+(t[a+1]<<8)+(t[a+2]<<16)+((t[a+3]&127)<<24),i>=214e7?crypto.randomBytes(4).copy(t,a):(s.push(i%1e7),a+=4);a=r/4}else throw Error(Is);for(r=s[--a],e%=Y,r&&e&&(i=J(10,Y-e),s[a]=(r/i|0)*i);s[a]===0;a--)s.pop();if(a<0)n=0,s=[0];else{for(n=-1;s[0]===0;n-=Y)s.shift();for(r=1,i=s[0];i>=10;i/=10)r++;r<Y&&(n-=Y-r)}return o.e=n,o.d=s,o}function qc(e){return $(e=new this(e),e.e+1,this.rounding)}function Jc(e){return e=new this(e),e.d?e.d[0]?e.s:0*e.s:e.s||NaN}function Yc(e){return new this(e).sin()}function Xc(e){return new this(e).sinh()}function Zc(e){return new this(e).sqrt()}function Qc(e,t){return new this(e).sub(t)}function $c(){var e=0,t=arguments,n=new this(t[e]);for(K=!1;n.s&&++e<t.length;)n=n.plus(t[e]);return K=!0,$(n,this.precision,this.rounding)}function el(e){return new this(e).tan()}function tl(e){return new this(e).tanh()}function nl(e){return $(e=new this(e),e.e+1,1)}X[Symbol.for(`nodejs.util.inspect.custom`)]=X.toString,X[Symbol.toStringTag]=`Decimal`;var rl=X.constructor=jc(As);Os=new rl(Os),ks=new rl(ks);var il=`1e-35`,al=`8`,ol=40,sl=340;function cl(e){return Number.isFinite(e)&&e>=1e4}function ll(e){let t=new rl(e).e;return Math.min(sl,Math.max(50,Math.max(0,-t)+ol))}function ul(e){return rl.clone({precision:ll(e),rounding:rl.ROUND_HALF_EVEN,toExpNeg:-1e3,toExpPos:1e3})}function dl(e,t){return e.toSignificantDigits(t).toString()}function fl(e,t){let n=Number.isFinite(t)&&t>0?Math.max(Number(il),Math.min(Number(al),t)):Number(il);return{center:[String(e[0]),String(e[1])],scale:String(n)}}function pl(e,t=il){let n=ul(e.scale),r=ll(e.scale),i=n.min(al,n.max(il,new n(t))),a=n.max(i,n.min(al,new n(e.scale)));return{center:e.center,scale:dl(a,r)}}function ml(e){return{center:[Number(e.center[0]),Number(e.center[1])],scale:Number(e.scale)}}function hl(e,t){let n=ul(e.scale),r=ll(e.scale),i=new n(e.scale);return{center:[dl(new n(e.center[0]).plus(i.times(t[0].toString())),r),dl(new n(e.center[1]).plus(i.times(t[1].toString())),r)],scale:e.scale}}function gl(e,t,n,r,i=il){if(!Number.isFinite(r)||r<=0)return e;let a=ul(e.scale),o=ll(e.scale),s=new a(e.scale),c=a.min(al,a.max(il,new a(i))),l=s.times(r.toString());return l=a.max(c,a.min(al,l)),{center:[0,1].map(r=>dl(new a(e.center[r]).plus(s.times(t[r].toString())).minus(l.times(n[r].toString())),o)),scale:dl(l,o)}}function _l(e,t,n){return new(ul(n))(e).minus(t).toNumber()}function vl(e,t){let n=Math.max(0,-new rl(t).e),r=Math.max(6,Math.min(36,n+3));return new rl(e).toFixed(r).replace(`-`,`−`)}var yl=Cs[0];function bl(e){return Cs.find(t=>t.id===e)??yl}function xl(e){let t=bl(e).initialView;return fl(t.center,t.scale)}function Sl(e){let t=bl(e);return t.renderer===`escape-time`&&t.deepZoom?.maxMagnification!==void 0?String(t.initialView.scale/t.deepZoom.maxMagnification):il}function Cl(e,t){let n=pl(t,Sl(e.activeFormulaId)),r=ml(n);e.center=r.center,e.scale=r.scale,e.exactCenter=[n.center[0],n.center[1]],e.exactScale=n.scale}var wl=xs(`fractal`,{state:()=>{let e=xl(yl.id),t=ml(e);return{activeFormulaId:yl.id,center:t.center,scale:t.scale,exactCenter:[e.center[0],e.center[1]],exactScale:e.scale,maxIterations:yl.suggestedIterations,palette:0,colorDensity:.075,colorOffset:0,smoothColors:!0,parameterValues:ws(yl)}},getters:{activeFormula:e=>bl(e.activeFormulaId),magnification:e=>bl(e.activeFormulaId).initialView.scale/e.scale},actions:{selectFormula(e){let t=bl(e);this.activeFormulaId=t.id,Cl(this,xl(t.id)),this.maxIterations=t.suggestedIterations,this.parameterValues=ws(t)},resetCamera(){Cl(this,xl(this.activeFormulaId)),this.colorOffset=0},panByPixels(e,t,n){let r=Math.max(n,1);Cl(this,hl({center:this.exactCenter,scale:this.exactScale},[-e/r,t/r]))},panByNormalized(e){Cl(this,hl({center:this.exactCenter,scale:this.exactScale},e))},setCamera(e,t){Cl(this,fl(e,t))},setExactCamera(e){Cl(this,e)},transformCamera(e,t,n){let r={center:this.exactCenter,scale:this.exactScale},i=gl(r,e,t,n,Sl(this.activeFormulaId));(i.center[0]!==r.center[0]||i.center[1]!==r.center[1]||i.scale!==r.scale)&&Cl(this,i)},zoomFromCenter(e){this.transformCamera([0,0],[0,0],e)},setParameter(e,t){let n=this.activeFormula.parameters.find(t=>t.key===e),r=t;n?.type===`number`&&typeof t==`number`&&(r=Math.max(n.min??-1/0,Math.min(n.max??1/0,t))),this.parameterValues={...this.parameterValues,[e]:r}}}}),Tl=class extends Error{constructor(){super(`Расчёт аттрактора отменён.`),this.name=`CliffordTrajectoryCancelledError`}},El=class{#e;#t;#n=0;request(e){this.cancel();let t=++this.#n,n=new Worker(new URL(`/fractal-lab/assets/clifford.worker-HSDpcMNi.js`,``+import.meta.url),{type:`module`});return this.#e=n,new Promise((r,i)=>{this.#t=i,n.onmessage=e=>{let n=e.data;if(n.type===`error`&&n.requestId===t){this.#r(),i(Error(n.message));return}n.type===`result`&&n.result.requestId===t&&(this.#r(),r(n.result))},n.onerror=e=>{this.#r(),i(Error(e.message||`Ошибка worker аттрактора Clifford.`))},n.postMessage({...e,requestId:t})})}cancel(){if(!this.#e)return;this.#e.terminate(),this.#e=void 0;let e=this.#t;this.#t=void 0,e?.(new Tl)}#r(){this.#e?.terminate(),this.#e=void 0,this.#t=void 0}},Dl=2052,Ol=`#version 300 es
precision highp float;

const vec2 POSITIONS[3] = vec2[3](
  vec2(-1.0, -1.0),
  vec2(3.0, -1.0),
  vec2(-1.0, 3.0)
);

void main() {
  gl_Position = vec4(POSITIONS[gl_VertexID], 0.0, 1.0);
}
`;function kl(e){return e.parameters.map(e=>`uniform ${e.type===`complex`?`vec2`:`float`} ${e.uniform};`).join(`
`)}function Al(e){return`#version 300 es
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

${kl(e)}

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

  for (int i = 0; i < ${Dl}; i++) {
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
`}var jl=[`u_resolution`,`u_center`,`u_scale`,`u_maxIterations`,`u_palette`,`u_colorDensity`,`u_colorOffset`,`u_smoothColors`];function Ml(e,t,n){let r=e.createShader(t);if(!r)throw Error(`WebGL не смог создать шейдер.`);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS)){let t=e.getShaderInfoLog(r)??`Неизвестная ошибка компиляции.`;throw e.deleteShader(r),Error(`Ошибка компиляции GLSL:\n${t}`)}return r}function Nl(e,t,n){let r=Ml(e,e.VERTEX_SHADER,t),i=Ml(e,e.FRAGMENT_SHADER,n),a=e.createProgram();if(!a)throw e.deleteShader(r),e.deleteShader(i),Error(`WebGL не смог создать программу.`);if(e.attachShader(a,r),e.attachShader(a,i),e.linkProgram(a),e.deleteShader(r),e.deleteShader(i),!e.getProgramParameter(a,e.LINK_STATUS)){let t=e.getProgramInfoLog(a)??`Неизвестная ошибка линковки.`;throw e.deleteProgram(a),Error(`Ошибка линковки WebGL-программы:\n${t}`)}return a}function Pl(e,t,n){let r=e.getUniformLocation(t,n);if(r===null)throw Error(`Uniform ${n} отсутствует в шейдере.`);return r}var Fl=class{#e;#t;#n;#r;#i;#a=new Map;#o=new Map;constructor(e){let t=e.getContext(`webgl2`,{alpha:!1,antialias:!1,depth:!1,powerPreference:`high-performance`,preserveDrawingBuffer:!1,stencil:!1});if(!t)throw Error(`WebGL2 недоступен. Проверьте поддержку браузера и аппаратное ускорение.`);let n=t.createVertexArray();if(!n)throw Error(`WebGL не смог создать vertex array.`);this.#e=e,this.#t=t,this.#n=n,t.bindVertexArray(n)}setFormula(e){let t=Nl(this.#t,Ol,Al(e)),n=new Map,r=new Map;for(let e of jl)n.set(e,Pl(this.#t,t,e));for(let n of e.parameters)r.set(n.key,Pl(this.#t,t,n.uniform));this.#i&&this.#t.deleteProgram(this.#i),this.#r=e,this.#i=t,this.#a=n,this.#o=r}resize(e){let t=Math.min(window.devicePixelRatio||1,2)*e,n=Math.max(1,Math.round(this.#e.clientWidth*t)),r=Math.max(1,Math.round(this.#e.clientHeight*t));return this.#e.width===n&&this.#e.height===r?!1:(this.#e.width=n,this.#e.height=r,!0)}render(e){if(!this.#i||!this.#r)throw Error(`Формула не выбрана.`);let t=this.#t;t.disable(t.BLEND),t.viewport(0,0,this.#e.width,this.#e.height),t.useProgram(this.#i),t.bindVertexArray(this.#n),t.uniform2f(this.#a.get(`u_resolution`),this.#e.width,this.#e.height),t.uniform2f(this.#a.get(`u_center`),e.center[0],e.center[1]),t.uniform1f(this.#a.get(`u_scale`),e.scale),t.uniform1i(this.#a.get(`u_maxIterations`),e.maxIterations),t.uniform1i(this.#a.get(`u_palette`),e.palette),t.uniform1f(this.#a.get(`u_colorDensity`),e.colorDensity),t.uniform1f(this.#a.get(`u_colorOffset`),e.colorOffset),t.uniform1i(this.#a.get(`u_smoothColors`),+!!e.smoothColors);for(let n of this.#r.parameters){let r=this.#o.get(n.key),i=e.parameters[n.key];!r||i===void 0||(n.type===`complex`&&Array.isArray(i)?t.uniform2f(r,i[0],i[1]):n.type===`number`&&typeof i==`number`&&t.uniform1f(r,i))}t.drawArrays(t.TRIANGLES,0,3)}dispose(){this.#i&&=(this.#t.deleteProgram(this.#i),void 0),this.#t.deleteVertexArray(this.#n)}},Il=2048;function Ll(e){return e.parameters.map(e=>`uniform ${e.type===`complex`?`vec2`:`float`} ${e.uniform};`).join(`
`)}function Rl(e){return e.basinBackend===`newton-cubic`?`
  vec2 z = point;
  int resultKind = 0;
  int rootIndex = 0;
  int iteration = 0;
  int convergenceRefinementSteps = 0;
  float finalMetric = 1.0;
  float smoothingThreshold = max(u_convergenceTolerance, 1e-12);
  vec2 previousZ = z;
  bool hasPreviousZ = false;

  for (int i = 0; i < ${Il}; i++) {
    if (i >= u_maxIterations) {
      break;
    }

    vec2 zBeforeStep = z;
    vec2 zSquared = complexSquare(z);
    vec2 numerator = complexMultiply(zSquared, z) - vec2(1.0, 0.0);
    vec2 derivative = 3.0 * zSquared;
    float denominator = dot(derivative, derivative);
    if (denominator < 1e-20) {
      break;
    }

    vec2 correction = complexDivide(numerator, derivative, denominator);
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

  for (int i = 0; i < ${Il}; i++) {
    if (i >= u_maxIterations) {
      break;
    }

    float previousMagnitude = length(z);
    vec2 zSquared = complexSquare(z);
    vec2 numerator = complexMultiply(zSquared, z) - vec2(1.0, 0.0);
    vec2 derivative = 3.0 * zSquared;
    float denominator = dot(derivative, derivative);
    if (denominator < 1e-20) {
      break;
    }

    vec2 correction = complexDivide(numerator, derivative, denominator);
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
`}function zl(e){return e.basinBackend===`newton-cubic`?`
    colorIteration += quadraticConvergencePhase(
      finalMetric,
      smoothingThreshold,
      convergenceRefinementSteps
    );
`:`
    colorIteration += hasPreviousMetric
      ? thresholdCrossingPhase(previousMetric, finalMetric, smoothingThreshold)
      : 1.0;
`}function Bl(e){return`#version 300 es
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

${Ll(e)}

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

${Rl(e)}

  if (resultKind == 0) {
    outColor = vec4(0.012, 0.016, 0.027, 1.0);
    return;
  }

  float colorIteration = float(iteration);
  if (u_smoothColors) {
${zl(e)}
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
`}var Vl=[`u_resolution`,`u_center`,`u_scale`,`u_maxIterations`,`u_palette`,`u_colorDensity`,`u_colorOffset`,`u_smoothColors`],Hl=class{#e;#t;#n;#r;#i;#a=new Map;#o=new Map;constructor(e){let t=e.getContext(`webgl2`);if(!t)throw Error(`WebGL2 недоступен для root-basin renderer.`);let n=t.createVertexArray();if(!n)throw Error(`WebGL не смог создать root-basin vertex array.`);this.#e=e,this.#t=t,this.#n=n}setFormula(e){let t=Nl(this.#t,Ol,Bl(e)),n=new Map,r=new Map;for(let e of Vl)n.set(e,Pl(this.#t,t,e));for(let n of e.parameters)r.set(n.key,Pl(this.#t,t,n.uniform));this.#i&&this.#t.deleteProgram(this.#i),this.#r=e,this.#i=t,this.#a=n,this.#o=r}resize(e){let t=Math.min(window.devicePixelRatio||1,2)*e,n=Math.max(1,Math.round(this.#e.clientWidth*t)),r=Math.max(1,Math.round(this.#e.clientHeight*t));return this.#e.width===n&&this.#e.height===r?!1:(this.#e.width=n,this.#e.height=r,!0)}render(e){if(!this.#r||!this.#i)throw Error(`Root-basin формула не выбрана.`);let t=this.#t;t.disable(t.BLEND),t.viewport(0,0,this.#e.width,this.#e.height),t.useProgram(this.#i),t.bindVertexArray(this.#n),t.uniform2f(this.#a.get(`u_resolution`),this.#e.width,this.#e.height),t.uniform2f(this.#a.get(`u_center`),e.center[0],e.center[1]),t.uniform1f(this.#a.get(`u_scale`),e.scale),t.uniform1i(this.#a.get(`u_maxIterations`),e.maxIterations),t.uniform1i(this.#a.get(`u_palette`),e.palette),t.uniform1f(this.#a.get(`u_colorDensity`),e.colorDensity),t.uniform1f(this.#a.get(`u_colorOffset`),e.colorOffset),t.uniform1i(this.#a.get(`u_smoothColors`),+!!e.smoothColors),this.#s(e.parameters),t.drawArrays(t.TRIANGLES,0,3)}dispose(){this.#i&&=(this.#t.deleteProgram(this.#i),void 0),this.#t.deleteVertexArray(this.#n)}#s(e){for(let t of this.#r.parameters){let n=this.#o.get(t.key),r=e[t.key];!n||r===void 0||(t.type===`complex`&&Array.isArray(r)?this.#t.uniform2f(n,r[0],r[1]):t.type===`number`&&typeof r==`number`&&this.#t.uniform1f(n,r))}}},Ul=`#version 300 es
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
`,Wl=`#version 300 es
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
`,Gl=[`u_resolution`,`u_center`,`u_scale`,`u_pointSize`,`u_pointCount`,`u_palette`,`u_colorOffset`,`u_exposure`],Kl=class{#e;#t;#n;#r;#i;#a=new Map;#o;#s=0;constructor(e){let t=e.getContext(`webgl2`);if(!t)throw Error(`WebGL2 недоступен для Clifford renderer.`);let n=t.createVertexArray(),r=t.createBuffer();if(!n||!r)throw Error(`WebGL не смог создать ресурсы Clifford renderer.`);this.#e=e,this.#t=t,this.#n=Nl(t,Ul,Wl),this.#r=n,this.#i=r,t.bindVertexArray(n),t.bindBuffer(t.ARRAY_BUFFER,r),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0);for(let e of Gl)this.#a.set(e,Pl(t,this.#n,e));let i=t.getParameter(t.ALIASED_POINT_SIZE_RANGE);this.#o=i[1]??1}setPoints(e){let t=this.#t;t.bindBuffer(t.ARRAY_BUFFER,this.#i),t.bufferData(t.ARRAY_BUFFER,e,t.STATIC_DRAW),this.#s=Math.trunc(e.length/2)}clearPoints(){this.#s=0}resize(e){let t=Math.min(window.devicePixelRatio||1,2)*e,n=Math.max(1,Math.round(this.#e.clientWidth*t)),r=Math.max(1,Math.round(this.#e.clientHeight*t));return this.#e.width===n&&this.#e.height===r?!1:(this.#e.width=n,this.#e.height=r,!0)}render(e){let t=this.#t;if(t.viewport(0,0,this.#e.width,this.#e.height),t.clearColor(.004,.006,.012,1),t.clear(t.COLOR_BUFFER_BIT),this.#s===0)return;let n=this.#e.clientWidth>0?this.#e.width/this.#e.clientWidth:1,r=Math.min(this.#o,Math.max(1,e.pointSize*n)),i=Math.max(1,Math.min(this.#s,Math.trunc(this.#s*Math.max(.05,Math.min(1,e.pointFraction)))));t.useProgram(this.#n),t.bindVertexArray(this.#r),t.enable(t.BLEND),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.SRC_ALPHA,t.ONE),t.uniform2f(this.#a.get(`u_resolution`),this.#e.width,this.#e.height),t.uniform2f(this.#a.get(`u_center`),e.center[0],e.center[1]),t.uniform1f(this.#a.get(`u_scale`),e.scale),t.uniform1f(this.#a.get(`u_pointSize`),r),t.uniform1i(this.#a.get(`u_pointCount`),i),t.uniform1i(this.#a.get(`u_palette`),e.palette),t.uniform1f(this.#a.get(`u_colorOffset`),e.colorOffset),t.uniform1f(this.#a.get(`u_exposure`),Math.max(0,e.exposure)),t.drawArrays(t.POINTS,0,i),t.disable(t.BLEND)}dispose(){this.#t.deleteBuffer(this.#i),this.#t.deleteVertexArray(this.#r),this.#t.deleteProgram(this.#n)}},ql=`fractal-lab-previews-v4`,Jl=`renderer-v4`,Yl=480,Xl=300,Zl=new Map,Ql=new Map,$l=Promise.resolve(),eu,tu,nu,ru,iu,au,ou;function su(e){let t=`${Jl}-${e.id}`,n=Zl.get(t);if(n)return Promise.resolve(n);let r=Ql.get(t);if(r)return r;let i=cu(e,t).catch(e=>{throw Ql.delete(t),e});return Ql.set(t,i),i}async function cu(e,t){let n=await yu(t),r=n??await lu(()=>du(e));n||bu(t,r);let i=URL.createObjectURL(r);return Zl.set(t,i),i}function lu(e){let t=$l.then(uu).then(e);return $l=t.then(()=>void 0,()=>void 0),t}function uu(){return new Promise(e=>{if(`requestIdleCallback`in window){window.requestIdleCallback(()=>e(),{timeout:250});return}setTimeout(e,16)})}async function du(e){let t={...ws(e),...e.preview.parameters};if(e.renderer===`escape-time`){let{canvas:n,renderer:r}=pu();return r.setFormula(e),r.render(fu(e,t)),vu(n)}if(e.renderer===`root-basin`){let{canvas:n,renderer:r}=mu();return r.setFormula(e),r.render(fu(e,t)),vu(n)}let{canvas:n,renderer:r,client:i}=hu(),a=await i.request({a:_u(t,`a`,-1.4),b:_u(t,`b`,1.6),c:_u(t,`c`,1),d:_u(t,`d`,.7),burnIn:_u(t,`burnIn`,100),pointCount:_u(t,`pointCount`,18e4)});return r.setPoints(a.values),r.render({center:e.preview.view.center,scale:e.preview.view.scale,palette:e.preview.palette??0,colorOffset:e.preview.colorOffset??0,exposure:_u(t,`exposure`,.11),pointSize:_u(t,`pointSize`,1.25),pointFraction:1}),vu(n)}function fu(e,t){return{center:e.preview.view.center,scale:e.preview.view.scale,maxIterations:e.preview.iterations??e.suggestedIterations,palette:e.preview.palette??0,colorDensity:e.preview.colorDensity??.075,colorOffset:e.preview.colorOffset??0,smoothColors:!0,parameters:t}}function pu(){return(!eu||!tu)&&(eu=gu(),tu=new Fl(eu)),{canvas:eu,renderer:tu}}function mu(){return(!nu||!ru)&&(nu=gu(),ru=new Hl(nu)),{canvas:nu,renderer:ru}}function hu(){return(!iu||!au||!ou)&&(iu=gu(),au=new Kl(iu),ou=new El),{canvas:iu,renderer:au,client:ou}}function gu(){let e=document.createElement(`canvas`);return e.width=Yl,e.height=Xl,e}function _u(e,t,n){let r=e[t];return typeof r==`number`?r:n}function vu(e){return new Promise((t,n)=>{e.toBlob(e=>{if(e){t(e);return}n(Error(`Браузер не смог создать изображение превью.`))},`image/webp`,.9)})}async function yu(e){if(!(typeof caches>`u`))try{return(await(await caches.open(ql)).match(xu(e)))?.blob()}catch{return}}async function bu(e,t){if(!(typeof caches>`u`))try{await(await caches.open(ql)).put(xu(e),new Response(t,{headers:{"Content-Type":t.type||`image/webp`}}))}catch{}}function xu(e){return new URL(`/__fractal-previews__/${encodeURIComponent(e)}.webp`,window.location.href).href}var Su=[`data-status`],Cu=[`src`],wu={key:1,class:`preview-error`},Tu={key:2,class:`preview-loader`},Eu=rr({__name:`FractalPreview`,props:{formula:{}},setup(e){let t=e,n=B(),r=B(``),i=B(`idle`),a,o=!1;vr(()=>{if(!n.value||!(`IntersectionObserver`in window)){s();return}a=new IntersectionObserver(e=>{e.some(e=>e.isIntersecting)&&(a?.disconnect(),a=void 0,s())},{rootMargin:`240px`}),a.observe(n.value)}),xr(()=>{o=!0,a?.disconnect()});async function s(){if(i.value===`idle`){i.value=`loading`;try{let e=await su(t.formula);o||(r.value=e,i.value=`ready`)}catch{o||(i.value=`error`)}}}return(e,t)=>(U(),W(`span`,{ref_key:`root`,ref:n,class:`fractal-preview`,"data-status":i.value,"aria-hidden":`true`},[r.value?(U(),W(`img`,{key:0,src:r.value,alt:``},null,8,Cu)):i.value===`error`?(U(),W(`span`,wu,[...t[0]||=[G(`svg`,{viewBox:`0 0 24 24`},[G(`path`,{d:`M6.5 17.5 17.5 6.5M6.5 6.5l11 11`})],-1),sa(` Превью недоступно `,-1)]])):(U(),W(`span`,Tu,[...t[1]||=[G(`i`,null,null,-1),G(`i`,null,null,-1),G(`i`,null,null,-1)]]))],8,Su))}}),Du=(e,t)=>{let n=e.__vccOpts||e;for(let[e,r]of t)n[e]=r;return n},Ou=Du(Eu,[[`__scopeId`,`data-v-ea460355`]]),ku={class:`picker-shell`},Au={class:`navigator-tools`},ju={class:`formula-search`},Mu={class:`category-filters`,"aria-label":`Категория формулы`},Nu=[`aria-pressed`,`onClick`],Pu=[`aria-label`],Fu=[`data-renderer`,`aria-pressed`,`onClick`],Iu={class:`card-visual`},Lu={class:`card-index`},Ru={key:0,class:`active-badge`},zu={class:`card-copy`},Bu={class:`card-category`},Vu={class:`card-description`},Hu={key:0,class:`empty-results`},Uu=Du(rr({__name:`FormulaPickerDialog`,emits:[`close`],setup(e,{emit:t}){let n=t,r=wl(),{activeFormula:i}=Ss(r),a=B(),o=B(),s=B(``),c=B(`all`),l=Fa(()=>{let e=s.value.trim().toLocaleLowerCase(`ru`);return Cs.filter(t=>{let n=c.value===`all`||t.renderer===c.value,r=e.length===0||`${t.label} ${t.description}`.toLocaleLowerCase(`ru`).includes(e);return n&&r})});vr(async()=>{await _n(),a.value?.showModal(),o.value?.focus()});function u(){if(a.value?.open){a.value.close();return}n(`close`)}function d(e){r.selectFormula(e),u()}function f(e){e.target===a.value&&u()}function p(e){return e.renderer===`root-basin`?`Root basin`:e.renderer===`point-attractor`?`Attractor`:`Escape time`}return(e,t)=>(U(),Qi(Qn,{to:`body`},[G(`dialog`,{ref_key:`dialog`,ref:a,class:`formula-picker`,"aria-labelledby":`formula-picker-title`,onCancel:Lo(u,[`prevent`]),onClick:f,onClose:t[1]||=e=>n(`close`)},[G(`section`,ku,[G(`header`,{class:`picker-header`},[t[3]||=G(`div`,{class:`picker-heading`},[G(`h2`,{id:`formula-picker-title`},`Каталог фракталов`),G(`p`,null,`Формулы, бассейны и странные аттракторы`)],-1),G(`button`,{class:`picker-close`,type:`button`,"aria-label":`Закрыть`,onClick:u},[...t[2]||=[G(`svg`,{viewBox:`0 0 24 24`,"aria-hidden":`true`},[G(`path`,{d:`m6.5 6.5 11 11m0-11-11 11`})],-1)]])]),G(`div`,Au,[G(`label`,ju,[t[4]||=G(`svg`,{viewBox:`0 0 24 24`,"aria-hidden":`true`},[G(`circle`,{cx:`10.5`,cy:`10.5`,r:`5.75`}),G(`path`,{d:`m15 15 4 4`})],-1),An(G(`input`,{ref_key:`searchInput`,ref:o,"onUpdate:modelValue":t[0]||=e=>s.value=e,type:`search`,placeholder:`Название или описание…`,"aria-label":`Поиск формулы`},null,512),[[Oo,s.value]]),t[5]||=G(`kbd`,null,`Esc`,-1)]),G(`div`,Mu,[(U(),W(Hi,null,Or([[`all`,`Все`],[`escape-time`,`Escape`],[`root-basin`,`Basins`],[`point-attractor`,`Attractors`]],e=>G(`button`,{key:e[0],type:`button`,"aria-pressed":c.value===e[0],onClick:t=>c.value=e[0]},P(e[1]),9,Nu)),64))])]),G(`div`,{class:`formula-grid`,"aria-label":`Доступно формул: ${l.value.length}`},[(U(!0),W(Hi,null,Or(l.value,(e,n)=>(U(),W(`button`,{key:e.id,class:N([`formula-card`,{"is-active":e.id===V(i).id}]),"data-renderer":e.renderer,type:`button`,"aria-pressed":e.id===V(i).id,onClick:t=>d(e.id)},[G(`span`,Iu,[ra(Ou,{formula:e},null,8,[`formula`]),G(`span`,Lu,P(String(n+1).padStart(2,`0`)),1),e.id===V(i).id?(U(),W(`span`,Ru,[...t[6]||=[G(`i`,null,null,-1),sa(` Открыт `,-1)]])):ca(``,!0)]),G(`span`,zu,[G(`span`,Bu,P(p(e)),1),G(`strong`,null,P(e.label),1),G(`span`,Vu,P(e.description),1)])],10,Fu))),128))],8,Pu),l.value.length===0?(U(),W(`div`,Hu,[...t[7]||=[G(`span`,null,`∅`,-1),sa(` По такому запросу формул пока нет `,-1)]])):ca(``,!0)])],544)]))}}),[[`__scopeId`,`data-v-0a4bfab4`]]),Wu={class:`controls`,"aria-label":`Настройки фрактала`},Gu={class:`controls-heading`},Ku={class:`control-stack`},qu={class:`field formula-picker-field`},Ju={class:`formula-description`},Yu={key:0,id:`formula-parameters`,class:`formula-parameters`},Xu={key:0,class:`complex-pair`},Zu={class:`number-input`},Qu=[`step`,`value`,`onInput`],$u={class:`number-input`},ed=[`step`,`value`,`onInput`],td={key:1,class:`number-input`},nd=[`step`,`min`,`max`,`value`,`onInput`],rd={key:1,class:`field range-field`},id={for:`iterations`},ad=[`min`,`max`,`step`],od={class:`field`},sd={class:`select-wrap`},cd={key:2,class:`toggle-field`},ld={key:3,class:`field range-field`},ud={for:`color-density`},dd={class:`controls-footer`},fd=Du(rr({__name:`ControlPanel`,setup(e){let t=wl(),{activeFormula:n,colorDensity:r,maxIterations:i,palette:a,parameterValues:o,smoothColors:s}=Ss(t),c=Fa(()=>n.value.renderer===`root-basin`?`GPU root-basin renderer`:n.value.renderer===`point-attractor`?`Worker + GPU point renderer`:`GPU escape-time renderer`),l=B(!1);vr(()=>{window.addEventListener(`keydown`,u)}),xr(()=>{window.removeEventListener(`keydown`,u)});function u(e){let t=/Mac|iPhone|iPad|iPod/.test(navigator.platform)?e.metaKey:e.ctrlKey;e.key.toLocaleLowerCase()!==`k`||!t||e.altKey||e.shiftKey||(e.preventDefault(),l.value=!0)}function d(e){return e.target.value}function f(e){let t=d(e);if(t.trim()===``)return;let n=Number(t);return Number.isFinite(n)?n:void 0}function p(e){let t=o.value[e];return typeof t==`number`?t:0}function m(e,t){let n=o.value[e];return Array.isArray(n)?n[t]:0}function h(e,n){let r=f(n);r!==void 0&&t.setParameter(e,r)}function g(e,n,r){let i=f(r),a=o.value[e];if(i===void 0||!Array.isArray(a))return;let s=[a[0],a[1]];s[n]=i,t.setParameter(e,s)}return(e,o)=>(U(),W(`aside`,Wu,[G(`div`,Gu,[o[8]||=G(`div`,null,[G(`span`,{class:`eyebrow`},`Исследование`),G(`h1`,null,`Параметры`)],-1),G(`button`,{class:`icon-button`,type:`button`,"aria-label":`Сбросить вид`,title:`Сбросить вид`,onClick:o[0]||=(...e)=>V(t).resetCamera&&V(t).resetCamera(...e)},[...o[7]||=[G(`svg`,{viewBox:`0 0 24 24`,"aria-hidden":`true`},[G(`path`,{d:`M4.9 6.8A8.5 8.5 0 1 1 3.6 15M4 4v4h4`})],-1)]])]),G(`div`,Ku,[G(`div`,qu,[o[10]||=G(`span`,null,`Формула`,-1),G(`button`,{class:`formula-picker-button`,type:`button`,"aria-label":`Открыть выбор формулы`,onClick:o[1]||=e=>l.value=!0},[G(`span`,null,P(V(n).label),1),o[9]||=G(`svg`,{viewBox:`0 0 24 24`,"aria-hidden":`true`},[G(`path`,{d:`m8 10 4 4 4-4`})],-1)])]),G(`p`,Ju,P(V(n).description),1),V(n).parameters.length>0?(U(),W(`div`,Yu,[o[13]||=G(`div`,{class:`section-rule`},null,-1),(U(!0),W(Hi,null,Or(V(n).parameters,e=>(U(),W(`label`,{key:e.key,class:`field`},[G(`span`,null,P(e.label),1),e.type===`complex`?(U(),W(`span`,Xu,[G(`span`,Zu,[o[11]||=G(`span`,null,`Re`,-1),G(`input`,{type:`number`,step:e.step,value:m(e.key,0),onInput:t=>g(e.key,0,t)},null,40,Qu)]),G(`span`,$u,[o[12]||=G(`span`,null,`Im`,-1),G(`input`,{type:`number`,step:e.step,value:m(e.key,1),onInput:t=>g(e.key,1,t)},null,40,ed)])])):(U(),W(`span`,td,[G(`input`,{type:`number`,step:e.step,min:e.min,max:e.max,value:p(e.key),onInput:t=>h(e.key,t)},null,40,nd)]))]))),128))])):ca(``,!0),o[18]||=G(`div`,{class:`section-rule`},null,-1),V(n).iterationControl?(U(),W(`label`,rd,[G(`span`,null,[G(`span`,null,P(V(n).iterationControl.label),1),G(`output`,id,P(V(i)),1)]),An(G(`input`,{id:`iterations`,"onUpdate:modelValue":o[2]||=e=>z(i)?i.value=e:null,type:`range`,min:V(n).iterationControl.min,max:V(n).iterationControl.max,step:V(n).iterationControl.step},null,8,ad),[[Oo,V(i),void 0,{number:!0}]])])):ca(``,!0),G(`label`,od,[o[15]||=G(`span`,null,`Палитра`,-1),G(`span`,sd,[An(G(`select`,{"onUpdate:modelValue":o[3]||=e=>z(a)?a.value=e:null},[...o[14]||=[G(`option`,{value:0},`Ultraviolet`,-1),G(`option`,{value:1},`Electric tide`,-1),G(`option`,{value:2},`Solar flare`,-1),G(`option`,{value:3},`Arctic dusk`,-1)]],512),[[jo,V(a),void 0,{number:!0}]])])]),V(n).renderer===`point-attractor`?ca(``,!0):(U(),W(`label`,cd,[o[16]||=G(`span`,null,[G(`span`,null,`Сглаживание`),G(`small`,null,`Плавные переходы между итерациями`)],-1),An(G(`input`,{"onUpdate:modelValue":o[4]||=e=>z(s)?s.value=e:null,type:`checkbox`,role:`switch`,"aria-label":`Сглаживать цвета`},null,512),[[ko,V(s)]])])),V(n).renderer===`point-attractor`?ca(``,!0):(U(),W(`label`,ld,[G(`span`,null,[o[17]||=G(`span`,null,`Плотность цвета`,-1),G(`output`,ud,P(V(r).toFixed(3)),1)]),An(G(`input`,{id:`color-density`,"onUpdate:modelValue":o[5]||=e=>z(r)?r.value=e:null,type:`range`,min:`0.015`,max:`0.2`,step:`0.005`},null,512),[[Oo,V(r),void 0,{number:!0}]])]))]),G(`footer`,dd,[o[19]||=G(`span`,{class:`gpu-status`},[G(`i`,{"aria-hidden":`true`}),sa(` WebGL2`)],-1),G(`span`,null,P(c.value),1)]),l.value?(U(),Qi(Uu,{key:0,onClose:o[6]||=e=>l.value=!1})):ca(``,!0)]))}}),[[`__scopeId`,`data-v-ce18b220`]]),pd=class extends Error{constructor(){super(`Расчёт опорной орбиты отменён.`),this.name=`ReferenceOrbitCancelledError`}},md=class{#e;#t;#n=0;request(e){this.cancel();let t=++this.#n,n=new Worker(new URL(`/fractal-lab/assets/reference-orbit.worker-8UNIP04P.js`,``+import.meta.url),{type:`module`});return this.#e=n,new Promise((r,i)=>{this.#t=i,n.onmessage=e=>{let n=e.data;if(n.type===`error`&&n.requestId===t){this.#r(),i(Error(n.message));return}n.type===`result`&&n.result.requestId===t&&(this.#r(),r(n.result))},n.onerror=e=>{this.#r(),i(Error(e.message||`Ошибка deep-zoom worker.`))},n.postMessage({...e,requestId:t})})}cancel(){if(!this.#e)return;this.#e.terminate(),this.#e=void 0;let e=this.#t;this.#t=void 0,e?.(new pd)}#r(){this.#e?.terminate(),this.#e=void 0,this.#t=void 0}},hd=new Set([`mandelbrot-perturbation`,`julia-perturbation`,`tricorn-perturbation`,`burning-ship-perturbation`,`phoenix-perturbation`]);function gd(e){return e!==void 0&&hd.has(e)}var _d=2052,vd={"mandelbrot-perturbation":{texelsPerIteration:1,uniforms:``,parameterGuard:``,initialize:`
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
      vec2 referenceValue = combineReference(referenceCurrent);
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
      forceRebase =
        crossesSignBoundary(referenceValue.x, actualCurrent.x) ||
        crossesSignBoundary(referenceValue.y, actualCurrent.y);
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
    `}};function yd(e){return vd[e].texelsPerIteration}function bd(e){let t=vd[e],n=t.texelsPerIteration===2?`fetchReference(referenceIndex, 1)`:`vec4(0.0)`,r=t.texelsPerIteration===2?`fetchReference(nextReferenceIndex, 1)`:`vec4(0.0)`,i=t.texelsPerIteration===2?`addReference(nextReferencePrevious, nextDeltaPrevious)`:`actualCurrent`,a=t.texelsPerIteration===2?`fetchReference(0, 1)`:`vec4(0.0)`;return`#version 300 es
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

bool crossesSignBoundary(float referenceValue, float actualValue) {
  return
    referenceValue != 0.0 &&
    actualValue != 0.0 &&
    ((referenceValue < 0.0) != (actualValue < 0.0));
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

  for (int i = 0; i < ${_d}; i++) {
    if (!didEscape && i >= u_maxIterations) {
      break;
    }

    bool wasEscaped = didEscape;
    vec4 referenceCurrent = fetchReference(referenceIndex, 0);
    vec4 referencePrevious = ${n};
    vec2 actualCurrent = addReference(referenceCurrent, deltaCurrent);
    vec2 nextDeltaCurrent = vec2(0.0);
    vec2 nextDeltaPrevious = deltaPrevious;
    bool forceRebase = false;
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
    bool unstable = dot(actualZ, actualZ) < dot(deltaCurrent, deltaCurrent);
    if (referenceExhausted || unstable || forceRebase) {
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
`}bd(`mandelbrot-perturbation`);var xd=[`u_resolution`,`u_centerDelta`,`u_scale`,`u_maxIterations`,`u_palette`,`u_colorDensity`,`u_colorOffset`,`u_smoothColors`,`u_referenceOrbit`,`u_referenceCount`],Sd=class{#e;#t;#n;#r;#i;#a;#o=new Map;#s=new Map;#c=0;constructor(e){let t=e.getContext(`webgl2`,{alpha:!1,antialias:!1,depth:!1,powerPreference:`high-performance`,preserveDrawingBuffer:!1,stencil:!1});if(!t)throw Error(`WebGL2 недоступен для deep zoom.`);let n=t.createVertexArray(),r=t.createTexture();if(!n||!r)throw Error(`WebGL не смог создать ресурсы deep zoom.`);this.#e=e,this.#t=t,this.#n=n,this.#r=r,this.#l(`mandelbrot-perturbation`)}setReferenceOrbit(e){let t=this.#t,n=yd(e.backend);if(e.texelsPerIteration!==n)throw Error(`Deep-zoom backend ${e.backend} ожидал ${n} texel на итерацию, получено ${e.texelsPerIteration}.`);let r=t.getParameter(t.MAX_TEXTURE_SIZE);if(e.orbitLength>r||e.texelsPerIteration>r)throw Error(`Опорная орбита (${e.orbitLength} итераций) превышает лимит GPU (${r}).`);this.#l(e.backend),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.#r),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,t.RGBA32F,e.texelsPerIteration,e.orbitLength,0,t.RGBA,t.FLOAT,e.values),this.#c=e.orbitLength}resize(e){let t=Math.min(window.devicePixelRatio||1,2)*e,n=Math.max(1,Math.round(this.#e.clientWidth*t)),r=Math.max(1,Math.round(this.#e.clientHeight*t));return this.#e.width===n&&this.#e.height===r?!1:(this.#e.width=n,this.#e.height=r,!0)}render(e){if(this.#c<2)throw Error(`Опорная орбита deep zoom ещё не подготовлена.`);if(e.backend!==this.#i||!this.#a)throw Error(`Deep-zoom renderer получил состояние другого backend'а.`);let t=this.#t;t.disable(t.BLEND),t.viewport(0,0,this.#e.width,this.#e.height),t.useProgram(this.#a),t.bindVertexArray(this.#n),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.#r),t.uniform2f(this.#o.get(`u_resolution`),this.#e.width,this.#e.height),t.uniform2f(this.#o.get(`u_centerDelta`),e.centerDelta[0],e.centerDelta[1]),t.uniform1f(this.#o.get(`u_scale`),e.scale),t.uniform1i(this.#o.get(`u_maxIterations`),e.maxIterations),t.uniform1i(this.#o.get(`u_palette`),e.palette),t.uniform1f(this.#o.get(`u_colorDensity`),e.colorDensity),t.uniform1f(this.#o.get(`u_colorOffset`),e.colorOffset),t.uniform1i(this.#o.get(`u_smoothColors`),+!!e.smoothColors),t.uniform1i(this.#o.get(`u_referenceOrbit`),0),t.uniform1i(this.#o.get(`u_referenceCount`),this.#c),this.#u(e.parameters),t.drawArrays(t.TRIANGLES,0,3)}dispose(){this.#t.deleteTexture(this.#r),this.#t.deleteVertexArray(this.#n),this.#a&&this.#t.deleteProgram(this.#a)}#l(e){if(e===this.#i)return;let t=Nl(this.#t,Ol,bd(e)),n=new Map;for(let e of xd)n.set(e,Pl(this.#t,t,e));let r=new Map,i=e===`julia-perturbation`?[[`constant`,`u_juliaConstant`]]:e===`phoenix-perturbation`?[[`constant`,`u_phoenixConstant`],[`memory`,`u_phoenixMemory`]]:[];for(let[e,n]of i)r.set(e,Pl(this.#t,t,n));this.#a&&this.#t.deleteProgram(this.#a),this.#i=e,this.#a=t,this.#o=n,this.#s=r,this.#c=0}#u(e){for(let[t,n]of this.#s){let r=e[t];Array.isArray(r)?this.#t.uniform2f(n,r[0],r[1]):typeof r==`number`?this.#t.uniform1f(n,r):t===`constant`&&this.#i===`julia-perturbation`?this.#t.uniform2f(n,-.745,.113):t===`constant`&&this.#i===`phoenix-perturbation`?this.#t.uniform2f(n,.5667,0):t===`memory`&&this.#t.uniform1f(n,-.5)}}},Cd={key:0,class:`render-error`},wd=[`data-state`,`data-limit`],Td=[`data-state`],Ed=rr({__name:`FractalCanvas`,setup(e){let t=wl(),n=B(),r=B(``),i=B(`idle`),a=B(0),o=B(``),s=B(`idle`),c=B(0),l=B(``),u=Fa(()=>{let e=t.activeFormula;if(!(e.renderer!==`escape-time`||!gd(e.deepZoom?.backend)))return e.deepZoom.backend}),d=Fa(()=>u.value!==void 0&&cl(t.magnification)),f=Fa(()=>{let e=t.activeFormula,n=e.renderer===`escape-time`?e.deepZoom?.maxMagnification:void 0;return n!==void 0&&t.magnification>=n*.999999999999}),p=Fa(()=>t.activeFormula.renderer===`point-attractor`),m=Fa(()=>{if(i.value===`preparing`)return`Подготовка опорной орбиты…`;if(i.value===`ready`){let e=t.activeFormula.renderer===`escape-time`?t.activeFormula.deepZoom?.maxMagnification:void 0;return f.value&&e!==void 0?`Deep zoom · предел ${e.toExponential(2)}×`:`Deep zoom · ${a.value} digits`}return i.value===`error`?o.value||`Deep zoom недоступен`:`Deep zoom`}),h=Fa(()=>s.value===`preparing`?`Расчёт траектории…`:s.value===`ready`?`Clifford · ${c.value.toLocaleString(`ru-RU`)} точек`:s.value===`error`?l.value||`Аттрактор недоступен`:`Clifford attractor`),g,_,v,y,b,x=``,S=new md,C=new El,w,T,ee,E,D,O=1,k=new Map,A=t.$subscribe(()=>N(),{detached:!0});Ln(()=>t.activeFormulaId,()=>{if(n.value)try{ne(),r.value=``,N()}catch(e){re(e)}},{flush:`sync`}),Ln([()=>t.activeFormulaId,()=>he()],()=>_e(),{flush:`sync`}),Ln(()=>[t.maxIterations,t.colorDensity,t.parameterValues],()=>ue(),{deep:!0}),Ln(()=>[t.activeFormulaId,t.exactCenter[0],t.exactCenter[1],t.exactScale,t.maxIterations,pe(u.value,t.parameterValues)],()=>de(),{flush:`sync`}),vr(()=>{j(),w=new ResizeObserver(()=>N()),w.observe(n.value),window.addEventListener(`keydown`,le),n.value.addEventListener(`webglcontextlost`,te),n.value.addEventListener(`webglcontextrestored`,j)}),xr(()=>{A(),w?.disconnect(),window.removeEventListener(`keydown`,le),n.value?.removeEventListener(`webglcontextlost`,te),n.value?.removeEventListener(`webglcontextrestored`,j),T!==void 0&&window.cancelAnimationFrame(T),ee!==void 0&&window.clearTimeout(ee),E!==void 0&&window.clearTimeout(E),D!==void 0&&window.clearTimeout(D),S.cancel(),C.cancel(),M()});function j(){if(n.value)try{M(),b=void 0,x=``,g=new Fl(n.value),_=new Hl(n.value),v=new Kl(n.value),ne();try{y=new Sd(n.value),o.value=``}catch(e){y=void 0,i.value=`error`,o.value=e instanceof Error?e.message:String(e)}r.value=``,de(),_e(),N()}catch(e){M(),re(e)}}function te(e){e.preventDefault(),g=void 0,_=void 0,v=void 0,y=void 0,b=void 0,S.cancel(),C.cancel(),r.value=`Контекст WebGL потерян. Ожидаем восстановления GPU.`}function ne(){let e=t.activeFormula;e.renderer===`escape-time`?g?.setFormula(e):e.renderer===`root-basin`&&_?.setFormula(e)}function M(){g?.dispose(),_?.dispose(),v?.dispose(),y?.dispose(),g=void 0,_=void 0,v=void 0,y=void 0}function re(e){r.value=e instanceof Error?e.message:String(e)}function ie(e){e.pointerType===`mouse`&&e.button!==0||k.size>=2||(k.set(e.pointerId,[e.clientX,e.clientY]),n.value.setPointerCapture(e.pointerId),n.value.classList.add(`is-dragging`),O=.58)}function ae(e){let r=k.get(e.pointerId);if(!(!r||!n.value))if(k.size===1)t.panByPixels(e.clientX-r[0],e.clientY-r[1],n.value.clientHeight),k.set(e.pointerId,[e.clientX,e.clientY]);else{let n=F();k.set(e.pointerId,[e.clientX,e.clientY]);let r=F();n&&r&&r.distance>0&&t.transformCamera(ye(n.midpoint[0],n.midpoint[1]),ye(r.midpoint[0],r.midpoint[1]),n.distance/r.distance)}}function oe(e){k.delete(e.pointerId)&&(n.value?.classList.toggle(`is-dragging`,k.size>0),k.size===0&&(O=1,N()))}function se(e){e.preventDefault();let n=ye(e.clientX,e.clientY),r=Math.exp(Math.max(-120,Math.min(120,e.deltaY))*.002);t.transformCamera(n,n,r),ue()}function ce(e){let n=ye(e.clientX,e.clientY);t.transformCamera(n,n,.45),ue()}function le(e){if(!(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement)){if(e.key===`ArrowLeft`)t.panByNormalized([-.08,0]);else if(e.key===`ArrowRight`)t.panByNormalized([.08,0]);else if(e.key===`ArrowUp`)t.panByNormalized([0,.08]);else if(e.key===`ArrowDown`)t.panByNormalized([0,-.08]);else if(e.key===`+`||e.key===`=`)t.zoomFromCenter(.8);else if(e.key===`-`)t.zoomFromCenter(1.25);else return;e.preventDefault(),ue()}}function ue(){O=.68,N(),ee!==void 0&&window.clearTimeout(ee),ee=window.setTimeout(()=>{O=1,ee=void 0,N()},140)}function N(){T===void 0&&(T=window.requestAnimationFrame(()=>{if(T=void 0,!(!n.value||n.value.clientWidth===0||n.value.clientHeight===0))try{let e=t.activeFormula,n=u.value,r=pe(n,t.parameterValues);d.value&&n&&y&&b?.backend===n&&x===r?(y.resize(O),y.render({backend:n,centerDelta:[_l(t.exactCenter[0],b.center[0],t.exactScale),_l(t.exactCenter[1],b.center[1],t.exactScale)],scale:Number(t.exactScale),maxIterations:t.maxIterations,palette:t.palette,colorDensity:t.colorDensity,colorOffset:t.colorOffset,smoothColors:t.smoothColors,parameters:t.parameterValues})):e.renderer===`escape-time`&&g?(g.resize(O),g.render({center:t.center,scale:t.scale,maxIterations:t.maxIterations,palette:t.palette,colorDensity:t.colorDensity,colorOffset:t.colorOffset,smoothColors:t.smoothColors,parameters:t.parameterValues})):e.renderer===`root-basin`&&_?(_.resize(O),_.render({center:t.center,scale:t.scale,maxIterations:t.maxIterations,palette:t.palette,colorDensity:t.colorDensity,colorOffset:t.colorOffset,smoothColors:t.smoothColors,parameters:t.parameterValues})):e.renderer===`point-attractor`&&v&&(v.resize(O),v.render({center:t.center,scale:t.scale,palette:t.palette,colorOffset:t.colorOffset,exposure:ge(`exposure`,.045),pointSize:ge(`pointSize`,1.25),pointFraction:O*O}))}catch(e){re(e)}}))}function de(){if(S.cancel(),E!==void 0&&(window.clearTimeout(E),E=void 0),!d.value){b=void 0,x=``,i.value=`idle`,a.value=0;return}if(!y){i.value=`error`;return}i.value=`preparing`,o.value=``,E=window.setTimeout(()=>{E=void 0,fe()},120)}async function fe(){let e=u.value;if(!e)return;let r=[t.exactCenter[0],t.exactCenter[1]],s=t.exactScale,c=t.maxIterations,l=me(t.parameterValues),f=pe(e,l),p=n.value?n.value.clientWidth/Math.max(1,n.value.clientHeight):1;try{let n=await S.request({backend:e,parameters:l,center:r,scale:s,maxIterations:c,viewportAspect:p});if(!d.value||u.value!==e||pe(u.value,t.parameterValues)!==f||t.exactCenter[0]!==r[0]||t.exactCenter[1]!==r[1]||t.exactScale!==s||t.maxIterations!==c)return;y?.setReferenceOrbit(n),b=n,x=f,a.value=n.precisionDigits,i.value=`ready`,N()}catch(e){if(e instanceof pd)return;i.value=`error`,o.value=e instanceof Error?e.message:String(e)}}function pe(e,t){return e?`${e}|${Object.keys(t).sort().map(e=>`${e}:${JSON.stringify(t[e])}`).join(`|`)}`:``}function me(e){let t={};for(let[n,r]of Object.entries(e))t[n]=Array.isArray(r)?[r[0],r[1]]:r;return t}function he(){let e=t.activeFormula;return e.renderer===`point-attractor`?e.parameters.filter(e=>e.affectsOrbit!==!1).map(e=>`${e.key}:${String(t.parameterValues[e.key])}`).join(`|`):``}function ge(e,n){let r=t.parameterValues[e];return typeof r==`number`&&Number.isFinite(r)?r:n}function _e(){if(C.cancel(),D!==void 0&&(window.clearTimeout(D),D=void 0),!p.value){v?.clearPoints(),s.value=`idle`,c.value=0;return}if(!v){s.value=`error`,l.value=`WebGL2 renderer аттрактора недоступен.`;return}s.value=`preparing`,l.value=``,D=window.setTimeout(()=>{D=void 0,ve()},100)}async function ve(){let e=he(),t={a:ge(`a`,-1.4),b:ge(`b`,1.6),c:ge(`c`,1),d:ge(`d`,.7),burnIn:ge(`burnIn`,100),pointCount:ge(`pointCount`,5e5)};try{let n=await C.request(t);if(!p.value||he()!==e)return;v?.setPoints(n.values),c.value=n.pointCount,s.value=`ready`,N()}catch(e){if(e instanceof Tl)return;s.value=`error`,l.value=e instanceof Error?e.message:String(e)}}function ye(e,t){let r=n.value.getBoundingClientRect();return[(e-r.left-r.width*.5)/r.height,(r.height*.5-(t-r.top))/r.height]}function F(){let[e,t]=k.values();if(!(!e||!t))return{midpoint:[(e[0]+t[0])*.5,(e[1]+t[1])*.5],distance:Math.hypot(t[0]-e[0],t[1]-e[1])}}return(e,t)=>(U(),W(Hi,null,[G(`canvas`,{ref_key:`canvas`,ref:n,id:`fractal-canvas`,"aria-label":`Визуализация фрактала`,onPointerdown:ie,onPointermove:ae,onPointerup:oe,onPointercancel:oe,onWheel:se,onDblclick:ce},null,544),r.value?(U(),W(`div`,Cd,[t[0]||=G(`strong`,null,`Не удалось запустить GPU-рендерер`,-1),G(`span`,null,P(r.value),1)])):ca(``,!0),d.value?(U(),W(`div`,{key:1,class:`deep-zoom-status`,"data-state":i.value,"data-limit":f.value,role:`status`},[t[1]||=G(`i`,{"aria-hidden":`true`},null,-1),G(`span`,null,P(m.value),1)],8,wd)):ca(``,!0),p.value?(U(),W(`div`,{key:2,class:`deep-zoom-status attractor-status`,"data-state":s.value,role:`status`},[t[2]||=G(`i`,{"aria-hidden":`true`},null,-1),G(`span`,null,P(h.value),1)],8,Td)):ca(``,!0)],64))}}),Dd={class:`viewer`},Od={class:`stage`,"aria-label":`Область просмотра фрактала`},kd={class:`topbar`},Ad={class:`coordinates`,"aria-live":`polite`},jd={id:`zoom-readout`},Md={id:`center-readout`};Vo(rr({__name:`App`,setup(e){let{exactCenter:t,exactScale:n,magnification:r}=Ss(wl()),i=Fa(()=>`${o(r.value)}×`),a=Fa(()=>`${vl(t.value[0],n.value)} ${t.value[1].startsWith(`-`)?`−`:`+`} ${vl(t.value[1].replace(`-`,``),n.value)}i`);function o(e){return e>=1e6?e.toExponential(2):e>=100?Math.round(e).toLocaleString(`ru-RU`):e>=10?e.toFixed(1):e.toFixed(2)}return(e,t)=>(U(),W(`main`,Dd,[G(`section`,Od,[ra(Ed),G(`header`,kd,[t[1]||=G(`div`,{class:`brand`},[G(`span`,{class:`brand-mark`,"aria-hidden":`true`}),G(`span`,null,`Fractal Lab`)],-1),G(`div`,Ad,[G(`span`,jd,P(i.value),1),t[0]||=G(`span`,{class:`coordinate-divider`},null,-1),G(`span`,Md,P(a.value),1)])]),t[2]||=G(`div`,{class:`gesture-hint`},[G(`span`,{class:`desktop-hint`},`Перетаскивание — перемещение`),G(`span`,{class:`desktop-hint`},`Колесо — масштаб`),G(`span`,{class:`mobile-hint`},`Один палец — перемещение · два — масштаб`)],-1)]),ra(fd)]))}})).use(ss()).mount(`#app`);
(function(){
"use strict";
var known=["/","/the-club","/stay","/dining","/club-life","/club","/membership","/events","/gallery","/contact"];
var header=document.getElementById("site-header"), mobile=document.getElementById("mobile-nav"), toggle=document.getElementById("menu-toggle"), main=document.getElementById("content"), lightbox=document.getElementById("lightbox");
function currentPath(){try{var p=decodeURI(location.pathname).replace(/\/+$/,"")||"/";return known.includes(p)?p:"/";}catch{return "/";}}
function navClose(){mobile.hidden=true;toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-label","Open navigation");document.body.classList.remove("menu-open");}
function render(focus){var p=currentPath();document.querySelectorAll(".page").forEach(function(el){el.hidden=el.dataset.page!==p;});var active=document.querySelector('.page[data-page="'+p+'"]');document.title="PLP Changi | "+(active?active.dataset.title:"Coastal Living");document.querySelectorAll("[data-route]").forEach(function(link){if(link.dataset.route===p){link.setAttribute("aria-current","page");}else{link.removeAttribute("aria-current");}});header.classList.toggle("inner",p!=="/");navClose();if(focus){window.scrollTo({top:0,behavior:"instant"});main.focus({preventScroll:true});}updateHeader();if(typeof window.dispatchEvent==="function"&&typeof Event!=="undefined")window.dispatchEvent(new Event("plp:navigation"));}
function updateHeader(){header.classList.toggle("scrolled",currentPath()==="/"&&window.scrollY>65);if(!mobile.hidden)mobile.style.top=header.getBoundingClientRect().bottom+"px";}
document.addEventListener("click",function(e){var link=e.target.closest("a[data-route]");if(link&&!e.defaultPrevented&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&e.button===0){e.preventDefault();var route=link.dataset.route;if(currentPath()!==route){history.pushState({},"",route);render(true);}else{navClose();window.scrollTo({top:0,behavior:"smooth"});}return;}var interest=e.target.closest(".interest-link");if(interest){var select=document.getElementById("senior-program");if(select){select.value=interest.dataset.interest||"General Pearl Club interest";}if(typeof window.plpTrack==="function")window.plpTrack("enquiry_interest",{interest_type:select?select.value:"General Pearl Club interest"});}});
toggle.addEventListener("click",function(){var open=mobile.hidden;mobile.hidden=!open;toggle.setAttribute("aria-expanded",String(open));toggle.setAttribute("aria-label",open?"Close navigation":"Open navigation");if(open){mobile.style.top=header.getBoundingClientRect().bottom+"px";mobile.querySelector("a[href]")?.focus();}else{toggle.focus();}});
window.addEventListener("popstate",function(){render(true);});window.addEventListener("scroll",updateHeader,{passive:true});window.addEventListener("resize",updateHeader);
document.addEventListener("keydown",function(e){
  if(mobile.hidden)return;
  if(e.key==="Escape"){e.preventDefault();navClose();toggle.focus();return;}
  if(e.key!=="Tab")return;
  var links=Array.from(mobile.querySelectorAll("a[href]"));
  var first=links[0],last=links[links.length-1];
  if(!first||!last)return;
  if(e.shiftKey){
    if(document.activeElement===first){e.preventDefault();toggle.focus();}
    else if(document.activeElement===toggle){e.preventDefault();last.focus();}
  }else{
    if(document.activeElement===last){e.preventDefault();toggle.focus();}
    else if(document.activeElement===toggle){e.preventDefault();first.focus();}
  }
});
document.getElementById("interest-form").addEventListener("submit",function(e){e.preventDefault();var f=e.currentTarget;if(!f.reportValidity())return;var name=document.getElementById("senior-name").value.trim();var email=document.getElementById("senior-email").value.trim();var program=document.getElementById("senior-program").value;var subject=encodeURIComponent("Pearl Club Changi — "+program+" interest");var body=encodeURIComponent("Pearl Club Changi — enquiry only\n\nName: "+name+"\nReply email: "+email+"\nInterest: "+program+"\n\nI understand no membership, venue partnership, or scheduled activity is confirmed.");document.getElementById("interest-feedback").textContent="Your email app will open with a draft. No enquiry is submitted until you send it.";if(typeof window.plpTrack==="function")window.plpTrack("enquiry_draft_opened",{interest_type:program});window.location.href="mailto:mfr@e-mango.com?subject="+subject+"&body="+body;});
var galleryFocus=null;document.querySelectorAll(".gallery-item").forEach(function(btn){btn.addEventListener("click",function(){galleryFocus=btn;document.getElementById("lightbox-image").src=btn.querySelector("img").src;document.getElementById("lightbox-image").alt=btn.querySelector("img").alt;document.getElementById("lightbox-caption").textContent=btn.dataset.caption;lightbox.showModal();lightbox.querySelector(".lightbox-close").focus();});});lightbox.querySelector(".lightbox-close").addEventListener("click",function(){lightbox.close();});lightbox.addEventListener("click",function(e){if(e.target===lightbox)lightbox.close();});lightbox.addEventListener("close",function(){if(galleryFocus)galleryFocus.focus();document.getElementById("lightbox-image").removeAttribute("src");});
document.querySelectorAll("img").forEach(function(img){img.addEventListener("error",function(){if(img.dataset.localFallback==="true")return;img.dataset.localFallback="true";img.classList.add("image-missing");img.alt="Illustrated Changi coastal atmosphere; photograph temporarily unavailable";img.src="/coastline.svg";});});
render(false);
})();
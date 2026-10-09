'use strict';
// Retain each information panel's largest displayed height during this visit.
(()=>{if(!window.ResizeObserver)return;for(const id of ['transfer-maximum','token-preview','bridge-progress','status']){const panel=document.getElementById(id);if(!panel)continue;let largest=0;const observer=new ResizeObserver(()=>{if(panel.hidden||panel.getClientRects().length===0)return;const height=Math.ceil(panel.getBoundingClientRect().height);if(height>largest){largest=height;panel.style.minHeight=largest+'px';}});observer.observe(panel);}})();

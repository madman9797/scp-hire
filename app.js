const $=id=>document.getElementById(id);const key='scpDemo';
function data(){return JSON.parse(localStorage.getItem(key)||'{}')}function save(d){localStorage.setItem(key,JSON.stringify(d))}
function go(id){document.getElementById(id).scrollIntoView({behavior:'smooth'})}
function logoutAndReset(){
  if(!confirm('Log out and delete this account, application, and all saved site data from this browser?')) return;
  clearInterval(window.t);
  localStorage.removeItem(key);
  window.location.reload();
}

function current(){return data()}
$('signupForm').addEventListener('submit',e=>{e.preventDefault();let d=data();let email=$('signupEmail').value.trim().toLowerCase();if(d.user?.email===email){$('signupMsg').textContent='Account already exists. Try logging in.';return}d.user={name:$('signupName').value.trim(),email,password:$('signupPassword').value};d.loggedIn=true;save(d);$('signupMsg').textContent='Account created. You are logged in.';$('appName').value=d.user.name});
$('loginForm').addEventListener('submit',e=>{e.preventDefault();let d=data();let email=$('loginEmail').value.trim().toLowerCase();if(!d.user||d.user.email!==email||d.user.password!==$('loginPassword').value){$('loginMsg').textContent='Invalid login.';$('loginMsg').className='message error';return}d.loggedIn=true;save(d);$('loginMsg').textContent='Login successful.';$('loginMsg').className='message';$('appName').value=d.user.name;renderStatus()});
$('appForm').addEventListener('submit',e=>{e.preventDefault();let d=data();if(!d.loggedIn){$('applyMsg').textContent='Please create an account or log in first.';return}d.application={name:$('appName').value.trim(),department:$('department').value,clearance:$('clearance').value,reason:$('reason').value.trim(),submitted:Date.now(),hired:false,foundationNumber:Math.floor(100+Math.random()*900)};save(d);$('applyMsg').textContent='Application submitted. Recruitment review started — check Application Status.';renderStatus();go('status');startTimer()});
function renderStatus(){let d=data(),b=$('statusBox');if(!d.application){b.innerHTML='<p class="muted">No application loaded. Submit one above.</p>';return}let a=d.application;if(a.hired){b.innerHTML=`<div class="hired"><h3>YOU'RE HIRED!</h3><p>Congratulations, ${esc(a.name)}.</p><p><b>Position:</b> Junior Researcher &nbsp; <b>Department:</b> ${esc(a.department)} &nbsp; <b>Clearance:</b> ${esc(a.clearance)}</p><p>Foundation Assignment: SCP Foundation-${a.foundationNumber}</p></div>`;return}let elapsed=Math.max(0,Date.now()-a.submitted),left=Math.max(0,30000-elapsed),pct=Math.min(100,elapsed/300);b.innerHTML=`<div class="application"><h3>APPLICATION UNDER REVIEW</h3><p>Name: <b>${esc(a.name)}</b></p><p>Department: <b>${esc(a.department)}</b></p><p>Clearance request: <b>${esc(a.clearance)}</b></p><div class="progress"><span style="width:${pct}%"></span></div><p id="countdown">Decision in about ${Math.ceil(left/1000)} seconds...</p></div>`}
function startTimer(){clearInterval(window.t);window.t=setInterval(()=>{let d=data();if(!d.application)return;if(Date.now()-d.application.submitted>=30000){d.application.hired=true;save(d);clearInterval(window.t)}renderStatus()},250)}
function esc(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
renderStatus();let d=data();if(d.user)$('appName').value=d.user.name;if(d.application&&!d.application.hired)startTimer();

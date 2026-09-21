const items=['Окна защищены блокираторами','Дети не остаются без присмотра','Дымоход очищен','Печь без повреждений','На печи нет вещей','Провода без повреждений','Розетки не перегружены','Дымовой извещатель работает','Батарея извещателя проверена','Все знают 101 и 112'];
const list=document.querySelector('.checklist');
const saved=JSON.parse(localStorage.getItem('dchsChecklist')||'[]');
items.forEach((x,i)=>{const l=document.createElement('label');const c=document.createElement('input');c.type='checkbox';c.checked=!!saved[i];l.append(c,document.createTextNode(x));list.append(l)});
const boxes=[...list.querySelectorAll('input')],bar=document.querySelector('.meter span'),pct=document.getElementById('pct');
function updateCheck(){const n=boxes.filter(x=>x.checked).length;bar.style.width=n*10+'%';pct.textContent=n*10+'%';localStorage.setItem('dchsChecklist',JSON.stringify(boxes.map(x=>x.checked)))}
boxes.forEach(x=>x.addEventListener('change',updateCheck));updateCheck();
document.getElementById('reset').addEventListener('click',()=>{boxes.forEach(x=>x.checked=false);updateCheck()});

const url=location.href.split('#')[0],urlEl=document.getElementById('url'),qr=document.getElementById('qrimg');
if(url.startsWith('file:')){urlEl.textContent='Адрес появится после публикации';qr.src='https://api.qrserver.com/v1/create-qr-code/?size=700x700&margin=12&data=https%3A%2F%2Fdchssko.github.io%2Fdchs-sko-safet%2F'}else{urlEl.textContent=url;qr.src='https://api.qrserver.com/v1/create-qr-code/?size=700x700&margin=12&data='+encodeURIComponent(url)}
document.getElementById('copyUrl').addEventListener('click',async()=>{const text=url.startsWith('file:')?'Ссылка появится после публикации':url;try{await navigator.clipboard.writeText(text);const b=document.getElementById('copyUrl');b.textContent='СКОПИРОВАНО ✓';setTimeout(()=>b.textContent='СКОПИРОВАТЬ ССЫЛКУ',1500)}catch(e){}});

document.documentElement.dataset.theme='dark';document.documentElement.style.colorScheme='dark';

const topObserver=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');topObserver.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.topicCard,.memoSection,.fireSection,.alarmSection,.checkSection,.gameShell,.botSection,.appSection,.qrSection').forEach(x=>{x.classList.add('reveal');topObserver.observe(x)});

// PWA install
let deferredInstall=null;const installApp=document.getElementById('installApp'),toast=document.getElementById('installToast'),toastInstall=document.getElementById('toastInstall'),toastClose=document.getElementById('toastClose'),hint=document.getElementById('installHint');
function standalone(){return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}function hideToast(){if(toast)toast.hidden=true}window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e});
async function install(){if(deferredInstall){deferredInstall.prompt();const r=await deferredInstall.userChoice;deferredInstall=null;if(r.outcome==='accepted')hideToast();return}toast.hidden=false;hint.textContent='В Safari: «Поделиться» → «На экран Домой». В Chrome: меню ⋮ → «Установить приложение».'}
installApp.addEventListener('click',install);toastInstall.addEventListener('click',install);toastClose.addEventListener('click',hideToast);window.addEventListener('appinstalled',hideToast);if(standalone())hideToast();

// Game
const start=document.getElementById('gameStart'),room=document.getElementById('gameRoom'),scoreEl=document.getElementById('gameScore'),timerEl=document.getElementById('gameTimer'),foundEl=document.getElementById('gameFound'),msg=document.getElementById('gameMessage'),spots=[...document.querySelectorAll('.hotspot')];
const game={running:false,time:60,score:0,found:0,timer:null,lang:'ru'};
const gameCopy={ru:{start:'НАЧАТЬ ИГРУ',running:'ИГРА ИДЁТ',idle:'Нажмите «Начать игру»',find:'Найдите все 5 опасностей',saved:'ДОМ СПАСЁН! Все опасности найдены.',time:'Время вышло. Попробуйте ещё раз.',again:'ИГРАТЬ ЕЩЁ →'},kz:{start:'ОЙЫНДЫ БАСТАУ',running:'ОЙЫН ЖҮРІП ЖАТЫР',idle:'«Ойынды бастау» түймесін басыңыз',find:'Барлық 5 қауіпті жағдайды табыңыз',saved:'ҮЙ ҚАУІПСІЗ! Барлық қауіп табылды.',time:'Уақыт аяқталды. Қайта көріңіз.',again:'ҚАЙТА ОЙНАУ →'}};
const hazards={ru:{window:'Открытое окно. Закройте его и не оставляйте ребёнка рядом.',wire:'Перегруженная розетка. Отключите лишний прибор.',stove:'Плита. Выключите нагрев и не оставляйте её без присмотра.',candle:'Свеча. Погасите её и уберите от ткани.',door:'Выход заблокирован. Освободите путь к двери.'},kz:{window:'Ашық терезе. Оны жауып, баланы терезе жанында қалдырмаңыз.',wire:'Розеткаға артық жүктеме түскен. Қажет емес құралды ажыратыңыз.',stove:'Плита. Қыздыруды өшіріп, оны қараусыз қалдырмаңыз.',candle:'Майшам. Оны өшіріп, матадан алыс қойыңыз.',door:'Шығу жолы бұғатталған. Есікке апаратын жолды босатыңыз.'}};
function gameReset(){clearInterval(game.timer);game.running=false;game.time=60;game.score=0;game.found=0;scoreEl.textContent='0';timerEl.textContent='60';foundEl.textContent='0/5';room.classList.add('locked');room.classList.remove('success');spots.forEach(s=>s.classList.remove('found'));msg.textContent=gameCopy[game.lang].idle;start.innerHTML=gameCopy[game.lang].start+' <span>→</span>'}
function gameBegin(){clearInterval(game.timer);game.running=true;game.time=60;game.score=0;game.found=0;room.classList.remove('locked','success');spots.forEach(s=>s.classList.remove('found'));scoreEl.textContent='0';timerEl.textContent='60';foundEl.textContent='0/5';msg.textContent=gameCopy[game.lang].find;start.textContent=gameCopy[game.lang].running;game.timer=setInterval(()=>{game.time--;timerEl.textContent=game.time;if(game.time<=0)gameFinish(false)},1000)}
function gameFinish(success){clearInterval(game.timer);game.running=false;if(success){game.score+=game.time*2;room.classList.add('success');msg.textContent=gameCopy[game.lang].saved+' +'+game.score}else msg.textContent=gameCopy[game.lang].time;scoreEl.textContent=game.score;start.innerHTML=gameCopy[game.lang].again+' <span>↻</span>'}
spots.forEach(s=>s.addEventListener('click',()=>{if(!game.running||s.classList.contains('found'))return;s.classList.add('found');game.found++;game.score+=100;foundEl.textContent=game.found+'/5';scoreEl.textContent=game.score;msg.textContent=hazards[game.lang][s.dataset.hazard];if(game.found===5)gameFinish(true)}));start.addEventListener('click',()=>game.running?null:gameBegin());

document.addEventListener('safeLangChanged',e=>{game.lang=e.detail.lang==='kz'?'kz':'ru';if(!game.running)gameReset();});gameReset();

// active navigation
const navLinks=[...document.querySelectorAll('.desktopNav a')];const navSections=navLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);const navIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-35% 0px -55%'});navSections.forEach(s=>navIO.observe(s));

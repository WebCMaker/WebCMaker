(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toggle=document.querySelector('.menu-toggle'),nav=document.getElementById('site-nav');
  function closeMenu(focus=false){
    if(!toggle||!nav)return;
    toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Открыть меню');nav.classList.remove('open');
    if(focus)toggle.focus({preventScroll:true});
  }
  if(toggle&&nav){
    toggle.hidden=false;
    toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');nav.classList.toggle('open',open);});
    nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeMenu()));
    document.addEventListener('click',event=>{if(!nav.contains(event.target)&&!toggle.contains(event.target))closeMenu();});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true')closeMenu(true);});
    const desktop=window.matchMedia('(min-width:761px)'),reset=()=>closeMenu(nav.contains(document.activeElement));
    if(desktop.addEventListener)desktop.addEventListener('change',reset);else if(desktop.addListener)desktop.addListener(reset);
  }
  function openHash(){const target=document.getElementById(location.hash.slice(1));if(target?.tagName==='DETAILS')target.open=true;}
  openHash();window.addEventListener('hashchange',openHash);

  const slides={
    light:[
      {src:'forma-interior.webp',width:960,height:653,alt:'Светлая общая зона с натуральными материалами',caption:'Общая зона и связь с садом'},
      {src:'forma-concrete.webp',width:640,height:960,alt:'Подготовка бетонного основания',caption:'Подготовка основания',fit:'contain'}
    ],
    slope:[
      {src:'../../forma-house.webp',srcset:'../../forma-house-small.webp 640w, ../../forma-house.webp 800w',width:800,height:1200,alt:'Современный светлый дом среди деревьев',caption:'Фасад и окружающий ландшафт',fit:'contain'},
      {src:'forma-building.webp',width:960,height:640,alt:'Каркас строящегося здания',caption:'Иллюстрация этапа: каркас'},
      {src:'forma-structure.webp',width:768,height:960,alt:'Конструктив здания и подъёмный кран',caption:'Иллюстрация этапа: конструктив',fit:'contain'}
    ]
  };
  let lightbox=null,lightboxImage=null,lightboxCaption=null,lightboxTrigger=null;
  function openImage(image,caption,trigger){
    if(!lightbox){
      const dialog=document.createElement('dialog');
      if(typeof dialog.showModal!=='function')return;
      dialog.className='image-lightbox';dialog.setAttribute('aria-label','Фотография проекта');
      const close=document.createElement('button');close.type='button';close.className='lightbox-close';close.textContent='×';close.setAttribute('aria-label','Закрыть фотографию');
      const figure=document.createElement('figure');lightboxImage=document.createElement('img');lightboxCaption=document.createElement('figcaption');
      figure.append(lightboxImage,lightboxCaption);dialog.append(close,figure);document.body.append(dialog);lightbox=dialog;
      close.addEventListener('click',()=>dialog.close());
      dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');lightboxTrigger?.focus({preventScroll:true});lightboxTrigger=null;});
      dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();});
    }
    lightboxImage.src=image.src;lightboxImage.width=image.width;lightboxImage.height=image.height;lightboxImage.alt=image.alt;
    lightboxCaption.textContent=caption;lightboxTrigger=trigger;document.body.classList.add('dialog-open');lightbox.showModal();
  }
  document.querySelectorAll('[data-gallery]').forEach(gallery=>{
    const images=slides[gallery.dataset.gallery],image=gallery.querySelector('[data-gallery-image]');
    if(!images||!image)return;
    let index=0;
    const show=next=>{
      index=(next+images.length)%images.length;const item=images[index];
      image.src=item.src;image.width=item.width;image.height=item.height;image.alt=item.alt;image.style.objectFit=item.fit||'cover';
      if(item.srcset){image.srcset=item.srcset;image.sizes='(max-width:760px) calc(100vw - 40px), 1000px';}else{image.removeAttribute('srcset');image.removeAttribute('sizes');}
      gallery.querySelector('[data-gallery-caption]').textContent=item.caption;
      gallery.querySelector('[data-gallery-count]').textContent=`${String(index+1).padStart(2,'0')} / ${String(images.length).padStart(2,'0')}`;
      gallery.querySelectorAll('[data-gallery-index]').forEach(link=>{if(Number(link.dataset.galleryIndex)===index)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});
    };
    const controls=gallery.querySelector('.gallery-navigation');if(controls)controls.hidden=false;
    if(typeof document.createElement('dialog').showModal==='function'){
      const zoom=document.createElement('button');zoom.type='button';zoom.className='gallery-zoom';zoom.textContent='↗';zoom.setAttribute('aria-label','Открыть фотографию крупно');
      zoom.addEventListener('click',()=>openImage(image,gallery.querySelector('[data-gallery-caption]').textContent,zoom));gallery.append(zoom);
    }
    gallery.addEventListener('click',event=>{const control=event.target instanceof Element?event.target.closest('[data-gallery-index],[data-gallery-step]'):null;if(!control||!gallery.contains(control))return;event.preventDefault();show(control.hasAttribute('data-gallery-index')?Number(control.dataset.galleryIndex):index+Number(control.dataset.galleryStep));});
    gallery.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();show(index+(event.key==='ArrowRight'?1:-1));}});
    show(0);
  });

  const form=document.getElementById('project-request');
  if(!form)return;
  const byId=id=>document.getElementById(id);
  const area=byId('project-area'),range=byId('project-area-range'),finish=byId('project-finish'),ready=byId('project-readiness'),service=byId('request-service'),comment=byId('request-comment');
  const directionNames={house:'Строительство дома',reconstruction:'Реконструкция',finishing:'Внутренняя отделка'};
  const finishNames={prepared:'Подготовка под отделку',finished:'Чистовая отделка',complete:'Комплексный проект'};
  const readyNames={needed:'Нужна разработка проекта',ready:'Проект уже есть',review:'Нужна проверка проекта'};
  const has=(map,key)=>Object.prototype.hasOwnProperty.call(map,key);
  const readArea=value=>{const n=Number(value);return Math.max(40,Math.min(400,Math.round(String(value??'').trim()!==''&&Number.isFinite(n)?n:120)));};
  const params=new URLSearchParams(location.search);
  const state={scope:has(directionNames,params.get('scope'))?params.get('scope'):'house',area:readArea(params.get('area')),finish:'prepared',readiness:'needed'};
  let lastRequest='';
  const checklist=()=>[
    {house:'Исходные данные участка',reconstruction:'Обследование существующего объекта',finishing:'Проверка готовности поверхностей'}[state.scope],
    {needed:'Разработка проектных решений',ready:'Сверка с готовым проектом',review:'Проверка проектных решений'}[state.readiness],
    {house:'Конструктив и инженерная подготовка',reconstruction:'Планировка и обновление инженерии',finishing:'Подготовка оснований и материалов'}[state.scope],
    {prepared:'Подготовка к внутренней отделке',finished:'Чистовые покрытия и детали',complete:'Объединение этапов в общий план'}[state.finish]
  ];
  function invalidate(){lastRequest='';byId('request-result').hidden=true;byId('request-summary').textContent='';byId('copy-status').textContent='';}
  function render(){
    byId('config-result-title').textContent=directionNames[state.scope];byId('area-output').value=String(state.area);byId('finish-output').textContent=finishNames[state.finish];
    byId('config-checklist').replaceChildren(...checklist().map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
    byId('request-configuration').value=`${state.area} м² · ${finishNames[state.finish]} · ${readyNames[state.readiness]}`;service.value=state.scope;
    document.querySelectorAll('input[name="scope"]').forEach(input=>{input.checked=input.value===state.scope;});byId('config-status').textContent='';invalidate();
  }
  document.querySelectorAll('input[name="scope"]').forEach(input=>input.addEventListener('change',()=>{if(has(directionNames,input.value)){state.scope=input.value;render();}}));
  service.addEventListener('change',()=>{if(has(directionNames,service.value)){state.scope=service.value;render();}});
  range.addEventListener('input',()=>{state.area=readArea(range.value);area.value=String(state.area);render();});
  area.addEventListener('input',()=>{if(area.value===''||!Number.isFinite(Number(area.value)))return;state.area=readArea(area.value);range.value=String(state.area);render();});
  area.addEventListener('change',()=>{state.area=readArea(area.value);area.value=range.value=String(state.area);render();});
  finish.addEventListener('change',()=>{if(has(finishNames,finish.value)){state.finish=finish.value;render();}});
  ready.addEventListener('change',()=>{if(has(readyNames,ready.value)){state.readiness=ready.value;render();}});
  byId('use-configuration').disabled=false;byId('prepare-request').disabled=false;
  byId('use-configuration').addEventListener('click',()=>{render();byId('config-status').textContent='Параметры добавлены в черновик ниже.';byId('contact').scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'});comment.focus({preventScroll:true});});
  // Deliberately local: no contact details, network requests or stored form data.
  form.addEventListener('submit',event=>event.preventDefault());comment.addEventListener('input',invalidate);
  byId('prepare-request').addEventListener('click',()=>{
    if(!form.reportValidity())return;const note=comment.value.trim();
    lastRequest=['FORMA — демонстрационный черновик',directionNames[state.scope],`Площадь: ${state.area} м²`,`Результат: ${finishNames[state.finish]}`,`Проект: ${readyNames[state.readiness]}`,'','Предварительный состав работ:',...checklist().map(item=>`— ${item}`),...(note?['','Комментарий:',note]:[]),'','Демонстрация. Заявка не отправлена.'].join('\n');
    byId('request-summary').textContent=lastRequest;const result=byId('request-result');result.hidden=false;result.focus({preventScroll:true});result.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'nearest'});
  });
  byId('copy-request').addEventListener('click',async()=>{if(!lastRequest)return;try{if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');await navigator.clipboard.writeText(lastRequest);byId('copy-status').textContent='Черновик скопирован.';}catch{byId('copy-status').textContent='Выделите текст черновика и скопируйте его вручную.';}});
  area.value=range.value=String(state.area);render();
})();

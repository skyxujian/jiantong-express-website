const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('.site-nav');
if(menuButton&&navigation){menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));navigation.classList.toggle('open',!open)});navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menuButton.setAttribute('aria-expanded','false');navigation.classList.remove('open')}))}
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const items=document.querySelectorAll('.reveal');
if(reduced){items.forEach(item=>item.classList.add('visible'))}else{const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.12});items.forEach(item=>observer.observe(item))}

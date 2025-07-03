// Page Title
document.title = "Somarthok: Sustainable Cutlery & Packaging";
document.getElementById('page-title').innerText = "Somarthok: Sustainable Cutlery & Packaging";

// Header
document.getElementById('header-logo').src = content.header.image_urls[0];
document.getElementById('header-brand').innerText = content.header.texts[0];

// Nav links
const navIcons = ['fa-utensils', 'fa-seedling', 'fa-chart-line', 'fa-envelope'];
const navAnchors = ['#products', '#about', '#stats', '#contact'];
let navHtml = '', mobileNavHtml = '';
for(let i=1; i<content.header.texts.length; i++) {
  navHtml += `<li><a href="${navAnchors[i-1]}" class="hover:text-eco3 transition-colors px-6 py-2 rounded-full shadow text-base flex items-center gap-2 menu-pill"><i class="fa-solid ${navIcons[i-1]}"></i> ${content.header.texts[i]}</a></li>`;
  mobileNavHtml += `<li style="--i:${i};"><a href="${navAnchors[i-1]}" class="hover:text-eco3 transition-colors px-6 py-2 rounded-full shadow text-base flex items-center gap-2 menu-pill"><i class="fa-solid ${navIcons[i-1]}"></i> ${content.header.texts[i]}</a></li>`;
}
document.getElementById('nav-links').innerHTML = navHtml;
document.getElementById('mobile-nav-links').innerHTML = mobileNavHtml;

// Hero Section
document.getElementById('hero-title').innerText = content.hero_section.texts[0];
document.getElementById('hero-desc').innerHTML =
  content.hero_section.texts[1] + '<br><span class="italic text-eco3">' + content.hero_section.texts[2] + '</span>';
document.getElementById('hero-cta').innerHTML = `<i class="fa-solid fa-cart-shopping mr-2"></i> ${content.hero_section.texts[3]}`;
document.getElementById('hero-img').src = content.hero_section.image_urls[0];

// Products Section
document.getElementById('products-title').innerText = content.products_section.texts[0];
let products = '';
for(let i=0; i<3; i++) {
  const idx = 1 + i*3;
  products += `
  <div class="bg-gradient-to-br from-eco${(i%5)+1} via-eco${((i+1)%5)+1} to-eco${((i+2)%5)+1} rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition-transform duration-300 group animate-fade-in">
    <img src="${content.products_section.image_urls[i]}" alt="" class="rounded-full w-32 h-32 object-cover border-4 border-white mb-4 group-hover:shadow-2xl transition-shadow" />
    <h3 class="font-heading text-xl text-white mb-2">${content.products_section.texts[idx]}</h3>
    <p class="text-white/90 text-center mb-4">${content.products_section.texts[idx+1]}</p>
    <span class="bg-white/90 text-eco${(i%5)+1} font-bold px-4 py-1 rounded-full mb-3">${content.products_section.texts[idx+2]}</span>
    <button class="px-6 py-2 rounded-full gradient-btn text-white font-semibold shadow hover:scale-105 transition-all duration-200"><i class="fa-solid fa-cart-plus shine-button"></i> Add to Cart</button>
  </div>`;
}
document.getElementById('products-list').innerHTML = products;

// About Section
document.getElementById('about-img').src = content.about_section.image_urls[0];
document.getElementById('about-title').innerText = content.about_section.texts[0];
let aboutList = '';
for(let i=1; i<=4; i++) {
  aboutList += `<li><i class="fa-solid fa-circle-check text-eco1 mr-2"></i> <span class="font-bold">${content.about_section.texts[i].split('—')[0]}</span>${content.about_section.texts[i].includes('—') ? content.about_section.texts[i].split('—')[1] : ''}</li>`;
}
document.getElementById('about-list').innerHTML = aboutList;
document.getElementById('about-desc').innerText = content.about_section.texts[5];

// Stats Section
document.getElementById('stats-title').innerText = content.stats_section.texts[0];
let statsList = '';
const statsIcons = ['fa-globe', 'fa-tree', 'fa-hand-holding-heart'];
const statsColors = ['eco1', 'eco2', 'eco3'];
for(let i=1; i<content.stats_section.texts.length; i++) {
  const parts = content.stats_section.texts[i].split(' ');
  statsList += `<div class="flex items-center gap-4">
    <i class="fa-solid ${statsIcons[i-1]} text-${statsColors[i-1]} text-3xl"></i>
    <div>
      <span class="font-bold text-2xl text-${statsColors[i-1]}">${parts[0]}</span>
      <span class="text-gray-700">${content.stats_section.texts[i].substring(parts[0].length)}</span>
    </div>
  </div>`;
}
document.getElementById('stats-list').innerHTML = statsList;

// Contact Section
document.getElementById('contact-title').innerText = content.contact_section.texts[0];
document.getElementById('contact-name').placeholder = content.contact_section.texts[1];
document.getElementById('contact-email').placeholder = content.contact_section.texts[2];
document.getElementById('contact-message').placeholder = content.contact_section.texts[3];
document.getElementById('contact-submit').innerHTML = `<i class="fa-solid fa-paper-plane mr-2"></i> ${content.contact_section.texts[4]}`;

// Footer
document.getElementById('footer-logo').src = content.footer.image_urls[0];
document.getElementById('footer-brand').innerText = content.footer.texts[0];

// Mobile Menu
const body = document.body;
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenu = document.getElementById('close-menu');

// Open/close functions with scroll fix and animation
function openMobileMenu() {
  mobileMenu.classList.add('active');
  mobileMenu.style.display = 'flex';
  body.style.overflowX = 'hidden';
  // Animate mobile menu items
  const items = mobileMenu.querySelectorAll('ul > li');
  items.forEach((li, i) => {
    li.style.setProperty('--i', i+1);
  });
}
function closeMobileMenu() {
  mobileMenu.classList.remove('active');
  setTimeout(() => {
    mobileMenu.style.display = 'none';
  }, 400); // matches CSS transition
  body.style.overflowX = '';
}
menuBtn.onclick = openMobileMenu;
closeMenu.onclick = closeMobileMenu;

// Add event listeners to mobile menu links to close the menu on click
function addMobileMenuLinkListeners() {
  const mobileNavLinks = document.getElementById('mobile-nav-links');
  const links = mobileNavLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}
addMobileMenuLinkListeners();

// D3.js Bar Chart (Marketing Stats)
const data = [
  { label: "2023", value: 30 },
  { label: "2024", value: 100 },
  { label: "2025", value: 500 },
  { label: "2026", value: 900 },
];
const w = 250, h = 220, margin = {top: 30, right: 20, bottom: 40, left: 40};
const svg = d3.select("#d3-bar-chart")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

const x = d3.scaleBand()
  .domain(data.map(d => d.label))
  .range([margin.left, w - margin.right])
  .padding(0.22);

const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.value) + 5])
  .range([h - margin.bottom, margin.top]);

svg.append("g")
  .attr("transform", `translate(0,${h - margin.bottom})`)
  .call(d3.axisBottom(x).tickSizeOuter(0))
  .attr("font-size", "1rem");

svg.append("g")
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y).ticks(5))
  .attr("font-size", "1rem");

svg.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", d => x(d.label))
  .attr("y", h - margin.bottom)
  .attr("width", x.bandwidth())
  .attr("height", 0)
  .attr("rx", 8)
  .attr("fill", "url(#eco-gradient)")
  .on("mouseover", function() { d3.select(this).attr("fill", "#34d399"); })
  .on("mouseout", function() { d3.select(this).attr("fill", "url(#eco-gradient)"); })
  .transition()
  .duration(1200)
  .delay((d, i) => i * 200)
  .attr("y", d => y(d.value))
  .attr("height", d => h - margin.bottom - y(d.value));

// Gradient fill for bars
svg.append("defs").append("linearGradient")
  .attr("id", "eco-gradient")
  .attr("x1", "0%").attr("y1", "0%")
  .attr("x2", "0%").attr("y2", "100%")
  .selectAll("stop")
  .data([
    {offset: "0%", color: "#60a5fa"},
    {offset: "50%", color: "#34d399"},
    {offset: "100%", color: "#fbbf24"}
  ])
  .enter().append("stop")
  .attr("offset", d => d.offset)
  .attr("stop-color", d => d.color);

svg.selectAll("text.value")
  .data(data)
  .enter()
  .append("text")
  .attr("class", "value")
  .attr("x", d => x(d.label) + x.bandwidth() / 2)
  .attr("y", d => y(d.value) - 10)
  .attr("text-anchor", "middle")
  .attr("fill", "#222")
  .attr("font-size", "1.1rem")
  .attr("font-weight", "bold")
  .text(d => d.value + "K");

// --- Custom Cursor Invert Overlay ---
document.body.addEventListener('mousemove', (event) => {
    document.body.style.setProperty('--mouse-x', `${event.clientX}px`);
    document.body.style.setProperty('--mouse-y', `${event.clientY}px`);
});


// smooth scrollToSection
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

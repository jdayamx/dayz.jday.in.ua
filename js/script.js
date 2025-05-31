let newsData = [];
const newsPerPage = 5;
let currentPage = 1;

function renderNews(page) {
  const start = (page - 1) * newsPerPage;
  const end = start + newsPerPage;
  const newsToShow = newsData.slice(start, end);

  const container = document.getElementById('news-container');
  container.innerHTML = '';

  newsToShow.forEach(news => {
    const newsItem = document.createElement('div');
    newsItem.classList.add('news-item');
    newsItem.innerHTML = `
      <h2>${news.title}</h2>
      <p><em>${news.date}</em></p>
      <p>${news.text}</p>
      ${news.image ? `<img src="${news.image}" alt="${news.title}" style="max-width:100%;">` : ''}
      ${news.video ? `<iframe width="560" height="315" src="${news.video.replace("watch?v=", "embed/")}" frameborder="0" allowfullscreen></iframe>` : ''}
      <hr>
    `;
    container.appendChild(newsItem);
  });

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(newsData.length / newsPerPage);
  const paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.disabled = (i === currentPage);
    btn.onclick = () => {
      currentPage = i;
      renderNews(currentPage);
    };
    paginationContainer.appendChild(btn);
  }
}

fetch('https://dayz.jday.in.ua/news.json')
  .then(res => res.json())
  .then(data => {
    newsData = data.sort((a, b) => new Date(b.date) - new Date(a.date)); // новіші — вище
    renderNews(currentPage);
  })
  .catch(error => {
    console.error('Помилка завантаження news.json:', error);
    document.getElementById('news-container').textContent = 'Не вдалося завантажити новини.';
  });

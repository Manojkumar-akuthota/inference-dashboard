const pages = ['Home', 'Products', 'Contact', 'About', 'Cart'];
const actions = ['Click', 'Scroll', 'Add to Cart', 'View', 'Logout'];

let clicks = [];

function generateClick() {
  return {
    timestamp: new Date().toLocaleTimeString(),
    page: pages[Math.floor(Math.random() * pages.length)],
    action: actions[Math.floor(Math.random() * actions.length)]
  };
}

function updateClickTable(click) {
  const tbody = document.getElementById('clickTable').querySelector('tbody');
  const row = document.createElement('tr');
  row.innerHTML = `<td>${click.timestamp}</td><td>${click.page}</td><td>${click.action}</td>`;
  tbody.prepend(row);
}

const ctx = document.getElementById('clickChart').getContext('2d');
const clickChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Clicks Over Time',
      data: [],
      backgroundColor: 'rgba(0, 184, 148, 0.2)',
      borderColor: '#00b894',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    scales: {
      x: { ticks: { color: '#ecf0f1' } },
      y: { ticks: { color: '#ecf0f1' }, beginAtZero: true }
    },
    plugins: {
      legend: { labels: { color: '#ecf0f1' } }
    }
  }
});

const metadata = {
  Browser: navigator.userAgent,
  Language: navigator.language,
  Platform: navigator.platform,
  Online: navigator.onLine ? "Yes" : "No"
};

function displayMetadata() {
  const list = document.getElementById('metadataList');
  for (let key in metadata) {
    const li = document.createElement('li');
    li.textContent = `${key}: ${metadata[key]}`;
    list.appendChild(li);
  }
}

function makeInference(clicks) {
  let inference = "Normal browsing behavior.";
  const addToCartClicks = clicks.filter(c => c.action === "Add to Cart").length;
  const frequentCartVisits = clicks.filter(c => c.page === "Cart").length;

  if (addToCartClicks >= 3) {
    inference = "User likely intending to purchase.";
  } else if (frequentCartVisits >= 2) {
    inference = "User checking out cart frequently.";
  } else if (clicks.length > 10) {
    inference = "User deeply engaged on the site.";
  }

  document.getElementById('inference').textContent = inference;
}

document.getElementById('exportBtn').addEventListener('click', function() {
  let csvContent = "data:text/csv;charset=utf-8,Timestamp,Page,Action\n";
  clicks.forEach(c => {
    csvContent += `${c.timestamp},${c.page},${c.action}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'click_data.csv');
  document.body.appendChild(link);

  link.click();
  document.body.removeChild(link);
});

function simulateClickActivity() {
  const click = generateClick();
  clicks.push(click);
  updateClickTable(click);

  clickChart.data.labels.push(click.timestamp);
  clickChart.data.datasets[0].data.push(clicks.length);
  clickChart.update();

  makeInference(clicks);
}

displayMetadata();
setInterval(simulateClickActivity, 3000);
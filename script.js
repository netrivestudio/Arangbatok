const form = document.getElementById('form');
const tabel = document.querySelector('#tabel tbody');
const totalEl = document.getElementById('total');

let data = JSON.parse(localStorage.getItem('pembukuan')) || [];

function render() {
  tabel.innerHTML = '';
  let total = 0;
  data.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.tanggal}</td>
      <td>${item.jenis === 'pemasukan' ? 'Rp ' + item.nominal : '-'}</td>
      <td>${item.jenis === 'pengeluaran' ? 'Rp ' + item.nominal : '-'}</td>
    `;
    tabel.appendChild(tr);
    total += item.jenis === 'pemasukan' ? item.nominal : -item.nominal;
  });
  totalEl.textContent = 'Total: Rp ' + total.toLocaleString('id-ID');
  localStorage.setItem('pembukuan', JSON.stringify(data));
}

form.onsubmit = function (e) {
  e.preventDefault();
  const tanggal = document.getElementById('tanggal').value;
  const nominal = parseInt(document.getElementById('nominal').value);
  const jenis = document.getElementById('jenis').value;
  if (tanggal && nominal && jenis) {
    data.push({ tanggal, nominal, jenis });
    render();
    form.reset();
  }
}

function resetData() {
  if (confirm('Hapus semua data?')) {
    data = [];
    localStorage.removeItem('pembukuan');
    render();
  }
}

render();
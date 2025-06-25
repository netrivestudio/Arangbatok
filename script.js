const form = document.getElementById('form');
const tabel = document.querySelector('#tabel tbody');
const totalEl = document.getElementById('total');

let data = JSON.parse(localStorage.getItem('pembukuan')) || [];

// Render data ke tabel
function render() {
  tabel.innerHTML = '';
  let total = 0;
  data.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.tanggal}</td>
      <td>${item.jenis === 'pemasukan' ? 'Rp ' + item.nominal.toLocaleString('id-ID') : '-'}</td>
      <td>${item.jenis === 'pengeluaran' ? 'Rp ' + item.nominal.toLocaleString('id-ID') : '-'}</td>
    `;
    tabel.appendChild(tr);
    total += item.jenis === 'pemasukan' ? item.nominal : -item.nominal;
  });
  totalEl.textContent = 'Total: Rp ' + total.toLocaleString('id-ID');
  localStorage.setItem('pembukuan', JSON.stringify(data));
}

// Submit data
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

// Reset semua data
function resetData() {
  if (confirm('Hapus semua data?')) {
    data = [];
    localStorage.removeItem('pembukuan');
    render();
  }
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
}

// Simpan mode saat loading
window.onload = function () {
  const dark = localStorage.getItem('darkMode') === 'true';
  if (dark) {
    document.body.classList.add('dark-mode');
  }
  render();
}

// Hitung total bersih
function getTotal() {
  return data.reduce((acc, item) => {
    return item.jenis === 'pemasukan' ? acc + item.nominal : acc - item.nominal;
  }, 0);
}

// Export ke PDF
function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Pembukuan Harian", 14, 20);

  const rows = [];
  data.forEach(item => {
    rows.push([
      item.tanggal,
      item.jenis === 'pemasukan' ? 'Rp ' + item.nominal.toLocaleString('id-ID') : '-',
      item.jenis === 'pengeluaran' ? 'Rp ' + item.nominal.toLocaleString('id-ID') : '-'
    ]);
  });

  doc.autoTable({
    head: [['Tanggal', 'Pemasukan', 'Pengeluaran']],
    body: rows,
    startY: 30,
  });

  doc.text(`Total: Rp ${getTotal().toLocaleString('id-ID')}`, 14, doc.lastAutoTable.finalY + 10);

  doc.save('pembukuan.pdf');
}

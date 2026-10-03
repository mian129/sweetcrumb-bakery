import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const categoryTitles = {
  cookies: 'Cookies',
  cupcakes: 'Cupcakes',
  cakes: 'Cakes',
  pastries: 'Pastries',
  brownies: 'Brownies',
  other: 'Other'
};

export default function generateMenuPdf(products = []) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;

  const availableProducts = products.filter((p) => p.available !== false);
  const grouped = availableProducts.reduce((acc, product) => {
    const category = product.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  doc.setFillColor(233, 30, 140);
  doc.rect(0, 0, pageWidth, 120, 'F');
  doc.setFillColor(255, 245, 250);
  doc.rect(0, 120, pageWidth, 10, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.text('Sweet Crumb Bakery', margin, 58);
  doc.setFontSize(11);
  doc.text('Fresh • Handmade • Delicious', margin, 84);

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.text(`Menu generated on ${new Date().toLocaleDateString()}`, margin, 155);
  doc.text(`${availableProducts.length} items available`, pageWidth - margin, 155, { align: 'right' });

  let startY = 185;

  Object.keys(categoryTitles).forEach((category) => {
    const items = grouped[category] || [];
    if (!items.length) return;

    if (startY > 720) {
      doc.addPage();
      startY = 60;
    }

    doc.setTextColor(233, 30, 140);
    doc.setFontSize(16);
    doc.text(categoryTitles[category], margin, startY);
    startY += 12;

    autoTable(doc, {
      startY,
      head: [['Item', 'Description', 'Price']],
      body: items.map((item) => [
        item.name || 'Untitled',
        item.description || '',
        `Rs. ${item.price || 0}`
      ]),
      theme: 'grid',
      margin: { left: margin, right: margin },
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 8,
        textColor: [60, 60, 60],
        lineColor: [245, 220, 232],
        lineWidth: 0.5
      },
      headStyles: {
        fillColor: [253, 248, 243],
        textColor: [233, 30, 140],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 140, fontStyle: 'bold' },
        1: { cellWidth: 290 },
        2: { cellWidth: 70, halign: 'right', fontStyle: 'bold' }
      },
      didDrawPage: () => {
        startY = doc.lastAutoTable.finalY + 35;
      }
    });

    startY = doc.lastAutoTable.finalY + 35;
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text('Sweet Crumb Bakery — Thank you for visiting', margin, doc.internal.pageSize.getHeight() - 25);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, doc.internal.pageSize.getHeight() - 25, { align: 'right' });
  }

  doc.save('sweet-crumb-menu.pdf');
}

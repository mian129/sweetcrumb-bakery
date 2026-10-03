import { jsPDF } from 'jspdf';

const categoryTitles = {
  cookies: 'Cookies',
  cupcakes: 'Cupcakes',
  cakes: 'Cakes',
  pastries: 'Pastries',
  brownies: 'Brownies',
  other: 'Other'
};

const loadImageDataUrl = async (url) => {
  if (!url) return null;
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) return null;
    const blob = await res.blob();
    const rawDataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
    if (!rawDataUrl) return null;

    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = rawDataUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    if (!canvas.width || !canvas.height) return null;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.92);
  } catch (err) {
    return null;
  }
};

export default async function generateMenuPdf(products = []) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 42;
  const usableWidth = pageWidth - margin * 2;

  const availableProducts = products.filter((p) => p.available !== false);
  const grouped = availableProducts.reduce((acc, product) => {
    const category = (product.category || 'other').toLowerCase();
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});
  Object.keys(grouped).forEach((category) => {
    grouped[category].sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
  });

  const drawPageHeader = () => {
    doc.setFillColor(233, 30, 140);
    doc.rect(0, 0, pageWidth, 110, 'F');
    doc.setFillColor(255, 248, 252);
    doc.rect(0, 110, pageWidth, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.text('Sweet Crumb Bakery', margin, 52);
    doc.setFontSize(10);
    doc.text('Fresh • Handmade • Delicious', margin, 76);
    doc.setTextColor(255, 229, 241);
    doc.text(`Updated ${new Date().toLocaleDateString()}`, pageWidth - margin, 76, { align: 'right' });
  };

  const drawFooter = () => {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setDrawColor(245, 215, 230);
      doc.line(margin, pageHeight - 42, pageWidth - margin, pageHeight - 42);
      doc.setTextColor(160, 160, 160);
      doc.setFontSize(8);
      doc.text('Sweet Crumb Bakery — handcrafted treats made fresh daily', margin, pageHeight - 24);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 24, { align: 'right' });
    }
  };

  drawPageHeader();
  let y = 145;
  doc.setTextColor(90, 90, 90);
  doc.setFontSize(10);
  doc.text(`${availableProducts.length} available items`, margin, y);
  y += 28;

  for (const category of Object.keys(categoryTitles)) {
    const items = grouped[category] || [];
    if (!items.length) continue;

    if (y > pageHeight - 160) {
      doc.addPage();
      drawPageHeader();
      y = 145;
    }

    doc.setTextColor(233, 30, 140);
    doc.setFontSize(17);
    doc.text(categoryTitles[category], margin, y);
    doc.setDrawColor(233, 30, 140);
    doc.line(margin, y + 8, pageWidth - margin, y + 8);
    y += 28;

    for (const item of items) {
      const cardHeight = 86;
      if (y + cardHeight > pageHeight - 58) {
        doc.addPage();
        drawPageHeader();
        y = 145;
      }

      doc.setFillColor(255, 250, 253);
      doc.setDrawColor(244, 214, 229);
      doc.roundedRect(margin, y, usableWidth, cardHeight, 10, 10, 'FD');

      const imageData = await loadImageDataUrl(item.image);
      if (imageData) {
        try {
          doc.addImage(imageData, 'JPEG', margin + 12, y + 12, 62, 62);
        } catch (err) {
          // ignore image errors
        }
      } else {
        doc.setFillColor(246, 232, 240);
        doc.roundedRect(margin + 12, y + 12, 62, 62, 8, 8, 'F');
        doc.setTextColor(200, 150, 175);
        doc.setFontSize(8);
        doc.text('No image', margin + 43, y + 46, { align: 'center' });
      }

      doc.setTextColor(55, 55, 55);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(String(item.name || 'Untitled'), margin + 90, y + 26, { maxWidth: usableWidth - 190 });

      doc.setTextColor(120, 120, 120);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      const description = String(item.description || 'Freshly prepared, handmade with love.');
      doc.text(doc.splitTextToSize(description, usableWidth - 190).slice(0, 2), margin + 90, y + 43);

      doc.setTextColor(233, 30, 140);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`Rs. ${item.price || 0}`, pageWidth - margin - 14, y + 30, { align: 'right' });
      if (item.featured) {
        doc.setFillColor(233, 30, 140);
        doc.roundedRect(pageWidth - margin - 78, y + 52, 64, 18, 9, 9, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text('Featured', pageWidth - margin - 46, y + 64, { align: 'center' });
      }

      y += cardHeight + 12;
    }

    y += 16;
  }

  drawFooter();
  doc.save('sweet-crumb-menu.pdf');
}

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify((error) => {
  if (error) {
    console.log('Email transporter error:', error);
  } else {
    console.log('Email server ready');
  }
});

const sendOrderConfirmation = async (order) => {
  try {
    const items = order.items || [];
    const itemsList = items.map(item =>
      `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}x ${item.name || 'Product'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${(item.price || 0) * item.quantity}</td>
      </tr>`
    ).join('');

    const orderNumber = order.order_number || 'N/A';
    const customerName = order.customer_name || order.customerName || 'Customer';
    const orderDate = order.created_at || order.createdAt;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #e91e8c 0%, #c2185b 100%); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .header p { color: rgba(255,255,255,0.9); margin: 5px 0 0; }
        .content { padding: 30px; }
        .order-badge { background: #d4edda; color: #155724; padding: 8px 20px; border-radius: 20px; display: inline-block; font-weight: 600; margin-bottom: 20px; }
        .order-number { background: #e91e8c; color: white; padding: 12px 24px; border-radius: 12px; display: inline-block; font-size: 24px; font-weight: 700; letter-spacing: 2px; margin: 15px 0; }
        .section { margin-bottom: 25px; }
        .section h3 { color: #880e4f; font-size: 14px; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 1px; }
        .info-box { background: #fff5f7; padding: 15px; border-radius: 10px; }
        .info-box p { margin: 5px 0; color: #555; }
        table { width: 100%; border-collapse: collapse; }
        .total-row { border-top: 2px solid #eee; font-weight: 700; font-size: 18px; }
        .total-row td { padding-top: 15px; color: #880e4f; }
        .tracking-box { background: #f8f9fa; border: 2px dashed #e91e8c; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0; }
        .tracking-box a { display: inline-block; padding: 12px 30px; background: #e91e8c; color: white; text-decoration: none; border-radius: 25px; font-weight: 600; margin-top: 10px; }
        .footer { background: #880e4f; padding: 20px; text-align: center; color: #fce4ec; }
        .footer p { margin: 5px 0; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Sweet Crumb</h1>
          <p>Order Confirmation</p>
        </div>
        
        <div class="content">
          <div class="order-badge">Order Confirmed</div>
          
          <p style="color: #555; font-size: 16px;">
            Assalam-o-Alaikum <strong>${customerName}</strong>,
          </p>
          <p style="color: #555; line-height: 1.8;">
            Shukriya! Aapka order successfully receive ho gaya hai. Hum aapke order ko jaldi se jaldi tayyar karenge.
          </p>

          <div style="text-align: center;">
            <p style="color: #880e4f; font-weight: 600; margin-bottom: 5px;">Your Order Number</p>
            <div class="order-number">${orderNumber}</div>
          </div>

          <div class="tracking-box">
            <p style="color: #555; font-weight: 600; margin: 0;">Track your order anytime!</p>
            <p style="color: #999; font-size: 13px; margin: 5px 0 10px;">Visit our website and enter your order number</p>
            <a href="https://sweetcrumb-bakery-gb39.vercel.app/track">Track Order</a>
          </div>

          <div class="section">
            <h3>Order Details</h3>
            <div class="info-box">
              <p><strong>Order Number:</strong> ${orderNumber}</p>
              <p><strong>Date:</strong> ${orderDate ? new Date(orderDate).toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
            </div>
          </div>

          <div class="section">
            <h3>Items Ordered</h3>
            <table>
              ${itemsList}
              <tr class="total-row">
                <td style="padding: 10px;">Total</td>
                <td style="padding: 10px; text-align: right; color: #d4a574;">Rs. ${order.total_amount || order.totalAmount || 0}</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <h3>Delivery Address</h3>
            <div class="info-box">
              <p>${order.address || ''}</p>
              <p>${order.city || ''} ${order.postal_code || order.postalCode || ''}</p>
              <p><strong>Phone:</strong> ${order.phone || ''}</p>
            </div>
          </div>

          <div class="section">
            <h3>Payment Method</h3>
            <div class="info-box">
              <p><strong>Bank Transfer</strong></p>
              ${order.transaction_id ? `<p><strong>Transaction ID:</strong> ${order.transaction_id}</p>` : ''}
            </div>
          </div>

          ${order.special_instructions ? `
          <div class="section">
            <h3>Special Instructions</h3>
            <div class="info-box">
              <p>${order.special_instructions}</p>
            </div>
          </div>
          ` : ''}

          <p style="color: #555; line-height: 1.8; margin-top: 20px;">
            Agar aapko koi sawal ho toh humein contact karein. Aapka order jaldi deliver ho jayega!
          </p>
        </div>

        <div class="footer">
          <p><strong>Sweet Crumb</strong></p>
          <p>Baked with Love</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"Sweet Crumb" <${process.env.EMAIL_USER}>`,
      to: order.email,
      subject: `Order Confirmed ${orderNumber} - Sweet Crumb`,
      html: html
    };

    if (order.email && order.email.includes('@') && order.email.includes('.')) {
      await transporter.sendMail(mailOptions);
      console.log('Order confirmation email sent to:', order.email);
      return true;
    } else {
      console.log('No valid email provided, skipping email');
      return false;
    }
  } catch (err) {
    console.error('Email sending failed:', err.message);
    return false;
  }
};

const sendStatusUpdate = async (order, newStatus) => {
  try {
    const customerName = order.customer_name || order.customerName || 'Customer';
    const orderNumber = order.order_number || 'N/A';

    const statusMessages = {
      confirmed: { title: 'Order Confirmed!', message: 'Aapka order confirm ho gaya hai. Hum ab isay tayyar kar rahe hain.', color: '#28a745', icon: '✅' },
      preparing: { title: 'Order Preparing!', message: 'Aapka order tayyar ho raha hai. Thodi der mein ready ho jayega.', color: '#007bff', icon: '👨‍🍳' },
      out_for_delivery: { title: 'Out for Delivery!', message: 'Aapka order raste mein hai! Jaldi aap tak pahunch jayega.', color: '#17a2b8', icon: '🚚' },
      delivered: { title: 'Order Delivered!', message: 'Mubarak ho! Aapka order deliver ho gaya hai. Enjoy karein!', color: '#28a745', icon: '🎉' },
      cancelled: { title: 'Order Cancelled', message: 'Aapka order cancel kar diya gaya hai. Agar koi sawal hai toh humein contact karein.', color: '#dc3545', icon: '❌' }
    };

    const status = statusMessages[newStatus] || statusMessages.confirmed;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #e91e8c 0%, #c2185b 100%); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .content { padding: 30px; text-align: center; }
        .status-icon { font-size: 60px; margin: 20px 0; }
        .status-title { font-size: 24px; color: ${status.color}; font-weight: 700; margin: 10px 0; }
        .order-number { background: #fff5f7; color: #880e4f; padding: 10px 20px; border-radius: 8px; display: inline-block; font-size: 18px; font-weight: 700; letter-spacing: 1px; margin: 15px 0; }
        .message { color: #555; line-height: 1.8; font-size: 16px; margin: 20px 0; }
        .tracking-box { background: #f8f9fa; border: 2px dashed #e91e8c; padding: 20px; border-radius: 12px; margin: 20px 0; }
        .tracking-box a { display: inline-block; padding: 12px 30px; background: #e91e8c; color: white; text-decoration: none; border-radius: 25px; font-weight: 600; margin-top: 10px; }
        .footer { background: #880e4f; padding: 20px; text-align: center; color: #fce4ec; }
        .footer p { margin: 5px 0; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Sweet Crumb</h1>
          <p>Order Status Update</p>
        </div>
        
        <div class="content">
          <div class="status-icon">${status.icon}</div>
          <div class="status-title">${status.title}</div>
          <div class="order-number">${orderNumber}</div>
          
          <p class="message">
            Assalam-o-Alaikum <strong>${customerName}</strong>,<br><br>
            ${status.message}
          </p>

          <div class="tracking-box">
            <p style="color: #555; font-weight: 600; margin: 0;">Track your order live!</p>
            <a href="https://sweetcrumb-bakery-gb39.vercel.app/track">Track Order</a>
          </div>
        </div>

        <div class="footer">
          <p><strong>Sweet Crumb</strong></p>
          <p>Baked with Love</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"Sweet Crumb" <${process.env.EMAIL_USER}>`,
      to: order.email,
      subject: `${status.title} - ${orderNumber} - Sweet Crumb`,
      html: html
    };

    if (order.email && order.email.includes('@') && order.email.includes('.')) {
      await transporter.sendMail(mailOptions);
      console.log('Status update email sent to:', order.email, '-', newStatus);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Status email failed:', err.message);
    return false;
  }
};

module.exports = { sendOrderConfirmation, sendStatusUpdate };

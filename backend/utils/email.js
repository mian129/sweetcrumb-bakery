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

// Verify transporter on startup
transporter.verify((error) => {
  if (error) {
    console.log('Email transporter error:', error);
  } else {
    console.log('Email server ready');
  }
});

const sendOrderConfirmation = async (order) => {
  try {
    const itemsList = order.items.map(item =>
      `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}x ${item.name || 'Product'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${(item.price || 0) * item.quantity}</td>
      </tr>`
    ).join('');

    const paymentLabels = {
      bank: 'Bank Transfer'
    };

    const orderId = order._id.toString();

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
        .section { margin-bottom: 25px; }
        .section h3 { color: #880e4f; font-size: 14px; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 1px; }
        .info-box { background: #fff5f7; padding: 15px; border-radius: 10px; }
        .info-box p { margin: 5px 0; color: #555; }
        table { width: 100%; border-collapse: collapse; }
        .total-row { border-top: 2px solid #eee; font-weight: 700; font-size: 18px; }
        .total-row td { padding-top: 15px; color: #880e4f; }
        .footer { background: #880e4f; padding: 20px; text-align: center; color: #fce4ec; }
        .footer p { margin: 5px 0; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🧁 Sweet Crumb</h1>
          <p>Order Confirmation</p>
        </div>
        
        <div class="content">
          <div class="order-badge">✓ Order Confirmed</div>
          
          <p style="color: #555; font-size: 16px;">
            Assalam-o-Alaikum <strong>${order.customerName}</strong>,
          </p>
          <p style="color: #555; line-height: 1.8;">
            Shukriya! Aapka order successfully receive ho gaya hai. Hum aapke order ko jaldi se jaldi tayyar karenge.
          </p>

          <div class="section">
            <h3>Order Details</h3>
            <div class="info-box">
              <p><strong>Order ID:</strong> #${orderId.slice(-6).toUpperCase()}</p>
              <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div class="section">
            <h3>Items Ordered</h3>
            <table>
              ${itemsList}
              <tr>
                <td style="padding: 10px; color: #666;">Subtotal</td>
                <td style="padding: 10px; text-align: right;">Rs. ${order.totalAmount - 50}</td>
              </tr>
              <tr>
                <td style="padding: 10px; color: #666;">Delivery Fee</td>
                <td style="padding: 10px; text-align: right;">Rs. 50</td>
              </tr>
              <tr class="total-row">
                <td style="padding: 10px;">Total</td>
                <td style="padding: 10px; text-align: right; color: #d4a574;">Rs. ${order.totalAmount}</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <h3>Delivery Address</h3>
            <div class="info-box">
              <p>${order.address}</p>
              <p>${order.city} ${order.postalCode}</p>
              <p><strong>Phone:</strong> ${order.phone}</p>
            </div>
          </div>

          <div class="section">
            <h3>Payment Method</h3>
            <div class="info-box">
              <p><strong>${paymentLabels[order.paymentMethod] || order.paymentMethod}</strong></p>
            </div>
          </div>

          ${order.specialInstructions ? `
          <div class="section">
            <h3>Special Instructions</h3>
            <div class="info-box">
              <p>${order.specialInstructions}</p>
            </div>
          </div>
          ` : ''}

          <p style="color: #555; line-height: 1.8; margin-top: 20px;">
            Agar aapko koi sawal ho toh humein contact karein. Aapka order jaldi deliver ho jayega!
          </p>
        </div>

        <div class="footer">
          <p><strong>Sweet Crumb</strong></p>
          <p>Baked with Love ❤️</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"🧁 Sweet Crumb" <${process.env.EMAIL_USER}>`,
      to: order.email,
      subject: `Order Confirmed #${orderId.slice(-6).toUpperCase()} - Sweet Crumb`,
      html: html,
      headers: {
        'X-Mailer': 'SweetCrumbBakery',
        'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`
      },
      replyTo: process.env.EMAIL_USER
    };

    // Only send if valid email
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

module.exports = { sendOrderConfirmation };

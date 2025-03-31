export const invoiceTemplate = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    .invoice {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid #eee;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      border-bottom: 1px solid #eee;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .header h1 {
      color: #0066cc;
      margin: 0;
    }
    .company-details, .client-details {
      margin-bottom: 20px;
    }
    .invoice-items {
      width: 100%;
      border-collapse: collapse;
    }
    .invoice-items th, .invoice-items td {
      padding: 10px;
      border-bottom: 1px solid #eee;
      text-align: left;
    }
    .invoice-items th {
      background-color: #f8f8f8;
    }
    .total {
      font-weight: bold;
      font-size: 18px;
      margin-top: 20px;
      text-align: right;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <h1>INVOICE</h1>
      <p>Invoice #: INV-2023-001</p>
      <p>Date: June 12, 2023</p>
    </div>
    
    <div class="company-details">
      <h3>From:</h3>
      <p>Your Company Name</p>
      <p>123 Business Street</p>
      <p>City, State ZIP</p>
      <p>Email: company@example.com</p>
      <p>Phone: (123) 456-7890</p>
    </div>
    
    <div class="client-details">
      <h3>To:</h3>
      <p>Client Company Name</p>
      <p>456 Client Street</p>
      <p>City, State ZIP</p>
      <p>Email: client@example.com</p>
    </div>
    
    <table class="invoice-items">
      <thead>
        <tr>
          <th>Item</th>
          <th>Description</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Service 1</td>
          <td>Professional consulting services</td>
          <td>10</td>
          <td>$100.00</td>
          <td>$1,000.00</td>
        </tr>
        <tr>
          <td>Service 2</td>
          <td>Web development</td>
          <td>20</td>
          <td>$150.00</td>
          <td>$3,000.00</td>
        </tr>
        <tr>
          <td>Service 3</td>
          <td>Maintenance</td>
          <td>5</td>
          <td>$200.00</td>
          <td>$1,000.00</td>
        </tr>
      </tbody>
    </table>
    
    <div class="total">
      <p>Subtotal: $5,000.00</p>
      <p>Tax (10%): $500.00</p>
      <p>Total: $5,500.00</p>
    </div>
    
    <div class="footer">
      <p>Thank you for your business!</p>
      <p>Payment is due within 30 days of receipt.</p>
    </div>
  </div>
</body>
</html>`;

export default invoiceTemplate;

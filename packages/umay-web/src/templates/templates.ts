import { invoiceTemplate } from "./invoice";

export interface Template {
  id: string;
  name: string;
  description: string;
  template: string;
}

// HTML şablonları ve onların başlıkları
export const templates: Template[] = [
  {
    id: "invoice",
    name: "Invoice",
    description: "Professional invoice template with itemized billing",
    template: invoiceTemplate,
  },
  {
    id: "blank",
    name: "Blank",
    description: "Start with a clean HTML template",
    template: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
    }
  </style>
</head>
<body>
  <h1>My Document</h1>
  <p>Start editing your document here...</p>
</body>
</html>`,
  },
  {
    id: "report",
    name: "Report",
    description: "Business report with table of contents",
    template: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Business Report</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .cover {
      text-align: center;
      margin-bottom: 50px;
      page-break-after: always;
    }
    .cover h1 {
      font-size: 28px;
      margin-bottom: 10px;
      color: #2c3e50;
    }
    .cover .subtitle {
      font-size: 18px;
      margin-bottom: 30px;
      color: #7f8c8d;
    }
    .cover .date {
      margin-top: 50px;
      color: #7f8c8d;
    }
    .toc {
      page-break-after: always;
    }
    .toc h2 {
      color: #2c3e50;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    .toc ul {
      list-style-type: none;
      padding-left: 0;
    }
    .toc li {
      margin-bottom: 10px;
    }
    .toc a {
      color: #3498db;
      text-decoration: none;
    }
    section {
      margin-bottom: 30px;
    }
    h2 {
      color: #2c3e50;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    h3 {
      color: #3498db;
    }
    .summary {
      background-color: #f9f9f9;
      padding: 15px;
      border-left: 4px solid #3498db;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    table, th, td {
      border: 1px solid #ddd;
    }
    th, td {
      padding: 10px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      font-size: 12px;
      color: #7f8c8d;
      border-top: 1px solid #eee;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="cover">
    <h1>Quarterly Business Report</h1>
    <div class="subtitle">Q1 2023 Performance Analysis</div>
    <div class="author">Prepared by: Your Name</div>
    <div class="date">April 15, 2023</div>
  </div>

  <div class="toc">
    <h2>Table of Contents</h2>
    <ul>
      <li><a href="#summary">Executive Summary</a></li>
      <li><a href="#introduction">Introduction</a></li>
      <li><a href="#findings">Key Findings</a></li>
      <li><a href="#recommendations">Recommendations</a></li>
      <li><a href="#conclusion">Conclusion</a></li>
    </ul>
  </div>

  <section id="summary">
    <h2>Executive Summary</h2>
    <div class="summary">
      <p>This report summarizes the company's performance for Q1 2023, highlighting key achievements, challenges, and recommendations for future growth.</p>
    </div>
    <p>The first quarter of 2023 showed significant improvement in several key performance indicators compared to the previous quarter. Revenue increased by 15%, while operational costs were reduced by 8%, resulting in an overall profit margin improvement of 12%.</p>
  </section>

  <section id="introduction">
    <h2>Introduction</h2>
    <p>This quarterly business report provides a comprehensive analysis of the company's performance during Q1 2023. It examines financial results, operational efficiency, market trends, and strategic initiatives implemented during this period.</p>
    <p>The report is based on data collected from various departments and includes comparative analysis with previous quarters to identify trends and patterns in business performance.</p>
  </section>

  <section id="findings">
    <h2>Key Findings</h2>
    
    <h3>Financial Performance</h3>
    <p>The company achieved total revenue of $2.45 million in Q1 2023, representing a 15% increase from Q4 2022. This growth was primarily driven by the launch of new product lines and expansion into new markets.</p>
    
    <table>
      <tr>
        <th>Metric</th>
        <th>Q4 2022</th>
        <th>Q1 2023</th>
        <th>Change (%)</th>
      </tr>
      <tr>
        <td>Revenue</td>
        <td>$2.13M</td>
        <td>$2.45M</td>
        <td>+15%</td>
      </tr>
      <tr>
        <td>Operational Costs</td>
        <td>$1.67M</td>
        <td>$1.54M</td>
        <td>-8%</td>
      </tr>
      <tr>
        <td>Profit Margin</td>
        <td>21.6%</td>
        <td>33.6%</td>
        <td>+12%</td>
      </tr>
    </table>
    
    <h3>Operational Efficiency</h3>
    <p>Implementation of the new inventory management system has reduced stock holding costs by 18% and improved order fulfillment rates by 12%. Employee productivity increased by 9% following the introduction of flexible working arrangements.</p>
  </section>

  <section id="recommendations">
    <h2>Recommendations</h2>
    <ol>
      <li><strong>Expand Digital Marketing Efforts:</strong> Increase investment in digital marketing channels that showed high conversion rates in Q1.</li>
      <li><strong>Product Line Optimization:</strong> Consider discontinuing underperforming products and reallocating resources to high-margin items.</li>
      <li><strong>International Expansion:</strong> Explore entry into Asian markets based on the positive market research findings.</li>
      <li><strong>Talent Acquisition:</strong> Prioritize hiring in the product development and sales departments to support growth initiatives.</li>
    </ol>
  </section>

  <section id="conclusion">
    <h2>Conclusion</h2>
    <p>Q1 2023 demonstrated the effectiveness of strategic changes implemented at the end of the previous year. The company is on track to meet or exceed annual targets if current growth trends continue. Key focus areas for Q2 should include further operational optimizations and aggressive market expansion as outlined in the recommendations section.</p>
  </section>

  <div class="footer">
    <p>Confidential - For Internal Use Only</p>
    <p>© 2023 Your Company Name</p>
  </div>
</body>
</html>`,
  },
];

// Template ID'ye göre bir şablon almanın kolay yolu
export function getTemplateById(id: string): string {
  const found = templates.find((template) => template.id === id);
  return found ? found.template : templates[0].template;
}

export default templates;

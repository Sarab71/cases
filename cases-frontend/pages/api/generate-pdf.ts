import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import { generateInvoiceHtml } from '@/utils/pdfTemplate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const data = req.body;

  const htmlContent = generateInvoiceHtml(data);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({ format: 'A4' });

  await browser.close();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=Invoice_${data.invoiceNumber}.pdf`);
  res.status(200).send(pdfBuffer);
}

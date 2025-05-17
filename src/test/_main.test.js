import generateInvoiceNumber from '../lib/invoiceGenerator.js';

const createInvoice = () => {
    const invoiceNumber = generateInvoiceNumber();
    console.log(invoiceNumber);
}

for (let i = 0; i < 10; i++) {
    createInvoice();
}
function generateRandomString(length) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
  
const generateInvoiceNumber = () => {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0].replace(/-/g, ''); // Format as YYYYMMDD
    const randomNumber = generateRandomString(5);

    return `INV-${formattedDate}${randomNumber}`;
<<<<<<< HEAD
}

export default generateInvoiceNumber;
=======
};

module.exports = generateInvoiceNumber;
>>>>>>> 7e5e88e (web only)

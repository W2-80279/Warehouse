const generateBarcode = async (data) => {
    // Generate a random numeric barcode of a specific length
    const length = Math.floor(Math.random() * 6) + 8; // Random length between 8 and 13
    const numericBarcode = String(Math.floor(Math.random() * Math.pow(10, length))).padStart(length, '0'); // Pad with leading zeros if necessary

    return new Promise((resolve, reject) => {
        bwipjs.toBuffer({
            bcid: 'code128', // Barcode type
            text: numericBarcode, // Use the generated numeric barcode
            scale: 3, // 3x scaling factor
            height: 10, // Bar height, in millimeters
            includetext: true, // Show human-readable text
            textxalign: 'center' // Center text alignment
        }, (err, buffer) => {
            if (err) {
                reject(err);
            } else {
                // Convert buffer to Base64 if you still want to display as an image
                const base64Image = buffer.toString('base64');
                resolve({ barcode: numericBarcode, image: `data:image/png;base64,${base64Image}` }); // Return both the numeric barcode and image
            }
        });
    });
};

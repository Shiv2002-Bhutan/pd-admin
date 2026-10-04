
import fs from 'fs';
import PDFDocument from 'pdfkit';

const COLORS = {
    border: '#E5E7EB',       // Lighter, cleaner border
    header: '#F3F4F6',       // Distinct header background
    alternate: '#FAFAFA',    // Very subtle alternating row color
    text: '#374151',         // Softer black for better readability
    muted: '#6B7280',
    total: '#F9FAFB'
};

const COLUMNS = [
    {
        label: 'Sl No',
        key: 'slNo',
        width: 45,
        align: 'center'
    },
    {
        label: 'Date',
        key: 'date',
        width: 75,
        align: 'left'
    },
    {
        label: 'Sale #',
        key: 'saleId',
        width: 65,
        align: 'left'
    },
    {
        label: 'Product',
        key: 'name',
        width: 255,          // Adjusted to make room for Sl No
        align: 'left'
    },
    {
        label: 'Qty',
        key: 'qty',
        width: 50,
        align: 'center'      // Centered for better aesthetics
    },
    {
        label: 'Price',
        key: 'price',
        width: 120,
        align: 'right'
    },
    {
        label: 'Subtotal',
        key: 'subtotal',
        width: 140,
        align: 'right'
    }
];

const TABLE_WIDTH = COLUMNS.reduce((total, column) => total + column.width, 0);

const formatCurrency = (value) => {
    const number = Number(value || 0);
    return `Nu. ${number.toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })}`;
};

const getRowValues = (row, index) => [
    String(index + 1),       // Serial Number
    row.date || '',
    `#${row.saleId ?? ''}`,
    row.name || '',
    String(row.qty ?? ''),
    formatCurrency(row.price),
    formatCurrency(row.subtotal)
];

const getRowHeight = (doc, row, index) => {
    const values = getRowValues(row, index);
    const fontSize = 9;
    const lineGap = 3;
    const verticalPadding = 14; // Slightly taller rows for a cleaner look

    let maxHeight = 20;

    values.forEach((value, colIndex) => {
        const column = COLUMNS[colIndex];
        const height = doc.heightOfString(String(value), {
            width: column.width - 16,
            fontSize,
            lineGap
        });
        maxHeight = Math.max(maxHeight, height + verticalPadding);
    });

    return maxHeight;
};

const drawTableHeader = (doc, x, y) => {
    const headerHeight = 30;

    // Header Background
    doc.save()
       .fillColor(COLORS.header)
       .rect(x, y, TABLE_WIDTH, headerHeight)
       .fill()
       .restore();

    let cursorX = x;

    doc.font('Helvetica-Bold')
       .fontSize(9)
       .fillColor(COLORS.text);

    // Header Text
    COLUMNS.forEach((column) => {
        doc.text(column.label, cursorX + 8, y + 10, {
            width: column.width - 16,
            align: column.align
        });
        cursorX += column.width;
    });

    // Header Outer Border
    doc.strokeColor(COLORS.border)
       .lineWidth(1)
       .rect(x, y, TABLE_WIDTH, headerHeight)
       .stroke();

    // Header Vertical Lines
    cursorX = x;
    COLUMNS.forEach((column, index) => {
        if (index > 0) {
            doc.moveTo(cursorX, y)
               .lineTo(cursorX, y + headerHeight)
               .stroke();
        }
        cursorX += column.width;
    });

    return y + headerHeight;
};

const drawRow = (doc, x, y, row, rowIndex) => {
    const rowHeight = getRowHeight(doc, row, rowIndex);

    // Alternating Row Background
    if (rowIndex % 2 === 1) {
        doc.save()
           .fillColor(COLORS.alternate)
           .rect(x, y, TABLE_WIDTH, rowHeight)
           .fill()
           .restore();
    }

    const values = getRowValues(row, rowIndex);
    let cursorX = x;

    doc.font('Helvetica')
       .fontSize(9)
       .fillColor(COLORS.text);

    // Row Text
    values.forEach((value, index) => {
        const column = COLUMNS[index];
        doc.text(String(value), cursorX + 8, y + 8, {
            width: column.width - 16,
            align: column.align,
            lineGap: 3
        });
        cursorX += column.width;
    });

    // Outer Row Border
    doc.strokeColor(COLORS.border)
       .lineWidth(0.5)
       .rect(x, y, TABLE_WIDTH, rowHeight)
       .stroke();

    // Row Vertical Lines
    cursorX = x;
    COLUMNS.forEach((column, index) => {
        if (index > 0) {
            doc.moveTo(cursorX, y)
               .lineTo(cursorX, y + rowHeight)
               .stroke();
        }
        cursorX += column.width;
    });

    return y + rowHeight;
};

const drawTotalRow = (doc, x, y, totalAmount) => {
    const height = 32;

    doc.save()
       .fillColor(COLORS.total)
       .rect(x, y, TABLE_WIDTH, height)
       .fill()
       .restore();

    // "TOTAL" label spans across the first 6 columns now (Sl No to Price)
    const labelWidth = COLUMNS.slice(0, 6).reduce((sum, column) => sum + column.width, 0);

    doc.font('Helvetica-Bold')
       .fontSize(10) // Slightly larger font for total
       .fillColor(COLORS.text)
       .text('TOTAL', x + 8, y + 11, {
           width: labelWidth - 16,
           align: 'right'
       });

    // Total Amount (Last Column)
    doc.font('Helvetica-Bold')
       .fontSize(10)
       .fillColor(COLORS.text)
       .text(formatCurrency(totalAmount), x + labelWidth + 8, y + 11, {
           width: COLUMNS[6].width - 16,
           align: 'right'
       });

    // Total Row Borders
    doc.strokeColor(COLORS.border)
       .lineWidth(1)
       .rect(x, y, TABLE_WIDTH, height)
       .stroke();

    // Vertical Separator before final total amount
    doc.moveTo(x + labelWidth, y)
       .lineTo(x + labelWidth, y + height)
       .stroke();

    return y + height;
};

export const generateReportPdf = (
    outputPath,
    { periodLabel, rows, totalAmount }
) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            size: 'A4',
            layout: 'landscape',
            margins: { top: 45, bottom: 45, left: 45, right: 45 },
            bufferPages: true
        });

        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        // =========================
        // REPORT HEADER
        // =========================
        doc.font('Helvetica-Bold')
           .fontSize(20)
           .fillColor('#111827') // Darker title
           .text('PD Furniture Sales Report', { align: 'center' });

        doc.moveDown(0.2);

        doc.font('Helvetica')
           .fontSize(11)
           .fillColor(COLORS.muted)
           .text(periodLabel, { align: 'center' });

        doc.moveDown(2);

        // =========================
        // TABLE
        // =========================
        const startX = doc.page.margins.left;
        let y = doc.y;

        y = drawTableHeader(doc, startX, y);

        rows.forEach((row, index) => {
            const rowHeight = getRowHeight(doc, row, index);
            const bottomLimit = doc.page.height - doc.page.margins.bottom;

            // Page Break Logic
            if (y + rowHeight > bottomLimit) {
                doc.addPage();
                y = doc.page.margins.top;
                y = drawTableHeader(doc, startX, y);
            }

            y = drawRow(doc, startX, y, row, index);
        });

        // =========================
        // TOTAL
        // =========================
        const totalHeight = 32;
        const bottomLimit = doc.page.height - doc.page.margins.bottom;

        if (y + totalHeight > bottomLimit) {
            doc.addPage();
            y = doc.page.margins.top;
            y = drawTableHeader(doc, startX, y);
        }

        drawTotalRow(doc, startX, y, totalAmount);

        // Finish PDF
        doc.end();
        stream.on('finish', resolve);
        stream.on('error', reject);
    });
};

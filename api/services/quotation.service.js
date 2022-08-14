var quotationModel = require("../models/quotation.model");
var currentContext = require('../../common/currentContext');
const fs = require("fs");
const PDFDocument = require("pdfkit");
const mailer = require("./../../common/aws_mailer");
const leadService = require("./lead.service");
const organizationService = require("./organization.service");

var quotationService = {
    getAllQuotations: getAllQuotations,
    getQuotationById: getQuotationById,
    addQuotation: addQuotation,
    updateQuotation: updateQuotation,
    deleteQuotation: deleteQuotation,
    getQuotationByQuotationName: getQuotationByQuotationName,
    getQuotationsByPage: getQuotationsByPage,
    getAllQuotationsCount: getAllQuotationsCount,
    getQuotationsByPageWithSort: getQuotationsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchQuotations: searchQuotations,
    getAllQuotationsOverview: getAllQuotationsOverview,
    textSearch: textSearch
}

function addQuotation(quotationData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        quotationData.createdBy = user.email;
        quotationData.lastModifiedBy = user.email;
        getAllQuotationsCount().then((count) => {
            quotationData.quoteId = 'Q-' + (parseInt(count) + 1);
            quotationModel.create(quotationData).then(async (data) => {
                if (data.status === 'Sent') {
                    const leadInfo = await leadService.getLeadById(data.lead);
                    const fileName = './' + quotationData.name + '_' + new Date().toISOString().replace(/[:.-]/g, '_') + '.pdf';
                    createInvoice(data, fileName, leadInfo);
                    var messageBody = "Please find attached invoice.";
                    var subject = "Invoice Generated";
                    mailer.mail(leadInfo.email, subject, messageBody, undefined,null, fileName);
                }
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        }).catch((err) => {
            reject(err);
        });


    })

}

function updateQuotation(id, quotationData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        quotationData.lastModifiedBy = user.email;

        quotationModel.updateById(id, quotationData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteQuotation(id) {
    return new Promise((resolve, reject) => {
        quotationModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllQuotations() {
    return new Promise((resolve, reject) => {
        quotationModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getQuotationById(id) {
    return new Promise((resolve, reject) => {
        quotationModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getQuotationByQuotationName(quotationName, tenant) {
    return new Promise((resolve, reject) => {
        quotationModel.searchOne({ 'quotationName': quotationName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllQuotationsCount(query) {
    return new Promise((resolve, reject) => {
        quotationModel.countDocuments(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getQuotationsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        quotationModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getQuotationsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        quotationModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        quotationModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchQuotations(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        quotationModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllQuotationsOverview() {
    return new Promise((resolve, reject) => {
        var promises = [];
        promises.push(getAllQuotationsCount({ 'status': 'Sent' }));
        promises.push(getAllQuotationsCount({ 'status': 'Draft' }));

        Promise.all(promises).then((data) => {
            var result = {
                'Sent': data[0],
                'Draft': data[1],
                'Total': data[0] + data[1]
            }
            resolve(result);
        })
    }).catch((err) => {
        console.log(err);
        reject(err);
    });
}

function textSearch(text) {
    return new Promise((resolve, reject) => {
        quotationModel.getTextSearchResult(text).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

async function createInvoice(invoice, path, leadInfo) {
    try {

        let doc = new PDFDocument({ margin: 50 });
        const workspaceId = await currentContext.getCurrentContext().workspaceId;
        const currentOrg = await organizationService.getOrganizationByWorkspaceId(workspaceId);

        generateHeader(doc, currentOrg);
        generateCustomerInformation(doc, invoice, leadInfo);
        generateInvoiceTable(doc, invoice);
        generateFooter(doc);
        doc.end();
        doc.pipe(fs.createWriteStream(path));
    } catch (err) {
        console.log("Failed to create invoice");
        throw err;
    }
}

function generateHeader(doc, currentOrg) {
    doc
        //  .image("logo.png", 50, 45, { width: 50 })
        .fillColor("#444444")
        .fontSize(20)
        .text(currentOrg.organizationName, 110, 57)
        .fontSize(10)
        .text(currentOrg.organizationName, 200, 50, { align: "right" })
        // .text("123 Main Street", 200, 65, { align: "right" })
        .text(currentOrg.defaultUserEmailId, 200, 65, { align: "right" })
        // .text("New York, NY, 10025", 200, 80, { align: "right" })
        .moveDown();
}

function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            "Thank you for your business.",
            50,
            720,
            { align: "center", width: 500 }
        );
}

function generateCustomerInformation(doc, invoice, leadInfo) {

    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Invoice", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text("Invoice Number:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice._id, 150, customerInformationTop)
        .font("Helvetica")
        .text("Invoice Date:", 50, customerInformationTop + 15)
        .text(formatDate(new Date()), 150, customerInformationTop + 15)
        .text("Balance Due:", 50, customerInformationTop + 30)
        .text(
            formatCurrency(invoice.subTotal),
            150,
            customerInformationTop + 30
        )

        .font("Helvetica-Bold")
        .text(leadInfo.name, 350, customerInformationTop)
        .font("Helvetica")
        .text(leadInfo.email, 350, customerInformationTop + 15)
        .text(
            leadInfo.shippingAddress.city +
            ", " +
            leadInfo.shippingAddress.state +
            ", " +
            leadInfo.shippingAddress.pincode,
            350,
            customerInformationTop + 30
        )
        .moveDown();

    generateHr(doc, 252);
}

function generateTableRow(
    doc,
    y,
    item,
    description,
    unitCost,
    quantity,
    tax,
    lineTotal
) {
    doc
        .fontSize(10)
        .text(item, 50, y)
        .text(description, 150, y)
        .text(unitCost, 280, y, { width: 40, align: "right" })
        .text(quantity, 320, y, { width: 50, align: "right" })
        .text(tax, 370, y, { width: 50, align: "right" })
        .text(lineTotal, 0, y, { align: "right" });
}

function generateInvoiceTable(doc, invoice) {
    let i, invoiceTableTop = 330;

    doc.font("Helvetica-Bold");

    generateTableRow(
        doc,
        invoiceTableTop,
        "No.",
        "Description",
        "Rate",
        "Quantity",
        "Tax",
        "Amount"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i];
        const position = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
            doc,
            position,
            i + 1,
            item.itemDescription,
            item.itemRate,
            item.itemQuantity,
            item.itemTax,
            item.itemAmount
        );
        generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "",
        "Subtotal",
        "",
        formatCurrency(invoice.subTotal)
    );


}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function formatCurrency(cents) {
    return "$" + (cents / 100).toFixed(2);
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
}

module.exports = quotationService;


const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
require('dotenv').config({ path: './.env' });

const app = express();
app.use(cors());
app.use(express.json());

const spreadsheetId = process.env.SPREADSHEET_ID;

app.get("/getrecords", async (req, res) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });

    const yearLimit = new Date();
    yearLimit.setFullYear(yearLimit.getFullYear() - 2);

    const client = await auth.getClient();

    const googleSheets = google.sheets({version: "v4", auth: client});

    const getExpenses = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Expense!A:D"
    });

    const getIncome = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Income!A:C"
    })

    let values = [];

    for (let i = 1; i < getExpenses.data.values.length; i++) {
        let temp = {};
        const dateParts = getExpenses.data.values[i][3].split('/');
        const year = Number(dateParts[2]);
        const month = Number(dateParts[0]) - 1; //months 0 based
        const day = Number(dateParts[1]);
        if (year >= yearLimit.getFullYear()) {
            temp.flow = "expense";
            temp.amount = getExpenses.data.values[i][0];
            temp.place = getExpenses.data.values[i][1];
            temp.type = getExpenses.data.values[i][2];
            temp.date = new Date(year, month, day);
    
            values.push(temp);
        }
    };

    for(let i = 1; i < getIncome.data.values.length; i++){
        const temp = {};
        const dateParts = getIncome.data.values[i][2].split('/');
        const year = Number(dateParts[2]);
        const month = Number(dateParts[0]) - 1; //months 0 based
        const day = Number(dateParts[1]);
        if (year >= yearLimit.getFullYear()) {
            temp.flow = "income";
            temp.amount = getIncome.data.values[i][0];
            temp.place = getIncome.data.values[i][1];
            temp.date = new Date(year, month, day);

            values.push(temp);
        }
    }
    res.send(values); 
});

app.post('/updateform', async (req, res) => 
    {const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({version: "v4", auth: client});
    const rawData = JSON.parse(req.body.data);
    if (rawData.flow === 'expense') {
        const result = await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "Expense!A:D",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [
                    [rawData.amount, rawData.location, rawData.expenseType, rawData.date]
                ]
            }
        })

        if (result.status === 200) {
            res.status = 200;    
        } else {
            res.status = 424;
        }
        res.send();

    } else {
        const result = await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "Income!A:C",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [
                    [rawData.amount, rawData.location, rawData.date]
                ]
            }
        });

        if (result.status === 200) {
            res.status = 200;    
        } else {
            res.status = 424;
        }
        res.send();
    }
    
})

app.listen(1337, '192.168.0.104', (req, res) => console.log("running on 1337"));
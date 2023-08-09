import { initializeBlock, useBase, useRecords } from '@airtable/blocks/ui';
import React from 'react';

function MyBlock() {
    const base = useBase();
    const table = base.getTableByName('Team Memberships'); // Replace with your table name
    const records = useRecords(table);

    const exportToCSV = async () => {
        const csvData = [
        'Medusa,Team,Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre', //Add titles row
        ...records.map(record => {
            const values = [
                record.getCellValueAsString('Medusa'), // Replace with your field names
                record.getCellValueAsString('Team'),
            ];

            return values.join(',');
        })
    ].join('\n');

        const csvBlob = new Blob([csvData], { type: 'text/csv' });
        const csvUrl = URL.createObjectURL(csvBlob);

        const link = document.createElement('a');
        link.href = csvUrl;
        link.download = 'exported_data.csv';
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <button onClick={exportToCSV}>Export to CSV</button>
        </div>
    );
}

initializeBlock(() => <MyBlock />);


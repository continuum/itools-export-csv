import { initializeBlock, useBase, useRecords } from '@airtable/blocks/ui';
import React from 'react';

function MyBlock() {
    const base = useBase();
    const table = base.getTableByName('Team Memberships'); // Replace with your table name
    const records = useRecords(table);

    const exportToCSV = async () => {
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        const csvData = [
            'Medusa,Rol,' + months.join(','), // Add months row
            ...records.map(record => {
                const medusa = record.getCellValueAsString('Medusa'); // Replace with your field names
                const rol = record.getCellValueAsString('Charge for Pipeline (from People) (from Medusa)')
                const team = record.getCellValueAsString('Team');
                const since = record.getCellValue('MonthSince');
                const until = record.getCellValue('MonthUntil');

                const values = [medusa,rol, team];

                for (let month = 1; month <= 12; month++) {
                    if (month >= since && month <= until) {
                        values.push(team); // Put Team name for months in the range
                    } else {
                        values.push(''); // Empty for months outside the range
                    }
                }

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

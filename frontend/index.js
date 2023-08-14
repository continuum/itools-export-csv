import { initializeBlock, useBase, useRecords } from '@airtable/blocks/ui';
import React from 'react';

function MyBlock() {
    const botonStyles = {
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '16px',
        margin: '4px 2px',
        cursor: 'pointer',
        borderRadius: '4px',
    };

    const base = useBase();
    const tableTM = base.getTableByName('Team Memberships').getView('CurrentCSV'); // Replace with your table name
    const recordsTM = useRecords(tableTM);

    const tableVacations = base.getTableByName('Vacations').getView('Grid view'); // Replace with your table name
    const recordsVacations = useRecords(tableVacations);

    const exportToCSV = async () => {
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        // Create a mapping of Medusa to Team data
        const medusaTeamMap = {};
        recordsTM.forEach(record => {
            const medusa = record.getCellValueAsString('Medusa');
            const team = record.getCellValueAsString('Team');
            if (!medusaTeamMap[medusa]) {
                medusaTeamMap[medusa] = {
                    rol: record.getCellValueAsString('Charge for Pipeline (from People) (from Medusa)'),
                    team: team,
                    months: new Array(12).fill('')
                };
            }

            const since = record.getCellValue('MonthSince');
            const until = record.getCellValue('MonthUntil');

            for (let month = since; month <= until; month++) {
                medusaTeamMap[medusa].months[month - 1] = team;
            }
        });

        recordsVacations.forEach(vacation => {
            const medusa = vacation.getCellValueAsString('Medusa');
            const since = vacation.getCellValue('MonthSince');
            const until = vacation.getCellValue('MonthUntil');

            for (let month = since; month <= until; month++) {
                const teamData = medusaTeamMap[medusa];
                if (teamData) {
                    teamData.months[month - 1] = 'Vacation';
                }
            }
        });

        const csvData = [
            ['Medusa', 'Rol', ...months], // Add header row
            ...Object.entries(medusaTeamMap).map(([medusa, data]) => {
                const values = [medusa, data.rol, ...data.months];
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
            <button style={botonStyles} onClick={exportToCSV}>Export to CSV</button>
        </div>
    );
}

initializeBlock(() => <MyBlock />);

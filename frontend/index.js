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
            'EneroF1','EneroF2', 'FebreroF1','FebreroF2', 'MarzoF1','MarzoF2', 'AbrilF1','AbrilF2', 'MayoF1','MayoF2', 'JunioF1','JunioF2',
            'JulioF1','JulioF2', 'AgostoF1','AgostoF2', 'SeptiembreF1','SeptiembreF2', 'OctubreF1','OctubreF2', 'NoviembreF1','NoviembreF2', 'DiciembreF1','DiciembreF2'
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
                    months: new Array(24).fill('')
                };
            }

            const since = record.getCellValue('MonthSince');
            const until = record.getCellValue('MonthUntil');
            const daySince = record.getCellValue('daySinceTeam');
            const dayUntil = record.getCellValue('dayUntilTeam');
    
            for (let month = since; month <= until; month++) {

                //if else code
                medusaTeamMap[medusa].months[month - 1] = team;

            }
        });


        //insert vacaction en el array
        recordsVacations.forEach(vacation => {
            const medusa = vacation.getCellValueAsString('Medusa');
            const since = vacation.getCellValue('MonthSince');
            const until = vacation.getCellValue('MonthUntil');        
            const daySince = vacation.getCellValue('daySinceVacations');
            const dayUntil = vacation.getCellValue('dayUntilVacations');
    

            for (let month = since; month <= until; month++) {
                const teamData = medusaTeamMap[medusa];
                if (teamData) {

                    //if else code
                    teamData.months[month - 1] = 'Vacation';
                }
            }
        });


        //Export a csv
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

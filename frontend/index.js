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
    const table = base.getTableByName('Team Memberships').getView("CurrentCSV"); // Replace with your table name
    const records = useRecords(table);

    const exportToCSV = async () => {
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
    
        // Agrupar los registros por el valor de "Medusa"
        const groupRecords = {};
        records.forEach(record => {
            const medusa = record.getCellValueAsString('Medusa');
            if (!groupRecords[medusa]) {
                groupRecords[medusa] = [];
            }
            groupRecords[medusa].push(record);
        });
    
        const csvData = [
            'Medusa,Rol,' + months.join(','), // Add months row
            ...Object.entries(groupRecords).map(([medusa, records]) => {
                const rol = records[0].getCellValueAsString('Charge for Pipeline (from People) (from Medusa)');
                let values = [medusa, rol];   
                for (let month = 1; month <= 12; month++) {
                    const data = records.find(record => {
                        const since = record.getCellValue('MonthSince');
                        const until = record.getCellValue('MonthUntil');
                        const daySince = record.getCellValueAsString('daySinceTeam');
                        const datUntil = record.getCellValueAsString('dayUntilTeam');
                        return month >= since && month <= until;
                    });  
                    if (data) {  
                        
                        
                        const team = data.getCellValueAsString('Team');
                        values.push(team);
                    } else {
                        values.push('');
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
            <button style={botonStyles} onClick={exportToCSV}>Export to CSV</button>
        </div>
    );
}

initializeBlock(() => <MyBlock />);

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
    const table = base.getTableByName('Team Memberships').getView("CurrentCSV");
    const tableVacations = base.getTableByName('Vacations').getView('CurrentCSV');

    const records = useRecords(table);
    const recordsVacation = useRecords(tableVacations);

    const exportToCSV = async () => {
        const months = [
            'EneroF1', 'EneroF2', 'FebreroF1', 'FebreroF2', 'MarzoF1', 'MarzoF2', 'AbrilF1', 'AbrilF2', 'MayoF1', 'MayoF2', 'JunioF1', 'JunioF2',
            'JulioF1', 'JulioF2', 'AgostoF1', 'AgostoF2', 'SeptiembreF1', 'SeptiembreF2', 'OctubreF1', 'OctubreF2', 'NoviembreF1', 'NoviembreF2', 'DiciembreF1', 'DiciembreF2'
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
                
                const groupRecordsVacations = {};
                recordsVacation.forEach(record => {
                    const medusa = record.getCellValueAsString('Medusa');
                    if (!groupRecordsVacations[medusa]) {
                        groupRecordsVacations[medusa] = [];
                    }
                    groupRecordsVacations[medusa].push(record);
                });
 

        const csvData = [
            'Medusa,Rol,' + months.join(','),
            ...Object.entries(groupRecords).map(([medusa, records]) => {
                const rol = records[0].getCellValueAsString('Charge for Pipeline (from People) (from Medusa)');
                let values = [medusa, rol];
                let monthaux = 1;
                for (let month = 1; month <= 24; month++) {
                    let monthIndex = Math.floor((month + 1) / 2);
                    let isF2 = monthaux % 2 === 0; //1 es F1 0 es F2    
                    let medusaCompare;    
                    const monthData = records.find(record => {
                        const since = record.getCellValue('MonthSince');
                        const until = record.getCellValue('MonthUntil');
                        const daySince = record.getCellValue('daySinceTeam');
                        const dayUntil = record.getCellValue('dayUntilTeam');
                        const medusa = record.getCellValueAsString('Medusa');
                        medusaCompare=medusa;
                        if (monthIndex >= since && monthIndex <= until) {
                            if (monthIndex === until && dayUntil < 15 && monthaux != 1) {
                                if (isF2 == true) {
                                    return false;
                                }
                            }
                            if (monthIndex === since && daySince > 15 && monthaux == 1) {

                                if (isF2 == false) {
                                    return false;
                                } else {
                                    if (isF2 == true) {
                                        return true;
                                    }
                                }
                            }
                            else {
                                if (monthIndex === since && daySince > 15 && monthaux != 1) {
                                    return true;
                                }
                            }
                            if (monthIndex == null) {
                                return false;
                            }
                            return true;
                        }
                        return false;
                    });
                   
                  
                
                    const vacationData = recordsVacation.find(vacationRecord => {
                        const medusa = vacationRecord.getCellValueAsString('Medusa');
                        const since = vacationRecord.getCellValue('MonthSince');
                        const until = vacationRecord.getCellValue('MonthUntil');
                        const daySince = vacationRecord.getCellValue('daySinceVacations');
                        const dayUntil = vacationRecord.getCellValue('dayUntilVacations');
                        const dayDiference = vacationRecord.getCellValue('dayDiference');
                        if (monthIndex >= since && monthIndex <= until && medusa ==medusaCompare && dayDiference>=5){
                            if (monthIndex === until && dayUntil < 15 && monthaux != 1) {
                                if (isF2 == true) {
                                    return false;
                                }
                            }
                            if (monthIndex === since && daySince > 15 && monthaux == 1) {

                                if (isF2 == false) {
                                    return false;
                                } else {
                                    if (isF2 == true) {
                                        return true;
                                    }
                                }
                            }
                            else {
                                if (monthIndex === since && daySince > 15 && monthaux != 1) {
                                    return true;
                                }
                            }
                            if (monthIndex == null) {
                                return false;
                            }
                            return true;                            
                        }
                    });
                    if(vacationData)
                    {
                        const vaca= vacationData.getCellValueAsString('Medusa')
                        values.push('Vacaciones');
                    }else{

                    if (monthData) {

                        const team = monthData.getCellValueAsString('Team');
                      
                        values.push(team);
                    } else {
                        values.push('');
                    }

                    monthaux++;
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

import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import styles from './QuarterSelect.module.css'

const START_YEAR = 2024;
const START_QUATER = 1;

const QuarterSelect = ({ value, onChange, disabled }) => {
    const [quarters, setQuarters] = useState(generateQuarters());

    useEffect(() => {
        setQuarters(generateQuarters());
    }, []);

    function getCurrentQuarter() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        return Math.ceil(currentMonth / 3);
    }

    function generateQuarters() {
        const currentYear = new Date().getFullYear();
        const generatedQuarters = [];
        const startYear = START_YEAR;
        const endYear = currentYear;
        const currentQuarter = getCurrentQuarter()

        for (let year = startYear; year <= endYear; year++) {
            const startQuarter = year === startYear ? START_QUATER : 1;
            const endQuarter = year === endYear ? currentQuarter : 4;

            for (let quarter = startQuarter; quarter <= endQuarter; quarter++) {
                generatedQuarters.push({
                    value: `${quarter}-${year}`,
                    label: `Quý ${quarter} - ${year}`
                });
            }
        }

        return generatedQuarters;
    }
    return (
        <Select
            placeholder="Quý"
            className={styles.input}
            value={value}
            onChange={onChange}
            options={quarters}
            disabled={disabled}
        />
    );
};

export default QuarterSelect;

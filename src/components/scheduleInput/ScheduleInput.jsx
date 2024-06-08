import React from 'react'
import styles from './ScheduleInput.module.css'
import { Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { formatSlot } from '../../utils/utils';
import { compareAsc } from 'date-fns';
export const ScheduleInput = ({ index, schedule, onDateChange, onSlotChange, onDelete, slots, disabled, schedules }) => {
  const { dateOfWeek, slotId } = schedule;
  const dateOptions =
    [
      {
        value: 'monday',
        label: 'Thứ 2',
      },
      {
        value: 'tuesday',
        label: 'Thứ 3',
      },
      {
        value: 'wednesday',
        label: 'Thứ 4',
      },
      {
        value: 'thursday',
        label: 'Thứ 5',
      },
      {
        value: 'friday',
        label: 'Thứ 6',
      },
      {
        value: 'saturday',
        label: 'Thứ 7',
      },
      {
        value: 'sunday',
        label: 'Chủ nhật'
      }
    ]
  let filteredOptions = dateOptions
  if (schedules) {
    filteredOptions = dateOptions.map(option => ({
      ...option,
      disabled: schedules.some(schedule => schedule.dateOfWeek === option.value)
    }));
  }
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
      <Select
        disabled={disabled}
        className={styles.input}
        placeholder={`Lịch học ${index + 1}`}
        value={dateOfWeek}
        onChange={(value) => onDateChange(index, value)}
        options={filteredOptions}
      />
      <Select
        disabled={disabled}
        className={styles.input}
        value={slotId}
        placeholder="Giờ học"
        onChange={(value) => onSlotChange(index, value)}
        options={
          slots.sort((a, b) => {
            const timeA = formatSlot(a.startTime);
            const timeB = formatSlot(b.startTime);
            return compareAsc(timeA, timeB);
          }).map((slot) => ({
            value: slot.id,
            label: `${slot.startTime} - ${slot.endTime}`
          }))
        }
      />
      {index !== 0 ? (
        <DeleteOutlined disabled={disabled} style={{ fontSize: '1rem' }} onClick={() => onDelete(index)} />
      ) : (<DeleteOutlined disabled={disabled} style={{ fontSize: '1rem', color: '#e6e6e6' }} />)}
    </div>
  );
};
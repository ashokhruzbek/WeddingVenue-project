// src/components/common/Calendar.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { format, addMonths, subMonths, isSameDay } from 'date-fns';

const Calendar = ({ bookedDates, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  };

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const isBooked = (date) => bookedDates.some((booked) => isSameDay(new Date(booked), date));
  const isPast = (date) => date < new Date() && !isSameDay(date, new Date());

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between mb-4">
        <button onClick={prevMonth} className="text-blue-500">⬅️</button>
        <h2 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <button onClick={nextMonth} className="text-blue-500">➡️</button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'].map((day) => (
          <div key={day} className="font-semibold">{day}</div>
        ))}
        {daysInMonth(currentMonth).map((date) => (
          <button
            key={date}
            onClick={() => !isBooked(date) && !isPast(date) && onDateSelect(date)}
            disabled={isBooked(date) || isPast(date)}
            className={`p-2 rounded-full ${
              isBooked(date)
                ? 'bg-red-200 cursor-not-allowed'
                : isPast(date)
                ? 'bg-gray-200 cursor-not-allowed'
                : 'bg-green-100 hover:bg-green-200'
            }`}
          >
            {date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
};

Calendar.propTypes = {
  bookedDates: PropTypes.arrayOf(PropTypes.string).isRequired,
  onDateSelect: PropTypes.func.isRequired,
};

export default Calendar;
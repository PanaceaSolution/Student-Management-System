import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const EventCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const exampleEvents = [
      {
        id: 0,
        title: "Meeting with parents",
        start: new Date(2024, 10, 25, 10, 0),
        end: new Date(2024, 10, 25, 12, 0),
      },
      {
        id: 1,
        title: "School play rehearsal",
        start: new Date(2024, 10, 26, 14, 0),
        end: new Date(2024, 10, 26, 16, 0),
      },
      {
        id: 2,
        title: "Exam Day",
        start: new Date(2024, 10, 30, 9, 0),
        end: new Date(2024, 10, 30, 11, 0),
      },
    ];

    setEvents(exampleEvents);
  }, []);

  // Function to style the day cells
  const dayPropGetter = (date) => {
    const today = moment().startOf("day"); 
    const isToday = moment(date).isSame(today, "day"); 
    const isSaturday = moment(date).day() === 6;

    const backgroundColor = isToday
      ? "bg-green-200"
      : isSaturday
      ? "bg-red-200"
      : "";
    const textColor = isToday
      ? "text-green-800"
      : isSaturday
      ? "text-red-800"
      : "text-gray-800";

    return {
      className: `${backgroundColor} ${textColor}`,
    };
  };

  // Function to style the events
  const eventPropGetter = (event) => {
    return {
      className: "cursor-pointer", // Change cursor to pointer
      title: event.title, // Set the title as the tooltip
    };
  };

  return (
    <div className="bg-gray-100 p-1 rounded-sm shadow-md z-10">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 400 }}
        dayPropGetter={dayPropGetter}
        eventPropGetter={eventPropGetter}
        className="bg-white rounded-lg inset-0"
        popup
      />
    </div>
  );
};

export default EventCalendar;

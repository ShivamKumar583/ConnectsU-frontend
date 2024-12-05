import React from 'react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { MdScheduleSend } from "react-icons/md";


const ScheduleMessageModal = ({me,onClose,scheduleDate,handleScheduleMessage,handleDateChange}) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark_bg_2 p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4 text-slate-300">
            Schedule a Message
        </h2>
        <form onSubmit={handleScheduleMessage} className="space-y-3 text-sm text-slate-300 ">
            <div>
                <label className=' text-sm'>Select Date and Time:<sup className=' text-red-500'>*</sup></label>
                <DatePicker
                    selected={scheduleDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd hh:mm aa"  // Format date to include time
                    minDate={new Date()}
                    required
                    mobile
                    className=' mt-[4%] bg-slate-300 rounded-md text-slate-700 text-center '
                    showPopperArrow={false}
                    showTimeInput={true} 
                />
                
            </div>

            <button className='mt-4 px-4 py-2 bg-gray-300 dark:bg-dark_bg_3 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-green-600 focus:outline-none flex items-center gap-x-2' type='submit'>Schedule Message
              <MdScheduleSend/>
            </button>

        </form>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-300 dark:bg-dark_bg_3 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-red-600 focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default ScheduleMessageModal
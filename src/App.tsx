import { useState, useEffect } from 'react';
import { GitHubCommit } from './GitHubTypes';
import './App.css'
import arrowL from './assets/arrowL.svg'
import arrowR from './assets/arrowR.svg'

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function App() {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [commits, setCommits] = useState<GitHubCommit[]>();
  const [date, setDate] = useState<Date>(new Date());
  const [calendarRows, setCalendarRows] = useState(generateCalendar());
  const [selectedCommit, setSelectedCommit] = useState<GitHubCommit>();
  const [selectMessage] = useState<String>('Please select a commit from the calendar.')

  useEffect(() => {
    const url = 'https://api.github.com/repos/dingo/api/commits?per_page=100';
    async function fetchData() {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(data);
        setCommits(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
    updateDateTitle();
  }, []);

  useEffect(() => {
    function initCalendar() {
      if (commits) {
        setCalendarRows(generateCalendar());
      }
    }
    initCalendar();
  }, [commits]);

  function updateDateTitle() {
    setMonth(monthNames[date.getMonth()]);
    setYear(date.getFullYear().toString());
    setCalendarRows(generateCalendar());
  }

  function generateCalendar() {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
    const daysInMonth = lastDayOfMonth.getDate();
    const startDay = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
  
    const rows = [];
    let day = 1;
    let keyCounter = 0; // Initialize a key counter for unique keys
  
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startDay) {
          // Add empty cells for days before the start of the month
          week.push(<td className='dayNameEmpty' key={keyCounter++}></td>);
        } else if (day <= daysInMonth) {
          // Add cells for days in the current month
          const cellDate = new Date(date.getFullYear(), date.getMonth(), day);
          // Ensure commits is an array before filtering
          const commitsArray = Array.isArray(commits) ? commits : [];
          const commitsForDate = commitsArray.filter((commit) => {
            const commitDate = new Date(commit.commit.author.date);
            return (
              commitDate.getDate() === cellDate.getDate() &&
              commitDate.getMonth() === cellDate.getMonth() &&
              commitDate.getFullYear() === cellDate.getFullYear()
            );
          });
          week.push(
            <td className='dayName' key={keyCounter++}>
              <div className='dayNumber'>{day}</div>
              <div className='cellContent'>
                <ul className="commits">
                  {commitsForDate.slice(0, 2).map((commit) => (
                    <li onClick={() => fillDetails(commit)} className='commit' key={commit.sha}>
                        Commit from {commit.commit.author.name}
                    </li>
                  ))}
                </ul>
              </div>
            </td>
          );
          day++;
        } else if (day > daysInMonth) {
          if (j === 0 && i === 5) {
            day++;
          }
          // Add empty cells for days after the end of the month
          week.push(<td className='dayNameEmpty' key={keyCounter++}></td>);
        }
      }
      if (day !== (daysInMonth + 2)) {
        rows.push(<tr className='dayNames' key={i}>{week}</tr>);
      }
    }
    return rows;
  }

  function monthNavigation(value: boolean) {
    let tempDate = date;
    if(value) {
      tempDate.setMonth(date.getMonth() - 1);
      setDate(tempDate);
      updateDateTitle();
    } else {
      tempDate.setMonth(date.getMonth() + 1);
      setDate(tempDate);
      updateDateTitle();
    }
  }

  function fillDetails(scommit: GitHubCommit) {
    setSelectedCommit(scommit);
  }

  function gotoLatest() {
    commits && setDate(new Date(commits[0]?.commit.committer.date));
    updateDateTitle();
  }

  return (
    <>
      <div className='url'>Commit calendar for <a target="_blank" href="https://github.com/dingo/api">dingo/api</a>.</div>
      <div className='details'>
          {selectMessage}
          <div className='detail'> Author: {selectedCommit?.commit.author.email} </div>
          <div className='detail'> Commit message: {selectedCommit?.commit.message} </div>
          <div className='detail'> URL: <a target="_blank" href={`${selectedCommit?.commit.url}`}> {selectedCommit?.commit.url} </a></div>
          <div className="detail"> Can't find a commit? <button onClick={() => {gotoLatest()}} className='goto'>Double click</button>for latest commit</div>
      </div>
      <div className='container'>
        <div className='topBar'>
          <div className='monthTitle'> {month} {year} </div>
          <div className='monthButtons'>
            <button className='button' onClick={() => {monthNavigation(true)}}> <img src={arrowL} className="arrow"/> </button>
            <button className='button' onClick={() => {monthNavigation(false)}}> <img src={arrowR} className='arrow'/> </button>
          </div>
        </div>
        <table className='calendarTable'>
          <thead>
            <tr className='dayNames'>
              <td className='dayNameTitle'>Sun</td>
              <td className='dayNameTitle'>Mon</td>
              <td className='dayNameTitle'>Tue</td>
              <td className='dayNameTitle'>Wed</td>
              <td className='dayNameTitle'>Thu</td>
              <td className='dayNameTitle'>Fri</td>
              <td className='dayNameTitle'>Sat</td>
            </tr>
          </thead>
          <tbody>{calendarRows}</tbody>
        </table>
      </div>
    </>
  )
}

export default App
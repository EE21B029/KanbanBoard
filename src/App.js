

import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Dots from './icons_FEtask/3 dot menu.svg';
import add from './icons_FEtask/add.svg';
import backlog from './icons_FEtask/Backlog.svg';
import cancelled from './icons_FEtask/Cancelled.svg';
import display from './icons_FEtask/Display.svg';
import done from './icons_FEtask/Done.svg';
import down from './icons_FEtask/down.svg';
import hpriority from './icons_FEtask/Img - High Priority.svg';
import lpriority from './icons_FEtask/Img - Low Priority.svg';
import medium from './icons_FEtask/Img - Medium Priority.svg';
import progress from './icons_FEtask/in-progress.svg';
import nopriority from './icons_FEtask/No-priority.svg';
import Urgent from './icons_FEtask/SVG - Urgent Priority colour.svg';
import todo from './icons_FEtask/To-do.svg';

// Utility function to get the correct status icon
const getStatusIcon = (status) => {
    switch (status) {
        case 'Backlog': return backlog;
        case 'To Do': return todo;
        case 'In Progress': return progress;
        case 'Done': return done;
        case 'Cancelled': return cancelled;
        default: return null;
    }
};

// Utility function to get the correct priority icon
const getPriorityIcon = (priority) => {
    switch (priority) {
        case 0: return nopriority;
        case 1: return lpriority;
        case 2: return medium;
        case 3: return hpriority;
        case 4: return Urgent;
        default: return nopriority;
    }
};

// Ticket Card Component

const TicketCard = ({ ticket }) => {
    //const statusIcon = getStatusIcon(ticket.status); 
    //const priorityIcon = getPriorityIcon(ticket.priority);

    return (
        <div className="ticket-card">
            <div className="ticket-header">
                <p>{`${ticket.id}`}</p>
            </div>
            <h3>{ticket.title}</h3>
            <div className="ticket-footer">
                <img src={Dots} alt="Menu" className="ticket-options-icon" />
                <div className="feature-request">
                    <span className="feature-symbol"></span>
                    <p>Feature Request</p>
                </div>
                
            </div>
        </div>
    );
    };


    const KanbanBoard = ({ tickets, grouping, sorting }) => {
    const groupTickets = (tickets) => {
        switch (grouping) {
            case 'status':
                return {
                    'Backlog': tickets.filter(ticket => ticket.status === 'Backlog'),
                    'To Do': tickets.filter(ticket => ticket.status === 'Todo'),
                    'In Progress': tickets.filter(ticket => ticket.status === 'In progress'),
                    'Done': tickets.filter(ticket => ticket.status === 'Done'),
                    'Cancelled': tickets.filter(ticket => ticket.status === 'Cancelled'),
                };
            case 'priority':
                return {
                    'No Priority': tickets.filter(ticket => ticket.priority === 0),
                    'Urgent': tickets.filter(ticket => ticket.priority === 4),
                    'High': tickets.filter(ticket => ticket.priority === 3),
                    'Medium': tickets.filter(ticket => ticket.priority === 2),
                    'Low': tickets.filter(ticket => ticket.priority === 1)
                    
                    
                    
                };
            case 'user':
                return tickets.reduce((acc, ticket) => {
                    const userName = ticket.userName || "Unknown";
                    if (!acc[userName]) {
                        acc[userName] = [];
                    }
                    acc[userName].push(ticket);
                    return acc;
                }, {});
            default:
                return {};
        }
    };

    const sortTickets = (tickets) => {
        switch (sorting) {
            case 'priority':
                return tickets.sort((a, b) => b.priority - a.priority); // High to Low priority
            case 'title':
                return tickets.sort((a, b) => (a.title || '').localeCompare(b.title || '')); // A to Z
            default:
                return tickets;
        }
    };

    // Function to get appropriate icon based on grouping (status or priority)
    const getIcon = (group) => {
        if (grouping === 'status') {
            return getStatusIcon(group);
        } else if (grouping === 'priority') {
            const priorityMapping = {
                'No Priority': 0,
                'Low': 1,
                'Medium': 2,
                'High': 3,
                'Urgent': 4,
            };
            return getPriorityIcon(priorityMapping[group]);
        }
        return null;
    };

    const groupedTickets = groupTickets(tickets);
    const sortedTickets = {};
    Object.keys(groupedTickets).forEach((key) => {
        sortedTickets[key] = sortTickets(groupedTickets[key]);
    });

    return (
        <div className="kanban-board">
            {Object.keys(sortedTickets).map((group) => (
                <div key={group} className="kanban-column">
                    <div className="column-header">
                        {grouping === 'user' ? (
                            <h2>{group}<span style={{ marginLeft: '10px', fontSize: '0.9em', color: '#999' }}>
                            {sortedTickets[group].length}
                        </span></h2> // Display user name and count
                        ) : (
                            <>
                                <div className="ticket-status-priority">
                                    <img src={getIcon(group)} alt={`${group}`} className="status-icon" />
                                </div>
                                <h2>
                                    <span>{group}</span>
                                    <span style={{ marginLeft: '10px', fontSize: '0.9em', color: '#999' }}>
                                        {sortedTickets[group].length}
                                    </span>
                                    </h2> 
                            </>
                        )}
                        <img src={add} alt="Add Ticket" className="add-icon" style={{marginLeft:'100px'}}/>
                        <img src={Dots} alt="Menu" className="ticket-options-icon" />
                    </div>
                    {sortedTickets[group].length > 0 ? (
                        sortedTickets[group].map(ticket => (
                            <TicketCard key={ticket.id} ticket={ticket} />
                        ))
                    ) : (
                        <p>No tickets</p>
                    )}
                </div>
            ))}
        </div>
    );
    };


    

// Main App Component
const App = () => {
    const [tickets, setTickets] = useState([]);
    const [grouping, setGrouping] = useState('status');
    const [sorting, setSorting] = useState('priority');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const dropdownRef = useRef();

    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false); 
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                // Map userId to userName
                const userMap = {};
                data.users.forEach(user => {
                    userMap[user.id] = user.name;
                });

                // Add userName to each ticket based on userId
                const ticketsWithUserNames = data.tickets.map(ticket => ({
                    ...ticket,
                    userName: userMap[ticket.userId] || 'Unknown', 
                }));
                setTickets(ticketsWithUserNames);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="app">
            <div className="dropdown-container">
                <button
                    onClick={() => setDropdownOpen(!isDropdownOpen)} // Toggle dropdown
                    className="display-button"
                >
                    <img src={display} alt="Display Icon" />
                    Display 
                    <img src={down} alt="Down Icon" />
                </button>

                {isDropdownOpen && (
                    <div ref={dropdownRef} className="dropdown">
                        <div className="dropdown-group">
                            <label>Grouping</label>
                            <select value={grouping} onChange={e => setGrouping(e.target.value)}>
                                <option value="status">Status</option>
                                <option value="user">User</option>
                                <option value="priority">Priority</option>
                            </select>
                        </div>
                        <div className="dropdown-group">
                            <label>Ordering</label>
                            <select value={sorting} onChange={e => setSorting(e.target.value)}>
                                <option value="priority">Priority</option>
                                <option value="title">Title</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            <KanbanBoard tickets={tickets} grouping={grouping} sorting={sorting} />
        </div>
    );
};

export default App;



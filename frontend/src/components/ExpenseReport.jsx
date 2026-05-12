import  { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ExpenseReport = () => {

   const navigate = useNavigate();
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);

    const userId = localStorage.getItem('userId');

    useEffect(()=>{
        if(!userId) {
            navigate('/login');
        }
    },[]);


    const handleSubmit  = async(e)=>{
          e.preventDefault();
          try {
             const response = await fetch(`http://127.0.0.1:8000/api/search_expense/${userId}/?from=${fromDate}&to=${toDate}`);

             const data = await response.json();
             setExpenses(data.expenses);
             setGrandTotal(data.total);
          

         }catch (error) {
         console.error('Error fetching expenses:', error);
         toast.error(error.message || 'Something went wrong');
     }
    };

  return (
     <div className='container mt-5'>
        <div className='text-center mb-4'>
            <h2><i className='fas fa-file-invoice-dollar  me-2'></i>Datewise Expense Report</h2>
            <p className='text-muted'>Search and analyze your expenses between two dates</p>
        </div>

        <form className='row g-3' onSubmit={handleSubmit}>
            <div className='col-md-4'>
                
                 <div className='input-group'>
                     <span className='input-group-text'>
                        <i className='fas fa-calendar-alt'></i>
                     </span>
                     <input type='date' name='fromdate' value={fromDate}className='form-control' onChange={(e)=>setFromDate(e.target.value)}required />
                 </div>
            </div>

            <div className='col-md-4'>
                
                 <div className='input-group'>
                     <span className='input-group-text'>
                        <i className='fas fa-calendar-alt'></i>
                     </span>
                     <input type='date' name='todate' value={toDate}className='form-control' onChange={(e)=>setToDate(e.target.value)}required />
                 </div>
            </div>

          <div className='col-md-4'>
                <button type='submit' className='btn btn-primary w-100 '><i className='fas fa-search me-2'></i >Search</button>
          </div>

            <div>
            <table className='table table-striped table-bordered'>
                <thead className='table-dark text-center'>
                     <tr>
                         <th>#</th>
                         <th>Date</th>
                         <th>Item</th>
                         <th>Cost (₹)</th>
                     </tr>
                </thead>
                <tbody>
                    {expenses.length > 0 ? (
                        expenses.map((exp,index)=>( <tr key={exp.id}>
                         <td>{index + 1}</td>
                         <td>{exp.ExpenseDate}</td>
                         <td>{exp.ExpenseItem}</td>
                         <td>{exp.ExpenseCost}</td>
                
                     </tr>
                     ))
                      
                    ) : (
                        <tr>
                         <td colSpan="5" className='text-center text-muted'> 
                          <i className='fas fa-exclamation-circle me-2'></i>No Expenses Found</td>
                     </tr>
                    )}      
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="3" className='text-end fw-bold'>GrandTotal:</td>
                        <td className='fw-bold text-success'>₹ {grandTotal}</td>
                    </tr>
                </tfoot>
            </table>
            </div>

        </form>
        <ToastContainer />
    </div>
  )
}

export default ExpenseReport